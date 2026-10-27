/**
 * Send to Quest: pair a browser with the QuestPorts app and queue an install.
 * The USB install button does not use this module.
 *
 * Eligibility is the existing one-click rule (package id + a real APK asset).
 * `needs_files` is the same signal as the game-files / drop-zone step.
 */

import { PORT_PACKAGE_CONFIGS, isSelfContainedSideload } from '~/data/portPackageMap'
import {
  INSTALL_ERROR_REASONS,
  REMOTE_APP_OUTDATED_SURFACES,
  REMOTE_PAIR_FAIL_REASONS,
  browserFamilyFromUserAgent,
  cleanAppVersion,
  deviceFromUserAgent,
  type RemoteAppOutdatedSurface,
  type RemotePairFailReason
} from '~/lib/analytics'
import { comparePortVersions, numericVersionParts } from '~/lib/versionFormat'
import { refusesOneClickInstall } from '~/lib/patchOnlyInstall'
import { remoteInstallFlagEnabled } from '~/lib/remoteInstallFlag'

export { remoteInstallFlagEnabled }

/** First app release that has Remote install. Older builds have no code screen. */
export const REMOTE_INSTALL_MIN_APP_VERSION = '1.1.0'

export const REMOTE_BROWSER_STORAGE_KEY = 'questports_remote_browser'
export const REMOTE_REQUEST_STORAGE_KEY = 'questports_remote_request'
export const REMOTE_PREVIEW_HEADER = 'x-questports-remote-preview'

export const REMOTE_CODE_TTL_MS = 10 * 60 * 1000
export const REMOTE_REQUEST_TTL_MS = 24 * 60 * 60 * 1000
export const REMOTE_CODE_ATTEMPT_LIMIT = 5
export const REMOTE_CLAIM_FAIL_LIMIT = 5
export const REMOTE_CLAIM_LOCKOUT_MS = 60 * 1000
export const REMOTE_CODES_PER_HOUR = 10
export const REMOTE_REQUESTS_PER_HOUR = 10
export const REMOTE_QUEUE_LIMIT = 3
export const REMOTE_REGISTRATIONS_PER_HOUR = 10
export const REMOTE_HOUR_MS = 60 * 60 * 1000
/** Recent heartbeat: the headset app is probably in the foreground. */
export const REMOTE_APP_AWAKE_MS = 90 * 1000
/** Fast poll, then a slower one while the request is still only queued. */
export const REMOTE_POLL_FAST_MS = 2000
export const REMOTE_POLL_QUEUED_SLOW_AFTER_MS = 60 * 1000
export const REMOTE_POLL_QUEUED_SLOW_MS = 15 * 1000

/** No 0/O/1/I. Thirty-two symbols, shown as XXX-XXX. */
export const REMOTE_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export const REMOTE_REQUEST_STATUSES = [
  'queued',
  'received',
  'downloading',
  'awaiting_confirm',
  'installed',
  'failed',
  'cancelled',
  'expired'
] as const

export type RemoteRequestStatus = (typeof REMOTE_REQUEST_STATUSES)[number]

export const REMOTE_ACTIVE_STATUSES: readonly RemoteRequestStatus[] = [
  'queued',
  'received',
  'downloading',
  'awaiting_confirm'
]

export const REMOTE_TERMINAL_STATUSES: readonly RemoteRequestStatus[] = [
  'installed',
  'failed',
  'cancelled',
  'expired'
]

/** Device-reported statuses. `expired` is set by the server. */
export const REMOTE_DEVICE_STATUSES: readonly RemoteRequestStatus[] = [
  'received',
  'downloading',
  'awaiting_confirm',
  'installed',
  'failed',
  'cancelled'
]

/** Same reasons as install_error, including signature_conflict and busy. */
export const REMOTE_ERROR_REASONS = INSTALL_ERROR_REASONS

export type RemoteErrorReason = (typeof REMOTE_ERROR_REASONS)[number]

export { REMOTE_PAIR_FAIL_REASONS, REMOTE_APP_OUTDATED_SURFACES }
export type { RemotePairFailReason, RemoteAppOutdatedSurface }

export const REMOTE_PREVIEW_STATES = [
  'pair',
  'outdated',
  'waiting',
  'downloading',
  'confirm',
  'installed',
  'queued',
  'not-accepting',
  'failed'
] as const

export type RemotePreviewState = (typeof REMOTE_PREVIEW_STATES)[number]

