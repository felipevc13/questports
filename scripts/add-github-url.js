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

const sql = `
ALTER TABLE ports ADD COLUMN IF NOT EXISTS github_url text;

UPDATE ports SET github_url = 'https://github.com/DrBeef/RTCWQuest' WHERE slug = 'rtcwquest';
UPDATE ports SET github_url = 'https://github.com/DrBeef/Lambda1VR' WHERE slug = 'lambda1vr';
UPDATE ports SET github_url = 'https://github.com/DrBeef/Doom3Quest' WHERE slug = 'doom3quest';
UPDATE ports SET github_url = 'https://github.com/DrBeef/QuestZDoom' WHERE slug = 'questzdoom';
UPDATE ports SET github_url = 'https://github.com/DrBeef/JKXR' WHERE slug = 'jkxr';
UPDATE ports SET github_url = 'https://github.com/DrBeef/Quake2Quest' WHERE slug = 'quake2quest';
UPDATE ports SET github_url = 'https://github.com/amwatson/CitraVR' WHERE slug = 'citravr';
UPDATE ports SET github_url = 'https://github.com/lvonasek/PreyVR' WHERE slug = 'preyvr';
`

console.log('Adding github_url column and populating verified repositories...')
const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: sql })
})

const data = await res.json()
if (!res.ok) {
  console.error('Failed:', data)
} else {
  console.log('Successfully updated Supabase DB with github_url!')
}
