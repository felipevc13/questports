<template>
  <span
    v-if="badge"
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
import { buildVerificationBadge, latestVerification, type PortVerification } from '~/lib/verification'

const props = defineProps<{
  records?: PortVerification[] | null
  slug: string
  latestVersion?: string | null
}>()

const badge = computed(() => buildVerificationBadge(
  latestVerification(props.records, props.slug),
  props.latestVersion
))
</script>
