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
  'install_step',
  'manual_download_click',
  'github_click',
  'suggest_submit',
  'feedback_submit',
  'filter_used',
  'search',
  'search_no_results',
  'unsupported_browser_view',
  'video_preview_play'
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
  'too_large',
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

/**
 * Details on the existing unsupported_browser_view event. No new event name.
 * There is no database check on props.action, so these values do not need a migration.
 */
export const UNSUPPORTED_BROWSER_ACTIONS = ['shown', 'copy_link', 'share_link', 'direct_install_open'] as const

export type UnsupportedBrowserAction = (typeof UNSUPPORTED_BROWSER_ACTIONS)[number]

export const SEARCH_QUERY_MAX = 60
export const SEARCH_LENGTH_MAX = 500
export const SEARCH_NO_RESULTS_MAX = 80
export const CAMPAIGN_REF_MAX = 40
export const ANALYTICS_HOURLY_LIMIT = 120
export const CAMPAIGN_REF_STORAGE_KEY = 'questports_ref'
export const PREVIEW_PLAY_STORAGE_KEY = 'questports_preview_plays'

export const INSTALL_STEPS = [
  'connect',
  'authorize',
  'download_apk',
  'install_apk',
  'copy_game_files'
] as const

export type InstallStep = (typeof INSTALL_STEPS)[number]

export const INSTALL_STEP_STATUSES = ['start', 'ok', 'fail'] as const

export type InstallStepStatus = (typeof INSTALL_STEP_STATUSES)[number]

export interface InstallStepEvent {
  step: InstallStep
  status: InstallStepStatus
}

export const VIDEO_PREVIEW_SURFACES = ['card', 'detail'] as const

export type VideoPreviewSurface = (typeof VIDEO_PREVIEW_SURFACES)[number]

const EVENTS_REQUIRING_SLUG: ReadonlySet<AnalyticsEventName> = new Set([
  'port_view',
  'install_click',
  'install_success',
  'install_error',
  'install_step',
  'video_preview_play'
])

const EVENTS_WITH_REF: ReadonlySet<AnalyticsEventName> = new Set([
  'page_view',
  'install_click',
  'install_success',
  'install_error',
  'install_step'
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

/**
 * Browser family only. Version tokens from the user-agent are dropped.
 * QuestPortsApp is the native headset wrapper. The column is free text with a
 * 32-character length check, and this label fits, so no migration is required.
 */
export function browserFamilyFromUserAgent(userAgent: string | null | undefined): string | null {
  if (!userAgent || !userAgent.trim()) return null
  if (/QuestPortsApp\/[^\s)]/.test(userAgent)) return 'QuestPortsApp'
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
  const error = err as { name?: string; message?: string; reason?: string } | null
  if (error && typeof error === 'object' && error.reason === 'too_large') return 'too_large'
  const name = typeof error?.name === 'string' ? error.name : ''
  const message = typeof err === 'string'
    ? err
    : (typeof error?.message === 'string' ? error.message : '')
  const text = `${name} ${message}`.toLowerCase()
  if (/too_large|this port is large/.test(text)) return 'too_large'
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

/** Trim, lowercase, and cut a zero-result query. Empty text is dropped. */
export function searchNoResultsQuery(query: string): string | null {
  const normalized = query.replace(/[\u0000-\u001f]/g, '').trim().toLowerCase().slice(0, SEARCH_NO_RESULTS_MAX)
  return normalized || null
}

/** Short campaign token. Prefer `ref`, otherwise `utm_source`. */
export function cleanCampaignRef(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const value = input.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, CAMPAIGN_REF_MAX)
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(value)) return null
  return value
}

export function campaignRefFromSearch(search: string | null | undefined): string | null {
  if (!search) return null
  const query = search.includes('?') ? search.slice(search.indexOf('?') + 1) : search
  const params = new URLSearchParams(query.split('#')[0])
  return cleanCampaignRef(params.get('ref') || params.get('utm_source'))
}

export interface AnalyticsSessionStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

/** Keep the landing ref for this tab. A new `ref` or `utm_source` replaces it. */
export function rememberCampaignRef(
  storage: AnalyticsSessionStore | null,
  search: string | null | undefined
): string | null {
  const fromUrl = campaignRefFromSearch(search)
  if (!storage) return fromUrl
  try {
    if (fromUrl) {
      storage.setItem(CAMPAIGN_REF_STORAGE_KEY, fromUrl)
      return fromUrl
    }
    return cleanCampaignRef(storage.getItem(CAMPAIGN_REF_STORAGE_KEY))
  } catch {
    return fromUrl
  }
}

