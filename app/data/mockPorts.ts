import type { Port } from '~/types/port'
import { MOCK_INSTALL_COUNTS } from './mockVerifications'

const MOCK_INSTALLS = new Map(MOCK_INSTALL_COUNTS.map(row => [row.port_slug, row.installs]))

/** Fallback install count when the catalog is served from this file. */
export function mockPortInstallCount(slug: string): number {
  return MOCK_INSTALLS.get(slug) ?? 0
}

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
2. Launch RTCWQuest once inside your headset. The app creates \`/sdcard/RTCWQuest/Main/\` and, when \`pak0.pk3\` is missing, copies a demo \`pak0.pk3\` into it. Exit before you copy the full game.
3. On your computer, open the full game Main folder. On Steam that is \`steamapps/common/Return to Castle Wolfenstein/Main/\` (install folder \`Return to Castle Wolfenstein\`).
4. Copy the full-game pk3 set:
   * \`pak0.pk3\`
   * \`sp_pak1.pk3\`
   * \`sp_pak2.pk3\`
   * \`sp_pak3.pk3\`
   * \`sp_pak4.pk3\`
5. Connect your Quest to your PC via USB and copy these files into:
   \`/sdcard/RTCWQuest/Main/\`
6. Put on your headset and launch RTCWQuest from the "Unknown Sources" library tab.

The demo \`pak0.pk3\`, plus the VR files the app also copies (\`z_vr_assets.pk3\`, \`z_zvr_weapons.pk3\`, and \`sp_vpak8.pk3\`), does not count as the full game. The check counts the game as installed only when \`pak0.pk3\` and \`sp_pak1.pk3\` through \`sp_pak4.pk3\` are all present.`,
    troubleshooting_notes: 'If the game crashes on startup, ensure that all .pk3 file extensions are in lowercase on the Quest storage. pak0.pk3 alone is the demo the app copies on first launch. The full game also needs sp_pak1.pk3 through sp_pak4.pk3.'
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
* Original Half-Life on Steam. Half-Life: Source is not compatible.
* Lambda1VR launcher installed via SideQuest.

### Step-by-Step Installation
1. Install **Lambda1VR** through SideQuest.
2. Launch the app once on the headset so it generates the \`/sdcard/xash/\` directory structure, then exit.
3. In Steam, open Half-Life, then Properties, then Betas, and select \`steam_legacy\` ("Pre-25th Anniversary Build"). Let Steam finish the update before copying files. The current public build is reported broken for Lambda1VR (hl-paker README, 2025-04-04; r/TeamBeef pinned post).
4. On your PC, open the updated \`valve\` folder: \`steamapps/common/Half-Life/valve/\` (install folder \`Half-Life\`). The Lambda1VR README example writes this as \`steamApps/common/HalfLife/\`.
5. Copy the contents of the \`valve\` folder. A Steam install is loose files, including \`liblist.gam\`. It does not include the old WON \`pak0.pak\`.
6. Paste the copied files into \`/sdcard/xash/valve/\` on your Meta Quest. Copying the whole folder takes a long time.
7. Restart the Quest, then launch Lambda1VR from "Unknown Sources".

Optional HD models are the \`valve_hd\` folder from that same \`steam_legacy\` install. On a Mac that folder can be hidden; follow the Lambda1VR README Mac note or the game can crash.`,
    troubleshooting_notes: 'Restart the Quest after copying files into /sdcard/xash/valve/. Select the Steam steam_legacy beta ("Pre-25th Anniversary Build") under Half-Life Properties, Betas, and let it update before you copy the valve folder. The current public build is reported broken (hl-paker README, 2025-04-04; r/TeamBeef pinned post). Optional HD content is valve_hd; on Mac that folder can be hidden.'
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
* **Original 2004 Doom 3**. Doom 3: BFG Edition does **not** work.
* SideQuest or ADB installed on your computer.

