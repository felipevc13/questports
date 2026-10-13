<template>
  <div
    v-if="visible"
    data-testid="quest-app-banner"
    class="border-b border-primary/30 bg-primary/10"
    role="region"
    aria-label="QuestPorts app"
  >
    <div class="mx-auto flex w-full max-w-[1720px] items-center gap-2 px-3 py-1 sm:px-6 lg:px-10">
      <NuxtLink
        :to="QUEST_APP_BANNER_HREF"
        data-testid="quest-app-banner-link"
        class="flex min-h-11 flex-1 items-center text-xs font-medium text-foreground hover:underline sm:text-sm"
        @click="onClick"
      >
        {{ QUEST_APP_BANNER_COPY }}
      </NuxtLink>
      <button
        type="button"
        data-testid="quest-app-banner-dismiss"
        class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg leading-none text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Dismiss"
        @click="dismiss"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppBridge } from '~/composables/useAppBridge'
import { useQuestBrowser } from '~/composables/useQuestBrowser'
import { useTrack } from '~/composables/useTrack'
import {
  QUEST_APP_BANNER_COPY,
  QUEST_APP_BANNER_HREF,
  readQuestAppBannerDismissed,
  shouldShowQuestAppBanner,
  writeQuestAppBannerDismissed
} from '~/lib/questAppBanner'

const bannerSurface = { surface: 'banner' as const }

const route = useRoute()
const questBrowser = useQuestBrowser()
const { inApp } = useAppBridge()
const { track } = useTrack()

const storageReady = ref(false)
const dismissed = ref(false)
const viewed = useState('quest-app-banner-viewed', () => false)

const visible = computed(() => storageReady.value && shouldShowQuestAppBanner({
  questBrowser: questBrowser.value,
  inApp: inApp.value,
  dismissed: dismissed.value,
  path: route.path
}))

const reportView = () => {
  if (!visible.value || viewed.value) return
  viewed.value = true
  track('banner_view', { path: route.path, props: bannerSurface })
}

onMounted(() => {
  dismissed.value = readQuestAppBannerDismissed(window.localStorage)
  storageReady.value = true
  reportView()
})

watch(visible, () => {
  reportView()
})

const onClick = () => {
  track('banner_click', { path: route.path, props: bannerSurface })
}

const dismiss = () => {
  dismissed.value = true
  writeQuestAppBannerDismissed(window.localStorage)
  track('banner_dismiss', { path: route.path, props: bannerSurface })
}
</script>
