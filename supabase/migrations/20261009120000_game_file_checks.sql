-- QuestPorts game-file checks. Apply manually in the Supabase SQL editor after Felipe approves.
-- Do not run this from CI or against production from the agent.
-- Idempotent UPDATEs keyed by slug. Code checks live in app/data/portPackageMap.ts
-- and app/data/expansions.ts; this file only updates catalog text and two storage paths.
--
-- Sources for the paths below:
-- RTCWQuest Java creates /sdcard/RTCWQuest/Main and copies a demo pak0.pk3 when missing,
-- plus z_zvr_weapons.pk3, z_vr_assets.pk3, and sp_vpak8.pk3:
-- https://github.com/Team-Beef-Studios/RTCWQuest/blob/master/java/com/drbeef/rtcwquest/GLES3JNIActivity.java
-- README headset path /sdcard/RTCWQuest/Main:
-- https://github.com/Team-Beef-Studios/RTCWQuest/blob/master/README.md
-- Steam installdir "Return to Castle Wolfenstein": https://api.steamcmd.net/v1/info/9010
--
-- QuakeQuest copies shareware pak0.pak into /sdcard/QuakeQuest/id1 when missing:
-- https://github.com/Team-Beef-Studios/QuakeQuest/blob/master/java/com/drbeef/quakequest/GLES3JNIActivity.java
-- README: copy PAK files to QuakeQuest/id1; the APK contains shareware, not the full game:
-- https://github.com/Team-Beef-Studios/QuakeQuest/blob/master/README.md
-- Steam installdir "Quake"; default launch rerelease/Quake_x64_steam.exe; original glquake.exe:
-- https://api.steamcmd.net/v1/info/2310
--
-- Quake2Quest README: copy all .pak files from baseq2 into the Quake2Quest folder
-- (not a baseq2 subfolder). OGG soundtrack goes in Quake2Quest/music.
-- https://github.com/DrBeef/Quake2Quest/blob/master/README.md
-- Steam installdir "Quake 2"; default launch rerelease/quake2ex_steam.exe; original quake2.exe:
-- https://api.steamcmd.net/v1/info/2320
--
-- Doom3Quest site lists game00–game03.pk4 and pak000–pak008.pk4 from base/ to /Doom3Quest/base,
-- and says BFG is not compatible. README: THIS PORT WILL NOT RUN WITH THE BFG EDITION.
-- https://www.doom3quest.com/
-- https://github.com/DrBeef/Doom3Quest/blob/master/README.md
-- Steam installdir "Doom 3" (app 9050) vs "DOOM 3 BFG Edition" (app 208200):
-- https://api.steamcmd.net/v1/info/9050
-- https://api.steamcmd.net/v1/info/208200
--
-- PreyVR README: first launch creates preyvr/preybase; copy all PK4 from prey/base:
-- https://github.com/lvonasek/PreyVR/blob/master/README.md
--
-- Lambda1VR README: Half-Life: Source is not compatible; copy valve into xash/valve;
-- restart after file changes; optional valve_hd (Mac caveat):
-- https://github.com/Team-Beef-Studios/Lambda1VR/blob/master/README.md
-- hl-paker packs a Steam valve folder (base_folder valve) and, as of 2025-04-04, says the
-- 25th anniversary update broke Lambda1VR:
-- https://github.com/ryan-cranfill/hl-paker/blob/master/README.md
-- https://github.com/ryan-cranfill/hl-paker/blob/master/presets.py
-- Steam installdir "Half-Life", gamedir valve; steam_legacy description "Pre-25th Anniversary Build":
-- https://api.steamcmd.net/v1/info/70

begin;

update public.ports
   set internal_storage_path = '/sdcard/Quake2Quest/'
 where slug = 'quake2quest'
   and internal_storage_path is distinct from '/sdcard/Quake2Quest/';

update public.ports
   set internal_storage_path = '/sdcard/RTCWQuest/Main/'
 where slug = 'rtcwquest'
   and lower(internal_storage_path) = '/sdcard/rtcwquest/main/';

update public.ports
   set installation_guide = $guide$### Prerequisites
* A legally owned copy of *Return to Castle Wolfenstein* (Steam or GOG).
* Meta Quest headset with Developer Mode enabled or the SideQuest app (Desktop or Android).

### Step-by-Step Installation
1. Install the **RTCWQuest** APK using SideQuest or run `adb install rtcwquest.apk`.
2. Launch RTCWQuest once inside your headset. The app creates `/sdcard/RTCWQuest/Main/` and, when `pak0.pk3` is missing, copies a demo `pak0.pk3` into it. Exit before you copy the full game.
3. On your computer, open the full game Main folder. On Steam that is `steamapps/common/Return to Castle Wolfenstein/Main/` (install folder `Return to Castle Wolfenstein`).
4. Copy the full-game pk3 set:
   * `pak0.pk3`
   * `sp_pak1.pk3`
   * `sp_pak2.pk3`
   * `sp_pak3.pk3`
   * `sp_pak4.pk3`
