-- Add five ports scouted on 2 Nov 2026:
-- Ratchet & Clank VR (moistman42069), Forsaken VR (SgtBilko76),
-- Let's Go Jungle! VR and The House of the Dead 4 Special VR (lialan, same release as hotd4-vr),
-- NFL Blitz 2000 VR (VistaLargaGames). Package ids were read from the release APKs.
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
  'ratchet-and-clank-vr',
  'Ratchet & Clank VR',
  'moistman42069',
  'https://github.com/moistman42069/RatchetAndClank-Quest-VR',
  'Insomniac''s 2002 PS2 platformer Ratchet & Clank running natively on Meta Quest through OpenRAC, with Rerac-vr''s first-person VR design. Bring your own disc.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/ratchet-and-clank-vr.jpg',
  'i4qKMyzYV3Q',
  array['Quest 3', 'Quest 3S'],
  array['Smooth Locomotion', 'Smooth Turn', 'Snap Turn', 'Third-Person Mode'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Ratchet_%26_Clank_(2002_video_game)',
  'Requires your own copy (PS2 disc image, PAL SCES-50916 or NTSC-U SCUS-97199)',
  'https://github.com/moistman42069/RatchetAndClank-Quest-VR/releases/download/v0.1.6/RatchetQuestVR-0.1.6.apk',
  'GitHub Releases',
  'https://github.com/moistman42069/RatchetAndClank-Quest-VR',
  'v0.1.6',
  '2026-11-02T09:35:07Z',
  false,
  '### Overview
**Ratchet & Clank VR** brings Insomniac''s 2002 PlayStation 2 game to standalone Meta Quest. It runs OpenRAC''s native recompiled port, not an emulator, with a VR mod that rebuilds npiriou''s Rerac-vr (the PC VR mod) on the headset: first person through Ratchet''s eyes, the weapon in your hand, real wrench swings, and reach-to-select weapons. A third-person mode and a 2D test mode are in the launcher.

> [!NOTE]
> **No game files included.** You need your own `.iso` of one of these discs: PAL (Europe) SCES-50916 v2.00, the best supported, or NTSC-U (North America) SCUS-97199 v1.00. Greatest Hits, Platinum, other regions and the sequels are refused.

---

### Prerequisites
* Meta Quest 3 or Quest 3S (Quest 2 and Quest Pro are untested).
* Your own Ratchet & Clank `.iso` (PAL or NTSC-U, see above).
* About 6 GB free on the headset.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `RatchetQuestVR-0.1.6.apk` from GitHub Releases.
2. Put your `.iso` in `/sdcard/Download/` (any folder the file picker can see works).
3. Open **Ratchet & Clank Quest VR** from **Unknown Sources** and choose the disc image in the launcher.
4. The first set-up copies the disc and prepares the levels. It can take up to half an hour, once. Keep the headset on charge.
5. Press **PLAY IN VR**.

---

### Controls
* **Left stick** walks towards where you look. **Right stick** turns (smooth by default, snap in the VR tab).
* **A** jumps, **B** hovers with Clank''s packs, **X** opens the map, **Y** pauses.
* **Right trigger** fires. **Right grip** takes the wrench out: swing your hand to hit.
* Hold the **right stick click** and move your hand towards a weapon for quick select.

> [!TIP]
> This is an early test build: walking and the first level have been played on a Quest 3, most of the game has not. The launcher updates itself from GitHub. Install updates over the old version and do not clear the app''s data, or the set-up and saves are lost.',
  'The launcher checks the disc and says why one is refused: use the PAL SCES-50916 or NTSC-U SCUS-97199 .iso, not Greatest Hits or Platinum. Each run writes a log to Download/RatchetQuestVR, and the launcher''s Logs tab shows the last one. Open the launcher again after playing so it writes the log.'
),
(
  'forsaken-vr',
  'Forsaken VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76/Forsaken-VR',
  'Acclaim''s 1998 six-degrees-of-freedom hover-bike shooter Forsaken in stereo VR on Meta Quest, from the ForsakenX source port. Game data is inside the APK.',
  'source_port',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/forsaken-vr.jpg',
  'CqllMMsXv8c',
  array['Quest 3'],
  array['Seated Cockpit', '6DoF Ship Flight (sticks)'],
  true,
  'N/A (game data bundled in the release APK)',
  'https://store.steampowered.com/app/668980/Forsaken_Remastered/',
  'Included (game data distributed by the ForsakenX community)',
  'https://github.com/SgtBilko76/Forsaken-VR/releases/download/v0.1.2/Forsaken-VR-v0.1.2-full.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/Forsaken-VR',
  'v0.1.2',
  '2026-10-31T16:41:20Z',
  false,
  '### Overview
**Forsaken VR** is a native OpenXR port of Forsaken (Probe Entertainment / Acclaim, 1998) for Meta Quest 3, built by SgtBilko76 on the ForsakenX community source port. You fly a hover-bike through tunnels in full six degrees of freedom, in stereo 3D, with Touch controls. v0.1.2 adds the Forsaken soundtrack, one track per level.

> [!NOTE]
> **Nothing else to copy.** This is the full APK with the game data built in (about 752 MB). There is no ROM or game-file step.

---

### Prerequisites
* Meta Quest 3 (other headsets are not listed by the release).
* About 1 GB free on the headset.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `Forsaken-VR-v0.1.2-full.apk` from GitHub Releases. It is a large download.
2. Launch **Forsaken VR** from **Unknown Sources**.
3. Play.

> [!TIP]
> Six-degrees-of-freedom flight can be hard on the stomach. Play seated and take breaks if you are new to it.',
  'The APK is about 752 MB, so the download takes a while and needs about 1 GB free. If the install fails, free space and try again. Report bugs on the Forsaken-VR GitHub repository.'
),
(
  'lets-go-jungle-vr',
  'Let''s Go Jungle! VR',
  'lialan',
  'https://github.com/lialan/lindbergh-recomp-ports',
  'Sega''s 2006 Lindbergh jeep light-gun game Let''s Go Jungle! Lost on the Island of Spice, statically recompiled and running standalone on Meta Quest in stereo VR. Experimental.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/lets-go-jungle-vr.jpg',
  'Tlf1P1Twl1Q',
  array['Quest 3', 'Quest 3S', 'Quest Pro'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/LetsGoJungle/',
  'https://en.wikipedia.org/wiki/Let%27s_Go_Jungle!:_Lost_on_the_Island_of_Spice',
  'Requires your own copy (Sega Lindbergh arcade game files)',
  'https://github.com/lialan/lindbergh-recomp-ports/releases/download/v0.2.7/LetsGoJungleVR-v0.2.7-quest3.apk',
  'GitHub Releases',
  'https://github.com/lialan/lindbergh-recomp-ports',
  'v0.2.7',
  '2026-10-31T17:41:34Z',
  false,
  '### Overview
**Let''s Go Jungle! VR** runs Sega''s 2006 Lindbergh arcade game (the original, not *Special*) standalone on Meta Quest. The game''s x86 Linux executable is statically recompiled to native code with the lindberghrecomp toolkit, so nothing is emulated. The jungle is in stereo around you, the gun is a tracked controller, and the HUD hangs on a screen in front of you.

Built by lialan on the same runtime as Ghost Squad Evolution VR and The House of the Dead 4 VR.

> [!NOTE]
> **No game files included.** You need your own copy of the arcade game: `lgj_final` and its `data`, `shader` and `extraShader` folders (about 1 GB). The app only runs the `lgj_final` it was built from.

---

### Prerequisites
* Meta Quest 3, Quest 3S, or Quest Pro.
* Your own `lgj_final`, `data`, `shader` and `extraShader`.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `LetsGoJungleVR-v0.2.7-quest3.apk` with SideQuest / `adb install -r`.
2. Copy `lgj_final` and the `data`, `shader` and `extraShader` folders into `/sdcard/LetsGoJungle/` (`adb push lgj_final data shader extraShader /sdcard/LetsGoJungle/`).
3. Launch **Let''s Go Jungle VR** from **Unknown Sources**.
4. The first time, the app opens the **All files access** screen. Allow it, then start the app again.

---

### Controls
* Point and pull the **trigger** to fire, with either hand. The jungle guns never need reloading.
* A thumbstick click is Start. Coins are inserted automatically.
* The **left menu button** opens the settings panel, with Reset game.

> [!TIP]
> Experimental release: it plays from attract mode through the first stage at 60 fps on a Quest 3, and is still a bit buggy. Updates install over the previous version and keep the game, settings and saves.',
  'If the game is missing or is a different version than the one this APK was built from, the app writes HOW-TO-ADD-THE-GAME.txt to Android/data/org.lindbergh.lgj.vr/files/. lgj_final has to be at /sdcard/LetsGoJungle/lgj_final. The log of the last run is /sdcard/LetsGoJungle/lgj.log. If the app closes right after the first start, allow All files access and open it again.'
),
(
  'hotd4-special-vr',
  'The House of the Dead 4 Special VR',
  'lialan',
  'https://github.com/lialan/lindbergh-recomp-ports',
  'Sega''s 2006 ride-cabinet edition The House of the Dead 4 Special, statically recompiled and running standalone on Meta Quest in stereo VR. Tracked controller gun, path choices included.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/hotd4-special-vr.jpg',
  '9MDLHrvqX3M',
  array['Quest 3', 'Quest 3S', 'Quest Pro'],
  array['On-Rails (game-driven camera)', 'Roomscale', 'Seated'],
  true,
  '/sdcard/HouseOfTheDead4Special/',
  'https://en.wikipedia.org/wiki/The_House_of_the_Dead_4',
  'Requires your own copy (Sega Lindbergh arcade game files)',
  'https://github.com/lialan/lindbergh-recomp-ports/releases/download/v0.2.7/HouseOfTheDead4SpecialVR-v0.2.7-quest3.apk',
  'GitHub Releases',
  'https://github.com/lialan/lindbergh-recomp-ports',
  'v0.2.7',
  '2026-10-31T17:41:34Z',
  false,
  '### Overview
**The House of the Dead 4 Special VR** runs the 2006 ride-cabinet version of Sega''s Lindbergh zombie shooter standalone on Meta Quest. It is a different game from The House of the Dead 4, with its own stages and its own APK. The x86 Linux executable is statically recompiled to native code with the lindberghrecomp toolkit, so nothing is emulated. The world is in stereo around you and the gun is a tracked controller.

> [!NOTE]
> **No game files included.** You need your own copy of the game''s `elf` and `fs` folders. The app only runs the `hod4M.elf` it was built from.

---

### Prerequisites
* Meta Quest 3, Quest 3S, or Quest Pro.
* Your own House of the Dead 4 Special `elf` and `fs` folders.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `HouseOfTheDead4SpecialVR-v0.2.7-quest3.apk` with SideQuest / `adb install -r`.
2. Copy the `elf` and `fs` folders into `/sdcard/HouseOfTheDead4Special/`, so the executable ends up at `/sdcard/HouseOfTheDead4Special/elf/hod4M.elf` (`adb push elf fs /sdcard/HouseOfTheDead4Special/`).
3. Launch **The House of the Dead 4 Special VR** from **Unknown Sources**.
4. The first time, the app opens the **All files access** screen. Allow it, then start the app again.

---

### Controls
* **Trigger** fires. **Shake the gun** to reload, or press the grip.
* At a branch, shoot one of the two boxes to choose the path.
* A thumbstick click is Start. Coins are inserted automatically.
* The **left menu button** opens the settings panel, which adds a **HUD position** row for this game.

> [!TIP]
> Plays through the stages at 55-60 fps on a Quest 3. Updates install over the previous version and keep the game, settings and saves.',
  'If the game is missing or is a different version than the one this APK was built from, the app writes HOW-TO-ADD-THE-GAME.txt to Android/data/org.lindbergh.hotd4sp.vr/files/. The executable has to be at /sdcard/HouseOfTheDead4Special/elf/hod4M.elf, not in the House of the Dead 4 folder. If the app closes right after the first start, allow All files access and open it again.'
),
(
  'nfl-blitz-2000-vr',
  'NFL Blitz 2000 VR',
  'VistaLargaGames',
  'https://github.com/VistaLargaGames/NFL-Blitz-2000-Quest-VR',
  'The N64 arcade football game NFL Blitz 2000, recompiled to run natively on Meta Quest 3 at 60 fps on a big curved screen, with HD textures and 2-4 player online VS.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/nfl-blitz-2000-vr.jpg',
  '_TRRrQVE-Mg',
  array['Quest 3'],
  array['Seated', 'Curved Screen'],
  false,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/NFL_Blitz_2000',
  'Requires your own copy (NFL Blitz 2000 USA Rev 1 N64 ROM)',
  'https://github.com/VistaLargaGames/NFL-Blitz-2000-Quest-VR/releases/download/v0.1.56/NFL-Blitz-VR-0.1.56.apk',
  'GitHub Releases',
  'https://github.com/VistaLargaGames/NFL-Blitz-2000-Quest-VR',
  'v0.1.56',
  '2026-10-28T19:18:44Z',
  false,
  '### Overview
**NFL Blitz 2000 VR** runs the Nintendo 64 version of NFL Blitz 2000 natively on Meta Quest 3, recompiled with N64Recomp and RT64. The game''s own camera plays on a big curved screen around you at 60 fps (smoothed to 120 Hz), with screens and menus upscaled 4x. Online VS lets 2 to 4 players, each on their own Quest, join with a room code.

> [!NOTE]
> **No game files included.** You need your own NFL Blitz 2000 (USA, Rev 1) ROM, made from your own cartridge.

---

### Prerequisites
* Meta Quest 3.
* Your own NFL Blitz 2000 (USA, Rev 1) ROM.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `NFL-Blitz-VR-0.1.56.apk` from GitHub Releases.
2. Put your ROM somewhere on the headset, for example `/sdcard/Download/`.
3. Launch **NFL Blitz VR** from **Library > Unknown Sources**.
4. In the start window, choose your ROM. The game checks it and remembers it. After that, just press **Play**.

---

### Controls
* **Left stick** moves. **A / B** are A / B. **Either trigger** is Z (turbo).
* **Right grip** is R. **Right stick** is the C buttons. **Left menu button** is Start / pause.

### Online play
1. Everyone uses the same version of the app.
2. One player taps **Host (get a code)** and shares the code. The others tap **Join (enter a code)**.
3. The host presses Start once everyone has joined. The host''s options are the game everyone plays.',
  'Use the NFL Blitz 2000 USA Rev 1 ROM; the start window checks the file. Online play needs every player on the same app version. It goes through a small shared relay by default; a relay.txt in /sdcard/Android/data/com.blitz2000.recompiled/files/ points it at your own.'
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
