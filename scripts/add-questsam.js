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
  console.log('--- Uploading Serious Sam (QuestSam) Cover ---')
  const coverBuffer = fs.readFileSync('/tmp/questsam_cover.jpg')
  const fileName = 'questsam.jpg'

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

  console.log('--- Upserting Serious Sam (QuestSam) Port ---')
  const portPayload = {
    slug: 'questsam',
    title: 'Serious Sam Classic VR (QuestSam)',
    developer: 'maranone',
    developer_url: 'https://github.com/maranone',
    short_description: 'Standalone 6DoF VR source port of Serious Sam Classic: The First Encounter & The Second Encounter for Meta Quest. Features dual wielding, horde combat, roomscale tracking, and 1st/3rd-person diorama views.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: null,
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Dual Wielding', '6DoF Motion Tracking', 'Smooth Locomotion', 'Snap / Smooth Turn', 'Diorama / 3rd-Person Mode'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/questsam/',
    base_game_url: 'https://store.steampowered.com/app/41050/Serious_Sam_Classic_The_First_Encounter/',
    base_game_store: 'Steam / GOG (Serious Sam Classic: TFE / TSE)',
    port_download_url: 'https://github.com/maranone/QuestSam/releases/download/b002/questsam.apk',
    port_download_source: 'GitHub Releases (APK)',
    github_url: 'https://github.com/maranone/QuestSam',
    latest_version: 'b002',
    last_github_update: '2026-09-09T11:26:47Z',
    featured: true,
    installation_guide: `### Overview
**QuestSam** is a free, open-source standalone 6DoF VR source port of Croteam's legendary arcade FPS classics: **Serious Sam Classic: The First Encounter (TFE)** and **Serious Sam Classic: The Second Encounter (TSE)**, running natively on Meta Quest without a PC.

> [!NOTE]
> You need the \`.gro\` game archive files from either or both original PC games (*Serious Sam Classic: The First Encounter* or *Serious Sam Classic: The Second Encounter* on Steam or GOG).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally owned copy of **Serious Sam Classic: The First Encounter** and/or **The Second Encounter** on Steam or GOG.
3. PC with USB-C cable or SideQuest / ADB installed.

---

### Step-by-Step Installation Guide

#### 1. Sideload the Standalone APK
- Download **\`questsam.apk\`** from [GitHub Releases](https://github.com/maranone/QuestSam/releases/tag/b002).
- Install the APK using **SideQuest** or run:
  \`\`\`bash
  adb install -r questsam.apk
  \`\`\`

#### 2. First Launch (Folder Creation & Permissions)
- Put on your headset, open **App Library → Unknown Sources**, and launch **QuestSam**.
- Grant the **"All files access"** storage permission when prompted.
- The game will generate the \`/sdcard/questsam/\` directory on your headset's storage and close.

#### 3. Copy Game Files (\`.gro\`)
- Connect your Quest to your PC via USB-C (or use SideQuest's File Manager).
- Locate your PC game install folder (e.g. \`Steam/steamapps/common/Serious Sam Classic The First Encounter\`):
  - Copy all root \`.gro\` archive files (e.g. \`1_00.gro\`, \`1_00_music.gro\`, \`SE1_00.gro\`, etc.) into:
    \`\`\`text
    /sdcard/questsam/
    \`\`\`
  - *(Optional)* If copying via ADB script, you can use the bundled \`push_quest_data.bat\` (Windows) or \`push_quest_data.sh\` (Linux/Mac) to automatically transfer TFE & TSE data to \`/sdcard/Android/data/com.github.maranone.questsam/files\`.

#### 4. Launch and Slay Hordes in VR!
- Put on your Quest, go to **Unknown Sources**, and launch **QuestSam**.
- Choose your campaign (TFE or TSE) and enjoy full 6DoF dual-wielding chaos!

---

### VR Features & Controls
* **Dual Wielding:** Hold different weapons in each hand! Press each controller's grip to cycle weapons, and pull each controller's trigger independently to fire.
* **Camera Modes:** Play in traditional first-person VR or switch to third-person and roomscale 3D diorama modes.
* **Customizable HUD:** Adjust health/ammo HUD opacity, scale, and positioning in VR player settings.
* **Interact:** Click the Right Controller Thumbstick to use switches and open doors.`,
    troubleshooting_notes: 'Launch the APK once first to grant storage permissions and initialize /sdcard/questsam. Both TFE and TSE can be placed in the same folder or separate subfolders; QuestSam automatically links archives when SE1_00.gro is found.'
  }

  const { data, error } = await supabase
    .from('ports')
    .upsert(portPayload, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Error inserting port:', error.message)
    process.exit(1)
  }

  console.log('Successfully inserted Serious Sam Classic VR port:', data[0]?.title)
}

run()
