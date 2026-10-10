import { CHOOSER_DISMISSED_MESSAGE } from '~/lib/questInstallUx'
import { QUEST_USB_MESSAGES } from '~/lib/questUsbMessages'

export type ConnectPhase = 'idle' | 'picker' | 'authorizing' | 'connected' | 'error'

export const QUEST_PICKER_HINT = 'Select your Quest in the browser window.'

export const QUEST_NO_DEVICE_HINT = CHOOSER_DISMISSED_MESSAGE

export const AUTHORIZE_PROMPT_LEAD =
  'Put on your headset and tap Allow (tick Always allow from this computer).'

export const AUTHORIZE_STILL_WAITING_TITLE = 'Still waiting?'

export const AUTHORIZE_STILL_WAITING_STEPS = [
  'Keep the headset awake.',
  'The prompt may be hidden behind another window.',
  'Unplug the cable and plug it back in.'
] as const

/** Show the still-waiting hint once the RSA prompt has been up this long. */
export const AUTHORIZE_WAIT_HINT_MS = 20_000

export function authorizeWaitHintVisible(elapsedMs: number, thresholdMs = AUTHORIZE_WAIT_HINT_MS): boolean {
  return elapsedMs >= thresholdMs
}

/** `?mockAuthorizeWait=1` shows the still-waiting hint immediately, for screenshots. */
export function mockAuthorizeWaitFromSearch(value: string | null | undefined): boolean {
  if (!value) return false
  const hashless = value.split('#')[0] || ''
  const queryIndex = hashless.indexOf('?')
  const query = queryIndex >= 0 ? hashless.slice(queryIndex + 1) : hashless
  return new URLSearchParams(query).get('mockAuthorizeWait') === '1'
}

/** Timeout, deny, and unauthorized are the RSA prompt, not a cable failure. */
export function isAuthorizeConnectionError(message: string | null | undefined): boolean {
  if (!message) return false
  if (
    message === QUEST_USB_MESSAGES.timeout
    || message === QUEST_USB_MESSAGES.cancelled
    || message === QUEST_USB_MESSAGES.unauthorized
  ) {
    return true
  }
  return /unauthorized|authorization timed out|allow usb debugging/i.test(message)
}

export type MockUsbError = 'locked' | 'cancelled'

/** `?mockUsbError=locked` or `?mockUsbError=cancelled`, for screenshots and tests. */
export function mockUsbErrorFromSearch(value: string | null | undefined): MockUsbError | null {
  if (!value) return null
  const hashless = value.split('#')[0] || ''
  const queryIndex = hashless.indexOf('?')
  const query = queryIndex >= 0 ? hashless.slice(queryIndex + 1) : hashless
  const flag = new URLSearchParams(query).get('mockUsbError')
  if (flag === 'locked' || flag === 'cancelled') return flag
  return null
}

export interface QuestConnectChrome {
  /** Amber “put on the headset / Allow USB debugging” banner. */
  showHeadsetBanner: boolean
  /** Browser chooser is open. The headset has not been selected yet. */
  showPickerHint: boolean
  status: 'connected' | 'authorizing' | 'disconnected'
  navbar: 'connected' | 'authorizing' | 'picker' | 'connect'
}

export function questConnectChrome(phase: ConnectPhase, connected: boolean): QuestConnectChrome {
  if (connected || phase === 'connected') {
    return {
      showHeadsetBanner: false,
      showPickerHint: false,
      status: 'connected',
      navbar: 'connected'
    }
  }
  if (phase === 'authorizing') {
    return {
      showHeadsetBanner: true,
      showPickerHint: false,
      status: 'authorizing',
      navbar: 'authorizing'
    }
  }
  if (phase === 'picker') {
    return {
      showHeadsetBanner: false,
      showPickerHint: true,
      status: 'disconnected',
      navbar: 'picker'
    }
  }
  return {
    showHeadsetBanner: false,
    showPickerHint: false,
    status: 'disconnected',
    navbar: 'connect'
  }
}

/** Chrome rejects requestDevice() with NotFoundError when the chooser is closed with no device. */
export function isUsbChooserDismissed(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const name = 'name' in err ? String((err as { name?: unknown }).name || '') : ''
  const message = 'message' in err ? String((err as { message?: unknown }).message || '') : ''
  if (name === 'NotFoundError') return true
  return /no device selected/i.test(message)
}
