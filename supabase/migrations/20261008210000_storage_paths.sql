-- QuestPorts storage paths. Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.
-- Idempotent UPDATEs keyed by slug. Includes the 2026-10-08 path draft plus
-- time-crisis-vr, which the app now treats as a self-contained APK.

begin;

-- ===== Visible on the page today (fallback slugs) =====

-- avp-vr: README step 9 + build.gradle.kts applicationId com.bassquake.quest.avpvr
-- https://github.com/Bassquake/Aliens-Versus-Predator-VR#step-by-step-for-quest-standalone
-- (DB value was right in substance; this only adds /sdcard/ and the trailing slash so the
--  drag-and-drop push target is an absolute path.)
update public.ports set internal_storage_path = '/sdcard/Android/data/com.bassquake.quest.avpvr/files/'
 where slug = 'avp-vr' and internal_storage_path is distinct from '/sdcard/Android/data/com.bassquake.quest.avpvr/files/';

-- gothic2-vr: INSTALL.md "File locations" (app id com.gothic2vr.quest, imported game in Gothic2/)
-- https://github.com/dubrovskiy-yevhen-stakelogic/gothic2-vr/blob/HEAD/INSTALL.md
update public.ports set internal_storage_path = '/sdcard/Android/data/com.gothic2vr.quest/files/Gothic2/'
 where slug = 'gothic2-vr' and internal_storage_path is distinct from '/sdcard/Android/data/com.gothic2vr.quest/files/Gothic2/';

-- harry-potter-vr: tools/release/PLAYER-INSTALL.md + android/app/build.gradle (io.github.hpvr.quest)
-- https://github.com/dubrovskiy-yevhen-stakelogic/harry-potter-vr/blob/HEAD/tools/release/PLAYER-INSTALL.md
update public.ports set internal_storage_path = '/sdcard/Android/data/io.github.hpvr.quest/files/HP/'
 where slug = 'harry-potter-vr' and internal_storage_path is distinct from '/sdcard/Android/data/io.github.hpvr.quest/files/HP/';

-- vice-city-vr-quest: overlay/docs/QUEST_PORT.md (package com.miamivr.quest, data in files/gamedata/)
-- https://github.com/dubrovskiy-yevhen-stakelogic/vice-city-vr-quest/blob/HEAD/overlay/docs/QUEST_PORT.md
update public.ports set internal_storage_path = '/sdcard/Android/data/com.miamivr.quest/files/gamedata/'
 where slug = 'vice-city-vr-quest' and internal_storage_path is distinct from '/sdcard/Android/data/com.miamivr.quest/files/gamedata/';

-- gta-sa-vr-quest: tools/build-and-install.sh (audio + vrhands -> app files dir; data_main -> /sdcard/savr/data_main)
-- https://github.com/dubrovskiy-yevhen-stakelogic/gta-sa-vr-quest/blob/HEAD/tools/build-and-install.sh
update public.ports set internal_storage_path = '/sdcard/Android/data/com.rockstargames.gtasa/files/'
 where slug = 'gta-sa-vr-quest' and internal_storage_path is distinct from '/sdcard/Android/data/com.rockstargames.gtasa/files/';

update public.ports
   set installation_guide = replace(installation_guide,
     $old$The installer will patch the binaries and push the assets to `Android/data/com.rockstargames.gtasa/files`.$old$,
     $new$The installer will patch the binaries, push the game data to `/sdcard/savr/data_main/` and the audio to `/sdcard/Android/data/com.rockstargames.gtasa/files/audio/`.$new$)
 where slug = 'gta-sa-vr-quest'
   and position($old$The installer will patch the binaries and push the assets to `Android/data/com.rockstargames.gtasa/files`.$old$ in installation_guide) > 0;

-- galaxyquest: tools/push_data.py (DEST = /sdcard/Android/data/com.galaxy.quest/files/game) + README steps 6-7
-- https://github.com/bigmak94/GalaxyQuest/blob/HEAD/tools/push_data.py
update public.ports set internal_storage_path = '/sdcard/Android/data/com.galaxy.quest/files/game/'
 where slug = 'galaxyquest' and internal_storage_path is distinct from '/sdcard/Android/data/com.galaxy.quest/files/game/';

