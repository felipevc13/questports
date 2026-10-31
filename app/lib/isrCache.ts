/**
 * Shared cache rule for the catalog HTML.
 * On Vercel this is ISR: `allowQuery: []` keeps ?fbclid, ?utm, ?from, and ?inApp
 * off the cache key, and `passQuery: false` strips that query before the function
 * runs, so the cached HTML is the canonical page. The browser address bar still
 * has the query; client code reads window.location.
 * On Cloudflare (NITRO_PRESET=cloudflare_module) Nitro has no ISR, so the same pages are
 * prerendered at build time and served as static assets (no Worker request, no CPU).
 * Anything not prerendered still falls back to the Worker.
 * 86400 seconds is one day. The GitHub release sync runs at 04:00 UTC, so
 * "Recently updated" is regenerated at least daily. A new deploy has its own cache.
 */
export const CATALOG_ISR_EXPIRATION = 86400

export function catalogIsrRule() {
  return {
    expiration: CATALOG_ISR_EXPIRATION,
    allowQuery: [] as string[],
    passQuery: false
  }
}

export function isCloudflarePreset(preset: string | undefined): boolean {
  return (preset || '').startsWith('cloudflare')
}

/**
 * Cloudflare: render the page at build time so it ships as a static asset, which costs no
 * Worker request and no CPU. Daily freshness comes from rebuilding after the 04:00 UTC sync.
 */
export function catalogPrerenderRule() {
  return { prerender: true }
}

export function catalogCacheRule(preset: string | undefined = process.env.NITRO_PRESET) {
  return isCloudflarePreset(preset) ? catalogPrerenderRule() : { isr: catalogIsrRule() }
}
