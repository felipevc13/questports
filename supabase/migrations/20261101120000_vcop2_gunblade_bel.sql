-- Add three Sega Model 2 arcade light-gun ports from vr4all-standalone:
-- Virtua Cop 2 VR, Gunblade NY VR, Behind Enemy Lines VR. All three are early releases
-- (in_development) and need the player's own arcade set.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.
-- Upload the covers to questports-media before the site deploy that references them.

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
  'virtua-cop-2-vr',
  'Virtua Cop 2 VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/vcop2-vr',
  'Sega''s 1995 Model 2A arcade light-gun game Virtua Cop 2 in stereo VR, standalone on Meta Quest. Tracked guns, dual wielding, and Game zoom.',
  'emulator',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/virtua-cop-2-vr.png',
  null,
  array['Quest 3', 'Quest 3S'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Virtua_Cop_2',
  'Requires your own copy (Sega Model 2A arcade set vcop2)',
  'https://github.com/vr4all-standalone/vcop2-vr/releases/download/v0.2.14/vcop2-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/vcop2-vr',
  'v0.2.14',
  '2026-10-31T03:15:58Z',
  false,
  '### Overview
**Virtua Cop 2 VR** is an experimental port of Sega''s Model 2A arcade game for Meta Quest 3 and 3S. A patched MAME engine runs the original game while the VR host adds stereo views, head tracking and tracked guns. The scenery, actors, audio and rules come from your own game data.

> [!NOTE]
> **No game files included.** You need `vcop2.zip` and the billboard firmware `segabill.zip`, or a single `vcop2.zip` that holds all 31 required payloads. No CHD is required.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own `vcop2.zip` and `segabill.zip`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `vcop2-vr-quest.apk` from GitHub Releases.
2. Put `vcop2.zip` and `segabill.zip` into `/sdcard/Download/`. Keep them packed.
3. Launch **Virtua Cop 2 VR** from **Unknown Sources** and allow game-file access when asked.
4. The app checks the files and enters VR automatically when they pass.

---

### Controls
* **A** starts or continues Player 1. **X** joins Player 2.
* **Triggers** fire. **B / Y** reloads.
* **Menu** opens the settings panel (gun, laser, haptics, world size, Game zoom).
* Tap either **grip** to toggle Game zoom.

> [!TIP]
> This is an early release. Settings and NVRAM are kept when you update.',
  'Setup checks the size, CRC32 and SHA1 of every payload. Use a complete vcop2.zip, with segabill.zip beside it unless it is already inside, and keep both zipped. If the app cannot find them, check that they sit directly in /sdcard/Download/ and that file access was allowed.'
),
(
  'gunblade-ny-vr',
  'Gunblade NY VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/gunblade-ny-vr',
  'Sega''s Model 2B helicopter light-gun game Gunblade NY in stereo VR, standalone on Meta Quest. Tracked guns, automatic-fire trigger, and two-player inputs.',
  'emulator',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/gunblade-ny-vr.png',
  null,
  array['Quest 3', 'Quest 3S'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Gunblade_NY',
  'Requires your own copy (Sega Model 2B arcade set, Revision A)',
  'https://github.com/vr4all-standalone/gunblade-ny-vr/releases/download/v0.1.0-beta/gunblade-ny-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/gunblade-ny-vr',
  'v0.1.0-beta',
  '2026-10-31T03:16:24Z',
  false,
  '### Overview
**Gunblade NY VR** brings Sega''s helicopter light-gun game to Meta Quest 3 and 3S in stereo VR with head tracking and tracked guns. It is a public beta. The original game''s scenery, audio and rules come from your own game data.

> [!NOTE]
> **No game files included.** You need the Revision A set: `gunblade.zip` with all 18 required payloads. A split set may also need `segabill.zip` in the same folder. No CHD is required.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own Gunblade NY Revision A `gunblade.zip`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `gunblade-ny-vr-quest.apk` from GitHub Releases.
2. Put `gunblade.zip` (and `segabill.zip` if your set is split) into `/sdcard/Download/`. Keep them packed.
3. Open **Gunblade NY - VR4ALL** from **Unknown Sources** and finish the ROM check on the setup screen.
4. Play. The original automatic-fire trigger and two-player cabinet inputs are supported.

> [!TIP]
> Quest 3S play has been observed. Quest 3 is still being checked, some heavy scenes run below full arcade speed, and audio can sound rough.',
  'The app checks the size, CRC32 and SHA1 of the files. Use the complete Revision A gunblade.zip and keep it zipped. If the setup screen cannot find it, check that it sits directly in /sdcard/Download/.'
),
(
  'behind-enemy-lines-vr',
  'Behind Enemy Lines VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/behind-enemy-lines-vr',
  'Sega''s Model 2C combat light-gun game Behind Enemy Lines in stereo VR, standalone on Meta Quest. Tracked guns with adjustable reticle and HUD.',
  'emulator',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/behind-enemy-lines-vr.jpg',
  null,
  array['Quest 3', 'Quest 3S'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Behind_Enemy_Lines_(video_game)',
  'Requires your own copy (Sega Model 2C arcade set bel)',
  'https://github.com/vr4all-standalone/behind-enemy-lines-vr/releases/download/v0.1.1-beta/behind-enemy-lines-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/behind-enemy-lines-vr',
  'v0.1.1-beta',
  '2026-10-31T03:17:02Z',
  false,
  '### Overview
**Behind Enemy Lines VR** adapts Sega''s Model 2C combat gun game for Meta Quest 3 and 3S in stereo VR with head tracking and tracked guns. It is a public beta. The mission, scenery, audio and cabinet rules come from your own game data.

> [!NOTE]
> **No game files included.** You need `bel.zip` with all 31 verified original payloads. No separate billboard firmware or CHD is required.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own `bel.zip`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `behind-enemy-lines-vr-quest.apk` from GitHub Releases.
2. Put `bel.zip` into `/sdcard/Download/`. Keep it packed.
3. Open **Behind Enemy Lines - VR4ALL** from **Unknown Sources** and finish the ROM check on the setup screen.
4. Play. Player hands, view, HUD and reticle size are in the settings.

> [!TIP]
> Quest 3S play has been observed on an earlier build. The latest defaults and the full game routes are still being checked.',
  'The app checks the size and checksum of every payload, so use the complete bel.zip and keep it zipped. If the setup screen cannot find it, check that it sits directly in /sdcard/Download/.'
)
on conflict (slug) do update set
  title = excluded.title,
  developer = excluded.developer,
  developer_url = excluded.developer_url,
  short_description = excluded.short_description,
  category = excluded.category,
  status = excluded.status,
  cover_image_url = excluded.cover_image_url,
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
