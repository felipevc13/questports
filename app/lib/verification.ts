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
  /**
   * Neutral attribute on an automatic install. False means QuestPorts did not
   * copy the game files. The player may have used SideQuest or a file manager.
   */
  data_copied_by_site?: boolean
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
  tone: 'verified' | 'installed' | 'issues' | 'stale'
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

/**
 * True, false, or unknown. The neutral flag wins. Older install rows only
 * stored game_files_detected, which means the same thing for source = install.
 */
export function dataCopiedBySite(checks: VerificationChecks | null | undefined): boolean | null {
  if (!checks) return null
  if (typeof checks.data_copied_by_site === 'boolean') return checks.data_copied_by_site
  if (typeof checks.game_files_detected === 'boolean') return checks.game_files_detected
  return null
}

/** APK install recorded by the site. Missing game files do not cancel this. */
export function isAutomaticInstallSignal(record: PortVerification | null | undefined): boolean {
  if (!record || record.source !== 'install') return false
  if (record.result === 'doesnt_work') return false
  if (record.checks?.apk_installed === false) return false
  return true
}

export function installFilesNote(record: PortVerification | null | undefined): string | null {
  if (!isAutomaticInstallSignal(record)) return null
  if (dataCopiedBySite(record?.checks) === false) return 'Game files not sent through the site'
  return null
}

export function verificationStatusLabel(record: PortVerification): string {
  if (isAutomaticInstallSignal(record)) return 'Installed via QuestPorts'
  return resultLabel(record.result)
}

