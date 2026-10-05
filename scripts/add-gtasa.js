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
  const coverPath = '/Users/felipe/.gemini/antigravity-ide/brain/37721f5d-0982-4dd7-b92a-0be6df09db91/gtasa_vr_cover_1791210127243.jpg'
  const coverBuffer = fs.readFileSync(coverPath)
  const fileName = 'gtasa_vr.jpg'

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

  console.log('--- Inserting / Upserting GTA San Andreas VR Port ---')
  const portPayload = {
    slug: 'gta-sa-vr-quest',
    title: 'Grand Theft Auto: San Andreas VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest',
    short_description: 'Grand Theft Auto: San Andreas in standalone 6DoF VR on Meta Quest. Features first-person motion controller gunplay, immersive driving, and full Los Santos freedom.',
    category: 'game_mod',
    status: 'in_development',
    cover_image_url: publicCoverUrl,
    youtube_video_id: '9NAW-5CKdFc',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn', 'Vehicles'],
    has_6dof_controls: true,
    internal_storage_path: 'Android/data/com.rockstargames.gtasa/files',
    base_game_url: 'https://play.google.com/store/apps/details?id=com.rockstargames.gtasa',
    base_game_store: 'Google Play Store',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest',
    latest_version: '0.3.1 alpha',
    port_download_url: null,
    port_download_source: 'GitHub Build Script',
    featured: true,
    installation_guide: `### Overview
This project brings Grand Theft Auto: San Andreas directly to standalone Meta Quest headsets in 6DoF Virtual Reality.

> [!NOTE]
> Because GTA: San Andreas is a commercial game copyrighted by Rockstar Games, pre-compiled APK binaries are not distributed directly. Instead, an automated build script merges the VR injector with your legally purchased Google Play Store APK.

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) in Developer Mode.
2. Legally purchased **Grand Theft Auto: San Andreas** on Google Play Store (ARM64 version \`2.11.311\`).
3. Audio archive mod pack (\`gta-sa-ps2-style-mod-pack_1786856007_737162.7z\`) as specified in the repo.
4. PC with USB-C cable (Windows, Linux, or macOS).

---

### Step-by-Step Build & Installation
1. **Download the Project:**
   Clone or download the repository from [dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest](https://github.com/dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest).
2. **Export Base Game APKs:**
   Export the installed Google Play game splits using the provided \`EXPORT_PLAY_APKS.bat\` script.
3. **Run the Automated Installer:**
   - **Windows:** Run \`BUILD_AND_INSTALL.bat\`
   - **Linux / macOS:** Run \`bash BUILD_AND_INSTALL.sh\`
4. **Follow On-Screen Prompts:**
   Select the exported APK folder and audio package when prompted.
5. **Connect Quest:**
   Plug your Quest into your PC and authorize USB debugging on the headset prompt. The installer will patch the binaries and push the assets to \`Android/data/com.rockstargames.gtasa/files\`.
6. **Launch:**
   In your headset, open the App Library, filter by **Unknown Sources**, and launch **GTA San Andreas VR**!`,
    troubleshooting_notes: 'Active development (alpha build). If you encounter black screen crashes on launch, verify that your Google Play game version matches 2.11.311 ARM64 and that the PS2 audio package was extracted correctly.',
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

  console.log('GTA San Andreas VR Port successfully inserted into Supabase:', data[0]?.title)
}

run()
