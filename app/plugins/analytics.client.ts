import { useRouter } from 'vue-router'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { useTrack } from '~/composables/useTrack'
import { appBridgeVersionFromUserAgent, isAppBridgeClient } from '~/lib/appBridge'
import { portSlugFromPath } from '~/lib/analytics'
import {
  APP_OPEN_SEEN_KEY,
  APP_OPEN_SESSION_KEY,
  appOpenDecision
} from '~/lib/questAppFunnel'
import { isQuestBrowserSession } from '~/lib/questBrowser'
import { isWebUsbAvailable } from '~/lib/questInstallUx'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const { track } = useTrack()
  const quest = useQuestAdb()
  let lastPath = ''
  let reportedUnsupported = false

  const trackPage = (path: string) => {
    if (!path || path === lastPath) return
    lastPath = path
    const portSlug = portSlugFromPath(path)
    const headset = quest.deviceModel.value || null
    track('page_view', { path, portSlug, headset })
    if (portSlug) track('port_view', { path, portSlug, headset })
    const questBrowser = isQuestBrowserSession({
      userAgent: navigator.userAgent,
      search: window.location.search
    })
    if (!reportedUnsupported && !isAppBridgeClient() && !questBrowser && !isWebUsbAvailable(navigator, window.isSecureContext)) {
      reportedUnsupported = true
      track('unsupported_browser_view', { path, portSlug, headset, webusb: false })
    }
  }

  trackPage(router.currentRoute.value.path)
  router.afterEach((to) => {
    trackPage(to.path)
  })

  // The native app is a WebView of this site. One app_open per WebView session.
  nuxtApp.hook('app:mounted', () => {
    if (!isAppBridgeClient()) return
    let seen = false
    let alreadySent = false
    try {
      seen = window.localStorage.getItem(APP_OPEN_SEEN_KEY) === '1'
      alreadySent = window.sessionStorage.getItem(APP_OPEN_SESSION_KEY) === '1'
    } catch {
      return
    }
    const version = appBridgeVersionFromUserAgent(navigator.userAgent)
      || window.QuestPortsApp?.version
      || null
    const payload = appOpenDecision({ version, seen, alreadySent })
    if (!payload) return
    track('app_open', { path: window.location.pathname, props: payload })
    try {
      window.sessionStorage.setItem(APP_OPEN_SESSION_KEY, '1')
      window.localStorage.setItem(APP_OPEN_SEEN_KEY, '1')
    } catch {
      // The event already left. A failed write can count the next launch as first again.
    }
  })
})
