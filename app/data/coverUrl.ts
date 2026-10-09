const STORAGE_MARKER = '/storage/v1/object/public/port-covers/'
const SITE_ORIGIN = 'https://questports.vercel.app'
const DEFAULT_OG = '/covers/questports-og.png'
/** SteamGridDB grid ids that stay hotlinked in the database, served from /covers. */
const STEAMGRID_COVERS: Record<string, string> = {
  '7adb6a50e7687b45a00b35796f18f17d': '/covers/ut99vr.png',
  'efa57a13caff2c0bef9bb12e2e734d31': '/covers/sclerosis-vr.png',
  '5a3560a50c0cde4c41fc6e5bd431c1b4': '/covers/sega-rally-vr.png',
  '7dab099bfda35ad14715763b75487b47': '/covers/starfox-enhanced-vr.png',
  '67b1f8c9fe38416ca4971598d0edac57': '/covers/unreal-gold-vr.png',
  '26fed7a27154ecf97dc1a617e8813926': '/covers/homeworld-unbound.jpg',
  '3976e8d9470abc7b3aed396293ab346a': '/covers/ocarina-of-time-vr.png',
  'c530fbfc90e6b52b488b3d5ab006e9b8': '/covers/xrkart-64.png',
  'dc2b690516158a874dd8aabe1365c6a0': '/covers/wiicompiled-vr-plus.png',
  '7877afc63a2644aeee47db29ff48412b': '/covers/magic-carpet-vr.jpg',
  'a073416fbe3a75be1c9dabe1a85176ca': '/covers/twilight-princess-vr.png',
  '3258bb70c96330b7eaadc3458bc8f00d': '/covers/majoras-mask-vr.png'
}

/** Map Storage / hotlink covers onto same-origin /covers files. */
export function resolveCoverUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null
  const clean = url.trim().split('?')[0] || ''

  const storageIdx = clean.indexOf(STORAGE_MARKER)
  if (storageIdx !== -1) {
    const file = clean.slice(storageIdx + STORAGE_MARKER.length)
    if (file) return `/covers/${file}`
  }

  for (const [id, local] of Object.entries(STEAMGRID_COVERS)) {
    if (clean.includes(id)) return local
  }

  return url
}

export function absoluteCoverUrl(url: string | null | undefined): string {
  const resolved = resolveCoverUrl(url) || DEFAULT_OG
  if (resolved.startsWith('http')) return resolved
  return `${SITE_ORIGIN}${resolved}`
}

const THUMB_FALLBACK = 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=120&h=72&q=70'

/** Small same-origin cover for table thumbnails (about 120px wide). */
export function coverThumbUrl(url: string | null | undefined): string {
  const resolved = resolveCoverUrl(url)
  if (!resolved) return THUMB_FALLBACK

  if (resolved.startsWith('/covers/')) {
    const file = resolved.slice('/covers/'.length)
    const base = file.replace(/\.(png|jpe?g|webp)$/i, '')
    if (base && base !== file) return `/covers/thumbs/${base}.jpg`
  }

  if (resolved.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(resolved)
      parsed.searchParams.set('w', '120')
      parsed.searchParams.set('h', '72')
      parsed.searchParams.set('fit', 'crop')
      parsed.searchParams.set('q', '70')
      return parsed.toString()
    } catch {
      return resolved
    }
  }

  return resolved
}
