/** Headset verification: version matching, badge staleness, and display labels. */

import { formatPortVersion, normalizeVersionKey } from '~/lib/portVersion'

export { normalizeVersionKey }

export const HEADSET_MODELS = ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'] as const

export type HeadsetModel = (typeof HEADSET_MODELS)[number]

export type VerificationSource = 'manual' | 'install'

export type VerificationResult = 'works' | 'works_with_issues' | 'doesnt_work'

export type ModerationStatus = 'pending' | 'approved' | 'rejected'

export type BadgeState = 'current' | 'stale' | 'none'

export const PORT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export interface VerificationChecks {
  apk_installed?: boolean
  game_files_detected?: boolean
  storage_path_confirmed?: boolean
}

export interface PortVerification {
  id: string
  port_id?: string | null
  port_slug: string
  tested_version: string
  headset_model: string
  checked_at: string
  source: VerificationSource
  checks: VerificationChecks
  result: VerificationResult
  notes?: string | null
  moderation_status: ModerationStatus
}

export interface VerificationBadge {
  state: Exclude<BadgeState, 'none'>
  text: string
  detail: string
}

const DAY_MS = 24 * 60 * 60 * 1000

export function versionsMatch(left: string | null | undefined, right: string | null | undefined): boolean {
  const a = normalizeVersionKey(left)
  const b = normalizeVersionKey(right)
  if (!a || !b) return false
  return a === b
}

export function isPositiveResult(result: VerificationResult | null | undefined): boolean {
  return result === 'works' || result === 'works_with_issues'
}

/**
 * The badge follows the catalog's latest_version. A newer sync makes a previous
 * check stale without editing the verification row.
 */
export function verificationBadgeState(
  latest: { tested_version: string; result: VerificationResult } | null | undefined,
  catalogVersion: string | null | undefined
): BadgeState {
  if (!latest || !isPositiveResult(latest.result)) return 'none'
  if (!formatPortVersion(catalogVersion)) return 'none'
  return versionsMatch(latest.tested_version, catalogVersion) ? 'current' : 'stale'
}

export function canonicalHeadset(raw: string | null | undefined): HeadsetModel | null {
  if (!raw) return null
  const spaced = raw.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  const compact = spaced.replace(/\s+/g, '')
  if (spaced.includes('3s') || compact.includes('quest3s') || spaced.includes('panther')) return 'Quest 3S'
  if (spaced.includes('pro') || spaced.includes('seacliff') || spaced.includes('cambria')) return 'Quest Pro'
  if (spaced.includes('quest 3') || compact.includes('quest3') || spaced.includes('eureka')) return 'Quest 3'
  if (spaced.includes('quest 2') || compact.includes('quest2') || spaced.includes('hollywood')) return 'Quest 2'
  return null
}

export function isMockDeviceSerial(serial: string | null | undefined): boolean {
  if (!serial) return false
  const value = serial.trim().toLowerCase()
  return value.startsWith('mock') || value.includes('mock-quest')
}

/** Same display string as catalog cards, the detail page, and the table. */
export function formatVerificationVersion(raw: string | null | undefined): string {
  return formatPortVersion(raw)
}

