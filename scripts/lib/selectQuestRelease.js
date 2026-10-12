import {
  comparePortVersions,
  formatPortVersion,
  isPlaceholderVersion,
  normalizeVersionKey,
  versionIsDesktopTagged
} from '../../app/lib/versionFormat.ts'

/**
 * @param {string} name
 * @returns {boolean}
 */
function isDesktopAssetName(name) {
  const value = name.toLowerCase()
  if (/(quest|android|\.apk)/.test(value)) return false
  return /(windows|win64|win32|pcvr|\bpc\b|desktop|macos|darwin|linux|appimage|\.exe$|\.msi$|\.dmg$|\.ipa$|\.deb$)/.test(value)
}

/**
 * @param {string} name
 * @returns {boolean}
 */
function isQuestOrAndroidApk(name) {
  const value = name.toLowerCase()
  if (!value.endsWith('.apk')) return false
  if (value.includes('pico') && !value.includes('quest')) return false
  return true
}

/**
 * A zip/aab whose name says Quest or Android, and not a desktop archive.
 * @param {string} name
 * @returns {boolean}
 */
function isQuestAndroidArchive(name) {
  const value = name.toLowerCase()
  if (!/\.(zip|7z|aab)$/.test(value)) return false
  if (isDesktopAssetName(value)) return false
  return /(quest|android|openxr)/.test(value)
}

/**
 * @param {{ name?: string }[] | null | undefined} assets
 * @returns {string[]}
 */
function assetNames(assets) {
  if (!Array.isArray(assets)) return []
  return assets.map(asset => String(asset?.name || '')).filter(Boolean)
}

/**
 * True when the release ships a Quest or Android build.
 * An .apk counts. A desktop zip or a windows tag with no Android asset does not.
 * @param {{ draft?: boolean, assets?: { name?: string }[] } | null | undefined} release
 * @returns {boolean}
 */
export function isQuestAndroidRelease(release) {
  if (!release || release.draft) return false
  const names = assetNames(release.assets)
  if (names.some(isQuestOrAndroidApk)) return true
  return names.some(isQuestAndroidArchive)
}

/**
 * Pick the newest stable Quest/Android release.
 * Prereleases are used only when the repo has no stable Quest/Android release.
 * Drafts are ignored. Desktop-only releases are ignored.
 * @param {Array<{ tag_name?: string, name?: string, draft?: boolean, prerelease?: boolean, published_at?: string, assets?: { name?: string }[] }> | null | undefined} releases
 */
export function selectQuestRelease(releases) {
  /** @type {{ tag: string, reason: string }[]} */
  const skipped = []
  /** @type {typeof releases} */
  const eligible = []
  for (const release of releases || []) {
    const tag = release?.tag_name || release?.name || '(untitled)'
    if (!release || release.draft) {
      skipped.push({ tag, reason: 'draft' })
      continue
    }
    if (isQuestAndroidRelease(release)) {
      eligible.push(release)
      continue
    }
    skipped.push({ tag, reason: 'not a quest/android build' })
  }

  const stables = eligible.filter(release => !release.prerelease)
  const pool = stables.length > 0 ? stables : eligible
  const ranked = [...pool].sort((a, b) => {
    const left = Date.parse(b?.published_at || '') || 0
    const right = Date.parse(a?.published_at || '') || 0
    return left - right
  })

  return {
    release: ranked[0] || null,
    prereleaseOnly: stables.length === 0 && eligible.length > 0,
    skipped
  }
}

/**
 * Decide whether a selected tag may replace the catalog value.
 * Never adopts a placeholder, a desktop tag over a real Quest version,
 * or an older number.
 * @param {string | null | undefined} current
 * @param {string | null | undefined} candidateTag
 */
