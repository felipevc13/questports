import { defineEventHandler, getRequestHeader, readBody, sendNoContent } from 'h3'
import { clientIp } from '../utils/clientIp'
import { supabaseAdmin } from '../utils/supabaseAdmin'
import { analyticsRateLimiter, decideAnalyticsRequest } from '../utils/analytics'

const MAX_BODY_BYTES = 4096

/**
 * POST /api/track
 * Always 204. Invalid, opted-out, bot, and rate-limited events are dropped.
 * Inserts use the service role. The browser anon key cannot write this table.
 */
export default defineEventHandler(async (event) => {
  try {
    const contentLength = Number(getRequestHeader(event, 'content-length') || 0)
    if (!Number.isFinite(contentLength) || contentLength <= MAX_BODY_BYTES) {
      const config = useRuntimeConfig()
      const body = await readBody(event).catch(() => null)
      const decision = decideAnalyticsRequest({
        env: {
          ANALYTICS_ENABLED: process.env.ANALYTICS_ENABLED,
          VERCEL_ENV: process.env.VERCEL_ENV,
          NODE_ENV: process.env.NODE_ENV
        },
        body,
        ip: clientIp(event),
        userAgent: getRequestHeader(event, 'user-agent') || '',
        dnt: getRequestHeader(event, 'dnt'),
        gpc: getRequestHeader(event, 'sec-gpc'),
        purpose: getRequestHeader(event, 'purpose'),
        secPurpose: getRequestHeader(event, 'sec-purpose'),
        countryHeader: getRequestHeader(event, 'x-vercel-ip-country'),
        referrer: getRequestHeader(event, 'referer'),
        requestHost: getRequestHeader(event, 'x-forwarded-host') || getRequestHeader(event, 'host'),
        analyticsSalt: String(config.analyticsSalt || ''),
        serviceRoleKey: String(config.supabaseServiceRoleKey || ''),
        rateLimiter: analyticsRateLimiter
      })

      if (decision.record && decision.row) {
        const admin = supabaseAdmin()
        if (admin) {
          const { error } = await admin.from('analytics_events').insert(decision.row)
          if (error) console.error('[QuestPorts] Analytics insert failed:', error.message)
        }
      }
    }
  } catch {
    console.error('[QuestPorts] Analytics track failed')
  }
  return sendNoContent(event)
})