export function formatVerificationAge(iso: string, now = Date.now()): string {
  const then = Date.parse(iso)
  if (!Number.isFinite(then)) return 'unknown date'
  const diffDays = Math.floor((now - then) / DAY_MS)
  if (diffDays <= 0) return 'today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 30) return `${diffDays} days ago`
  const months = Math.floor(diffDays / 30)
  if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`
  const years = Math.floor(diffDays / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

export function sourceLabel(source: VerificationSource): string {
  return source === 'manual' ? 'Felipe' : 'One-click install'
}

export function resultLabel(result: VerificationResult): string {
  switch (result) {
    case 'works': return 'Works'
    case 'works_with_issues': return 'Works with issues'
    case 'doesnt_work': return "Doesn't work"
  }
}

export function describeChecks(checks: VerificationChecks | null | undefined): string[] {
  if (!checks) return []
  const lines: string[] = []
  if (checks.apk_installed === true) lines.push('APK installed')
  else if (checks.apk_installed === false) lines.push('APK not installed')
  if (checks.game_files_detected === true) lines.push('Game files detected in the expected folder')
  else if (checks.game_files_detected === false) lines.push('Game files not detected')
  if (checks.storage_path_confirmed === true) lines.push('Storage path confirmed')
  else if (checks.storage_path_confirmed === false) lines.push('Storage path not confirmed')
  return lines
}

export function latestVerification(
  records: PortVerification[] | null | undefined,
  slug: string
): PortVerification | null {
  if (!records?.length || !slug) return null
  let latest: PortVerification | null = null
  let latestAt = Number.NEGATIVE_INFINITY
  for (const record of records) {
    if (record.port_slug !== slug || record.moderation_status !== 'approved') continue
    const at = Date.parse(record.checked_at)
    if (!Number.isFinite(at) || at < latestAt) continue
    latest = record
    latestAt = at
  }
  return latest
}

export function latestVerificationForHeadset(
  records: PortVerification[] | null | undefined,
  slug: string,
  headset: string
): PortVerification | null {
  if (!records?.length) return null
  const want = canonicalHeadset(headset) ?? headset
  let latest: PortVerification | null = null
  let latestAt = Number.NEGATIVE_INFINITY
  for (const record of records) {
    if (record.port_slug !== slug || record.moderation_status !== 'approved') continue
    const model = canonicalHeadset(record.headset_model) ?? record.headset_model
    if (model !== want) continue
    const at = Date.parse(record.checked_at)
    if (!Number.isFinite(at) || at < latestAt) continue
    latest = record
    latestAt = at
  }
  return latest
}

export interface HeadsetVerificationRow {
  headset: string
  record: PortVerification | null
}

export function headsetVerificationRows(
  records: PortVerification[] | null | undefined,
  slug: string
): HeadsetVerificationRow[] {
  const rows: HeadsetVerificationRow[] = HEADSET_MODELS.map(headset => ({
    headset,
    record: latestVerificationForHeadset(records, slug, headset)
  }))
  const known = new Set<string>(HEADSET_MODELS)
  const extras = new Set<string>()
  for (const record of records ?? []) {
    if (record.port_slug !== slug || record.moderation_status !== 'approved') continue
    const model = canonicalHeadset(record.headset_model) ?? record.headset_model
    if (!known.has(model)) extras.add(model)
  }
  for (const headset of extras) {
    rows.push({
      headset,
      record: latestVerificationForHeadset(records, slug, headset)
    })
  }
  return rows
}

export type VerificationSummaryTone = 'verified' | 'issues' | 'stale' | 'failed' | 'untested'

export interface VerificationSummaryLine {
  text: string
  tone: VerificationSummaryTone
}

function headsetLabel(raw: string): string {
  return canonicalHeadset(raw) ?? raw
}

function connectedStatusPhrase(result: VerificationResult): string {
  switch (result) {
    case 'works': return 'works'
    case 'works_with_issues': return 'works with issues'
    case 'doesnt_work': return "doesn't work"
  }
}

/**
 * One line for the detail page. A connected, recognized headset replaces the
 * newest check with that headset's own status.
 */
export function verificationSummaryLine(
  records: PortVerification[] | null | undefined,
  slug: string,
  catalogVersion: string | null | undefined,
  connectedHeadset?: string | null,
  now = Date.now()
): VerificationSummaryLine {
  const connected = canonicalHeadset(connectedHeadset)
  if (connected) {
    const record = latestVerificationForHeadset(records, slug, connected)
    if (!record) return { text: `${connected}: not tested`, tone: 'untested' }
    const state = verificationBadgeState(record, catalogVersion)
    if (state === 'stale') {
      return {
        text: `${connected}: verified on ${formatVerificationVersion(record.tested_version)} · update not tested`,
        tone: 'stale'
      }
    }
    if (record.result === 'doesnt_work') {
      return { text: `${connected}: doesn't work`, tone: 'failed' }
    }
    if (record.result === 'works_with_issues') {
      return { text: `${connected}: works with issues`, tone: 'issues' }
    }
    return { text: `${connected}: works`, tone: 'verified' }
  }

  const latest = latestVerification(records, slug)
  if (!latest) return { text: 'Not tested', tone: 'untested' }
  const version = formatVerificationVersion(latest.tested_version)
  const headset = headsetLabel(latest.headset_model)
  const age = formatVerificationAge(latest.checked_at, now)
  const state = verificationBadgeState(latest, catalogVersion)
  if (state === 'current' && latest.result === 'works') {
    return {
      text: `✅ Verified on ${version} · ${headset} · ${age}`,
      tone: 'verified'
    }
  }
  if (state === 'current' && latest.result === 'works_with_issues') {
    return {
      text: `Verified with issues on ${version} · ${headset} · ${age}`,
      tone: 'issues'
    }
  }
  if (state === 'stale') {
    return {
      text: `Verified on ${version} · update not tested`,
      tone: 'stale'
    }
  }
  return {
    text: `${connectedStatusPhrase(latest.result)} · ${headset} · ${version} · ${age}`,
    tone: latest.result === 'doesnt_work' ? 'failed' : 'untested'
  }
}

export function buildVerificationBadge(
  latest: PortVerification | null | undefined,
  catalogVersion: string | null | undefined,
  now = Date.now()
): VerificationBadge | null {
  const state = verificationBadgeState(latest, catalogVersion)
  if (!latest || state === 'none') return null
  const headset = canonicalHeadset(latest.headset_model) ?? latest.headset_model
  const age = formatVerificationAge(latest.checked_at, now)
  const version = formatVerificationVersion(latest.tested_version)
  const who = sourceLabel(latest.source)
  if (state === 'current') {
    const prefix = latest.result === 'works_with_issues' ? 'Verified with issues' : 'Verified'
    return {
      state,
      text: `${prefix} · ${headset} · ${age}`,
      detail: `${prefix} on ${headset} ${age}. Tested ${version}. Source: ${who}.`
    }
  }
  return {
    state: 'stale',
    text: `Verified on ${version} · update not tested`,
    detail: `Last positive check was ${version} on ${headset} (${age}, ${who}). The current catalog version has not been tested.`
  }
}
