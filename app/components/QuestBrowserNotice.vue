<template>
  <NoPcNotice
    v-if="noPc"
    open
    :slug="slug"
    :needs-files="needsGameFiles"
    :folders="noPcFolders"
    :download-url="downloadUrl"
    :download-source="downloadSource"
  />
  <div v-else data-testid="quest-browser-notice" class="space-y-2" role="status">
    <p class="text-xs font-semibold text-foreground">{{ QUEST_BROWSER_NOTICE_TITLE }}</p>
    <DirectQuestInstall
      v-if="!needsGameFiles"
      :download-url="downloadUrl"
      :download-source="downloadSource"
      :needs-game-files="false"
      primary
    />
    <template v-else>
      <DirectQuestInstall needs-game-files />
      <p class="text-[11px] text-muted-foreground leading-relaxed">
        {{ QUEST_BROWSER_NOTICE_BODY }}
      </p>
    </template>
    <p v-if="!needsGameFiles" class="text-[11px] text-muted-foreground leading-relaxed">
      {{ QUEST_BROWSER_PC_FALLBACK }}
    </p>
    <button
      type="button"
      data-testid="quest-browser-copy-link"
      class="inline-flex min-h-11 items-center text-[11px] font-semibold hover:underline md:min-h-0"
      :class="copied ? 'text-emerald-400' : 'text-primary'"
      @click="send"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePageLinkShare } from '~/composables/usePageLinkShare'
import { useTrack } from '~/composables/useTrack'
import { portSlugFromPath } from '~/lib/analytics'
import { noPcInstall } from '~/lib/noPcInstall'
import {
  QUEST_BROWSER_NOTICE_BODY,
  QUEST_BROWSER_NOTICE_TITLE,
  QUEST_BROWSER_PC_FALLBACK
} from '~/lib/questBrowser'

const props = withDefaults(defineProps<{
  downloadUrl?: string | null
  downloadSource?: string | null
  needsGameFiles?: boolean
  noPcFolders?: string[]
}>(), {
  needsGameFiles: true
})

const route = useRoute()
const slug = computed(() => portSlugFromPath(route.path) || '')
const noPc = computed(() => noPcInstall(slug.value) === 'yes')
const { track } = useTrack()
const { copied, label, send } = usePageLinkShare()
const noticed = useState('quest-browser-notice-tracked', () => false)

onMounted(() => {
  if (noticed.value) return
  noticed.value = true
  track('unsupported_browser_view', {
    path: route.path,
    portSlug: portSlugFromPath(route.path),
    props: { action: 'shown' }
  })
})
</script>
