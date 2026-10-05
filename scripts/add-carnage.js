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
  const coverBuffer = fs.readFileSync('/private/tmp/carmageddon_cover.jpg')
  const fileName = 'questcarnage.jpg'

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

  console.log('--- Inserting / Upserting QuestCarNage Port ---')
  const portPayload = {
    slug: 'questcarnage',
    title: 'QuestCarNage (Carmageddon VR)',
    developer: 'maranone',
    developer_url: 'https://github.com/maranone',
    short_description: 'Native standalone OpenXR VR port of the vehicular combat classic Carmageddon for Meta Quest headsets, based on the Dethrace engine reimplementation with 120Hz support.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'wdP-DzNOv5U',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Cockpit VR', 'Stereo 6DoF', 'Snap Turn', 'VR Shell Menus', '120Hz Refresh Rate'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.github.maranone.questcarnage/files/',
    base_game_url: 'https://store.steampowered.com/app/282010/Carmageddon_Max_Pack/',
    base_game_store: 'Steam / GOG',
    port_download_url: 'https://github.com/maranone/carnage/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/maranone/carnage',
    latest_version: 'b003',
    last_github_update: '2026-09-17T20:30:08Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Legally owned PC copy of **Carmageddon** (Steam Max Pack, GOG, or original CD).
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download the latest \`QuestCarnage-Meta-Quest-release.apk\` from [GitHub Releases (b003)](https://github.com/maranone/carnage/releases/latest).
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   \`\`\`bash
   adb install -r QuestCarnage-Meta-Quest-release.apk
   \`\`\`
3. **Transfer Game Data Files:**
   * Locate your Carmageddon installation on PC (ensure it has the \`DATA\` directory with \`DATA/GENERAL.TXT\`).
   * Transfer the game files using the repo helper scripts (\`push_files_to_quest.bat\` and \`push-quest-data.ps1\`) or push manually with ADB:
   \`\`\`bash
   adb push "/path/to/Carmageddon/DATA" /sdcard/Android/data/com.github.maranone.questcarnage/files/
   \`\`\`
   *(Legacy shared storage path \`/sdcard/questcarnage/DATA\` is also supported).*
4. **Launch & Play:**
   * Open **QuestCarNage** from **App Library → Unknown Sources** on your headset.
   * Adjust refresh rate (supports up to **120Hz**) in the second options menu and hit the track!

### VR Features & Vehicular Combat
* **Full Cockpit 6DoF VR:** Experience the brutal mayhem from behind the wheel of the Red Annihilator with full head tracking and depth.
* **120Hz Native Support:** Super fluid high refresh rate rendering for blistering racing action.
* **Custom Race Options:** Try custom powerups roulette, up to 50 AI opponents, and up to 100x pedestrian multipliers.
* **OpenXR Implementation:** BRender's GLES 3.0 path with stereo per-eye view pose and native Touch controller mapping.`,
    troubleshooting_notes: 'The specified game directory must contain DATA/GENERAL.TXT. In the options screen, you can toggle between 72Hz, 90Hz, and 120Hz display refresh modes. Ensure file permissions are granted on first launch.'
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
