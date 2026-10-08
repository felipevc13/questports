-- Seed Data for QuestPorts (Phase 1 MVP: First 8 Consolidated Ports)

INSERT INTO public.ports (
  slug,
  title,
  developer,
  developer_url,
  short_description,
  category,
  status,
  cover_image_url,
  youtube_video_id,
  supported_hardware,
  locomotion_types,
  has_6dof_controls,
  internal_storage_path,
  base_game_url,
  base_game_store,
  port_download_url,
  port_download_source,
  featured,
  installation_guide,
  troubleshooting_notes
) VALUES
(
  'rtcwquest',
  'RTCWQuest (Return to Castle Wolfenstein)',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Full 6DoF VR source port of Return to Castle Wolfenstein by Team Beef featuring dual-wield weapons, gesture interactions, and roomscale immersion.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  'IWM7vi_OP6E',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
  true,
  '/sdcard/RTCWQuest/',
  'https://store.steampowered.com/app/9010/Return_to_Castle_Wolfenstein/',
  'Steam',
  'https://sidequestvr.com/app/1446/rtcwquest',
  'SideQuest',
  true,
  '### Prerequisites
* A legally owned copy of *Return to Castle Wolfenstein* (Steam or GOG).
* Meta Quest headset with Developer Mode enabled or the SideQuest app (Desktop or Android).

### Step-by-Step Installation
1. Install the **RTCWQuest** APK using SideQuest or run `adb install rtcwquest.apk`.
2. Launch RTCWQuest once inside your headset to allow it to initialize folder permissions, then exit.
3. On your computer, open your base game''s installation directory in Steam:
   `steamapps/common/Return to Castle Wolfenstein/Main/`
4. Copy the following `.pk3` game files:
   * `pak0.pk3`
   * `sp_pak1.pk3`
   * `sp_pak2.pk3`
   * `sp_pak3.pk3`
   * `sp_pak4.pk3`
5. Connect your Quest to your PC via USB and copy these files into:
   `/sdcard/RTCWQuest/main/`
6. Put on your headset and launch RTCWQuest from the "Unknown Sources" library tab.',
  'If the game crashes on startup, ensure that all .pk3 file extensions are in lowercase on the Quest storage.'
),
(
  'lambda1vr',
  'Lambda1VR (Half-Life 1)',
  'Team Beef',
  'https://www.lambda1vr.com/',
  'Complete native 6DoF VR port of legendary Half-Life 1 with two-handed weapon handling, headlamp flashlight, and full campaign progression.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  '-Fa1ce9x88Y',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Teleport', 'Snap Turn'],
  true,
  '/sdcard/xash/',
  'https://store.steampowered.com/app/70/HalfLife/',
  'Steam',
  'https://www.lambda1vr.com/',
  'Official Website / SideQuest',
  true,
  '### Prerequisites
* Original Half-Life 1 on Steam.
* Lambda1VR launcher installed via SideQuest.

### Step-by-Step Installation
1. Install **Lambda1VR** through SideQuest.
2. Launch the app once on the headset so it generates the `/sdcard/xash/` directory structure.
3. On your PC, navigate to your Steam installation of Half-Life: `Half-Life/valve/`.
4. Copy the contents of the `valve` folder.
5. Paste the copied files into `/sdcard/xash/valve/` on your Meta Quest.
6. Launch Lambda1VR from "Unknown Sources" in your app library.',
  'For high-resolution textures and enhanced models, download the optional HD Mod Pack from the official Lambda1VR website.'
),
(
  'doom3quest',
  'Doom 3: Quest Edition',
  'Team Beef',
  'https://www.doom3quest.com/',
  'Full immersive virtual reality port of the original id Tech 4 Doom 3 masterpiece running standalone on Meta Quest.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  'y2y9C0E2kPk',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn', 'Comfort Vignette'],
  true,
  '/sdcard/Doom3Quest/',
  'https://store.steampowered.com/app/9050/DOOM_3/',
  'Steam',
  'https://www.doom3quest.com/',
  'Doom3Quest.com',
  true,
  '### Prerequisites
