<template>
  <div data-testid="app-bridge-install" class="space-y-3 rounded-lg border border-border/80 bg-muted/20 p-3 md:p-4">
    <PcPrepCard
      v-if="pcPatch"
      :title="pcPatch.title"
      :tag="pcPatch.tag"
      :body="pcPatch.body"
      :href="pcPatch.href"
      :button-label="pcPatch.buttonLabel"
      root-test-id="pc-patch-card"
      test-id="pc-patch-instructions"
    />

    <PatchOnlyInstall v-else-if="patchGuide" :guide="patchGuide" />

    <PcPrepCard
      v-else-if="pcBuilder"
      title="Step 1: Automated PC Builder Required"
      tag="PC Script"
      body="Due to Rockstar Games copyright, the VR mod cannot be distributed as a pre-compiled APK. An automated PC installer merges the VR injector with your legally purchased Google Play APK and installs it to your Quest via USB."
      :href="downloadUrl || githubUrl || '#'"
      button-label="Open PC Builder & Instructions (GitHub)"
      test-id="app-pc-builder"
    />

    <template v-else>
      <div class="flex items-center gap-2">
        <span class="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold font-mono text-primary">1</span>
        <span class="text-xs font-bold text-foreground">Step 1: Install Port APK</span>
      </div>

      <div
        v-if="phase === 'downloading' || phase === 'installing'"
        data-testid="app-install-progress"
        class="space-y-2"
        role="status"
        aria-live="polite"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-semibold text-foreground">{{ statusLabel }}</span>
          <button
            type="button"
            data-testid="app-install-cancel"
            class="inline-flex min-h-11 items-center text-[11px] font-semibold text-rose-300 hover:text-rose-200 md:min-h-0"
            @click="cancelInstall"
          >
            Cancel
          </button>
        </div>
        <div
          class="h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="phase === 'downloading' ? progressPercent : undefined"
          :aria-valuetext="statusLabel"
        >
          <div
            class="h-full rounded-full bg-primary transition-all"
            :class="phase === 'installing' ? 'w-full animate-pulse' : ''"
            :style="phase === 'downloading' ? { width: `${progressPercent}%` } : undefined"
          ></div>
        </div>
      </div>

      <div
        v-else-if="phase === 'needs_permission'"
        data-testid="app-install-permission"
        class="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3"
        role="status"
      >
        <p class="text-[11px] leading-relaxed text-amber-50">{{ APP_INSTALL_PERMISSION_HINT }}</p>
        <button
          type="button"
          data-testid="app-install-retry"
          class="inline-flex min-h-11 items-center rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 md:min-h-0"
          @click="startInstall"
        >
          Try again
        </button>
      </div>

      <div
        v-else-if="phase === 'error'"
        data-testid="app-install-error"
        class="space-y-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3"
        role="alert"
      >
        <p class="text-[11px] leading-relaxed text-rose-200">{{ errorMessage }}</p>
        <button
          type="button"
          data-testid="app-install-retry"
          class="inline-flex min-h-11 items-center rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 md:min-h-0"
          @click="startInstall"
        >
          Try again
        </button>
      </div>

      <button
        v-else-if="!installed"
        type="button"
        data-testid="install-on-quest"
        class="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
        @click="startInstall"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>{{ INSTALL_ACTION_LABEL }}</span>
      </button>

      <div
        v-if="installed && phase !== 'downloading' && phase !== 'installing'"
        data-testid="app-install-installed"
        class="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-semibold text-emerald-400">Installed</span>
          <div class="flex items-center gap-2">
            <button
              v-if="canUpdate"
              type="button"
              data-testid="app-install-update"
              class="inline-flex min-h-11 items-center rounded bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-black hover:bg-amber-400 md:min-h-0"
              @click="startInstall"
            >
              Update
            </button>
            <button
              v-if="packageName"
              type="button"
              data-testid="app-install-open"
              class="inline-flex min-h-11 items-center rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 md:min-h-0"
              @click="openApp"
            >
              Open
            </button>
            <button
              v-if="canUninstall && (matchedPackage || packageName)"
              type="button"
              data-testid="app-install-uninstall"
              class="inline-flex min-h-11 items-center rounded border border-border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground md:min-h-0"
              @click="showUninstallConfirm = true"
            >
              Uninstall
            </button>
          </div>
        </div>
        <div
          v-if="canUninstall && showUninstallConfirm"
          data-testid="app-install-uninstall-confirm"
          class="space-y-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2"
        >
          <p class="text-xs text-foreground">Uninstall this game from the headset?</p>
          <p v-if="uninstallError" class="text-[11px] text-rose-300">{{ uninstallError }}</p>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="inline-flex min-h-11 items-center rounded border border-border px-3 text-xs font-medium text-muted-foreground md:min-h-8"
              :disabled="uninstalling"
              @click="cancelUninstall"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="app-install-uninstall-yes"
              class="inline-flex min-h-11 items-center rounded bg-rose-600 px-3 text-xs font-semibold text-white disabled:opacity-60 md:min-h-8"
              :disabled="uninstalling"
              @click="runUninstall"
            >
              {{ uninstalling ? 'Uninstalling…' : 'Uninstall' }}
            </button>
          </div>
        </div>
        <KofiTip surface="install_success" />
      </div>

      <div v-if="showGameFiles" data-testid="game-files-need-pc" class="space-y-1.5">
        <p class="text-[11px] leading-relaxed text-muted-foreground">{{ GAME_FILES_NEED_PC }}</p>
        <a
          data-testid="game-files-guide"
          :href="GAME_FILES_GUIDE_HREF"
          class="inline-flex min-h-11 items-center text-[11px] font-semibold text-primary hover:underline md:min-h-0"
        >
          {{ GAME_FILES_GUIDE_LABEL }}
        </a>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTrack } from '~/composables/useTrack'
