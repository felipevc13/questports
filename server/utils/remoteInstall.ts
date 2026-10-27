/**
 * Send to Quest server flow. Routes pass a repository; tests use the memory one.
 * Secrets are hashed before they are stored. APK URLs come from the catalog.
 */

import { randomBytes, randomUUID } from 'node:crypto'
import { sha256Hex } from './analytics'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PORT_PACKAGE_CONFIGS } from '~/data/portPackageMap'
import { appBridgeApkUrl } from '~/lib/appBridge'
import { cleanAppVersion, cleanPortSlug, isAnalyticsEnabled } from '~/lib/analytics'
import { versionedCoverUrl } from '~/data/coverUrl'
import { formatPortVersion } from '~/lib/versionFormat'
import {
  REMOTE_ACTIVE_STATUSES,
  REMOTE_CLAIM_FAIL_LIMIT,
  REMOTE_CLAIM_LOCKOUT_MS,
  REMOTE_CODE_ATTEMPT_LIMIT,
  REMOTE_CODE_TTL_MS,
  REMOTE_CODES_PER_HOUR,
  REMOTE_DEVICE_STATUSES,
  REMOTE_HOUR_MS,
  REMOTE_INSTALL_MIN_APP_VERSION,
  REMOTE_QUEUE_LIMIT,
  REMOTE_REGISTRATIONS_PER_HOUR,
  REMOTE_REQUEST_TTL_MS,
  REMOTE_REQUESTS_PER_HOUR,
  cleanDeviceModel,
  cleanRemoteDetail,
  cleanRemoteErrorReason,
  cleanRemoteProgress,
  formatPairCode,
  gameFilesPathForSlug,
  isRemoteActiveStatus,
  isRemotePairCode,
  isRemoteRequestStatus,
  needsFilesProp,
  normalizePairCode,
  portNeedsUserFiles,
  questDisplayName,
  remoteAppSupportsInstall,
  remoteBrowserLabel,
  remoteDeviceChannel,
  remoteInstallEligible,
  remoteStatusTransition,
  type RemoteRequestStatus
} from '~/lib/remoteInstall'

export function randomRemoteSecret(): string {
  return randomBytes(32).toString('base64url')
}

export function randomRemoteCode(): string {
  const bytes = randomBytes(6)
  let code = ''
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  for (const byte of bytes) code += alphabet[byte % alphabet.length]
  return code
}

export function remoteSubjectHash(salt: string, action: string, subject: string): string {
  return sha256Hex(`${salt}\n${action}\n${subject}`)
}

export function remoteBroadcastUrl(supabaseUrl: string, deviceId: string): string {
  const base = supabaseUrl.replace(/\/$/, '')
  const topic = encodeURIComponent(remoteDeviceChannel(deviceId))
  return `${base}/realtime/v1/api/broadcast/${topic}/events/new_request`
}

export class RemoteFlowError extends Error {
  readonly code: string
  readonly httpStatus: number
  readonly extra: Record<string, unknown>

  constructor(code: string, httpStatus: number, message: string, extra: Record<string, unknown> = {}) {
    super(message)
    this.code = code
    this.httpStatus = httpStatus
    this.extra = extra
  }
}

export interface RemoteDeviceRow {
  id: string
  model: string
  name: string
  app_version: string
  secret_hash: string
  last_seen_at: string
  revoked_at: string | null
  created_at: string
  created_ip_hash: string
}

export interface RemoteCodeRow {
  id: string
  code_hash: string
  device_id: string
  expires_at: string
  attempts: number
  used_at: string | null
  created_at: string
}

export interface RemoteLinkRow {
  id: string
  device_id: string
  token_hash: string
  label: string | null
  created_at: string
  revoked_at: string | null
}

export interface RemoteRequestRow {
  id: string
  link_id: string
  device_id: string
  port_slug: string
  title: string
  package_id: string
  version: string | null
  cover_url: string | null
  needs_files: boolean
  status: RemoteRequestStatus
  progress: number | null
  error_reason: string | null
  detail: string | null
  created_at: string
  updated_at: string
  expires_at: string
  received_at: string | null
  installed_at: string | null
}

export interface RemoteRepository {
  countDevicesByIp(ipHash: string, sinceIso: string): Promise<number>
  insertDevice(row: RemoteDeviceRow): Promise<RemoteDeviceRow>
  findDeviceBySecretHash(hash: string): Promise<RemoteDeviceRow | null>
  findDevice(id: string): Promise<RemoteDeviceRow | null>
  touchDevice(id: string, patch: { last_seen_at: string; app_version?: string }): Promise<void>
  countCodes(deviceId: string, sinceIso: string): Promise<number>
  insertCode(row: RemoteCodeRow): Promise<RemoteCodeRow>
  findCodeByHash(hash: string): Promise<RemoteCodeRow | null>
  updateCode(id: string, patch: Partial<RemoteCodeRow>, expectedAttempts: number): Promise<RemoteCodeRow | null>
  countClaimFailures(subjectHash: string, sinceIso: string): Promise<number>
  insertRateHit(action: string, subjectHash: string, createdAt: string): Promise<void>
  insertLink(row: RemoteLinkRow): Promise<RemoteLinkRow>
  findLinkByTokenHash(hash: string): Promise<RemoteLinkRow | null>
  revokeLink(id: string, revokedAt: string): Promise<void>
  listLinks(deviceId: string): Promise<RemoteLinkRow[]>
  countRequests(linkId: string, sinceIso: string): Promise<number>
  countActiveRequests(deviceId: string, nowIso: string): Promise<number>
  findActiveRequest(linkId: string, slug: string, nowIso: string): Promise<RemoteRequestRow | null>
  insertRequest(row: RemoteRequestRow): Promise<RemoteRequestRow>
  findRequest(id: string): Promise<RemoteRequestRow | null>
  updateRequest(id: string, patch: Partial<RemoteRequestRow>): Promise<RemoteRequestRow | null>
  listDeviceRequests(deviceId: string, nowIso: string): Promise<RemoteRequestRow[]>
  expireRequests(deviceId: string | null, nowIso: string): Promise<RemoteRequestRow[]>
}

