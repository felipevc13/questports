<template>
  <header class="sticky top-0 z-50 min-w-0 overflow-x-clip border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
    <div class="mx-auto flex h-14 w-full min-w-0 max-w-[1720px] items-center justify-between gap-2 px-3 sm:px-6 lg:px-10">
      <!-- Brand Logo -->
      <NuxtLink to="/" class="flex min-w-0 items-center gap-2 group" @click="leaveErrorPage">
        <div class="flex h-6 w-7 shrink-0 items-center justify-center md:h-7 md:w-9">
          <AppLogo class="h-full w-full" />
        </div>
        <div class="min-w-0">
          <div class="flex min-w-0 items-center gap-2">
            <span class="truncate text-sm font-semibold tracking-tight text-foreground md:text-base">
              QuestPorts
            </span>
            <UiBadge variant="secondary" class="hidden text-[10px] font-mono uppercase md:inline-flex">
              Zero PC
            </UiBadge>
          </div>
        </div>
      </NuxtLink>

      <!-- Navigation & Action Links -->
      <div class="flex shrink-0 items-center gap-1.5 md:gap-2.5">
        <!-- Suggest dropdown: game vs feature/bug -->
        <div class="relative" ref="suggestMenuRef">
          <UiButton
            variant="outline"
            size="sm"
            class="h-11 w-11 p-0 md:h-8 md:w-auto md:px-2.5"
            aria-label="Suggest a game, a feature, or report a bug"
            title="Suggest a game, a feature, or report a bug"
            :aria-expanded="isSuggestMenuOpen"
            @click.stop="isSuggestMenuOpen = !isSuggestMenuOpen"
          >
            <svg class="h-4 w-4 text-primary md:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="hidden md:inline">Suggest</span>
            <svg class="ml-1 hidden h-3 w-3 text-muted-foreground transition-transform md:block" :class="{ 'rotate-180': isSuggestMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </UiButton>

          <div
            v-if="isSuggestMenuOpen"
            class="fixed inset-x-2 top-16 z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-lg border border-border bg-card p-1.5 shadow-2xl md:absolute md:inset-x-auto md:right-0 md:top-auto md:mt-2 md:max-h-none md:w-64"
          >
            <button
              type="button"
              class="flex min-h-11 w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent md:min-h-0"
              @click="openGameSuggestion"
            >
              <svg class="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>
                <span class="block text-xs font-semibold text-foreground">Suggest a game</span>
                <span class="mt-0.5 block text-[11px] text-muted-foreground">Add a standalone Quest port to the catalog</span>
              </span>
            </button>
            <button
              type="button"
              class="flex min-h-11 w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent md:min-h-0"
              @click="openFeedback"
            >
              <svg class="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>
                <span class="block text-xs font-semibold text-foreground">Feature or bug</span>
                <span class="mt-0.5 block text-[11px] text-muted-foreground">Request a site feature or report something broken</span>
              </span>
            </button>
          </div>
        </div>

        <!-- WebADB Quest Hub Button / Rich Pill & Dropdown. Hidden inside the native app. -->
        <ClientOnly v-if="!inApp">
          <div class="relative" ref="questSlotRef">
            <!-- Connected State Button with Live Specs -->
            <button
              v-if="questAdb.isConnected.value"
              type="button"
              data-testid="quest-connection-status"
              @click="isDropdownOpen = !isDropdownOpen"
              class="inline-flex h-11 max-w-[9.25rem] items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 text-xs font-medium text-emerald-400 shadow-sm transition-colors hover:bg-emerald-500/20 sm:max-w-none md:h-8 md:gap-2"
              :aria-expanded="isDropdownOpen"
              title="Connected Headset Information"
            >
              <span class="h-2 w-2 shrink-0 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="truncate font-semibold text-foreground">{{ questAdb.deviceModel.value || 'Meta Quest' }}</span>
              <template v-if="questAdb.batteryLevel.value !== null">
                <span class="hidden text-emerald-500/40 md:inline">|</span>
                <span class="hidden items-center gap-1 text-[11px] text-emerald-300 md:flex">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {{ questAdb.batteryLevel.value }}%
                </span>
              </template>
              <template v-if="questAdb.storageFree.value">
                <span class="hidden text-emerald-500/40 md:inline">|</span>
                <span class="hidden text-[11px] text-emerald-300 md:inline">{{ questAdb.storageFree.value }} free</span>
              </template>
              <svg class="h-3 w-3 shrink-0 text-muted-foreground transition-transform" :class="{ 'rotate-180': isDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- No WebUSB: the existing browser notice, not a dead Connect button. -->
            <template v-else-if="usbOffer === 'unsupported'">
              <button
                type="button"
                data-testid="navbar-unsupported-browser"
                class="inline-flex h-11 max-w-[9.5rem] items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground sm:max-w-[16rem] md:h-8"
                :aria-expanded="unsupportedOpen"
                :title="unsupportedNotice.title"
                @click.stop="unsupportedOpen = !unsupportedOpen"
              >
                <span class="truncate md:hidden">{{ NAVBAR_GUIDANCE_LABEL_SHORT }}</span>
                <span class="hidden truncate md:inline">{{ unsupportedNotice.title }}</span>
              </button>
              <div
                v-if="unsupportedOpen"
                data-testid="navbar-unsupported-panel"
                class="fixed inset-x-2 top-16 z-50 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-lg border border-border bg-card p-3.5 shadow-2xl md:absolute md:inset-x-auto md:right-0 md:top-auto md:mt-2 md:max-h-none md:w-80"
              >
                <UnsupportedBrowserNotice />
              </div>
            </template>

            <!-- Quest Browser exposes WebUSB but cannot connect to itself. -->
            <template v-else-if="usbOffer === 'quest-browser'">
              <button
                type="button"
                data-testid="navbar-quest-browser"
                class="inline-flex h-11 max-w-[9.5rem] items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground sm:max-w-[16rem] md:h-8"
                :aria-expanded="questBrowserOpen"
                :title="QUEST_BROWSER_NOTICE_TITLE"
                @click.stop="questBrowserOpen = !questBrowserOpen"
              >
                <span class="truncate md:hidden">{{ NAVBAR_GUIDANCE_LABEL_SHORT }}</span>
                <span class="hidden truncate md:inline">{{ QUEST_BROWSER_NOTICE_TITLE }}</span>
              </button>
              <div
                v-if="questBrowserOpen"
                data-testid="navbar-quest-browser-panel"
                class="fixed inset-x-2 top-16 z-50 max-h-[calc(100dvh-5.5rem)] space-y-2 overflow-y-auto rounded-lg border border-border bg-card p-3.5 shadow-2xl md:absolute md:inset-x-auto md:right-0 md:top-auto md:mt-2 md:max-h-none md:w-80"
                role="status"
              >
                <p class="text-xs font-semibold text-foreground">{{ QUEST_BROWSER_NOTICE_TITLE }}</p>
                <p class="text-[11px] leading-relaxed text-muted-foreground">{{ QUEST_BROWSER_NOTICE_BODY }}</p>
                <button
                  type="button"
                  data-testid="navbar-quest-browser-copy"
                  class="inline-flex min-h-11 items-center text-[11px] font-semibold hover:underline md:min-h-0"
                  :class="questBrowserCopied ? 'text-emerald-400' : 'text-primary'"
                  @click="sendQuestBrowserLink"
                >
                  {{ questBrowserLinkLabel }}
                </button>
              </div>
            </template>

            <!-- Connect only. One-click install still starts on the port page. -->
            <template v-else-if="usbOffer === 'connect'">
              <button
                type="button"
                data-testid="connect-quest"
                class="inline-flex h-11 max-w-[9.5rem] cursor-pointer select-none items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-60 sm:max-w-[14rem] md:h-8 md:max-w-[16rem]"
                :disabled="connectBusy"
                :aria-busy="connectBusy"
                :aria-expanded="connectPanelMode !== null"
                :aria-label="connectLabels.full"
                :title="connectLabels.full"
                @click.stop="handleConnectQuest"
              >
                <span
                  class="h-2 w-2 shrink-0 rounded-full"
                  :class="connectChrome.navbar === 'authorizing' ? 'bg-amber-400 animate-pulse' : 'bg-zinc-500'"
                ></span>
                <svg v-if="connectChrome.navbar === 'authorizing'" class="h-3.5 w-3.5 shrink-0 animate-spin text-amber-300" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span class="truncate md:hidden">{{ connectLabels.short }}</span>
                <span class="hidden truncate md:inline">{{ connectLabels.full }}</span>
              </button>
              <NavbarConnectPanel
                v-if="connectPanelMode"
                :mode="connectPanelMode"
                :error-message="questAdb.connectionError.value || ''"
                :authorize-connection-error="authorizeConnectionError"
                :show-authorize-wait-hint="showAuthorizeWaitHint"
                :failure-steps="failureSteps"
                @retry="retryNavbarConnect"
                @cancel="questAdb.cancelConnect()"
              />
            </template>

            <div
              v-if="questAdb.isConnected.value && isDropdownOpen"
              class="fixed inset-0 z-40 bg-black/50 md:hidden"
              @click="isDropdownOpen = false"
            ></div>

            <!-- Dropdown Menu: bottom-anchored sheet on small screens, popover from md -->
            <div
              v-if="questAdb.isConnected.value && isDropdownOpen"
              data-testid="quest-connection-menu"
              class="fixed inset-x-2 top-16 z-50 max-h-[calc(100dvh-5.5rem)] space-y-3.5 overflow-y-auto rounded-lg border border-border bg-card p-4 text-xs font-sans shadow-2xl md:absolute md:inset-x-auto md:right-0 md:top-auto md:mt-2 md:max-h-none md:w-80"
            >
              <div class="flex items-center justify-between gap-2 border-b border-border pb-2">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400"></span>
                  <span class="truncate font-mono font-semibold text-foreground">{{ questAdb.deviceModel.value || 'Meta Quest' }} {{ questAdb.storageTotal.value ? '(' + questAdb.storageTotal.value + ')' : '' }}</span>
                </div>
                <span class="shrink-0 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
                  USB Connected
                </span>
              </div>

              <!-- Storage Meter -->
              <div v-if="questAdb.storageTotal.value" class="space-y-1.5">
                <div class="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                  <span>Storage</span>
                  <span>{{ questAdb.storageFree.value || '0 GB' }} free / {{ questAdb.storageTotal.value }}</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full border border-border bg-muted">
                  <div
                    class="h-full rounded-full bg-primary transition-all"
                    :style="{ width: `${questAdb.storagePercent.value || 0}%` }"
                  ></div>
                </div>
              </div>

              <!-- Battery & System Details -->
              <div class="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div class="rounded border border-border/60 bg-muted/40 p-2.5">
                  <div class="text-[10px] text-muted-foreground">BATTERY</div>
                  <div class="mt-0.5 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <span>⚡ {{ questAdb.batteryLevel.value !== null ? `${questAdb.batteryLevel.value}%` : '--' }}</span>
                    <span v-if="questAdb.isCharging.value" class="text-[10px] text-muted-foreground">(Charging)</span>
                  </div>
                </div>
                <div class="rounded border border-border/60 bg-muted/40 p-2.5">
                  <div class="text-[10px] text-muted-foreground">ADB STATUS</div>
                  <div class="mt-0.5 text-xs font-semibold text-foreground">Authorized</div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="space-y-1.5 border-t border-border pt-2">
                <button
                  type="button"
                  data-testid="disconnect-quest"
                  @click="questAdb.disconnect(true); isDropdownOpen = false"
                  class="flex min-h-11 w-full items-center justify-center gap-1.5 rounded border border-rose-500/30 px-3 py-3 text-xs text-rose-400 transition-colors hover:bg-rose-500/10 md:min-h-0 md:py-1.5"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSuggestModal } from '~/composables/useSuggestModal'