import {
  APP_BRIDGE_EVENT,
  APP_INSTALL_PERMISSION_HINT,
  appBridgeApkUrl,
  appBridgeInstallErrorReason,
  appInstallErrorMessage,
  appInstallStatusLabel,
  appUpdateAvailable,
  bridgeCanUninstall,
  ensureMockAppBridge,
  requestBridgeUninstall,
  whenAppBridgeReady,
  type AppBridgeEventDetail
} from '~/lib/appBridge'
import {
  APP_RELEASE_SERIAL,
  assetLabelFromDownloadUrl,
  forgetInstalledRelease,
  learnInstalledRelease,
  readInstalledRelease,
  rememberInstalledRelease,
  type InstalledReleaseRecord
} from '~/lib/installedRelease'
import { formatPortVersion } from '~/lib/portVersion'
import { firstInstalledPackage } from '~/lib/headsetPackages'
import {
  GAME_FILES_GUIDE_HREF,
  GAME_FILES_GUIDE_LABEL,
  GAME_FILES_NEED_PC
} from '~/lib/directQuestInstall'
import { INSTALL_ACTION_LABEL } from '~/lib/questInstallUx'
import { patchOnlyGuideFor, pcPatchCardFor } from '~/lib/patchOnlyInstall'

const props = withDefaults(defineProps<{
  slug: string
  downloadUrl?: string | null
  githubUrl?: string | null
  packageName?: string | null
  latestVersion?: string | null
  needsGameFiles?: boolean
  pcBuilder?: boolean
}>(), {
  downloadUrl: null,
  githubUrl: null,
  packageName: null,
  latestVersion: null,
  needsGameFiles: false,
  pcBuilder: false
})

const route = useRoute()
const { track } = useTrack()
const configuredProxyBase = String(useRuntimeConfig().public.apkProxyBase || '').replace(/\/$/, '')

const phase = ref<'idle' | AppBridgeEventDetail['status']>('idle')
const progress = ref(0)
const installed = ref(false)
const installedVersion = ref<string | null>(null)
/** Package id the bridge actually found. Often an alt of the catalog primary. */
const matchedPackage = ref<string | null>(null)
const installedRelease = ref<InstalledReleaseRecord | null>(null)
const errorMessage = ref('')
const activeRequestId = ref('')
const finished = new Set<string>()
const bridgeReady = ref(false)
const showUninstallConfirm = ref(false)
const uninstalling = ref(false)
const uninstallError = ref('')
let stopUninstallWatch = () => {}

const canUninstall = computed(() => bridgeReady.value && bridgeCanUninstall(window.QuestPortsApp))
const patchGuide = computed(() => patchOnlyGuideFor(props.slug, props.downloadUrl, props.githubUrl))
const pcPatch = computed(() => pcPatchCardFor(props.slug))

