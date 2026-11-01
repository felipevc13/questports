<template>
  <details
    v-if="status === 'yes'"
    data-testid="no-pc-notice"
    class="group mt-1.5 text-[11px] leading-relaxed"
    :open="open"
  >
    <summary class="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 font-semibold text-primary hover:underline md:min-h-0 [&::-webkit-details-marker]:hidden">
      <span aria-hidden="true" class="transition-transform group-open:rotate-90">›</span>
      {{ NO_PC_TITLE }}
    </summary>
    <ol class="mt-1 space-y-1 pl-4 text-muted-foreground">
      <li
        v-for="(step, index) in steps"
        :key="step"
        class="list-decimal"
      >{{ step }}</li>
    </ol>
    <a
      v-if="downloadUrl"
      :href="downloadUrl"
      target="_blank"
      rel="noopener noreferrer"
      data-testid="no-pc-apk"
      class="mt-1 inline-flex min-h-11 items-center pl-4 font-semibold text-primary underline md:min-h-0"
      @click="emit('download')"
    >
      Download the APK<span v-if="downloadSource">&nbsp;({{ downloadSource }})</span>
    </a>
  </details>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NO_PC_TITLE, isReleasePageUrl, noPcInstall, noPcSteps } from '~/lib/noPcInstall'

const props = defineProps<{
  slug: string
  needsFiles: boolean
  folders?: string[]
  downloadUrl?: string | null
  downloadSource?: string | null
  /** Start expanded. The Quest Browser notice uses this: there it is the main path. */
  open?: boolean
}>()

const emit = defineEmits<{ download: [] }>()

const status = computed(() => noPcInstall(props.slug))
const steps = computed(() => noPcSteps({
  needsFiles: props.needsFiles,
  folders: props.folders,
  releasePage: isReleasePageUrl(props.downloadUrl)
}))
</script>
