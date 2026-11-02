-- WinlatorXR page: add a section for the VR mods that run inside WinlatorXR
-- (Call of Duty 4, Far Cry, Crysis, Battlefield 1942, Red Faction, TrackMania).
-- They are zips for a PC game install, not separate apps, so they stay on this page
-- instead of getting their own catalog cards. mockPorts.ts carries the same text.
--
-- Apply manually in the Supabase SQL editor after merge.

update public.ports
set installation_guide = '### Installation
1. Download and install WinlatorXR APK via SideQuest or GitHub Releases.
2. Put game installation folders in your Quest `/sdcard/Download/` directory.
3. Open WinlatorXR, create a new Wine Container with Turnip drivers and DXVK enabled, and run your setup or .exe file.

---

### VR mods that run inside WinlatorXR
These are full VR mods for PC games that run standalone on Quest 3 through WinlatorXR, made by SgtBilko76 (Port Royale). They are not separate apps: each one is a zip you unpack into your own game folder, plus a WinlatorXR container or shortcut profile. All are betas.

> [!NOTE]
> **You need your own copy of each PC game** (Steam, GOG or retail), copied from a PC into `/sdcard/Download/`. Each mod''s page lists the exact container settings (screen size, DXVK, Turnip) and the WinlatorXR build it was tested on: the newer **dawn** line or **cats-27**.

* **Call of Duty 4 VR** (KisakCOD): copy the COD4 folder to `Download/CallOfDuty4`. Physical reloads and a physical scope. Needs dawn-33 or newer. [Release](https://github.com/SgtBilko76/CallOfDuty4_VR/releases/tag/v0.2.0-beta.1) · [Guide](https://portroyale.online/cod4.html)
* **Far Cry VR**: your own Far Cry (2004). Holds a locked 72 fps at 1792×1624 once `FarCry.exe` is patched large-address-aware. [Release](https://github.com/SgtBilko76/Farcry_vrmod-WinlatorXR/releases/tag/quest-beta-0.3) · [Guide](https://portroyale.online/farcry.html)
* **Crysis VR**: the 2007 Crysis (not Remastered). Tested on cats-27; the dawn package is still untested. [Release](https://github.com/SgtBilko76/Crysis-VR-WinlatorXR/releases/tag/Beta-0.3) · [Guide](https://portroyale.online/crysis.html)
* **Battlefield 1942 VR** (BFVR): copy the game folder to `Download/BF1942`. The container screen must be 1792×1624. [Release](https://github.com/SgtBilko76/Battlefield-1942-WinlatorXR/releases/tag/quest-beta3) · [Guide](https://portroyale.online/bf1942.html)
* **Red Faction VR**: copy the game folder to `Download/RedFaction`; the GOG `RF.exe` is converted on first start. Needs dawn-33 or newer. [Release](https://github.com/SgtBilko76/alpinefactionVR/releases/tag/quest-v0.2.0-beta) · [Guide](https://portroyale.online/redfaction.html)
* **TrackMania Nations Forever VR**: the easiest one. Import the container image and the free game downloads from Nadeo on first start. Races run at about 30–45 fps. [Release](https://github.com/SgtBilko76/TrackManiaForeverOpenXR/releases/tag/quest-beta-0.2) · [Guide](https://portroyale.online/trackmania.html)

> [!TIP]
> Play with more than 50% battery: the Quest throttles below that, and these games feel it first.',
    troubleshooting_notes = 'Best suited for older DirectX 9 / 10 PC titles on Quest 3 / 3S for optimal performance. For the VR mods, follow the container screen size on each mod''s guide exactly: a wrong size gives a blurry picture or a crash.'
where slug = 'winlatorxr'
  and (installation_guide is distinct from '### Installation
1. Download and install WinlatorXR APK via SideQuest or GitHub Releases.
2. Put game installation folders in your Quest `/sdcard/Download/` directory.
3. Open WinlatorXR, create a new Wine Container with Turnip drivers and DXVK enabled, and run your setup or .exe file.

---

### VR mods that run inside WinlatorXR
These are full VR mods for PC games that run standalone on Quest 3 through WinlatorXR, made by SgtBilko76 (Port Royale). They are not separate apps: each one is a zip you unpack into your own game folder, plus a WinlatorXR container or shortcut profile. All are betas.

> [!NOTE]
> **You need your own copy of each PC game** (Steam, GOG or retail), copied from a PC into `/sdcard/Download/`. Each mod''s page lists the exact container settings (screen size, DXVK, Turnip) and the WinlatorXR build it was tested on: the newer **dawn** line or **cats-27**.

* **Call of Duty 4 VR** (KisakCOD): copy the COD4 folder to `Download/CallOfDuty4`. Physical reloads and a physical scope. Needs dawn-33 or newer. [Release](https://github.com/SgtBilko76/CallOfDuty4_VR/releases/tag/v0.2.0-beta.1) · [Guide](https://portroyale.online/cod4.html)
* **Far Cry VR**: your own Far Cry (2004). Holds a locked 72 fps at 1792×1624 once `FarCry.exe` is patched large-address-aware. [Release](https://github.com/SgtBilko76/Farcry_vrmod-WinlatorXR/releases/tag/quest-beta-0.3) · [Guide](https://portroyale.online/farcry.html)
* **Crysis VR**: the 2007 Crysis (not Remastered). Tested on cats-27; the dawn package is still untested. [Release](https://github.com/SgtBilko76/Crysis-VR-WinlatorXR/releases/tag/Beta-0.3) · [Guide](https://portroyale.online/crysis.html)
* **Battlefield 1942 VR** (BFVR): copy the game folder to `Download/BF1942`. The container screen must be 1792×1624. [Release](https://github.com/SgtBilko76/Battlefield-1942-WinlatorXR/releases/tag/quest-beta3) · [Guide](https://portroyale.online/bf1942.html)
* **Red Faction VR**: copy the game folder to `Download/RedFaction`; the GOG `RF.exe` is converted on first start. Needs dawn-33 or newer. [Release](https://github.com/SgtBilko76/alpinefactionVR/releases/tag/quest-v0.2.0-beta) · [Guide](https://portroyale.online/redfaction.html)
* **TrackMania Nations Forever VR**: the easiest one. Import the container image and the free game downloads from Nadeo on first start. Races run at about 30–45 fps. [Release](https://github.com/SgtBilko76/TrackManiaForeverOpenXR/releases/tag/quest-beta-0.2) · [Guide](https://portroyale.online/trackmania.html)

> [!TIP]
> Play with more than 50% battery: the Quest throttles below that, and these games feel it first.'
    or troubleshooting_notes is distinct from 'Best suited for older DirectX 9 / 10 PC titles on Quest 3 / 3S for optimal performance. For the VR mods, follow the container screen size on each mod''s guide exactly: a wrong size gives a blurry picture or a crash.');
