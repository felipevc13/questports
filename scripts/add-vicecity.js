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
  console.log('--- Uploading Cover Image ---')
  const coverPath = '/Users/felipe/.gemini/antigravity-ide/brain/37721f5d-0982-4dd7-b92a-0be6df09db91/vicecity_vr_cover_1791210729891.jpg'
  const coverBuffer = fs.readFileSync(coverPath)
  const fileName = 'vicecity_vr.jpg'

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

  console.log('--- Inserting / Upserting GTA Vice City VR Port ---')
  const portPayload = {
    slug: 'vice-city-vr-quest',
    title: 'Grand Theft Auto: Vice City VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/vice-city-vr-quest',
    short_description: 'Experience Grand Theft Auto: Vice City in full standalone 6DoF VR on Meta Quest. Features motion-tracked weapon aiming, physical steering wheel vehicle driving, articulated ragdolls, and Vulkan stereo rendering.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'My0gwnPvWU8',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale', 'Steering Wheel Driving', 'Two-Handed Aiming'],
    has_6dof_controls: true,
    internal_storage_path: 'Android/data/com.revc.miamivr/files',
    base_game_url: 'https://store.steampowered.com/app/12110/Grand_Theft_Auto_Vice_City/',
    base_game_store: 'Steam / PC CD / Rockstar',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/vice-city-vr-quest',
    latest_version: 'v0.5.6',
    port_download_url: null,
    port_download_source: 'GitHub Source Kit',
    featured: true,
    installation_guide: `### Overview
**Vice City VR** is a full standalone 6DoF OpenXR source port of GTA: Vice City built on top of **reVC** and a modern Vulkan rendering backend.

> [!NOTE]
> To comply with copyright laws, no precompiled APK or original game assets are distributed. The repository provides an automated, one-click build kit that downloads required build tools, compiles the APK with reVC, and installs it directly onto your Quest.

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally owned PC copy of **Grand Theft Auto: Vice City** (Steam, Rockstar Games Launcher, or original PC CD).
3. PC connected via USB cable (Windows or Linux).

---

### Step-by-Step Installation Guide

1. **Download the Source Kit:**
   Download the repository ZIP or clone [dubrovskiy-yevhen-stakelogic/vice-city-vr-quest](https://github.com/dubrovskiy-yevhen-stakelogic/vice-city-vr-quest) onto your PC.
2. **Connect Your Headset:**
   Plug your Meta Quest into your PC via USB-C and confirm the **"Allow USB Debugging"** prompt inside the headset.
3. **Run the Automated Wizard:**
   * **Windows:** Double-click \`BUILD_AND_INSTALL.bat\`
   * **Linux:** Run \`./BUILD_AND_INSTALL.sh\`
4. **Select Your Game Folder:**
   When prompted by the wizard, select your PC GTA Vice City installation directory (must contain \`data\`, \`models\`, \`anim\`, etc.).
5. **Automated Build & Install:**
   The wizard will automatically fetch portable JDK 21, the Android SDK command-line tools, and the reVC source, compile your personal APK, push the game files, and install the app onto your Quest!
6. **Launch in VR:**
   Put on your headset, open **App Library → Unknown Sources**, and launch **Vice City VR**!

---

### Updating Later
To update to future releases without redownloading game assets, simply connect your headset and run \`UPDATE.bat\` (Windows) or \`./UPDATE.sh\` (Linux).`,
    troubleshooting_notes: 'The wizard creates a log file at %TEMP%\\ViceCityVR-Build-And-Install.log (Windows) or $TMPDIR/ViceCityVR-Build-And-Install.log (Linux). Ensure your Vice City PC directory contains clean original game files.',
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

  console.log('GTA Vice City VR Port successfully inserted into Supabase:', data[0]?.title)
}

run()
