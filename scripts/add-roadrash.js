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
  console.log('--- Uploading Road Rash Jailbreak VR Cover ---')
  const coverBuffer = fs.readFileSync('/tmp/roadrash_cover.jpg')
  const fileName = 'road_rash_jailbreak_vr.jpg'

  const { error: uploadError } = await supabase.storage
    .from('port-covers')
    .upload(fileName, coverBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (uploadError) {
    console.error('Error uploading Road Rash cover:', uploadError.message)
    process.exit(1)
  }

  const { data: publicUrlData } = supabase.storage
    .from('port-covers')
    .getPublicUrl(fileName)

  const publicCoverUrl = publicUrlData.publicUrl
  console.log('Road Rash Cover uploaded successfully:', publicCoverUrl)

  console.log('--- Inserting Road Rash: Jailbreak VR Port into Supabase ---')
  const portPayload = {
    slug: 'road-rash-jailbreak-vr',
    title: 'Road Rash: Jailbreak VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/road-rash-jailbreak',
    short_description: 'Native C++ standalone VR port of Road Rash: Jailbreak (PS1) for Meta Quest. Experience high-speed motorcycle vehicular combat, clubs, chains, police chases, and full stereoscopic 6DoF VR.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'f01aGgd6Uzs',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Cockpit VR', 'Motorcycle Riding', 'Physical Melee Combat', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: 'Android/data/com.roadrashvr.quest/files',
    base_game_url: 'https://www.mobygames.com/game/3773/road-rash-jailbreak/',
    base_game_store: 'PlayStation PS1 Disc (SLUS-01053)',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/road-rash-jailbreak',
    latest_version: 'v0.1.0',
    port_download_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/road-rash-jailbreak/releases/download/v0.1.0/RoadRashJailbreak-0.1.0.zip',
    port_download_source: 'GitHub Releases (RoadRashJailbreak ZIP)',
    featured: true,
    installation_guide: `### Overview
**Road Rash: Jailbreak VR** is a native C++ standalone OpenXR port of the classic PlayStation game *Road Rash: Jailbreak* (2000), running directly on Meta Quest 3 without needing a PC during gameplay.

> [!NOTE]
> The release ZIP already contains the pre-compiled signed Quest APK. You only need your legally dumped PS1 disc image (\`BIN\` / \`CUE\` from SLUS-01053).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally dumped PS1 disc image of **Road Rash: Jailbreak** (USA \`SLUS_01053\` in MODE2/2352 \`BIN\`/\`CUE\` format).
3. PC connected via USB-C cable (Windows 10/11).

---

### Step-by-Step Installation Guide

1. **Download the Release Archive:**
   Download \`RoadRashJailbreak-0.1.0.zip\` from [GitHub Releases](https://github.com/dubrovskiy-yevhen-stakelogic/road-rash-jailbreak/releases/latest).
2. **Extract the ZIP:**
   Extract the archive to a folder on your Windows PC.
3. **Connect Your Quest:**
   Plug your Quest into your PC with a USB-C data cable and accept the **"Allow USB Debugging"** prompt inside the headset.
4. **Run the Installer:**
   Double-click \`INSTALL.bat\`. When prompted, select your Road Rash: Jailbreak \`BIN\` or \`CUE\` disc image.
5. **Automatic Preparation & Install:**
   The script verifies the disc hash, prepares the tracks, installs the Quest APK, and copies the disc assets to your headset.
6. **Launch in VR:**
   Put on your headset, open **App Library → Unknown Sources**, and launch **Road Rash VR**!

---

### VR Features & Vehicular Combat
* **Full Stereoscopic 6DoF:** Experience high-speed illegal motorcycle races with depth perception and cockpit view.
* **Brutal Combat:** Trade blows with rival bikers, swing clubs, use cattle prods, and evade squad cars.
* **Physics & Audio:** Original fixed-step bike physics reimplemented with native 3D spatialized audio.`,
    troubleshooting_notes: 'Requires North American PS1 disc SLUS-01053 in BIN/CUE format (2048-byte ISOs lack necessary CD-DA audio sectors). If headset is not detected, ensure Developer Mode and USB debugging are authorized.',
    last_github_update: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('ports')
    .upsert(portPayload, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Error inserting port:', error.message)
    process.exit(1)
  }

  console.log('Road Rash: Jailbreak VR Port successfully inserted into Supabase:', data[0]?.title)
}

run()
