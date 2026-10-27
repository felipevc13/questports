<template>
  <div data-testid="send-to-quest" class="space-y-2">
    <div
      v-if="outdated"
      data-testid="remote-outdated"
      class="space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3"
      role="status"
    >
      <p class="text-xs font-semibold text-amber-50">{{ REMOTE_APP_OUTDATED_TITLE }}</p>
      <p class="text-[11px] leading-relaxed text-amber-50/90">{{ remoteAppOutdatedDetail(device?.appVersion) }}</p>
      <NuxtLink
        to="/app"
        data-testid="remote-outdated-link"
        class="inline-flex min-h-11 items-center text-[11px] font-semibold text-primary underline md:min-h-0"
        @click="trackOutdated('paired')"
      >
        Update instructions
      </NuxtLink>
    </div>

    <div
      v-else-if="view"
      data-testid="remote-status"
      class="space-y-2 rounded-lg border border-border bg-muted/30 p-3"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-start gap-2">
        <span
          class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs"
          :class="toneClass"
          aria-hidden="true"
        >
          <span v-if="view.tone === 'progress' || view.tone === 'wait'" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <span v-else-if="view.tone === 'ok'">✓</span>
          <span v-else-if="view.tone === 'confirm'">!</span>
          <span v-else-if="view.tone === 'error'">!</span>
          <span v-else>…</span>
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold text-foreground">{{ view.title }}</p>
          <p class="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{{ view.detail }}</p>
        </div>
      </div>
      <div v-if="view.progress != null" class="h-1.5 overflow-hidden rounded-full bg-border">
        <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${view.progress}%` }" />
      </div>
      <div v-if="view.showRetry || view.showCancel" class="flex flex-wrap gap-2">
        <button
          v-if="view.showRetry"
          type="button"
          data-testid="remote-retry"
          class="inline-flex min-h-11 items-center rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground md:min-h-0 md:py-1.5"
          @click="sendRequest"
        >
          Try again
        </button>
        <button
          v-if="view.showCancel"
          type="button"
          data-testid="remote-cancel"
          class="inline-flex min-h-11 items-center rounded-lg border border-border px-3 text-[11px] font-semibold text-foreground md:min-h-0 md:py-1.5"
          @click="cancelRequest"
        >
          Cancel request
        </button>
      </div>
      <div
        v-if="view.showFilesNote"
        data-testid="remote-files-note"
        class="border-l-2 border-amber-400/80 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-foreground"
      >
        <p>{{ remoteFilesNote(filesPath) }}</p>
        <a href="#game-file-drop" class="mt-1 inline-flex min-h-11 items-center font-semibold text-primary underline md:min-h-0">USB drop zone</a>
        <span class="text-muted-foreground"> · </span>
        <a href="#install-guide" class="inline-flex min-h-11 items-center font-semibold text-primary underline md:min-h-0">Manual steps</a>
      </div>
    </div>

    <button
      v-else
      type="button"
      data-testid="send-to-quest-button"
      :class="SEND_BUTTON_CLASS"
      :disabled="busy"
      @click="onSendClick"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01M5.05 12.343a10 10 0 0113.9 0M1.5 8.5a14.5 14.5 0 0121 0" />
      </svg>
      <span>{{ label }}</span>
    </button>

    <p v-if="errorMessage && !modalOpen" class="text-[11px] leading-relaxed text-rose-300">{{ errorMessage }}</p>

    <button
      v-if="device && !preview"
      type="button"
      data-testid="remote-forget"
      class="inline-flex min-h-11 items-center text-[11px] font-medium text-muted-foreground underline hover:text-foreground md:min-h-0"
      @click="forget"
    >
      Forget this Quest
    </button>

    <Teleport to="body">
      <div
        v-if="modalOpen"
        data-testid="pair-modal"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
        @click.self="closeModal"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pair-quest-title"
          class="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl"
        >
          <div class="flex items-start justify-between gap-3">
            <h2 id="pair-quest-title" class="text-base font-semibold text-foreground">Pair your Quest</h2>
            <button type="button" class="text-muted-foreground hover:text-foreground" aria-label="Close" @click="closeModal">✕</button>
          </div>
          <p class="mt-1 text-xs leading-relaxed text-muted-foreground">One time. After this, Send to Quest works from this browser.</p>
          <ol class="mt-3 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-foreground">
            <li>Put on your headset and open the QuestPorts app.</li>
            <li>Open <span class="font-semibold">Remote install</span>. The app shows a 6-character code.</li>
            <li>Type that code here.</li>
          </ol>
          <form class="mt-4 space-y-2" @submit.prevent="submitCode">
            <label class="block text-[11px] font-medium text-muted-foreground" for="remote-pair-code">Code from the headset</label>
            <input
              id="remote-pair-code"
              ref="codeInput"
              v-model="codeDraft"
              data-testid="pair-code"
              inputmode="text"
              autocapitalize="characters"
              autocomplete="one-time-code"
              spellcheck="false"
              maxlength="7"
              placeholder="K7P-4QX"
              class="w-full rounded-lg border border-border bg-muted px-3 py-3 text-center font-mono text-lg tracking-[0.3em] text-foreground outline-none focus:border-primary"
              @input="onCodeInput"
            >
            <p class="text-center text-[11px] text-muted-foreground">Not case-sensitive. Expires in 10 minutes. 5 tries, then wait a minute.</p>
            <p v-if="errorMessage" class="text-center text-[11px] text-rose-300">{{ errorMessage }}</p>
            <div class="flex flex-wrap justify-center gap-2 pt-1">
              <button
                type="submit"
                data-testid="pair-submit"
                class="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                :disabled="busy"
              >
                {{ busy ? 'Pairing…' : 'Pair' }}
              </button>
            </div>
          </form>
          <div
            data-testid="pair-outdated"
            class="mt-4 border-l-2 border-primary/70 bg-primary/5 px-2.5 py-2 text-[11px] leading-relaxed text-foreground"
          >
            <p>
              Don't see <span class="font-semibold">Remote install</span>? That needs QuestPorts
              {{ REMOTE_INSTALL_MIN_APP_VERSION }} or newer. Update it from the app's home screen, or reinstall it.
            </p>
            <NuxtLink
              to="/app"
              data-testid="pair-update-link"
              class="mt-1 inline-flex min-h-11 items-center font-semibold text-primary underline md:min-h-0"
              @click="trackOutdated('pair_modal')"
            >
              How to update the QuestPorts app
            </NuxtLink>
          </div>
          <p class="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Don't have the app yet? It's free.
            <NuxtLink to="/app" class="font-semibold text-primary underline">Get the QuestPorts app</NuxtLink>.
            You can still install this port with the USB cable.
          </p>
          <p v-if="justPaired && outdated" class="mt-3 text-center text-xs font-semibold text-amber-100">
            {{ REMOTE_APP_OUTDATED_TITLE }}
          </p>
          <p v-else-if="justPaired" class="mt-3 text-center text-xs font-semibold text-emerald-300">
            {{ questDisplayName(device?.model) }} paired.
            <button type="button" class="ml-1 underline" @click="sendAfterPair">Send {{ title }} now</button>
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  REMOTE_APP_OUTDATED_TITLE,
  REMOTE_INSTALL_MIN_APP_VERSION,
  REMOTE_PREVIEW_HEADER,
  SEND_BUTTON_CLASS,
  clearStoredBrowser,
  clearStoredRequest,
  cleanAcceptingFlag,
  formatPairCode,
  gameFilesPathForSlug,
  isRemotePairFailReason,
  isRemoteRequestStatus,
  needsFilesProp,
  portNeedsUserFiles,
  questDisplayName,
  readStoredBrowser,
  readStoredRequest,
  remoteAppOutdatedDetail,
  remoteAppSupportsInstall,
  remoteFilesNote,
  remoteInstallPreviewRequested,
  remotePollDelayMs,
  remotePreviewFromSearch,
  remoteStatusView,
  sendToQuestLabel,
  writeStoredBrowser,
  writeStoredRequest,
  type RemotePreviewState,
  type RemoteRequestStatus,
  type StoredRemoteBrowser
} from '~/lib/remoteInstall'
import type { AnalyticsTrackInput } from '~/lib/analytics'
import { useTrack } from '~/composables/useTrack'

const props = defineProps<{
  slug: string
  title: string
  version: string
}>()

const { track } = useTrack()
const device = ref<StoredRemoteBrowser | null>(null)
const requestId = ref<string | null>(null)
const status = ref<RemoteRequestStatus | null>(null)
const progress = ref<number | null>(null)
const errorReason = ref<string | null>(null)
const lastSeen = ref<string | null>(null)
const createdAt = ref<string | null>(null)
const accepting = ref<boolean | null>(null)
const checkedAt = ref(0)
const modalOpen = ref(false)
const justPaired = ref(false)
const codeDraft = ref('')
const errorMessage = ref('')
const busy = ref(false)
const preview = ref<RemotePreviewState | null>(null)
const outdatedTracked = ref(false)
const codeInput = ref<HTMLInputElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

const filesPath = computed(() => gameFilesPathForSlug(props.slug))
const needsFiles = computed(() => portNeedsUserFiles(props.slug))
const outdated = computed(() => {
  if (preview.value === 'outdated') return true
  if (!device.value) return false
  return !remoteAppSupportsInstall(device.value.appVersion)
})
const label = computed(() => sendToQuestLabel(device.value?.model, Boolean(device.value)))
const view = computed(() => {
  if (!status.value || outdated.value) return null
  const created = createdAt.value ? Date.parse(createdAt.value) : NaN
  const now = checkedAt.value || Date.now()
  const ageMs = Number.isFinite(created) ? Math.max(0, now - created) : 0
  return remoteStatusView({
    status: status.value,
    progress: progress.value,
    errorReason: errorReason.value,
    model: device.value?.model || 'Quest',
    title: props.title,
    version: props.version,
    lastSeen: lastSeen.value,
    now,
    needsFiles: needsFiles.value,
    filesPath: filesPath.value,
    accepting: accepting.value,
    ageMs
  })
})
const toneClass = computed(() => {
  const tone = view.value?.tone
  if (tone === 'ok') return 'bg-emerald-500/15 text-emerald-300'
  if (tone === 'error') return 'bg-rose-500/15 text-rose-300'
  if (tone === 'confirm' || tone === 'queued') return 'bg-amber-500/15 text-amber-200'
  return 'bg-primary/15 text-primary'
})

function previewOn(): boolean {
  return remoteInstallPreviewRequested(window.location.search)
}

function trackSend(blocked?: 'app_outdated') {
  const input: AnalyticsTrackInput = {
    portSlug: props.slug,
    path: `/ports/${props.slug}`,
    props: {
      paired: Boolean(device.value),
      needs_files: needsFilesProp(props.slug),
      ...(blocked ? { blocked } : {})
    }
  }
  track('remote_send_click', input)
}

function trackOutdated(surface: 'pair_modal' | 'paired' | 'send') {
  if (surface !== 'send' && outdatedTracked.value && surface === 'paired') return
  if (surface === 'paired') outdatedTracked.value = true
  track('remote_app_outdated', {
    portSlug: props.slug,
    path: `/ports/${props.slug}`,
    props: {
      surface,
      ...(device.value?.appVersion ? { app_version: device.value.appVersion } : {}),
      min_app_version: REMOTE_INSTALL_MIN_APP_VERSION
    }
  })
}

async function remoteCall(path: string, options: { method?: string; token?: string | null; body?: unknown } = {}) {
  const headers: Record<string, string> = {}
  if (options.body) headers['Content-Type'] = 'application/json'
  if (options.token) headers.Authorization = `Bearer ${options.token}`
  if (previewOn()) headers[REMOTE_PREVIEW_HEADER] = '1'
  const response = await fetch(`/api/remote/${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  const payload = await response.json().catch(() => null) as Record<string, unknown> | null
  return { ok: response.ok, status: response.status, body: payload }
}

