-- Catalog refresh for public.ports.
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.
-- Each statement is keyed by slug and sets the same values on every run.
-- latest_version, github_url, and last_github_update already exist in production.
-- The ADD COLUMN statements are no-ops there and cover databases created from supabase/schema.sql.

ALTER TABLE public.ports ADD COLUMN IF NOT EXISTS github_url text;
ALTER TABLE public.ports ADD COLUMN IF NOT EXISTS last_github_update timestamptz;
ALTER TABLE public.ports ADD COLUMN IF NOT EXISTS latest_version text;

-- citravr
UPDATE public.ports SET
  base_game_store = 'Requires your own 3DS game',
  updated_at = now()
WHERE slug = 'citravr';

-- preyvr
UPDATE public.ports SET
  base_game_url = 'https://en.wikipedia.org/wiki/Prey_(2006_video_game)',
  base_game_store = 'Requires your own original Prey (2006) copy',
  updated_at = now()
WHERE slug = 'preyvr';

-- ppsspp-vr
UPDATE public.ports SET
  base_game_store = 'Requires your own PSP game',
  updated_at = now()
WHERE slug = 'ppsspp-vr';

-- winlatorxr
UPDATE public.ports SET
  base_game_store = 'Requires your own Windows games',
  updated_at = now()
WHERE slug = 'winlatorxr';

-- time-crisis-vr
UPDATE public.ports SET
  latest_version = 'v0.8.4',
  last_github_update = '2026-10-07T16:17:58Z'::timestamptz,
  base_game_url = 'https://en.wikipedia.org/wiki/Time_Crisis',
  base_game_store = 'Requires your own original copy',
  installation_guide = $qp$### Prerequisites
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
* **Left Trigger / Physical Ducking**: Hold left trigger to leave cover and shoot; release to duck/reload. Alternatively, enable **Physical Ducking** in the menu (press Left Menu button) and press **X** while upright to calibrate height!$qp$,
  troubleshooting_notes = $qp$Target framerate is 120 Hz. Use the latest Quest APK from Releases. That build boots directly into immersive VR mode without flat-screen regressions.$qp$,
  updated_at = now()
WHERE slug = 'time-crisis-vr';

-- primedgun
UPDATE public.ports SET
  latest_version = 'v1.1.7',
  last_github_update = '2026-10-02T14:25:35Z'::timestamptz,
  base_game_url = 'https://en.wikipedia.org/wiki/Metroid_Prime',
  base_game_store = 'Requires your own original GameCube copy',
  port_download_url = 'https://github.com/Nobbie248/PrimedGun/releases/download/v1.1.7/primedgun-quest-release.apk',
  installation_guide = $qp$### Prerequisites
* Meta Quest 2, 3, 3S, or Pro with Developer Mode enabled.
* Original **Metroid Prime (NTSC-U Revision 0 / v1.0)** GameCube disc backup. PrimedGun’s file list accepts `.iso` (including `.nkit.iso`), `.gcm`, `.ciso`, `.gcz`, `.rvz`, `.wia`, `.wbfs`, `.tgc`, and `.nfs`.
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
* **Pro Tip**: When exiting, press *Exit Game* in the VR menu twice to ensure compiled shaders are safely cached to disk for instant subsequent loads!$qp$,
  troubleshooting_notes = $qp$Requires Metroid Prime USA NTSC-U v1.0 (Rev 0). European PAL or Japanese editions are not officially supported. Standalone performance shines at 90 Hz on Quest 3 / 3S with Vulkan multiview rendering.$qp$,
  updated_at = now()
WHERE slug = 'primedgun';

-- astroquest
UPDATE public.ports SET
  latest_version = 'v0.20',
  last_github_update = '2026-10-06T18:45:57Z'::timestamptz,
  base_game_url = 'https://store.playstation.com/en-gb/product/EP9000-CUSA12392_00-PLATFORMERVR00EU/',
  base_game_store = 'PlayStation Store',
  installation_guide = $qp$### Prerequisites
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
* **Save Files**: Saved automatically to `/sdcard/Android/data/com.astrobotquest.vrhost/files/data/shadPS4/home/1000/savedata/`. (Updating the APK with `adb install -r` preserves saves).$qp$,
  troubleshooting_notes = $qp$Target framerate is 30 FPS in heavy action / 45 FPS in lighter scenes using spatial reprojection. Ensure your DualSense is paired directly to the headset via Bluetooth so Quest hand tracking can locate it in VR.$qp$,
  updated_at = now()
