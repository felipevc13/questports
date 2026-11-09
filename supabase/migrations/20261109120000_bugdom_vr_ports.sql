-- Add Bugdom VR and Bugdom 2 VR by SgtBilko76 (Port Royale).
-- Package ids verified from release APKs: io.jor.bugdom and io.jor.bugdom2.
-- Both are playable betas built from Iliyas Jorio's modern engine ports with OpenXR.
-- Full game data is bundled under CC BY-NC-SA 4.0 license from Pangea Software, Inc.
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
  'bugdom-vr',
  'Bugdom VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76',
  'The 1999 classic Pangea 3D action-adventure Bugdom rebuilt for Meta Quest with OpenXR, stereoscopic 3D, and Touch controls. Roll, kick, and fly as Rollie McFly to save the ladybugs.',
  'source_port',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/bugdom-vr.jpg',
  '-leTy9bmmY0',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['Smooth Locomotion', 'Snap Turn', 'Third-person VR'],
  true,
  'N/A (game data is bundled in the APK)',
  'https://github.com/jorio/Bugdom',
  'Free (game data is bundled under CC BY-NC-SA 4.0)',
  'https://github.com/SgtBilko76/Bugdom/releases/download/v1.3.5-vr-beta1/Bugdom-VR-1.3.5-beta1.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/Bugdom',
  'v1.3.5-vr-beta1',
  '2026-10-01T11:26:07Z',
  false,
  '### Overview
**Bugdom VR** is the classic 1999 Pangea Software Macintosh action-adventure *Bugdom* updated for modern VR headsets by SgtBilko76 (Port Royale). You play as Rollie McFly, a pill bug on a quest to save the ladybugs from King Thorax''s swarm.

Built from Iliyas Jorio''s modern source port (`jorio/Bugdom`) with an OpenXR VR backend, the port delivers stereoscopic 3D, 6DoF head tracking, a level-horizon chase camera, sRGB color handling, and full Touch controller input.

**Install type: Direct APK (No PC needed).**

> [!NOTE]
> **Full game included.** The game assets are re-released under CC BY-NC-SA 4.0 with permission from Pangea Software, Inc., and are bundled directly inside the APK. No game data copy required.

---

### Prerequisites
* Meta Quest 2, 3, 3S, or Pro with Developer Mode enabled.
* About 100 MB of free storage.

---

### Step-by-Step Installation
1. Sideload the APK via 1-click on QuestPorts or download `Bugdom-VR-1.3.5-beta1.apk` from GitHub Releases.
2. Open **Library**, switch the filter to **Unknown Sources**, and launch **Bugdom**.
3. Point with the right controller laser to navigate menus, then jump into the game.

---

### Controls
| Control | Action |
| --- | --- |
| Left stick | Move / Roll |
| Right stick | Snap turn (30°) |
| Hold Right stick click (1s) | Recenter forward & eye height |
| A | Jump |
| B | Ball mode (roll) |
| X or Right Trigger | Kick |
| Y | Call buddy |
| Menu button | Pause menu |
| Right controller laser | Point & click in menus |',
  'First beta release (v1.3.5-vr-beta1). Tested on Quest 3; Quest 2, 3S, and Pro are compatible. If the camera angle or height feels offset, hold the right stick click for 1 second to recenter.'
),
(
  'bugdom-2-vr',
  'Bugdom 2 VR',
  'SgtBilko76',
  'https://github.com/SgtBilko76',
  'The 2002 sequel Bugdom 2 by Pangea Software brought to Meta Quest via OpenXR. Fly, swim, and buzz across giant 3D backyards as Skip the grasshopper in native stereoscopic VR.',
  'source_port',
  'playable_beta',
  'https://questports-media.questports.workers.dev/covers/bugdom-2-vr.jpg',
  'RxfCzJINBjQ',
  array['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  array['Smooth Locomotion', 'Snap Turn', 'Third-person VR'],
  true,
  'N/A (game data is bundled in the APK)',
  'https://github.com/jorio/Bugdom2',
  'Free (game data is bundled under CC BY-NC-SA 4.0)',
  'https://github.com/SgtBilko76/Bugdom2/releases/download/v4.0.1-vr-beta1/Bugdom2-VR-4.0.1-beta1.apk',
  'GitHub Releases',
  'https://github.com/SgtBilko76/Bugdom2',
  'v4.0.1-vr-beta1',
  '2026-10-01T12:47:54Z',
  false,
  '### Overview
**Bugdom 2 VR** is the standalone Meta Quest port of Pangea Software''s 2002 hit *Bugdom 2* by SgtBilko76 (Port Royale). You control Skip the grasshopper on a mission to track down the bully bee who stole your knapsack.

Running natively via OpenXR from Iliyas Jorio''s modern engine port (`jorio/Bugdom2`), this release features full 6DoF head tracking, stereoscopic 3D, a level-horizon chase camera, floating VR HUD, and immersive tunnel rides and balsa airplane sequences in VR.

**Install type: Direct APK (No PC needed).**

> [!NOTE]
> **Full game included.** Game data is bundled inside the APK under CC BY-NC-SA 4.0 permission from Pangea Software, Inc. On first start, data unpacks automatically.

---

### Prerequisites
* Meta Quest 2, 3, 3S, or Pro with Developer Mode enabled.
* About 200 MB of free storage.

---

### Step-by-Step Installation
1. Sideload the APK via 1-click on QuestPorts or download `Bugdom2-VR-4.0.1-beta1.apk` from GitHub Releases.
2. Open **Library**, switch the filter to **Unknown Sources**, and launch **Bugdom 2**.
3. First launch takes a few seconds longer while assets unpack.

---

### Controls
| Control | Action |
| --- | --- |
| Left stick | Walk / Fly |
| Right stick | Snap turn (30°) |
| Hold Right stick click (1s) | Recenter forward & eye height |
| Left stick click | Adjust camera distance |
| A | Jump |
| B | Pick up / Drop items |
| X or Right Trigger | Kick |
| Y | Launch buddy |
| Menu button | Pause menu |
| Grips | Previous / Next page in menus |',
  'First beta release (v4.0.1-vr-beta1). First launch takes a few extra seconds while game assets unpack. Hold the right stick click for 1 second to recenter camera height and forward direction at any time.'
)
on conflict (slug) do nothing;

commit;

