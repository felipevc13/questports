import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { browserFamilyFromUserAgent } from '../app/lib/analytics'
import { connectionMessageForUsbError, QUEST_USB_MESSAGES } from '../app/lib/questUsbMessages'
import {
  DESKTOP_USB_NOTICE_BODY,
  DESKTOP_USB_NOTICE_TITLE,
  IN_APP_USB_NOTICE_TITLE,
  IOS_USB_NOTICE_BODY,
  IOS_USB_NOTICE_TITLE,
  MOCK_USER_AGENT_PRESETS,
  isIosUserAgent,
  mockUserAgentFromSearch,
  shareablePageHref,
  unsupportedNoticeForUserAgent
} from '../app/lib/unsupportedBrowser'

const DISCORD_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Discord'

describe('unsupported browser notice', () => {
  it('tells in-app visitors to open Chrome or Edge and copy the link', () => {
    for (const key of ['discord', 'reddit', 'facebook', 'instagram', 'telegram', 'whatsapp', 'twitter', 'x', 'line', 'webview'] as const) {
      const notice = unsupportedNoticeForUserAgent(MOCK_USER_AGENT_PRESETS[key])
      expect(notice.variant, key).toBe('in_app')
      expect(notice.title).toBe(IN_APP_USB_NOTICE_TITLE)
      expect(notice.title).toBe('Open this page in Chrome or Edge')
      expect(notice.copyLink).toBe(true)
    }
  })

  it('tells every iOS browser, including Chrome and in-app apps, to move to a PC or Android', () => {
    for (const key of ['ios', 'ipad', 'chrome-ios'] as const) {
      const notice = unsupportedNoticeForUserAgent(MOCK_USER_AGENT_PRESETS[key])
      expect(notice.variant, key).toBe('ios')
      expect(notice.copyLink).toBe(true)
    }
    expect(IOS_USB_NOTICE_TITLE).toBe("iPhone and iPad can't connect to Quest over USB.")
    expect(IOS_USB_NOTICE_BODY).toBe('Open this page on a PC or an Android phone with Chrome or Edge.')

    const chromeIos = unsupportedNoticeForUserAgent(MOCK_USER_AGENT_PRESETS['chrome-ios'])
    expect(chromeIos.title).toBe(IOS_USB_NOTICE_TITLE)
    expect(browserFamilyFromUserAgent(MOCK_USER_AGENT_PRESETS['chrome-ios'])).toBe('Chrome iOS')
    expect(isIosUserAgent(MOCK_USER_AGENT_PRESETS['chrome-ios'])).toBe(true)

    const discordIos = unsupportedNoticeForUserAgent(DISCORD_IOS)
    expect(browserFamilyFromUserAgent(DISCORD_IOS)).toBe('Discord')
    expect(discordIos.variant).toBe('ios')
  })

  it('tells desktop Firefox and Safari to use Chrome or Edge', () => {
    for (const key of ['firefox', 'safari'] as const) {
      const notice = unsupportedNoticeForUserAgent(MOCK_USER_AGENT_PRESETS[key])
      expect(notice.variant, key).toBe('desktop')
      expect(notice.title).toBe('Use Chrome or Edge')
      expect(notice.title).toBe(DESKTOP_USB_NOTICE_TITLE)
      expect(notice.body).toBe(DESKTOP_USB_NOTICE_BODY)
      expect(notice.copyLink).toBe(false)
    }
    expect(isIosUserAgent(MOCK_USER_AGENT_PRESETS.safari)).toBe(false)
    expect(unsupportedNoticeForUserAgent('').variant).toBe('desktop')
  })

  it('reads mockUa presets and strips them from a copied link', () => {
    expect(mockUserAgentFromSearch('?mockUa=discord')).toBe(MOCK_USER_AGENT_PRESETS.discord)
    expect(mockUserAgentFromSearch('/ports/rtcwquest?mockUa=ios#guide')).toBe(MOCK_USER_AGENT_PRESETS.ios)
    expect(mockUserAgentFromSearch('?mockUa=chrome-ios')).toBe(MOCK_USER_AGENT_PRESETS['chrome-ios'])
    expect(mockUserAgentFromSearch('?mockUa=not-a-browser')).toBeNull()
    expect(mockUserAgentFromSearch('?mockUsbError=locked')).toBeNull()
    expect(mockUserAgentFromSearch(null)).toBeNull()

    expect(shareablePageHref(
      'https://questports.vercel.app/ports/rtcwquest?mockUa=discord&mockUsbError=locked&noWebUsb=1'
    )).toBe('https://questports.vercel.app/ports/rtcwquest')
    expect(shareablePageHref(
      'https://questports.vercel.app/ports/rtcwquest?utm=1&mockUa=ios'
    )).toBe('https://questports.vercel.app/ports/rtcwquest?utm=1')
  })
})

describe('usb claim failure copy', () => {
  it('turns a locked interface into the other-app message', () => {
    const locked = connectionMessageForUsbError(new Error('Unable to claim interface.'))
    expect(locked).toBe(QUEST_USB_MESSAGES.usbLocked)
    expect(locked).toContain('SideQuest')
    expect(locked).toContain('Meta Quest Link')
    expect(locked).toContain('Horizon Link')
    expect(locked).toContain('Android Studio')
    expect(locked).toContain('adb kill-server')
    expect(locked).toContain('Try again')
    expect(connectionMessageForUsbError(new Error('The device is already in use.'))).toBe(QUEST_USB_MESSAGES.usbLocked)
    expect(connectionMessageForUsbError(new Error('The transfer was cancelled.')))
      .toBe(QUEST_USB_MESSAGES.cancelled)
    expect(connectionMessageForUsbError(new Error('something else'))).toBe('something else')
  })

  it('renders the checklist, the locked-device steps, and the tailored notice', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    expect(page).toContain('data-testid="chooser-dismissed"')
    expect(page).toContain('data-testid="chooser-retry"')
    expect(page).toContain('CHOOSER_DISMISSED_STEPS')
    expect(page).toContain('data-testid="usb-locked"')
    expect(page).toContain('data-testid="usb-locked-retry"')
    expect(page).toContain('USB_LOCKED_COMMAND')
    expect(page).toContain('retryUsbConnect')
    expect(page).toContain('v-else-if="installSupport === \'unsupported\'"')

    const notice = readFileSync(new URL('../app/components/UnsupportedBrowserNotice.vue', import.meta.url), 'utf8')
    expect(notice).toContain('data-testid="unsupported-copy-link"')
    expect(notice).toContain('data-testid="webusb-unsupported"')
    expect(notice).toContain("props: { action: 'copy_link' }")
    expect(notice).toContain('shareablePageHref')

    const questNotice = readFileSync(new URL('../app/components/QuestBrowserNotice.vue', import.meta.url), 'utf8')
    expect(questNotice).toContain('QUEST_BROWSER_NOTICE_TITLE')
    expect(questNotice).not.toContain('mockUa')
  })
})
