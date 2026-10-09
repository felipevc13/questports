import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildInstallVerificationBody } from '../app/lib/installVerification'
import {
  buildCardVerificationLabel,
  buildVerificationBadge,
  canonicalHeadset,
  describeChecks,
  formatInstallCount,
  installFilesNote,
  installedByPeopleLine,
  verificationSummaryLine,
  formatVerificationVersion,
  isMockDeviceSerial,
  latestVerification,
  normalizeVersionKey,
  verificationBadgeState,
  verificationStatusLabel,
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

  it('does not add a second v, and does not prefix build names', () => {
    expect(formatVerificationVersion('v1.0.16')).toBe('v1.0.16')
    expect(formatVerificationVersion('vv1.0.16')).toBe('v1.0.16')
    expect(formatVerificationVersion('1.0.16')).toBe('v1.0.16')
    expect(formatVerificationVersion('b004')).toBe('b004')
    expect(formatVerificationVersion('cats27')).toBe('cats27')
    expect(formatVerificationVersion('Latest')).toBe('')
    expect(formatVerificationVersion('0.1.0-alpha')).toBe('v0.1.0-alpha')
  })

  it('does not treat a placeholder catalog version as something to go stale against', () => {
    expect(verificationBadgeState(check(), 'Latest')).toBe('none')
    expect(verificationBadgeState(check({ tested_version: 'b004' }), 'b004')).toBe('current')
    expect(buildVerificationBadge(check({ tested_version: 'b004' }), 'b004', NOW)?.text)
      .toBe('Verified · Quest 3 · 5 days ago')
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

describe('install count formatting', () => {
  it('pluralizes and compacts the count', () => {
    expect(formatInstallCount(0)).toBeNull()
    expect(formatInstallCount(1)).toBe('1 install')
    expect(formatInstallCount(12)).toBe('12 installs')
    expect(formatInstallCount(999)).toBe('999 installs')
    expect(formatInstallCount(1000)).toBe('1k installs')
    expect(formatInstallCount(1200)).toBe('1.2k installs')
    expect(formatInstallCount(1200.9)).toBe('1.2k installs')
    expect(installedByPeopleLine(0)).toBeNull()
    expect(installedByPeopleLine(1)).toBe('Installed by 1 person through QuestPorts')
    expect(installedByPeopleLine(12)).toBe('Installed by 12 people through QuestPorts')
    expect(installedByPeopleLine(1200)).toBe('Installed by 1.2k people through QuestPorts')
  })
})

describe('card verification label', () => {
  const label = (
    records: PortVerification[] | null | undefined,
    version = 'v1.0.16',
    slug = 'halocequest',
    installCount = 0
  ) => buildCardVerificationLabel(records, slug, version, NOW, installCount)

  it('maps a manual works check to a short verified line', () => {
    const row = label([check()])
    expect(row).toMatchObject({ tone: 'verified', text: '✓ Verified' })
    expect(row?.text).not.toMatch(/Quest|ago|today/)
    expect(row?.detail).toContain('Quest 3')
    expect(row?.detail).toContain('v1.0.16')
  })

  it('maps only-automatic installs to a usage count, including a legacy issues result', () => {
    const legacy = check({
      id: 'sega',
      port_slug: 'sega-rally-vr',
      source: 'install',
      result: 'works_with_issues',
      headset_model: 'Quest 2',
      tested_version: 'v0.2.3',
      checks: { apk_installed: true, game_files_detected: false, storage_path_confirmed: false }
    })
    const copiedElsewhere = label([legacy], 'v0.2.3', 'sega-rally-vr', 12)
    expect(copiedElsewhere).toMatchObject({ tone: 'installs', text: '↓ 12 installs', lead: '↓ 12 installs', suffix: '' })
    expect(copiedElsewhere?.text).not.toMatch(/Quest|issue|Verified|Installed/)
    expect(copiedElsewhere?.detail).toContain('Quest 2')
    expect(copiedElsewhere?.detail).toContain('Game files not sent through the site')

    const apkOnly = check({
      source: 'install',
      result: 'works',
      headset_model: 'Quest 2',
      checks: { apk_installed: true }
    })
    const one = label([apkOnly], 'v1.0.16', 'halocequest', 1)
    expect(one).toMatchObject({ tone: 'installs', text: '↓ 1 install' })
    expect(one?.detail).not.toContain('Game files not sent through the site')
    expect(label([apkOnly], 'v1.0.16', 'halocequest', 1200)?.text).toBe('↓ 1.2k installs')
    expect(label([apkOnly])).toBeNull()
  })

  it('lets the latest manual check own issues, and ignores installs for that label', () => {
    const issues = check({
      id: 'manual-issues',
      source: 'manual',
      result: 'works_with_issues',
      headset_model: 'Quest 2',
      checked_at: '2026-10-07T12:00:00.000Z'
    })
    const newerInstall = check({
      id: 'newer-install',
      source: 'install',
      result: 'works_with_issues',
      headset_model: 'Quest 3',
      checked_at: '2026-10-08T12:00:00.000Z',
      checks: { apk_installed: true, game_files_detected: false }
    })
    const row = label([newerInstall, issues], 'v1.0.16', 'halocequest', 12)
    expect(row).toMatchObject({ tone: 'issues', text: '⚠ Issues', suffix: '' })
    expect(row?.text).not.toMatch(/Quest|install/i)
    expect(row?.detail).toContain('Quest 2')
    expect(row?.detail).not.toContain('Game files not sent through the site')
  })

  it('keeps verified when a manual works check exists beside an install', () => {
    const manual = check({ id: 'manual', source: 'manual', result: 'works', headset_model: 'Quest 3' })
    const install = check({
      id: 'install',
      source: 'install',
      result: 'works',
      headset_model: 'Quest 2',
      checked_at: '2026-10-08T00:00:00.000Z'
    })
    expect(label([install, manual])).toMatchObject({ tone: 'verified', text: '✓ Verified', suffix: '' })
    const withCount = label([install, manual], 'v1.0.16', 'halocequest', 12)
    expect(withCount).toMatchObject({
      tone: 'verified',
      lead: '✓ Verified',
      suffix: ' · 12 installs',
      text: '✓ Verified · 12 installs'
    })
    expect(withCount?.text.startsWith('✓ Verified')).toBe(true)
    expect(label([install, manual], 'v1.0.16', 'halocequest', 1)?.text).toBe('✓ Verified · 1 install')
  })

  it('shows nothing when untested, broken, or only checked on an older version', () => {
    expect(label(null)).toBeNull()
    expect(label([])).toBeNull()
    expect(label([check({ result: 'doesnt_work' })])).toBeNull()
    expect(label([check({ result: 'doesnt_work' })], 'v1.0.16', 'halocequest', 4)).toBeNull()
    expect(label([check()])).not.toBeNull()
    expect(label([check()], 'v1.0.17')).toBeNull()
    expect(label([check()], 'v1.0.17', 'halocequest', 4)?.text).toBe('↓ 4 installs')
    expect(label(null, 'v1.0.16', 'halocequest', 4)?.text).toBe('↓ 4 installs')
  })

  it('keeps the card label on one 13px line and leaves the headset in the title', () => {
    const source = readFileSync(new URL('../app/components/VerificationBadge.vue', import.meta.url), 'utf8')
    expect(source).toContain('whitespace-nowrap')
    expect(source).toContain('text-[13px]')
    expect(source).toContain('font-sans')
    expect(source).toContain(':title="cardLabel.detail"')
    const inline = source.split('v-else-if')[0]
    expect(inline).not.toContain('border')
    const legacy = check({
      source: 'install',
      result: 'works_with_issues',
      checks: { apk_installed: true, game_files_detected: false }
    })
    expect(buildVerificationBadge(legacy, 'v1.0.16', NOW)).toBeNull()
    expect(label([legacy], 'v1.0.16', 'halocequest', 12)?.text).toBe('↓ 12 installs')
    const sourceBadge = readFileSync(new URL('../app/components/VerificationBadge.vue', import.meta.url), 'utf8')
    expect(sourceBadge).toContain("case 'installs': return 'font-medium text-muted-foreground'")
    expect(sourceBadge).toContain('text-muted-foreground')
    expect(sourceBadge).not.toContain('✓ Installed')
  })
})

describe('detail verification summary', () => {
  const quest3 = check({ id: 'q3', headset_model: 'Quest 3', checked_at: '2026-10-03T12:00:00.000Z' })
  const quest2 = check({
    id: 'q2',
    headset_model: 'Quest 2',
    checked_at: '2026-09-20T12:00:00.000Z',
    tested_version: 'v1.0.16',
    result: 'works'
  })

  it('summarizes the newest positive check when no headset is connected', () => {
    expect(verificationSummaryLine([quest2, quest3], 'halocequest', 'v1.0.16', null, NOW)).toEqual({
      text: '✅ Verified on v1.0.16 · Quest 3 · 5 days ago',
      tone: 'verified'
    })
  })

  it('uses the stale and not-tested lines without calling the current version verified', () => {
    expect(verificationSummaryLine([quest3], 'halocequest', 'v1.0.17', null, NOW).text)
      .toBe('Verified on v1.0.16 · update not tested')
    expect(verificationSummaryLine([], 'halocequest', 'v1.0.16', null, NOW)).toEqual({
      text: 'Not tested',
      tone: 'untested'
    })
  })

  it('prefers the connected headset over the most recently tested one', () => {
    expect(verificationSummaryLine([quest3, quest2], 'halocequest', 'v1.0.16', 'Quest 2', NOW).text)
      .toBe('Quest 2: works')
    expect(verificationSummaryLine([quest3, quest2], 'halocequest', 'v1.0.16', 'Meta Quest 3S', NOW).text)
      .toBe('Quest 3S: not tested')
  })

  it('keeps a connected headset honest when its check is for an older version', () => {
    const staleQuest2 = check({
      headset_model: 'Quest 2',
      tested_version: 'v1.4.0',
      result: 'works',
      port_slug: 'rtcwquest'
    })
    expect(verificationSummaryLine([staleQuest2], 'rtcwquest', 'v1.4.1', 'Quest 2', NOW).text)
      .toBe('Quest 2: verified on v1.4.0 · update not tested')
    expect(verificationSummaryLine([
      check({ headset_model: 'Quest 2', result: 'doesnt_work' })
    ], 'halocequest', 'v1.0.16', 'hollywood', NOW).text).toBe("Quest 2: doesn't work")
  })

  it('falls back to the newest check when the connected model is not recognized', () => {
    expect(verificationSummaryLine([quest3], 'halocequest', '1.0.16', 'Meta Quest Connected', NOW).text)
      .toBe('✅ Verified on v1.0.16 · Quest 3 · 5 days ago')
  })

  it('describes an automatic install without calling missing game files a problem', () => {
    const install = check({
      id: 'sega',
      port_slug: 'sega-rally-vr',
      source: 'install',
      result: 'works_with_issues',
      headset_model: 'Quest 2',
      tested_version: 'v0.2.3',
      checked_at: '2026-10-09T10:18:17.584Z',
      checks: { apk_installed: true, game_files_detected: false, storage_path_confirmed: false }
    })
    expect(verificationSummaryLine([install], 'sega-rally-vr', 'v0.2.3', null, NOW)).toEqual({
      text: 'Install via QuestPorts on v0.2.3 · Quest 2 · today · Game files not sent through the site',
      tone: 'installed'
    })
    expect(verificationSummaryLine([install], 'sega-rally-vr', 'v0.2.3', 'Quest 2', NOW).text)
      .toBe('Quest 2: install via QuestPorts · Game files not sent through the site')
    expect(verificationStatusLabel(install)).toBe('Installed via QuestPorts')
    expect(installFilesNote(install)).toBe('Game files not sent through the site')
    expect(describeChecks(install.checks, 'install')).toContain('Game files not sent through the site')
    expect(describeChecks(install.checks, 'install').join(' ')).not.toMatch(/not detected/i)
  })

  it('keeps a manual issues check distinct from an install', () => {
    const manual = check({
      source: 'manual',
      result: 'works_with_issues',
      headset_model: 'Quest Pro',
      notes: 'Comfort vignette.'
    })
    expect(verificationSummaryLine([manual], 'halocequest', 'v1.0.16', null, NOW).text)
      .toBe('Known issues on v1.0.16 · Quest Pro · 5 days ago')
    expect(verificationSummaryLine([manual], 'halocequest', 'v1.0.16', 'Quest Pro', NOW).text)
      .toBe('Quest Pro: known issues')
    expect(verificationStatusLabel(manual)).toBe('Works with issues')
    expect(installFilesNote(manual)).toBeNull()
  })

  it('keeps headset details behind a collapsed accessible toggle', () => {
    const source = readFileSync(new URL('../app/components/VerificationPanel.vue', import.meta.url), 'utf8')
    expect(source).toContain(':aria-expanded="expanded"')
    expect(source).toContain('aria-controls="port-verification-details"')
    expect(source).toContain('const expanded = ref(false)')
    expect(source).toContain('See details')
    expect(source).toContain('Hide details')
    expect(source).toContain('installedByPeopleLine')
    expect(source).toContain('peopleLine')
  })
})

describe('port install count migration', () => {
  it('aggregates approved installs without granting the fingerprint column', () => {
    const dir = new URL('../supabase/migrations/', import.meta.url)
    const name = readdirSync(dir).find(file => file.endsWith('_port_install_counts.sql'))
    expect(name).toBeTruthy()
    const sql = readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8')
    expect(sql).toContain('with (security_invoker = true)')
    expect(sql).toContain('security definer')
    expect(sql).toContain('private.port_install_count_rows')
    expect(sql).toContain('count(distinct v.device_fingerprint)')
    expect(sql).toContain('count(*) filter (where v.device_fingerprint is null)')
    expect(sql).toContain("v.source = 'install'")
    expect(sql).toContain("v.result in ('works', 'works_with_issues')")
    expect(sql).toContain("v.moderation_status = 'approved'")
    expect(sql).toContain('grant select on table public.port_install_counts to anon, authenticated, service_role')
    expect(sql).toContain('public.ports_install_count(port public.ports)')
    expect(sql).not.toMatch(/grant select\s*\([^)]*device_fingerprint/i)
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
    const parsed = parseInstallReport(validBody, halo)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.report.headset).toBe('Quest 3')
    expect(parsed.report.testedVersion).toBe('1.0.16')
    expect(parsed.report.result).toBe('works')
  })

  it('rejects unknown slugs, mismatched versions, and failed installs', () => {
    expect(parseInstallReport({ ...validBody, slug: 'not-a-port' }, null)).toMatchObject({
      ok: false,
      status: 400,
      error: 'Unknown port'
    })
    expect(parseInstallReport(validBody, { ...halo, latest_version: 'v1.0.15' })).toMatchObject({
      ok: false,
      error: 'Version does not match the catalog'
    })
    expect(parseInstallReport({
      ...validBody,
      checks: { apk_installed: false }
    }, halo)).toMatchObject({
      ok: false,
      error: 'Install did not succeed'
    })
  })

  it('ignores a client-supplied result and records missing game files as a neutral flag', () => {
    const parsed = parseInstallReport({
      ...validBody,
      result: 'works_with_issues',
      checks: { apk_installed: true, game_files_detected: false }
    }, halo)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.report.result).toBe('works')
    expect(parsed.report.checks.data_copied_by_site).toBe(false)
    expect(deriveInstallResult({ apk_installed: true })).toBe('works')
    expect(deriveInstallResult({ apk_installed: true, game_files_detected: false })).toBe('works')
    expect(deriveInstallResult({ apk_installed: false })).toBeNull()
  })

  it('rejects mock mode and the simulated Quest serial before they count as evidence', () => {
    expect(isMockDeviceSerial('MOCK-QUEST-001')).toBe(true)
    expect(simulatedReportReason({ ...validBody, mock: true })).toMatch(/simulated/i)
    expect(simulatedReportReason({ ...validBody, deviceSerial: 'MOCK-QUEST-001' })).toMatch(/simulated/i)
    expect(parseInstallReport({ ...validBody, mock: true }, halo)).toMatchObject({
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
    expect(parseInstallReport({ ...validBody, headsetModel: 'Quest Pro' }, halo).ok).toBe(true)
    expect(parseInstallReport({ ...validBody, headsetModel: 'Gear VR' }, halo)).toMatchObject({
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
