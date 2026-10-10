import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { browserFamilyFromUserAgent } from '../app/lib/analytics'
import {
  QUEST_BROWSER_NOTICE,
  QUEST_BROWSER_NOTICE_BODY,
  QUEST_BROWSER_NOTICE_TITLE,
  QUEST_BROWSER_PC_FALLBACK,
  canUseWebShare,
  copyTextToClipboard,
  hasQuestBrowserFlag,
  isQuestBrowserClient,
  isQuestBrowserSession,
  isQuestBrowserUserAgent,
  pageLinkActionLabel,
  questBrowserCopyLabel,
  sharePage
} from '../app/lib/questBrowser'
import {
  DIRECT_QUEST_INSTALL_NOTE,
  DIRECT_QUEST_INSTALL_STEPS,
  DIRECT_QUEST_INSTALL_TITLE,
  GAME_FILES_GUIDE_HREF,
  GAME_FILES_GUIDE_LABEL,
  GAME_FILES_NEED_PC
} from '../app/lib/directQuestInstall'

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
const EDGE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0'
const OCULUS_UA =
  'Mozilla/5.0 (X11; Linux x86_64; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/33.0.0.0 Chrome/122.0.6261.64 VR Safari/537.36'
const QUEST_TOKEN_UA =
  'Mozilla/5.0 (Linux; Android 12; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
const OCULUS_TOKEN_UA =
  'Mozilla/5.0 (Linux; Android 10; Oculus) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'

describe('quest browser detection', () => {
  it('matches the analytics Oculus family and Quest or Oculus device tokens', () => {
    expect(browserFamilyFromUserAgent(OCULUS_UA)).toBe('Oculus')
    expect(isQuestBrowserUserAgent(OCULUS_UA)).toBe(true)
    expect(isQuestBrowserUserAgent(QUEST_TOKEN_UA)).toBe(true)
    expect(isQuestBrowserUserAgent(OCULUS_TOKEN_UA)).toBe(true)
    expect(isQuestBrowserUserAgent('Mozilla/5.0 OculusBrowser/12.0 Chrome/87.0.4280.88 Safari/537.36')).toBe(true)

    expect(isQuestBrowserUserAgent(CHROME_UA)).toBe(false)
    expect(isQuestBrowserUserAgent(EDGE_UA)).toBe(false)
    expect(isQuestBrowserUserAgent('Mozilla/5.0 Firefox/121.0')).toBe(false)
    expect(isQuestBrowserUserAgent('Mozilla/5.0 (compatible; request from a bot)')).toBe(false)
    expect(isQuestBrowserUserAgent('')).toBe(false)
    expect(isQuestBrowserUserAgent(null)).toBe(false)
  })

  it('turns on only for questBrowser=1, like noWebUsb=1', () => {
    expect(hasQuestBrowserFlag('?questBrowser=1')).toBe(true)
    expect(hasQuestBrowserFlag('/ports/rtcwquest?questBrowser=1')).toBe(true)
    expect(hasQuestBrowserFlag('https://questports.vercel.app/ports/rtcwquest?x=1&questBrowser=1#guide')).toBe(true)
    expect(hasQuestBrowserFlag('?questBrowser=0')).toBe(false)
    expect(hasQuestBrowserFlag('?questBrowser=true')).toBe(false)
    expect(hasQuestBrowserFlag('?questBrowser=')).toBe(false)
    expect(hasQuestBrowserFlag('?noWebUsb=1')).toBe(false)
    expect(hasQuestBrowserFlag('?mockQuest=1')).toBe(false)
    expect(hasQuestBrowserFlag(null)).toBe(false)

    expect(isQuestBrowserSession({ userAgent: CHROME_UA, search: '?questBrowser=1' })).toBe(true)
    expect(isQuestBrowserSession({ userAgent: CHROME_UA, search: '?noWebUsb=1' })).toBe(false)
    expect(isQuestBrowserSession({ userAgent: OCULUS_UA, search: '' })).toBe(true)
    expect(isQuestBrowserSession({ userAgent: CHROME_UA, search: '' })).toBe(false)
  })

  it('stays off during SSR when window is missing', () => {
    expect(isQuestBrowserClient()).toBe(false)
  })
})

