const STORAGE_MARKER = '/storage/v1/object/public/port-covers/'
const SITE_ORIGIN = 'https://questports.vercel.app'
const DEFAULT_OG = '/covers/questports-og.png'
const UT99_STEAMGRID = '7adb6a50e7687b45a00b35796f18f17d'

/** Map Storage / hotlink covers onto same-origin /covers files. */
export function resolveCoverUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null
  const clean = url.trim().split('?')[0] || ''

  const storageIdx = clean.indexOf(STORAGE_MARKER)
  if (storageIdx !== -1) {
    const file = clean.slice(storageIdx + STORAGE_MARKER.length)
    if (file) return `/covers/${file}`
  }

  if (clean.includes(UT99_STEAMGRID)) return '/covers/ut99vr.png'

  return url
}

export function absoluteCoverUrl(url: string | null | undefined): string {
  const resolved = resolveCoverUrl(url) || DEFAULT_OG
  if (resolved.startsWith('http')) return resolved
  return `${SITE_ORIGIN}${resolved}`
}
