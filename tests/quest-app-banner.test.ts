import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { APK_PROXY_WORKER_BASE } from '../app/lib/apkProxyPolicy'
import { isAppBridgeSession } from '../app/lib/appBridge'
import { isQuestBrowserClient, isQuestBrowserSession, isQuestBrowserUserAgent } from '../app/lib/questBrowser'
import {
  isPhoneOrTabletBrowser,
  QUEST_APP_BANNER_COPY,
  QUEST_APP_BANNER_HREF,
  QUEST_APP_BANNER_STORAGE_KEY,
  questAppBannerPath,
  readQuestAppBannerDismissed,
  shouldShowQuestAppBanner,
  writeQuestAppBannerDismissed
} from '../app/lib/questAppBanner'
import {
  appOpenDecision,
  appPageSourceFromSearch,
  funnelDeviceFromUserAgent,
  questAppHref,
  readQuestPortsAppInstalled,
  writeQuestPortsAppInstalled,
  QUESTPORTS_APP_INSTALLED_KEY
} from '../app/lib/questAppFunnel'
import {
  QUESTPORTS_APP_PAGE,
  QUESTPORTS_APP_RELEASE_URL,
  questPortsAppApkDownloadUrl
} from '../app/data/questPortsApp'

const OCULUS_UA =
  'Mozilla/5.0 (X11; Linux x86_64; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/33.0.0.0 Chrome/122.0.6261.64 VR Safari/537.36'

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const APP_UA =
  'Mozilla/5.0 (Linux; Android 12; Quest 3 Build/SQ3A.220605.009.A1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.230 Mobile Safari/537.36 QuestPortsApp/1.0.108'

const PHONE_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'

const TABLET_UA =
  'Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const QUEST_ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 12; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/33.0.0.0 Chrome/120.0.0.0 Safari/537.36'

function memoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem(key: string) {
      return values.has(key) ? values.get(key)! : null
    },
    setItem(key: string, value: string) {
      values.set(key, value)
    }
  }
}

describe('Quest Browser detection for the app banner', () => {
  it('treats OculusBrowser as the headset browser and the native app as something else', () => {
    expect(isQuestBrowserUserAgent(OCULUS_UA)).toBe(true)
    expect(isQuestBrowserUserAgent(APP_UA)).toBe(false)
    expect(isQuestBrowserUserAgent(CHROME_UA)).toBe(false)
    expect(isQuestBrowserSession({ userAgent: OCULUS_UA, search: '' })).toBe(true)
    expect(isQuestBrowserSession({ userAgent: CHROME_UA, search: '?questBrowser=1' })).toBe(true)
    expect(isQuestBrowserSession({ userAgent: CHROME_UA, search: '' })).toBe(false)
    expect(isQuestBrowserSession({ userAgent: APP_UA, search: '?questBrowser=1' })).toBe(true)
    expect(isAppBridgeSession({ userAgent: APP_UA, search: '' })).toBe(true)
    expect(isAppBridgeSession({ userAgent: OCULUS_UA, search: '?inApp=1', bridgePresent: false })).toBe(true)
    expect(isQuestBrowserClient()).toBe(false)
  })
})

