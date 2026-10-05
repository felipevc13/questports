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
  console.log('--- 1. Updating Gran Turismo 2 Cover with User-Chosen Image ---')
  const gt2CoverBuffer = fs.readFileSync('/tmp/gt2_cover.jpg')
  const gt2FileName = 'gran_turismo_2_vr.jpg'

  const { error: gt2UploadError } = await supabase.storage
    .from('port-covers')
    .upload(gt2FileName, gt2CoverBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (gt2UploadError) {
    console.error('Error uploading GT2 cover:', gt2UploadError.message)
  } else {
    const { data: gt2UrlData } = supabase.storage.from('port-covers').getPublicUrl(gt2FileName)
    console.log('GT2 Cover updated successfully:', gt2UrlData.publicUrl)
    await supabase
      .from('ports')
      .update({ cover_image_url: `${gt2UrlData.publicUrl}?t=${Date.now()}` })
      .eq('slug', 'gran-turismo-2-vr')
  }

  console.log('--- 2. Uploading Gothic II Cover ---')
  const gothicCoverBuffer = fs.readFileSync('/tmp/gothic2_cover.jpg')
  const gothicFileName = 'gothic2_vr.jpg'

  const { error: gothicUploadError } = await supabase.storage
    .from('port-covers')
    .upload(gothicFileName, gothicCoverBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (gothicUploadError) {
    console.error('Error uploading Gothic 2 cover:', gothicUploadError.message)
    process.exit(1)
  }

  const { data: gothicUrlData } = supabase.storage.from('port-covers').getPublicUrl(gothicFileName)
  const gothicCoverUrl = gothicUrlData.publicUrl
  console.log('Gothic 2 Cover uploaded successfully:', gothicCoverUrl)

  console.log('--- 3. Inserting Gothic II VR Port into Supabase ---')
  const portPayload = {
    slug: 'gothic2-vr',
    title: 'Gothic II VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gothic2-vr',
    short_description: 'Experience the classic Gothic II: Night of the Raven in standalone 6DoF VR on Meta Quest. Features physical melee weapon combat, motion-tracked archery, virtual holsters, and physical swimming.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: gothicCoverUrl,
    youtube_video_id: 'A-5qT4v8Wyo',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Smooth Locomotion', 'Physical Melee', 'Physical Archery', 'Physical Swimming'],
    has_6dof_controls: true,
    internal_storage_path: 'Android/data/org.opengothic.quest/files',
    base_game_url: 'https://store.steampowered.com/app/39510/Gothic_II_Gold_Edition/',
    base_game_store: 'Steam / GOG (Night of the Raven)',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gothic2-vr',
    latest_version: 'v0.2.0',
    port_download_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gothic2-vr/releases/download/v0.2.0/Gothic-II-VR-0.2.0-PCVR-and-Quest.zip',
    port_download_source: 'GitHub Releases (Quest APK inside)',
    featured: true,
    installation_guide: `### Overview
**Gothic II VR** is an OpenXR standalone VR port of *Gothic II: Night of the Raven* for Meta Quest 3, built on top of the open-source **OpenGothic** engine.

> [!NOTE]
> The release ZIP already contains the pre-compiled signed Quest APK inside the \`Quest/\` folder. You only need your legally owned installation files of *Gothic II: Gold Edition / Night of the Raven* (Steam or GOG).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally owned PC install of **Gothic II: Night of the Raven** (Steam or GOG).
3. PC with USB data cable (Windows 10/11 x64).

---

### Step-by-Step Installation Guide

1. **Download the Release:**
   Download [Gothic-II-VR-0.2.0-PCVR-and-Quest.zip](https://github.com/dubrovskiy-yevhen-stakelogic/gothic2-vr/releases/latest) from GitHub Releases.
2. **Extract the ZIP:**
   Extract the entire ZIP archive to a folder on your PC (e.g., \`C:\\Games\\Gothic2VR\`).
3. **Open the Quest Folder:**
   Navigate into the extracted \`Quest/\` folder.
4. **Connect Your Headset:**
   Plug your Quest 3 into your PC via USB-C and accept the **"Allow USB Debugging"** prompt inside the headset.
5. **Run the Installer:**
   Double-click \`INSTALL.bat\`. When prompted, enter the path to your purchased Gothic 2 game directory (the folder containing \`Data\`, \`_work\`, and \`System\`).
6. **Automatic Packaging & Install:**
   The script packages your local game files, installs the signed Quest APK, and copies the data directly onto your headset.
7. **In-Headset Import:**
   Put on your headset, approve storage permissions when prompted, select the imported data archive, and launch **Gothic II VR** from **Unknown Sources**!

---

### VR Combat & Controls
* **Physical Melee:** Swing swords, punch, block, and parry in 6DoF roomscale. Two-handed weapons require both hands to deal damage!
* **Physical Archery:** Aim your bow with one hand, grip and draw the string back with your other hand to charge shot power, and release.
* **Physical Holsters:** Grab weapons and equipment directly from your virtual body holsters.
* **Physical Swimming:** Dive and tread water by making swimming strokes with your hands.
* **Menus:** Press **Both Grips + Y** to toggle the game menu, or **L3 + R3** (stick clicks) for VR settings.`,
    troubleshooting_notes: 'Alpha 0.2.0 release. If the headset is not detected, ensure Developer Mode and USB debugging are authorized. Ensure clean game data from Gothic II Gold (Windows DLL mods are unsupported). Keep multiple save slots.',
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

  console.log('Gothic II VR Port successfully inserted into Supabase:', data[0]?.title)
}

run()