function applyPreview(state: RemotePreviewState) {
  preview.value = state
  if (state === 'pair') {
    modalOpen.value = true
    return
  }
  device.value = {
    token: 'preview-token-not-a-secret',
    deviceId: 'preview',
    name: 'Quest 3',
    model: 'Quest 3',
    appVersion: state === 'outdated' ? '1.0.4' : '1.1.0'
  }
  if (state === 'outdated') return
  const map: Record<string, RemoteRequestStatus> = {
    waiting: 'queued',
    downloading: 'downloading',
    confirm: 'awaiting_confirm',
    installed: 'installed',
    queued: 'queued',
    failed: 'failed'
  }
  status.value = map[state] || 'queued'
  progress.value = state === 'downloading' ? 45 : null
  errorReason.value = state === 'failed' ? 'download_fail' : null
  accepting.value = state === 'not-accepting' ? false : null
  lastSeen.value = state === 'queued' ? new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() : new Date().toISOString()
  createdAt.value = new Date().toISOString()
  checkedAt.value = Date.now()
  if (state === 'waiting' || state === 'not-accepting') lastSeen.value = new Date().toISOString()
}

function stopPoll() {
  if (timer != null) clearTimeout(timer)
  timer = null
}

function schedulePoll() {
  stopPoll()
  if (!status.value || preview.value) return
  const ageMs = createdAt.value ? Math.max(0, Date.now() - Date.parse(createdAt.value)) : 0
  const hidden = typeof document !== 'undefined' && document.visibilityState === 'hidden'
  const delay = remotePollDelayMs({ status: status.value, ageMs, hidden, accepting: accepting.value })
  if (delay == null) return
  timer = setTimeout(() => { void refreshStatus() }, delay)
}

