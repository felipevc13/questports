/** Category values the catalog filter accepts from ?cat=. */

export const CATALOG_CATEGORY_FILTERS = [
  'source_port',
  'decompilation',
  'engine_recreation',
  'emulator',
  'wrapper',
  'vr_injection',
  'game_mod'
] as const

export type CatalogCategoryFilter = (typeof CATALOG_CATEGORY_FILTERS)[number]

/** Unknown or empty query values mean the full catalog. */
export function catalogCategoryFromQuery(value: unknown): CatalogCategoryFilter | 'all' {
  if (typeof value !== 'string') return 'all'
  return (CATALOG_CATEGORY_FILTERS as readonly string[]).includes(value)
    ? value as CatalogCategoryFilter
    : 'all'
}

export interface CatalogLocationQuery {
  q: string
  cat: CatalogCategoryFilter | 'all'
  dev: string
}

/**
 * Filters from the address bar. The shared ISR document is rendered without
 * the query, so the catalog applies this after hydration.
 */
export function readCatalogQuery(search: string | null | undefined): CatalogLocationQuery {
  const raw = typeof search === 'string' ? search : ''
  const hashless = raw.split('#')[0] || ''
  const queryIndex = hashless.indexOf('?')
  const query = queryIndex >= 0 ? hashless.slice(queryIndex + 1) : hashless
  const params = new URLSearchParams(query)
  return {
    q: params.get('q') || '',
    cat: catalogCategoryFromQuery(params.get('cat')),
    dev: params.get('dev') || ''
  }
}
