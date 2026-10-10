import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  ANALYTICS_EVENTS,
  ANALYTICS_HOURLY_LIMIT,
  analyticsDeliveryPlan,
  apkInstallOutcome,
  deliverAnalyticsPayload,
  CAMPAIGN_REF_STORAGE_KEY,
  FILTER_NAMES,
  INSTALL_ERROR_REASONS,
  INSTALL_STEPS,
  IN_APP_BROWSER_FAMILIES,
  PREVIEW_PLAY_STORAGE_KEY,
  browserFamilyFromUserAgent,
  campaignRefFromSearch,
  claimVideoPreviewPlay,
  cleanCampaignRef,
  clientAnalyticsPayload,
  connectFailureReason,
  createInstallStepLedger,
  deviceFromUserAgent,
  hasMockQuestFlag,
  installErrorReason,
  installStepEventsForConnectPhase,
  installStepEventsForConnectResult,
  installStepEventsForProgress,
  isAnalyticsEnabled,
  isBotUserAgent,
  UNSUPPORTED_BROWSER_ACTIONS,
  isInAppBrowserFamily,
  rememberCampaignRef,
  searchNoResultsQuery,
  searchProps,
  withSessionCampaignRef,
  type AnalyticsSessionStore
} from '../app/lib/analytics'
import { parseMockScenario } from '../app/lib/mockQuest'
import {
  analyticsVisitorHash,
  createAnalyticsRateLimiter,
  decideAnalyticsRequest,
  type AnalyticsRequestInput
} from '../server/utils/analytics'

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 UniqueBuild/abc123'
const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
const IPAD_UA =
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

function sha(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function memoryStore(initial: Record<string, string> = {}): AnalyticsSessionStore & { dump(): Record<string, string> } {
  const data = { ...initial }
  return {
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key]! : null
    },
    setItem(key: string, value: string) {
      data[key] = value
    },
    dump() {
      return { ...data }
    }
  }
}

function decide(overrides: Partial<AnalyticsRequestInput> = {}) {
  return decideAnalyticsRequest({
    enabled: true,
    body: { event: 'page_view', path: '/' },
    ip: '203.0.113.50',
    userAgent: CHROME_UA,
    analyticsSalt: 'pepper',
    serviceRoleKey: 'service-role-key',
    countryHeader: 'br',
    referrer: 'https://www.reddit.com/r/oculus/comments/1?q=doom',
    requestHost: 'questports.vercel.app',
    now: new Date('2026-10-09T15:00:00.000Z'),
    ...overrides
  })
}

