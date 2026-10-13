/**
 * What one-click install put on a headset.
 *
 * GitHub release tags and Android versionName are often different numbers.
 * Perfect Dark VR v2.1 ships versionName 1.0 / versionCode 1. Comparing those
 * strings shows "Update available" on a headset that just installed the catalog
 * build. The record below is the release the site installed. The badge uses it
 * first. versionName is a fallback, and only when it is the same release line.
 */

import {
  formatPortVersion,
  isHeadsetApkOutdated,
  normalizeVersionKey
} from './versionFormat'

export const INSTALLED_RELEASE_STORAGE_KEY = 'questports_installed_releases'
/** WebUSB has a device serial. The QuestPorts app WebView is already one device. */
export const APP_RELEASE_SERIAL = 'app'
const MAX_RECORDS = 40

export interface ReleaseStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface InstalledReleaseRecord {
  serial: string
  packageName: string
  releaseTag: string
  asset: string
  versionName: string | null
  versionCode: string | null
  installedAt: string
}

export interface ApkUpdateInput {
  installedVersionName?: string | null
  installedVersionCode?: string | null
  catalogVersion?: string | null
  record?: InstalledReleaseRecord | null
}

export interface ApkUpdateDecision {
  outdated: boolean
  /** `release` is the stored catalog tag. `version` is a lower versionName. */
  reason: 'release' | 'version' | null
}

/**
 * @param {string | null | undefined} serial
 * @param {string | null | undefined} packageName
 * @returns {string}
 */
export function installedReleaseStorageKey(serial, packageName) {
  const pkg = String(packageName || '').trim().toLowerCase()
  if (!pkg) return ''
  const id = String(serial || '').trim() || 'unknown'
  return `${id}\t${pkg}`
}

/**
 * @param {string | null | undefined} raw
 * @returns {string}
 */
export function normalizeVersionCode(raw) {
  const text = String(raw ?? '').trim()
  if (!/^\d+$/.test(text)) return ''
  return String(Number(text))
}

/**
 * @param {string | null | undefined} header
 * @returns {string}
 */
export function filenameFromContentDisposition(header) {
  const value = String(header || '')
  if (!value) return ''
  const starred = value.match(/filename\*\s*=\s*(?:UTF-8''|utf-8'')?([^;]+)/i)
  if (starred && starred[1]) {
    const raw = starred[1].trim().replace(/^"|"$/g, '')
    try {
      return decodeURIComponent(raw)
    } catch {
      return raw
    }
  }
  const plain = value.match(/filename\s*=\s*"?([^";]+)"?/i)
  return plain && plain[1] ? plain[1].trim() : ''
}

/**
 * Filename when the download URL already points at an apk or zip.
 * @param {string | null | undefined} url
 * @returns {string}
 */
export function assetLabelFromDownloadUrl(url) {
  try {
    const name = decodeURIComponent(new URL(String(url || '')).pathname.split('/').pop() || '')
    if (/\.(apk|zip)$/i.test(name)) return name
  } catch {
    // A releases page has no single file name.
  }
  return ''
}

/**
 * @param {ReleaseStorage | null | undefined} storage
 * @returns {Record<string, InstalledReleaseRecord>}
 */