/** First play of a port in this tab wins. Later card or detail plays are ignored. */
export function claimVideoPreviewPlay(storage: AnalyticsSessionStore | null, slug: string): boolean {
  const clean = cleanPortSlug(slug)
  if (!clean || !storage) return false
  try {
    const current = storage.getItem(PREVIEW_PLAY_STORAGE_KEY) || ''
    const played = current.split(',').filter(Boolean)
    if (played.includes(clean)) return false
    played.push(clean)
    storage.setItem(PREVIEW_PLAY_STORAGE_KEY, played.slice(-80).join(','))
    return true
  } catch {
    return false
  }
}

/** One start and one terminal outcome per step. Later calls are ignored. */
export function createInstallStepLedger() {
  const started = new Set<InstallStep>()
  const finished = new Set<InstallStep>()
  return {
    start(step: string): boolean {
      if (!(INSTALL_STEPS as readonly string[]).includes(step) || started.has(step as InstallStep)) return false
      started.add(step as InstallStep)
      return true
    },
    finish(step: string, status: string): boolean {
      if (status !== 'ok' && status !== 'fail') return false
      if (!(INSTALL_STEPS as readonly string[]).includes(step)) return false
      const name = step as InstallStep
      if (!started.has(name) || finished.has(name)) return false
      finished.add(name)
      return true
    }
  }
}

export type InstallProgressStep = 'idle' | 'downloading' | 'pushing' | 'installing' | 'completed' | 'error'

/** Map an APK progress change to at most one outcome per step. The ledger drops repeats. */
export function installStepEventsForProgress(
  previous: InstallProgressStep | null,
  next: InstallProgressStep
): InstallStepEvent[] {
  if (next === 'downloading' || next === 'pushing') {
    return [{ step: 'download_apk', status: 'start' }]
  }
  if (next === 'installing') {
    return [
      { step: 'download_apk', status: 'ok' },
      { step: 'install_apk', status: 'start' }
    ]
  }
  if (next === 'completed') {
    return [{ step: 'install_apk', status: 'ok' }]
  }
  const active = previous === 'downloading' || previous === 'pushing' || previous === 'installing'
  if (next === 'error' || (next === 'idle' && active)) {
    return [
      { step: 'install_apk', status: 'fail' },
      { step: 'download_apk', status: 'fail' }
    ]
  }
  return []
}

export function installStepEventsForConnectPhase(phase: string): InstallStepEvent[] {
  if (phase === 'authorizing') {
    return [
      { step: 'connect', status: 'ok' },
      { step: 'authorize', status: 'start' }
    ]
  }
  return []
}

export function installStepEventsForConnectResult(input: {
  connected: boolean
  sawAuthorize: boolean
}): InstallStepEvent[] {
  if (input.connected) {
    const events: InstallStepEvent[] = []
    if (!input.sawAuthorize) {
      events.push({ step: 'connect', status: 'ok' }, { step: 'authorize', status: 'start' })
    }
    events.push({ step: 'authorize', status: 'ok' })
    return events
  }
  if (input.sawAuthorize) return [{ step: 'authorize', status: 'fail' }]
  return [{ step: 'connect', status: 'fail' }]
}

