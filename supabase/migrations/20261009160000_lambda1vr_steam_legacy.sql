-- Lambda1VR: make the Steam steam_legacy beta the default copy step.
-- Apply manually in the Supabase SQL editor after Felipe approves.
-- Do not run this from CI or against production from the agent.
-- Idempotent UPDATE keyed by slug. Code checks live in app/data/portPackageMap.ts
-- and app/data/expansions.ts; this file only updates catalog text.
--
-- GLES3JNIActivity copies into /sdcard/xash/valve/ (game defaults to "valve"):
-- https://github.com/Team-Beef-Studios/Lambda1VR/blob/master/java/com/drbeef/lambda1vr/GLES3JNIActivity.java
-- hl-paker README, as of 2025-04-04, says the Half-Life 25th anniversary update
-- broke Lambda1VR and to downgrade:
-- https://github.com/ryan-cranfill/hl-paker/blob/master/README.md
-- Steam beta steam_legacy is described as "Pre-25th Anniversary Build":
-- https://api.steamcmd.net/v1/info/70
-- The current public build is also reported broken in the r/TeamBeef pinned post.

begin;

update public.ports
   set installation_guide = $guide$### Prerequisites
* Original Half-Life on Steam. Half-Life: Source is not compatible.
* Lambda1VR launcher installed via SideQuest.

### Step-by-Step Installation
1. Install **Lambda1VR** through SideQuest.
2. Launch the app once on the headset so it generates the `/sdcard/xash/` directory structure, then exit.
3. In Steam, open Half-Life, then Properties, then Betas, and select `steam_legacy` ("Pre-25th Anniversary Build"). Let Steam finish the update before copying files. The current public build is reported broken for Lambda1VR (hl-paker README, 2025-04-04; r/TeamBeef pinned post).
4. On your PC, open the updated `valve` folder: `steamapps/common/Half-Life/valve/` (install folder `Half-Life`). The Lambda1VR README example writes this as `steamApps/common/HalfLife/`.
5. Copy the contents of the `valve` folder. A Steam install is loose files, including `liblist.gam`. It does not include the old WON `pak0.pak`.
6. Paste the copied files into `/sdcard/xash/valve/` on your Meta Quest. Copying the whole folder takes a long time.
7. Restart the Quest, then launch Lambda1VR from "Unknown Sources".

Optional HD models are the `valve_hd` folder from that same `steam_legacy` install. On a Mac that folder can be hidden; follow the Lambda1VR README Mac note or the game can crash.$guide$,
       troubleshooting_notes = $notes$Restart the Quest after copying files into /sdcard/xash/valve/. Select the Steam steam_legacy beta ("Pre-25th Anniversary Build") under Half-Life Properties, Betas, and let it update before you copy the valve folder. The current public build is reported broken (hl-paker README, 2025-04-04; r/TeamBeef pinned post). Optional HD content is valve_hd; on Mac that folder can be hidden.$notes$
 where slug = 'lambda1vr'
   and (
     installation_guide is distinct from $guide$### Prerequisites
* Original Half-Life on Steam. Half-Life: Source is not compatible.
* Lambda1VR launcher installed via SideQuest.

### Step-by-Step Installation
1. Install **Lambda1VR** through SideQuest.
2. Launch the app once on the headset so it generates the `/sdcard/xash/` directory structure, then exit.
3. In Steam, open Half-Life, then Properties, then Betas, and select `steam_legacy` ("Pre-25th Anniversary Build"). Let Steam finish the update before copying files. The current public build is reported broken for Lambda1VR (hl-paker README, 2025-04-04; r/TeamBeef pinned post).
4. On your PC, open the updated `valve` folder: `steamapps/common/Half-Life/valve/` (install folder `Half-Life`). The Lambda1VR README example writes this as `steamApps/common/HalfLife/`.
5. Copy the contents of the `valve` folder. A Steam install is loose files, including `liblist.gam`. It does not include the old WON `pak0.pak`.
6. Paste the copied files into `/sdcard/xash/valve/` on your Meta Quest. Copying the whole folder takes a long time.
7. Restart the Quest, then launch Lambda1VR from "Unknown Sources".

Optional HD models are the `valve_hd` folder from that same `steam_legacy` install. On a Mac that folder can be hidden; follow the Lambda1VR README Mac note or the game can crash.$guide$
     or troubleshooting_notes is distinct from $notes$Restart the Quest after copying files into /sdcard/xash/valve/. Select the Steam steam_legacy beta ("Pre-25th Anniversary Build") under Half-Life Properties, Betas, and let it update before you copy the valve folder. The current public build is reported broken (hl-paker README, 2025-04-04; r/TeamBeef pinned post). Optional HD content is valve_hd; on Mac that folder can be hidden.$notes$
   );

commit;
