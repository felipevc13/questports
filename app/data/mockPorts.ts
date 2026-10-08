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
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/rtcwquest.jpg',
    youtube_video_id: 'IWM7vi_OP6E',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/RTCWQuest/',
    base_game_url: 'https://store.steampowered.com/app/9010/Return_to_Castle_Wolfenstein/',
    base_game_store: 'Steam',
    port_download_url: 'https://github.com/Team-Beef-Studios/RTCWQuest/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/Team-Beef-Studios/RTCWQuest',
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
    category: 'engine_recreation',
    status: 'released',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/lambda1vr.jpg',
    youtube_video_id: '-Fa1ce9x88Y',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Teleport', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/xash/',
    base_game_url: 'https://store.steampowered.com/app/70/HalfLife/',
    base_game_store: 'Steam',
    port_download_url: 'https://github.com/Team-Beef-Studios/Lambda1VR/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/Team-Beef-Studios/Lambda1VR',
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
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/doom3quest.jpg',
    youtube_video_id: 'y2y9C0E2kPk',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Comfort Vignette'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Doom3Quest/',
    base_game_url: 'https://store.steampowered.com/app/9050/DOOM_3/',
    base_game_store: 'Steam',
    port_download_url: 'https://github.com/Team-Beef-Studios/Doom3Quest/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/Team-Beef-Studios/Doom3Quest',
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
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/citravr.jpg',
    youtube_video_id: 'vMBsdsAICSY',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/CitraVR/',
    base_game_url: null,
    base_game_store: 'Requires your own 3DS game',
    port_download_url: 'https://github.com/amwatson/CitraVR/releases',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/amwatson/CitraVR',
    latest_version: 'v0.6.0',
    last_github_update: '2026-08-17T06:44:44Z',
    featured: true,
    installation_guide: `### Prerequisites
* A legally dumped 3DS game. CitraVR lists .3ds, .cci, .cxi, .app, and .3dsx (and compressed .zcci/.zcxi/.z3dsx). .cia/.zcia are accepted by the loader and then installed.
* Meta Quest 3 or 3S recommended for optimal 60 FPS performance at 3x native resolution.

### Step-by-Step Installation
1. Download the latest APK release from the official CitraVR GitHub repository.
2. Install the APK via SideQuest or \`adb install CitraVR.apk\`.
3. Create the folder \`/sdcard/CitraVR/roms/\` on your headset and transfer your game ROMs. The backup wiki’s example folder \`/sdcard/3DS Games\` is also detected.
4. Launch CitraVR under Unknown Sources and select that ROMs directory.`,
    troubleshooting_notes: 'On Quest 3 and 3S, increase internal resolution scale to 3x in graphics settings for crisp stereoscopic 3D clarity.'
  },
  {
    id: '5',
    slug: 'questzdoom',
    title: 'QuestZDoom',
    developer: 'Team Beef & BaggyG',
    developer_url: 'https://www.questzdoom.com/',
    short_description: 'GZDoom source port engine for Meta Quest. Experience Doom 1, Doom 2, Brutal Doom, Heretic, and thousands of community mods in full 6DoF VR.',
    category: 'engine_recreation',
    status: 'released',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/questzdoom.jpg',
    youtube_video_id: 'OoNCvmUxUFE',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Teleport'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/QuestZDoom/',
    base_game_url: 'https://store.steampowered.com/app/2280/Ultimate_Doom/',
    base_game_store: 'Steam',
    port_download_url: 'https://github.com/Team-Beef-Studios/QuestZDoom/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/Team-Beef-Studios/QuestZDoom',
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
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/jkxr.jpg',
    youtube_video_id: 'ToM-wz3v-NU',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/JKXR/',
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
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/quake2quest.jpg',
    youtube_video_id: 'qByCUtT6WG0',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Quake2Quest/',
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
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/preyvr.jpg',
    youtube_video_id: 'e8KZmDCdPb4',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/preyvr/',
    base_game_url: 'https://en.wikipedia.org/wiki/Prey_(2006_video_game)',
    base_game_store: 'Requires your own original Prey (2006) copy',
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
    category: 'engine_recreation',
    status: 'released',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/beefraiderxr.jpg',
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
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/quakequest.jpg',
    youtube_video_id: 'A42X55BKF6Q',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Teleport', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/QuakeQuest/',
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
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/razexr.jpg',
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
    category: 'wrapper',
    status: 'released',
    install_workflow: 'direct',
    cover_image_url: '/covers/questcraft.jpg',
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
    category: 'engine_recreation',
    status: 'released',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/csvr.jpg',
    youtube_video_id: '5ivdcCWly54',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/xash/',
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
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/hexen2vr.jpg',
    youtube_video_id: 'wKyfjeuv46o',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Hexen2VR/',
    base_game_url: 'https://store.steampowered.com/app/9060/HeXen_II/',
    base_game_store: 'Steam',
    port_download_url: 'https://sidequestvr.com/app/54816/hexen-ii-vr',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/sezero/uhexen2',
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
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/ppsspp-vr.jpg',
    youtube_video_id: 'y3dgEeDW5Xw',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/PSP/',
    base_game_url: null,
    base_game_store: 'Requires your own PSP game',
    port_download_url: 'https://sidequestvr.com/app/12379/ppsspp-vr',
    port_download_source: 'SideQuest',
    github_url: 'https://github.com/hrydgard/ppsspp',
    latest_version: 'v1.20.4',
    last_github_update: '2026-05-16T12:35:08Z',
    featured: true,
    installation_guide: `### Installation
1. Install PPSSPP VR APK via SideQuest.
2. Transfer dumped PSP games (\`.iso\`, \`.cso\`, \`.pbp\`, or \`.chd\`) to \`/sdcard/PSP/GAME/\` on your Quest.
3. Launch PPSSPP VR, configure your virtual screen scale, and play using Quest Touch controllers or Bluetooth gamepad.`,
    troubleshooting_notes: 'Toggle stereoscopic 3D rendering in graphics options for enhanced depth in 3D titles like Ridge Racer, Wipeout, and Monster Hunter.'
  },
  {
    id: '16',
    slug: 'winlatorxr',
    title: 'WinlatorXR',
    developer: 'WinlatorXR team',
    developer_url: 'https://github.com/WinlatorXR/WinlatorXR',
    short_description: 'OpenXR compatibility layer running Windows x86 PC applications and games natively on Meta Quest using Wine and Box86/Box64 translation.',
    category: 'wrapper',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/winlatorxr.jpg',
    youtube_video_id: 'neSyrMRFs9c',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: null,
    base_game_store: 'Requires your own Windows games',
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
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'smart_converter',
    cover_image_url: '/covers/time-crisis-vr.jpg',
    youtube_video_id: 'PGUc8b3VIu0',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Physical Ducking', 'Cover System'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/TimeCrisisVR/',
    base_game_url: 'https://en.wikipedia.org/wiki/Time_Crisis',
    base_game_store: 'Requires your own original copy',
    port_download_url: 'https://github.com/DR-89/time-crisis-vr/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/DR-89/time-crisis-vr',
    latest_version: 'v0.8.4',
    last_github_update: '2026-10-07T16:17:58Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 3 or Quest 3S with Developer Mode enabled.
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation
1. Download the latest Quest APK (\`TimeCrisisVR-*-quest.apk\`) from the official [GitHub Releases](https://github.com/DR-89/time-crisis-vr/releases/latest).
2. Connect your Quest 3 via USB and install via SideQuest or terminal:
   \`adb install -r TimeCrisisVR-*-quest.apk\`
3. Launch the game from **Unknown Sources → Time Crisis VR (Experimental)**. The complete APK extracts bundled game files automatically.
4. On the arcade boot screen, press **A (Right Controller)** to insert credits, then press **Right Trigger** to start the mission!

### Controls & Cover System
* **Right Controller / Trigger**: Aim and shoot tracked 3D pistol
* **A (Right)**: Insert arcade credits
* **B (Right)**: Toggle silent laser pointer
* **Left Trigger / Physical Ducking**: Hold left trigger to leave cover and shoot; release to duck/reload. Alternatively, enable **Physical Ducking** in the menu (press Left Menu button) and press **X** while upright to calibrate height!`,
    troubleshooting_notes: 'Target framerate is 120 Hz. Use the latest Quest APK from Releases. That build boots directly into immersive VR mode without flat-screen regressions.'
  },
  {
    id: '18',
    slug: 'primedgun',
    title: 'PrimedGun (Metroid Prime VR)',
    developer: 'Nobbie248',
    developer_url: 'https://github.com/Nobbie248',
    short_description: 'Standalone 6DoF VR source injection of Nintendo GameCube classic Metroid Prime running natively on Meta Quest with 1:1 tracked Arm Cannon, immersive helmet visors, and Vulkan multiview.',
    category: 'emulator',
    status: 'released',
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/primedgun.jpg',
    youtube_video_id: 'd_xUXZURdzM',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/PrimedGun/',
    base_game_url: 'https://en.wikipedia.org/wiki/Metroid_Prime',
    base_game_store: 'Requires your own original GameCube copy',
    port_download_url: 'https://github.com/Nobbie248/PrimedGun/releases/download/v1.1.7/primedgun-quest-release.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/Nobbie248/PrimedGun',
    latest_version: 'v1.1.7',
    last_github_update: '2026-10-02T14:25:35Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, 3, 3S, or Pro with Developer Mode enabled.
* Original **Metroid Prime (NTSC-U Revision 0 / v1.0)** GameCube disc backup. PrimedGun’s file list accepts \`.iso\` (including \`.nkit.iso\`), \`.gcm\`, \`.ciso\`, \`.gcz\`, \`.rvz\`, \`.wia\`, \`.wbfs\`, \`.tgc\`, and \`.nfs\`.
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation
1. Download the Quest APK (\`primedgun-quest-release.apk\`) from the Quest release [v1.1.7](https://github.com/Nobbie248/PrimedGun/releases/tag/v1.1.7). The newer Windows tag is not a Quest APK.
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
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/astroquest.jpg',
    youtube_video_id: '1FXer9AHf68',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Seated', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.astrobotquest.vrhost/files/',
    base_game_url: 'https://store.playstation.com/en-gb/product/EP9000-CUSA12392_00-PLATFORMERVR00EU/',
    base_game_store: 'PlayStation Store',
    port_download_url: 'https://github.com/bigmak94/AstroQuest/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/bigmak94/AstroQuest',
    latest_version: 'v0.20',
    last_github_update: '2026-10-06T18:45:57Z',
    featured: true,
    installation_guide: `### Prerequisites
* **Meta Quest 3 or Quest 3S** (Quest 2 is not supported due to high CPU/GPU requirements of PS4 emulation).
* **PS5 DualSense Controller** (paired via Bluetooth with the headset; Quest hand tracking tracks the physical controller in 3D space!).
* Clean dumped copy of **ASTRO BOT Rescue Mission** (European PS4 release \`CUSA12392\`, version 1.00) dumped from your own console as an unpacked folder or \`.pkg\`.
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation
1. Download the latest standalone Quest APK (\`AstroQuest-*-Quest3.apk\`) from [GitHub Releases](https://github.com/bigmak94/AstroQuest/releases/latest).
2. Install the APK to your Quest 3 via SideQuest or command line:
   \`adb install -r AstroQuest-*-Quest3.apk\`
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
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/sourcevr.jpg',
    youtube_video_id: 'QzgDw8xEpeM',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/SourceVRPort/',
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
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/simpsonshitrun.jpg',
    youtube_video_id: 'UQJZKjkRzyI',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'VR Steering Wheel', 'Roomscale', 'Seated Mode'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/SimpsonsHitRun/',
    base_game_url: 'https://en.wikipedia.org/wiki/The_Simpsons:_Hit_%26_Run',
    base_game_store: 'Requires your own original PC copy',
    port_download_url: 'https://github.com/kote2345/The-Simpsons-Hit-and-Run-VR/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/kote2345/The-Simpsons-Hit-and-Run-VR',
    latest_version: '1.2',
    last_github_update: '2026-08-27T20:58:20Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Original PC game files for **The Simpsons: Hit & Run** (2003 original unmodded PC release).
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Get the latest \`SimpsonsHitRun_*.apk\` from [GitHub Releases](https://github.com/kote2345/The-Simpsons-Hit-and-Run-VR/releases/latest).
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   \`\`\`bash
   adb install -r SimpsonsHitRun_*.apk
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
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/halocequest.jpg',
    youtube_video_id: 'mFSmPcHQpLM',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale', 'Two-Handed Grip', 'Full-Body IK'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Documents/HaloCE/',
    base_game_url: 'https://en.wikipedia.org/wiki/Halo:_Combat_Evolved',
    base_game_store: 'Requires your own original Xbox copy',
    port_download_url: 'https://github.com/moistman42069/HaloCE-Quest-VR/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/moistman42069/HaloCE-Quest-VR',
    latest_version: 'v1.0.16',
    last_github_update: '2026-10-08T02:13:04Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Original legally obtained **Halo: Combat Evolved** Xbox ISO/XISO (allow ~1.8 GB for extracted maps, cache, and sound files).
* SideQuest or Android ADB (\`platform-tools\`).

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download the latest \`HaloCE-Quest-*.apk\` (package \`com.halo.decomp.vr\`) from [GitHub Releases](https://github.com/moistman42069/HaloCE-Quest-VR/releases/latest). Use the **Quest** APK, not the Android/flat build.
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   \`\`\`bash
   adb install -r HaloCE-Quest-*.apk
   \`\`\`
3. **Import Game Files:**
   * Transfer your Halo CE Xbox ISO/XISO file to your Quest storage (e.g., inside \`Download/\`).
   * Launch **Halo CE VR** from **App Library → Unknown Sources**.
   * Use the built-in file picker/launcher to select your ISO file. The game extracts maps into its app storage. The Quest build also plays \`/sdcard/Documents/HaloCE\` when \`maps/ui.map\` and \`maps/bloodgulch.map\` are already there. You can push that maps folder with:
   \`\`\`bash
   adb push /path/to/maps/. /sdcard/Documents/HaloCE/maps/
   \`\`\`
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
    troubleshooting_notes: 'Use an original Xbox ISO or XISO image for data extraction. If NPC or model presentation desyncs during co-op, ensure both players are on the exact same build. Recenter standing height anytime by clicking both thumbsticks.'
  },
  {
    id: '23',
    slug: 'galaxyquest',
    title: 'GalaxyQuest (Super Mario Galaxy VR)',
    developer: 'bigmak94',
    developer_url: 'https://github.com/bigmak94',
    short_description: 'Native standalone VR port of Super Mario Galaxy for Meta Quest 2 and 3, built on the Petari decompilation. Play in full 3D diorama mode with motion-tracked Star Bit laser aiming or on a giant 120Hz stereoscopic screen.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'smart_converter',
    cover_image_url: '/covers/galaxyquest.jpg',
    youtube_video_id: 'UnYhCfbw_bc',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['3D Diorama Mode', 'Giant Virtual Screen (120Hz)', 'Star Bit Laser Pointer', 'Snap Turn', 'Tilt & Motion Controls'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/GalaxyQuest/',
    base_game_url: 'https://en.wikipedia.org/wiki/Super_Mario_Galaxy',
    base_game_store: 'Requires your own original Wii copy',
    port_download_url: 'https://github.com/bigmak94/GalaxyQuest/releases/latest/download/GalaxyQuest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/bigmak94/GalaxyQuest',
    latest_version: 'v0.1.8',
    last_github_update: '2026-10-03T20:28:59Z',
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
    category: 'wrapper',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/qualyx.jpg',
    youtube_video_id: 'JHW-FMm_c7c',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Continuous Turn', 'Snap Turn', 'Teleport', 'Roomscale', 'Positional Time Warp (72Hz)'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Qualyx/',
    base_game_url: 'https://store.steampowered.com/app/546560/HalfLife_Alyx/',
    base_game_store: 'Steam',
    port_download_url: 'https://github.com/tinsarfal/Qualyx/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/tinsarfal/Qualyx',
    latest_version: '1.0.84',
    last_github_update: '2026-10-04T05:13:33Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Original **Half-Life: Alyx** on Steam.
* SideQuest or Android ADB (\`platform-tools\`).
* Recommended: Turn ON **Quest Settings → Experimental → Positional time warp** before playing.

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download the latest \`Qualyx-*.apk\` from [GitHub Releases](https://github.com/tinsarfal/Qualyx/releases/latest).
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   \`\`\`bash
   adb install -r Qualyx-*.apk
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
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'smart_converter',
    cover_image_url: '/covers/goldeneye-vr.jpg',
    youtube_video_id: 'Nmlq5QxnVuM',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale', 'Two-Handed Grip', 'Motion Melee', 'Virtual Screen Mode'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.gevr.port/files/data/',
    base_game_url: 'https://en.wikipedia.org/wiki/GoldenEye_007_(1997_video_game)',
    base_game_store: 'Requires your own original N64 copy',
    port_download_url: 'https://github.com/MrSco/goldeneye-vr/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/MrSco/goldeneye-vr',
    latest_version: 'v0.4.13',
    last_github_update: '2026-10-08T11:36:09Z',
    featured: true,
    installation_guide: `### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Legally owned original **GoldenEye 007 (USA / NTSC-U)** N64 cartridge ROM (\`.z64\`, \`.v64\`, or \`.n64\`, ~12 MB).
* SideQuest or Android ADB (\`platform-tools\`).
* USB-C cable.

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download the latest \`GoldenEye-VR-*.apk\` from [GitHub Releases](https://github.com/MrSco/goldeneye-vr/releases/latest) or [goldeneyevr.com](https://goldeneyevr.com).
2. **Install the APK:**
   Sideload the APK onto your headset using SideQuest or ADB:
   \`\`\`bash
   adb install -r GoldenEye-VR-*.apk
   \`\`\`
3. **Copy your USA ROM to your Headset:**
   Copy your USA ROM into the Quest **Download** folder, open the app, and press **Choose ROM file...**. The launcher copies it to \`/sdcard/Android/data/com.gevr.port/files/data/ge.z64\`. After the app has been opened once you can also push it directly:
   \`\`\`bash
   adb push "GoldenEye 007 (USA).z64" /sdcard/Android/data/com.gevr.port/files/data/ge.z64
   \`\`\`
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
    troubleshooting_notes: 'Only the USA (NTSC-U) ROM is supported. Updating APKs with SideQuest retains your ROM and save data. If distant scenery pops on older builds, install the latest Quest APK from Releases.'
  },
  {
    id: '26',
    slug: 'questcarnage',
    title: 'QuestCarNage (Carmageddon VR)',
    developer: 'maranone',
    developer_url: 'https://github.com/maranone',
    short_description: 'Native standalone OpenXR VR port of the vehicular combat classic Carmageddon for Meta Quest headsets, based on the Dethrace engine reimplementation with 120Hz support.',
    category: 'engine_recreation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/questcarnage.jpg',
    youtube_video_id: 'wdP-DzNOv5U',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Cockpit VR', 'Stereo 6DoF', 'Snap Turn', 'VR Shell Menus', '120Hz Refresh Rate'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.github.maranone.questcarnage/files/',
    base_game_url: 'https://store.steampowered.com/app/282010/Carmageddon_Max_Pack/',
    base_game_store: 'Steam / GOG',
    port_download_url: 'https://github.com/maranone/carnage/releases/download/b003/QuestCarnage-Meta-Quest-release.apk',
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
   Download \`QuestCarnage-Meta-Quest-release.apk\` from the Quest release [b003](https://github.com/maranone/carnage/releases/tag/b003). Later tags can be PC-only.
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
    category: 'decompilation',
    status: 'in_development',
    install_workflow: 'obb_extractor',
    cover_image_url: '/covers/gtasa_vr.jpg',
    youtube_video_id: '9NAW-5CKdFc',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn', 'Vehicles'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.rockstargames.gtasa/files/',
    base_game_url: 'https://play.google.com/store/apps/details?id=com.rockstargames.gtasa',
    base_game_store: 'Google Play Store',
    port_download_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest',
    port_download_source: 'GitHub Build Script',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest',
    latest_version: '0.3.1 alpha',
    last_github_update: '2026-09-29T20:40:57Z',
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
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'obb_extractor',
    cover_image_url: '/covers/vicecity_vr.jpg',
    youtube_video_id: 'My0gwnPvWU8',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale', 'Steering Wheel Driving', 'Two-Handed Aiming'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.revc.miamivr/files/',
    base_game_url: 'https://store.steampowered.com/app/12110/Grand_Theft_Auto_Vice_City/',
    base_game_store: 'Steam / PC CD / Rockstar',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/vice-city-vr-quest',
    latest_version: 'v0.5.6',
    last_github_update: '2026-09-09T13:52:16Z',
    port_download_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/vice-city-vr-quest',
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
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/gran_turismo_2_vr.jpg',
    youtube_video_id: 'V6TifTwtsqg',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Cockpit VR', 'Virtual Wheel', 'Motion Steering', 'Stick Driving', 'Theatre Menus'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/io.github.gt2pc.quest/files/',
    base_game_url: 'https://www.mobygames.com/game/1597/gran-turismo-2/',
    base_game_store: 'Requires your own original PS1 copy',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gt-2-pc',
    latest_version: 'v0.8.1',
    last_github_update: '2026-09-30T11:19:02Z',
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
  },
  {
    id: '30',
    slug: 'gothic2-vr',
    title: 'Gothic II VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gothic2-vr',
    short_description: 'Experience the classic Gothic II: Night of the Raven in standalone 6DoF VR on Meta Quest. Features physical melee weapon combat, motion-tracked archery, virtual holsters, and physical swimming.',
    category: 'engine_recreation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/gothic2_vr.jpg',
    youtube_video_id: null,
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Smooth Locomotion', 'Physical Melee', 'Physical Archery', 'Physical Swimming'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Gothic2VR/',
    base_game_url: 'https://store.steampowered.com/app/39510/Gothic_II_Gold_Edition/',
    base_game_store: 'Steam / GOG (Night of the Raven)',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gothic2-vr',
    latest_version: 'v0.2.0',
    last_github_update: '2026-09-23T19:43:19Z',
    port_download_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/gothic2-vr/releases/download/v0.2.0/Gothic-II-VR-0.2.0-PCVR-and-Quest.zip',
    port_download_source: 'GitHub Releases (Quest APK inside)',
    featured: true,
    installation_guide: `### Overview
**Gothic II VR** is an OpenXR standalone VR port of *Gothic II: Night of the Raven* for Meta Quest 3, built on top of the open-source **OpenGothic** engine.

> [!NOTE]
> The release ZIP already contains the pre-compiled signed Quest APK inside the \`Quest/\` folder. You only need your legally owned installation files of *Gothic II: Gold Edition / Night of the Raven* (Steam or GOG).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally owned PC install of **Gothic II: Night of the Raven** (Steam or GOG).
3. PC with USB data cable (Windows 10/11 x64).

---

### Step-by-Step Installation Guide

1. **Download the Release:**
   Download [Gothic-II-VR-0.2.0-PCVR-and-Quest.zip](https://github.com/dubrovskiy-yevhen-stakelogic/gothic2-vr/releases/latest) from GitHub Releases.
2. **Extract the ZIP:**
   Extract the entire ZIP archive to a folder on your PC (e.g., \`C:\\Games\\Gothic2VR\`).
3. **Open the Quest Folder:**
   Navigate into the extracted \`Quest/\` folder.
4. **Connect Your Headset:**
   Plug your Quest 3 into your PC via USB-C and accept the **"Allow USB Debugging"** prompt inside the headset.
5. **Run the Installer:**
   Double-click \`INSTALL.bat\`. When prompted, enter the path to your purchased Gothic 2 game directory (the folder containing \`Data\`, \`_work\`, and \`System\`).
6. **Automatic Packaging & Install:**
   The script packages your local game files, installs the signed Quest APK, and copies the data directly onto your headset.
7. **In-Headset Import:**
   Put on your headset, approve storage permissions when prompted, select the imported data archive, and launch **Gothic II VR** from **Unknown Sources**!

---

### VR Combat & Controls
* **Physical Melee:** Swing swords, punch, block, and parry in 6DoF roomscale. Two-handed weapons require both hands to deal damage!
* **Physical Archery:** Aim your bow with one hand, grip and draw the string back with your other hand to charge shot power, and release.
* **Physical Holsters:** Grab weapons and equipment directly from your virtual body holsters.
* **Physical Swimming:** Dive and tread water by making swimming strokes with your hands.
* **Menus:** Press **Both Grips + Y** to toggle the game menu, or **L3 + R3** (stick clicks) for VR settings.`,
    troubleshooting_notes: 'Alpha 0.2.0 release. If the headset is not detected, ensure Developer Mode and USB debugging are authorized. Ensure clean game data from Gothic II Gold (Windows DLL mods are unsupported). Keep multiple save slots.'
  },
  {
    id: '31',
    slug: 'harry-potter-vr',
    title: 'Harry Potter and the Sorcerer\'s Stone VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/harry-potter-vr',
    short_description: 'Experience the classic 2001 Harry Potter in standalone 6DoF VR on Meta Quest. Features motion-tracked wand spellcasting, offline voice recognition, broomstick flying, and Hogwarts exploration.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/harry_potter_vr.jpg',
    youtube_video_id: 'sJILoIKG9Mo',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Smooth Locomotion', 'Wand Motion Gestures', 'Voice Spell Casting', 'Broomstick Flight'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/HarryPotterVR/',
    base_game_url: 'https://www.mobygames.com/game/5501/harry-potter-and-the-sorcerers-stone/',
    base_game_store: 'Requires your own original PC copy',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/harry-potter-vr',
    latest_version: 'v0.1.4.1',
    last_github_update: '2026-09-23T22:21:18Z',
    port_download_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/harry-potter-vr/releases/download/v0.1.4.1/HPVR-Quest-0.1.4.1.zip',
    port_download_source: 'GitHub Releases (HPVR-Quest ZIP)',
    featured: true,
    installation_guide: `### Overview
**Harry Potter VR** is an unofficial standalone 6DoF Virtual Reality port of the legendary 2001 PC game *Harry Potter and the Sorcerer's Stone* (Philosopher's Stone), optimized for Meta Quest 3.

> [!NOTE]
> The release archive includes the automated installer and VR runtime. You need your legally owned US PC installation of the original 2001 game.

---

### Prerequisites
1. **Meta Quest Headset** (Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally owned PC install of **Harry Potter and the Sorcerer's Stone** (2001 PC CD-ROM).
3. PC connected via USB-C cable (Windows 10/11).

---

### Step-by-Step Installation Guide

1. **Download the Release Archive:**
   Download \`HPVR-Quest-0.1.4.1.zip\` from [GitHub Releases](https://github.com/dubrovskiy-yevhen-stakelogic/harry-potter-vr/releases/latest).
2. **Extract the ZIP:**
   Extract the entire ZIP archive to a folder on your Windows PC.
3. **Connect Your Quest:**
   Plug your headset into your PC with a USB-C data cable and accept the **"Allow USB Debugging"** prompt inside the headset.
4. **Run the Installer:**
   Double-click \`INSTALL.bat\`. When prompted, select your original PC Harry Potter game folder.
5. **Automatic Preparation & Sideload:**
   The installer prepares the audio and maps, sideloads the APK, and copies the necessary game assets to your headset.
6. **Launch in VR:**
   Put on your headset, open **App Library → Unknown Sources**, and launch **Harry Potter VR**!

---

### VR Spellcasting & Controls
* **Wand Motion Gestures:** Trace spell shapes in the air with your wand hand using CLASSIC, VISIBLE GESTURE, or GESTURE casting modes.
* **Offline Voice Recognition:** Aim at a compatible target and pronounce *Flipendo*, *Alohomora*, or *Wingardium Leviosa* while holding the trigger to cast verbally!
* **Broomstick Flight:** Fly and steer through the Hogwarts grounds and Quidditch broomstick training courses in full 6DoF roomscale.
* **VR Menu & Calibration:** Press **L3 + R3** (both thumbstick clicks) anytime to open the VR graphics and calibration settings.`,
    troubleshooting_notes: 'Alpha 0.1.4.1 hotfix release. Requires original US PC release assets. Voice recognition works offline but may vary with pronunciation. If headset is not detected, ensure Developer Mode and USB debugging are authorized.'
  },
  {
    id: '32',
    slug: 'road-rash-jailbreak-vr',
    title: 'Road Rash: Jailbreak VR',
    developer: 'dubrovskiy-yevhen-stakelogic',
    developer_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/road-rash-jailbreak',
    short_description: 'Native C++ standalone VR port of Road Rash: Jailbreak (PS1) for Meta Quest. Experience high-speed motorcycle vehicular combat, clubs, chains, police chases, and full stereoscopic 6DoF VR.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/road_rash_jailbreak_vr.jpg',
    youtube_video_id: 'f01aGgd6Uzs',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Cockpit VR', 'Motorcycle Riding', 'Physical Melee Combat', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/RoadRashVR/',
    base_game_url: 'https://www.mobygames.com/game/3773/road-rash-jailbreak/',
    base_game_store: 'Requires your own original PS1 copy (SLUS-01053)',
    github_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/road-rash-jailbreak',
    latest_version: 'v0.1.0',
    last_github_update: '2026-10-02T20:49:06Z',
    port_download_url: 'https://github.com/dubrovskiy-yevhen-stakelogic/road-rash-jailbreak/releases/download/v0.1.0/RoadRashJailbreak-0.1.0.zip',
    port_download_source: 'GitHub Releases (RoadRashJailbreak ZIP)',
    featured: true,
    installation_guide: `### Overview
**Road Rash: Jailbreak VR** is a native C++ standalone OpenXR port of the classic PlayStation game *Road Rash: Jailbreak* (2000), running directly on Meta Quest 3 without needing a PC during gameplay.

> [!NOTE]
> The release ZIP already contains the pre-compiled signed Quest APK. You only need your legally dumped PS1 disc image (\`BIN\` / \`CUE\` from SLUS-01053).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally dumped PS1 disc image of **Road Rash: Jailbreak** (USA \`SLUS_01053\` in MODE2/2352 \`BIN\`/\`CUE\` format).
3. PC connected via USB-C cable (Windows 10/11).

---

### Step-by-Step Installation Guide

1. **Download the Release Archive:**
   Download \`RoadRashJailbreak-0.1.0.zip\` from [GitHub Releases](https://github.com/dubrovskiy-yevhen-stakelogic/road-rash-jailbreak/releases/latest).
2. **Extract the ZIP:**
   Extract the archive to a folder on your Windows PC.
3. **Connect Your Quest:**
   Plug your Quest into your PC with a USB-C data cable and accept the **"Allow USB Debugging"** prompt inside the headset.
4. **Run the Installer:**
   Double-click \`INSTALL.bat\`. When prompted, select your Road Rash: Jailbreak \`BIN\` or \`CUE\` disc image.
5. **Automatic Preparation & Install:**
   The script verifies the disc hash, prepares the tracks, installs the Quest APK, and copies the disc assets to your headset.
6. **Launch in VR:**
   Put on your headset, open **App Library → Unknown Sources**, and launch **Road Rash VR**!

---

### VR Features & Vehicular Combat
* **Full Stereoscopic 6DoF:** Experience high-speed illegal motorcycle races with depth perception and cockpit view.
* **Brutal Combat:** Trade blows with rival bikers, swing clubs, use cattle prods, and evade squad cars.
* **Physics & Audio:** Original fixed-step bike physics reimplemented with native 3D spatialized audio.`,
    troubleshooting_notes: 'Requires North American PS1 disc SLUS-01053 in BIN/CUE format (2048-byte ISOs lack necessary CD-DA audio sectors). If headset is not detected, ensure Developer Mode and USB debugging are authorized.'
  },
  {
    id: '33',
    slug: 'perfect-dark-vr',
    title: 'Perfect Dark VR',
    developer: 'Alex-LeTux',
    developer_url: 'https://github.com/Alex-LeTux',
    short_description: 'Standalone 6DoF VR source port of Rare\'s legendary Nintendo 64 shooter Perfect Dark for Meta Quest. Features full motion controller aiming, dual wielding, roomscale tracking, and support for community HD texture packs.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'smart_converter',
    cover_image_url: '/covers/perfect_dark_vr.jpg',
    youtube_video_id: 'AbqMNh09U04',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn', '6DoF Weapon Aiming', 'Dual Wielding'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.perfectdark.port/files/data/',
    base_game_url: 'https://en.wikipedia.org/wiki/Perfect_Dark',
    base_game_store: 'Requires your own original N64 copy',
    port_download_url: 'https://github.com/Alex-LeTux/perfect_dark_VR/releases/latest',
    port_download_source: 'GitHub Releases (APK)',
    github_url: 'https://github.com/Alex-LeTux/perfect_dark_VR',
    latest_version: 'v2.0',
    last_github_update: '2026-10-07T19:21:20Z',
    featured: true,
    installation_guide: `### Overview
**Perfect Dark VR** is a native standalone 6DoF VR source port of Rare's classic Nintendo 64 first-person shooter *Perfect Dark* (2000), running directly on Meta Quest headsets with full motion controller tracking, immersive weapon handling, and dual wielding.

> [!NOTE]
> You must provide your own legally obtained **Perfect Dark (NTSC Final)** Nintendo 64 ROM (\`.z64\` format). Only the NTSC version is compatible with this VR port.

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally dumped **Perfect Dark (USA/NTSC Final) ROM** file (\`.z64\`).
3. SideQuest or ADB installed on your computer or phone.

---

### Step-by-Step Installation Guide

#### 1. Sideload the Standalone APK
- Download the latest NTSC standalone APK, **\`Perfect_Dark_VR_Standalone-NTSC_*.apk\`**, from [GitHub Releases](https://github.com/Alex-LeTux/perfect_dark_VR/releases/latest). Do not install the JPN or PAL builds.
- Sideload the APK onto your Meta Quest using **SideQuest** or run:
  \`\`\`bash
  adb install -r Perfect_Dark_VR_Standalone-NTSC_*.apk
  \`\`\`

#### 2. Copy the ROM to Your Headset
- Copy your Perfect Dark NTSC ROM to your Quest headset's **\`Download\`** folder (via USB-C file transfer, SideQuest file manager, or Quest browser):
  \`\`\`bash
  adb push pd.ntsc-final.z64 /sdcard/Download/
  \`\`\`

#### 3. Select ROM in VR
- Put on your Quest headset and go to **App Library → Unknown Sources**.
- Launch **Perfect Dark VR**.
- On the startup screen, press **"Select ROM"** and pick your NTSC ROM from your **Download** folder using the system file picker. The launcher copies it to \`/sdcard/Android/data/com.perfectdark.port/files/data/pd.ntsc-final.z64\`. That exact filename is what the game reads.

---

### Community HD Texture Packs
This VR port includes full support for the **Community Texture Packs** maintained by Parabolee and Retro Foundry. To install HD textures:
- Download the texture pack from [Perfect-Dark-Plus-HD-Textures](https://github.com/retro-foundry/Perfect-Dark-Plus-HD-Textures).
- Follow instructions to place the textures folder inside the game data directory on your headset.

---

### VR Controls & Features
* **6DoF Aiming & Dual Wielding:** Aim independently with each Touch controller, including dual CMP-150s, Falcon 2s, or Magnums.
* **Full Locomotion & Turning:** Smooth thumbstick locomotion with customizable snap or smooth turning.
* **Roomscale Tracking:** Duck behind cover and physically lean around corners in Carrington Institute and combat missions.`,
    troubleshooting_notes: 'Requires North American / NTSC Final ROM (PAL and Japanese ROMs are not supported). Install the NTSC standalone APK, not the JPN or PAL build. If you experience an infinite reload loop on older versions, install the latest release.'
  },
  {
    id: '34',
    slug: 'avp-vr',
    title: 'Aliens Versus Predator VR',
    developer: 'Bassquake',
    developer_url: 'https://github.com/Bassquake',
    short_description: 'Standalone 6DoF OpenXR VR port of the classic Aliens Versus Predator (1999) for Meta Quest. Experience intense survival horror across Marine, Alien, and Predator campaigns with motion controller aiming and wall-climbing.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/avp_vr.jpg',
    youtube_video_id: 'IxnrIYhSEMs',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['6DoF Motion Tracking', 'Smooth Locomotion', 'Snap / Smooth Turn', 'Independent Hand Aiming', 'Alien Wall-Climbing'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/AvPVR/',
    base_game_url: 'https://store.steampowered.com/app/3730/Aliens_versus_Predator_Classic_2000/',
    base_game_store: 'Steam (AvP Classic 2000) / GOG / PC CD-ROM',
    port_download_url: 'https://github.com/Bassquake/Aliens-Versus-Predator-VR/releases/latest',
    port_download_source: 'GitHub Releases (APK)',
    github_url: 'https://github.com/Bassquake/Aliens-Versus-Predator-VR',
    latest_version: '1.1',
    last_github_update: '2026-10-07T17:10:06Z',
    featured: true,
    installation_guide: `### Overview
**Aliens Versus Predator VR (AvP VR)** is a native standalone 6DoF OpenXR port of Rebellion's classic sci-fi survival horror FPS *Aliens Versus Predator* (1999), running directly on Meta Quest headsets. Play three distinct campaigns with full VR immersion: Colonial Marine, Xenomorph Alien, and Predator.

> [!NOTE]
> You need the original PC game asset files from **Aliens versus Predator Classic 2000** (available on [Steam](https://store.steampowered.com/app/3730/Aliens_versus_Predator_Classic_2000/) or GOG) or original PC CD-ROM.

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally purchased copy of **Aliens versus Predator Classic 2000** (Steam / GOG).
3. **SideQuest** or ADB installed on your computer.

---

### Step-by-Step Installation Guide

#### 1. Sideload the VR APK
- Download the latest Quest APK, **\`avpvr-*-quest-*.apk\`**, from [GitHub Releases](https://github.com/Bassquake/Aliens-Versus-Predator-VR/releases/latest).
- Install the APK on your headset using **SideQuest** (or via ADB: \`adb install -r avpvr-*-quest-*.apk\`).

#### 2. First Launch (Initialize Folders)
- Put on your headset and launch **Aliens Versus Predator: VR** from **App Library → Unknown Sources**.
- The app will close/crash immediately — **this is normal**, as it creates the necessary folder structure and permissions.

#### 3. Copy Game Assets
- Connect your Quest to your PC and open SideQuest (or Windows File Explorer / Android File Transfer).
- In SideQuest, go to **Manage files on the headset** (folder icon).
- Navigate to:
  \`\`\`
  Android/data/com.bassquake.quest.avpvr/files/
  \`\`\`
- Copy all files and folders from your PC game installation directory into this \`files/\` folder (including \`fastfile\`, \`language\`, etc.).

#### 4. Optional: Original CD Soundtrack (Atmosphere)
- Inside \`Android/data/com.bassquake.quest.avpvr/files/\`, create a new folder named **\`cd_tracks\`**.
- Download the soundtrack OGG files from [ModDB](https://www.moddb.com/games/aliens-vs-predator/addons/fixed-avp-classic-soundtrack) and name them \`track01.ogg\`, \`track02.ogg\`, etc.
- Copy the audio files into the \`cd_tracks\` folder.

#### 5. Launch and Play!
- Put on your Quest, go to **Unknown Sources**, and launch **Aliens Versus Predator: VR**!

---

### VR Controls & Species Features
* **Marine:** Tactical flashlight, shoulder lamp, motion tracker radar, smart gun auto-targeting, and hold **A** for manual reload.
* **Predator:** Wrist blades, shoulder plasmacaster with thermal lock, zoom vision (long-press **Y**), grappling hook (Left Trigger), and weapon disc throwing.
* **Alien:** Full 6DoF wall-climbing and ceiling crawling, biting, and tail-swipe attacks.
* **VR Performance Options:** Native 120Hz refresh rate mode, MSAA antialiasing, field-of-view comfort blinders, and adjustable world scale.`,
    troubleshooting_notes: 'Must launch the APK once before copying files so Android creates the app files folder. Ensure files are copied into Android/data/com.bassquake.quest.avpvr/files. If weapons have unexpected keybindings after updating, reset controls to default in-game.'
  },
  {
    id: '35',
    slug: 'questsam',
    title: 'Serious Sam Classic VR (QuestSam)',
    developer: 'maranone',
    developer_url: 'https://github.com/maranone',
    short_description: 'Standalone 6DoF VR source port of Serious Sam Classic: The First Encounter & The Second Encounter for Meta Quest. Features dual wielding, horde combat, roomscale tracking, and 1st/3rd-person diorama views.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/questsam.jpg',
    youtube_video_id: null,
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Dual Wielding', '6DoF Motion Tracking', 'Smooth Locomotion', 'Snap / Smooth Turn', 'Diorama / 3rd-Person Mode'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.github.maranone.questsam/files/',
    base_game_url: 'https://store.steampowered.com/app/41050/Serious_Sam_Classic_The_First_Encounter/',
    base_game_store: 'Steam / GOG (Serious Sam Classic: TFE / TSE)',
    port_download_url: 'https://github.com/maranone/QuestSam/releases/latest',
    port_download_source: 'GitHub Releases (APK)',
    github_url: 'https://github.com/maranone/QuestSam',
    latest_version: 'b004',
    last_github_update: '2026-09-20T16:39:29Z',
    featured: true,
    installation_guide: `### Overview
**QuestSam** is a free, open-source standalone 6DoF VR source port of Croteam's legendary arcade FPS classics: **Serious Sam Classic: The First Encounter (TFE)** and **Serious Sam Classic: The Second Encounter (TSE)**, running natively on Meta Quest without a PC.

> [!NOTE]
> You need the \`.gro\` game archive files from either or both original PC games (*Serious Sam Classic: The First Encounter* or *Serious Sam Classic: The Second Encounter* on Steam or GOG).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally owned copy of **Serious Sam Classic: The First Encounter** and/or **The Second Encounter** on Steam or GOG.
3. PC with USB-C cable or SideQuest / ADB installed.

---

### Step-by-Step Installation Guide

#### 1. Sideload the Standalone APK
- Download **\`questsam.apk\`** from [GitHub Releases](https://github.com/maranone/QuestSam/releases/latest).
- Install the APK using **SideQuest** or run:
  \`\`\`bash
  adb install -r questsam.apk
  \`\`\`

#### 2. First Launch (Folder Creation & Permissions)
- Put on your headset, open **App Library → Unknown Sources**, and launch **QuestSam**.
- Grant the **"All files access"** storage permission when prompted.
- The game will generate the \`/sdcard/questsam/\` directory on your headset's storage and close.

#### 3. Copy Game Files (\`.gro\`)
- Connect your Quest to your PC via USB-C (or use SideQuest's File Manager).
- Locate your PC game install folder (e.g. \`Steam/steamapps/common/Serious Sam Classic The First Encounter\`):
  - Copy all root \`.gro\` archive files (e.g. \`1_00.gro\`, \`1_00_music.gro\`, \`SE1_00.gro\`, etc.) into:
    \`\`\`text
    /sdcard/questsam/
    \`\`\`
  - *(Optional)* If copying via ADB script, you can use the bundled \`push_quest_data.bat\` (Windows) or \`push_quest_data.sh\` (Linux/Mac) to automatically transfer TFE & TSE data to \`/sdcard/Android/data/com.github.maranone.questsam/files\`.

#### 4. Launch and Slay Hordes in VR!
- Put on your Quest, go to **Unknown Sources**, and launch **QuestSam**.
- Choose your campaign (TFE or TSE) and enjoy full 6DoF dual-wielding chaos!

---

### VR Features & Controls
* **Dual Wielding:** Hold different weapons in each hand! Press each controller's grip to cycle weapons, and pull each controller's trigger independently to fire.
* **Camera Modes:** Play in traditional first-person VR or switch to third-person and roomscale 3D diorama modes.
* **Customizable HUD:** Adjust health/ammo HUD opacity, scale, and positioning in VR player settings.
* **Interact:** Click the Right Controller Thumbstick to use switches and open doors.`,
    troubleshooting_notes: 'Launch the APK once first to grant storage permissions and initialize /sdcard/questsam. Both TFE and TSE can be placed in the same folder or separate subfolders; QuestSam automatically links archives when SE1_00.gro is found.'
  },
  {
    id: '36',
    slug: 'iron-lung-vr',
    title: 'Iron Lung VR',
    developer: 'JackaPacka',
    developer_url: 'https://jackaapacka.itch.io',
    short_description: 'Standalone 6DoF VR recreation of David Szymanski\'s claustrophobic dread submarine horror Iron Lung for Meta Quest. Blindly navigate an alien blood ocean, coordinate points, and operate physical switches and cameras.',
    category: 'vr_injection',
    status: 'released',
    install_workflow: 'direct',
    cover_image_url: '/covers/iron_lung_vr.jpg',
    youtube_video_id: '9OsjifuYZVg',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Seated Submarine Cockpit', '6DoF Interactive Controls', 'Physical Switches & Levers', 'Still Camera Viewfinder'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (Self-Contained APK)',
    base_game_url: 'https://store.steampowered.com/app/1846170/Iron_Lung/',
    base_game_store: 'Steam (David Szymanski)',
    port_download_url: 'https://sidequestvr.com/app/10349/iron-lung-vr',
    port_download_source: 'SideQuest / Itch.io',
    github_url: 'https://jackaapacka.itch.io/iron-lung-vr',
    latest_version: 'v1.2.0',
    last_github_update: '2026-09-01T12:00:00Z',
    featured: true,
    installation_guide: `### Overview
**Iron Lung VR** is a faithful, ground-up standalone VR recreation of David Szymanski's claustrophobic dread horror submarine simulator *Iron Lung* (2022), created with permission by developer JackaPacka. 

Trapped inside a blind, creaking submarine nicknamed the "Iron Lung", you must navigate through an ocean of blood on a desolate alien moon, blindly plotting coordinates on a map and photographing anomaly locations through an exterior still camera.

> [!NOTE]
> Unlike source ports requiring game asset extraction, **Iron Lung VR** is distributed as a self-contained standalone Quest package with no file dumping required. Support the original developer by purchasing [Iron Lung on Steam](https://store.steampowered.com/app/1846170/Iron_Lung/).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro).
2. **SideQuest** (PC, Mac, Linux, or Mobile app) OR ADB installed.

---

### Step-by-Step Installation Guide

#### Option A: 1-Click Install via SideQuest (Recommended)
1. Open the **SideQuest** application or visit [SideQuest: Iron Lung VR](https://sidequestvr.com/app/10349/iron-lung-vr).
2. Connect your Meta Quest via USB-C cable or wireless ADB.
3. Click **"Sideload / Install to Headset"**.
4. Once completed, put on your headset and launch **Iron Lung VR** from **App Library → Unknown Sources**.

#### Option B: Manual Sideloading (Itch.io APK)
1. Download **\`1.2.0.apk\`** from [JackaPacka's Itch.io page](https://jackaapacka.itch.io/iron-lung-vr).
2. Sideload the APK onto your headset:
   \`\`\`bash
   adb install -r 1.2.0.apk
   \`\`\`
3. Put on your headset, go to **Unknown Sources**, and launch the game.

---

### Seated VR Tips & Troubleshooting
* **Seated Play:** The submarine is cramped and designed to be played seated. If your character height feels too tall, set your Guardian floor level at your waist or use the in-game height slider in the options menu.
* **Controls:** Physically reach out and flip navigation switches, toggle terminal buttons, crank emergency valves, and trigger the shutter camera.`,
    troubleshooting_notes: 'Created with permission from original author David Szymanski. Designed for seated roomscale or stationary guardian.'
  },
  {
    id: '37',
    slug: 'ut99-vr-quest',
    title: "Unreal Tournament '99 VR (UT99 Quest)",
    developer: 'GHWST',
    developer_url: 'https://x.com/GhwstVR',
    short_description: "Unreal Tournament 1999 running natively in 6DoF VR on Meta Quest. Features true stereo OpenXR rendering, motion controls, online multiplayer via OldUnreal 469, and full bot matches.",
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/ut99vr.png',
    youtube_video_id: 'DnLHVDp9o0Q',
    video_preview_url: null,
    video_preview_start: 228,
    video_preview_end: 260,
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/',
    base_game_url: 'https://en.wikipedia.org/wiki/Unreal_Tournament',
    base_game_store: 'Requires your own original PC copy',
    port_download_url: 'https://ut99vr.pages.dev/ut99quest.apk',
    port_download_source: 'Official Portal (ut99vr.pages.dev)',
    github_url: 'https://ut99vr.pages.dev',
    latest_version: 'v1.1.0',
    last_github_update: '2026-10-06T12:00:00Z',
    featured: true,
    installation_guide: `### Overview
**UT99 Quest** is a native 64-bit ARM OpenXR source port of the legendary arena shooter *Unreal Tournament* (1999) running standalone on Meta Quest headsets, developed by GHWST.

It renders true stereoscopic 3D at native Quest resolution with full 6DoF motion controls, physical two-handed weapon handling, functional sniper scope optical zoom, haptic feedback, and full online multiplayer powered by OldUnreal v469 packages!

> [!NOTE]
> This port provides the VR engine only and ships zero commercial game assets. You must provide files from your legally owned PC copy of Unreal Tournament (GOTY or standard edition).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) in Developer Mode.
2. Legally owned copy of **Unreal Tournament (1999)** on PC (GOG, Steam, original CD-ROM, or archive).
3. WebADB (via QuestPorts), SideQuest, or Android ADB platform tools.

---

### Step-by-Step Installation Guide

#### Step 1: Install the UT99 Quest APK
1. Download **\`ut99quest.apk\`** directly via the 1-Click Install button on QuestPorts or from [ut99vr.pages.dev](https://ut99vr.pages.dev/).
2. Sideload the APK onto your headset:
   \`\`\`bash
   adb install -r ut99quest.apk
   \`\`\`

#### Step 2: Transfer Game Data Files
Transfer your UT99 PC installation folders into the app's directory on Quest storage:
* **Target Path:** \`/sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/\`
*(Alternatively, you can place a \`UT99\` folder or ZIP into \`/sdcard/UT99Quest/\` and use the built-in in-headset file importer).*

Using ADB or QuestPorts:
\`\`\`bash
adb push System   /sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/
adb push Maps     /sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/
adb push Textures /sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/
adb push Sounds   /sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/
adb push Music    /sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/
\`\`\`

Ensure the \`System\` folder contains \`Core.u\`, \`Engine.u\`, and \`Botpack.u\`.

#### Step 3: First Launch & Automatic Patching
1. Put on your headset and launch **UT99 Quest** from **App Library → Unknown Sources**.
2. On first run, the app will automatically download and apply the modern OldUnreal 469 packages with a progress bar.
3. Jump into instant action against bots or open the server browser for online deathmatch!`,
    troubleshooting_notes: 'The app requires System, Maps, Textures, Sounds, and Music folders with Core.u, Engine.u, and Botpack.u inside System. If you encounter permissions issues, push files directly into /sdcard/Android/data/com.ghwstvr.ut99quest/files/UT99/ as this path does not require extra scoped storage permissions.'
  },
  {
    id: '38',
    slug: 'nolf-vr',
    title: 'No One Lives ForeVR',
    developer: 'alex.nax',
    developer_url: 'https://github.com/alex-nax',
    short_description: 'Standalone 6DoF OpenXR VR port of The Operative: No One Lives Forever (2000) on Meta Quest via ReLith, a LithTech 2.x reimplementation. First-person motion-controlled weapons, Cate’s authored hands, and a floating HUD — engine only, you supply the original game files.',
    category: 'engine_recreation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/nolf-vr.png',
    youtube_video_id: '6NsGBkCp9ro',
    video_preview_url: null,
    video_preview_start: 300,
    video_preview_end: 360,
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn', 'Two-Handed Weapons', 'Seated / Standing'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/nolf/',
    base_game_url: 'https://en.wikipedia.org/wiki/The_Operative:_No_One_Lives_Forever',
    base_game_store: 'Requires your own original PC copy',
    port_download_url: 'https://github.com/alex-nax/relith/releases/download/v0.4.0/relith-nolf-quest-0.4.0.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/alex-nax/relith',
    latest_version: 'v0.4.0',
    last_github_update: '2026-09-25T13:40:37Z',
    featured: true,
    installation_guide: `### Overview
**ReLith** is a modern LithTech 2.x engine for *The Operative: No One Lives Forever* (2000), running standalone on Meta Quest. It is the **engine only** — it ships no game content. You need your own copy of NOLF (original discs or a legally owned install). The engine reads the original \`.REZ\` archives directly.

Official Quest guide: [INSTALL-QUEST.md](https://github.com/alex-nax/relith/blob/master/INSTALL-QUEST.md).

> [!NOTE]
> First launch **must** grant **All files access**. Until you copy the game archives, you will see **Game data not found** — that is expected.

---

### Prerequisites
1. Meta Quest (Quest 3 / 3S recommended; Quest 2 works with a known menu-panel issue).
2. Developer Mode + USB debugging allowed in the headset.
3. Your own copy of **No One Lives Forever** (PC discs or an owned install).
4. About **1.1 GB** free on the headset for the game archives.

---

### Step-by-Step Installation

#### 1. Install the APK
Download **\`relith-nolf-quest-0.4.0.apk\`** via 1-click on QuestPorts or from [GitHub Releases](https://github.com/alex-nax/relith/releases/tag/v0.4.0).

\`\`\`bash
adb install -r relith-nolf-quest-0.4.0.apk
\`\`\`

Package name: \`net.relith.nolf\`.

#### 2. Launch once and grant storage
Open **App Library → Unknown Sources → ReLith**. Grant **Allow access to manage all files**. If the Settings page does not open: **Settings → Apps → Special app access → All files access → ReLith**.

Launch again. You should see **Game data not found**. Close the app — launching created the folder you copy into.

#### 3. Copy game files into \`nolf/\`
Copy these archives **directly** into \`/sdcard/nolf/\` (a plain folder next to Downloads/Pictures — not a nested subfolder):

| File | Needed? |
|---|---|
| \`NOLF.REZ\` | required — the game |
| \`NOLF2.REZ\` | required — menus, music, interface |
| \`nolfu003.rez\` | required — v1.003 patch |
| \`nolfu003cres.rez\` | required — menu text (without it, menus are blank) |
| \`NOLFGOTY.REZ\` | optional — GOTY bonus chapter *Rest and Relaxation* |
| \`FontData.fnt\` | optional — ReLith has a fallback |

\`\`\`bash
adb push NOLF.REZ /sdcard/nolf/
adb push NOLF2.REZ /sdcard/nolf/
adb push nolfu003.rez /sdcard/nolf/
adb push nolfu003cres.rez /sdcard/nolf/
\`\`\`

**From original discs:** Disc 1 \`Data\\\` has \`NOLF2.REZ\`, \`NOLFGOTY.REZ\`, \`nolfu003.rez\` and the \`*cres.rez\` files. Disc 2 \`Data\\\` has \`NOLF.REZ\`.

Do **not** copy Windows-only leftovers (\`.flt\` filters, \`.M3D\` drivers, \`cshell.dll\`, \`WidescreenGOTY.rez\`, \`EReg/\`, \`Movies/\`, \`Save/\`). **Do not copy MODERNIZER** — it is already bundled in the APK.

If storage permission was never granted, files can also live in \`/sdcard/Android/data/net.relith.nolf/files/nolf/\` (uninstalling then **deletes** that copy).

#### 4. Play
Launch ReLith again. You should get the main menu.

---

### Upgrading from 0.3.1 or older (one time)
Those builds used Android’s debug signing key. **0.4.0 is properly signed**, so Android refuses an in-place update (\`INSTALL_FAILED_UPDATE_INCOMPATIBLE\`). Back up saves, uninstall, install, restore — then later releases update normally.

Saves are next to the game files:

- \`/sdcard/nolf/Save/\` (and \`autoexec.cfg\` in \`/sdcard/nolf/\` — unlocked missions live there)
- or \`/sdcard/Android/data/net.relith.nolf/files/nolf/Save/\` if that is where your data is

\`\`\`bash
adb pull /sdcard/nolf/Save ./relith-saves
adb pull /sdcard/nolf/autoexec.cfg .
adb uninstall net.relith.nolf
# install 0.4.0, launch once with storage granted, then:
adb push ./relith-saves/. /sdcard/nolf/Save/
adb push ./autoexec.cfg /sdcard/nolf/
\`\`\``,
    troubleshooting_notes: 'Game data not found after copying: archives must sit directly in /sdcard/nolf/, not a nested folder. Menus with no text: missing nolfu003cres.rez (or nolf003cres.rez / NOLFCRES003.REZ). Bonus chapter greyed out: missing NOLFGOTY.REZ. Storage prompt every launch: All files access did not stick. Quest 2: VR menu panel can render black except the pointer line. Falling into water can apply extra fall damage vs the original. MODERNIZER by HeyThereCoffeee (haekb) is bundled; unofficial fan project, not affiliated with Monolith.'
  }
]







