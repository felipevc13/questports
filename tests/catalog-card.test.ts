import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it, afterEach } from 'vitest'
import { normalizeAnalyticsBody } from '../app/lib/analytics'
import {
  CARD_DESCRIPTION_MAX,
  CATALOG_CARD_INSTALL_MIN,
  buildCatalogCardMeta,
  catalogCardDescription,
  isQuest3Only
} from '../app/lib/catalogCard'
import {
  DEFAULT_CATALOG_SORT,
  resolveCatalogSort,
  sortCatalogPorts
} from '../app/lib/catalogSort'
import { catalogCategoryFromQuery, readCatalogQuery } from '../app/lib/catalogQuery'
import {
  LAST_VISIT_STORAGE_KEY,
  LAST_VISIT_WRITE_DELAY_MS,
  NEW_PORT_WINDOW_MS,
  armLastVisitWrite,
  isPortNew,
  readLastVisit,
  resetCatalogVisitForTests,
  writeLastVisit,
  type VisitStorage
} from '../app/lib/catalogVisit'

const NOW = Date.parse('2026-10-12T12:00:00.000Z')
const DAY = 24 * 60 * 60 * 1000

function memoryStorage(initial: Record<string, string> = {}): VisitStorage & { data: Record<string, string> } {
  const data = { ...initial }
  return {
    data,
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null
    },
    setItem(key, value) {
      data[key] = value
    }
  }
}

describe('new badge', () => {
  afterEach(() => {
    resetCatalogVisitForTests()
  })

  it('marks the last 7 days on a first visit and ignores older or future rows', () => {
    expect(readLastVisit(memoryStorage())).toBeNull()
    expect(isPortNew(new Date(NOW - 6 * DAY).toISOString(), null, NOW)).toBe(true)
    expect(isPortNew(new Date(NOW - NEW_PORT_WINDOW_MS).toISOString(), null, NOW)).toBe(true)
    expect(isPortNew(new Date(NOW - NEW_PORT_WINDOW_MS - 1).toISOString(), null, NOW)).toBe(false)
    expect(isPortNew(new Date(NOW - 8 * DAY).toISOString(), null, NOW)).toBe(false)
    expect(isPortNew(new Date(NOW + DAY).toISOString(), null, NOW)).toBe(false)
    expect(isPortNew(null, null, NOW)).toBe(false)
    expect(isPortNew('', null, NOW)).toBe(false)
    expect(isPortNew('not-a-date', null, NOW)).toBe(false)
  })

  it('marks only ports added after the stored visit for a returning visitor', () => {
    const storage = memoryStorage()
    const previous = NOW - 10 * DAY
    writeLastVisit(storage, previous)
    expect(readLastVisit(storage)).toBe(previous)
    expect(storage.data[LAST_VISIT_STORAGE_KEY]).toBe(String(previous))

    expect(isPortNew(new Date(previous + 1000).toISOString(), previous, NOW)).toBe(true)
    expect(isPortNew(new Date(previous).toISOString(), previous, NOW)).toBe(false)
    expect(isPortNew(new Date(previous - DAY).toISOString(), previous, NOW)).toBe(false)
    expect(isPortNew(new Date(NOW - 2 * DAY).toISOString(), previous, NOW)).toBe(true)
    expect(isPortNew(new Date(NOW + 1000).toISOString(), previous, NOW)).toBe(false)
  })

  it('keeps the previous cutoff until the visit stamp is written', () => {
    const storage = memoryStorage({ [LAST_VISIT_STORAGE_KEY]: String(NOW - 3 * DAY) })
    const cutoff = readLastVisit(storage)
    const added = new Date(NOW - 2 * DAY).toISOString()
    expect(isPortNew(added, cutoff, NOW)).toBe(true)

    writeLastVisit(storage, NOW)
    expect(isPortNew(added, cutoff, NOW)).toBe(true)
    expect(isPortNew(added, readLastVisit(storage), NOW)).toBe(false)
  })

  it('writes the stamp once, on hide and after the delay', () => {
    const storage = memoryStorage()
    const timers: Array<() => void> = []
    const listeners: Array<() => void> = []
    const host = {
      setTimeout(handler: () => void) {
        timers.push(handler)
        return 1
      },
      addEventListener(_type: string, handler: () => void) {
        listeners.push(handler)
      }
    }
    armLastVisitWrite(storage, LAST_VISIT_WRITE_DELAY_MS, host)
    armLastVisitWrite(storage, LAST_VISIT_WRITE_DELAY_MS, host)
    expect(timers).toHaveLength(1)
    expect(listeners).toHaveLength(1)

    listeners[0]()
    expect(readLastVisit(storage)).toBeGreaterThan(NOW - DAY)
    const stamped = readLastVisit(storage)
    timers[0]()
    expect(readLastVisit(storage)).toBeGreaterThanOrEqual(stamped ?? 0)
  })

  it('renders the badge only after the client has read localStorage', () => {
    const card = readFileSync(new URL('../app/components/PortCard.vue', import.meta.url), 'utf8')
    expect(card).toContain('v-if="showNew"')
    expect(card).toContain('useCatalogVisit')
    expect(card).toContain('isPortNew')
    const visit = readFileSync(new URL('../app/composables/useCatalogVisit.ts', import.meta.url), 'utf8')
    expect(visit).toContain('onMounted')
    expect(visit).toContain('localStorage')
    expect(visit).not.toContain('document.cookie')
  })
})

