/**
 * First-party analytics shared by the browser and the server.
 * No cookies, no stored visitor id, and no raw IP or user-agent.
 */

export const ANALYTICS_EVENTS = [
  'page_view',
  'port_view',
  'install_click',
  'install_success',
  'install_error',
  'manual_download_click',
  'github_click',
  'suggest_submit',
  'feedback_submit',
  'filter_used',
  'search',
  'unsupported_browser_view'
] as const

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number]

export const ANALYTICS_EVENT_SET: ReadonlySet<string> = new Set(ANALYTICS_EVENTS)

export const INSTALL_ERROR_REASONS = [
  'user_cancelled',
  'no_webusb',
  'adb_fail',
  'download_fail',
  'storage',
  'unauthorized',
  'usb_locked',
  'pm_fail',
  'timeout',
  'other'
] as const

export type InstallErrorReason = (typeof INSTALL_ERROR_REASONS)[number]

export const FILTER_NAMES = [
  'category',
  'status',
  'hardware',
  'developer',
  'quest',
  'sort'
] as const

export type AnalyticsFilterName = (typeof FILTER_NAMES)[number]

/** Details on the existing unsupported_browser_view event. No new event name. */
export const UNSUPPORTED_BROWSER_ACTIONS = ['shown', 'copy_link'] as const

export type UnsupportedBrowserAction = (typeof UNSUPPORTED_BROWSER_ACTIONS)[number]

export const SEARCH_QUERY_MAX = 60
export const SEARCH_LENGTH_MAX = 500
export const ANALYTICS_HOURLY_LIMIT = 120

const EVENTS_REQUIRING_SLUG: ReadonlySet<AnalyticsEventName> = new Set([
  'port_view',
  'install_click',
  'install_success',
  'install_error'
])

const MOCK_QUEST_OFF = new Set(['0', 'false', 'off', 'no'])

const BOT_UA =
  /bot\b|spider|crawler|\bcrawl\b|slurp|archiver|headless|lighthouse|pagespeed|wget\/|curl\/|python-requests|go-http-client|scrapy|petalbot|semrush|ahrefs|mj12|dotbot|bytespider|gptbot|claudebot|amazonbot|applebot|bingpreview|facebookexternal|embedly|telegrambot|discordbot|slackbot|twitterbot|linkedinbot|pinterestbot|yandex|baiduspider|duckduckbot/i

/** In-app browsers. Checked before Chrome, which these user-agents also contain. */
const IN_APP_BROWSER_RULES: ReadonlyArray<{ label: string; pattern: RegExp }> = [
  { label: 'Discord', pattern: /discord/i },
  { label: 'Reddit', pattern: /reddit/i },
  { label: 'Instagram', pattern: /instagram/i },
  { label: 'Facebook', pattern: /FBAN|FBAV|FB_IAB|FBIOS|FB4A/i },
  { label: 'Telegram', pattern: /telegram/i },
  { label: 'WhatsApp', pattern: /whatsapp/i },
  { label: 'X', pattern: /twitter|\bX\/\d/i },
  { label: 'Line', pattern: /\bLine\/\d/i }
]

export const IN_APP_BROWSER_FAMILIES = [
  ...IN_APP_BROWSER_RULES.map(rule => rule.label),
  'In-app'
] as const

export function isInAppBrowserFamily(value: string | null | undefined): boolean {
  return !!value && (IN_APP_BROWSER_FAMILIES as readonly string[]).includes(value)
}

export function isAnalyticsEvent(value: unknown): value is AnalyticsEventName {
  return typeof value === 'string' && ANALYTICS_EVENT_SET.has(value)
}

