import { defineEventHandler, getQuery, createError, setResponseHeaders, sendStream } from 'h3'
import JSZip from 'jszip'
import {
  isAllowedApkProxyHost,
  isLikelyApkPath,
  isLikelyZipPath,
  pickPreferredApkPath,
  pickPreferredReleaseDownload,
  rewriteKnownHomepageToGithubRelease
} from '../utils/apkAssetPicker'

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

async function extractApkFromZip(buffer: ArrayBuffer, sourceName: string): Promise<{ bytes: Buffer; filename: string }> {
  const zip = await JSZip.loadAsync(buffer)
  const apkPath = pickPreferredApkPath(Object.keys(zip.files).filter(name => !zip.files[name]?.dir))
  if (!apkPath) {
    throw createError({
      statusCode: 502,
      statusMessage: `The download (${sourceName}) is a ZIP without an .apk inside. Use Manual APK Download.`
    })
  }
  const entry = zip.file(apkPath)
  if (!entry) {
    throw createError({
      statusCode: 502,
      statusMessage: `Could not read ${apkPath} from the release ZIP.`
    })
  }
  const bytes = Buffer.from(await entry.async('uint8array'))
  const filename = apkPath.split('/').pop() || 'quest-port.apk'
  return { bytes, filename }
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

  const upstreamRes = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'QuestPorts/1.0',
      Accept: 'application/octet-stream,application/zip,application/vnd.android.package-archive,*/*'
    }
  })

  if (!upstreamRes.ok || !upstreamRes.body) {
    throw createError({
      statusCode: 502,
      statusMessage: `Download host returned HTTP ${upstreamRes.status}. Try Manual APK Download.`
    })
  }

  const upstreamType = (upstreamRes.headers.get('content-type') || '').toLowerCase()
  if (upstreamType.includes('text/html')) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Download URL returned a web page instead of an APK. Use Manual APK Download or a direct .apk / GitHub release link.'
    })
  }

  const filenameHint = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'download')
  const shouldUnzip = isLikelyZipPath(url) || upstreamType.includes('zip')

  if (shouldUnzip) {
    const zipBuffer = await upstreamRes.arrayBuffer()
    const apk = await extractApkFromZip(zipBuffer, filenameHint)
    setResponseHeaders(event, {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Length': String(apk.bytes.length),
      'Content-Disposition': `attachment; filename="${apk.filename}"`,
      'Cache-Control': 'public, max-age=3600'
    })
    return apk.bytes
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
