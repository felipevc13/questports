-- Add WakerQuest: native OpenXR decompilation port of The Legend of Zelda: The Wind Waker for Quest 3/3S.
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
) values (
  'wakerquest',
  'WakerQuest',
  'Trastorillo',
  'https://github.com/Trastorillo',
  'Native C++ decompilation port of The Legend of Zelda: The Wind Waker on Meta Quest 3/3S. Features stereoscopic 3D giant virtual screen, tabletop diorama mode, and mixed reality passthrough ambience.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/wakerquest.png',
  '_Y2C9td1agc',
  array['Quest 3', 'Quest 3S'],
  array['Seated', 'Roomscale', 'Tabletop / Diorama'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_The_Wind_Waker',
  'Requires your own copy (GameCube disc)',
  'https://github.com/Trastorillo/wakerquest/releases/download/v1.0.7/WakerQuest-1.0.7.apk',
  'GitHub Releases',
  'https://github.com/Trastorillo/wakerquest',
  'v1.0.7',
  '2026-10-26T01:19:49Z',
  true,
  '### Overview
**WakerQuest** is an unofficial native port of *The Legend of Zelda: The Wind Waker* (2002 GameCube) running directly on Meta Quest 3 and 3S via Android and OpenXR. Compiled natively from its C++ decompilation with Aurora (WebGPU), it runs without CPU emulation. Play on a massive stereoscopic 3D theater screen, scale the Great Sea into a tabletop diorama with grip controls, or enjoy MR passthrough ambience where nearby characters walk right in your room.

> [!NOTE]
> **No Nintendo assets included.** You must provide your own legally dumped, uncompressed European GameCube ISO (`GZLP01.iso`, revision 0) or USA ISO (`GZLE01.iso`). The APK only contains engine code and extracts assets dynamically on boot.

---

### Prerequisites
* Meta Quest 3 or Quest 3S (shaders and performance tuned specifically for Quest 3 GPU).
* Clean uncompressed GameCube ISO (`GZLP01.iso` or `GZLE01.iso`). Compressed formats like `.rvz` or `.ciso` are not supported.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `WakerQuest-1.0.7.apk` using SideQuest / ADB.
2. Transfer your uncompressed `GZLP01.iso` (or `GZLE01.iso`) into the Quest''s `/sdcard/Download/` folder.
3. Launch **WakerQuest** from **Unknown Sources**.
4. Select your ISO using the in-game file picker on first launch.
5. Access the *Virtual Reality* panel in-game to switch between Diorama, Giant Screen, and Mixed Reality modes.

> [!TIP]
> When updating to future releases, always install over the existing app (`adb install -r`). Never uninstall the app first, or your save files and memory card data will be erased!',
  'Requires Meta Quest 3 or 3S. Make sure your ISO is an uncompressed .iso file placed in /sdcard/Download/. In tabletop diorama mode, hold both grip triggers simultaneously to scale and rotate the world.',
  '{"stereo": "Stereoscopic 3D rendering", "haptics": "active", "refresh": "72Hz", "motion_controls": "Grip scaling & diorama world manipulation", "play_modes": ["3D diorama", "Giant virtual screen", "MR passthrough"]}'::jsonb
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
