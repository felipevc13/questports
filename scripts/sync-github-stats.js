/**
 * Refresh ports.latest_version and ports.last_github_update from GitHub
 * releases that actually ship a Quest or Android build.
 *
 * Every catalog row with a GitHub github_url is synced (SYNC_OVERRIDES in
 * scripts/lib/portSyncTargets.js covers the exceptions). A repo that ships
 * several games only gives a port the releases with its own tag prefix
 * (daytona-v..., hotd-v...) or, when the games share one tag, its own asset.
 *
 * A port whose port_download_url pins /releases/download/<tag>/ moves to the
 * new release's matching Quest asset in the same PATCH, after the APK's
 * Android package is checked against PORT_PACKAGE_CONFIGS. If no asset
 * matches or the package differs, the version is not bumped. Guides are not
 * rewritten; the run log lists guides that still name the old version.
 *
 * latest_version changes only when the selected release is a newer catalog
 * version. last_github_update moves forward to that release's published_at
 * even when the version stays the same. It never moves backward. Drafts and
 * desktop-only releases stay ineligible.
 *
 * Dry-run (prints the writes, does not PATCH):
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node --experimental-strip-types scripts/sync-github-stats.js --dry-run
 *
 * The service role key is a GitHub Actions secret. It is never printed.
 */
import fs from 'node:fs'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap.ts'
import { readApkPackage } from './lib/apkPackage.mjs'
import {
  applyDownloadRule,
  buildSyncTargets,
  downloadCheckNeeded,
  expectedPackages,
  guideMentionsVersion,
  pickSyncAsset,
  releasesForTarget
} from './lib/portSyncTargets.js'
import { planPortUpdate, portSyncPatch, versionToWrite } from './lib/selectQuestRelease.js'

let env = {}
if (fs.existsSync('.env')) {
  const envFile = fs.readFileSync('.env', 'utf8')
  env = Object.fromEntries(
    envFile
      .split('\n')
      .filter(line => line && !line.startsWith('#') && line.includes('='))
      .map(line => {
        const index = line.indexOf('=')
        return [line.slice(0, index).trim(), line.slice(index + 1).trim()]
      })
  )
}

const supabaseUrl = (process.env.SUPABASE_URL || env.SUPABASE_URL || '').trim()
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
const githubToken = (process.env.GITHUB_TOKEN || env.GITHUB_TOKEN || '').trim()
const dryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true'

function describePlan(slug, plan) {
  const skipped = plan.skipped
    .filter(item => item.reason !== 'draft')
    .slice(0, 4)
    .map(item => `${item.tag} (${item.reason})`)
    .join(', ')
  const skipSuffix = skipped ? `; skipped ${skipped}` : ''
  const channel = plan.prereleaseOnly ? '; prerelease is the only channel' : ''
  if (plan.action === 'leave') {
    const shown = plan.previous == null || plan.previous === '' ? 'null' : JSON.stringify(plan.previous)
    return `${slug}: no Quest/Android release; leave ${shown}${skipSuffix}`
  }
  if (plan.action === 'blocked') {
    const shown = plan.previous == null ? 'null' : plan.previous
    return `${slug}: keep ${shown}, not ${plan.wanted_version || plan.selectedTag} (${plan.reason})${channel}${skipSuffix}`
  }
  if (plan.action === 'keep') {
    const shown = plan.previous == null ? 'null' : plan.previous
    return `${slug}: keep ${shown} (${plan.reason}; selected ${plan.selectedTag})${channel}${skipSuffix}`
  }
  const from = plan.previous == null || plan.previous === '' ? 'null' : plan.previous
  if (plan.alignOnly) return `${slug}: keep ${from}, download -> ${plan.selectedTag} (${plan.reason})${skipSuffix}`
  return `${slug}: ${from} -> ${plan.latest_version} (${plan.reason})${channel}${skipSuffix}`
}

