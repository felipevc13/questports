// questports-apk-proxy — Cloudflare Worker replacement for server/api/apk-proxy.get.ts
// GET/HEAD/OPTIONS  /?url=<https url>[&redirect=1]   (also served on /api/apk-proxy)
// Streams GitHub release assets with CORS so the browser WebUSB installer can read them.

const APK_PROXY_ALLOWED_HOSTS = [
  'github.com',
  'github-production-release-asset-2e65be.s3.amazonaws.com',
  'release-assets.githubusercontent.com',
  'objects.githubusercontent.com',
  'sidequestvr.com',
  'goldeneyevr.com',
  'lambda1vr.com',
  'doom3quest.com',
  'questzdoom.com',
  'ut99vr.pages.dev'
]

const HOMEPAGE_TO_GITHUB_RELEASE = {
  'doom3quest.com': 'https://github.com/Team-Beef-Studios/Doom3Quest/releases/latest',
  'lambda1vr.com': 'https://github.com/Team-Beef-Studios/Lambda1VR/releases/latest',
  'questzdoom.com': 'https://github.com/Team-Beef-Studios/QuestZDoom/releases/latest'
}

const UPSTREAM_HEADERS = {
  'User-Agent': 'QuestPorts/1.0',
  Accept: 'application/octet-stream,application/zip,application/vnd.android.package-archive,*/*'
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Range, Content-Type',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Type, Content-Range, Accept-Ranges, X-QuestPorts-Unwrap, X-QuestPorts-Resolve, Content-Disposition',
  'Access-Control-Max-Age': '86400'
}

function isAllowedApkProxyHost(hostname) {
  return APK_PROXY_ALLOWED_HOSTS.some(host => hostname === host || hostname.endsWith(`.${host}`))
}
function isLikelyApkPath(path) {
  return path.toLowerCase().split('?')[0].endsWith('.apk')
}
function isLikelyZipPath(path) {
  return path.toLowerCase().split('?')[0].endsWith('.zip')
}

function scoreQuestBuildName(name) {
  const n = name.toLowerCase()
  let score = 0
  if (n.includes('quest')) score += 4
  if (n.includes('openxr')) score += 3
  if (n.includes('vr')) score += 2
  if (n.includes('launcher')) score -= 3
  if (n.includes('android') && !n.includes('quest') && !n.includes('vr')) score -= 6
  if (n.includes('pico') && !n.includes('quest')) score -= 6
  if (n.includes('windows') && !n.includes('quest')) score -= 5
  if (n.includes('pcvr') && !n.includes('quest')) score -= 2
  return score
}

function rewriteKnownHomepageToGithubRelease(url) {
  try {
    const parsed = new URL(url)
    if (parsed.pathname !== '/' && parsed.pathname !== '') return url
    const host = parsed.hostname.replace(/^www\./, '')
    return HOMEPAGE_TO_GITHUB_RELEASE[host] || url
  } catch {
    return url
  }
}

function pickPreferredReleaseDownload(assets) {
  const sortByScore = list => [...list].sort((a, b) => scoreQuestBuildName(b.name) - scoreQuestBuildName(a.name))[0] || null
  const apks = assets.filter(a => a.name?.toLowerCase().endsWith('.apk'))
  if (apks.length > 0) return sortByScore(apks)
  const zips = assets.filter(a => a.name?.toLowerCase().endsWith('.zip'))
  if (zips.length === 0) return null
  return sortByScore(zips)
}

// Per-isolate cache of release lookups. Hits live 10 min. A confirmed "no apk/zip"
// lives 2 min. API/network errors are never cached.
const releaseCache = new Map()
const RELEASE_TTL_MS = 10 * 60 * 1000
const NEGATIVE_TTL_MS = 2 * 60 * 1000
const MAX_RELEASES = 10
const MAX_HTML_RELEASES = 5