export function shouldAdoptCatalogVersion(current, candidateTag) {
  const next = formatPortVersion(candidateTag)
  if (!next) {
    return { adopt: false, version: null, reason: 'candidate is not a version' }
  }
  if (versionIsDesktopTagged(candidateTag) && !versionIsDesktopTagged(current)) {
    return { adopt: false, version: next, reason: 'desktop tag is worse' }
  }

  const currentDisplay = formatPortVersion(current)
  if (!currentDisplay || isPlaceholderVersion(current)) {
    return { adopt: true, version: next, reason: 'catalog has no real version' }
  }
  if (versionIsDesktopTagged(current) && !versionIsDesktopTagged(candidateTag)) {
    return { adopt: true, version: next, reason: 'replace desktop tag with quest build' }
  }
  if (normalizeVersionKey(current) === normalizeVersionKey(next)) {
    if (String(current).trim() !== next) {
      return { adopt: true, version: next, reason: 'canonicalize' }
    }
    return { adopt: false, version: next, reason: 'same version' }
  }

  const cmp = comparePortVersions(current, next)
  if (cmp < 0) return { adopt: true, version: next, reason: 'newer quest release' }
  if (cmp > 0) return { adopt: false, version: next, reason: 'candidate is older' }
  return { adopt: false, version: next, reason: 'not a clear improvement' }
}

/**
 * @param {string | null | undefined} currentVersion
 * @param {Parameters<typeof selectQuestRelease>[0]} releases
 */
export function planPortUpdate(currentVersion, releases) {
  const selection = selectQuestRelease(releases)
  const previous = currentVersion ?? null
  const base = {
    previous,
    skipped: selection.skipped,
    selectedTag: selection.release?.tag_name || selection.release?.name || null,
    published_at: selection.release?.published_at || null,
    prereleaseOnly: selection.prereleaseOnly
  }

  if (!selection.release) {
    return {
      ...base,
      action: 'leave',
      latest_version: previous,
      reason: 'no quest/android release'
    }
  }

  const decision = shouldAdoptCatalogVersion(previous, selection.release.tag_name || selection.release.name)
  if (!decision.adopt) {
    return {
      ...base,
      action: decision.reason === 'candidate is not a version' ? 'leave' : 'keep',
      latest_version: previous,
      reason: decision.reason
    }
  }

  return {
    ...base,
    action: 'update',
    latest_version: decision.version,
    reason: decision.reason
  }
}

/**
 * Value that would be written to latest_version. Undefined means do not write.
 * @param {ReturnType<typeof planPortUpdate>} plan
 * @returns {string | undefined}
 */
export function versionToWrite(plan) {
  if (plan.action !== 'update') return undefined
  return plan.latest_version || undefined
}

/**
 * Date to store, or null to leave last_github_update alone.
 * Only the selected Quest/Android release's published_at is eligible.
 * A missing or older stored value moves forward. An equal or newer stored
 * value stays, so the column never moves backward.
 * @param {string | null | undefined} stored
 * @param {string | null | undefined} publishedAt
 * @returns {string | null}
 */
export function githubUpdateToWrite(stored, publishedAt) {
  const nextRaw = typeof publishedAt === 'string' ? publishedAt.trim() : ''
  if (!nextRaw) return null
  const next = Date.parse(nextRaw)
  if (!Number.isFinite(next)) return null
  const storedRaw = typeof stored === 'string' ? stored.trim() : ''
  if (!storedRaw) return nextRaw
  const current = Date.parse(storedRaw)
  if (!Number.isFinite(current) || next > current) return nextRaw
  return null
}

/**
 * Columns to PATCH. latest_version is included only when the plan adopts one.
 * last_github_update is included whenever the eligible published_at is newer
 * than the stored value, including when the version does not change.
 * @param {ReturnType<typeof planPortUpdate>} plan
 * @param {string | null | undefined} storedUpdate
 * @returns {{ latest_version?: string, last_github_update?: string }}
 */
export function portSyncPatch(plan, storedUpdate) {
  /** @type {{ latest_version?: string, last_github_update?: string }} */
  const body = {}
  const version = versionToWrite(plan)
  if (version) body.latest_version = version
  const date = githubUpdateToWrite(storedUpdate, plan?.published_at)
  if (date) body.last_github_update = date
  return body
}