export interface RemoteCatalogPort {
  slug: string
  title: string
  version: string | null
  packageId: string
  apkUrl: string
  coverUrl: string | null
  eligible: boolean
  needsFiles: boolean
  filesPath: string
}

export interface RemoteCatalog {
  resolve(slug: string): Promise<RemoteCatalogPort | null>
}

export interface RemoteAnalyticsRow {
  event: string
  path: string | null
  port_slug: string | null
  headset: string | null
  webusb: boolean | null
  props: Record<string, string | number | boolean> | null
}

export interface RemoteDeps {
  enabled: boolean
  repo: RemoteRepository | null
  catalog: RemoteCatalog
  now: () => Date
  hash: (value: string) => string
  newId: () => string
  newSecret: () => string
  newCode: () => string
  salt: string
  nudge: (deviceId: string, requestId: string) => Promise<void>
  recordAnalytics: (row: RemoteAnalyticsRow) => Promise<void>
  userAgent: string
  clientIp: string
}

export interface RemoteHttpInput {
  method: string
  path: string
  body: unknown
  authorization: string | null
  appVersionHeader: string | null
}

export interface RemoteHttpResult {
  status: number
  body: Record<string, unknown> | null
}

function fail(code: string, status: number, message: string, extra: Record<string, unknown> = {}): never {
  throw new RemoteFlowError(code, status, message, extra)
}

function requireRepo(deps: RemoteDeps): RemoteRepository {
  if (!deps.repo) {
    fail('unavailable', 503, 'Remote install is not set up yet. Apply the migration, then try again.')
  }
  return deps.repo
}

function bearerToken(authorization: string | null): string {
  const match = String(authorization || '').match(/^Bearer\s+(\S+)$/i)
  const token = match?.[1]?.trim() || ''
  if (!token) fail('unauthorized', 401, 'Missing token.')
  return token
}

function hourAgo(now: Date): string {
  return new Date(now.getTime() - REMOTE_HOUR_MS).toISOString()
}

function lockoutAgo(now: Date): string {
  return new Date(now.getTime() - REMOTE_CLAIM_LOCKOUT_MS).toISOString()
}

async function recordClaimFailure(deps: RemoteDeps, repo: RemoteRepository, now: Date) {
  const subject = remoteSubjectHash(deps.salt, 'claim', deps.clientIp)
  await repo.insertRateHit('claim_fail', subject, now.toISOString())
}

async function assertClaimAllowed(deps: RemoteDeps, repo: RemoteRepository, now: Date) {
  const subject = remoteSubjectHash(deps.salt, 'claim', deps.clientIp)
  const failures = await repo.countClaimFailures(subject, lockoutAgo(now))
  if (failures >= REMOTE_CLAIM_FAIL_LIMIT) {
    fail('too_many_attempts', 429, 'Too many tries. Wait a minute, then enter the code again.')
  }
}

async function touchFromRequest(
  repo: RemoteRepository,
  device: RemoteDeviceRow,
  now: Date,
  version: string | null
): Promise<RemoteDeviceRow> {
  const nextVersion = version && version !== device.app_version ? version : undefined
  await repo.touchDevice(device.id, {
    last_seen_at: now.toISOString(),
    ...(nextVersion ? { app_version: nextVersion } : {})
  })
  return {
    ...device,
    last_seen_at: now.toISOString(),
    app_version: nextVersion || device.app_version
  }
}

async function deviceFromSecret(deps: RemoteDeps, repo: RemoteRepository, secret: string): Promise<RemoteDeviceRow> {
  const device = await repo.findDeviceBySecretHash(deps.hash(secret))
  if (!device || device.revoked_at) fail('unauthorized', 401, 'This headset is not registered.')
  return device
}

async function linkFromToken(deps: RemoteDeps, repo: RemoteRepository, token: string): Promise<RemoteLinkRow> {
  const link = await repo.findLinkByTokenHash(deps.hash(token))
  if (!link || link.revoked_at) fail('unauthorized', 401, 'This browser is not paired.')
  return link
}

function versionFrom(body: unknown, header: string | null): string | null {
  const record = body && typeof body === 'object' ? body as Record<string, unknown> : null
  return cleanAppVersion(header) || cleanAppVersion(record?.app_version)
}

