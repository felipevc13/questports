import { normalizeVersionKey } from '../../app/lib/versionFormat.ts'
import { pickPreferredReleaseDownload } from '../../server/utils/apkAssetPicker.ts'

/**
 * Per-slug overrides for the catalog-driven repo list. Keep this small: the
 * default comes from ports.github_url and the stored download URL.
 *   repo       sync a different GitHub repo than github_url
 *   tagPrefix  only releases whose tag starts with this prefix (then a version)
 *   skip       reason the port is not synced
 * @type {Record<string, { repo?: string, tagPrefix?: string, skip?: string }>}
 */
export const SYNC_OVERRIDES = {}

/**
 * owner/repo from a github.com URL, or null.
 * @param {string | null | undefined} url
 * @returns {string | null}
 */
export function parseGithubRepo(url) {
  if (typeof url !== 'string') return null
  let parsed
  try {
    parsed = new URL(url.trim())
  } catch {
    return null
  }
  if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') return null
  const [owner, repo] = parsed.pathname.split('/').filter(Boolean)
  if (!owner || !repo) return null
  return `${owner}/${repo.replace(/\.git$/, '')}`
}

/**
 * How the install button reaches the APK.
 *   pinned   /releases/download/<tag>/<asset> (or /releases/tag/<tag>) on the synced repo
 *   dynamic  /releases/latest..., /releases, or the repo page; follows GitHub on its own
 *   external anything else (another host, another repo, a blob page)
 * @param {string | null | undefined} downloadUrl
 * @param {string} repo owner/repo
 * @returns {{ kind: 'pinned', tag: string, asset: string | null } | { kind: 'dynamic' } | { kind: 'external' }}
 */
export function classifyDownloadUrl(downloadUrl, repo) {
  const urlRepo = parseGithubRepo(downloadUrl)
  if (!urlRepo || urlRepo.toLowerCase() !== repo.toLowerCase()) return { kind: 'external' }
  const parts = new URL(String(downloadUrl).trim()).pathname.split('/').filter(Boolean).slice(2).map(decodeURIComponent)
  if (parts.length === 0) return { kind: 'dynamic' }
  if (parts[0] !== 'releases') return { kind: 'external' }
  if (parts.length === 1 || parts[1] === 'latest') return { kind: 'dynamic' }
  if (parts[1] === 'download' && parts[2] && parts[2] !== 'latest') {
    return { kind: 'pinned', tag: parts[2], asset: parts[3] || null }
  }
  if (parts[1] === 'tag' && parts[2]) return { kind: 'pinned', tag: parts[2], asset: null }
  return { kind: 'external' }
}

/**
 * Letters before the version in a prefixed tag: 'daytona-v0.1.8' -> 'daytona-',
 * 'vr-v0.2.1' -> 'vr-', 'unbound-0.14' -> 'unbound-'. Plain tags return ''.
 * @param {string | null | undefined} tag
 * @returns {string}
 */
export function inferTagPrefix(tag) {
  const match = String(tag || '').trim().match(/^([a-z][a-z0-9]*(?:[-_][a-z][a-z0-9]*)*[-_])v?\d/i)
  return match ? match[1].toLowerCase() : ''
}

/**
 * True when the tag belongs to this port.
 * A prefix needs that prefix and then a version. With no prefix, a repo that
 * ships several games (strict) only accepts plain version tags such as v0.2.7.
 * @param {string | null | undefined} tag
 * @param {string} prefix
 * @param {boolean} strict
 */
export function tagMatchesPrefix(tag, prefix, strict) {
  const value = String(tag || '').trim().toLowerCase()
  if (prefix) return value.startsWith(prefix) && /^v?\d/.test(value.slice(prefix.length))
  if (!strict) return true
  return /^v?\d/.test(value)
}

/**
 * Asset name with its version numbers blanked, so the same file across
 * releases compares equal: 'WakerQuest-1.0.7.apk' -> 'wakerquest-#.apk'.
 * @param {string | null | undefined} name
 * @returns {string}
 */
