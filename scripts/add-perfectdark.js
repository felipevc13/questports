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
  console.log('--- Uploading Perfect Dark VR Cover ---')
  const coverBuffer = fs.readFileSync('/tmp/perfect_dark_cover.jpg')
  const fileName = 'perfect_dark_vr.jpg'

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

  console.log('--- Upserting Perfect Dark VR Port ---')
  const portPayload = {
    slug: 'perfect-dark-vr',
    title: 'Perfect Dark VR',
    developer: 'Alex-LeTux',
    developer_url: 'https://github.com/Alex-LeTux',
    short_description: 'Standalone 6DoF VR source port of Rare\'s legendary Nintendo 64 shooter Perfect Dark for Meta Quest. Features full motion controller aiming, dual wielding, roomscale tracking, and support for community HD texture packs.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'AbqMNh09U04',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn', '6DoF Weapon Aiming', 'Dual Wielding'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Perfect_Dark',
    base_game_store: 'Nintendo 64 ROM (NTSC Final .z64)',
    port_download_url: 'https://github.com/Alex-LeTux/perfect_dark_VR/releases/download/v1.1-beta/Perfect_Dark_VR_Standalone_v1.1-beta.apk',
    port_download_source: 'GitHub Releases (APK)',
    github_url: 'https://github.com/Alex-LeTux/perfect_dark_VR',
    latest_version: 'v1.1-beta',
    last_github_update: '2026-07-01T06:24:00Z',
    featured: true,
    installation_guide: `### Overview
**Perfect Dark VR** is a native standalone 6DoF VR source port of Rare's classic Nintendo 64 first-person shooter *Perfect Dark* (2000), running directly on Meta Quest headsets with full motion controller tracking, immersive weapon handling, and dual wielding.

> [!NOTE]
> You must provide your own legally obtained **Perfect Dark (NTSC Final)** Nintendo 64 ROM (\`.z64\` format). Only the NTSC version is compatible with this VR port.

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally dumped **Perfect Dark (USA/NTSC Final) ROM** file (\`.z64\`).
3. SideQuest or ADB installed on your computer or phone.

---

### Step-by-Step Installation Guide

#### 1. Sideload the Standalone APK
- Download **\`Perfect_Dark_VR_Standalone_v1.1-beta.apk\`** from [GitHub Releases](https://github.com/Alex-LeTux/perfect_dark_VR/releases/tag/v1.1-beta).
- Sideload the APK onto your Meta Quest using **SideQuest** or run:
  \`\`\`bash
  adb install -r Perfect_Dark_VR_Standalone_v1.1-beta.apk
  \`\`\`

#### 2. Copy the ROM to Your Headset
- Copy your Perfect Dark NTSC ROM to your Quest headset's **\`Download\`** folder (via USB-C file transfer, SideQuest file manager, or Quest browser):
  \`\`\`bash
  adb push pd.ntsc-final.z64 /sdcard/Download/
  \`\`\`

#### 3. Select ROM in VR
- Put on your Quest headset and go to **App Library → Unknown Sources**.
- Launch **Perfect Dark VR**.
- On the startup screen, press **"Select ROM"** and pick your NTSC ROM from your **Download** folder using the system file picker.

---

### Community HD Texture Packs
This VR port includes full support for the **Community Texture Packs** maintained by Parabolee and Retro Foundry. To install HD textures:
- Download the texture pack from [Perfect-Dark-Plus-HD-Textures](https://github.com/retro-foundry/Perfect-Dark-Plus-HD-Textures).
- Follow instructions to place the textures folder inside the game data directory on your headset.

---

### VR Controls & Features
* **6DoF Aiming & Dual Wielding:** Aim independently with each Touch controller, including dual CMP-150s, Falcon 2s, or Magnums.
* **Full Locomotion & Turning:** Smooth thumbstick locomotion with customizable snap or smooth turning.
* **Roomscale Tracking:** Duck behind cover and physically lean around corners in Carrington Institute and combat missions.`,
    troubleshooting_notes: 'Requires North American / NTSC Final ROM (PAL and Japanese ROMs are not supported). If you experience an infinite reload loop on older versions, ensure you are using v1.1-beta or later.'
  }

  const { data, error } = await supabase
    .from('ports')
    .upsert(portPayload, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Error inserting port:', error.message)
    process.exit(1)
  }

  console.log('Successfully inserted Perfect Dark VR port:', data[0]?.title)
}

run()