async function registerDevice(deps: RemoteDeps, body: unknown): Promise<Record<string, unknown>> {
  const repo = requireRepo(deps)
  const record = body && typeof body === 'object' ? body as Record<string, unknown> : null
  const model = cleanDeviceModel(record?.model)
  const appVersion = cleanAppVersion(record?.app_version)
  if (!model) fail('invalid', 400, 'model is required.')
  if (!appVersion) fail('invalid', 400, 'app_version is required.')
  const now = deps.now()
  const ipHash = remoteSubjectHash(deps.salt, 'register', deps.clientIp)
  const recent = await repo.countDevicesByIp(ipHash, hourAgo(now))
  if (recent >= REMOTE_REGISTRATIONS_PER_HOUR) {
    fail('rate_limited', 429, 'Too many headsets registered from this network. Try again later.')
  }
  const secret = deps.newSecret()
  const row: RemoteDeviceRow = {
    id: deps.newId(),
    model,
    name: questDisplayName(model),
    app_version: appVersion,
    secret_hash: deps.hash(secret),
    last_seen_at: now.toISOString(),
    revoked_at: null,
    created_at: now.toISOString(),
    created_ip_hash: ipHash
  }
  await repo.insertDevice(row)
  return { device_id: row.id, device_secret: secret }
}

async function issueCode(deps: RemoteDeps, authorization: string | null, body: unknown, header: string | null) {
  const repo = requireRepo(deps)
  const now = deps.now()
  let device = await deviceFromSecret(deps, repo, bearerToken(authorization))
  device = await touchFromRequest(repo, device, now, versionFrom(body, header))
  const recent = await repo.countCodes(device.id, hourAgo(now))
  if (recent >= REMOTE_CODES_PER_HOUR) {
    fail('rate_limited', 429, 'Too many pairing codes. Try again in an hour.')
  }
  const code = deps.newCode()
  if (!isRemotePairCode(code)) fail('unavailable', 503, 'Could not create a pairing code.')
  const row: RemoteCodeRow = {
    id: deps.newId(),
    code_hash: deps.hash(code),
    device_id: device.id,
    expires_at: new Date(now.getTime() + REMOTE_CODE_TTL_MS).toISOString(),
    attempts: 0,
    used_at: null,
    created_at: now.toISOString()
  }
  await repo.insertCode(row)
  return { code: formatPairCode(code), expires_at: row.expires_at }
}

async function claimCode(deps: RemoteDeps, body: unknown) {
  const repo = requireRepo(deps)
  const now = deps.now()
  await assertClaimAllowed(deps, repo, now)
  const record = body && typeof body === 'object' ? body as Record<string, unknown> : null
  const normalized = normalizePairCode(record?.code)
  if (!isRemotePairCode(normalized)) {
    await recordClaimFailure(deps, repo, now)
    fail('invalid_code', 400, 'That code is not valid. Check the QuestPorts app and try again.')
  }
  const code = await repo.findCodeByHash(deps.hash(normalized))
  if (!code || code.used_at) {
    await recordClaimFailure(deps, repo, now)
    fail('invalid_code', 400, 'That code is not valid. Check the QuestPorts app and try again.')
  }
  if (Date.parse(code.expires_at) <= now.getTime()) {
    await recordClaimFailure(deps, repo, now)
    fail('expired', 400, 'That code has expired. Show a new one in the QuestPorts app.')
  }
  if (code.attempts >= REMOTE_CODE_ATTEMPT_LIMIT) {
    await recordClaimFailure(deps, repo, now)
    fail('too_many_attempts', 429, 'That code was tried too many times. Show a new one in the app.')
  }
  const used = await repo.updateCode(code.id, {
    attempts: code.attempts + 1,
    used_at: now.toISOString()
  }, code.attempts)
  if (!used) fail('conflict', 409, 'That code was just used. Show a new one in the app.')
  const device = await repo.findDevice(code.device_id)
  if (!device || device.revoked_at) fail('unauthorized', 401, 'This headset is not registered.')
  const token = deps.newSecret()
  const link: RemoteLinkRow = {
    id: deps.newId(),
    device_id: device.id,
    token_hash: deps.hash(token),
    label: remoteBrowserLabel(deps.userAgent),
    created_at: now.toISOString(),
    revoked_at: null
  }
  await repo.insertLink(link)
  return {
    browser_token: token,
    device: {
      id: device.id,
      name: device.name,
      model: device.model,
      app_version: device.app_version
    }
  }
}

async function browserContext(deps: RemoteDeps, authorization: string | null, header: string | null, body: unknown) {
  const repo = requireRepo(deps)
  const link = await linkFromToken(deps, repo, bearerToken(authorization))
  const device = await repo.findDevice(link.device_id)
  if (!device || device.revoked_at) fail('unauthorized', 401, 'This Quest is no longer paired.')
  const now = deps.now()
  const fresh = await touchFromRequest(repo, device, now, versionFrom(body, header))
  return { repo, link, device: fresh, now }
}

