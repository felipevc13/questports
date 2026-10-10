import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  APP_INSTALL_PERMISSION_HINT,
  appBridgeApkUrl,
  appBridgeInstallErrorReason,
  appBridgeVersionFromUserAgent,
  appInstallErrorMessage,
  appInstallStatusLabel,
  appUpdateAvailable,
  createMockQuestPortsApp,
  hasInAppFlag,
  isAppBridgeClient,
  isAppBridgeSession,
  isAppBridgeUserAgent,
  type AppBridgeEventDetail
} from '../app/lib/appBridge'
import {
  browserFamilyFromUserAgent,
  clientAnalyticsPayload,
  withAppAnalyticsProp
} from '../app/lib/analytics'
import { isQuestBrowserUserAgent } from '../app/lib/questBrowser'
import { shareablePageHref } from '../app/lib/unsupportedBrowser'
import { decideAnalyticsRequest } from '../server/utils/analytics'

const APP_UA =
  'Mozilla/5.0 (Linux; Android 12; Quest 3 Build/SQ3A.220605.009.A1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.230 Mobile Safari/537.36 QuestPortsApp/1.4.2'
const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

function decide(body: unknown, userAgent = CHROME_UA) {
  return decideAnalyticsRequest({
    enabled: true,
    body,
    ip: '203.0.113.8',
    userAgent,
    analyticsSalt: 'salt',
    serviceRoleKey: 'service',
    now: new Date('2026-10-10T12:00:00.000Z'),
    rateLimiter: null
  })
}

describe('app bridge detection', () => {
  it('matches QuestPortsApp/<version> and the strict inApp=1 flag', () => {
    expect(appBridgeVersionFromUserAgent(APP_UA)).toBe('1.4.2')
    expect(isAppBridgeUserAgent(APP_UA)).toBe(true)
    expect(isAppBridgeUserAgent('Mozilla/5.0 QuestPortsApp/')).toBe(false)
    expect(isAppBridgeUserAgent(CHROME_UA)).toBe(false)
    expect(isAppBridgeUserAgent('')).toBe(false)
    expect(isAppBridgeUserAgent(null)).toBe(false)

    expect(hasInAppFlag('?inApp=1')).toBe(true)
    expect(hasInAppFlag('/ports/iron-lung-vr?inApp=1')).toBe(true)
    expect(hasInAppFlag('https://questports.vercel.app/ports/iron-lung-vr?x=1&inApp=1#install-guide')).toBe(true)
    expect(hasInAppFlag('?inApp=0')).toBe(false)
    expect(hasInAppFlag('?inApp=true')).toBe(false)
    expect(hasInAppFlag('?inApp=')).toBe(false)
    expect(hasInAppFlag('?questBrowser=1')).toBe(false)
    expect(hasInAppFlag(null)).toBe(false)

    expect(isAppBridgeSession({ userAgent: CHROME_UA, search: '?inApp=1' })).toBe(true)
    expect(isAppBridgeSession({ userAgent: APP_UA, search: '' })).toBe(true)
    expect(isAppBridgeSession({ userAgent: CHROME_UA, search: '', bridgePresent: true })).toBe(true)
    expect(isAppBridgeSession({ userAgent: CHROME_UA, search: '' })).toBe(false)
    expect(isAppBridgeClient()).toBe(false)
  })

  it('does not treat the wrapper as Quest Browser, even when the device name is Quest', () => {
    expect(isQuestBrowserUserAgent(APP_UA)).toBe(false)
    expect(browserFamilyFromUserAgent(APP_UA)).toBe('QuestPortsApp')
    expect('QuestPortsApp'.length).toBeLessThanOrEqual(32)
    expect(browserFamilyFromUserAgent(
      'Mozilla/5.0 (Linux; Android 12; Quest 3; wv) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36'
    )).toBe('In-app')
  })
})

