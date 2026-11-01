<template>
  <div
    v-if="status === 'yes'"
    data-testid="no-pc-notice"
    class="space-y-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3"
  >
    <p class="text-xs font-semibold text-foreground">{{ NO_PC_TITLE }}</p>
    <ol class="space-y-1.5">
      <li
        v-for="(step, index) in steps"
        :key="step"
        class="flex items-start gap-2 text-[11px] leading-relaxed text-foreground"
      >
        <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">{{ index + 1 }}</span>
        <span>{{ step }}</span>
      </li>
    </ol>
    <a
      v-if="downloadUrl"
      :href="downloadUrl"
      target="_blank"
      rel="noopener noreferrer"
      data-testid="no-pc-apk"
      class="inline-flex min-h-11 items-center text-[11px] font-semibold text-primary underline md:min-h-0"
      @click="emit('download')"
    >
      Download the APK<span v-if="downloadSource"> ({{ downloadSource }})</span>
    </a>
  </div>
  <p
    v-else-if="status === 'no'"
    data-testid="pc-needed-notice"
    class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-50"
  >
    {{ PC_REQUIRED_NOTE }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NO_PC_TITLE, PC_REQUIRED_NOTE, isReleasePageUrl, noPcInstall, noPcSteps } from '~/lib/noPcInstall'

const props = defineProps<{
  slug: string
  needsFiles: boolean
  folders?: string[]
  downloadUrl?: string | null
  downloadSource?: string | null
}>()

const emit = defineEmits<{ download: [] }>()

const status = computed(() => noPcInstall(props.slug))
const steps = computed(() => noPcSteps({
  needsFiles: props.needsFiles,
  folders: props.folders,
  releasePage: isReleasePageUrl(props.downloadUrl)
}))
</script>