async function createInstallRequest(deps: RemoteDeps, authorization: string | null, body: unknown, header: string | null) {
  const { repo, link, device, now } = await browserContext(deps, authorization, header, body)
  if (!remoteAppSupportsInstall(device.app_version)) {
    throw new RemoteFlowError(
      'app_outdated',
      409,
      `Update the QuestPorts app on your Quest. Send to Quest needs ${REMOTE_INSTALL_MIN_APP_VERSION} or newer.`,
      { app_version: device.app_version, min_app_version: REMOTE_INSTALL_MIN_APP_VERSION }
    )
  }
  const record = body && typeof body === 'object' ? body as Record<string, unknown> : null
  const slug = cleanPortSlug(record?.port_slug)
  if (!slug) fail('invalid', 400, 'port_slug is required.')
  const port = await deps.catalog.resolve(slug)
  if (!port) fail('not_found', 404, 'That port is not in the catalog.')
  if (!port.eligible || !port.apkUrl || !port.packageId) {
    fail('not_eligible', 403, 'This port cannot be sent. It needs a catalog APK and a package id.')
  }
  await repo.expireRequests(device.id, now.toISOString())
  const existing = await repo.findActiveRequest(link.id, slug, now.toISOString())
  if (existing) return { id: existing.id, status: existing.status }
  const sentRecently = await repo.countRequests(link.id, hourAgo(now))
  if (sentRecently >= REMOTE_REQUESTS_PER_HOUR) {
    fail('rate_limited', 429, 'Too many sends from this browser. Try again in an hour.')
  }
  const queued = await repo.countActiveRequests(device.id, now.toISOString())
  if (queued >= REMOTE_QUEUE_LIMIT) {
    fail('queue_full', 429, 'This Quest already has 3 installs waiting. Finish or cancel one first.')
  }
  const request: RemoteRequestRow = {
    id: deps.newId(),
    link_id: link.id,
    device_id: device.id,
    port_slug: slug,
    title: port.title,
    package_id: port.packageId,
    version: port.version,
    cover_url: port.coverUrl,
    needs_files: port.needsFiles,
    status: 'queued',
    progress: null,
    error_reason: null,
    detail: null,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    expires_at: new Date(now.getTime() + REMOTE_REQUEST_TTL_MS).toISOString(),
    received_at: null,
    installed_at: null
  }
  await repo.insertRequest(request)
  await deps.nudge(device.id, request.id)
  return { id: request.id, status: 'queued' as const, needs_files: needsFilesProp(slug) }
}

async function readBrowserRequest(deps: RemoteDeps, authorization: string | null, id: string) {
  const { repo, link, device, now } = await browserContext(deps, authorization, null, null)
  if (!/^[0-9a-f-]{36}$/i.test(id)) fail('not_found', 404, 'Request not found.')
  await repo.expireRequests(device.id, now.toISOString())
  const row = await repo.findRequest(id)
  if (!row || row.link_id !== link.id) fail('not_found', 404, 'Request not found.')
  return {
    id: row.id,
    status: row.status,
    progress: row.progress,
    error_reason: row.error_reason,
    updated_at: row.updated_at,
    expires_at: row.expires_at,
    needs_files: row.needs_files
  }
}

async function cancelBrowserRequest(deps: RemoteDeps, authorization: string | null, id: string) {
  const { repo, link, now } = await browserContext(deps, authorization, null, null)
  const row = await repo.findRequest(id)
  if (!row || row.link_id !== link.id) fail('not_found', 404, 'Request not found.')
  if (!remoteStatusTransition(row.status, 'cancelled')) {
    fail('closed', 409, 'This request can no longer be cancelled.')
  }
  const next = await repo.updateRequest(row.id, {
    status: 'cancelled',
    updated_at: now.toISOString()
  })
  if (!next) fail('unavailable', 503, 'Could not cancel that request.')
  await recordStatus(deps, next, null)
  return { id: next.id, status: next.status }
}

async function browserDevice(deps: RemoteDeps, authorization: string | null, header: string | null) {
  const { device } = await browserContext(deps, authorization, header, null)
  return {
    device: {
      id: device.id,
      name: device.name,
      model: device.model,
      last_seen: device.last_seen_at,
      app_version: device.app_version
    }
  }
}

async function forgetPairing(deps: RemoteDeps, authorization: string | null) {
  const { repo, link, now } = await browserContext(deps, authorization, null, null)
  await repo.revokeLink(link.id, now.toISOString())
  return { ok: true }
}

async function listForDevice(deps: RemoteDeps, authorization: string | null, body: unknown, header: string | null) {
  const repo = requireRepo(deps)
  const now = deps.now()
  let device = await deviceFromSecret(deps, repo, bearerToken(authorization))
  device = await touchFromRequest(repo, device, now, versionFrom(body, header))
  const expired = await repo.expireRequests(device.id, now.toISOString())
  for (const row of expired) await recordStatus(deps, row, device.model)
  const rows = await repo.listDeviceRequests(device.id, now.toISOString())
  const requests = []
  for (const row of rows) {
    const port = await deps.catalog.resolve(row.port_slug)
    if (!port?.apkUrl || !port.eligible) continue
    requests.push({
      id: row.id,
      port_slug: row.port_slug,
      title: row.title,
      package_id: row.package_id,
      version: row.version,
      apk_url: port.apkUrl,
      cover_url: port.coverUrl || row.cover_url,
      created_at: row.created_at,
      status: row.status,
      progress: row.progress
    })
  }
  return { requests }
}

function elapsedSeconds(row: RemoteRequestRow, now: Date): number | null {
  const start = Date.parse(row.created_at)
  if (!Number.isFinite(start)) return null
  const seconds = Math.round((now.getTime() - start) / 1000)
  if (seconds < 0 || seconds > 172800) return null
  return seconds
}

