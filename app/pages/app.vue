<template>
  <div class="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 md:py-12">
    <header class="space-y-3">
      <h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {{ page.title }}
      </h1>
      <p class="text-sm leading-relaxed text-muted-foreground">
        {{ page.lede }}
      </p>
    </header>

    <section class="mt-8 space-y-3">
      <h2 class="text-sm font-semibold text-foreground">{{ page.todayHeading }}</h2>
      <ul class="space-y-3">
        <li v-for="item in page.today" :key="item.title" class="rounded-lg border border-border bg-card/60 p-4">
          <p class="text-sm font-semibold text-foreground">{{ item.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{{ item.body }}</p>
        </li>
      </ul>
    </section>

    <section class="mt-8 rounded-lg border border-dashed border-border p-4" data-testid="app-coming-later">
      <h2 class="text-sm font-semibold text-foreground">{{ page.laterHeading }}</h2>
      <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{{ page.laterNote }}</p>
      <ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li v-for="item in page.later" :key="item">{{ item }}</li>
      </ul>
    </section>

    <section class="mt-8 space-y-4">
      <div class="space-y-2">
        <h2 class="text-sm font-semibold text-foreground">{{ page.installHeading }}</h2>
        <p class="text-sm leading-relaxed text-muted-foreground">{{ page.installLede }}</p>
      </div>

      <p
        v-if="inApp"
        data-testid="app-in-app-note"
        role="status"
        class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm leading-relaxed text-emerald-100"
      >
        {{ page.inAppNote }}
      </p>

      <ol class="space-y-3">
        <li
          v-for="(step, index) in page.steps"
          :key="step.title"
          class="flex items-start gap-3"
        >
          <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            {{ index + 1 }}
          </span>
          <div class="min-w-0 space-y-1">
            <p class="text-sm font-semibold text-foreground">{{ step.title }}</p>
            <p class="text-sm leading-relaxed text-muted-foreground">{{ step.body }}</p>
          </div>
        </li>
      </ol>

      <div v-if="!inApp" class="space-y-3 pt-1">
        <template v-if="oneClick">
          <button
            v-if="!installing && !succeeded"
            type="button"
            data-testid="install-questports-app"
            class="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 disabled:opacity-60"
            :disabled="connecting"
            @click="installApp"
          >
            {{ connecting ? page.connectingButton : page.installButton }}
          </button>

          <TransferProgress
            v-if="installing"
            :message="questAdb.installProgress.value.message || page.connectingButton"
            :percent="questAdb.installProgress.value.percent"
            :indeterminate="Boolean(questAdb.installProgress.value.indeterminate)"
            :received-label="questAdb.installProgress.value.receivedLabel"
            :show-cancel="canCancelInstall"
            :locked-note="installLockedNote"
            @cancel="cancelInstall"
          />

          <p
            v-if="succeeded"
            data-testid="app-install-success"
            role="status"
            class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm leading-relaxed text-emerald-100"
          >
            {{ page.success }}
          </p>

          <p
            v-if="errorMessage"
            data-testid="app-install-error"
            role="alert"
            class="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm leading-relaxed text-rose-100"
          >
            {{ errorMessage }}
          </p>

          <div
            v-else-if="questAdb.connectionError.value"
            data-testid="app-connection-error"
            role="alert"
            class="flex items-start gap-2 text-sm leading-relaxed text-rose-200"
          >
            <p class="min-w-0 flex-1">{{ questAdb.connectionError.value }}</p>
            <button
              type="button"
              data-testid="app-connection-error-dismiss"
              class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg leading-none text-rose-200/80 hover:bg-rose-500/10 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              :aria-label="DISMISS_CONNECTION_ERROR_LABEL"
              @click="questAdb.dismissConnectionError()"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <p
            v-else-if="questAdb.connectNotice.value"
            role="status"
            class="text-sm leading-relaxed text-muted-foreground"
          >
            {{ questAdb.connectNotice.value }}
          </p>
        </template>

        <div
          v-else-if="installOfferReady"
          data-testid="app-pc-install"
          role="status"
          class="space-y-2"
        >
          <p class="text-sm leading-relaxed text-foreground">{{ page.pcInstallMessage }}</p>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span data-testid="app-pc-install-url" class="font-mono text-sm text-foreground">{{ page.pcInstallUrl }}</span>
            <button
              type="button"
              data-testid="app-copy-install-url"
              class="inline-flex min-h-11 items-center rounded-md border border-border px-3 text-sm font-semibold hover:bg-accent"
              :class="urlCopied ? 'text-emerald-400' : 'text-foreground'"
              @click="copyInstallUrl"
            >
              {{ urlCopied ? page.copiedUrl : page.copyUrl }}
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <a
            data-testid="app-download-apk"
            :href="apkHref"
            class="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline"
            @click="onDownload"
          >
            {{ page.downloadApk }}
          </a>
          <a
            :href="sidequestUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            {{ page.sidequest }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { useQuestBrowser } from '~/composables/useQuestBrowser'
import { useAppBridge } from '~/composables/useAppBridge'
import { useTrack } from '~/composables/useTrack'
import {
  QUESTPORTS_APP_PAGE,
  QUESTPORTS_APP_RELEASE_URL,
  QUESTPORTS_APP_SIDEQUEST_URL,
  questPortsAppApkDownloadUrl
} from '~/data/questPortsApp'
import {
  QUESTPORTS_APP_INSTALL_PATH,
  apkInstallOutcome,
  connectFailureReason,
  createInstallStepLedger,
  cleanInstallErrorDetail,
  installErrorReason,
  SIGNATURE_CONFLICT_MESSAGE,
  installStepEventsForConnectPhase,
  installStepEventsForConnectResult,
  installStepEventsForProgress,
  type InstallProgressStep,
  type InstallStep,
  type InstallStepStatus
} from '~/lib/analytics'
import { DISMISS_CONNECTION_ERROR_LABEL } from '~/lib/questConnectUx'
import { QUEST_USB_MESSAGES } from '~/lib/questUsbMessages'
import {
  appPageSourceFromSearch,
  funnelDeviceFromUserAgent,
  writeQuestPortsAppInstalled
} from '~/lib/questAppFunnel'
import { copyTextToClipboard } from '~/lib/questBrowser'
import { canOneClickInstallQuestApp, QUEST_APP_INSTALL_PAGE_URL } from '~/lib/questAppInstallOffer'

const page = QUESTPORTS_APP_PAGE
const sidequestUrl = QUESTPORTS_APP_SIDEQUEST_URL

useSeoMeta({
  title: 'QuestPorts app',
  description: 'Install Quest ports from the headset. The first install uses a PC, Chrome or Edge, and a USB cable. The app updates itself.'
})

const questAdb = useQuestAdb()
const questBrowser = useQuestBrowser()
const { inApp } = useAppBridge()
const { track } = useTrack()
const runtimeConfig = useRuntimeConfig()

const connecting = ref(false)
const installing = ref(false)
const succeeded = ref(false)
const errorMessage = ref<string | null>(null)
const installOfferReady = ref(false)
const installUserAgent = ref('')
const urlCopied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const oneClick = computed(() => installOfferReady.value && canOneClickInstallQuestApp({
  webusb: questAdb.isWebUsbSupported.value,
  questBrowser: questBrowser.value,
  userAgent: installUserAgent.value
}))

const apkHref = computed(() => questPortsAppApkDownloadUrl(String(runtimeConfig.public.apkProxyBase ?? '')))

onMounted(() => {
  installUserAgent.value = navigator.userAgent
  installOfferReady.value = true
  track('app_page_view', {
    path: QUESTPORTS_APP_INSTALL_PATH,
    props: {
      source: appPageSourceFromSearch(window.location.search),
      device: funnelDeviceFromUserAgent(navigator.userAgent)
    }
  })
})

onUnmounted(() => {
  if (copyTimer) clearTimeout(copyTimer)
})

const copyInstallUrl = async () => {
  const ok = await copyTextToClipboard(QUEST_APP_INSTALL_PAGE_URL)
  if (!ok) return
  urlCopied.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    urlCopied.value = false
  }, 2000)
}

