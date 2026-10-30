-- Add six ports: Ghost Squad Evolution VR and The House of the Dead 4 VR (Sega Lindbergh recomps),
-- Teraburst VR and CarnEvil VR (vr4all-standalone), Mystical Ninja VR and Sin & Punishment VR (VistaLargaGames).
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.
-- Upload the covers to questports-media (npm run media:deploy) before the site deploy that references them.

begin;

insert into public.ports (
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
  github_url,
  latest_version,
  last_github_update,
  featured,
  installation_guide,
  troubleshooting_notes
) values
(
  'ghost-squad-evolution-vr',
  'Ghost Squad Evolution VR',
  'lialan',
  'https://github.com/lialan/lindbergh-recomp-ports',
  'Sega''s 2007 Lindbergh arcade light-gun shooter Ghost Squad Evolution, statically recompiled to native code and running standalone on Meta Quest in stereo VR. Tracked controller gun and a HUD on a floating screen. Nothing is emulated.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/ghost-squad-evolution-vr.png',
  null,
  array['Quest 3', 'Quest 3S', 'Quest Pro'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/GhostSquadEvolution/',
  'https://en.wikipedia.org/wiki/Ghost_Squad',
  'Requires your own copy (Sega Lindbergh arcade game files)',
  'https://github.com/lialan/lindbergh-recomp-ports/releases/download/v0.2.0/GhostSquadEvolutionVR-v0.2.0-quest3.apk',
  'GitHub Releases',
  'https://github.com/lialan/lindbergh-recomp-ports',
  'v0.2.0',
  '2026-10-29T21:48:55Z',
  false,
  '### Overview
**Ghost Squad Evolution VR** runs Sega''s 2007 Lindbergh arcade light-gun shooter standalone on Meta Quest. The game''s x86 Linux executable is statically recompiled to native code with the lindberghrecomp toolkit, so nothing is emulated. The world is in stereo around you, the gun is a tracked controller, and the HUD hangs on a screen in front of you.

Built by lialan on top of sp00nznet''s Ghost Squad Evolution recompilation and lindberghrecomp toolkit.

> [!NOTE]
> **No game files included.** The APK holds the recompiled game code, the VR host and its libraries, but none of the game''s files. You need your own copy of the arcade game. The app only runs the game version it was built from.

---

### Prerequisites
* Meta Quest 3, Quest 3S, or Quest Pro.
* Your own copy of the Ghost Squad Evolution `vsg_l` folder.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `GhostSquadEvolutionVR-v0.2.0-quest3.apk` with SideQuest / `adb install -r`.
2. Copy the whole `vsg_l` folder to `/sdcard/GhostSquadEvolution/vsg_l`, so the executable ends up at `/sdcard/GhostSquadEvolution/vsg_l/vsg` (`adb push vsg_l /sdcard/GhostSquadEvolution/`).
3. Launch **Ghost Squad Evolution VR** from **Unknown Sources**.
4. The first time, the app opens the **All files access** screen. Allow it, then start the app again.

---

### Controls
* **Trigger** fires. **Grip** reloads, or fire while pointing off the screen.
* **A / X** is the action button. **B / Y** changes fire mode.
* A thumbstick click is Start. Coins are inserted automatically.
* The **left menu button** opens the settings panel: sights, laser, gun model, hand, screen distance, resolution, display rate, recentring, and Reset game.

> [!TIP]
> Updates install over the previous version and keep the game, settings and saves.',
  'If the game is missing or is a different version than the one this APK was built from, the app writes HOW-TO-ADD-THE-GAME.txt to Android/data/org.lindbergh.gse.vr/files/. The executable has to be at /sdcard/GhostSquadEvolution/vsg_l/vsg. If the app closes right after the first start, allow All files access and open it again.'
),
(
  'hotd4-vr',
  'The House of the Dead 4 VR',
  'lialan',
  'https://github.com/lialan/lindbergh-recomp-ports',
  'Sega''s 2005 Lindbergh arcade zombie light-gun shooter The House of the Dead 4, statically recompiled to native code and running standalone on Meta Quest in stereo VR. Tracked controller gun, nothing emulated.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/hotd4-vr.png',
  null,
  array['Quest 3', 'Quest 3S', 'Quest Pro'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/HouseOfTheDead4/',
  'https://en.wikipedia.org/wiki/The_House_of_the_Dead_4',
  'Requires your own copy (Sega Lindbergh arcade game files)',
  'https://github.com/lialan/lindbergh-recomp-ports/releases/download/v0.2.0/HouseOfTheDead4VR-v0.2.0-quest3.apk',
  'GitHub Releases',
  'https://github.com/lialan/lindbergh-recomp-ports',
  'v0.2.0',
  '2026-10-29T21:48:55Z',
  false,
  '### Overview
**The House of the Dead 4 VR** runs Sega''s 2005 Lindbergh arcade zombie shooter standalone on Meta Quest. The game''s x86 Linux executable is statically recompiled to native code with the lindberghrecomp toolkit, so nothing is emulated. The world is in stereo around you, the gun is a tracked controller, and the HUD hangs on a screen in front of you.

Built by lialan on top of sp00nznet''s lindberghrecomp toolkit.

> [!NOTE]
> **No game files included.** The APK holds the recompiled game code, the VR host and its libraries, but none of the game''s files. You need your own copy of the arcade game. The app only runs the game version it was built from.

---

### Prerequisites
* Meta Quest 3, Quest 3S, or Quest Pro.
* Your own copy of the game''s `elf`, `fs` and `drv` folders.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `HouseOfTheDead4VR-v0.2.0-quest3.apk` with SideQuest / `adb install -r`.
2. Copy the `elf`, `fs` and `drv` folders into `/sdcard/HouseOfTheDead4/`, so the executable ends up at `/sdcard/HouseOfTheDead4/elf/hod4M.elf` (`adb push elf fs drv /sdcard/HouseOfTheDead4/`).
3. Launch **The House of the Dead 4 VR** from **Unknown Sources**.
4. The first time, the app opens the **All files access** screen. Allow it, then start the app again.

---

### Controls
* **Trigger** fires. **Grip** reloads, or fire while pointing off the screen.
* A thumbstick click is Start. Coins are inserted automatically.
* The **left menu button** opens the settings panel: sights, laser, gun model, hand, screen distance, resolution, display rate, recentring, and Reset game.

> [!TIP]
> Updates install over the previous version and keep the game, settings and saves.',
  'If the game is missing or is a different version than the one this APK was built from, the app writes HOW-TO-ADD-THE-GAME.txt to Android/data/org.lindbergh.hotd4.vr/files/. The executable has to be at /sdcard/HouseOfTheDead4/elf/hod4M.elf. If the app closes right after the first start, allow All files access and open it again.'
),
(
  'teraburst-vr',
  'Teraburst VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/teraburst-vr',
  'Konami''s 1998 arcade alien-invasion light-gun shooter Teraburst in stereo VR, standalone on Meta Quest 3. Tracked guns, native 3D scenery, and two-player support.',
  'emulator',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/teraburst-vr.jpg',
  null,
  array['Quest 3', 'Quest 3S'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Teraburst',
  'Requires your own copy (Konami arcade set terabrst)',
  'https://github.com/vr4all-standalone/teraburst-vr/releases/download/v0.1.2/teraburst-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/teraburst-vr',
  'v0.1.2',
  '2026-10-30T06:01:30Z',
  false,
  '### Overview
**Teraburst VR** brings Konami''s 1998 Hornet light-gun arcade game to Meta Quest 3 and 3S in stereo VR. MAME runs the original game while the OpenXR host rebuilds the scenery in native 3D, and your tracked controllers become the guns. Solo play and two-player play are both supported.

> [!NOTE]
> **No game files included.** Requires the Teraburst set, July 17, 1998 US UEL (MAME short name `terabrst`): the complete, validated `terabrst.zip`. No CHD and no separate BIOS are required. Renaming a `.7z` file to `.zip` will not work.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own complete `terabrst.zip`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `teraburst-vr-quest.apk` from GitHub Releases.
2. Put your complete `terabrst.zip` into `/sdcard/Download/`. Keep it zipped.
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
> An update installs over the previous version with the same signing identity and keeps game data, saves and preferences. Exit normally so the native clock and operator state are saved.',
  'The set must be the complete terabrst.zip (Teraburst, July 17, 1998, US UEL). A renamed .7z or a different region will fail the size and hash check on the setup screen. Keep both Touch controllers awake and allow the file access prompt.'
),
(
  'carnevil-vr',
  'CarnEvil VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/carnevil-vr',
  'Midway''s arcade horror light-gun game CarnEvil in VR, standalone on Meta Quest 3. Tracked lightguns, depth 3D scenery, and two-player support.',
  'emulator',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/carnevil-vr.jpg',
  null,
  array['Quest 3', 'Quest 3S'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/CarnEvil',
  'Requires your own copy (Midway arcade set carnevil v1.0.3)',
  'https://github.com/vr4all-standalone/carnevil-vr/releases/download/v0.1.4/carnevil-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/carnevil-vr',
  'v0.1.4',
  '2026-10-30T06:01:29Z',
  false,
  '### Overview
**CarnEvil VR** brings Midway''s arcade horror light-gun game to Meta Quest 3 and 3S. MAME runs the original game while the OpenXR host rebuilds its characters and scenery in stereo, and your tracked controllers become the lightguns. Depth 3D backgrounds are on by default, with the original look available in the VR menu.

> [!NOTE]
> **No game files included.** Requires the CarnEvil v1.0.3 set: `carnevil.zip` (containing `carnevil1_9.u32`, `sound102.u95` and `486_carnevil.u96`) and the matching CHD `carnevil.chd`. No NAOMI BIOS is required.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own `carnevil.zip` and `carnevil/carnevil.chd`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `carnevil-vr-quest.apk` from GitHub Releases.
2. Put the ROM zip at `/sdcard/Download/carnevil.zip`. Keep it packed.
3. Put the disc image at `/sdcard/Download/carnevil/carnevil.chd`.
4. Launch **CarnEvil VR** from **Unknown Sources**, grant file access on the setup screen, and keep the Touch controllers awake.
5. Start the game. The controller guide appears after the splash.

---

### Features
* Solo hand switching and two-player play with reversible P1 / P2 hand assignment.
* 3D strength and stereo separation controls, plus adjustable world size.
* Lasers aligned to the shot, recoil, muzzle flash, smoke, and adjustable haptics.
* Three reload modes, and Arcade or Zapper gun options.

> [!TIP]
> Updates install over the previous version. Settings, NVRAM and disk differences are kept by the app.',
  'The CHD must be the one matching CarnEvil v1.0.3 (overall SHA1 5cffb0de63ad36eb01c5951bab04d3f8a9e23e16). Do not unzip carnevil.zip. If the setup screen cannot find the files, check the two paths exactly: Download/carnevil.zip and Download/carnevil/carnevil.chd.'
),
(
  'mystical-ninja-vr',
  'Mystical Ninja VR',
  'VistaLargaGames',
  'https://github.com/VistaLargaGames',
  'Mystical Ninja Starring Goemon (Nintendo 64) running natively on Meta Quest 3 at 60 FPS, built on Goemon 64: Recompiled. Head-tracked camera that follows Goemon, plus a first-person mode.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/mystical-ninja-vr.jpg',
  null,
  array['Quest 3'],
  array['Smooth Locomotion', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Mystical_Ninja_Starring_Goemon',
  'Requires your own copy (Nintendo 64 cartridge ROM, USA)',
  'https://github.com/VistaLargaGames/Mystical-Ninja-VR/releases/download/v0.1.20/MysticalNinjaVR-Quest-0.1.20.apk',
  'GitHub Releases',
  'https://github.com/VistaLargaGames/Mystical-Ninja-VR',
  'v0.1.20',
  '2026-10-18T23:09:28Z',
  false,
  '### Overview
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
1. Install the APK via 1-click on QuestPorts or install `MysticalNinjaVR-Quest-0.1.20.apk` with SideQuest / ADB.
2. Put your ROM somewhere on the headset, for example `/sdcard/Download/`.
3. Launch **Mystical Ninja VR** from **Library > Unknown Sources**.
4. In the start window, choose your ROM. The game checks the file and remembers it. After that, just press **Play**.

---

### Controls
* **Left stick** moves, and walks where you look. **Left stick click** toggles first person.
* **A / B** jump and attack. **X / Y** change weapon and magic.
* **Left grip** opens the minimap. **Right grip** changes character.
* **Left trigger** camera control. **Right trigger** crawl.
* **Right stick** turns and sets camera distance. **Right stick click** puts the camera behind Goemon.
* **Menu** pauses.',
  'Use a North American (USA) ROM. The start window checks the file before it lets you play. The app is Quest 3 only.'
),
(
  'sin-and-punishment-vr',
  'Sin & Punishment VR',
  'VistaLargaGames',
  'https://github.com/VistaLargaGames',
  'Treasure''s N64 rail shooter Sin and Punishment running natively on Meta Quest 3. Point-and-shoot aiming, a wide head-tracked view in the stages, 60 fps, and HD texture pack support.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/sin-and-punishment-vr.png',
  null,
  array['Quest 3'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Sin_and_Punishment',
  'Requires your own copy (Nintendo 64 cartridge ROM)',
  'https://github.com/VistaLargaGames/Sin-and-Punishment-Quest-VR/releases/download/v0.1.0/Sin-and-Punishment-VR-0.1.0.apk',
  'GitHub Releases',
  'https://github.com/VistaLargaGames/Sin-and-Punishment-Quest-VR',
  'v0.1.0',
  '2026-10-29T21:36:18Z',
  false,
  '### Overview
**Sin & Punishment VR** runs Treasure''s N64 rail shooter *Sin and Punishment* (*Tsumi to Batsu: Hoshi no Keishousha*) natively on Meta Quest 3 as recompiled code, not an emulator. Point your right controller at the enemies, pull the trigger, and look around the stage with your head. The game is drawn about 120 x 104 degrees wide, at 60 fps, with a small, crisp HUD.

> [!NOTE]
> **No game files included.** Unofficial fan project. You need your own ROM (`.z64`, `.n64` or `.v64`). Japanese ROMs and the English fan translation both work.

---

### Prerequisites
* Meta Quest 3.
* Your own Sin and Punishment ROM.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `Sin-and-Punishment-VR-0.1.0.apk` with SideQuest / ADB.
2. Put your ROM on the headset, for example in `/sdcard/Download/`.
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
Copy a Rice-format texture pack folder (the same packs N64 emulators use in `hires_texture`) into `Android/data/com.sinandpunishment.recompiled/files/snprecomp/texture_packs/`, then start the game.',
  'If the ROM window rejects your file, check that it is a .z64, .n64 or .v64 of Sin and Punishment (Japanese, or the English fan translation). The app is Quest 3 only. This is the first release, so expect rough edges.'
)
on conflict (slug) do update set
  title = excluded.title,
  developer = excluded.developer,
  developer_url = excluded.developer_url,
  short_description = excluded.short_description,
  category = excluded.category,
  status = excluded.status,
  cover_image_url = excluded.cover_image_url,
  youtube_video_id = excluded.youtube_video_id,
  supported_hardware = excluded.supported_hardware,
  locomotion_types = excluded.locomotion_types,
  has_6dof_controls = excluded.has_6dof_controls,
  internal_storage_path = excluded.internal_storage_path,
  base_game_url = excluded.base_game_url,
  base_game_store = excluded.base_game_store,
  port_download_url = excluded.port_download_url,
  port_download_source = excluded.port_download_source,
  github_url = excluded.github_url,
  latest_version = excluded.latest_version,
  last_github_update = excluded.last_github_update,
  featured = excluded.featured,
  installation_guide = excluded.installation_guide,
  troubleshooting_notes = excluded.troubleshooting_notes;

commit;
