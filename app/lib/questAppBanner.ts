/**
 * Top banner that points headset visitors at /app.
 * Quest Browser only. The native app already installs ports, so it stays hidden there.
 */

export const QUEST_APP_BANNER_STORAGE_KEY = 'questports_app_banner_dismissed'

export const QUEST_APP_BANNER_COPY = 'Install games right from your Quest — get the QuestPorts app'

export const QUEST_APP_BANNER_HREF = '/app'

export interface QuestAppBannerInput {
  questBrowser: boolean
  inApp: boolean
  dismissed: boolean
  /** Banner is the link to this page, so it stays off once the visitor is there. */
  path?: string | null
}

export function questAppBannerPath(path: string | null | undefined): string {
  const bare = (path || '').split('?')[0]?.split('#')[0] || ''
  if (bare.length > 1 && bare.endsWith('/')) return bare.replace(/\/+$/, '')
  return bare || '/'
}

/** True only in the headset browser, outside the app, until the visitor dismisses it. */
export function shouldShowQuestAppBanner(input: QuestAppBannerInput): boolean {
  if (!input.questBrowser || input.inApp || input.dismissed) return false
  if (questAppBannerPath(input.path) === QUEST_APP_BANNER_HREF) return false
  return true
}

export function readQuestAppBannerDismissed(
  storage: { getItem(key: string): string | null } | null | undefined
): boolean {
  if (!storage) return false
  try {
    return storage.getItem(QUEST_APP_BANNER_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function writeQuestAppBannerDismissed(
  storage: { setItem(key: string, value: string): void } | null | undefined
): void {
  if (!storage) return
  try {
    storage.setItem(QUEST_APP_BANNER_STORAGE_KEY, '1')
  } catch {
    // Private mode can reject the write. The banner can show again next visit.
  }
}