/** Production collects by default. Dev and Vercel preview stay off unless ANALYTICS_ENABLED=true. */
export function isAnalyticsEnabled(env: {
  ANALYTICS_ENABLED?: string | null
  VERCEL_ENV?: string | null
  NODE_ENV?: string | null
}): boolean {
  const flag = String(env.ANALYTICS_ENABLED ?? '').trim().toLowerCase()
  if (flag === 'true' || flag === '1') return true
  if (flag === 'false' || flag === '0') return false
  if (env.VERCEL_ENV === 'preview' || env.VERCEL_ENV === 'development') return false
  if (env.VERCEL_ENV === 'production') return true
  return env.NODE_ENV === 'production'
}

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent || !userAgent.trim()) return true
  if (BOT_UA.test(userAgent)) return true
  // WhatsApp's link-preview crawler is a bare product token. The in-app browser is a Mozilla UA.
  if (/whatsapp/i.test(userAgent) && !/mozilla\//i.test(userAgent)) return true
  return false
}

export function hasDoNotTrack(dnt: string | null | undefined, gpc: string | null | undefined): boolean {
  if (String(dnt ?? '').trim() === '1') return true
  if (String(gpc ?? '').trim() === '1') return true
  return false
}

export function browserOptsOut(nav: { doNotTrack?: string | null; globalPrivacyControl?: boolean } | null | undefined): boolean {
  if (!nav) return false
  const dnt = nav.doNotTrack
  if (dnt === '1' || dnt === 'yes') return true
  return nav.globalPrivacyControl === true
}

export function isPrefetchRequest(purpose: string | null | undefined, secPurpose: string | null | undefined): boolean {
  return `${purpose || ''} ${secPurpose || ''}`.toLowerCase().includes('prefetch')
}

/** True when a URL or query string turns the simulated Quest on. `mockQuest=0` stays off. */
export function hasMockQuestFlag(value: string | null | undefined): boolean {
  if (!value) return false
  const queryIndex = value.indexOf('?')
  const query = queryIndex >= 0 ? value.slice(queryIndex + 1) : value
  const params = new URLSearchParams(query.split('#')[0])
  if (!params.has('mockQuest')) return false
  const flag = (params.get('mockQuest') || '1').trim().toLowerCase()
  return !MOCK_QUEST_OFF.has(flag)
}

export function deviceFromUserAgent(userAgent: string | null | undefined): 'mobile' | 'desktop' | 'tablet' | null {
  if (!userAgent || !userAgent.trim()) return null
  const ua = userAgent.toLowerCase()
  if (/ipad|tablet|playbook|silk|kindle/.test(ua)) return 'tablet'
  if (/android/.test(ua) && !/mobile/.test(ua)) return 'tablet'
  if (/mobi|iphone|ipod|phone|webos|blackberry|iemobile|opera mini/.test(ua)) return 'mobile'
  if (/android/.test(ua)) return 'mobile'
  return 'desktop'
}

