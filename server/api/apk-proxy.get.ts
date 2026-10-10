import {
  defineEventHandler,
  getQuery,
  createError,
  setResponseHeaders,
  setResponseHeader,
  setResponseStatus,
  send,
  sendRedirect,
  sendStream
} from 'h3'
import {
  apkProxyMaxBytes,
  apkProxyRedirectRequested,
  apkTooLargeBody,
  contentLengthBytes,
  exceedsApkProxyCap
} from '../../app/lib/apkProxyPolicy'
import { plainApkRedirectTarget } from '../utils/apkProxyGate'
import {
  isAllowedApkProxyHost,
  isLikelyApkPath,
  isLikelyZipPath,
  pickPreferredReleaseDownload,
  rewriteKnownHomepageToGithubRelease
} from '../utils/apkAssetPicker'

const UPSTREAM_HEADERS = {
  'User-Agent': 'QuestPorts/1.0',
  Accept: 'application/octet-stream,application/zip,application/vnd.android.package-archive,*/*'
}

async function resolveGithubReleaseAsset(pageUrl: string): Promise<string> {
  const parsed = new URL(pageUrl)
  const parts = parsed.pathname.split('/').filter(Boolean)
  const owner = parts[0]
  const repo = parts[1]
  if (!owner || !repo) return pageUrl

  const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=10`, {
    headers: {
      'User-Agent': 'QuestPorts/1.0',
      Accept: 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
    }
  })
  if (!ghRes.ok) return pageUrl

  const releases = (await ghRes.json()) as any[]
  let zipFallback: string | null = null

  for (const releaseData of releases) {
    if (releaseData.draft) continue
    const assets = (releaseData.assets || []).map((a: any) => ({
      name: a.name,
      browser_download_url: a.browser_download_url
    }))
    const picked = pickPreferredReleaseDownload(assets)
    if (!picked) continue
    if (isLikelyApkPath(picked.name)) return picked.browser_download_url
    if (!zipFallback && isLikelyZipPath(picked.name)) {
      zipFallback = picked.browser_download_url
    }
  }

  return zipFallback || pageUrl
}

async function releaseUpstream(res: Response | null | undefined) {
  if (!res?.body) return
  try {
    await res.body.cancel()
  } catch {
    // Already closed, or HEAD had nothing to cancel.
  }
}

function headTimeout(): AbortSignal | undefined {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(8000)
  }
  return undefined
}

async function fetchUpstream(url: string, method: 'HEAD' | 'GET', signal?: AbortSignal) {
  return fetch(url, {
    method,
    redirect: 'follow',
    signal,
    headers: UPSTREAM_HEADERS
  })
}

function tooLarge(event: Parameters<typeof setResponseStatus>[0], size: number, directUrl: string) {
  setResponseStatus(event, 413, 'Payload Too Large')
  setResponseHeader(event, 'cache-control', 'no-store')
  return send(event, JSON.stringify(apkTooLargeBody(size, directUrl)), 'application/json')
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let url = query.url as string

  if (!url || !url.startsWith('https://')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing target URL'
    })
  }

  url = rewriteKnownHomepageToGithubRelease(url)

  const parsed = new URL(url)
  if (!isAllowedApkProxyHost(parsed.hostname)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Host ${parsed.hostname} is not allowed for APK proxying`
    })
  }

  const isDirectApk = isLikelyApkPath(parsed.pathname)
  const isDirectZip = isLikelyZipPath(parsed.pathname)

  if (
    parsed.hostname === 'github.com'
    && parsed.pathname.includes('/releases')
    && !isDirectApk
    && !isDirectZip
  ) {
    try {
      url = await resolveGithubReleaseAsset(url)
    } catch (err) {
      console.warn('Failed to resolve release asset via GitHub API:', err)
    }
    const resolvedPath = new URL(url).pathname
    if (!isLikelyApkPath(resolvedPath) && !isLikelyZipPath(resolvedPath)) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Could not find an .apk (or a ZIP that contains one) in this GitHub release.'
      })
    }
  }

  const resolvedHost = new URL(url).hostname
  if (!isAllowedApkProxyHost(resolvedHost)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Host ${resolvedHost} is not allowed for APK proxying`
    })
  }

  // The native app follows redirects. A plain APK never needs to pass through
  // this function. Zip releases still stream so the client can unwrap them.
  if (apkProxyRedirectRequested(query.redirect)) {
    const location = plainApkRedirectTarget(url)
    if (location) {
      setResponseHeader(event, 'cache-control', 'no-store')
      return sendRedirect(event, location, 302)
    }
  }

  const maxBytes = apkProxyMaxBytes()
  let head: Response | null = null
  try {
    head = await fetchUpstream(url, 'HEAD', headTimeout())
  } catch {
    head = null
  }
  const headBytes = head?.ok ? contentLengthBytes(head.headers.get('content-length')) : null
  await releaseUpstream(head)
  if (exceedsApkProxyCap(headBytes, maxBytes)) {
    return tooLarge(event, headBytes as number, url)
  }

  const upstreamRes = await fetchUpstream(url, 'GET')
  const getBytes = contentLengthBytes(upstreamRes.headers.get('content-length'))
  if (!upstreamRes.ok || !upstreamRes.body) {
    await releaseUpstream(upstreamRes)
    throw createError({
      statusCode: 502,
      statusMessage: `Download host returned HTTP ${upstreamRes.status}. Try Manual APK Download.`
    })
  }
  if (exceedsApkProxyCap(getBytes, maxBytes)) {
    await releaseUpstream(upstreamRes)
    return tooLarge(event, getBytes as number, url)
  }

  const upstreamType = (upstreamRes.headers.get('content-type') || '').toLowerCase()
  if (upstreamType.includes('text/html')) {
    await releaseUpstream(upstreamRes)
    throw createError({
      statusCode: 502,
      statusMessage: 'Download URL returned a web page instead of an APK. Use Manual APK Download or a direct .apk / GitHub release link.'
    })
  }

  const shouldUnzip = isLikelyZipPath(url) || upstreamType.includes('zip')

  // Stream the ZIP itself. Buffering it here held the client at 2% until the
  // whole archive arrived. The browser counts those bytes, then extracts the APK.
  if (shouldUnzip) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/zip',
      'X-QuestPorts-Unwrap': 'apk',
      'Cache-Control': 'public, max-age=3600'
    }
    const zipLength = upstreamRes.headers.get('content-length')
    if (zipLength) headers['Content-Length'] = zipLength
    setResponseHeaders(event, headers)
    return sendStream(event, upstreamRes.body as any)
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/vnd.android.package-archive',
    'Cache-Control': 'public, max-age=3600'
  }

  const cl = upstreamRes.headers.get('content-length')
  if (cl) headers['Content-Length'] = cl

  const cd = upstreamRes.headers.get('content-disposition')
  if (cd) headers['Content-Disposition'] = cd

  setResponseHeaders(event, headers)
  return sendStream(event, upstreamRes.body as any)
})
