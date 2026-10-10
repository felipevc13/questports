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
      data-testid="unsupported-send-link"
      class="inline-flex min-h-11 items-center text-[11px] font-semibold hover:underline md:min-h-0"
      :class="copied ? 'text-emerald-400' : 'text-primary'"
      @click="send"
    >
      {{ label }}
    </button>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageLinkShare } from '~/composables/usePageLinkShare'
import {
  mockUserAgentFromSearch,
  unsupportedNoticeForUserAgent
} from '~/lib/unsupportedBrowser'

const route = useRoute()
const { copied, label, send } = usePageLinkShare()

const notice = computed(() => {
  const preview = mockUserAgentFromSearch(route.fullPath)
  const userAgent = preview || (typeof navigator !== 'undefined' ? navigator.userAgent : '')
  return unsupportedNoticeForUserAgent(userAgent)
})
</script>
