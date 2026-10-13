import { deviceFromUserAgent } from '~/lib/analytics'

/**
 * Top banner that points headset visitors at /app.
 * Quest Browser only. Phones, tablets, and the native app never see it.
 */

export const QUEST_APP_BANNER_STORAGE_KEY = 'questports_app_banner_dismissed'

export const QUEST_APP_BANNER_COPY = 'Install games right from your Quest — get the QuestPorts app'

export const QUEST_APP_BANNER_HREF = '/app'

export interface QuestAppBannerInput {
  questBrowser: boolean
  inApp: boolean
  dismissed: boolean
  /** This browser already installed the app. */
  appInstalled?: boolean
  /** Phone or tablet browser. Quest Browser is not handheld, even when the UA says Android. */
  handheld?: boolean
  /** Banner is the link to this page, so it stays off once the visitor is there. */
  path?: string | null
}

/** A phone or tablet that is not the Quest's own browser. */
export function isPhoneOrTabletBrowser(input: {
  questBrowser: boolean
  userAgent?: string | null
}): boolean {
  if (input.questBrowser) return false
  const device = deviceFromUserAgent(input.userAgent)
  return device === 'mobile' || device === 'tablet'
}

export function questAppBannerPath(path: string | null | undefined): string {
  const bare = (path || '').split('?')[0]?.split('#')[0] || ''
  if (bare.length > 1 && bare.endsWith('/')) return bare.replace(/\/+$/, '')
  return bare || '/'
}

/** True only in the headset browser, outside the app, until dismiss or a site install. */
export function shouldShowQuestAppBanner(input: QuestAppBannerInput): boolean {
  if (input.handheld || input.appInstalled) return false
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