const headset = () => questAdb.deviceModel.value || null

const canCancelInstall = computed(() => {
  const step = questAdb.installProgress.value.step
  return installing.value && (step === 'downloading' || step === 'pushing')
})

const installLockedNote = computed(() => {
  if (questAdb.installProgress.value.step !== 'installing') return ''
  return 'Installing on the headset. This step runs to completion so the package is not left half-installed.'
})

const trackStep = (
  ledger: ReturnType<typeof createInstallStepLedger>,
  step: InstallStep,
  status: InstallStepStatus
) => {
  const accepted = status === 'start' ? ledger.start(step) : ledger.finish(step, status)
  if (!accepted) return
  track('install_step', {
    path: QUESTPORTS_APP_INSTALL_PATH,
    headset: headset(),
    props: { step, status }
  })
}

const onDownload = () => {
  const from = appPageSourceFromSearch(window.location.search)
  const surface = from === 'banner' || from === 'modal' ? from : 'page'
  track('app_download_click', {
    path: QUESTPORTS_APP_INSTALL_PATH,
    headset: headset(),
    props: { surface }
  })
}

const cancelInstall = async () => {
  await questAdb.cancelInstall()
  installing.value = false
}

const installApp = async () => {
  if (inApp.value || !oneClick.value || installing.value || connecting.value) return
  errorMessage.value = null
  track('install_click', {
    path: QUESTPORTS_APP_INSTALL_PATH,
    headset: headset(),
    props: { via: 'page' }
  })

  const steps = createInstallStepLedger()

  if (!questAdb.isConnected.value) {
    if (!questAdb.isWebUsbSupported.value) {
      errorMessage.value = QUEST_USB_MESSAGES.unsupported
      track('install_error', {
        path: QUESTPORTS_APP_INSTALL_PATH,
        headset: headset(),
        props: { reason: 'no_webusb', via: 'page' }
      })
      return
    }
    connecting.value = true
    trackStep(steps, 'connect', 'start')
    let sawAuthorize = false
    const stopConnect = watch(questAdb.connectionPhase, (phase) => {
      const phaseEvents = installStepEventsForConnectPhase(phase)
      if (phaseEvents.some(event => event.step === 'authorize')) sawAuthorize = true
      for (const event of phaseEvents) trackStep(steps, event.step, event.status)
    }, { flush: 'sync' })
    try {
      await questAdb.connect()
    } finally {
      stopConnect()
      connecting.value = false
    }
    for (const event of installStepEventsForConnectResult({
      connected: questAdb.isConnected.value,
      sawAuthorize
    })) {
      trackStep(steps, event.step, event.status)
    }
    if (!questAdb.isConnected.value) {
      track('install_error', {
        path: QUESTPORTS_APP_INSTALL_PATH,
        headset: headset(),
        props: {
          reason: connectFailureReason({
            webusb: questAdb.isWebUsbSupported.value,
            notice: questAdb.connectNotice.value,
            error: questAdb.connectionError.value
          }),
          via: 'page'
        }
      })
      return
    }
  }

  installing.value = true
  let previous: InstallProgressStep = questAdb.installProgress.value.step
  const stopProgress = watch(() => questAdb.installProgress.value.step, (step) => {
    for (const event of installStepEventsForProgress(previous, step)) {
      trackStep(steps, event.step, event.status)
    }
    previous = step
  }, { flush: 'sync' })
  try {
    const installed = await questAdb.installApkUrl(QUESTPORTS_APP_RELEASE_URL, 'QuestPorts')
    if (apkInstallOutcome({
      installed: Boolean(installed),
      progressStep: questAdb.installProgress.value.step
    }) === 'success') {
      succeeded.value = true
      writeQuestPortsAppInstalled(window.localStorage)
      track('install_success', {
        path: QUESTPORTS_APP_INSTALL_PATH,
        headset: headset(),
        props: { via: 'page' }
      })
    } else {
      track('install_error', {
        path: QUESTPORTS_APP_INSTALL_PATH,
        headset: headset(),
        props: { reason: 'user_cancelled', via: 'page' }
      })
    }
  } catch (err: unknown) {
    const raw = err instanceof Error && err.message ? err.message : ''
    const reason = installErrorReason(err)
    const detail = cleanInstallErrorDetail(raw)
    errorMessage.value = reason === 'signature_conflict'
      ? SIGNATURE_CONFLICT_MESSAGE
      : (raw || page.installFailed)
    track('install_error', {
      path: QUESTPORTS_APP_INSTALL_PATH,
      headset: headset(),
      props: { reason, via: 'page', ...(detail ? { detail } : {}) }
    })
  } finally {
    stopProgress()
    installing.value = false
  }
}
</script>
