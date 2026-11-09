-- Add Jurassic Park Arcade (Lovecore) static recompilation port for Meta Quest.
-- Package id from tools/quest/AndroidManifest.xml: com.jp2015.vr.
-- Requires building the APK on PC using the project's recomp tools and an arcade dump.
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
  'jurassic-park-arcade-vr',
  'Jurassic Park Arcade',
  'Lovecore',
  'https://github.com/Lovecore',
  'Raw Thrills'' 2015 light-gun arcade shooter statically recompiled to C and running natively on Meta Quest. Aim with your Touch controller at a 4-meter cinema screen in full VR at 72 fps.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/jurassic-park-arcade-vr.jpg',
  'rDp0rKjrSYQ',
  array['Quest 3', 'Quest 3S', 'Quest 2', 'Quest Pro'],
  array['Seated', 'Standing', 'Roomscale'],
  true,
  '/sdcard/Android/data/com.jp2015.vr/files/game/',
  'https://rawthrills.com/jurassic-park-arcade/',
  'Requires Raw Thrills arcade Linux dump',
  'https://github.com/Lovecore/jurassic-park-arcade-quest',
  'GitHub Build Script',
  'https://github.com/Lovecore/jurassic-park-arcade-quest',
  'v1.0',
  '2026-10-21T18:00:00Z',
  false,
  '### Overview
**Jurassic Park Arcade on Meta Quest** is Raw Thrills'' hit 2015 light-gun rail shooter statically recompiled to C and built natively for Meta Quest. There is no emulator: the original x86 Linux binary (and 15 bundled libraries) was translated to C via static binary recompilation (`tools/recomp/lift.py`) and compiled with the Android NDK for ARM64.

The game renders onto a 4-meter-wide virtual cinema screen floating in full VR at a steady 72 fps, using the Touch controllers for precision gun aiming, trigger fire, and start buttons.

**Install type: PC recompilation & build required.**

> [!WARNING]
> **No precompiled APK is distributed.** Because Raw Thrills'' *Jurassic Park Arcade* is commercial arcade software, the author cannot distribute prebuilt APK binaries. You must provide your own copy of the arcade game files and compile the APK on a PC using the project''s build scripts.

---

### Prerequisites
1. **Meta Quest 2, 3, 3S, or Pro** with Developer Mode enabled.
2. PC (Windows with Git Bash, Linux, or macOS) with Android SDK/NDK installed.
3. Original arcade game files from Raw Thrills'' *Jurassic Park Arcade* (2015).

---

### Step-by-Step Build & Installation
1. Clone the repository on your PC:
   ```bash
   git clone https://github.com/Lovecore/jurassic-park-arcade-quest.git
   cd jurassic-park-arcade-quest
   ```
2. Place your arcade game files in the expected directory as described in `tools/quest/README.md`.
3. Run the automated lift and compilation script:
   ```bash
   sh tools/quest/build_apk.sh
   ```
4. Install the generated APK and push runtime data to the Quest over USB:
   ```bash
   sh tools/quest/install.sh
   sh tools/quest/push_data.sh
   ```
5. Launch **Jurassic Park Arcade** from **App Library → Unknown Sources** on your headset.

---

### Controls (Touch Controllers)
| Control | Action |
| --- | --- |
| Right controller aim | Gun cursor (Player 1) |
| Right trigger | Fire (Player 1) |
| A | Player 1 Start |
| X | Player 2 Start |
| Left thumbstick click | Recenter screen position |
| Right thumbstick up / down | Resize screen (larger / smaller) |
| Left trigger | Secondary input (grenade / special) |',
  'Requires building the APK locally on a PC with Android NDK. The game files must be pushed to /sdcard/Android/data/com.jp2015.vr/files/game/ with push_data.sh. The game runs in Free Play mode by default so no coin input is required.'
)
on conflict (slug) do nothing;

commit;

