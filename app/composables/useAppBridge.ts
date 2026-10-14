import { onMounted, watch } from 'vue'
import { ensureMockAppBridge, isAppBridgeSession } from '~/lib/appBridge'

/**
 * The ISR document is shared, so the server never renders app mode.
 * After hydration the client checks the QuestPortsApp user-agent,
 * window.QuestPortsApp, and ?inApp=1 on window.location.
 * `?inApp=1` installs a mock bridge that emits download progress and success.
 */
export function useAppBridge() {
  const route = useRoute()

  const inApp = useState('questports-app-bridge', () => false)

  if (import.meta.client) {
    const sync = () => {
      const fullPath = `${window.location.pathname}${window.location.search}`
      ensureMockAppBridge(fullPath)
      inApp.value = isAppBridgeSession({
        userAgent: navigator.userAgent,
        search: fullPath,
        bridgePresent: Boolean(window.QuestPortsApp)
      })
    }

    onMounted(() => {
      sync()
    })

    watch(() => route.fullPath, () => {
      sync()
    })
  }

  return { inApp }
}
