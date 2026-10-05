import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const envFile = fs.readFileSync('.env', 'utf8')
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
)

const supabaseUrl = env.SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  console.log('--- Updating GTA Vice City Cover with User-Chosen Image ---')
  const coverBuffer = fs.readFileSync('/tmp/vicecity_cover.jpg')
  const fileName = 'vicecity_vr.jpg'

  const { error: uploadError } = await supabase.storage
    .from('port-covers')
    .upload(fileName, coverBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (uploadError) {
    console.error('Error uploading Vice City cover:', uploadError.message)
    process.exit(1)
  }

  const { data: publicUrlData } = supabase.storage
    .from('port-covers')
    .getPublicUrl(fileName)

  const publicCoverUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
  console.log('Vice City Cover uploaded successfully:', publicCoverUrl)

  const { error: updateError } = await supabase
    .from('ports')
    .update({ cover_image_url: publicCoverUrl })
    .eq('slug', 'vice-city-vr-quest')

  if (updateError) {
    console.error('Error updating port:', updateError.message)
    process.exit(1)
  }

  console.log('GTA Vice City Port successfully updated with user-chosen SteamGridDB cover!')
}

run()
