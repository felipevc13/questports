import type { CatalogSort, CatalogSortable } from '~/lib/catalogSort'
import { sortCatalogPorts } from '~/lib/catalogSort'
import { PORT_SEARCH_ALIASES } from '~/data/searchAliases'

/**
 * Client-side catalog search.
 * Fold case, accents, and punctuation so "half life", "half-life", and
 * "halflife" share one key. Aliases in searchAliases.ts cover abbreviations
 * and nicknames that are not in the title. A one-edit typo still matches.
 */

export type SearchMatchVia = 'text' | 'alias' | 'fuzzy'

export interface CatalogSearchFields {
  slug: string
  title: string
  developer?: string | null
  short_description?: string | null
  original_game?: string | null
}

export interface CatalogSearchHit<T> {
  item: T
  via: SearchMatchVia
  score: number
}

/** Whole-word roman numerals that show up in port titles (Quake II, Quake III). */
const ROMAN_NUMERALS: Record<string, string> = {
  ii: '2',
  iii: '3',
  iv: '4',
  vi: '6',
  vii: '7',
  viii: '8',
  ix: '9',
  xi: '11',
  xii: '12'
}

const SCORE = {
  titlePhrase: 1000,
  titleTokens: 920,
  titleCompact: 860,
  aliasExact: 880,
  aliasCover: 840,
  developer: 760,
  description: 640,
  fuzzy1: 460,
  fuzzy2: 420
} as const

