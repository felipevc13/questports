import { onMounted, watch } from 'vue'
import { ensureMockAppBridge, hasInAppFlag, isAppBridgeSession } from '~/lib/appBridge'

/**
 * Cached HTML is shared across browsers, so the server only honors `?inApp=1`.
 * The user-agent and `window.QuestPortsApp` are applied after hydration.
 * `?inApp=1` installs a mock bridge that emits download progress and success.
 */
export function useAppBridge() {
  const route = useRoute()

  const inApp = useState('questports-app-bridge', () => hasInAppFlag(route.fullPath))

  if (import.meta.client) {
    const sync = (fullPath: string) => {
      ensureMockAppBridge(fullPath)
      inApp.value = isAppBridgeSession({
        userAgent: navigator.userAgent,
        search: fullPath,
        bridgePresent: Boolean(window.QuestPortsApp)
      })
    }

    onMounted(() => {
      sync(route.fullPath)
    })

    watch(() => route.fullPath, (fullPath) => {
      sync(fullPath)
    })
  }

  return { inApp }
}
