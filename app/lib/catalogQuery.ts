import { DEFAULT_CATALOG_SORT, resolveCatalogSort, type CatalogSort } from '~/lib/catalogSort'

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
  /** ?nopc=1, the "No PC needed" filter. */
  nopc: boolean
  /** ?platform=, ?hw=, ?style=, ?status=, ?sort= as written. Check them with sanitizeCatalogFilters. */
  platform: string
  hw: string
  style: string
  status: string
  sort: string
}

export const CATALOG_STATUS_FILTERS = ['released', 'playable_beta', 'in_development'] as const

/** Address parameters for the five menu filters. A default value is left out. */
export const CATALOG_FILTER_PARAM_KEYS = ['platform', 'hw', 'style', 'status', 'sort'] as const

export interface CatalogFilterValues {
  platform: string
  hw: string
  style: string
  status: string
  sort: CatalogSort
}

export interface CatalogFilterOptions {
  platforms: readonly string[]
  headsets: readonly string[]
  styles: readonly string[]
}

/**
 * Values from the address that the loaded catalog can actually show. Anything
 * else (an old headset name, a typo, a sort that is gone) falls back to the
 * default instead of leaving the list empty.
 */
export function sanitizeCatalogFilters(
  query: Pick<CatalogLocationQuery, 'platform' | 'hw' | 'style' | 'status' | 'sort'>,
  options: CatalogFilterOptions
): CatalogFilterValues {
  return {
    platform: options.platforms.includes(query.platform) ? query.platform : '',
    hw: options.headsets.includes(query.hw) ? query.hw : '',
    style: options.styles.includes(query.style) ? query.style : '',
    status: (CATALOG_STATUS_FILTERS as readonly string[]).includes(query.status) ? query.status : '',
    sort: resolveCatalogSort(query.sort) ?? DEFAULT_CATALOG_SORT
  }
}

/** The route query with the five filter parameters set from `values`. Other keys are kept. */
export function withCatalogFilterParams(
  base: Record<string, unknown>,
  values: CatalogFilterValues
): Record<string, unknown> {
  const next: Record<string, unknown> = { ...base }
  for (const key of CATALOG_FILTER_PARAM_KEYS) delete next[key]
  if (values.platform) next.platform = values.platform
  if (values.hw) next.hw = values.hw
  if (values.style) next.style = values.style
  if (values.status) next.status = values.status
  if (values.sort !== DEFAULT_CATALOG_SORT) next.sort = values.sort
  return next
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
    dev: params.get('dev') || '',
    nopc: params.get('nopc') === '1',
    platform: params.get('platform') || '',
    hw: params.get('hw') || '',
    style: params.get('style') || '',
    status: params.get('status') || '',
    sort: params.get('sort') || ''
  }
}
