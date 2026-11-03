-- Add five ports by SgtBilko76 (Port Royale): Wipeout Pure VR, Wing Commander Saga VR,
-- Star Wars: Fate of the Galaxy VR, OpenArena VR and Urban Terror VR.
-- Package ids were read from the release APKs.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.
-- Upload the covers and previews to questports-media before the site deploy that references them.

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
  'wipeout-pure-vr',
  'Wipeout Pure VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/WipeoutPure-VR',
  'Wipeout Pure (PSP, 2005) as a native Quest game from a static recompilation: head-tracked stereo 3D, a floating HUD, 60 fps races shown at 120 Hz. Bring your own US disc image.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/wipeout-pure-vr.jpg',
  'mFOZDsTrw9s',
  array['Quest 3', 'Quest 3S'],
  array['Seated', 'Cockpit View', 'Head Tracking'],
  false,
  '/sdcard/Android/data/online.portroyale.wipeoutpurevr/files/import/',
  'https://en.wikipedia.org/wiki/Wipeout_Pure',
  'Requires your own copy (PSP disc image, US Greatest Hits edition UCUS-98612, version 2.00)',
  'https://github.com/SgtBilko76/WipeoutPure-VR/releases/download/v0.1.0-beta/WipeoutPure-VR-v0.1.0-beta.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/WipeoutPure-VR',
  'v0.1.0-beta',
  '2026-10-30T16:39:47Z',
  false,
  '### Overview