async function recordStatus(deps: RemoteDeps, row: RemoteRequestRow, model: string | null) {
  const seconds = row.status === 'installed' || row.status === 'expired'
    ? elapsedSeconds(row, deps.now())
    : null
  await deps.recordAnalytics({
    event: 'remote_status',
    path: `/ports/${row.port_slug}`,
    port_slug: row.port_slug,
    headset: cleanDeviceModel(model),
    webusb: false,
    props: {
      status: row.status,
      ...(row.error_reason ? { reason: row.error_reason } : {}),
      ...(row.progress != null ? { progress: row.progress } : {}),
      ...(seconds != null ? { seconds } : {})
    }
  })
  if (row.status !== 'installed') return
  await deps.recordAnalytics({
    event: 'install_success',
    path: `/ports/${row.port_slug}`,
    port_slug: row.port_slug,
    headset: cleanDeviceModel(model),
    webusb: false,
    props: {
      method: 'remote',
      needs_files: row.needs_files ? 'true' : 'false',
      ...(seconds != null ? { seconds } : {})
    }
  })
}

async function updateFromDevice(
  deps: RemoteDeps,
  authorization: string | null,
  id: string,
  body: unknown,
  header: string | null
) {
  const repo = requireRepo(deps)
  const now = deps.now()
  let device = await deviceFromSecret(deps, repo, bearerToken(authorization))
  device = await touchFromRequest(repo, device, now, versionFrom(body, header))
  const row = await repo.findRequest(id)
  if (!row || row.device_id !== device.id) fail('not_found', 404, 'Request not found.')
  const record = body && typeof body === 'object' ? body as Record<string, unknown> : null
  const status = record?.status
  if (!isRemoteRequestStatus(status) || !(REMOTE_DEVICE_STATUSES as readonly string[]).includes(status)) {
    fail('invalid', 400, 'status is not valid.')
  }
  if (row.status === 'expired' || Date.parse(row.expires_at) <= now.getTime() && isRemoteActiveStatus(row.status)) {
    const expired = await repo.updateRequest(row.id, { status: 'expired', updated_at: now.toISOString() })
    if (expired && row.status !== 'expired') await recordStatus(deps, expired, device.model)
    fail('expired', 409, 'This request has expired.')
  }
  if (!remoteStatusTransition(row.status, status)) {
    fail('closed', 409, 'That status change is not allowed.')
  }
  const progress = cleanRemoteProgress(record?.progress)
  const reason = cleanRemoteErrorReason(record?.error_reason)
  const detail = cleanRemoteDetail(record?.detail)
  if (status === 'failed' && !reason) {
    // Keep the row usable. Unknown text becomes `other`.
  }
  const changed = status !== row.status
  const next = await repo.updateRequest(row.id, {
    status,
    progress: progress ?? row.progress,
    error_reason: status === 'failed' ? (reason || 'other') : row.error_reason,
    detail: detail ?? row.detail,
    updated_at: now.toISOString(),
    received_at: status === 'received' && !row.received_at ? now.toISOString() : row.received_at,
    installed_at: status === 'installed' ? now.toISOString() : row.installed_at
  })
  if (!next) fail('unavailable', 503, 'Could not update that request.')
  if (changed) await recordStatus(deps, next, device.model)
  return { id: next.id, status: next.status }
}

async function listBrowsers(deps: RemoteDeps, authorization: string | null, header: string | null) {
  const repo = requireRepo(deps)
  const now = deps.now()
  let device = await deviceFromSecret(deps, repo, bearerToken(authorization))
  device = await touchFromRequest(repo, device, now, versionFrom(null, header))
  const links = await repo.listLinks(device.id)
  return {
    browsers: links.filter(link => !link.revoked_at).map(link => ({
      id: link.id,
      label: link.label,
      created_at: link.created_at
    }))
  }
}

async function revokeBrowser(deps: RemoteDeps, authorization: string | null, id: string, header: string | null) {
  const repo = requireRepo(deps)
  const now = deps.now()
  let device = await deviceFromSecret(deps, repo, bearerToken(authorization))
  device = await touchFromRequest(repo, device, now, versionFrom(null, header))
  const links = await repo.listLinks(device.id)
  const link = links.find(item => item.id === id)
  if (!link) fail('not_found', 404, 'Browser not found.')
  await repo.revokeLink(link.id, now.toISOString())
  return { ok: true }
}