export function assetNameKey(name) {
  return String(name || '').toLowerCase().replace(/\d+(?:[._-]\d+)*/g, '#')
}

/**
 * One entry per port that has a GitHub repo. Repos shared by several ports
 * (one repo, several games) are marked so tags and assets are filtered strictly.
 * @param {Array<{ slug: string, github_url?: string | null, latest_version?: string | null, port_download_url?: string | null }>} rows
 * @param {typeof SYNC_OVERRIDES} [overrides]
 */
export function buildSyncTargets(rows, overrides = SYNC_OVERRIDES) {
  /** @type {{ slug: string, reason: string }[]} */
  const skipped = []
  const targets = []
  for (const row of rows) {
    const override = overrides[row.slug] || {}
    if (override.skip) {
      skipped.push({ slug: row.slug, reason: override.skip })
      continue
    }
    const repo = override.repo || parseGithubRepo(row.github_url)
    if (!repo) {
      skipped.push({ slug: row.slug, reason: row.github_url ? 'github_url is not a GitHub repo' : 'no github_url' })
      continue
    }
    const download = classifyDownloadUrl(row.port_download_url, repo)
    const prefixSource = download.kind === 'pinned' ? download.tag : row.latest_version
    targets.push({
      slug: row.slug,
      repo,
      tagPrefix: override.tagPrefix ?? inferTagPrefix(prefixSource),
      download,
      sharedRepo: false
    })
  }

  const counts = new Map()
  for (const target of targets) {
    const key = target.repo.toLowerCase()
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  for (const target of targets) target.sharedRepo = counts.get(target.repo.toLowerCase()) > 1

  return { targets, skipped }
}

/**
 * Split a repo's releases into the ones this port may use and the ones that
 * belong to another game. In a shared repo, a release must also carry an asset
 * named like the one the port installs today (two games can share one tag).
 * @param {ReturnType<typeof buildSyncTargets>['targets'][number]} target
 * @param {any[]} releases
 */
export function releasesForTarget(target, releases) {
  const storedKey = target.download.kind === 'pinned' && target.download.asset ? assetNameKey(target.download.asset) : ''
  /** @type {any[]} */
  const kept = []
  /** @type {{ tag: string, reason: string }[]} */
  const otherGame = []
  for (const release of releases || []) {
    const tag = release?.tag_name || release?.name || ''
    if (!tagMatchesPrefix(tag, target.tagPrefix, target.sharedRepo)) {
      otherGame.push({ tag, reason: 'other tag prefix' })
      continue
    }
    if (target.sharedRepo && storedKey) {
      const names = (release?.assets || []).map(asset => assetNameKey(asset?.name))
      if (!names.includes(storedKey)) {
        otherGame.push({ tag, reason: 'no asset for this game' })
        continue
      }
    }
    kept.push(release)
  }
  return { releases: kept, otherGame }
}

/**
 * The asset the install button should point at in the selected release.
 * Same name pattern as today's asset first. Otherwise, in a single-game repo,
 * the Quest build that pickPreferredReleaseDownload scores best, with the same
 * file type as today's asset.
 * @param {{ assets?: Array<{ name: string, browser_download_url: string }> } | null | undefined} release
 * @param {string | null} storedAsset
 * @param {{ sharedRepo: boolean }} options
 * @returns {{ name: string, browser_download_url: string, match: 'same name' | 'scored' } | null}
 */
export function pickSyncAsset(release, storedAsset, { sharedRepo }) {
  const assets = (release?.assets || []).filter(asset => asset?.name && asset?.browser_download_url)
  if (storedAsset) {
    const key = assetNameKey(storedAsset)
    const same = assets.find(asset => assetNameKey(asset.name) === key)
    if (same) return { name: same.name, browser_download_url: same.browser_download_url, match: 'same name' }
  }
  if (sharedRepo) return null
  const extension = storedAsset?.toLowerCase().match(/\.(apk|zip)$/)?.[1]
  const pool = extension ? assets.filter(asset => asset.name.toLowerCase().endsWith(`.${extension}`)) : assets
  const picked = pickPreferredReleaseDownload(pool)
  if (!picked) return null
  if (/(windows|win64|pcvr|macos|linux)/i.test(picked.name) && !/quest/i.test(picked.name)) return null
  return { name: picked.name, browser_download_url: picked.browser_download_url, match: 'scored' }
}

/**
 * Packages the one-click installer accepts for a slug.
 * @param {{ packageName?: string, altPackages?: string[] } | null | undefined} config
 * @returns {string[]}
 */
export function expectedPackages(config) {
  if (!config?.packageName) return []
  return [config.packageName, ...(config.altPackages || [])]
}

/**
 * Apply the install-button rule to a version plan: never list a version the
 * download does not deliver.
 *   dynamic URL  version may move, URL stays
 *   pinned URL   version moves only with a matching asset whose package checked out;
 *                the URL moves with it. A same-version plan whose URL still points
 *                at an older tag gets the URL aligned.
 *   external     version does not move
 * `asset` and `packageCheck` come from the caller (network work lives in the script).
 * @param {any} plan from planPortUpdate
 * @param {ReturnType<typeof buildSyncTargets>['targets'][number]} target
 * @param {{ asset?: { browser_download_url: string, name: string } | null, packageCheck?: { ok: boolean, detail: string } | null }} found
 */
export function applyDownloadRule(plan, target, found = {}) {
  const need = downloadCheckNeeded(plan, target)
  if (need === 'none') return plan
  if (need === 'blocked') return block(plan, 'download is not a GitHub release of this repo')
  const wantsVersion = plan.action === 'update'
  if (!found.asset) return block(plan, `no matching Quest asset in ${plan.selectedTag}`)
  if (!found.packageCheck?.ok) {
    return block(plan, `package check failed: ${found.packageCheck?.detail || 'not run'}`)
  }
  return {
    ...plan,
    action: 'update',
    reason: wantsVersion ? plan.reason : 'align download with listed version',
    latest_version: wantsVersion ? plan.latest_version : plan.previous,
    alignOnly: !wantsVersion,
    port_download_url: found.asset.browser_download_url
  }
}

/**
 * What applyDownloadRule needs before it can decide.
 *   none     the plan stands as it is
 *   blocked  the version cannot move (download is not this repo's release)
 *   asset    pick the selected release's asset and check its package first
 * @param {any} plan
 * @param {ReturnType<typeof buildSyncTargets>['targets'][number]} target
 * @returns {'none' | 'blocked' | 'asset'}
 */
export function downloadCheckNeeded(plan, target) {
  const download = target.download
  if (plan.action === 'update') {
    if (download.kind === 'dynamic') return 'none'
    if (download.kind === 'external') return 'blocked'
    return download.tag === plan.selectedTag ? 'none' : 'asset'
  }
  const pinnedBehind = download.kind === 'pinned'
    && plan.action === 'keep'
    && plan.reason === 'same version'
    && Boolean(plan.selectedTag)
    && normalizeVersionKey(download.tag) !== normalizeVersionKey(plan.selectedTag)
  return pinnedBehind ? 'asset' : 'none'
}

/**
 * @param {any} plan
 * @param {string} reason
 */
function block(plan, reason) {
  return {
    ...plan,
    action: 'blocked',
    latest_version: plan.previous,
    wanted_version: plan.action === 'update' ? plan.latest_version : null,
    reason
  }
}

/**
 * True when a guide still names the old version after a bump, e.g. "v1.0.7"
 * or "1.0.7" in installation_guide.
 * @param {string | null | undefined} guide
 * @param {string | null | undefined} oldVersion
 */
export function guideMentionsVersion(guide, oldVersion) {
  const text = String(guide || '')
  const bare = String(oldVersion || '').trim().replace(/^v/i, '')
  if (!text || !bare || !/\d/.test(bare)) return false
  const escaped = bare.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^0-9.])v?${escaped}(?![0-9]|\\.[0-9])`, 'i').test(text)
}
