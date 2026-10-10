import { createHash } from 'node:crypto'
import {
  ANALYTICS_HOURLY_LIMIT,
  browserFamilyFromUserAgent,
  countryFromHeader,
  deviceFromUserAgent,
  hasDoNotTrack,
  hasMockQuestFlag,
  isAnalyticsEnabled,
  isBotUserAgent,
  isPrefetchRequest,
  normalizeAnalyticsBody,
  referrerHost,
  type NormalizedAnalyticsEvent
} from '~/lib/analytics'

export function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

/**
 * Rotates at UTC midnight.
 * ANALYTICS_SALT is preferred. Otherwise the salt is a hash of the service role key, plus the date.
 * visitor_hash = sha256(daily_salt + ip + user_agent). The raw IP and user-agent are not stored.
 */
export function analyticsDailySalt(input: {
  analyticsSalt: string
  serviceRoleKey: string
  day: string
}): string {
  const configured = input.analyticsSalt.trim()
  const secret = configured || sha256Hex(input.serviceRoleKey)
  return sha256Hex(`${secret}\n${input.day}`)
}

export function analyticsVisitorHash(input: {
  analyticsSalt: string
  serviceRoleKey: string
  ip: string
  userAgent: string
  day: string
}): string {
  const salt = analyticsDailySalt(input)
  return sha256Hex(`${salt}${input.ip}${input.userAgent}`)
}

export interface AnalyticsRateLimiter {
  allow(key: string, now?: number): boolean
}

export function createAnalyticsRateLimiter(
  limit = ANALYTICS_HOURLY_LIMIT,
  windowMs = 60 * 60 * 1000
): AnalyticsRateLimiter {
  const hits = new Map<string, number[]>()
  return {
    allow(key: string, now = Date.now()): boolean {
      const recent = (hits.get(key) || []).filter(stamp => now - stamp < windowMs)
      if (recent.length >= limit) {
        hits.set(key, recent)
        return false
      }
      recent.push(now)
      hits.set(key, recent)
      if (hits.size > 2000) {
        for (const [id, stamps] of hits) {
          if (stamps.every(stamp => now - stamp >= windowMs)) hits.delete(id)
        }
      }
      return true
    }
  }
}

export const analyticsRateLimiter = createAnalyticsRateLimiter()

export interface AnalyticsInsertRow {
  event: string
  path: string | null
  port_slug: string | null
  headset: string | null
  referrer_host: string | null
  country: string | null
  device: 'mobile' | 'desktop' | 'tablet' | null
  browser: string | null
  webusb: boolean | null
  visitor_hash: string | null
  props: Record<string, string | number | boolean> | null
}

export interface AnalyticsDecision {
  record: boolean
  reason: string
  row?: AnalyticsInsertRow
}

export interface AnalyticsRequestInput {
  enabled?: boolean
  env?: {
    ANALYTICS_ENABLED?: string | null
    VERCEL_ENV?: string | null
    NODE_ENV?: string | null
  }
  body: unknown
  ip: string
  userAgent: string
  dnt?: string | null
  gpc?: string | null
  purpose?: string | null
  secPurpose?: string | null
  countryHeader?: string | null
  referrer?: string | null
  requestHost?: string | null
  analyticsSalt?: string
  serviceRoleKey?: string
  now?: Date
  rateLimiter?: AnalyticsRateLimiter | null
}

function utcDay(now: Date): string {
  return now.toISOString().slice(0, 10)
}

export function decideAnalyticsRequest(input: AnalyticsRequestInput): AnalyticsDecision {
  const enabled = input.enabled ?? (input.env ? isAnalyticsEnabled(input.env) : false)
  if (!enabled) return { record: false, reason: 'disabled' }
  if (hasDoNotTrack(input.dnt, input.gpc)) return { record: false, reason: 'dnt' }
  if (isPrefetchRequest(input.purpose, input.secPurpose)) return { record: false, reason: 'prefetch' }
  if (isBotUserAgent(input.userAgent)) return { record: false, reason: 'bot' }
  if (hasMockQuestFlag(input.referrer)) return { record: false, reason: 'mock' }

  const event = normalizeAnalyticsBody(input.body)
  if (!event) return { record: false, reason: 'invalid' }

  const now = input.now ?? new Date()
  const visitorHash = analyticsVisitorHash({
    analyticsSalt: input.analyticsSalt || '',
    serviceRoleKey: input.serviceRoleKey || '',
    ip: input.ip || 'unknown',
    userAgent: input.userAgent,
    day: utcDay(now)
  })

  if (input.rateLimiter && !input.rateLimiter.allow(visitorHash, now.getTime())) {
    return { record: false, reason: 'rate_limited' }
  }

  return {
    record: true,
    reason: 'ok',
    row: toInsertRow(event, {
      visitorHash,
      userAgent: input.userAgent,
      countryHeader: input.countryHeader,
      referrer: input.referrer,
      requestHost: input.requestHost
    })
  }
}

function toInsertRow(
  event: NormalizedAnalyticsEvent,
  server: {
    visitorHash: string
    userAgent: string
    countryHeader?: string | null
    referrer?: string | null
    requestHost?: string | null
  }
): AnalyticsInsertRow {
  return {
    event: event.event,
    path: event.path,
    port_slug: event.portSlug,
    headset: event.headset,
    referrer_host: referrerHost(server.referrer, server.requestHost),
    country: countryFromHeader(server.countryHeader),
    device: deviceFromUserAgent(server.userAgent),
    browser: browserFamilyFromUserAgent(server.userAgent),
    webusb: event.webusb,
    visitor_hash: server.visitorHash,
    props: event.props
  }
}
