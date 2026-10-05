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
  console.log('--- Uploading Harry Potter VR Cover ---')
  const coverBuffer = fs.readFileSync('/tmp/hp_cover.jpg')
  const fileName = 'harry_potter_vr.jpg'

  const { error: uploadError } = await supabase.storage
    .from('port-covers')
    .upload(fileName, coverBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (uploadError) {
    console.error('Error uploading HP VR cover:', uploadError.message)
    process.exit(1)
  }

  const { data: publicUrlData } = supabase.storage
    .from('port-covers')
    .getPublicUrl(fileName)

  const publicCoverUrl = publicUrlData.publicUrl
  console.log('Harry Potter Cover uploaded successfully:', publicCoverUrl)

  console.log('--- Inserting Harry Potter VR Port into Supabase ---')
  const portPayload = {
    slug: 'harry-potter-vr',
    title: 'Harry Potter and the Sorcerer\'s Stone VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/harry-potter-vr',
    short_description: 'Experience the classic 2001 Harry Potter in standalone 6DoF VR on Meta Quest. Features motion-tracked wand spellcasting, offline voice recognition, broomstick flying, and Hogwarts exploration.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'sJILoIKG9Mo',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Smooth Locomotion', 'Wand Motion Gestures', 'Voice Spell Casting', 'Broomstick Flight'],
    has_6dof_controls: true,
    internal_storage_path: 'Android/data/com.hpvr.quest/files',
    base_game_url: 'https://www.mobygames.com/game/5501/harry-potter-and-the-sorcerers-stone/',
    base_game_store: 'PC CD-ROM (US Release)',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/harry-potter-vr',
    latest_version: 'v0.1.4.1',
    port_download_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/harry-potter-vr/releases/download/v0.1.4.1/HPVR-Quest-0.1.4.1.zip',
    port_download_source: 'GitHub Releases (HPVR-Quest ZIP)',
    featured: true,
    installation_guide: `### Overview
**Harry Potter VR** is an unofficial standalone 6DoF Virtual Reality port of the legendary 2001 PC game *Harry Potter and the Sorcerer's Stone* (Philosopher's Stone), optimized for Meta Quest 3.

> [!NOTE]
> The release archive includes the automated installer and VR runtime. You need your legally owned US PC installation of the original 2001 game.

---

### Prerequisites
1. **Meta Quest Headset** (Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally owned PC install of **Harry Potter and the Sorcerer's Stone** (2001 PC CD-ROM).
3. PC connected via USB-C cable (Windows 10/11).

---

### Step-by-Step Installation Guide

1. **Download the Release Archive:**
   Download \`HPVR-Quest-0.1.4.1.zip\` from [GitHub Releases](https://github.com/dubrovskiy-yevhen-stakelogic/harry-potter-vr/releases/latest).
2. **Extract the ZIP:**
   Extract the entire ZIP archive to a folder on your Windows PC.
3. **Connect Your Quest:**
   Plug your headset into your PC with a USB-C data cable and accept the **"Allow USB Debugging"** prompt inside the headset.
4. **Run the Installer:**
   Double-click \`INSTALL.bat\`. When prompted, select your original PC Harry Potter game folder.
5. **Automatic Preparation & Sideload:**
   The installer prepares the audio and maps, sideloads the APK, and copies the necessary game assets to your headset.
6. **Launch in VR:**
   Put on your headset, open **App Library → Unknown Sources**, and launch **Harry Potter VR**!

---

### VR Spellcasting & Controls
* **Wand Motion Gestures:** Trace spell shapes in the air with your wand hand using CLASSIC, VISIBLE GESTURE, or GESTURE casting modes.
* **Offline Voice Recognition:** Aim at a compatible target and pronounce *Flipendo*, *Alohomora*, or *Wingardium Leviosa* while holding the trigger to cast verbally!
* **Broomstick Flight:** Fly and steer through the Hogwarts grounds and Quidditch broomstick training courses in full 6DoF roomscale.
* **VR Menu & Calibration:** Press **L3 + R3** (both thumbstick clicks) anytime to open the VR graphics and calibration settings.`,
    troubleshooting_notes: 'Alpha 0.1.4.1 hotfix release. Requires original US PC release assets. Voice recognition works offline but may vary with pronunciation. If headset is not detected, ensure Developer Mode and USB debugging are authorized.',
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

  console.log('Harry Potter VR Port successfully inserted into Supabase:', data[0]?.title)
}

run()
