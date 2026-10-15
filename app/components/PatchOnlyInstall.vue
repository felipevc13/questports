<template>
  <div data-testid="patch-only-install" class="space-y-3 text-xs">
    <p class="text-[11px] leading-relaxed text-muted-foreground">{{ guide.lead }}</p>
    <ol v-if="guide.steps.length" class="space-y-3">
      <li v-for="(step, index) in guide.steps" :key="step.title" class="space-y-1.5">
        <div class="flex items-center gap-2">
          <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 font-mono text-xs font-bold text-primary">{{ index + 1 }}</span>
          <span class="text-xs font-bold text-foreground">{{ step.title }}</span>
        </div>
        <p
          v-for="paragraph in step.paragraphs"
          :key="paragraph"
          class="text-[11px] leading-relaxed text-muted-foreground"
        >
          {{ paragraph }}
        </p>
        <p v-if="step.code" class="break-all rounded bg-muted/60 px-2 py-1.5 font-mono text-[10px] leading-relaxed text-foreground">{{ step.code }}</p>
        <ul v-if="step.bullets?.length" class="space-y-1">
          <li
            v-for="bullet in step.bullets"
            :key="bullet"
            class="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
          >
            <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/70" aria-hidden="true"></span>
            <span>{{ bullet }}</span>
          </li>
        </ul>
        <a
          v-for="link in step.links"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center break-all text-[11px] font-semibold text-primary underline md:min-h-0"
        >
          {{ link.label }}
        </a>
      </li>
    </ol>
    <a
      v-if="guide.readmeUrl"
      :href="guide.readmeUrl"
      target="_blank"
      rel="noopener noreferrer"
      data-testid="patch-only-readme"
      class="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 md:min-h-0"
    >
      {{ guide.readmeLabel }}
    </a>
  </div>
</template>

<script setup lang="ts">
import type { PatchOnlyGuide } from '~/lib/patchOnlyInstall'

defineProps<{
  guide: PatchOnlyGuide
}>()
</script>
