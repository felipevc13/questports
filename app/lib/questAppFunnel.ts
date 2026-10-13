import { appBridgeVersionFromUserAgent } from '~/lib/appBridge'
import {
  cleanAppVersion,
  deviceFromUserAgent,
  type AppFunnelDevice,
  type AppPageSource,
  APP_PAGE_SOURCES
} from '~/lib/analytics'
import { isQuestBrowserUserAgent } from '~/lib/questBrowser'

/**
 * App-install funnel helpers for the pages.
 * Event names and prop allowlists live in analytics.ts.
 * The headset app records app_open when its WebView loads this site
 * (`QuestPortsApp/<version>`).
 */

export type { AppFunnelDevice, AppPageSource }
export { APP_PAGE_SOURCES }

/** Set after a successful install from this browser. Hides the banner and the modal. */
export const QUESTPORTS_APP_INSTALLED_KEY = 'questports_app_installed'

/** First WebView launch of the native app. Stays set so later opens are not first. */
export const APP_OPEN_SEEN_KEY = 'questports_app_opened'

/** One app_open per WebView session, including client-side navigations. */
export const APP_OPEN_SESSION_KEY = 'questports_app_open_sent'

export function questAppHref(source: Exclude<AppPageSource, 'direct'>): string {
  return `/app?from=${source}`
}

export function appPageSourceFromSearch(search: string | null | undefined): AppPageSource {
  if (!search) return 'direct'
  const hashless = search.split('#')[0] || ''
  const queryIndex = hashless.indexOf('?')
  const query = queryIndex >= 0 ? hashless.slice(queryIndex + 1) : hashless
  const from = new URLSearchParams(query).get('from')
  if (from && (APP_PAGE_SOURCES as readonly string[]).includes(from) && from !== 'direct') {
    return from as AppPageSource
  }
  return 'direct'
}

/**
 * Funnel device, not the analytics `device` column.
 * Quest Browser and the native app are `quest`. Phones and tablets are `mobile`.
 */
export function funnelDeviceFromUserAgent(userAgent: string | null | undefined): AppFunnelDevice {
  if (appBridgeVersionFromUserAgent(userAgent) || isQuestBrowserUserAgent(userAgent)) return 'quest'
  const device = deviceFromUserAgent(userAgent)
  if (device === 'mobile' || device === 'tablet') return 'mobile'
  return 'desktop'
}

export function appOpenDecision(input: {
  version: string | null | undefined
  seen: boolean
  alreadySent: boolean
}): { version: string; first: boolean } | null {
  if (input.alreadySent) return null
  const version = cleanAppVersion(input.version)
  if (!version) return null
  return { version, first: !input.seen }
}

export function readQuestPortsAppInstalled(
  storage: { getItem(key: string): string | null } | null | undefined
): boolean {
  if (!storage) return false
  try {
    return storage.getItem(QUESTPORTS_APP_INSTALLED_KEY) === '1'
  } catch {
    return false
  }
}

export function writeQuestPortsAppInstalled(
  storage: { setItem(key: string, value: string): void } | null | undefined
): void {
  if (!storage) return
  try {
    storage.setItem(QUESTPORTS_APP_INSTALLED_KEY, '1')
  } catch {
    // Private mode can reject the write. The prompts can show again next visit.
  }
}