import { useFeedbackModal } from '~/composables/useFeedbackModal'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { useAppBridge } from '~/composables/useAppBridge'
import { useQuestBrowser } from '~/composables/useQuestBrowser'
import { usePageLinkShare } from '~/composables/usePageLinkShare'
import { useTrack } from '~/composables/useTrack'
import {
  AUTHORIZE_WAIT_HINT_MS,
  authorizeWaitHintVisible,
  isAuthorizeConnectionError,
  mockAuthorizeWaitFromSearch,
  questConnectChrome
} from '~/lib/questConnectUx'
import { QUEST_BROWSER_NOTICE_BODY, QUEST_BROWSER_NOTICE_TITLE } from '~/lib/questBrowser'
import { mockUserAgentFromSearch, unsupportedNoticeForUserAgent } from '~/lib/unsupportedBrowser'
import { portSlugFromPath, type InstallStepEvent } from '~/lib/analytics'
import { claimConnectOrigin, connectOrigin } from '~/lib/connectOrigin'
import { createConnectStepSession } from '~/lib/questConnectSession'
import { QUEST_USB_MESSAGES } from '~/lib/questUsbMessages'
import {
  NAVBAR_GUIDANCE_LABEL_SHORT,
  navbarConnectBusy,
  navbarConnectFailureSteps,
  navbarConnectLabels,
  navbarConnectPanelMode,
  navbarUsbOffer
} from '~/lib/navbarConnect'