export async function dispatchRemote(input: RemoteHttpInput, deps: RemoteDeps): Promise<RemoteHttpResult> {
  try {
    if (!deps.enabled) {
      return { status: 404, body: { error: 'disabled', message: 'Send to Quest is turned off.' } }
    }
    const method = input.method.toUpperCase()
    const path = input.path.replace(/^\/+|\/+$/g, '')
    const parts = path.split('/').filter(Boolean)
    let body: Record<string, unknown> | null = null
    if (method === 'POST' && parts[0] === 'device' && parts[1] === 'register' && parts.length === 2) {
      body = await registerDevice(deps, input.body)
    } else if (method === 'POST' && parts[0] === 'pair' && parts[1] === 'code' && parts.length === 2) {
      body = await issueCode(deps, input.authorization, input.body, input.appVersionHeader)
    } else if (method === 'POST' && parts[0] === 'pair' && parts[1] === 'claim' && parts.length === 2) {
      body = await claimCode(deps, input.body)
    } else if (method === 'GET' && parts[0] === 'requests' && parts.length === 1) {
      body = await listForDevice(deps, input.authorization, input.body, input.appVersionHeader)
    } else if (method === 'POST' && parts[0] === 'requests' && parts.length === 1) {
      body = await createInstallRequest(deps, input.authorization, input.body, input.appVersionHeader)
    } else if (method === 'GET' && parts[0] === 'requests' && parts.length === 2) {
      body = await readBrowserRequest(deps, input.authorization, parts[1] || '')
    } else if (method === 'POST' && parts[0] === 'requests' && parts[2] === 'status' && parts.length === 3) {
      body = await updateFromDevice(deps, input.authorization, parts[1] || '', input.body, input.appVersionHeader)
    } else if (method === 'POST' && parts[0] === 'requests' && parts[2] === 'cancel' && parts.length === 3) {
      body = await cancelBrowserRequest(deps, input.authorization, parts[1] || '')
    } else if (method === 'GET' && parts[0] === 'browsers' && parts.length === 1) {
      body = await listBrowsers(deps, input.authorization, input.appVersionHeader)
    } else if (method === 'DELETE' && parts[0] === 'browsers' && parts.length === 2) {
      body = await revokeBrowser(deps, input.authorization, parts[1] || '', input.appVersionHeader)
    } else if (method === 'GET' && parts[0] === 'device' && parts.length === 1) {
      body = await browserDevice(deps, input.authorization, input.appVersionHeader)
    } else if (method === 'DELETE' && parts[0] === 'pairing' && parts.length === 1) {
      body = await forgetPairing(deps, input.authorization)
    } else {
      return { status: 404, body: { error: 'not_found', message: 'Unknown remote route.' } }
    }
    return { status: 200, body }
  } catch (err) {
    if (err instanceof RemoteFlowError) {
      return {
        status: err.httpStatus,
        body: { error: err.code, message: err.message, ...err.extra }
      }
    }
    console.error('[QuestPorts] remote install failed')
    return { status: 500, body: { error: 'unavailable', message: 'Remote install failed.' } }
  }
}

export function createMemoryRemoteRepository(): RemoteRepository {
  const devices: RemoteDeviceRow[] = []
  const codes: RemoteCodeRow[] = []
  const links: RemoteLinkRow[] = []
  const requests: RemoteRequestRow[] = []
  const hits: Array<{ action: string; subject_hash: string; created_at: string }> = []

  return {
    async countDevicesByIp(ipHash, sinceIso) {
      return devices.filter(row => row.created_ip_hash === ipHash && row.created_at >= sinceIso).length
    },
    async insertDevice(row) {
      devices.push({ ...row })
      return row
    },
    async findDeviceBySecretHash(hash) {
      return devices.find(row => row.secret_hash === hash) || null
    },
    async findDevice(id) {
      return devices.find(row => row.id === id) || null
    },
    async touchDevice(id, patch) {
      const row = devices.find(item => item.id === id)
      if (!row) return
      row.last_seen_at = patch.last_seen_at
      if (patch.app_version) row.app_version = patch.app_version
    },
    async countCodes(deviceId, sinceIso) {
      return codes.filter(row => row.device_id === deviceId && row.created_at >= sinceIso).length
    },
    async insertCode(row) {
      codes.push({ ...row })
      return row
    },
    async findCodeByHash(hash) {
      return codes.find(row => row.code_hash === hash) || null
    },
    async updateCode(id, patch, expectedAttempts) {
      const row = codes.find(item => item.id === id)
      if (!row || row.attempts !== expectedAttempts) return null
      Object.assign(row, patch)
      return { ...row }
    },
    async countClaimFailures(subjectHash, sinceIso) {
      return hits.filter(row => row.action === 'claim_fail' && row.subject_hash === subjectHash && row.created_at >= sinceIso).length
    },
    async insertRateHit(action, subjectHash, createdAt) {
      hits.push({ action, subject_hash: subjectHash, created_at: createdAt })
    },
    async insertLink(row) {
      links.push({ ...row })
      return row
    },
    async findLinkByTokenHash(hash) {
      return links.find(row => row.token_hash === hash) || null
    },
    async revokeLink(id, revokedAt) {
      const row = links.find(item => item.id === id)
      if (row) row.revoked_at = revokedAt
    },
    async listLinks(deviceId) {
      return links.filter(row => row.device_id === deviceId).map(row => ({ ...row }))
    },
    async countRequests(linkId, sinceIso) {
      return requests.filter(row => row.link_id === linkId && row.created_at >= sinceIso).length
    },
    async countActiveRequests(deviceId, nowIso) {
      return requests.filter(row =>
        row.device_id === deviceId
        && isRemoteActiveStatus(row.status)
        && row.expires_at > nowIso
      ).length
    },
    async findActiveRequest(linkId, slug, nowIso) {
      const row = requests.find(item =>
        item.link_id === linkId
        && item.port_slug === slug
        && isRemoteActiveStatus(item.status)
        && item.expires_at > nowIso
      )
      return row ? { ...row } : null
    },
    async insertRequest(row) {
      requests.push({ ...row })
      return row
    },
    async findRequest(id) {
      const row = requests.find(item => item.id === id)
      return row ? { ...row } : null
    },
    async updateRequest(id, patch) {
      const row = requests.find(item => item.id === id)
      if (!row) return null
      Object.assign(row, patch)
      return { ...row }
    },
    async listDeviceRequests(deviceId, nowIso) {
      return requests
        .filter(row => row.device_id === deviceId && isRemoteActiveStatus(row.status) && row.expires_at > nowIso)
        .map(row => ({ ...row }))
    },
    async expireRequests(deviceId, nowIso) {
      const flipped: RemoteRequestRow[] = []
      for (const row of requests) {
        if (deviceId && row.device_id !== deviceId) continue
        if (!isRemoteActiveStatus(row.status)) continue
        if (row.expires_at > nowIso) continue
        row.status = 'expired'
        row.updated_at = nowIso
        flipped.push({ ...row })
      }
      return flipped
    }
  }
}

