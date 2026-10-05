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
  const coverBuffer = fs.readFileSync('/private/tmp/simpsonshitrun_cover.jpg')
  const fileName = 'simpsonshitrun.jpg'

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

  console.log('--- Inserting / Upserting Simpsons Hit & Run VR Port ---')
  const portPayload = {
    slug: 'simpsonshitrun',
    title: 'The Simpsons: Hit & Run VR',
    developer: 'kote2345',
    developer_url: 'https://github.com/kote2345',
    short_description: 'Full standalone 6DoF VR port of The Simpsons: Hit & Run for Meta Quest. Explore Springfield in roomscale VR with motion-controlled driving and OpenXR Vulkan rendering.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'UXMeylAkNGE',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'VR Steering Wheel', 'Roomscale', 'Seated Mode'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/SimpsonsHitRun/',
    base_game_url: 'https://www.myabandonware.com/game/the-simpsons-hit-run-bg6',
    base_game_store: 'PC CD-ROM / Retail',
    port_download_url: 'https://github.com/kote2345/The-Simpsons-Hit-and-Run-VR/releases/tag/Beta1.1',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/kote2345/The-Simpsons-Hit-and-Run-VR',
    latest_version: 'Beta 1.1',
    last_github_update: '2026-08-26T21:28:06Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Original PC game files for **The Simpsons: Hit & Run** (2003 original unmodded PC release).
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Get the latest \`SimpsonsHitRun_1.1.apk\` from [GitHub Releases](https://github.com/kote2345/The-Simpsons-Hit-and-Run-VR/releases/tag/Beta1.1).
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   \`\`\`bash
   adb install -r SimpsonsHitRun_1.1.apk
   \`\`\`
3. **Create the Game Directory:**
   On your Quest internal storage, create a folder named \`SimpsonsHitRun\`:
   * Path: \`/sdcard/SimpsonsHitRun\` (or \`Quest\\Internal shared storage\\SimpsonsHitRun\` when connected via USB).
4. **Copy PC Game Files:**
   Copy the complete contents of your original unmodded PC install of *The Simpsons: Hit & Run* into the \`SimpsonsHitRun\` folder on your headset.
5. **Launch in VR:**
   Put on your headset, navigate to **App Library → Unknown Sources**, and launch **The Simpsons: Hit & Run VR**!

### VR Features & Controls
* **6DoF & Roomscale:** Walk around Homer, Bart, and explore Springfield in stereoscopic 3D.
* **VR Vehicle Controls:** Grab the interactive steering wheel with motion controllers or drive with thumbsticks.
* **Rendering Engine:** Native Vulkan single-pass stereo multiview rendering via OpenXR.
* **Comfort Options:** Seated mode, snap/smooth turning, adjustable refresh rate and resolution scale.`,
    troubleshooting_notes: 'Make sure to use an unmodded, clean PC version of the game. Files must be placed directly inside /sdcard/SimpsonsHitRun/ without nested game folders. Grant all requested storage permissions on first launch.'
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
