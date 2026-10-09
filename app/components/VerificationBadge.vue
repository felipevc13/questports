<template>
  <span
    v-if="variant === 'inline' && cardLabel"
    class="block max-w-full truncate whitespace-nowrap font-sans text-[13px] leading-5"
    :title="cardLabel.detail"
  ><span :class="leadClass">{{ cardLabel.lead }}</span><span
    v-if="cardLabel.suffix"
    class="font-normal text-muted-foreground"
  >{{ cardLabel.suffix }}</span></span>
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
  installCount?: number
  variant?: 'chip' | 'inline'
}>(), {
  variant: 'inline',
  installCount: 0
})

const signal = computed(() => portVerificationSignal(props.records, props.slug, props.latestVersion))

const badge = computed(() => {
  if (!signal.value.record || signal.value.kind === 'none' || signal.value.kind === 'broken') return null
  return buildVerificationBadge(signal.value.record, props.latestVersion)
})

const cardLabel = computed(() => buildCardVerificationLabel(
  props.records,
  props.slug,
  props.latestVersion,
  Date.now(),
  props.installCount
))

const leadClass = computed(() => {
  switch (cardLabel.value?.tone) {
    case 'verified': return 'font-medium text-green-400'
    case 'issues': return 'font-medium text-amber-400'
    case 'installs': return 'font-medium text-muted-foreground'
    default: return ''
  }
})

const chipClass = computed(() => {
  switch (badge.value?.tone) {
    case 'issues':
    case 'stale':
      return 'border-amber-500/40 bg-amber-950/80 text-amber-200'
    default:
      return 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300'
  }
})
</script>
