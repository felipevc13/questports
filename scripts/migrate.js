import fs from 'node:fs'

const envFile = fs.readFileSync('.env', 'utf8')
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
)

const token = process.env.SUPABASE_ACCESS_TOKEN || env.SUPABASE_SERVICE_ROLE_KEY
const projectRef = 'ccjteoxolasldhfgnoyx'
const sqlFile = './supabase/full_setup.sql'

const sql = fs.readFileSync(sqlFile, 'utf8')

console.log(`Running database migration on Supabase project ${projectRef}...`)

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
  console.error('Migration failed:', data)
  process.exit(1)
} else {
  console.log('Migration successful!')
  console.log('Result:', data)
}
