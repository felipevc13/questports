-- Add six standalone VR arcade injection ports (vr4all-standalone).
-- All six are Sega/Namco/Capcom NAOMI arcade light gun and survival games in stereo 6DoF VR.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.

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
  troubleshooting_notes,
  features
) values
(
  'confidential-mission-vr',
  'Confidential Mission VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/confidential-mission-vr',
  'Sega''s 2000 arcade light-gun spy thriller Confidential Mission (Sega NAOMI) in 6DoF stereo VR, standalone on Meta Quest. Dual-wield tracked controllers, 1:1 aiming, arcade reload, and co-op action.',
  'emulator',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/confidential-mission-vr.png',
  'be8uaCACx1Q',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Confidential_Mission',
  'Requires your own copy (Sega NAOMI arcade set)',
  'https://github.com/vr4all-standalone/confidential-mission-vr/releases/download/v1.2.6/confidential-mission-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/confidential-mission-vr',
  'v1.2.6',
  '2026-10-27T01:50:16Z',
  true,
  '### Overview
**Confidential Mission VR** brings Sega''s 2000 arcade light-gun spy thriller (Sega NAOMI) to standalone Meta Quest in stereoscopic 6DoF VR. A VR fork of Flycast rebuilds the original 3D scenes in stereo around you while your Touch controllers act as 1:1 tracked light guns with arcade haptic recoil. Supports dual wielding and two players on one headset.

> [!NOTE]
> **No game files included.** You need your legally owned copy of the Sega NAOMI arcade set: `confmiss.zip`, `confmiss/gds-0001.chd`, and `naomi.zip`.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Sideloading enabled (Developer Mode or QuestPorts App).
* MAME NAOMI ROM set: `confmiss.zip`, `confmiss/gds-0001.chd`, and `naomi.zip`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `confidential-mission-vr-quest.apk` from GitHub Releases.
2. Put `confmiss.zip`, `confmiss/gds-0001.chd`, and `naomi.zip` into your headset''s `/sdcard/Download/` folder.
3. Launch **Confidential Mission VR** from **Unknown Sources**.
4. Grant All Files Access when prompted. The game verifies your ROM files and launches.',
  'Missing game files: confmiss.zip and naomi.zip must sit directly in /sdcard/Download/, and gds-0001.chd in /sdcard/Download/confmiss/. Ensure All Files Access is granted in headset permissions.',
  '{"stereo": "3D scenes rebuilt per eye in stereoscopic VR", "haptics": "active", "refresh": "72Hz", "motion_controls": "Tracked controllers as light guns with 1:1 aiming"}'::jsonb
),
(
  'lupin-the-third-vr',
  'Lupin the Third: The Shooting VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/lupin-the-third-vr',
  'Sega''s 2001 NAOMI arcade light-gun shooter Lupin the Third: The Shooting in stereo 6DoF VR, standalone on Meta Quest. Tracked controller aiming, stereo reconstructed scenes, and Walther P38 pistol model.',
  'emulator',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/lupin-the-third-vr.png',
  'IBmXZJmbUVA',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Lupin_the_3rd:_The_Shooting',
  'Requires your own copy (Sega NAOMI arcade set)',
  'https://github.com/vr4all-standalone/lupin-the-third-vr/releases/download/v1.0.5/lupin-the-third-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/lupin-the-third-vr',
  'v1.0.5',
  '2026-10-27T00:00:00Z',
  true,
  '### Overview
**Lupin the Third: The Shooting VR** brings Sega''s 2001 NAOMI arcade light-gun action game to standalone Meta Quest in stereo 6DoF VR. Aim with Lupin''s signature Walther P38 pistol model or Jigen''s revolver, dual wield, and experience classic anime arcade action rebuilt in VR.

> [!NOTE]
> **No game files included.** Requires the original GDS-0018 NAOMI set: `lupinshoo.zip`, `lupinshoo/gds-0018.chd`, and `naomi.zip`.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Developer Mode enabled.
* Original GDS-0018 set: `lupinshoo.zip`, `lupinshoo/gds-0018.chd`, and `naomi.zip`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `lupin-the-third-vr-quest.apk` from GitHub Releases.
2. Put `lupinshoo.zip`, `lupinshoo/gds-0018.chd`, and `naomi.zip` into `/sdcard/Download/`.
3. Launch **Lupin the Third VR** from **Unknown Sources**.
4. Allow file access when prompted, then select **Play**.',
  'Rev A (lupinsho / gds-0018a) is unsupported; use the original GDS-0018 set lupinshoo.zip. Verify naomi.zip is also present in /sdcard/Download/.',
  '{"stereo": "Stereoscopic 3D reconstructed scenes", "haptics": "active", "refresh": "72Hz", "motion_controls": "Tracked controllers as light guns with extracted Walther P38 model"}'::jsonb
),
(
  'ninja-assault-vr',
  'Ninja Assault VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/ninja-assault-vr',
  'Namco''s 2000 arcade ninja light-gun shooter Ninja Assault (NAOMI) in 6DoF stereo VR, standalone on Meta Quest. Dual ninja guns, 1:1 motion aiming, arcade recoil, and feudal Japanese action.',
  'emulator',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/ninja-assault-vr.png',
  'Go4myYryHog',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Ninja_Assault',
  'Requires your own copy (Namco NAOMI arcade set)',
  'https://github.com/vr4all-standalone/ninja-assault-vr/releases/download/v1.0.5/ninja-assault-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/ninja-assault-vr',
  'v1.0.5',
  '2026-10-27T00:00:00Z',
  true,
  '### Overview
**Ninja Assault VR** brings Namco''s 2000 feudal Japanese arcade light-gun shooter to Meta Quest in 6DoF stereo VR. Features 1:1 tracked controllers as ninja guns, arcade recoil, and attract mode generation of your Mach Gun.

> [!NOTE]
> **No game files included.** Requires the NAOMI World NJA2 Ver.A cartridge set: `ninjaslt.zip` and `naomi.zip`. No CHD is required.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Developer Mode enabled.
* NAOMI cartridge set: `ninjaslt.zip` and `naomi.zip`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `ninja-assault-vr-quest.apk` from GitHub Releases.
2. Put `ninjaslt.zip` and `naomi.zip` into `/sdcard/Download/`.
3. Launch **Ninja Assault VR** from **Unknown Sources**.
4. Grant storage access and wait for first-time gun generation.',
  'Regional sets (ninjaslta, ninjasltj, ninjasltu) are unsupported; use the complete World NJA2 Ver.A set ninjaslt.zip with all 12 ROM entries.',
  '{"stereo": "Stereoscopic 3D reconstructed scenes", "haptics": "active", "refresh": "72Hz", "motion_controls": "Dual ninja guns with 1:1 aiming and arcade recoil"}'::jsonb
),
(
  'death-crimson-ox-vr',
  'Death Crimson OX VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/death-crimson-ox-vr',
  'Ecole Software''s 2000 arcade cult-classic light-gun shooter Death Crimson OX (NAOMI) in 6DoF VR on Meta Quest. Native Crimson gun extraction, tracked controller aim, and dual-wielding.',
  'emulator',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/death-crimson-ox-vr.png',
  '4LIxgS_KOZI',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Death_Crimson_OX',
  'Requires your own copy (Sega NAOMI arcade set)',
  'https://github.com/vr4all-standalone/death-crimson-ox-vr/releases/download/v1.0.4/death-crimson-ox-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/death-crimson-ox-vr',
  'v1.0.4',
  '2026-10-27T00:00:00Z',
  true,
  '### Overview
**Death Crimson OX VR** brings Ecole Software''s 2000 cult-classic NAOMI arcade rail shooter to Meta Quest in stereoscopic 6DoF VR. Includes local native pistol model generation, 1:1 aim tracking, recoil, and two-player arcade action.

> [!NOTE]
> **No game files included.** Requires the NAOMI Japan Rev A set: `deathcoxj.zip` and `naomi.zip`. No CHD is required.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Developer Mode enabled.
* NAOMI cartridge set: `deathcoxj.zip` and `naomi.zip`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `death-crimson-ox-vr-quest.apk` from GitHub Releases.
2. Put `deathcoxj.zip` and `naomi.zip` into `/sdcard/Download/`.
3. Launch **Death Crimson OX VR** from **Unknown Sources**.
4. Grant storage access and select **Play**.',
  'Must be Japan Rev A (deathcoxj.zip) containing epr-23524a.ic22 and chips ic1 through ic10. USA set deathcox is currently unsupported.',
  '{"stereo": "Stereoscopic 3D reconstructed scenes", "haptics": "active", "refresh": "72Hz", "motion_controls": "Tracked controllers as Crimson guns with 1:1 aiming"}'::jsonb
),
(
  'survivor2-code-veronica-vr',
  'Resident Evil Survivor 2: Code Veronica VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/survivor2-code-veronica-vr',
  'Capcom & Namco''s 2001 NAOMI survival horror arcade game in 6DoF VR on Meta Quest. Features free analog thumbstick locomotion, snap turns, 1:1 motion aiming, and Nemesis.',
  'emulator',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/survivor2-code-veronica-vr.png',
  'HucHP0u5UQk',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['Smooth Locomotion (analog stick)', 'Snap Turn', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Resident_Evil_Survivor_2_%E2%80%93_Code:_Veronica',
  'Requires your own copy (Capcom / Namco NAOMI arcade set)',
  'https://github.com/vr4all-standalone/survivor2-code-veronica-vr/releases/download/v1.0.4/survivor2-code-veronica-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/survivor2-code-veronica-vr',
  'v1.0.5',
  '2026-10-27T00:00:00Z',
  true,
  '### Overview
**Resident Evil Survivor 2: Code Veronica VR** adapts Capcom & Namco''s 2001 NAOMI survival horror arcade game for Meta Quest. Unlike traditional on-rails light-gun games, this port features **full analog thumbstick locomotion and 30° snap turns** alongside 1:1 motion aiming and dynamic weapon extraction (BR-93R, Python, Gold Luger, Ingram, SPAS-12, AK47S, M79, LN-02).

> [!NOTE]
> **No game files included.** Requires the NAOMI World cartridge set: `gunsur2.zip` and `naomi.zip`.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Developer Mode enabled.
* NAOMI cartridge set: `gunsur2.zip` and `naomi.zip`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `survivor2-code-veronica-vr-quest.apk` from GitHub Releases.
2. Put `gunsur2.zip` and `naomi.zip` into `/sdcard/Download/`.
3. Launch **Survivor 2 Code: Veronica VR** from **Unknown Sources**.
4. Move with the left thumbstick and snap-turn with the right thumbstick.',
  'Requires the World cartridge gunsur2.zip (15 ROMs). Both controllers must be tracked for analog movement. Weapon models are extracted automatically on first start.',
  '{"stereo": "Stereoscopic 3D head tracking", "haptics": "active", "refresh": "72Hz", "motion_controls": "1:1 tracked aiming with dynamic weapon mesh extraction"}'::jsonb
),
(
  'mok-vr',
  'The Maze of the Kings VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone/mok-vr',
  'Sega''s 2002 ancient Egyptian arcade rail shooter The Maze of the Kings (NAOMI) in 6DoF VR on Meta Quest. Hold the illuminated 3D magical crystal staff with emerald ripples and gold motes.',
  'emulator',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/mok-vr.png',
  'En2PYkAvBCo',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/The_Maze_of_the_Kings',
  'Requires your own copy (Sega NAOMI arcade set)',
  'https://github.com/vr4all-standalone/mok-vr/releases/download/v1.0.5/mok-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/vr4all-standalone/mok-vr',
  'v1.0.5',
  '2026-10-28T00:00:00Z',
  true,
  '### Overview
**The Maze of the Kings VR** puts you inside Sega''s 2002 ancient Egyptian arcade rail shooter on Meta Quest. Hold the illuminated 3D magical crystal staff with emerald ripples and gold motes in your hands, shoot undead mummies in stereo VR, and explore ancient tombs.

> [!NOTE]
> **No game files included.** Requires the NAOMI MAME set `mok.zip`, disc `mok/gds-0022.chd`, and `naomi.zip`.

---

### Prerequisites
* Meta Quest 2, Quest 3, Quest 3S, or Quest Pro.
* Developer Mode enabled.
* NAOMI set: `mok.zip`, `mok/gds-0022.chd`, and `naomi.zip`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `mok-vr-quest.apk` from GitHub Releases.
2. Put `mok.zip`, `mok/gds-0022.chd`, and `naomi.zip` into `/sdcard/Download/`.
3. Launch **The Maze of the Kings VR** from **Unknown Sources**.
4. Grant storage access and aim your magical staff to play!',
  'Requires mok.zip (containing 317-0333-com.pic) and mok/gds-0022.chd. The app extracts and generates the magical staff on first boot.',
  '{"stereo": "Stereoscopic 3D reconstructed scenes", "haptics": "active", "refresh": "72Hz", "motion_controls": "Illuminated 3D magical staff with emerald ripple and gold motes"}'::jsonb
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
  troubleshooting_notes = excluded.troubleshooting_notes,
  features = excluded.features;

commit;
