import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTrack } from '~/composables/useTrack'
import { portSlugFromPath } from '~/lib/analytics'
import {
  canUseWebShare,
  copyTextToClipboard,
  pageLinkActionLabel,
  sharePage
} from '~/lib/questBrowser'
import { shareablePageHref } from '~/lib/unsupportedBrowser'

/** "Send link to my PC" when the browser can share, otherwise copy the page URL. */
export function usePageLinkShare() {
  const route = useRoute()
  const { track } = useTrack()
  const copied = ref(false)
  const canShare = ref(false)
  let resetTimer: ReturnType<typeof setTimeout> | undefined

  onMounted(() => {
    canShare.value = canUseWebShare(typeof navigator === 'undefined' ? null : navigator)
  })

  onUnmounted(() => {
    if (resetTimer) clearTimeout(resetTimer)
  })

  const label = computed(() => pageLinkActionLabel(copied.value, canShare.value))

  const send = async () => {
    const href = typeof window === 'undefined' ? '' : shareablePageHref(window.location.href)
    if (canShare.value) {
      track('unsupported_browser_view', {
        path: route.path,
        portSlug: portSlugFromPath(route.path),
        props: { action: 'share_link' }
      })
      await sharePage(navigator, { title: 'QuestPorts', url: href })
      return
    }
    track('unsupported_browser_view', {
      path: route.path,
      portSlug: portSlugFromPath(route.path),
      props: { action: 'copy_link' }
    })
    const ok = await copyTextToClipboard(href)
    if (!ok) return
    copied.value = true
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  }

  return { canShare, copied, label, send }
}
