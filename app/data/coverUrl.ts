const STORAGE_MARKER = '/storage/v1/object/public/port-covers/'
const SITE_ORIGIN = 'https://questports.vercel.app'
/** Cloudflare media host. Empty NUXT_PUBLIC_MEDIA_BASE falls back to this site instead. */
export const DEFAULT_MEDIA_BASE = 'https://questports-media.questports.workers.dev'
const DEFAULT_OG = '/covers/questports-og.png'
/** Bump when a cover file changes. Paired with a year-long immutable cache. */
export const COVER_CACHE_VERSION = '2'
/** Cache-busted absolute URL for the site-wide 1200×630 share card. */
export const DEFAULT_OG_URL = `${SITE_ORIGIN}${DEFAULT_OG}?v=${COVER_CACHE_VERSION}`
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
  '3258bb70c96330b7eaadc3458bc8f00d': '/covers/majoras-mask-vr.png',
  'a6c39c820081dd442cedc35851851de9': '/covers/generals-zero-hour-xr.png',
  '933bae66e5dfe59043d3d2cbbe9c7fc3': '/covers/generals-zero-hour-xr.png',
  'fe895c991a5152476a051ae74fcbf8ac': '/covers/sm64-coop-dx-vr.png',
  '317799a8c9027ed5e9cbb1deb38238d9': '/covers/f-zero-x-vr.jpg',
  'bb6db65a8d0f04a0f9a0a8e708da18d2': '/covers/quake3quest.png',
  'a885e2694d4d70bb6e531289081bcb7e': '/covers/descent-3-vr.jpg',
  '06524331e2c63c0ed3479bf1be85ce3b': '/covers/hotd2-vr.png'
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

/** Append `?v=` so an immutable Cache-Control header can still show a new file. */
export function withCoverVersion(url: string): string {
  const hashIndex = url.indexOf('#')
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : ''
  const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url
  const queryIndex = withoutHash.indexOf('?')
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash
  if (!path.startsWith('/covers/') && !path.startsWith('/previews/')) return url
  const params = new URLSearchParams(queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : '')
  if (!params.get('v')) params.set('v', COVER_CACHE_VERSION)
  return `${path}?${params.toString()}${hash}`
}

/** Prefix `/covers` and `/previews` when they should load from an external host. */
export function prefixMediaBase(url: string, mediaBase: string | null | undefined): string {
  const base = String(mediaBase ?? '').trim().replace(/\/+$/, '')
  if (!base || /^https?:\/\//i.test(url)) return url
  if (!url.startsWith('/covers/') && !url.startsWith('/previews/')) return url
  return `${base}${url}`
}

/** Same-origin cover path, versioned, and optionally served from `mediaBase`. */
export function versionedCoverUrl(url: string | null | undefined, mediaBase = ''): string | null {
  const resolved = resolveCoverUrl(url)
  if (!resolved) return null
  if (!resolved.startsWith('/covers/')) return resolved
  return prefixMediaBase(withCoverVersion(resolved), mediaBase)
}

export function absoluteCoverUrl(url: string | null | undefined): string {
  const resolved = resolveCoverUrl(url) || DEFAULT_OG
  const local = localCoverPath(resolved)
  if (local === DEFAULT_OG || (!resolved && !local)) return DEFAULT_OG_URL
  if (!local && (resolved === DEFAULT_OG || !resolved)) return DEFAULT_OG_URL
  if (local) {
    if (local === DEFAULT_OG) return DEFAULT_OG_URL
    return `${SITE_ORIGIN}${withCoverVersion(local)}`
  }
  if (resolved.startsWith('http')) return resolved
  return `${SITE_ORIGIN}${resolved}`
}

const THUMB_FALLBACK = 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=120&h=72&q=70'

function localCoverPath(url: string): string | null {
  const bare = url.split('?')[0]?.split('#')[0] || ''
  if (bare.startsWith('/covers/')) return bare
  if (/^https?:\/\//i.test(url)) {
    try {
      const path = new URL(url).pathname
      if (path.startsWith('/covers/')) return path
    } catch {
      return null
    }
  }
  return null
}

/** Small cover for table thumbnails (about 120px wide). */
export function coverThumbUrl(url: string | null | undefined, mediaBase = ''): string {
  const resolved = resolveCoverUrl(url)
  if (!resolved) return THUMB_FALLBACK

  const localPath = localCoverPath(resolved)
  if (localPath) {
    const file = localPath.slice('/covers/'.length)
    if (file.startsWith('thumbs/')) return prefixMediaBase(withCoverVersion(localPath), mediaBase)
    const base = file.replace(/\.(png|jpe?g|webp)$/i, '')
    if (base && base !== file) {
      return prefixMediaBase(withCoverVersion(`/covers/thumbs/${base}.jpg`), mediaBase)
    }
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
