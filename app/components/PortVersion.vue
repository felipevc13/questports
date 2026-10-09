<template>
  <span
    v-if="label"
    class="inline-block min-w-0 max-w-full font-mono"
    :title="label"
  >
    <span class="sr-only">Version {{ label }}</span>
    <span aria-hidden="true" class="block truncate">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatPortVersion } from '~/lib/portVersion'

const props = defineProps<{
  version?: string | null
}>()

const label = computed(() => formatPortVersion(props.version))
</script>