export const INSTALL_BUTTON_CLASS =
  'flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90'

/**
 * Phones: the USB button stays, drawn as the outline.
 * md and up (tablet and desktop): it stays the filled primary button.
 */
export const INSTALL_BUTTON_CLASS_WITH_SEND =
  'order-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-4 py-3 text-xs font-semibold text-foreground transition-all hover:bg-muted/40 md:order-1 md:border-transparent md:bg-primary md:text-primary-foreground md:shadow-lg md:shadow-primary/25 md:hover:bg-primary/90'

export const SEND_BUTTON_CLASS =
  'order-1 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 md:order-2 md:border md:border-border md:bg-transparent md:text-foreground md:shadow-none md:hover:bg-muted/40'

export const REMOTE_APP_OUTDATED_TITLE =
  'Update the QuestPorts app on your Quest to use Send to Quest'

export const REMOTE_NOT_ACCEPTING_TITLE = "Your Quest isn't accepting installs"

export const REMOTE_NOT_ACCEPTING_DETAIL =
  "Turn on Accept install requests in the QuestPorts app on your headset. We'll send it as soon as it's on."

export const REMOTE_QUEUED_SLOW_TITLE = "Your Quest hasn't picked this up yet"

export const REMOTE_QUEUED_SLOW_DETAIL =
  'Make sure the QuestPorts app is open and Accept install requests is on.'

/**
 * Headset toggle. `1` / `true` is on, `0` / `false` is off.
 * Anything else, including a missing field, stays unknown.
 */
export function cleanAcceptingFlag(value: unknown): boolean | null {
  if (value === true || value === 1) return true
  if (value === false || value === 0) return false
  if (typeof value !== 'string') return null
  const text = value.trim().toLowerCase()
  if (text === '1' || text === 'true') return true
  if (text === '0' || text === 'false') return false
  return null
}

export function remoteInstallPreviewRequested(search: string | null | undefined): boolean {
  if (!search) return false
  const hashless = search.split('#')[0] || ''
  const queryIndex = hashless.indexOf('?')
  const query = queryIndex >= 0 ? hashless.slice(queryIndex + 1) : hashless
  return new URLSearchParams(query).get('remoteInstall') === '1'
}

export function remotePreviewFromSearch(search: string | null | undefined): RemotePreviewState | null {
  if (!remoteInstallPreviewRequested(search)) return null
  const hashless = String(search || '').split('#')[0] || ''
  const queryIndex = hashless.indexOf('?')
  const query = queryIndex >= 0 ? hashless.slice(queryIndex + 1) : hashless
  const value = new URLSearchParams(query).get('remotePreview')
  if (value && (REMOTE_PREVIEW_STATES as readonly string[]).includes(value)) {
    return value as RemotePreviewState
  }
  return null
}

/** Button visibility. The USB install path does not call this. */
export function showSendToQuestDecision(input: {
  ready: boolean
  questBrowser: boolean
  inApp: boolean
  eligible: boolean
  flag: unknown
  search: string | null | undefined
}): boolean {
  if (!input.ready || input.questBrowser || input.inApp || !input.eligible) return false
  return remoteInstallFlagEnabled(input.flag) || remoteInstallPreviewRequested(input.search)
}

export function remoteInstallEligible(slug: string | null | undefined, downloadUrl: string | null | undefined): boolean {
  return !refusesOneClickInstall(slug, downloadUrl)
}

/**
 * True when the port still needs the player's own files after the APK is on the headset.
 * Same rule as the drop-zone step: a self-contained sideload does not.
 */
export function portNeedsUserFiles(slug: string | null | undefined): boolean {
  const cfg = PORT_PACKAGE_CONFIGS[slug || '']
  if (!cfg) return false
  return !isSelfContainedSideload(cfg)
}

export function needsFilesProp(slug: string | null | undefined): 'true' | 'false' {
  return portNeedsUserFiles(slug) ? 'true' : 'false'
}

export function gameFilesPathForSlug(slug: string | null | undefined): string {
  const cfg = PORT_PACKAGE_CONFIGS[slug || '']
  if (!cfg) return ''
  if (cfg.targetPath) return cfg.targetPath
  const folder = cfg.folders?.find(item => item.required)
  return folder?.targetPath || ''
}

export function remoteAppSupportsInstall(appVersion: string | null | undefined): boolean {
  const version = String(appVersion || '').trim()
  if (!version || numericVersionParts(version).length === 0) return false
  return comparePortVersions(version, REMOTE_INSTALL_MIN_APP_VERSION) >= 0
}