5. Connect your Quest to your PC via USB and copy these files into:
   `/sdcard/RTCWQuest/Main/`
6. Put on your headset and launch RTCWQuest from the "Unknown Sources" library tab.

The demo `pak0.pk3`, plus the VR files the app also copies (`z_vr_assets.pk3`, `z_zvr_weapons.pk3`, and `sp_vpak8.pk3`), does not count as the full game. The check counts the game as installed only when `pak0.pk3` and `sp_pak1.pk3` through `sp_pak4.pk3` are all present.$guide$,
       troubleshooting_notes = $notes$If the game crashes on startup, ensure that all .pk3 file extensions are in lowercase on the Quest storage. pak0.pk3 alone is the demo the app copies on first launch. The full game also needs sp_pak1.pk3 through sp_pak4.pk3.$notes$
 where slug = 'rtcwquest'
   and (installation_guide is distinct from $guide$### Prerequisites
* A legally owned copy of *Return to Castle Wolfenstein* (Steam or GOG).
* Meta Quest headset with Developer Mode enabled or the SideQuest app (Desktop or Android).

### Step-by-Step Installation
1. Install the **RTCWQuest** APK using SideQuest or run `adb install rtcwquest.apk`.
2. Launch RTCWQuest once inside your headset. The app creates `/sdcard/RTCWQuest/Main/` and, when `pak0.pk3` is missing, copies a demo `pak0.pk3` into it. Exit before you copy the full game.
3. On your computer, open the full game Main folder. On Steam that is `steamapps/common/Return to Castle Wolfenstein/Main/` (install folder `Return to Castle Wolfenstein`).
4. Copy the full-game pk3 set:
   * `pak0.pk3`
   * `sp_pak1.pk3`
   * `sp_pak2.pk3`
   * `sp_pak3.pk3`
   * `sp_pak4.pk3`
5. Connect your Quest to your PC via USB and copy these files into:
   `/sdcard/RTCWQuest/Main/`
6. Put on your headset and launch RTCWQuest from the "Unknown Sources" library tab.

The demo `pak0.pk3`, plus the VR files the app also copies (`z_vr_assets.pk3`, `z_zvr_weapons.pk3`, and `sp_vpak8.pk3`), does not count as the full game. The check counts the game as installed only when `pak0.pk3` and `sp_pak1.pk3` through `sp_pak4.pk3` are all present.$guide$
        or troubleshooting_notes is distinct from $notes$If the game crashes on startup, ensure that all .pk3 file extensions are in lowercase on the Quest storage. pak0.pk3 alone is the demo the app copies on first launch. The full game also needs sp_pak1.pk3 through sp_pak4.pk3.$notes$);

update public.ports
   set installation_guide = $guide$### Prerequisites
* Original Half-Life on Steam. Half-Life: Source is not compatible.
* Lambda1VR launcher installed via SideQuest.

### Step-by-Step Installation
1. Install **Lambda1VR** through SideQuest.
2. Launch the app once on the headset so it generates the `/sdcard/xash/` directory structure, then exit.
3. On your PC, open the Steam Half-Life `valve` folder: `steamapps/common/Half-Life/valve/` (install folder `Half-Life`). The Lambda1VR README example writes this as `steamApps/common/HalfLife/`.
4. Copy the contents of the `valve` folder. A Steam install is loose files, including `liblist.gam`. It does not include the old WON `pak0.pak`.
5. Paste the copied files into `/sdcard/xash/valve/` on your Meta Quest. Copying the whole folder takes a long time.
6. Restart the Quest, then launch Lambda1VR from "Unknown Sources".

Optional HD models are the `valve_hd` folder from the Lambda1VR README. On a Mac that folder can be hidden; follow the README Mac note or the game can crash.

Note: as of 2025-04-04, the hl-paker README says the Half-Life 25th anniversary update broke Lambda1VR and to downgrade. Steam lists a `steam_legacy` beta described as "Pre-25th Anniversary Build" (Properties, Betas). Whether the current public build still fails has not been retested on a headset.$guide$,
       troubleshooting_notes = $notes$Restart the Quest after copying files into /sdcard/xash/valve/. If the 25th anniversary update still breaks the port, switch the Steam Half-Life install to the steam_legacy beta and copy that valve folder. Optional HD content is valve_hd; on Mac that folder can be hidden.$notes$
 where slug = 'lambda1vr'
   and installation_guide is distinct from $guide$### Prerequisites
* Original Half-Life on Steam. Half-Life: Source is not compatible.
* Lambda1VR launcher installed via SideQuest.

