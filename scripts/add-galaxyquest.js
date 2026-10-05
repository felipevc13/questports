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
  const coverBuffer = fs.readFileSync('/private/tmp/galaxyquest_cover.jpg')
  const fileName = 'galaxyquest.jpg'

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

  console.log('--- Inserting / Upserting GalaxyQuest Port ---')
  const portPayload = {
    slug: 'galaxyquest',
    title: 'GalaxyQuest (Super Mario Galaxy VR)',
    developer: 'bigmak94',
    developer_url: 'https://github.com/bigmak94',
    short_description: 'Native standalone VR port of Super Mario Galaxy for Meta Quest 2 and 3, built on the Petari decompilation. Play in full 3D diorama mode with motion-tracked Star Bit laser aiming or on a giant 120Hz stereoscopic screen.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: publicCoverUrl,
    youtube_video_id: 'UnYhCfbw_bc',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['3D Diorama Mode', 'Giant Virtual Screen (120Hz)', 'Star Bit Laser Pointer', 'Snap Turn', 'Tilt & Motion Controls'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/GalaxyQuest/',
    base_game_url: 'https://en.wikipedia.org/wiki/Super_Mario_Galaxy',
    base_game_store: 'Nintendo Wii Disc (ISO/RVZ/WBFS)',
    port_download_url: 'https://github.com/bigmak94/GalaxyQuest/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/bigmak94/GalaxyQuest',
    latest_version: 'v0.1.3',
    last_github_update: '2026-10-01T02:29:04Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Legally dumped **Super Mario Galaxy** Wii disc image (ISO, RVZ, or WBFS - European RMGP01 or US RMGE01).
* USB-C data cable connected to your PC.
* ~7 GB free storage on your Quest.

### Installation Options

#### Option A: Automated Windows Installer (Recommended)
1. Download **\`GalaxyQuest-Installer-windows-x86_64.exe\`** from [GitHub Releases](https://github.com/bigmak94/GalaxyQuest/releases/latest).
2. Connect your Quest with Developer Mode enabled and allow USB debugging inside the headset.
3. Run the installer and point it to your Super Mario Galaxy ISO/RVZ file.
4. The installer automatically extracts game assets, runs the converter, installs \`GalaxyQuest.apk\`, and transfers the cooked assets to your headset.

#### Option B: Manual Sideloading (macOS, Linux & Advanced Users)
1. Download \`GalaxyQuest.apk\` and \`GalaxyQuest-converter.zip\` from [GitHub Releases](https://github.com/bigmak94/GalaxyQuest/releases/latest).
2. Sideload the APK onto your headset:
   \`\`\`bash
   adb install --no-incremental -r GalaxyQuest.apk
   \`\`\`
3. Extract your Super Mario Galaxy disc using Dolphin or DolphinTool into \`sys\` and \`files\` folders.
4. Run the cook script with Python:
   \`\`\`bash
   python tools/cook/cook.py --disc /path/to/extracted/disc --out /path/to/output
   \`\`\`
5. Push the converted files to \`/sdcard/GalaxyQuest/\` on your headset:
   \`\`\`bash
   adb push output/* /sdcard/GalaxyQuest/
   \`\`\`
6. Launch **GalaxyQuest** from **App Library → Unknown Sources**!

### VR Modes & Controls
* **3D Diorama Mode:** Experience Mario running on miniature gravity planets hovering 1.5m in front of you. Lean in to inspect the worlds with roomscale tracking.
* **Giant Screen Mode:** Play on a massive 120Hz virtual theater screen with optional Stereoscopic 3D and Mixed Reality Passthrough.
* **Star Bit Laser Pointer:** Shoot and collect Star Bits using a direct tracked laser emitted from your right Touch controller.
* **Tilt Controls:** Ray surfing and Star Ball rolling intuitively react to your right controller's real-world wrist tilt.`,
    troubleshooting_notes: 'All 44 galaxies are playable. Be sure to use clean unmodded Wii disc dumps. If game files are missing upon launch, the in-app setup screen allows you to select the folder where your assets reside.'
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
