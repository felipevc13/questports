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
  console.log('--- Uploading Aliens Versus Predator VR Cover ---')
  const coverBuffer = fs.readFileSync('/tmp/avp_cover.jpg')
  const fileName = 'avp_vr.jpg'

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

  console.log('--- Upserting Aliens Versus Predator VR Port ---')
  const portPayload = {
    slug: 'avp-vr',
    title: 'Aliens Versus Predator VR',
    developer: 'Bassquake',
    developer_url: 'https://github.com/Bassquake',
    short_description: 'Standalone 6DoF OpenXR VR port of the classic Aliens Versus Predator (1999) for Meta Quest. Experience intense survival horror across Marine, Alien, and Predator campaigns with motion controller aiming and wall-climbing.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: null,
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['6DoF Motion Tracking', 'Smooth Locomotion', 'Snap / Smooth Turn', 'Independent Hand Aiming', 'Alien Wall-Climbing'],
    has_6dof_controls: true,
    internal_storage_path: 'Android/data/com.bassquake.quest.avpvr/files',
    base_game_url: 'https://store.steampowered.com/app/3730/Aliens_versus_Predator_Classic_2000/',
    base_game_store: 'Steam (AvP Classic 2000) / GOG / PC CD-ROM',
    port_download_url: 'https://github.com/Bassquake/Aliens-Versus-Predator-VR/releases/download/0.2/avpvr-0.2-arm64-v8a-release.apk',
    port_download_source: 'GitHub Releases (APK)',
    github_url: 'https://github.com/Bassquake/Aliens-Versus-Predator-VR',
    latest_version: '0.2',
    last_github_update: '2026-06-30T08:29:43Z',
    featured: true,
    installation_guide: `### Overview
**Aliens Versus Predator VR (AvP VR)** is a native standalone 6DoF OpenXR port of Rebellion's classic sci-fi survival horror FPS *Aliens Versus Predator* (1999), running directly on Meta Quest headsets. Play three distinct campaigns with full VR immersion: Colonial Marine, Xenomorph Alien, and Predator.

> [!NOTE]
> You need the original PC game asset files from **Aliens versus Predator Classic 2000** (available on [Steam](https://store.steampowered.com/app/3730/Aliens_versus_Predator_Classic_2000/) or GOG) or original PC CD-ROM.

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally purchased copy of **Aliens versus Predator Classic 2000** (Steam / GOG).
3. **SideQuest** or ADB installed on your computer.

---

### Step-by-Step Installation Guide

#### 1. Sideload the VR APK
- Download **\`avpvr-0.2-arm64-v8a-release.apk\`** from [GitHub Releases](https://github.com/Bassquake/Aliens-Versus-Predator-VR/releases/tag/0.2).
- Install the APK on your headset using **SideQuest** (or via ADB: \`adb install -r avpvr-0.2-arm64-v8a-release.apk\`).

#### 2. First Launch (Initialize Folders)
- Put on your headset and launch **Aliens Versus Predator: VR** from **App Library → Unknown Sources**.
- The app will close/crash immediately — **this is normal**, as it creates the necessary folder structure and permissions.

#### 3. Copy Game Assets
- Connect your Quest to your PC and open SideQuest (or Windows File Explorer / Android File Transfer).
- In SideQuest, go to **Manage files on the headset** (folder icon).
- Navigate to:
  \`\`\`
  Android/data/com.bassquake.quest.avpvr/files/
  \`\`\`
- Copy all files and folders from your PC game installation directory into this \`files/\` folder (including \`fastfile\`, \`language\`, etc.).

#### 4. Optional: Original CD Soundtrack (Atmosphere)
- Inside \`Android/data/com.bassquake.quest.avpvr/files/\`, create a new folder named **\`cd_tracks\`**.
- Download the soundtrack OGG files from [ModDB](https://www.moddb.com/games/aliens-vs-predator/addons/fixed-avp-classic-soundtrack) and name them \`track01.ogg\`, \`track02.ogg\`, etc.
- Copy the audio files into the \`cd_tracks\` folder.

#### 5. Launch and Play!
- Put on your Quest, go to **Unknown Sources**, and launch **Aliens Versus Predator: VR**!

---

### VR Controls & Species Features
* **Marine:** Tactical flashlight, shoulder lamp, motion tracker radar, smart gun auto-targeting, and hold **A** for manual reload.
* **Predator:** Wrist blades, shoulder plasmacaster with thermal lock, zoom vision (long-press **Y**), grappling hook (Left Trigger), and weapon disc throwing.
* **Alien:** Full 6DoF wall-climbing and ceiling crawling, biting, and tail-swipe attacks.
* **VR Performance Options:** Native 120Hz refresh rate mode, MSAA antialiasing, field-of-view comfort blinders, and adjustable world scale.`,
    troubleshooting_notes: 'Must launch the APK once before copying files so Android creates the app files folder. Ensure files are copied into Android/data/com.bassquake.quest.avpvr/files. If weapons have unexpected keybindings after updating, reset controls to default in-game.'
  }

  const { data, error } = await supabase
    .from('ports')
    .upsert(portPayload, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Error inserting port:', error.message)
    process.exit(1)
  }

  console.log('Successfully inserted Aliens Versus Predator VR port:', data[0]?.title)
}

run()
