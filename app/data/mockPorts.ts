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
    youtube_video_id: 'IWM7vi_OP6E',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/RTCWQuest/main/',
    base_game_url: 'https://store.steampowered.com/app/9010/Return_to_Castle_Wolfenstein/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/1446/rtcwquest',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/DrBeef/RTCWQuest',
    latest_version: 'v1.4.1',
    last_github_update: '2026-09-29T20:49:29Z',
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
    youtube_video_id: '-Fa1ce9x88Y',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Teleport', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/xash/valve/',
    base_game_url: 'https://store.steampowered.com/app/70/HalfLife/',
    base_game_store: 'Steam',
    port_download_url: 'https://www.lambda1vr.com/',
    port_download_source: 'Official Website / SideQuest',
    github_url: 'https://github.com/DrBeef/Lambda1VR',
    latest_version: 'v1.7.4',
    last_github_update: '2026-09-29T18:28:44Z',
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
    youtube_video_id: 'y2y9C0E2kPk',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Comfort Vignette'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Doom3Quest/base/',
    base_game_url: 'https://store.steampowered.com/app/9050/DOOM_3/',
    base_game_store: 'Steam',
    port_download_url: 'https://www.doom3quest.com/',
    port_download_source: 'Doom3Quest.com',
    github_url: 'https://github.com/DrBeef/Doom3Quest',
    latest_version: 'v1.4.8',
    last_github_update: '2026-09-30T08:30:56Z',
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
    youtube_video_id: 'vMBsdsAICSY',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/CitraVR/roms/',
    base_game_url: null,
    base_game_store: null,
    port_download_url: 'https://github.com/amwatson/CitraVR/releases',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/amwatson/CitraVR',
    latest_version: 'v0.6.0',
    last_github_update: '2026-08-17T06:44:44Z',
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
    youtube_video_id: 'OoNCvmUxUFE',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Teleport'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/QuestZDoom/wads/',
    base_game_url: 'https://store.steampowered.com/app/2280/Ultimate_Doom/',
    base_game_store: 'Steam',
    port_download_url: 'https://www.questzdoom.com/',
    port_download_source: 'QuestZDoom Launcher',
    github_url: 'https://github.com/DrBeef/QuestZDoom',
    latest_version: '1.6.2',
    last_github_update: '2026-09-30T08:01:52Z',
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
    youtube_video_id: 'ToM-wz3v-NU',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/JKXR/base/',
    base_game_url: 'https://store.steampowered.com/app/6030/STAR_WARS_Jedi_Knight_II__Jedi_Outcast/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/11796/jkxr-star-wars-jedi-knight-ii-jedi-outcast-vr',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/DrBeef/JKXR',
    latest_version: 'v1.2.0',
    last_github_update: '2026-09-29T20:37:24Z',
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
    youtube_video_id: 'qByCUtT6WG0',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Quake2Quest/baseq2/',
    base_game_url: 'https://store.steampowered.com/app/2320/Quake_II/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/353/quake2quest',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/DrBeef/Quake2Quest',
    latest_version: 'v1.1.1',
    last_github_update: '2026-09-29T20:43:23Z',
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
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/preyvr.jpg',
    youtube_video_id: 'e8KZmDCdPb4',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/preyvr/preybase/',
    base_game_url: null,
    base_game_store: 'Original DVD / Archive',
    port_download_url: 'https://sidequestvr.com/app/23478/prey-vr',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/lvonasek/PreyVR',
    latest_version: 'v1.2.4',
    last_github_update: '2026-03-24T17:18:41Z',
    featured: false,
    installation_guide: `### Installation
1. Install the APK build provided on SideQuest or Team Beef.
2. Copy the \`.pk4\` files from your original retail Prey (2006) PC installation into \`/sdcard/preyvr/preybase/\`.
3. Launch the game from Unknown Sources.`,
    troubleshooting_notes: 'Requires strong VR motion tolerance due to disorienting wall-walking and inverted gravity physics.'
  },
  {
    id: '9',
    slug: 'beefraiderxr',
    title: 'Beef Raider XR (Tomb Raider 1)',
    developer: 'Team Beef',
    developer_url: 'https://www.patreon.com/teambeef',
    short_description: 'Step into the boots of Lara Croft in the legendary 1996 action adventure Tomb Raider, completely rebuilt for standalone 6DoF VR with dual-wield pistols, roomscale climbing, and physical puzzles.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/beefraiderxr.jpg',
    youtube_video_id: 'aTtOlcLPbCs',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Comfort Vignette'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/BeefRaiderXR/',
    base_game_url: 'https://store.steampowered.com/app/224960/Tomb_Raider_I/',
    base_game_store: 'Steam / GOG',
    port_download_url: 'https://sidequestvr.com/app/38086/beef-raider-xr-tomb-raider-in-vr',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/Team-Beef-Studios/BeefRaiderXR',
    latest_version: '1.0.0',
    last_github_update: '2024-09-29T21:37:18Z',
    featured: true,
    installation_guide: `### Prerequisites
* A legally owned copy of the original *Tomb Raider I (1996)* (Steam or GOG).
* Meta Quest headset with Developer Mode enabled or the SideQuest app.

### Step-by-Step Installation
1. Install **Beef Raider XR** from SideQuest onto your headset.
2. Launch Beef Raider XR once on your headset to generate the internal folder structure, then close it.
3. On your computer, open your installed Tomb Raider I game folder:
   - For Steam: \`steamapps/common/Tomb Raider (I)/\`
   - For GOG: locate the installation folder containing the game data (\`GAME.GOG\` or \`TOMB.DAT\`).
4. Copy the game data files into \`/sdcard/BeefRaiderXR/\` on your Quest.
5. Put on your headset and launch Beef Raider XR from the "Unknown Sources" library tab.`,
    troubleshooting_notes: 'If audio or cutscenes fail to play, ensure the game CD audio tracks are extracted into the /sdcard/BeefRaiderXR/audio/ folder in OGG or MP3 format.'
  },
  {
    id: '10',
    slug: 'quakequest',
    title: 'QuakeQuest (Quake 1 VR)',
    developer: 'Team Beef',
    developer_url: 'https://www.patreon.com/teambeef',
    short_description: 'Original gothic dark-fantasy shooter Quake fully reimagined for standalone 6DoF VR with dual-wielding, custom weapon models, and fluid teleport/smooth locomotion.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/quakequest.jpg',
    youtube_video_id: 'A42X55BKF6Q',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Teleport', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/QuakeQuest/id1/',
    base_game_url: 'https://store.steampowered.com/app/2310/Quake/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/93/quakequest-for-quest-pico',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/Team-Beef-Studios/QuakeQuest',
    latest_version: 'v1.6.0',
    last_github_update: '2026-09-29T18:33:22Z',
    featured: true,
    installation_guide: `### Prerequisites
* Legally owned copy of *Quake* (Steam, GOG, or Bethesda).
* Meta Quest headset with Developer Mode enabled or SideQuest.

### Step-by-Step Installation
1. Install **QuakeQuest** APK using SideQuest.
2. Launch QuakeQuest once inside your headset to allow it to initialize folder permissions.
3. On your computer, open your installed Quake folder: \`steamapps/common/Quake/id1/\`.
4. Copy \`pak0.pak\` and \`pak1.pak\` into \`/sdcard/QuakeQuest/id1/\` on your Quest.
5. Put on your headset and launch QuakeQuest from "Unknown Sources".`,
    troubleshooting_notes: 'Ensure pak files are lowercase (pak0.pak, pak1.pak). Add soundtrack in OGG format under /sdcard/QuakeQuest/id1/sound/cdtracks/ for classic atmospheric music.'
  },
  {
    id: '11',
    slug: 'razexr',
    title: 'RazeXR (Duke Nukem 3D, Blood, Shadow Warrior)',
    developer: 'Team Beef',
    developer_url: 'https://www.patreon.com/teambeef',
    short_description: 'Universal Build Engine VR port bringing Duke Nukem 3D, Blood, Shadow Warrior, Redneck Rampage, and Powerslave/Exhumed into standalone 6DoF virtual reality.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/razexr.jpg',
    youtube_video_id: 'BYz7r7q65sk',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Comfort Vignette'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/RazeXR/',
    base_game_url: 'https://store.steampowered.com/app/434050/Duke_Nukem_3D_20th_Anniversary_World_Tour/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/24502/razexr-build-engine-for-quest',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/Team-Beef-Studios/RazeXR',
    latest_version: 'v1.0.0',
    last_github_update: '2023-09-30T15:30:26Z',
    featured: true,
    installation_guide: `### Step-by-Step Installation
1. Install **RazeXR** via SideQuest onto your headset.
2. Launch the app once to initialize subdirectories for each supported Build Engine game.
3. Transfer game data files into their respective subfolders in \`/sdcard/RazeXR/\`:
   - Duke Nukem 3D: copy \`duke3d.grp\`
   - Blood: copy \`blood.rff\` and all sound files
   - Shadow Warrior: copy \`sw.grp\`
4. Put on headset and select your chosen game from the in-VR launcher menu.`,
    troubleshooting_notes: 'Atomic Edition and Megaton Edition grp files are fully compatible. Toggle weapon scale and HUD position in the VR Options menu.'
  },
  {
    id: '12',
    slug: 'questcraft',
    title: 'QuestCraft (Minecraft: Java Edition)',
    developer: 'QuestCraft Team',
    developer_url: 'https://questcraft.net/',
    short_description: 'Minecraft: Java Edition running natively on standalone Meta Quest using Vivecraft and Pojlib, featuring 6DoF motion controls, world generation, and server multiplayer.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/questcraft.jpg',
    youtube_video_id: 'PomiV1iyTp8',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Teleport', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.qcxr.qcxr/files/',
    base_game_url: 'https://www.minecraft.net/en-us/store/minecraft-java-bedrock-edition-pc',
    base_game_store: 'Minecraft.net',
    port_download_url: 'https://sidequestvr.com/app/7150/questcraft',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/QuestCraftPlusPlus/QuestCraft',
    latest_version: '6.0.0',
    last_github_update: '2025-05-31T19:00:02Z',
    featured: true,
    installation_guide: `### Prerequisites
* Official Microsoft / Minecraft Java Edition account.
* Meta Quest 2, 3, or Pro.

### Step-by-Step Installation
1. Install **QuestCraft** using SideQuest or the in-headset SideQuest app.
2. Open QuestCraft from Unknown Sources.
3. Sign in to your Microsoft account using the on-screen device link code (e.g. microsoft.com/link).
4. Select your desired Minecraft version (recommended stable profile) and tap Play.
5. Wait for the engine assets to download directly onto the headset and enter your world!`,
    troubleshooting_notes: 'First launch requires an active Wi-Fi connection to authenticate with Microsoft and download game files. Performance on Quest 3 allows higher render distance (up to 10 chunks).'
  },
  {
    id: '13',
    slug: 'csvr',
    title: 'CSVR (Counter-Strike 1.6 VR)',
    developer: 'Team Beef',
    developer_url: 'https://www.patreon.com/teambeef',
    short_description: 'The legendary tactical FPS Counter-Strike 1.6 in standalone 6DoF VR! Experience de_dust2, office, and classic bot matches with physical two-handed gunplay.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/csvr.jpg',
    youtube_video_id: '5ivdcCWly54',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/xash/cstrike/',
    base_game_url: 'https://store.steampowered.com/app/10/CounterStrike/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/45868/csvr-classic-counter-strike-in-vr',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/Team-Beef-Studios/CSVR',
    latest_version: 'v1.0.5',
    last_github_update: '2026-07-29T13:50:34Z',
    featured: true,
    installation_guide: `### Prerequisites
* Counter-Strike 1.6 on Steam.
* Meta Quest with Developer Mode or SideQuest.

### Step-by-Step Installation
1. Install the **CSVR** APK via SideQuest.
2. Launch CSVR once on the headset to create the folder hierarchy.
3. On your PC, navigate to \`Steam/steamapps/common/Half-Life/cstrike/\`.
4. Copy the \`cstrike\` folder contents into \`/sdcard/xash/cstrike/\` on your Quest.
5. Put on headset and launch CSVR from Unknown Sources.`,
    troubleshooting_notes: 'Supports bot matches and LAN/online multiplayer with compatible servers.'
  },
  {
    id: '14',
    slug: 'hexen2vr',
    title: 'Hexen II VR',
    developer: 'alex.nax & Team Beef',
    developer_url: 'https://sidequestvr.com/app/54816/hexen-ii-vr',
    short_description: 'Dark fantasy boomer shooter Hexen II in standalone VR featuring physical melee weapons, spellcasting, roomscale exploration, and 4 playable RPG character classes.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/hexen2vr.jpg',
    youtube_video_id: 'wKyfjeuv46o',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Hexen2VR/data1/',
    base_game_url: 'https://store.steampowered.com/app/9060/HeXen_II/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/54816/hexen-ii-vr',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/alexnax/VHexen2',
    latest_version: '0.1.0-alpha',
    last_github_update: '2024-05-15T10:00:00Z',
    featured: false,
    installation_guide: `### Step-by-Step Installation
1. Install Hexen II VR from SideQuest.
2. Copy \`pak0.pak\` and \`pak1.pak\` from your PC \`Steam/steamapps/common/HeXen II/data1/\` into \`/sdcard/Hexen2VR/data1/\`.
3. Launch from Unknown Sources.`,
    troubleshooting_notes: 'Alpha release. Save your game frequently.'
  },
  {
    id: '15',
    slug: 'ppsspp-vr',
    title: 'PPSSPP VR',
    developer: 'Henrik Rydgård',
    developer_url: 'https://www.ppsspp.org/',
    short_description: 'Leading Sony PlayStation Portable emulator ported to standalone VR. Play PSP classics on massive virtual curved screens or true stereoscopic 3D geometry mode.',
    category: 'emulator',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/ppsspp-vr.jpg',
    youtube_video_id: 'y3dgEeDW5Xw',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/PSP/GAME/',
    base_game_url: null,
    base_game_store: null,
    port_download_url: 'https://sidequestvr.com/app/12379/ppsspp-vr',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/hrydgard/ppsspp',
    latest_version: 'v1.20.4',
    last_github_update: '2026-05-16T12:35:08Z',
    featured: true,
    installation_guide: `### Installation
1. Install PPSSPP VR APK via SideQuest.
2. Transfer dumped PSP ISO/CSO backups to \`/sdcard/PSP/GAME/\` on your Quest.
3. Launch PPSSPP VR, configure your virtual screen scale, and play using Quest Touch controllers or Bluetooth gamepad.`,
    troubleshooting_notes: 'Toggle stereoscopic 3D rendering in graphics options for enhanced depth in 3D titles like Ridge Racer, Wipeout, and Monster Hunter.'
  },
  {
    id: '16',
    slug: 'winlatorxr',
    title: 'WinlatorXR',
    developer: 'N0l3r',
    developer_url: 'https://github.com/WinlatorXR/WinlatorXR',
    short_description: 'OpenXR compatibility layer running Windows x86 PC applications and games natively on Meta Quest using Wine and Box86/Box64 translation.',
    category: 'emulator',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/winlatorxr.jpg',
    youtube_video_id: 'neSyrMRFs9c',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: null,
    base_game_store: null,
    port_download_url: 'https://sidequestvr.com/app/37320/winlatorxr',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/WinlatorXR/WinlatorXR',
    latest_version: 'cats-27',
    last_github_update: '2026-07-01T14:17:23Z',
    featured: false,
    installation_guide: `### Installation
1. Download and install WinlatorXR APK via SideQuest or GitHub Releases.
2. Put game installation folders in your Quest \`/sdcard/Download/\` directory.
3. Open WinlatorXR, create a new Wine Container with Turnip drivers and DXVK enabled, and run your setup or .exe file.`,
    troubleshooting_notes: 'Best suited for older DirectX 9 / 10 PC titles on Quest 3 / 3S for optimal performance.'
  },
  {
    id: '17',
    slug: 'time-crisis-vr',
    title: 'Time Crisis VR',
    developer: 'DR-89',
    developer_url: 'https://github.com/DR-89/time-crisis-vr',
    short_description: 'Standalone 6DoF VR arcade port of Namco\'s iconic light-gun rail shooter Time Crisis running at 120 Hz on Meta Quest 3 with 1:1 tracked pistol, physical roomscale ducking, and original arcade sound.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/time-crisis-vr.jpg',
    youtube_video_id: 'PGUc8b3VIu0',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Physical Ducking', 'Cover System'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/TimeCrisisVR/',
    base_game_url: null,
    base_game_store: 'Namco System 22 Arcade',
    port_download_url: 'https://github.com/DR-89/time-crisis-vr/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/DR-89/time-crisis-vr',
    latest_version: 'v0.8.3',
    last_github_update: '2026-10-04T22:29:35Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 3 or Quest 3S with Developer Mode enabled.
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation
1. Download the latest complete APK (\`TimeCrisisVR-v0.8.3-quest3.apk\`) from the official [GitHub Releases](https://github.com/DR-89/time-crisis-vr/releases/latest).
2. Connect your Quest 3 via USB and install via SideQuest or terminal:
   \`adb install -r TimeCrisisVR-v0.8.3-quest3.apk\`
3. Launch the game from **Unknown Sources → Time Crisis VR (Experimental)**. The complete APK extracts bundled game files automatically.
4. On the arcade boot screen, press **A (Right Controller)** to insert credits, then press **Right Trigger** to start the mission!

### Controls & Cover System
* **Right Controller / Trigger**: Aim and shoot tracked 3D pistol
* **A (Right)**: Insert arcade credits
* **B (Right)**: Toggle silent laser pointer
* **Left Trigger / Physical Ducking**: Hold left trigger to leave cover and shoot; release to duck/reload. Alternatively, enable **Physical Ducking** in the menu (press Left Menu button) and press **X** while upright to calibrate height!`,
    troubleshooting_notes: 'Target framerate is 120 Hz. Ensure you are on the latest v0.8.3+ APK build which boots directly into immersive VR mode without flat-screen regressions.'
  },
  {
    id: '18',
    slug: 'primedgun',
    title: 'PrimedGun (Metroid Prime VR)',
    developer: 'Nobbie248',
    developer_url: 'https://github.com/Nobbie248',
    short_description: 'Standalone 6DoF VR source injection of Nintendo GameCube classic Metroid Prime running natively on Meta Quest with 1:1 tracked Arm Cannon, immersive helmet visors, and Vulkan multiview.',
    category: 'vr_injection',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/primedgun.jpg',
    youtube_video_id: 'd_xUXZURdzM',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/PrimedGun/',
    base_game_url: null,
    base_game_store: 'Nintendo GameCube',
    port_download_url: 'https://github.com/Nobbie248/PrimedGun/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/Nobbie248/PrimedGun',
    latest_version: 'v1.1.7',
    last_github_update: '2026-10-02T14:25:35Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, 3, 3S, or Pro with Developer Mode enabled.
* Original **Metroid Prime (NTSC-U Revision 0 / v1.0)** GameCube ISO/GCM disc backup.
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation
1. Download the latest standalone Quest APK (\`primedgun-quest-release.apk\`) from [GitHub Releases](https://github.com/Nobbie248/PrimedGun/releases/latest).
2. Connect your Meta Quest via USB and install the APK via SideQuest or terminal:
   \`adb install -r primedgun-quest-release.apk\`
3. Transfer your \`Metroid Prime (USA) (Rev 0).iso\` backup into \`/sdcard/PrimedGun/\` (or any accessible folder on your headset storage).
4. Put on your Quest, go to **App Library → Unknown Sources**, and launch **PrimedGun**.
5. Use the in-headset launcher to select your ISO file and tap Play.
6. Note: Initial shader compilation takes 2-3 minutes on the first launch. Wait for the progress indicator inside VR to complete.

### Controls & Calibration
* **Right Controller / Trigger**: Aim and shoot 1:1 tracked Arm Cannon; Right Grip fires Missiles.
* **Right Stick Click**: Recenter and calibrate your player height / floor level.
* **Left Controller**: Smooth locomotion with thumbstick; Left Stick Click opens the in-VR settings menu.
* **Visors & Beams**: Switch visors and beam weapons naturally using controller gestures or weapon wheel.
* **Pro Tip**: When exiting, press *Exit Game* in the VR menu twice to ensure compiled shaders are safely cached to disk for instant subsequent loads!`,
    troubleshooting_notes: 'Requires Metroid Prime USA NTSC-U v1.0 (Rev 0). European PAL or Japanese editions are not officially supported. Standalone performance shines at 90 Hz on Quest 3 / 3S with Vulkan multiview rendering.'
  },
  {
    id: '19',
    slug: 'astroquest',
    title: 'AstroQuest (ASTRO BOT Rescue Mission)',
    developer: 'bigmak94',
    developer_url: 'https://github.com/bigmak94',
    short_description: 'PlayStation VR masterpiece ASTRO BOT Rescue Mission running natively on Meta Quest 3 via an ARM64 port of shadPS4, featuring 6DoF hand-tracked DualSense gamepad integration, 3D audio, and mic blowing.',
    category: 'emulator',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/astroquest.jpg',
    youtube_video_id: '1FXer9AHf68',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Seated', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.astrobotquest.vrhost/files/',
    base_game_url: null,
    base_game_store: 'PlayStation 4 / PS VR',
    port_download_url: 'https://github.com/bigmak94/AstroQuest/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/bigmak94/AstroQuest',
    latest_version: 'v0.13',
    last_github_update: '2026-10-03T15:42:53Z',
    featured: true,
    installation_guide: `### Prerequisites
* **Meta Quest 3 or Quest 3S** (Quest 2 is not supported due to high CPU/GPU requirements of PS4 emulation).
* **PS5 DualSense Controller** (paired via Bluetooth with the headset; Quest hand tracking tracks the physical controller in 3D space!).
* Clean dumped copy of **ASTRO BOT Rescue Mission** (European PS4 release \`CUSA12392\`, version 1.00) dumped from your own console as an unpacked folder or \`.pkg\`.
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation
1. Download the latest standalone Quest APK (\`AstroQuest-0.13-Quest3.apk\`) from [GitHub Releases](https://github.com/bigmak94/AstroQuest/releases/latest).
2. Install the APK to your Quest 3 via SideQuest or command line:
   \`adb install -r AstroQuest-0.13-Quest3.apk\`
3. Pair your **PS5 DualSense controller** to the Quest 3:
   * On Quest: Go to **Settings → Bluetooth → Pair new device**.
   * On DualSense: Hold **Create (Share) + PS Button** until the light bar flashes rapidly.
4. Transfer your game dump folder or package to your Quest storage:
   * Put game files in \`/sdcard/Android/data/com.astrobotquest.vrhost/files/games/\`
5. Put on your Quest 3, open **App Library → Unknown Sources**, and launch **Astro VR Host**.
6. Grant microphone permission when prompted (the game listens to your breath to blow dandelions and gadgets, exactly as on PS VR!).
7. Place your Touch controllers aside and hold the DualSense. Hold it inside the floating outline to calibrate 3D hand tracking.

### Controls & Calibrating View
* **Hold OPTIONS (or press PS button)** for 1 second at any time to instantly reset and center the VR camera view.
* **DualSense Motion & Touchpad**: Fully mapped to in-game gadgets (water gun, ninja stars, hookshot).
* **Save Files**: Saved automatically to \`/sdcard/Android/data/com.astrobotquest.vrhost/files/data/shadPS4/home/1000/savedata/\`. (Updating the APK with \`adb install -r\` preserves saves).`,
    troubleshooting_notes: 'Target framerate is 30 FPS in heavy action / 45 FPS in lighter scenes using spatial reprojection. Ensure your DualSense is paired directly to the headset via Bluetooth so Quest hand tracking can locate it in VR.'
  },
  {
    id: '20',
    slug: 'sourcevr',
    title: 'SourceVR (Half-Life 2 & Portal VR)',
    developer: 'tinsarfal',
    developer_url: 'https://github.com/tinsarfal',
    short_description: 'Native standalone Valve Source Engine port for Meta Quest. Play Half-Life 2, Episode 1, Episode 2, Lost Coast, Portal, and Portal 2 in full 6DoF VR without PCVR.',
    category: 'source_port',
    status: 'released',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/sourcevr.jpg',
    youtube_video_id: 'QzgDw8xEpeM',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/SourceVRPort/common/',
    base_game_url: 'https://store.steampowered.com/app/220/HalfLife_2/',
    base_game_store: 'Steam',
    port_download_url: 'https://github.com/tinsarfal/SourceVR/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/tinsarfal/SourceVR',
    latest_version: '0.1.28',
    last_github_update: '2026-10-02T09:32:10Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, 3, 3S, or Pro with Developer Mode enabled.
* Original **Half-Life 2** (and optionally Episode 1, Episode 2, Portal) on Steam.
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation
1. Download the latest standalone Quest APK (\`SourceVR-0.1.28.apk\`) from [GitHub Releases](https://github.com/tinsarfal/SourceVR/releases/latest).
2. Install the APK to your Meta Quest via SideQuest or command line:
   \`adb install -r SourceVR-0.1.28.apk\`
3. Launch **SourceVRPort** once from **App Library → Unknown Sources** on your headset and grant file permissions.
4. Locate your game installation folders on PC:
   * **Half-Life 2**: \`Steam/steamapps/common/Half-Life 2/\`
   * **Portal**: \`Steam/steamapps/common/Portal/\`
5. Copy the game content folders to your Quest storage under \`/sdcard/SourceVRPort/common/\`:
   * For **Half-Life 2**: copy \`hl2\` and \`platform\`
   * For **Episode One**: also copy \`episodic\`
   * For **Episode Two**: also copy \`ep2\`
   * For **Portal**: copy \`portal\` (uses shared \`hl2\` content)
6. Put on your headset, open **SourceVRPort**, choose your game, and hit **Play** once the content check reports ready!

### Supported Games in One Hub
* **Half-Life 2**: Full 6DoF motion controls, weapon wheel, interactive vehicles (airboat & buggy).
* **Episode 1 & Episode 2**: Full campaign continuity and flashlight tracking.
* **Lost Coast**: High dynamic range showcase chapter.
* **Portal**: Hand-tracked Aperture Science Handheld Portal Device.
* **Entropy : Zero**: Community campaign support.
* **Portal 2**: Experimental testing build.`,
    troubleshooting_notes: 'Steam legacy files work out-of-the-box. Ensure you copy the required folders into /sdcard/SourceVRPort/common/. Custom content mods can be placed in /sdcard/SourceVRPort/common/hl2/custom/.'
  },
  {
    id: '21',
    slug: 'simpsonshitrun',
    title: 'The Simpsons: Hit & Run VR',
    developer: 'kote2345',
    developer_url: 'https://github.com/kote2345',
    short_description: 'Full standalone 6DoF VR port of The Simpsons: Hit & Run for Meta Quest. Explore Springfield in roomscale VR with motion-controlled driving and OpenXR Vulkan rendering.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/simpsonshitrun.jpg',
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
  },
  {
    id: '22',
    slug: 'halocequest',
    title: 'Halo CE Quest VR',
    developer: 'moistman42069',
    developer_url: 'https://github.com/moistman42069',
    short_description: 'Native standalone OpenXR VR port of Halo: Combat Evolved for Meta Quest. Experience the legendary campaign and multiplayer with 6DoF motion controls, two-handed weapon handling, and full-body IK.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/halocequest.jpg',
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
  },
  {
    id: '23',
    slug: 'galaxyquest',
    title: 'GalaxyQuest (Super Mario Galaxy VR)',
    developer: 'bigmak94',
    developer_url: 'https://github.com/bigmak94',
    short_description: 'Native standalone VR port of Super Mario Galaxy for Meta Quest 2 and 3, built on the Petari decompilation. Play in full 3D diorama mode with motion-tracked Star Bit laser aiming or on a giant 120Hz stereoscopic screen.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/galaxyquest.jpg',
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
  },
  {
    id: '24',
    slug: 'qualyx',
    title: 'Qualyx (Half-Life: Alyx VR)',
    developer: 'tinsarfal',
    developer_url: 'https://github.com/tinsarfal',
    short_description: "Native standalone VR port of Valve's Half-Life: Alyx for Meta Quest headsets. Experience City 17, the Citadel, and the Gravity Gloves in roomscale 6DoF with OpenXR and Positional Time Warp.",
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/qualyx.jpg',
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
  },
  {
    id: '25',
    slug: 'goldeneye-vr',
    title: 'GoldenEye VR (007)',
    developer: 'MrSco',
    developer_url: 'https://github.com/MrSco',
    short_description: "Native standalone VR port of GoldenEye 007 for Meta Quest, built from the N64 decompilation. Step into James Bond's shoes with 6DoF motion aiming, watch gadget HUD, working sniper scopes, and online multiplayer.",
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/goldeneye-vr.jpg',
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
  },
  {
    id: '26',
    slug: 'questcarnage',
    title: 'QuestCarNage (Carmageddon VR)',
    developer: 'maranone',
    developer_url: 'https://github.com/maranone',
    short_description: 'Native standalone OpenXR VR port of the vehicular combat classic Carmageddon for Meta Quest headsets, based on the Dethrace engine reimplementation with 120Hz support.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/questcarnage.jpg',
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
  },
  {
    id: '27',
    slug: 'gta-sa-vr-quest',
    title: 'Grand Theft Auto: San Andreas VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest',
    short_description: 'Grand Theft Auto: San Andreas in standalone 6DoF VR on Meta Quest. Features first-person motion controller gunplay, immersive driving, and full Los Santos freedom.',
    category: 'game_mod',
    status: 'in_development',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/gtasa_vr.jpg',
    youtube_video_id: '9NAW-5CKdFc',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn', 'Vehicles'],
    has_6dof_controls: true,
    internal_storage_path: 'Android/data/com.rockstargames.gtasa/files',
    base_game_url: 'https://play.google.com/store/apps/details?id=com.rockstargames.gtasa',
    base_game_store: 'Google Play Store',
    port_download_url: null,
    port_download_source: 'GitHub Build Script',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest',
    latest_version: '0.3.1 alpha',
    last_github_update: '2026-10-04T12:00:00Z',
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
    troubleshooting_notes: 'Active development (alpha build). If you encounter black screen crashes on launch, verify that your Google Play game version matches 2.11.311 ARM64 and that the PS2 audio package was extracted correctly.'
  },
  {
    id: '28',
    slug: 'vice-city-vr-quest',
    title: 'Grand Theft Auto: Vice City VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/vice-city-vr-quest',
    short_description: 'Experience Grand Theft Auto: Vice City in full standalone 6DoF VR on Meta Quest. Features motion-tracked weapon aiming, physical steering wheel vehicle driving, articulated ragdolls, and Vulkan stereo rendering.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/vicecity_vr.jpg',
    youtube_video_id: 'My0gwnPvWU8',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale', 'Steering Wheel Driving', 'Two-Handed Aiming'],
    has_6dof_controls: true,
    internal_storage_path: 'Android/data/com.revc.miamivr/files',
    base_game_url: 'https://store.steampowered.com/app/12110/Grand_Theft_Auto_Vice_City/',
    base_game_store: 'Steam / PC CD / Rockstar',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/vice-city-vr-quest',
    latest_version: 'v0.5.6',
    last_github_update: '2026-10-04T18:00:00Z',
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
    troubleshooting_notes: 'The wizard creates a log file at %TEMP%\\ViceCityVR-Build-And-Install.log (Windows) or $TMPDIR/ViceCityVR-Build-And-Install.log (Linux). Ensure your Vice City PC directory contains clean original game files.'
  },
  {
    id: '29',
    slug: 'gran-turismo-2-vr',
    title: 'Gran Turismo 2 VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gt-2-pc',
    short_description: 'Native C++ standalone port of Gran Turismo 2 for Meta Quest. Features full 6DoF stereo cockpit driving, physical steering wheel interactions, dynamic rear-view mirrors, and 120Hz support.',
    category: 'source_port',
    status: 'playable_beta',
    cover_image_url: 'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/gran_turismo_2_vr.jpg',
    youtube_video_id: 'V6TifTwtsqg',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Cockpit VR', 'Virtual Wheel', 'Motion Steering', 'Stick Driving', 'Theatre Menus'],
    has_6dof_controls: true,
    internal_storage_path: 'Android/data/io.github.gt2pc.quest/files',
    base_game_url: 'https://www.mobygames.com/game/1597/gran-turismo-2/',
    base_game_store: 'PlayStation PS1 Disc (BIN/CUE)',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gt-2-pc',
    latest_version: 'v0.8.1',
    last_github_update: '2026-10-04T20:00:00Z',
    port_download_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gt-2-pc/releases/download/v0.8.1/GT2-0.8.1.zip',
    port_download_source: 'GitHub Release ZIP',
    featured: true,
    installation_guide: `### Overview
**Gran Turismo 2 VR** is a native C++ standalone source port for Meta Quest (optimized for Quest 3 / Quest 3S). It brings both Arcade and Simulation discs to life in full stereoscopic 6DoF Virtual Reality with interactive cockpits, working instrument needles, and functioning rear-view mirrors.

> [!NOTE]
> Unlike source-build kits, the official release ZIP already includes a **pre-compiled signed Quest APK** under \`native/\`. You only need to supply your legally dumped Gran Turismo 2 PS1 disc images (\`BIN\` / \`CUE\`).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Original PS1 disc images of **Gran Turismo 2** (\`BIN\` / \`CUE\` files for Arcade and Simulation mode).
3. PC connected via USB-C cable (Windows or Linux).

---

### Installation Steps

1. **Download the Release:**
   Download the latest release package \`GT2-0.8.1.zip\` from [GitHub Releases](https://github.com/dubrovskiy-yevhen-stakelogic/gt-2-pc/releases/latest).
2. **Extract the ZIP:**
   Extract the entire ZIP archive to a folder on your PC.
3. **Connect Your Quest:**
   Plug your Quest into your PC with a USB cable and accept the **"Allow USB Debugging"** prompt inside the headset.
4. **Run the Installer:**
   * **Windows:** Double-click \`INSTALL-QUEST.bat\`
   * **Linux:** Run \`bash native/INSTALL-LINUX.sh\`
5. **Select Your Disc Image:**
   When prompted, select your Gran Turismo 2 \`BIN\` disc image. The script extracts the game assets, installs the signed APK, and copies all data directly to \`/sdcard/Android/data/io.github.gt2pc.quest/files\`.
6. **Launch in VR:**
   Put on your headset, open **App Library → Unknown Sources**, and launch **Gran Turismo 2 VR**!

---

### VR Driving Controls
* **Steering Modes:** Choose between **Virtual Wheel** (grab the 3D wheel with Touch grips), **Motion Steering** (twist wrist angle), or **Stick** driving.
* **VR Menu:** Press **Both Grips + Left Menu button** (or press L3 + R3 stick clicks) anytime during a race to adjust VR seat height, mirrors, supersampling, and 72/90/120Hz display modes.`,
    troubleshooting_notes: 'Supply complete BIN/CUE images (2048-byte ISOs lack necessary CD-DA audio sectors). To access in-game VR cockpit calibration and resolution settings, press Both Grips + Left Menu.'
  }
]