export function cleanDeviceModel(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const value = input.replace(/[\u0000-\u001f]/g, '').replace(/\s+/g, ' ').trim()
  if (!value || value.length > 40) return null
  if (!/^[a-zA-Z0-9 .+-]+$/.test(value)) return null
  return value
}

export function questDisplayName(model: string | null | undefined): string {
  return cleanDeviceModel(model) || 'Quest'
}

export function sendToQuestLabel(model: string | null | undefined, paired: boolean): string {
  if (!paired) return 'Send to Quest'
  return `Send to ${questDisplayName(model)}`
}

export function normalizePairCode(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function isRemotePairCode(input: string): boolean {
  return input.length === 6 && [...input].every(char => REMOTE_CODE_ALPHABET.includes(char))
}

export function formatPairCode(input: string): string {
  const raw = normalizePairCode(input).slice(0, 6)
  if (raw.length <= 3) return raw
  return `${raw.slice(0, 3)}-${raw.slice(3)}`
}

export function remoteDeviceChannel(deviceId: string): string {
  return `qp-device-${deviceId}`
}

export function isRemoteRequestStatus(value: unknown): value is RemoteRequestStatus {
  return typeof value === 'string' && (REMOTE_REQUEST_STATUSES as readonly string[]).includes(value)
}

export function isRemoteActiveStatus(status: RemoteRequestStatus): boolean {
  return (REMOTE_ACTIVE_STATUSES as readonly string[]).includes(status)
}

/** Forward-only, except a repeated `downloading` (progress) and failure or cancel. */
export function remoteStatusTransition(from: RemoteRequestStatus, to: RemoteRequestStatus): boolean {
  if ((REMOTE_TERMINAL_STATUSES as readonly string[]).includes(from)) return false
  if (to === 'expired') return isRemoteActiveStatus(from)
  if (to === 'failed' || to === 'cancelled') return true
  if (from === to) return to === 'downloading'
  const order: RemoteRequestStatus[] = ['queued', 'received', 'downloading', 'awaiting_confirm', 'installed']
  const left = order.indexOf(from)
  const right = order.indexOf(to)
  return left >= 0 && right > left
}

export function cleanRemoteErrorReason(value: unknown): RemoteErrorReason | null {
  if (typeof value !== 'string') return null
  if ((REMOTE_ERROR_REASONS as readonly string[]).includes(value)) return value as RemoteErrorReason
  return null
}

export function cleanRemoteProgress(value: unknown): number | null {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN
  if (!Number.isFinite(number)) return null
  return Math.min(100, Math.max(0, Math.round(number)))
}

export function cleanRemoteDetail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return null
  return text.slice(0, 180)
}

export function questAppLooksAwake(lastSeen: string | null | undefined, now: number): boolean {
  if (!lastSeen) return false
  const stamp = Date.parse(lastSeen)
  if (!Number.isFinite(stamp)) return false
  return now - stamp >= 0 && now - stamp <= REMOTE_APP_AWAKE_MS
}

export function remotePollDelayMs(input: {
  status: RemoteRequestStatus
  ageMs: number
  hidden: boolean
  /** Keep the fast poll while the headset has Accept install requests turned off. */
  accepting?: boolean | null
}): number | null {
  if ((REMOTE_TERMINAL_STATUSES as readonly string[]).includes(input.status)) return null
  if (input.hidden) return null
  if (
    input.status === 'queued'
    && input.accepting !== false
    && input.ageMs >= REMOTE_POLL_QUEUED_SLOW_AFTER_MS
  ) {
    return REMOTE_POLL_QUEUED_SLOW_MS
  }
  return REMOTE_POLL_FAST_MS
}

export function remoteFailureCopy(reason: string | null | undefined): string {
  switch (reason) {
    case 'user_cancelled':
      return 'Install was cancelled on the Quest.'
    case 'download_fail':
      return 'The headset could not download the APK.'
    case 'storage':
      return 'The headset does not have enough free space.'
    case 'pm_fail':
      return 'Android could not install the package.'
    case 'signature_conflict':
      return 'A different signature is already installed. Uninstall that copy on the Quest, then try again.'
    case 'busy':
      return 'The headset is already installing something. Try again in a moment.'
    case 'timeout':
      return 'The headset took too long. Try again.'
    case 'too_large':
      return 'The download was rejected as too large.'
    default:
      return 'The install failed on the Quest.'
  }
}

