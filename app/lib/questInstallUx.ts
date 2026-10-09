/** Decisions for the one-click Quest install card. The page renders these; tests cover them. */

export const INSTALL_ACTION_LABEL = 'Install on Quest'

export const USB_PREP_STORAGE_KEY = 'questports_usb_connected'

export const CHOOSER_DISMISSED_MESSAGE = 'No headset selected. Try again when ready.'

export const WEBUSB_UNSUPPORTED_NOTICE =
  'One-click install needs Chrome or Edge on desktop or Android.'

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
}): boolean {
  return !input.supported
    || input.showPrep
    || input.picker
    || input.authorizing
    || input.dismissed
    || input.connectionError
    || input.installing
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
