import {
  AUTHORIZE_STILL_WAITING_STEPS,
  QUEST_PICKER_HINT,
  type QuestConnectChrome
} from '~/lib/questConnectUx'
import { CONNECT_FAILURE_STEPS } from '~/lib/questInstallUx'

export const NAVBAR_CONNECT_LABEL = 'Connect Quest'
export const NAVBAR_CONNECT_LABEL_SHORT = 'Connect'
export const NAVBAR_AUTHORIZING_LABEL = 'Authorizing Quest...'
export const NAVBAR_AUTHORIZING_LABEL_SHORT = 'Wait'
export const NAVBAR_PICKER_LABEL_SHORT = 'USB'
export const NAVBAR_GUIDANCE_LABEL_SHORT = 'Browser'

export type NavbarUsbOffer = 'connect' | 'unsupported' | 'quest-browser' | 'hidden'

export type NavbarConnectPanelMode = 'picker' | 'authorizing' | 'chooser' | 'locked' | 'failed'

/**
 * App mode and Quest Browser cannot start WebUSB (the headset cannot install onto itself).
 * A preview user-agent and a browser without WebUSB get the unsupported-browser notice instead of a dead control.
 */
export function navbarUsbOffer(input: {
  inApp: boolean
  questBrowser: boolean
  webUsbSupported: boolean
  previewUnsupported: boolean
}): NavbarUsbOffer {
  if (input.inApp) return 'hidden'
  if (input.questBrowser) return 'quest-browser'
  if (input.previewUnsupported || !input.webUsbSupported) return 'unsupported'
  return 'connect'
}

export function navbarConnectLabels(navbar: QuestConnectChrome['navbar']): { full: string; short: string } {
  if (navbar === 'authorizing') {
    return { full: NAVBAR_AUTHORIZING_LABEL, short: NAVBAR_AUTHORIZING_LABEL_SHORT }
  }
  if (navbar === 'picker') {
    return { full: QUEST_PICKER_HINT, short: NAVBAR_PICKER_LABEL_SHORT }
  }
  return { full: NAVBAR_CONNECT_LABEL, short: NAVBAR_CONNECT_LABEL_SHORT }
}

/** Picker and headset authorization already have a connect in flight. */
export function navbarConnectBusy(navbar: QuestConnectChrome['navbar']): boolean {
  return navbar === 'picker' || navbar === 'authorizing'
}

/**
 * Same priority as the install card: headset banner, then the browser chooser,
 * then a dismissed chooser, then USB locked, then any other connection error.
 * Install-started connects keep that card; this panel is only for a navbar connect.
 */
export function navbarConnectPanelMode(input: {
  origin: 'navbar' | 'install' | null
  connected: boolean
  panelRequested: boolean
  picker: boolean
  authorizing: boolean
  notice: string | null
  error: string | null
  usbLockedMessage: string
}): NavbarConnectPanelMode | null {
  if (input.origin !== 'navbar' || input.connected || !input.panelRequested) return null
  if (input.authorizing) return 'authorizing'
  if (input.picker) return 'picker'
  if (input.notice) return 'chooser'
  if (input.error && input.error === input.usbLockedMessage) return 'locked'
  if (input.error) return 'failed'
  return null
}

export function navbarConnectFailureSteps(authorizeError: boolean): readonly string[] {
  return authorizeError ? AUTHORIZE_STILL_WAITING_STEPS : CONNECT_FAILURE_STEPS
}
