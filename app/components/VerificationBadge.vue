<template>
  <span
    v-if="variant === 'inline' && cardLabel"
    class="block max-w-full truncate font-sans text-[13px] font-medium leading-5"
    :class="cardLabel.tone === 'verified' ? 'text-green-400' : 'text-amber-400'"
    :title="cardLabel.detail"
  >{{ cardLabel.text }}</span>
  <span
    v-else-if="variant !== 'inline' && badge"
    class="ml-auto flex w-fit max-w-full items-center whitespace-normal rounded border px-1.5 py-0.5 text-right text-[10px] font-mono font-medium leading-snug"
    :class="badge.state === 'current'
      ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300'
      : 'border-amber-500/40 bg-amber-950/80 text-amber-200'"
    :title="badge.detail"
  >
    {{ badge.text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buildCardVerificationLabel, buildVerificationBadge, latestVerification, type PortVerification } from '~/lib/verification'

const props = withDefaults(defineProps<{
  records?: PortVerification[] | null
  slug: string
  latestVersion?: string | null
  variant?: 'chip' | 'inline'
}>(), {
  variant: 'chip'
})

const latest = computed(() => latestVerification(props.records, props.slug))

const badge = computed(() => buildVerificationBadge(latest.value, props.latestVersion))

const cardLabel = computed(() => buildCardVerificationLabel(latest.value, props.latestVersion))
</script>
