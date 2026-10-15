<template>
  <div
    data-testid="navbar-connect-panel"
    class="fixed inset-x-2 top-16 z-50 max-h-[calc(100dvh-5.5rem)] space-y-2 overflow-y-auto rounded-lg border border-border bg-card p-3.5 text-xs shadow-2xl md:absolute md:inset-x-auto md:right-0 md:top-auto md:mt-2 md:max-h-none md:w-80"
    :role="mode === 'failed' || mode === 'locked' ? 'alert' : 'status'"
  >
    <div
      v-if="mode === 'authorizing'"
      data-testid="navbar-authorize-prompt"
      class="space-y-2.5 text-left"
    >
      <p class="text-[11px] font-semibold leading-relaxed text-amber-100">
        {{ AUTHORIZE_PROMPT_LEAD }}
      </p>
      <div
        v-if="showAuthorizeWaitHint"
        data-testid="navbar-authorize-still-waiting"
        class="space-y-2 border-t border-amber-500/20 pt-2"
        aria-live="polite"
      >
        <p class="text-xs font-semibold text-foreground">{{ AUTHORIZE_STILL_WAITING_TITLE }}</p>
        <ul class="space-y-1">
          <li
            v-for="step in AUTHORIZE_STILL_WAITING_STEPS"
            :key="step"
            class="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
          >
            <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/70" aria-hidden="true"></span>
            <span>{{ step }}</span>
          </li>
        </ul>
        <button
          type="button"
          data-testid="navbar-authorize-retry"
          class="inline-flex min-h-11 items-center rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 md:min-h-0"
          @click="emit('retry')"
        >
          Try again
        </button>
      </div>
      <div class="flex items-center justify-between pt-1">
        <span class="font-mono text-[10px] text-muted-foreground">Waiting for the headset prompt…</span>
        <button
          type="button"
          data-testid="navbar-authorize-cancel"
          class="inline-flex min-h-11 cursor-pointer items-center text-[11px] font-medium text-rose-400 underline hover:text-rose-300 md:min-h-0"
          @click="emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>

    <p
      v-else-if="mode === 'picker'"
      data-testid="navbar-usb-picker-hint"
      class="text-[11px] leading-relaxed text-muted-foreground"
    >
      {{ QUEST_PICKER_HINT }}
    </p>

    <div v-else-if="mode === 'chooser'" data-testid="navbar-chooser-dismissed" class="space-y-2 text-left">
      <p class="text-xs font-semibold text-foreground">{{ CHOOSER_DISMISSED_TITLE }}</p>
      <ul class="space-y-1">
        <li
          v-for="step in CHOOSER_DISMISSED_STEPS"
          :key="step"
          class="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
        >
          <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/70" aria-hidden="true"></span>
          <span>{{ step }}</span>
        </li>
      </ul>
      <button
        type="button"
        data-testid="navbar-chooser-retry"
        class="inline-flex min-h-11 items-center rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 md:min-h-0"
        @click="emit('retry')"
      >
        Try again
      </button>
    </div>

    <div v-else-if="mode === 'locked'" data-testid="navbar-usb-locked" class="space-y-2 text-left">
      <div class="flex items-start justify-between gap-2">
        <p class="font-semibold text-amber-200">{{ USB_LOCKED_TITLE }}</p>
        <button
          type="button"
          data-testid="navbar-connection-error-dismiss"
          class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg leading-none text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:h-8 md:w-8"
          :aria-label="DISMISS_CONNECTION_ERROR_LABEL"
          @click="emit('dismiss')"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <p class="text-[11px] leading-relaxed text-amber-100/90">{{ USB_LOCKED_BODY }}</p>
      <p class="text-[11px] leading-relaxed text-muted-foreground">
        {{ USB_LOCKED_PLATFORM }}
        <code class="rounded bg-black/40 px-1 py-0.5 font-mono text-[10px] text-foreground">{{ USB_LOCKED_COMMAND }}</code>.
        {{ USB_LOCKED_AFTER }}
      </p>
      <button
        type="button"
        data-testid="navbar-usb-locked-retry"
        class="inline-flex min-h-11 items-center rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 md:min-h-0"
        @click="emit('retry')"
      >
        Try again
      </button>
    </div>

    <div v-else data-testid="navbar-connect-failed" class="space-y-2 text-left">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-1.5 font-semibold text-destructive">
          <span>{{ authorizeConnectionError ? AUTHORIZE_STILL_WAITING_TITLE : 'Connection Failed' }}</span>
        </div>
        <button
          type="button"
          data-testid="navbar-connection-error-dismiss"
          class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg leading-none text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:h-8 md:w-8"
          :aria-label="DISMISS_CONNECTION_ERROR_LABEL"
          @click="emit('dismiss')"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <p class="text-[11px] leading-relaxed text-muted-foreground">{{ errorMessage }}</p>
      <ul data-testid="navbar-connect-failure-steps" class="space-y-1">
        <li
          v-for="step in failureSteps"
          :key="step"
          class="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
        >
          <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/70" aria-hidden="true"></span>
          <span>{{ step }}</span>
        </li>
      </ul>
      <button
        type="button"
        data-testid="navbar-connect-retry"
        class="inline-flex min-h-11 items-center rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 md:min-h-0"
        @click="emit('retry')"
      >
        Try again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AUTHORIZE_PROMPT_LEAD,
  AUTHORIZE_STILL_WAITING_STEPS,
  AUTHORIZE_STILL_WAITING_TITLE,
  DISMISS_CONNECTION_ERROR_LABEL,
  QUEST_PICKER_HINT
} from '~/lib/questConnectUx'
import { CHOOSER_DISMISSED_STEPS, CHOOSER_DISMISSED_TITLE } from '~/lib/questInstallUx'
import {
  USB_LOCKED_AFTER,
  USB_LOCKED_BODY,
  USB_LOCKED_COMMAND,
  USB_LOCKED_PLATFORM,
  USB_LOCKED_TITLE
} from '~/lib/questUsbMessages'
import type { NavbarConnectPanelMode } from '~/lib/navbarConnect'

defineProps<{
  mode: NavbarConnectPanelMode
  errorMessage: string
  authorizeConnectionError: boolean
  showAuthorizeWaitHint: boolean
  failureSteps: readonly string[]
}>()

const emit = defineEmits<{
  retry: []
  cancel: []
  dismiss: []
}>()
</script>
