import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  ANALYTICS_EVENTS,
  ANALYTICS_HOURLY_LIMIT,
  FILTER_NAMES,
  INSTALL_ERROR_REASONS,
  browserFamilyFromUserAgent,
  clientAnalyticsPayload,
  connectFailureReason,
  deviceFromUserAgent,
  hasMockQuestFlag,
  installErrorReason,
  isAnalyticsEnabled,
  isBotUserAgent,
  searchProps
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
      'manual_download_click',
      'github_click',
      'suggest_submit',
      'feedback_submit',
      'filter_used',
      'search',
      'unsupported_browser_view'
    ])

    for (const event of ANALYTICS_EVENTS) {
      const body: Record<string, unknown> = { event, path: '/' }
      if (event === 'port_view' || event.startsWith('install_')) body.portSlug = 'rtcwquest'
      if (event === 'install_error') body.props = { reason: 'adb_fail' }
      if (event === 'search') body.props = { q: 'doom', length: 4 }
      if (event === 'filter_used') body.props = { filter: 'category', value: 'source_port' }
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
    for (const event of ANALYTICS_EVENTS) expect(sql).toContain(`'${event}'`)
    for (const reason of INSTALL_ERROR_REASONS) expect(sql).toContain(`'${reason}'`)
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
    expect(connectFailureReason({ webusb: false, notice: null, error: null })).toBe('no_webusb')
    expect(connectFailureReason({
      webusb: true,
      notice: 'No headset selected. Try again when ready.',
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
  })

  it('records install success at the verification step', () => {
    const source = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const fn = source.slice(source.indexOf('const recordInstallVerification'))
    const successAt = fn.indexOf("trackInstall('install_success')")
    const postAt = fn.indexOf("'/api/verifications'")
    expect(successAt).toBeGreaterThan(0)
    expect(postAt).toBeGreaterThan(successAt)
    expect(source).toContain("trackInstall('install_click')")
    expect(readFileSync(new URL('../app/components/Footer.vue', import.meta.url), 'utf8'))
      .toContain('Anonymous usage stats, no cookies.')
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