export function describeChecks(
  checks: VerificationChecks | null | undefined,
  source?: VerificationSource | null
): string[] {
  if (!checks) return []
  const lines: string[] = []
  if (checks.apk_installed === true) lines.push('APK installed')
  else if (checks.apk_installed === false) lines.push('APK not installed')
  if (source === 'install') {
    const copied = dataCopiedBySite(checks)
    if (copied === true) lines.push('Game files sent through the site')
    else if (copied === false) lines.push('Game files not sent through the site')
  } else if (checks.game_files_detected === true) {
    lines.push('Game files detected in the expected folder')
  } else if (checks.game_files_detected === false) {
    lines.push('Game files not detected')
  }
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

export type VerificationSummaryTone = 'verified' | 'installed' | 'issues' | 'stale' | 'failed' | 'untested'

export interface VerificationSummaryLine {
  text: string
  tone: VerificationSummaryTone
}

export type PortSignalKind = 'verified' | 'installed' | 'issues' | 'broken' | 'stale' | 'none'

export interface PortVerificationSignal {
  kind: PortSignalKind
  record: PortVerification | null
}

function headsetLabel(raw: string): string {
  return canonicalHeadset(raw) ?? raw
}

function headsetName(record: PortVerification): string {
  return canonicalHeadset(record.headset_model) ?? record.headset_model
}

function connectedStatusPhrase(result: VerificationResult): string {
  switch (result) {
    case 'works': return 'works'
    case 'works_with_issues': return 'works with issues'
    case 'doesnt_work': return "doesn't work"
  }
}

function newestRecord(records: PortVerification[]): PortVerification | null {
  let latest: PortVerification | null = null
  let latestAt = Number.NEGATIVE_INFINITY
  for (const record of records) {
    const at = Date.parse(record.checked_at)
    if (!Number.isFinite(at) || at < latestAt) continue
    latest = record
    latestAt = at
  }
  return latest
}

function approvedRecords(
  records: PortVerification[] | null | undefined,
  slug: string
): PortVerification[] {
  if (!records?.length || !slug) return []
  return records.filter(record => record.port_slug === slug && record.moderation_status === 'approved')
}

/**
 * Manual checks own Verified, Issues, and broken.
 * An automatic install is not a quality label. The card shows a usage count
 * from port_install_counts instead, including rows stored as works_with_issues
 * because game files were not copied through the site.
 * A check for an older catalog version is stale and stays off the card.
 */
export function portVerificationSignal(
  records: PortVerification[] | null | undefined,
  slug: string,
  catalogVersion: string | null | undefined
): PortVerificationSignal {
  const approved = approvedRecords(records, slug)
  if (!approved.length) return { kind: 'none', record: null }

  const versionKnown = Boolean(formatPortVersion(catalogVersion))
  const current = versionKnown
    ? approved.filter(record => versionsMatch(record.tested_version, catalogVersion))
    : []

  const latestManual = newestRecord(current.filter(record => record.source === 'manual'))
  if (latestManual?.result === 'works_with_issues') return { kind: 'issues', record: latestManual }
  if (latestManual?.result === 'works') return { kind: 'verified', record: latestManual }
  if (latestManual?.result === 'doesnt_work') return { kind: 'broken', record: latestManual }

  const latestInstall = newestRecord(current.filter(record => isAutomaticInstallSignal(record)))
  if (latestInstall) return { kind: 'installed', record: latestInstall }

  const latest = newestRecord(approved)
  if (!latest) return { kind: 'none', record: null }
  const positive = latest.source === 'manual'
    ? isPositiveResult(latest.result)
    : isAutomaticInstallSignal(latest)
  if (positive && versionKnown && !versionsMatch(latest.tested_version, catalogVersion)) {
    return { kind: 'stale', record: latest }
  }
  if (latest.result === 'doesnt_work') return { kind: 'broken', record: latest }
  return { kind: 'none', record: null }
}

function summaryForRecord(
  record: PortVerification,
  catalogVersion: string | null | undefined,
  now: number,
  connected: string | null
): VerificationSummaryLine {
  const version = formatVerificationVersion(record.tested_version)
  const headset = headsetLabel(record.headset_model)
  const age = formatVerificationAge(record.checked_at, now)
  const comparable = isAutomaticInstallSignal(record)
    ? { ...record, result: 'works' as const }
    : record
  const state = verificationBadgeState(comparable, catalogVersion)

  if (isAutomaticInstallSignal(record)) {
    if (state === 'stale') {
      return {
        text: connected
          ? `${connected}: last install through QuestPorts was ${version} · update not tested`
          : `Last install through QuestPorts was ${version} · update not tested`,
        tone: 'stale'
      }
    }
    if (state === 'current') {
      const note = installFilesNote(record)
      const noteText = note ? ` · ${note}` : ''
      return {
        text: connected
          ? `${connected}: install via QuestPorts${noteText}`
          : `Install via QuestPorts on ${version} · ${headset} · ${age}${noteText}`,
        tone: 'installed'
      }
    }
  }

  if (state === 'stale') {
    return {
      text: connected
        ? `${connected}: verified on ${version} · update not tested`
        : `Verified on ${version} · update not tested`,
      tone: 'stale'
    }
  }
  if (record.result === 'doesnt_work') {
    return connected
      ? { text: `${connected}: doesn't work`, tone: 'failed' }
      : {
        text: `${connectedStatusPhrase(record.result)} · ${headset} · ${version} · ${age}`,
        tone: 'failed'
      }
  }
  if (record.result === 'works_with_issues' && record.source !== 'install') {
    return connected
      ? { text: `${connected}: known issues`, tone: 'issues' }
      : state === 'current'
        ? { text: `Known issues on ${version} · ${headset} · ${age}`, tone: 'issues' }
        : {
          text: `${connectedStatusPhrase(record.result)} · ${headset} · ${version} · ${age}`,
          tone: 'untested'
        }
  }
  if (connected) return { text: `${connected}: works`, tone: 'verified' }
  if (state === 'current' && record.result === 'works') {
    return {
      text: `✅ Verified on ${version} · ${headset} · ${age}`,
      tone: 'verified'
    }
  }
  return {
    text: `${connectedStatusPhrase(record.result)} · ${headset} · ${version} · ${age}`,
    tone: 'untested'
  }
}

/**
 * One line for the detail page. A connected, recognized headset replaces the
 * port-level status with that headset's own check.
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
    return summaryForRecord(record, catalogVersion, now, connected)
  }

  const signal = portVerificationSignal(records, slug, catalogVersion)
  if (!signal.record || signal.kind === 'none') return { text: 'Not tested', tone: 'untested' }
  return summaryForRecord(signal.record, catalogVersion, now, null)
}

export type CardVerificationTone = 'verified' | 'installs' | 'issues'

export interface CardVerificationLabel {
  tone: CardVerificationTone
  /** Quality or usage lead. The count, when present, is suffix and stays muted. */
  lead: string
  /** Includes the separator, for example " · 12 installs". Empty when there is no count. */
  suffix: string
  text: string
  detail: string
}

export interface PortInstallCount {
  port_slug: string
  installs: number
  last_install_at: string | null
}

function cardDetail(record: PortVerification, lead: string, now: number): string {
  const version = formatVerificationVersion(record.tested_version)
  const age = formatVerificationAge(record.checked_at, now)
  const tested = version ? ` Tested ${version}, ${age}.` : ` Checked ${age}.`
  const note = installFilesNote(record)
  const noteText = note ? ` ${note}.` : ''
  return `${lead} on ${headsetName(record)}.${tested}${noteText}`
}

