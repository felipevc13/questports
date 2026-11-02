-- Add five ports: Resident Evil Code: Veronica X VR (neto1495mn-sudo), FreeSpace 2 VR,
-- Wing Commander VR, Wing Commander II VR and Re-Volt VR (RVGL), the last four by SgtBilko76.
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
  're-code-veronica-x-vr',
  'Resident Evil Code: Veronica X VR',
  'neto1495mn-sudo',
  'https://github.com/neto1495mn-sudo/recvx-enhanced-port-pcvr',
  'Capcom''s Resident Evil Code: Veronica X (PS2) running natively on Meta Quest from a recompiled PC port, with tracked hands, real aiming and physical reloads. Bring your own disc image.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/re-code-veronica-x-vr.jpg',
  '_2-NZcCqmSs',
  array['Quest 2', 'Quest 3', 'Quest 3S'],
  array['Smooth Locomotion', 'Smooth Turn', 'Snap Turn'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Resident_Evil_%E2%80%93_Code:_Veronica',
  'Requires your own copy (PS2 disc image, NTSC-U SLUS-20184)',
  'https://github.com/neto1495mn-sudo/recvx-enhanced-port-pcvr/releases/download/v1.4.3/RE-Code-Veronica-X-VR-v1.4.3.apk',
  'GitHub Releases',
  'https://github.com/neto1495mn-sudo/recvx-enhanced-port-pcvr',
  'v1.4.3',
  '2026-10-31T16:54:50Z',
  false,
  '### Overview
**Resident Evil Code: Veronica X VR** runs Capcom''s 2001 survival horror game natively on Meta Quest, with no PC. It is built on aikatore''s recompiled PC port (recvx-enhanced-recomp) and AshfordFamily''s recvx-decomp decompilation, with a VR mode by NETO: tracked hands, aiming with the gun in your hand, a knife on a free hand, and physical reloads from the ammo at your belt.

> [!NOTE]
> **No game files included.** You need your own `.iso` of the PS2 version, NTSC-U, **SLUS-20184**.

---

### Prerequisites
* Meta Quest 2 (tested) or Quest 3 / 3S (declared supported, not yet tested by the author).
* Your own Code: Veronica X PS2 disc image (NTSC-U, SLUS-20184).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `RE-Code-Veronica-X-VR-v1.4.3.apk` from GitHub Releases.
2. Put your `.iso` on the headset, for example in `/sdcard/Download/`.
3. Open the app from **Library → Unknown Sources**. The first time, allow access to all files (it only reads your disc image and optional textures).
4. In the launcher: **Disc** → pick your `.iso`, then **Play**. In **Settings**, use 2× resolution on Quest 2 and 3× on Quest 3.

---

### Controls
* **Left stick** walks (click while walking forward to run). **Right stick** turns.
* **Right grip + right trigger** aim and fire. **Left grip at the gun** holds it with both hands.
* **Reload:** **B** drops the magazine, take a box at your belt with the **left grip**, bring it to the gun.
* **Left grip with a free left hand** is the knife. **A** is action, **Y** the inventory, **X** the map.

> [!TIP]
> An optional HD texture pack (a single `.pack` file) goes in the folder you choose in the launcher''s **Textures** tab. Small stutters can happen when entering rooms with HD textures.',
  'If the app does not start, it now shows a panel with the reason. Send Android/data/org.recvx.vr/files/recvx.log with the report. Battle Game can still error when choosing the character. Only the NTSC-U SLUS-20184 disc is supported.'
),
(
  'freespace2-vr',
  'FreeSpace 2 VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/FreeSpace2-VR',
  'The 1999 space combat classic FreeSpace 2 in head-tracked stereo VR on Meta Quest 3, on the FreeSpace Open engine. HUD lined up with your guns, menus on a big screen. Bring your own GOG or Steam copy.',
  'source_port',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/freespace2-vr.jpg',
  '0SCT-YZp40A',
  array['Quest 3', 'Quest 3S'],
  array['Seated Cockpit', '6DoF Ship Flight (sticks)'],
  false,
  '/sdcard/FS2/',
  'https://store.steampowered.com/app/273620/',
  'GOG or Steam (FreeSpace 2)',
  'https://github.com/SgtBilko76/FreeSpace2-VR/releases/download/v0.1.2-beta/FreeSpace2-VR-v0.1.2-beta.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/FreeSpace2-VR',
  'v0.1.2-beta',
  '2026-10-24T10:50:38Z',
  false,
  '### Overview
**FreeSpace 2 VR** is a standalone VR port of FreeSpace 2 on the FreeSpace Open engine, by SgtBilko76 (Port Royale). Space is rendered in stereo around you, the HUD floats in front of your ship and lines up with your guns, and the menus, briefings and cutscenes play on a big virtual screen.

> [!NOTE]
> **No game files included.** You need your own copy of FreeSpace 2 from GOG or Steam (about 1.8 GB of game files).

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* Your own FreeSpace 2, copied from a PC.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `FreeSpace2-VR-v0.1.2-beta.apk` with `adb install -r -g`.
2. From your GOG or Steam install folder, copy the nine `.vp` files (`root_fs2.vp` … `warble_fs2.vp`) and the folders `data2` and `data3` (cutscenes) to `/sdcard/FS2` on the headset. The app moves the cutscenes into place on the first start.
3. Launch **FreeSpace 2 VR** from **Unknown Sources** and allow **access to all files** when asked.

---

### Controls
* The **right stick** is the throttle lever. The **left grip** opens a second button layer.
* All controls can be remapped in **Options → Controls**. The training missions work with the controllers.

> [!TIP]
> Flight runs below the headset''s refresh rate; menus run at full speed. Shadows are off by default to keep the frame rate up. There is no 3D cockpit: FreeSpace 2 has no cockpit models.',
  'If the game does not find its data, check that the nine .vp files and the data2 and data3 folders are directly in /sdcard/FS2, and that access to all files was allowed.'
),
(
  'wing-commander-vr',
  'Wing Commander VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/wc1-re-vr',
  'Origin''s 1990 space combat classic Wing Commander in stereo VR on Meta Quest, on the wc1-re source reconstruction: a 3D cockpit from the original art and Kilrathi fighters at their real depth. Bring your own GOG copy.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/wing-commander-vr.jpg',
  'S4J_LRKo4LI',
  array['Quest 3', 'Quest 3S'],
  array['Seated Cockpit', '6DoF Ship Flight (sticks)'],
  false,
  '/sdcard/WingCommander/',
  'https://www.gog.com/en/game/wing_commander_1_2',
  'GOG (Wing Commander, DOS)',
  'https://github.com/SgtBilko76/wc1-re-vr/releases/download/quest-vr-1.0.1/WingCommanderVR-1.0.1.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/wc1-re-vr',
  'quest-vr-1.0.1',
  '2026-10-24T10:19:02Z',
  false,
  '### Overview
**Wing Commander VR** is a VR port of Wing Commander (1990) on wc1-re, the source reconstruction of the DOS original, by SgtBilko76 (Port Royale). In flight, space is rendered in stereo around you: Kilrathi fighters, missiles and capital ships sit at their real distance and you can look around freely. You sit in a 3D cockpit built from the original cockpit art, with live gauges, radar and HUD. The Tiger''s Claw, the bar, briefings and cutscenes play on a big virtual screen.

> [!NOTE]
> **No game files included.** You need your own copy of Wing Commander (DOS, GOG), about 8 MB of game files.

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* Your own GOG Wing Commander, copied from a PC.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `WingCommanderVR-1.0.1.apk` with SideQuest / `adb install -r`.
2. From your GOG Wing Commander folder, copy `WC.EXE`, `SM2.EXE` and the `GAMEDAT` folder to `/sdcard/WingCommander` on the headset.
3. Launch **Wing Commander VR** from **Unknown Sources** and allow **access to all files** when asked.

---

### Controls
* Full flight control on the Touch controllers, with a soft centre for precise aiming.
* Laser pointer for the menus; **A / B** answer Yes / No prompts. A VR keyboard types your pilot name and callsign.

> [!TIP]
> Stick response and cockpit distance can be tuned in `/sdcard/WingCommander/vr.cfg` (`cockpit3d=0` brings back the flat cockpit). Ships are the game''s original sprites, so in 3D they are flat pictures at the right depth.',
  'If the game does not start, check that WC.EXE, SM2.EXE and GAMEDAT are directly in /sdcard/WingCommander and that access to all files was allowed. Restart the game after editing vr.cfg.'
),
(
  'wing-commander-2-vr',
  'Wing Commander II VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/wc2-re-vr',
  'Wing Commander II: Vengeance of the Kilrathi (1991) in stereo VR on Meta Quest, on the wc2-re source reconstruction, with a 3D cockpit from the original art. Bring your own copy of the game.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/wing-commander-2-vr.jpg',
  'ZpIMM-tpdTI',
  array['Quest 3', 'Quest 3S'],
  array['Seated Cockpit', '6DoF Ship Flight (sticks)'],
  false,
  '/sdcard/WingCommander2/',
  'https://www.gog.com/en/game/wing_commander_1_2',
  'GOG or the DOS CD-ROM (Wing Commander II with Special Operations 1 and 2)',
  'https://github.com/SgtBilko76/wc2-re-vr/releases/download/quest-vr-1.0.1/WingCommanderIIVR-1.0.1.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/wc2-re-vr',
  'quest-vr-1.0.1',
  '2026-10-24T10:19:10Z',
  false,
  '### Overview
**Wing Commander II VR** is a VR port of Wing Commander II: Vengeance of the Kilrathi on wc2-re, the source reconstruction of the game, by SgtBilko76 (Port Royale). In flight, space is rendered in stereo around you with ships at their real distance, and you sit in a 3D cockpit built from the original cockpit art, with live displays and targeting. Briefings, cutscenes and menus play on a big virtual screen.

> [!NOTE]
> **No game files included.** You need your own copy of Wing Commander II. The DOS CD-ROM edition with Special Operations 1 and 2 is tested; Kilrathi Saga data should also work (about 26 MB).

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* Your own Wing Commander II game files, copied from a PC.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `WingCommanderIIVR-1.0.1.apk` with SideQuest / `adb install -r`.
2. Copy `WC2.EXE` and the `GAMEDAT` folder (the `WING2` folder of the CD, or your installed game folder) to `/sdcard/WingCommander2` on the headset.
3. Launch **Wing Commander II VR** from **Unknown Sources** and allow **access to all files** when asked.

---

### Controls
* Full flight control on the Touch controllers, with a soft centre for precise aiming.
* **To land:** target your carrier (**A**), open comms (**left grip + X**), pick it and request landing, then fly in at normal speed.

> [!TIP]
> Landing clearance is only given once you have done something in the mission and no Kilrathi are close. With the DOS CD-ROM data the game plays AdLib music and synthesized sound effects, as the original did.',
  'If the game does not start, check that WC2.EXE and GAMEDAT are directly in /sdcard/WingCommander2 and that access to all files was allowed.'
),
(
  'rvgl-vr',
  'Re-Volt VR (RVGL)',
  'SgtBilko76',
  'https://github.com/SgtBilko76/RVGL-VR',
  'The 1999 RC-car racer Re-Volt in head-tracked stereo VR on Meta Quest, on RVGL, the community''s modern Re-Volt engine. The free game data downloads in the app on first launch.',
  'engine_recreation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/rvgl-vr.jpg',
  '5Ei_opWv9Yk',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['Seated', 'Chase Camera', 'Head Tracking'],
  false,
  'N/A (the app downloads the free game data to /sdcard/RVGL on first launch)',
  'https://rvgl.org/',
  'Free (game data downloaded from Re-Volt I/O in the app)',
  'https://github.com/SgtBilko76/RVGL-VR/releases/download/v0.1.1/RVGL-VR-v0.1.1.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/RVGL-VR',
  'v0.1.1',
  '2026-10-23T21:22:47Z',
  false,
  '### Overview
**Re-Volt VR** is a standalone VR port of Re-Volt (1999) by SgtBilko76 (Port Royale), built on the official Android build of RVGL, the community''s modern Re-Volt engine. A native OpenXR host puts the menus on a big virtual screen and renders the races in head-tracked stereo 3D at 72 Hz. You get all 19 original tracks plus the RV 25th Anniversary pack''s 13 tracks and 14 cars.

> [!NOTE]
> **Nothing to copy.** The APK holds no game content: on first launch the app downloads the Re-Volt game files and soundtrack from Re-Volt I/O and the RV25 pack from Re-Volt World, and installs them for you (about 225 MB, 500 MB on the headset).

---

### Prerequisites
* Meta Quest 2, Pro, 3 or 3S (tested on Quest 3).
* Wi-Fi for the one-time download.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `RVGL-VR-v0.1.1.apk` from GitHub Releases.
2. Launch **RVGL VR** from **Unknown Sources**. A setup panel opens: press **Allow file access**, switch it on and press **Done**.
3. Press **Download and install**. After a minute or two the game starts by itself.
4. Create your profile: turn the wheel with the left stick and press **A** for each letter, then turn to **END** and press **A**.

---

### Controls
* The Touch controller layout is set up automatically for every new profile and can still be changed in RVGL''s own controller settings.
* Hold **both stick clicks** for 1 s to recenter the view.

> [!TIP]
> Already have RVGL data, for example from the Android version? Copy it to `/sdcard/RVGL` before the first launch and the packs that are present are not downloaded again. Single player only for now.',
  'The first launch needs Wi-Fi to download the game data. If the download stops, launch the app again and press Download and install. Split-screen and online play are untested in VR.'
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
