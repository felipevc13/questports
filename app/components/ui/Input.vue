<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :class="
      cn(
        'flex h-11 w-full rounded-md border border-input bg-background px-3 py-1 text-base text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:h-9 md:text-sm',
        $attrs.class ?? ''
      )
    "
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  modelValue?: string | number
}>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>