async function fetchAllReleases(repo, headers) {
  /** @type {any[]} */
  const all = []
  let url = `https://api.github.com/repos/${repo}/releases?per_page=100`
  for (let page = 0; page < 5 && url; page++) {
    const res = await fetch(url, { headers })
    if (res.status === 404) return []
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`GitHub ${res.status} for ${repo}: ${body.slice(0, 200)}`)
    }
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) break
    all.push(...data)
    const link = res.headers.get('link') || ''
    const next = link.match(/<([^>]+)>;\s*rel="next"/)
    url = next ? next[1] : ''
  }
  return all
}

async function fetchCatalog() {
  const columns = 'slug,github_url,latest_version,last_github_update,port_download_url,installation_guide'
  const res = await fetch(`${supabaseUrl}/rest/v1/ports?select=${columns}&order=slug`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Could not read ports: ${res.status} ${body.slice(0, 300)}`)
  }
  return res.json()
}

/**
 * Android package of the new asset must be one the installer knows for this
 * slug. A slug without a PORT_PACKAGE_CONFIGS entry must keep the package of
 * the asset it installs today.
 * @param {string} slug
 * @param {string} assetUrl
 * @param {string | null | undefined} storedUrl
 * @returns {Promise<{ ok: boolean, detail: string }>}
 */
async function checkAssetPackage(slug, assetUrl, storedUrl) {
  try {
    let expected = expectedPackages(PORT_PACKAGE_CONFIGS[slug])
    let source = 'portPackageMap'
    if (expected.length === 0) {
      if (!storedUrl) return { ok: false, detail: 'no package config and no current asset' }
      const current = await readApkPackage(storedUrl)
      if (!current.package) return { ok: false, detail: 'current asset has no package' }
      expected = [current.package]
      source = 'current asset'
    }
    const next = await readApkPackage(assetUrl)
    if (!next.package) return { ok: false, detail: 'new asset has no package' }
    if (!expected.includes(next.package)) {
      return { ok: false, detail: `${next.package}, expected ${expected.join(' or ')} (${source})` }
    }
    return { ok: true, detail: next.package }
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : String(err) }
  }
}

async function patchPort(slug, body) {
  const res = await fetch(`${supabaseUrl}/rest/v1/ports?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase ${res.status}: ${text.slice(0, 300)}`)
  }
}

async function pruneOldAnalytics(days = 60) {
  if (dryRun) {
    console.log(`[retention] dry run: would prune analytics_events older than ${days} days`)
    return
  }
  const cutoff = new Date(Date.now() - days * 86400 * 1000).toISOString()
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/analytics_events?created_at=lt.${cutoff}`, {
      method: 'DELETE',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'count=exact'
      }
    })
    if (!res.ok) {
      const text = await res.text()
      console.warn(`[retention] warning pruning analytics_events: ${res.status} ${text.slice(0, 200)}`)
    } else {
      const range = res.headers.get('content-range') || ''
      console.log(`[retention] pruned analytics_events older than ${days} days (${range || 'ok'})`)
    }
  } catch (err) {
    console.warn('[retention] warning during analytics retention cleanup:', err instanceof Error ? err.message : err)
  }
}

