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
  console.log('--- Uploading Iron Lung VR Cover ---')
  const coverBuffer = fs.readFileSync('/tmp/iron_lung_cover.jpg')
  const fileName = 'iron_lung_vr.jpg'

  const { error: uploadError } = await supabase.storage
    .from('port-covers')
    .upload(fileName, coverBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (uploadError) {
    console.error('Error uploading cover:', uploadError.message)
    process.exit(1)
  }

  const { data: publicUrlData } = supabase.storage
    .from('port-covers')
    .getPublicUrl(fileName)

  const publicCoverUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
  console.log('Cover uploaded successfully:', publicCoverUrl)

  console.log('--- Upserting Iron Lung VR Port ---')
  const portPayload = {
    slug: 'iron-lung-vr',
    title: 'Iron Lung VR',
    developer: 'JackaPacka',
    developer_url: 'https://jackaapacka.itch.io',
    short_description: 'Standalone 6DoF VR recreation of David Szymanski\'s claustrophobic dread submarine horror Iron Lung for Meta Quest. Blindly navigate an alien blood ocean, coordinate points, and operate physical switches and cameras.',
    category: 'game_mod',
    status: 'released',
    cover_image_url: publicCoverUrl,
    youtube_video_id: '9OsjifuYZVg',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Seated Submarine Cockpit', '6DoF Interactive Controls', 'Physical Switches & Levers', 'Still Camera Viewfinder'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (Self-Contained APK)',
    base_game_url: 'https://store.steampowered.com/app/1846170/Iron_Lung/',
    base_game_store: 'Steam (David Szymanski)',
    port_download_url: 'https://sidequestvr.com/app/10349/iron-lung-vr',
    port_download_source: 'SideQuest / Itch.io',
    github_url: 'https://jackaapacka.itch.io/iron-lung-vr',
    latest_version: 'v1.2.0',
    last_github_update: '2026-09-01T12:00:00Z',
    featured: true,
    installation_guide: `### Overview
**Iron Lung VR** is a faithful, ground-up standalone VR recreation of David Szymanski's claustrophobic dread horror submarine simulator *Iron Lung* (2022), created with permission by developer JackaPacka. 

Trapped inside a blind, creaking submarine nicknamed the "Iron Lung", you must navigate through an ocean of blood on a desolate alien moon, blindly plotting coordinates on a map and photographing anomaly locations through an exterior still camera.

> [!NOTE]
> Unlike source ports requiring game asset extraction, **Iron Lung VR** is distributed as a self-contained standalone Quest package with no file dumping required. Support the original developer by purchasing [Iron Lung on Steam](https://store.steampowered.com/app/1846170/Iron_Lung/).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro).
2. **SideQuest** (PC, Mac, Linux, or Mobile app) OR ADB installed.

---

### Step-by-Step Installation Guide

#### Option A: 1-Click Install via SideQuest (Recommended)
1. Open the **SideQuest** application or visit [SideQuest: Iron Lung VR](https://sidequestvr.com/app/10349/iron-lung-vr).
2. Connect your Meta Quest via USB-C cable or wireless ADB.
3. Click **"Sideload / Install to Headset"**.
4. Once completed, put on your headset and launch **Iron Lung VR** from **App Library → Unknown Sources**.

#### Option B: Manual Sideloading (Itch.io APK)
1. Download **\`1.2.0.apk\`** from [JackaPacka's Itch.io page](https://jackaapacka.itch.io/iron-lung-vr).
2. Sideload the APK onto your headset:
   \`\`\`bash
   adb install -r 1.2.0.apk
   \`\`\`
3. Put on your headset, go to **Unknown Sources**, and launch the game.

---

### Seated VR Tips & Troubleshooting
* **Seated Play:** The submarine is cramped and designed to be played seated. If your character height feels too tall, set your Guardian floor level at your waist or use the in-game height slider in the options menu.
* **Controls:** Physically reach out and flip navigation switches, toggle terminal buttons, crank emergency valves, and trigger the shutter camera.`,
    troubleshooting_notes: 'Created with permission from original author David Szymanski. Designed for seated roomscale or stationary guardian.'
  }

  const { data, error } = await supabase
    .from('ports')
    .upsert(portPayload, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Error inserting port:', error.message)
    process.exit(1)
  }

  console.log('Successfully inserted Iron Lung VR port:', data[0]?.title)

  console.log('--- Updating suggestion status in port_suggestions ---')
  const { error: sugError } = await supabase
    .from('port_suggestions')
    .update({ status: 'approved' })
    .eq('title', 'Iron Lung')

  if (sugError) {
    console.warn('Warning updating suggestion status:', sugError.message)
  } else {
    console.log('Suggestion approved successfully!')
  }
}

run()