describe('app bridge install url and status', () => {
  it('uses the same apk-proxy URL as WebUSB, as an absolute URL', () => {
    const source = 'https://github.com/Team-Beef-Studios/RTCWQuest/releases/latest'
    expect(appBridgeApkUrl('https://questports.vercel.app', source)).toBe(
      `https://questports.vercel.app/api/apk-proxy?url=${encodeURIComponent(source)}&redirect=1`
    )
    expect(appBridgeApkUrl('https://questports.vercel.app/', '/api/apk-proxy?url=https%3A%2F%2Fexample.com%2Fa.apk')).toBe(
      'https://questports.vercel.app/api/apk-proxy?url=https%3A%2F%2Fexample.com%2Fa.apk&redirect=1'
    )
    expect(appBridgeApkUrl(
      'https://questports.vercel.app',
      'https://questports.vercel.app/api/apk-proxy?url=https%3A%2F%2Fexample.com%2Fa.apk&redirect=1'
    )).toBe(
      'https://questports.vercel.app/api/apk-proxy?url=https%3A%2F%2Fexample.com%2Fa.apk&redirect=1'
    )
    expect(appBridgeApkUrl('http://localhost:3000', 'http://example.com/app.apk')).toBeNull()
    expect(appBridgeApkUrl('https://questports.vercel.app', '')).toBeNull()
    expect(appBridgeApkUrl('', source)).toBeNull()
  })

  it('labels progress, permission, errors, and a comparable version change', () => {
    expect(appInstallStatusLabel('downloading', 0)).toBe('Downloading 0%')
    expect(appInstallStatusLabel('downloading', 0.426)).toBe('Downloading 43%')
    expect(appInstallStatusLabel('downloading', 1.4)).toBe('Downloading 100%')
    expect(appInstallStatusLabel('installing')).toBe('Installing')
    expect(appInstallStatusLabel('success')).toBe('Installed')
    expect(APP_INSTALL_PERMISSION_HINT).toBe('Allow QuestPorts to install apps, then come back')
    expect(appInstallErrorMessage('')).toBe('Install failed.')
    expect(appInstallErrorMessage('  disk full  ')).toBe('disk full')

    expect(appBridgeInstallErrorReason('cancelled')).toBe('user_cancelled')
    expect(appBridgeInstallErrorReason('needs_permission')).toBe('unauthorized')
    expect(appBridgeInstallErrorReason('error', 'Allow permission to install unknown apps')).toBe('unauthorized')
    expect(appBridgeInstallErrorReason('error', 'Failed to download APK: HTTP 404')).toBe('download_fail')
    expect(appBridgeInstallErrorReason('error', 'INSTALL_FAILED_INVALID_APK')).toBe('pm_fail')
    expect(appBridgeInstallErrorReason('error', 'Not enough free space')).toBe('storage')
    expect(appBridgeInstallErrorReason('error', '')).toBe('other')

    expect(appUpdateAvailable('1.0.0', 'v1.2.0')).toBe(true)
    expect(appUpdateAvailable('v1.2.0', '1.2.0')).toBe(false)
    expect(appUpdateAvailable('v1.3.0', 'v1.2.0')).toBe(true)
    expect(appUpdateAvailable(null, 'v1.2.0')).toBe(false)
    expect(appUpdateAvailable('latest', 'v1.2.0')).toBe(false)
  })
})

