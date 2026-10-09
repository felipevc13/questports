<template>
  <span
    v-if="variant === 'inline' && cardLabel"
    class="block max-w-full truncate whitespace-nowrap font-sans text-[13px] font-medium leading-5"
    :class="inlineClass"
    :title="cardLabel.detail"
  >{{ cardLabel.text }}</span>
  <span
    v-else-if="variant !== 'inline' && badge"
    class="ml-auto flex w-fit max-w-full items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-right text-[10px] font-mono font-medium leading-snug"
    :class="chipClass"
    :title="badge.detail"
  >
    {{ badge.text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  buildCardVerificationLabel,
  buildVerificationBadge,
  portVerificationSignal,
  type PortVerification
} from '~/lib/verification'

const props = withDefaults(defineProps<{
  records?: PortVerification[] | null
  slug: string
  latestVersion?: string | null
  variant?: 'chip' | 'inline'
}>(), {
  variant: 'chip'
})

const signal = computed(() => portVerificationSignal(props.records, props.slug, props.latestVersion))

const badge = computed(() => {
  if (!signal.value.record || signal.value.kind === 'none' || signal.value.kind === 'broken') return null
  return buildVerificationBadge(signal.value.record, props.latestVersion)
})

const cardLabel = computed(() => buildCardVerificationLabel(
  props.records,
  props.slug,
  props.latestVersion
))

const inlineClass = computed(() => {
  switch (cardLabel.value?.tone) {
    case 'verified': return 'text-green-400'
    case 'installed': return 'text-green-300'
    case 'issues': return 'text-amber-400'
    default: return ''
  }
})

const chipClass = computed(() => {
  switch (badge.value?.tone) {
    case 'issues':
    case 'stale':
      return 'border-amber-500/40 bg-amber-950/80 text-amber-200'
    case 'installed':
      return 'border-emerald-500/25 bg-emerald-950/40 text-green-300'
    default:
      return 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300'
  }
})
</script>
