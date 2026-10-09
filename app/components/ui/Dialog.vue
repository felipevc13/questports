<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent
        :class="
          cn(
            'fixed left-1/2 top-3 z-[51] flex w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 flex-col max-h-[calc(100dvh-1.5rem)] overflow-hidden border border-border bg-[#0f1523] p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:top-1/2 sm:-translate-y-1/2 sm:rounded-lg',
            $attrs.class ?? ''
          )
        "
        v-bind="$attrs"
      >
        <div class="overflow-y-auto overscroll-contain p-4 pr-14 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
          <slot />
        </div>
        <DialogClose
          class="absolute right-1 top-1 z-10 flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground opacity-80 ring-offset-background transition-opacity hover:bg-accent hover:text-foreground hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none md:right-3 md:top-3 md:h-8 md:w-8"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose
} from 'radix-vue'
import { cn } from '~/lib/utils'

defineProps<{
  open?: boolean
}>()

defineEmits<{
  (e: 'update:open', val: boolean): void
}>()
</script>