export function withSessionCampaignRef(
  event: AnalyticsEventName,
  input: AnalyticsTrackInput,
  storage: AnalyticsSessionStore | null,
  search: string | null | undefined
): AnalyticsTrackInput {
  const ref = rememberCampaignRef(storage, search)
  if (!ref || !EVENTS_WITH_REF.has(event)) return input
  const base = input.props && typeof input.props === 'object' && !Array.isArray(input.props)
    ? { ...input.props }
    : {}
  if (cleanCampaignRef(base.ref)) return { ...input, props: base }
  return { ...input, props: { ...base, ref } }
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

function campaignRefProps(props: Record<string, unknown> | null): { ref?: string } {
  const ref = cleanCampaignRef(props?.ref)
  return ref ? { ref } : {}
}

function installErrorProps(props: Record<string, unknown> | null): { reason: InstallErrorReason; ref?: string } {
  const reason = props && typeof props.reason === 'string' ? props.reason : ''
  const code = (INSTALL_ERROR_REASONS as readonly string[]).includes(reason)
    ? reason as InstallErrorReason
    : 'other'
  return { reason: code, ...campaignRefProps(props) }
}

function installStepProps(
  props: Record<string, unknown> | null
): { step: InstallStep; status: InstallStepStatus; ref?: string } | null {
  const step = props && typeof props.step === 'string' ? props.step : ''
  const status = props && typeof props.status === 'string' ? props.status : ''
  if (!(INSTALL_STEPS as readonly string[]).includes(step)) return null
  if (!(INSTALL_STEP_STATUSES as readonly string[]).includes(status)) return null
  return {
    step: step as InstallStep,
    status: status as InstallStepStatus,
    ...campaignRefProps(props)
  }
}

function videoPreviewProps(
  props: Record<string, unknown> | null
): { surface: VideoPreviewSurface } | null {
  const surface = props && typeof props.surface === 'string' ? props.surface : ''
  if (!(VIDEO_PREVIEW_SURFACES as readonly string[]).includes(surface)) return null
  return { surface: surface as VideoPreviewSurface }
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
  props: Record<string, string | number | boolean> | null
}

function readProps(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  return input as Record<string, unknown>
}

/** Drops anything outside the allowlist. Search text is lowercased and cut before it is stored. */
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

  let storedProps: Record<string, string | number | boolean> | null = null
  if (record.event === 'install_error') {
    storedProps = installErrorProps(props)
  } else if (record.event === 'install_step') {
    const step = installStepProps(props)
    if (!step) return null
    storedProps = step
  } else if (record.event === 'install_click' || record.event === 'install_success') {
    const ref = campaignRefProps(props)
    storedProps = ref.ref ? ref : null
  } else if (record.event === 'page_view') {
    const ref = campaignRefProps(props)
    storedProps = ref.ref ? ref : null
  } else if (record.event === 'search') {
    const query = props && typeof props.q === 'string' ? props.q : ''
    const length = props && typeof props.length === 'number' ? props.length : undefined
    const search = searchProps(query, length)
    if (!search) return null
    storedProps = search
  } else if (record.event === 'search_no_results') {
    const query = props && typeof props.q === 'string' ? props.q : ''
    const q = searchNoResultsQuery(query)
    if (!q) return null
    storedProps = { q }
  } else if (record.event === 'filter_used') {
    const filter = props ? filterProps(props) : null
    if (!filter) return null
    storedProps = filter
  } else if (record.event === 'unsupported_browser_view') {
    storedProps = unsupportedBrowserProps(props)
  } else if (record.event === 'video_preview_play') {
    const preview = videoPreviewProps(props)
    if (!preview) return null
    storedProps = preview
  }

  if (props?.app === true) {
    storedProps = { ...(storedProps || {}), app: true }
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

/** In the native app, every event carries props.app and webusb is not the install path. */
export function withAppAnalyticsProp(input: AnalyticsTrackInput, inApp: boolean): AnalyticsTrackInput {
  if (!inApp) return input
  const base = input.props && typeof input.props === 'object' && !Array.isArray(input.props)
    ? input.props
    : {}
  return {
    ...input,
    webusb: false,
    props: { ...base, app: true }
  }
}

/**
 * install_success is recorded after a long WebUSB session, often while the tab is in the background.
 * sendBeacon can return true and then never flush. A normal fetch is the transport that already
 * lands the matching verification write.
 * Other events use sendBeacon only while the tab is visible.
 */
export function analyticsDeliveryPlan(input: {
  event: string
  visibility?: string | null
  beaconAvailable?: boolean
}): 'beacon' | 'fetch' {
  if (input.event === 'install_success') return 'fetch'
  if (input.visibility && input.visibility !== 'visible') return 'fetch'
  if (!input.beaconAvailable) return 'fetch'
  return 'beacon'
}

export async function deliverAnalyticsPayload(input: {
  event: string
  body: string
  visibility?: string | null
  url?: string
  sendBeacon?: (url: string, data: Blob) => boolean
  fetchImpl: (url: string, init: { method: string; body: string; headers: Record<string, string>; keepalive: boolean }) => Promise<unknown>
}): Promise<'beacon' | 'fetch'> {
  const url = input.url || '/api/track'
  const plan = analyticsDeliveryPlan({
    event: input.event,
    visibility: input.visibility,
    beaconAvailable: typeof input.sendBeacon === 'function'
  })
  if (plan === 'beacon' && input.sendBeacon) {
    try {
      const blob = new Blob([input.body], { type: 'application/json' })
      if (input.sendBeacon(url, blob)) return 'beacon'
    } catch {
      // Fall through to fetch.
    }
  }
  await input.fetchImpl(url, {
    method: 'POST',
    body: input.body,
    headers: { 'content-type': 'application/json' },
    keepalive: true
  })
  return 'fetch'
}

/**
 * The WebUSB installer records a success only after pm install reports success.
 * A cancelled or unfinished transfer is an install_error, not a success.
 */
export function apkInstallOutcome(input: {
  installed: boolean
  progressStep?: string | null
}): 'success' | 'cancelled' {
  if (input.installed || input.progressStep === 'completed') return 'success'
  return 'cancelled'
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