export function remoteFilesNote(path: string | null | undefined): string {
  const dest = path ? ` Copy them to ${path}.` : ''
  return `The APK is on your Quest. This port still needs your own game files, and Send to Quest cannot copy them.${dest} Plug in a USB cable and use the drop zone on this page once the headset is connected, or follow the manual steps in the installation guide.`
}

export function remoteAppOutdatedDetail(version: string | null | undefined): string {
  const current = version ? ` This headset is running ${version}.` : ''
  return `Send to Quest needs QuestPorts ${REMOTE_INSTALL_MIN_APP_VERSION} or newer.${current} Update the app from its home screen, or reinstall it from the app page. USB install on this page still works.`
}

export interface RemoteStatusView {
  tone: 'progress' | 'wait' | 'confirm' | 'ok' | 'error' | 'queued'
  title: string
  detail: string
  progress: number | null
  showRetry: boolean
  showCancel: boolean
  showFilesNote: boolean
}

export function remoteStatusView(input: {
  status: RemoteRequestStatus
  progress: number | null
  errorReason: string | null
  model: string | null
  title: string
  version: string
  lastSeen: string | null
  now: number
  needsFiles: boolean
  filesPath: string
  /** `false` when the headset app says Accept install requests is off. Missing means unknown. */
  accepting?: boolean | null
  /** How long this request has stayed queued. Omitted calls keep the previous copy. */
  ageMs?: number
}): RemoteStatusView {
  const name = questDisplayName(input.model)
  const version = input.version ? ` ${input.version}` : ''
  const sent = `Sent ${input.title}${version} to ${name}.`
  if (input.status === 'queued') {
    const accepting = input.accepting ?? null
    const ageMs = input.ageMs ?? 0
    if (accepting === false) {
      return {
        tone: 'queued',
        title: REMOTE_NOT_ACCEPTING_TITLE,
        detail: REMOTE_NOT_ACCEPTING_DETAIL,
        progress: null,
        showRetry: false,
        showCancel: true,
        showFilesNote: false
      }
    }
    if (ageMs >= REMOTE_POLL_QUEUED_SLOW_AFTER_MS) {
      return {
        tone: 'queued',
        title: REMOTE_QUEUED_SLOW_TITLE,
        detail: REMOTE_QUEUED_SLOW_DETAIL,
        progress: null,
        showRetry: false,
        showCancel: true,
        showFilesNote: false
      }
    }
    const awake = questAppLooksAwake(input.lastSeen, input.now)
    return {
      tone: awake ? 'wait' : 'queued',
      title: awake ? 'Waiting for your Quest…' : 'Queued · your Quest has not picked this up yet',
      detail: awake
        ? `${sent} Keep the QuestPorts app open on the headset.`
        : 'The QuestPorts app looks closed, or the headset is asleep. It starts when you open the app. This request expires in 24 hours.',
      progress: null,
      showRetry: false,
      showCancel: true,
      showFilesNote: false
    }
  }
  if (input.status === 'received') {
    return {
      tone: 'wait',
      title: 'Your Quest received it',
      detail: sent,
      progress: null,
      showRetry: false,
      showCancel: true,
      showFilesNote: false
    }
  }
  if (input.status === 'downloading') {
    const pct = input.progress == null ? null : input.progress
    return {
      tone: 'progress',
      title: pct == null ? 'Downloading on your Quest' : `Downloading on your Quest · ${pct}%`,
      detail: 'You can take the headset off. You will need it on for the Android install confirmation.',
      progress: pct,
      showRetry: false,
      showCancel: true,
      showFilesNote: false
    }
  }
  if (input.status === 'awaiting_confirm') {
    return {
      tone: 'confirm',
      title: 'Confirm install in your headset',
      detail: 'Put on your Quest and tap Install in the Android dialog. This step cannot be skipped.',
      progress: null,
      showRetry: false,
      showCancel: false,
      showFilesNote: false
    }
  }
  if (input.status === 'installed') {
    return {
      tone: 'ok',
      title: `Installed on ${name}`,
      detail: input.needsFiles
        ? 'The APK is installed. The game files still have to come from your PC.'
        : 'Open it from your headset library, under Unknown Sources.',
      progress: null,
      showRetry: false,
      showCancel: false,
      showFilesNote: input.needsFiles
    }
  }
  if (input.status === 'cancelled') {
    return {
      tone: 'error',
      title: 'Install cancelled on the Quest',
      detail: 'You can send it again. USB install on this page still works.',
      progress: null,
      showRetry: true,
      showCancel: false,
      showFilesNote: false
    }
  }
  if (input.status === 'expired') {
    return {
      tone: 'error',
      title: 'This request expired',
      detail: 'It was not picked up within 24 hours. Send it again when the headset is nearby.',
      progress: null,
      showRetry: true,
      showCancel: false,
      showFilesNote: false
    }
  }
  return {
    tone: 'error',
    title: 'Install failed',
    detail: remoteFailureCopy(input.errorReason),
    progress: null,
    showRetry: true,
    showCancel: false,
    showFilesNote: false
  }
}

