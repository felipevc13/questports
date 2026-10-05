import fs from 'node:fs'

let env = {}
if (fs.existsSync('.env')) {
  const envFile = fs.readFileSync('.env', 'utf8')
  env = Object.fromEntries(
    envFile
      .split('\n')
      .filter(line => line && !line.startsWith('#') && line.includes('='))
      .map(line => line.split('=').map(s => s.trim()))
  )
}

const supabaseUrl = process.env.SUPABASE_URL || env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || ''
const githubToken = process.env.GITHUB_TOKEN || ''

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
  { slug: 'gta-sa-vr-quest', repo: 'dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest' }
]

async function run() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
    process.exit(1)
  }

  console.log(`--- Synchronizing GitHub stats for ${repos.length} ports ---`)

  const ghHeaders = {
    'User-Agent': 'QuestPorts'
  }
  if (githubToken) {
    ghHeaders['Authorization'] = `token ${githubToken}`
  }

  for (const item of repos) {
    try {
      console.log(`Checking ${item.repo} (${item.slug})...`)
      
      // Try to fetch latest release
      const relRes = await fetch(`https://api.github.com/repos/${item.repo}/releases/latest`, {
        headers: ghHeaders
      })
      
      let version = 'Latest'
      let date = null

      if (relRes.ok) {
        const relData = await relRes.json()
        let rawVersion = relData.tag_name || 'Latest'
        version = rawVersion.replace(/^winlatorxr[_-]/i, '')
        date = relData.published_at
      }

      if (!date) {
        // Fallback to repository last push
        const repoRes = await fetch(`https://api.github.com/repos/${item.repo}`, {
          headers: ghHeaders
        })
        if (repoRes.ok) {
          const repoData = await repoRes.json()
          date = repoData.pushed_at || new Date().toISOString()
        }
      }

      if (!date) {
        date = new Date().toISOString()
      }

      console.log(`  -> ${item.slug}: Version ${version}, Date ${date}`)

      // Update in Supabase via PostgREST PATCH
      const patchRes = await fetch(`${supabaseUrl}/rest/v1/ports?slug=eq.${item.slug}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          latest_version: version,
          last_github_update: date
        })
      })

      if (!patchRes.ok) {
        const errText = await patchRes.text()
        console.error(`  -> Failed to update ${item.slug}:`, errText)
      } else {
        console.log(`  -> Successfully updated ${item.slug} in Supabase!`)
      }
    } catch (err) {
      console.error(`Error processing ${item.slug}:`, err)
    }
  }

  console.log('--- Sincronização concluída com sucesso! ---')
}

run()
