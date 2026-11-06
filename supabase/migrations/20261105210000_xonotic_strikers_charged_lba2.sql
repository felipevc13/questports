-- Add Xonotic VR (SgtBilko76), Mario Strikers Charged VR (LanceSweatpants) and
-- Little Big Adventure 2 Classic Quest (simsas-experiments).
-- Package ids were read from the release APKs: com.sgtbilko.xonoticquest,
-- io.github.lancesweatpants.strikerscharged and org.lbalab.lba2cc.
-- Xonotic VR is a Beta; Strikers Charged (alpha) and LBA2 (v0.0.3) are in_development.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.
-- Upload the covers and previews to questports-media before the site deploy that references them.

begin;

insert into public.ports (
  slug, title, developer, developer_url, short_description, category, status, cover_image_url,
  youtube_video_id, supported_hardware, locomotion_types, has_6dof_controls, internal_storage_path,
  base_game_url, base_game_store, port_download_url, port_download_source, github_url, latest_version,
  last_github_update, featured, installation_guide, troubleshooting_notes
) values
(
  'xonotic-vr',
  'Xonotic VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/Xonotic-VR',
  'Xonotic, the free and fast open-source arena shooter, as a standalone 6DoF Quest game with a hand-held weapon, bots and online servers. One self-contained APK, no game files to copy.',
  'source_port',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/xonotic-vr.jpg',
  'w-yJB0LtcFU',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
  true,
  'N/A (the game data is bundled in the APK and unpacked to /sdcard/XonoticVR on first start)',
  'https://xonotic.org/',
  'Free (game data is inside the APK)',
  'https://github.com/SgtBilko76/Xonotic-VR/releases/download/Beta-0.5/Xonotic-VR-full-release.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/Xonotic-VR',
  'Beta-0.5',
  '2026-10-05T09:38:53Z',
  false,
  '### Overview
**Xonotic VR** is a standalone port of Xonotic 0.8.6 for Meta Quest by SgtBilko76 (Port Royale). Xonotic is a free, open-source arena shooter with fast movement and a large arsenal, each weapon with a primary and a secondary fire. Deathmatch, Capture The Flag, Clan Arena, Nexball, Freeze Tag and Multiplayer Race are all here. This port runs the real game natively on the headset, with room-scale head tracking, the weapon held in your hand, offline matches against bots and the game''s own server browser for online play.

> [!NOTE]
> **Nothing to copy.** The release APK is self-contained: the game data is bundled, so there is no PC step and no extra download.

---

### Prerequisites
* Meta Quest 2, 3, 3S or Pro (developed and tested on Quest 3).
* About 3 GB of free storage. The APK is about 1.1 GB and the game data unpacks to about 1.8 GB.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `Xonotic-VR-full-release.apk` from GitHub Releases.
2. Open **Library**, set the filter to **Unknown Sources** and start **Xonotic VR**.
3. On first start, allow storage access when asked. The game data unpacks to `/sdcard/XonoticVR` once, which takes a few minutes. The game then starts by itself.

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
> Everything is a normal Xonotic console variable. Your own settings are safest in a separate `myconfig.cfg`, because `vr.cfg` is rewritten when a release ships new VR defaults. The port README explains how.',
  'This is a Beta (0.5). The first start unpacks about 1.8 GB and can take a few minutes, so wait for the game to start by itself. If it does not, check that storage access is allowed for the app and that about 3 GB is free. If the frame rate drops, lower vr_supersampling or raise vr_foveation. PICO is listed by the author but untested here.'
),
(
  'strikers-charged-vr',
  'Mario Strikers Charged VR',
  'LanceSweatpants',
  'https://github.com/LanceSweatpants',
  'Mario Strikers Charged (Wii, 2007) running natively on Meta Quest 3, built from the community decompilation. Play on a giant screen in your room or in a VR stadium, with the Touch controllers as a Wii Remote and Nunchuk.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/strikers-charged-vr.jpg',
  'qouu9d4fPxI',
  array['Quest 3', 'Quest 3S'],
  array['Seated', 'Roomscale', 'Mixed Reality (passthrough)'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Mario_Strikers_Charged',
  'Requires your own copy (Wii disc image, Mario Strikers Charged USA R4QE01 revision 1)',
  'https://github.com/LanceSweatpants/Quest-3-Strikers-CHARGED/releases/download/v0.1.1-alpha1.1/QuestStrikersCharged-alpha1.1.apk',
  'GitHub Releases',
  'https://github.com/LanceSweatpants/Quest-3-Strikers-CHARGED',
  'v0.1.1-alpha1.1',
  '2026-10-16T01:02:57Z',
  false,
  '### Overview
**Mario Strikers Charged VR** is *Mario Strikers Charged* (Wii, 2007) running natively on a Meta Quest 3. It is not an emulator: the game is built from the community decompilation (a fork of `yannicksuter/mscharged-port`), compiled for the headset and drawn through OpenXR. By LanceSweatpants, the same author as Quest 3 Strikers (Super Mario Strikers).

**Install type: APK + your own disc image.**

> [!WARNING]
> **Free alpha, Quest 3 and 3S only.** This is a **3D screen, not immersive VR gameplay**: you watch the match on a giant screen floating in your room (passthrough) or from a VR stadium. Expect rough edges. Quest 2 and Quest Pro are untested. Online play and a tabletop mode are announced for later updates.

> [!NOTE]
> **No game files are included.** You need your own copy of Mario Strikers Charged: the **USA version (`R4QE01`), revision 1**, as `.iso`, `.rvz` or `.wia`. Other regions and revisions do not work yet. Fan project, not affiliated with Nintendo.

---

### Prerequisites
1. **Meta Quest 3 or 3S** with Developer Mode enabled. The APK is about 15 MB.
2. Your disc image as `.iso`, `.rvz` or `.wia`. Unzip it first if it is zipped.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `QuestStrikersCharged-alpha1.1.apk` from GitHub Releases.
2. Put your disc image in `/sdcard/Download/` on the headset.
3. Open **Library**, set the filter to **Unknown Sources** and start **Quest 3 Strikers Charged**.
4. First time only: turn on **Allow access to manage all files** so the app can find your game, then go back.
5. Press **Start**. If it does not find the game, press **Choose game file** and pick yours: it lists every `.iso`, `.rvz` and `.wia` on the headset and says what is wrong with any it cannot use.

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
> When a new version is out, the start screen shows **Update now**. Your saves and your game file stay.',
  'Alpha release. Only the USA R4QE01 revision 1 disc works. If the game is not found, allow All files access for the app and use Choose game file. Goal celebrations in the VR stadium, some menus and the end-of-game screens can dip below 60 fps for a moment, and the first time a new scene plays it can hitch while the headset prepares its graphics.'
),
(
  'lba2-vr',
  'Little Big Adventure 2 Classic Quest',
  'simsas-experiments',
  'https://github.com/simsas-experiments',
  'Twinsen''s Odyssey (Little Big Adventure 2) as a native Quest port of the LBA2 Classic community engine, with stereo 3D, 6DoF tracking and a first-person IK body. You supply the game data.',
  'source_port',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/lba2-vr.jpg',
  'z6Ls3HKnBZM',
  array['Quest 2', 'Quest 3', 'Quest Pro'],
  array['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
  true,
  '/sdcard/lba2cc/',
  'https://www.gog.com/game/little_big_adventure_2',
  'Requires your own copy (GOG, Steam or retail CD, Little Big Adventure 2)',
  'https://github.com/simsas-experiments/lba2-classic-quest/releases/download/v0.0.3/lba2cc-0.0.3-quest-arm64-v8a.apk',
  'GitHub Releases',
  'https://github.com/simsas-experiments/lba2-classic-quest',
  'v0.0.3',
  '2026-11-05T15:13:21Z',
  false,
  '### Overview
**Little Big Adventure 2 Classic Quest** is *Twinsen''s Odyssey* (LBA2, 1997) on Meta Quest. It is a fork of the LBALab community engine [lba2-classic-community](https://github.com/LBALab/lba2-classic-community) with a Quest/OpenXR port on top: native stereo 3D, 6DoF head and controller tracking, a first-person IK body and camera, an interior 3D parallax diorama effect, passthrough, and graphics options (texture filters, MSAA/FXAA, soft shadows, xBR movie upscaling). The original gameplay and assets are kept. The target is 72 fps.

**Install type: APK + your own game data.**

> [!WARNING]
> **Very early release (v0.0.3).** The author says the port was developed with AI coding agents and is not an official LBALab release, so treat it as experimental and keep backups of your saves.

> [!NOTE]
> **No game data is included.** You need your own legitimate copy of LBA2 from [GOG](https://www.gog.com/game/little_big_adventure_2), [Steam](https://store.steampowered.com/app/398000/Little_Big_Adventure_2/) or your retail CD. The engine is GPL-2.0 but the game assets are not redistributable.

---

### Prerequisites
1. **Meta Quest 2, 3 or Pro** with Developer Mode enabled. The Quest APK is about 25 MB.
2. The LBA2 data folder from your copy: the folder that holds `lba2.hqr`, with `music`, `video`, `vox` and the other folders next to it (a `Common` or `CommonClassic` subfolder also works).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `lba2cc-0.0.3-quest-arm64-v8a.apk` from GitHub Releases.
2. Copy your LBA2 data folder to `/sdcard/lba2cc/` on the headset. The author''s PC installer scripts (Linux, macOS, Windows) can do the copy and the install for you over USB.
3. Open **Library**, set the filter to **Unknown Sources** and start the game.
4. If the game cannot read its data, allow **All files access** for the app in the Quest settings. The author''s installer grants it with `adb shell appops set org.lbalab.lba2cc MANAGE_EXTERNAL_STORAGE allow`.

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
> If an older build used a different signing key, the author''s installer has a clean option (`--clean`). App-local saves can be lost, but the game data in `/sdcard/lba2cc/` is kept.',
  'Early release (v0.0.3, 5 Nov 2026) from a one-person fork that is updated almost daily. If the game cannot find its data, check that the folder with lba2.hqr is under /sdcard/lba2cc/ and that All files access is allowed. Keep backups of your saves before updating.'
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
