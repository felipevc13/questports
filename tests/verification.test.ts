import { describe, expect, it } from 'vitest'
import { buildInstallVerificationBody } from '../app/lib/installVerification'
import {
  buildVerificationBadge,
  canonicalHeadset,
  formatVerificationVersion,
  isMockDeviceSerial,
  latestVerification,
  normalizeVersionKey,
  verificationBadgeState,
  versionsMatch,
  type PortVerification
} from '../app/lib/verification'
import {
  INSTALL_REPORTS_PER_HOUR,
  deriveInstallResult,
  findDuplicateInstall,
  installRateLimited,
  parseInstallReport,
  parseManualVerification,
  portRequiresGameFiles,
  simulatedReportReason,
  type CatalogVersionRow
} from '../server/utils/verificationIngest'

const NOW = Date.parse('2026-10-08T12:00:00.000Z')

function check(overrides: Partial<PortVerification> = {}): PortVerification {
  return {
    id: 'check-1',
    port_slug: 'halocequest',
    tested_version: 'v1.0.16',
    headset_model: 'Quest 3',
    checked_at: '2026-10-03T12:00:00.000Z',
    source: 'manual',
    checks: { apk_installed: true, game_files_detected: true },
    result: 'works',
    moderation_status: 'approved',
    ...overrides
  }
}

const halo: CatalogVersionRow = { id: 'port-halo', slug: 'halocequest', latest_version: 'v1.0.16' }

describe('version normalization', () => {
  it('treats a leading v as the same version', () => {
    expect(normalizeVersionKey('v1.0.16')).toBe('1.0.16')
    expect(normalizeVersionKey('1.0.16')).toBe('1.0.16')
    expect(versionsMatch('v1.0.16', '1.0.16')).toBe(true)
    expect(versionsMatch('V1.0.16', '1.0.16')).toBe(true)
  })

  it('matches tags that are not semver without collapsing them into a number', () => {
    expect(versionsMatch('Latest', 'latest')).toBe(true)
    expect(versionsMatch('b004', 'B004')).toBe(true)
    expect(versionsMatch('b004', '4')).toBe(false)
    expect(versionsMatch('v1.0.16', 'v1.0.6')).toBe(false)
    expect(versionsMatch('1.0', '1.0.0')).toBe(false)
    expect(versionsMatch('', 'v1.0.16')).toBe(false)
  })

  it('does not add a second v when one is already present', () => {
    expect(formatVerificationVersion('v1.0.16')).toBe('v1.0.16')
    expect(formatVerificationVersion('1.0.16')).toBe('v1.0.16')
    expect(formatVerificationVersion('b004')).toBe('b004')
    expect(formatVerificationVersion('Latest')).toBe('Latest')
  })
})

describe('verification staleness', () => {
  it('stays current while the tested version still matches latest_version', () => {
    const row = check({ tested_version: '1.0.16' })
    expect(verificationBadgeState(row, 'v1.0.16')).toBe('current')
    expect(buildVerificationBadge(row, 'v1.0.16', NOW)?.text).toBe('Verified · Quest 3 · 5 days ago')
  })

  it('goes stale when the catalog version changes and the check row does not', () => {
    const row = check()
    expect(verificationBadgeState(row, 'v1.0.16')).toBe('current')
    expect(verificationBadgeState(row, 'v1.0.17')).toBe('stale')
    expect(buildVerificationBadge(row, 'v1.0.17', NOW)?.text).toBe('Verified on v1.0.16 · update not tested')
    expect(row.tested_version).toBe('v1.0.16')
  })

  it('shows nothing without a positive approved check', () => {
    expect(verificationBadgeState(null, 'v1.0.16')).toBe('none')
    expect(verificationBadgeState(check({ result: 'doesnt_work' }), 'v1.0.16')).toBe('none')
    expect(buildVerificationBadge(null, 'v1.0.16')).toBeNull()
    const hidden = check({ moderation_status: 'pending' })
    expect(latestVerification([hidden], 'halocequest')).toBeNull()
  })

  it('uses the newest approved check, not an older matching one', () => {
    const older = check({ id: 'old', checked_at: '2026-09-01T00:00:00.000Z', tested_version: 'v1.0.16' })
    const newer = check({
      id: 'new',
      checked_at: '2026-10-01T00:00:00.000Z',
      tested_version: 'v1.0.15',
      headset_model: 'Quest 2'
    })
    expect(latestVerification([older, newer], 'halocequest')?.id).toBe('new')
    expect(verificationBadgeState(latestVerification([older, newer], 'halocequest'), 'v1.0.16')).toBe('stale')
  })
})

