-- Add four ports (2 Nov 2026): Visual Pinball X VR, Starship-VR (Star Fox 64),
-- OpenMoHAA VR (Medal of Honor: Allied Assault), ARMSX2-3D (PS2 emulator).
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
  'vpinball-vr',
  'Visual Pinball X VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/VPinball-VR',
  'Visual Pinball X running standalone on Meta Quest 3: real pinball tables in VR or in your room with passthrough. Tables, ROMs and backglasses download inside the app.',
  'emulator',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/vpinball-vr.jpg',
  'ZQAfHbLqfq4',
  array['Quest 3', 'Quest 3S'],
  array['Roomscale', 'Seated', 'Mixed Reality (passthrough)'],
  true,
  'N/A (tables download in the app; your own tables go in VPinball/tables/)',
  'https://github.com/vpinball/vpinball',
  'Free (open-source simulator; tables come from the Visual Pinball community)',
  'https://github.com/SgtBilko76/VPinball-VR/releases/download/v0.40-beta/VPinball-VR-Beta-0.40.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/VPinball-VR',
  'v0.40-beta',
  '2026-10-27T15:43:35Z',
  false,
  '### Overview
**Visual Pinball X VR** builds the open-source pinball simulator Visual Pinball X (10.8.1) as a standalone VR app for Meta Quest 3. Stand in front of real and original tables with the cabinet and backglass around you, or put the machine in your own room with passthrough. Built by SgtBilko76 (Port Royale).

> [!NOTE]
> **Nothing to copy to get started.** The built-in **Table Downloader** fetches tables from the Visual Pinball Collection on archive.org, with their ROM, backglass and NVRAM. Some tables are several hundred MB, so use fast Wi-Fi.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Wi-Fi for the Table Downloader, or your own `.vpx` tables.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `VPinball-VR-Beta-0.40.apk` from GitHub Releases.
2. Launch **VPinball** from **Unknown Sources**. The table library opens on a curved screen.
3. Get tables with **+ → Download from Archive.org**.
4. To use your own tables, put each in its own folder with its ROMs next to it (`VPinball/tables/<Table name>/<table>.vpx` and `VPinball/tables/<Table name>/pinmame/roms/<rom>.zip`) and select the `VPinball/tables` folder in the settings.

---

### Controls
* Point with a controller and pull the **trigger** to pick a table.
* **Left stick click** in the main menu switches between mixed reality and a black VR space.
* The first in-game menu entries switch **Mixed Reality** and the **VR Room**.

