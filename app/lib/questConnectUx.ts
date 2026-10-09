import { CHOOSER_DISMISSED_MESSAGE } from '~/lib/questInstallUx'

export type ConnectPhase = 'idle' | 'picker' | 'authorizing' | 'connected' | 'error'

export const QUEST_PICKER_HINT = 'Select your Quest in the browser window.'

export const QUEST_NO_DEVICE_HINT = CHOOSER_DISMISSED_MESSAGE

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
