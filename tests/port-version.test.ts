import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  comparePortVersions,
  formatPortVersion,
  isHeadsetApkOutdated,
  normalizeVersionKey,
  numericVersionParts
} from '../app/lib/portVersion'
import { formatVerificationVersion } from '../app/lib/verification'

describe('port version comparison', () => {
  it('parses catalog tags and dumpsys versionNames', () => {
    expect(numericVersionParts('v1.0.16')).toEqual([1, 0, 16])
    expect(numericVersionParts('1.0.6')).toEqual([1, 0, 6])
    expect(numericVersionParts('1.0-test14')).toEqual([1, 0, 14])
  })

  it('detects an outdated Halo CE headset vs catalog v1.0.16', () => {
    expect(isHeadsetApkOutdated('1.0.6', 'v1.0.16')).toBe(true)
    expect(isHeadsetApkOutdated('v1.0.16', 'v1.0.16')).toBe(false)
    expect(isHeadsetApkOutdated('1.0.16', 'v1.0.6')).toBe(false)
  })

  it('does not claim outdated when versions cannot be parsed', () => {
    expect(comparePortVersions('cats-nightly', 'latest')).toBe(0)
    expect(isHeadsetApkOutdated(null, 'v1.0.16')).toBe(false)
  })
})

describe('catalog version display', () => {
  it('uses exactly one v for semver and leaves build names alone', () => {
    expect(formatPortVersion('v1.0.16')).toBe('v1.0.16')
    expect(formatPortVersion('vv1.0.16')).toBe('v1.0.16')
    expect(formatPortVersion('1.0.16')).toBe('v1.0.16')
    expect(formatPortVersion('0.1.0-alpha')).toBe('v0.1.0-alpha')
    expect(formatPortVersion('1.0-test14')).toBe('v1.0-test14')
    expect(formatPortVersion('6.0.0')).toBe('v6.0.0')
    expect(formatPortVersion('b004')).toBe('b004')
    expect(formatPortVersion('b003')).toBe('b003')
    expect(formatPortVersion('cats27')).toBe('cats27')
    expect(formatPortVersion('winlatorxr_cats27')).toBe('cats27')
    expect(formatPortVersion('Beta 1.1')).toBe('Beta 1.1')
  })

  it('formats the versions currently stored in the catalog', () => {
    const stored = {
      'v1.0.16': 'v1.0.16',
      'vv1.0.16': 'v1.0.16',
      Latest: '',
      '0.1.0-alpha': 'v0.1.0-alpha',
      b003: 'b003',
      b004: 'b004',
      cats27: 'cats27',
      '1.1': 'v1.1',
      '1.0.84': 'v1.0.84',
      '6.0.0': 'v6.0.0',
      '1.6.2': 'v1.6.2',
      '0.1.28': 'v0.1.28',
      '1.2': 'v1.2',
      '1.0.0': 'v1.0.0',
      'v0.1.4.1': 'v0.1.4.1',
      '0.3.1 alpha': 'v0.3.1 alpha'
    }
    for (const [raw, display] of Object.entries(stored)) {
      expect(formatPortVersion(raw)).toBe(display)
    }
  })

  it('drops placeholders instead of showing them as versions', () => {
    expect(formatPortVersion('Latest')).toBe('')
    expect(formatPortVersion('vLatest')).toBe('')
    expect(formatPortVersion('  ')).toBe('')
    expect(formatPortVersion(null)).toBe('')
  })

  it('keeps the suffix when normalizing a comparison key', () => {
    expect(normalizeVersionKey('v0.1.0-alpha')).toBe('0.1.0-alpha')
    expect(normalizeVersionKey('0.1.0-alpha')).toBe('0.1.0-alpha')
    expect(normalizeVersionKey('winlatorxr_cats27')).toBe('cats27')
    expect(normalizeVersionKey('vv1.0.16')).toBe('1.0.16')
  })

  it('matches the verification badge formatter', () => {
    for (const raw of ['v1.0.16', '1.0.16', 'vv1.0.16', 'b004', 'cats27', 'Latest', '0.1.0-alpha', 'v1.1.7-windows']) {
      expect(formatVerificationVersion(raw)).toBe(formatPortVersion(raw))
    }
  })

  it('does not slice a long version down to an ellipsis in the formatter', () => {
    expect(formatPortVersion('0.1.0-alpha')).toBe('v0.1.0-alpha')
    expect(formatPortVersion('0.1.0-alpha').includes('…')).toBe(false)
  })

  it('is what the card, detail page, and dense table render', () => {
    const card = readFileSync(new URL('../app/components/PortCard.vue', import.meta.url), 'utf8')
    const index = readFileSync(new URL('../app/pages/index.vue', import.meta.url), 'utf8')
    const detail = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const badge = readFileSync(new URL('../app/lib/verification.ts', import.meta.url), 'utf8')
    expect(card).toContain('<PortVersion')
    expect(card).not.toContain('v{{')
    expect(index).toContain('<th class="py-2.5 px-3 text-left">Version</th>')
    expect(index).toContain('<PortVersion')
    expect(detail).toContain('<PortVersion')
    expect(detail).not.toContain('{{ port.latest_version }}')
    expect(badge).toContain('formatPortVersion')
  })
})
