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
  }
]

