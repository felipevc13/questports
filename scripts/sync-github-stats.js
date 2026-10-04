import fs from 'node:fs'

const envFile = fs.readFileSync('.env', 'utf8')
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
)

const token = process.env.SUPABASE_ACCESS_TOKEN || env.SUPABASE_ACCESS_TOKEN || ''
const projectRef = 'ccjteoxolasldhfgnoyx'

const repos = [
  { slug: 'rtcwquest', repo: 'DrBeef/RTCWQuest' },
  { slug: 'lambda1vr', repo: 'DrBeef/Lambda1VR' },
  { slug: 'doom3quest', repo: 'DrBeef/Doom3Quest' },
  { slug: 'questzdoom', repo: 'DrBeef/QuestZDoom' },
  { slug: 'jkxr', repo: 'DrBeef/JKXR' },
  { slug: 'quake2quest', repo: 'DrBeef/Quake2Quest' },
  { slug: 'citravr', repo: 'amwatson/CitraVR' },
  { slug: 'preyvr', repo: 'lvonasek/PreyVR' }
]

async function run() {
  console.log('--- Adding columns to Supabase if not present ---')
  const alterSql = `
    ALTER TABLE ports ADD COLUMN IF NOT EXISTS last_github_update timestamptz;
    ALTER TABLE ports ADD COLUMN IF NOT EXISTS latest_version text;
  `

  await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: alterSql })
  })

  console.log('--- Fetching real stats from GitHub API ---')
  const updates = []

  for (const item of repos) {
    try {
      console.log(`Checking ${item.repo}...`)
      // Fetch release info
      const relRes = await fetch(`https://api.github.com/repos/${item.repo}/releases/latest`, {
        headers: { 'User-Agent': 'QuestPorts' }
      })
      const relData = await relRes.json()

      let version = relData.tag_name || 'Latest'
      let date = relData.published_at

      if (!date) {
        // Fallback to repo pushed_at
        const repoRes = await fetch(`https://api.github.com/repos/${item.repo}`, {
          headers: { 'User-Agent': 'QuestPorts' }
        })
        const repoData = await repoRes.json()
        date = repoData.pushed_at || new Date().toISOString()
      }

      console.log(`-> ${item.slug}: Version ${version}, Date ${date}`)
      updates.push({ slug: item.slug, version, date })
    } catch (err) {
      console.error(`Error fetching for ${item.slug}:`, err)
    }
  }

  // Update Supabase records
  const updateStatements = updates
    .map(u => `UPDATE ports SET latest_version = '${u.version}', last_github_update = '${u.date}' WHERE slug = '${u.slug}';`)
    .join('\n')

  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: updateStatements })
  })

  const resData = await res.json()
  if (!res.ok) {
    console.error('Failed to update Supabase:', resData)
  } else {
    console.log('--- Successfully synchronized GitHub stats to Supabase! ---')
  }
}

run()
