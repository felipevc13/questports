-- Add BioShock Infinite Quest (egomortal/bsi-quest), Futurama Quest (mrchrisster/futurama-quest)
-- and Silent Hill VR (renangto15722-arch/Silent-Hill-1999-Quest-Standalone).
-- BioShock Infinite: package com.bsiquest.game (README); build b142; the Windows installer converts your own Steam copy over USB.
-- Futurama: package com.futuramarecomp.app (README); v0.1.2 APK; player supplies own Xbox ISO.
-- Silent Hill: package com.sh1vr.quest (README); v0.1 pre-release APK; player supplies own USA disc (SLUS-00707).
-- Package ids come from each README, not yet read from the APK manifest (scripts/verify-apk-packages.mjs).
--
-- cover_image_url is left null: the SteamGridDB capsules were not downloaded in this change.
-- Add them in a follow-up migration once public/covers has the files.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.

begin;

insert into public.ports (
  slug, title, developer, developer_url, short_description, category, status, cover_image_url,
  youtube_video_id, supported_hardware, locomotion_types, has_6dof_controls, internal_storage_path,
  base_game_url, base_game_store, port_download_url, port_download_source, github_url, latest_version,
  last_github_update, featured, installation_guide, troubleshooting_notes
) values
(
  'bioshock-infinite-quest',
  'BioShock Infinite Quest',
  'egomortal',
  'https://github.com/egomortal',
  'BioShock Infinite running natively on Quest 3 in stereo VR: the Windows game is recompiled to ARM64, no PC streaming. A Windows installer converts your own Steam copy and sends it to the headset over USB.',
  'decompilation',
  'in_development',
  null,
  null,
  array['Quest 3'],
  array['Smooth Locomotion', 'Seated', 'Standing'],
  true,
  '/sdcard/Android/data/com.bsiquest.game/',
  'https://store.steampowered.com/app/8870/',
  'Steam',
  'https://github.com/egomortal/bsi-quest/releases/download/b142/BSI-Quest-Installer.zip',
  'GitHub Release ZIP',
  'https://github.com/egomortal/bsi-quest',
  'b142',
  '2026-11-10T21:03:15Z',
  false,
  $guide$### Overview
**BSI-Quest** is an unofficial project that runs *BioShock Infinite* natively on Meta Quest 3, in stereo VR or flat. The Windows game's x86 code is statically recompiled to ARM64 and runs on the project's own runtime (DXVK plus the Turnip Vulkan driver). Nothing is streamed from a PC while you play.

**Install type: Windows installer plus your own Steam copy.** The APK holds only translated program code. The installer copies the game data from your PC to the headset over USB. The project ships no game files and has no DRM bypass.

> [!WARNING]
> **Early build (b142).** Quest 3 only. The installer checks for the exact Steam build of `BioShockInfinite.exe` and refuses other builds. GOG and Epic copies are not supported yet.

---

### What you need
1. **Meta Quest 3** with Developer Mode on.
2. A **Windows PC** and a USB cable.
3. **BioShock Infinite installed from Steam.**

---

### Step-by-step installation
1. Install BioShock Infinite from Steam on the PC.
2. Connect the Quest by USB and accept the USB debugging prompt in the headset.
3. Download `BSI-Quest-Installer.zip` from the latest (stable) GitHub release and unzip it.
4. Double-click `Install.bat`. Choose install (or optimized settings), VR or Flat, and whether to include the DLC.
5. If the installer cannot find the game, drag the BioShock Infinite game folder onto `Install.bat`.
6. On the headset open **Library → Unknown Sources → BioShock Infinite**.

`Switch-Mode.bat` switches between VR and Flat later, and `Uninstall.bat` removes the app. The release also attaches `bsi-quest.apk` and `vulkan.ad07xx.so` for the manual route described in the README.

---

### Folders on the Quest
- `/sdcard/Android/data/com.bsiquest.game/`: game data copied by the installer.
- `/sdcard/BSI/`: settings, the Vulkan driver and saves (`/sdcard/BSI/user`).
- `/sdcard/BSI/BioShock Infinite/`: fallback game location if the app folder cannot be used.
- `/sdcard/BSI/grip.txt` and `/sdcard/BSI/vr_aim.txt`: optional control settings.$guide$,
  'Quest 3 only; early build. Needs a Windows PC, a USB cable and the Steam build of BioShock Infinite: the installer rejects any other BioShockInfinite.exe, and GOG and Epic copies are not supported yet. If the game is not found, drag its folder onto Install.bat. Saves live in /sdcard/BSI/user. Use Switch-Mode.bat to change between VR and Flat.'
),
(
  'futurama-quest',
  'Futurama Quest',
  'mrchrisster',
  'https://github.com/mrchrisster',
  'The 2003 Futurama game, rebuilt natively for Quest 3 from a C++ decompilation and shown as a stereoscopic 3D window over passthrough. Bring your own Xbox ISO.',
  'decompilation',
  'in_development',
  null,
  null,
  array['Quest 3'],
  array['Seated', 'Virtual Screen (stereo 3D)', 'Mixed Reality (passthrough)'],
  false,
  '/sdcard/Futurama/',
  'https://en.wikipedia.org/wiki/Futurama_(video_game)',
  'Requires your own copy of Futurama (Xbox, NTSC-U or PAL)',
  'https://github.com/mrchrisster/futurama-quest/releases/download/v0.1.2/futurama-quest-v0.1.2.apk',
  'GitHub Releases',
  'https://github.com/mrchrisster/futurama-quest',
  'v0.1.2',
  '2026-11-15T00:29:35Z',
  false,
  $guide$### Overview
**Futurama Quest** runs the 2003 *Futurama* game natively on Meta Quest 3 (OpenXR and Vulkan). It is built from [Futurama-The-Game-The-Recomp](https://github.com/hiburn8/Futurama-The-Game-The-Recomp), a C++ decompilation of the original game. The game is shown in a stereoscopic 3D window floating over passthrough. It is not first-person VR.

**Install type: APK plus your own Xbox disc image.** The APK contains no game data.

> [!WARNING]
> **Early release (v0.1.2).** Expect rough edges and report problems on the project's GitHub issues.

---

### What you need
1. **Meta Quest 3** with Developer Mode on.
2. Your own original Xbox **Futurama** disc (NTSC-U or PAL), as a `.iso` image or as extracted files (`default.xbe` plus its assets). Any filename matching `*futurama*.iso` works.

---

### Step-by-step installation
1. Download `futurama-quest-v0.1.2.apk` from the GitHub release.
2. Install it with SideQuest, Meta Quest Developer Hub or `adb install -r futurama-quest-v0.1.2.apk`.
3. Copy your ISO (or the extracted files) to **one** of these folders on the headset:
   - `/sdcard/Futurama/`
   - `/sdcard/Download/`
   - `/sdcard/Android/data/com.futuramarecomp.app/files/`
4. Open **Library → Unknown Sources → Futurama**.$guide$,
  'Quest 3; early release. Shown as a stereoscopic 3D window over passthrough, not first-person VR. Needs your own Xbox Futurama disc (NTSC-U or PAL) as an ISO whose name contains "futurama", or as extracted files with default.xbe, in /sdcard/Futurama/, /sdcard/Download/ or the app''s Android/data files folder.'
),
(
  'silent-hill-vr',
  'Silent Hill VR',
  'renangto15722-arch',
  'https://github.com/renangto15722-arch',
  'The original 1999 Silent Hill as a standalone Quest 3 VR port: 6DoF head and hand tracking, roomscale, and weapons you draw from hip, chest and shoulder holsters. Bring your own USA disc.',
  'decompilation',
  'in_development',
  null,
  null,
  array['Quest 3'],
  array['Smooth Locomotion', 'Roomscale'],
  true,
  '/sdcard/SilentHillVR/gamedata/',
  'https://en.wikipedia.org/wiki/Silent_Hill_(video_game)',
  'Requires your own copy of Silent Hill (PS1, USA, SLUS-00707)',
  'https://github.com/renangto15722-arch/Silent-Hill-1999-Quest-Standalone/releases/download/v0.1/SilentHillVR-Quest-0.1.apk',
  'GitHub Releases',
  'https://github.com/renangto15722-arch/Silent-Hill-1999-Quest-Standalone',
  'v0.1',
  '2026-11-16T20:34:37Z',
  false,
  $guide$### Overview
**Silent Hill VR** is a standalone Meta Quest 3 VR port of the original PlayStation *Silent Hill* (1999), based on the Silent Hill PC port and decompilation project. It runs on the headset with no PC and no streaming: 6DoF head and hand tracking with roomscale, hip, chest and shoulder holsters, and PGXP geometry and texture stabilisation. VR hands come from UltimateXR BigHands (MIT).

**Install type: APK plus your own disc image.** No game files are distributed.

> [!WARNING]
> **Work in progress (v0.1 pre-release).** The first public build. Expect bugs and missing features, and report problems on the project's GitHub issues.

---

### What you need
1. **Meta Quest 3** with Developer Mode on.
2. Your own **Silent Hill (USA)** disc, SLUS-00707, as `Silent Hill (USA).bin` and `Silent Hill (USA).cue`.
3. Optional: the HD texture pack (keep it zipped) and the HD maps linked from the project's README.

---

### Step-by-step installation
1. Download `SilentHillVR-Quest-0.1.apk` from the GitHub release and install it with SideQuest or `adb install`.
2. Copy `Silent Hill (USA).bin` and `Silent Hill (USA).cue` to `/sdcard/SilentHillVR/gamedata/`.
3. Optional: put the zipped HD textures in `/sdcard/SilentHillVR/gamedata/texturemods/` and the HD map folders (such as `TIM`) in `/sdcard/SilentHillVR/gamedata/load/`.
4. Open **Library → Unknown Sources → Silent Hill VR** and allow **All files access** when asked.

On Windows, `Install-SilentHillVR.bat` from the release does the same over USB: it fetches adb from Google if needed, installs the APK, grants storage access and copies your files.

Saves and logs stay in `/sdcard/SilentHillVR` after an uninstall.

---

### Controls (Touch controllers)

| Control | Action |
| --- | --- |
| Trigger | Shoot or attack |
| Grip near hip, chest or shoulder | Draw or holster a weapon |
| Hold X | Item screen |
| Hold Y | PC options |
| Hold A (2 s) | Healing and map wheel |$guide$,
  'Quest 3; v0.1 work-in-progress pre-release. Needs your own USA disc (SLUS-00707) named Silent Hill (USA).bin and Silent Hill (USA).cue in /sdcard/SilentHillVR/gamedata/. Allow All files access on first launch or the game cannot read the disc. HD textures stay zipped in gamedata/texturemods/. Saves and logs in /sdcard/SilentHillVR survive an uninstall.'
)
on conflict (slug) do nothing;

commit;
