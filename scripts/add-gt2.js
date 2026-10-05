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
  console.log('--- Uploading Real Official GT2 Cover Image ---')
  const coverPath = '/tmp/gt2_hero_top.jpg'
  const coverBuffer = fs.readFileSync(coverPath)
  const fileName = 'gran_turismo_2_vr.jpg'

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

  const publicCoverUrl = publicUrlData.publicUrl
  console.log('Cover uploaded successfully:', publicCoverUrl)

  console.log('--- Inserting / Upserting Gran Turismo 2 VR Port ---')
  const portPayload = {
    slug: 'gran-turismo-2-vr',
    title: 'Gran Turismo 2 VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gt-2-pc',
    short_description: 'Native C++ standalone port of Gran Turismo 2 for Meta Quest. Features full 6DoF stereo cockpit driving, physical steering wheel interactions, dynamic rear-view mirrors, and 120Hz support.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'V6TifTwtsqg',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Cockpit VR', 'Virtual Wheel', 'Motion Steering', 'Stick Driving', 'Theatre Menus'],
    has_6dof_controls: true,
    internal_storage_path: 'Android/data/io.github.gt2pc.quest/files',
    base_game_url: 'https://www.mobygames.com/game/1597/gran-turismo-2/',
    base_game_store: 'PlayStation PS1 Disc (BIN/CUE)',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gt-2-pc',
    latest_version: 'v0.8.1',
    port_download_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gt-2-pc/releases/download/v0.8.1/GT2-0.8.1.zip',
    port_download_source: 'GitHub Release ZIP',
    featured: true,
    installation_guide: `### Overview
**Gran Turismo 2 VR** is a native C++ standalone source port for Meta Quest (optimized for Quest 3 / Quest 3S). It brings both Arcade and Simulation discs to life in full stereoscopic 6DoF Virtual Reality with interactive cockpits, working instrument needles, and functioning rear-view mirrors.

> [!NOTE]
> Unlike source-build kits, the official release ZIP already includes a **pre-compiled signed Quest APK** under \`native/\`. You only need to supply your legally dumped Gran Turismo 2 PS1 disc images (\`BIN\` / \`CUE\`).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Original PS1 disc images of **Gran Turismo 2** (\`BIN\` / \`CUE\` files for Arcade and Simulation mode).
3. PC connected via USB-C cable (Windows or Linux).

---

### Installation Steps

1. **Download the Release:**
   Download the latest release package \`GT2-0.8.1.zip\` from [GitHub Releases](https://github.com/dubrovskiy-yevhen-stakelogic/gt-2-pc/releases/latest).
2. **Extract the ZIP:**
   Extract the entire ZIP archive to a folder on your PC.
3. **Connect Your Quest:**
   Plug your Quest into your PC with a USB cable and accept the **"Allow USB Debugging"** prompt inside the headset.
4. **Run the Installer:**
   * **Windows:** Double-click \`INSTALL-QUEST.bat\`
   * **Linux:** Run \`bash native/INSTALL-LINUX.sh\`
5. **Select Your Disc Image:**
   When prompted, select your Gran Turismo 2 \`BIN\` disc image. The script extracts the game assets, installs the signed APK, and copies all data directly to \`/sdcard/Android/data/io.github.gt2pc.quest/files\`.
6. **Launch in VR:**
   Put on your headset, open **App Library → Unknown Sources**, and launch **Gran Turismo 2 VR**!

---

### VR Driving Controls
* **Steering Modes:** Choose between **Virtual Wheel** (grab the 3D wheel with Touch grips), **Motion Steering** (twist wrist angle), or **Stick** driving.
* **VR Menu:** Press **Both Grips + Left Menu button** (or press L3 + R3 stick clicks) anytime during a race to adjust VR seat height, mirrors, supersampling, and 72/90/120Hz display modes.`,
    troubleshooting_notes: 'Supply complete BIN/CUE images (2048-byte ISOs lack necessary CD-DA audio sectors). To access in-game VR cockpit calibration and resolution settings, press Both Grips + Left Menu.',
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

  console.log('Gran Turismo 2 VR Port successfully inserted into Supabase:', data[0]?.title)
}

run()
