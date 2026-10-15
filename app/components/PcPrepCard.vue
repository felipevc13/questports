<template>
  <div :data-testid="rootTestId || undefined" class="space-y-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 font-mono text-xs font-bold text-amber-300">1</span>
        <span class="text-xs font-bold text-foreground">{{ title }}</span>
      </div>
      <span class="rounded border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300">{{ tag }}</span>
    </div>

    <div class="space-y-2.5 rounded-lg border border-border/80 bg-card/60 p-3 text-xs">
      <p class="text-[11px] leading-relaxed text-muted-foreground">{{ body }}</p>
      <a
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        :data-testid="testId || undefined"
        class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2.5 text-xs font-semibold text-white shadow-md shadow-amber-950/30 transition-all hover:bg-amber-500"
        @click="$emit('open')"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <span>{{ buttonLabel }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  tag: string
  body: string
  href: string
  buttonLabel: string
  testId?: string
  rootTestId?: string
}>()

defineEmits<{
  open: []
}>()
</script>