function dbFail(error: { message?: string; code?: string } | null): void {
  if (!error) return
  const message = error.message || ''
  if (error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(message)) {
    throw new RemoteFlowError('unavailable', 503, 'Remote install is not set up yet. Apply the migration, then try again.')
  }
  throw new RemoteFlowError('unavailable', 503, 'Remote install could not reach the database.')
}

export function createSupabaseRemoteRepository(admin: SupabaseClient): RemoteRepository {
  return {
    async countDevicesByIp(ipHash, sinceIso) {
      const { count, error } = await admin
        .from('remote_devices')
        .select('id', { count: 'exact', head: true })
        .eq('created_ip_hash', ipHash)
        .gte('created_at', sinceIso)
      dbFail(error)
      return count || 0
    },
    async insertDevice(row) {
      const { error } = await admin.from('remote_devices').insert(row)
      dbFail(error)
      return row
    },
    async findDeviceBySecretHash(hash) {
      const { data, error } = await admin.from('remote_devices').select('*').eq('secret_hash', hash).maybeSingle()
      dbFail(error)
      return (data as RemoteDeviceRow | null) || null
    },
    async findDevice(id) {
      const { data, error } = await admin.from('remote_devices').select('*').eq('id', id).maybeSingle()
      dbFail(error)
      return (data as RemoteDeviceRow | null) || null
    },
    async touchDevice(id, patch) {
      const { error } = await admin.from('remote_devices').update(patch).eq('id', id)
      dbFail(error)
    },
    async countCodes(deviceId, sinceIso) {
      const { count, error } = await admin
        .from('remote_pair_codes')
        .select('id', { count: 'exact', head: true })
        .eq('device_id', deviceId)
        .gte('created_at', sinceIso)
      dbFail(error)
      return count || 0
    },
    async insertCode(row) {
      const { error } = await admin.from('remote_pair_codes').insert(row)
      dbFail(error)
      return row
    },
    async findCodeByHash(hash) {
      const { data, error } = await admin.from('remote_pair_codes').select('*').eq('code_hash', hash).maybeSingle()
      dbFail(error)
      return (data as RemoteCodeRow | null) || null
    },
    async updateCode(id, patch, expectedAttempts) {
      const { data, error } = await admin
        .from('remote_pair_codes')
        .update(patch)
        .eq('id', id)
        .eq('attempts', expectedAttempts)
        .select('*')
        .maybeSingle()
      dbFail(error)
      return (data as RemoteCodeRow | null) || null
    },
    async countClaimFailures(subjectHash, sinceIso) {
      const { count, error } = await admin
        .from('remote_rate_limits')
        .select('id', { count: 'exact', head: true })
        .eq('action', 'claim_fail')
        .eq('subject_hash', subjectHash)
        .gte('created_at', sinceIso)
      dbFail(error)
      return count || 0
    },
    async insertRateHit(action, subjectHash, createdAt) {
      const { error } = await admin.from('remote_rate_limits').insert({
        action,
        subject_hash: subjectHash,
        created_at: createdAt
      })
      dbFail(error)
      const cutoff = new Date(Date.parse(createdAt) - 2 * REMOTE_HOUR_MS).toISOString()
      await admin.from('remote_rate_limits').delete().lt('created_at', cutoff)
    },
    async insertLink(row) {
      const { error } = await admin.from('remote_links').insert(row)
      dbFail(error)
      return row
    },
    async findLinkByTokenHash(hash) {
      const { data, error } = await admin.from('remote_links').select('*').eq('token_hash', hash).maybeSingle()
      dbFail(error)
      return (data as RemoteLinkRow | null) || null
    },
    async revokeLink(id, revokedAt) {
      const { error } = await admin.from('remote_links').update({ revoked_at: revokedAt }).eq('id', id)
      dbFail(error)
    },
    async listLinks(deviceId) {
      const { data, error } = await admin.from('remote_links').select('*').eq('device_id', deviceId)
      dbFail(error)
      return (data as RemoteLinkRow[] | null) || []
    },
    async countRequests(linkId, sinceIso) {
      const { count, error } = await admin
        .from('remote_install_requests')
        .select('id', { count: 'exact', head: true })
        .eq('link_id', linkId)
        .gte('created_at', sinceIso)
      dbFail(error)
      return count || 0
    },
    async countActiveRequests(deviceId, nowIso) {
      const { count, error } = await admin
        .from('remote_install_requests')
        .select('id', { count: 'exact', head: true })
        .eq('device_id', deviceId)
        .in('status', [...REMOTE_ACTIVE_STATUSES])
        .gt('expires_at', nowIso)
      dbFail(error)
      return count || 0
    },
    async findActiveRequest(linkId, slug, nowIso) {
      const { data, error } = await admin
        .from('remote_install_requests')
        .select('*')
        .eq('link_id', linkId)
        .eq('port_slug', slug)
        .in('status', [...REMOTE_ACTIVE_STATUSES])
        .gt('expires_at', nowIso)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      dbFail(error)
      return (data as RemoteRequestRow | null) || null
    },
    async insertRequest(row) {
      const { error } = await admin.from('remote_install_requests').insert(row)
      dbFail(error)
      return row
    },
    async findRequest(id) {
      const { data, error } = await admin.from('remote_install_requests').select('*').eq('id', id).maybeSingle()
      dbFail(error)
      return (data as RemoteRequestRow | null) || null
    },
    async updateRequest(id, patch) {
      const { data, error } = await admin
        .from('remote_install_requests')
        .update(patch)
        .eq('id', id)
        .select('*')
        .maybeSingle()
      dbFail(error)
      return (data as RemoteRequestRow | null) || null
    },
    async listDeviceRequests(deviceId, nowIso) {
      const { data, error } = await admin
        .from('remote_install_requests')
        .select('*')
        .eq('device_id', deviceId)
        .in('status', [...REMOTE_ACTIVE_STATUSES])
        .gt('expires_at', nowIso)
        .order('created_at', { ascending: true })
      dbFail(error)
      return (data as RemoteRequestRow[] | null) || []
    },
    async expireRequests(deviceId, nowIso) {
      let query = admin
        .from('remote_install_requests')
        .update({ status: 'expired', updated_at: nowIso })
        .in('status', [...REMOTE_ACTIVE_STATUSES])
        .lte('expires_at', nowIso)
        .select('*')
      if (deviceId) query = query.eq('device_id', deviceId)
      const { data, error } = await query
      dbFail(error)
      return (data as RemoteRequestRow[] | null) || []
    }
  }
}