describe('quest browser notice copy', () => {
  it('uses the headset message and a short copied confirmation', () => {
    expect(QUEST_BROWSER_NOTICE_TITLE).toBe("You're on your Quest's browser.")
    expect(QUEST_BROWSER_NOTICE_BODY).toBe(
      'To install, open this page on a PC or Android phone (Chrome or Edge) and connect your Quest with a USB cable.'
    )
    expect(QUEST_BROWSER_NOTICE).toBe(
      "You're on your Quest's browser. To install, open this page on a PC or Android phone (Chrome or Edge) and connect your Quest with a USB cable."
    )
    expect(questBrowserCopyLabel(false)).toBe('Copy link')
    expect(questBrowserCopyLabel(true)).toBe('Copied')
    expect(pageLinkActionLabel(false, true)).toBe('Send link to my PC')
    expect(pageLinkActionLabel(false, false)).toBe('Copy link')
    expect(pageLinkActionLabel(true, true)).toBe('Copied')
    expect(QUEST_BROWSER_PC_FALLBACK).toBe(
      'Or send this page to a PC with Chrome or Edge and a USB cable.'
    )
  })

  it('shares the page when the browser can, and leaves a dismissed sheet alone', async () => {
    const shared: Array<{ title?: string; url?: string }> = []
    const ok = await sharePage({
      share: async (data) => {
        shared.push(data)
      }
    }, { title: 'QuestPorts', url: 'https://questports.vercel.app/ports/iron-lung-vr' })
    expect(ok).toBe('shared')
    expect(shared).toEqual([{
      title: 'QuestPorts',
      url: 'https://questports.vercel.app/ports/iron-lung-vr'
    }])
    expect(canUseWebShare({ share: async () => {} })).toBe(true)
    expect(canUseWebShare({})).toBe(false)
    expect(await sharePage(null, { url: 'https://questports.vercel.app' })).toBe('unavailable')

    const cancelled = await sharePage({
      share: async () => {
        throw Object.assign(new Error('The user aborted a request.'), { name: 'AbortError' })
      }
    }, { url: 'https://questports.vercel.app/ports/iron-lung-vr' })
    expect(cancelled).toBe('cancelled')

    const failed = await sharePage({
      share: async () => {
        throw new Error('no share target')
      }
    }, { url: 'https://questports.vercel.app/ports/iron-lung-vr' })
    expect(failed).toBe('failed')
  })

  it('copies the current page URL', async () => {
    const written: string[] = []
    const ok = await copyTextToClipboard('https://questports.vercel.app/ports/rtcwquest?questBrowser=1', {
      clipboard: {
        writeText: async (value) => {
          written.push(value)
        }
      }
    })
    expect(ok).toBe(true)
    expect(written).toEqual(['https://questports.vercel.app/ports/rtcwquest?questBrowser=1'])

    const failed = await copyTextToClipboard('https://questports.vercel.app/ports/rtcwquest', {
      clipboard: {
        writeText: async () => {
          throw new Error('denied')
        }
      }
    })
    expect(failed).toBe(false)
  })
})

describe('quest browser install gate', () => {
  it('replaces the install action and does not start WebUSB', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const noticeAt = page.indexOf('<QuestBrowserNotice')
    const installAt = page.indexOf('data-testid="install-on-quest"')
    expect(page).toContain('v-else-if="installSupport === \'unsupported\'"')
    expect(noticeAt).toBeGreaterThan(0)
    expect(installAt).toBeGreaterThan(noticeAt)

    const begin = page.slice(page.indexOf('const beginInstall'))
    expect(begin.indexOf('if (questBrowser.value) return')).toBeGreaterThan(0)
    expect(begin.indexOf('if (questBrowser.value) return')).toBeLessThan(begin.indexOf('await handleApkInstall()'))
    expect(page).toContain('if (questBrowser.value || isInstallingApk.value || !port.value) return')

    const adb = readFileSync(new URL('../app/composables/useQuestAdb.ts', import.meta.url), 'utf8')
    const connectAt = adb.indexOf('const connect = async')
    const guardAt = adb.indexOf('if (isQuestBrowserClient()) return false', connectAt)
    const pickerAt = adb.indexOf('requestDevice()', connectAt)
    expect(guardAt).toBeGreaterThan(connectAt)
    expect(pickerAt).toBeGreaterThan(guardAt)

    const autoAt = adb.indexOf('const tryAutoConnect = async')
    expect(adb.indexOf('if (isQuestBrowserClient()) return false', autoAt)).toBeGreaterThan(autoAt)
    expect(adb.indexOf('if (isQuestBrowserClient()) return false', autoAt)).toBeLessThan(adb.indexOf('applyMockScenario()', autoAt))
    expect(adb).toContain('if (isQuestBrowserClient()) return')

    const notice = readFileSync(new URL('../app/components/QuestBrowserNotice.vue', import.meta.url), 'utf8')
    expect(notice).toContain('data-testid="quest-browser-copy-link"')
    expect(notice).toContain('QUEST_BROWSER_NOTICE_TITLE')
    expect(notice).toContain('QUEST_BROWSER_NOTICE_BODY')
    expect(notice).toContain('QUEST_BROWSER_PC_FALLBACK')
    expect(notice).toContain('DirectQuestInstall')
    expect(notice).toContain('primary')
    expect(notice).toContain("props: { action: 'shown' }")
    expect(notice).toContain("track('unsupported_browser_view'")
    expect(notice).toContain('usePageLinkShare')

    const direct = readFileSync(new URL('../app/components/DirectQuestInstall.vue', import.meta.url), 'utf8')
    expect(direct).toContain('data-testid="direct-install-toggle"')
    expect(direct).toContain('data-testid="direct-install-apk"')
    expect(direct).toContain('data-testid="game-files-need-pc"')
    expect(direct).toContain("props: { action: 'direct_install_open' }")
    expect(direct).toContain("track('manual_download_click'")
    expect(DIRECT_QUEST_INSTALL_TITLE).toBe('Install directly on Quest')
    expect(DIRECT_QUEST_INSTALL_STEPS).toEqual([
      'Open this page in the Quest Browser.',
      'Download the APK.',
      'Open Files > Downloads > ⋮ > Open with > Package Installer. Allow this source once, then tap Install.'
    ])
    expect(DIRECT_QUEST_INSTALL_NOTE).toBe('Works without Developer Mode on recent Horizon OS.')
    expect(GAME_FILES_NEED_PC).toBe('Game files still need a PC.')
    expect(GAME_FILES_GUIDE_LABEL).toBe('Step-by-step installation guide')
    expect(GAME_FILES_GUIDE_HREF).toBe('#install-guide')

    const card = readFileSync(new URL('../app/components/PortCard.vue', import.meta.url), 'utf8')
    expect(card).not.toContain('QuestBrowserNotice')
    expect(card).not.toContain('quest-browser')
  })
})
