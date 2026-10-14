/**
 * Shared Vercel ISR document for the catalog.
 * `allowQuery: []` keeps ?fbclid, ?utm, ?from, and ?inApp off the cache key.
 * `passQuery: false` strips that query before the function runs, so the cached
 * HTML is the canonical page. The browser address bar still has the query;
 * client code reads window.location.
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
