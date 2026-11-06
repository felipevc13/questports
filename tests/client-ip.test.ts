import { describe, expect, it } from 'vitest'
import { pickClientIp, pickCountryHeader } from '../server/utils/clientIp'
import { countryFromHeader } from '../app/lib/analytics'

const reader = (headers: Record<string, string>) => (name: string) => headers[name]

describe('pickClientIp', () => {
  it('prefers cf-connecting-ip over x-forwarded-for', () => {
    expect(pickClientIp(reader({
      'cf-connecting-ip': '203.0.113.7',
      'x-forwarded-for': '10.0.0.1, 10.0.0.2'
    }))).toBe('203.0.113.7')
  })

  it('falls back to the first x-forwarded-for entry', () => {
    expect(pickClientIp(reader({ 'x-forwarded-for': '198.51.100.4, 10.0.0.2' }))).toBe('198.51.100.4')
  })

  it('returns null when neither header is present', () => {
    expect(pickClientIp(reader({}))).toBeNull()
    expect(pickClientIp(reader({ 'cf-connecting-ip': '  ' }))).toBeNull()
  })
})

describe('pickCountryHeader', () => {
  it('reads cf-ipcountry on Cloudflare', () => {
    expect(countryFromHeader(pickCountryHeader(reader({ 'cf-ipcountry': 'br' })))).toBe('BR')
  })

  it('keeps the Vercel header as a fallback', () => {
    expect(countryFromHeader(pickCountryHeader(reader({ 'x-vercel-ip-country': 'US' })))).toBe('US')
  })

  it('drops Cloudflare placeholders', () => {
    expect(countryFromHeader(pickCountryHeader(reader({ 'cf-ipcountry': 'XX' })))).toBeNull()
    expect(countryFromHeader(pickCountryHeader(reader({ 'cf-ipcountry': 'T1' })))).toBeNull()
    expect(countryFromHeader(pickCountryHeader(reader({})))).toBeNull()
  })
})
