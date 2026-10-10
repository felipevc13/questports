<template>
  <div data-testid="direct-quest-install" class="space-y-1.5">
    <template v-if="needsGameFiles">
      <p data-testid="game-files-need-pc" class="text-[11px] text-muted-foreground leading-relaxed">
        {{ GAME_FILES_NEED_PC }}
      </p>
      <a
        data-testid="game-files-guide"
        :href="GAME_FILES_GUIDE_HREF"
        class="inline-flex min-h-11 items-center text-[11px] font-semibold text-primary hover:underline md:min-h-0"
      >
        {{ GAME_FILES_GUIDE_LABEL }}
      </a>
    </template>
    <template v-else>
      <button
        v-if="!primary"
        type="button"
        data-testid="direct-install-toggle"
        class="inline-flex min-h-11 items-center text-[11px] font-semibold text-primary hover:underline md:min-h-0"
        :aria-expanded="open"
        @click="toggle"
      >
        {{ open ? 'Hide direct install' : DIRECT_QUEST_INSTALL_TITLE }}
      </button>
      <div v-if="primary || open" data-testid="direct-install-steps" class="space-y-1.5">
        <p v-if="primary" class="text-xs font-semibold text-foreground">{{ DIRECT_QUEST_INSTALL_TITLE }}</p>
        <ol class="space-y-1.5">
          <li
            v-for="(step, index) in DIRECT_QUEST_INSTALL_STEPS"
            :key="step"
            class="flex items-start gap-2 text-[11px] text-foreground leading-relaxed"
          >
            <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">{{ index + 1 }}</span>
            <span>{{ step }}</span>
          </li>
        </ol>
        <p class="text-[11px] text-muted-foreground leading-relaxed">{{ DIRECT_QUEST_INSTALL_NOTE }}</p>
        <a
          v-if="downloadUrl"
          :href="downloadUrl"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="direct-install-apk"
          class="inline-flex min-h-11 items-center text-[11px] font-semibold text-primary underline md:min-h-0"
          @click="onDownload"
        >
          Download the APK<span v-if="downloadSource"> ({{ downloadSource }})</span>
        </a>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { useTrack } from '~/composables/useTrack'
import { portSlugFromPath } from '~/lib/analytics'
import {
  DIRECT_QUEST_INSTALL_NOTE,
  DIRECT_QUEST_INSTALL_STEPS,
  DIRECT_QUEST_INSTALL_TITLE,
  GAME_FILES_GUIDE_HREF,
  GAME_FILES_GUIDE_LABEL,
  GAME_FILES_NEED_PC
} from '~/lib/directQuestInstall'

const props = withDefaults(defineProps<{
  downloadUrl?: string | null
  downloadSource?: string | null
  needsGameFiles?: boolean
  /** Open, with no toggle. Used on the Quest browser, where this is the main path. */
  primary?: boolean
}>(), {
  needsGameFiles: false,
  primary: false
})

const route = useRoute()
const { track } = useTrack()
const quest = useQuestAdb()
const open = ref(false)
const trackedPrimary = useState('direct-install-open-path', () => '')

const trackOpen = () => {
  track('unsupported_browser_view', {
    path: route.path,
    portSlug: portSlugFromPath(route.path),
    props: { action: 'direct_install_open' }
  })
}

const toggle = () => {
  open.value = !open.value
  if (open.value) trackOpen()
}

const onDownload = () => {
  track('manual_download_click', {
    path: route.path,
    portSlug: portSlugFromPath(route.path),
    headset: quest.deviceModel.value || null
  })
}

onMounted(() => {
  if (!props.primary || props.needsGameFiles) return
  if (trackedPrimary.value === route.path) return
  trackedPrimary.value = route.path
  trackOpen()
})
</script>
