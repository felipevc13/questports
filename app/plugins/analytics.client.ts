import { useRouter } from 'vue-router'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { useTrack } from '~/composables/useTrack'
import { portSlugFromPath } from '~/lib/analytics'
import { isQuestBrowserSession } from '~/lib/questBrowser'
import { isWebUsbAvailable } from '~/lib/questInstallUx'

export default defineNuxtPlugin(() => {
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
    if (!reportedUnsupported && !questBrowser && !isWebUsbAvailable(navigator, window.isSecureContext)) {
      reportedUnsupported = true
      track('unsupported_browser_view', { path, portSlug, headset, webusb: false })
    }
  }

  trackPage(router.currentRoute.value.path)
  router.afterEach((to) => {
    trackPage(to.path)
  })
})
