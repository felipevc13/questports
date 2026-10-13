import { installErrorReason, type InstallErrorReason } from '~/lib/analytics'
import { apkUpdateDecision, type InstalledReleaseRecord } from '~/lib/installedRelease'
import { buildPackageState } from '~/lib/mockQuest'

/**
 * Native QuestPorts Android wrapper. The headset WebView loads this site and
 * installs APKs through PackageInstaller instead of WebUSB.
 * The user-agent token is `QuestPortsApp/<version>`.
 */

export const APP_BRIDGE_EVENT = 'questports-app'

export const APP_INSTALL_PERMISSION_HINT = 'Allow QuestPorts to install apps, then come back'

export const APP_BRIDGE_UA = /QuestPortsApp\/([^\s)]+)/

export type AppBridgeStatus =
  | 'downloading'
  | 'installing'
  | 'needs_permission'
  | 'success'
  | 'error'
  | 'cancelled'

export interface AppBridgeEventDetail {
  requestId: string
  packageName: string | null
  status: AppBridgeStatus
  progress?: number
  error?: string
}

export interface QuestPortsAppBridge {
  version: string
  installApk(url: string, packageName: string | null): string
  cancel(requestId: string): void
  isInstalled(packageName: string): boolean
  getInstalledVersion(packageName: string): string | null
  launch(packageName: string): boolean
  /**
   * Starts the system uninstall UI. Absent on QuestPorts 1.0.108.
   * A later APK must add this on the JavascriptInterface, forward it in the
   * injected shim, fire Intent.ACTION_DELETE with a `package:` URI, and
   * declare REQUEST_DELETE_PACKAGES. Return false when the intent was not sent.
   */
  uninstall?(packageName: string): boolean | Promise<boolean | void>
  /** Real bridge, via the shim. The `?inApp=1` mock uses `version` instead. */
  getVersion?(): string
  /** Present only on the `?inApp=1` simulator. The real app does not set this. */
  __mock?: boolean
}

/**
 * QuestPorts 1.0.108 does not expose uninstall. The mock must not invent it.
 * The Library button stays hidden until `bridge.uninstall` is a real function.
 */
export function bridgeCanUninstall(
  bridge: { uninstall?: unknown } | null | undefined
): bridge is QuestPortsAppBridge & {
  uninstall: (packageName: string) => boolean | Promise<boolean | void>
} {
  return typeof bridge?.uninstall === 'function'
}

/** Ask the native bridge to open the system uninstall UI. Never pretends it did. */
export async function requestBridgeUninstall(
  bridge: { uninstall?: (packageName: string) => boolean | Promise<boolean | void> } | null | undefined,
  packageName: string
): Promise<'missing' | 'rejected' | 'started'> {
  if (!bridgeCanUninstall(bridge)) return 'missing'
  const pkg = String(packageName || '').trim()
  if (!pkg) return 'rejected'
  try {
    const result = await bridge.uninstall(pkg)
    return result === false ? 'rejected' : 'started'
  } catch {
    return 'rejected'
  }
}

declare global {
  interface Window {
    QuestPortsApp?: QuestPortsAppBridge
  }
}

export function appBridgeVersionFromUserAgent(userAgent: string | null | undefined): string | null {
  if (!userAgent) return null
  const match = userAgent.match(APP_BRIDGE_UA)
  return match?.[1] || null
}

export function isAppBridgeUserAgent(userAgent: string | null | undefined): boolean {
  return Boolean(appBridgeVersionFromUserAgent(userAgent))
}

/** `?inApp=1`, same strict flag as `?questBrowser=1`. */
export function hasInAppFlag(value: string | null | undefined): boolean {
  if (!value) return false
  const hashless = value.split('#')[0] || ''
  const queryIndex = hashless.indexOf('?')
  const query = queryIndex >= 0 ? hashless.slice(queryIndex + 1) : hashless
  return new URLSearchParams(query).get('inApp') === '1'
}

export function isAppBridgeSession(input: {
  userAgent?: string | null
  search?: string | null
  bridgePresent?: boolean
}): boolean {
  if (input.bridgePresent) return true
  if (hasInAppFlag(input.search)) return true
  return isAppBridgeUserAgent(input.userAgent)
}