describe('Quest app banner visibility', () => {
  it('shows only in Quest Browser, outside the app, until dismissed', () => {
    const quest = isQuestBrowserSession({ userAgent: OCULUS_UA, search: '' })
    const desktop = isQuestBrowserSession({ userAgent: CHROME_UA, search: '' })
    const flagged = isQuestBrowserSession({ userAgent: CHROME_UA, search: '/ports/rtcwquest?questBrowser=1' })

    expect(shouldShowQuestAppBanner({
      questBrowser: quest,
      inApp: false,
      dismissed: false,
      path: '/'
    })).toBe(true)

    expect(shouldShowQuestAppBanner({
      questBrowser: flagged,
      inApp: false,
      dismissed: false,
      path: '/ports/rtcwquest'
    })).toBe(true)

    expect(shouldShowQuestAppBanner({
      questBrowser: desktop,
      inApp: false,
      dismissed: false,
      path: '/'
    })).toBe(false)

    expect(shouldShowQuestAppBanner({
      questBrowser: true,
      inApp: true,
      dismissed: false,
      path: '/'
    })).toBe(false)

    expect(shouldShowQuestAppBanner({
      questBrowser: true,
      inApp: isAppBridgeSession({ userAgent: APP_UA, search: '' }),
      dismissed: false,
      path: '/'
    })).toBe(false)

    expect(shouldShowQuestAppBanner({
      questBrowser: true,
      inApp: false,
      dismissed: true,
      path: '/'
    })).toBe(false)

    expect(shouldShowQuestAppBanner({
      questBrowser: true,
      inApp: false,
      dismissed: false,
      path: '/app'
    })).toBe(false)

    expect(shouldShowQuestAppBanner({
      questBrowser: true,
      inApp: false,
      dismissed: false,
      path: '/app/?questBrowser=1'
    })).toBe(false)

    expect(questAppBannerPath('/app/?questBrowser=1')).toBe('/app')

    expect(isPhoneOrTabletBrowser({ questBrowser: false, userAgent: PHONE_UA })).toBe(true)
    expect(isPhoneOrTabletBrowser({ questBrowser: false, userAgent: TABLET_UA })).toBe(true)
    expect(isPhoneOrTabletBrowser({ questBrowser: true, userAgent: QUEST_ANDROID_UA })).toBe(false)
    expect(shouldShowQuestAppBanner({
      questBrowser: false,
      inApp: false,
      dismissed: false,
      handheld: true,
      path: '/'
    })).toBe(false)
    expect(shouldShowQuestAppBanner({
      questBrowser: isQuestBrowserSession({ userAgent: QUEST_ANDROID_UA, search: '' }),
      inApp: false,
      dismissed: false,
      handheld: isPhoneOrTabletBrowser({
        questBrowser: isQuestBrowserSession({ userAgent: QUEST_ANDROID_UA, search: '' }),
        userAgent: QUEST_ANDROID_UA
      }),
      path: '/'
    })).toBe(true)
    expect(shouldShowQuestAppBanner({
      questBrowser: true,
      inApp: false,
      dismissed: false,
      appInstalled: true,
      path: '/'
    })).toBe(false)
  })

  it('remembers a dismiss in localStorage and ignores a broken store', () => {
    const storage = memoryStorage()
    expect(readQuestAppBannerDismissed(storage)).toBe(false)
    writeQuestAppBannerDismissed(storage)
    expect(storage.getItem(QUEST_APP_BANNER_STORAGE_KEY)).toBe('1')
    expect(readQuestAppBannerDismissed(storage)).toBe(true)
    expect(shouldShowQuestAppBanner({
      questBrowser: true,
      inApp: false,
      dismissed: readQuestAppBannerDismissed(storage),
      path: '/'
    })).toBe(false)

    const broken = {
      getItem() {
        throw new Error('blocked')
      },
      setItem() {
        throw new Error('blocked')
      }
    }
    expect(readQuestAppBannerDismissed(broken)).toBe(false)
    expect(() => writeQuestAppBannerDismissed(broken)).not.toThrow()
  })

  it('renders on the client only and keeps the copy in one place', () => {
    const app = readFileSync(new URL('../app/app.vue', import.meta.url), 'utf8')
    const banner = readFileSync(new URL('../app/components/QuestAppBanner.vue', import.meta.url), 'utf8')
    const footer = readFileSync(new URL('../app/components/Footer.vue', import.meta.url), 'utf8')
    const page = readFileSync(new URL('../app/pages/app.vue', import.meta.url), 'utf8')

    expect(QUEST_APP_BANNER_COPY).toBe('Install games right from your Quest — get the QuestPorts app')
    expect(QUEST_APP_BANNER_HREF).toBe('/app')
    expect(app).toContain('<ClientOnly>')
    expect(app).toContain('<QuestAppBanner />')
    expect(banner).toContain('onMounted')
    expect(banner).toContain('readQuestAppBannerDismissed')
    expect(banner).toContain("track('banner_shown'")
    expect(banner).toContain("track('banner_click'")
    expect(banner).toContain("track('banner_dismiss'")
    expect(banner).toContain('readQuestPortsAppInstalled')
    expect(banner.indexOf('readQuestAppBannerDismissed')).toBeGreaterThan(banner.indexOf('onMounted'))
    expect(footer).toContain('to="/app?from=footer"')
    expect(footer).toContain('data-testid="footer-app-link"')
    const navbar = readFileSync(new URL('../app/components/Navbar.vue', import.meta.url), 'utf8')
    expect(navbar).toContain('data-testid="nav-app-link"')
    expect(navbar).toContain('to="/app?from=nav"')
    expect(navbar).toContain('App')
    expect(page).toContain('questBrowserNote')
    expect(page).toContain('installApkUrl(QUESTPORTS_APP_RELEASE_URL')
    expect(page).toContain("track('install_click'")
    expect(page).toContain("track('install_success'")
    expect(page).toContain("track('app_page_view'")
    expect(page).toContain('writeQuestPortsAppInstalled')
    expect(page).toContain("via: 'page'")
    expect(page).toContain('data-testid="app-quest-browser-note"')
    expect(page).toContain('v-if="index === 2 && questBrowser"')
    expect(page).toContain('v-if="!questBrowser && !installing && !succeeded"')
    expect(page).not.toContain('portPackageMap')
    expect(QUESTPORTS_APP_PAGE.later).toEqual([
      'Game notifications',
      'Steam and GOG game files'
    ])
    expect(QUESTPORTS_APP_PAGE.laterNote.toLowerCase()).toContain('not in the app today')
  })

  it('downloads the latest app release through the APK proxy', () => {
    expect(QUESTPORTS_APP_RELEASE_URL).toBe('https://github.com/felipevc13/questports-app/releases/latest')
    expect(questPortsAppApkDownloadUrl(APK_PROXY_WORKER_BASE)).toBe(
      `${APK_PROXY_WORKER_BASE}/api/apk-proxy?url=${encodeURIComponent(QUESTPORTS_APP_RELEASE_URL)}&redirect=1`
    )
    expect(questPortsAppApkDownloadUrl('')).toBe(
      `/api/apk-proxy?url=${encodeURIComponent(QUESTPORTS_APP_RELEASE_URL)}&redirect=1`
    )
    expect(questPortsAppApkDownloadUrl(null)).toContain('questports-apk-proxy.questports.workers.dev')
  })

  it('remembers a site install and classifies the /app funnel', () => {
    const storage = memoryStorage()
    expect(readQuestPortsAppInstalled(storage)).toBe(false)
    writeQuestPortsAppInstalled(storage)
    expect(storage.getItem(QUESTPORTS_APP_INSTALLED_KEY)).toBe('1')
    expect(readQuestPortsAppInstalled(storage)).toBe(true)
    expect(questAppHref('banner')).toBe('/app?from=banner')
    expect(questAppHref('footer')).toBe('/app?from=footer')
    expect(appPageSourceFromSearch('?from=nav')).toBe('nav')
    expect(appPageSourceFromSearch('?from=modal')).toBe('modal')
    expect(appPageSourceFromSearch('?from=nope')).toBe('direct')
    expect(appPageSourceFromSearch('')).toBe('direct')
    expect(funnelDeviceFromUserAgent(OCULUS_UA)).toBe('quest')
    expect(funnelDeviceFromUserAgent(QUEST_ANDROID_UA)).toBe('quest')
    expect(funnelDeviceFromUserAgent(APP_UA)).toBe('quest')
    expect(funnelDeviceFromUserAgent(CHROME_UA)).toBe('desktop')
    expect(funnelDeviceFromUserAgent(PHONE_UA)).toBe('mobile')
    expect(funnelDeviceFromUserAgent(TABLET_UA)).toBe('mobile')
    expect(appOpenDecision({ version: '1.0.108', seen: false, alreadySent: false })).toEqual({ version: '1.0.108', first: true })
    expect(appOpenDecision({ version: '1.0.108', seen: true, alreadySent: false })).toEqual({ version: '1.0.108', first: false })
    expect(appOpenDecision({ version: '1.0.108', seen: false, alreadySent: true })).toBeNull()
    expect(appOpenDecision({ version: 'not a version', seen: false, alreadySent: false })).toBeNull()
    const plugin = readFileSync(new URL('../app/plugins/analytics.client.ts', import.meta.url), 'utf8')
    expect(plugin).toContain("track('app_open'")
    expect(plugin).toContain('appOpenDecision')
  })
})
