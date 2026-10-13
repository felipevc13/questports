import { deviceFromUserAgent } from '~/lib/analytics'

/**
 * Desktop prompt after the first successful game install on a connected Quest.
 * Package id is the one in QuestPorts.apk v1.0.108 (`<manifest package="app.questports">`).
 */

export const QUESTPORTS_APP_PACKAGE = 'app.questports'

export const QUEST_APP_MODAL_STORAGE_KEY = 'questports_app_modal_dismissed'

export const QUEST_APP_MODAL_TITLE = 'Get QuestPorts on your headset'

export const QUEST_APP_MODAL_BODY = 'Browse and install ports right from VR. You only need to install it once.'

export const QUEST_APP_MODAL_NOT_NOW = 'Not now'

export const QUEST_APP_MODAL_INSTALL = 'Install app'

export const QUEST_APP_MODAL_LEARN_MORE = 'Learn more'

export const QUEST_APP_MODAL_HREF = '/app?from=modal'

export interface QuestAppModalInput {
  /** A game install just succeeded. Connecting the headset is not enough. */
  installSucceeded: boolean
  desktop: boolean
  inApp: boolean
  dismissed: boolean
  appInstalled: boolean
}

/** Desktop Chrome/Edge, including a tablet. Phones and the Quest browser stay out. */
export function isDesktopAppPrompt(input: {
  questBrowser: boolean
  userAgent?: string | null
}): boolean {
  if (input.questBrowser) return false
  const device = deviceFromUserAgent(input.userAgent)
  return device === 'desktop' || device === 'tablet'
}

export function shouldShowQuestAppInstallModal(input: QuestAppModalInput): boolean {
  return input.installSucceeded
    && input.desktop
    && !input.inApp
    && !input.dismissed
    && !input.appInstalled
}

export function isQuestPortsAppInstalled(packages: readonly string[] | null | undefined): boolean {
  return (packages || []).some((pkg) => {
    const name = String(pkg || '').trim().toLowerCase().replace(/^package:/, '')
    return name === QUESTPORTS_APP_PACKAGE
  })
}

export function readQuestAppModalDismissed(
  storage: { getItem(key: string): string | null } | null | undefined
): boolean {
  if (!storage) return false
  try {
    return storage.getItem(QUEST_APP_MODAL_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function writeQuestAppModalDismissed(
  storage: { setItem(key: string, value: string): void } | null | undefined
): void {
  if (!storage) return
  try {
    storage.setItem(QUEST_APP_MODAL_STORAGE_KEY, '1')
  } catch {
    // Private mode can reject the write. The prompt can show again next install.
  }
}
