-- Add Resident Evil: The Umbrella Chronicles VR (lialan/reuc-vr) native Quest 3 port.
-- Package id from the release README (org.uc.umbrellachronicles.vr); APK: UmbrellaChroniclesVR-0.1.5.apk (quest-v0.1.5).
-- The player supplies an RBUE08 disc image (.wbfs/.iso) and common-key.bin.
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
  'umbrella-chronicles-vr',
  'Resident Evil: The Umbrella Chronicles VR',
  'Lialan',
  'https://github.com/lialan',
  'Native Quest 3 port of the Wii light-gun shooter, recompiled from the game''s PowerPC code. Point a Touch controller like a Wii Remote and shoot through the Ecliptic Express and Raccoon City, from your own disc image.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/umbrella-chronicles-vr.png',
  'CSk3iaN37Rw',
  array['Quest 3'],
  array['Seated', 'Standing'],
  true,
  '/sdcard/UmbrellaChronicles/',
  'https://en.wikipedia.org/wiki/Resident_Evil:_The_Umbrella_Chronicles',
  'Requires your own Wii disc image (NTSC-U, RBUE08)',
  'https://github.com/lialan/reuc-vr/releases/download/quest-v0.1.5/UmbrellaChroniclesVR-0.1.5.apk',
  'GitHub Release',
  'https://github.com/lialan/reuc-vr',
  'v0.1.5',
  '2026-11-10T14:47:47Z',
  false,
  $guide$### Overview
**Resident Evil: The Umbrella Chronicles VR** runs the Wii light-gun shooter natively on Meta Quest 3 as a standalone app: no PC, no streaming, no emulator. The game's PowerPC code was statically recompiled to native code (Lialan's Quest build of the `reuc-recomp` project, GPL-3.0). You play on a floating screen and aim with a Touch controller, which stands in for the Wii Remote.

**Install type: APK plus your own disc image.** The APK contains no game files. It reads your own North American disc image in place; nothing is unpacked or copied.

> [!WARNING]
> **Early build (v0.1.5).** Quest 3 only. The frame rate is not yet a steady 60 FPS in heavy scenes. The author has not yet confirmed that a real encrypted disc image loads with a real key on a headset, so expect rough edges. Please report problems to the project's GitHub issues.

---

### What you need
1. **Meta Quest 3** with Developer Mode enabled.
2. Your own disc image of **Resident Evil: The Umbrella Chronicles, North American release (game ID RBUE08)**, as a single `.wbfs` or `.iso` file. PAL (RBUP08) and Japanese (RBUJ08) do not work. `.rvz`, `.ciso`, `.wia` and split `.wbf1` files are not read: convert them to a plain `.iso` or a single `.wbfs` first (in Dolphin: right-click the game, then Convert File).
3. The **Wii common key** as a 16-byte file named `common-key.bin`. Wii discs are encrypted with it and the app does not include it. The project README says it can be taken from your own Wii.
4. A USB-C data cable and `adb`, or SideQuest.

---

### Step-by-step installation
1. Download `UmbrellaChroniclesVR-0.1.5.apk` from the GitHub release and install it with `adb install -r UmbrellaChroniclesVR-0.1.5.apk`, or drag it onto SideQuest.
2. Create the folder `UmbrellaChronicles` at the top of the headset's storage and copy your image and `common-key.bin` into it. Any file name ending in `.wbfs` or `.iso` works. The app also looks in `Download`; keep `common-key.bin` in the same folder as the image.
3. In the headset open **Library → Unknown Sources → Umbrella Chronicles VR**.
4. On the first start, Android opens the **All files access** screen: turn the switch on for the app, go back, and start the app again.

If something is missing, the app shows a short message and writes it to `HOW-TO-ADD-THE-GAME.txt` in `/sdcard/Android/data/org.uc.umbrellachronicles.vr/files/`.

---

### Updating
Install a newer APK over the old one (`adb install -r`). Settings and saves stay. Uninstalling the app deletes its settings and saves; your image and key stay in `UmbrellaChronicles`.

---

### Controls (Touch controllers)
The gun hand plays the Wii Remote. Pick it in the VR menu (Gun hand).

| Control | Action |
| --- | --- |
| Point the gun-hand controller | Aim |
| Trigger | Fire, confirm in menus |
| Grip, or trigger while pointing away from the screen | Reload |
| A (X with the left hand) | Action, pick up items |
| Hold A and swing | Knife |
| Hold A and pull the trigger | Grenade |
| B (Y with the left hand) | Next weapon |
| Shake the controller | Shake prompts |
| Thumbstick click | Pause (the game's menu) |
| Left menu button | VR menu |

The VR menu covers sight and laser style, gun hand, dual wield (the other hand plays player 2), screen distance, HUD position, recenter view, and display options such as resolution per eye, foveation, sharpening and glow. Lower the display settings if the frame rate drops.$guide$,
  'Quest 3 only; early build. Needs your own NTSC-U (RBUE08) .wbfs or .iso image plus a 16-byte common-key.bin in the same folder (/sdcard/UmbrellaChronicles/ or Download). Turn on All files access for the app on first launch. If the app closes right away, check that the image is RBUE08 and the key is correct; the app writes details to HOW-TO-ADD-THE-GAME.txt in Android/data/org.uc.umbrellachronicles.vr/files/.'
)
on conflict (slug) do nothing;

commit;
