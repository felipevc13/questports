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
  const coverBuffer = fs.readFileSync('/private/tmp/halocequest_cover.jpg')
  const fileName = 'halocequest.jpg'

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

  console.log('--- Inserting / Upserting Halo CE Quest VR Port ---')
  const portPayload = {
    slug: 'halocequest',
    title: 'Halo CE Quest VR',
    developer: 'moistman42069',
    developer_url: 'https://github.com/moistman42069',
    short_description: 'Native standalone OpenXR VR port of Halo: Combat Evolved for Meta Quest. Experience the legendary campaign and multiplayer with 6DoF motion controls, two-handed weapon handling, and full-body IK.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'mFSmPcHQpLM',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale', 'Two-Handed Grip', 'Full-Body IK'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/HaloCE/',
    base_game_url: 'https://store.steampowered.com/app/1064221/Halo_Combat_Evolved_Anniversary/',
    base_game_store: 'Xbox ISO / Steam MCC',
    port_download_url: 'https://github.com/moistman42069/HaloCE-Quest-VR/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/moistman42069/HaloCE-Quest-VR',
    latest_version: '1.0-test14',
    last_github_update: '2026-10-03T15:02:38Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Original legally obtained **Halo: Combat Evolved** Xbox ISO/XISO (allow ~1.8 GB for extracted maps, cache, and sound files).
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download \`HaloCE-Quest-test14.apk\` (package \`com.halo.decomp.vr\`) from [GitHub Releases](https://github.com/moistman42069/HaloCE-Quest-VR/releases/latest).
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   \`\`\`bash
   adb install -r HaloCE-Quest-test14.apk
   \`\`\`
3. **Import Game Files:**
   * Transfer your Halo CE Xbox ISO/XISO file to your Quest storage (e.g., inside \`Download/\`).
   * Launch **Halo CE VR** from **App Library → Unknown Sources**.
   * Use the built-in file picker/launcher to select your ISO file. The game will automatically extract all required maps, textures, and audio into place.
4. **Recenter & Configure VR:**
   * Stand at normal playing height and click **both thumbsticks** simultaneously to recenter height and origin.
   * Open the campaign pause menu → **VR Settings** to configure locomotion, snap/smooth turn, and weapon handling.

### VR Controls & Features
* **6DoF & Two-Handed Weapons:** Aim with your primary hand and stabilize recoil by gripping the front barrel with your off-hand.
* **Full-Body IK:** Complete articulated body representation with arms, legs, and responsive fingers.
* **Physical Gestures:**
  * **Helmet Flashlight:** Tap near your temple to toggle your suit flashlight.
  * **Physical Crouch:** Physically squat or use thumbstick crouch.
  * **Motion Melee:** Swing your rifle or fist to pistol-whip Grunts and Elites.
* **Multiplayer & Co-op:** Join native PvP servers or host experimental co-op campaign sessions with fellow Quest players.`,
    troubleshooting_notes: 'Use an original Xbox ISO or XISO image for data extraction. If NPC or model presentation desyncs during co-op, ensure both players are on the exact same build (test14). Recenter standing height anytime by clicking both thumbsticks.'
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