export function createCatalogResolver(
  admin: SupabaseClient | null,
  apkProxyBase: string,
  mediaBase: string
): RemoteCatalog {
  return {
    async resolve(slug) {
      const cleaned = cleanPortSlug(slug)
      if (!cleaned || !admin) return null
      const { data, error } = await admin
        .from('ports')
        .select('slug, title, latest_version, port_download_url, cover_image_url')
        .eq('slug', cleaned)
        .maybeSingle()
      if (error || !data) return null
      const downloadUrl = typeof data.port_download_url === 'string' ? data.port_download_url : ''
      const eligible = remoteInstallEligible(cleaned, downloadUrl)
      const apkUrl = appBridgeApkUrl(apkProxyBase, downloadUrl) || ''
      const cover = versionedCoverUrl(
        typeof data.cover_image_url === 'string' ? data.cover_image_url : null,
        mediaBase
      )
      return {
        slug: cleaned,
        title: typeof data.title === 'string' && data.title.trim() ? data.title.trim() : cleaned,
        version: formatPortVersion(typeof data.latest_version === 'string' ? data.latest_version : '') || null,
        packageId: PORT_PACKAGE_CONFIGS[cleaned]?.packageName || '',
        apkUrl,
        coverUrl: cover,
        eligible,
        needsFiles: portNeedsUserFiles(cleaned),
        filesPath: gameFilesPathForSlug(cleaned)
      }
    }
  }
}

export function createStaticCatalog(ports: Record<string, RemoteCatalogPort>): RemoteCatalog {
  return {
    async resolve(slug) {
      const cleaned = cleanPortSlug(slug)
      if (!cleaned) return null
      return ports[cleaned] || null
    }
  }
}

export async function sendRemoteBroadcast(input: {
  supabaseUrl: string
  serviceRoleKey: string
  deviceId: string
  requestId: string
  fetchImpl?: typeof fetch
}): Promise<void> {
  const url = input.supabaseUrl.trim()
  const key = input.serviceRoleKey.trim()
  if (!url || !key) return
  const fetchImpl = input.fetchImpl || fetch
  try {
    await fetchImpl(remoteBroadcastUrl(url, input.deviceId), {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: input.requestId })
    })
  } catch (err) {
    console.error('[QuestPorts] remote broadcast failed', err instanceof Error ? err.message : '')
  }
}

export async function recordRemoteAnalytics(
  admin: SupabaseClient | null,
  row: RemoteAnalyticsRow
): Promise<void> {
  if (!admin || !isAnalyticsEnabled(process.env)) return
  const { error } = await admin.from('analytics_events').insert({
    event: row.event,
    path: row.path,
    port_slug: row.port_slug,
    headset: row.headset,
    webusb: row.webusb,
    props: row.props
  })
  if (error) console.error('[QuestPorts] remote analytics insert failed:', error.message)
}

export function remoteSalt(analyticsSalt: string, serviceRoleKey: string): string {
  const configured = analyticsSalt.trim()
  if (configured) return configured
  if (serviceRoleKey.trim()) return sha256Hex(serviceRoleKey)
  return 'questports-remote'
}

export function newRemoteId(): string {
  return randomUUID()
}