* **Original 2004 Doom 3** (Note: Doom 3: BFG Edition is **NOT** compatible).
* SideQuest or ADB installed on your computer.

### Step-by-Step Installation
1. Install the Doom3Quest APK launcher via SideQuest.
2. Connect your Quest and open file explorer at `/sdcard/Doom3Quest/base/`.
3. From your original 2004 Doom 3 install on PC (`DOOM 3/base/`), copy all `.pk4` files (`pak000.pk4` through `pak008.pk4`).
4. Paste the `.pk4` files into `/sdcard/Doom3Quest/base/`.
5. Launch Doom3Quest on your headset.',
  'Do not use files from the BFG Edition or modern remasters. Only the classic 2004 release is supported.'
),
(
  'citravr',
  'CitraVR',
  'amwatson',
  'https://github.com/amwatson/CitraVR',
  'Official Nintendo 3DS standalone emulator for Meta Quest featuring stereoscopic 3D rendering and customizable virtual screens.',
  'emulator',
  'released',
  'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?auto=format&fit=crop&w=1200&q=80',
  'vMBsdsAICSY',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Roomscale', 'Seated'],
  true,
  '/sdcard/CitraVR/',
  NULL,
  'Requires your own 3DS game',
  'https://github.com/amwatson/CitraVR/releases',
  'GitHub Releases',
  true,
  '### Prerequisites
* Legally dumped, decrypted Nintendo 3DS ROMs (.3ds or installed .cia format).
* Meta Quest 3 or 3S recommended for optimal 60 FPS performance at 3x native resolution.

### Step-by-Step Installation
1. Download the latest APK release from the official CitraVR GitHub repository.
2. Install the APK via SideQuest or `adb install CitraVR.apk`.
3. Create the folder `/sdcard/CitraVR/roms/` on your headset and transfer your game ROMs.
4. Launch CitraVR under Unknown Sources and select your ROMs directory.',
  'On Quest 3 and 3S, increase internal resolution scale to 3x in graphics settings for crisp stereoscopic 3D clarity.'
),
(
  'questzdoom',
  'QuestZDoom',
  'Team Beef & BaggyG',
  'https://www.questzdoom.com/',
  'GZDoom source port engine for Meta Quest. Experience Doom 1, Doom 2, Brutal Doom, Heretic, and thousands of community mods in full 6DoF VR.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=1200&q=80',
  'OoNCvmUxUFE',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Teleport'],
  true,
  '/sdcard/QuestZDoom/',
  'https://store.steampowered.com/app/2280/Ultimate_Doom/',
  'Steam',
  'https://www.questzdoom.com/',
  'QuestZDoom Launcher',
  false,
  '### Installation
1. Install both **QuestZDoom Engine** and the **QuestZDoom Launcher** via SideQuest.
2. Launch the launcher inside the headset to auto-download free shareware WADs, or transfer your commercial `.wad` files (such as DOOM.WAD, DOOM2.WAD) into `/sdcard/QuestZDoom/wads/`.
3. Use the in-headset launcher UI to toggle mods, high-res texture packs, and 3D weapon models with a single click.',
  'Use the in-headset QuestZDoom Launcher to download and manage mods directly without needing a PC.'
),
(
  'jkxr',
  'JKXR (Star Wars Jedi Knight II: Jedi Outcast)',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Wield lightsabers with 1:1 motion tracking and cast Force powers naturally using real-world hand gestures in the classic Jedi Outcast.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  'ToM-wz3v-NU',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn'],
  true,
  '/sdcard/JKXR/',
  'https://store.steampowered.com/app/6030/STAR_WARS_Jedi_Knight_II__Jedi_Outcast/',
  'Steam',
  'https://sidequestvr.com/app/11796/jkxr-star-wars-jedi-knight-ii-jedi-outcast-vr',
  'SideQuest',
  false,
  '### Step-by-Step Installation
1. Install the JKXR APK from SideQuest.
2. On your PC, navigate to your Jedi Knight II installation folder: `Steam/steamapps/common/Jedi Outcast/GameData/base/`.
3. Copy `assets0.pk3`, `assets1.pk3`, `assets2.pk3`, and `assets5.pk3`.
4. Connect your Quest and copy these files into `/sdcard/JKXR/base/`.
5. Open the game from Unknown Sources and begin Jedi training!',
  'Natural gestures trigger Force powers: push your hand forward for Force Push, or gesture toward yourself for Force Pull.'
),
(
  'quake2quest',
  'Quake II Quest',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Classic sci-fi shooter by id Software rebuilt for standalone Quest with HD textures, cross-play multiplayer, and dynamic lighting.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
  'qByCUtT6WG0',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion'],
  true,
  '/sdcard/Quake2Quest/',
  'https://store.steampowered.com/app/2320/Quake_II/',
  'Steam',
  'https://sidequestvr.com/app/353/quake2quest',
  'SideQuest',
  false,
  '### Step-by-Step Installation
1. Install Quake II Quest via SideQuest.
2. Copy the `baseq2` folder from your PC game installation (`pak0.pak` and official mission packs).
3. Paste into `/sdcard/Quake2Quest/baseq2/` on your Meta Quest.',
  'Original soundtrack files can be placed in an optional music subfolder in OGG or MP3 format.'
),
(
  'preyvr',
  'Prey VR (Prey 2006 Quest Port)',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Mind-bending FPS with wall-walking gravity and living alien portals running natively under the id Tech 4 engine on Meta Quest.',
  'source_port',
  'playable_beta',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/preyvr.jpg',
  'e8KZmDCdPb4',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S'],
  ARRAY['Smooth Locomotion', 'Snap Turn'],
  true,
  '/sdcard/preyvr/',
  'https://en.wikipedia.org/wiki/Prey_(2006_video_game)',
  'Requires your own original Prey (2006) copy',
  'https://www.patreon.com/teambeef',
  'Team Beef Patreon',
  false,
  '### Installation
1. Install the beta APK build provided through Team Beef.
2. Copy the `.pk4` files from your original retail Prey (2006) PC installation into `/sdcard/PreyVR/base/`.
3. Launch the game from Unknown Sources.',
  'Requires strong VR motion tolerance due to disorienting wall-walking and inverted gravity physics.'
),
(
  'beefraiderxr',
  'Beef Raider XR (Tomb Raider 1)',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Step into the boots of Lara Croft in the legendary 1996 action adventure Tomb Raider, completely rebuilt for standalone 6DoF VR with dual-wield pistols, roomscale climbing, and physical puzzles.',
  'source_port',
  'released',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/beefraiderxr.jpg',
  'aTtOlcLPbCs',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn', 'Comfort Vignette'],
  true,
  '/sdcard/BeefRaiderXR/',
  'https://store.steampowered.com/app/224960/Tomb_Raider_I/',
  'Steam / GOG',
  'https://sidequestvr.com/app/38086/beef-raider-xr-tomb-raider-in-vr',
  'SideQuest',
  true,
  '### Prerequisites
* A legally owned copy of the original *Tomb Raider I (1996)* (Steam or GOG).
* Meta Quest headset with Developer Mode enabled or the SideQuest app.

### Step-by-Step Installation
1. Install **Beef Raider XR** from SideQuest onto your headset.
2. Launch Beef Raider XR once on your headset to generate the internal folder structure, then close it.
3. On your computer, open your installed Tomb Raider I game folder:
   - For Steam: `steamapps/common/Tomb Raider (I)/`
   - For GOG: locate the installation folder containing the game data (`GAME.GOG` or `TOMB.DAT`).
4. Copy the game data files into `/sdcard/BeefRaiderXR/` on your Quest.
5. Put on your headset and launch Beef Raider XR from the "Unknown Sources" library tab.',
  'If audio or cutscenes fail to play, ensure the game CD audio tracks are extracted into the /sdcard/BeefRaiderXR/audio/ folder in OGG or MP3 format.'
),
(
  'quakequest',
  'QuakeQuest (Quake 1 VR)',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Original gothic dark-fantasy shooter Quake fully reimagined for standalone 6DoF VR with dual-wielding, custom weapon models, and fluid teleport/smooth locomotion.',
  'source_port',
  'released',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/quakequest.jpg',
  'A42X55BKF6Q',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Teleport', 'Snap Turn'],
  true,
  '/sdcard/QuakeQuest/',
  'https://store.steampowered.com/app/2310/Quake/',
  'Steam',
  'https://sidequestvr.com/app/93/quakequest-for-quest-pico',
  'SideQuest',
  true,
  '### Prerequisites
* Legally owned copy of *Quake* (Steam, GOG, or Bethesda).
* Meta Quest headset with Developer Mode enabled or SideQuest.

### Step-by-Step Installation
1. Install **QuakeQuest** APK using SideQuest.
2. Launch QuakeQuest once inside your headset to allow it to initialize folder permissions.
3. On your computer, open your installed Quake folder: `steamapps/common/Quake/id1/`.
4. Copy `pak0.pak` and `pak1.pak` into `/sdcard/QuakeQuest/id1/` on your Quest.
5. Put on your headset and launch QuakeQuest from "Unknown Sources".',
  'Ensure pak files are lowercase (pak0.pak, pak1.pak). Add soundtrack in OGG format under /sdcard/QuakeQuest/id1/sound/cdtracks/ for classic atmospheric music.'
),
(
  'razexr',
  'RazeXR (Duke Nukem 3D, Blood, Shadow Warrior)',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Universal Build Engine VR port bringing Duke Nukem 3D, Blood, Shadow Warrior, Redneck Rampage, and Powerslave/Exhumed into standalone 6DoF virtual reality.',
  'source_port',
  'released',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/razexr.jpg',
  'BYz7r7q65sk',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn', 'Comfort Vignette'],
  true,
  '/sdcard/RazeXR/',
  'https://store.steampowered.com/app/434050/Duke_Nukem_3D_20th_Anniversary_World_Tour/',
  'Steam',
  'https://sidequestvr.com/app/24502/razexr-build-engine-for-quest',
  'SideQuest',
  true,
  '### Step-by-Step Installation
1. Install **RazeXR** via SideQuest onto your headset.
2. Launch the app once to initialize subdirectories for each supported Build Engine game.
3. Transfer game data files into their respective subfolders in `/sdcard/RazeXR/`:
   - Duke Nukem 3D: copy `duke3d.grp`
   - Blood: copy `blood.rff` and all sound files
   - Shadow Warrior: copy `sw.grp`
4. Put on headset and select your chosen game from the in-VR launcher menu.',
  'Atomic Edition and Megaton Edition grp files are fully compatible. Toggle weapon scale and HUD position in the VR Options menu.'
),
(
  'questcraft',
  'QuestCraft (Minecraft: Java Edition)',
  'QuestCraft Team',
  'https://questcraft.net/',
  'Minecraft: Java Edition running natively on standalone Meta Quest using Vivecraft and Pojlib, featuring 6DoF motion controls, world generation, and server multiplayer.',
  'source_port',
  'released',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/questcraft.jpg',
  'PomiV1iyTp8',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Teleport', 'Roomscale'],
  true,
  '/sdcard/Android/data/com.qcxr.qcxr/files/',
  'https://www.minecraft.net/en-us/store/minecraft-java-bedrock-edition-pc',
  'Minecraft.net',
  'https://sidequestvr.com/app/7150/questcraft',
  'SideQuest',
  true,
  '### Prerequisites
* Official Microsoft / Minecraft Java Edition account.
* Meta Quest 2, 3, or Pro.

### Step-by-Step Installation
1. Install **QuestCraft** using SideQuest or the in-headset SideQuest app.
2. Open QuestCraft from Unknown Sources.
3. Sign in to your Microsoft account using the on-screen device link code (e.g. microsoft.com/link).
4. Select your desired Minecraft version (recommended stable profile) and tap Play.
5. Wait for the engine assets to download directly onto the headset and enter your world!',
  'First launch requires an active Wi-Fi connection to authenticate with Microsoft and download game files. Performance on Quest 3 allows higher render distance (up to 10 chunks).'
),
(
  'csvr',
  'CSVR (Counter-Strike 1.6 VR)',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'The legendary tactical FPS Counter-Strike 1.6 in standalone 6DoF VR! Experience de_dust2, office, and classic bot matches with physical two-handed gunplay.',
  'source_port',
  'released',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/csvr.jpg',
  '5ivdcCWly54',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn'],
  true,
  '/sdcard/xash/',
  'https://store.steampowered.com/app/10/CounterStrike/',
  'Steam',
  'https://sidequestvr.com/app/45868/csvr-classic-counter-strike-in-vr',
  'SideQuest',
  true,
  '### Prerequisites
* Counter-Strike 1.6 on Steam.
* Meta Quest with Developer Mode or SideQuest.

### Step-by-Step Installation
1. Install the **CSVR** APK via SideQuest.
2. Launch CSVR once on the headset to create the folder hierarchy.
3. On your PC, navigate to `Steam/steamapps/common/Half-Life/cstrike/`.
4. Copy the `cstrike` folder contents into `/sdcard/xash/cstrike/` on your Quest.
5. Put on headset and launch CSVR from Unknown Sources.',
  'Supports bot matches and LAN/online multiplayer with compatible servers.'
),
(
  'hexen2vr',
  'Hexen II VR',
  'alex.nax & Team Beef',
  'https://sidequestvr.com/app/54816/hexen-ii-vr',
  'Dark fantasy boomer shooter Hexen II in standalone VR featuring physical melee weapons, spellcasting, roomscale exploration, and 4 playable RPG character classes.',
  'source_port',
  'playable_beta',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/hexen2vr.jpg',
  'wKyfjeuv46o',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn'],
  true,
  '/sdcard/Hexen2VR/',
  'https://store.steampowered.com/app/9060/HeXen_II/',
  'Steam',
  'https://sidequestvr.com/app/54816/hexen-ii-vr',
  'SideQuest',
  false,
  '### Step-by-Step Installation
1. Install Hexen II VR from SideQuest.
2. Copy `pak0.pak` and `pak1.pak` from your PC `Steam/steamapps/common/HeXen II/data1/` into `/sdcard/Hexen2VR/data1/`.
3. Launch from Unknown Sources.',
  'Alpha release. Save your game frequently.'
),
(
  'ppsspp-vr',
  'PPSSPP VR',
  'Henrik Rydgård',
  'https://www.ppsspp.org/',
  'Leading Sony PlayStation Portable emulator ported to standalone VR. Play PSP classics on massive virtual curved screens or true stereoscopic 3D geometry mode.',
  'emulator',
  'released',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/ppsspp-vr.jpg',
  'y3dgEeDW5Xw',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Roomscale', 'Seated'],
  true,
  '/sdcard/PSP/',
  null,
  'Requires your own PSP game',
  'https://sidequestvr.com/app/12379/ppsspp-vr',
  'SideQuest',
  true,
  '### Installation
1. Install PPSSPP VR APK via SideQuest.
2. Transfer dumped PSP ISO/CSO backups to `/sdcard/PSP/GAME/` on your Quest.
3. Launch PPSSPP VR, configure your virtual screen scale, and play using Quest Touch controllers or Bluetooth gamepad.',
  'Toggle stereoscopic 3D rendering in graphics options for enhanced depth in 3D titles like Ridge Racer, Wipeout, and Monster Hunter.'
),
(
  'winlatorxr',
  'WinlatorXR',
  'WinlatorXR team',
  'https://github.com/WinlatorXR/WinlatorXR',
  'OpenXR compatibility layer running Windows x86 PC applications and games natively on Meta Quest using Wine and Box86/Box64 translation.',
  'emulator',
  'playable_beta',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/winlatorxr.jpg',
  'neSyrMRFs9c',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  null,
  'Requires your own Windows games',
  'https://sidequestvr.com/app/37320/winlatorxr',
  'SideQuest',
  false,
  '### Installation
1. Download and install WinlatorXR APK via SideQuest or GitHub Releases.
2. Put game installation folders in your Quest `/sdcard/Download/` directory.
3. Open WinlatorXR, create a new Wine Container with Turnip drivers and DXVK enabled, and run your setup or .exe file.',
  'Best suited for older DirectX 9 / 10 PC titles on Quest 3 / 3S for optimal performance.'
),
(
  'time-crisis-vr',
  'Time Crisis VR',
  'DR-89',
  'https://github.com/DR-89/time-crisis-vr',
  'Standalone 6DoF VR arcade port of Namco''s iconic light-gun rail shooter Time Crisis running at 120 Hz on Meta Quest 3 with 1:1 tracked pistol, physical roomscale ducking, and original arcade sound.',
  'source_port',
  'playable_beta',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/time-crisis-vr.jpg',
  'PGUc8b3VIu0',
  ARRAY['Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Roomscale', 'Physical Ducking', 'Cover System'],
  true,
  '/sdcard/TimeCrisisVR/',
  'https://en.wikipedia.org/wiki/Time_Crisis',
  'Requires your own original copy',
  'https://github.com/DR-89/time-crisis-vr/releases/latest',
  'GitHub Releases',
  true,
  '### Prerequisites
* Meta Quest 3 or Quest 3S with Developer Mode enabled.
* SideQuest or Android ADB (`platform-tools`).

### Step-by-Step Installation
1. Download the latest Quest APK (`TimeCrisisVR-*-quest.apk`) from the official [GitHub Releases](https://github.com/DR-89/time-crisis-vr/releases/latest).
2. Connect your Quest 3 via USB and install via SideQuest or terminal:
   `adb install -r TimeCrisisVR-*-quest.apk`
3. Launch the game from **Unknown Sources → Time Crisis VR (Experimental)**. The complete APK extracts bundled game files automatically.
4. On the arcade boot screen, press **A (Right Controller)** to insert credits, then press **Right Trigger** to start the mission!

### Controls & Cover System
* **Right Controller / Trigger**: Aim and shoot tracked 3D pistol
* **A (Right)**: Insert arcade credits
* **B (Right)**: Toggle silent laser pointer
* **Left Trigger / Physical Ducking**: Hold left trigger to leave cover and shoot; release to duck/reload. Alternatively, enable **Physical Ducking** in the menu (press Left Menu button) and press **X** while upright to calibrate height!',
  'Target framerate is 120 Hz. Use the latest Quest APK from Releases. That build boots directly into immersive VR mode without flat-screen regressions.'
),
(
  'primedgun',
  'PrimedGun (Metroid Prime VR)',
  'Nobbie248',
  'https://github.com/Nobbie248',
  'Standalone 6DoF VR source injection of Nintendo GameCube classic Metroid Prime running natively on Meta Quest with 1:1 tracked Arm Cannon, immersive helmet visors, and Vulkan multiview.',
  'vr_injection',
  'released',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/primedgun.jpg',
  'd_xUXZURdzM',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn', 'Roomscale'],
  true,
  '/sdcard/PrimedGun/',
  'https://en.wikipedia.org/wiki/Metroid_Prime',
  'Requires your own original GameCube copy',
  'https://github.com/Nobbie248/PrimedGun/releases/download/v1.1.7/primedgun-quest-release.apk',
  'GitHub Releases',
  true,
  '### Prerequisites
* Meta Quest 2, 3, 3S, or Pro with Developer Mode enabled.
* Original **Metroid Prime (NTSC-U Revision 0 / v1.0)** GameCube ISO/GCM disc backup.
* SideQuest or Android ADB (`platform-tools`).

### Step-by-Step Installation
1. Download the Quest APK (`primedgun-quest-release.apk`) from the Quest release [v1.1.7](https://github.com/Nobbie248/PrimedGun/releases/tag/v1.1.7). The newer Windows tag is not a Quest APK.
2. Connect your Meta Quest via USB and install the APK via SideQuest or terminal:
   `adb install -r primedgun-quest-release.apk`
3. Transfer your `Metroid Prime (USA) (Rev 0).iso` backup into `/sdcard/PrimedGun/` (or any accessible folder on your headset storage).
4. Put on your Quest, go to **App Library → Unknown Sources**, and launch **PrimedGun**.
5. Use the in-headset launcher to select your ISO file and tap Play.
6. Note: Initial shader compilation takes 2-3 minutes on the first launch. Wait for the progress indicator inside VR to complete.

### Controls & Calibration
* **Right Controller / Trigger**: Aim and shoot 1:1 tracked Arm Cannon; Right Grip fires Missiles.
* **Right Stick Click**: Recenter and calibrate your player height / floor level.
* **Left Controller**: Smooth locomotion with thumbstick; Left Stick Click opens the in-VR settings menu.
* **Visors & Beams**: Switch visors and beam weapons naturally using controller gestures or weapon wheel.
* **Pro Tip**: When exiting, press *Exit Game* in the VR menu twice to ensure compiled shaders are safely cached to disk for instant subsequent loads!',
  'Requires Metroid Prime USA NTSC-U v1.0 (Rev 0). European PAL or Japanese editions are not officially supported. Standalone performance shines at 90 Hz on Quest 3 / 3S with Vulkan multiview rendering.'
),
(
  'astroquest',
  'AstroQuest (ASTRO BOT Rescue Mission)',
  'bigmak94',
  'https://github.com/bigmak94',
  'PlayStation VR masterpiece ASTRO BOT Rescue Mission running natively on Meta Quest 3 via an ARM64 port of shadPS4, featuring 6DoF hand-tracked DualSense gamepad integration, 3D audio, and mic blowing.',
  'emulator',
  'playable_beta',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/astroquest.jpg',
  '1FXer9AHf68',
  ARRAY['Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Seated', 'Roomscale'],
  true,
  '/sdcard/Android/data/com.astrobotquest.vrhost/files/',
  'https://store.playstation.com/en-gb/product/EP9000-CUSA12392_00-PLATFORMERVR00EU/',
  'PlayStation Store',
  'https://github.com/bigmak94/AstroQuest/releases/latest',
  'GitHub Releases',
  true,
  '### Prerequisites
* **Meta Quest 3 or Quest 3S** (Quest 2 is not supported due to high CPU/GPU requirements of PS4 emulation).
* **PS5 DualSense Controller** (paired via Bluetooth with the headset; Quest hand tracking tracks the physical controller in 3D space!).
* Clean dumped copy of **ASTRO BOT Rescue Mission** (European PS4 release `CUSA12392`, version 1.00) dumped from your own console as an unpacked folder or `.pkg`.
* SideQuest or Android ADB (`platform-tools`).

### Step-by-Step Installation
1. Download the latest standalone Quest APK (`AstroQuest-*-Quest3.apk`) from [GitHub Releases](https://github.com/bigmak94/AstroQuest/releases/latest).
2. Install the APK to your Quest 3 via SideQuest or command line:
   `adb install -r AstroQuest-*-Quest3.apk`
3. Pair your **PS5 DualSense controller** to the Quest 3:
   * On Quest: Go to **Settings → Bluetooth → Pair new device**.
   * On DualSense: Hold **Create (Share) + PS Button** until the light bar flashes rapidly.
4. Transfer your game dump folder or package to your Quest storage:
   * Put game files in `/sdcard/Android/data/com.astrobotquest.vrhost/files/games/`
5. Put on your Quest 3, open **App Library → Unknown Sources**, and launch **Astro VR Host**.
6. Grant microphone permission when prompted (the game listens to your breath to blow dandelions and gadgets, exactly as on PS VR!).
7. Place your Touch controllers aside and hold the DualSense. Hold it inside the floating outline to calibrate 3D hand tracking.

### Controls & Calibrating View
* **Hold OPTIONS (or press PS button)** for 1 second at any time to instantly reset and center the VR camera view.
* **DualSense Motion & Touchpad**: Fully mapped to in-game gadgets (water gun, ninja stars, hookshot).
* **Save Files**: Saved automatically to `/sdcard/Android/data/com.astrobotquest.vrhost/files/data/shadPS4/home/1000/savedata/`. (Updating the APK with `adb install -r` preserves saves).',
  'Target framerate is 30 FPS in heavy action / 45 FPS in lighter scenes using spatial reprojection. Ensure your DualSense is paired directly to the headset via Bluetooth so Quest hand tracking can locate it in VR.'
),
(
  'sourcevr',
  'SourceVR (Half-Life 2 & Portal VR)',
  'tinsarfal',
  'https://github.com/tinsarfal',
  'Native standalone Valve Source Engine port for Meta Quest. Play Half-Life 2, Episode 1, Episode 2, Lost Coast, Portal, and Portal 2 in full 6DoF VR without PCVR.',
  'source_port',
  'released',
  'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/sourcevr.jpg',
  'QzgDw8xEpeM',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn', 'Roomscale'],
  true,
  '/sdcard/SourceVRPort/',
  'https://store.steampowered.com/app/220/HalfLife_2/',
  'Steam',
  'https://github.com/tinsarfal/SourceVR/releases/latest',
  'GitHub Releases',
  true,
  '### Prerequisites
* Meta Quest 2, 3, 3S, or Pro with Developer Mode enabled.
* Original **Half-Life 2** (and optionally Episode 1, Episode 2, Portal) on Steam.
* SideQuest or Android ADB (`platform-tools`).

### Step-by-Step Installation
1. Download the latest standalone Quest APK (`SourceVR-0.1.28.apk`) from [GitHub Releases](https://github.com/tinsarfal/SourceVR/releases/latest).
2. Install the APK to your Meta Quest via SideQuest or command line:
   `adb install -r SourceVR-0.1.28.apk`
3. Launch **SourceVRPort** once from **App Library → Unknown Sources** on your headset and grant file permissions.
4. Locate your game installation folders on PC:
   * **Half-Life 2**: `Steam/steamapps/common/Half-Life 2/`
   * **Portal**: `Steam/steamapps/common/Portal/`
5. Copy the game content folders to your Quest storage under `/sdcard/SourceVRPort/common/`:
   * For **Half-Life 2**: copy `hl2` and `platform`
   * For **Episode One**: also copy `episodic`
   * For **Episode Two**: also copy `ep2`
   * For **Portal**: copy `portal` (uses shared `hl2` content)
6. Put on your headset, open **SourceVRPort**, choose your game, and hit **Play** once the content check reports ready!

### Supported Games in One Hub
* **Half-Life 2**: Full 6DoF motion controls, weapon wheel, interactive vehicles (airboat & buggy).
* **Episode 1 & Episode 2**: Full campaign continuity and flashlight tracking.
* **Lost Coast**: High dynamic range showcase chapter.
* **Portal**: Hand-tracked Aperture Science Handheld Portal Device.
* **Entropy : Zero**: Community campaign support.
* **Portal 2**: Experimental testing build.',
  'Steam legacy files work out-of-the-box. Ensure you copy the required folders into /sdcard/SourceVRPort/common/. Custom content mods can be placed in /sdcard/SourceVRPort/common/hl2/custom/.'
);



