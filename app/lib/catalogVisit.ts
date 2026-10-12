/**
 * "New" on a catalog card.
 *
 * The date is public.ports.created_at (timestamptz, not null, already on the
 * table). It is the row's insert time. There is no added_at column.
 *
 * The cutoff is the visitor's previous visit, stored in localStorage so it
 * works in the browser and in the QuestPorts app WebView. The stamp is written
 * on page hide and again after a short delay. This visit keeps the stamp it
 * read at the start, so the badges stay up while the page is open. A refresh
 * before that delay still counts as the same visit. A first visit (nothing
 * stored) treats ports added in the last 7 days as new.
 */

export const LAST_VISIT_STORAGE_KEY = 'questports_last_visit'
export const NEW_PORT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000
export const LAST_VISIT_WRITE_DELAY_MS = 30_000

export interface VisitStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function readLastVisit(storage: VisitStorage | null | undefined): number | null {
  if (!storage) return null
  try {
    const raw = storage.getItem(LAST_VISIT_STORAGE_KEY)
    if (!raw) return null
    const value = Number(raw)
    if (!Number.isFinite(value) || value < 0) return null
    return value
  } catch {
    return null
  }
}

export function writeLastVisit(storage: VisitStorage | null | undefined, now: number): void {
  if (!storage || !Number.isFinite(now)) return
  try {
    storage.setItem(LAST_VISIT_STORAGE_KEY, String(Math.floor(now)))
  } catch {
    // Private mode and some WebViews throw. The badges still work for this visit.
  }
}

/**
 * True when the port should wear the New badge.
 * lastVisit null means a first visit. addedAt is ports.created_at.
 */
export function isPortNew(
  addedAt: string | null | undefined,
  lastVisit: number | null,
  now: number
): boolean {
  if (!addedAt || !Number.isFinite(now)) return false
  const added = Date.parse(addedAt)
  if (!Number.isFinite(added) || added > now) return false
  if (lastVisit == null) return now - added <= NEW_PORT_WINDOW_MS
  return added > lastVisit
}

export interface VisitHost {
  setTimeout(handler: () => void, timeout: number): unknown
  addEventListener(type: string, handler: () => void): void
}

let lastVisitWriteArmed = false

/** One writer per page load. A second call does not stack timers. */
export function armLastVisitWrite(
  storage: VisitStorage | null | undefined,
  delayMs = LAST_VISIT_WRITE_DELAY_MS,
  host?: VisitHost | null
): void {
  if (lastVisitWriteArmed || !storage) return
  const target = host ?? (typeof window === 'undefined' ? null : window)
  if (!target) return
  lastVisitWriteArmed = true
  const write = () => writeLastVisit(storage, Date.now())
  target.setTimeout(write, delayMs)
  target.addEventListener('pagehide', write)
}

export function resetCatalogVisitForTests(): void {
  lastVisitWriteArmed = false
}
