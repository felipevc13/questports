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
  console.log('--- Updating GTA San Andreas Cover with User-Chosen Image ---')
  const gtasaCoverBuffer = fs.readFileSync('/tmp/gtasa_cover.jpg')
  const gtasaFileName = 'gtasa_vr.jpg'

  const { error: uploadError } = await supabase.storage
    .from('port-covers')
    .upload(gtasaFileName, gtasaCoverBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (uploadError) {
    console.error('Error uploading GTASA cover:', uploadError.message)
    process.exit(1)
  }

  const { data: publicUrlData } = supabase.storage
    .from('port-covers')
    .getPublicUrl(gtasaFileName)

  const publicCoverUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
  console.log('GTASA Cover uploaded successfully:', publicCoverUrl)

  const { error: updateError } = await supabase
    .from('ports')
    .update({ cover_image_url: publicCoverUrl })
    .eq('slug', 'gta-sa-vr-quest')

  if (updateError) {
    console.error('Error updating port:', updateError.message)
    process.exit(1)
  }

  console.log('GTA San Andreas Port successfully updated with user-chosen SteamGridDB cover!')
}

run()