describe('analytics allowlist', () => {
  it('accepts every product event and rejects anything else', () => {
    expect(ANALYTICS_EVENTS).toEqual([
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
    ])

    for (const event of ANALYTICS_EVENTS) {
      const body: Record<string, unknown> = { event, path: '/' }
      if (event === 'port_view' || event.startsWith('install_') || event === 'video_preview_play') {
        body.portSlug = 'rtcwquest'
      }
      if (event === 'install_error') body.props = { reason: 'adb_fail' }
      if (event === 'install_step') body.props = { step: 'connect', status: 'start' }
      if (event === 'search') body.props = { q: 'doom', length: 4 }
      if (event === 'search_no_results') body.props = { q: 'no such game' }
      if (event === 'filter_used') body.props = { filter: 'category', value: 'source_port' }
      if (event === 'video_preview_play') body.props = { surface: 'card' }
      const decision = decide({ body })
      expect(decision.record, event).toBe(true)
      expect(decision.row?.event).toBe(event)
    }

    expect(decide({ body: { event: 'purchase', path: '/' } }).record).toBe(false)
    expect(decide({ body: { event: 'page_view' } }).reason).toBe('invalid')
    expect(decide({ body: { event: 'port_view', path: '/' } }).record).toBe(false)
  })

  it('keeps the migration allowlist, indexes, and private grants in sync', () => {
    const sql = readFileSync(
      new URL('../supabase/migrations/20261009200000_analytics_events.sql', import.meta.url),
      'utf8'
    )
    const funnel = readFileSync(
      new URL('../supabase/migrations/20261009230000_analytics_funnel_events.sql', import.meta.url),
      'utf8'
    )
    const originalEvents = ANALYTICS_EVENTS.filter(event =>
      !['install_step', 'search_no_results', 'video_preview_play'].includes(event)
    )
    for (const event of originalEvents) expect(sql).toContain(`'${event}'`)
    for (const event of ANALYTICS_EVENTS) expect(funnel).toContain(`'${event}'`)
    for (const step of INSTALL_STEPS) expect(funnel).toContain(`'${step}'`)
    expect(funnel).toContain('drop constraint if exists analytics_events_event_check')
    expect(funnel).toContain('analytics_events_install_step_check')
    expect(funnel).toContain('analytics_events_search_no_results_check')
    expect(funnel).toContain('analytics_events_video_preview_play_check')
    expect(funnel).toContain('analytics_events_campaign_ref_check')
    expect(funnel).not.toMatch(/create or replace view/i)
    const tooLarge = readFileSync(
      new URL('../supabase/migrations/20261010120000_analytics_too_large.sql', import.meta.url),
      'utf8'
    )
    const reasonsSql = `${sql}\n${tooLarge}`
    for (const reason of INSTALL_ERROR_REASONS) expect(reasonsSql).toContain(`'${reason}'`)
    expect(tooLarge).toContain('analytics_events_install_error_reason')
    expect(tooLarge).toContain("'too_large'")
    for (const filter of FILTER_NAMES) expect(sql).toContain(`'${filter}'`)
    expect(sql).toContain('enable row level security')
    expect(sql).not.toMatch(/create policy/i)
    expect(sql).toContain('analytics_events_created_at_idx')
    expect(sql).toContain('analytics_events_event_created_at_idx')
    expect(sql).toContain('analytics_events_port_slug_idx')
    expect(sql).toContain('security_invoker = true')
    expect(sql).toContain('analytics_daily')
    expect(sql).toContain('analytics_top_ports')
    expect(sql).toContain('unique_visitors')
    expect(sql).toContain('install_successes')
    expect(sql).toContain('revoke all on table public.analytics_events from anon, authenticated')
    expect(sql).toContain('revoke all on table public.analytics_daily from public, anon, authenticated')
    expect(sql).not.toMatch(/grant select on table public\.analytics_events to anon/i)
    expect(sql).toContain("device in ('mobile', 'desktop', 'tablet')")
    expect(sql).toContain('char_length(browser) between 1 and 32')
    expect(sql).not.toMatch(/browser in \(/i)
  })
})

describe('analytics privacy gates', () => {
  it('skips bots, empty user agents, and leaves normal browsers', () => {
    expect(isBotUserAgent('')).toBe(true)
    expect(isBotUserAgent('   ')).toBe(true)
    expect(isBotUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true)
    expect(isBotUserAgent('curl/8.7.1')).toBe(true)
    expect(isBotUserAgent('Mozilla/5.0 Slackbot-LinkExpanding 1.0')).toBe(true)
    expect(isBotUserAgent(CHROME_UA)).toBe(false)
    expect(isBotUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 OculusBrowser/33.0 Chrome/120.0.0.0 Safari/537.36')).toBe(false)
    expect(isBotUserAgent('WhatsApp/2.23.20.0')).toBe(true)
    expect(isBotUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 WhatsApp/2.24.10.78')).toBe(false)

    expect(decide({ userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)' }).reason).toBe('bot')
    expect(decide({ userAgent: '' }).reason).toBe('bot')
    expect(decide().record).toBe(true)
  })

  it('skips Do Not Track, Global Privacy Control, prefetch, and simulated Quest sessions', () => {
    expect(decide({ dnt: '1' }).reason).toBe('dnt')
    expect(decide({ gpc: '1' }).reason).toBe('dnt')
    expect(decide({ dnt: '0' }).record).toBe(true)
    expect(decide({ purpose: 'prefetch' }).reason).toBe('prefetch')
    expect(decide({
      referrer: 'https://questports.vercel.app/ports/rtcwquest?mockQuest=1'
    }).reason).toBe('mock')
    expect(decide({
      body: { event: 'page_view', path: '/ports/rtcwquest?mockQuest=connected' }
    }).reason).toBe('invalid')
    expect(decide({
      referrer: 'https://questports.vercel.app/ports/rtcwquest?mockQuest=0'
    }).record).toBe(true)

    expect(hasMockQuestFlag('?mockQuest=1')).toBe(parseMockScenario('?mockQuest=1') !== null)
    expect(hasMockQuestFlag('?mockQuest=0')).toBe(parseMockScenario('?mockQuest=0') !== null)
    expect(hasMockQuestFlag('?mockQuest=connected')).toBe(true)
    expect(hasMockQuestFlag('?mockQuest=false')).toBe(false)
  })

  it('stays off in dev and preview unless ANALYTICS_ENABLED=true', () => {
    expect(isAnalyticsEnabled({ NODE_ENV: 'development' })).toBe(false)
    expect(isAnalyticsEnabled({ VERCEL_ENV: 'preview', NODE_ENV: 'production' })).toBe(false)
    expect(isAnalyticsEnabled({ VERCEL_ENV: 'production' })).toBe(true)
    expect(isAnalyticsEnabled({ NODE_ENV: 'production' })).toBe(true)
    expect(isAnalyticsEnabled({ VERCEL_ENV: 'preview', ANALYTICS_ENABLED: 'true' })).toBe(true)
    expect(isAnalyticsEnabled({ VERCEL_ENV: 'production', ANALYTICS_ENABLED: 'false' })).toBe(false)
    expect(decide({
      enabled: undefined,
      env: { VERCEL_ENV: 'preview', NODE_ENV: 'production' }
    }).reason).toBe('disabled')
    expect(decide({
      enabled: undefined,
      env: { VERCEL_ENV: 'production' }
    }).record).toBe(true)
  })
})

describe('analytics visitor hash', () => {
  it('is a daily sha256 and never the raw ip or user-agent', () => {
    const input = {
      analyticsSalt: 'pepper',
      serviceRoleKey: 'service-role-key',
      ip: '203.0.113.50',
      userAgent: CHROME_UA,
      day: '2026-10-09'
    }
    const expectedSalt = sha(`pepper\n${input.day}`)
    const expected = sha(`${expectedSalt}${input.ip}${input.userAgent}`)
    expect(analyticsVisitorHash(input)).toBe(expected)
    expect(analyticsVisitorHash(input)).toHaveLength(64)
    expect(analyticsVisitorHash(input)).toBe(analyticsVisitorHash(input))
    expect(analyticsVisitorHash({ ...input, day: '2026-10-10' })).not.toBe(expected)
    expect(analyticsVisitorHash({ ...input, ip: '203.0.113.51' })).not.toBe(expected)
    expect(analyticsVisitorHash({ ...input, userAgent: `${CHROME_UA} extra` })).not.toBe(expected)

    const fromServiceKey = analyticsVisitorHash({ ...input, analyticsSalt: '' })
    const serviceSalt = sha(`${sha('service-role-key')}\n${input.day}`)
    expect(fromServiceKey).toBe(sha(`${serviceSalt}${input.ip}${input.userAgent}`))
    expect(fromServiceKey).not.toBe(expected)

    const decision = decide()
    const row = decision.row!
    expect(row.visitor_hash).toBe(expected)
    const stored = JSON.stringify(row)
    expect(stored).not.toContain('203.0.113.50')
    expect(stored).not.toContain('UniqueBuild/abc123')
    expect(stored).not.toContain(CHROME_UA)
    expect(row.browser).toBe('Chrome')
    expect(row.device).toBe('desktop')
    expect(row.country).toBe('BR')
    expect(row.referrer_host).toBe('reddit.com')
    expect(row.webusb).toBeNull()
    expect(row.props).toBeNull()
  })

  it('ignores client-supplied country, hash, and device', () => {
    const decision = decide({
      body: {
        event: 'page_view',
        path: '/',
        country: 'ZZ',
        visitor_hash: 'a'.repeat(64),
        device: 'mobile',
        browser: 'Netscape',
        props: { email: 'person@example.com' }
      },
      countryHeader: 'US'
    })
    expect(decision.row?.country).toBe('US')
    expect(decision.row?.device).toBe('desktop')
    expect(decision.row?.browser).toBe('Chrome')
    expect(decision.row?.visitor_hash).not.toBe('a'.repeat(64))
    expect(JSON.stringify(decision.row)).not.toContain('person@example.com')
    expect(JSON.stringify(decision.row)).not.toContain('Netscape')
  })

  it('drops same-site referrers and keeps only the external host', () => {
    const self = decide({ referrer: 'https://www.questports.vercel.app/ports/rtcwquest?q=secret' })
    expect(self.row?.referrer_host).toBeNull()
    expect(JSON.stringify(self.row)).not.toContain('secret')
  })
})

describe('analytics validation', () => {
  it('stores a lowercased search query cut to 60 characters and its length', () => {
    const long = `  ${'Doom'.repeat(30)}  `
    const props = searchProps(long, long.trim().length)
    expect(props?.q).toBe('doom'.repeat(15))
    expect(props?.q).toHaveLength(60)
    expect(props?.length).toBe(long.trim().length)
    expect(props?.q).toBe(props?.q.toLowerCase())

    const client = clientAnalyticsPayload('search', {
      path: '/',
      props: { q: long, length: long.trim().length }
    })
    expect(client?.props).toEqual(props)
    expect(JSON.stringify(client)).not.toContain('Doom')
    expect(JSON.stringify(client)).not.toContain('doom'.repeat(16))

    const decision = decide({
      body: { event: 'search', path: '/', props: { q: '  HALO CE  ', length: 7 } }
    })
    expect(decision.row?.props).toEqual({ q: 'halo ce', length: 7 })
    expect(decision.row?.path).toBe('/')
  })

  it('keeps filter names on the allowlist and install errors as short codes', () => {
    expect(decide({
      body: { event: 'filter_used', props: { filter: 'not_a_filter', value: 'x' } }
    }).record).toBe(false)
    expect(decide({
      body: { event: 'filter_used', path: '/', props: { filter: 'hardware', value: 'Quest 3' } }
    }).row?.props).toEqual({ filter: 'hardware', value: 'Quest 3' })

    expect(decide({
      body: {
        event: 'install_error',
        portSlug: 'rtcwquest',
        props: { reason: 'drop table', detail: 'serial 123' }
      }
    }).row?.props).toEqual({ reason: 'other' })
    expect(decide({
      body: { event: 'install_error', portSlug: 'rtcwquest', props: { reason: 'user_cancelled' } }
    }).row?.props).toEqual({ reason: 'user_cancelled' })
    expect(decide({
      body: { event: 'install_error', portSlug: 'doom3quest', props: { reason: 'too_large' } }
    }).row?.props).toEqual({ reason: 'too_large' })
  })

  it('maps install failures to short reason codes', () => {
    expect(installErrorReason({ name: 'AbortError', message: 'Installation cancelled by user' })).toBe('user_cancelled')
    expect(installErrorReason({ name: 'NotFoundError', message: 'No device selected.' })).toBe('user_cancelled')
    expect(installErrorReason(new Error('WebUSB is not supported in this browser.'))).toBe('no_webusb')
    expect(installErrorReason(new Error('Not enough free space. Need 1 MB.'))).toBe('storage')
    expect(installErrorReason(new Error('Failed to download APK: HTTP 404'))).toBe('download_fail')
    expect(installErrorReason(new Error('INSTALL_FAILED_INVALID_APK'))).toBe('pm_fail')
    expect(installErrorReason(new Error('device unauthorized.'))).toBe('unauthorized')
    expect(installErrorReason(new Error('The Quest USB interface is locked by another program'))).toBe('usb_locked')
    expect(installErrorReason(new Error('Headset authorization timed out.'))).toBe('timeout')
    expect(installErrorReason(new Error('Meta Quest not connected!'))).toBe('adb_fail')
    expect(installErrorReason(new Error('something unexpected'))).toBe('other')
    expect(installErrorReason({ reason: 'too_large', message: 'This port is large (772 MB).' })).toBe('too_large')
    expect(connectFailureReason({ webusb: false, notice: null, error: null })).toBe('no_webusb')
    expect(installErrorReason(new Error('Your Quest is being used by another app on this computer. adb kill-server'))).toBe('usb_locked')
    expect(connectFailureReason({
      webusb: true,
      notice: "Don't see your Quest in the list?",
      error: null
    })).toBe('user_cancelled')
  })

  it('classifies device and browser family without keeping the user-agent', () => {
    expect(deviceFromUserAgent(IPHONE_UA)).toBe('mobile')
    expect(deviceFromUserAgent(IPAD_UA)).toBe('tablet')
    expect(deviceFromUserAgent(CHROME_UA)).toBe('desktop')
    expect(deviceFromUserAgent('Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36')).toBe('tablet')
    expect(browserFamilyFromUserAgent(CHROME_UA)).toBe('Chrome')
    expect(browserFamilyFromUserAgent('Mozilla/5.0 Edg/120.0.0.0 Chrome/120.0.0.0 Safari/537.36')).toBe('Edge')
    expect(browserFamilyFromUserAgent('Mozilla/5.0 Firefox/121.0')).toBe('Firefox')
    expect(browserFamilyFromUserAgent('Mozilla/5.0 OculusBrowser/33.0 Chrome/120.0.0.0 Safari/537.36')).toBe('Oculus')
    expect(browserFamilyFromUserAgent(IPHONE_UA)).toBe('Safari')
    expect(browserFamilyFromUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1'
    )).toBe('Chrome iOS')
    expect(deviceFromUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1'
    )).toBe('mobile')

    const inApp = {
      Discord: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Discord',
      Reddit: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Reddit/Version 2024.10.0',
      Instagram: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 Instagram 302.0',
      Facebook: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/450.0]',
      Telegram: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 Telegram-Android/10.14.0',
      WhatsApp: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 WhatsApp/2.24.10.78',
      X: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 TwitterAndroid',
      Line: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 Line/14.0.0',
      'In-app': 'Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TQ3A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36'
    }
    for (const [label, ua] of Object.entries(inApp)) {
      expect(browserFamilyFromUserAgent(ua), label).toBe(label)
      expect(isInAppBrowserFamily(label)).toBe(true)
      expect(label.length).toBeGreaterThanOrEqual(1)
      expect(label.length).toBeLessThanOrEqual(32)
    }
    expect(browserFamilyFromUserAgent(
      'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 X/10.45'
    )).toBe('X')
    expect(IN_APP_BROWSER_FAMILIES).toContain('In-app')
    expect('Chrome iOS'.length).toBeLessThanOrEqual(32)
    expect(isInAppBrowserFamily('Chrome')).toBe(false)
    expect(isInAppBrowserFamily('Other')).toBe(false)
  })

  it('reuses unsupported_browser_view for the Quest browser notice', () => {
    const shown = clientAnalyticsPayload('unsupported_browser_view', {
      path: '/ports/rtcwquest',
      portSlug: 'rtcwquest',
      webusb: true,
      props: { action: 'shown', userAgent: 'OculusBrowser/33' }
    })
    expect(shown?.event).toBe('unsupported_browser_view')
    expect(shown?.props).toEqual({ action: 'shown' })
    expect(JSON.stringify(shown)).not.toContain('OculusBrowser')

    const copied = decide({
      body: {
        event: 'unsupported_browser_view',
        path: '/ports/rtcwquest',
        portSlug: 'rtcwquest',
        webusb: true,
        props: { action: 'copy_link', extra: 'drop me' }
      }
    })
    expect(copied.record).toBe(true)
    expect(copied.row?.props).toEqual({ action: 'copy_link' })
    expect(copied.row?.browser).toBe('Chrome')

    const plain = decide({
      body: { event: 'unsupported_browser_view', path: '/', props: { action: 'install' } }
    })
    expect(plain.record).toBe(true)
    expect(plain.row?.props).toBeNull()

    expect(ANALYTICS_EVENTS).not.toContain('quest_browser_notice')

    for (const action of ['share_link', 'direct_install_open'] as const) {
      expect(UNSUPPORTED_BROWSER_ACTIONS).toContain(action)
      const payload = clientAnalyticsPayload('unsupported_browser_view', {
        path: '/ports/iron-lung-vr',
        portSlug: 'iron-lung-vr',
        props: { action, userAgent: 'drop me' }
      })
      expect(payload?.props).toEqual({ action })
      const stored = decide({ body: payload, userAgent: CHROME_UA })
      expect(stored.record).toBe(true)
      expect(stored.row?.props).toEqual({ action })
      expect(JSON.stringify(stored.row)).not.toContain('drop me')
    }

    const migrations = readFileSync(new URL('../supabase/migrations/20261009200000_analytics_events.sql', import.meta.url), 'utf8')
      + readFileSync(new URL('../supabase/migrations/20261009230000_analytics_funnel_events.sql', import.meta.url), 'utf8')
    expect(migrations).not.toContain("props->>'action'")
  })

  it('records install success at the verification step', () => {
    const source = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const fn = source.slice(source.indexOf('const recordInstallVerification'))
    const successAt = fn.indexOf("await trackInstall('install_success')")
    const postAt = fn.indexOf("'/api/verifications'")
    expect(successAt).toBeGreaterThan(0)
    expect(postAt).toBeGreaterThan(successAt)
    expect(source).toContain("trackInstall('install_click')")
    expect(source).toContain("track('install_step'")
    expect(source).toContain("surface: 'detail'")
    expect(source).toContain('copy_game_files')
    const index = readFileSync(new URL('../app/pages/index.vue', import.meta.url), 'utf8')
    expect(index).toContain("track('search_no_results'")
    const card = readFileSync(new URL('../app/components/PortCard.vue', import.meta.url), 'utf8')
    expect(card).not.toContain('video_preview_play')
    expect(card).not.toContain('claimVideoPreviewPlay')
    expect(readFileSync(new URL('../app/composables/useTrack.ts', import.meta.url), 'utf8'))
      .toContain('sessionStorage')
    expect(readFileSync(new URL('../app/components/Footer.vue', import.meta.url), 'utf8'))
      .toContain('Anonymous usage stats, no cookies.')
  })

  it('records a finished WebUSB install with fetch before the verification post', async () => {
    expect(apkInstallOutcome({ installed: true, progressStep: 'installing' })).toBe('success')
    expect(apkInstallOutcome({ installed: false, progressStep: 'completed' })).toBe('success')
    expect(apkInstallOutcome({ installed: false, progressStep: 'error' })).toBe('cancelled')
    expect(apkInstallOutcome({ installed: false, progressStep: 'idle' })).toBe('cancelled')

    const payload = clientAnalyticsPayload('install_success', {
      path: '/ports/gran-turismo-2-vr',
      portSlug: 'gran-turismo-2-vr',
      headset: 'Quest 3S',
      webusb: true
    })
    const decision = decide({ body: payload, userAgent: CHROME_UA })
    expect(decision.record).toBe(true)
    expect(decision.row?.event).toBe('install_success')
    expect(decision.row?.port_slug).toBe('gran-turismo-2-vr')
    expect(decision.row?.headset).toBe('Quest 3S')
    expect(decision.row?.browser).toBe('Chrome')
    expect(decision.row?.props).toBeNull()

    expect(analyticsDeliveryPlan({
      event: 'install_success',
      visibility: 'visible',
      beaconAvailable: true
    })).toBe('fetch')
    expect(analyticsDeliveryPlan({
      event: 'install_success',
      visibility: 'hidden',
      beaconAvailable: true
    })).toBe('fetch')
    expect(analyticsDeliveryPlan({
      event: 'install_click',
      visibility: 'visible',
      beaconAvailable: true
    })).toBe('beacon')
    expect(analyticsDeliveryPlan({
      event: 'install_click',
      visibility: 'hidden',
      beaconAvailable: true
    })).toBe('fetch')

    let beacons = 0
    let fetched = ''
    const mode = await deliverAnalyticsPayload({
      event: 'install_success',
      body: JSON.stringify(payload),
      visibility: 'hidden',
      sendBeacon: () => {
        beacons += 1
        return true
      },
      fetchImpl: async (_url, init) => {
        fetched = init.body
      }
    })
    expect(mode).toBe('fetch')
    expect(beacons).toBe(0)
    expect(fetched).toContain('"event":"install_success"')
    expect(fetched).toContain('gran-turismo-2-vr')
    expect(fetched).toContain('Quest 3S')

    const source = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const handler = source.slice(source.indexOf('const handleApkInstall'))
    const outcomeAt = handler.indexOf('apkInstallOutcome(')
    const verifyAt = handler.indexOf('await recordInstallVerification()')
    const cancelledAt = handler.indexOf("trackInstall('install_error', 'user_cancelled')")
    expect(outcomeAt).toBeGreaterThan(0)
    expect(verifyAt).toBeGreaterThan(outcomeAt)
    expect(cancelledAt).toBeGreaterThan(verifyAt)
    const record = source.slice(source.indexOf('const recordInstallVerification'))
    expect(record.indexOf("await trackInstall('install_success')")).toBeGreaterThan(0)
    expect(record.indexOf("'/api/verifications'")).toBeGreaterThan(record.indexOf("await trackInstall('install_success')"))
    expect(readFileSync(new URL('../app/composables/useTrack.ts', import.meta.url), 'utf8'))
      .toContain('deliverAnalyticsPayload')
  })

  it('records install success with port, headset, and session ref', () => {
    const store = memoryStore()
    rememberCampaignRef(store, '?ref=Reddit')
    const input = withSessionCampaignRef('install_success', {
      path: '/ports/rtcwquest',
      portSlug: 'rtcwquest',
      headset: 'Quest 3'
    }, store, '')
    const payload = clientAnalyticsPayload('install_success', input)
    expect(payload?.portSlug).toBe('rtcwquest')
    expect(payload?.headset).toBe('Quest 3')
    expect(payload?.props).toEqual({ ref: 'reddit' })
    expect(payload).not.toHaveProperty('browser')

    const decision = decide({ body: payload, userAgent: CHROME_UA })
    expect(decision.record).toBe(true)
    expect(decision.row?.browser).toBe('Chrome')
    expect(decision.row?.headset).toBe('Quest 3')
    expect(decision.row?.port_slug).toBe('rtcwquest')
    expect(decision.row?.props).toEqual({ ref: 'reddit' })
  })

  it('keeps one install step outcome and a normalized empty-search query', () => {
    const ledger = createInstallStepLedger()
    const seen: string[] = []
    const apply = (events: Array<{ step: string; status: string }>) => {
      for (const event of events) {
        const accepted = event.status === 'start'
          ? ledger.start(event.step)
          : ledger.finish(event.step, event.status)
        if (accepted) seen.push(`${event.step}:${event.status}`)
      }
    }
    apply([{ step: 'connect', status: 'start' }])
    apply(installStepEventsForConnectPhase('picker'))
    apply(installStepEventsForConnectPhase('authorizing'))
    apply(installStepEventsForConnectPhase('authorizing'))
    apply(installStepEventsForConnectResult({ connected: true, sawAuthorize: true }))
    apply(installStepEventsForProgress('idle', 'downloading'))
    apply(installStepEventsForProgress('downloading', 'pushing'))
    apply(installStepEventsForProgress('pushing', 'downloading'))
    apply(installStepEventsForProgress('downloading', 'installing'))
    apply(installStepEventsForProgress('installing', 'completed'))
    expect(seen).toEqual([
      'connect:start',
      'connect:ok',
      'authorize:start',
      'authorize:ok',
      'download_apk:start',
      'download_apk:ok',
      'install_apk:start',
      'install_apk:ok'
    ])

    const failed = createInstallStepLedger()
    expect(failed.start('download_apk')).toBe(true)
    expect(failed.finish('install_apk', 'fail')).toBe(false)
    expect(failed.finish('download_apk', 'fail')).toBe(true)
    expect(failed.finish('download_apk', 'ok')).toBe(false)
    expect(installStepEventsForConnectResult({ connected: false, sawAuthorize: false }))
      .toEqual([{ step: 'connect', status: 'fail' }])
    expect(installStepEventsForProgress('downloading', 'idle')).toEqual([
      { step: 'install_apk', status: 'fail' },
      { step: 'download_apk', status: 'fail' }
    ])

    expect(searchNoResultsQuery('  No Such GAME  ')).toBe('no such game')
    expect(searchNoResultsQuery(` ${'A'.repeat(90)} `)).toHaveLength(80)
    expect(searchNoResultsQuery('   ')).toBeNull()
    expect(clientAnalyticsPayload('search_no_results', {
      path: '/',
      props: { q: '  Missing Port  ', ref: 'leak' }
    })?.props).toEqual({ q: 'missing port' })
    expect(clientAnalyticsPayload('search_no_results', { path: '/', props: { q: '   ' } })).toBeNull()
    expect(clientAnalyticsPayload('install_step', {
      path: '/ports/rtcwquest',
      portSlug: 'rtcwquest',
      props: { step: 'copy_game_files', status: 'ok', ref: 'hn' }
    })?.props).toEqual({ step: 'copy_game_files', status: 'ok', ref: 'hn' })
    expect(clientAnalyticsPayload('install_step', {
      path: '/ports/rtcwquest',
      portSlug: 'rtcwquest',
      props: { step: 'reboot', status: 'start' }
    })).toBeNull()
    expect(clientAnalyticsPayload('video_preview_play', {
      path: '/ports/rtcwquest',
      portSlug: 'rtcwquest',
      props: { surface: 'detail' }
    })?.props).toEqual({ surface: 'detail' })
    expect(clientAnalyticsPayload('video_preview_play', {
      path: '/ports/rtcwquest',
      portSlug: 'rtcwquest',
      props: { surface: 'modal' }
    })).toBeNull()
  })

  it('stores ref for the session and keeps it off search events', () => {
    expect(campaignRefFromSearch('?utm_source=Newsletter')).toBe('newsletter')
    expect(campaignRefFromSearch('?ref=Reddit&utm_source=other')).toBe('reddit')
    expect(cleanCampaignRef('!!!')).toBeNull()
    expect(cleanCampaignRef('a'.repeat(80))).toHaveLength(40)

    const store = memoryStore()
    expect(rememberCampaignRef(store, '?ref=discord')).toBe('discord')
    expect(store.getItem(CAMPAIGN_REF_STORAGE_KEY)).toBe('discord')
    expect(rememberCampaignRef(store, '')).toBe('discord')
    expect(rememberCampaignRef(store, '?utm_source=hn')).toBe('hn')

    const page = withSessionCampaignRef('page_view', { path: '/' }, store, '')
    expect(clientAnalyticsPayload('page_view', page)?.props).toEqual({ ref: 'hn' })
    const search = withSessionCampaignRef('search', {
      path: '/',
      props: { q: 'doom', length: 4 }
    }, store, '')
    expect(clientAnalyticsPayload('search', search)?.props).toEqual({ q: 'doom', length: 4 })
    expect(decide({ dnt: '1', body: { event: 'install_success', path: '/ports/rtcwquest', portSlug: 'rtcwquest' } }).reason)
      .toBe('dnt')

    expect(claimVideoPreviewPlay(store, 'RTCWQuest')).toBe(true)
    expect(claimVideoPreviewPlay(store, 'rtcwquest')).toBe(false)
    expect(claimVideoPreviewPlay(store, 'doom3quest')).toBe(true)
    expect(store.getItem(PREVIEW_PLAY_STORAGE_KEY)).toBe('rtcwquest,doom3quest')
    expect(claimVideoPreviewPlay(null, 'quakequest')).toBe(false)
  })

  it('rate limits each visitor hash to 120 events per hour', () => {
    const limiter = createAnalyticsRateLimiter()
    const now = Date.parse('2026-10-09T15:00:00.000Z')
    for (let i = 0; i < ANALYTICS_HOURLY_LIMIT; i++) {
      expect(limiter.allow('visitor', now + i)).toBe(true)
    }
    expect(limiter.allow('visitor', now + ANALYTICS_HOURLY_LIMIT)).toBe(false)
    expect(limiter.allow('someone-else', now)).toBe(true)
    expect(limiter.allow('visitor', now + 60 * 60 * 1000)).toBe(true)

    const shared = createAnalyticsRateLimiter(1, 60 * 60 * 1000)
    const first = decide({ rateLimiter: shared })
    const second = decide({ rateLimiter: shared })
    expect(first.record).toBe(true)
    expect(second.reason).toBe('rate_limited')
  })
})