const progressPercent = computed(() => Math.round(Math.min(1, Math.max(0, progress.value || 0)) * 100))
const statusLabel = computed(() => appInstallStatusLabel(phase.value, progress.value))
const canUpdate = computed(() => appUpdateAvailable(
  installedVersion.value,
  props.latestVersion,
  installedRelease.value
))
const showGameFiles = computed(() => props.needsGameFiles && installed.value && phase.value !== 'downloading' && phase.value !== 'installing' && phase.value !== 'error')

const trackInstall = (
  event: 'install_click' | 'install_success' | 'install_error',
  reason?: string
) => {
  track(event, {
    path: route.path,
    portSlug: props.slug,
    props: event === 'install_error'
      ? { reason: reason || 'other', app: true }
      : { app: true }
  })
}

const syncRelease = () => {
  const pkg = props.packageName
  if (!import.meta.client || !pkg) {
    installedRelease.value = null
    return
  }
  let record = readInstalledRelease(window.localStorage, APP_RELEASE_SERIAL, pkg)
  const learned = learnInstalledRelease(record, installedVersion.value, null)
  if (learned && record && learned !== record) {
    rememberInstalledRelease(window.localStorage, learned)
    record = learned
  }
  installedRelease.value = record
}

const rememberAppInstall = () => {
  const pkg = props.packageName
  const releaseTag = formatPortVersion(props.latestVersion)
  if (!import.meta.client || !pkg || !releaseTag) return
  installedRelease.value = rememberInstalledRelease(window.localStorage, {
    serial: APP_RELEASE_SERIAL,
    packageName: pkg,
    releaseTag,
    asset: assetLabelFromDownloadUrl(props.downloadUrl) || '',
    versionName: installedVersion.value,
    versionCode: null
  })
}

const readInstalled = () => {
  const bridge = window.QuestPortsApp
  if (!bridge) return
  const pkg = firstInstalledPackage(props.slug, name => bridge.isInstalled(name), props.packageName)
  matchedPackage.value = pkg
  if (!pkg) return
  installed.value = true
  try {
    installedVersion.value = bridge.getInstalledVersion(pkg)
  } catch {
    installedVersion.value = null
  }
  if (phase.value === 'idle') phase.value = 'success'
}

const applyStatus = (detail: AppBridgeEventDetail) => {
  if (detail.status === 'downloading') {
    phase.value = 'downloading'
    if (typeof detail.progress === 'number' && Number.isFinite(detail.progress)) {
      progress.value = detail.progress
    }
    return
  }
  if (detail.status === 'installing') {
    phase.value = 'installing'
    return
  }
  if (detail.status === 'needs_permission') {
    phase.value = 'needs_permission'
    return
  }
  if (finished.has(detail.requestId)) return
  if (detail.status === 'success') {
    finished.add(detail.requestId)
    phase.value = 'success'
    installed.value = true
    readInstalled()
    rememberAppInstall()
    trackInstall('install_success')
    return
  }
  if (detail.status === 'cancelled') {
    finished.add(detail.requestId)
    phase.value = installed.value ? 'success' : 'idle'
    progress.value = 0
    trackInstall('install_error', 'user_cancelled')
    return
  }
  if (detail.status === 'error') {
    finished.add(detail.requestId)
    phase.value = 'error'
    errorMessage.value = appInstallErrorMessage(detail.error)
    trackInstall('install_error', appBridgeInstallErrorReason('error', detail.error))
  }
}

const onBridgeEvent = (event: Event) => {
  const detail = (event as CustomEvent<AppBridgeEventDetail>).detail
  if (!detail || detail.requestId !== activeRequestId.value) return
  applyStatus(detail)
}

