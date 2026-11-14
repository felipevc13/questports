-- Add Lunacid VR (felipevc13/lunacid-vr) Quest 3 / 3S port, built locally from the player's own Steam copy.
-- Package id from lunacid_vr.py (PKG): com.AkumaKira.LunacidVR. No APK release: the setup script builds on a PC.
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
  'lunacid-vr',
  'Lunacid VR',
  'felipevc13',
  'https://github.com/felipevc13',
  'Quest 3 / 3S port of KIRA''s dark fantasy dungeon crawler, inspired by King''s Field. Look around with your head, move with the stick, swing and cast with tracked controllers. Built on your PC from your own Steam copy.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/lunacid-vr.jpg',
  'k4I-RJvP6mY',
  array['Quest 3', 'Quest 3S'],
  array['Seated', 'Standing'],
  true,
  '/sdcard/Android/obb/com.AkumaKira.LunacidVR/',
  'https://store.steampowered.com/app/1745510/',
  'Steam',
  'https://github.com/felipevc13/lunacid-vr',
  'GitHub Build Script',
  'https://github.com/felipevc13/lunacid-vr',
  'v1.0',
  '2026-11-14T01:04:31Z',
  false,
  $guide$### Overview
**Lunacid VR** is a Meta Quest 3 / 3S port of KIRA's dark fantasy dungeon crawler *Lunacid* (inspired by King's Field and Shadow Tower). The port is a Unity build with a VR layer: head-look movement, tracked controllers and in-VR menus.

**Install type: built on your own PC, from your own Steam copy.** There is no APK to download, and the project ships no game files. One command installs what is missing, takes your copy of the game from Steam, builds it locally and installs it on the Quest. Nothing derived from the game leaves your computer.

---

### What you need
1. **Lunacid** on your Steam account (a Steam login and Steam Guard are needed once, in Valve's own SteamCMD; the tools never see the password).
2. A **Windows 10/11 or macOS** computer with about **40 GB free** and a few hours the first time (most of it waiting on Unity).
3. A **Meta Quest 3 or 3S** with Developer Mode on, and its USB-C data cable.
4. A free Unity Hub account (the setup opens Unity Hub and asks you to sign in once).

---

### Step-by-step installation
1. Turn on Developer Mode on the Quest (Meta Horizon app → Menu → Devices → Headset settings → Developer mode), then restart the headset.
2. **Windows:** press the Windows key, type `PowerShell`, press Enter and paste:
   `irm https://raw.githubusercontent.com/felipevc13/lunacid-vr/main/setup.ps1 | iex`
3. **Mac:** press Cmd+Space, type `Terminal`, press Return and paste:
   `curl -fsSL https://raw.githubusercontent.com/felipevc13/lunacid-vr/main/setup.sh | bash`
4. Answer what it asks: your Unity Hub sign-in, your Steam user name (SteamCMD asks for the password itself) and, at the end, plug in the Quest **while wearing it** and choose **Allow USB debugging**.
5. When it says **Done**, open **Library → Unknown Sources → Lunacid VR** in the headset.

The setup guides cover every prompt: [Windows](https://github.com/felipevc13/lunacid-vr/blob/main/docs/SETUP_WINDOWS.md) and [Mac](https://github.com/felipevc13/lunacid-vr/blob/main/docs/SETUP_MAC.md). Prefer to see each piece? Use the by-hand guides in the same folder.

If it stops, run the same line again: finished steps are skipped.

---

### Updating
Paste the same line again. It fetches the new version, rebuilds only when the change needs it (a quick build takes about 25 to 45 minutes) and installs over the old one. Your saves stay.

---

### Keep your signing key
The first build creates a signing key in the work folder (`lunacid-work/keystore`). Android only updates the installed game with an APK signed by the same key, so copy that folder somewhere safe. On a new computer, put it back before the first build. If you build on another computer without it, the installer stops and the project README shows how to back up and restore your saves by hand.

---

### Controls (Touch controllers)
Look around with your head. The left stick moves you where you look.

| Control | Left controller | Right controller |
| --- | --- | --- |
| Stick | Move where you look | Turn |
| Stick click | Next item | Use item |
| Top button | Y: swap weapon | B: sprint, back |
| Bottom button | X: use, talk, open | A: jump, confirm |
| Menu button | Inventory, pause | |
| Trigger | Block | Attack, menu click |
| Grip | Spell 1 | Spell 2 |

In menus, point with the right controller and pull its trigger. The settings page has TURN (snap or smooth), SNAP ANGLE and TURN SPEED. L/R HAND swaps attack and block.$guide$,
  'Quest 3 and 3S only. Needs a PC (Windows or macOS) with about 40 GB free and your own Lunacid copy on Steam; there is no APK to download. If the setup stops, run the same line again. If it says the Quest is waiting to allow this computer, unplug the cable, put the headset on, plug it back in while wearing it and choose Allow USB debugging. If it says the game on the Quest was built on another computer (signed by another key), follow the back-up, uninstall, install and restore steps in the project README. The game data is an OBB in /sdcard/Android/obb/com.AkumaKira.LunacidVR/.'
)
on conflict (slug) do nothing;

commit;
