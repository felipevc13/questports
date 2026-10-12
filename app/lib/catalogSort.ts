/** Catalog sort. The default stays "recently updated". */

export const CATALOG_SORTS = ['recent', 'az', 'featured', 'added'] as const

export type CatalogSort = (typeof CATALOG_SORTS)[number]

export const DEFAULT_CATALOG_SORT: CatalogSort = 'recent'

export interface CatalogSortable {
  title: string
  last_github_update?: string | null
  created_at?: string | null
}

function time(value: string | null | undefined): number {
  if (!value) return 0
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function isCatalogSort(value: string): value is CatalogSort {
  return (CATALOG_SORTS as readonly string[]).includes(value)
}

/**
 * Newest first for "recent" (last GitHub update) and "added" (ports.created_at).
 * "featured" keeps the order the catalog was loaded in.
 * Missing dates sort last. Equal dates keep their incoming order.
 */
export function sortCatalogPorts<T extends CatalogSortable>(ports: readonly T[], sort: CatalogSort): T[] {
  const list = [...ports]
  if (sort === 'az') {
    list.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sort === 'recent') {
    list.sort((a, b) => time(b.last_github_update) - time(a.last_github_update))
  } else if (sort === 'added') {
    list.sort((a, b) => time(b.created_at) - time(a.created_at))
  }
  return list
}
