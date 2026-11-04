-- Add two ports: Port0r: Scud Race VR (jacquesdupontd) and South Park VR (VistaLargaGames).
-- Package ids were read from the release APKs (io.port0r.scudrace, com.southpark.recompiled).
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
  'scud-race-vr',
  'Port0r: Scud Race VR (Scud Race)',
  'jacquesdupontd (Port0r)',
  'https://github.com/jacquesdupontd',
  'Scud Race (1996 arcade, Sega Model 3) in true stereoscopic 3D, standalone on Meta Quest 3. Built on MAME with Port0r''s renderer that redraws every polygon for each eye: HD textures, a full cockpit view, Logitech wheel support over USB-C and the cabinet''s own settings.',
  'emulator',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/scud-race-vr.jpg',
  'r90VKyOhWvY',
  array['Quest 3'],
  array['Seated Driving', 'Stick Steering'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Scud_Race',
  'Requires your own copy (MAME 0.289 set scud.zip)',
  'https://github.com/jacquesdupontd/port0r/releases/download/scud-v0.2.1/Port0r-ScudRaceVR-v0.2.1-quest3.apk',
  'GitHub Releases',
  'https://github.com/jacquesdupontd/port0r',
  'scud-v0.2.1',
  '2026-11-02T22:44:49Z',
  false,
  '### Overview
**Port0r: Scud Race VR** brings Sega AM2''s 1996 arcade racer *Scud Race* (Sega Model 3) to Meta Quest 3 as a standalone app in **true stereoscopic 3D**. The arcade code runs through MAME (0.289), and Port0r''s own renderer redraws every 3D polygon for each eye, so you sit in the car instead of watching a flat screen. It is from the same developer as [Port0r: Daytona USA VR](/ports/daytona-usa-vr), [Port0r: Rally VR](/ports/sega-rally-vr) and [Port0r: Cop VR](/ports/virtua-cop-vr).

**Install type: APK + your own game files.**

Highlights (v0.2.1):
* HD textures switched on from the start, the arcade''s distance fog, and real glass on the cars.
* A complete cockpit view: dashboard, gauges, steering wheel and the driver''s arms.
* **Logitech wheels work in standalone** through the headset''s USB-C port, with force feedback.
* Controller vibration on every hit and crash, plus HUD size and seat height settings.
* Menus and attract mode on a big screen in front of you, like the arcade monitor.

> [!NOTE]
> **No game data is included.** You need your own, legally owned copy of the arcade game as the MAME set **`scud.zip`**, kept zipped. The set must match **MAME 0.289**. Fan project, not affiliated with SEGA or Meta.

---

### Prerequisites
1. **Meta Quest 3.** The APK is about 237 MB.
2. **Developer Mode** enabled (free developer organisation at developer.oculus.com, then Meta Horizon app > Devices > Headset settings > Developer mode, then restart the headset).
3. Your MAME 0.289 `scud.zip`.

---

### Step-by-Step Installation

#### 1. Install the APK
Download **`Port0r-ScudRaceVR-v0.2.1-quest3.apk`** via 1-click on QuestPorts, from [GitHub Releases](https://github.com/jacquesdupontd/port0r/releases/tag/scud-v0.2.1) or [itch.io](https://port0r.itch.io/scud-race-vr). Install it with SideQuest (**Install APK file from folder**) or:

```bash
adb install -r Port0r-ScudRaceVR-v0.2.1-quest3.apk
```

The APK checksum is in `SHA256SUMS.txt` on the release page.

#### 2. Copy your game file
Put `scud.zip` in the headset''s **`Download`** folder. The app searches the whole storage, so a `ROMS` folder from other emulators works too, and names are not case sensitive.

```bash
adb push scud.zip /sdcard/Download/
```

You can also copy it with SideQuest''s file browser, over USB (accept **Allow access to data** in the headset; on a Mac use OpenMTP), or download it from your own cloud storage with the headset''s browser (it lands in `Download`).

#### 3. First launch
1. Open **Library**, set the filter to **Unknown sources** and start **Port0r: Scud Race VR**.
2. Allow **All files access** when the headset asks.
3. Come back to the app: the game is copied in and starts by itself. Until then, a screen tells you which files are missing.

> [!TIP]
> The app checks its own releases at launch and offers the new version. Installing a new APK over the old one keeps your settings and records.',
  'File reported missing: the file must be named scud.zip and kept zipped (not an extracted folder), and All files access must be allowed (Settings > Apps > Port0r: Scud Race VR > Permissions). "Wrong version of the game files": the set must match MAME 0.289; check it with a ROM manager (ClrMamePro, RomVault) and drop the corrected zip on the headset in place of the old one. Controllers do nothing: restart the headset. The game stutters: lower the resolution or turn on dynamic resolution in the settings. App not in the Library: look under Unknown sources; Developer Mode must be on and the headset restarted. Fan project, not affiliated with SEGA or Meta; no game data is provided.'
),
(
  'south-park-vr',
  'South Park VR',
  'VistaLargaGames',
  'https://github.com/VistaLargaGames',
  'South Park (N64, 1998) running natively on Meta Quest 3 as recompiled code. Head-aim or wrap-around camera, 60 fps, a floating HUD and online co-op (beta). Bring your own US ROM.',
  'decompilation',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/south-park-vr.jpg',
  'xnINbs_mo9I',
  array['Quest 3'],
  array['Smooth Locomotion', 'Smooth Turn', 'Head Tracking'],
  false,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/South_Park_(video_game)',
  'Requires your own copy (Nintendo 64 cartridge ROM, South Park USA)',
  'https://github.com/VistaLargaGames/South-Park-Quest-VR/releases/download/v0.1.0/SouthParkVR-Quest-0.1.0.apk',
  'GitHub Releases',
  'https://github.com/VistaLargaGames/South-Park-Quest-VR',
  'v0.1.0',
  '2026-11-02T20:58:22Z',
  false,
  '### Overview
**South Park VR** runs the Nintendo 64 shooter *South Park* (Iguana Entertainment / Acclaim, 1998) natively on Meta Quest 3 as recompiled code, not an emulator. You can look around with your headset and the game''s camera follows. It is built on [N64Recomp](https://github.com/N64Recomp/N64Recomp), N64ModernRuntime and RT64 by VistaLargaGames.

**Install type: APK + your own ROM.**

Highlights:
* 60 FPS, with in-between pictures added on top of the game''s own frames.
* Two cameras, picked in the start window or switched in game by clicking the right stick: **Head aim** (the game''s camera and your snowballs follow your head) and **Wrap-around** (a big curved screen that stays in the room).
* A floating HUD with health and ammo, and the intro screens are skipped.
* **Online co-op (beta):** play story mode with a friend, each on their own Quest, with a 4-digit room code.

> [!NOTE]
> **No game files included.** Unofficial fan project. You need your own ROM made from your own cartridge: **South Park (USA)**. Any file name works.

---

### Prerequisites
* Meta Quest 3.
* Your own South Park (USA) ROM (`.z64`, `.n64` or `.v64`).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `SouthParkVR-Quest-0.1.0.apk` with SideQuest / `adb install`.
2. Put your ROM on the headset, for example in `/sdcard/Download/`.
3. Start **South Park VR** from **Library > Unknown Sources**.
4. In the start window choose your ROM. The game checks the file and remembers it; after that just press **Play**.

---

### Controls
| Button | Action |
|---|---|
| Left stick | Walk / strafe |
| Right stick | Turn |
| A or left trigger | Jump |
| B | Change weapon |
| Right trigger | Throw |
| Y | L |
| Left menu button | Start / pause |
| Right stick click | Switch camera (head aim / wrap-around) |

> [!TIP]
> Turn on **Options > Crosshairs** to see where your snowballs go. To play online, one player taps **Online co-op: host a room** and gives the friend the 4-digit code; the friend taps **Online co-op: join a room**. Both need the same version of the app.',
  'Version 0.1.0 is the first release. Known bugs: some polygons flicker or disappear in a few places (for example near Jimbo''s), and the wrap-around screen looks softer than head aim. Online co-op is in beta, so expect some lag. If the start window refuses the ROM, it must be South Park (USA); other regions and hacks are not supported. Allow file access when the headset asks.'
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