/** Client-only guard. Safe during SSR, where it stays false. */
export function isAppBridgeClient(): boolean {
  if (typeof window === 'undefined') return false
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  return isAppBridgeSession({
    userAgent,
    search: `${window.location.pathname}${window.location.search}`,
    bridgePresent: Boolean(window.QuestPortsApp)
  })
}

/**
 * Absolute apk-proxy URL. WebUSB fetches the proxy and streams the body.
 * The native app downloads on its own and follows redirects, so `redirect=1`
 * asks the proxy to 302 a plain .apk to GitHub. Zip assets still stream.
 * `origin` is the proxy base (Worker, or the page origin when that is empty).
 * An absolute `/api/apk-proxy` URL on that base or on `pageOrigin` is already
 * proxied and is not wrapped again.
 */
function withApkProxyRedirect(proxyUrl: string): string {
  if (/[?&]redirect=1(?:&|#|$)/.test(proxyUrl)) return proxyUrl
  return `${proxyUrl}${proxyUrl.includes('?') ? '&' : '?'}redirect=1`
}

function proxyOriginSet(proxyBase: string, pageOrigin?: string | null): Set<string> {
  const origins = new Set<string>()
  for (const value of [proxyBase, pageOrigin || '']) {
    const trimmed = value.trim()
    if (!trimmed) continue
    try {
      origins.add(new URL(trimmed).origin)
    } catch {
      // A non-absolute base cannot match an already-proxied URL.
    }
  }
  return origins
}

export function appBridgeApkUrl(
  origin: string,
  downloadUrl: string | null | undefined,
  pageOrigin?: string | null
): string | null {
  const raw = (downloadUrl || '').trim()
  const base = (origin || '').trim().replace(/\/$/, '')
  if (!raw || !base) return null
  let parsed: URL
  try {
    parsed = new URL(raw, base)
  } catch {
    return null
  }
  if (parsed.pathname === '/api/apk-proxy' && proxyOriginSet(base, pageOrigin).has(parsed.origin)) {
    return withApkProxyRedirect(parsed.toString())
  }
  if (parsed.protocol !== 'https:') return null
  return withApkProxyRedirect(`${base}/api/apk-proxy?url=${encodeURIComponent(parsed.toString())}`)
}

export function appInstallStatusLabel(status: string, progress?: number | null): string {
  if (status === 'downloading') {
    if (typeof progress !== 'number' || !Number.isFinite(progress)) return 'Downloading'
    const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100)
    return `Downloading ${pct}%`
  }
  if (status === 'installing') return 'Installing'
  if (status === 'success') return 'Installed'
  return ''
}

export function appInstallErrorMessage(error?: string | null): string {
  const text = String(error || '').replace(/\s+/g, ' ').trim()
  if (!text) return 'Install failed.'
  if (text.length <= 140) return text
  return `${text.slice(0, 137)}…`
}

/** Map a bridge failure onto the existing install_error reason list. */
export function appBridgeInstallErrorReason(status: string, error?: string | null): InstallErrorReason {
  if (status === 'cancelled') return 'user_cancelled'
  if (status === 'needs_permission') return 'unauthorized'
  const text = String(error || '')
  if (/permission|unknown sources|request_install/i.test(text)) return 'unauthorized'
  return installErrorReason(text || 'error')
}

/**
 * True when the catalog release is newer than the build this app installed,
 * or when versionName is a lower patch of the same release line.
 * A different numbering scheme (versionName 1.0, catalog v2.1) is not an update.
 */
export function appUpdateAvailable(
  installed: string | null | undefined,
  latest: string | null | undefined,
  record: InstalledReleaseRecord | null = null
): boolean {
  return apkUpdateDecision({
    installedVersionName: installed,
    installedVersionCode: null,
    catalogVersion: latest,
    record
  }).outdated
}

const MOCK_SCRIPT: Array<{ status: AppBridgeStatus; progress?: number }> = [
  { status: 'downloading', progress: 0.08 },
  { status: 'downloading', progress: 0.4 },
  { status: 'downloading', progress: 0.72 },
  { status: 'installing' },
  { status: 'success' }
]

export interface MockAppBridgeOptions {
  schedule?: (fn: () => void, ms: number) => number
  clear?: (handle: number) => void
  emit?: (detail: AppBridgeEventDetail) => void
  stepMs?: number
  installed?: Record<string, string | null>
  successVersion?: string | null
}

/** Fake progress, then success. Used when `?inApp=1` and the real bridge is absent. */
export function createMockQuestPortsApp(options: MockAppBridgeOptions = {}): QuestPortsAppBridge {
  const schedule = options.schedule ?? ((fn, ms) => setTimeout(fn, ms) as unknown as number)
  const clear = options.clear ?? ((handle) => clearTimeout(handle))
  const stepMs = options.stepMs ?? 1200
  const successVersion = options.successVersion === undefined ? null : options.successVersion
  const installed = new Set<string>(Object.keys(options.installed || {}))
  const versions = new Map<string, string | null>(Object.entries(options.installed || {}))
  const timers = new Map<string, number[]>()
  const packages = new Map<string, string | null>()
  let seq = 0

  const emit = (detail: AppBridgeEventDetail) => {
    options.emit?.(detail)
  }

  return {
    version: 'mock',
    __mock: true,
    installApk(_url, packageName) {
      const requestId = `mock-${++seq}`
      packages.set(requestId, packageName)
      const handles: number[] = []
      MOCK_SCRIPT.forEach((step, index) => {
        const handle = schedule(() => {
          if (!timers.has(requestId)) return
          if (step.status === 'success' && packageName) {
            installed.add(packageName)
            versions.set(packageName, successVersion)
          }
          emit({
            requestId,
            packageName,
            status: step.status,
            progress: step.progress
          })
          if (step.status === 'success' || step.status === 'error' || step.status === 'cancelled') {
            timers.delete(requestId)
          }
        }, stepMs * (index + 1))
        handles.push(handle)
      })
      timers.set(requestId, handles)
      return requestId
    },
    cancel(requestId) {
      const handles = timers.get(requestId) || []
      timers.delete(requestId)
      for (const handle of handles) clear(handle)
      emit({
        requestId,
        packageName: packages.get(requestId) ?? null,
        status: 'cancelled'
      })
    },
    isInstalled(packageName) {
      return installed.has(packageName)
    },
    getInstalledVersion(packageName) {
      if (!installed.has(packageName)) return null
      return versions.get(packageName) ?? null
    },
    launch(packageName) {
      return installed.has(packageName)
    }
  }
}

/** Install the simulator for `?inApp=1`. A real `window.QuestPortsApp` is left alone. */
export function ensureMockAppBridge(search: string): void {
  if (typeof window === 'undefined') return
  const current = window.QuestPortsApp
  if (!hasInAppFlag(search)) {
    if (current?.__mock) delete window.QuestPortsApp
    return
  }
  if (current) return
  const game = mockInstalledGame(search)
  let installed: Record<string, string | null> | undefined
  if (game) {
    installed = {}
    for (const [pkg, version] of Object.entries(buildPackageState(game).versions)) {
      installed[pkg] = version
    }
  }
  window.QuestPortsApp = createMockQuestPortsApp({
    installed,
    emit(detail) {
      window.dispatchEvent(new CustomEvent(APP_BRIDGE_EVENT, { detail }))
    }
  })
}

/**
 * The native object is added on page finish, which can be after Vue's mount.
 * Run now when it is already there. Otherwise wait, then run once.
 */
export function whenAppBridgeReady(run: () => void, waitMs = 2000): () => void {
  const view = globalThis.window
  if (!view) return () => {}
  if (view.QuestPortsApp) {
    run()
    return () => {}
  }
  let stopped = false
  const started = Date.now()
  const timer = view.setInterval(() => {
    if (stopped) return
    if (view.QuestPortsApp || Date.now() - started >= waitMs) {
      view.clearInterval(timer)
      if (!stopped) run()
    }
  }, 200)
  return () => {
    stopped = true
    view.clearInterval(timer)
  }
}

/** `?mockGame=installed` or `outdated` seeds the in-app simulator. Absent stays empty. */
function mockInstalledGame(search: string): 'installed' | 'outdated' | null {
  const hashless = (search || '').split('#')[0] || ''
  const queryIndex = hashless.indexOf('?')
  const query = queryIndex >= 0 ? hashless.slice(queryIndex + 1) : hashless
  const game = new URLSearchParams(query).get('mockGame')
  if (game === 'installed' || game === 'outdated') return game
  return null
}