WHERE slug = 'astroquest';

-- simpsonshitrun
UPDATE public.ports SET
  base_game_url = 'https://en.wikipedia.org/wiki/The_Simpsons:_Hit_%26_Run',
  base_game_store = 'Requires your own original PC copy',
  port_download_url = 'https://github.com/kote2345/The-Simpsons-Hit-and-Run-VR/releases/latest',
  installation_guide = $qp$### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Original PC game files for **The Simpsons: Hit & Run** (2003 original unmodded PC release).
* SideQuest or Android ADB (`platform-tools`).

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Get the latest `SimpsonsHitRun_*.apk` from [GitHub Releases](https://github.com/kote2345/The-Simpsons-Hit-and-Run-VR/releases/latest).
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   ```bash
   adb install -r SimpsonsHitRun_*.apk
   ```
3. **Create the Game Directory:**
   On your Quest internal storage, create a folder named `SimpsonsHitRun`:
   * Path: `/sdcard/SimpsonsHitRun` (or `Quest\Internal shared storage\SimpsonsHitRun` when connected via USB).
4. **Copy PC Game Files:**
   Copy the complete contents of your original unmodded PC install of *The Simpsons: Hit & Run* into the `SimpsonsHitRun` folder on your headset.
5. **Launch in VR:**
   Put on your headset, navigate to **App Library → Unknown Sources**, and launch **The Simpsons: Hit & Run VR**!

### VR Features & Controls
* **6DoF & Roomscale:** Walk around Homer, Bart, and explore Springfield in stereoscopic 3D.
* **VR Vehicle Controls:** Grab the interactive steering wheel with motion controllers or drive with thumbsticks.
* **Rendering Engine:** Native Vulkan single-pass stereo multiview rendering via OpenXR.
* **Comfort Options:** Seated mode, snap/smooth turning, adjustable refresh rate and resolution scale.$qp$,
  troubleshooting_notes = $qp$Make sure to use an unmodded, clean PC version of the game. Files must be placed directly inside /sdcard/SimpsonsHitRun/ without nested game folders. Grant all requested storage permissions on first launch.$qp$,
  updated_at = now()
WHERE slug = 'simpsonshitrun';

-- halocequest
UPDATE public.ports SET
  last_github_update = '2026-10-08T02:13:04Z'::timestamptz,
  base_game_store = 'Requires your own original Xbox copy',
  installation_guide = $qp$### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Original legally obtained **Halo: Combat Evolved** Xbox ISO/XISO (allow ~1.8 GB for extracted maps, cache, and sound files).
* SideQuest or Android ADB (`platform-tools`).

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download the latest `HaloCE-Quest-*.apk` (package `com.halo.decomp.vr`) from [GitHub Releases](https://github.com/moistman42069/HaloCE-Quest-VR/releases/latest). Use the **Quest** APK, not the Android/flat build.
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   ```bash
   adb install -r HaloCE-Quest-*.apk
   ```
3. **Import Game Files:**
   * Transfer your Halo CE Xbox ISO/XISO file to your Quest storage (e.g., inside `Download/`).
   * Launch **Halo CE VR** from **App Library → Unknown Sources**.
   * Use the built-in file picker/launcher to select your ISO file. The game extracts maps into its app storage. The Quest build also plays `/sdcard/Documents/HaloCE` when `maps/ui.map` and `maps/bloodgulch.map` are already there. You can push that maps folder with:
   ```bash
   adb push /path/to/maps/. /sdcard/Documents/HaloCE/maps/
   ```
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
* **Multiplayer & Co-op:** Join native PvP servers or host experimental co-op campaign sessions with fellow Quest players.$qp$,
  troubleshooting_notes = $qp$Use an original Xbox ISO or XISO image for data extraction. If NPC or model presentation desyncs during co-op, ensure both players are on the exact same build. Recenter standing height anytime by clicking both thumbsticks.$qp$,
  updated_at = now()
WHERE slug = 'halocequest';

-- galaxyquest
UPDATE public.ports SET
  latest_version = 'v0.1.8',
  last_github_update = '2026-10-03T20:28:59Z'::timestamptz,
  base_game_store = 'Requires your own original Wii copy',
  updated_at = now()
WHERE slug = 'galaxyquest';

-- qualyx
UPDATE public.ports SET
  installation_guide = $qp$### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Original **Half-Life: Alyx** on Steam.
* SideQuest or Android ADB (`platform-tools`).
* Recommended: Turn ON **Quest Settings → Experimental → Positional time warp** before playing.

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download the latest `Qualyx-*.apk` from [GitHub Releases](https://github.com/tinsarfal/Qualyx/releases/latest).
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   ```bash
   adb install -r Qualyx-*.apk
   ```
3. **Copy Game Files from PC:**
   Locate your Steam installation folder (typically `Steam/steamapps/common/Half-Life Alyx/game/`).
   You only need the `hlvr` and `core` folders inside `game/`. Copy them to `/sdcard/Qualyx/game/` on your headset:
   ```bash
   adb shell mkdir -p /sdcard/Qualyx/game
   adb push "/path/to/Half-Life Alyx/game/hlvr" /sdcard/Qualyx/game/
   adb push "/path/to/Half-Life Alyx/game/core" /sdcard/Qualyx/game/
   ```
   *(Ensure `/sdcard/Qualyx/game/hlvr/pak01_dir.vpk` exists on your headset).*
4. **Launch in VR:**
   * Open **Qualyx** from **App Library → Unknown Sources**.
   * Grant storage permissions, let the engine verify game archives, and tap **Launch in VR**!

### VR Features & Performance
* **Native Standalone Source 2:** Runs natively on the Quest XR2 Gen 2 / Gen 1 silicon.
* **Full 6DoF & Gravity Gloves:** Pull resin, magazines, and health syringes toward you through the air.
* **Positional Time Warp:** Optimized with 72Hz display targeting 36 fresh internal frames with hardware motion extrapolation.
* **Full Campaign Playability:** All chapters from the Quarantine Zone to the Vault.$qp$,
  troubleshooting_notes = $qp$Turn ON Quest Settings → Experimental → Positional time warp for smooth frame pacing. If using the older May 2022 v1.5.4 game files, import the Qualyx 2022 shader pack inside the launcher setup screen.$qp$,
  updated_at = now()
WHERE slug = 'qualyx';

-- goldeneye-vr
UPDATE public.ports SET
  latest_version = 'v0.4.13',
  last_github_update = '2026-10-08T11:36:09Z'::timestamptz,
  base_game_store = 'Requires your own original N64 copy',
  installation_guide = $qp$### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Legally owned original **GoldenEye 007 (USA / NTSC-U)** N64 cartridge ROM (`.z64`, `.v64`, or `.n64`, ~12 MB).
* SideQuest or Android ADB (`platform-tools`).
* USB-C cable.

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download the latest `GoldenEye-VR-*.apk` from [GitHub Releases](https://github.com/MrSco/goldeneye-vr/releases/latest) or [goldeneyevr.com](https://goldeneyevr.com).
2. **Install the APK:**
   Sideload the APK onto your headset using SideQuest or ADB:
   ```bash
   adb install -r GoldenEye-VR-*.apk
   ```
3. **Copy your USA ROM to your Headset:**
   Copy your USA ROM into the Quest **Download** folder, open the app, and press **Choose ROM file...**. The launcher copies it to `/sdcard/Android/data/com.gevr.port/files/data/ge.z64`. After the app has been opened once you can also push it directly:
   ```bash
   adb push "GoldenEye 007 (USA).z64" /sdcard/Android/data/com.gevr.port/files/data/ge.z64
   ```
4. **Launch & Play:**
   * Put on your headset and open **GoldenEye VR** from **App Library → Unknown Sources**.
   * On first boot, use the in-VR launcher to select your ROM file.
   * Choose between **Stereo VR** (full 3D roomscale) or **Big Virtual Screen** and start your mission!

### VR Features & Interactive Gadgets
* **6DoF Gunplay & Two-Handed Grip:** Aim with your dominant hand or grip rifles with both hands for rock-solid stability.
* **Bond's Smart Watch:** Your left wrist displays live mission time, health, body armor, and multiplayer radar. Tap the watch or bring your gun hand to activate the Watch Laser.
* **Realistic Scopes & Ejection:** True-to-life 4.4x–25x magnification on the sniper rifle and working ejection ports for spent shell casings.
* **Optional HD & AI Texture Packs:** Download high-resolution AI upscaled textures directly within the in-VR launcher.
* **Multiplayer:** 8-player online/Wi-Fi deathmatch and 4-player co-op campaign!$qp$,
  troubleshooting_notes = $qp$Only the USA (NTSC-U) ROM is supported. Updating APKs with SideQuest retains your ROM and save data. If distant scenery pops on older builds, install the latest Quest APK from Releases.$qp$,
  updated_at = now()
WHERE slug = 'goldeneye-vr';

-- questcarnage
UPDATE public.ports SET
  latest_version = 'b003',
  last_github_update = '2026-09-17T20:30:08Z'::timestamptz,
  port_download_url = 'https://github.com/maranone/carnage/releases/download/b003/QuestCarnage-Meta-Quest-release.apk',
  installation_guide = $qp$### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro with Developer Mode enabled.
* Legally owned PC copy of **Carmageddon** (Steam Max Pack, GOG, or original CD).
* SideQuest or Android ADB (`platform-tools`).

### Step-by-Step Installation Guide
1. **Download the VR APK:**
   Download `QuestCarnage-Meta-Quest-release.apk` from the Quest release [b003](https://github.com/maranone/carnage/releases/tag/b003). Later tags can be PC-only.
2. **Install the APK:**
   Sideload the APK onto your Meta Quest using SideQuest or ADB:
   ```bash
   adb install -r QuestCarnage-Meta-Quest-release.apk
   ```
3. **Transfer Game Data Files:**
   * Locate your Carmageddon installation on PC (ensure it has the `DATA` directory with `DATA/GENERAL.TXT`).
   * Transfer the game files using the repo helper scripts (`push_files_to_quest.bat` and `push-quest-data.ps1`) or push manually with ADB:
   ```bash
   adb push "/path/to/Carmageddon/DATA" /sdcard/Android/data/com.github.maranone.questcarnage/files/
   ```
   *(Legacy shared storage path `/sdcard/questcarnage/DATA` is also supported).*
4. **Launch & Play:**
   * Open **QuestCarNage** from **App Library → Unknown Sources** on your headset.
   * Adjust refresh rate (supports up to **120Hz**) in the second options menu and hit the track!

### VR Features & Vehicular Combat
* **Full Cockpit 6DoF VR:** Experience the brutal mayhem from behind the wheel of the Red Annihilator with full head tracking and depth.
* **120Hz Native Support:** Super fluid high refresh rate rendering for blistering racing action.
* **Custom Race Options:** Try custom powerups roulette, up to 50 AI opponents, and up to 100x pedestrian multipliers.
* **OpenXR Implementation:** BRender's GLES 3.0 path with stereo per-eye view pose and native Touch controller mapping.$qp$,
  troubleshooting_notes = $qp$The specified game directory must contain DATA/GENERAL.TXT. In the options screen, you can toggle between 72Hz, 90Hz, and 120Hz display refresh modes. Ensure file permissions are granted on first launch.$qp$,
  updated_at = now()
WHERE slug = 'questcarnage';

-- gran-turismo-2-vr
UPDATE public.ports SET
  base_game_store = 'Requires your own original PS1 copy',
  updated_at = now()
WHERE slug = 'gran-turismo-2-vr';

-- harry-potter-vr
UPDATE public.ports SET
  base_game_store = 'Requires your own original PC copy',
  updated_at = now()
WHERE slug = 'harry-potter-vr';

-- road-rash-jailbreak-vr
UPDATE public.ports SET
  base_game_store = 'Requires your own original PS1 copy (SLUS-01053)',
  updated_at = now()
WHERE slug = 'road-rash-jailbreak-vr';

-- perfect-dark-vr
UPDATE public.ports SET
  latest_version = 'v2.0',
  last_github_update = '2026-10-07T19:21:20Z'::timestamptz,
  base_game_store = 'Requires your own original N64 copy',
  port_download_url = 'https://github.com/Alex-LeTux/perfect_dark_VR/releases/latest',
  installation_guide = $qp$### Overview
**Perfect Dark VR** is a native standalone 6DoF VR source port of Rare's classic Nintendo 64 first-person shooter *Perfect Dark* (2000), running directly on Meta Quest headsets with full motion controller tracking, immersive weapon handling, and dual wielding.

> [!NOTE]
> You must provide your own legally obtained **Perfect Dark (NTSC Final)** Nintendo 64 ROM (`.z64` format). Only the NTSC version is compatible with this VR port.

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally dumped **Perfect Dark (USA/NTSC Final) ROM** file (`.z64`).
3. SideQuest or ADB installed on your computer or phone.

---

### Step-by-Step Installation Guide

#### 1. Sideload the Standalone APK
- Download the latest NTSC standalone APK, **`Perfect_Dark_VR_Standalone-NTSC_*.apk`**, from [GitHub Releases](https://github.com/Alex-LeTux/perfect_dark_VR/releases/latest). Do not install the JPN or PAL builds.
- Sideload the APK onto your Meta Quest using **SideQuest** or run:
  ```bash
  adb install -r Perfect_Dark_VR_Standalone-NTSC_*.apk
  ```

#### 2. Copy the ROM to Your Headset
- Copy your Perfect Dark NTSC ROM to your Quest headset's **`Download`** folder (via USB-C file transfer, SideQuest file manager, or Quest browser):
  ```bash
  adb push pd.ntsc-final.z64 /sdcard/Download/
  ```

#### 3. Select ROM in VR
- Put on your Quest headset and go to **App Library → Unknown Sources**.
- Launch **Perfect Dark VR**.
- On the startup screen, press **"Select ROM"** and pick your NTSC ROM from your **Download** folder using the system file picker. The launcher copies it to `/sdcard/Android/data/com.perfectdark.port/files/data/pd.ntsc-final.z64`. That exact filename is what the game reads.

---

### Community HD Texture Packs
This VR port includes full support for the **Community Texture Packs** maintained by Parabolee and Retro Foundry. To install HD textures:
- Download the texture pack from [Perfect-Dark-Plus-HD-Textures](https://github.com/retro-foundry/Perfect-Dark-Plus-HD-Textures).
- Follow instructions to place the textures folder inside the game data directory on your headset.

---

### VR Controls & Features
* **6DoF Aiming & Dual Wielding:** Aim independently with each Touch controller, including dual CMP-150s, Falcon 2s, or Magnums.
* **Full Locomotion & Turning:** Smooth thumbstick locomotion with customizable snap or smooth turning.
* **Roomscale Tracking:** Duck behind cover and physically lean around corners in Carrington Institute and combat missions.$qp$,
  troubleshooting_notes = $qp$Requires North American / NTSC Final ROM (PAL and Japanese ROMs are not supported). Install the NTSC standalone APK, not the JPN or PAL build. If you experience an infinite reload loop on older versions, install the latest release.$qp$,
  updated_at = now()
WHERE slug = 'perfect-dark-vr';

-- avp-vr
UPDATE public.ports SET
  latest_version = '1.1',
  last_github_update = '2026-10-07T17:10:06Z'::timestamptz,
  port_download_url = 'https://github.com/Bassquake/Aliens-Versus-Predator-VR/releases/latest',
  installation_guide = $qp$### Overview
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
- Download the latest Quest APK, **`avpvr-*-quest-*.apk`**, from [GitHub Releases](https://github.com/Bassquake/Aliens-Versus-Predator-VR/releases/latest).
- Install the APK on your headset using **SideQuest** (or via ADB: `adb install -r avpvr-*-quest-*.apk`).

#### 2. First Launch (Initialize Folders)
- Put on your headset and launch **Aliens Versus Predator: VR** from **App Library → Unknown Sources**.
- The app will close/crash immediately — **this is normal**, as it creates the necessary folder structure and permissions.

#### 3. Copy Game Assets
- Connect your Quest to your PC and open SideQuest (or Windows File Explorer / Android File Transfer).
- In SideQuest, go to **Manage files on the headset** (folder icon).
- Navigate to:
  ```
  Android/data/com.bassquake.quest.avpvr/files/
  ```
- Copy all files and folders from your PC game installation directory into this `files/` folder (including `fastfile`, `language`, etc.).

#### 4. Optional: Original CD Soundtrack (Atmosphere)
- Inside `Android/data/com.bassquake.quest.avpvr/files/`, create a new folder named **`cd_tracks`**.
- Download the soundtrack OGG files from [ModDB](https://www.moddb.com/games/aliens-vs-predator/addons/fixed-avp-classic-soundtrack) and name them `track01.ogg`, `track02.ogg`, etc.
- Copy the audio files into the `cd_tracks` folder.

#### 5. Launch and Play!
- Put on your Quest, go to **Unknown Sources**, and launch **Aliens Versus Predator: VR**!

---

### VR Controls & Species Features
* **Marine:** Tactical flashlight, shoulder lamp, motion tracker radar, smart gun auto-targeting, and hold **A** for manual reload.
* **Predator:** Wrist blades, shoulder plasmacaster with thermal lock, zoom vision (long-press **Y**), grappling hook (Left Trigger), and weapon disc throwing.
* **Alien:** Full 6DoF wall-climbing and ceiling crawling, biting, and tail-swipe attacks.
* **VR Performance Options:** Native 120Hz refresh rate mode, MSAA antialiasing, field-of-view comfort blinders, and adjustable world scale.$qp$,
  troubleshooting_notes = $qp$Must launch the APK once before copying files so Android creates the app files folder. Ensure files are copied into Android/data/com.bassquake.quest.avpvr/files. If weapons have unexpected keybindings after updating, reset controls to default in-game.$qp$,
  updated_at = now()
WHERE slug = 'avp-vr';

-- questsam
UPDATE public.ports SET
  latest_version = 'b004',
  last_github_update = '2026-09-20T16:39:29Z'::timestamptz,
  port_download_url = 'https://github.com/maranone/QuestSam/releases/latest',
  installation_guide = $qp$### Overview
**QuestSam** is a free, open-source standalone 6DoF VR source port of Croteam's legendary arcade FPS classics: **Serious Sam Classic: The First Encounter (TFE)** and **Serious Sam Classic: The Second Encounter (TSE)**, running natively on Meta Quest without a PC.

> [!NOTE]
> You need the `.gro` game archive files from either or both original PC games (*Serious Sam Classic: The First Encounter* or *Serious Sam Classic: The Second Encounter* on Steam or GOG).

---

### Prerequisites
1. **Meta Quest Headset** (Quest 2, Quest 3, Quest 3S, or Quest Pro) with Developer Mode enabled.
2. Legally owned copy of **Serious Sam Classic: The First Encounter** and/or **The Second Encounter** on Steam or GOG.
3. PC with USB-C cable or SideQuest / ADB installed.

---

### Step-by-Step Installation Guide

#### 1. Sideload the Standalone APK
- Download **`questsam.apk`** from [GitHub Releases](https://github.com/maranone/QuestSam/releases/latest).
- Install the APK using **SideQuest** or run:
  ```bash
  adb install -r questsam.apk
  ```

#### 2. First Launch (Folder Creation & Permissions)
- Put on your headset, open **App Library → Unknown Sources**, and launch **QuestSam**.
- Grant the **"All files access"** storage permission when prompted.
- The game will generate the `/sdcard/questsam/` directory on your headset's storage and close.

#### 3. Copy Game Files (`.gro`)
- Connect your Quest to your PC via USB-C (or use SideQuest's File Manager).
- Locate your PC game install folder (e.g. `Steam/steamapps/common/Serious Sam Classic The First Encounter`):
  - Copy all root `.gro` archive files (e.g. `1_00.gro`, `1_00_music.gro`, `SE1_00.gro`, etc.) into:
    ```text
    /sdcard/questsam/
    ```
  - *(Optional)* If copying via ADB script, you can use the bundled `push_quest_data.bat` (Windows) or `push_quest_data.sh` (Linux/Mac) to automatically transfer TFE & TSE data to `/sdcard/Android/data/com.github.maranone.questsam/files`.

#### 4. Launch and Slay Hordes in VR!
- Put on your Quest, go to **Unknown Sources**, and launch **QuestSam**.
- Choose your campaign (TFE or TSE) and enjoy full 6DoF dual-wielding chaos!

---

### VR Features & Controls
* **Dual Wielding:** Hold different weapons in each hand! Press each controller's grip to cycle weapons, and pull each controller's trigger independently to fire.
* **Camera Modes:** Play in traditional first-person VR or switch to third-person and roomscale 3D diorama modes.
* **Customizable HUD:** Adjust health/ammo HUD opacity, scale, and positioning in VR player settings.
* **Interact:** Click the Right Controller Thumbstick to use switches and open doors.$qp$,
  troubleshooting_notes = $qp$Launch the APK once first to grant storage permissions and initialize /sdcard/questsam. Both TFE and TSE can be placed in the same folder or separate subfolders; QuestSam automatically links archives when SE1_00.gro is found.$qp$,
  updated_at = now()
WHERE slug = 'questsam';

-- ut99-vr-quest
UPDATE public.ports SET
  latest_version = 'v1.1.0',
  base_game_url = 'https://en.wikipedia.org/wiki/Unreal_Tournament',
  base_game_store = 'Requires your own original PC copy',
  updated_at = now()
WHERE slug = 'ut99-vr-quest';

-- nolf-vr
UPDATE public.ports SET
  base_game_store = 'Requires your own original PC copy',
  updated_at = now()
WHERE slug = 'nolf-vr';
