import type { H3Event } from 'h3'
import { getRequestHeader, getRequestIP } from 'h3'

export function clientIp(event: H3Event): string {
  const forwarded = getRequestHeader(event, 'x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}