/** Compact number for counts: 1, 12, 1.2k. Null when there is nothing to show. */
export function formatInstallCompact(count: number): string | null {
  if (!Number.isFinite(count) || count < 1) return null
  const whole = Math.floor(count)
  if (whole < 1000) return String(whole)
  const thousands = Math.round(whole / 100) / 10
  return Number.isInteger(thousands) ? `${thousands}k` : `${thousands.toFixed(1)}k`
}

/** "1 install", "12 installs", "1.2k installs". Null for 0. */
export function formatInstallCount(count: number): string | null {
  const compact = formatInstallCompact(count)
  if (!compact) return null
  return `${compact} ${Math.floor(count) === 1 ? 'install' : 'installs'}`
}

/** Detail-page sentence. "1 person", otherwise "people", including 1.2k. */
export function installedByPeopleLine(count: number): string | null {
  const compact = formatInstallCompact(count)
  if (!compact) return null
  const noun = Math.floor(count) === 1 ? 'person' : 'people'
  return `Installed by ${compact} ${noun} through QuestPorts`
}

function newestAutomaticInstall(
  records: PortVerification[] | null | undefined,
  slug: string
): PortVerification | null {
  return newestRecord(approvedRecords(records, slug).filter(record => isAutomaticInstallSignal(record)))
}

function cardLabelFromParts(
  tone: CardVerificationTone,
  lead: string,
  suffix: string,
  detail: string
): CardVerificationLabel {
  return { tone, lead, suffix, text: `${lead}${suffix}`, detail }
}

/**
 * One short line under the author on a catalog card.
 * Headset, version, and the game-file note stay in the title.
 * Manual issues win. Manual works may add a muted install count.
 * Installs alone are a usage count, not a quality claim.
 * Nothing when this catalog version is untested and nobody has installed it.
 */
export function buildCardVerificationLabel(
  records: PortVerification[] | null | undefined,
  slug: string,
  catalogVersion: string | null | undefined,
  now = Date.now(),
  installCount = 0
): CardVerificationLabel | null {
  const signal = portVerificationSignal(records, slug, catalogVersion)
  const countText = formatInstallCount(installCount)

  if (signal.kind === 'issues' && signal.record) {
    return cardLabelFromParts(
      'issues',
      '⚠ Issues',
      '',
      cardDetail(signal.record, 'Known issues', now)
    )
  }
  if (signal.kind === 'verified' && signal.record) {
    const suffix = countText ? ` · ${countText}` : ''
    return cardLabelFromParts(
      'verified',
      '✓ Verified',
      suffix,
      cardDetail(signal.record, 'Verified', now)
    )
  }
  if (signal.kind === 'broken') return null
  if (!countText) return null

  const record = signal.record ?? newestAutomaticInstall(records, slug)
  return cardLabelFromParts(
    'installs',
    `↓ ${countText}`,
    '',
    record
      ? cardDetail(record, 'Install via QuestPorts', now)
      : `${countText} through QuestPorts.`
  )
}

export function buildVerificationBadge(
  latest: PortVerification | null | undefined,
  catalogVersion: string | null | undefined,
  now = Date.now()
): VerificationBadge | null {
  if (!latest) return null
  const comparable = isAutomaticInstallSignal(latest)
    ? { ...latest, result: 'works' as const }
    : latest
  const state = verificationBadgeState(comparable, catalogVersion)
  if (state === 'none') return null
  const headset = headsetName(latest)
  const age = formatVerificationAge(latest.checked_at, now)
  const version = formatVerificationVersion(latest.tested_version)
  const who = sourceLabel(latest.source)
  if (isAutomaticInstallSignal(latest)) return null
  if (state === 'current' && latest.result === 'works_with_issues') {
    return {
      state,
      tone: 'issues',
      text: `Known issues · ${headset} · ${age}`,
      detail: `Known issues on ${headset} ${age}. Tested ${version}. Source: ${who}.`
    }
  }
  if (state === 'current') {
    return {
      state,
      tone: 'verified',
      text: `Verified · ${headset} · ${age}`,
      detail: `Verified on ${headset} ${age}. Tested ${version}. Source: ${who}.`
    }
  }
  return {
    state: 'stale',
    tone: 'stale',
    text: `Verified on ${version} · update not tested`,
    detail: `Last positive check was ${version} on ${headset} (${age}, ${who}). The current catalog version has not been tested.`
  }
}
