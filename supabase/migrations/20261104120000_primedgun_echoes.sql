-- Add PrimedGun Echoes (Metroid Prime 2 VR, iChris4). Package id read from the release APK (org.primedgun.echoes).
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.
-- Upload the cover and preview to questports-media before the site deploy that references them.

begin;

insert into public.ports (
  slug, title, developer, developer_url, short_description, category, status, cover_image_url,
  youtube_video_id, supported_hardware, locomotion_types, has_6dof_controls, internal_storage_path,
  base_game_url, base_game_store, port_download_url, port_download_source, github_url, latest_version,
  last_github_update, featured, installation_guide, troubleshooting_notes
) values
(
  'metroid-prime-2-vr',
  'PrimedGun Echoes (Metroid Prime 2 VR)',
  'iChris4',
  'https://github.com/iChris4',
  'Metroid Prime 2: Echoes in native VR on Quest, no emulator. Built from the PrimeDecomp decompilation with 6DOF arm cannon aiming, room-scale movement, beam and visor gestures, a 3D map and an in-headset settings panel. Alpha. Bring your own disc image.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/metroid-prime-2-vr.jpg',
  'F710WBfa0sY',
  array['Quest 3'],
  array['Smooth Locomotion', 'Snap Turn', 'Roomscale'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Metroid_Prime_2:_Echoes',
  'Requires your own copy (GameCube disc image, Metroid Prime 2: Echoes USA)',
  'https://github.com/iChris4/MetroidPrime2PortVR/releases/download/v1.0.0-alpha.4/PrimedGunEchoes-v1.0.0-alpha.4-Quest.apk',
  'GitHub Releases',
  'https://github.com/iChris4/MetroidPrime2PortVR',
  'v1.0.0-alpha.4',
  '2026-11-02T03:22:52Z',
  false,
  '### Overview
**PrimedGun Echoes** is *Metroid Prime 2: Echoes* in native VR on standalone Meta Quest. It is not an emulator: it carries the VR layer of [PrimedGun v2](https://github.com/iChris4/MetroidPrimePortVR) onto [Echoes Unbound](https://github.com/Odrannnn/MetroidPrime2Port), Odrannnn''s native port built from the PrimeDecomp decompilation. It keeps the controls of the original [PrimedGun](/ports/primedgun).

**Install type: APK + your own disc image.**

Highlights (v1.0.0-alpha.4):
* 6DOF arm cannon tracking for aiming, grapple and lock-on, with left-handed play.
* Room-scale movement, snap or smooth turning, one-click height calibration and an adjustable cannon position.
* Beam wheel and visor gestures, a 3D map and the pause screens in the headset.
* In-headset settings for controls, calibration and graphics, plus **Setup > Check for updates** inside the app.

> [!WARNING]
> **Alpha.** Expect rough edges and keep normal in-game saves. The Seeker Missile multi-lock, the Screw Attack camera and the turrets still use the original pad behaviour, and local multiplayer does not work in VR. Tested on Quest 3 only.

> [!NOTE]
> **No game data is included.** You need your own, legally owned disc image of Metroid Prime 2: Echoes. USA (`G2ME01`) is the tested release; PAL (`G2MP01`) and Metroid Prime Trilogy are experimental. Fan project, not affiliated with Nintendo.

---

### Prerequisites
1. **Meta Quest 3** with Developer Mode enabled. The APK is about 31 MB.
2. Your Echoes disc image: `.iso`, `.nkit.iso`, `.gcm`, `.rvz`, `.wia`, `.ciso` or `.wbfs`.

---

### Step-by-Step Installation

#### 1. Install the APK
Download **`PrimedGunEchoes-v1.0.0-alpha.4-Quest.apk`** via 1-click on QuestPorts or from [GitHub Releases](https://github.com/iChris4/MetroidPrime2PortVR/releases/tag/v1.0.0-alpha.4). Install it with SideQuest or:

```bash
adb install -r PrimedGunEchoes-v1.0.0-alpha.4-Quest.apk
```

The checksum is in `SHA256SUMS.txt` on the release page.

#### 2. Put the disc image on the headset
Copy the image to any folder you can reach, for example `Download`:

```bash
adb push "Metroid Prime 2 - Echoes (USA).iso" /sdcard/Download/
```

#### 3. First launch
1. Open **Library**, set the filter to **Unknown sources** and start **PrimedGun Echoes**.
2. Tap **Select Game** and choose your disc image.
3. Tap **Play** to enter VR.
4. In the game, click the right stick to set your height. Click the left stick to open or close the VR menu.
5. Use **Calibration** to place the arm cannon, and the **Layout** tab to see the controller bindings.

> [!TIP]
> Install new versions over the old one and never uninstall, or you lose your saves. From alpha.4 the launcher has **Setup > Check for updates**, which downloads the APK, checks it and opens the Quest installer. **Import PrimedGun Settings** brings over your VR settings from PrimedGun v2 or the Dolphin PrimedGun. Game data is kept in `/sdcard/Android/data/org.primedgun.echoes/files`.',
  'Alpha release: back up your saves, and make a normal in-game save before updating because alpha.3 save states are incompatible. Never uninstall to update; install the new APK over the old one. Select Game refuses the disc: USA (G2ME01) is the tested release, PAL and Trilogy are experimental, and a corrupt or partial image will not load. Seeker Missile multi-lock, the Screw Attack camera and the turrets keep the pad behaviour for now, and local multiplayer is not supported in VR. Tested on Quest 3 only.'
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
