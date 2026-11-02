-- Add five ports from site requests: Pikmin VR and Pikmin 2 VR (Project Honeydew, hosted on
-- projecthoneydew.com, manual download, not release-synced), Outlaws VR, Star Wars Arcade VR
-- (Atari 1983) and Ultima IV VR (ANKH-VR). Package ids were read from the APKs (Outlaws from its Android config).
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
  'pikmin-vr',
  'Pikmin VR (Project Honeydew)',
  'Project Honeydew',
  'https://projecthoneydew.com/honeydew1',
  'Pikmin (GameCube) in VR at Pikmin height, on the projectPiki decompilation: pluck and throw Pikmin with your own hands, solo or online co-op. Free fan mod with an experimental Quest 3 build. Bring your own disc.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/pikmin-vr.jpg',
  'AsJ8L9qx7MQ',
  array['Quest 3', 'Quest 3S'],
  array['Smooth Locomotion', 'Roomscale', 'Hand Tracking (pluck and throw)'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Pikmin_(video_game)',
  'Requires your own copy (Pikmin GameCube disc image, USA Rev 1)',
  'https://projecthoneydew.com/honeydew1#install-quest',
  'Project Honeydew site (manual)',
  null,
  'v0.3.1',
  '2026-10-28T00:00:00Z',
  false,
  '### Overview
**Project Honeydew** is a free, unofficial VR mod for Pikmin (GameCube). You stand in the world at Pikmin height: pluck Pikmin from the ground with your hands, throw them with a real swing, and play solo or in two-player online co-op. It is built on the projectPiki decompilation and the Open Nectar PC port. The Meta Quest build runs on the headset itself, with no PC, and is marked experimental.

> [!NOTE]
> **No game files included.** You need your own Pikmin disc image (GameCube, **USA, Rev 1**) as a plain `.iso` or `.gcm`. Convert RVZ, WIA or GCZ images to ISO first, for example with Dolphin on a PC.

> [!NOTE]
> **Download from the project''s site.** The APK is hosted on projecthoneydew.com, not GitHub, so QuestPorts has no 1-click install for it.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own Pikmin (USA, Rev 1) disc image.
* About 2.5 GB free.

---

### Step-by-Step Installation
1. Download `ProjectHoneydew-0.3.1-quest.apk` from the [Project Honeydew site](https://projecthoneydew.com/honeydew1#install-quest).
2. Install it with SideQuest or `adb install ProjectHoneydew-0.3.1-quest.apk`.
3. Copy your disc image to the Quest''s `Download` folder over USB.
4. Open **Project Honeydew** from **Library → Unknown Sources**, pick your disc image when asked, and wait for the one-time import. Afterwards you can delete the image from Download.

> [!TIP]
> Busy scenes run at about 50-55 fps on the Quest, and voice chat is not available on Quest yet. Uninstalling the app deletes its saves.',
  'Use a plain .iso or .gcm of the USA Rev 1 disc. RVZ, WIA and GCZ images must be converted to ISO first. If you have a gaming PC, the project says its Windows version over Link is the most tested.'
),
(
  'pikmin-2-vr',
  'Pikmin 2 VR (Project Honeydew 2)',
  'Project Honeydew',
  'https://projecthoneydew.com/',
  'Pikmin 2 (GameCube) in VR at the captains'' height: pluck, grab and throw with your own hands and lead your Pikmin into the caves. Free fan mod, early preview with a Quest 3 build. Bring your own disc.',
  'decompilation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/pikmin-2-vr.jpg',
  'iCjkQ6TGWt0',
  array['Quest 3', 'Quest 3S'],
  array['Smooth Locomotion', 'Roomscale', 'Hand Tracking (pluck and throw)'],
  true,
  '/sdcard/Download/',
  'https://en.wikipedia.org/wiki/Pikmin_2',
  'Requires your own copy (Pikmin 2 GameCube disc image, USA GPVE01 or Europe GPVP01)',
  'https://projecthoneydew.com/#honeydew2-install-quest',
  'Project Honeydew site (manual)',
  null,
  'v0.1.0',
  null,
  false,
  '### Overview
**Project Honeydew 2** is a free, unofficial VR mod for Pikmin 2 (GameCube), from the makers of Project Honeydew. You stand in the world as Captain Olimar and Louie, at their size: pluck Pikmin with your hands, throw them with a real swing, and lead them down into the caves. It is a 0.1.0 preview; the Meta Quest build runs on the headset itself, with no PC.

> [!NOTE]
> **No game files included.** You need your own Pikmin 2 disc image: USA (**GPVE01**) or Europe (**GPVP01**), as a plain `.iso` or `.gcm`. Unpack a .7z or .zip first, and convert RVZ, WIA, GCZ, CISO or NKit images to ISO with Dolphin on a PC.

> [!NOTE]
> **Download from the project''s site.** The APK is hosted on projecthoneydew.com, not GitHub, so QuestPorts has no 1-click install for it.

---

### Prerequisites
* Meta Quest 3 or Quest 3S.
* Your own Pikmin 2 disc image (USA or Europe).
* About 1.2 GB free.

---

### Step-by-Step Installation
1. Download `ProjectHoneydew2-0.1.0-quest.apk` from the [Project Honeydew site](https://projecthoneydew.com/#honeydew2-install-quest).
2. Install it with SideQuest or `adb install ProjectHoneydew2-0.1.0-quest.apk`. It installs beside Project Honeydew (Pikmin 1) as its own app.
3. Copy your disc image into the headset''s `Download` folder over USB.
4. Start **Project Honeydew 2** from **Library → Unknown Sources**, choose your disc image, and wait a minute or two while its files are imported. You can delete the image afterwards.

> [!TIP]
> This is an early preview. Uninstalling the app deletes its saves.',
  'On the Quest only a plain .iso or .gcm of the USA (GPVE01) or European (GPVP01) disc is accepted. Convert other formats with Dolphin on a PC first.'
),
(
  'outlaws-vr',
  'Outlaws VR',
  'outlawshub-arch',
  'https://github.com/outlawshub-arch/OutlawsVR',
  'LucasArts'' 1997 western shooter Outlaws as a full VR game on Meta Quest 3 and 2: a new Unreal Engine 5 engine that builds the original levels from your own Outlaws Remastered. Full VR hands, co-op and multiplayer.',
  'engine_recreation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/outlaws-vr.jpg',
  'gjTwduLNMyk',
  array['Quest 2', 'Quest 3', 'Quest 3S'],
  array['Smooth Locomotion', 'Snap Turn', 'Climbing'],
  true,
  'N/A (Install on Quest.bat on a Windows PC copies the game data)',
  'https://store.steampowered.com/app/3366780/',
  'Steam or GOG (Outlaws + A Handful of Missions: Remaster)',
  'https://github.com/outlawshub-arch/OutlawsVR/releases/download/v0.95/OutlawsVR-v0.95-hotfix-0bbe48c.zip',
  'GitHub Releases',
  'https://github.com/outlawshub-arch/OutlawsVR',
  'v0.95',
  '2026-10-31T06:46:06Z',
  false,
  '### Overview
**Outlaws VR** is a fan-made VR game that plays LucasArts'' **Outlaws** (1997) on Meta Quest 3 and Quest 2, natively, and on PC VR. It is not a patch for the original executable: a new engine built in Unreal Engine 5.1 reads your own **Outlaws Remastered** install and builds every level, sprite, sound and script from those files. It has the whole story, the Historical Missions, a VR tutorial, co-op and multiplayer with bots, and full VR hands: draw, aim and reload with each hand, throw dynamite and knives, grab bad guys, climb.

> [!NOTE]
> **No game files included, and a Windows PC is needed once.** You need Outlaws Remastered (Steam or GOG) installed on a Windows 10 or 11 PC. The release''s `Install on Quest.bat` prepares and installs everything over USB.

---

### Prerequisites
* Meta Quest 3 or Quest 2 in developer mode, and a data USB-C cable.
* Outlaws + A Handful of Missions: Remaster (Steam or GOG) on a Windows PC.

---

### Step-by-Step Installation
1. Download `OutlawsVR-v0.95-hotfix-0bbe48c.zip` (281 MB) from GitHub Releases.
2. Unzip it and drag the `OutlawsVR` folder into your Outlaws Remastered folder (the one with `olgeo.lab`).
3. Plug the headset into the PC and run `Install on Quest.bat`. The first run converts the cutscenes and music once (it downloads FFmpeg, about 190 MB).
4. Start **Outlaws VR** from **Library → Unknown Sources**. The player''s manual is `Outlaws VR Manual.html` in the folder.

> [!TIP]
> To update, replace the `OutlawsVR` folder and run `Install on Quest.bat` again: saves and settings are kept. Never uninstall the game from the headset to update it, that deletes your saves.',
  'If Windows SmartScreen warns on the first run, choose More info → Run anyway (the files are not signed). Internet play on a Quest needs the router port open or a VPN such as Tailscale. Report bugs in #outlaws-vr-bugs on the OutlawsTheGame Discord.'
),
(
  'star-wars-arcade-vr',
  'Star Wars Arcade VR (Atari 1983)',
  'cyberheater',
  'https://github.com/cyberheater/Quest-SWVR',
  'Atari''s 1983 Star Wars vector arcade game as a native Meta Quest app: the arcade game drawn in 3-D around you, a Touch controller as the flight stick. Bring your own MAME ROM set.',
  'emulator',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/star-wars-arcade-vr.jpg',
  'nJv94FPRddA',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['Seated Cockpit', 'Flight Stick'],
  false,
  '/sdcard/Android/data/com.cyberheater.starwars/files/',
  'https://en.wikipedia.org/wiki/Star_Wars_(1983_video_game)',
  'Requires your own copy (MAME starwars ROM set)',
  'https://github.com/cyberheater/Quest-SWVR/releases/download/v0.3.2/StarWarsQuest.apk',
  'GitHub Releases',
  'https://github.com/cyberheater/Quest-SWVR',
  'v0.3.2',
  '2026-10-15T07:23:45Z',
  false,
  '### Overview
**Star Wars Arcade VR** turns Atari''s 1983 Star Wars vector arcade game into a native Meta Quest app. You sit in the cockpit with the arcade game''s vectors placed in 3-D around you, and a Touch controller is the flight stick. It runs on the headset by itself, with no PC or cable once it is installed.

> [!NOTE]
> **No ROM data included.** You need your own MAME `starwars` ROM set (`starwars.zip`), as it is.

---

### Prerequisites
* A Meta Quest (tried on the original Quest and on a Quest 3; Quest 2, 3S and Pro should work).
* Your own `starwars.zip` MAME ROM set.
* A PC and a USB cable, once.

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `StarWarsQuest.apk` with SideQuest / `adb install -r`.
2. Start **Star Wars** once from **Library → Unknown Sources**. It shows **NO ROMS** and creates its folder. Quit with the Meta button.
3. Copy `starwars.zip`, as it is, to `/sdcard/Android/data/com.cyberheater.starwars/files/` (`adb push starwars.zip /sdcard/Android/data/com.cyberheater.starwars/files/`, or SideQuest''s file browser).
4. Start **Star Wars** again and the game runs.

> [!TIP]
> The app finds the chips it needs in any `.zip` in that folder by their checksums, so nothing has to be unpacked or renamed. The first start with the zip writes six `starwars_*.bin` files beside it.',
  'If it still shows NO ROMS, check that starwars.zip sits directly in Android/data/com.cyberheater.starwars/files/. Some headset versions hide Android/data in Windows Explorer; use adb or SideQuest instead.'
),
(
  'ultima-4-vr',
  'Ultima IV VR (ANKH-VR)',
  'plaidpants',
  'https://github.com/plaidpants/ANKH-VR',
  'Origin''s 1985 RPG Ultima IV: Quest of the Avatar in VR on Meta Quest, a Unity remake that reads the original game''s own data. Ultima IV is free on GOG. Alpha on Quest.',
  'engine_recreation',
  'in_development',
  'https://questports-media.questports.workers.dev/covers/ultima-4-vr.jpg',
  'Z9mnNK967Jo',
  array['Quest 2', 'Quest 3', 'Quest 3S'],
  array['Smooth Locomotion', 'Snap Turn'],
  true,
  '/sdcard/Android/data/com.SwivelChairGames.ANKHVR/files/u4/',
  'https://www.gog.com/en/game/ultima_4',
  'Free on GOG (Ultima 4: Quest of the Avatar)',
  'https://github.com/plaidpants/ANKH-VR/releases/download/0.2.15/ANHK-VR.apk',
  'GitHub Releases',
  'https://github.com/plaidpants/ANKH-VR',
  'v0.2.15',
  '2026-07-02T22:48:32Z',
  false,
  '### Overview
**ANKH-VR** runs the original Ultima IV: Quest of the Avatar (1985) in VR, built in Unity by plaidpants. The Quest version reads all its text and data straight from the original game''s files. The author calls it functionally complete but alpha on the Quest. It switches tile sets while you play (CGA, EGA, Apple II or a custom PNG).

> [!NOTE]
> **No game files included.** Ultima IV is free on GOG. Install it on a PC, then copy the whole install folder to the headset.

---

### Prerequisites
* Meta Quest 2 or Quest 3.
* Ultima IV from GOG (free), installed on a PC.
* Optional: the original music as MP3 or OGG (see the project page).

---

### Step-by-Step Installation
1. Install the APK via 1-click on QuestPorts or install `ANHK-VR.apk` with SideQuest / `adb install -r`.
2. Copy the entire Ultima IV install folder to `/sdcard/Android/data/com.SwivelChairGames.ANKHVR/files/u4`, so `AVATAR.EXE` ends up at `.../files/u4/AVATAR.EXE`. File names are case sensitive on the Quest.
3. Launch **ANKH-VR** from **Unknown Sources**.

> [!TIP]
> SideQuest sometimes skips files when you copy many at once: check that everything arrived. If you copy old save files (`.SAV`), make them writable with `adb shell chmod 666 /sdcard/Android/data/com.SwivelChairGames.ANKHVR/files/u4/*.SAV`. A new game creates them writable already.',
  'AVATAR.EXE must be directly in Android/data/com.SwivelChairGames.ANKHVR/files/u4/. Copied .SAV files need chmod 666 over adb or the game cannot save. Text to speech needs a network connection.'
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
