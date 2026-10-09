<template>
  <div class="space-y-2" data-testid="transfer-progress">
    <div class="flex items-center justify-between text-xs gap-2">
      <span class="text-primary font-medium flex items-center gap-1.5 min-w-0">
        <svg class="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span class="truncate" aria-live="polite">{{ message }}</span>
      </span>
      <span class="font-mono text-primary font-semibold shrink-0" data-testid="transfer-meter">
        {{ indeterminate ? (receivedLabel || '…') : `${percent}%` }}
      </span>
    </div>
    <div
      class="w-full bg-muted rounded-full h-2 overflow-hidden border border-border"
      role="progressbar"
      :aria-valuemin="a11y.ariaValuemin"
      :aria-valuemax="a11y.ariaValuemax"
      :aria-valuenow="a11y.ariaValuenow"
      :aria-valuetext="a11y.ariaValuetext"
      :aria-label="message"
    >
      <div v-if="indeterminate" class="bg-primary/80 h-full w-full animate-pulse" data-testid="transfer-indeterminate"></div>
      <div
        v-else
        class="bg-primary h-full transition-all duration-300"
        :style="{ width: clamped + '%' }"
      ></div>
    </div>
    <div v-if="showCancel || lockedNote" class="flex items-center justify-between gap-2">
      <button
        v-if="showCancel"
        type="button"
        data-testid="transfer-cancel"
        class="text-[11px] font-mono text-muted-foreground hover:text-foreground underline cursor-pointer"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
      <span v-else-if="lockedNote" class="text-[10px] text-muted-foreground leading-relaxed">{{ lockedNote }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { progressBarA11y } from '~/lib/questInstallUx'

const props = defineProps<{
  message: string
  percent: number
  indeterminate?: boolean
  receivedLabel?: string
  showCancel?: boolean
  lockedNote?: string
}>()

defineEmits<{ cancel: [] }>()

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.percent || 0))))
const a11y = computed(() => progressBarA11y(props.percent, Boolean(props.indeterminate), props.message))
</script>
