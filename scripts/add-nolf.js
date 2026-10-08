import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import { INITIAL_PORTS } from '../app/data/mockPorts.ts'

const envFile = fs.readFileSync('.env', 'utf8')
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => {
      const i = line.indexOf('=')
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()]
    })
)

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const port = INITIAL_PORTS.find(p => p.slug === 'nolf-vr')
if (!port) {
  console.error('nolf-vr missing from INITIAL_PORTS')
  process.exit(1)
}

async function run() {
  const coverBuffer = fs.readFileSync('public/covers/nolf-vr.png')
  const { error: uploadError } = await supabase.storage
    .from('port-covers')
    .upload('nolf-vr.png', coverBuffer, { contentType: 'image/png', upsert: true })

  if (uploadError) {
    console.error('Cover upload failed:', uploadError.message)
    process.exit(1)
  }

  const { data: publicUrlData } = supabase.storage.from('port-covers').getPublicUrl('nolf-vr.png')
  const coverUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`

  const payload = {
    slug: port.slug,
    title: port.title,
    developer: port.developer,
    developer_url: port.developer_url,
    short_description: port.short_description,
    category: port.category,
    status: port.status,
    cover_image_url: coverUrl,
    youtube_video_id: port.youtube_video_id,
    supported_hardware: port.supported_hardware,
    locomotion_types: port.locomotion_types,
    has_6dof_controls: port.has_6dof_controls,
    internal_storage_path: port.internal_storage_path,
    base_game_url: port.base_game_url,
    base_game_store: port.base_game_store,
    port_download_url: port.port_download_url,
    port_download_source: port.port_download_source,
    github_url: port.github_url,
    latest_version: port.latest_version,
    last_github_update: port.last_github_update,
    featured: port.featured,
    installation_guide: port.installation_guide,
    troubleshooting_notes: port.troubleshooting_notes
  }

  const { data, error } = await supabase
    .from('ports')
    .upsert(payload, { onConflict: 'slug' })
    .select('slug, title, latest_version, youtube_video_id, port_download_url')

  if (error) {
    console.error('Upsert failed:', error.message)
    process.exit(1)
  }

  console.log('Upserted', data)
}

run()
