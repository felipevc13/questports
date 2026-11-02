-- Code: Veronica X guide: say it is the full PS2 game, not the Survivor 2 arcade
-- light-gun spin-off that already has its own page. Same text as mockPorts.ts.
--
-- Apply manually in the Supabase SQL editor after merge.

update public.ports
set installation_guide = '### Overview
**Resident Evil Code: Veronica X VR** runs Capcom''s 2001 survival horror game natively on Meta Quest, with no PC. It is built on aikatore''s recompiled PC port (recvx-enhanced-recomp) and AshfordFamily''s recvx-decomp decompilation, with a VR mode by NETO: tracked hands, aiming with the gun in your hand, a knife on a free hand, and physical reloads from the ammo at your belt.

This is the full Code: Veronica X adventure (exploration, puzzles, inventory, Claire and Chris''s story). It is not **Resident Evil Survivor 2: Code Veronica**, the arcade light-gun shooter, which has its own page on QuestPorts.

> [!NOTE]
> **No game files included.** You need your own `.iso` of the PS2 version, NTSC-U, **SLUS-20184**.

---

### Prerequisites
* Meta Quest 2 (tested) or Quest 3 / 3S (declared supported, not yet tested by the author).
* Your own Code: Veronica X PS2 disc image (NTSC-U, SLUS-20184).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `RE-Code-Veronica-X-VR-v1.4.3.apk` from GitHub Releases.
2. Put your `.iso` on the headset, for example in `/sdcard/Download/`.
3. Open the app from **Library → Unknown Sources**. The first time, allow access to all files (it only reads your disc image and optional textures).
4. In the launcher: **Disc** → pick your `.iso`, then **Play**. In **Settings**, use 2× resolution on Quest 2 and 3× on Quest 3.

---

### Controls
* **Left stick** walks (click while walking forward to run). **Right stick** turns.
* **Right grip + right trigger** aim and fire. **Left grip at the gun** holds it with both hands.
* **Reload:** **B** drops the magazine, take a box at your belt with the **left grip**, bring it to the gun.
* **Left grip with a free left hand** is the knife. **A** is action, **Y** the inventory, **X** the map.

> [!TIP]
> An optional HD texture pack (a single `.pack` file) goes in the folder you choose in the launcher''s **Textures** tab. Small stutters can happen when entering rooms with HD textures.'
where slug = 're-code-veronica-x-vr'
  and installation_guide is distinct from '### Overview
**Resident Evil Code: Veronica X VR** runs Capcom''s 2001 survival horror game natively on Meta Quest, with no PC. It is built on aikatore''s recompiled PC port (recvx-enhanced-recomp) and AshfordFamily''s recvx-decomp decompilation, with a VR mode by NETO: tracked hands, aiming with the gun in your hand, a knife on a free hand, and physical reloads from the ammo at your belt.

This is the full Code: Veronica X adventure (exploration, puzzles, inventory, Claire and Chris''s story). It is not **Resident Evil Survivor 2: Code Veronica**, the arcade light-gun shooter, which has its own page on QuestPorts.

> [!NOTE]
> **No game files included.** You need your own `.iso` of the PS2 version, NTSC-U, **SLUS-20184**.

---

### Prerequisites
* Meta Quest 2 (tested) or Quest 3 / 3S (declared supported, not yet tested by the author).
* Your own Code: Veronica X PS2 disc image (NTSC-U, SLUS-20184).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or download `RE-Code-Veronica-X-VR-v1.4.3.apk` from GitHub Releases.
2. Put your `.iso` on the headset, for example in `/sdcard/Download/`.
3. Open the app from **Library → Unknown Sources**. The first time, allow access to all files (it only reads your disc image and optional textures).
4. In the launcher: **Disc** → pick your `.iso`, then **Play**. In **Settings**, use 2× resolution on Quest 2 and 3× on Quest 3.

---

### Controls
* **Left stick** walks (click while walking forward to run). **Right stick** turns.
* **Right grip + right trigger** aim and fire. **Left grip at the gun** holds it with both hands.
* **Reload:** **B** drops the magazine, take a box at your belt with the **left grip**, bring it to the gun.
* **Left grip with a free left hand** is the knife. **A** is action, **Y** the inventory, **X** the map.

> [!TIP]
> An optional HD texture pack (a single `.pack` file) goes in the folder you choose in the launcher''s **Textures** tab. Small stutters can happen when entering rooms with HD textures.';