async function refreshDevice() {
  if (!device.value || preview.value) return
  const result = await remoteCall('device', { token: device.value.token })
  if (result.status === 401) {
    forgetLocal()
    return
  }
  const info = result.body?.device
  if (!result.ok || !info || typeof info !== 'object') return
  const row = info as Record<string, unknown>
  device.value = {
    ...device.value,
    name: typeof row.name === 'string' ? row.name : device.value.name,
    model: typeof row.model === 'string' ? row.model : device.value.model,
    appVersion: typeof row.app_version === 'string' ? row.app_version : device.value.appVersion
  }
  lastSeen.value = typeof row.last_seen === 'string' ? row.last_seen : lastSeen.value
  accepting.value = cleanAcceptingFlag(row.accepting)
  checkedAt.value = Date.now()
  writeStoredBrowser(window.localStorage, device.value)
  if (!remoteAppSupportsInstall(device.value.appVersion)) trackOutdated('paired')
}

async function refreshStatus() {
  if (!device.value || !requestId.value || preview.value) return
  const result = await remoteCall(`requests/${requestId.value}`, { token: device.value.token })
  if (result.status === 401) {
    forgetLocal()
    return
  }
  if (!result.ok || !result.body || !isRemoteRequestStatus(result.body.status)) {
    schedulePoll()
    return
  }
  status.value = result.body.status
  progress.value = typeof result.body.progress === 'number' ? result.body.progress : null
  errorReason.value = typeof result.body.error_reason === 'string' ? result.body.error_reason : null
  accepting.value = cleanAcceptingFlag(result.body.accepting)
  if (typeof result.body.last_seen === 'string') lastSeen.value = result.body.last_seen
  checkedAt.value = Date.now()
  schedulePoll()
}

