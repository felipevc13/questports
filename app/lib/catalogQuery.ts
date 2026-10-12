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