function readStore(storage) {
  if (!storage) return {}
  try {
    const raw = storage.getItem(INSTALLED_RELEASE_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return parsed
  } catch {
    return {}
  }
}

/**
 * @param {ReleaseStorage | null | undefined} storage
 * @param {Record<string, InstalledReleaseRecord>} store
 */
function writeStore(storage, store) {
  if (!storage) return
  try {
    storage.setItem(INSTALLED_RELEASE_STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Private mode and some WebViews throw. The badge still works for this visit.
  }
}

/**
 * @param {unknown} value
 * @returns {InstalledReleaseRecord | null}
 */
function asRecord(value) {
  if (!value || typeof value !== 'object') return null
  const row = /** @type {Record<string, unknown>} */ (value)
  const releaseTag = formatPortVersion(typeof row.releaseTag === 'string' ? row.releaseTag : '')
  const packageName = typeof row.packageName === 'string' ? row.packageName.trim() : ''
  if (!releaseTag || !packageName) return null
  const versionName = typeof row.versionName === 'string' && row.versionName.trim()
    ? row.versionName.trim()
    : null
  const versionCode = normalizeVersionCode(typeof row.versionCode === 'string' || typeof row.versionCode === 'number' ? row.versionCode : '')
  return {
    serial: typeof row.serial === 'string' && row.serial.trim() ? row.serial.trim() : 'unknown',
    packageName,
    releaseTag,
    asset: typeof row.asset === 'string' ? row.asset.slice(0, 240) : '',
    versionName,
    versionCode: versionCode || null,
    installedAt: typeof row.installedAt === 'string' ? row.installedAt : ''
  }
}

/**
 * @param {ReleaseStorage | null | undefined} storage
 * @param {string | null | undefined} serial
 * @param {string | null | undefined} packageName
 * @returns {InstalledReleaseRecord | null}
 */
export function readInstalledRelease(storage, serial, packageName) {
  const key = installedReleaseStorageKey(serial, packageName)
  if (!key) return null
  return asRecord(readStore(storage)[key])
}

/**
 * @param {ReleaseStorage | null | undefined} storage
 * @param {{
 *   serial?: string | null
 *   packageName?: string | null
 *   releaseTag?: string | null
 *   asset?: string | null
 *   versionName?: string | null
 *   versionCode?: string | null
 *   installedAt?: string | null
 * }} input
 * @returns {InstalledReleaseRecord | null}
 */
export function rememberInstalledRelease(storage, input) {
  const releaseTag = formatPortVersion(input?.releaseTag)
  const packageName = String(input?.packageName || '').trim()
  if (!storage || !releaseTag || !packageName) return null
  const serial = String(input?.serial || '').trim() || 'unknown'
  const versionName = input?.versionName ? String(input.versionName).trim().slice(0, 80) : ''
  const record = {
    serial,
    packageName,
    releaseTag,
    asset: String(input?.asset || '').trim().slice(0, 240),
    versionName: versionName || null,
    versionCode: normalizeVersionCode(input?.versionCode) || null,
    installedAt: input?.installedAt || new Date().toISOString()
  }
  const store = readStore(storage)
  store[installedReleaseStorageKey(serial, packageName)] = record
  const keys = Object.keys(store)
  if (keys.length > MAX_RECORDS) {
    keys.sort((a, b) => String(store[a]?.installedAt || '').localeCompare(String(store[b]?.installedAt || '')))
    for (const key of keys.slice(0, keys.length - MAX_RECORDS)) delete store[key]
  }
  writeStore(storage, store)
  return record
}

/**
 * @param {ReleaseStorage | null | undefined} storage
 * @param {string | null | undefined} serial
 * @param {string | null | undefined} packageName
 */
export function forgetInstalledRelease(storage, serial, packageName) {
  const key = installedReleaseStorageKey(serial, packageName)
  if (!storage || !key) return
  const store = readStore(storage)
  if (!store[key]) return
  delete store[key]
  writeStore(storage, store)
}

/**
 * The dumpsys read can fail on the install that wrote the record. The next
 * successful read fills versionName and versionCode in place.
 * @param {InstalledReleaseRecord | null | undefined} record
 * @param {string | null | undefined} versionName
 * @param {string | null | undefined} versionCode
 * @returns {InstalledReleaseRecord | null | undefined}
 */
export function learnInstalledRelease(record, versionName, versionCode) {
  if (!record || record.versionName) return record
  const name = String(versionName || '').trim()
  if (!name) return record
  return {
    ...record,
    versionName: name.slice(0, 80),
    versionCode: normalizeVersionCode(versionCode) || null
  }
}

/**
 * Same package build the record describes. A missing stored versionName matches
 * until learnInstalledRelease fills it. versionCode is checked only when both
 * sides have one, so a stuck versionName still distinguishes a later build.
 * @param {InstalledReleaseRecord | null | undefined} record
 * @param {string | null | undefined} versionName
 * @param {string | null | undefined} versionCode
 * @returns {boolean}
 */
export function releaseIdentityMatches(record, versionName, versionCode) {
  if (!record) return false
  if (!record.versionName) return true
  const headset = String(versionName || '').trim()
  if (!headset) return false
  if (normalizeVersionKey(record.versionName) !== normalizeVersionKey(headset)) return false
  const recordedCode = normalizeVersionCode(record.versionCode)
  const headsetCode = normalizeVersionCode(versionCode)
  if (recordedCode && headsetCode && recordedCode !== headsetCode) return false
  return true
}

/**
 * @param {ApkUpdateInput | null | undefined} input
 * @returns {ApkUpdateDecision}
 */
export function apkUpdateDecision(input) {
  const catalog = formatPortVersion(input?.catalogVersion)
  if (!catalog) return { outdated: false, reason: null }
  const record = input?.record || null
  if (record && releaseIdentityMatches(record, input?.installedVersionName, input?.installedVersionCode)) {
    if (normalizeVersionKey(record.releaseTag) !== normalizeVersionKey(catalog)) {
      return { outdated: true, reason: 'release' }
    }
    return { outdated: false, reason: null }
  }
  if (isHeadsetApkOutdated(input?.installedVersionName, input?.catalogVersion)) {
    return { outdated: true, reason: 'version' }
  }
  return { outdated: false, reason: null }
}
