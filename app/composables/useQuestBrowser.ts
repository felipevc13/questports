import { watch } from 'vue'
import { isQuestBrowserSession } from '~/lib/questBrowser'

/**
 * Same boolean on the server and during hydration.
 * The server reads the request user-agent and URL. The client reuses that
 * payload, then updates only after a client-side navigation.
 */
export function useQuestBrowser() {
  const route = useRoute()
  const requestUa = import.meta.server ? useRequestHeaders(['user-agent'])['user-agent'] : ''

  const questBrowser = useState('quest-browser', () => isQuestBrowserSession({
    userAgent: import.meta.server
      ? requestUa
      : (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
    search: import.meta.server
      ? route.fullPath
      : (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : route.fullPath)
  }))

  if (import.meta.client) {
    watch(() => route.fullPath, (fullPath) => {
      questBrowser.value = isQuestBrowserSession({
        userAgent: navigator.userAgent,
        search: fullPath
      })
    })
  }

  return questBrowser
}
