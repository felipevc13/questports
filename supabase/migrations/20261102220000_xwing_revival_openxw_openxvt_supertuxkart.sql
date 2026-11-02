-- Add four ports (2 Nov 2026): X-Wing Revival VR, OpenXW VR (Star Wars: X-Wing),
-- OpenXvT VR (X-Wing vs. TIE Fighter), SuperTuxKart VR. Package ids were read from the release APKs.
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
  'xwing-revival-vr',
  'X-Wing Revival VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/X-Wing-Revival-VR',
  'Raptor007''s free Star Wars space combat fan game X-Wing Revival, natively in VR on Meta Quest: 25 flyable ships, fleet battles, the trench run and online play with PC pilots. Game data included.',
  'source_port',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/xwing-revival-vr.jpg',
  'hJu7S6qEg24',
  array['Quest 3', 'Quest 3S'],
  array['Seated Cockpit', '6DoF Ship Flight (sticks)'],
  false,
  'N/A (game data bundled in the APK; unpacked to /sdcard/XWingRevival/ on first start)',
  'https://www.raptor007.com/xwing-revival/',
  'Free (X-Wing Revival 0.6.1 by Raptor007, included in the APK)',
  'https://github.com/SgtBilko76/X-Wing-Revival-VR/releases/download/v1.0.3/X-Wing-Revival-VR-v1.0.3-full.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/X-Wing-Revival-VR',
  'v1.0.3',
  '2026-10-19T00:00:00Z',
  false,
  '### Overview
**X-Wing Revival VR** is a native VR port of X-Wing Revival, Raptor007''s free Star Wars space combat game, by SgtBilko76 (Port Royale). You fly from the cockpit in head-tracked stereo 3D at 72 Hz. In the menus, space surrounds you and the menu floats in front of you, with a laser pointer and an on-screen keyboard. There are 25 flyable ships, fleet battles, the Death Star trench run and online multiplayer, where Quest, PICO and PC pilots meet on the official server.

> [!NOTE]
> **Nothing else to copy.** The full APK has the free X-Wing Revival 0.6.1 game data built in. It is a fan game, not the 1993 LucasArts X-Wing.

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* About 600 MB free (the APK plus about 310 MB of unpacked game data).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `X-Wing-Revival-VR-v1.0.3-full.apk` from GitHub Releases.
2. Launch **X-Wing Revival VR** from **Unknown Sources** and allow **access to all files** when asked.
3. The first start unpacks the game data to `/sdcard/XWingRevival/` (about 310 MB). Then the menu appears.
4. Fly offline, or choose **Fly Online** to join the official Raptor007 server.

---

### Controls
* **Left stick** pitches and yaws. **Right stick** rolls (left/right) and sets the throttle (up/down).
* **Right trigger** fires. **Left trigger** targets what is in front of you.
* **Right grip** switches weapons (lasers / ions / torpedoes). **Left grip** sets single or linked fire.
* **A / B** target the nearest enemy / nearest attacker. Hold **both stick clicks** for 1 s to recenter.

