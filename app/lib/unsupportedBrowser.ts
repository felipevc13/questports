import { browserFamilyFromUserAgent, deviceFromUserAgent, isInAppBrowserFamily } from '~/lib/analytics'
import { WEBUSB_UNSUPPORTED_NOTICE } from '~/lib/questInstallUx'

export const IN_APP_USB_NOTICE_TITLE = 'Open this page in Chrome or Edge'

export const IN_APP_USB_NOTICE_BODY = "This in-app browser can't connect to a Quest over USB."

export const IOS_USB_NOTICE_TITLE = "iPhone and iPad can't connect to Quest over USB."

export const IOS_USB_NOTICE_BODY =
  'Open this page on a PC or an Android phone with Chrome or Edge.'

export const DESKTOP_USB_NOTICE_TITLE = WEBUSB_UNSUPPORTED_NOTICE

export const DESKTOP_USB_NOTICE_BODY = "This browser can't install over USB from this page."

export type UnsupportedNoticeVariant = 'in_app' | 'ios' | 'desktop'

export interface UnsupportedNotice {
  variant: UnsupportedNoticeVariant
  title: string
  body: string
  /** Phones, tablets, in-app browsers, and iOS need this page on a computer that can use USB. */
  copyLink: boolean
}

/**
 * Preview user-agents for `?mockUa=`. Values are keys, not raw user-agent text,
 * so a query string cannot inject an arbitrary label.
 */
export const MOCK_USER_AGENT_PRESETS = {
  discord: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Discord',
  reddit: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 Reddit/Version 2024.10.0',
  facebook: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/450.0.0.0.0]',
  instagram: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 Instagram 302.0.0.0.0',
  telegram: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 Telegram-Android/10.14.0',
  whatsapp: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 WhatsApp/2.24.10.78',
  twitter: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 TwitterAndroid',
  x: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 X/10.45',
  line: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 Line/14.0.0',
  webview: 'Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TQ3A.230901.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36',
  ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  ipad: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'chrome-ios': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1',
  firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
} as const

export type MockUserAgentPreset = keyof typeof MOCK_USER_AGENT_PRESETS

function searchParam(value: string | null | undefined, key: string): string | null {
  if (!value) return null
  const hashless = value.split('#')[0] || ''
  const queryIndex = hashless.indexOf('?')
  const query = queryIndex >= 0 ? hashless.slice(queryIndex + 1) : hashless
  return new URLSearchParams(query).get(key)
}

/** `?mockUa=discord` or `?mockUa=ios`. Unknown keys stay off. */
export function mockUserAgentFromSearch(value: string | null | undefined): string | null {
  const key = searchParam(value, 'mockUa')
  if (!key || !(key in MOCK_USER_AGENT_PRESETS)) return null
  return MOCK_USER_AGENT_PRESETS[key as MockUserAgentPreset]
}

/** Every iOS browser, including Chrome (CriOS), lacks WebUSB. */
export function isIosUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent || !userAgent.trim()) return false
  return /iPad|iPhone|iPod|CriOS|FxiOS|EdgiOS/i.test(userAgent)
}

/**
 * iOS wins over in-app: opening Chrome on an iPhone still cannot claim USB.
 * Desktop Firefox and Safari, and any other non-WebUSB browser, share the Chrome or Edge line.
 */
export function unsupportedNoticeForUserAgent(userAgent: string | null | undefined): UnsupportedNotice {
  if (isIosUserAgent(userAgent)) {
    return {
      variant: 'ios',
      title: IOS_USB_NOTICE_TITLE,
      body: IOS_USB_NOTICE_BODY,
      copyLink: true
    }
  }
  if (isInAppBrowserFamily(browserFamilyFromUserAgent(userAgent))) {
    return {
      variant: 'in_app',
      title: IN_APP_USB_NOTICE_TITLE,
      body: IN_APP_USB_NOTICE_BODY,
      copyLink: true
    }
  }
  const device = deviceFromUserAgent(userAgent)
  return {
    variant: 'desktop',
    title: DESKTOP_USB_NOTICE_TITLE,
    body: DESKTOP_USB_NOTICE_BODY,
    copyLink: device === 'mobile' || device === 'tablet'
  }
}

/** Drops preview flags so a copied link opens the real page. */
export function shareablePageHref(href: string): string {
  try {
    const url = new URL(href)
    url.searchParams.delete('mockUa')
    url.searchParams.delete('mockUsbError')
    url.searchParams.delete('mockAuthorizeWait')
    url.searchParams.delete('noWebUsb')
    url.searchParams.delete('questBrowser')
    url.searchParams.delete('inApp')
    return url.toString()
  } catch {
    return href
  }
}
