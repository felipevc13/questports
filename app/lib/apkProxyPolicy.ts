/**
 * Shared by the APK proxy and the WebUSB install card.
 * Files larger than this are not streamed through the Vercel function.
 * The Cloudflare Worker has no size cap. The native app uses redirect=1
 * and downloads a plain .apk from GitHub.
 */
export const APK_PROXY_MAX_BYTES_DEFAULT = 157_286_400

/** No egress fees. Empty NUXT_PUBLIC_APK_PROXY_BASE falls back to this site. */
export const APK_PROXY_WORKER_BASE = 'https://questports-apk-proxy.questports.workers.dev'

/** Nullish uses the Worker. An empty string stays empty (same-origin Vercel route). */
export function normalizeApkProxyBase(value: string | null | undefined): string {
  if (value == null) return APK_PROXY_WORKER_BASE
  return value.trim().replace(/\/$/, '')
}

/** WebUSB streams the body, so this URL does not ask for redirect=1. */
export function apkProxyStreamUrl(apkProxyBase: string | null | undefined, assetUrl: string): string {
  const path = `/api/apk-proxy?url=${encodeURIComponent(assetUrl)}`
  const base = normalizeApkProxyBase(apkProxyBase)
  return base ? `${base}${path}` : path
}

/** The client cap only applies when the browser still hits the Vercel route. */
export function apkProxyCapApplies(apkProxyBase: string | null | undefined): boolean {
  return normalizeApkProxyBase(apkProxyBase) === ''
}

export function apkProxyMaxBytes(
  env: { APK_PROXY_MAX_BYTES?: string | null } = typeof process !== 'undefined' ? process.env : {}
): number {
  const raw = String(env.APK_PROXY_MAX_BYTES ?? '').trim()
  if (!raw) return APK_PROXY_MAX_BYTES_DEFAULT
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return APK_PROXY_MAX_BYTES_DEFAULT
  return Math.floor(parsed)
}

export function apkProxyRedirectRequested(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(item => apkProxyRedirectRequested(item))
  return value === '1' || value === 'true' || value === 1 || value === true
}

export function contentLengthBytes(header: string | null | undefined): number | null {
  if (!header) return null
  const match = header.trim().match(/^\d+/)
  if (!match) return null
  const parsed = Number(match[0])
  if (!Number.isFinite(parsed) || parsed < 0) return null
  return parsed
}

/** Unknown length is not a refusal. The caller still has to stream or look again. */
export function exceedsApkProxyCap(size: number | null | undefined, maxBytes: number): boolean {
  return typeof size === 'number' && Number.isFinite(size) && size > maxBytes
}

export function knownApkByteSize(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return Math.floor(value)
  return null
}

export interface ApkTooLargeBody {
  reason: 'too_large'
  size: number
  directUrl: string
}

export function apkTooLargeBody(size: number, directUrl: string): ApkTooLargeBody {
  return { reason: 'too_large', size, directUrl }
}

export function tooLargeInstallMessage(sizeBytes: number): string {
  const mb = Number.isFinite(sizeBytes) && sizeBytes > 0
    ? Math.max(1, Math.round(sizeBytes / (1024 * 1024)))
    : null
  const sizeLabel = mb == null ? '' : ` (${mb} MB)`
  return `This port is large${sizeLabel}. Download it with the direct link and install with SideQuest, or use the QuestPorts app.`
}

export class ApkTooLargeError extends Error {
  readonly reason = 'too_large' as const
  readonly size: number
  readonly directUrl: string

  constructor(size: number, directUrl: string) {
    super(tooLargeInstallMessage(size))
    this.name = 'ApkTooLargeError'
    this.size = size
    this.directUrl = directUrl
  }
}

export function isApkTooLargeError(err: unknown): err is ApkTooLargeError {
  return Boolean(err && typeof err === 'object' && (err as { reason?: string }).reason === 'too_large')
}