### Step-by-Step Installation
1. Install the Doom3Quest APK launcher via SideQuest.
2. Launch the app once so it creates the Doom3Quest folders, then exit. Connect your Quest and open \`/sdcard/Doom3Quest/base/\`.
3. From the original 2004 Doom 3 \`base\` folder, copy both sets of pk4 files:
   * \`game00.pk4\` through \`game03.pk4\`
   * \`pak000.pk4\` through \`pak008.pk4\`
   Steam install folder for the original game is \`Doom 3\` (\`steamapps/common/Doom 3/base/\`). The Doom3Quest site example writes this as \`steamApps/common/Doom3/\`. Do not use the install folder \`DOOM 3 BFG Edition\`.
4. Paste those pk4 files into \`/sdcard/Doom3Quest/base/\`.
5. Launch Doom3Quest on your headset.

The port copies its own \`pak399.pk4\` into base. That file does not replace \`game00.pk4\` through \`game03.pk4\` or \`pak000.pk4\` through \`pak008.pk4\`.`,
    troubleshooting_notes: 'Doom 3: BFG Edition does not work with this port. The original base folder must include game00.pk4 through game03.pk4 and pak000.pk4 through pak008.pk4.'
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
    port_download_url: 'https://github.com/Team-Beef-Studios/JKXR/releases/latest',
    port_download_source: 'GitHub Releases',
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
    port_download_url: 'https://github.com/Team-Beef-Studios/Quake2Quest/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/DrBeef/Quake2Quest',
    latest_version: 'v1.1.1',
    last_github_update: '2026-09-29T20:43:23Z',
    featured: false,
    installation_guide: `### Step-by-Step Installation
1. Install Quake II Quest via SideQuest.
2. Launch the app once, then exit. The first launch creates \`/sdcard/Quake2Quest/\` and, when they are missing, copies a shareware \`pak0.pak\` plus \`pak6.pak\` and \`pak99.pak\` into that folder.
3. On your PC, open the original Quake 2 install. On Steam the folder is \`steamapps/common/Quake 2/\` (install folder \`Quake 2\`, not \`Quake II\`).
4. From the original \`baseq2\` folder, copy \`pak0.pak\`, \`pak1.pak\`, and \`pak2.pak\`. Do not copy files from the \`rerelease\` folder. The Steam default launch executable is \`rerelease/quake2ex_steam.exe\`; the original game is \`quake2.exe\`.
5. Paste those three pak files into \`/sdcard/Quake2Quest/\` on your Meta Quest (the Quake2Quest folder itself, not a baseq2 subfolder).

The full game is present only when \`pak0.pak\`, \`pak1.pak\`, and \`pak2.pak\` are all in that folder. \`pak0.pak\`, \`pak6.pak\`, and \`pak99.pak\` are files the app can copy; they are not the full game.`,
    troubleshooting_notes: 'Original soundtrack OGG files go in /sdcard/Quake2Quest/music/. Do not use the rerelease folder. pak0.pak, pak6.pak, and pak99.pak can be copied by the app; the full game also needs pak1.pak and pak2.pak.'
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
    port_download_url: 'https://github.com/Team-Beef-Studios/PreyVR/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/lvonasek/PreyVR',
    latest_version: 'v1.2.4',
    last_github_update: '2026-03-24T17:18:41Z',
    featured: false,
    installation_guide: `### Installation
1. Install the APK from GitHub or SideQuest.
2. Open Prey VR once on the headset so the app creates \`preyvr/preybase\`, then exit.
3. Copy all \`.pk4\` files from your original Prey (2006) PC \`prey/base\` folder into \`/sdcard/preyvr/preybase/\`.
4. Launch the game from Unknown Sources.`,
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
    port_download_url: 'https://github.com/Team-Beef-Studios/BeefRaiderXR/releases/latest',
    port_download_source: 'GitHub Releases',
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
    port_download_url: 'https://github.com/Team-Beef-Studios/QuakeQuest/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/Team-Beef-Studios/QuakeQuest',
    latest_version: 'v1.6.0',
    last_github_update: '2026-09-29T18:33:22Z',
    featured: true,
    installation_guide: `### Prerequisites
* A legally owned copy of the original Quake (Steam, GOG, or Bethesda). Use the original id1 pak files, not the rerelease folder.
* Meta Quest headset with Developer Mode enabled or SideQuest.

### Step-by-Step Installation
1. Install **QuakeQuest** APK using SideQuest.
2. Launch QuakeQuest once inside your headset so it can create \`QuakeQuest/id1\`, then exit. The APK includes the shareware game, and the first launch copies a shareware \`pak0.pak\` when that file is missing.
3. On your computer, open the original id1 folder. On Steam that is \`steamapps/common/Quake/id1/\` (install folder \`Quake\`). The original launch executable is \`glquake.exe\`. Do not copy files from the \`rerelease\` folder (the default Steam launch executable is \`rerelease/Quake_x64_steam.exe\`).
4. Copy the original \`pak0.pak\` and \`pak1.pak\` into \`/sdcard/QuakeQuest/id1/\` on your Quest.
5. Put on your headset and launch QuakeQuest from "Unknown Sources".

\`pak0.pak\` by itself is the shareware data. The full game is present only when \`pak1.pak\` is there too.`,
    troubleshooting_notes: 'Ensure pak file names are lowercase (pak0.pak, pak1.pak). pak0.pak alone is the shareware file the app can copy on first launch; the full game also needs pak1.pak. Add soundtrack in OGG format under /sdcard/QuakeQuest/id1/sound/cdtracks/ for classic atmospheric music.'
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
    port_download_url: 'https://github.com/Team-Beef-Studios/RazeXR/releases/latest',
    port_download_source: 'GitHub Releases',
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
    port_download_url: 'https://github.com/QuestCraftPlusPlus/QuestCraft/releases/latest',
    port_download_source: 'GitHub Releases',
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
    port_download_url: 'https://github.com/Team-Beef-Studios/CSVR/releases/latest',
    port_download_source: 'GitHub Releases',
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
    port_download_url: 'https://github.com/sezero/uhexen2/blob/master/README.txt',
    port_download_source: 'GitHub',
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
    port_download_url: 'https://www.ppsspp.org/files/1_20_4/ppsspp_vr.apk',
    port_download_source: 'PPSSPP.org',
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
    port_download_url: 'https://github.com/WinlatorXR/WinlatorXR/releases/latest',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/WinlatorXR/WinlatorXR',
    latest_version: 'cats-27',
    last_github_update: '2026-07-01T14:17:23Z',
    featured: false,
    installation_guide: `### Installation
1. Download and install WinlatorXR APK via SideQuest or GitHub Releases.
2. Put game installation folders in your Quest \`/sdcard/Download/\` directory.
3. Open WinlatorXR, create a new Wine Container with Turnip drivers and DXVK enabled, and run your setup or .exe file.

---

### PCVR games
Since October 2026 the **dawn** builds also run Windows PCVR games, through WinlatorXR's own OpenXR runtime ([OXRWXR](https://github.com/WinlatorXR/OpenXR-WXR)). Players have reported **Skyrim VR**, **Fallout 4 VR** and **Half-Life: Alyx** running this way, all from your own copy of the game.

> [!NOTE]
> **Set your expectations.** The Quest 3 runs these like a PC from around 2010: Skyrim VR plays well indoors but drops to about 30 fps, sometimes under 20, in the open world. Most PCVR games were tested on the Pico 4 Ultra, and some that work there do not work on Quest 3. Check the [WinlatorXR compatibility page](https://winlatorxr.github.io/compatibility.html) before you copy a large game over.

---

### VR mods that run inside WinlatorXR
These are full VR mods for PC games that run standalone on Quest 3 through WinlatorXR, made by SgtBilko76 (Port Royale). They are not separate apps: each one is a zip you unpack into your own game folder, plus a WinlatorXR container or shortcut profile. All are betas.

> [!NOTE]
> **You need your own copy of each PC game** (Steam, GOG or retail), copied from a PC into \`/sdcard/Download/\`. Each mod's page lists the exact container settings (screen size, DXVK, Turnip) and the WinlatorXR build it was tested on: the newer **dawn** line or **cats-27**.

* **Call of Duty 4 VR** (KisakCOD): copy the COD4 folder to \`Download/CallOfDuty4\`. Physical reloads and a physical scope. Needs dawn-33 or newer. [Release](https://github.com/SgtBilko76/CallOfDuty4_VR/releases/tag/v0.2.0-beta.1) · [Guide](https://portroyale.online/cod4.html)
* **Far Cry VR**: your own Far Cry (2004). Holds a locked 72 fps at 1792×1624 once \`FarCry.exe\` is patched large-address-aware. [Release](https://github.com/SgtBilko76/Farcry_vrmod-WinlatorXR/releases/tag/quest-beta-0.3) · [Guide](https://portroyale.online/farcry.html)
* **Crysis VR**: the 2007 Crysis (not Remastered). Tested on cats-27; the dawn package is still untested. [Release](https://github.com/SgtBilko76/Crysis-VR-WinlatorXR/releases/tag/Beta-0.3) · [Guide](https://portroyale.online/crysis.html)
* **Battlefield 1942 VR** (BFVR): copy the game folder to \`Download/BF1942\`. The container screen must be 1792×1624. [Release](https://github.com/SgtBilko76/Battlefield-1942-WinlatorXR/releases/tag/quest-beta3) · [Guide](https://portroyale.online/bf1942.html)
* **Red Faction VR**: copy the game folder to \`Download/RedFaction\`; the GOG \`RF.exe\` is converted on first start. Needs dawn-33 or newer. [Release](https://github.com/SgtBilko76/alpinefactionVR/releases/tag/quest-v0.2.0-beta) · [Guide](https://portroyale.online/redfaction.html)
* **TrackMania Nations Forever VR**: the easiest one. Import the container image and the free game downloads from Nadeo on first start. Races run at about 30–45 fps. [Release](https://github.com/SgtBilko76/TrackManiaForeverOpenXR/releases/tag/quest-beta-0.2) · [Guide](https://portroyale.online/trackmania.html)

From other developers:

* **Halo: Combat Evolved VR** (HWXR, by Bigelowed with the WinlatorXR team): a WinlatorXR conversion of LivingFray's Halo CE VR mod. Needs the retail Halo CE for PC (patch 1.0.10, not Custom Edition). Run \`HWXR_Setup.exe\` inside a container after installing **Wine Mono** from System Tools, and set the shortcut to a custom 1400×1400 resolution. [Release](https://github.com/WinlatorXR/HWXR-Release/releases/tag/V1.5) · [Setup video](https://www.youtube.com/watch?v=gUu49RbHXmg)
* **BRUTALISTICK VR** performance patch (BrutalLite Select, by abgitdev): a checkbox patch that turns off the effects that make BRUTALISTICK VR stutter on Quest 3 (blood painting, decals, particles, post-processing). Needs your own Steam copy of BRUTALISTICK VR running as a PCVR game in WinlatorXR. [Release](https://github.com/abgitdev/BrutalLite-Select/releases/tag/v1.0.0)

> [!TIP]
> Play with more than 50% battery: the Quest throttles below that, and these games feel it first.`,
    troubleshooting_notes: 'Best suited for older DirectX 9 / 10 PC titles on Quest 3 / 3S for optimal performance. For the VR mods, follow the container screen size on each mod\'s guide exactly: a wrong size gives a blurry picture or a crash.'
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
    install_workflow: 'direct',
    cover_image_url: '/covers/time-crisis-vr.jpg',
    youtube_video_id: 'PGUc8b3VIu0',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Physical Ducking', 'Cover System'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (ROM set bundled in the release APK)',
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
    internal_storage_path: '/sdcard/Android/data/com.galaxy.quest/files/game/',
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
4. Run the cook script with Python (from the unzipped \`GalaxyQuest-converter\` folder):
   \`\`\`bash
   python tools/cook/cook.py extracted cooked --with-movies
   \`\`\`
5. Copy the converted files to the headset. The script unpacks them into \`/sdcard/Android/data/com.galaxy.quest/files/game/\`:
   \`\`\`bash
   python tools/push_data.py cooked
   \`\`\`
   Without adb, copy the \`cooked\` folder to the headset (for example into \`Download\`) and pick it on the app's setup screen.
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
   Plug your Quest into your PC and authorize USB debugging on the headset prompt. The installer will patch the binaries, push the game data to \`/sdcard/savr/data_main/\` and the audio to \`/sdcard/Android/data/com.rockstargames.gtasa/files/audio/\`.
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
    internal_storage_path: '/sdcard/Android/data/com.miamivr.quest/files/gamedata/',
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
    youtube_video_id: 'dbsjnLCVw-8',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Roomscale', 'Smooth Locomotion', 'Physical Melee', 'Physical Archery', 'Physical Swimming'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.gothic2vr.quest/files/Gothic2/',
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
   Put on your headset, approve storage permissions when prompted, and choose the ZIP in \`/sdcard/Download/Gothic2VR/\`. After import the game is in \`/sdcard/Android/data/com.gothic2vr.quest/files/Gothic2/\`. Launch **Gothic II VR** from **Unknown Sources**.

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
    internal_storage_path: '/sdcard/Android/data/io.github.hpvr.quest/files/HP/',
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
    internal_storage_path: '/sdcard/Android/data/com.rrjb.vr/files/',
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
> The release ZIP already contains the pre-compiled signed Quest APK. You only need your legally dumped PS1 disc image (MODE2/2352 \`.bin\` or \`.img\`, copied to the headset as \`disc.bin\`). A 2048-byte \`.iso\` omits the XA audio sectors and is not accepted.

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
    internal_storage_path: '/sdcard/Android/data/com.bassquake.quest.avpvr/files/',
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
    youtube_video_id: 'Zw1phT4fK0Y',
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
    port_download_url: 'https://jackaapacka.itch.io/iron-lung-vr',
    port_download_source: 'Itch.io',
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
  },
  {
    id: '39',
    slug: 'confidential-mission-vr',
    title: 'Confidential Mission VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/confidential-mission-vr',
    short_description: 'Sega\'s 2000 arcade light-gun spy thriller Confidential Mission (Sega NAOMI) in 6DoF stereo VR, standalone on Meta Quest. Dual-wield tracked controllers, 1:1 aiming, arcade reload, and co-op action.',
    category: 'emulator',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/confidential-mission-vr.png',
    youtube_video_id: 'be8uaCACx1Q',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Confidential_Mission',
    base_game_store: 'Requires your own copy (Sega NAOMI arcade set)',
    port_download_url: 'https://github.com/vr4all-standalone/confidential-mission-vr/releases/download/v1.2.6/confidential-mission-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/confidential-mission-vr',
    latest_version: 'v1.2.6',
    last_github_update: '2026-10-27T01:50:16Z',
    featured: true,
    installation_guide: `### Overview
**Confidential Mission VR** brings Sega's 2000 arcade light-gun spy thriller (Sega NAOMI) to standalone Meta Quest in stereoscopic 6DoF VR. A VR fork of Flycast rebuilds the original 3D scenes in stereo around you while your Touch controllers act as 1:1 tracked light guns with arcade haptic recoil. Supports dual wielding and two players on one headset.

> [!NOTE]
> **No game files included.** You need your legally owned copy of the Sega NAOMI arcade set: \`confmiss.zip\`, \`confmiss/gds-0001.chd\`, and \`naomi.zip\`.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Sideloading enabled (Developer Mode or QuestPorts App).
* MAME NAOMI ROM set: \`confmiss.zip\`, \`confmiss/gds-0001.chd\`, and \`naomi.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`confidential-mission-vr-quest.apk\` from GitHub Releases.
2. Put \`confmiss.zip\`, \`confmiss/gds-0001.chd\`, and \`naomi.zip\` into your headset's \`/sdcard/Download/\` folder.
3. Launch **Confidential Mission VR** from **Unknown Sources**.
4. Grant All Files Access when prompted. The game verifies your ROM files and launches.`,
    troubleshooting_notes: 'Missing game files: confmiss.zip and naomi.zip must sit directly in /sdcard/Download/, and gds-0001.chd in /sdcard/Download/confmiss/. Ensure All Files Access is granted in headset permissions.'
  },
  {
    id: '40',
    slug: 'lupin-the-third-vr',
    title: 'Lupin the Third: The Shooting VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/lupin-the-third-vr',
    short_description: 'Sega\'s 2001 NAOMI arcade light-gun shooter Lupin the Third: The Shooting in stereo 6DoF VR, standalone on Meta Quest. Tracked controller aiming, stereo reconstructed scenes, and Walther P38 pistol model.',
    category: 'emulator',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/lupin-the-third-vr.png',
    youtube_video_id: 'IBmXZJmbUVA',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Lupin_the_3rd:_The_Shooting',
    base_game_store: 'Requires your own copy (Sega NAOMI arcade set)',
    port_download_url: 'https://github.com/vr4all-standalone/lupin-the-third-vr/releases/download/v1.0.5/lupin-the-third-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/lupin-the-third-vr',
    latest_version: 'v1.0.5',
    last_github_update: '2026-10-27T00:00:00Z',
    featured: true,
    installation_guide: `### Overview
**Lupin the Third: The Shooting VR** brings Sega's 2001 NAOMI arcade light-gun action game to standalone Meta Quest in stereo 6DoF VR. Aim with Lupin's signature Walther P38 pistol model or Jigen's revolver, dual wield, and experience classic anime arcade action rebuilt in VR.

> [!NOTE]
> **No game files included.** Requires the original GDS-0018 NAOMI set: \`lupinshoo.zip\`, \`lupinshoo/gds-0018.chd\`, and \`naomi.zip\`.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Developer Mode enabled.
* Original GDS-0018 set: \`lupinshoo.zip\`, \`lupinshoo/gds-0018.chd\`, and \`naomi.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`lupin-the-third-vr-quest.apk\` from GitHub Releases.
2. Put \`lupinshoo.zip\`, \`lupinshoo/gds-0018.chd\`, and \`naomi.zip\` into \`/sdcard/Download/\`.
3. Launch **Lupin the Third VR** from **Unknown Sources**.
4. Allow file access when prompted, then select **Play**.`,
    troubleshooting_notes: 'Rev A (lupinsho / gds-0018a) is unsupported; use the original GDS-0018 set lupinshoo.zip. Verify naomi.zip is also present in /sdcard/Download/.'
  },
  {
    id: '41',
    slug: 'ninja-assault-vr',
    title: 'Ninja Assault VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/ninja-assault-vr',
    short_description: 'Namco\'s 2000 arcade ninja light-gun shooter Ninja Assault (NAOMI) in 6DoF stereo VR, standalone on Meta Quest. Dual ninja guns, 1:1 motion aiming, arcade recoil, and feudal Japanese action.',
    category: 'emulator',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/ninja-assault-vr.png',
    youtube_video_id: 'Go4myYryHog',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Ninja_Assault',
    base_game_store: 'Requires your own copy (Namco NAOMI arcade set)',
    port_download_url: 'https://github.com/vr4all-standalone/ninja-assault-vr/releases/download/v1.0.5/ninja-assault-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/ninja-assault-vr',
    latest_version: 'v1.0.5',
    last_github_update: '2026-10-27T00:00:00Z',
    featured: true,
    installation_guide: `### Overview
**Ninja Assault VR** brings Namco's 2000 feudal Japanese arcade light-gun shooter to Meta Quest in 6DoF stereo VR. Features 1:1 tracked controllers as ninja guns, arcade recoil, and attract mode generation of your Mach Gun.

> [!NOTE]
> **No game files included.** Requires the NAOMI World NJA2 Ver.A cartridge set: \`ninjaslt.zip\` and \`naomi.zip\`. No CHD is required.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Developer Mode enabled.
* NAOMI cartridge set: \`ninjaslt.zip\` and \`naomi.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`ninja-assault-vr-quest.apk\` from GitHub Releases.
2. Put \`ninjaslt.zip\` and \`naomi.zip\` into \`/sdcard/Download/\`.
3. Launch **Ninja Assault VR** from **Unknown Sources**.
4. Grant storage access and wait for first-time gun generation.`,
    troubleshooting_notes: 'Regional sets (ninjaslta, ninjasltj, ninjasltu) are unsupported; use the complete World NJA2 Ver.A set ninjaslt.zip with all 12 ROM entries.'
  },
  {
    id: '42',
    slug: 'death-crimson-ox-vr',
    title: 'Death Crimson OX VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/death-crimson-ox-vr',
    short_description: 'Ecole Software\'s 2000 arcade cult-classic light-gun shooter Death Crimson OX (NAOMI) in 6DoF VR on Meta Quest. Native Crimson gun extraction, tracked controller aim, and dual-wielding.',
    category: 'emulator',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/death-crimson-ox-vr.png',
    youtube_video_id: '4LIxgS_KOZI',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Death_Crimson_OX',
    base_game_store: 'Requires your own copy (Sega NAOMI arcade set)',
    port_download_url: 'https://github.com/vr4all-standalone/death-crimson-ox-vr/releases/download/v1.0.4/death-crimson-ox-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/death-crimson-ox-vr',
    latest_version: 'v1.0.4',
    last_github_update: '2026-10-27T00:00:00Z',
    featured: true,
    installation_guide: `### Overview
**Death Crimson OX VR** brings Ecole Software's 2000 cult-classic NAOMI arcade rail shooter to Meta Quest in stereoscopic 6DoF VR. Includes local native pistol model generation, 1:1 aim tracking, recoil, and two-player arcade action.

> [!NOTE]
> **No game files included.** Requires the NAOMI Japan Rev A set: \`deathcoxj.zip\` and \`naomi.zip\`. No CHD is required.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Developer Mode enabled.
* NAOMI cartridge set: \`deathcoxj.zip\` and \`naomi.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`death-crimson-ox-vr-quest.apk\` from GitHub Releases.
2. Put \`deathcoxj.zip\` and \`naomi.zip\` into \`/sdcard/Download/\`.
3. Launch **Death Crimson OX VR** from **Unknown Sources**.
4. Grant storage access and select **Play**.`,
    troubleshooting_notes: 'Must be Japan Rev A (deathcoxj.zip) containing epr-23524a.ic22 and chips ic1 through ic10. USA set deathcox is currently unsupported.'
  },
  {
    id: '43',
    slug: 'survivor2-code-veronica-vr',
    title: 'Resident Evil Survivor 2: Code Veronica VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/survivor2-code-veronica-vr',
    short_description: 'Capcom & Namco\'s 2001 NAOMI survival horror arcade game in 6DoF VR on Meta Quest. Features free analog thumbstick locomotion, snap turns, 1:1 motion aiming, and Nemesis.',
    category: 'emulator',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/survivor2-code-veronica-vr.png',
    youtube_video_id: 'HucHP0u5UQk',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion (analog stick)', 'Snap Turn', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Resident_Evil_Survivor_2_%E2%80%93_Code:_Veronica',
    base_game_store: 'Requires your own copy (Capcom / Namco NAOMI arcade set)',
    port_download_url: 'https://github.com/vr4all-standalone/survivor2-code-veronica-vr/releases/download/v1.0.4/survivor2-code-veronica-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/survivor2-code-veronica-vr',
    latest_version: 'v1.0.5',
    last_github_update: '2026-10-27T00:00:00Z',
    featured: true,
    installation_guide: `### Overview
**Resident Evil Survivor 2: Code Veronica VR** adapts Capcom & Namco's 2001 NAOMI survival horror arcade game for Meta Quest. Unlike traditional on-rails light-gun games, this port features **full analog thumbstick locomotion and 30° snap turns** alongside 1:1 motion aiming and dynamic weapon extraction (BR-93R, Python, Gold Luger, Ingram, SPAS-12, AK47S, M79, LN-02).

> [!NOTE]
> **No game files included.** Requires the NAOMI World cartridge set: \`gunsur2.zip\` and \`naomi.zip\`.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Developer Mode enabled.
* NAOMI cartridge set: \`gunsur2.zip\` and \`naomi.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`survivor2-code-veronica-vr-quest.apk\` from GitHub Releases.
2. Put \`gunsur2.zip\` and \`naomi.zip\` into \`/sdcard/Download/\`.
3. Launch **Survivor 2 Code: Veronica VR** from **Unknown Sources**.
4. Move with the left thumbstick and snap-turn with the right thumbstick.`,
    troubleshooting_notes: 'Requires the World cartridge gunsur2.zip (15 ROMs). Both controllers must be tracked for analog movement. Weapon models are extracted automatically on first start.'
  },
  {
    id: '44',
    slug: 'mok-vr',
    title: 'The Maze of the Kings VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/mok-vr',
    short_description: 'Sega\'s 2002 ancient Egyptian arcade rail shooter The Maze of the Kings (NAOMI) in 6DoF VR on Meta Quest. Hold the illuminated 3D magical crystal staff with emerald ripples and gold motes.',
    category: 'emulator',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/mok-vr.png',
    youtube_video_id: 'En2PYkAvBCo',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/The_Maze_of_the_Kings',
    base_game_store: 'Requires your own copy (Sega NAOMI arcade set)',
    port_download_url: 'https://github.com/vr4all-standalone/mok-vr/releases/download/v1.0.5/mok-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/mok-vr',
    latest_version: 'v1.0.5',
    last_github_update: '2026-10-28T00:00:00Z',
    featured: true,
    installation_guide: `### Overview
**The Maze of the Kings VR** puts you inside Sega's 2002 ancient Egyptian arcade rail shooter on Meta Quest. Hold the illuminated 3D magical crystal staff with emerald ripples and gold motes in your hands, shoot undead mummies in stereo VR, and explore ancient tombs.

> [!NOTE]
> **No game files included.** Requires the NAOMI MAME set \`mok.zip\`, disc \`mok/gds-0022.chd\`, and \`naomi.zip\`.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Developer Mode enabled.
* NAOMI set: \`mok.zip\`, \`mok/gds-0022.chd\`, and \`naomi.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`mok-vr-quest.apk\` from GitHub Releases.
2. Put \`mok.zip\`, \`mok/gds-0022.chd\`, and \`naomi.zip\` into \`/sdcard/Download/\`.
3. Launch **The Maze of the Kings VR** from **Unknown Sources**.
4. Grant storage access and aim your magical staff to play!`,
    troubleshooting_notes: 'Requires mok.zip (containing 317-0333-com.pic) and mok/gds-0022.chd. The app extracts and generates the magical staff on first boot.'
  },
  {
    id: '45',
    slug: 'wakerquest',
    title: 'WakerQuest',
    developer: 'Trastorillo',
    developer_url: 'https://github.com/Trastorillo',
    short_description: 'Native C++ decompilation port of The Legend of Zelda: The Wind Waker on Meta Quest 3/3S. Features stereoscopic 3D giant virtual screen, tabletop diorama mode, and mixed reality passthrough ambience.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/wakerquest.png',
    youtube_video_id: '_Y2C9td1agc',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated', 'Roomscale', 'Tabletop / Diorama'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_The_Wind_Waker',
    base_game_store: 'Requires your own copy (GameCube disc)',
    port_download_url: 'https://github.com/Trastorillo/wakerquest/releases/download/v1.0.7/WakerQuest-1.0.7.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/Trastorillo/wakerquest',
    latest_version: 'v1.0.7',
    last_github_update: '2026-10-26T01:19:49Z',
    featured: true,
    installation_guide: `### Overview
**WakerQuest** is an unofficial native port of *The Legend of Zelda: The Wind Waker* (2002 GameCube) running directly on Meta Quest 3 and 3S via Android and OpenXR. Compiled natively from its C++ decompilation with Aurora (WebGPU), it runs without CPU emulation. Play on a massive stereoscopic 3D theater screen, scale the Great Sea into a tabletop diorama with grip controls, or enjoy MR passthrough ambience where nearby characters walk right in your room.

> [!NOTE]
> **No Nintendo assets included.** You must provide your own legally dumped, uncompressed European GameCube ISO (\`GZLP01.iso\`, revision 0) or USA ISO (\`GZLE01.iso\`). The APK only contains engine code and extracts assets dynamically on boot.

---

### Prerequisites
* Meta Quest 3 or Quest 3S (shaders and performance tuned specifically for Quest 3 GPU).
* Clean uncompressed GameCube ISO (\`GZLP01.iso\` or \`GZLE01.iso\`). Compressed formats like \`.rvz\` or \`.ciso\` are not supported.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`WakerQuest-1.0.7.apk\` using SideQuest / ADB.
2. Transfer your uncompressed \`GZLP01.iso\` (or \`GZLE01.iso\`) into the Quest's \`/sdcard/Download/\` folder.
3. Launch **WakerQuest** from **Unknown Sources**.
4. Select your ISO using the in-game file picker on first launch.
5. Access the *Virtual Reality* panel in-game to switch between Diorama, Giant Screen, and Mixed Reality modes.

> [!TIP]
> When updating to future releases, always install over the existing app (\`adb install -r\`). Never uninstall the app first, or your save files and memory card data will be erased!`,
    troubleshooting_notes: 'Requires Meta Quest 3 or 3S. Make sure your ISO is an uncompressed .iso file placed in /sdcard/Download/. In tabletop diorama mode, hold both grip triggers simultaneously to scale and rotate the world.'
  },
  {
    id: '46',
    slug: 'ghost-squad-evolution-vr',
    title: 'Ghost Squad Evolution VR',
    developer: 'lialan',
    developer_url: 'https://github.com/lialan/lindbergh-recomp-ports',
    short_description: 'Sega\'s 2007 Lindbergh arcade light-gun shooter Ghost Squad Evolution, statically recompiled to native code and running standalone on Meta Quest in stereo VR. Tracked controller gun and a HUD on a floating screen. Nothing is emulated.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/ghost-squad-evolution-vr.png',
    youtube_video_id: 'zov4RGwmpf0',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/GhostSquadEvolution/',
    base_game_url: 'https://en.wikipedia.org/wiki/Ghost_Squad',
    base_game_store: 'Requires your own copy (Sega Lindbergh arcade game files)',
    port_download_url: 'https://github.com/lialan/lindbergh-recomp-ports/releases/download/v0.2.0/GhostSquadEvolutionVR-v0.2.0-quest3.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/lialan/lindbergh-recomp-ports',
    latest_version: 'v0.2.0',
    last_github_update: '2026-10-29T21:48:55Z',
    featured: false,
    installation_guide: `### Overview
**Ghost Squad Evolution VR** runs Sega's 2007 Lindbergh arcade light-gun shooter standalone on Meta Quest. The game's x86 Linux executable is statically recompiled to native code with the lindberghrecomp toolkit, so nothing is emulated. The world is in stereo around you, the gun is a tracked controller, and the HUD hangs on a screen in front of you.

Built by lialan on top of sp00nznet's Ghost Squad Evolution recompilation and lindberghrecomp toolkit.

> [!NOTE]
> **No game files included.** The APK holds the recompiled game code, the VR host and its libraries, but none of the game's files. You need your own copy of the arcade game. The app only runs the game version it was built from.

---

### Prerequisites
* Meta Quest 3, Quest 3S, or Quest Pro.
* Your own copy of the Ghost Squad Evolution \`vsg_l\` folder.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`GhostSquadEvolutionVR-v0.2.0-quest3.apk\` with SideQuest / \`adb install -r\`.
2. Copy the whole \`vsg_l\` folder to \`/sdcard/GhostSquadEvolution/vsg_l\`, so the executable ends up at \`/sdcard/GhostSquadEvolution/vsg_l/vsg\` (\`adb push vsg_l /sdcard/GhostSquadEvolution/\`).
3. Launch **Ghost Squad Evolution VR** from **Unknown Sources**.
4. The first time, the app opens the **All files access** screen. Allow it, then start the app again.

---

### Controls
* **Trigger** fires. **Grip** reloads, or fire while pointing off the screen.
* **A / X** is the action button. **B / Y** changes fire mode.
* A thumbstick click is Start. Coins are inserted automatically.
* The **left menu button** opens the settings panel: sights, laser, gun model, hand, screen distance, resolution, display rate, recentring, and Reset game.

> [!TIP]
> Updates install over the previous version and keep the game, settings and saves.`,
    troubleshooting_notes: 'If the game is missing or is a different version than the one this APK was built from, the app writes HOW-TO-ADD-THE-GAME.txt to Android/data/org.lindbergh.gse.vr/files/. The executable has to be at /sdcard/GhostSquadEvolution/vsg_l/vsg. If the app closes right after the first start, allow All files access and open it again.'
  },
  {
    id: '47',
    slug: 'hotd4-vr',
    title: 'The House of the Dead 4 VR',
    developer: 'lialan',
    developer_url: 'https://github.com/lialan/lindbergh-recomp-ports',
    short_description: 'Sega\'s 2005 Lindbergh arcade zombie light-gun shooter The House of the Dead 4, statically recompiled to native code and running standalone on Meta Quest in stereo VR. Tracked controller gun, nothing emulated.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/hotd4-vr.png',
    youtube_video_id: 'jBh8O0l8iug',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/HouseOfTheDead4/',
    base_game_url: 'https://en.wikipedia.org/wiki/The_House_of_the_Dead_4',
    base_game_store: 'Requires your own copy (Sega Lindbergh arcade game files)',
    port_download_url: 'https://github.com/lialan/lindbergh-recomp-ports/releases/download/v0.2.0/HouseOfTheDead4VR-v0.2.0-quest3.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/lialan/lindbergh-recomp-ports',
    latest_version: 'v0.2.0',
    last_github_update: '2026-10-29T21:48:55Z',
    featured: false,
    installation_guide: `### Overview
**The House of the Dead 4 VR** runs Sega's 2005 Lindbergh arcade zombie shooter standalone on Meta Quest. The game's x86 Linux executable is statically recompiled to native code with the lindberghrecomp toolkit, so nothing is emulated. The world is in stereo around you, the gun is a tracked controller, and the HUD hangs on a screen in front of you.

Built by lialan on top of sp00nznet's lindberghrecomp toolkit.

> [!NOTE]
> **No game files included.** The APK holds the recompiled game code, the VR host and its libraries, but none of the game's files. You need your own copy of the arcade game. The app only runs the game version it was built from.

---

### Prerequisites
* Meta Quest 3, Quest 3S, or Quest Pro.
* Your own copy of the game's \`elf\`, \`fs\` and \`drv\` folders.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`HouseOfTheDead4VR-v0.2.0-quest3.apk\` with SideQuest / \`adb install -r\`.
2. Copy the \`elf\`, \`fs\` and \`drv\` folders into \`/sdcard/HouseOfTheDead4/\`, so the executable ends up at \`/sdcard/HouseOfTheDead4/elf/hod4M.elf\` (\`adb push elf fs drv /sdcard/HouseOfTheDead4/\`).
3. Launch **The House of the Dead 4 VR** from **Unknown Sources**.
4. The first time, the app opens the **All files access** screen. Allow it, then start the app again.

---

### Controls
* **Trigger** fires. **Grip** reloads, or fire while pointing off the screen.
* A thumbstick click is Start. Coins are inserted automatically.
* The **left menu button** opens the settings panel: sights, laser, gun model, hand, screen distance, resolution, display rate, recentring, and Reset game.

> [!TIP]
> Updates install over the previous version and keep the game, settings and saves.`,
    troubleshooting_notes: 'If the game is missing or is a different version than the one this APK was built from, the app writes HOW-TO-ADD-THE-GAME.txt to Android/data/org.lindbergh.hotd4.vr/files/. The executable has to be at /sdcard/HouseOfTheDead4/elf/hod4M.elf. If the app closes right after the first start, allow All files access and open it again.'
  },
  {
    id: '48',
    slug: 'teraburst-vr',
    title: 'Teraburst VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/teraburst-vr',
    short_description: 'Konami\'s 1998 arcade alien-invasion light-gun shooter Teraburst in stereo VR, standalone on Meta Quest 3. Tracked guns, native 3D scenery, and two-player support.',
    category: 'emulator',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/teraburst-vr.jpg',
    youtube_video_id: '2MPzU1OBpZU',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Teraburst',
    base_game_store: 'Requires your own copy (Konami arcade set terabrst)',
    port_download_url: 'https://github.com/vr4all-standalone/teraburst-vr/releases/download/v0.1.2/teraburst-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/teraburst-vr',
    latest_version: 'v0.1.2',
    last_github_update: '2026-10-30T06:01:30Z',
    featured: false,
    installation_guide: `### Overview
**Teraburst VR** brings Konami's 1998 Hornet light-gun arcade game to Meta Quest 3 and 3S in stereo VR. MAME runs the original game while the OpenXR host rebuilds the scenery in native 3D, and your tracked controllers become the guns. Solo play and two-player play are both supported.

> [!NOTE]
> **No game files included.** Requires the Teraburst set, July 17, 1998 US UEL (MAME short name \`terabrst\`): the complete, validated \`terabrst.zip\`. No CHD and no separate BIOS are required. Renaming a \`.7z\` file to \`.zip\` will not work.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own complete \`terabrst.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`teraburst-vr-quest.apk\` from GitHub Releases.
2. Put your complete \`terabrst.zip\` into \`/sdcard/Download/\`. Keep it zipped.
3. Launch **Teraburst VR** from **Unknown Sources**, allow the requested file access, and keep both Touch controllers awake.
4. The setup screen checks the game-file sizes and hashes, then starts VR. The initial RTC warning is handled automatically.
5. Press **A** to add three credits and start P1. Press **X** to add three credits and request P2 after P1 has started.

---

### Controls
* **Trigger** fires. In solo play, a fresh trigger pull moves the gun to that hand.
* **A** is P1 Start. **X** requests P2.
* **B / Y** throws a bomb.
* **Left menu** opens the VR settings. **Left stick click** recenters. **Right stick click** toggles the laser.
* **Grip + stick** adjusts world size (vertical) or gun size (horizontal).

> [!TIP]
> An update installs over the previous version with the same signing identity and keeps game data, saves and preferences. Exit normally so the native clock and operator state are saved.`,
    troubleshooting_notes: 'The set must be the complete terabrst.zip (Teraburst, July 17, 1998, US UEL). A renamed .7z or a different region will fail the size and hash check on the setup screen. Keep both Touch controllers awake and allow the file access prompt.'
  },
  {
    id: '49',
    slug: 'carnevil-vr',
    title: 'CarnEvil VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/carnevil-vr',
    short_description: 'Midway\'s arcade horror light-gun game CarnEvil in VR, standalone on Meta Quest 3. Tracked lightguns, depth 3D scenery, and two-player support.',
    category: 'emulator',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/carnevil-vr.jpg',
    youtube_video_id: 'bqyUFgN5OUU',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/CarnEvil',
    base_game_store: 'Requires your own copy (Midway arcade set carnevil v1.0.3)',
    port_download_url: 'https://github.com/vr4all-standalone/carnevil-vr/releases/download/v0.1.4/carnevil-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/carnevil-vr',
    latest_version: 'v0.1.4',
    last_github_update: '2026-10-30T06:01:29Z',
    featured: false,
    installation_guide: `### Overview
**CarnEvil VR** brings Midway's arcade horror light-gun game to Meta Quest 3 and 3S. MAME runs the original game while the OpenXR host rebuilds its characters and scenery in stereo, and your tracked controllers become the lightguns. Depth 3D backgrounds are on by default, with the original look available in the VR menu.

> [!NOTE]
> **No game files included.** Requires the CarnEvil v1.0.3 set: \`carnevil.zip\` (containing \`carnevil1_9.u32\`, \`sound102.u95\` and \`486_carnevil.u96\`) and the matching CHD \`carnevil.chd\`. No NAOMI BIOS is required.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own \`carnevil.zip\` and \`carnevil/carnevil.chd\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`carnevil-vr-quest.apk\` from GitHub Releases.
2. Put the ROM zip at \`/sdcard/Download/carnevil.zip\`. Keep it packed.
3. Put the disc image at \`/sdcard/Download/carnevil/carnevil.chd\`.
4. Launch **CarnEvil VR** from **Unknown Sources**, grant file access on the setup screen, and keep the Touch controllers awake.
5. Start the game. The controller guide appears after the splash.

---

### Features
* Solo hand switching and two-player play with reversible P1 / P2 hand assignment.
* 3D strength and stereo separation controls, plus adjustable world size.
* Lasers aligned to the shot, recoil, muzzle flash, smoke, and adjustable haptics.
* Three reload modes, and Arcade or Zapper gun options.

> [!TIP]
> Updates install over the previous version. Settings, NVRAM and disk differences are kept by the app.`,
    troubleshooting_notes: 'The CHD must be the one matching CarnEvil v1.0.3 (overall SHA1 5cffb0de63ad36eb01c5951bab04d3f8a9e23e16). Do not unzip carnevil.zip. If the setup screen cannot find the files, check the two paths exactly: Download/carnevil.zip and Download/carnevil/carnevil.chd.'
  },
  {
    id: '50',
    slug: 'mystical-ninja-vr',
    title: 'Mystical Ninja VR',
    developer: 'VistaLargaGames',
    developer_url: 'https://github.com/VistaLargaGames',
    short_description: 'Mystical Ninja Starring Goemon (Nintendo 64) running natively on Meta Quest 3 at 60 FPS, built on Goemon 64: Recompiled. Head-tracked camera that follows Goemon, plus a first-person mode.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/mystical-ninja-vr.jpg',
    youtube_video_id: 'eY7IhAR5LqU',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Smooth Locomotion', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Mystical_Ninja_Starring_Goemon',
    base_game_store: 'Requires your own copy (Nintendo 64 cartridge ROM, USA)',
    port_download_url: 'https://github.com/VistaLargaGames/Mystical-Ninja-VR/releases/download/v0.1.20/MysticalNinjaVR-Quest-0.1.20.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/VistaLargaGames/Mystical-Ninja-VR',
    latest_version: 'v0.1.20',
    last_github_update: '2026-10-18T23:09:28Z',
    featured: false,
    installation_guide: `### Overview
**Mystical Ninja VR** is a standalone port of Goemon 64: Recompiled (Mystical Ninja Starring Goemon) that runs natively on Meta Quest 3. You look around with your head while the camera follows Goemon smoothly, or switch to a first-person camera and see the world through his eyes. It runs at 60 FPS in every level.

Built on Goemon 64: Recompiled by klorfmorf and contributors, N64Recomp, N64ModernRuntime and RT64.

> [!NOTE]
> **No game files included.** You must own the game. Use a ROM made from your own North American (USA) cartridge.

---

### Prerequisites
* Meta Quest 3.
* Your own USA ROM of Mystical Ninja Starring Goemon.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`MysticalNinjaVR-Quest-0.1.20.apk\` with SideQuest / ADB.
2. Put your ROM somewhere on the headset, for example \`/sdcard/Download/\`.
3. Launch **Mystical Ninja VR** from **Library > Unknown Sources**.
4. In the start window, choose your ROM. The game checks the file and remembers it. After that, just press **Play**.

---

### Controls
* **Left stick** moves, and walks where you look. **Left stick click** toggles first person.
* **A / B** jump and attack. **X / Y** change weapon and magic.
* **Left grip** opens the minimap. **Right grip** changes character.
* **Left trigger** camera control. **Right trigger** crawl.
* **Right stick** turns and sets camera distance. **Right stick click** puts the camera behind Goemon.
* **Menu** pauses.`,
    troubleshooting_notes: 'Use a North American (USA) ROM. The start window checks the file before it lets you play. The app is Quest 3 only.'
  },
  {
    id: '51',
    slug: 'sin-and-punishment-vr',
    title: 'Sin & Punishment VR',
    developer: 'VistaLargaGames',
    developer_url: 'https://github.com/VistaLargaGames',
    short_description: 'Treasure\'s N64 rail shooter Sin and Punishment running natively on Meta Quest 3. Point-and-shoot aiming, a wide head-tracked view in the stages, 60 fps, and HD texture pack support.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/sin-and-punishment-vr.png',
    youtube_video_id: '3sfdxeGjyqg',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Sin_and_Punishment',
    base_game_store: 'Requires your own copy (Nintendo 64 cartridge ROM)',
    port_download_url: 'https://github.com/VistaLargaGames/Sin-and-Punishment-Quest-VR/releases/download/v0.1.0/Sin-and-Punishment-VR-0.1.0.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/VistaLargaGames/Sin-and-Punishment-Quest-VR',
    latest_version: 'v0.1.0',
    last_github_update: '2026-10-29T21:36:18Z',
    featured: false,
    installation_guide: `### Overview
**Sin & Punishment VR** runs Treasure's N64 rail shooter *Sin and Punishment* (*Tsumi to Batsu: Hoshi no Keishousha*) natively on Meta Quest 3 as recompiled code, not an emulator. Point your right controller at the enemies, pull the trigger, and look around the stage with your head. The game is drawn about 120 x 104 degrees wide, at 60 fps, with a small, crisp HUD.

> [!NOTE]
> **No game files included.** Unofficial fan project. You need your own ROM (\`.z64\`, \`.n64\` or \`.v64\`). Japanese ROMs and the English fan translation both work.

---

### Prerequisites
* Meta Quest 3.
* Your own Sin and Punishment ROM.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`Sin-and-Punishment-VR-0.1.0.apk\` with SideQuest / ADB.
2. Put your ROM on the headset, for example in \`/sdcard/Download/\`.
3. Launch **Sin and Punishment VR** from **Unknown Sources**.
4. In the ROM window choose **Choose ROM file** and pick your ROM. It is copied into the app once. After that the window shows **Play**.

---

### Controls
* **Aim** by pointing the right controller. **Right trigger** fires.
* **Right A** (or either grip) jumps. **Left stick** moves.
* **Right stick** picks a lock-on target.
* **Left menu** starts and pauses. **Right stick click** recenters the view.
* Menus and cutscenes show on a large floating screen. Stages switch to the full surround view.

---

### HD textures
Copy a Rice-format texture pack folder (the same packs N64 emulators use in \`hires_texture\`) into \`Android/data/com.sinandpunishment.recompiled/files/snprecomp/texture_packs/\`, then start the game.`,
    troubleshooting_notes: 'If the ROM window rejects your file, check that it is a .z64, .n64 or .v64 of Sin and Punishment (Japanese, or the English fan translation). The app is Quest 3 only. This is the first release, so expect rough edges.'
  },
  {
    id: '52',
    slug: 'gran-turismo-3-vr',
    title: 'Gran Turismo 3 VR (GT3 Revisited)',
    developer: 'matt-pulsipher',
    developer_url: 'https://github.com/matt-pulsipher',
    short_description: 'An open-source reimplementation of the Gran Turismo 3 A-Spec engine with a native Meta Quest build. GT Mode, Arcade and licenses run from your own disc image, with the menus on a large virtual screen and races in stereo from the driver\'s seat.',
    category: 'engine_recreation',
    status: 'playable_beta',
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/gran-turismo-3-vr.png',
    youtube_video_id: 'UQzIiN9SwvE',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['VR Steering Wheel', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Gran_Turismo_3:_A-Spec',
    base_game_store: 'Requires your own copy (PlayStation 2 disc image, .iso)',
    port_download_url: 'https://github.com/matt-pulsipher/GT3-revisited/releases/download/v0.4.2/gt3r-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/matt-pulsipher/GT3-revisited',
    latest_version: 'v0.4.2',
    last_github_update: '2026-10-30T23:20:20Z',
    featured: false,
    installation_guide: `### Overview
**GT3 Revisited** is an open-source reimplementation of the *Gran Turismo 3 A-Spec* engine. It reads your own disc image at runtime and decodes the game's data directly, so nothing is extracted or redistributed. The Quest build shows the menus on a large virtual screen and puts you in the driver's seat for races, in stereo, with Touch controllers (sticks and analog triggers, or grab a steering wheel).

GT Mode, Arcade, licenses, 2P battle, Replay Theater and Options are all there. The project reports the whole game as playable.

> [!NOTE]
> **No game files included.** You need an \`.iso\` image made from your own copy of Gran Turismo 3 A-Spec. The NTSC-U releases (SCUS-97102 and the PBPX-95503 bundle disc) are verified. Other regions are untested. Only \`.iso\` images are accepted.

---

### Prerequisites
* Meta Quest 3. The project verified it on Quest 3 only. Quest 2, 3S and Pro are untested.
* An \`.iso\` image of your own Gran Turismo 3 A-Spec disc.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts, or install \`gt3r-quest.apk\` with SideQuest / ADB. The release also has \`gt3r-android.apk\`, which is the phone build. Use the Quest one.
2. Copy your disc image into the headset's \`Download\` folder over USB.
3. Launch **GT3 Revisited** from **Library > Unknown Sources**.
4. Choose **Open disc image** and pick your \`.iso\`. The path is remembered, along with your last five discs.

---

### Good to know
* Saves in the PS2 \`BASCUS-97102GAMEDATA\` format can be imported with the project's \`gt3tool\` on a PC.
* Mods go in the app's \`mods/\` folder. The Mods screen has an **Open folder** button.`,
    troubleshooting_notes: 'If the disc is not accepted, check that it is an .iso of Gran Turismo 3 A-Spec (NTSC-U is the verified region). If the remembered disc stops working, open the disc picker and choose it again. Quest 3 is the only verified headset.'
  },
  {
    id: '53',
    slug: 'wwf-no-mercy-vr',
    title: 'WWF No Mercy VR',
    developer: 'VistaLargaGames',
    developer_url: 'https://github.com/VistaLargaGames',
    short_description: 'The N64 wrestling classic WWF No Mercy, recompiled to run natively on Meta Quest 3. 60 fps, an immersive camera, and online matches for two to four players, each on their own Quest 3.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/wwf-no-mercy-vr.png',
    youtube_video_id: 'tFMdpnK-bg8',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/WWF_No_Mercy',
    base_game_store: 'Requires your own copy (Nintendo 64 cartridge ROM, North American Rev 1)',
    port_download_url: 'https://github.com/VistaLargaGames/WWF-No-Mercy-Quest-3-Standalone-/releases/download/n64/WWFNoMercyVR-Quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/VistaLargaGames/WWF-No-Mercy-Quest-3-Standalone-',
    latest_version: 'v0.1.20',
    last_github_update: '2026-10-17T05:13:00Z',
    featured: false,
    installation_guide: `### Overview
**WWF No Mercy VR** runs the N64 wrestling game natively on Meta Quest 3 as recompiled code, not an emulator. It is built on No Mercy Recompiled, N64Recomp and RT64. Matches run at 60 fps with an immersive camera.

Version 0.1.20 adds **online matches for 2, 3 or 4 players**, each on their own Quest 3. Everyone needs the same version and their own ROM. One player presses **Host (get a code)** on the start screen and shares the 4-digit code. The others press **Join (enter a code)**. The host presses **Start match** when everyone is in. A relay built into the app connects you, so there is nothing to set up.

> [!NOTE]
> **No game files included.** Unofficial fan project, not affiliated with Nintendo, Meta or WWE. You need your own North American (USA) **Rev 1 / "Rev A"** ROM of WWF No Mercy.

---

### Prerequisites
* Meta Quest 3.
* Your own North American Rev 1 / Rev A ROM of WWF No Mercy.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`WWFNoMercyVR-Quest.apk\` with SideQuest / ADB.
2. Put your ROM on the headset, for example in \`/sdcard/Download/\`.
3. Launch **WWF No Mercy VR** from **Library > Unknown Sources**.
4. In the main menu, provide your ROM. The game loads its assets from it, so there is no separate extraction step.

Updates install over the previous version and keep your saves.

---

### Controls
* **Left stick** moves your wrestler. **Right stick** is the taunt stick.
* **A** grapple. **B** strike. **X** switches who you are focused on. **Y** flips a downed wrestler or grabs a weapon.
* **Left trigger** block. **Right trigger** steps in or out of the ring (it needs a full pull).
* **Left grip** evade, and pin when you are at their head. **Right grip** run.
* **Click either stick** to switch that wrestler between you and the CPU.
* **Left menu** pauses. **Meta button** re-centers your view.`,
    troubleshooting_notes: 'Use the North American (USA) Rev 1 / Rev A ROM. Other versions are not supported. Known bug: the screen can stretch or the camera can snap now and then. If an online match reports that the games went out of step, everyone quits and starts a new match. The release tag is named n64 and the APK filename has no version, so the version shown here comes from the app itself.'
  },
  {
    id: '54',
    slug: 'opentie-vr',
    title: 'OpenTIE VR (Star Wars: TIE Fighter)',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76',
    short_description: 'Star Wars: TIE Fighter running natively on Meta Quest 3, built on the open-source OpenTIE engine. Head-tracked stereo space combat, 3D cockpits for every TIE craft, and Touch controllers as a flight gamepad.',
    category: 'engine_recreation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/opentie-vr.jpg',
    youtube_video_id: 'IYks9ZfupZ0',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/OpenTIE/',
    base_game_url: 'https://store.steampowered.com/app/355250/STAR_WARS_TIE_Fighter_Special_Edition/',
    base_game_store: 'Requires your own copy (Steam: Star Wars TIE Fighter Special Edition)',
    port_download_url: 'https://github.com/SgtBilko76/OpenTIE-VR/releases/download/v0.1.8-beta/OpenTIE-VR-v0.1.8-beta.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/OpenTIE-VR',
    latest_version: 'v0.1.8-beta',
    last_github_update: '2026-10-28T15:46:36Z',
    featured: false,
    installation_guide: `### Overview
**OpenTIE VR** runs *Star Wars: TIE Fighter* natively on Meta Quest 3. It is built on the open-source OpenTIE engine with OpenXR and Vulkan. Menus, briefings and cutscenes play on a large virtual screen. In flight you get head-tracked stereo 3D space at 72 Hz and 3D cockpits for every TIE craft, with the original live instruments mounted around you.

The Touch controllers act as a gamepad (remappable in Settings > Controller), and both grips open radial menus for weapons, power, targets and orders.

> [!NOTE]
> **No game files included.** You need your own copy of TIE Fighter from Steam. This is a beta and it was tested on Quest 3 only. The APK is signed with a debug key.

---

### Prerequisites
* Meta Quest 3.
* *Star Wars: TIE Fighter Special Edition* from Steam, on a PC.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`OpenTIE-VR-v0.1.8-beta.apk\` with SideQuest / ADB.
2. From your Steam folder \`STAR WARS Tie Fighter\`, copy \`collectors_cd\` to \`/sdcard/OpenTIE/TIE95\` and \`remastered\` to \`/sdcard/OpenTIE/TIE98\` on the Quest.
3. Launch **OpenTIE VR** from **Library > Unknown Sources** and allow "access to all files" when asked.

**Optional, TIE Defender and Missile Boat 3D cockpits:** if you own *Star Wars: X-Wing Alliance*, copy its game folder to \`/sdcard/OpenXWA\` (the folder OpenXWA VR uses), or copy just \`FLIGHTMODELS/TIECOCKPIT.OPT\` to \`/sdcard/OpenTIE/\`. Without it those craft use the TIE ball cockpit.

---

### Controls
* **Left stick** pitch and yaw. **Right stick left/right** roll. **Right stick up/down** throttle lever (it stays where you leave it).
* **Right trigger** fire. **Left trigger** target. **A / B** next target or nearest fighter. **X / Y** target my attacker or match target speed.
* **Left stick click** back to the cockpit view. **Right stick click** hyperspace.
* **Hold left grip** for the weapons and power radial menu. **Hold right grip** for targets and orders. Tilt the same hand's stick toward a command and release the grip to run it.
* **Left Menu** opens the OpenTIE menu and pauses the game.
* To re-center, hold the Meta button on the right controller, or hold the left Menu button for one second.
* In menus, the laser comes from the left controller: trigger clicks, grip right-clicks, X is Enter and Y is Space. Clicking a text field opens an on-screen keyboard.`,
    troubleshooting_notes: 'The game folders have to be exactly /sdcard/OpenTIE/TIE95 (collectors_cd) and /sdcard/OpenTIE/TIE98 (remastered). If the app asks for file access, allow "access to all files". Motion blur, temporal upscaling and ambient occlusion are off in stereo. This is a beta tested on Quest 3 only.'
  },
  {
    id: '55',
    slug: 'daggerfall-unity-vr',
    title: 'Daggerfall Unity VR (Quest 3)',
    developer: 'rwcrosk-arch',
    developer_url: 'https://github.com/rwcrosk-arch',
    short_description: 'A Daggerfall Unity fork that brings The Elder Scrolls II: Daggerfall to Meta Quest 3 as a native room-scale VR game. Create a character, fight, cast spells, explore and save, with menus floating in your play space.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/daggerfall-unity-vr.png',
    youtube_video_id: 'artpN5o2vKc',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Smooth Locomotion', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.dfworkshop.dfuquest3/files/Daggerfall/arena2/',
    base_game_url: 'https://store.steampowered.com/app/1812390/The_Elder_Scrolls_II_Daggerfall/',
    base_game_store: 'Requires your own copy (Steam or GOG, the classic DOS game data)',
    port_download_url: 'https://github.com/rwcrosk-arch/dfu-quest3/releases/download/v0.1.0-beta3/DFU-Quest3VR-beta3.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/rwcrosk-arch/dfu-quest3',
    latest_version: 'v0.1.0-beta3',
    last_github_update: '2026-10-02T15:27:21Z',
    featured: false,
    installation_guide: `### Overview
**Daggerfall Unity VR** is a fork of Daggerfall Unity (the open-source engine that runs the 1996 classic) re-targeted for Meta Quest 3. It is not VR layered over an emulator: it is the real engine compiled for Android ARM64 with OpenXR. You get head tracking in a room-scale rig, menus on a floating panel about 2 m ahead with a pointing ray, a world-space keyboard for names, melee and spell casting, and save and load.

The beta build is playable end to end: create a character, fight, explore, save and load. Beta 3 adds true dual wield (each hand uses its own weapon skill and enchantments) and a guard window for shields.

> [!NOTE]
> **No game data included.** You need the classic DOS Daggerfall data (the \`arena2\` folder, about 500 MB). It is free on Steam and also available on GOG. This is a beta: expect rough edges and performance dips in dense areas. Beta 3 is a dev-config build.

---

### Prerequisites
* Meta Quest 3 in developer mode.
* The \`arena2\` folder from a Daggerfall install (\`.BSA\` and \`.SND\` files).
* A PC with \`adb\` (Android platform-tools) and a USB cable.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`DFU-Quest3VR-beta3.apk\` with SideQuest / ADB.
2. Push the game data to the app's own storage folder. Scoped storage only lets the app read its own directory, so this has to be done with \`adb\`:
   \`adb push <path-to-your>/Daggerfall/arena2 /storage/emulated/0/Android/data/com.dfworkshop.dfuquest3/files/Daggerfall/arena2\`
3. Launch **Daggerfall Unity VR** from **Library > Unknown Sources** and grant any storage permission it asks for.
4. The **settings screen** opens first. Leave the defaults, then press **Done**. The New Game / Load Game menu appears in the world.

**One setting matters:** \`settings.ini\` is created on first run in \`/storage/emulated/0/Android/data/com.dfworkshop.dfuquest3/files/\`. Keep \`AntialiasingMethod=0\`. Temporal antialiasing breaks the per-eye history under OpenXR multi-pass and corrupts stereo.

---

### Controls
* **Left stick** move. **Right stick** turn (X) and pitch (Y). **Right trigger** activate / click.
* **Right grip** attack. **Left grip** attack with a left-hand weapon, or guard with a shield or empty hand.
* **A** sheathe / unsheathe. **B** magic menu. **X (hold)** jump. **Y** menu cycle.
* **Left trigger** cast / recast. **Left stick click** crouch. **Right stick click** toggle run.
* **Menu** is context: back, or the pause options.`,
    troubleshooting_notes: 'If the game starts but the world is empty, the arena2 folder is not where the app looks: it has to be at Android/data/com.dfworkshop.dfuquest3/files/Daggerfall/arena2. If the picture looks broken in stereo, set AntialiasingMethod=0 in settings.ini. The start menu can show a faint mirror of the menu in the background, which is cosmetic. The UI render target grows over long sessions, so restart the app after long play.'
  },
  {
    id: '56',
    slug: 'virtua-cop-2-vr',
    title: 'Virtua Cop 2 VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/vcop2-vr',
    short_description: 'Sega\'s 1995 Model 2A arcade light-gun game Virtua Cop 2 in stereo VR, standalone on Meta Quest. Tracked guns, dual wielding, and Game zoom.',
    category: 'emulator',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/virtua-cop-2-vr.png',
    youtube_video_id: 'Wd_cD4H6gsE',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Virtua_Cop_2',
    base_game_store: 'Requires your own copy (Sega Model 2A arcade set vcop2)',
    port_download_url: 'https://github.com/vr4all-standalone/vcop2-vr/releases/download/v0.2.14/vcop2-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/vcop2-vr',
    latest_version: 'v0.2.14',
    last_github_update: '2026-10-31T03:15:58Z',
    featured: false,
    installation_guide: `### Overview
**Virtua Cop 2 VR** is an experimental port of Sega's Model 2A arcade game for Meta Quest 3 and 3S. A patched MAME engine runs the original game while the VR host adds stereo views, head tracking and tracked guns. The scenery, actors, audio and rules come from your own game data.

> [!NOTE]
> **No game files included.** You need \`vcop2.zip\` and the billboard firmware \`segabill.zip\`, or a single \`vcop2.zip\` that holds all 31 required payloads. No CHD is required.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own \`vcop2.zip\` and \`segabill.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`vcop2-vr-quest.apk\` from GitHub Releases.
2. Put \`vcop2.zip\` and \`segabill.zip\` into \`/sdcard/Download/\`. Keep them packed.
3. Launch **Virtua Cop 2 VR** from **Unknown Sources** and allow game-file access when asked.
4. The app checks the files and enters VR automatically when they pass.

---

### Controls
* **A** starts or continues Player 1. **X** joins Player 2.
* **Triggers** fire. **B / Y** reloads.
* **Menu** opens the settings panel (gun, laser, haptics, world size, Game zoom).
* Tap either **grip** to toggle Game zoom.

> [!TIP]
> This is an early release. Settings and NVRAM are kept when you update.`,
    troubleshooting_notes: 'Setup checks the size, CRC32 and SHA1 of every payload. Use a complete vcop2.zip, with segabill.zip beside it unless it is already inside, and keep both zipped. If the app cannot find them, check that they sit directly in /sdcard/Download/ and that file access was allowed.'
  },
  {
    id: '57',
    slug: 'gunblade-ny-vr',
    title: 'Gunblade NY VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/gunblade-ny-vr',
    short_description: 'Sega\'s Model 2B helicopter light-gun game Gunblade NY in stereo VR, standalone on Meta Quest. Tracked guns, automatic-fire trigger, and two-player inputs.',
    category: 'emulator',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/gunblade-ny-vr.png',
    youtube_video_id: 'jOfONbACBTA',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Gunblade_NY',
    base_game_store: 'Requires your own copy (Sega Model 2B arcade set, Revision A)',
    port_download_url: 'https://github.com/vr4all-standalone/gunblade-ny-vr/releases/download/v0.1.0-beta/gunblade-ny-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/gunblade-ny-vr',
    latest_version: 'v0.1.0-beta',
    last_github_update: '2026-10-31T03:16:24Z',
    featured: false,
    installation_guide: `### Overview
**Gunblade NY VR** brings Sega's helicopter light-gun game to Meta Quest 3 and 3S in stereo VR with head tracking and tracked guns. It is a public beta. The original game's scenery, audio and rules come from your own game data.

> [!NOTE]
> **No game files included.** You need the Revision A set: \`gunblade.zip\` with all 18 required payloads. A split set may also need \`segabill.zip\` in the same folder. No CHD is required.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own Gunblade NY Revision A \`gunblade.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`gunblade-ny-vr-quest.apk\` from GitHub Releases.
2. Put \`gunblade.zip\` (and \`segabill.zip\` if your set is split) into \`/sdcard/Download/\`. Keep them packed.
3. Open **Gunblade NY - VR4ALL** from **Unknown Sources** and finish the ROM check on the setup screen.
4. Play. The original automatic-fire trigger and two-player cabinet inputs are supported.

> [!TIP]
> Quest 3S play has been observed. Quest 3 is still being checked, some heavy scenes run below full arcade speed, and audio can sound rough.`,
    troubleshooting_notes: 'The app checks the size, CRC32 and SHA1 of the files. Use the complete Revision A gunblade.zip and keep it zipped. If the setup screen cannot find it, check that it sits directly in /sdcard/Download/.'
  },
  {
    id: '58',
    slug: 'behind-enemy-lines-vr',
    title: 'Behind Enemy Lines VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/behind-enemy-lines-vr',
    short_description: 'Sega\'s Model 2C combat light-gun game Behind Enemy Lines in stereo VR, standalone on Meta Quest. Tracked guns with adjustable reticle and HUD.',
    category: 'emulator',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/behind-enemy-lines-vr.jpg',
    youtube_video_id: 'k_YhddRrvDU',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Behind_Enemy_Lines_(video_game)',
    base_game_store: 'Requires your own copy (Sega Model 2C arcade set bel)',
    port_download_url: 'https://github.com/vr4all-standalone/behind-enemy-lines-vr/releases/download/v0.1.1-beta/behind-enemy-lines-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/behind-enemy-lines-vr',
    latest_version: 'v0.1.1-beta',
    last_github_update: '2026-10-31T03:17:02Z',
    featured: false,
    installation_guide: `### Overview
**Behind Enemy Lines VR** adapts Sega's Model 2C combat gun game for Meta Quest 3 and 3S in stereo VR with head tracking and tracked guns. It is a public beta. The mission, scenery, audio and cabinet rules come from your own game data.

> [!NOTE]
> **No game files included.** You need \`bel.zip\` with all 31 verified original payloads. No separate billboard firmware or CHD is required.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own \`bel.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`behind-enemy-lines-vr-quest.apk\` from GitHub Releases.
2. Put \`bel.zip\` into \`/sdcard/Download/\`. Keep it packed.
3. Open **Behind Enemy Lines - VR4ALL** from **Unknown Sources** and finish the ROM check on the setup screen.
4. Play. Player hands, view, HUD and reticle size are in the settings.

> [!TIP]
> Quest 3S play has been observed on an earlier build. The latest defaults and the full game routes are still being checked.`,
    troubleshooting_notes: 'The app checks the size and checksum of every payload, so use the complete bel.zip and keep it zipped. If the setup screen cannot find it, check that it sits directly in /sdcard/Download/.'
  },
  {
    id: '59',
    slug: 'rail-chase-2-vr',
    title: 'Rail Chase 2 VR',
    developer: 'vr4all-standalone',
    developer_url: 'https://github.com/vr4all-standalone/rail-chase-2-vr',
    short_description: 'Sega\'s ride-on rail shooter Rail Chase 2 in stereo VR, standalone on Meta Quest. Tracked guns, both native player inputs, and a custom reticle.',
    category: 'emulator',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/rail-chase-2-vr.png',
    youtube_video_id: 'mHj4Gr_SY7Q',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Rail_Chase_2',
    base_game_store: 'Requires your own copy (Sega arcade set, Revision A)',
    port_download_url: 'https://github.com/vr4all-standalone/rail-chase-2-vr/releases/download/v0.1.0-beta/rail-chase-2-vr-quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/vr4all-standalone/rail-chase-2-vr',
    latest_version: 'v0.1.0-beta',
    last_github_update: '2026-10-31T03:17:21Z',
    featured: false,
    installation_guide: `### Overview
**Rail Chase 2 VR** brings Sega's ride-on rail shooter to Meta Quest 3 and 3S in stereo VR with head tracking and tracked guns. It is a public beta. The routes, audio and cabinet logic come from your own game data.

> [!NOTE]
> **No game files included.** You need the Revision A \`rchase2.zip\` with all 23 required payloads. Older 21-file sets are incomplete. If the files are split, also provide \`segabill.zip\`. No CHD is required.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own Rail Chase 2 Revision A \`rchase2.zip\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`rail-chase-2-vr-quest.apk\` from GitHub Releases.
2. Put \`rchase2.zip\` (and \`segabill.zip\` if your set is split) into \`/sdcard/Download/\`. Keep them packed.
3. Open **Rail Chase 2 - VR4ALL** from **Unknown Sources** and finish the ROM check on the setup screen.
4. Play. Both native player inputs and the VR4ALL settings menu are available.

> [!TIP]
> Quest 3S play has been observed. The measured scene runs at about 82 to 90% of full speed, and longer routes and Quest 3 are still unverified.`,
    troubleshooting_notes: 'Use the complete Revision A rchase2.zip with all 23 payloads; older 21-file sets are rejected. Keep it zipped. If the setup screen cannot find it, check that it sits directly in /sdcard/Download/.'
  },
  {
    id: '60',
    slug: 'ratchet-and-clank-vr',
    title: 'Ratchet & Clank VR',
    developer: 'moistman42069',
    developer_url: 'https://github.com/moistman42069/RatchetAndClank-Quest-VR',
    short_description: 'Insomniac\'s 2002 PS2 platformer Ratchet & Clank running natively on Meta Quest through OpenRAC, with Rerac-vr\'s first-person VR design. Bring your own disc.',
    category: 'decompilation',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/ratchet-and-clank-vr.jpg',
    youtube_video_id: 'i4qKMyzYV3Q',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Smooth Locomotion', 'Smooth Turn', 'Snap Turn', 'Third-Person Mode'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Ratchet_%26_Clank_(2002_video_game)',
    base_game_store: 'Requires your own copy (PS2 disc image, PAL SCES-50916 or NTSC-U SCUS-97199)',
    port_download_url: 'https://github.com/moistman42069/RatchetAndClank-Quest-VR/releases/download/v0.1.6/RatchetQuestVR-0.1.6.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/moistman42069/RatchetAndClank-Quest-VR',
    latest_version: 'v0.1.6',
    last_github_update: '2026-11-02T09:35:07Z',
    featured: false,
    installation_guide: `### Overview
**Ratchet & Clank VR** brings Insomniac's 2002 PlayStation 2 game to standalone Meta Quest. It runs OpenRAC's native recompiled port, not an emulator, with a VR mod that rebuilds npiriou's Rerac-vr (the PC VR mod) on the headset: first person through Ratchet's eyes, the weapon in your hand, real wrench swings, and reach-to-select weapons. A third-person mode and a 2D test mode are in the launcher.

> [!NOTE]
> **No game files included.** You need your own \`.iso\` of one of these discs: PAL (Europe) SCES-50916 v2.00, the best supported, or NTSC-U (North America) SCUS-97199 v1.00. Greatest Hits, Platinum, other regions and the sequels are refused.

---

### Prerequisites
* Meta Quest 3 or Quest 3S (Quest 2 and Quest Pro are untested).
* Your own Ratchet & Clank \`.iso\` (PAL or NTSC-U, see above).
* About 6 GB free on the headset.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`RatchetQuestVR-0.1.6.apk\` from GitHub Releases.
2. Put your \`.iso\` in \`/sdcard/Download/\` (any folder the file picker can see works).
3. Open **Ratchet & Clank Quest VR** from **Unknown Sources** and choose the disc image in the launcher.
4. The first set-up copies the disc and prepares the levels. It can take up to half an hour, once. Keep the headset on charge.
5. Press **PLAY IN VR**.

---

### Controls
* **Left stick** walks towards where you look. **Right stick** turns (smooth by default, snap in the VR tab).
* **A** jumps, **B** hovers with Clank's packs, **X** opens the map, **Y** pauses.
* **Right trigger** fires. **Right grip** takes the wrench out: swing your hand to hit.
* Hold the **right stick click** and move your hand towards a weapon for quick select.

> [!TIP]
> This is an early test build: walking and the first level have been played on a Quest 3, most of the game has not. The launcher updates itself from GitHub. Install updates over the old version and do not clear the app's data, or the set-up and saves are lost.`,
    troubleshooting_notes: 'The launcher checks the disc and says why one is refused: use the PAL SCES-50916 or NTSC-U SCUS-97199 .iso, not Greatest Hits or Platinum. Each run writes a log to Download/RatchetQuestVR, and the launcher\'s Logs tab shows the last one. Open the launcher again after playing so it writes the log.'
  },
  {
    id: '61',
    slug: 'forsaken-vr',
    title: 'Forsaken VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/Forsaken-VR',
    short_description: 'Acclaim\'s 1998 six-degrees-of-freedom hover-bike shooter Forsaken in stereo VR on Meta Quest, from the ForsakenX source port. Game data is inside the APK.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'direct',
    cover_image_url: '/covers/forsaken-vr.jpg',
    youtube_video_id: 'CqllMMsXv8c',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Seated Cockpit', '6DoF Ship Flight (sticks)'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (game data bundled in the release APK)',
    base_game_url: 'https://store.steampowered.com/app/668980/Forsaken_Remastered/',
    base_game_store: 'Included (game data distributed by the ForsakenX community)',
    port_download_url: 'https://github.com/SgtBilko76/Forsaken-VR/releases/download/v0.1.2/Forsaken-VR-v0.1.2-full.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/Forsaken-VR',
    latest_version: 'v0.1.2',
    last_github_update: '2026-10-31T16:41:20Z',
    featured: false,
    installation_guide: `### Overview
**Forsaken VR** is a native OpenXR port of Forsaken (Probe Entertainment / Acclaim, 1998) for Meta Quest 3, built by SgtBilko76 on the ForsakenX community source port. You fly a hover-bike through tunnels in full six degrees of freedom, in stereo 3D, with Touch controls. v0.1.2 adds the Forsaken soundtrack, one track per level.

> [!NOTE]
> **Nothing else to copy.** This is the full APK with the game data built in (about 752 MB). There is no ROM or game-file step.

---

### Prerequisites
* Meta Quest 3 (other headsets are not listed by the release).
* About 1 GB free on the headset.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`Forsaken-VR-v0.1.2-full.apk\` from GitHub Releases. It is a large download.
2. Launch **Forsaken VR** from **Unknown Sources**.
3. Play.

> [!TIP]
> Six-degrees-of-freedom flight can be hard on the stomach. Play seated and take breaks if you are new to it.`,
    troubleshooting_notes: 'The APK is about 752 MB, so the download takes a while and needs about 1 GB free. If the install fails, free space and try again. Report bugs on the Forsaken-VR GitHub repository.'
  },
  {
    id: '62',
    slug: 'lets-go-jungle-vr',
    title: 'Let\'s Go Jungle! VR',
    developer: 'lialan',
    developer_url: 'https://github.com/lialan/lindbergh-recomp-ports',
    short_description: 'Sega\'s 2006 Lindbergh jeep light-gun game Let\'s Go Jungle! Lost on the Island of Spice, statically recompiled and running standalone on Meta Quest in stereo VR. Experimental.',
    category: 'decompilation',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/lets-go-jungle-vr.jpg',
    youtube_video_id: 'Tlf1P1Twl1Q',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/LetsGoJungle/',
    base_game_url: 'https://en.wikipedia.org/wiki/Let%27s_Go_Jungle!:_Lost_on_the_Island_of_Spice',
    base_game_store: 'Requires your own copy (Sega Lindbergh arcade game files)',
    port_download_url: 'https://github.com/lialan/lindbergh-recomp-ports/releases/download/v0.2.7/LetsGoJungleVR-v0.2.7-quest3.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/lialan/lindbergh-recomp-ports',
    latest_version: 'v0.2.7',
    last_github_update: '2026-10-31T17:41:34Z',
    featured: false,
    installation_guide: `### Overview
**Let's Go Jungle! VR** runs Sega's 2006 Lindbergh arcade game (the original, not *Special*) standalone on Meta Quest. The game's x86 Linux executable is statically recompiled to native code with the lindberghrecomp toolkit, so nothing is emulated. The jungle is in stereo around you, the gun is a tracked controller, and the HUD hangs on a screen in front of you.

Built by lialan on the same runtime as Ghost Squad Evolution VR and The House of the Dead 4 VR.

> [!NOTE]
> **No game files included.** You need your own copy of the arcade game: \`lgj_final\` and its \`data\`, \`shader\` and \`extraShader\` folders (about 1 GB). The app only runs the \`lgj_final\` it was built from.

---

### Prerequisites
* Meta Quest 3, Quest 3S, or Quest Pro.
* Your own \`lgj_final\`, \`data\`, \`shader\` and \`extraShader\`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`LetsGoJungleVR-v0.2.7-quest3.apk\` with SideQuest / \`adb install -r\`.
2. Copy \`lgj_final\` and the \`data\`, \`shader\` and \`extraShader\` folders into \`/sdcard/LetsGoJungle/\` (\`adb push lgj_final data shader extraShader /sdcard/LetsGoJungle/\`).
3. Launch **Let's Go Jungle VR** from **Unknown Sources**.
4. The first time, the app opens the **All files access** screen. Allow it, then start the app again.

---

### Controls
* Point and pull the **trigger** to fire, with either hand. The jungle guns never need reloading.
* A thumbstick click is Start. Coins are inserted automatically.
* The **left menu button** opens the settings panel, with Reset game.

> [!TIP]
> Experimental release: it plays from attract mode through the first stage at 60 fps on a Quest 3, and is still a bit buggy. Updates install over the previous version and keep the game, settings and saves.`,
    troubleshooting_notes: 'If the game is missing or is a different version than the one this APK was built from, the app writes HOW-TO-ADD-THE-GAME.txt to Android/data/org.lindbergh.lgj.vr/files/. lgj_final has to be at /sdcard/LetsGoJungle/lgj_final. The log of the last run is /sdcard/LetsGoJungle/lgj.log. If the app closes right after the first start, allow All files access and open it again.'
  },
  {
    id: '63',
    slug: 'hotd4-special-vr',
    title: 'The House of the Dead 4 Special VR',
    developer: 'lialan',
    developer_url: 'https://github.com/lialan/lindbergh-recomp-ports',
    short_description: 'Sega\'s 2006 ride-cabinet edition The House of the Dead 4 Special, statically recompiled and running standalone on Meta Quest in stereo VR. Tracked controller gun, path choices included.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/hotd4-special-vr.jpg',
    youtube_video_id: '9MDLHrvqX3M',
    supported_hardware: ['Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/HouseOfTheDead4Special/',
    base_game_url: 'https://en.wikipedia.org/wiki/The_House_of_the_Dead_4',
    base_game_store: 'Requires your own copy (Sega Lindbergh arcade game files)',
    port_download_url: 'https://github.com/lialan/lindbergh-recomp-ports/releases/download/v0.2.7/HouseOfTheDead4SpecialVR-v0.2.7-quest3.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/lialan/lindbergh-recomp-ports',
    latest_version: 'v0.2.7',
    last_github_update: '2026-10-31T17:41:34Z',
    featured: false,
    installation_guide: `### Overview
**The House of the Dead 4 Special VR** runs the 2006 ride-cabinet version of Sega's Lindbergh zombie shooter standalone on Meta Quest. It is a different game from The House of the Dead 4, with its own stages and its own APK. The x86 Linux executable is statically recompiled to native code with the lindberghrecomp toolkit, so nothing is emulated. The world is in stereo around you and the gun is a tracked controller.

> [!NOTE]
> **No game files included.** You need your own copy of the game's \`elf\` and \`fs\` folders. The app only runs the \`hod4M.elf\` it was built from.

---

### Prerequisites
* Meta Quest 3, Quest 3S, or Quest Pro.
* Your own House of the Dead 4 Special \`elf\` and \`fs\` folders.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`HouseOfTheDead4SpecialVR-v0.2.7-quest3.apk\` with SideQuest / \`adb install -r\`.
2. Copy the \`elf\` and \`fs\` folders into \`/sdcard/HouseOfTheDead4Special/\`, so the executable ends up at \`/sdcard/HouseOfTheDead4Special/elf/hod4M.elf\` (\`adb push elf fs /sdcard/HouseOfTheDead4Special/\`).
3. Launch **The House of the Dead 4 Special VR** from **Unknown Sources**.
4. The first time, the app opens the **All files access** screen. Allow it, then start the app again.

---

### Controls
* **Trigger** fires. **Shake the gun** to reload, or press the grip.
* At a branch, shoot one of the two boxes to choose the path.
* A thumbstick click is Start. Coins are inserted automatically.
* The **left menu button** opens the settings panel, which adds a **HUD position** row for this game.

> [!TIP]
> Plays through the stages at 55-60 fps on a Quest 3. Updates install over the previous version and keep the game, settings and saves.`,
    troubleshooting_notes: 'If the game is missing or is a different version than the one this APK was built from, the app writes HOW-TO-ADD-THE-GAME.txt to Android/data/org.lindbergh.hotd4sp.vr/files/. The executable has to be at /sdcard/HouseOfTheDead4Special/elf/hod4M.elf, not in the House of the Dead 4 folder. If the app closes right after the first start, allow All files access and open it again.'
  },
  {
    id: '64',
    slug: 'nfl-blitz-2000-vr',
    title: 'NFL Blitz 2000 VR',
    developer: 'VistaLargaGames',
    developer_url: 'https://github.com/VistaLargaGames/NFL-Blitz-2000-Quest-VR',
    short_description: 'The N64 arcade football game NFL Blitz 2000, recompiled to run natively on Meta Quest 3 at 60 fps on a big curved screen, with HD textures and 2-4 player online VS.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/nfl-blitz-2000-vr.jpg',
    youtube_video_id: '_TRRrQVE-Mg',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Seated', 'Curved Screen'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/NFL_Blitz_2000',
    base_game_store: 'Requires your own copy (NFL Blitz 2000 USA Rev 1 N64 ROM)',
    port_download_url: 'https://github.com/VistaLargaGames/NFL-Blitz-2000-Quest-VR/releases/download/v0.1.56/NFL-Blitz-VR-0.1.56.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/VistaLargaGames/NFL-Blitz-2000-Quest-VR',
    latest_version: 'v0.1.56',
    last_github_update: '2026-10-28T19:18:44Z',
    featured: false,
    installation_guide: `### Overview
**NFL Blitz 2000 VR** runs the Nintendo 64 version of NFL Blitz 2000 natively on Meta Quest 3, recompiled with N64Recomp and RT64. The game's own camera plays on a big curved screen around you at 60 fps (smoothed to 120 Hz), with screens and menus upscaled 4x. Online VS lets 2 to 4 players, each on their own Quest, join with a room code.

> [!NOTE]
> **No game files included.** You need your own NFL Blitz 2000 (USA, Rev 1) ROM, made from your own cartridge.

---

### Prerequisites
* Meta Quest 3.
* Your own NFL Blitz 2000 (USA, Rev 1) ROM.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`NFL-Blitz-VR-0.1.56.apk\` from GitHub Releases.
2. Put your ROM somewhere on the headset, for example \`/sdcard/Download/\`.
3. Launch **NFL Blitz VR** from **Library > Unknown Sources**.
4. In the start window, choose your ROM. The game checks it and remembers it. After that, just press **Play**.

---

### Controls
* **Left stick** moves. **A / B** are A / B. **Either trigger** is Z (turbo).
* **Right grip** is R. **Right stick** is the C buttons. **Left menu button** is Start / pause.

### Online play
1. Everyone uses the same version of the app.
2. One player taps **Host (get a code)** and shares the code. The others tap **Join (enter a code)**.
3. The host presses Start once everyone has joined. The host's options are the game everyone plays.`,
    troubleshooting_notes: 'Use the NFL Blitz 2000 USA Rev 1 ROM; the start window checks the file. Online play needs every player on the same app version. It goes through a small shared relay by default; a relay.txt in /sdcard/Android/data/com.blitz2000.recompiled/files/ points it at your own.'
  },
  {
    id: '65',
    slug: 'vpinball-vr',
    title: 'Visual Pinball X VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/VPinball-VR',
    short_description: 'Visual Pinball X running standalone on Meta Quest 3: real pinball tables in VR or in your room with passthrough. Tables, ROMs and backglasses download inside the app.',
    category: 'emulator',
    status: 'playable_beta',
    install_workflow: 'direct',
    cover_image_url: '/covers/vpinball-vr.jpg',
    youtube_video_id: 'ZQAfHbLqfq4',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Roomscale', 'Seated', 'Mixed Reality (passthrough)'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (tables download in the app; your own tables go in VPinball/tables/)',
    base_game_url: 'https://github.com/vpinball/vpinball',
    base_game_store: 'Free (open-source simulator; tables come from the Visual Pinball community)',
    port_download_url: 'https://github.com/SgtBilko76/VPinball-VR/releases/download/v0.40-beta/VPinball-VR-Beta-0.40.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/VPinball-VR',
    latest_version: 'v0.40-beta',
    last_github_update: '2026-10-27T15:43:35Z',
    featured: false,
    installation_guide: `### Overview
**Visual Pinball X VR** builds the open-source pinball simulator Visual Pinball X (10.8.1) as a standalone VR app for Meta Quest 3. Stand in front of real and original tables with the cabinet and backglass around you, or put the machine in your own room with passthrough. Built by SgtBilko76 (Port Royale).

> [!NOTE]
> **Nothing to copy to get started.** The built-in **Table Downloader** fetches tables from the Visual Pinball Collection on archive.org, with their ROM, backglass and NVRAM. Some tables are several hundred MB, so use fast Wi-Fi.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Wi-Fi for the Table Downloader, or your own \`.vpx\` tables.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`VPinball-VR-Beta-0.40.apk\` from GitHub Releases.
2. Launch **VPinball** from **Unknown Sources**. The table library opens on a curved screen.
3. Get tables with **+ → Download from Archive.org**.
4. To use your own tables, put each in its own folder with its ROMs next to it (\`VPinball/tables/<Table name>/<table>.vpx\` and \`VPinball/tables/<Table name>/pinmame/roms/<rom>.zip\`) and select the \`VPinball/tables\` folder in the settings.

---

### Controls
* Point with a controller and pull the **trigger** to pick a table.
* **Left stick click** in the main menu switches between mixed reality and a black VR space.
* The first in-game menu entries switch **Mixed Reality** and the **VR Room**.

> [!TIP]
> Williams, Bally and Data East tables show "Factory settings restored" on their very first start: quit once through the menu and start again. Updates install over the old version and keep settings and tables.`,
    troubleshooting_notes: 'If a VR table shows no cabinet or backglass, its script has VRRoom = 0: put a copy of the script next to the table as <table name>.vbs with VRRoom set to a room ("Ultra Minimal" is the lightest). Williams / Bally / Data East tables need one restart after "Factory settings restored".'
  },
  {
    id: '66',
    slug: 'starship-vr',
    title: 'Starship-VR (Star Fox 64)',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/Starship-VR',
    short_description: 'Star Fox 64 in true stereoscopic 3D with head tracking, standalone on Meta Quest, from HarbourMasters\' Starship PC port. Bring your own ROM.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/starship-vr.jpg',
    youtube_video_id: 'CrGiHBE3YZE',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated Cockpit', 'Head Tracking', 'Stick Steering'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/Android/data/com.starship.vr/files/',
    base_game_url: 'https://en.wikipedia.org/wiki/Star_Fox_64',
    base_game_store: 'Requires your own copy (Star Fox 64 US 1.0 or 1.1 ROM, converted to sf64.o2r on a PC)',
    port_download_url: 'https://github.com/SgtBilko76/Starship-VR/releases/download/v1.0-beta1/Starship-VR-1.0-beta1.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/Starship-VR',
    latest_version: 'v1.0-beta1',
    last_github_update: '2026-09-23T17:38:54Z',
    featured: false,
    installation_guide: `### Overview
**Starship-VR** brings HarbourMasters' Starship (the native Star Fox 64 PC port) to Meta Quest in true stereoscopic 3D. The scene is rendered once per eye with head tracking, not on a flat screen. The HUD, text and radio messages hang on a virtual screen in front of you, and the motion controllers map to the N64 pad with rumble.

> [!NOTE]
> **No game content included.** You need your own Star Fox 64 ROM (US 1.0 or 1.1) and must turn it into \`sf64.o2r\` with Starship on a PC.

---

### Prerequisites
* Meta Quest 3 or Quest 3S in developer mode.
* A PC to generate \`sf64.o2r\` from your ROM with [Starship](https://github.com/HarbourMasters/Starship).

---

### Step-by-Step Installation
1. Generate \`sf64.o2r\` from your ROM with Starship on a PC.
2. Install the APK via 1-click on QuestPorts or install \`Starship-VR-1.0-beta1.apk\` with SideQuest / \`adb install -r\`.
3. Launch **Starship-VR** once so Android creates its folder. Do not create \`Android/data/com.starship.vr/files\` yourself.
4. Copy \`sf64.o2r\` to \`/sdcard/Android/data/com.starship.vr/files/sf64.o2r\` (\`adb push sf64.o2r /sdcard/Android/data/com.starship.vr/files/sf64.o2r\`).
5. Launch it again from **Library → Unknown Sources**.

---

### Controls
* **Right trigger / A** is A. **Left trigger / B** is B. **Grips** are Z / R.
* **X / Y** are C-Left / C-Down. **Right stick** is C-Up / C-Right. **Left stick** is the control stick.
* **Menu** is Start. **Left stick click** opens the Starship menu (point with the right controller).

> [!TIP]
> Tested on Quest 3. World scale, HUD placement and refresh rate (72 Hz up to 120 Hz) are in the VR menu, and the horizon stays level while the Arwing banks unless you switch it off.`,
    troubleshooting_notes: 'If the game does not start, check that sf64.o2r sits directly in /sdcard/Android/data/com.starship.vr/files/ and was made from a US 1.0 or 1.1 ROM. Launch the app once before copying so Android creates the folder.'
  },
  {
    id: '67',
    slug: 'openmohaa-vr',
    title: 'OpenMoHAA VR (Medal of Honor: Allied Assault)',
    developer: 'bearstonem',
    developer_url: 'https://github.com/bearstonem/openmohaa-vr',
    short_description: 'Medal of Honor: Allied Assault as a native OpenXR port on Meta Quest 3, built on the OpenMoHAA engine. Body holsters, grenade throws and ladder climbing. Bring your own game files.',
    category: 'source_port',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/openmohaa-vr.jpg',
    youtube_video_id: '-KIk1krj9fU',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/org.openmoh.openmohaa/files/main/',
    base_game_url: 'https://www.gog.com/en/game/medal_of_honor_allied_assault_war_chest',
    base_game_store: 'Requires your own copy (Medal of Honor: Allied Assault PC, .pk3 files from main/)',
    port_download_url: 'https://github.com/bearstonem/openmohaa-vr/releases/download/vr-quest3-0.2.0/openmohaa-vr-quest3-0.2.0.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/bearstonem/openmohaa-vr',
    latest_version: 'vr-quest3-0.2.0',
    last_github_update: '2026-10-14T21:52:47Z',
    featured: false,
    installation_guide: `### Overview
**OpenMoHAA VR** is a standalone VR port of Medal of Honor: Allied Assault for Meta Quest, built on the OpenMoHAA 0.83.0 engine and OpenXR. 0.2.0 adds body holsters, grip-driven ladder climbing, controller-velocity grenade throws and an on-demand HUD on the off-hand X button.

> [!NOTE]
> **No game files included.** The APK holds the engine only. You need your own Medal of Honor: Allied Assault PC game: copy every \`.pk3\` from its \`main/\` folder.

---

### Prerequisites
* Meta Quest 3 (other Quest models are unverified).
* Your own Medal of Honor: Allied Assault PC install.
* A PC with \`adb\` for the configuration file.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`openmohaa-vr-quest3-0.2.0.apk\` with \`adb install -r\`.
2. Copy all \`.pk3\` archives from the game's \`main/\` directory to \`/sdcard/Android/data/org.openmoh.openmohaa/files/main/\`.
3. Download \`autoexec.cfg\` from the same GitHub release and push it next to them: \`adb push autoexec.cfg /sdcard/Android/data/org.openmoh.openmohaa/files/main/autoexec.cfg\`, then \`adb shell am force-stop org.openmoh.openmohaa\`.
4. Launch **OpenMoHAA** from **Unknown Sources** inside the headset. Do not start it with \`adb shell am start\`.

> [!TIP]
> Prerelease: the 0.2.0 build was not measured on a headset before release. Let the app create its own \`main/save\` and \`main/configs\` folders. When you upgrade, install the new \`autoexec.cfg\` too.`,
    troubleshooting_notes: 'Dark scenery comes from world dynamic lighting: the release\'s autoexec.cfg sets r_worldDlights 0 as a workaround, so push it after every upgrade. Black boxes in some fonts are a known open issue. The .pk3 files must be directly in files/main/.'
  },
  {
    id: '68',
    slug: 'armsx2-3d',
    title: 'ARMSX2-3D (PS2 Emulator)',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/ARMSX2-3D',
    short_description: 'ARMSX2, the ARM64 fork of PCSX2, on Meta Quest: PS2 games on a curved virtual screen in stereoscopic 3D, rebuilt from each game\'s depth buffer. A 3D screen, not immersive VR.',
    category: 'emulator',
    status: 'in_development',
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/armsx2-3d.jpg',
    youtube_video_id: '7PQwEcLB51Q',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Seated', 'Virtual Screen (stereo 3D)'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://github.com/ARMSX2/ARMSX2',
    base_game_store: 'Requires your own PS2 BIOS dump and PS2 game discs (ISO / CHD)',
    port_download_url: 'https://github.com/SgtBilko76/ARMSX2-3D/releases/download/v0.3-beta/ARMSX2-3D-0.3-beta.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/ARMSX2-3D',
    latest_version: 'v0.3-beta',
    last_github_update: '2026-09-23T11:45:33Z',
    featured: false,
    installation_guide: `### Overview
**ARMSX2-3D** is ARMSX2 (the ARM64 fork of PCSX2) for Meta Quest, built on ARMSX2 2.7. The library and settings stay a normal 2D panel. Starting a game moves it into an OpenXR session with the game on a curved virtual screen (2.4 m wide at 1.5 m, 1920×1080 per eye) in stereoscopic 3D: each frame is reprojected per eye from the game's depth buffer.

> [!NOTE]
> **This is a 3D screen, not immersive VR.** The game camera does not follow your head. Games that never offer a usable depth buffer are shown flat.

> [!NOTE]
> **No BIOS or games included.** You need a BIOS dump from your own PS2 console and your own PS2 games.

---

### Prerequisites
* Meta Quest 3.
* A PS2 BIOS dump from your own console.
* Your own PS2 games (for example \`.iso\` or \`.chd\`).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`ARMSX2-3D-0.3-beta.apk\` from GitHub Releases. If the install fails with a signature mismatch, uninstall any other ARMSX2 build first.
2. Put your BIOS and games on the headset, for example in \`/sdcard/Download/\`.
3. Launch **ARMSX2** from **Unknown Sources**, grant storage access, choose the BIOS and point the app at your games folder.
4. Start a game: it opens on the curved 3D screen.

---

### Controls
* **A / B / X / Y** are Cross / Circle / Square / Triangle. **Grips / triggers** are L1 R1 / L2 R2.
* **Left stick click** is Start, **right stick click** is Select. **Left / right stick** are the analog sticks (a hard push on the left stick is the D-pad).
* **Menu** opens the ARMSX2 menu (leaves VR). **Menu + right trigger** recentres the screen.

> [!TIP]
> The VR settings page sets 3D on or off, depth, screen size, distance and curvature. Quest-tuned defaults use 3× internal resolution; heavy games may not run at full speed.`,
    troubleshooting_notes: 'If a game looks flat, it does not expose a usable depth buffer. Depth reprojection shows small artifacts at object edges. If the install fails with a signature mismatch, uninstall the other ARMSX2 build first.'
  },
  {
    id: '69',
    slug: 'xwing-revival-vr',
    title: 'X-Wing Revival VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/X-Wing-Revival-VR',
    short_description: 'Raptor007\'s free Star Wars space combat fan game X-Wing Revival, natively in VR on Meta Quest: 25 flyable ships, fleet battles, the trench run and online play with PC pilots. Game data included.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'direct',
    cover_image_url: '/covers/xwing-revival-vr.jpg',
    youtube_video_id: 'hJu7S6qEg24',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated Cockpit', '6DoF Ship Flight (sticks)'],
    has_6dof_controls: false,
    internal_storage_path: 'N/A (game data bundled in the APK; unpacked to /sdcard/XWingRevival/ on first start)',
    base_game_url: 'https://www.raptor007.com/xwing-revival/',
    base_game_store: 'Free (X-Wing Revival 0.6.1 by Raptor007, included in the APK)',
    port_download_url: 'https://github.com/SgtBilko76/X-Wing-Revival-VR/releases/download/v1.0.3/X-Wing-Revival-VR-v1.0.3-full.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/X-Wing-Revival-VR',
    latest_version: 'v1.0.3',
    last_github_update: '2026-10-19T00:00:00Z',
    featured: false,
    installation_guide: `### Overview
**X-Wing Revival VR** is a native VR port of X-Wing Revival, Raptor007's free Star Wars space combat game, by SgtBilko76 (Port Royale). You fly from the cockpit in head-tracked stereo 3D at 72 Hz. In the menus, space surrounds you and the menu floats in front of you, with a laser pointer and an on-screen keyboard. There are 25 flyable ships, fleet battles, the Death Star trench run and online multiplayer, where Quest, PICO and PC pilots meet on the official server.

> [!NOTE]
> **Nothing else to copy.** The full APK has the free X-Wing Revival 0.6.1 game data built in. It is a fan game, not the 1993 LucasArts X-Wing.

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* About 600 MB free (the APK plus about 310 MB of unpacked game data).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`X-Wing-Revival-VR-v1.0.3-full.apk\` from GitHub Releases.
2. Launch **X-Wing Revival VR** from **Unknown Sources** and allow **access to all files** when asked.
3. The first start unpacks the game data to \`/sdcard/XWingRevival/\` (about 310 MB). Then the menu appears.
4. Fly offline, or choose **Fly Online** to join the official Raptor007 server.

---

### Controls
* **Left stick** pitches and yaws. **Right stick** rolls (left/right) and sets the throttle (up/down).
* **Right trigger** fires. **Left trigger** targets what is in front of you.
* **Right grip** switches weapons (lasers / ions / torpedoes). **Left grip** sets single or linked fire.
* **A / B** target the nearest enemy / nearest attacker. Hold **both stick clicks** for 1 s to recenter.

> [!TIP]
> Big fleet battles run at about 45-65 fps on Quest 3. Custom missions: copy the mission's \`.def\` file to \`/sdcard/XWingRevival/Missions/\` and pick it in the lobby under Game Type → Mission.`,
    troubleshooting_notes: 'If the menu does not appear on the first start, wait for the game data to finish unpacking to /sdcard/XWingRevival/ and allow access to all files. PC players with X-Wing Revival 0.6.1 join the same server via Custom / LAN → Connect to IP Address www.raptor007.com:7000.'
  },
  {
    id: '70',
    slug: 'openxw-vr',
    title: 'OpenXW VR (Star Wars: X-Wing)',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/OpenXW-VR',
    short_description: 'LucasArts\' 1993 Star Wars: X-Wing in VR on Meta Quest, from the open-source OpenXW rebuild: stereo space and 3D cockpits for the X-Wing, Y-Wing, A-Wing and B-Wing. Bring your own Steam copy.',
    category: 'engine_recreation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/openxw-vr.jpg',
    youtube_video_id: 'Ea_e0qiZz7c',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated Cockpit', '6DoF Ship Flight (sticks)'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/OpenXW/',
    base_game_url: 'https://store.steampowered.com/app/354430/',
    base_game_store: 'Steam (STAR WARS X-Wing Special Edition)',
    port_download_url: 'https://github.com/SgtBilko76/OpenXW-VR/releases/download/v0.1.3-beta/OpenXW-VR-v0.1.3-beta.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/OpenXW-VR',
    latest_version: 'v0.1.3-beta',
    last_github_update: '2026-10-28T00:00:00Z',
    featured: false,
    installation_guide: `### Overview
**OpenXW VR** is a VR port of OpenXW, the open-source rebuild of LucasArts' Star Wars: X-Wing, by SgtBilko76 (Port Royale). Space is rendered in stereo around you and you sit in a 3D cockpit of your X-Wing, Y-Wing, A-Wing or B-Wing (cockpits from X-Wing Revival, included), with the original instruments and HUD in front of you. The concourse, briefings and cutscenes play on a big virtual screen.

> [!NOTE]
> **No game files included.** You need your own copy of **STAR WARS X-Wing Special Edition** (Steam).

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* Your own Steam copy of X-Wing Special Edition, copied from a PC.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`OpenXW-VR-v0.1.3-beta.apk\` with SideQuest / \`adb install -r\`.
2. From the Steam folder \`STAR WARS X-Wing\`, copy \`collectors_cd\` to \`/sdcard/OpenXW/XW94\` and \`remastered\` to \`/sdcard/OpenXW/XW98\` on the headset.
3. Launch **OpenXW VR** from **Unknown Sources** and allow **access to all files** when asked.

---

### Controls
* **Left stick** pitches and yaws (up = nose down). **Right stick** rolls and moves the throttle.
* **Right trigger** fires. **Left trigger** targets.
* Hold the **left grip** for the weapons and power radial menu, the **right grip** for targets and wingman orders.
* **Left Menu button** opens the OpenXW menu and pauses (hold 1 s to recenter).

> [!TIP]
> The small screens built into the X-Wing Revival cockpits are dark; the original instruments stay in front of you instead.`,
    troubleshooting_notes: 'If the game does not find its data, check the two folders: /sdcard/OpenXW/XW94 (from collectors_cd) and /sdcard/OpenXW/XW98 (from remastered), and that access to all files was allowed.'
  },
  {
    id: '71',
    slug: 'openxvt-vr',
    title: 'OpenXvT VR (X-Wing vs. TIE Fighter)',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/OpenXvT-VR',
    short_description: 'Star Wars: X-Wing vs. TIE Fighter with the Balance of Power campaigns in VR on Meta Quest, from the open-source OpenXvT rebuild: stereo space and 3D cockpits for rebel and imperial fighters. Bring your own Steam copy.',
    category: 'engine_recreation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/openxvt-vr.jpg',
    youtube_video_id: 'amOYTpdpNYI',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated Cockpit', '6DoF Ship Flight (sticks)'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/OpenXvT/',
    base_game_url: 'https://store.steampowered.com/app/361690/',
    base_game_store: 'Steam (STAR WARS X-Wing vs TIE Fighter - Balance of Power Campaigns)',
    port_download_url: 'https://github.com/SgtBilko76/OpenXvT-VR/releases/download/v0.1.1-beta/OpenXvT-VR-v0.1.1-beta.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/OpenXvT-VR',
    latest_version: 'v0.1.1-beta',
    last_github_update: '2026-10-28T00:00:00Z',
    featured: false,
    installation_guide: `### Overview
**OpenXvT VR** is a VR port of OpenXvT, the open-source rebuild of Star Wars: X-Wing vs. TIE Fighter with the Balance of Power campaigns, by SgtBilko76 (Port Royale). Space is rendered in stereo around you and you fly from a 3D cockpit (X-Wing Revival cockpits for the X-wing, Y-wing, A-wing, B-wing, TIE Fighter, Interceptor, Bomber and Gunboat, included), with the original instruments in front of you. The concourse, briefings and cutscenes play on a big virtual screen.

> [!NOTE]
> **No game files included.** You need your own copy of **STAR WARS X-Wing vs TIE Fighter - Balance of Power Campaigns** (Steam).

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* Your own Steam copy of the game, copied from a PC (about 400 MB).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`OpenXvT-VR-v0.1.1-beta.apk\` with SideQuest / \`adb install -r\`.
2. Copy your whole Steam folder \`STAR WARS X-Wing vs TIE Fighter\` to \`/sdcard/OpenXvT\` on the headset.
3. Launch **OpenXvT VR** from **Unknown Sources** and allow **access to all files** when asked.

---

### Controls
* **Left stick** pitches and yaws (up = nose down). **Right stick** rolls and moves the throttle lever.
* **Right trigger** fires. **Left trigger** targets (tap: target in your sights).
* Hold the **left grip** for the weapons and power radial menu, the **right grip** for targets and wingman orders.
* **Left Menu button** opens the OpenXvT menu and pauses.

> [!TIP]
> The Z-95, T-wing, R-41, TIE Advanced, TIE Defender and Missile Boat borrow the closest cockpit. The galaxy map and the hyperspace jump are shown flat. Multiplayer is untested.`,
    troubleshooting_notes: 'If the game does not find its data, check that the whole Steam folder sits at /sdcard/OpenXvT and that access to all files was allowed.'
  },
  {
    id: '72',
    slug: 'supertuxkart-vr',
    title: 'SuperTuxKart VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/SuperTuxKart-VR',
    short_description: 'The free, open-source kart racer SuperTuxKart as a native VR app on Meta Quest: per-eye stereo races with head tracking and menus on a floating screen. The whole game is in the APK.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'direct',
    cover_image_url: '/covers/supertuxkart-vr.jpg',
    youtube_video_id: 'YZDw85U44xo',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated', 'Chase Camera', 'Head Tracking'],
    has_6dof_controls: false,
    internal_storage_path: 'N/A (game data bundled in the release APK)',
    base_game_url: 'https://supertuxkart.net/',
    base_game_store: 'Free (open-source game, included in the APK)',
    port_download_url: 'https://github.com/SgtBilko76/SuperTuxKart-VR/releases/download/v1.0.1/SuperTuxKart-VR-1.0.1.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/SuperTuxKart-VR',
    latest_version: 'v1.0.1',
    last_github_update: '2026-10-11T00:00:00Z',
    featured: false,
    installation_guide: `### Overview
**SuperTuxKart VR** is a standalone VR port of SuperTuxKart, the free and open-source kart racer, by SgtBilko76 (Port Royale). Races are rendered in real per-eye stereo with head tracking, layered on the normal kart-following camera, and the menus sit on a floating screen.

> [!NOTE]
> **Nothing else to copy.** The game is free and fully inside the APK (about 700 MB).

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* About 1 GB free.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`SuperTuxKart-VR-1.0.1.apk\` from GitHub Releases. It is a large download.
2. Launch **SuperTuxKart** from **Library → Unknown Sources**.
3. Race.

---

### Controls
* **Left stick** steers. **Right trigger** accelerates. **Left trigger** brakes.
* The **face buttons** are nitro, fire, drift, rescue, look back and pause.`,
    troubleshooting_notes: 'The APK is about 700 MB, so the download takes a while and needs about 1 GB free. If the install fails, free space and try again.'
  },
  {
    id: '73',
    slug: 're-code-veronica-x-vr',
    title: 'Resident Evil Code: Veronica X VR',
    developer: 'neto1495mn-sudo',
    developer_url: 'https://github.com/neto1495mn-sudo/recvx-enhanced-port-pcvr',
    short_description: 'Capcom\'s Resident Evil Code: Veronica X (PS2) running natively on Meta Quest from a recompiled PC port, with tracked hands, real aiming and physical reloads. Bring your own disc image.',
    category: 'decompilation',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/re-code-veronica-x-vr.jpg',
    youtube_video_id: '_2-NZcCqmSs',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S'],
    locomotion_types: ['Smooth Locomotion', 'Smooth Turn', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Resident_Evil_%E2%80%93_Code:_Veronica',
    base_game_store: 'Requires your own copy (PS2 disc image, NTSC-U SLUS-20184)',
    port_download_url: 'https://github.com/neto1495mn-sudo/recvx-enhanced-port-pcvr/releases/download/v1.4.3/RE-Code-Veronica-X-VR-v1.4.3.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/neto1495mn-sudo/recvx-enhanced-port-pcvr',
    latest_version: 'v1.4.3',
    last_github_update: '2026-10-31T16:54:50Z',
    featured: false,
    installation_guide: `### Overview
**Resident Evil Code: Veronica X VR** runs Capcom's 2001 survival horror game natively on Meta Quest, with no PC. It is built on aikatore's recompiled PC port (recvx-enhanced-recomp) and AshfordFamily's recvx-decomp decompilation, with a VR mode by NETO: tracked hands, aiming with the gun in your hand, a knife on a free hand, and physical reloads from the ammo at your belt.

This is the full Code: Veronica X adventure (exploration, puzzles, inventory, Claire and Chris's story). It is not **Resident Evil Survivor 2: Code Veronica**, the arcade light-gun shooter, which has its own page on QuestPorts.

> [!NOTE]
> **No game files included.** You need your own \`.iso\` of the PS2 version, NTSC-U, **SLUS-20184**.

---

### Prerequisites
* Meta Quest 2 (tested) or Quest 3 / 3S (declared supported, not yet tested by the author).
* Your own Code: Veronica X PS2 disc image (NTSC-U, SLUS-20184).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`RE-Code-Veronica-X-VR-v1.4.3.apk\` from GitHub Releases.
2. Put your \`.iso\` on the headset, for example in \`/sdcard/Download/\`.
3. Open the app from **Library → Unknown Sources**. The first time, allow access to all files (it only reads your disc image and optional textures).
4. In the launcher: **Disc** → pick your \`.iso\`, then **Play**. In **Settings**, use 2× resolution on Quest 2 and 3× on Quest 3.

---

### Controls
* **Left stick** walks (click while walking forward to run). **Right stick** turns.
* **Right grip + right trigger** aim and fire. **Left grip at the gun** holds it with both hands.
* **Reload:** **B** drops the magazine, take a box at your belt with the **left grip**, bring it to the gun.
* **Left grip with a free left hand** is the knife. **A** is action, **Y** the inventory, **X** the map.

> [!TIP]
> An optional HD texture pack (a single \`.pack\` file) goes in the folder you choose in the launcher's **Textures** tab. Small stutters can happen when entering rooms with HD textures.`,
    troubleshooting_notes: 'If the app does not start, it now shows a panel with the reason. Send Android/data/org.recvx.vr/files/recvx.log with the report. Battle Game can still error when choosing the character. Only the NTSC-U SLUS-20184 disc is supported.'
  },
  {
    id: '74',
    slug: 'freespace2-vr',
    title: 'FreeSpace 2 VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/FreeSpace2-VR',
    short_description: 'The 1999 space combat classic FreeSpace 2 in head-tracked stereo VR on Meta Quest 3, on the FreeSpace Open engine. HUD lined up with your guns, menus on a big screen. Bring your own GOG or Steam copy.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/freespace2-vr.jpg',
    youtube_video_id: '0SCT-YZp40A',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated Cockpit', '6DoF Ship Flight (sticks)'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/FS2/',
    base_game_url: 'https://store.steampowered.com/app/273620/',
    base_game_store: 'GOG or Steam (FreeSpace 2)',
    port_download_url: 'https://github.com/SgtBilko76/FreeSpace2-VR/releases/download/v0.1.2-beta/FreeSpace2-VR-v0.1.2-beta.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/FreeSpace2-VR',
    latest_version: 'v0.1.2-beta',
    last_github_update: '2026-10-24T10:50:38Z',
    featured: false,
    installation_guide: `### Overview
**FreeSpace 2 VR** is a standalone VR port of FreeSpace 2 on the FreeSpace Open engine, by SgtBilko76 (Port Royale). Space is rendered in stereo around you, the HUD floats in front of your ship and lines up with your guns, and the menus, briefings and cutscenes play on a big virtual screen.

> [!NOTE]
> **No game files included.** You need your own copy of FreeSpace 2 from GOG or Steam (about 1.8 GB of game files).

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* Your own FreeSpace 2, copied from a PC.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`FreeSpace2-VR-v0.1.2-beta.apk\` with \`adb install -r -g\`.
2. From your GOG or Steam install folder, copy the nine \`.vp\` files (\`root_fs2.vp\` … \`warble_fs2.vp\`) and the folders \`data2\` and \`data3\` (cutscenes) to \`/sdcard/FS2\` on the headset. The app moves the cutscenes into place on the first start.
3. Launch **FreeSpace 2 VR** from **Unknown Sources** and allow **access to all files** when asked.

---

### Controls
* The **right stick** is the throttle lever. The **left grip** opens a second button layer.
* All controls can be remapped in **Options → Controls**. The training missions work with the controllers.

> [!TIP]
> Flight runs below the headset's refresh rate; menus run at full speed. Shadows are off by default to keep the frame rate up. There is no 3D cockpit: FreeSpace 2 has no cockpit models.`,
    troubleshooting_notes: 'If the game does not find its data, check that the nine .vp files and the data2 and data3 folders are directly in /sdcard/FS2, and that access to all files was allowed.'
  },
  {
    id: '75',
    slug: 'wing-commander-vr',
    title: 'Wing Commander VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/wc1-re-vr',
    short_description: 'Origin\'s 1990 space combat classic Wing Commander in stereo VR on Meta Quest, on the wc1-re source reconstruction: a 3D cockpit from the original art and Kilrathi fighters at their real depth. Bring your own GOG copy.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/wing-commander-vr.jpg',
    youtube_video_id: 'S4J_LRKo4LI',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated Cockpit', '6DoF Ship Flight (sticks)'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/WingCommander/',
    base_game_url: 'https://www.gog.com/en/game/wing_commander_1_2',
    base_game_store: 'GOG (Wing Commander, DOS)',
    port_download_url: 'https://github.com/SgtBilko76/wc1-re-vr/releases/download/quest-vr-1.0.1/WingCommanderVR-1.0.1.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/wc1-re-vr',
    latest_version: 'quest-vr-1.0.1',
    last_github_update: '2026-10-24T10:19:02Z',
    featured: false,
    installation_guide: `### Overview
**Wing Commander VR** is a VR port of Wing Commander (1990) on wc1-re, the source reconstruction of the DOS original, by SgtBilko76 (Port Royale). In flight, space is rendered in stereo around you: Kilrathi fighters, missiles and capital ships sit at their real distance and you can look around freely. You sit in a 3D cockpit built from the original cockpit art, with live gauges, radar and HUD. The Tiger's Claw, the bar, briefings and cutscenes play on a big virtual screen.

> [!NOTE]
> **No game files included.** You need your own copy of Wing Commander (DOS, GOG), about 8 MB of game files.

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* Your own GOG Wing Commander, copied from a PC.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`WingCommanderVR-1.0.1.apk\` with SideQuest / \`adb install -r\`.
2. From your GOG Wing Commander folder, copy \`WC.EXE\`, \`SM2.EXE\` and the \`GAMEDAT\` folder to \`/sdcard/WingCommander\` on the headset.
3. Launch **Wing Commander VR** from **Unknown Sources** and allow **access to all files** when asked.

---

### Controls
* Full flight control on the Touch controllers, with a soft centre for precise aiming.
* Laser pointer for the menus; **A / B** answer Yes / No prompts. A VR keyboard types your pilot name and callsign.

> [!TIP]
> Stick response and cockpit distance can be tuned in \`/sdcard/WingCommander/vr.cfg\` (\`cockpit3d=0\` brings back the flat cockpit). Ships are the game's original sprites, so in 3D they are flat pictures at the right depth.`,
    troubleshooting_notes: 'If the game does not start, check that WC.EXE, SM2.EXE and GAMEDAT are directly in /sdcard/WingCommander and that access to all files was allowed. Restart the game after editing vr.cfg.'
  },
  {
    id: '76',
    slug: 'wing-commander-2-vr',
    title: 'Wing Commander II VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/wc2-re-vr',
    short_description: 'Wing Commander II: Vengeance of the Kilrathi (1991) in stereo VR on Meta Quest, on the wc2-re source reconstruction, with a 3D cockpit from the original art. Bring your own copy of the game.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/wing-commander-2-vr.jpg',
    youtube_video_id: 'ZpIMM-tpdTI',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated Cockpit', '6DoF Ship Flight (sticks)'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/WingCommander2/',
    base_game_url: 'https://www.gog.com/en/game/wing_commander_1_2',
    base_game_store: 'GOG or the DOS CD-ROM (Wing Commander II with Special Operations 1 and 2)',
    port_download_url: 'https://github.com/SgtBilko76/wc2-re-vr/releases/download/quest-vr-1.0.1/WingCommanderIIVR-1.0.1.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/wc2-re-vr',
    latest_version: 'quest-vr-1.0.1',
    last_github_update: '2026-10-24T10:19:10Z',
    featured: false,
    installation_guide: `### Overview
**Wing Commander II VR** is a VR port of Wing Commander II: Vengeance of the Kilrathi on wc2-re, the source reconstruction of the game, by SgtBilko76 (Port Royale). In flight, space is rendered in stereo around you with ships at their real distance, and you sit in a 3D cockpit built from the original cockpit art, with live displays and targeting. Briefings, cutscenes and menus play on a big virtual screen.

> [!NOTE]
> **No game files included.** You need your own copy of Wing Commander II. The DOS CD-ROM edition with Special Operations 1 and 2 is tested; Kilrathi Saga data should also work (about 26 MB).

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* Your own Wing Commander II game files, copied from a PC.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`WingCommanderIIVR-1.0.1.apk\` with SideQuest / \`adb install -r\`.
2. Copy \`WC2.EXE\` and the \`GAMEDAT\` folder (the \`WING2\` folder of the CD, or your installed game folder) to \`/sdcard/WingCommander2\` on the headset.
3. Launch **Wing Commander II VR** from **Unknown Sources** and allow **access to all files** when asked.

---

### Controls
* Full flight control on the Touch controllers, with a soft centre for precise aiming.
* **To land:** target your carrier (**A**), open comms (**left grip + X**), pick it and request landing, then fly in at normal speed.

> [!TIP]
> Landing clearance is only given once you have done something in the mission and no Kilrathi are close. With the DOS CD-ROM data the game plays AdLib music and synthesized sound effects, as the original did.`,
    troubleshooting_notes: 'If the game does not start, check that WC2.EXE and GAMEDAT are directly in /sdcard/WingCommander2 and that access to all files was allowed.'
  },
  {
    id: '77',
    slug: 'rvgl-vr',
    title: 'Re-Volt VR (RVGL)',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/RVGL-VR',
    short_description: 'The 1999 RC-car racer Re-Volt in head-tracked stereo VR on Meta Quest, on RVGL, the community\'s modern Re-Volt engine. The free game data downloads in the app on first launch.',
    category: 'engine_recreation',
    status: 'playable_beta',
    install_workflow: 'direct',
    cover_image_url: '/covers/rvgl-vr.jpg',
    youtube_video_id: '5Ei_opWv9Yk',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Seated', 'Chase Camera', 'Head Tracking'],
    has_6dof_controls: false,
    internal_storage_path: 'N/A (the app downloads the free game data to /sdcard/RVGL on first launch)',
    base_game_url: 'https://rvgl.org/',
    base_game_store: 'Free (game data downloaded from Re-Volt I/O in the app)',
    port_download_url: 'https://github.com/SgtBilko76/RVGL-VR/releases/download/v0.1.1/RVGL-VR-v0.1.1.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/RVGL-VR',
    latest_version: 'v0.1.1',
    last_github_update: '2026-10-23T21:22:47Z',
    featured: false,
    installation_guide: `### Overview
**Re-Volt VR** is a standalone VR port of Re-Volt (1999) by SgtBilko76 (Port Royale), built on the official Android build of RVGL, the community's modern Re-Volt engine. A native OpenXR host puts the menus on a big virtual screen and renders the races in head-tracked stereo 3D at 72 Hz. You get all 19 original tracks plus the RV 25th Anniversary pack's 13 tracks and 14 cars.

> [!NOTE]
> **Nothing to copy.** The APK holds no game content: on first launch the app downloads the Re-Volt game files and soundtrack from Re-Volt I/O and the RV25 pack from Re-Volt World, and installs them for you (about 225 MB, 500 MB on the headset).

---

### Prerequisites
* Meta Quest 2, Pro, 3 or 3S (tested on Quest 3).
* Wi-Fi for the one-time download.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`RVGL-VR-v0.1.1.apk\` from GitHub Releases.
2. Launch **RVGL VR** from **Unknown Sources**. A setup panel opens: press **Allow file access**, switch it on and press **Done**.
3. Press **Download and install**. After a minute or two the game starts by itself.
4. Create your profile: turn the wheel with the left stick and press **A** for each letter, then turn to **END** and press **A**.

---

### Controls
* The Touch controller layout is set up automatically for every new profile and can still be changed in RVGL's own controller settings.
* Hold **both stick clicks** for 1 s to recenter the view.

> [!TIP]
> Already have RVGL data, for example from the Android version? Copy it to \`/sdcard/RVGL\` before the first launch and the packs that are present are not downloaded again. Single player only for now.`,
    troubleshooting_notes: 'The first launch needs Wi-Fi to download the game data. If the download stops, launch the app again and press Download and install. Split-screen and online play are untested in VR.'
  },
  {
    id: '78',
    slug: 'pikmin-vr',
    title: 'Pikmin VR (Project Honeydew)',
    developer: 'Project Honeydew',
    developer_url: 'https://projecthoneydew.com/honeydew1',
    short_description: 'Pikmin (GameCube) in VR at Pikmin height, on the projectPiki decompilation: pluck and throw Pikmin with your own hands, solo or online co-op. Free fan mod with an experimental Quest 3 build. Bring your own disc.',
    category: 'decompilation',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/pikmin-vr.jpg',
    youtube_video_id: 'AsJ8L9qx7MQ',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Smooth Locomotion', 'Roomscale', 'Hand Tracking (pluck and throw)'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Pikmin_(video_game)',
    base_game_store: 'Requires your own copy (Pikmin GameCube disc image, USA Rev 1)',
    port_download_url: 'https://projecthoneydew.com/honeydew1#install-quest',
    port_download_source: 'Project Honeydew site (manual)',
    github_url: null,
    latest_version: 'v0.3.1',
    last_github_update: '2026-10-28T00:00:00Z',
    featured: false,
    installation_guide: `### Overview
**Project Honeydew** is a free, unofficial VR mod for Pikmin (GameCube). You stand in the world at Pikmin height: pluck Pikmin from the ground with your hands, throw them with a real swing, and play solo or in two-player online co-op. It is built on the projectPiki decompilation and the Open Nectar PC port. The Meta Quest build runs on the headset itself, with no PC, and is marked experimental.

> [!NOTE]
> **No game files included.** You need your own Pikmin disc image (GameCube, **USA, Rev 1**) as a plain \`.iso\` or \`.gcm\`. Convert RVZ, WIA or GCZ images to ISO first, for example with Dolphin on a PC.

> [!NOTE]
> **Download from the project's site.** The APK is hosted on projecthoneydew.com, not GitHub, so QuestPorts has no 1-click install for it.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own Pikmin (USA, Rev 1) disc image.
* About 2.5 GB free.

---

### Step-by-Step Installation
1. Download \`ProjectHoneydew-0.3.1-quest.apk\` from the [Project Honeydew site](https://projecthoneydew.com/honeydew1#install-quest).
2. Install it with SideQuest or \`adb install ProjectHoneydew-0.3.1-quest.apk\`.
3. Copy your disc image to the Quest's \`Download\` folder over USB.
4. Open **Project Honeydew** from **Library → Unknown Sources**, pick your disc image when asked, and wait for the one-time import. Afterwards you can delete the image from Download.

> [!TIP]
> Busy scenes run at about 50-55 fps on the Quest, and voice chat is not available on Quest yet. Uninstalling the app deletes its saves.`,
    troubleshooting_notes: 'Use a plain .iso or .gcm of the USA Rev 1 disc. RVZ, WIA and GCZ images must be converted to ISO first. If you have a gaming PC, the project says its Windows version over Link is the most tested.'
  },
  {
    id: '79',
    slug: 'pikmin-2-vr',
    title: 'Pikmin 2 VR (Project Honeydew 2)',
    developer: 'Project Honeydew',
    developer_url: 'https://projecthoneydew.com/',
    short_description: 'Pikmin 2 (GameCube) in VR at the captains\' height: pluck, grab and throw with your own hands and lead your Pikmin into the caves. Free fan mod, early preview with a Quest 3 build. Bring your own disc.',
    category: 'decompilation',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/pikmin-2-vr.jpg',
    youtube_video_id: 'iCjkQ6TGWt0',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Smooth Locomotion', 'Roomscale', 'Hand Tracking (pluck and throw)'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Pikmin_2',
    base_game_store: 'Requires your own copy (Pikmin 2 GameCube disc image, USA GPVE01 or Europe GPVP01)',
    port_download_url: 'https://projecthoneydew.com/#honeydew2-install-quest',
    port_download_source: 'Project Honeydew site (manual)',
    github_url: null,
    latest_version: 'v0.1.0',
    last_github_update: null,
    featured: false,
    installation_guide: `### Overview
**Project Honeydew 2** is a free, unofficial VR mod for Pikmin 2 (GameCube), from the makers of Project Honeydew. You stand in the world as Captain Olimar and Louie, at their size: pluck Pikmin with your hands, throw them with a real swing, and lead them down into the caves. It is a 0.1.0 preview; the Meta Quest build runs on the headset itself, with no PC.

> [!NOTE]
> **No game files included.** You need your own Pikmin 2 disc image: USA (**GPVE01**) or Europe (**GPVP01**), as a plain \`.iso\` or \`.gcm\`. Unpack a .7z or .zip first, and convert RVZ, WIA, GCZ, CISO or NKit images to ISO with Dolphin on a PC.

> [!NOTE]
> **Download from the project's site.** The APK is hosted on projecthoneydew.com, not GitHub, so QuestPorts has no 1-click install for it.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own Pikmin 2 disc image (USA or Europe).
* About 1.2 GB free.

---

### Step-by-Step Installation
1. Download \`ProjectHoneydew2-0.1.0-quest.apk\` from the [Project Honeydew site](https://projecthoneydew.com/#honeydew2-install-quest).
2. Install it with SideQuest or \`adb install ProjectHoneydew2-0.1.0-quest.apk\`. It installs beside Project Honeydew (Pikmin 1) as its own app.
3. Copy your disc image into the headset's \`Download\` folder over USB.
4. Start **Project Honeydew 2** from **Library → Unknown Sources**, choose your disc image, and wait a minute or two while its files are imported. You can delete the image afterwards.

> [!TIP]
> This is an early preview. Uninstalling the app deletes its saves.`,
    troubleshooting_notes: 'On the Quest only a plain .iso or .gcm of the USA (GPVE01) or European (GPVP01) disc is accepted. Convert other formats with Dolphin on a PC first.'
  },
  {
    id: '80',
    slug: 'outlaws-vr',
    title: 'Outlaws VR',
    developer: 'outlawshub-arch',
    developer_url: 'https://github.com/outlawshub-arch/OutlawsVR',
    short_description: 'LucasArts\' 1997 western shooter Outlaws as a full VR game on Meta Quest 3 and 2: a new Unreal Engine 5 engine that builds the original levels from your own Outlaws Remastered. Full VR hands, co-op and multiplayer.',
    category: 'engine_recreation',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/outlaws-vr.jpg',
    youtube_video_id: 'gjTwduLNMyk',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Climbing'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (Install on Quest.bat on a Windows PC copies the game data)',
    base_game_url: 'https://store.steampowered.com/app/3366780/',
    base_game_store: 'Steam or GOG (Outlaws + A Handful of Missions: Remaster)',
    port_download_url: 'https://github.com/outlawshub-arch/OutlawsVR/releases/download/v0.95/OutlawsVR-v0.95-hotfix-0bbe48c.zip',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/outlawshub-arch/OutlawsVR',
    latest_version: 'v0.95',
    last_github_update: '2026-10-31T06:46:06Z',
    featured: false,
    installation_guide: `### Overview
**Outlaws VR** is a fan-made VR game that plays LucasArts' **Outlaws** (1997) on Meta Quest 3 and Quest 2, natively, and on PC VR. It is not a patch for the original executable: a new engine built in Unreal Engine 5.1 reads your own **Outlaws Remastered** install and builds every level, sprite, sound and script from those files. It has the whole story, the Historical Missions, a VR tutorial, co-op and multiplayer with bots, and full VR hands: draw, aim and reload with each hand, throw dynamite and knives, grab bad guys, climb.

> [!NOTE]
> **No game files included, and a Windows PC is needed once.** You need Outlaws Remastered (Steam or GOG) installed on a Windows 10 or 11 PC. The release's \`Install on Quest.bat\` prepares and installs everything over USB.

---

### Prerequisites
* Meta Quest 3 or Quest 2 in developer mode, and a data USB-C cable.
* Outlaws + A Handful of Missions: Remaster (Steam or GOG) on a Windows PC.

---

### Step-by-Step Installation
1. Download \`OutlawsVR-v0.95-hotfix-0bbe48c.zip\` (281 MB) from GitHub Releases.
2. Unzip it and drag the \`OutlawsVR\` folder into your Outlaws Remastered folder (the one with \`olgeo.lab\`).
3. Plug the headset into the PC and run \`Install on Quest.bat\`. The first run converts the cutscenes and music once (it downloads FFmpeg, about 190 MB).
4. Start **Outlaws VR** from **Library → Unknown Sources**. The player's manual is \`Outlaws VR Manual.html\` in the folder.

> [!TIP]
> To update, replace the \`OutlawsVR\` folder and run \`Install on Quest.bat\` again: saves and settings are kept. Never uninstall the game from the headset to update it, that deletes your saves.`,
    troubleshooting_notes: 'If Windows SmartScreen warns on the first run, choose More info → Run anyway (the files are not signed). Internet play on a Quest needs the router port open or a VPN such as Tailscale. Report bugs in #outlaws-vr-bugs on the OutlawsTheGame Discord.'
  },
  {
    id: '81',
    slug: 'star-wars-arcade-vr',
    title: 'Star Wars Arcade VR (Atari 1983)',
    developer: 'cyberheater',
    developer_url: 'https://github.com/cyberheater/Quest-SWVR',
    short_description: 'Atari\'s 1983 Star Wars vector arcade game as a native Meta Quest app: the arcade game drawn in 3-D around you, a Touch controller as the flight stick. Bring your own MAME ROM set.',
    category: 'emulator',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/star-wars-arcade-vr.jpg',
    youtube_video_id: 'nJv94FPRddA',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Seated Cockpit', 'Flight Stick'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/Android/data/com.cyberheater.starwars/files/',
    base_game_url: 'https://en.wikipedia.org/wiki/Star_Wars_(1983_video_game)',
    base_game_store: 'Requires your own copy (MAME starwars ROM set)',
    port_download_url: 'https://github.com/cyberheater/Quest-SWVR/releases/download/v0.3.2/StarWarsQuest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/cyberheater/Quest-SWVR',
    latest_version: 'v0.3.2',
    last_github_update: '2026-10-15T07:23:45Z',
    featured: false,
    installation_guide: `### Overview
**Star Wars Arcade VR** turns Atari's 1983 Star Wars vector arcade game into a native Meta Quest app. You sit in the cockpit with the arcade game's vectors placed in 3-D around you, and a Touch controller is the flight stick. It runs on the headset by itself, with no PC or cable once it is installed.

> [!NOTE]
> **No ROM data included.** You need your own MAME \`starwars\` ROM set (\`starwars.zip\`), as it is.

---

### Prerequisites
* A Meta Quest (tried on the original Quest and on a Quest 3; Quest 2, 3S and Pro should work).
* Your own \`starwars.zip\` MAME ROM set.
* A PC and a USB cable, once.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`StarWarsQuest.apk\` with SideQuest / \`adb install -r\`.
2. Start **Star Wars** once from **Library → Unknown Sources**. It shows **NO ROMS** and creates its folder. Quit with the Meta button.
3. Copy \`starwars.zip\`, as it is, to \`/sdcard/Android/data/com.cyberheater.starwars/files/\` (\`adb push starwars.zip /sdcard/Android/data/com.cyberheater.starwars/files/\`, or SideQuest's file browser).
4. Start **Star Wars** again and the game runs.

> [!TIP]
> The app finds the chips it needs in any \`.zip\` in that folder by their checksums, so nothing has to be unpacked or renamed. The first start with the zip writes six \`starwars_*.bin\` files beside it.`,
    troubleshooting_notes: 'If it still shows NO ROMS, check that starwars.zip sits directly in Android/data/com.cyberheater.starwars/files/. Some headset versions hide Android/data in Windows Explorer; use adb or SideQuest instead.'
  },
  {
    id: '82',
    slug: 'ultima-4-vr',
    title: 'Ultima IV VR (ANKH-VR)',
    developer: 'plaidpants',
    developer_url: 'https://github.com/plaidpants/ANKH-VR',
    short_description: 'Origin\'s 1985 RPG Ultima IV: Quest of the Avatar in VR on Meta Quest, a Unity remake that reads the original game\'s own data. Ultima IV is free on GOG. Alpha on Quest.',
    category: 'engine_recreation',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/ultima-4-vr.jpg',
    youtube_video_id: 'Z9mnNK967Jo',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Android/data/com.SwivelChairGames.ANKHVR/files/u4/',
    base_game_url: 'https://www.gog.com/en/game/ultima_4',
    base_game_store: 'Free on GOG (Ultima 4: Quest of the Avatar)',
    port_download_url: 'https://github.com/plaidpants/ANKH-VR/releases/download/0.2.15/ANHK-VR.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/plaidpants/ANKH-VR',
    latest_version: 'v0.2.15',
    last_github_update: '2026-07-02T22:48:32Z',
    featured: false,
    installation_guide: `### Overview
**ANKH-VR** runs the original Ultima IV: Quest of the Avatar (1985) in VR, built in Unity by plaidpants. The Quest version reads all its text and data straight from the original game's files. The author calls it functionally complete but alpha on the Quest. It switches tile sets while you play (CGA, EGA, Apple II or a custom PNG).

> [!NOTE]
> **No game files included.** Ultima IV is free on GOG. Install it on a PC, then copy the whole install folder to the headset.

---

### Prerequisites
* Meta Quest 2 or Quest 3.
* Ultima IV from GOG (free), installed on a PC.
* Optional: the original music as MP3 or OGG (see the project page).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`ANHK-VR.apk\` with SideQuest / \`adb install -r\`.
2. Copy the entire Ultima IV install folder to \`/sdcard/Android/data/com.SwivelChairGames.ANKHVR/files/u4\`, so \`AVATAR.EXE\` ends up at \`.../files/u4/AVATAR.EXE\`. File names are case sensitive on the Quest.
3. Launch **ANKH-VR** from **Unknown Sources**.

> [!TIP]
> SideQuest sometimes skips files when you copy many at once: check that everything arrived. If you copy old save files (\`.SAV\`), make them writable with \`adb shell chmod 666 /sdcard/Android/data/com.SwivelChairGames.ANKHVR/files/u4/*.SAV\`. A new game creates them writable already.`,
    troubleshooting_notes: 'AVATAR.EXE must be directly in Android/data/com.SwivelChairGames.ANKHVR/files/u4/. Copied .SAV files need chmod 666 over adb or the game cannot save. Text to speech needs a network connection.'
  },
  {
    id: '83',
    slug: 'wipeout-pure-vr',
    title: 'Wipeout Pure VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/WipeoutPure-VR',
    short_description: 'Wipeout Pure (PSP, 2005) as a native Quest game from a static recompilation: head-tracked stereo 3D, a floating HUD, 60 fps races shown at 120 Hz. Bring your own US disc image.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/wipeout-pure-vr.jpg',
    youtube_video_id: 'mFOZDsTrw9s',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated', 'Cockpit View', 'Head Tracking'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/Android/data/online.portroyale.wipeoutpurevr/files/import/',
    base_game_url: 'https://en.wikipedia.org/wiki/Wipeout_Pure',
    base_game_store: 'Requires your own copy (PSP disc image, US Greatest Hits edition UCUS-98612, version 2.00)',
    port_download_url: 'https://github.com/SgtBilko76/WipeoutPure-VR/releases/download/v0.1.0-beta/WipeoutPure-VR-v0.1.0-beta.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/WipeoutPure-VR',
    latest_version: 'v0.1.0-beta',
    last_github_update: '2026-10-30T16:39:47Z',
    featured: false,
    installation_guide: `### Overview
**Wipeout Pure VR** is a standalone VR port of Wipeout Pure (PSP, 2005) by SgtBilko76 (Port Royale), built on [pure-recomp](https://github.com/erreib/pure-recomp): the game is statically recompiled to a native app, with no emulator. Races run in stereo 3D with head tracking, so you can look into the corners and over the edge of the track. The HUD floats in front of you; menus and movies are on a curved screen. Races run at 60 fps, shown at 120 Hz on Quest 3.

> [!NOTE]
> The APK contains none of the game. You need a disc image dumped from your own copy of Wipeout Pure, **US Greatest Hits edition (UCUS-98612, version 2.00)**. The app checks the image and refuses other editions and regions.

---

### Prerequisites
* Meta Quest 3 or 3S (tested). Quest 2 and Pro are untested and get lighter defaults automatically.
* Your own Wipeout Pure disc image (\`.iso\`, any file name).
* Wi-Fi on the first start: the app downloads the HD texture pack by NR74W (about 450 MB) from its author's GitHub repository. Nothing of the pack is in the APK. To skip it, create an empty file \`files/no-hd-textures\` before the first start.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`WipeoutPure-VR-v0.1.0-beta.apk\` with SideQuest or \`adb install -r\`.
2. Start **Wipeout Pure VR** once (Library > Unknown Sources) so it creates its folder, then quit with the Meta button.
3. Copy your disc image to \`/sdcard/Android/data/online.portroyale.wipeoutpurevr/files/import/\` with a PC file manager (headset on USB, file access allowed), SideQuest's file manager or \`adb push\`.
4. Start the app again. It checks the image, sets the game up in a few seconds and starts it. If the image is not the supported one, \`import/SETUP-ERROR.txt\` says why.

---

### Controls
| Controller | In a race | In the menus |
|---|---|---|
| Left stick | steer | move the cursor |
| Right trigger or A | thrust | confirm |
| Left trigger | fire weapon | |
| Left / right grip | left / right airbrake | |
| X | absorb the weapon (shield energy) | |
| B | look behind | back |
| Y | change the camera view | |
| Menu button or left stick click | pause | |
| Both stick clicks | the port's settings menu | |

Hold the Meta button to re-centre the view.

> [!TIP]
> Saves and settings live in \`files/\` next to \`import/\`. **Uninstalling the app deletes that folder**: copy it to your PC first.`,
    troubleshooting_notes: 'If the app shows a desktop setup screen, no valid disc image was imported yet (install step 3). Open import/SETUP-ERROR.txt to see why an image was refused. The first races may hitch briefly when an effect shows for the first time. No online multiplayer yet. If it does not start, the author asks for files/PureNative.log and files/PureNative-previous.log in a GitHub issue.'
  },
  {
    id: '84',
    slug: 'wc-saga-vr',
    title: 'Wing Commander Saga VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/WCSaga-VR',
    short_description: 'Wing Commander Saga, the free fan game, in head-tracked stereo VR on Meta Quest 3, on the FreeSpace Open engine. A one-tap installer downloads the free game data on first start.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'direct',
    cover_image_url: '/covers/wc-saga-vr.jpg',
    youtube_video_id: '_78A7784kSQ',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated', 'Cockpit View', 'Head Tracking'],
    has_6dof_controls: false,
    internal_storage_path: 'N/A (the app downloads the free game data to /sdcard/WCSaga/Wing_Commander_Saga on first start)',
    base_game_url: 'https://www.wcsaga.com/',
    base_game_store: 'Free (game data downloaded in the app from the FSNebula mod repository)',
    port_download_url: 'https://github.com/SgtBilko76/WCSaga-VR/releases/download/v0.1.5-beta/WCSaga-VR-v0.1.5-beta.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/WCSaga-VR',
    latest_version: 'v0.1.5-beta',
    last_github_update: '2026-10-18T17:05:09Z',
    featured: false,
    installation_guide: `### Overview
**Wing Commander Saga VR** is a beta VR port of Wing Commander Saga: The Darkest Dawn, the free non-commercial fan game, by SgtBilko76 (Port Royale). It runs natively on Meta Quest 3 on the [FreeSpace Open](https://github.com/scp-fs2open/fs2open.github.com) engine with OpenXR: head-tracked stereo space, the HUD fixed in front of your ship, and menus, briefings and cutscenes on a big screen with a laser pointer.

> [!NOTE]
> **Nothing to copy.** The APK holds no game data. On first start the **One-Tap Installer** downloads Wing Commander Saga 0.9.65 (3.6 GB) from the official FSNebula mod repository, checks it and unpacks it on the headset. You need about 9 GB free while it installs; the game uses 6.7 GB afterwards.

---

### Prerequisites
* Meta Quest 3 (the only headset tested).
* About 9 GB of free storage and Wi-Fi for the one-time download (10 to 20 minutes).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`WCSaga-VR-v0.1.5-beta.apk\` with SideQuest or \`adb install -r -g\`.
2. Start **Wing Commander Saga VR** from **Unknown Sources**. The One-Tap Installer opens.
3. Press **Allow file access**, switch it on and press Done.
4. Press **Download and install** and keep the headset on. If the download is interrupted, start the app again and it continues where it stopped. When it finishes, the game starts.

---

### Controls
Flight:

| Input | Action |
|---|---|
| Left stick | Pitch and turn |
| Right stick left / right | Roll |
| Right stick up / down | Throttle (stays where you leave it) |
| Right stick click | Match target speed |
| Left stick click | Autopilot |
| Right trigger | Guns |
| Left trigger | Missiles |
| Right grip (hold) | Afterburner |
| A / B | Target nearest enemy / ship in crosshair |
| X / Y | Next missile type / next gun type |
| Left grip + Y | Comms menu |
| Left grip + left stick click | Look behind |
| Left grip + right stick click | Chase view on / off |

Menus: point with either controller and pull the trigger to click, A is Enter, B or the left Menu button is Escape.

> [!TIP]
> Already have the game data at \`/sdcard/WCSaga/Wing_Commander_Saga/data\`? The installer is skipped. You can also copy a Windows install of the full game plus patch v1.1.0.7822 from wcsaga.com to \`/sdcard/WCSaga/Wing_Commander_Saga\`.`,
    troubleshooting_notes: 'Beta, tested on Quest 3 only. Flight runs at about 26 to 30 fps because the engine renders both eyes on one CPU core; menus run at full speed. Shadows are off by default (Options > Graphics > Shadow Quality). There is no 3D cockpit: Wing Commander Saga has no cockpit models. If the data download stops, start the app again and press Download and install.'
  },
  {
    id: '85',
    slug: 'fotg-vr',
    title: 'Star Wars: Fate of the Galaxy VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/FotG-VR',
    short_description: 'Fate of the Galaxy, the free Star Wars Original Trilogy space combat mod, in stereo VR with full 3D cockpits on Meta Quest 3 and PICO, on the FreeSpace Open engine.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/fotg-vr.jpg',
    youtube_video_id: 'Yy2Cr9rJHQ4',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated', 'Cockpit View', 'Head Tracking'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/FotG/FotG_R/',
    base_game_url: 'https://www.moddb.com/games/fate-of-the-galaxy',
    base_game_store: 'Free (Fate of the Galaxy data from the Nebula mod server, 2.6 GB; FreeSpace 2 is not needed)',
    port_download_url: 'https://github.com/SgtBilko76/FotG-VR/releases/download/v0.1.0-beta/FotG-VR-v0.1.0-beta.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/FotG-VR',
    latest_version: 'v0.1.0-beta',
    last_github_update: '2026-11-03T12:48:15Z',
    featured: false,
    installation_guide: `### Overview
**Star Wars: Fate of the Galaxy VR** is a beta VR port of [Fate of the Galaxy](https://www.moddb.com/games/fate-of-the-galaxy), the free Star Wars Original Trilogy total conversion, by SgtBilko76 (Port Royale). It runs natively on Meta Quest 3 (and PICO) on the [FreeSpace Open](https://github.com/scp-fs2open/fs2open.github.com) engine with OpenXR: head-tracked stereo space, full 3D cockpits with working instruments, and a HUD fixed in front of your ship. Flight holds 72 fps on Quest 3.

> [!NOTE]
> The APK holds no game data. The Fate of the Galaxy data is free (2.6 GB download, about 9 GB on the headset). **FreeSpace 2 is not needed.** The data is put on the headset from a PC.

---

### Prerequisites
* Meta Quest 3 (tested). PICO 4 / Neo 3 are untested.
* A PC with Python 3, 7-Zip and the headset on USB, or Knossos.NET.
* About 9 GB of free storage on the headset.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`FotG-VR-v0.1.0-beta.apk\` with SideQuest or \`adb install -r -g\`.
2. Put the game data on the headset so that \`/sdcard/FotG/FotG_R/data\` holds \`tables\`, \`models\`, \`maps\` and so on. Either:
   * On the PC, run [\`get_fotg_data.py\`](https://github.com/SgtBilko76/FotG-VR/blob/fotg-vr/tools/quest/get_fotg_data.py) as \`python3 get_fotg_data.py --push\`. It downloads the newest release from the official Nebula server, checks it and copies it over.
   * Or install Fate of the Galaxy with [Knossos.NET](https://knossosnet.github.io/Knossos-Release-Page/) on the PC and copy the \`data\` folder from its \`FotG_R-<version>\` folder to \`/sdcard/FotG/FotG_R\` with SideQuest.
3. Start **Fate of the Galaxy VR** from **Unknown Sources** and allow "access to all files" when asked.

---

### Controls
Flight:

| Input | Action |
|---|---|
| Left stick | Pitch and turn |
| Right stick left / right | Roll |
| Right stick up / down | Throttle (stays where you leave it) |
| Right stick click | Match target speed |
| Left stick click (tap / hold 1 s) | Autopilot / warp out (end mission) |
| Right trigger | Guns |
| Left trigger | Missiles |
| Right grip (hold) | Afterburner |
| A / B | Target nearest enemy / ship in crosshair |
| X / Y | Next missile type / next gun type |
| Left grip + Y | Comms menu |
| Left grip + left stick click | Look behind |
| Left grip + right stick click | Chase view on / off |

Menus: point with either controller and pull the trigger to click, A is Enter, B or the left Menu button is Escape.`,
    troubleshooting_notes: 'Beta, tested on Quest 3 only. Deferred lighting is off because it drops the detailed cockpits to about 46 fps. Only the first Rebel mission has been flight-tested so far. If the game does not start, check that /sdcard/FotG/FotG_R/data contains tables, models and maps. On PICO, install with adb and allow storage access.'
  },
  {
    id: '86',
    slug: 'openarena-vr',
    title: 'OpenArena VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/OpenArena-VR',
    short_description: 'OpenArena, the free Quake III style arena shooter, as a 6DoF Quest game with bots and online servers. One self-contained APK, no game files to copy.',
    category: 'source_port',
    status: 'released',
    install_workflow: 'direct',
    cover_image_url: '/covers/openarena-vr.jpg',
    youtube_video_id: 'BDeqjtsSnhw',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (the game data is bundled in the APK and unpacked to /sdcard/OpenArenaVR on first start)',
    base_game_url: 'https://openarena.ws/',
    base_game_store: 'Free (game data is inside the APK)',
    port_download_url: 'https://github.com/SgtBilko76/OpenArena-VR/releases/download/v1.1.0/OpenArena-VR-v1.1.0.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/OpenArena-VR',
    latest_version: 'v1.1.0',
    last_github_update: '2026-10-25T09:46:44Z',
    featured: false,
    installation_guide: `### Overview
**OpenArena VR** is a standalone port of OpenArena 0.8.8 for Meta Quest by SgtBilko76 (Port Royale), built on Team Beef's ioq3quest (the engine behind Quake3Quest). It has Quake3Quest's 6DoF controls: aim and shoot with your hand, a weapon wheel, comfort options and a VR HUD. You get every OpenArena map, character, weapon and game mode, single player against bots and skirmish, and online multiplayer on the real OpenArena server list, including pure and mod servers (missing maps and mod files download automatically).

> [!NOTE]
> **Nothing to copy.** The APK is about 400 MB and has everything inside: no PC, no extra downloads, no game files.

---

### Prerequisites
* Meta Quest 2, 3, 3S or Pro (tested on Quest 3).
* About 400 MB of free storage.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`OpenArena-VR-v1.1.0.apk\` from GitHub Releases.
2. Launch **OpenArena-VR** from **Unknown Sources**.
3. On first start, allow file access when asked. The game data unpacks to \`/sdcard/OpenArenaVR/\` once, which takes about a minute.

---

### Features
* VR crosshair coloured by your health (style in Setup > Game Options).
* VR on-screen keyboard for your player name and other text fields.
* Updating from 1.0.0 keeps your settings and downloaded maps.

> [!TIP]
> PICO 4 / Neo 3 support is in this build but is untested on PICO hardware.`,
    troubleshooting_notes: 'If the game stops after the first start, check that file access is allowed for the app. The first start unpacks about 400 MB, so give it a minute. Online servers that need extra maps or mods download them on join.'
  },
  {
    id: '87',
    slug: 'urbanterror-vr',
    title: 'Urban Terror VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/UrbanTerror4-VR',
    short_description: 'Urban Terror 4.3, the free tactical multiplayer shooter, as a 6DoF Quest game with hand-held guns, two-handed aiming and scopes. The game data downloads in the app.',
    category: 'source_port',
    status: 'released',
    install_workflow: 'direct',
    cover_image_url: '/covers/urbanterror-vr.jpg',
    youtube_video_id: 'iF7uJmtLRZ0',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (the app downloads the free game data to /sdcard/UrTQuest/q3ut4 on first start)',
    base_game_url: 'https://www.urbanterror.info/',
    base_game_store: 'Free (game data downloaded in the app from FrozenSand)',
    port_download_url: 'https://github.com/SgtBilko76/UrbanTerror4-VR/releases/download/v1.0.1/UrbanTerror4-VR-v1.0.1.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/UrbanTerror4-VR',
    latest_version: 'v1.0.1',
    last_github_update: '2026-10-25T17:21:04Z',
    featured: false,
    installation_guide: `### Overview
**Urban Terror VR** is Urban Terror 4.3 as a standalone 6DoF VR game for Meta Quest, by SgtBilko76 (Port Royale), built on Team Beef's ioq3quest with the VR integration modelled on QuakeQuest. Urban Terror is a free multiplayer tactical shooter by FrozenSand. Every weapon sits in your hand at its real size, with its barrel lined up on the crosshair. Hold the left grip near the gun for two-handed aiming, and zoom scopes that follow your hand. You can play offline against bots from the main menu or online through Urban Terror's master servers (servers that require an Urban Terror account login are not supported yet).

> [!NOTE]
> The game data is not in the APK. On first start the app downloads Urban Terror 4.3.4 from FrozenSand's official server (1.4 GB, size and MD5 checked) and installs it to \`/sdcard/UrTQuest/q3ut4\`. About 3 GB of free space is needed while installing.

---

### Prerequisites
* Meta Quest (tested on Quest 3). The same APK is built for PICO 4 / Neo 3, untested.
* About 3 GB of free storage and Wi-Fi for the one-time download.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`UrbanTerror4-VR-v1.0.1.apk\` from GitHub Releases.
2. Start **Urban Terror VR** from **Unknown Sources** and allow file access.
3. On the first start press **I agree - download and install** and wait.
4. Change your player name (it starts as \`QuestPlayer\`) in the game's player setup. Clicking a text field with the laser opens a virtual keyboard.

---

### Controls
| Button | Action |
|---|---|
| Right trigger | Fire |
| Right grip | Reload |
| Right stick up / down | Next / previous weapon |
| Right stick left / right | Snap turn |
| Right stick click | Scope zoom (each press one step, then back) |
| B / A | Jump / crouch |
| X | Fire mode |
| Y | Bandage |
| Left trigger | Use: doors, defuse, pick up |
| Left stick | Move; click and hold to sprint |
| Left grip (hand near the gun) | Grab the front grip: two-handed aiming |
| Menus | Point with the right controller, trigger = click |

> [!TIP]
> Already have Urban Terror 4.3? Copy its \`q3ut4\` folder to \`/sdcard/UrTQuest/q3ut4\` instead of downloading. Version 1.0.1 installs over 1.0.0 and keeps your settings.`,
    troubleshooting_notes: 'The first start needs Wi-Fi to download 1.4 GB. If it stops, start the app again. The scoreboard has no button in this layout. Servers that require an Urban Terror account login are not supported yet.'
  },
  {
    id: '88',
    slug: 'scud-race-vr',
    title: 'Port0r: Scud Race VR (Scud Race)',
    developer: 'jacquesdupontd (Port0r)',
    developer_url: 'https://github.com/jacquesdupontd',
    short_description: 'Scud Race (1996 arcade, Sega Model 3) in true stereoscopic 3D, standalone on Meta Quest 3. Built on MAME with Port0r\'s renderer that redraws every polygon for each eye: HD textures, a full cockpit view, Logitech wheel support over USB-C and the cabinet\'s own settings.',
    category: 'emulator',
    status: 'playable_beta',
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/scud-race-vr.jpg',
    youtube_video_id: 'r90VKyOhWvY',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Seated Driving', 'Stick Steering'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Scud_Race',
    base_game_store: 'Requires your own copy (MAME 0.289 set scud.zip)',
    port_download_url: 'https://github.com/jacquesdupontd/port0r/releases/download/scud-v0.2.1/Port0r-ScudRaceVR-v0.2.1-quest3.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/jacquesdupontd/port0r',
    latest_version: 'scud-v0.2.1',
    last_github_update: '2026-11-02T22:44:49Z',
    featured: false,
    installation_guide: `### Overview
**Port0r: Scud Race VR** brings Sega AM2's 1996 arcade racer *Scud Race* (Sega Model 3) to Meta Quest 3 as a standalone app in **true stereoscopic 3D**. The arcade code runs through MAME (0.289), and Port0r's own renderer redraws every 3D polygon for each eye, so you sit in the car instead of watching a flat screen. It is from the same developer as [Port0r: Daytona USA VR](/ports/daytona-usa-vr), [Port0r: Rally VR](/ports/sega-rally-vr) and [Port0r: Cop VR](/ports/virtua-cop-vr).

**Install type: APK + your own game files.**

Highlights (v0.2.1):
* HD textures switched on from the start, the arcade's distance fog, and real glass on the cars.
* A complete cockpit view: dashboard, gauges, steering wheel and the driver's arms.
* **Logitech wheels work in standalone** through the headset's USB-C port, with force feedback.
* Controller vibration on every hit and crash, plus HUD size and seat height settings.
* Menus and attract mode on a big screen in front of you, like the arcade monitor.

> [!NOTE]
> **No game data is included.** You need your own, legally owned copy of the arcade game as the MAME set **\`scud.zip\`**, kept zipped. The set must match **MAME 0.289**. Fan project, not affiliated with SEGA or Meta.

---

### Prerequisites
1. **Meta Quest 3.** The APK is about 237 MB.
2. **Developer Mode** enabled (free developer organisation at developer.oculus.com, then Meta Horizon app > Devices > Headset settings > Developer mode, then restart the headset).
3. Your MAME 0.289 \`scud.zip\`.

---

### Step-by-Step Installation

#### 1. Install the APK
Download **\`Port0r-ScudRaceVR-v0.2.1-quest3.apk\`** via 1-click on QuestPorts, from [GitHub Releases](https://github.com/jacquesdupontd/port0r/releases/tag/scud-v0.2.1) or [itch.io](https://port0r.itch.io/scud-race-vr). Install it with SideQuest (**Install APK file from folder**) or:

\`\`\`bash
adb install -r Port0r-ScudRaceVR-v0.2.1-quest3.apk
\`\`\`

The APK checksum is in \`SHA256SUMS.txt\` on the release page.

#### 2. Copy your game file
Put \`scud.zip\` in the headset's **\`Download\`** folder. The app searches the whole storage, so a \`ROMS\` folder from other emulators works too, and names are not case sensitive.

\`\`\`bash
adb push scud.zip /sdcard/Download/
\`\`\`

You can also copy it with SideQuest's file browser, over USB (accept **Allow access to data** in the headset; on a Mac use OpenMTP), or download it from your own cloud storage with the headset's browser (it lands in \`Download\`).

#### 3. First launch
1. Open **Library**, set the filter to **Unknown sources** and start **Port0r: Scud Race VR**.
2. Allow **All files access** when the headset asks.
3. Come back to the app: the game is copied in and starts by itself. Until then, a screen tells you which files are missing.

> [!TIP]
> The app checks its own releases at launch and offers the new version. Installing a new APK over the old one keeps your settings and records.`,
    troubleshooting_notes: 'File reported missing: the file must be named scud.zip and kept zipped (not an extracted folder), and All files access must be allowed (Settings > Apps > Port0r: Scud Race VR > Permissions). "Wrong version of the game files": the set must match MAME 0.289; check it with a ROM manager (ClrMamePro, RomVault) and drop the corrected zip on the headset in place of the old one. Controllers do nothing: restart the headset. The game stutters: lower the resolution or turn on dynamic resolution in the settings. App not in the Library: look under Unknown sources; Developer Mode must be on and the headset restarted. Fan project, not affiliated with SEGA or Meta; no game data is provided.'
  },
  {
    id: '89',
    slug: 'south-park-vr',
    title: 'South Park VR',
    developer: 'VistaLargaGames',
    developer_url: 'https://github.com/VistaLargaGames',
    short_description: 'South Park (N64, 1998) running natively on Meta Quest 3 as recompiled code. Head-aim or wrap-around camera, 60 fps, a floating HUD and online co-op (beta). Bring your own US ROM.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/south-park-vr.jpg',
    youtube_video_id: 'xnINbs_mo9I',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Smooth Locomotion', 'Smooth Turn', 'Head Tracking'],
    has_6dof_controls: false,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/South_Park_(video_game)',
    base_game_store: 'Requires your own copy (Nintendo 64 cartridge ROM, South Park USA)',
    port_download_url: 'https://github.com/VistaLargaGames/South-Park-Quest-VR/releases/download/v0.1.0/SouthParkVR-Quest-0.1.0.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/VistaLargaGames/South-Park-Quest-VR',
    latest_version: 'v0.1.0',
    last_github_update: '2026-11-02T20:58:22Z',
    featured: false,
    installation_guide: `### Overview
**South Park VR** runs the Nintendo 64 shooter *South Park* (Iguana Entertainment / Acclaim, 1998) natively on Meta Quest 3 as recompiled code, not an emulator. You can look around with your headset and the game's camera follows. It is built on [N64Recomp](https://github.com/N64Recomp/N64Recomp), N64ModernRuntime and RT64 by VistaLargaGames.

**Install type: APK + your own ROM.**

Highlights:
* 60 FPS, with in-between pictures added on top of the game's own frames.
* Two cameras, picked in the start window or switched in game by clicking the right stick: **Head aim** (the game's camera and your snowballs follow your head) and **Wrap-around** (a big curved screen that stays in the room).
* A floating HUD with health and ammo, and the intro screens are skipped.
* **Online co-op (beta):** play story mode with a friend, each on their own Quest, with a 4-digit room code.

> [!NOTE]
> **No game files included.** Unofficial fan project. You need your own ROM made from your own cartridge: **South Park (USA)**. Any file name works.

---

### Prerequisites
* Meta Quest 3.
* Your own South Park (USA) ROM (\`.z64\`, \`.n64\` or \`.v64\`).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install \`SouthParkVR-Quest-0.1.0.apk\` with SideQuest / \`adb install\`.
2. Put your ROM on the headset, for example in \`/sdcard/Download/\`.
3. Start **South Park VR** from **Library > Unknown Sources**.
4. In the start window choose your ROM. The game checks the file and remembers it; after that just press **Play**.

---

### Controls
| Button | Action |
|---|---|
| Left stick | Walk / strafe |
| Right stick | Turn |
| A or left trigger | Jump |
| B | Change weapon |
| Right trigger | Throw |
| Y | L |
| Left menu button | Start / pause |
| Right stick click | Switch camera (head aim / wrap-around) |

> [!TIP]
> Turn on **Options > Crosshairs** to see where your snowballs go. To play online, one player taps **Online co-op: host a room** and gives the friend the 4-digit code; the friend taps **Online co-op: join a room**. Both need the same version of the app.`,
    troubleshooting_notes: 'Version 0.1.0 is the first release. Known bugs: some polygons flicker or disappear in a few places (for example near Jimbo\'s), and the wrap-around screen looks softer than head aim. Online co-op is in beta, so expect some lag. If the start window refuses the ROM, it must be South Park (USA); other regions and hacks are not supported. Allow file access when the headset asks.'
  },
  {
    id: '90',
    slug: 'metroid-prime-2-vr',
    title: 'PrimedGun Echoes (Metroid Prime 2 VR)',
    developer: 'iChris4',
    developer_url: 'https://github.com/iChris4',
    short_description: 'Metroid Prime 2: Echoes in native VR on Quest, no emulator. Built from the PrimeDecomp decompilation with 6DOF arm cannon aiming, room-scale movement, beam and visor gestures, a 3D map and an in-headset settings panel. Alpha. Bring your own disc image.',
    category: 'decompilation',
    status: 'playable_beta',
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/metroid-prime-2-vr.jpg',
    youtube_video_id: 'F710WBfa0sY',
    supported_hardware: ['Quest 3'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Roomscale'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Metroid_Prime_2:_Echoes',
    base_game_store: 'Requires your own copy (GameCube disc image, Metroid Prime 2: Echoes USA)',
    port_download_url: 'https://github.com/iChris4/MetroidPrime2PortVR/releases/download/v1.0.0-alpha.4/PrimedGunEchoes-v1.0.0-alpha.4-Quest.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/iChris4/MetroidPrime2PortVR',
    latest_version: 'v1.0.0-alpha.4',
    last_github_update: '2026-11-02T03:22:52Z',
    featured: false,
    installation_guide: `### Overview
**PrimedGun Echoes** is *Metroid Prime 2: Echoes* in native VR on standalone Meta Quest. It is not an emulator: it carries the VR layer of [PrimedGun v2](https://github.com/iChris4/MetroidPrimePortVR) onto [Echoes Unbound](https://github.com/Odrannnn/MetroidPrime2Port), Odrannnn's native port built from the PrimeDecomp decompilation. It keeps the controls of the original [PrimedGun](/ports/primedgun).

**Install type: APK + your own disc image.**

Highlights (v1.0.0-alpha.4):
* 6DOF arm cannon tracking for aiming, grapple and lock-on, with left-handed play.
* Room-scale movement, snap or smooth turning, one-click height calibration and an adjustable cannon position.
* Beam wheel and visor gestures, a 3D map and the pause screens in the headset.
* In-headset settings for controls, calibration and graphics, plus **Setup > Check for updates** inside the app.

> [!WARNING]
> **Alpha.** Expect rough edges and keep normal in-game saves. The Seeker Missile multi-lock, the Screw Attack camera and the turrets still use the original pad behaviour, and local multiplayer does not work in VR. Tested on Quest 3 only.

> [!NOTE]
> **No game data is included.** You need your own, legally owned disc image of Metroid Prime 2: Echoes. USA (\`G2ME01\`) is the tested release; PAL (\`G2MP01\`) and Metroid Prime Trilogy are experimental. Fan project, not affiliated with Nintendo.

---

### Prerequisites
1. **Meta Quest 3** with Developer Mode enabled. The APK is about 31 MB.
2. Your Echoes disc image: \`.iso\`, \`.nkit.iso\`, \`.gcm\`, \`.rvz\`, \`.wia\`, \`.ciso\` or \`.wbfs\`.

---

### Step-by-Step Installation

#### 1. Install the APK
Download **\`PrimedGunEchoes-v1.0.0-alpha.4-Quest.apk\`** via 1-click on QuestPorts or from [GitHub Releases](https://github.com/iChris4/MetroidPrime2PortVR/releases/tag/v1.0.0-alpha.4). Install it with SideQuest or:

\`\`\`bash
adb install -r PrimedGunEchoes-v1.0.0-alpha.4-Quest.apk
\`\`\`

The checksum is in \`SHA256SUMS.txt\` on the release page.

#### 2. Put the disc image on the headset
Copy the image to any folder you can reach, for example \`Download\`:

\`\`\`bash
adb push "Metroid Prime 2 - Echoes (USA).iso" /sdcard/Download/
\`\`\`

#### 3. First launch
1. Open **Library**, set the filter to **Unknown sources** and start **PrimedGun Echoes**.
2. Tap **Select Game** and choose your disc image.
3. Tap **Play** to enter VR.
4. In the game, click the right stick to set your height. Click the left stick to open or close the VR menu.
5. Use **Calibration** to place the arm cannon, and the **Layout** tab to see the controller bindings.

> [!TIP]
> Install new versions over the old one and never uninstall, or you lose your saves. From alpha.4 the launcher has **Setup > Check for updates**, which downloads the APK, checks it and opens the Quest installer. **Import PrimedGun Settings** brings over your VR settings from PrimedGun v2 or the Dolphin PrimedGun. Game data is kept in \`/sdcard/Android/data/org.primedgun.echoes/files\`.`,
    troubleshooting_notes: 'Alpha release: back up your saves, and make a normal in-game save before updating because alpha.3 save states are incompatible. Never uninstall to update; install the new APK over the old one. Select Game refuses the disc: USA (G2ME01) is the tested release, PAL and Trilogy are experimental, and a corrupt or partial image will not load. Seeker Missile multi-lock, the Screw Attack camera and the turrets keep the pad behaviour for now, and local multiplayer is not supported in VR. Tested on Quest 3 only.'
  },
  {
    id: '91',
    slug: 'xonotic-vr',
    title: 'Xonotic VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76/Xonotic-VR',
    short_description: 'Xonotic, the free and fast open-source arena shooter, as a standalone 6DoF Quest game with a hand-held weapon, bots and online servers. One self-contained APK, no game files to copy.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'direct',
    cover_image_url: '/covers/xonotic-vr.jpg',
    youtube_video_id: 'w-yJB0LtcFU',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (the game data is bundled in the APK and unpacked to /sdcard/XonoticVR on first start)',
    base_game_url: 'https://xonotic.org/',
    base_game_store: 'Free (game data is inside the APK)',
    port_download_url: 'https://github.com/SgtBilko76/Xonotic-VR/releases/download/Beta-0.5/Xonotic-VR-full-release.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/Xonotic-VR',
    latest_version: 'Beta-0.5',
    last_github_update: '2026-10-05T09:38:53Z',
    featured: false,
    installation_guide: `### Overview
**Xonotic VR** is a standalone port of Xonotic 0.8.6 for Meta Quest by SgtBilko76 (Port Royale). Xonotic is a free, open-source arena shooter with fast movement and a large arsenal, each weapon with a primary and a secondary fire. Deathmatch, Capture The Flag, Clan Arena, Nexball, Freeze Tag and Multiplayer Race are all here. This port runs the real game natively on the headset, with room-scale head tracking, the weapon held in your hand, offline matches against bots and the game's own server browser for online play.

> [!NOTE]
> **Nothing to copy.** The release APK is self-contained: the game data is bundled, so there is no PC step and no extra download.

---

### Prerequisites
* Meta Quest 2, 3, 3S or Pro (developed and tested on Quest 3).
* About 3 GB of free storage. The APK is about 1.1 GB and the game data unpacks to about 1.8 GB.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`Xonotic-VR-full-release.apk\` from GitHub Releases.
2. Open **Library**, set the filter to **Unknown Sources** and start **Xonotic VR**.
3. On first start, allow storage access when asked. The game data unpacks to \`/sdcard/XonoticVR\` once, which takes a few minutes. The game then starts by itself.

---

### Controls (right-handed defaults)
| Control | Action |
| --- | --- |
| Right trigger | Fire |
| Right grip | Secondary fire |
| Left stick | Move |
| Left trigger | Jump |
| Left grip | Grappling hook |
| Right stick up / down | Zoom / crouch |
| A / B | Next / previous weapon |
| X | Use |
| Y | Scoreboard |
| Right stick click | Recenter the view |
| Left menu button | Menu / Escape |

Turning is snap by default. In menus the sticks move the cursor, A confirms and B goes back.

> [!TIP]
> Everything is a normal Xonotic console variable. Your own settings are safest in a separate \`myconfig.cfg\`, because \`vr.cfg\` is rewritten when a release ships new VR defaults. The port README explains how.`,
    troubleshooting_notes: 'This is a Beta (0.5). The first start unpacks about 1.8 GB and can take a few minutes, so wait for the game to start by itself. If it does not, check that storage access is allowed for the app and that about 3 GB is free. If the frame rate drops, lower vr_supersampling or raise vr_foveation. PICO is listed by the author but untested here.'
  },
  {
    id: '92',
    slug: 'strikers-charged-vr',
    title: 'Mario Strikers Charged VR',
    developer: 'LanceSweatpants',
    developer_url: 'https://github.com/LanceSweatpants',
    short_description: 'Mario Strikers Charged (Wii, 2007) running natively on Meta Quest 3, built from the community decompilation. Play on a giant screen in your room or in a VR stadium, with the Touch controllers as a Wii Remote and Nunchuk.',
    category: 'decompilation',
    status: 'in_development',
    install_workflow: 'emulator_roms',
    cover_image_url: '/covers/strikers-charged-vr.jpg',
    youtube_video_id: 'qouu9d4fPxI',
    supported_hardware: ['Quest 3', 'Quest 3S'],
    locomotion_types: ['Seated', 'Roomscale', 'Mixed Reality (passthrough)'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/Download/',
    base_game_url: 'https://en.wikipedia.org/wiki/Mario_Strikers_Charged',
    base_game_store: 'Requires your own copy (Wii disc image, Mario Strikers Charged USA R4QE01 revision 1)',
    port_download_url: 'https://github.com/LanceSweatpants/Quest-3-Strikers-CHARGED/releases/download/v0.1.1-alpha1.1/QuestStrikersCharged-alpha1.1.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/LanceSweatpants/Quest-3-Strikers-CHARGED',
    latest_version: 'v0.1.1-alpha1.1',
    last_github_update: '2026-10-16T01:02:57Z',
    featured: false,
    installation_guide: `### Overview
**Mario Strikers Charged VR** is *Mario Strikers Charged* (Wii, 2007) running natively on a Meta Quest 3. It is not an emulator: the game is built from the community decompilation (a fork of \`yannicksuter/mscharged-port\`), compiled for the headset and drawn through OpenXR. By LanceSweatpants, the same author as Quest 3 Strikers (Super Mario Strikers).

**Install type: APK + your own disc image.**

> [!WARNING]
> **Free alpha, Quest 3 and 3S only.** This is a **3D screen, not immersive VR gameplay**: you watch the match on a giant screen floating in your room (passthrough) or from a VR stadium. Expect rough edges. Quest 2 and Quest Pro are untested. Online play and a tabletop mode are announced for later updates.

> [!NOTE]
> **No game files are included.** You need your own copy of Mario Strikers Charged: the **USA version (\`R4QE01\`), revision 1**, as \`.iso\`, \`.rvz\` or \`.wia\`. Other regions and revisions do not work yet. Fan project, not affiliated with Nintendo.

---

### Prerequisites
1. **Meta Quest 3 or 3S** with Developer Mode enabled. The APK is about 15 MB.
2. Your disc image as \`.iso\`, \`.rvz\` or \`.wia\`. Unzip it first if it is zipped.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`QuestStrikersCharged-alpha1.1.apk\` from GitHub Releases.
2. Put your disc image in \`/sdcard/Download/\` on the headset.
3. Open **Library**, set the filter to **Unknown Sources** and start **Quest 3 Strikers Charged**.
4. First time only: turn on **Allow access to manage all files** so the app can find your game, then go back.
5. Press **Start**. If it does not find the game, press **Choose game file** and pick yours: it lists every \`.iso\`, \`.rvz\` and \`.wia\` on the headset and says what is wrong with any it cannot use.

---

### Controls
The Touch controllers stand in for a Wii Remote and Nunchuk.

| Control | Action |
| --- | --- |
| Left stick | Run |
| A | Pass |
| Right trigger or B | Shoot |
| Y (or B when the other team has the ball) | Tackle |
| X | Use your item |
| Left trigger | Nunchuk Z |
| Right grip | Wii Remote minus button |
| Menu button | Pause |

Menus: aim the right controller at the screen and press A. Tap the left stick twice fast to switch between **Living Room** and **Stadium**. Hold the left grip to move the screen, or both grips to resize it.

> [!TIP]
> When a new version is out, the start screen shows **Update now**. Your saves and your game file stay.`,
    troubleshooting_notes: 'Alpha release. Only the USA R4QE01 revision 1 disc works. If the game is not found, allow All files access for the app and use Choose game file. Goal celebrations in the VR stadium, some menus and the end-of-game screens can dip below 60 fps for a moment, and the first time a new scene plays it can hitch while the headset prepares its graphics.'
  },
  {
    id: '93',
    slug: 'lba2-vr',
    title: 'Little Big Adventure 2 Classic Quest',
    developer: 'simsas-experiments',
    developer_url: 'https://github.com/simsas-experiments',
    short_description: 'Twinsen\'s Odyssey (Little Big Adventure 2) as a native Quest port of the LBA2 Classic community engine, with stereo 3D, 6DoF tracking and a first-person IK body. You supply the game data.',
    category: 'source_port',
    status: 'in_development',
    install_workflow: 'pc_assets',
    cover_image_url: '/covers/lba2-vr.jpg',
    youtube_video_id: 'z6Ls3HKnBZM',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
    has_6dof_controls: true,
    internal_storage_path: '/sdcard/lba2cc/',
    base_game_url: 'https://www.gog.com/game/little_big_adventure_2',
    base_game_store: 'Requires your own copy (GOG, Steam or retail CD, Little Big Adventure 2)',
    port_download_url: 'https://github.com/simsas-experiments/lba2-classic-quest/releases/download/v0.0.3/lba2cc-0.0.3-quest-arm64-v8a.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/simsas-experiments/lba2-classic-quest',
    latest_version: 'v0.0.3',
    last_github_update: '2026-11-05T15:13:21Z',
    featured: false,
    installation_guide: `### Overview
**Little Big Adventure 2 Classic Quest** is *Twinsen's Odyssey* (LBA2, 1997) on Meta Quest. It is a fork of the LBALab community engine [lba2-classic-community](https://github.com/LBALab/lba2-classic-community) with a Quest/OpenXR port on top: native stereo 3D, 6DoF head and controller tracking, a first-person IK body and camera, an interior 3D parallax diorama effect, passthrough, and graphics options (texture filters, MSAA/FXAA, soft shadows, xBR movie upscaling). The original gameplay and assets are kept. The target is 72 fps.

**Install type: APK + your own game data.**

> [!WARNING]
> **Very early release (v0.0.3).** The author says the port was developed with AI coding agents and is not an official LBALab release, so treat it as experimental and keep backups of your saves.

> [!NOTE]
> **No game data is included.** You need your own legitimate copy of LBA2 from [GOG](https://www.gog.com/game/little_big_adventure_2), [Steam](https://store.steampowered.com/app/398000/Little_Big_Adventure_2/) or your retail CD. The engine is GPL-2.0 but the game assets are not redistributable.

---

### Prerequisites
1. **Meta Quest 2, 3 or Pro** with Developer Mode enabled. The Quest APK is about 25 MB.
2. The LBA2 data folder from your copy: the folder that holds \`lba2.hqr\`, with \`music\`, \`video\`, \`vox\` and the other folders next to it (a \`Common\` or \`CommonClassic\` subfolder also works).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download \`lba2cc-0.0.3-quest-arm64-v8a.apk\` from GitHub Releases.
2. Copy your LBA2 data folder to \`/sdcard/lba2cc/\` on the headset. The author's PC installer scripts (Linux, macOS, Windows) can do the copy and the install for you over USB.
3. Open **Library**, set the filter to **Unknown Sources** and start the game.
4. If the game cannot read its data, allow **All files access** for the app in the Quest settings. The author's installer grants it with \`adb shell appops set org.lbalab.lba2cc MANAGE_EXTERNAL_STORAGE allow\`.

---

### Controls
| Control | Action |
| --- | --- |
| A | Confirm / use |
| B | Camera / back |
| X | Inventory |
| Y | Holomap |
| Menu button | Menu |

The README has a full controller map, spell chords and the VR zoom and screen options.

> [!TIP]
> If an older build used a different signing key, the author's installer has a clean option (\`--clean\`). App-local saves can be lost, but the game data in \`/sdcard/lba2cc/\` is kept.`,
    troubleshooting_notes: 'Early release (v0.0.3, 5 Nov 2026) from a one-person fork that is updated almost daily. If the game cannot find its data, check that the folder with lba2.hqr is under /sdcard/lba2cc/ and that All files access is allowed. Keep backups of your saves before updating.'
  },
  {
    id: '94',
    slug: 'bugdom-vr',
    title: 'Bugdom VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76',
    short_description: 'The 1999 classic Pangea 3D action-adventure Bugdom rebuilt for Meta Quest with OpenXR, stereoscopic 3D, and Touch controls. Roll, kick, and fly as Rollie McFly to save the ladybugs.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'direct',
    cover_image_url: '/covers/bugdom-vr.jpg',
    youtube_video_id: '-leTy9bmmY0',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Third-person VR'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (game data is bundled in the APK)',
    base_game_url: 'https://github.com/jorio/Bugdom',
    base_game_store: 'Free (game data is bundled under CC BY-NC-SA 4.0)',
    port_download_url: 'https://github.com/SgtBilko76/Bugdom/releases/download/v1.3.5-vr-beta1/Bugdom-VR-1.3.5-beta1.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/Bugdom',
    latest_version: 'v1.3.5-vr-beta1',
    last_github_update: '2026-10-01T11:26:07Z',
    featured: false,
    installation_guide: `### Overview
**Bugdom VR** is the classic 1999 Pangea Software Macintosh action-adventure *Bugdom* updated for modern VR headsets by SgtBilko76 (Port Royale). You play as Rollie McFly, a pill bug on a quest to save the ladybugs from King Thorax's swarm.

Built from Iliyas Jorio's modern source port (\`jorio/Bugdom\`) with an OpenXR VR backend, the port delivers stereoscopic 3D, 6DoF head tracking, a level-horizon chase camera, sRGB color handling, and full Touch controller input.

**Install type: Direct APK (No PC needed).**

> [!NOTE]
> **Full game included.** The game assets are re-released under CC BY-NC-SA 4.0 with permission from Pangea Software, Inc., and are bundled directly inside the APK. No game data copy required.

---

### Prerequisites
* Meta Quest 2, 3, 3S, or Pro with Developer Mode enabled.
* About 100 MB of free storage.

---

### Step-by-Step Installation
1. Sideload the APK via 1-click on QuestPorts or download \`Bugdom-VR-1.3.5-beta1.apk\` from GitHub Releases.
2. Open **Library**, switch the filter to **Unknown Sources**, and launch **Bugdom**.
3. Point with the right controller laser to navigate menus, then jump into the game.

---

### Controls
| Control | Action |
| --- | --- |
| Left stick | Move / Roll |
| Right stick | Snap turn (30°) |
| Hold Right stick click (1s) | Recenter forward & eye height |
| A | Jump |
| B | Ball mode (roll) |
| X or Right Trigger | Kick |
| Y | Call buddy |
| Menu button | Pause menu |
| Right controller laser | Point & click in menus |`,
    troubleshooting_notes: 'First beta release (v1.3.5-vr-beta1). Tested on Quest 3; Quest 2, 3S, and Pro are compatible. If the camera angle or height feels offset, hold the right stick click for 1 second to recenter.'
  },
  {
    id: '95',
    slug: 'bugdom-2-vr',
    title: 'Bugdom 2 VR',
    developer: 'SgtBilko76',
    developer_url: 'https://github.com/SgtBilko76',
    short_description: 'The 2002 sequel Bugdom 2 by Pangea Software brought to Meta Quest via OpenXR. Fly, swim, and buzz across giant 3D backyards as Skip the grasshopper in native stereoscopic VR.',
    category: 'source_port',
    status: 'playable_beta',
    install_workflow: 'direct',
    cover_image_url: '/covers/bugdom-2-vr.jpg',
    youtube_video_id: 'RxfCzJINBjQ',
    supported_hardware: ['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
    locomotion_types: ['Smooth Locomotion', 'Snap Turn', 'Third-person VR'],
    has_6dof_controls: true,
    internal_storage_path: 'N/A (game data is bundled in the APK)',
    base_game_url: 'https://github.com/jorio/Bugdom2',
    base_game_store: 'Free (game data is bundled under CC BY-NC-SA 4.0)',
    port_download_url: 'https://github.com/SgtBilko76/Bugdom2/releases/download/v4.0.1-vr-beta1/Bugdom2-VR-4.0.1-beta1.apk',
    port_download_source: 'GitHub Releases',
    github_url: 'https://github.com/SgtBilko76/Bugdom2',
    latest_version: 'v4.0.1-vr-beta1',
    last_github_update: '2026-10-01T12:47:54Z',
    featured: false,
    installation_guide: `### Overview
**Bugdom 2 VR** is the standalone Meta Quest port of Pangea Software's 2002 hit *Bugdom 2* by SgtBilko76 (Port Royale). You control Skip the grasshopper on a mission to track down the bully bee who stole your knapsack.

Running natively via OpenXR from Iliyas Jorio's modern engine port (\`jorio/Bugdom2\`), this release features full 6DoF head tracking, stereoscopic 3D, a level-horizon chase camera, floating VR HUD, and immersive tunnel rides and balsa airplane sequences in VR.

**Install type: Direct APK (No PC needed).**

> [!NOTE]
> **Full game included.** Game data is bundled inside the APK under CC BY-NC-SA 4.0 permission from Pangea Software, Inc. On first start, data unpacks automatically.

---

### Prerequisites
* Meta Quest 2, 3, 3S, or Pro with Developer Mode enabled.
* About 200 MB of free storage.

---

### Step-by-Step Installation
1. Sideload the APK via 1-click on QuestPorts or download \`Bugdom2-VR-4.0.1-beta1.apk\` from GitHub Releases.
2. Open **Library**, switch the filter to **Unknown Sources**, and launch **Bugdom 2**.
3. First launch takes a few seconds longer while assets unpack.

---

### Controls
| Control | Action |
| --- | --- |
| Left stick | Walk / Fly |
| Right stick | Snap turn (30°) |
| Hold Right stick click (1s) | Recenter forward & eye height |
| Left stick click | Adjust camera distance |
| A | Jump |
| B | Pick up / Drop items |
| X or Right Trigger | Kick |
| Y | Launch buddy |
| Menu button | Pause menu |
| Grips | Previous / Next page in menus |`,
    troubleshooting_notes: 'First beta release (v4.0.1-vr-beta1). First launch takes a few extra seconds while game assets unpack. Hold the right stick click for 1 second to recenter camera height and forward direction at any time.'
  }
]