describe('catalog card meta line', () => {
  const allHeadsets = ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro']
  const quest3 = ['Quest 3']

  it('shows verified, otherwise installs only at 3 or more, and nothing below that', () => {
    expect(CATALOG_CARD_INSTALL_MIN).toBe(3)
    expect(buildCatalogCardMeta({ verified: true, installs: 12, hardware: allHeadsets })).toEqual({
      verified: true,
      text: '✓ Verified',
      suffix: ''
    })
    expect(buildCatalogCardMeta({ verified: false, installs: 3, hardware: allHeadsets })?.text).toBe('↓ 3 installs')
    expect(buildCatalogCardMeta({ verified: false, installs: 2, hardware: allHeadsets })).toBeNull()
    expect(buildCatalogCardMeta({ verified: false, installs: 0, hardware: allHeadsets })).toBeNull()
    expect(buildCatalogCardMeta({ verified: false, installs: 1, hardware: allHeadsets })).toBeNull()
    expect(buildCatalogCardMeta({ verified: false, installs: 1200, hardware: allHeadsets })?.text).toBe('↓ 1.2k installs')
    expect(buildCatalogCardMeta({ verified: true, installs: 1, hardware: allHeadsets })?.text).not.toMatch(/install/)
  })

  it('appends Quest 3 only when Quest 2 and Quest 3S are both absent', () => {
    expect(isQuest3Only(['Quest 3'])).toBe(true)
    expect(isQuest3Only(['Meta Quest 3'])).toBe(true)
    expect(isQuest3Only(['Quest 3', 'Quest Pro'])).toBe(true)
    expect(isQuest3Only(['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'])).toBe(false)
    expect(isQuest3Only(['Quest 3', 'Quest 3S'])).toBe(false)
    expect(isQuest3Only(['Quest 3', 'Meta Quest 3S'])).toBe(false)
    expect(isQuest3Only(['Oculus Quest 2', 'Quest 3'])).toBe(false)
    expect(isQuest3Only(['Quest Pro'])).toBe(false)
    expect(isQuest3Only([])).toBe(false)
    expect(isQuest3Only(null)).toBe(false)

    expect(buildCatalogCardMeta({ verified: true, installs: 9, hardware: quest3 })?.text).toBe('✓ Verified · Quest 3 only')
    expect(buildCatalogCardMeta({ verified: true, installs: 9, hardware: quest3 })?.suffix).toBe(' · Quest 3 only')
    expect(buildCatalogCardMeta({ verified: false, installs: 7, hardware: ['Quest 3', 'Quest Pro'] })?.text)
      .toBe('↓ 7 installs · Quest 3 only')
    expect(buildCatalogCardMeta({ verified: false, installs: 1, hardware: quest3 })?.text).toBe('Quest 3 only')
    expect(buildCatalogCardMeta({ verified: false, installs: 4, hardware: ['Quest 3', 'Quest 3S'] })?.text)
      .toBe('↓ 4 installs')
  })

  it('keeps a one-line description only when it fits', () => {
    expect(catalogCardDescription('Short tagline for the card.')).toBe('Short tagline for the card.')
    expect(catalogCardDescription('  spaced   out  ')).toBe('spaced out')
    expect(catalogCardDescription('')).toBeNull()
    expect(catalogCardDescription(null)).toBeNull()
    const long = 'A'.repeat(CARD_DESCRIPTION_MAX + 1)
    expect(catalogCardDescription(long)).toBeNull()
    expect(catalogCardDescription('A'.repeat(CARD_DESCRIPTION_MAX))).toHaveLength(CARD_DESCRIPTION_MAX)
  })
})

