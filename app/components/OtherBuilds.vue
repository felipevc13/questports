<template>
  <div
    v-if="builds.length"
    id="other-builds"
    class="space-y-3 rounded-xl border border-border bg-card p-4 text-xs md:p-6"
    data-testid="other-builds"
  >
    <div class="flex items-center justify-between gap-2 border-b border-border pb-3">
      <h2 class="text-sm font-bold tracking-tight text-foreground">Other builds of this game</h2>
      <span class="font-mono text-[10px] text-muted-foreground">Manual install</span>
    </div>
    <p class="leading-relaxed text-muted-foreground">
      One-click install above uses the main port. These are other ports of the same game, from other developers. They install as separate apps.
    </p>

    <div
      v-for="build in builds"
      :key="build.id"
      class="space-y-2.5 rounded-lg border border-border/80 bg-muted/20 p-3"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span class="font-semibold text-foreground">{{ build.title }}</span>
        <span class="font-mono text-[10px] text-muted-foreground">{{ build.version }} · {{ formatDate(build.releasedOn) }}</span>
      </div>
      <p class="text-muted-foreground">
        by <a :href="build.developerUrl" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">{{ build.developer }}</a>
        · {{ build.hardware.join(', ') }}
      </p>
      <p class="leading-relaxed text-foreground">{{ build.pick }}</p>
      <p class="leading-relaxed text-amber-300">{{ build.caveat }}</p>
      <ol class="list-decimal space-y-1 pl-4 leading-relaxed text-muted-foreground">
        <li v-for="step in build.steps" :key="step">{{ step }}</li>
      </ol>
      <div class="flex flex-wrap gap-2 pt-1">
        <a
          :href="build.apkUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center rounded-lg border border-border px-3 py-2 font-semibold text-foreground transition-colors hover:bg-muted/50 md:min-h-0"
          @click="$emit('download', build.id)"
        >
          Download APK ({{ build.version }}) ↗
        </a>
        <a
          :href="build.repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-primary hover:underline md:min-h-0"
        >
          GitHub ↗
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OtherBuild } from '~/data/otherBuilds'

defineProps<{
  builds: OtherBuild[]
}>()

defineEmits<{
  download: [buildId: string]
}>()

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}
</script>
