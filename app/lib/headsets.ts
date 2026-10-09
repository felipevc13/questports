/** Catalog headset labels shared by cards, the detail page, and the filter. */

export const CATALOG_HEADSETS = ['Quest 1', 'Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'] as const

export type CatalogHeadset = (typeof CATALOG_HEADSETS)[number]

const CATALOG_ORDER = new Map<string, number>(CATALOG_HEADSETS.map((label, index) => [label, index]))

function prepared(raw: string): { spaced: string; compact: string } {
  const spaced = raw.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  return { spaced, compact: spaced.replace(/[^a-z0-9]/g, '') }
}

/**
 * Map a stored hardware string onto the catalog label.
 * Unknown values are kept (trimmed) so they stay filterable.
 */
export function normalizeHeadsetLabel(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed) return null

  const { spaced, compact } = prepared(trimmed)

  if (spaced.includes('3s') || compact.includes('quest3s') || spaced.includes('panther')) return 'Quest 3S'
  if (/(^|[^a-z])pro([^a-z]|$)/.test(spaced) || spaced.includes('seacliff') || spaced.includes('cambria')) {
    return 'Quest Pro'
  }
  if (spaced.includes('quest 3') || compact.includes('quest3') || spaced.includes('eureka')) return 'Quest 3'
  if (spaced.includes('quest 2') || compact.includes('quest2') || spaced.includes('hollywood')) return 'Quest 2'
  if (
    spaced.includes('quest 1') ||
    compact.includes('quest1') ||
    spaced === 'oculus quest' ||
    spaced === 'oculus quest 1' ||
    spaced === 'meta quest 1'
  ) {
    return 'Quest 1'
  }

  return trimmed
}

export function compareHeadsetLabels(left: string, right: string): number {
  const leftRank = CATALOG_ORDER.get(left) ?? CATALOG_HEADSETS.length
  const rightRank = CATALOG_ORDER.get(right) ?? CATALOG_HEADSETS.length
  if (leftRank !== rightRank) return leftRank - rightRank
  return left.localeCompare(right)
}

/** Unique catalog labels for one port, in the shared order. */
export function normalizeHeadsetList(values: string[] | null | undefined): string[] {
  if (!Array.isArray(values)) return []
  const seen = new Set<string>()
  for (const value of values) {
    const label = normalizeHeadsetLabel(value)
    if (label) seen.add(label)
  }
  return [...seen].sort(compareHeadsetLabels)
}

/** Filter options that actually appear in the loaded catalog. Quest 1 is included only then. */
export function headsetFilterOptions(lists: Array<string[] | null | undefined>): string[] {
  const seen = new Set<string>()
  for (const list of lists) {
    for (const label of normalizeHeadsetList(list)) seen.add(label)
  }
  return [...seen].sort(compareHeadsetLabels)
}

export function portSupportsHeadset(values: string[] | null | undefined, selected: string): boolean {
  if (!selected) return true
  return normalizeHeadsetList(values).includes(selected)
}