> [!TIP]
> Williams, Bally and Data East tables show "Factory settings restored" on their very first start: quit once through the menu and start again. Updates install over the old version and keep settings and tables.',
  'If a VR table shows no cabinet or backglass, its script has VRRoom = 0: put a copy of the script next to the table as <table name>.vbs with VRRoom set to a room ("Ultra Minimal" is the lightest). Williams / Bally / Data East tables need one restart after "Factory settings restored".'
),
(
  'starship-vr',
  'Starship-VR (Star Fox 64)',
  'SgtBilko76',
  'https://github.com/SgtBilko76/Starship-VR',
  'Star Fox 64 in true stereoscopic 3D with head tracking, standalone on Meta Quest, from HarbourMasters'' Starship PC port. Bring your own ROM.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/starship-vr.jpg',
  'CrGiHBE3YZE',
  array['Quest 3', 'Quest 3S'],
  array['Seated Cockpit', 'Head Tracking', 'Stick Steering'],
  false,
  '/sdcard/Android/data/com.starship.vr/files/',
  'https://en.wikipedia.org/wiki/Star_Fox_64',
  'Requires your own copy (Star Fox 64 US 1.0 or 1.1 ROM, converted to sf64.o2r on a PC)',
  'https://github.com/SgtBilko76/Starship-VR/releases/download/v1.0-beta1/Starship-VR-1.0-beta1.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/Starship-VR',
  'v1.0-beta1',
  '2026-09-23T17:38:54Z',
  false,
  '### Overview
**Starship-VR** brings HarbourMasters'' Starship (the native Star Fox 64 PC port) to Meta Quest in true stereoscopic 3D. The scene is rendered once per eye with head tracking, not on a flat screen. The HUD, text and radio messages hang on a virtual screen in front of you, and the motion controllers map to the N64 pad with rumble.

> [!NOTE]
> **No game content included.** You need your own Star Fox 64 ROM (US 1.0 or 1.1) and must turn it into `sf64.o2r` with Starship on a PC.

---

### Prerequisites
* Meta Quest 3 or Quest 3S in developer mode.
* A PC to generate `sf64.o2r` from your ROM with [Starship](https://github.com/HarbourMasters/Starship).

---

### Step-by-Step Installation
1. Generate `sf64.o2r` from your ROM with Starship on a PC.
2. Install the APK via 1-click on QuestPorts or install `Starship-VR-1.0-beta1.apk` with SideQuest / `adb install -r`.
3. Launch **Starship-VR** once so Android creates its folder. Do not create `Android/data/com.starship.vr/files` yourself.
4. Copy `sf64.o2r` to `/sdcard/Android/data/com.starship.vr/files/sf64.o2r` (`adb push sf64.o2r /sdcard/Android/data/com.starship.vr/files/sf64.o2r`).
5. Launch it again from **Library → Unknown Sources**.

---

### Controls
* **Right trigger / A** is A. **Left trigger / B** is B. **Grips** are Z / R.
* **X / Y** are C-Left / C-Down. **Right stick** is C-Up / C-Right. **Left stick** is the control stick.
* **Menu** is Start. **Left stick click** opens the Starship menu (point with the right controller).

> [!TIP]
> Tested on Quest 3. World scale, HUD placement and refresh rate (72 Hz up to 120 Hz) are in the VR menu, and the horizon stays level while the Arwing banks unless you switch it off.',
  'If the game does not start, check that sf64.o2r sits directly in /sdcard/Android/data/com.starship.vr/files/ and was made from a US 1.0 or 1.1 ROM. Launch the app once before copying so Android creates the folder.'
),
(
  'openmohaa-vr',
  'OpenMoHAA VR (Medal of Honor: Allied Assault)',
  'bearstonem',
  'https://github.com/bearstonem/openmohaa-vr',
  'Medal of Honor: Allied Assault as a native OpenXR port on Meta Quest 3, built on the OpenMoHAA engine. Body holsters, grenade throws and ladder climbing. Bring your own game files.',
  'source_port',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/openmohaa-vr.jpg',
  '-KIk1krj9fU',
  array['Quest 3'],
  array['Smooth Locomotion', 'Snap Turn', 'Roomscale'],
  true,
  '/sdcard/Android/data/org.openmoh.openmohaa/files/main/',
  'https://www.gog.com/en/game/medal_of_honor_allied_assault_war_chest',
  'Requires your own copy (Medal of Honor: Allied Assault PC, .pk3 files from main/)',
  'https://github.com/bearstonem/openmohaa-vr/releases/download/vr-quest3-0.2.0/openmohaa-vr-quest3-0.2.0.apk',
  'GitHub Releases',
  'https://github.com/bearstonem/openmohaa-vr',
  'vr-quest3-0.2.0',
  '2026-10-14T21:52:47Z',
  false,
  '### Overview
**OpenMoHAA VR** is a standalone VR port of Medal of Honor: Allied Assault for Meta Quest, built on the OpenMoHAA 0.83.0 engine and OpenXR. 0.2.0 adds body holsters, grip-driven ladder climbing, controller-velocity grenade throws and an on-demand HUD on the off-hand X button.

> [!NOTE]
> **No game files included.** The APK holds the engine only. You need your own Medal of Honor: Allied Assault PC game: copy every `.pk3` from its `main/` folder.

---

### Prerequisites
* Meta Quest 3 (other Quest models are unverified).
* Your own Medal of Honor: Allied Assault PC install.
* A PC with `adb` for the configuration file.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `openmohaa-vr-quest3-0.2.0.apk` with `adb install -r`.
2. Copy all `.pk3` archives from the game''s `main/` directory to `/sdcard/Android/data/org.openmoh.openmohaa/files/main/`.
3. Download `autoexec.cfg` from the same GitHub release and push it next to them: `adb push autoexec.cfg /sdcard/Android/data/org.openmoh.openmohaa/files/main/autoexec.cfg`, then `adb shell am force-stop org.openmoh.openmohaa`.
4. Launch **OpenMoHAA** from **Unknown Sources** inside the headset. Do not start it with `adb shell am start`.

> [!TIP]
> Prerelease: the 0.2.0 build was not measured on a headset before release. Let the app create its own `main/save` and `main/configs` folders. When you upgrade, install the new `autoexec.cfg` too.',
  'Dark scenery comes from world dynamic lighting: the release''s autoexec.cfg sets r_worldDlights 0 as a workaround, so push it after every upgrade. Black boxes in some fonts are a known open issue. The .pk3 files must be directly in files/main/.'
),
(
  'armsx2-3d',
  'ARMSX2-3D (PS2 Emulator)',
  'SgtBilko76',
  'https://github.com/SgtBilko76/ARMSX2-3D',
  'ARMSX2, the ARM64 fork of PCSX2, on Meta Quest: PS2 games on a curved virtual screen in stereoscopic 3D, rebuilt from each game''s depth buffer. A 3D screen, not immersive VR.',
  'emulator',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/armsx2-3d.jpg',
  '7PQwEcLB51Q',
  array['Quest 3'],
  array['Seated', 'Virtual Screen (stereo 3D)'],
  false,
  '/sdcard/Download/',
  'https://github.com/ARMSX2/ARMSX2',
  'Requires your own PS2 BIOS dump and PS2 game discs (ISO / CHD)',
  'https://github.com/SgtBilko76/ARMSX2-3D/releases/download/v0.3-beta/ARMSX2-3D-0.3-beta.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/ARMSX2-3D',
  'v0.3-beta',
  '2026-09-23T11:45:33Z',
  false,
  '### Overview
**ARMSX2-3D** is ARMSX2 (the ARM64 fork of PCSX2) for Meta Quest, built on ARMSX2 2.7. The library and settings stay a normal 2D panel. Starting a game moves it into an OpenXR session with the game on a curved virtual screen (2.4 m wide at 1.5 m, 1920×1080 per eye) in stereoscopic 3D: each frame is reprojected per eye from the game''s depth buffer.

> [!NOTE]
> **This is a 3D screen, not immersive VR.** The game camera does not follow your head. Games that never offer a usable depth buffer are shown flat.

> [!NOTE]
> **No BIOS or games included.** You need a BIOS dump from your own PS2 console and your own PS2 games.

---

### Prerequisites
* Meta Quest 3.
* A PS2 BIOS dump from your own console.
* Your own PS2 games (for example `.iso` or `.chd`).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `ARMSX2-3D-0.3-beta.apk` from GitHub Releases. If the install fails with a signature mismatch, uninstall any other ARMSX2 build first.
2. Put your BIOS and games on the headset, for example in `/sdcard/Download/`.
3. Launch **ARMSX2** from **Unknown Sources**, grant storage access, choose the BIOS and point the app at your games folder.
4. Start a game: it opens on the curved 3D screen.

---

### Controls
* **A / B / X / Y** are Cross / Circle / Square / Triangle. **Grips / triggers** are L1 R1 / L2 R2.
* **Left stick click** is Start, **right stick click** is Select. **Left / right stick** are the analog sticks (a hard push on the left stick is the D-pad).
* **Menu** opens the ARMSX2 menu (leaves VR). **Menu + right trigger** recentres the screen.

> [!TIP]
> The VR settings page sets 3D on or off, depth, screen size, distance and curvature. Quest-tuned defaults use 3× internal resolution; heavy games may not run at full speed.',
  'If a game looks flat, it does not expose a usable depth buffer. Depth reprojection shows small artifacts at object edges. If the install fails with a signature mismatch, uninstall the other ARMSX2 build first.'
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