function forgetLocal() {
  device.value = null
  requestId.value = null
  status.value = null
  clearStoredBrowser(window.localStorage)
  clearStoredRequest(window.localStorage)
  stopPoll()
}

async function forget() {
  const token = device.value?.token
  forgetLocal()
  if (!token || preview.value) return
  await remoteCall('pairing', { method: 'DELETE', token }).catch(() => null)
}

function closeModal() {
  modalOpen.value = false
  justPaired.value = false
  errorMessage.value = ''
}

function onCodeInput() {
  codeDraft.value = formatPairCode(codeDraft.value)
}

async function onSendClick() {
  errorMessage.value = ''
  if (preview.value) {
    if (!device.value) modalOpen.value = true
    return
  }
  if (device.value && !remoteAppSupportsInstall(device.value.appVersion)) {
    trackSend('app_outdated')
    trackOutdated('send')
    return
  }
  trackSend()
  if (!device.value) {
    modalOpen.value = true
    track('remote_pair_shown', { portSlug: props.slug, path: `/ports/${props.slug}` })
    return
  }
  await sendRequest()
}

async function sendAfterPair() {
  justPaired.value = false
  modalOpen.value = false
  if (outdated.value) {
    trackOutdated('paired')
    return
  }
  await sendRequest()
}

async function submitCode() {
  if (preview.value) {
    device.value = {
      token: 'preview-token-not-a-secret',
      deviceId: 'preview',
      name: 'Quest 3',
      model: 'Quest 3',
      appVersion: '1.1.0'
    }
    justPaired.value = true
    errorMessage.value = ''
    return
  }
  busy.value = true
  errorMessage.value = ''
  try {
    const result = await remoteCall('pair/claim', {
      method: 'POST',
      body: { code: codeDraft.value }
    })
    if (!result.ok || !result.body) {
      const code = result.body?.error
      const reason = isRemotePairFailReason(code) ? code : 'unavailable'
      track('remote_pair_fail', {
        portSlug: props.slug,
        path: `/ports/${props.slug}`,
        props: { reason }
      })
      errorMessage.value = typeof result.body?.message === 'string'
        ? result.body.message
        : 'Could not pair. Check the code and try again.'
      return
    }
    const info = result.body.device
    const token = typeof result.body.browser_token === 'string' ? result.body.browser_token : ''
    if (!token || !info || typeof info !== 'object') {
      errorMessage.value = 'Could not pair. Try again.'
      return
    }
    const row = info as Record<string, unknown>
    const stored: StoredRemoteBrowser = {
      token,
      deviceId: typeof row.id === 'string' ? row.id : '',
      name: typeof row.name === 'string' ? row.name : 'Quest',
      model: typeof row.model === 'string' ? row.model : 'Quest',
      appVersion: typeof row.app_version === 'string' ? row.app_version : null
    }
    device.value = stored
    writeStoredBrowser(window.localStorage, stored)
    track('remote_pair_success', { portSlug: props.slug, path: `/ports/${props.slug}` })
    justPaired.value = true
    codeDraft.value = ''
    if (!remoteAppSupportsInstall(stored.appVersion)) trackOutdated('paired')
  } catch {
    errorMessage.value = 'Could not reach QuestPorts. Try again.'
    track('remote_pair_fail', {
      portSlug: props.slug,
      path: `/ports/${props.slug}`,
      props: { reason: 'unavailable' }
    })
  } finally {
    busy.value = false
  }
}

