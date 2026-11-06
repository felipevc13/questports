import type { H3Event } from 'h3'
import { getRequestHeader, getRequestIP } from 'h3'

type HeaderReader = (name: string) => string | null | undefined

/**
 * The site runs as a Cloudflare Worker, so `cf-connecting-ip` is the real client address and
 * Cloudflare overwrites it on every request. `x-forwarded-for` is kept as the fallback for local
 * dev and for the old Vercel deployment.
 */
export function pickClientIp(header: HeaderReader): string | null {
  const cf = header('cf-connecting-ip')?.trim()
  if (cf) return cf
  const forwarded = header('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return null
}

/**
 * Two-letter country from the edge. `cf-ipcountry` on Cloudflare, `x-vercel-ip-country` on the old
 * Vercel deployment. Validation (XX, T1, bad shapes) stays in `countryFromHeader`.
 */
export function pickCountryHeader(header: HeaderReader): string | null {
  return header('cf-ipcountry')?.trim() || header('x-vercel-ip-country')?.trim() || null
}

export function clientIp(event: H3Event): string {
  return pickClientIp((name) => getRequestHeader(event, name))
    || getRequestIP(event, { xForwardedFor: true })
    || 'unknown'
}

export function requestCountryHeader(event: H3Event): string | null {
  return pickCountryHeader((name) => getRequestHeader(event, name))
}