describe('install verification endpoint validation', () => {
  const validBody = {
    slug: 'halocequest',
    testedVersion: '1.0.16',
    headsetModel: 'Meta Quest 3',
    deviceSerial: '1WMHH123',
    checks: { apk_installed: true, game_files_detected: true, storage_path_confirmed: true },
    result: 'works'
  }

  it('accepts a real headset report whose version matches the catalog', () => {
    const parsed = parseInstallReport(validBody, halo, true)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.report.headset).toBe('Quest 3')
    expect(parsed.report.testedVersion).toBe('1.0.16')
    expect(parsed.report.result).toBe('works')
  })

  it('rejects unknown slugs, mismatched versions, and failed installs', () => {
    expect(parseInstallReport({ ...validBody, slug: 'not-a-port' }, null, true)).toMatchObject({
      ok: false,
      status: 400,
      error: 'Unknown port'
    })
    expect(parseInstallReport(validBody, { ...halo, latest_version: 'v1.0.15' }, true)).toMatchObject({
      ok: false,
      error: 'Version does not match the catalog'
    })
    expect(parseInstallReport({
      ...validBody,
      checks: { apk_installed: false }
    }, halo, true)).toMatchObject({
      ok: false,
      error: 'Install did not succeed'
    })
  })

  it('ignores a client-supplied result and records missing game files as issues', () => {
    const parsed = parseInstallReport({
      ...validBody,
      result: 'works',
      checks: { apk_installed: true, game_files_detected: false }
    }, halo, true)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.report.result).toBe('works_with_issues')
    expect(deriveInstallResult({ apk_installed: true }, false)).toBe('works')
  })

  it('rejects mock mode and the simulated Quest serial before they count as evidence', () => {
    expect(isMockDeviceSerial('MOCK-QUEST-001')).toBe(true)
    expect(simulatedReportReason({ ...validBody, mock: true })).toMatch(/simulated/i)
    expect(simulatedReportReason({ ...validBody, deviceSerial: 'MOCK-QUEST-001' })).toMatch(/simulated/i)
    expect(parseInstallReport({ ...validBody, mock: true }, halo, true)).toMatchObject({
      ok: false,
      status: 400
    })
    expect(buildInstallVerificationBody({
      mockEnabled: true,
      deviceSerial: 'MOCK-QUEST-001',
      deviceModel: 'Quest 3',
      slug: 'halocequest',
      testedVersion: 'v1.0.16',
      apkInstalled: true,
      gameFilesDetected: true,
      storagePathConfirmed: true
    })).toBeNull()
  })

  it('recognizes Quest Pro and Quest 3S, and rejects an unknown headset', () => {
    expect(canonicalHeadset('Quest Pro')).toBe('Quest Pro')
    expect(canonicalHeadset('Meta Quest 3S')).toBe('Quest 3S')
    expect(parseInstallReport({ ...validBody, headsetModel: 'Quest Pro' }, halo, false).ok).toBe(true)
    expect(parseInstallReport({ ...validBody, headsetModel: 'Gear VR' }, halo, false)).toMatchObject({
      ok: false,
      error: 'Unknown headset'
    })
  })

  it('rate-limits an IP and dedupes the same device, version, and headset', () => {
    expect(installRateLimited(INSTALL_REPORTS_PER_HOUR - 1)).toBe(false)
    expect(installRateLimited(INSTALL_REPORTS_PER_HOUR)).toBe(true)
    const duplicate = findDuplicateInstall([
      {
        id: 'existing',
        tested_version: 'v1.0.16',
        headset_model: 'Quest 3',
        checked_at: '2026-10-08T06:00:00.000Z'
      }
    ], '1.0.16', 'Quest 3', NOW)
    expect(duplicate).toBe('existing')
    expect(findDuplicateInstall([
      {
        id: 'old',
        tested_version: 'v1.0.16',
        headset_model: 'Quest 3',
        checked_at: '2026-10-07T00:00:00.000Z'
      }
    ], '1.0.16', 'Quest 3', NOW)).toBeNull()
  })

  it('knows which catalog ports still need game files', () => {
    expect(portRequiresGameFiles('iron-lung-vr')).toBe(false)
    expect(portRequiresGameFiles('rtcwquest')).toBe(true)
  })
})

describe('manual verification validation', () => {
  it('lets Felipe record the version he tested, including one the catalog has moved past', () => {
    const parsed = parseManualVerification({
      slug: 'halocequest',
      testedVersion: 'v1.0.15',
      headsetModel: 'Quest Pro',
      result: 'works_with_issues',
      notes: '  Face interface.  ',
      checks: { apk_installed: true }
    }, halo, NOW)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.report.headset).toBe('Quest Pro')
    expect(parsed.report.testedVersion).toBe('v1.0.15')
    expect(parsed.report.notes).toBe('Face interface.')
  })

  it('rejects a manual check for a port that is not in the catalog', () => {
    expect(parseManualVerification({
      slug: 'missing-port',
      testedVersion: 'v1.0.0',
      headsetModel: 'Quest 2',
      result: 'works'
    }, null, NOW)).toMatchObject({ ok: false, error: 'Unknown port' })
  })
})