export interface StoredRemoteBrowser {
  token: string
  deviceId: string
  name: string
  model: string
  appVersion: string | null
}

export interface StoredRemoteRequest {
  id: string
  slug: string
  createdAt: string
}

type KeyValueStore = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

function readJson(storage: KeyValueStore | null | undefined, key: string): unknown {
  if (!storage) return null
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function readStoredBrowser(storage: KeyValueStore | null | undefined): StoredRemoteBrowser | null {
  const value = readJson(storage, REMOTE_BROWSER_STORAGE_KEY)
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const token = typeof row.token === 'string' ? row.token.trim() : ''
  const deviceId = typeof row.deviceId === 'string' ? row.deviceId.trim() : ''
  if (token.length < 20 || token.length > 200 || !deviceId) return null
  const appVersion = typeof row.appVersion === 'string' ? cleanAppVersion(row.appVersion) : null
  return {
    token,
    deviceId,
    name: cleanDeviceModel(row.name) || 'Quest',
    model: cleanDeviceModel(row.model) || 'Quest',
    appVersion
  }
}

export function writeStoredBrowser(
  storage: KeyValueStore | null | undefined,
  value: StoredRemoteBrowser
): void {
  if (!storage) return
  try {
    storage.setItem(REMOTE_BROWSER_STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Private mode can reject the write. The next send asks to pair again.
  }
}

export function clearStoredBrowser(storage: KeyValueStore | null | undefined): void {
  if (!storage) return
  try {
    storage.removeItem(REMOTE_BROWSER_STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
}

export function readStoredRequest(storage: KeyValueStore | null | undefined): StoredRemoteRequest | null {
  const value = readJson(storage, REMOTE_REQUEST_STORAGE_KEY)
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const id = typeof row.id === 'string' ? row.id.trim() : ''
  const slug = typeof row.slug === 'string' ? row.slug.trim() : ''
  const createdAt = typeof row.createdAt === 'string' ? row.createdAt : ''
  if (!id || !slug) return null
  return { id, slug, createdAt }
}

export function writeStoredRequest(
  storage: KeyValueStore | null | undefined,
  value: StoredRemoteRequest
): void {
  if (!storage) return
  try {
    storage.setItem(REMOTE_REQUEST_STORAGE_KEY, JSON.stringify(value))
  } catch {
    // The status card can still poll until the page reloads.
  }
}

export function clearStoredRequest(storage: KeyValueStore | null | undefined): void {
  if (!storage) return
  try {
    storage.removeItem(REMOTE_REQUEST_STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
}

export function remoteBrowserLabel(userAgent: string | null | undefined): string {
  const browser = browserFamilyFromUserAgent(userAgent) || 'Browser'
  const ua = userAgent || ''
  let host = 'computer'
  if (/iphone|ipod/i.test(ua)) host = 'iPhone'
  else if (/ipad/i.test(ua)) host = 'iPad'
  else if (/android/i.test(ua) && deviceFromUserAgent(ua) === 'mobile') host = 'Android'
  else if (deviceFromUserAgent(ua) === 'tablet') host = 'tablet'
  else if (/windows/i.test(ua)) host = 'Windows'
  else if (/mac os x/i.test(ua)) host = 'Mac'
  return `${browser} on ${host}`.slice(0, 60)
}

export function isRemotePairFailReason(value: unknown): value is RemotePairFailReason {
  return typeof value === 'string' && (REMOTE_PAIR_FAIL_REASONS as readonly string[]).includes(value)
}

export function isRemoteAppOutdatedSurface(value: unknown): value is RemoteAppOutdatedSurface {
  return typeof value === 'string' && (REMOTE_APP_OUTDATED_SURFACES as readonly string[]).includes(value)
}
