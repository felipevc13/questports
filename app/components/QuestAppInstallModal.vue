<template>
  <UiDialog :open="dialogOpen" @update:open="onDialogOpen">
    <div data-testid="quest-app-install-modal" class="space-y-4">
      <div class="space-y-2 pr-6">
        <h2 class="text-lg font-semibold tracking-tight text-foreground">
          {{ QUEST_APP_MODAL_TITLE }}
        </h2>
        <p class="text-sm leading-relaxed text-muted-foreground">
          {{ QUEST_APP_MODAL_BODY }}
        </p>
        <NuxtLink
          :to="QUEST_APP_MODAL_HREF"
          data-testid="quest-app-modal-learn-more"
          class="inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline"
        >
          {{ QUEST_APP_MODAL_LEARN_MORE }}
        </NuxtLink>
      </div>

      <TransferProgress
        v-if="installing"
        :message="questAdb.installProgress.value.message || 'Installing…'"
        :percent="questAdb.installProgress.value.percent"
        :indeterminate="Boolean(questAdb.installProgress.value.indeterminate)"
        :received-label="questAdb.installProgress.value.receivedLabel"
        :show-cancel="canCancel"
        :locked-note="lockedNote"
        @cancel="cancelInstall"
      />

      <p
        v-else-if="succeeded"
        data-testid="quest-app-modal-success"
        role="status"
        class="text-sm leading-relaxed text-emerald-200"
      >
        {{ successCopy }}
      </p>

      <div v-else class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <UiButton
          type="button"
          variant="secondary"
          data-testid="quest-app-modal-not-now"
          class="min-h-11"
          @click="notNow"
        >
          {{ QUEST_APP_MODAL_NOT_NOW }}
        </UiButton>
        <UiButton
          type="button"
          data-testid="quest-app-modal-install"
          class="min-h-11"
          @click="installApp"
        >
          {{ QUEST_APP_MODAL_INSTALL }}
        </UiButton>
      </div>

      <p
        v-if="errorMessage"
        data-testid="quest-app-modal-error"
        role="alert"
        class="text-sm leading-relaxed text-rose-200"
      >
        {{ errorMessage }}
      </p>
    </div>
  </UiDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppBridge } from '~/composables/useAppBridge'
import { useQuestAdb } from '~/composables/useQuestAdb'
import { useQuestBrowser } from '~/composables/useQuestBrowser'
import { useTrack } from '~/composables/useTrack'
import { QUESTPORTS_APP_PAGE, QUESTPORTS_APP_RELEASE_URL } from '~/data/questPortsApp'
import {
  QUESTPORTS_APP_INSTALL_PATH,
  apkInstallOutcome,
  installErrorReason
} from '~/lib/analytics'
import { readQuestPortsAppInstalled, writeQuestPortsAppInstalled } from '~/lib/questAppFunnel'
import {
  QUEST_APP_MODAL_BODY,
  QUEST_APP_MODAL_HREF,
  QUEST_APP_MODAL_INSTALL,
  QUEST_APP_MODAL_LEARN_MORE,
  QUEST_APP_MODAL_NOT_NOW,
  QUEST_APP_MODAL_TITLE,
  isDesktopAppPrompt,
  isQuestPortsAppInstalled,
  readQuestAppModalDismissed,
  shouldShowQuestAppInstallModal,
  writeQuestAppModalDismissed
} from '~/lib/questAppModal'

const props = defineProps<{
  installSucceeded: boolean
}>()

const route = useRoute()
const questAdb = useQuestAdb()
const questBrowser = useQuestBrowser()
const { inApp } = useAppBridge()
const { track } = useTrack()

const successCopy = QUESTPORTS_APP_PAGE.success

const dismissed = ref(false)
const holding = ref<'closed' | 'open' | 'done'>('closed')
const installing = ref(false)
const succeeded = ref(false)
const errorMessage = ref<string | null>(null)
const viewed = ref(false)

const desktop = computed(() => isDesktopAppPrompt({
  questBrowser: questBrowser.value,
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
}))

const eligible = computed(() => shouldShowQuestAppInstallModal({
  installSucceeded: props.installSucceeded,
  desktop: desktop.value,
  inApp: inApp.value,
  dismissed: dismissed.value || readQuestAppModalDismissed(
    typeof window === 'undefined' ? null : window.localStorage
  ),
  appInstalled: isQuestPortsAppInstalled(questAdb.installedPackages.value)
    || readQuestPortsAppInstalled(typeof window === 'undefined' ? null : window.localStorage)
}))

const dialogOpen = computed(() => holding.value === 'open' || holding.value === 'done' || installing.value)

const canCancel = computed(() => {
  const step = questAdb.installProgress.value.step
  return installing.value && (step === 'downloading' || step === 'pushing')
})

const lockedNote = computed(() => {
  if (questAdb.installProgress.value.step !== 'installing') return ''
  return 'Installing on the headset. This step runs to completion so the package is not left half-installed.'
})

const headset = () => questAdb.deviceModel.value || null

const remember = () => {
  dismissed.value = true
  writeQuestAppModalDismissed(window.localStorage)
}

const rememberInstalled = () => {
  remember()
  writeQuestPortsAppInstalled(window.localStorage)
}

watch(eligible, (show) => {
  if (!show || holding.value !== 'closed' || viewed.value) return
  holding.value = 'open'
  viewed.value = true
  track('modal_shown', { path: route.path })
})

const notNow = () => {
  remember()
  holding.value = 'closed'
  track('modal_dismiss', { path: route.path })
}

const onDialogOpen = (open: boolean) => {
  if (open || installing.value) return
  if (holding.value === 'done') {
    holding.value = 'closed'
    return
  }
  if (holding.value === 'open') notNow()
}

const cancelInstall = async () => {
  await questAdb.cancelInstall()
  installing.value = false
}

const installApp = async () => {
  if (installing.value) return
  errorMessage.value = null
  track('modal_click', { path: route.path })
  if (!questAdb.isConnected.value) {
    errorMessage.value = 'The Quest disconnected. Plug it back in and use Install QuestPorts App on the app page.'
    return
  }
  track('install_click', {
    path: QUESTPORTS_APP_INSTALL_PATH,
    headset: headset(),
    props: { via: 'modal' }
  })
  installing.value = true
  try {
    const installed = await questAdb.installApkUrl(QUESTPORTS_APP_RELEASE_URL, 'QuestPorts')
    if (apkInstallOutcome({
      installed: Boolean(installed),
      progressStep: questAdb.installProgress.value.step
    }) === 'success') {
      succeeded.value = true
      holding.value = 'done'
      rememberInstalled()
      track('install_success', {
        path: QUESTPORTS_APP_INSTALL_PATH,
        headset: headset(),
        props: { via: 'modal' }
      })
      await questAdb.updatePackages()
    } else {
      track('install_error', {
        path: QUESTPORTS_APP_INSTALL_PATH,
        headset: headset(),
        props: { reason: 'user_cancelled', via: 'modal' }
      })
    }
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error && err.message
      ? err.message
      : QUESTPORTS_APP_PAGE.installFailed
    track('install_error', {
      path: QUESTPORTS_APP_INSTALL_PATH,
      headset: headset(),
      props: { reason: installErrorReason(err), via: 'modal' }
    })
  } finally {
    installing.value = false
  }
}
</script>
