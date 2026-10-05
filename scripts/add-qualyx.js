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
  const coverBuffer = fs.readFileSync('/private/tmp/qualyx_cover.jpg')
  const fileName = 'qualyx.jpg'

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

  console.log('--- Inserting / Upserting Qualyx Port ---')
  const portPayload = {
    slug: 'qualyx',
    title: 'Qualyx (Half-Life: Alyx VR)',
    developer: 'tinsarfal',
    developer_url: 'https://github.com/tinsarfal',
    short_description: "Native standalone VR port of Valve's Half-Life: Alyx for Meta Quest headsets. Experience City 17, the Citadel, and the Gravity Gloves in roomscale 6DoF with OpenXR and Positional Time Warp.",
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'JHW-FMm_c7c',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Continuous Turn', 'Snap Turn', 'Teleport', 'Roomscale', 'Positional Time Warp (72Hz)'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Qualyx/game/',
    base_game_url: 'https://store.steampowered.com/app/546560/HalfLife_Alyx/',
    base_game_store: 'Steam',
    port_download_url: 'https://github.com/tinsarfal/Qualyx/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/tinsarfal/Qualyx',
    latest_version: '1.0.50',
    last_github_update: '2026-09-23T18:30:24Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Original **Half-Life: Alyx** on Steam.
* SideQuest or Android ADB (\`platform-tools\`).
* Recommended: Turn ON **Quest Settings → Experimental → Positional time warp** before playing.

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download \`Qualyx-1.0.50.apk\` from [GitHub Releases](https://github.com/tinsarfal/Qualyx/releases/latest).
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   \`\`\`bash
   adb install -r Qualyx-1.0.50.apk
   \`\`\`
3. **Copy Game Files from PC:**
   Locate your Steam installation folder (typically \`Steam/steamapps/common/Half-Life Alyx/game/\`).
   You only need the \`hlvr\` and \`core\` folders inside \`game/\`. Copy them to \`/sdcard/Qualyx/game/\` on your headset:
   \`\`\`bash
   adb shell mkdir -p /sdcard/Qualyx/game
   adb push "/path/to/Half-Life Alyx/game/hlvr" /sdcard/Qualyx/game/
   adb push "/path/to/Half-Life Alyx/game/core" /sdcard/Qualyx/game/
   \`\`\`
   *(Ensure \`/sdcard/Qualyx/game/hlvr/pak01_dir.vpk\` exists on your headset).*
4. **Launch in VR:**
   * Open **Qualyx** from **App Library → Unknown Sources**.
   * Grant storage permissions, let the engine verify game archives, and tap **Launch in VR**!

### VR Features & Performance
* **Native Standalone Source 2:** Runs natively on the Quest XR2 Gen 2 / Gen 1 silicon.
* **Full 6DoF & Gravity Gloves:** Pull resin, magazines, and health syringes toward you through the air.
* **Positional Time Warp:** Optimized with 72Hz display targeting 36 fresh internal frames with hardware motion extrapolation.
* **Full Campaign Playability:** All chapters from the Quarantine Zone to the Vault.`,
    troubleshooting_notes: 'Turn ON Quest Settings → Experimental → Positional time warp for smooth frame pacing. If using the older May 2022 v1.5.4 game files, import the Qualyx 2022 shader pack inside the launcher setup screen.'
  }

  const { data, error } = await supabase
    .from('ports')
    .upsert(portPayload, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Error inserting port:', error.message)
    process.exit(1)
  }

  console.log('Successfully inserted port:', data)
}

run()