describe('mock app bridge', () => {
  it('emits download progress and then success', () => {
    const events: AppBridgeEventDetail[] = []
    const queue: Array<() => void> = []
    const bridge = createMockQuestPortsApp({
      schedule(fn) {
        queue.push(fn)
        return queue.length
      },
      clear() {},
      emit(detail) {
        events.push(detail)
      },
      successVersion: '0.9.0'
    })

    const requestId = bridge.installApk('https://questports.vercel.app/api/apk-proxy?url=https%3A%2F%2Fexample.com%2Fa.apk', 'com.example.game')
    expect(requestId).toMatch(/^mock-/)
    expect(bridge.isInstalled('com.example.game')).toBe(false)
    for (const fn of queue) fn()

    expect(events.map(event => event.status)).toEqual([
      'downloading',
      'downloading',
      'downloading',
      'installing',
      'success'
    ])
    expect(events[0]).toMatchObject({ requestId, packageName: 'com.example.game', progress: 0.08 })
    expect(events.every(event => event.progress === undefined || (event.progress >= 0 && event.progress <= 1))).toBe(true)
    expect(bridge.isInstalled('com.example.game')).toBe(true)
    expect(bridge.getInstalledVersion('com.example.game')).toBe('0.9.0')
    expect(bridge.launch('com.example.game')).toBe(true)
    expect(bridge.launch('com.other')).toBe(false)
  })

  it('cancel stops later progress events', () => {
    const events: AppBridgeEventDetail[] = []
    const queue: Array<() => void | null> = []
    const bridge = createMockQuestPortsApp({
      schedule(fn) {
        queue.push(fn)
        return queue.length - 1
      },
      clear(handle) {
        queue[handle] = () => {}
      },
      emit(detail) {
        events.push(detail)
      }
    })
    const requestId = bridge.installApk('https://example.com/a.apk', 'com.example.game')
    bridge.cancel(requestId)
    expect(events).toEqual([{ requestId, packageName: 'com.example.game', status: 'cancelled' }])
    for (const fn of queue) fn()
    expect(events.some(event => event.status === 'success')).toBe(false)
    expect(bridge.isInstalled('com.example.game')).toBe(false)
  })

  it('reports a package that was already installed', () => {
    const bridge = createMockQuestPortsApp({
      installed: { 'com.example.game': '0.4.0' }
    })
    expect(bridge.isInstalled('com.example.game')).toBe(true)
    expect(bridge.getInstalledVersion('com.example.game')).toBe('0.4.0')
    expect(bridge.getInstalledVersion('com.missing')).toBeNull()
  })
})