### Step-by-Step Installation
1. Install **Lambda1VR** through SideQuest.
2. Launch the app once on the headset so it generates the `/sdcard/xash/` directory structure, then exit.
3. On your PC, open the Steam Half-Life `valve` folder: `steamapps/common/Half-Life/valve/` (install folder `Half-Life`). The Lambda1VR README example writes this as `steamApps/common/HalfLife/`.
4. Copy the contents of the `valve` folder. A Steam install is loose files, including `liblist.gam`. It does not include the old WON `pak0.pak`.
5. Paste the copied files into `/sdcard/xash/valve/` on your Meta Quest. Copying the whole folder takes a long time.
6. Restart the Quest, then launch Lambda1VR from "Unknown Sources".

Optional HD models are the `valve_hd` folder from the Lambda1VR README. On a Mac that folder can be hidden; follow the README Mac note or the game can crash.

Note: as of 2025-04-04, the hl-paker README says the Half-Life 25th anniversary update broke Lambda1VR and to downgrade. Steam lists a `steam_legacy` beta described as "Pre-25th Anniversary Build" (Properties, Betas). Whether the current public build still fails has not been retested on a headset.$guide$;

update public.ports
   set installation_guide = $guide$### Prerequisites
* **Original 2004 Doom 3**. Doom 3: BFG Edition does **not** work.
* SideQuest or ADB installed on your computer.

### Step-by-Step Installation
1. Install the Doom3Quest APK launcher via SideQuest.
2. Launch the app once so it creates the Doom3Quest folders, then exit. Connect your Quest and open `/sdcard/Doom3Quest/base/`.
3. From the original 2004 Doom 3 `base` folder, copy both sets of pk4 files:
   * `game00.pk4` through `game03.pk4`
   * `pak000.pk4` through `pak008.pk4`
   Steam install folder for the original game is `Doom 3` (`steamapps/common/Doom 3/base/`). The Doom3Quest site example writes this as `steamApps/common/Doom3/`. Do not use the install folder `DOOM 3 BFG Edition`.
4. Paste those pk4 files into `/sdcard/Doom3Quest/base/`.
5. Launch Doom3Quest on your headset.

The port copies its own `pak399.pk4` into base. That file does not replace `game00.pk4` through `game03.pk4` or `pak000.pk4` through `pak008.pk4`.$guide$,
       troubleshooting_notes = $notes$Doom 3: BFG Edition does not work with this port. The original base folder must include game00.pk4 through game03.pk4 and pak000.pk4 through pak008.pk4.$notes$
 where slug = 'doom3quest'
   and installation_guide is distinct from $guide$### Prerequisites
* **Original 2004 Doom 3**. Doom 3: BFG Edition does **not** work.
* SideQuest or ADB installed on your computer.

### Step-by-Step Installation
1. Install the Doom3Quest APK launcher via SideQuest.
2. Launch the app once so it creates the Doom3Quest folders, then exit. Connect your Quest and open `/sdcard/Doom3Quest/base/`.
3. From the original 2004 Doom 3 `base` folder, copy both sets of pk4 files:
   * `game00.pk4` through `game03.pk4`
   * `pak000.pk4` through `pak008.pk4`
   Steam install folder for the original game is `Doom 3` (`steamapps/common/Doom 3/base/`). The Doom3Quest site example writes this as `steamApps/common/Doom3/`. Do not use the install folder `DOOM 3 BFG Edition`.
4. Paste those pk4 files into `/sdcard/Doom3Quest/base/`.
5. Launch Doom3Quest on your headset.

The port copies its own `pak399.pk4` into base. That file does not replace `game00.pk4` through `game03.pk4` or `pak000.pk4` through `pak008.pk4`.$guide$;

update public.ports
   set installation_guide = $guide$### Step-by-Step Installation
1. Install Quake II Quest via SideQuest.
2. Launch the app once, then exit. The first launch creates `/sdcard/Quake2Quest/` and, when they are missing, copies a shareware `pak0.pak` plus `pak6.pak` and `pak99.pak` into that folder.
3. On your PC, open the original Quake 2 install. On Steam the folder is `steamapps/common/Quake 2/` (install folder `Quake 2`, not `Quake II`).
4. From the original `baseq2` folder, copy `pak0.pak`, `pak1.pak`, and `pak2.pak`. Do not copy files from the `rerelease` folder. The Steam default launch executable is `rerelease/quake2ex_steam.exe`; the original game is `quake2.exe`.
5. Paste those three pak files into `/sdcard/Quake2Quest/` on your Meta Quest (the Quake2Quest folder itself, not a baseq2 subfolder).

