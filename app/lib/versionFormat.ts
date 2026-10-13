/**
 * One catalog version rule for cards, detail pages, the table, verification
 * badges, and the GitHub release sync.
 *
 * Semver-like tags get exactly one leading "v". Build names (b004, cats27)
 * stay as names. Placeholders such as "Latest" are not versions.
 */

const PLACEHOLDERS = new Set([
  'latest',
  'vlatest',
  'none',
  'n/a',
  'na',
  'unknown',
  'null',
  'undefined',
  'tbd'
])

/**
 * @param {string | null | undefined} raw
 * @returns {string}
 */
export function cleanVersionText(raw) {
  if (raw == null) return ''
  return String(raw).trim().replace(/^winlatorxr[_-]/i, '').trim()
}

/**
 * @param {string | null | undefined} raw
 * @returns {boolean}
 */
export function isPlaceholderVersion(raw) {
  const cleaned = cleanVersionText(raw).toLowerCase()
  if (!cleaned) return true
  return PLACEHOLDERS.has(cleaned)
}

/**
 * A tag that names a desktop build, such as v1.1.7-windows.
 * A name that also says quest or android is not treated as desktop-only.
 * @param {string | null | undefined} raw
 * @returns {boolean}
 */
export function versionIsDesktopTagged(raw) {
  const value = cleanVersionText(raw)
  if (!value) return false
  if (/(quest|android|\.apk)/i.test(value)) return false
  return /(windows|win64|win32|pcvr|\bpc\b|desktop|macos|darwin)/i.test(value)
}

/**
 * Comparison key. Leading "v" before a digit is ignored, as is a WinlatorXR tag prefix.
 * @param {string | null | undefined} raw
 * @returns {string}
 */
export function normalizeVersionKey(raw) {
  const cleaned = cleanVersionText(raw).toLowerCase().replace(/\s+/g, '')
  if (!cleaned) return ''
  return cleaned.replace(/^(?:v)+(?=\d)/, '')
}

/**
 * Display form shared by every screen. Empty string means "do not show a version".
 * @param {string | null | undefined} raw
 * @returns {string}
 */
export function formatPortVersion(raw) {
  const cleaned = cleanVersionText(raw)
  if (!cleaned || isPlaceholderVersion(cleaned)) return ''
  const marked = cleaned.replace(/^(?:v)+(?=\d)/i, 'v')
  if (/^v\d/i.test(marked)) return `v${marked.slice(1)}`
  if (/^\d/.test(marked)) return `v${marked}`
  return marked
}

/**
 * @param {string | null | undefined} raw
 * @returns {number[]}
 */
export function numericVersionParts(raw) {
  const key = normalizeVersionKey(raw)
  if (!key) return []
  return key
    .split(/[^0-9]+/)
    .filter(part => part.length > 0)
    .map(part => Number.parseInt(part, 10))
    .filter(n => Number.isFinite(n))
}

/**
 * @param {string | null | undefined} installed
 * @param {string | null | undefined} catalog
 * @returns {number}
 */
export function comparePortVersions(installed, catalog) {
  const a = numericVersionParts(installed)
  const b = numericVersionParts(catalog)
  if (a.length === 0 || b.length === 0) return 0
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const left = a[i] ?? 0
    const right = b[i] ?? 0
    if (left < right) return -1
    if (left > right) return 1
  }
  return 0
}

/**
 * Letters left after the numeric pieces are removed.
 * "v1.0.31-test64" and "1.0.31" do not share a scheme. "1.0.6" and "v1.0.16" do.
 * @param {string | null | undefined} raw
 * @returns {string}
 */
export function versionScheme(raw) {
  const key = normalizeVersionKey(raw)
  if (!key) return ''
  return key.replace(/[0-9.]+/g, '').replace(/[^a-z0-9]+/g, '')
}

/**
 * versionName is trustworthy against a release tag only when they use the same
 * scheme and the same number of numeric pieces, and every piece but the last
 * matches. A different major (1.0 vs 2.1) or minor (1.1.28 vs 1.2.0) is how
 * ports whose versionName does not follow the GitHub tag look. Those are not
 * comparable: a missing badge is better than "Update available" on a build
 * that was just installed.
 * @param {string | null | undefined} installed
 * @param {string | null | undefined} catalog
 * @returns {boolean}
 */
export function versionsAreComparable(installed, catalog) {
  if (isPlaceholderVersion(installed) || isPlaceholderVersion(catalog)) return false
  if (versionScheme(installed) !== versionScheme(catalog)) return false
  const a = numericVersionParts(installed)
  const b = numericVersionParts(catalog)
  if (a.length === 0 || a.length !== b.length) return false
  for (let i = 0; i < a.length - 1; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/**
 * The headset simulator marks every package outdated with versionName 0.0.1.
 * No catalog APK we have read uses that versionName.
 * @param {string | null | undefined} installed
 * @returns {boolean}
 */
function isSimulatorOutdatedMarker(installed) {
  if (versionScheme(installed) !== '') return false
  const parts = numericVersionParts(installed)
  return parts.length === 3 && parts[0] === 0 && parts[1] === 0 && parts[2] === 1
}

/**
 * True when the headset versionName is a lower patch of the same release line.
 * @param {string | null | undefined} installedVersion
 * @param {string | null | undefined} catalogVersion
 * @returns {boolean}
 */
export function isHeadsetApkOutdated(installedVersion, catalogVersion) {
  if (isSimulatorOutdatedMarker(installedVersion) && comparePortVersions(installedVersion, catalogVersion) < 0) {
    return true
  }
  if (!versionsAreComparable(installedVersion, catalogVersion)) return false
  const installed = numericVersionParts(installedVersion)
  const catalog = numericVersionParts(catalogVersion)
  return installed[installed.length - 1] < catalog[catalog.length - 1]
}

/**
 * versionName and versionCode from `dumpsys package`.
 * @param {string | null | undefined} dump
 * @returns {{ versionName: string | null, versionCode: string | null }}
 */
export function parsePackageDump(dump) {
  const text = String(dump || '')
  const name = text.match(/versionName=([^\s]+)/i)
  const code = text.match(/versionCode=(\d+)/i)
  return {
    versionName: name && name[1] ? name[1] : null,
    versionCode: code && code[1] ? code[1] : null
  }
}
