<template>
  <div data-testid="quest-browser-notice" class="space-y-2" role="status">
    <p class="text-xs font-semibold text-foreground">{{ QUEST_BROWSER_NOTICE_TITLE }}</p>
    <p class="text-[11px] text-muted-foreground leading-relaxed">
      {{ QUEST_BROWSER_NOTICE_BODY }}
    </p>
    <button
      type="button"
      data-testid="quest-browser-copy-link"
      class="inline-flex min-h-11 items-center text-[11px] font-semibold hover:underline md:min-h-0"
      :class="copied ? 'text-emerald-400' : 'text-primary'"
      @click="copyLink"
    >
      {{ questBrowserCopyLabel(copied) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTrack } from '~/composables/useTrack'
import { portSlugFromPath } from '~/lib/analytics'
import {
  QUEST_BROWSER_NOTICE_BODY,
  QUEST_BROWSER_NOTICE_TITLE,
  copyTextToClipboard,
  questBrowserCopyLabel
} from '~/lib/questBrowser'

const route = useRoute()
const { track } = useTrack()
const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined
const noticed = useState('quest-browser-notice-tracked', () => false)

const trackNotice = (action: 'shown' | 'copy_link') => {
  track('unsupported_browser_view', {
    path: route.path,
    portSlug: portSlugFromPath(route.path),
    props: { action }
  })
}

onMounted(() => {
  if (noticed.value) return
  noticed.value = true
  trackNotice('shown')
})

onUnmounted(() => {
  if (resetTimer) clearTimeout(resetTimer)
})

const copyLink = async () => {
  const url = window.location.href
  trackNotice('copy_link')
  const ok = await copyTextToClipboard(url)
  if (!ok) return
  copied.value = true
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>