The full game is present only when `pak0.pak`, `pak1.pak`, and `pak2.pak` are all in that folder. `pak0.pak`, `pak6.pak`, and `pak99.pak` are files the app can copy; they are not the full game.$guide$,
       troubleshooting_notes = $notes$Original soundtrack OGG files go in /sdcard/Quake2Quest/music/. Do not use the rerelease folder. pak0.pak, pak6.pak, and pak99.pak can be copied by the app; the full game also needs pak1.pak and pak2.pak.$notes$
 where slug = 'quake2quest'
   and installation_guide is distinct from $guide$### Step-by-Step Installation
1. Install Quake II Quest via SideQuest.
2. Launch the app once, then exit. The first launch creates `/sdcard/Quake2Quest/` and, when they are missing, copies a shareware `pak0.pak` plus `pak6.pak` and `pak99.pak` into that folder.
3. On your PC, open the original Quake 2 install. On Steam the folder is `steamapps/common/Quake 2/` (install folder `Quake 2`, not `Quake II`).
4. From the original `baseq2` folder, copy `pak0.pak`, `pak1.pak`, and `pak2.pak`. Do not copy files from the `rerelease` folder. The Steam default launch executable is `rerelease/quake2ex_steam.exe`; the original game is `quake2.exe`.
5. Paste those three pak files into `/sdcard/Quake2Quest/` on your Meta Quest (the Quake2Quest folder itself, not a baseq2 subfolder).

The full game is present only when `pak0.pak`, `pak1.pak`, and `pak2.pak` are all in that folder. `pak0.pak`, `pak6.pak`, and `pak99.pak` are files the app can copy; they are not the full game.$guide$;

update public.ports
   set installation_guide = $guide$### Installation
1. Install the APK from GitHub or SideQuest.
2. Open Prey VR once on the headset so the app creates `preyvr/preybase`, then exit.
3. Copy all `.pk4` files from your original Prey (2006) PC `prey/base` folder into `/sdcard/preyvr/preybase/`.
4. Launch the game from Unknown Sources.$guide$
 where slug = 'preyvr'
   and installation_guide is distinct from $guide$### Installation
1. Install the APK from GitHub or SideQuest.
2. Open Prey VR once on the headset so the app creates `preyvr/preybase`, then exit.
3. Copy all `.pk4` files from your original Prey (2006) PC `prey/base` folder into `/sdcard/preyvr/preybase/`.
4. Launch the game from Unknown Sources.$guide$;

update public.ports
   set installation_guide = $guide$### Prerequisites
* A legally owned copy of the original Quake (Steam, GOG, or Bethesda). Use the original id1 pak files, not the rerelease folder.
* Meta Quest headset with Developer Mode enabled or SideQuest.

### Step-by-Step Installation
1. Install **QuakeQuest** APK using SideQuest.
2. Launch QuakeQuest once inside your headset so it can create `QuakeQuest/id1`, then exit. The APK includes the shareware game, and the first launch copies a shareware `pak0.pak` when that file is missing.
3. On your computer, open the original id1 folder. On Steam that is `steamapps/common/Quake/id1/` (install folder `Quake`). The original launch executable is `glquake.exe`. Do not copy files from the `rerelease` folder (the default Steam launch executable is `rerelease/Quake_x64_steam.exe`).
4. Copy the original `pak0.pak` and `pak1.pak` into `/sdcard/QuakeQuest/id1/` on your Quest.
5. Put on your headset and launch QuakeQuest from "Unknown Sources".

`pak0.pak` by itself is the shareware data. The full game is present only when `pak1.pak` is there too.$guide$,
       troubleshooting_notes = $notes$Ensure pak file names are lowercase (pak0.pak, pak1.pak). pak0.pak alone is the shareware file the app can copy on first launch; the full game also needs pak1.pak. Add soundtrack in OGG format under /sdcard/QuakeQuest/id1/sound/cdtracks/ for classic atmospheric music.$notes$
 where slug = 'quakequest'
   and installation_guide is distinct from $guide$### Prerequisites
* A legally owned copy of the original Quake (Steam, GOG, or Bethesda). Use the original id1 pak files, not the rerelease folder.
* Meta Quest headset with Developer Mode enabled or SideQuest.

### Step-by-Step Installation
1. Install **QuakeQuest** APK using SideQuest.
2. Launch QuakeQuest once inside your headset so it can create `QuakeQuest/id1`, then exit. The APK includes the shareware game, and the first launch copies a shareware `pak0.pak` when that file is missing.
3. On your computer, open the original id1 folder. On Steam that is `steamapps/common/Quake/id1/` (install folder `Quake`). The original launch executable is `glquake.exe`. Do not copy files from the `rerelease` folder (the default Steam launch executable is `rerelease/Quake_x64_steam.exe`).
4. Copy the original `pak0.pak` and `pak1.pak` into `/sdcard/QuakeQuest/id1/` on your Quest.
5. Put on your headset and launch QuakeQuest from "Unknown Sources".

`pak0.pak` by itself is the shareware data. The full game is present only when `pak1.pak` is there too.$guide$;

commit;
