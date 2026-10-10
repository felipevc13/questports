import { onMounted, watch } from 'vue'
import { hasQuestBrowserFlag, isQuestBrowserSession } from '~/lib/questBrowser'

/**
 * Cached HTML is shared across browsers, so the server only honors the URL flag.
 * The user-agent is applied after hydration. That matches the payload on the
 * first paint and avoids a mismatch.
 */
export function useQuestBrowser() {
  const route = useRoute()

  const questBrowser = useState('quest-browser', () => hasQuestBrowserFlag(route.fullPath))

  if (import.meta.client) {
    const sync = (fullPath: string) => {
      questBrowser.value = isQuestBrowserSession({
        userAgent: navigator.userAgent,
        search: fullPath
      })
    }

    onMounted(() => {
      sync(route.fullPath)
    })

    watch(() => route.fullPath, (fullPath) => {
      sync(fullPath)
    })
  }

  return questBrowser
}