async function sendRequest() {
  if (preview.value || !device.value) return
  if (!remoteAppSupportsInstall(device.value.appVersion)) {
    trackOutdated('send')
    return
  }
  busy.value = true
  errorMessage.value = ''
  status.value = null
  try {
    const result = await remoteCall('requests', {
      method: 'POST',
      token: device.value.token,
      body: { port_slug: props.slug }
    })
    if (result.body?.error === 'app_outdated') {
      if (typeof result.body.app_version === 'string' && device.value) {
        device.value = { ...device.value, appVersion: result.body.app_version }
        writeStoredBrowser(window.localStorage, device.value)
      }
      trackOutdated('send')
      return
    }
    if (!result.ok || typeof result.body?.id !== 'string') {
      errorMessage.value = typeof result.body?.message === 'string'
        ? result.body.message
        : 'Could not send this port.'
      return
    }
    requestId.value = result.body.id
    status.value = isRemoteRequestStatus(result.body.status) ? result.body.status : 'queued'
    progress.value = null
    errorReason.value = null
    createdAt.value = new Date().toISOString()
    checkedAt.value = Date.now()
    writeStoredRequest(window.localStorage, {
      id: requestId.value,
      slug: props.slug,
      createdAt: createdAt.value
    })
    track('remote_request_created', {
      portSlug: props.slug,
      path: `/ports/${props.slug}`,
      props: { needs_files: needsFilesProp(props.slug) }
    })
    void refreshDevice()
    schedulePoll()
  } catch {
    errorMessage.value = 'Could not reach QuestPorts. Try again.'
  } finally {
    busy.value = false
  }
}

async function cancelRequest() {
  if (!device.value || !requestId.value || preview.value) {
    status.value = null
    return
  }
  const result = await remoteCall(`requests/${requestId.value}/cancel`, {
    method: 'POST',
    token: device.value.token
  })
  if (result.ok && isRemoteRequestStatus(result.body?.status)) {
    status.value = result.body.status
    stopPoll()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && modalOpen.value) closeModal()
}

function onVisible() {
  if (document.visibilityState === 'visible') void refreshStatus()
  else schedulePoll()
}

watch(modalOpen, async (open) => {
  if (!open) return
  await nextTick()
  codeInput.value?.focus()
})

onMounted(async () => {
  document.addEventListener('visibilitychange', onVisible)
  window.addEventListener('keydown', onKeydown)
  const fixture = remotePreviewFromSearch(window.location.search)
  if (fixture) {
    applyPreview(fixture)
    if (fixture === 'outdated') trackOutdated('paired')
    return
  }
  device.value = readStoredBrowser(window.localStorage)
  const stored = readStoredRequest(window.localStorage)
  if (stored && stored.slug === props.slug) {
    requestId.value = stored.id
    createdAt.value = stored.createdAt
    checkedAt.value = Date.now()
    status.value = 'queued'
  }
  if (device.value) await refreshDevice()
  if (requestId.value && !outdated.value) await refreshStatus()
})

onBeforeUnmount(() => {
  stopPoll()
  if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisible)
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
})
</script>