const { inApp } = useAppBridge()
const suggestModal = useSuggestModal()
const feedbackModal = useFeedbackModal()
const questAdb = useQuestAdb()
const questBrowser = useQuestBrowser()
const connectChrome = computed(() => questConnectChrome(questAdb.connectionPhase.value, questAdb.isConnected.value))
const route = useRoute()
const { track } = useTrack()
const {
  copied: questBrowserCopied,
  label: questBrowserLinkLabel,
  send: sendQuestBrowserLink
} = usePageLinkShare()

const isDropdownOpen = ref(false)
const isSuggestMenuOpen = ref(false)
const suggestMenuRef = ref<HTMLElement | null>(null)
const questSlotRef = ref<HTMLElement | null>(null)
const unsupportedOpen = ref(false)
const questBrowserOpen = ref(false)
const connectPanelOpen = ref(false)
const showAuthorizeWaitHint = ref(false)
let authorizeHintTimer: ReturnType<typeof setTimeout> | undefined
let connectInFlight: Promise<void> | null = null
let suppressOutsideClose = false

const previewUnsupported = computed(() => Boolean(mockUserAgentFromSearch(route.fullPath)))
const unsupportedNotice = computed(() => {
  const userAgent = previewUnsupported.value
    ? mockUserAgentFromSearch(route.fullPath) || ''
    : (typeof navigator !== 'undefined' ? navigator.userAgent : '')
  return unsupportedNoticeForUserAgent(userAgent)
})
const usbOffer = computed(() => navbarUsbOffer({
  inApp: inApp.value,
  questBrowser: questBrowser.value,
  webUsbSupported: questAdb.isWebUsbSupported.value,
  previewUnsupported: previewUnsupported.value
}))
const connectLabels = computed(() => navbarConnectLabels(connectChrome.value.navbar))
const connectBusy = computed(() => navbarConnectBusy(connectChrome.value.navbar))
const authorizeConnectionError = computed(() => isAuthorizeConnectionError(questAdb.connectionError.value))
const failureSteps = computed(() => navbarConnectFailureSteps(authorizeConnectionError.value))
const connectPanelMode = computed(() => navbarConnectPanelMode({
  origin: connectOrigin.value,
  connected: questAdb.isConnected.value,
  panelRequested: connectPanelOpen.value,
  picker: connectChrome.value.showPickerHint,
  authorizing: connectChrome.value.showHeadsetBanner,
  notice: questAdb.connectNotice.value,
  error: questAdb.connectionError.value,
  usbLockedMessage: QUEST_USB_MESSAGES.usbLocked
}))

