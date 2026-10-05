import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const envFile = fs.readFileSync('.env', 'utf8')
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
)

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function run() {
  const ogBuffer = fs.readFileSync('public/og-image.png')
  const { error } = await supabase.storage
    .from('port-covers')
    .upload('questports-og.png', ogBuffer, {
      contentType: 'image/png',
      upsert: true
    })

  if (error) {
    console.error('Upload error:', error.message)
    process.exit(1)
  }

  const { data } = supabase.storage.from('port-covers').getPublicUrl('questports-og.png')
  console.log('OG Image uploaded to Supabase:', data.publicUrl)
}

run()
