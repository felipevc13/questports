import { onMounted, watch } from 'vue'
import { isQuestBrowserSession } from '~/lib/questBrowser'

/**
 * The ISR document is shared, so the server does not branch on ?questBrowser=1.
 * After hydration the client checks the user-agent and the URL flag.
 * That matches the cached HTML on the first paint.
 */
export function useQuestBrowser() {
  const route = useRoute()

  const questBrowser = useState('quest-browser', () => false)

  if (import.meta.client) {
    const sync = () => {
      questBrowser.value = isQuestBrowserSession({
        userAgent: navigator.userAgent,
        search: `${window.location.pathname}${window.location.search}`
      })
    }

    onMounted(() => {
      sync()
    })

    watch(() => route.fullPath, () => {
      sync()
    })
  }

  return questBrowser
}
