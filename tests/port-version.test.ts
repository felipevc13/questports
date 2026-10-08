import { describe, expect, it } from 'vitest'
import { comparePortVersions, isHeadsetApkOutdated, numericVersionParts } from '../app/lib/portVersion'

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