/** Browser family only. Version tokens from the user-agent are dropped. */
export function browserFamilyFromUserAgent(userAgent: string | null | undefined): string | null {
  if (!userAgent || !userAgent.trim()) return null
  for (const rule of IN_APP_BROWSER_RULES) {
    if (rule.pattern.test(userAgent)) return rule.label
  }
  // Android System WebView. Named apps above also use a WebView, so they win first.
  if (/;\s*wv\)/i.test(userAgent)) return 'In-app'
  if (/edg\//i.test(userAgent) || /edgios|edge\//i.test(userAgent)) return 'Edge'
  if (/opr\/|opera/i.test(userAgent)) return 'Opera'
  if (/samsungbrowser/i.test(userAgent)) return 'Samsung'
  if (/oculusbrowser/i.test(userAgent)) return 'Oculus'
  if (/firefox\/|fxios/i.test(userAgent)) return 'Firefox'
  if (/crios/i.test(userAgent)) return 'Chrome iOS'
  if (/chrome\//i.test(userAgent)) return 'Chrome'
  if (/safari\//i.test(userAgent)) return 'Safari'
  return 'Other'
}

export function countryFromHeader(value: string | null | undefined): string | null {
  if (!value) return null
  const code = value.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(code) || code === 'XX') return null
  return code
}

export function referrerHost(referrer: string | null | undefined, requestHost?: string | null): string | null {
  if (!referrer) return null
  try {
    const url = new URL(referrer)
    let host = url.hostname.toLowerCase().replace(/\.$/, '')
    if (host.startsWith('www.')) host = host.slice(4)
    if (!host || host === 'localhost' || host.endsWith('.local')) return null
    const self = (requestHost || '').split(',')[0]?.trim().toLowerCase().replace(/:\d+$/, '').replace(/^www\./, '')
    if (self && host === self) return null
    if (host.length > 253) return null
    return host
  } catch {
    return null
  }
}

export function cleanPath(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const trimmed = input.trim()
  if (!trimmed.startsWith('/')) return null
  const withoutHash = trimmed.split('#')[0] || ''
  const pathOnly = withoutHash.split('?')[0] || ''
  if (pathOnly.includes('\\') || pathOnly.includes('..') || pathOnly.includes('://')) return null
  if (pathOnly.length > 200) return null
  if (!/^\/[a-zA-Z0-9/_-]*$/.test(pathOnly)) return null
  return pathOnly || '/'
}

export function cleanPortSlug(input: unknown): string | null {
  if (input == null || input === '') return null
  if (typeof input !== 'string') return null
  const slug = input.trim().toLowerCase()
  if (slug.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null
  return slug
}

export function cleanHeadset(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const value = input.replace(/[\u0000-\u001f]/g, '').trim()
  if (!value || value.length > 40) return null
  if (!/^[a-zA-Z0-9 .+-]+$/.test(value)) return null
  return value
}

export function portSlugFromPath(path: string | null | undefined): string | null {
  if (!path) return null
  const match = path.match(/^\/ports\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/)
  return match?.[1] ?? null
}

export function installErrorReason(err: unknown): InstallErrorReason {
  const error = err as { name?: string; message?: string } | null
  const name = typeof error?.name === 'string' ? error.name : ''
  const message = typeof err === 'string'
    ? err
    : (typeof error?.message === 'string' ? error.message : '')
  const text = `${name} ${message}`.toLowerCase()
  if (name === 'AbortError' || name === 'NotFoundError' || /cancelled by user|user cancel|no device selected/.test(text)) {
    return 'user_cancelled'
  }
  if (/webusb|not supported in this browser|no_webusb/.test(text)) return 'no_webusb'
  if (/not enough free space|insufficient_storage|install_failed_insufficient/.test(text)) return 'storage'
  if (/unauthorized/.test(text)) return 'unauthorized'
  if (/usb interface is locked|already in use|usb_locked|interface is locked|being used by another app|adb kill-server/.test(text)) return 'usb_locked'
  if (/timed out|timeout/.test(text)) return 'timeout'
  if (/failed to download|download apk|download stream/.test(text)) return 'download_fail'
  if (/install_failed|package manager|pm install|failure \[/.test(text)) return 'pm_fail'
  if (/not connected|adb/.test(text)) return 'adb_fail'
  return 'other'
}

export function connectFailureReason(input: {
  webusb: boolean
  notice?: string | null
  error?: string | null
}): InstallErrorReason {
  if (!input.webusb) return 'no_webusb'
  const notice = input.notice || ''
  const error = input.error || ''
  if (!notice.trim() && !error.trim()) return 'user_cancelled'
  if (notice.trim() && !error.trim()) return 'user_cancelled'
  if (/no headset selected|don't see your quest/i.test(notice)) return 'user_cancelled'
  return installErrorReason(error || notice)
}

function cleanSearchQuery(value: string): string {
  return value.replace(/[\u0000-\u001f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ')
}

export function searchProps(query: string, reportedLength?: number): { q: string; length: number } | null {
  const normalized = cleanSearchQuery(query)
  if (!normalized) return null
  const q = normalized.slice(0, SEARCH_QUERY_MAX)
  let length = normalized.length
  if (
    typeof reportedLength === 'number'
    && Number.isInteger(reportedLength)
    && reportedLength >= q.length
    && reportedLength <= SEARCH_LENGTH_MAX
  ) {
    length = reportedLength
  }
  return { q, length }
}

function filterProps(props: Record<string, unknown>): { filter: AnalyticsFilterName; value: string } | null {
  const filter = props.filter
  if (typeof filter !== 'string' || !(FILTER_NAMES as readonly string[]).includes(filter)) return null
  const raw = typeof props.value === 'string' ? props.value : ''
  const value = raw.replace(/[\u0000-\u001f]/g, '').trim().slice(0, SEARCH_QUERY_MAX)
  if (!value) return null
  return { filter: filter as AnalyticsFilterName, value }
}

function installErrorProps(props: Record<string, unknown> | null): { reason: InstallErrorReason } {
  const reason = props && typeof props.reason === 'string' ? props.reason : ''
  if ((INSTALL_ERROR_REASONS as readonly string[]).includes(reason)) {
    return { reason: reason as InstallErrorReason }
  }
  return { reason: 'other' }
}

function unsupportedBrowserProps(
  props: Record<string, unknown> | null
): { action: UnsupportedBrowserAction } | null {
  const action = props && typeof props.action === 'string' ? props.action : ''
  if ((UNSUPPORTED_BROWSER_ACTIONS as readonly string[]).includes(action)) {
    return { action: action as UnsupportedBrowserAction }
  }
  return null
}

export interface NormalizedAnalyticsEvent {
  event: AnalyticsEventName
  path: string | null
  portSlug: string | null
  headset: string | null
  webusb: boolean | null
  props: Record<string, string | number> | null
}

function readProps(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  return input as Record<string, unknown>
}

/** Drops anything outside the allowlist. Search text is lowercased and cut to 60 characters. */
export function normalizeAnalyticsBody(body: unknown): NormalizedAnalyticsEvent | null {
  const record = readProps(body)
  if (!record || !isAnalyticsEvent(record.event)) return null
  if (typeof record.path === 'string' && hasMockQuestFlag(record.path)) return null

  const path = cleanPath(record.path)
  const portSlug = cleanPortSlug(record.portSlug ?? record.port_slug) ?? portSlugFromPath(path)
  const headset = cleanHeadset(record.headset)
  const webusb = typeof record.webusb === 'boolean' ? record.webusb : null
  const props = readProps(record.props)

  if (EVENTS_REQUIRING_SLUG.has(record.event) && !portSlug) return null
  if (record.event === 'page_view' && !path) return null

  let storedProps: Record<string, string | number> | null = null
  if (record.event === 'install_error') {
    storedProps = installErrorProps(props)
  } else if (record.event === 'search') {
    const query = props && typeof props.q === 'string' ? props.q : ''
    const length = props && typeof props.length === 'number' ? props.length : undefined
    const search = searchProps(query, length)
    if (!search) return null
    storedProps = search
  } else if (record.event === 'filter_used') {
    const filter = props ? filterProps(props) : null
    if (!filter) return null
    storedProps = filter
  } else if (record.event === 'unsupported_browser_view') {
    storedProps = unsupportedBrowserProps(props)
  }

  return {
    event: record.event,
    path,
    portSlug,
    headset,
    webusb,
    props: storedProps
  }
}

export interface AnalyticsTrackInput {
  path?: string | null
  portSlug?: string | null
  headset?: string | null
  webusb?: boolean | null
  props?: Record<string, unknown> | null
}

/** Payload safe to send. Search queries are truncated before they leave the browser. */
export function clientAnalyticsPayload(
  event: AnalyticsEventName,
  input: AnalyticsTrackInput = {}
): NormalizedAnalyticsEvent | null {
  return normalizeAnalyticsBody({
    event,
    path: input.path ?? null,
    portSlug: input.portSlug ?? null,
    headset: input.headset ?? null,
    webusb: input.webusb ?? null,
    props: input.props ?? null
  })
}
