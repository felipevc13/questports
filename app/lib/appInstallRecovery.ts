/**
 * App-bridge installs keep running after the port page unmounts.
 * The pending row is how a later page load can record the result once.
 */

export const APP_INSTALL_PENDING_KEY = 'questports_app_install_pending'
export const APP_INSTALL_RECORDED_KEY = 'questports_app_install_recorded'
/** Silence this long, with the package still unchanged, becomes a timeout error. */
export const APP_INSTALL_RECOVERY_MS = 10 * 60 * 1000

const RECORDED_MAX = 40

export interface KeyValueStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface PendingAppInstall {
  requestId: string
  slug: string
  packageName: string
  path: string
  startedAt: number
  /** Last downloading/installing event. The 10 minute clock uses this. */
  progressAt: number
  wasInstalled: boolean
  previousVersion: string | null
}

export type AppInstallRecovery = 'success' | 'timeout' | 'wait'

function readJson(storage: KeyValueStore, key: string): unknown {
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function readPendingAppInstall(storage: KeyValueStore): PendingAppInstall | null {
  const value = readJson(storage, APP_INSTALL_PENDING_KEY)
  if (!value || typeof value !== 'object') return null
  const row = value as Partial<PendingAppInstall>
  const requestId = typeof row.requestId === 'string' ? row.requestId.trim() : ''
  const slug = typeof row.slug === 'string' ? row.slug.trim() : ''
  const path = typeof row.path === 'string' ? row.path.trim() : ''
  const startedAt = typeof row.startedAt === 'number' && Number.isFinite(row.startedAt) ? row.startedAt : 0
  if (!requestId || !slug || !path || startedAt <= 0) return null
  const progressAt = typeof row.progressAt === 'number' && Number.isFinite(row.progressAt)
    ? row.progressAt
    : startedAt
  return {
    requestId,
    slug,
    packageName: typeof row.packageName === 'string' ? row.packageName.trim() : '',
    path,
    startedAt,
    progressAt,
    wasInstalled: row.wasInstalled === true,
    previousVersion: typeof row.previousVersion === 'string' ? row.previousVersion : null
  }
}

export function writePendingAppInstall(storage: KeyValueStore, pending: PendingAppInstall): void {
  try {
    storage.setItem(APP_INSTALL_PENDING_KEY, JSON.stringify(pending))
  } catch {
    // A full store means this install cannot be recovered after a reload.
  }
}

export function clearPendingAppInstall(storage: KeyValueStore): void {
  try {
    storage.removeItem(APP_INSTALL_PENDING_KEY)
  } catch {
    // Ignore.
  }
}

export function touchPendingAppInstall(storage: KeyValueStore, requestId: string, now: number): void {
  const pending = readPendingAppInstall(storage)
  if (!pending || pending.requestId !== requestId) return
  writePendingAppInstall(storage, { ...pending, progressAt: now })
}

function recordedIds(storage: KeyValueStore): string[] {
  const value = readJson(storage, APP_INSTALL_RECORDED_KEY)
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
}

/**
 * First caller records the result for this request. Later callers do not.
 * An empty id cannot be deduped and is allowed through.
 */
export function takeAppInstallResult(storage: KeyValueStore, requestId: string): boolean {
  const id = requestId.trim()
  if (!id) return true
  const ids = recordedIds(storage)
  if (ids.includes(id)) return false
  ids.push(id)
  try {
    storage.setItem(APP_INSTALL_RECORDED_KEY, JSON.stringify(ids.slice(-RECORDED_MAX)))
  } catch {
    // Still record this once. A later reload may not see the claim.
  }
  const pending = readPendingAppInstall(storage)
  if (pending?.requestId === id) clearPendingAppInstall(storage)
  return true
}

/**
 * Infer a missed callback from the bridge.
 * A package that was already installed only counts when its version changed.
 */
export function appInstallRecoveryDecision(input: {
  pending: PendingAppInstall
  now: number
  installed: boolean
  version: string | null
  timeoutMs?: number
}): AppInstallRecovery {
  const version = typeof input.version === 'string' ? input.version : ''
  const previous = input.pending.previousVersion || ''
  const appeared = input.installed && (!input.pending.wasInstalled || (version !== '' && version !== previous))
  if (appeared) return 'success'
  const timeoutMs = input.timeoutMs ?? APP_INSTALL_RECOVERY_MS
  const progressAt = input.pending.progressAt || input.pending.startedAt
  if (input.now - progressAt >= timeoutMs) return 'timeout'
  return 'wait'
}