const GH_HTML_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; QuestPorts/1.0; +https://questports.vercel.app)',
  Accept: 'text/html,application/xhtml+xml'
}

// Same walk as the Vercel proxy: first release whose preferred asset is an .apk wins,
// otherwise the first preferred .zip seen.
function pickFromReleases(releases) {
  let zipFallback = null
  for (const assets of releases) {
    const picked = pickPreferredReleaseDownload(assets)
    if (!picked) continue
    if (isLikelyApkPath(picked.name)) return picked.browser_download_url
    if (!zipFallback && isLikelyZipPath(picked.name)) zipFallback = picked.browser_download_url
  }
  return zipFallback
}

async function viaApi(owner, repo, env) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=${MAX_RELEASES}`, {
    headers: {
      'User-Agent': 'QuestPorts/1.0 (+https://questports.vercel.app)',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {})
    }
  })
  if (!res.ok) {
    res.body?.cancel()
    return { ok: false, status: res.status }
  }
  const releases = await res.json()
  const lists = (Array.isArray(releases) ? releases : [])
    .filter(r => !r.draft)
    .map(r => (r.assets || []).map(a => ({ name: a.name, browser_download_url: a.browser_download_url })))
  return { ok: true, status: 200, url: pickFromReleases(lists) }
}

function htmlDecode(s) {
  return s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
}

async function htmlTags(owner, repo) {
  const tags = []
  // Releases list page, newest first (same order as the API list).
  const res = await fetch(`https://github.com/${owner}/${repo}/releases`, { headers: GH_HTML_HEADERS })
  if (res.ok) {
    const html = await res.text()
    const re = /\/releases\/expanded_assets\/([^"'?#\s]+)/g
    let m
    while ((m = re.exec(html)) && tags.length < MAX_HTML_RELEASES) {
      const tag = htmlDecode(m[1])
      if (!tags.includes(tag)) tags.push(tag)
    }
  } else {
    res.body?.cancel()
  }
  if (tags.length === 0) {
    // Fall back to /releases/latest -> 302 /releases/tag/<tag>
    const latest = await fetch(`https://github.com/${owner}/${repo}/releases/latest`, { headers: GH_HTML_HEADERS, redirect: 'manual' })
    latest.body?.cancel()
    const loc = latest.headers.get('location') || ''
    const m = loc.match(/\/releases\/tag\/([^?#]+)/)
    if (m) tags.push(m[1])
    // Releases page loaded but lists nothing: the repo really has no releases.
    if (tags.length === 0) return res.ok ? { ok: true, status: 200, tags } : { ok: false, status: res.status, tags }
  }
  return { ok: true, status: 200, tags }
}

async function htmlAssets(owner, repo, tag) {
  const res = await fetch(`https://github.com/${owner}/${repo}/releases/expanded_assets/${tag}`, { headers: GH_HTML_HEADERS })
  if (!res.ok) {
    res.body?.cancel()
    return { ok: false, status: res.status, assets: [] }
  }
  const html = await res.text()
  const assets = []
  const re = /href="([^"]*\/releases\/download\/[^"]+)"/g
  let m
  while ((m = re.exec(html))) {
    const href = htmlDecode(m[1])
    const abs = new URL(href, 'https://github.com').toString()
    const name = decodeURIComponent(abs.split('/').pop() || '')
    if (!assets.some(a => a.browser_download_url === abs)) assets.push({ name, browser_download_url: abs })
  }
  return { ok: true, status: 200, assets }
}

async function viaHtml(owner, repo) {
  const t = await htmlTags(owner, repo)
  if (!t.ok) return { ok: false, status: t.status }
  const lists = []
  for (const tag of t.tags) {
    const a = await htmlAssets(owner, repo, tag)
    if (!a.ok) {
      if (lists.length === 0) return { ok: false, status: a.status }
      break
    }
    lists.push(a.assets)
    // Stop early once an .apk is found (same result as scanning further).
    const picked = pickPreferredReleaseDownload(a.assets)
    if (picked && isLikelyApkPath(picked.name)) break
  }
  return { ok: true, status: 200, url: pickFromReleases(lists) }
}

// Returns { url|null, via, apiStatus, htmlStatus, confirmedEmpty }
async function resolveGithubReleaseAsset(pageUrl, env) {
  const parsed = new URL(pageUrl)
  const parts = parsed.pathname.split('/').filter(Boolean)
  const owner = parts[0]
  const repo = parts[1]
  if (!owner || !repo) return { url: null, via: 'none' }

  const key = `${owner}/${repo}`.toLowerCase()
  const cached = releaseCache.get(key)
  if (cached && cached.expires > Date.now()) return { ...cached.value, via: `${cached.value.via}-cached` }

  let api = null
  try { api = await viaApi(owner, repo, env) } catch (e) { api = { ok: false, status: 'network' } }
  if (api.ok && api.url) {
    const value = { url: api.url, via: 'api', apiStatus: 200 }
    releaseCache.set(key, { value, expires: Date.now() + RELEASE_TTL_MS })
    return value
  }

  let html = null
  try { html = await viaHtml(owner, repo) } catch (e) { html = { ok: false, status: 'network' } }
  if (html.ok && html.url) {
    const value = { url: html.url, via: 'html', apiStatus: api.status }
    releaseCache.set(key, { value, expires: Date.now() + RELEASE_TTL_MS })
    return value
  }

  // Both lookups answered and found nothing: a real "no apk" — cache briefly.
  const confirmedEmpty = (api.ok || html.ok)
  const value = { url: null, via: 'none', apiStatus: api.status, htmlStatus: html.status, confirmedEmpty }
  if (confirmedEmpty) releaseCache.set(key, { value, expires: Date.now() + NEGATIVE_TTL_MS })
  return value
}

// Same shape as h3 createError JSON (client reads statusMessage || message).
function errorResponse(statusCode, statusMessage, extraHeaders = {}) {
  return new Response(JSON.stringify({ error: true, statusCode, statusMessage, message: statusMessage }), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS_HEADERS, ...extraHeaders }
  })
}

function redirectRequested(params) {
  return params.getAll('redirect').some(v => v === '1' || v === 'true')
}

async function handle(request, env) {
  const reqUrl = new URL(request.url)
  if (reqUrl.pathname !== '/' && reqUrl.pathname !== '/api/apk-proxy') {
    return errorResponse(404, 'Not found')
  }

  let url = reqUrl.searchParams.get('url') || ''
  if (!url || !url.startsWith('https://')) {
    return errorResponse(400, 'Invalid or missing target URL')
  }

  url = rewriteKnownHomepageToGithubRelease(url)

  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return errorResponse(400, 'Invalid or missing target URL')
  }
  if (!isAllowedApkProxyHost(parsed.hostname)) {
    return errorResponse(403, `Host ${parsed.hostname} is not allowed for APK proxying`)
  }

  const isDirectApk = isLikelyApkPath(parsed.pathname)
  const isDirectZip = isLikelyZipPath(parsed.pathname)

  let resolveInfo = null
  if (parsed.hostname === 'github.com' && parsed.pathname.includes('/releases') && !isDirectApk && !isDirectZip) {
    try {
      resolveInfo = await resolveGithubReleaseAsset(url, env)
    } catch (err) {
      console.warn('Failed to resolve release asset:', err)
      resolveInfo = { url: null, via: 'error' }
    }
    if (resolveInfo.url) url = resolveInfo.url
    const resolvedPath = new URL(url).pathname
    if (!isLikelyApkPath(resolvedPath) && !isLikelyZipPath(resolvedPath)) {
      if (resolveInfo.confirmedEmpty) {
        return errorResponse(502, 'Could not find an .apk (or a ZIP that contains one) in this GitHub release.')
      }
      return errorResponse(502, `Could not look up this GitHub release (GitHub API HTTP ${resolveInfo.apiStatus ?? '?'}, releases page HTTP ${resolveInfo.htmlStatus ?? '?'}). Try Manual APK Download.`)
    }
  }

  const resolved = new URL(url)
  if (!isAllowedApkProxyHost(resolved.hostname)) {
    return errorResponse(403, `Host ${resolved.hostname} is not allowed for APK proxying`)
  }

  // redirect=1: plain .apk -> 302 to the asset (native app follows redirects). Zips keep streaming.
  if (redirectRequested(reqUrl.searchParams) && isLikelyApkPath(resolved.pathname) && !isLikelyZipPath(resolved.pathname)) {
    return new Response(null, {
      status: 302,
      headers: { Location: resolved.toString(), 'Cache-Control': 'no-store', ...CORS_HEADERS, ...(resolveInfo ? { 'X-QuestPorts-Resolve': resolveInfo.via } : {}) }
    })
  }

  const upstreamHeaders = { ...UPSTREAM_HEADERS }
  const range = request.headers.get('range')
  if (range) upstreamHeaders.Range = range

  const upstreamRes = await fetch(url, {
    method: request.method === 'HEAD' ? 'HEAD' : 'GET',
    redirect: 'follow',
    headers: upstreamHeaders
  })

  const isHead = request.method === 'HEAD'
  if (!upstreamRes.ok || (!isHead && !upstreamRes.body)) {
    if (upstreamRes.status === 416) {
      upstreamRes.body?.cancel()
      return new Response(null, { status: 416, headers: { ...CORS_HEADERS, 'Content-Range': upstreamRes.headers.get('content-range') || '' } })
    }
    upstreamRes.body?.cancel()
    return errorResponse(502, `Download host returned HTTP ${upstreamRes.status}. Try Manual APK Download.`)
  }

  const upstreamType = (upstreamRes.headers.get('content-type') || '').toLowerCase()
  if (upstreamType.includes('text/html')) {
    upstreamRes.body?.cancel()
    return errorResponse(502, 'Download URL returned a web page instead of an APK. Use Manual APK Download or a direct .apk / GitHub release link.')
  }

  const shouldUnzip = isLikelyZipPath(url) || upstreamType.includes('zip')

  const headers = new Headers(CORS_HEADERS)
  headers.set('Cache-Control', 'public, max-age=3600')
  if (resolveInfo) headers.set('X-QuestPorts-Resolve', `${resolveInfo.via}${resolveInfo.apiStatus && resolveInfo.apiStatus !== 200 ? `;api=${resolveInfo.apiStatus}` : ''}`)
  if (shouldUnzip) {
    headers.set('Content-Type', 'application/zip')
    headers.set('X-QuestPorts-Unwrap', 'apk')
  } else {
    headers.set('Content-Type', 'application/vnd.android.package-archive')
    const cd = upstreamRes.headers.get('content-disposition')
    if (cd) headers.set('Content-Disposition', cd)
  }
  const cl = upstreamRes.headers.get('content-length')
  if (cl) headers.set('Content-Length', cl)
  const cr = upstreamRes.headers.get('content-range')
  if (cr) headers.set('Content-Range', cr)
  const ar = upstreamRes.headers.get('accept-ranges')
  if (ar) headers.set('Accept-Ranges', ar)

  // Pass the upstream stream straight through (no buffering, no CPU spent copying).
  return new Response(isHead ? null : upstreamRes.body, {
    status: upstreamRes.status === 206 ? 206 : 200,
    headers
  })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return errorResponse(405, 'Method not allowed', { Allow: 'GET, HEAD, OPTIONS' })
    }
    try {
      return await handle(request, env)
    } catch (err) {
      console.error('apk-proxy error', err)
      return errorResponse(502, 'Download failed. Try Manual APK Download.')
    }
  }
}