**Wipeout Pure VR** is a standalone VR port of Wipeout Pure (PSP, 2005) by SgtBilko76 (Port Royale), built on [pure-recomp](https://github.com/erreib/pure-recomp): the game is statically recompiled to a native app, with no emulator. Races run in stereo 3D with head tracking, so you can look into the corners and over the edge of the track. The HUD floats in front of you; menus and movies are on a curved screen. Races run at 60 fps, shown at 120 Hz on Quest 3.

> [!NOTE]
> The APK contains none of the game. You need a disc image dumped from your own copy of Wipeout Pure, **US Greatest Hits edition (UCUS-98612, version 2.00)**. The app checks the image and refuses other editions and regions.

---

### Prerequisites
* Meta Quest 3 or 3S (tested). Quest 2 and Pro are untested and get lighter defaults automatically.
* Your own Wipeout Pure disc image (`.iso`, any file name).
* Wi-Fi on the first start: the app downloads the HD texture pack by NR74W (about 450 MB) from its author''s GitHub repository. Nothing of the pack is in the APK. To skip it, create an empty file `files/no-hd-textures` before the first start.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `WipeoutPure-VR-v0.1.0-beta.apk` with SideQuest or `adb install -r`.
2. Start **Wipeout Pure VR** once (Library > Unknown Sources) so it creates its folder, then quit with the Meta button.
3. Copy your disc image to `/sdcard/Android/data/online.portroyale.wipeoutpurevr/files/import/` with a PC file manager (headset on USB, file access allowed), SideQuest''s file manager or `adb push`.
4. Start the app again. It checks the image, sets the game up in a few seconds and starts it. If the image is not the supported one, `import/SETUP-ERROR.txt` says why.

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
| Both stick clicks | the port''s settings menu | |

Hold the Meta button to re-centre the view.

> [!TIP]
> Saves and settings live in `files/` next to `import/`. **Uninstalling the app deletes that folder**: copy it to your PC first.',
  'If the app shows a desktop setup screen, no valid disc image was imported yet (install step 3). Open import/SETUP-ERROR.txt to see why an image was refused. The first races may hitch briefly when an effect shows for the first time. No online multiplayer yet. If it does not start, the author asks for files/PureNative.log and files/PureNative-previous.log in a GitHub issue.'
),
(
  'wc-saga-vr',
  'Wing Commander Saga VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/WCSaga-VR',
  'Wing Commander Saga, the free fan game, in head-tracked stereo VR on Meta Quest 3, on the FreeSpace Open engine. A one-tap installer downloads the free game data on first start.',
  'source_port',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/wc-saga-vr.jpg',
  '_78A7784kSQ',
  array['Quest 3', 'Quest 3S'],
  array['Seated', 'Cockpit View', 'Head Tracking'],
  false,
  'N/A (the app downloads the free game data to /sdcard/WCSaga/Wing_Commander_Saga on first start)',
  'https://www.wcsaga.com/',
  'Free (game data downloaded in the app from the FSNebula mod repository)',
  'https://github.com/SgtBilko76/WCSaga-VR/releases/download/v0.1.5-beta/WCSaga-VR-v0.1.5-beta.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/WCSaga-VR',
  'v0.1.5-beta',
  '2026-10-18T17:05:09Z',
  false,
  '### Overview
**Wing Commander Saga VR** is a beta VR port of Wing Commander Saga: The Darkest Dawn, the free non-commercial fan game, by SgtBilko76 (Port Royale). It runs natively on Meta Quest 3 on the [FreeSpace Open](https://github.com/scp-fs2open/fs2open.github.com) engine with OpenXR: head-tracked stereo space, the HUD fixed in front of your ship, and menus, briefings and cutscenes on a big screen with a laser pointer.

> [!NOTE]
> **Nothing to copy.** The APK holds no game data. On first start the **One-Tap Installer** downloads Wing Commander Saga 0.9.65 (3.6 GB) from the official FSNebula mod repository, checks it and unpacks it on the headset. You need about 9 GB free while it installs; the game uses 6.7 GB afterwards.

---

### Prerequisites
* Meta Quest 3 (the only headset tested).
* About 9 GB of free storage and Wi-Fi for the one-time download (10 to 20 minutes).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `WCSaga-VR-v0.1.5-beta.apk` with SideQuest or `adb install -r -g`.
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
> Already have the game data at `/sdcard/WCSaga/Wing_Commander_Saga/data`? The installer is skipped. You can also copy a Windows install of the full game plus patch v1.1.0.7822 from wcsaga.com to `/sdcard/WCSaga/Wing_Commander_Saga`.',
  'Beta, tested on Quest 3 only. Flight runs at about 26 to 30 fps because the engine renders both eyes on one CPU core; menus run at full speed. Shadows are off by default (Options > Graphics > Shadow Quality). There is no 3D cockpit: Wing Commander Saga has no cockpit models. If the data download stops, start the app again and press Download and install.'
),
(
  'fotg-vr',
  'Star Wars: Fate of the Galaxy VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/FotG-VR',
  'Fate of the Galaxy, the free Star Wars Original Trilogy space combat mod, in stereo VR with full 3D cockpits on Meta Quest 3 and PICO, on the FreeSpace Open engine.',
  'source_port',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/fotg-vr.jpg',
  'Yy2Cr9rJHQ4',
  array['Quest 3', 'Quest 3S'],
  array['Seated', 'Cockpit View', 'Head Tracking'],
  false,
  '/sdcard/FotG/FotG_R/',
  'https://www.moddb.com/games/fate-of-the-galaxy',
  'Free (Fate of the Galaxy data from the Nebula mod server, 2.6 GB; FreeSpace 2 is not needed)',
  'https://github.com/SgtBilko76/FotG-VR/releases/download/v0.1.0-beta/FotG-VR-v0.1.0-beta.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/FotG-VR',
  'v0.1.0-beta',
  '2026-11-03T12:48:15Z',
  false,
  '### Overview
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
1. Install the APK via 1-click on QuestPorts or install `FotG-VR-v0.1.0-beta.apk` with SideQuest or `adb install -r -g`.
2. Put the game data on the headset so that `/sdcard/FotG/FotG_R/data` holds `tables`, `models`, `maps` and so on. Either:
   * On the PC, run [`get_fotg_data.py`](https://github.com/SgtBilko76/FotG-VR/blob/fotg-vr/tools/quest/get_fotg_data.py) as `python3 get_fotg_data.py --push`. It downloads the newest release from the official Nebula server, checks it and copies it over.
   * Or install Fate of the Galaxy with [Knossos.NET](https://knossosnet.github.io/Knossos-Release-Page/) on the PC and copy the `data` folder from its `FotG_R-<version>` folder to `/sdcard/FotG/FotG_R` with SideQuest.
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

Menus: point with either controller and pull the trigger to click, A is Enter, B or the left Menu button is Escape.',
  'Beta, tested on Quest 3 only. Deferred lighting is off because it drops the detailed cockpits to about 46 fps. Only the first Rebel mission has been flight-tested so far. If the game does not start, check that /sdcard/FotG/FotG_R/data contains tables, models and maps. On PICO, install with adb and allow storage access.'
),
(
  'openarena-vr',
  'OpenArena VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/OpenArena-VR',
  'OpenArena, the free Quake III style arena shooter, as a 6DoF Quest game with bots and online servers. One self-contained APK, no game files to copy.',
  'source_port',
  'released',
  'https://questports-media.questports.workers.dev/covers/openarena-vr.jpg',
  'BDeqjtsSnhw',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
  true,
  'N/A (the game data is bundled in the APK and unpacked to /sdcard/OpenArenaVR on first start)',
  'https://openarena.ws/',
  'Free (game data is inside the APK)',
  'https://github.com/SgtBilko76/OpenArena-VR/releases/download/v1.1.0/OpenArena-VR-v1.1.0.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/OpenArena-VR',
  'v1.1.0',
  '2026-10-25T09:46:44Z',
  false,
  '### Overview
**OpenArena VR** is a standalone port of OpenArena 0.8.8 for Meta Quest by SgtBilko76 (Port Royale), built on Team Beef''s ioq3quest (the engine behind Quake3Quest). It has Quake3Quest''s 6DoF controls: aim and shoot with your hand, a weapon wheel, comfort options and a VR HUD. You get every OpenArena map, character, weapon and game mode, single player against bots and skirmish, and online multiplayer on the real OpenArena server list, including pure and mod servers (missing maps and mod files download automatically).

> [!NOTE]
> **Nothing to copy.** The APK is about 400 MB and has everything inside: no PC, no extra downloads, no game files.

---

### Prerequisites
* Meta Quest 2, 3, 3S or Pro (tested on Quest 3).
* About 400 MB of free storage.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `OpenArena-VR-v1.1.0.apk` from GitHub Releases.
2. Launch **OpenArena-VR** from **Unknown Sources**.
3. On first start, allow file access when asked. The game data unpacks to `/sdcard/OpenArenaVR/` once, which takes about a minute.

---

### Features
* VR crosshair coloured by your health (style in Setup > Game Options).
* VR on-screen keyboard for your player name and other text fields.
* Updating from 1.0.0 keeps your settings and downloaded maps.

> [!TIP]
> PICO 4 / Neo 3 support is in this build but is untested on PICO hardware.',
  'If the game stops after the first start, check that file access is allowed for the app. The first start unpacks about 400 MB, so give it a minute. Online servers that need extra maps or mods download them on join.'
),
(
  'urbanterror-vr',
  'Urban Terror VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/UrbanTerror4-VR',
  'Urban Terror 4.3, the free tactical multiplayer shooter, as a 6DoF Quest game with hand-held guns, two-handed aiming and scopes. The game data downloads in the app.',
  'source_port',
  'released',
  'https://questports-media.questports.workers.dev/covers/urbanterror-vr.jpg',
  'iF7uJmtLRZ0',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
  true,
  'N/A (the app downloads the free game data to /sdcard/UrTQuest/q3ut4 on first start)',
  'https://www.urbanterror.info/',
  'Free (game data downloaded in the app from FrozenSand)',
  'https://github.com/SgtBilko76/UrbanTerror4-VR/releases/download/v1.0.1/UrbanTerror4-VR-v1.0.1.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/UrbanTerror4-VR',
  'v1.0.1',
  '2026-10-25T17:21:04Z',
  false,
  '### Overview
**Urban Terror VR** is Urban Terror 4.3 as a standalone 6DoF VR game for Meta Quest, by SgtBilko76 (Port Royale), built on Team Beef''s ioq3quest with the VR integration modelled on QuakeQuest. Urban Terror is a free multiplayer tactical shooter by FrozenSand. Every weapon sits in your hand at its real size, with its barrel lined up on the crosshair. Hold the left grip near the gun for two-handed aiming, and zoom scopes that follow your hand. You can play offline against bots from the main menu or online through Urban Terror''s master servers (servers that require an Urban Terror account login are not supported yet).

> [!NOTE]
> The game data is not in the APK. On first start the app downloads Urban Terror 4.3.4 from FrozenSand''s official server (1.4 GB, size and MD5 checked) and installs it to `/sdcard/UrTQuest/q3ut4`. About 3 GB of free space is needed while installing.

---

### Prerequisites
* Meta Quest (tested on Quest 3). The same APK is built for PICO 4 / Neo 3, untested.
* About 3 GB of free storage and Wi-Fi for the one-time download.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `UrbanTerror4-VR-v1.0.1.apk` from GitHub Releases.
2. Start **Urban Terror VR** from **Unknown Sources** and allow file access.
3. On the first start press **I agree - download and install** and wait.
4. Change your player name (it starts as `QuestPlayer`) in the game''s player setup. Clicking a text field with the laser opens a virtual keyboard.

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
> Already have Urban Terror 4.3? Copy its `q3ut4` folder to `/sdcard/UrTQuest/q3ut4` instead of downloading. Version 1.0.1 installs over 1.0.0 and keeps your settings.',
  'The first start needs Wi-Fi to download 1.4 GB. If it stops, start the app again. The scoreboard has no button in this layout. Servers that require an Urban Terror account login are not supported yet.'
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
