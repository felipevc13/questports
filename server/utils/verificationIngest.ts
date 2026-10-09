import { createHash, timingSafeEqual } from 'node:crypto'
import { PORT_PACKAGE_CONFIGS, portRequiresExternalFiles } from '~/data/portPackageMap'
import {
  PORT_SLUG_PATTERN,
  canonicalHeadset,
  isMockDeviceSerial,
  versionsMatch,
  type HeadsetModel,
  type VerificationChecks,
  type VerificationResult
} from '~/lib/verification'

export const INSTALL_REPORTS_PER_HOUR = 8
export const INSTALL_DEDUPE_WINDOW_MS = 12 * 60 * 60 * 1000

export interface CatalogVersionRow {
  id: string
  slug: string
  latest_version: string | null
}

export interface ParsedInstallReport {
  slug: string
  testedVersion: string
  headset: HeadsetModel
  deviceSerial: string
  checks: VerificationChecks
  result: VerificationResult
}

export interface ParsedManualVerification {
  slug: string
  testedVersion: string
  headset: HeadsetModel
  checks: VerificationChecks
  result: VerificationResult
  notes: string | null
  checkedAt: string | null
}

export interface IngestFailure {
  ok: false
  status: number
  error: string
}

export function portRequiresGameFiles(slug: string): boolean {
  return portRequiresExternalFiles(PORT_PACKAGE_CONFIGS[slug])
}

export function fingerprintValue(value: string, salt: string): string {
  return createHash('sha256').update(`${salt}\n${value}`).digest('hex')
}