describe('catalog sort', () => {
  const ports = [
    { title: 'Bravo', last_github_update: '2026-01-01T00:00:00.000Z', created_at: '2026-10-02T00:00:00.000Z' },
    { title: 'Alpha', last_github_update: '2026-06-01T00:00:00.000Z', created_at: '2026-10-01T00:00:00.000Z' },
    { title: 'Charlie', last_github_update: null, created_at: '2026-10-12T00:00:00.000Z' },
    { title: 'Delta', last_github_update: '2026-03-01T00:00:00.000Z', created_at: null }
  ]

  it('keeps recently updated as the default and adds newest-created', () => {
    expect(DEFAULT_CATALOG_SORT).toBe('recent')
    expect(sortCatalogPorts(ports, 'recent').map(port => port.title)).toEqual(['Alpha', 'Delta', 'Bravo', 'Charlie'])
    expect(sortCatalogPorts(ports, 'az').map(port => port.title)).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta'])
    expect(sortCatalogPorts(ports, 'installs').map(port => port.title)).toEqual(['Alpha', 'Delta', 'Bravo', 'Charlie'])
    expect(sortCatalogPorts(ports, 'featured').map(port => port.title)).toEqual(['Alpha', 'Delta', 'Bravo', 'Charlie'])
    expect(sortCatalogPorts(ports, 'added').map(port => port.title)).toEqual(['Charlie', 'Bravo', 'Alpha', 'Delta'])
    expect(ports.map(port => port.title)).toEqual(['Bravo', 'Alpha', 'Charlie', 'Delta'])
  })

  it('orders most installed by the card count, then recently updated', () => {
    const counted = [
      { title: 'Low', installs: 1, last_github_update: '2026-10-01T00:00:00.000Z' },
      { title: 'HighOlder', installs: 9, last_github_update: '2026-01-01T00:00:00.000Z' },
      { title: 'HighNewer', installs: 9, last_github_update: '2026-08-01T00:00:00.000Z' },
      { title: 'None', installs: 0, last_github_update: '2026-12-01T00:00:00.000Z' },
      { title: 'Missing', last_github_update: '2026-11-01T00:00:00.000Z' },
      { title: 'Fraction', installs: 2.9, last_github_update: '2026-02-01T00:00:00.000Z' },
      { title: 'TiedFirst', installs: 4, last_github_update: '2026-05-01T00:00:00.000Z' },
      { title: 'TiedSecond', installs: 4, last_github_update: '2026-05-01T00:00:00.000Z' }
    ]
    expect(sortCatalogPorts(counted, 'installs').map(port => port.title)).toEqual([
      'HighNewer',
      'HighOlder',
      'TiedFirst',
      'TiedSecond',
      'Fraction',
      'Low',
      'None',
      'Missing'
    ])
    expect(sortCatalogPorts(counted, 'featured').map(port => port.title)).toEqual(
      sortCatalogPorts(counted, 'installs').map(port => port.title)
    )
    expect(resolveCatalogSort('featured')).toBe('installs')
    expect(resolveCatalogSort('installs')).toBe('installs')
    expect(resolveCatalogSort('nope')).toBeNull()
  })

  it('labels newest-created and last-update sorts without changing their values', () => {
    const index = readFileSync(new URL('../app/pages/index.vue', import.meta.url), 'utf8')
    expect(index).toContain('<option value="recent">Recently updated</option>')
    expect(index).toContain('<option value="added">Newest</option>')
    expect(index).toContain('<option value="installs">Most installed</option>')
    expect(index).not.toContain('Recently added')
    expect(index).not.toContain('>Recent</option>')
    expect(index).not.toContain('Recently Updated')
    expect(index).not.toContain('Featured First')
    expect(index).not.toContain('>Featured</option>')
    expect(index).not.toContain('value="featured"')
    expect(index.match(/value="recent"/g)).toHaveLength(2)
    expect(index.match(/value="added"/g)).toHaveLength(2)
    expect(index.match(/value="installs"/g)).toHaveLength(2)
    expect(index).toContain('sortCatalogPorts(list, sortBy.value)')
    expect(index).toContain('ref<CatalogSort>(DEFAULT_CATALOG_SORT)')
    expect(index).toContain("watch(sortBy, (value) => trackFilter('sort', value))")
    expect(index).toContain("value === 'recent'")

    const normalized = normalizeAnalyticsBody({
      event: 'filter_used',
      path: '/',
      props: { filter: 'sort', value: 'added' }
    })
    expect(normalized?.props).toEqual({ filter: 'sort', value: 'added' })
    const installsSort = normalizeAnalyticsBody({
      event: 'filter_used',
      path: '/',
      props: { filter: 'sort', value: 'installs' }
    })
    expect(installsSort?.props).toEqual({ filter: 'sort', value: 'installs' })

    const migrationsDir = new URL('../supabase/migrations/', import.meta.url)
    const filterConstraints = readdirSync(migrationsDir).filter(name => {
      const text = readFileSync(new URL(name, migrationsDir), 'utf8')
      return text.includes('analytics_events_filter_used')
    })
    expect(filterConstraints).toEqual(['20261009200000_analytics_events.sql'])
    const sql = readFileSync(new URL('20261009200000_analytics_events.sql', migrationsDir), 'utf8')
    expect(sql).toContain("'sort'")
    expect(sql).toContain("char_length(coalesce(props->>'value', '')) between 1 and 60")
    expect(sql).not.toContain("props->>'value' in")
    expect(catalogCategoryFromQuery('decompilation')).toBe('decompilation')
    expect(catalogCategoryFromQuery('nope')).toBe('all')
    expect(readCatalogQuery('?cat=emulator&q=doom&dev=Team+Beef&fbclid=abc')).toEqual({
      q: 'doom',
      cat: 'emulator',
      dev: 'Team Beef'
    })
    expect(readCatalogQuery('')).toEqual({ q: '', cat: 'all', dev: '' })
    expect(index).toContain('catalogCategoryFromQuery(route.query.cat)')
    expect(index).toContain('readCatalogQuery(window.location.search)')
    expect(index).toContain('!useNuxtApp().isHydrating')
    const detail = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    expect(detail).toContain('`/?cat=${encodeURIComponent(port.category)}`')
    expect(detail).toContain('`/?dev=${encodeURIComponent(port.developer)}`')
    expect(detail).toContain('aria-label="Supported headsets"')
    expect(detail).toContain('<PortVersion')
    expect(detail).toContain('formatStatus(port.status)')
  })
})
