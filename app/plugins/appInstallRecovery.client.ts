import { useTrack } from '~/composables/useTrack'
import {
  APP_BRIDGE_EVENT,
  appBridgeInstallErrorReason,
  isAppBridgeClient,
  whenAppBridgeReady,
  type AppBridgeEventDetail
} from '~/lib/appBridge'
import { cleanInstallErrorDetail } from '~/lib/analytics'
import {
  APP_INSTALL_RECOVERY_MS,
  readPendingAppInstall,
  takeAppInstallResult,
  touchPendingAppInstall,
  appInstallRecoveryDecision,
  type PendingAppInstall
} from '~/lib/appInstallRecovery'

/**
 * Records app-bridge install_success / install_error after the port page is gone.
 * The mounted card uses the same request id claim, so a result is stored once.
 */
export default defineNuxtPlugin(() => {
  const { track } = useTrack()
  let timer = 0

  const storage = () => window.localStorage

  const trackPending = (
    pending: PendingAppInstall,
    event: 'install_success' | 'install_error',
    props: Record<string, unknown> | null
  ) => {
    track(event, {
      path: pending.path,
      portSlug: pending.slug,
      props
    })
  }

  const arm = (pending: PendingAppInstall | null) => {
    window.clearTimeout(timer)
    if (!pending) return
    const progressAt = pending.progressAt || pending.startedAt
    const wait = progressAt + APP_INSTALL_RECOVERY_MS - Date.now()
    if (wait <= 0) return
    timer = window.setTimeout(recover, wait + 25)
  }

  const onEvent = (event: Event) => {
    const detail = (event as CustomEvent<AppBridgeEventDetail>).detail
    if (!detail?.requestId) return
    const pending = readPendingAppInstall(storage())
    if (!pending || pending.requestId !== detail.requestId) return
    if (detail.status === 'downloading' || detail.status === 'installing') {
      touchPendingAppInstall(storage(), detail.requestId, Date.now())
      arm(readPendingAppInstall(storage()))
      return
    }
    if (detail.status !== 'success' && detail.status !== 'error' && detail.status !== 'cancelled') return
    if (!takeAppInstallResult(storage(), detail.requestId)) return
    window.clearTimeout(timer)
    if (detail.status === 'success') {
      trackPending(pending, 'install_success', null)
      return
    }
    const reason = detail.status === 'cancelled'
      ? 'user_cancelled'
      : appBridgeInstallErrorReason('error', detail.error)
    const detailText = cleanInstallErrorDetail(detail.error)
    trackPending(pending, 'install_error', {
      reason,
      ...(detailText ? { detail: detailText } : {})
    })
  }

  const recover = () => {
    if (!isAppBridgeClient() && !window.QuestPortsApp) return
    const pending = readPendingAppInstall(storage())
    if (!pending) return
    const bridge = window.QuestPortsApp
    if (!bridge) return
    let installed = false
    let version: string | null = null
    if (pending.packageName) {
      try {
        installed = bridge.isInstalled(pending.packageName)
        version = installed ? bridge.getInstalledVersion(pending.packageName) : null
      } catch {
        return
      }
    }
    const decision = appInstallRecoveryDecision({
      pending,
      now: Date.now(),
      installed,
      version
    })
    if (decision === 'wait') {
      arm(pending)
      return
    }
    if (!takeAppInstallResult(storage(), pending.requestId)) return
    window.clearTimeout(timer)
    if (decision === 'success') {
      trackPending(pending, 'install_success', { recovered: true })
      return
    }
    trackPending(pending, 'install_error', { reason: 'timeout', detail: 'unconfirmed' })
  }

  window.addEventListener(APP_BRIDGE_EVENT, onEvent)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') recover()
  })
  whenAppBridgeReady(recover)
})
