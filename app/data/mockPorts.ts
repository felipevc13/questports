import type { Port } from '~/types/port'

export const INITIAL_PORTS: Port[] = [
  {
    id: '1',
    slug: 'rtcwquest',
    title: 'RTCWQuest (Return to Castle Wolfenstein)',
    developer: 'Team Beef',
    developer_url: 'https://www.patreon.com/teambeef',
    short_description: 'Full 6DoF VR source port of Return to Castle Wolfenstein by Team Beef featuring dual-wield weapons, gesture interactions, and roomscale immersion.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/rtcwquest.jpg',
    youtube_video_id: '2r9t4m3dKqA',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/RTCWQuest/main/',
    base_game_url: 'https://store.steampowered.com/app/9010/Return_to_Castle_Wolfenstein/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/1446/rtcwquest',
    port_download_source: 'SideQuest',
    featured: true,
    installation_guide: `### Prerequisites
* A legally owned copy of *Return to Castle Wolfenstein* (Steam or GOG).
* Meta Quest headset with Developer Mode enabled or the SideQuest app (Desktop or Android).

### Step-by-Step Installation
1. Install the **RTCWQuest** APK using SideQuest or run \`adb install rtcwquest.apk\`.
2. Launch RTCWQuest once inside your headset to allow it to initialize folder permissions, then exit.
3. On your computer, open your base game's installation directory in Steam:
   \`steamapps/common/Return to Castle Wolfenstein/Main/\`
4. Copy the following \`.pk3\` game files:
   * \`pak0.pk3\`
   * \`sp_pak1.pk3\`
   * \`sp_pak2.pk3\`
   * \`sp_pak3.pk3\`
   * \`sp_pak4.pk3\`
5. Connect your Quest to your PC via USB and copy these files into:
   \`/sdcard/RTCWQuest/main/\`
6. Put on your headset and launch RTCWQuest from the "Unknown Sources" library tab.`,
    troubleshooting_notes: 'If the game crashes on startup, ensure that all .pk3 file extensions are in lowercase on the Quest storage.'
  },
  {
    id: '2',
    slug: 'lambda1vr',
    title: 'Lambda1VR (Half-Life 1)',
    developer: 'Team Beef',
    developer_url: 'https://www.lambda1vr.com/',
    short_description: 'Complete native 6DoF VR port of legendary Half-Life 1 with two-handed weapon handling, headlamp flashlight, and full campaign progression.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/lambda1vr.jpg',
    youtube_video_id: 'v8c0wZpUeGg',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Teleport', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/xash/valve/',
    base_game_url: 'https://store.steampowered.com/app/70/HalfLife/',
    base_game_store: 'Steam',
    port_download_url: 'https://www.lambda1vr.com/',
    port_download_source: 'Official Website / SideQuest',
    featured: true,
    installation_guide: `### Prerequisites
* Original Half-Life 1 on Steam.
* Lambda1VR launcher installed via SideQuest.

### Step-by-Step Installation
1. Install **Lambda1VR** through SideQuest.
2. Launch the app once on the headset so it generates the \`/sdcard/xash/\` directory structure.
3. On your PC, navigate to your Steam installation of Half-Life: \`Half-Life/valve/\`.
4. Copy the contents of the \`valve\` folder.
5. Paste the copied files into \`/sdcard/xash/valve/\` on your Meta Quest.
6. Launch Lambda1VR from "Unknown Sources" in your app library.`,
    troubleshooting_notes: 'For high-resolution textures and enhanced models, download the optional HD Mod Pack from the official Lambda1VR website.'
  },
  {
    id: '3',
    slug: 'doom3quest',
    title: 'Doom 3: Quest Edition',
    developer: 'Team Beef',
    developer_url: 'https://www.doom3quest.com/',
    short_description: 'Full immersive virtual reality port of the original id Tech 4 Doom 3 masterpiece running standalone on Meta Quest.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/doom3quest.jpg',
    youtube_video_id: '0wFw8F9tVzU',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Comfort Vignette'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Doom3Quest/base/',
    base_game_url: 'https://store.steampowered.com/app/9050/DOOM_3/',
    base_game_store: 'Steam',
    port_download_url: 'https://www.doom3quest.com/',
    port_download_source: 'Doom3Quest.com',
    featured: true,
    installation_guide: `### Prerequisites
* **Original 2004 Doom 3** (Note: Doom 3: BFG Edition is **NOT** compatible).
* SideQuest or ADB installed on your computer.

### Step-by-Step Installation
1. Install the Doom3Quest APK launcher via SideQuest.
2. Connect your Quest and open file explorer at \`/sdcard/Doom3Quest/base/\`.
3. From your original 2004 Doom 3 install on PC (\`DOOM 3/base/\`), copy all \`.pk4\` files (\`pak000.pk4\` through \`pak008.pk4\`).
4. Paste the \`.pk4\` files into \`/sdcard/Doom3Quest/base/\`.
5. Launch Doom3Quest on your headset.`,
    troubleshooting_notes: 'Do not use files from the BFG Edition or modern remasters. Only the classic 2004 release is supported.'
  },
  {
    id: '4',
    slug: 'citravr',
    title: 'CitraVR',
    developer: 'amwatson',
    developer_url: 'https://github.com/amwatson/CitraVR',
    short_description: 'Official Nintendo 3DS standalone emulator for Meta Quest featuring stereoscopic 3D rendering and customizable virtual screens.',
    category: 'emulator',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/citravr.jpg',
    youtube_video_id: '5j39kF2z1xA',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/CitraVR/roms/',
    base_game_url: null,
    base_game_store: null,
    port_download_url: 'https://github.com/amwatson/CitraVR/releases',
    port_download_source: 'GitHub Releases',
    featured: true,
    installation_guide: `### Prerequisites
* Legally dumped, decrypted Nintendo 3DS ROMs (.3ds or installed .cia format).
* Meta Quest 3 or 3S recommended for optimal 60 FPS performance at 3x native resolution.

### Step-by-Step Installation
1. Download the latest APK release from the official CitraVR GitHub repository.
2. Install the APK via SideQuest or \`adb install CitraVR.apk\`.
3. Create the folder \`/sdcard/CitraVR/roms/\` on your headset and transfer your game ROMs.
4. Launch CitraVR under Unknown Sources and select your ROMs directory.`,
    troubleshooting_notes: 'On Quest 3 and 3S, increase internal resolution scale to 3x in graphics settings for crisp stereoscopic 3D clarity.'
  },
  {
    id: '5',
    slug: 'questzdoom',
    title: 'QuestZDoom',
    developer: 'Team Beef & BaggyG',
    developer_url: 'https://www.questzdoom.com/',
    short_description: 'GZDoom source port engine for Meta Quest. Experience Doom 1, Doom 2, Brutal Doom, Heretic, and thousands of community mods in full 6DoF VR.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/questzdoom.jpg',
    youtube_video_id: 't89zQf6B2yM',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Teleport'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/QuestZDoom/wads/',
    base_game_url: 'https://store.steampowered.com/app/2280/Ultimate_Doom/',
    base_game_store: 'Steam',
    port_download_url: 'https://www.questzdoom.com/',
    port_download_source: 'QuestZDoom Launcher',
    featured: false,
    installation_guide: `### Installation
1. Install both **QuestZDoom Engine** and the **QuestZDoom Launcher** via SideQuest.
2. Launch the launcher inside the headset to auto-download free shareware WADs, or transfer your commercial \`.wad\` files (such as DOOM.WAD, DOOM2.WAD) into \`/sdcard/QuestZDoom/wads/\`.
3. Use the in-headset launcher UI to toggle mods, high-res texture packs, and 3D weapon models with a single click.`,
    troubleshooting_notes: 'Use the in-headset QuestZDoom Launcher to download and manage mods directly without needing a PC.'
  },
  {
    id: '6',
    slug: 'jkxr',
    title: 'JKXR (Star Wars Jedi Knight II: Jedi Outcast)',
    developer: 'Team Beef',
    developer_url: 'https://www.patreon.com/teambeef',
    short_description: 'Wield lightsabers with 1:1 motion tracking and cast Force powers naturally using real-world hand gestures in the classic Jedi Outcast.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/jkxr.jpg',
    youtube_video_id: '8pLw4z7K1rE',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/JKXR/base/',
    base_game_url: 'https://store.steampowered.com/app/6030/STAR_WARS_Jedi_Knight_II__Jedi_Outcast/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/11796/jkxr-star-wars-jedi-knight-ii-jedi-outcast-vr',
    port_download_source: 'SideQuest',
    featured: false,
    installation_guide: `### Step-by-Step Installation
1. Install the JKXR APK from SideQuest.
2. On your PC, navigate to your Jedi Knight II installation folder: \`Steam/steamapps/common/Jedi Outcast/GameData/base/\`.
3. Copy \`assets0.pk3\`, \`assets1.pk3\`, \`assets2.pk3\`, and \`assets5.pk3\`.
4. Connect your Quest and copy these files into \`/sdcard/JKXR/base/\`.
5. Open the game from Unknown Sources and begin Jedi training!`,
    troubleshooting_notes: 'Natural gestures trigger Force powers: push your hand forward for Force Push, or gesture toward yourself for Force Pull.'
  },
  {
    id: '7',
    slug: 'quake2quest',
    title: 'Quake II Quest',
    developer: 'Team Beef',
    developer_url: 'https://www.patreon.com/teambeef',
    short_description: 'Classic sci-fi shooter by id Software rebuilt for standalone Quest with HD textures, cross-play multiplayer, and dynamic lighting.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/quake2quest.jpg',
    youtube_video_id: '9qVb3Zx8W1A',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Quake2Quest/baseq2/',
    base_game_url: 'https://store.steampowered.com/app/2320/Quake_II/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/353/quake2quest',
    port_download_source: 'SideQuest',
    featured: false,
    installation_guide: `### Step-by-Step Installation
1. Install Quake II Quest via SideQuest.
2. Copy the \`baseq2\` folder from your PC game installation (\`pak0.pak\` and official mission packs).
3. Paste into \`/sdcard/Quake2Quest/baseq2/\` on your Meta Quest.`,
    troubleshooting_notes: 'Original soundtrack files can be placed in an optional music subfolder in OGG or MP3 format.'
  },
  {
    id: '8',
    slug: 'preyvr',
    title: 'Prey VR (Prey 2006 Quest Port)',
    developer: 'Luboš & Team Beef',
    developer_url: 'https://sidequestvr.com/app/23478/prey-vr',
    short_description: 'Mind-bending FPS with wall-walking gravity and living alien portals running natively under the id Tech 4 engine on Meta Quest.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/preyvr_v2.jpg',
    youtube_video_id: 'yUJ5JuV4wjg',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/preyvr/preybase/',
    base_game_url: null,
    base_game_store: 'Original DVD / Archive',
    port_download_url: 'https://sidequestvr.com/app/23478/prey-vr',
    port_download_source: 'SideQuest',
    featured: false,
    installation_guide: `### Installation
1. Install the APK build provided on SideQuest or Team Beef.
2. Copy the \`.pk4\` files from your original retail Prey (2006) PC installation into \`/sdcard/preyvr/preybase/\`.
3. Launch the game from Unknown Sources.`,
    troubleshooting_notes: 'Requires strong VR motion tolerance due to disorienting wall-walking and inverted gravity physics.'
  }
]
