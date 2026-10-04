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

// 100% Authentic game and project cover assets (Steam official CDN & verified project assets)
const COVERS = [
  {
    slug: 'rtcwquest',
    url: 'https://shared.steamstatic.com/store_item_assets/steam/apps/9010/header.jpg'
  },
  {
    slug: 'lambda1vr',
    url: 'https://shared.steamstatic.com/store_item_assets/steam/apps/70/header.jpg'
  },
  {
    slug: 'doom3quest',
    url: 'https://shared.steamstatic.com/store_item_assets/steam/apps/9050/header.jpg'
  },
  {
    slug: 'questzdoom',
    url: 'https://shared.steamstatic.com/store_item_assets/steam/apps/2280/header.jpg'
  },
  {
    slug: 'jkxr',
    url: 'https://shared.steamstatic.com/store_item_assets/steam/apps/6030/header.jpg'
  },
  {
    slug: 'quake2quest',
    url: 'https://shared.steamstatic.com/store_item_assets/steam/apps/2320/header.jpg'
  },
  {
    slug: 'citravr',
    url: 'https://cdn.sidequestvr.com/file/548030/citravr_logo_dark_blue.png'
  },
  {
    slug: 'preyvr',
    url: 'https://shared.steamstatic.com/store_item_assets/steam/apps/3970/header.jpg'
  }
]

async function run() {
  console.log('--- Syncing Covers to Supabase Storage ---')

  for (const item of COVERS) {
    try {
      console.log(`Fetching image for ${item.slug}...`)
      const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!res.ok) {
        console.warn(`Could not fetch ${item.url} (${res.status})`)
        continue
      }

      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const fileName = `${item.slug}.jpg`

      // Upload to Supabase Storage bucket 'port-covers'
      const { error: uploadError } = await supabase.storage
        .from('port-covers')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (item.slug === 'preyvr') {
        await supabase.storage
          .from('port-covers')
          .upload('preyvr_v2.jpg', buffer, {
            contentType: 'image/jpeg',
            upsert: true
          })
      }

      if (uploadError) {
        console.error(`Failed to upload ${fileName} to Supabase:`, uploadError.message)
        continue
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('port-covers')
        .getPublicUrl(fileName)

      const publicUrl = publicUrlData.publicUrl
      console.log(`Uploaded to Supabase: ${publicUrl}`)

      // Update database table
      const { error: dbError } = await supabase
        .from('ports')
        .update({ cover_image_url: publicUrl })
        .eq('slug', item.slug)

      if (dbError) {
        console.error(`Failed to update DB for ${item.slug}:`, dbError.message)
      } else {
        console.log(`Updated database record for ${item.slug}!`)
      }
    } catch (err) {
      console.error(`Error processing ${item.slug}:`, err)
    }
  }

  console.log('--- Done syncing covers! ---')
}

run()
