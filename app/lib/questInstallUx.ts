/** Decisions for the one-click Quest install card. The page renders these; tests cover them. */

export const INSTALL_ACTION_LABEL = 'Install on Quest'

/** Shown only while Send to Quest sits next to this button. */
export const INSTALL_VIA_USB_LABEL = 'Install via USB'

export const USB_PREP_STORAGE_KEY = 'questports_usb_connected'

export const CHOOSER_DISMISSED_TITLE = "Don't see your Quest in the list?"

export const CHOOSER_DISMISSED_MESSAGE = CHOOSER_DISMISSED_TITLE

/** Shared with the connect-failure checklist so the cable and headset lines stay in one place. */
export const CONNECT_CABLE_STEP = 'Use a data cable (not charge-only).'

export const CONNECT_HEADSET_STEP = 'Headset on and unlocked.'

export const CONNECT_DEVELOPER_STEP = 'Developer Mode enabled.'

/** Short list when the headset never gets as far as the USB debugging prompt. */
export const CONNECT_FAILURE_STEPS = [
  CONNECT_CABLE_STEP,
  CONNECT_DEVELOPER_STEP,
  CONNECT_HEADSET_STEP
] as const

/** Compact checklist after the USB picker is closed. Calm on purpose: the visitor may have cancelled. */
export const CHOOSER_DISMISSED_STEPS = [
  CONNECT_CABLE_STEP,
  CONNECT_HEADSET_STEP,
  'Accept the "Allow USB debugging" prompt inside the headset (tick Always allow).',
  CONNECT_DEVELOPER_STEP,
  'Try another USB port.'
] as const

export const WEBUSB_UNSUPPORTED_NOTICE = 'Use Chrome or Edge'

export const USB_PREP_STEPS = [
  'Plug the Quest in with a USB cable.',
  'Enable Developer Mode.',
  'Put the headset on and accept "Allow USB debugging" when asked.'
] as const

type KeyValueStore = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function isWebUsbAvailable(
  nav: object | null | undefined,
  secureContext: boolean,
  options?: { forceUnsupported?: boolean }
): boolean {
  if (options?.forceUnsupported) return false
  return Boolean(secureContext && nav && 'usb' in nav)
}

export function hasRememberedQuestConnection(storage: Pick<KeyValueStore, 'getItem'> | null | undefined): boolean {
  if (!storage) return false
  try {
    return storage.getItem(USB_PREP_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function rememberQuestConnection(storage: Pick<KeyValueStore, 'setItem'> | null | undefined): void {
  if (!storage) return
  try {
    storage.setItem(USB_PREP_STORAGE_KEY, '1')
  } catch {
    // Private mode can reject storage writes. The explainer can show again.
  }
}

export function forgetQuestConnection(storage: Pick<KeyValueStore, 'removeItem'> | null | undefined): void {
  if (!storage) return
  try {
    storage.removeItem(USB_PREP_STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
}

/** Returning users who already connected skip the explainer unless they ask to see it. */
export function shouldShowUsbPrep(remembered: boolean, requestedAgain: boolean): boolean {
  return requestedAgain || !remembered
}

export function primaryInstallBlocked(input: {
  showPrep: boolean
  picker: boolean
  authorizing: boolean
  dismissed: boolean
  connectionError: boolean
  installing: boolean
  supported: boolean
  /** Known file size is already over the proxy cap, so one-click would only 413. */
  tooLarge?: boolean
}): boolean {
  return !input.supported
    || input.showPrep
    || input.picker
    || input.authorizing
    || input.dismissed
    || input.connectionError
    || input.installing
    || Boolean(input.tooLarge)
}

export function progressBarA11y(percent: number, indeterminate: boolean, statusText: string) {
  const now = Math.min(100, Math.max(0, Math.round(percent || 0)))
  return {
    role: 'progressbar' as const,
    ariaValuemin: 0,
    ariaValuemax: 100,
    ariaValuenow: indeterminate ? undefined : now,
    ariaValuetext: indeterminate ? statusText : `${now}%`,
    ariaLive: 'polite' as const
  }
}

/** Shown before install on ports that still need the player's own files. Copy only: no step is blocked or reordered. */
export const TWO_STEP_TITLE = 'This game has 2 steps'

export const TWO_STEP_APP_LINE = 'Install the app on your Quest.'

export function twoStepFilesLine(store: string | null | undefined): string {
  const source = String(store || '').trim()
  return source
    ? `Add the game files from your own copy (${source}). You can send them over USB or copy them yourself.`
    : 'Add the game files from your own copy. You can send them over USB or copy them yourself.'
}

export const INSTALLED_APP_ONLY_TITLE = 'App installed. Game files still needed.'

export const INSTALLED_APP_ONLY_NOTE = 'The game will not start until its files are on the Quest. Step 2 is right below.'

export const INSTALLED_FILES_UNKNOWN_TITLE = 'App installed'

export const INSTALLED_FILES_CHECKING_NOTE = 'Checking the Quest for game files…'

export const INSTALLED_FILES_UNKNOWN_NOTE = 'Check Step 2 below for the game files.'

export const GAME_FILES_ON_PC_LABEL = 'What to take from your PC'

/**
 * ready: nothing to flag (files found, no files needed, or an update is the news).
 * missing: a finished scan read the folder and did not find the files.
 * unknown: still scanning, the scan failed, or Android would not let it read the folder.
 * Only `missing` may tell the player the game will not start.
 */
export type InstalledFilesState = 'ready' | 'missing' | 'unknown'

export function installedFilesState(input: {
  needsGameFiles: boolean
  filesReady: boolean
  outdated: boolean
  scanned: boolean
  unverifiable: boolean
}): InstalledFilesState {
  if (!input.needsGameFiles || input.filesReady || input.outdated) return 'ready'
  if (!input.scanned || input.unverifiable) return 'unknown'
  return 'missing'
}
