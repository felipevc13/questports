/**
 * Refresh ports.latest_version from GitHub releases that actually ship a
 * Quest or Android build.
 *
 * Dry-run (prints the writes, does not PATCH):
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/sync-github-stats.js --dry-run
 *
 * The service role key is a GitHub Actions secret. It is never printed.
 */
import fs from 'node:fs'
import { planPortUpdate, versionToWrite } from './lib/selectQuestRelease.js'

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

const repos = [
  { slug: 'rtcwquest', repo: 'DrBeef/RTCWQuest' },
  { slug: 'lambda1vr', repo: 'DrBeef/Lambda1VR' },
  { slug: 'doom3quest', repo: 'DrBeef/Doom3Quest' },
  { slug: 'questzdoom', repo: 'DrBeef/QuestZDoom' },
  { slug: 'jkxr', repo: 'DrBeef/JKXR' },
  { slug: 'quake2quest', repo: 'DrBeef/Quake2Quest' },
  { slug: 'citravr', repo: 'amwatson/CitraVR' },
  { slug: 'preyvr', repo: 'lvonasek/PreyVR' },
  { slug: 'beefraiderxr', repo: 'Team-Beef-Studios/BeefRaiderXR' },
  { slug: 'quakequest', repo: 'Team-Beef-Studios/QuakeQuest' },
  { slug: 'razexr', repo: 'Team-Beef-Studios/RazeXR' },
  { slug: 'questcraft', repo: 'QuestCraftPlusPlus/QuestCraft' },
  { slug: 'csvr', repo: 'Team-Beef-Studios/CSVR' },
  { slug: 'ppsspp-vr', repo: 'hrydgard/ppsspp' },
  { slug: 'winlatorxr', repo: 'WinlatorXR/WinlatorXR' },
  { slug: 'time-crisis-vr', repo: 'DR-89/time-crisis-vr' },
  { slug: 'primedgun', repo: 'Nobbie248/PrimedGun' },
  { slug: 'astroquest', repo: 'bigmak94/AstroQuest' },
  { slug: 'sourcevr', repo: 'tinsarfal/SourceVR' },
  { slug: 'simpsonshitrun', repo: 'kote2345/The-Simpsons-Hit-and-Run-VR' },
  { slug: 'halocequest', repo: 'moistman42069/HaloCE-Quest-VR' },
  { slug: 'galaxyquest', repo: 'bigmak94/GalaxyQuest' },
  { slug: 'qualyx', repo: 'tinsarfal/Qualyx' },
  { slug: 'goldeneye-vr', repo: 'MrSco/goldeneye-vr' },
  { slug: 'questcarnage', repo: 'maranone/carnage' },
  { slug: 'gta-sa-vr-quest', repo: 'dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest' },
  { slug: 'vice-city-vr-quest', repo: 'dubrovskiy-yevhen-stakelogic/vice-city-vr-quest' },
  { slug: 'gran-turismo-2-vr', repo: 'dubrovskiy-yevhen-stakelogic/gt-2-pc' },
  { slug: 'gothic2-vr', repo: 'dubrovskiy-yevhen-stakelogic/gothic2-vr' },
  { slug: 'harry-potter-vr', repo: 'dubrovskiy-yevhen-stakelogic/harry-potter-vr' },
  { slug: 'road-rash-jailbreak-vr', repo: 'dubrovskiy-yevhen-stakelogic/road-rash-jailbreak' },
  { slug: 'perfect-dark-vr', repo: 'Alex-LeTux/perfect_dark_VR' },
  { slug: 'avp-vr', repo: 'Bassquake/Aliens-Versus-Predator-VR' },
  { slug: 'questsam', repo: 'maranone/QuestSam' }
]

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
  if (plan.action === 'keep') {
    const shown = plan.previous == null ? 'null' : plan.previous
    return `${slug}: keep ${shown} (${plan.reason}; selected ${plan.selectedTag})${channel}${skipSuffix}`
  }
  const from = plan.previous == null || plan.previous === '' ? 'null' : plan.previous
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
  const res = await fetch(`${supabaseUrl}/rest/v1/ports?select=slug,latest_version,last_github_update`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Could not read ports: ${res.status} ${body.slice(0, 300)}`)
  }
  const rows = await res.json()
  return new Map(rows.map(row => [row.slug, row]))
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

async function run() {
  if (process.argv.includes('--help')) {
    console.log('Usage: node scripts/sync-github-stats.js [--dry-run]')
    console.log('Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Optional GITHUB_TOKEN.')
    return
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
    console.error('Set them as GitHub Actions secrets before this job writes to production.')
    console.error('Preview: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/sync-github-stats.js --dry-run')
    process.exit(1)
  }

  console.log(`--- ${dryRun ? 'Dry run' : 'Sync'} for ${repos.length} ports ---`)

  const ghHeaders = {
    'User-Agent': 'QuestPorts',
    Accept: 'application/vnd.github+json'
  }
  if (githubToken) ghHeaders.Authorization = `Bearer ${githubToken}`

  const catalog = await fetchCatalog()
  let failures = 0
  let writes = 0

  for (const item of repos) {
    try {
      const releases = await fetchAllReleases(item.repo, ghHeaders)
      const current = catalog.get(item.slug)?.latest_version ?? null
      const plan = planPortUpdate(current, releases)
      const written = versionToWrite(plan)
      if (written === 'Latest' || written === 'latest') {
        throw new Error(`Refusing to write placeholder version for ${item.slug}`)
      }
      console.log(describePlan(item.slug, plan))

      if (!written) continue

      const body = { latest_version: written }
      if (plan.published_at) body.last_github_update = plan.published_at
      if (dryRun) {
        writes += 1
        continue
      }
      await patchPort(item.slug, body)
      writes += 1
      console.log(`  wrote ${item.slug}`)
    } catch (err) {
      failures += 1
      console.error(`  failed ${item.slug}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log(`--- ${dryRun ? 'Dry run' : 'Sync'} finished: ${writes} version change(s), ${failures} failure(s) ---`)
  if (failures) process.exit(1)
}

run()
