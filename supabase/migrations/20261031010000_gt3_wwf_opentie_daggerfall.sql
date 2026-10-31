-- Add four ports from the suggestion queue: Gran Turismo 3 VR (GT3 Revisited), WWF No Mercy VR,
-- OpenTIE VR (Star Wars: TIE Fighter) and Daggerfall Unity VR.
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
  'gran-turismo-3-vr',
  'Gran Turismo 3 VR (GT3 Revisited)',
  'matt-pulsipher',
  'https://github.com/matt-pulsipher',
  'An open-source reimplementation of the Gran Turismo 3 A-Spec engine with a native Meta Quest build. GT Mode, Arcade and licenses run from your own disc image, with the menus on a large virtual screen and races in stereo from the driver''s seat.',
  'engine_recreation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/gran-turismo-3-vr.png',
  null,
  array['Quest 3'],
  array['VR Steering Wheel', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Gran_Turismo_3:_A-Spec',
  'Requires your own copy (PlayStation 2 disc image, .iso)',
  'https://github.com/matt-pulsipher/GT3-revisited/releases/download/v0.4.2/gt3r-quest.apk',
  'GitHub Releases',
  'https://github.com/matt-pulsipher/GT3-revisited',
  'v0.4.2',
  '2026-10-30T23:20:20Z',
  false,
  '### Overview
**GT3 Revisited** is an open-source reimplementation of the *Gran Turismo 3 A-Spec* engine. It reads your own disc image at runtime and decodes the game''s data directly, so nothing is extracted or redistributed. The Quest build shows the menus on a large virtual screen and puts you in the driver''s seat for races, in stereo, with Touch controllers (sticks and analog triggers, or grab a steering wheel).

GT Mode, Arcade, licenses, 2P battle, Replay Theater and Options are all there. The project reports the whole game as playable.

> [!NOTE]
> **No game files included.** You need an `.iso` image made from your own copy of Gran Turismo 3 A-Spec. The NTSC-U releases (SCUS-97102 and the PBPX-95503 bundle disc) are verified. Other regions are untested. Only `.iso` images are accepted.

---

### Prerequisites
* Meta Quest 3. The project verified it on Quest 3 only. Quest 2, 3S and Pro are untested.
* An `.iso` image of your own Gran Turismo 3 A-Spec disc.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts, or install `gt3r-quest.apk` with SideQuest / ADB. The release also has `gt3r-android.apk`, which is the phone build. Use the Quest one.
2. Copy your disc image into the headset''s `Download` folder over USB.
3. Launch **GT3 Revisited** from **Library > Unknown Sources**.
4. Choose **Open disc image** and pick your `.iso`. The path is remembered, along with your last five discs.

---

### Good to know
* Saves in the PS2 `BASCUS-97102GAMEDATA` format can be imported with the project''s `gt3tool` on a PC.
* Mods go in the app''s `mods/` folder. The Mods screen has an **Open folder** button.',
  'If the disc is not accepted, check that it is an .iso of Gran Turismo 3 A-Spec (NTSC-U is the verified region). If the remembered disc stops working, open the disc picker and choose it again. Quest 3 is the only verified headset.'
),
(
  'wwf-no-mercy-vr',
  'WWF No Mercy VR',
  'VistaLargaGames',
  'https://github.com/VistaLargaGames',
  'The N64 wrestling classic WWF No Mercy, recompiled to run natively on Meta Quest 3. 60 fps, an immersive camera, and online matches for two to four players, each on their own Quest 3.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/wwf-no-mercy-vr.png',
  null,
  array['Quest 3'],
  array['Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/WWF_No_Mercy',
  'Requires your own copy (Nintendo 64 cartridge ROM, North American Rev 1)',
  'https://github.com/VistaLargaGames/WWF-No-Mercy-Quest-3-Standalone-/releases/download/n64/WWFNoMercyVR-Quest.apk',
  'GitHub Releases',
  'https://github.com/VistaLargaGames/WWF-No-Mercy-Quest-3-Standalone-',
  'v0.1.20',
  '2026-10-17T05:13:00Z',
  false,
  '### Overview
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
1. Install the APK via 1-click on QuestPorts or install `WWFNoMercyVR-Quest.apk` with SideQuest / ADB.
2. Put your ROM on the headset, for example in `/sdcard/Download/`.
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
* **Left menu** pauses. **Meta button** re-centers your view.',
  'Use the North American (USA) Rev 1 / Rev A ROM. Other versions are not supported. Known bug: the screen can stretch or the camera can snap now and then. If an online match reports that the games went out of step, everyone quits and starts a new match. The release tag is named n64 and the APK filename has no version, so the version shown here comes from the app itself.'
),
(
  'opentie-vr',
  'OpenTIE VR (Star Wars: TIE Fighter)',
  'SgtBilko76',
  'https://github.com/SgtBilko76',
  'Star Wars: TIE Fighter running natively on Meta Quest 3, built on the open-source OpenTIE engine. Head-tracked stereo space combat, 3D cockpits for every TIE craft, and Touch controllers as a flight gamepad.',
  'engine_recreation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/opentie-vr.jpg',
  null,
  array['Quest 3'],
  array['Seated'],
  true,
  '/sdcard/OpenTIE/',
  'https://store.steampowered.com/app/355250/STAR_WARS_TIE_Fighter_Special_Edition/',
  'Requires your own copy (Steam: Star Wars TIE Fighter Special Edition)',
  'https://github.com/SgtBilko76/OpenTIE-VR/releases/download/v0.1.8-beta/OpenTIE-VR-v0.1.8-beta.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/OpenTIE-VR',
  'v0.1.8-beta',
  '2026-10-28T15:46:36Z',
  false,
  '### Overview
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
1. Install the APK via 1-click on QuestPorts or install `OpenTIE-VR-v0.1.8-beta.apk` with SideQuest / ADB.
2. From your Steam folder `STAR WARS Tie Fighter`, copy `collectors_cd` to `/sdcard/OpenTIE/TIE95` and `remastered` to `/sdcard/OpenTIE/TIE98` on the Quest.
3. Launch **OpenTIE VR** from **Library > Unknown Sources** and allow "access to all files" when asked.

**Optional, TIE Defender and Missile Boat 3D cockpits:** if you own *Star Wars: X-Wing Alliance*, copy its game folder to `/sdcard/OpenXWA` (the folder OpenXWA VR uses), or copy just `FLIGHTMODELS/TIECOCKPIT.OPT` to `/sdcard/OpenTIE/`. Without it those craft use the TIE ball cockpit.

---

### Controls
* **Left stick** pitch and yaw. **Right stick left/right** roll. **Right stick up/down** throttle lever (it stays where you leave it).
* **Right trigger** fire. **Left trigger** target. **A / B** next target or nearest fighter. **X / Y** target my attacker or match target speed.
* **Left stick click** back to the cockpit view. **Right stick click** hyperspace.
* **Hold left grip** for the weapons and power radial menu. **Hold right grip** for targets and orders. Tilt the same hand''s stick toward a command and release the grip to run it.
* **Left Menu** opens the OpenTIE menu and pauses the game.
* To re-center, hold the Meta button on the right controller, or hold the left Menu button for one second.
* In menus, the laser comes from the left controller: trigger clicks, grip right-clicks, X is Enter and Y is Space. Clicking a text field opens an on-screen keyboard.',
  'The game folders have to be exactly /sdcard/OpenTIE/TIE95 (collectors_cd) and /sdcard/OpenTIE/TIE98 (remastered). If the app asks for file access, allow "access to all files". Motion blur, temporal upscaling and ambient occlusion are off in stereo. This is a beta tested on Quest 3 only.'
),
(
  'daggerfall-unity-vr',
  'Daggerfall Unity VR (Quest 3)',
  'rwcrosk-arch',
  'https://github.com/rwcrosk-arch',
  'A Daggerfall Unity fork that brings The Elder Scrolls II: Daggerfall to Meta Quest 3 as a native room-scale VR game. Create a character, fight, cast spells, explore and save, with menus floating in your play space.',
  'source_port',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/daggerfall-unity-vr.png',
  null,
  array['Quest 3'],
  array['Smooth Locomotion', 'Roomscale'],
  true,
  '/sdcard/Android/data/com.dfworkshop.dfuquest3/files/Daggerfall/arena2/',
  'https://store.steampowered.com/app/1812390/The_Elder_Scrolls_II_Daggerfall/',
  'Requires your own copy (Steam or GOG, the classic DOS game data)',
  'https://github.com/rwcrosk-arch/dfu-quest3/releases/download/v0.1.0-beta3/DFU-Quest3VR-beta3.apk',
  'GitHub Releases',
  'https://github.com/rwcrosk-arch/dfu-quest3',
  'v0.1.0-beta3',
  '2026-10-02T15:27:21Z',
  false,
  '### Overview
**Daggerfall Unity VR** is a fork of Daggerfall Unity (the open-source engine that runs the 1996 classic) re-targeted for Meta Quest 3. It is not VR layered over an emulator: it is the real engine compiled for Android ARM64 with OpenXR. You get head tracking in a room-scale rig, menus on a floating panel about 2 m ahead with a pointing ray, a world-space keyboard for names, melee and spell casting, and save and load.

The beta build is playable end to end: create a character, fight, explore, save and load. Beta 3 adds true dual wield (each hand uses its own weapon skill and enchantments) and a guard window for shields.

> [!NOTE]
> **No game data included.** You need the classic DOS Daggerfall data (the `arena2` folder, about 500 MB). It is free on Steam and also available on GOG. This is a beta: expect rough edges and performance dips in dense areas. Beta 3 is a dev-config build.

---

### Prerequisites
* Meta Quest 3 in developer mode.
* The `arena2` folder from a Daggerfall install (`.BSA` and `.SND` files).
* A PC with `adb` (Android platform-tools) and a USB cable.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `DFU-Quest3VR-beta3.apk` with SideQuest / ADB.
2. Push the game data to the app''s own storage folder. Scoped storage only lets the app read its own directory, so this has to be done with `adb`:
   `adb push <path-to-your>/Daggerfall/arena2 /storage/emulated/0/Android/data/com.dfworkshop.dfuquest3/files/Daggerfall/arena2`
3. Launch **Daggerfall Unity VR** from **Library > Unknown Sources** and grant any storage permission it asks for.
4. The **settings screen** opens first. Leave the defaults, then press **Done**. The New Game / Load Game menu appears in the world.

**One setting matters:** `settings.ini` is created on first run in `/storage/emulated/0/Android/data/com.dfworkshop.dfuquest3/files/`. Keep `AntialiasingMethod=0`. Temporal antialiasing breaks the per-eye history under OpenXR multi-pass and corrupts stereo.

---

### Controls
* **Left stick** move. **Right stick** turn (X) and pitch (Y). **Right trigger** activate / click.
* **Right grip** attack. **Left grip** attack with a left-hand weapon, or guard with a shield or empty hand.
* **A** sheathe / unsheathe. **B** magic menu. **X (hold)** jump. **Y** menu cycle.
* **Left trigger** cast / recast. **Left stick click** crouch. **Right stick click** toggle run.
* **Menu** is context: back, or the pause options.',
  'If the game starts but the world is empty, the arena2 folder is not where the app looks: it has to be at Android/data/com.dfworkshop.dfuquest3/files/Daggerfall/arena2. If the picture looks broken in stereo, set AntialiasingMethod=0 in settings.ini. The start menu can show a faint mirror of the menu in the background, which is cosmetic. The UI render target grows over long sessions, so restart the app after long play.'
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
