import { deviceFromUserAgent } from '~/lib/analytics'
import { canonicalPageUrl } from '~/lib/siteUrl'

/** Production page a phone or headset can hand to a PC. */
export const QUEST_APP_INSTALL_PAGE_URL = canonicalPageUrl('/app')

/**
 * One-click install needs a desktop browser that actually has WebUSB.
 * Quest Browser exposes `navigator.usb`, and a headset cannot install onto
 * itself. Phones and tablets are the same dead end.
 */
export function canOneClickInstallQuestApp(input: {
  webusb: boolean
  questBrowser: boolean
  userAgent?: string | null
}): boolean {
  if (!input.webusb || input.questBrowser) return false
  const device = deviceFromUserAgent(input.userAgent)
  return device !== 'mobile' && device !== 'tablet'
}
