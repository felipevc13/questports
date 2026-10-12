/** Catalog sort. The default stays "recently updated". */

export const CATALOG_SORTS = ['recent', 'az', 'installs', 'added'] as const

export type CatalogSort = (typeof CATALOG_SORTS)[number]

export const DEFAULT_CATALOG_SORT: CatalogSort = 'recent'

/**
 * The menu used to offer "featured". Sort is not stored in the URL or
 * localStorage. If a stored value still says featured, it sorts as installs.
 */
export const LEGACY_CATALOG_SORT_ALIASES = { featured: 'installs' } as const

export interface CatalogSortable {
  title: string
  last_github_update?: string | null
  created_at?: string | null
  /** Distinct QuestPorts installs. The card's "↓ N installs" line uses this. */
  installs?: number | null
}

function time(value: string | null | undefined): number {
  if (!value) return 0
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Same number the card receives: non-positive and non-finite counts sort as zero. */
function installCount(value: number | null | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 0
  return Math.floor(value)
}

export function isCatalogSort(value: string): value is CatalogSort {
  return (CATALOG_SORTS as readonly string[]).includes(value)
}

/** Map a menu value or the legacy featured alias onto a current sort. */
export function resolveCatalogSort(value: string): CatalogSort | null {
  if (value === 'featured') return LEGACY_CATALOG_SORT_ALIASES.featured
  return isCatalogSort(value) ? value : null
}

/**
 * Newest first for "recent" (last GitHub update) and "added" (ports.created_at).
 * "installs" is the card install count, highest first. Ties use "recent".
 * "featured" is the legacy alias of "installs".
 * Missing dates sort last. Equal dates keep their incoming order.
 */
export function sortCatalogPorts<T extends CatalogSortable>(
  ports: readonly T[],
  sort: CatalogSort | 'featured'
): T[] {
  const mode = sort === 'featured' ? 'installs' : sort
  const list = [...ports]
  if (mode === 'az') {
    list.sort((a, b) => a.title.localeCompare(b.title))
  } else if (mode === 'recent') {
    list.sort((a, b) => time(b.last_github_update) - time(a.last_github_update))
  } else if (mode === 'added') {
    list.sort((a, b) => time(b.created_at) - time(a.created_at))
  } else if (mode === 'installs') {
    list.sort((a, b) => {
      const byCount = installCount(b.installs) - installCount(a.installs)
      if (byCount !== 0) return byCount
      return time(b.last_github_update) - time(a.last_github_update)
    })
  }
  return list
}