const startInstall = () => {
  if (pcPatch.value) return
  if (patchGuide.value) return
  if (phase.value === 'downloading' || phase.value === 'installing') return
  ensureMockAppBridge(`${window.location.pathname}${window.location.search}`)
  const bridge = window.QuestPortsApp
  if (!bridge) {
    phase.value = 'error'
    errorMessage.value = 'QuestPorts install bridge is unavailable.'
    trackInstall('install_error', 'other')
    return
  }
  const url = appBridgeApkUrl(
    configuredProxyBase || window.location.origin,
    props.downloadUrl,
    window.location.origin
  )
  if (!url) {
    phase.value = 'error'
    errorMessage.value = 'No APK download URL configured for this port.'
    trackInstall('install_error', 'other')
    return
  }

  trackInstall('install_click')
  phase.value = 'downloading'
  progress.value = 0
  errorMessage.value = ''
  activeRequestId.value = ''

  const queued: AppBridgeEventDetail[] = []
  const capture = (event: Event) => {
    const detail = (event as CustomEvent<AppBridgeEventDetail>).detail
    if (detail) queued.push(detail)
  }
  window.addEventListener(APP_BRIDGE_EVENT, capture)
  let requestId = ''
  try {
    requestId = String(bridge.installApk(url, props.packageName ?? null) ?? '')
  } catch (err) {
    window.removeEventListener(APP_BRIDGE_EVENT, capture)
    phase.value = 'error'
    errorMessage.value = appInstallErrorMessage(err instanceof Error ? err.message : '')
    trackInstall('install_error', appBridgeInstallErrorReason('error', errorMessage.value))
    return
  }
  activeRequestId.value = requestId
  window.removeEventListener(APP_BRIDGE_EVENT, capture)
  if (!requestId) {
    phase.value = 'error'
    errorMessage.value = 'Install failed.'
    trackInstall('install_error', 'other')
    return
  }
  for (const detail of queued) {
    if (detail.requestId === requestId) applyStatus(detail)
  }
}

const cancelInstall = () => {
  const requestId = activeRequestId.value
  if (!requestId) {
    phase.value = installed.value ? 'success' : 'idle'
    return
  }
  try {
    window.QuestPortsApp?.cancel(requestId)
  } catch {
    phase.value = installed.value ? 'success' : 'idle'
    trackInstall('install_error', 'user_cancelled')
  }
}

const cancelUninstall = () => {
  if (uninstalling.value) return
  showUninstallConfirm.value = false
  uninstallError.value = ''
}

const clearInstalled = (packageName: string) => {
  forgetInstalledRelease(window.localStorage, APP_RELEASE_SERIAL, packageName)
  installed.value = false
  installedVersion.value = null
  matchedPackage.value = null
  installedRelease.value = null
  phase.value = 'idle'
  showUninstallConfirm.value = false
  uninstallError.value = ''
}

const runUninstall = async () => {
  const pkg = matchedPackage.value || props.packageName
  if (!pkg || uninstalling.value || !canUninstall.value) return
  uninstalling.value = true
  uninstallError.value = ''
  const result = await requestBridgeUninstall(window.QuestPortsApp, pkg)
  uninstalling.value = false
  if (result !== 'started') {
    uninstallError.value = 'Uninstall was not started.'
    return
  }
  readInstalled()
  if (matchedPackage.value) {
    uninstallError.value = 'Confirm the uninstall on the headset.'
    stopUninstallWatch()
    const onChange = () => {
      if (document.visibilityState !== 'visible') return
      readInstalled()
      if (matchedPackage.value) return
      clearInstalled(pkg)
      document.removeEventListener('visibilitychange', onChange)
    }
    document.addEventListener('visibilitychange', onChange)
    stopUninstallWatch = () => document.removeEventListener('visibilitychange', onChange)
    return
  }
  clearInstalled(pkg)
}

const openApp = () => {
  const pkg = matchedPackage.value || props.packageName
  if (!pkg) return
  try {
    window.QuestPortsApp?.launch(pkg)
  } catch {
    // Stay on the installed row. Launch failures are not install errors.
  }
}

watch(() => props.packageName, () => {
  readInstalled()
  syncRelease()
})

let stopBridgeWait = () => {}

onMounted(() => {
  ensureMockAppBridge(route.fullPath)
  stopBridgeWait = whenAppBridgeReady(() => {
    bridgeReady.value = true
    readInstalled()
    syncRelease()
  })
  window.addEventListener(APP_BRIDGE_EVENT, onBridgeEvent)
})

onUnmounted(() => {
  stopBridgeWait()
  stopUninstallWatch()
  window.removeEventListener(APP_BRIDGE_EVENT, onBridgeEvent)
})
</script>