> [!TIP]
> Big fleet battles run at about 45-65 fps on Quest 3. Custom missions: copy the mission''s `.def` file to `/sdcard/XWingRevival/Missions/` and pick it in the lobby under Game Type → Mission.',
  'If the menu does not appear on the first start, wait for the game data to finish unpacking to /sdcard/XWingRevival/ and allow access to all files. PC players with X-Wing Revival 0.6.1 join the same server via Custom / LAN → Connect to IP Address www.raptor007.com:7000.'
),
(
  'openxw-vr',
  'OpenXW VR (Star Wars: X-Wing)',
  'SgtBilko76',
  'https://github.com/SgtBilko76/OpenXW-VR',
  'LucasArts'' 1993 Star Wars: X-Wing in VR on Meta Quest, from the open-source OpenXW rebuild: stereo space and 3D cockpits for the X-Wing, Y-Wing, A-Wing and B-Wing. Bring your own Steam copy.',
  'engine_recreation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/openxw-vr.jpg',
  'Ea_e0qiZz7c',
  array['Quest 3', 'Quest 3S'],
  array['Seated Cockpit', '6DoF Ship Flight (sticks)'],
  false,
  '/sdcard/OpenXW/',
  'https://store.steampowered.com/app/354430/',
  'Steam (STAR WARS X-Wing Special Edition)',
  'https://github.com/SgtBilko76/OpenXW-VR/releases/download/v0.1.3-beta/OpenXW-VR-v0.1.3-beta.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/OpenXW-VR',
  'v0.1.3-beta',
  '2026-10-28T00:00:00Z',
  false,
  '### Overview
**OpenXW VR** is a VR port of OpenXW, the open-source rebuild of LucasArts'' Star Wars: X-Wing, by SgtBilko76 (Port Royale). Space is rendered in stereo around you and you sit in a 3D cockpit of your X-Wing, Y-Wing, A-Wing or B-Wing (cockpits from X-Wing Revival, included), with the original instruments and HUD in front of you. The concourse, briefings and cutscenes play on a big virtual screen.

> [!NOTE]
> **No game files included.** You need your own copy of **STAR WARS X-Wing Special Edition** (Steam).

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* Your own Steam copy of X-Wing Special Edition, copied from a PC.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `OpenXW-VR-v0.1.3-beta.apk` with SideQuest / `adb install -r`.
2. From the Steam folder `STAR WARS X-Wing`, copy `collectors_cd` to `/sdcard/OpenXW/XW94` and `remastered` to `/sdcard/OpenXW/XW98` on the headset.
3. Launch **OpenXW VR** from **Unknown Sources** and allow **access to all files** when asked.

---

### Controls
* **Left stick** pitches and yaws (up = nose down). **Right stick** rolls and moves the throttle.
* **Right trigger** fires. **Left trigger** targets.
* Hold the **left grip** for the weapons and power radial menu, the **right grip** for targets and wingman orders.
* **Left Menu button** opens the OpenXW menu and pauses (hold 1 s to recenter).

> [!TIP]
> The small screens built into the X-Wing Revival cockpits are dark; the original instruments stay in front of you instead.',
  'If the game does not find its data, check the two folders: /sdcard/OpenXW/XW94 (from collectors_cd) and /sdcard/OpenXW/XW98 (from remastered), and that access to all files was allowed.'
),
(
  'openxvt-vr',
  'OpenXvT VR (X-Wing vs. TIE Fighter)',
  'SgtBilko76',
  'https://github.com/SgtBilko76/OpenXvT-VR',
  'Star Wars: X-Wing vs. TIE Fighter with the Balance of Power campaigns in VR on Meta Quest, from the open-source OpenXvT rebuild: stereo space and 3D cockpits for rebel and imperial fighters. Bring your own Steam copy.',
  'engine_recreation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/openxvt-vr.jpg',
  'amOYTpdpNYI',
  array['Quest 3', 'Quest 3S'],
  array['Seated Cockpit', '6DoF Ship Flight (sticks)'],
  false,
  '/sdcard/OpenXvT/',
  'https://store.steampowered.com/app/361690/',
  'Steam (STAR WARS X-Wing vs TIE Fighter - Balance of Power Campaigns)',
  'https://github.com/SgtBilko76/OpenXvT-VR/releases/download/v0.1.1-beta/OpenXvT-VR-v0.1.1-beta.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/OpenXvT-VR',
  'v0.1.1-beta',
  '2026-10-28T00:00:00Z',
  false,
  '### Overview
**OpenXvT VR** is a VR port of OpenXvT, the open-source rebuild of Star Wars: X-Wing vs. TIE Fighter with the Balance of Power campaigns, by SgtBilko76 (Port Royale). Space is rendered in stereo around you and you fly from a 3D cockpit (X-Wing Revival cockpits for the X-wing, Y-wing, A-wing, B-wing, TIE Fighter, Interceptor, Bomber and Gunboat, included), with the original instruments in front of you. The concourse, briefings and cutscenes play on a big virtual screen.

> [!NOTE]
> **No game files included.** You need your own copy of **STAR WARS X-Wing vs TIE Fighter - Balance of Power Campaigns** (Steam).

---

### Prerequisites
* Meta Quest 3 (tested). Quest 2, 3S and Pro should work but are untested.
* Your own Steam copy of the game, copied from a PC (about 400 MB).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `OpenXvT-VR-v0.1.1-beta.apk` with SideQuest / `adb install -r`.
2. Copy your whole Steam folder `STAR WARS X-Wing vs TIE Fighter` to `/sdcard/OpenXvT` on the headset.
3. Launch **OpenXvT VR** from **Unknown Sources** and allow **access to all files** when asked.

---

### Controls
* **Left stick** pitches and yaws (up = nose down). **Right stick** rolls and moves the throttle lever.
* **Right trigger** fires. **Left trigger** targets (tap: target in your sights).
* Hold the **left grip** for the weapons and power radial menu, the **right grip** for targets and wingman orders.
* **Left Menu button** opens the OpenXvT menu and pauses.

> [!TIP]
> The Z-95, T-wing, R-41, TIE Advanced, TIE Defender and Missile Boat borrow the closest cockpit. The galaxy map and the hyperspace jump are shown flat. Multiplayer is untested.',
  'If the game does not find its data, check that the whole Steam folder sits at /sdcard/OpenXvT and that access to all files was allowed.'
),
(
  'supertuxkart-vr',
  'SuperTuxKart VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/SuperTuxKart-VR',
  'The free, open-source kart racer SuperTuxKart as a native VR app on Meta Quest: per-eye stereo races with head tracking and menus on a floating screen. The whole game is in the APK.',
  'source_port',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/supertuxkart-vr.jpg',
  'YZDw85U44xo',
  array['Quest 3', 'Quest 3S'],
  array['Seated', 'Chase Camera', 'Head Tracking'],
  false,
  'N/A (game data bundled in the release APK)',
  'https://supertuxkart.net/',
  'Free (open-source game, included in the APK)',
  'https://github.com/SgtBilko76/SuperTuxKart-VR/releases/download/v1.0.1/SuperTuxKart-VR-1.0.1.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/SuperTuxKart-VR',
  'v1.0.1',
  '2026-10-11T00:00:00Z',
  false,
  '### Overview
**SuperTuxKart VR** is a standalone VR port of SuperTuxKart, the free and open-source kart racer, by SgtBilko76 (Port Royale). Races are rendered in real per-eye stereo with head tracking, layered on the normal kart-following camera, and the menus sit on a floating screen.

> [!NOTE]
> **Nothing else to copy.** The game is free and fully inside the APK (about 700 MB).

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* About 1 GB free.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `SuperTuxKart-VR-1.0.1.apk` from GitHub Releases. It is a large download.
2. Launch **SuperTuxKart** from **Library → Unknown Sources**.
3. Race.

---

### Controls
* **Left stick** steers. **Right trigger** accelerates. **Left trigger** brakes.
* The **face buttons** are nitro, fire, drift, rescue, look back and pause.',
  'The APK is about 700 MB, so the download takes a while and needs about 1 GB free. If the install fails, free space and try again.'
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
