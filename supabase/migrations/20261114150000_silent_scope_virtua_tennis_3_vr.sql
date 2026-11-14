-- Add Silent Scope VR (vr4all-standalone/silent-scope-vr) and Virtua Tennis 3 VR (mrchrisster/virtuatennis3-vr).
-- Silent Scope: package com.vrlightgunhub.silentscope read from the v0.0.68 release APK; player imports own Dreamcast disc files.
-- Virtua Tennis 3: package org.lindbergh.vt3.vr (quest/vt3/build.gradle); no APK release, built on a PC from the player's arcade copy.
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
  'silent-scope-vr',
  'Silent Scope VR',
  'vr4all-standalone',
  'https://github.com/vr4all-standalone',
  'Dreamcast sniper shooter in standalone Quest VR. Hold a tracked sniper rifle with two hands, look through the live scope view in the eyepiece, zoom with the stick, and reload by hand on the AWP rifle. Built from your own disc.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/silent-scope-vr.png',
  'u2KXT71UqwI',
  array['Quest 3', 'Quest 3S'],
  array['Seated', 'Standing'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Silent_Scope',
  'Requires your own Dreamcast disc files (USA, V1.000)',
  'https://github.com/vr4all-standalone/silent-scope-vr/releases/download/v0.0.68/silent-scope-vr-quest.apk',
  'GitHub Release',
  'https://github.com/vr4all-standalone/silent-scope-vr',
  'v0.0.68',
  '2026-11-11T17:52:48Z',
  false,
  $guide$### Overview
**Silent Scope VR** runs the Dreamcast version of Konami's sniper shooter natively on Meta Quest 3 / 3S as a standalone app (a VR build of the Flycast engine by VR4ALL). You hold a tracked sniper rifle and look through the game's live scope view inside the eyepiece. Pick an Arcade rifle (automatic reload) or an AWP Simulation rifle (a real bolt and magazine) from the two labelled positions in front of you.

**Install type: APK plus your own disc files.** The APK contains no game, disc image or BIOS. You import your own Dreamcast disc files from inside the app.

> [!WARNING]
> **Experimental release (v0.0.68).** The APK is installed and checked on a Quest 3S and the startup is verified. A full physical-headset playthrough of the latest build, a continuous scored campaign and every end-of-round screen are not yet verified, and brief flat frames can appear during loading or view changes. Please report problems on the project's GitHub issues.

---

### What you need
1. **Meta Quest 3 or 3S** with Developer Mode on.
2. Your own **Silent Scope (USA), Dreamcast US V1.000** disc files, exactly these four files, extracted from any archive:
   - `Silent Scope (USA).cue`
   - `Silent Scope (USA) (Track 1).bin`
   - `Silent Scope (USA) (Track 2).bin`
   - `Silent Scope (USA) (Track 3).bin`
3. The arcade ROM set and Silent Scope 2 use different game data and do not work.

---

### Step-by-step installation
1. Download `silent-scope-vr-quest.apk` from the GitHub release and install it with `adb install -r silent-scope-vr-quest.apk`, or drag it onto SideQuest.
2. Copy the four disc files to the headset (the `Download` folder is a good place).
3. In the headset open **Library → Unknown Sources → Silent Scope - VR4ALL**.
4. Choose **Choose disc files** and select the CUE and all three BIN tracks together. The app keeps a working copy in its own folder and validates it before starting VR.
5. Read the introduction, grab either labelled rifle with Grip, and use B or Y to send the game's Start command.

---

### Updating
Install a newer APK over the old one (`adb install -r`). Your game files, saves and settings stay.

---

### Controls (Touch controllers)

| Control | Action |
| --- | --- |
| Firing-hand Grip | Pick up or release the rifle at its rear grip |
| Support-hand Grip at the fore-end | Hold the rifle with two hands |
| Release both grips | Return the rifle and show both rifle choices |
| Trigger | Fire, or point and select in the original game menus |
| B or Y | Native Start / Pause |
| Hold A | Focus Mode for smaller aiming adjustments |
| Right stick up / down | Native scope camera zoom (0.2x to 5x) |
| Left Menu button | VR settings |
| Left stick click | Recenter |
| Right stick click | Toggle the laser |

For left-handed play choose Left hand in VR settings. On the Simulation rifle, use a free hand's Trigger to grab the highlighted bolt (lift, pull back, push forward, close) and to swap the magazine when it is empty.$guide$,
  'Quest 3 and 3S; experimental. Needs your own Dreamcast US V1.000 Silent Scope disc: the .cue and all three .bin tracks, extracted from any archive, selected together in the app''s file picker. Other regions, the arcade ROM set and Silent Scope 2 do not work. Install updates over the existing app to keep game files and saves. Brief flat frames can appear during loading or view changes.'
),
(
  'virtuatennis3-vr',
  'Virtua Tennis 3 VR',
  'mrchrisster',
  'https://github.com/mrchrisster',
  'Sega''s arcade Virtua Tennis 3 rebuilt for Quest: stand courtside in the full 3D stadium, or play Classic on a big virtual screen. Built on your PC from your own arcade copy.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/virtuatennis3-vr.jpg',
  'HLOx7s2JFiw',
  array['Quest 3', 'Quest 3S', 'Quest Pro'],
  array['Seated', 'Standing'],
  true,
  '/sdcard/VirtuaTennis3/',
  'https://en.wikipedia.org/wiki/Virtua_Tennis_3',
  'Requires your own Virtua Tennis 3 arcade game folder (Lindbergh)',
  'https://github.com/mrchrisster/virtuatennis3-vr',
  'GitHub Build Script',
  'https://github.com/mrchrisster/virtuatennis3-vr',
  'v0.1.0',
  '2026-11-14T16:48:04Z',
  false,
  $guide$### Overview
**Virtua Tennis 3 VR** is a Meta Quest 3 / 3S / Pro port of Sega's arcade *Virtua Tennis 3* (Lindbergh, 2006). The game's x86 code is statically recompiled to C on your own computer and built against a runtime that stands in for the arcade cabinet. Nothing is emulated. Play **Classic** (the arcade picture on a big virtual screen) or **VR** (stand courtside in the full 3D stadium).

**Install type: built on your own PC, from your own arcade game folder.** There is no APK to download: the app holds code translated from the game, so everyone builds their own. The project ships no game files.

> [!WARNING]
> **Early, experimental project.** The README says it was built and checked on macOS and not yet confirmed on the headset by the project, although the author's trailer shows it running on a Quest 3. Expect rough edges and report problems on the project's GitHub issues.

---

### What you need
1. **Meta Quest 3, 3S or Pro** with Developer Mode on, and a USB-C data cable.
2. Your own **Virtua Tennis 3 arcade game folder** (`disk0`, the one that holds `vt3_Lindbergh/`, `shader/` and `lib/`), including `lib/libCg.so`. The port is built against the `vt3_Lindbergh_HD` (1360x768) executable and the script checks its SHA-256. Rev. A or Rev. C dumps work.
3. A **Mac or Windows PC** with Git, CMake, Ninja, Python 3.10+, a JDK 17+ (21 recommended) and the Android SDK with NDK 27 or 28. macOS also needs the Xcode command line tools.
4. About 7 to 15 minutes for the first build (most of it the recompile).

> [!WARNING]
> Some `vt3.bin` dumps are cut short and leave 11 to 12 player model `.efo` files (James Blake and Mario Ancic) empty or damaged. The build stops by default. If you bypass the check, the game plays but crashes in tournaments when those players load. Replace those files from a complete copy.

---

### Step-by-step installation
1. Install the build tools listed in the project README (macOS: Homebrew `cmake ninja`, `openjdk@21`, Android Studio's SDK Manager for the SDK and NDK; Windows: `winget install Git.Git Kitware.CMake Ninja-build.Ninja Microsoft.OpenJDK.21 Python.Python.3.12` plus the Android SDK).
2. **Mac:**
   `git clone --recursive https://github.com/mrchrisster/virtuatennis3-vr.git`, then `cd virtuatennis3-vr` and `scripts/build-quest-from-my-copy.sh --install /path/to/disk0`.
3. **Windows (PowerShell):** clone the same way, then run `.\scripts\build-quest-windows.ps1 -Install C:\path\to\disk0`.
4. The script checks your game folder, builds the libraries, recompiles your copy, builds `quest/VirtuaTennis3VR.apk`, installs it and copies the game files the app reads to `/sdcard/VirtuaTennis3/` on the headset. Run it again after an update or a failure: finished steps are skipped. Use `--check` (Mac) or `-Check` (Windows) to only verify your tools and game folder.
5. In the headset open **Library → Unknown Sources → Virtua Tennis 3 VR**.

---

### Updating
Pull the repository and run the same script again. Settings and saves on the headset are left alone.

---

### Controls (Touch controllers, either hand)

| Control | Action |
| --- | --- |
| Trigger | Top spin |
| A / X | Slice |
| B / Y | Lob |
| Stick | Move |
| Stick click | Start |
| Left menu button | Settings panel |

The settings panel switches between Classic and VR, and sets camera height, replays, sky, anti-aliasing, texture filtering, shadows, display rate and resolution per eye. It starts with settings tuned on a Quest 3; lower them on a Quest 3S or Pro if the frame rate drops. Progress saving is on by default (experimental).$guide$,
  'Experimental; needs a Mac or Windows PC to build, and your own Virtua Tennis 3 arcade folder (disk0 with vt3_Lindbergh/, shader/ and lib/libCg.so). No APK is distributed. The game files the app reads are copied to /sdcard/VirtuaTennis3/. A dump that requires the cabinet''s security dongle check stops at start-up with ''Game Program Not Found''. Damaged player .efo models crash tournaments; replace them from a complete Rev. A or Rev. C copy. Lower the picture settings on a Quest 3S or Pro.'
)
on conflict (slug) do nothing;

commit;