export function adminSecretMatches(provided: string | undefined | null, expected: string | undefined | null): boolean {
  if (!provided || !expected) return false
  const left = Buffer.from(provided)
  const right = Buffer.from(expected)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function installRateLimited(reportsInWindow: number, limit = INSTALL_REPORTS_PER_HOUR): boolean {
  return reportsInWindow >= limit
}

export function findDuplicateInstall(
  rows: Array<{ id: string; tested_version: string; headset_model: string; checked_at: string }>,
  testedVersion: string,
  headset: string,
  now = Date.now(),
  windowMs = INSTALL_DEDUPE_WINDOW_MS
): string | null {
  for (const row of rows) {
    const at = Date.parse(row.checked_at)
    if (!Number.isFinite(at) || now - at > windowMs) continue
    if ((canonicalHeadset(row.headset_model) ?? row.headset_model) !== headset) continue
    if (!versionsMatch(row.tested_version, testedVersion)) continue
    return row.id
  }
  return null
}

export function sanitizeChecks(input: unknown): VerificationChecks | null {
  if (input == null) return {}
  if (typeof input !== 'object' || Array.isArray(input)) return null
  const source = input as Record<string, unknown>
  const checks: VerificationChecks = {}
  for (const key of ['apk_installed', 'game_files_detected', 'storage_path_confirmed', 'data_copied_by_site'] as const) {
    if (source[key] === undefined) continue
    if (typeof source[key] !== 'boolean') return null
    checks[key] = source[key]
  }
  return checks
}

/** Copy the older file flag onto the neutral attribute when the client did not send it. */
export function annotateInstallChecks(checks: VerificationChecks): VerificationChecks {
  const next: VerificationChecks = { ...checks }
  if (typeof next.data_copied_by_site !== 'boolean' && typeof next.game_files_detected === 'boolean') {
    next.data_copied_by_site = next.game_files_detected
  }
  return next
}

/**
 * An automatic install is works whenever the APK installed.
 * Missing game files are recorded on the checks, not as issues.
 */
export function deriveInstallResult(checks: VerificationChecks): VerificationResult | null {
  if (checks.apk_installed !== true) return null
  return 'works'
}

function fail(status: number, error: string): IngestFailure {
  return { ok: false, status, error }
}

function asRecord(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  return body as Record<string, unknown>
}

/** Reject mock/simulated headsets before any catalog lookup. */
export function simulatedReportReason(body: unknown): string | null {
  const record = asRecord(body)
  if (!record) return null
  if (record.mock === true) return 'Simulated headsets are not recorded'
  const serial = typeof record.deviceSerial === 'string' ? record.deviceSerial : ''
  if (isMockDeviceSerial(serial)) return 'Simulated headsets are not recorded'
  return null
}

export function parseInstallReport(
  body: unknown,
  catalog: CatalogVersionRow | null
): { ok: true; report: ParsedInstallReport } | IngestFailure {
  const simulated = simulatedReportReason(body)
  if (simulated) return fail(400, simulated)

  const record = asRecord(body)
  if (!record) return fail(400, 'Invalid report')

  const slug = typeof record.slug === 'string' ? record.slug.trim() : ''
  if (!PORT_SLUG_PATTERN.test(slug) || !catalog || catalog.slug !== slug) {
    return fail(400, 'Unknown port')
  }

  const testedVersion = typeof record.testedVersion === 'string' ? record.testedVersion.trim() : ''
  if (!testedVersion || testedVersion.length > 80) return fail(400, 'Invalid version')
  if (!versionsMatch(testedVersion, catalog.latest_version)) {
    return fail(400, 'Version does not match the catalog')
  }

  const headset = canonicalHeadset(typeof record.headsetModel === 'string' ? record.headsetModel : '')
  if (!headset) return fail(400, 'Unknown headset')

  const deviceSerial = typeof record.deviceSerial === 'string' ? record.deviceSerial.trim() : ''
  if (deviceSerial.length > 128) return fail(400, 'Invalid device')

  const checks = sanitizeChecks(record.checks)
  if (!checks) return fail(400, 'Invalid checks')
  const annotated = annotateInstallChecks(checks)
  const result = deriveInstallResult(annotated)
  if (!result) return fail(400, 'Install did not succeed')

  return {
    ok: true,
    report: { slug, testedVersion, headset, deviceSerial, checks: annotated, result }
  }
}

const RESULTS = new Set(['works', 'works_with_issues', 'doesnt_work'])

export function parseManualVerification(
  body: unknown,
  catalog: CatalogVersionRow | null,
  now = Date.now()
): { ok: true; report: ParsedManualVerification } | IngestFailure {
  const record = asRecord(body)
  if (!record) return fail(400, 'Invalid report')

  const slug = typeof record.slug === 'string' ? record.slug.trim() : ''
  if (!PORT_SLUG_PATTERN.test(slug) || !catalog || catalog.slug !== slug) {
    return fail(400, 'Unknown port')
  }

  const testedVersion = typeof record.testedVersion === 'string' ? record.testedVersion.trim() : ''
  if (!testedVersion || testedVersion.length > 80) return fail(400, 'Invalid version')

  const headset = canonicalHeadset(typeof record.headsetModel === 'string' ? record.headsetModel : '')
  if (!headset) return fail(400, 'Unknown headset')

  const result = typeof record.result === 'string' ? record.result : ''
  if (!RESULTS.has(result)) return fail(400, 'Invalid result')

  const checks = sanitizeChecks(record.checks)
  if (!checks) return fail(400, 'Invalid checks')

  let notes: string | null = null
  if (record.notes != null && record.notes !== '') {
    if (typeof record.notes !== 'string') return fail(400, 'Invalid notes')
    notes = record.notes.trim()
    if (notes.length > 2000) return fail(400, 'Notes are too long')
    if (!notes) notes = null
  }

  let checkedAt: string | null = null
  if (record.checkedAt != null && record.checkedAt !== '') {
    if (typeof record.checkedAt !== 'string') return fail(400, 'Invalid date')
    const parsed = Date.parse(record.checkedAt)
    if (!Number.isFinite(parsed)) return fail(400, 'Invalid date')
    if (parsed > now + 5 * 60 * 1000) return fail(400, 'Invalid date')
    if (parsed < Date.parse('2020-01-01T00:00:00Z')) return fail(400, 'Invalid date')
    checkedAt = new Date(parsed).toISOString()
  }

  return {
    ok: true,
    report: {
      slug,
      testedVersion,
      headset,
      checks,
      result: result as VerificationResult,
      notes,
      checkedAt
    }
  }
}