const clearAuthorizeHintTimer = () => {
  if (authorizeHintTimer) {
    clearTimeout(authorizeHintTimer)
    authorizeHintTimer = undefined
  }
}

watch(() => connectPanelMode.value === 'authorizing', (showing) => {
  clearAuthorizeHintTimer()
  if (!showing) {
    showAuthorizeWaitHint.value = false
    return
  }
  if (mockAuthorizeWaitFromSearch(route.fullPath)) {
    showAuthorizeWaitHint.value = true
    return
  }
  showAuthorizeWaitHint.value = false
  if (!import.meta.client) return
  authorizeHintTimer = setTimeout(() => {
    showAuthorizeWaitHint.value = authorizeWaitHintVisible(AUTHORIZE_WAIT_HINT_MS)
  }, AUTHORIZE_WAIT_HINT_MS)
})

const trackNavbarConnectStep = (event: InstallStepEvent) => {
  track('install_step', {
    path: route.path,
    portSlug: portSlugFromPath(route.path),
    headset: questAdb.deviceModel.value || null,
    props: { step: event.step, status: event.status, surface: 'navbar' }
  })
}

const runNavbarConnect = async () => {
  if (usbOffer.value !== 'connect') return
  if (questAdb.isConnected.value || questAdb.isConnecting.value) return
  claimConnectOrigin('navbar')
  connectPanelOpen.value = true
  unsupportedOpen.value = false
  questBrowserOpen.value = false
  const session = createConnectStepSession()
  const report = (events: InstallStepEvent[]) => {
    for (const event of events) trackNavbarConnectStep(event)
  }
  const stop = watch(questAdb.connectionPhase, (phase) => {
    report(session.onPhase(phase))
  }, { flush: 'sync' })
  report(session.start())
  try {
    const success = await questAdb.connect()
    if (success) {
      connectPanelOpen.value = false
      isDropdownOpen.value = true
    }
  } finally {
    stop()
    report(session.finish(questAdb.isConnected.value))
    // The in-page mock chooser Cancel bubbles to document after this connect
    // settles. Ignore that one click so the retry panel can stay open.
    if (!questAdb.isConnected.value) {
      suppressOutsideClose = true
      setTimeout(() => {
        suppressOutsideClose = false
      }, 0)
    }
  }
}

const handleConnectQuest = () => {
  if (connectInFlight) return connectInFlight
  connectInFlight = runNavbarConnect().finally(() => {
    connectInFlight = null
  })
  return connectInFlight
}

const retryNavbarConnect = async () => {
  const current = connectInFlight
  await questAdb.cancelConnect()
  if (current) await current.catch(() => {})
  await handleConnectQuest()
}

const leaveErrorPage = (event: MouseEvent) => {
  if (!useError().value) return
  event.preventDefault()
  clearError({ redirect: '/' })
}

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
  if (questSlotRef.value && target && !questSlotRef.value.contains(target)) {
    unsupportedOpen.value = false
    questBrowserOpen.value = false
    if (suppressOutsideClose || connectBusy.value) return
    connectPanelOpen.value = false
  }
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  isSuggestMenuOpen.value = false
  isDropdownOpen.value = false
  unsupportedOpen.value = false
  questBrowserOpen.value = false
  if (connectPanelMode.value === 'authorizing') {
    questAdb.cancelConnect()
    return
  }
  if (!connectBusy.value) connectPanelOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  clearAuthorizeHintTimer()
})
</script>
