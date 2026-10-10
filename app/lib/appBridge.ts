import { installErrorReason, type InstallErrorReason } from '~/lib/analytics'
import { comparePortVersions, numericVersionParts } from '~/lib/versionFormat'

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
  /** Present only on the `?inApp=1` simulator. The real app does not set this. */
  __mock?: boolean
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
 * Absolute apk-proxy URL. The WebUSB installer fetches `/api/apk-proxy?url=`
 * and streams the body. The native app downloads on its own and follows
 * redirects, so `redirect=1` asks the proxy to 302 a plain .apk to GitHub
 * instead of copying the file through Vercel. Zip assets still stream.
 */
function withApkProxyRedirect(proxyUrl: string): string {
  if (/[?&]redirect=1(?:&|#|$)/.test(proxyUrl)) return proxyUrl
  return `${proxyUrl}${proxyUrl.includes('?') ? '&' : '?'}redirect=1`
}

export function appBridgeApkUrl(origin: string, downloadUrl: string | null | undefined): string | null {
  const raw = (downloadUrl || '').trim()
  const base = (origin || '').trim().replace(/\/$/, '')
  if (!raw || !base) return null
  if (raw.startsWith('/api/apk-proxy?')) return withApkProxyRedirect(`${base}${raw}`)
  let parsed: URL
  try {
    parsed = new URL(raw, base)
  } catch {
    return null
  }
  if (parsed.pathname === '/api/apk-proxy') return withApkProxyRedirect(parsed.toString())
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

/** True when both versions have numeric parts and they are not the same. */
export function appUpdateAvailable(installed: string | null | undefined, latest: string | null | undefined): boolean {
  if (!installed || !latest) return false
  if (numericVersionParts(installed).length === 0 || numericVersionParts(latest).length === 0) return false
  return comparePortVersions(installed, latest) !== 0
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
  window.QuestPortsApp = createMockQuestPortsApp({
    emit(detail) {
      window.dispatchEvent(new CustomEvent(APP_BRIDGE_EVENT, { detail }))
    }
  })
}