update public.ports
   set installation_guide = replace(installation_guide,
     $old$4. Run the cook script with Python:
   ```bash
   python tools/cook/cook.py --disc /path/to/extracted/disc --out /path/to/output
   ```
5. Push the converted files to `/sdcard/GalaxyQuest/` on your headset:
   ```bash
   adb push output/* /sdcard/GalaxyQuest/
   ```
$old$,
     $new$4. Run the cook script with Python (from the unzipped `GalaxyQuest-converter` folder):
   ```bash
   python tools/cook/cook.py extracted cooked --with-movies
   ```
5. Copy the converted files to the headset. The script unpacks them into `/sdcard/Android/data/com.galaxy.quest/files/game/`:
   ```bash
   python tools/push_data.py cooked
   ```
   Without adb, copy the `cooked` folder to the headset (for example into `Download`) and pick it on the app's setup screen.
$new$)
 where slug = 'galaxyquest'
   and position('adb push output/* /sdcard/GalaxyQuest/' in installation_guide) > 0;

-- time-crisis-vr: README "Download and install": the release APK bundles the ROM set; no files to copy.
-- https://github.com/DR-89/time-crisis-vr#download-and-install
-- The code now treats this port as a plain install, so the page no longer uses this column as a drop folder.
update public.ports set internal_storage_path = 'N/A (ROM set bundled in the release APK)'
 where slug = 'time-crisis-vr' and internal_storage_path is distinct from 'N/A (ROM set bundled in the release APK)';

-- ===== Consistency only (page shows the path from expansions.ts, not this column) =====

-- road-rash-jailbreak-vr: docs/QUEST.md + scripts/install-quest-player.ps1 (disc.bin in com.rrjb.vr files)
-- https://github.com/dubrovskiy-yevhen-stakelogic/road-rash-jailbreak/blob/HEAD/docs/QUEST.md
-- expansions.ts now shows this same files/ directory (disc.bin, or the first .bin/.img).
update public.ports set internal_storage_path = '/sdcard/Android/data/com.rrjb.vr/files/'
 where slug = 'road-rash-jailbreak-vr' and internal_storage_path is distinct from '/sdcard/Android/data/com.rrjb.vr/files/';

-- halocequest: LauncherActivity.baseRoot() = /sdcard/Documents/HaloCE (Download/HaloCE is only the log folder)
-- https://github.com/moistman42069/HaloCE-Quest-VR/blob/HEAD/port/android/app/src/main/java/com/halo/decomp/LauncherActivity.java
update public.ports set internal_storage_path = '/sdcard/Documents/HaloCE/'
 where slug = 'halocequest' and internal_storage_path is distinct from '/sdcard/Documents/HaloCE/';

-- goldeneye-vr: launcher copies the ROM to files/data/ge.z64 (verified in PR #5; README: pick ROM from Download)
-- https://github.com/MrSco/goldeneye-vr
update public.ports set internal_storage_path = '/sdcard/Android/data/com.gevr.port/files/data/'
 where slug = 'goldeneye-vr' and internal_storage_path is distinct from '/sdcard/Android/data/com.gevr.port/files/data/';

-- perfect-dark-vr: ROM must be data/pd.ntsc-final.z64 (README); /sdcard/Download is only where Select ROM starts
-- https://github.com/Alex-LeTux/perfect_dark_VR
update public.ports set internal_storage_path = '/sdcard/Android/data/com.perfectdark.port/files/data/'
 where slug = 'perfect-dark-vr' and internal_storage_path is distinct from '/sdcard/Android/data/com.perfectdark.port/files/data/';

-- gran-turismo-2-vr: path already right; adds /sdcard/ + trailing slash (docs/QUEST.md)
-- https://github.com/dubrovskiy-yevhen-stakelogic/gt-2-pc/blob/HEAD/docs/QUEST.md
update public.ports set internal_storage_path = '/sdcard/Android/data/io.github.gt2pc.quest/files/'
 where slug = 'gran-turismo-2-vr' and internal_storage_path is distinct from '/sdcard/Android/data/io.github.gt2pc.quest/files/';

-- astroquest: README - the app finds the dump in files/games/CUSA12392 (code checks files/games/)
-- https://github.com/bigmak94/AstroQuest
update public.ports set internal_storage_path = '/sdcard/Android/data/com.astrobotquest.vrhost/files/games/'
 where slug = 'astroquest' and internal_storage_path is distinct from '/sdcard/Android/data/com.astrobotquest.vrhost/files/games/';

commit;

-- Verify afterwards:
-- select slug, internal_storage_path from public.ports
--  where slug in ('avp-vr','gothic2-vr','harry-potter-vr','vice-city-vr-quest','gta-sa-vr-quest','galaxyquest',
--                 'time-crisis-vr','road-rash-jailbreak-vr','halocequest','goldeneye-vr','perfect-dark-vr','gran-turismo-2-vr','astroquest')
--  order by slug;
