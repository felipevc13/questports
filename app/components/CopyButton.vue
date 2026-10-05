<template>
  <button
    @click.stop.prevent="copyToClipboard"
    type="button"
    class="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-mono font-medium rounded-md transition-colors border cursor-pointer select-none"
    :class="copied 
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
      : 'bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted border-border'"
    :title="copied ? 'Copied to clipboard!' : 'Copy path to clipboard'"
  >
    <svg v-if="copied" class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
    <span>{{ copied ? 'Copied!' : (label || text) }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  text: string
  label?: string
}>()

const copied = ref(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy failure:', err)
  }
}
</script>
