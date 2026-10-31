/**
 * Shared cache rule for the catalog HTML.
 * On Vercel this is ISR: `allowQuery: []` keeps ?fbclid, ?utm, ?from, and ?inApp
 * off the cache key, and `passQuery: false` strips that query before the function
 * runs, so the cached HTML is the canonical page. The browser address bar still
 * has the query; client code reads window.location.
 * On Cloudflare (NITRO_PRESET=cloudflare_module) Nitro has no ISR, so the rule
 * sends `s-maxage` and a Cloudflare Cache Rule stores the HTML at the edge. Hits
 * there never start the Worker, which keeps the free 100k requests per day.
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

/** Edge cache for Cloudflare: browsers revalidate, the edge keeps a day, then serves stale for an hour. */
export function catalogEdgeCacheRule() {
  return {
    headers: {
      'cache-control': `public, max-age=0, s-maxage=${CATALOG_ISR_EXPIRATION}, stale-while-revalidate=3600`
    }
  }
}

export function catalogCacheRule(preset: string | undefined = process.env.NITRO_PRESET) {
  return isCloudflarePreset(preset) ? catalogEdgeCacheRule() : { isr: catalogIsrRule() }
}
