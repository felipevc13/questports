<template>
  <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
    <div class="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
      <!-- Brand Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div class="w-9 h-7 flex items-center justify-center">
          <AppLogo class="w-full h-full" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-base font-semibold tracking-tight text-foreground">
              QuestPorts
            </span>
            <UiBadge variant="secondary" class="text-[10px] font-mono uppercase">
              Zero PC
            </UiBadge>
          </div>
        </div>
      </NuxtLink>

      <!-- Navigation & Action Links -->
      <div class="flex items-center gap-2.5">
        <!-- Suggest dropdown: game vs feature/bug -->
        <div class="relative" ref="suggestMenuRef">
          <UiButton
            variant="outline"
            size="sm"
            title="Suggest a game, a feature, or report a bug"
            @click.stop="isSuggestMenuOpen = !isSuggestMenuOpen"
          >
            <svg class="w-3.5 h-3.5 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Suggest</span>
            <svg class="w-3 h-3 ml-1 text-muted-foreground transition-transform" :class="{ 'rotate-180': isSuggestMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </UiButton>

          <div
            v-if="isSuggestMenuOpen"
            class="absolute right-0 mt-2 w-64 rounded-lg bg-card border border-border p-1.5 shadow-2xl z-50"
          >
            <button
              class="w-full flex items-start gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-accent transition-colors cursor-pointer"
              @click="openGameSuggestion"
            >
              <svg class="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>
                <span class="block text-xs font-semibold text-foreground">Suggest a game</span>
                <span class="block text-[11px] text-muted-foreground mt-0.5">Add a standalone Quest port to the catalog</span>
              </span>
            </button>
            <button
              class="w-full flex items-start gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-accent transition-colors cursor-pointer"
              @click="openFeedback"
            >
              <svg class="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>
                <span class="block text-xs font-semibold text-foreground">Feature or bug</span>
                <span class="block text-[11px] text-muted-foreground mt-0.5">Request a site feature or report something broken</span>
              </span>
            </button>
          </div>
        </div>

        <!-- WebADB Quest Hub Button / Rich Pill & Dropdown -->
        <ClientOnly>
          <div class="relative">
            <!-- Connected State Button with Live Specs -->
            <button
              v-if="questAdb.isConnected.value"
              @click="isDropdownOpen = !isDropdownOpen"
              class="inline-flex items-center gap-2 h-8 px-2.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors cursor-pointer shadow-sm select-none"
              title="Connected Headset Information"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="font-semibold text-foreground">{{ questAdb.deviceModel.value || 'Meta Quest' }}</span>
              <template v-if="questAdb.batteryLevel.value !== null">
                <span class="text-emerald-500/40">|</span>
                <span class="flex items-center gap-1 text-[11px] text-emerald-300">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {{ questAdb.batteryLevel.value }}%
                </span>
              </template>
              <template v-if="questAdb.storageFree.value">
                <span class="text-emerald-500/40">|</span>
                <span class="text-[11px] text-emerald-300">{{ questAdb.storageFree.value }} free</span>
              </template>
              <svg class="w-3 h-3 text-muted-foreground ml-0.5 transition-transform" :class="{ 'rotate-180': isDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Disconnected status. Install starts from the port card, not from here. -->
            <div
              v-else
              role="status"
              aria-live="polite"
              data-testid="quest-connection-status"
              class="inline-flex items-center gap-2 h-8 px-2.5 rounded-md border border-border bg-background text-muted-foreground text-xs font-medium shadow-sm select-none"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="connectChrome.navbar === 'authorizing' ? 'bg-amber-400 animate-pulse' : 'bg-zinc-500'"
              ></span>
              <span v-if="connectChrome.navbar === 'authorizing'" class="flex items-center gap-1.5 text-amber-300 font-medium">
                <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Authorizing Quest...</span>
              </span>
              <span v-else-if="connectChrome.navbar === 'picker'">{{ QUEST_PICKER_HINT }}</span>
              <span v-else>No Quest connected</span>
            </div>

            <!-- Dropdown Menu -->
            <div
              v-if="questAdb.isConnected.value && isDropdownOpen"
              class="absolute right-0 mt-2 w-80 rounded-lg bg-card border border-border p-4 shadow-2xl z-50 space-y-3.5 text-xs font-sans"
            >
              <div class="flex items-center justify-between pb-2 border-b border-border">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span class="font-semibold text-foreground font-mono">{{ questAdb.deviceModel.value || 'Meta Quest' }} {{ questAdb.storageTotal.value ? '(' + questAdb.storageTotal.value + ')' : '' }}</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  USB Connected
                </span>
              </div>

              <!-- Storage Meter -->
              <div v-if="questAdb.storageTotal.value" class="space-y-1.5">
                <div class="flex items-center justify-between text-muted-foreground text-[11px] font-mono">
                  <span>Storage</span>
                  <span>{{ questAdb.storageFree.value || '0 GB' }} free / {{ questAdb.storageTotal.value }}</span>
                </div>
                <div class="w-full h-2 rounded-full bg-muted overflow-hidden border border-border">
                  <div
                    class="h-full bg-primary rounded-full transition-all"
                    :style="{ width: `${questAdb.storagePercent.value || 0}%` }"
                  ></div>
                </div>
              </div>

              <!-- Battery & System Details -->
              <div class="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                <div class="p-2.5 rounded bg-muted/40 border border-border/60">
                  <div class="text-muted-foreground text-[10px]">BATTERY</div>
                  <div class="text-emerald-400 font-semibold text-xs mt-0.5 flex items-center gap-1">
                    <span>⚡ {{ questAdb.batteryLevel.value !== null ? `${questAdb.batteryLevel.value}%` : '--' }}</span>
                    <span v-if="questAdb.isCharging.value" class="text-muted-foreground text-[10px]">(Charging)</span>
                  </div>
                </div>
                <div class="p-2.5 rounded bg-muted/40 border border-border/60">
                  <div class="text-muted-foreground text-[10px]">ADB STATUS</div>
                  <div class="text-foreground font-semibold text-xs mt-0.5">Authorized</div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="pt-2 border-t border-border space-y-1.5">
                <button
                  @click="questAdb.disconnect(true); isDropdownOpen = false"
                  class="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs transition-colors cursor-pointer"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Disconnect Quest</span>
                </button>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSuggestModal } from '~/composables/useSuggestModal'
import { useFeedbackModal } from '~/composables/useFeedbackModal'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { QUEST_PICKER_HINT, questConnectChrome } from '~/lib/questConnectUx'

const suggestModal = useSuggestModal()
const feedbackModal = useFeedbackModal()
const questAdb = useQuestAdb()
const connectChrome = computed(() => questConnectChrome(questAdb.connectionPhase.value, questAdb.isConnected.value))
const route = useRoute()

const isDropdownOpen = ref(false)
const isSuggestMenuOpen = ref(false)
const suggestMenuRef = ref<HTMLElement | null>(null)

const openGameSuggestion = () => {
  isSuggestMenuOpen.value = false
  suggestModal.open()
}

const openFeedback = () => {
  isSuggestMenuOpen.value = false
  feedbackModal.open(route.fullPath)
}

const onDocumentClick = (event: MouseEvent) => {
  const target = event.target as Node | null
  if (suggestMenuRef.value && target && !suggestMenuRef.value.contains(target)) {
    isSuggestMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>