export function normalizeSearchText(value: string): string {
  const folded = value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’`]/g, '')
  const raw = folded.replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean)
  const tokens: string[] = []
  for (const token of raw) {
    tokens.push(token)
    const roman = ROMAN_NUMERALS[token]
    if (roman) tokens.push(roman)
  }
  return tokens.join(' ')
}

export function compactSearchText(value: string): string {
  return normalizeSearchText(value).replace(/ /g, '')
}

function tokensOf(normalized: string): string[] {
  return normalized ? normalized.split(' ') : []
}

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

function maxTypoDistance(length: number, singleToken: boolean): number {
  if (length >= 8) return 2
  if (length >= 4) return 1
  if (!singleToken && length >= 3) return 1
  return 0
}

function levenshtein(a: string, b: string, max: number): number {
  if (a === b) return 0
  const aLen = a.length
  const bLen = b.length
  if (Math.abs(aLen - bLen) > max) return max + 1
  if (!aLen) return bLen
  if (!bLen) return aLen
  let prev = new Array<number>(aLen + 1)
  for (let i = 0; i <= aLen; i++) prev[i] = i
  for (let j = 1; j <= bLen; j++) {
    let previousDiagonal = prev[0]!
    prev[0] = j
    let rowMin = j
    const bj = b.charCodeAt(j - 1)
    for (let i = 1; i <= aLen; i++) {
      const insertOrDelete = Math.min(prev[i]! + 1, prev[i - 1]! + 1)
      const substitute = previousDiagonal + (a.charCodeAt(i - 1) === bj ? 0 : 1)
      previousDiagonal = prev[i]!
      const next = insertOrDelete < substitute ? insertOrDelete : substitute
      prev[i] = next
      if (next < rowMin) rowMin = next
    }
    if (rowMin > max) return max + 1
  }
  return prev[aLen]!
}

function bestTokenDistance(needle: string, tokens: readonly string[], max: number): number {
  let best = max + 1
  for (const token of tokens) {
    if (token.length < 4 || Math.abs(token.length - needle.length) > max) continue
    const dist = levenshtein(needle, token, Math.min(max, best - 1))
    if (dist < best) best = dist
    if (best === 0) return 0
  }
  return best
}

function phraseIn(haystack: string, phrase: string): boolean {
  if (!phrase) return false
  return ` ${haystack} `.includes(` ${phrase} `)
}

function tokenFound(token: string, bag: readonly string[]): boolean {
  if (bag.includes(token)) return true
  if (token.length < 3) return false
  return bag.some(entry => entry.startsWith(token))
}

interface IndexedPort<T> {
  item: T
  titleNorm: string
  titleCompact: string
  titleTokens: string[]
  slugNorm: string
  slugTokens: string[]
  slugCompact: string
  developerNorm: string
  developerCompact: string
  developerTokens: string[]
  descriptionTokens: string[]
  aliasNorms: string[]
  aliasCompacts: string[]
  /** Alias words of 4+ characters. Safe to match inside a longer query. */
  aliasTokens: string[]
  /** Whole alias that is one short word (rdr, hl, gta). Not pieces of a longer phrase. */
  shortExact: string[]
}

function indexPort<T extends CatalogSearchFields>(
  item: T,
  aliases: readonly string[]
): IndexedPort<T> {
  const titleNorm = [item.title, item.original_game].filter(Boolean).map(value => normalizeSearchText(String(value))).join(' ')
  const slugNorm = normalizeSearchText(item.slug.replace(/-/g, ' '))
  const developerNorm = normalizeSearchText(item.developer || '')
  const descriptionNorm = normalizeSearchText(item.short_description || '')
  const aliasNorms = aliases.map(normalizeSearchText).filter(Boolean)
  const aliasCompacts = aliasNorms.map(norm => norm.replace(/ /g, ''))
  const shortExact = unique(aliasCompacts.filter((compact, index) => compact.length < 4 && !aliasNorms[index]?.includes(' ')))
  return {
    item,
    titleNorm,
    titleCompact: titleNorm.replace(/ /g, ''),
    titleTokens: tokensOf(titleNorm),
    slugNorm,
    slugTokens: tokensOf(slugNorm),
    slugCompact: slugNorm.replace(/ /g, ''),
    developerNorm,
    developerCompact: developerNorm.replace(/ /g, ''),
    developerTokens: tokensOf(developerNorm),
    descriptionTokens: tokensOf(descriptionNorm).filter(token => token.length >= 4),
    aliasNorms,
    aliasCompacts,
    aliasTokens: unique(aliasNorms.flatMap(tokensOf).filter(token => token.length >= 4)),
    shortExact
  }
}

function aliasesFor(slug: string, aliases: Record<string, readonly string[]>): readonly string[] {
  return aliases[slug] || []
}

interface Scored {
  score: number
  via: SearchMatchVia
}

function coverTokens<T>(port: IndexedPort<T>, queryTokens: string[]): { via: SearchMatchVia } | null {
  let usedAlias = false
  for (const token of queryTokens) {
    const inTitle = tokenFound(token, port.titleTokens) || tokenFound(token, port.slugTokens)
    if (inTitle) continue
    const inAlias = token.length >= 4
      ? (port.aliasTokens.includes(token) || port.aliasCompacts.includes(token))
      : port.shortExact.includes(token)
    if (inAlias) {
      usedAlias = true
      continue
    }
    const inDeveloper = tokenFound(token, port.developerTokens)
    const inDescription = token.length >= 4 && port.descriptionTokens.includes(token)
    if (inDeveloper || inDescription) continue
    return null
  }
  return { via: usedAlias ? 'alias' : 'text' }
}

function fuzzyTargets<T>(port: IndexedPort<T>): string[] {
  // Short codes (rdr, rdr1, hl2) are exact aliases only. A typo of one code
  // must not land on a different code. Real title words stay matchable.
  const codes = new Set(port.aliasCompacts.filter(compact => compact.length < 5))
  const fromAlias = [...port.aliasTokens, ...port.aliasCompacts]
    .filter(token => token.length >= 5 && !codes.has(token))
  return unique([
    ...port.titleTokens.filter(token => token.length >= 4),
    ...fromAlias,
    port.titleCompact
  ])
}

function fuzzyDistance<T>(
  queryTokens: string[],
  queryCompact: string,
  port: IndexedPort<T>,
  ceiling?: number
): number {
  const single = queryTokens.length === 1
  const targets = fuzzyTargets(port)
  let worst = 0
  const needles = single ? [queryCompact] : queryTokens
  for (const token of needles) {
    const base = maxTypoDistance(token.length, single)
    const max = token.length >= 4 && ceiling != null ? Math.max(base, ceiling) : base
    if (max === 0) {
      const exact = tokenFound(token, port.titleTokens)
        || tokenFound(token, port.slugTokens)
        || (token.length >= 4
          ? (port.aliasTokens.includes(token) || port.aliasCompacts.includes(token))
          : port.shortExact.includes(token))
      if (!exact) return 99
      continue
    }
    const dist = bestTokenDistance(token, targets, max)
    if (dist > max) return 99
    if (dist > worst) worst = dist
  }
  return worst
}

function scorePort<T>(port: IndexedPort<T>, queryNorm: string, queryCompact: string, queryTokens: string[]): Scored | null {
  if (!queryNorm || !queryTokens.length) return null

  const titlePhrase = phraseIn(port.titleNorm, queryNorm) || phraseIn(port.slugNorm, queryNorm)
  const compactInTitle = queryCompact.length >= 3 && (
    port.titleCompact.includes(queryCompact) || port.slugCompact.includes(queryCompact)
  )
  if (titlePhrase) return { score: SCORE.titlePhrase, via: 'text' }
  if (compactInTitle) return { score: SCORE.titleCompact, via: 'text' }

  const inTitle = queryTokens.every(token => tokenFound(token, port.titleTokens) || tokenFound(token, port.slugTokens))
  if (inTitle) return { score: SCORE.titleTokens, via: 'text' }

  for (let i = 0; i < port.aliasNorms.length; i++) {
    if (queryNorm === port.aliasNorms[i] || queryCompact === port.aliasCompacts[i]) {
      return { score: SCORE.aliasExact, via: 'alias' }
    }
  }

  const covered = coverTokens(port, queryTokens)
  if (covered) {
    if (covered.via === 'alias') return { score: SCORE.aliasCover, via: 'alias' }
    if (phraseIn(port.developerNorm, queryNorm) || (queryCompact.length >= 3 && port.developerCompact.includes(queryCompact))) {
      return { score: SCORE.developer, via: 'text' }
    }
    if (queryTokens.every(token => tokenFound(token, port.developerTokens))) {
      return { score: SCORE.developer, via: 'text' }
    }
    return { score: SCORE.description, via: 'text' }
  }

  if (queryCompact.length >= 3 && port.developerCompact.includes(queryCompact)) {
    return { score: SCORE.developer, via: 'text' }
  }

  const distance = fuzzyDistance(queryTokens, queryCompact, port)
  if (distance === 1) return { score: SCORE.fuzzy1, via: 'fuzzy' }
  if (distance === 2 && queryCompact.length >= 8) return { score: SCORE.fuzzy2, via: 'fuzzy' }
  return null
}

function prepareQuery(query: string): { queryNorm: string, queryCompact: string, queryTokens: string[] } | null {
  const queryNorm = normalizeSearchText(query)
  if (queryNorm.length < 2) return null
  return {
    queryNorm,
    queryCompact: queryNorm.replace(/ /g, ''),
    queryTokens: tokensOf(queryNorm)
  }
}

function collect<T extends CatalogSearchFields>(
  items: readonly T[],
  query: string,
  aliases: Record<string, readonly string[]>,
  accept: (scored: Scored, queryCompact: string) => boolean
): CatalogSearchHit<T>[] {
  const prepared = prepareQuery(query)
  if (!prepared) return []
  const hits: CatalogSearchHit<T>[] = []
  for (const item of items) {
    const indexed = indexPort(item, aliasesFor(item.slug, aliases))
    const scored = scorePort(indexed, prepared.queryNorm, prepared.queryCompact, prepared.queryTokens)
    if (!scored || !accept(scored, prepared.queryCompact)) continue
    hits.push({ item, via: scored.via, score: scored.score })
  }
  hits.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
  return hits
}

/** Ports the query should show. Title matches outrank aliases. Aliases outrank a typo. */
export function searchCatalog<T extends CatalogSearchFields>(
  items: readonly T[],
  query: string,
  aliases: Record<string, readonly string[]> = PORT_SEARCH_ALIASES
): CatalogSearchHit<T>[] {
  return collect(items, query, aliases, scored => scored.score >= SCORE.fuzzy2)
}

/**
 * Near misses for an empty result list. One step looser than a result
 * (a two-character slip on a medium query). Empty when nothing is close.
 */
export function closestCatalogPorts<T extends CatalogSearchFields>(
  items: readonly T[],
  query: string,
  limit = 3,
  aliases: Record<string, readonly string[]> = PORT_SEARCH_ALIASES
): CatalogSearchHit<T>[] {
  const strong = new Set(searchCatalog(items, query, aliases).map(hit => hit.item.slug))
  const prepared = prepareQuery(query)
  if (!prepared || prepared.queryCompact.length < 4) return []
  const hits: CatalogSearchHit<T>[] = []
  for (const item of items) {
    if (strong.has(item.slug)) continue
    const indexed = indexPort(item, aliasesFor(item.slug, aliases))
    const allowed = prepared.queryCompact.length >= 6 ? 2 : 1
    const distance = fuzzyDistance(prepared.queryTokens, prepared.queryCompact, indexed, allowed)
    if (distance < 1 || distance > allowed) continue
    hits.push({
      item,
      via: 'fuzzy',
      score: distance === 1 ? SCORE.fuzzy1 : SCORE.fuzzy2
    })
  }
  hits.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
  return hits.slice(0, Math.max(0, limit))
}

/** What the settled search event should call the match. Alias wins over a typo. */
export function searchOutcomeVia(hits: readonly { via: SearchMatchVia }[]): 'text' | 'alias' | 'fuzzy' | 'none' {
  if (!hits.length) return 'none'
  if (hits.some(hit => hit.via === 'alias')) return 'alias'
  if (hits.some(hit => hit.via === 'fuzzy')) return 'fuzzy'
  return 'text'
}

/** Keep the catalog sort inside one relevance band. A better match stays above a weaker one. */
export function orderSearchHits<T extends CatalogSortable>(
  hits: readonly CatalogSearchHit<T>[],
  sort: CatalogSort | 'featured'
): CatalogSearchHit<T>[] {
  const groups = new Map<number, CatalogSearchHit<T>[]>()
  for (const hit of hits) {
    const group = groups.get(hit.score)
    if (group) group.push(hit)
    else groups.set(hit.score, [hit])
  }
  return [...groups.keys()].sort((a, b) => b - a).flatMap((score) => {
    const group = groups.get(score) || []
    const ranked = sortCatalogPorts(group.map(hit => hit.item), sort)
    const byItem = new Map(group.map(hit => [hit.item, hit]))
    return ranked.map(item => byItem.get(item) || group[0]!)
  })
}
