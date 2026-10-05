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
  const coverBuffer = fs.readFileSync('/private/tmp/goldeneye_cover.jpg')
  const fileName = 'goldeneye-vr.jpg'

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

  console.log('--- Inserting / Upserting GoldenEye VR Port ---')
  const portPayload = {
    slug: 'goldeneye-vr',
    title: 'GoldenEye VR (007)',
    developer: 'MrSco',
    developer_url: 'https://github.com/MrSco',
    short_description: "Native standalone VR port of GoldenEye 007 for Meta Quest, built from the N64 decompilation. Step into James Bond's shoes with 6DoF motion aiming, watch gadget HUD, working sniper scopes, and online multiplayer.",
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'Nmlq5QxnVuM',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale', 'Two-Handed Grip', 'Motion Melee', 'Virtual Screen Mode'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/GoldenEye-VR/',
    base_game_url: 'https://en.wikipedia.org/wiki/GoldenEye_007_(1997_video_game)',
    base_game_store: 'Nintendo 64 ROM (NTSC-U USA)',
    port_download_url: 'https://github.com/MrSco/goldeneye-vr/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/MrSco/goldeneye-vr',
    latest_version: 'v0.1.11',
    last_github_update: '2026-09-25T01:37:52Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Legally owned original **GoldenEye 007 (USA / NTSC-U)** N64 cartridge ROM (\`.z64\`, \`.v64\`, or \`.n64\`, ~12 MB).
* SideQuest or Android ADB (\`platform-tools\`).
* USB-C cable.

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download the latest \`GoldenEye-VR-v0.1.11.apk\` from [GitHub Releases](https://github.com/MrSco/goldeneye-vr/releases/latest) or [goldeneyevr.com](https://goldeneyevr.com).
2. **Install the APK:**
   Sideload the APK onto your headset using SideQuest or ADB:
   \`\`\`bash
   adb install -r GoldenEye-VR-v0.1.11.apk
   \`\`\`
3. **Copy your USA ROM to your Headset:**
   Copy your \`GoldenEye 007 (USA).z64\` file to your Quest storage (e.g., inside \`Download/\` or \`/sdcard/GoldenEye-VR/\`).
4. **Launch & Play:**
   * Put on your headset and open **GoldenEye VR** from **App Library → Unknown Sources**.
   * On first boot, use the in-VR launcher to select your ROM file.
   * Choose between **Stereo VR** (full 3D roomscale) or **Big Virtual Screen** and start your mission!

### VR Features & Interactive Gadgets
* **6DoF Gunplay & Two-Handed Grip:** Aim with your dominant hand or grip rifles with both hands for rock-solid stability.
* **Bond's Smart Watch:** Your left wrist displays live mission time, health, body armor, and multiplayer radar. Tap the watch or bring your gun hand to activate the Watch Laser.
* **Realistic Scopes & Ejection:** True-to-life 4.4x–25x magnification on the sniper rifle and working ejection ports for spent shell casings.
* **Optional HD & AI Texture Packs:** Download high-resolution AI upscaled textures directly within the in-VR launcher.
* **Multiplayer:** 8-player online/Wi-Fi deathmatch and 4-player co-op campaign!`,
    troubleshooting_notes: 'Only the USA (NTSC-U) ROM is supported. Updating APKs with SideQuest retains your ROM and save data. If distant scenery pops on older builds, ensure you are running v0.1.11 or later.'
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