describe('app bridge analytics', () => {
  it('stores props.app and classifies the browser as QuestPortsApp without a migration', () => {
    const click = clientAnalyticsPayload('install_click', withAppAnalyticsProp({
      path: '/ports/iron-lung-vr',
      portSlug: 'iron-lung-vr',
      webusb: true
    }, true))
    expect(click?.props).toEqual({ app: true })
    expect(click?.webusb).toBe(false)

    const storedClick = decide(click, APP_UA)
    expect(storedClick.record).toBe(true)
    expect(storedClick.row?.browser).toBe('QuestPortsApp')
    expect(storedClick.row?.props).toEqual({ app: true })
    expect(storedClick.row?.webusb).toBe(false)

    const failure = clientAnalyticsPayload('install_error', {
      path: '/ports/iron-lung-vr',
      portSlug: 'iron-lung-vr',
      props: { reason: 'user_cancelled', app: true, userAgent: 'drop me' }
    })
    expect(failure?.props).toEqual({ reason: 'user_cancelled', app: true })
    const storedFailure = decide(failure, APP_UA)
    expect(storedFailure.row?.props).toEqual({ reason: 'user_cancelled', app: true })
    expect(JSON.stringify(storedFailure.row?.props).length).toBeLessThanOrEqual(400)

    const success = clientAnalyticsPayload('install_success', {
      path: '/ports/rtcwquest',
      portSlug: 'rtcwquest',
      props: { ref: 'reddit', app: true }
    })
    expect(success?.props).toEqual({ ref: 'reddit', app: true })

    const page = clientAnalyticsPayload('page_view', withAppAnalyticsProp({
      path: '/ports/iron-lung-vr'
    }, true))
    expect(page?.props).toEqual({ app: true })

    const browserOnly = decide({
      event: 'install_click',
      path: '/ports/iron-lung-vr',
      portSlug: 'iron-lung-vr'
    }, APP_UA)
    expect(browserOnly.row?.browser).toBe('QuestPortsApp')
    expect(browserOnly.row?.props).toBeNull()

    expect(withAppAnalyticsProp({ path: '/', webusb: true, props: { reason: 'pm_fail' } }, false)).toEqual({
      path: '/',
      webusb: true,
      props: { reason: 'pm_fail' }
    })

    const migrations = [
      '20261009200000_analytics_events.sql',
      '20261009230000_analytics_funnel_events.sql'
    ].map(name => readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8')).join('\n')
    expect(migrations).not.toMatch(/browser in \(/i)
    expect(migrations).toContain('char_length(browser) between 1 and 32')
    expect(migrations).not.toContain("props->>'app'")
  })
})

describe('app bridge install gate', () => {
  it('replaces USB, Quest Browser, and direct-install steps inside the app', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const bridgeAt = page.indexOf('<AppBridgeInstall')
    const usbAt = page.indexOf('<div v-else class="space-y-3 pt-1">')
    expect(bridgeAt).toBeGreaterThan(0)
    expect(usbAt).toBeGreaterThan(bridgeAt)
    expect(page).toContain('v-if="inApp"')
    expect(page).toContain('v-if="!inApp"')
    expect(page).toContain(':package-name="currentPackageConfig?.packageName || null"')
    expect(page).toContain(':needs-game-files="!isPcBuilderRequired && !isDirectApkOnly"')
    expect(page).toContain("if (inApp.value) return")
    expect(page).toContain('installSupport !== \'unsupported\' && !inApp')

    const begin = page.slice(page.indexOf('const beginInstall'))
    expect(begin.indexOf('if (inApp.value) return')).toBeGreaterThan(0)
    expect(begin.indexOf('if (inApp.value) return')).toBeLessThan(begin.indexOf('if (questBrowser.value) return'))

    const navbar = readFileSync(new URL('../app/components/Navbar.vue', import.meta.url), 'utf8')
    expect(navbar).toContain('<ClientOnly v-if="!inApp">')
    expect(navbar).toContain('useAppBridge')

    const install = readFileSync(new URL('../app/components/AppBridgeInstall.vue', import.meta.url), 'utf8')
    expect(install).toContain('data-testid="install-on-quest"')
    expect(install).toContain('data-testid="app-install-progress"')
    expect(install).toContain('data-testid="app-install-cancel"')
    expect(install).toContain('data-testid="app-install-installed"')
    expect(install).toContain('data-testid="app-install-open"')
    expect(install).toContain('data-testid="app-install-update"')
    expect(install).toContain('data-testid="app-install-permission"')
    expect(install).toContain('data-testid="app-install-error"')
    expect(install).toContain('APP_INSTALL_PERMISSION_HINT')
    expect(install).toContain('GAME_FILES_NEED_PC')
    expect(install).toContain('GAME_FILES_GUIDE_HREF')
    expect(install).toContain("trackInstall('install_click')")
    expect(install).toContain("trackInstall('install_success')")
    expect(install).toContain("trackInstall('install_error', 'user_cancelled')")
    expect(install).toContain('appBridgeApkUrl')
    expect(install).not.toContain('DirectQuestInstall')
    expect(install).not.toContain('type="file"')
    expect(install).not.toContain('webkitGetAsEntry')

    const adb = readFileSync(new URL('../app/composables/useQuestAdb.ts', import.meta.url), 'utf8')
    const connectAt = adb.indexOf('const connect = async')
    expect(adb.indexOf('if (isAppBridgeClient()) return false', connectAt)).toBeGreaterThan(connectAt)
    expect(adb.indexOf('if (isAppBridgeClient()) return false', connectAt)).toBeLessThan(adb.indexOf('requestDevice()', connectAt))

    const composable = readFileSync(new URL('../app/composables/useAppBridge.ts', import.meta.url), 'utf8')
    expect(composable).not.toContain('useRequestHeaders')
    expect(composable).toContain('hasInAppFlag')
    expect(composable).toContain('onMounted')
    expect(composable).toContain("useState('questports-app-bridge'")
    expect(composable).toContain('ensureMockAppBridge')
    expect(install).not.toContain('X-QuestPorts-Unwrap')
    expect(install).not.toContain('content-disposition')
    expect(install).not.toContain('Content-Type')

    const plugin = readFileSync(new URL('../app/plugins/analytics.client.ts', import.meta.url), 'utf8')
    expect(plugin).toContain('!isAppBridgeClient()')

    expect(shareablePageHref('https://questports.vercel.app/ports/iron-lung-vr?inApp=1')).toBe(
      'https://questports.vercel.app/ports/iron-lung-vr'
    )
  })
})