async function run() {
  if (process.argv.includes('--help')) {
    console.log('Usage: node --experimental-strip-types scripts/sync-github-stats.js [--dry-run]')
    console.log('Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Optional GITHUB_TOKEN.')
    return
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
    console.error('Set them as GitHub Actions secrets before this job writes to production.')
    console.error('Preview: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node --experimental-strip-types scripts/sync-github-stats.js --dry-run')
    process.exit(1)
  }

  const ghHeaders = {
    'User-Agent': 'QuestPorts',
    Accept: 'application/vnd.github+json'
  }
  if (githubToken) ghHeaders.Authorization = `Bearer ${githubToken}`

  const rows = await fetchCatalog()
  const { targets, skipped: notSynced } = buildSyncTargets(rows)
  const bySlug = new Map(rows.map(row => [row.slug, row]))
  const shared = new Set(targets.filter(target => target.sharedRepo).map(target => target.repo))
  console.log(`--- ${dryRun ? 'Dry run' : 'Sync'} for ${targets.length} of ${rows.length} ports (${shared.size} shared repo(s)) ---`)

  /** @type {Map<string, Promise<any[]>>} */
  const releaseCache = new Map()
  const releasesOf = repo => {
    const key = repo.toLowerCase()
    if (!releaseCache.has(key)) releaseCache.set(key, fetchAllReleases(repo, ghHeaders))
    return releaseCache.get(key)
  }

  let failures = 0
  let writes = 0
  /** @type {string[]} */
  const bumped = []
  /** @type {string[]} */
  const aligned = []
  /** @type {string[]} */
  const blocked = []
  /** @type {string[]} */
  const guideWarnings = []

  for (const target of targets) {
    const slug = target.slug
    try {
      const row = bySlug.get(slug)
      const current = row?.latest_version ?? null
      const storedUpdate = row?.last_github_update ?? null
      const { releases, otherGame } = releasesForTarget(target, await releasesOf(target.repo))
      let plan = planPortUpdate(current, releases)
      const written = versionToWrite(plan)
      if (written === 'Latest' || written === 'latest') {
        throw new Error(`Refusing to write placeholder version for ${slug}`)
      }

      const need = downloadCheckNeeded(plan, target)
      /** @type {{ asset?: any, packageCheck?: { ok: boolean, detail: string } | null }} */
      const found = {}
      if (need === 'asset') {
        const release = releases.find(item => (item.tag_name || item.name) === plan.selectedTag)
        const storedAsset = target.download.kind === 'pinned' ? target.download.asset : null
        found.asset = pickSyncAsset(release, storedAsset, { sharedRepo: target.sharedRepo })
        if (found.asset) {
          found.packageCheck = await checkAssetPackage(slug, found.asset.browser_download_url, row?.port_download_url)
        }
      }
      plan = applyDownloadRule(plan, target, found)

      const prefixNote = target.tagPrefix ? ` [tags ${target.tagPrefix}*]` : ''
      const otherNote = otherGame.length ? ` [${otherGame.length} other-game release(s) ignored]` : ''
      console.log(`${describePlan(slug, plan)}${prefixNote}${otherNote}`)

      const body = portSyncPatch(plan, storedUpdate)
      if (body.port_download_url) {
        console.log(`  download ${row?.port_download_url || 'null'}`)
        console.log(`        -> ${body.port_download_url} (${found.asset?.match}, package ${found.packageCheck?.detail})`)
      }
      if (plan.action === 'blocked') blocked.push(`${slug}: ${plan.reason}`)
      if (body.latest_version) {
        bumped.push(`${slug} ${current ?? 'null'} -> ${body.latest_version}`)
        if (plan.reason !== 'canonicalize' && guideMentionsVersion(row?.installation_guide, current)) {
          guideWarnings.push(`${slug}: installation_guide still mentions ${current}`)
        }
      } else if (body.port_download_url) {
        aligned.push(`${slug} download -> ${plan.selectedTag}`)
      }

      if (Object.keys(body).length === 0) continue
      if (body.last_github_update && !body.latest_version && !body.port_download_url) {
        console.log(`  date ${storedUpdate || 'null'} -> ${body.last_github_update}`)
      }
      if (dryRun) {
        writes += 1
        continue
      }
      await patchPort(slug, body)
      writes += 1
      console.log(`  wrote ${slug}`)
    } catch (err) {
      failures += 1
      console.error(`  failed ${slug}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log('')
  console.log(`Not synced (${notSynced.length}): ${notSynced.map(item => `${item.slug} (${item.reason})`).join(', ') || 'none'}`)
  console.log(`Version bumps (${bumped.length}):`)
  for (const line of bumped) console.log(`  ${line}`)
  console.log(`Download aligned to listed version (${aligned.length}):`)
  for (const line of aligned) console.log(`  ${line}`)
  console.log(`Held back, download could not follow (${blocked.length}):`)
  for (const line of blocked) console.log(`  ${line}`)
  console.log(`Guide mentions old version (${guideWarnings.length}), not rewritten:`)
  for (const line of guideWarnings) console.log(`  warning ${line}`)
  console.log('')

  await pruneOldAnalytics(60)

  console.log(`--- ${dryRun ? 'Dry run' : 'Sync'} finished: ${writes} write(s), ${failures} failure(s) ---`)
  if (failures) process.exit(1)
}

run()
