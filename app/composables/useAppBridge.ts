import { watch, onMounted } from 'vue'
import { ensureMockAppBridge, isAppBridgeSession } from '~/lib/appBridge'

/**
 * Same boolean on the server and during hydration.
 * The server reads the request user-agent and URL. The client reuses that
 * payload, then updates after mount if `window.QuestPortsApp` is already there.
 * `?inApp=1` installs a mock bridge that emits download progress and success.
 */
export function useAppBridge() {
  const route = useRoute()
  const requestUa = import.meta.server ? useRequestHeaders(['user-agent'])['user-agent'] : ''

  const inApp = useState('questports-app-bridge', () => isAppBridgeSession({
    userAgent: import.meta.server
      ? requestUa
      : (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
    search: import.meta.server
      ? route.fullPath
      : (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : route.fullPath)
  }))

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
