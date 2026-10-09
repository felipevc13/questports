<template>
  <div data-testid="webusb-unsupported" class="space-y-2" role="status">
    <p data-testid="unsupported-browser-title" class="text-xs font-semibold text-foreground">
      {{ notice.title }}
    </p>
    <p data-testid="unsupported-browser-body" class="text-[11px] text-muted-foreground leading-relaxed">
      {{ notice.body }}
    </p>
    <button
      v-if="notice.copyLink"
      type="button"
      data-testid="unsupported-copy-link"
      class="inline-flex min-h-11 items-center text-[11px] font-semibold hover:underline md:min-h-0"
      :class="copied ? 'text-emerald-400' : 'text-primary'"
      @click="copyLink"
    >
      {{ questBrowserCopyLabel(copied) }}
    </button>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTrack } from '~/composables/useTrack'
import { portSlugFromPath } from '~/lib/analytics'
import { copyTextToClipboard, questBrowserCopyLabel } from '~/lib/questBrowser'
import {
  mockUserAgentFromSearch,
  shareablePageHref,
  unsupportedNoticeForUserAgent
} from '~/lib/unsupportedBrowser'

const route = useRoute()
const { track } = useTrack()
const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

const notice = computed(() => {
  const preview = mockUserAgentFromSearch(route.fullPath)
  const userAgent = preview || (typeof navigator !== 'undefined' ? navigator.userAgent : '')
  return unsupportedNoticeForUserAgent(userAgent)
})

onUnmounted(() => {
  if (resetTimer) clearTimeout(resetTimer)
})

const copyLink = async () => {
  const href = typeof window !== 'undefined' ? window.location.href : ''
  track('unsupported_browser_view', {
    path: route.path,
    portSlug: portSlugFromPath(route.path),
    props: { action: 'copy_link' }
  })
  const ok = await copyTextToClipboard(shareablePageHref(href))
  if (!ok) return
  copied.value = true
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>
