-- Prepare only: Felipe applies this migration manually after merge.
-- Covers are initially NULL; later migrations set missing cover URLs. Wario insert includes its video ID.
begin;

insert into public.ports (
  slug, title, developer, developer_url, short_description, category, status, cover_image_url, youtube_video_id, supported_hardware, locomotion_types, has_6dof_controls, internal_storage_path, base_game_url, base_game_store, port_download_url, port_download_source, github_url, latest_version, last_github_update, featured, installation_guide, troubleshooting_notes
) values
(
  'rage-racer-vr',
  'Rage Racer VR',
  'Thoreman',
  'https://github.com/Thoreman',
  'Rage Racer on Meta Quest: drive in VR with head tracking and Touch controllers. Bring your own PlayStation disc image.',
  'source_port',
  'in_development',
  null,
  null,
  array['Quest 3']::text[],
  array['Seated']::text[],
  false,
  '/sdcard/Download/',
  null,
  'Requires your own Rage Racer PlayStation disc',
  'https://github.com/Thoreman/rage-racer-pc/releases/download/v0.6.5-rc1/rage-racer-vr-0.6.5-rc1.apk',
  'GitHub Releases',
  'https://github.com/Thoreman/rage-racer-pc',
  'v0.6.5-rc1',
  '2026-11-24T15:51:14Z',
  false,
  $guide$### Overview
Rage Racer VR is an unofficial standalone Quest port of the PlayStation racing game, built on Chris Hasiński's Rage Racer PC port and PSY-Z. Drive with Touch controllers and look around with head tracking. Menus and videos appear on a floating screen.

**Install type: APK plus your own disc image.** No game data is included.

> [!WARNING]
> v0.6.5-rc1 is a release candidate. Only Quest 3 has been tested; Quest 2, 3S and Pro settings are estimates. The road can look smeary on some inclines.

### Installation
1. Enable Developer Mode and sideload `rage-racer-vr-0.6.5-rc1.apk`, for example with SideQuest or `adb install`.
2. Copy your legally obtained Rage Racer disc image to the headset, for example to `Download`. Use a `.cue` with all its `.bin` tracks in the same folder, or a `.chd` with Rage Racer in its filename. Europe, USA and Japan discs are supported.
3. Open **Library → Unknown Sources → Rage Racer VR**. Choose **Search this headset for it** and allow all files access, or **Choose the folder myself** to select a folder and copy the image into the app.
4. Press **Start Rage Racer**. The choice is remembered. Alternatively, copying the disc into `/sdcard/Android/data/org.rageracer.quest/files/disc/` skips the setup panel.

Use the right trigger to accelerate, left trigger to brake, left stick to steer, and hold X to recenter.$guide$,
  'Only Quest 3 was tested; Quest 2, 3S and Pro settings are estimates. If the disc is not found, keep the CUE and every BIN track it references together, or use a CHD with Rage Racer in its name. Some inclines can appear smeary. Check headset tuner apps if performance is unexpectedly poor.'
),
(
  'wario-land-4-vr',
  'Wario Land 4 VR',
  'mrchrisster',
  'https://github.com/mrchrisster',
  'Wario Land 4 recompiled for Meta Quest with Virtual Boy-style layered stereoscopic depth. Bring your own GBA ROM.',
  'decompilation',
  'in_development',
  null,
  'fdBW9pHtGyo',
  array[]::text[],
  array['Virtual Screen (stereo 3D)']::text[],
  false,
  '/sdcard/Download/',
  null,
  'Requires your own Wario Land 4 (USA, Europe) GBA ROM',
  'https://github.com/mrchrisster/wario-land-4-vr/releases/download/v0.1.0/wario-land-4-vr-quest.apk',
  'GitHub Releases',
  'https://github.com/mrchrisster/wario-land-4-vr',
  'v0.1.0',
  '2026-11-21T00:36:59Z',
  false,
  $guide$### Overview
Wario Land 4 VR is an unofficial Quest project that statically recompiles the Game Boy Advance game and presents its layers in stereoscopic depth. It is not an emulator or a first-person VR game.

**Install type: APK plus your own ROM.** The release contains no ROM, graphics, sound or save data.

### Installation
1. Enable Developer Mode and sideload `wario-land-4-vr-quest.apk`, for example with SideQuest or `adb install -r`.
2. Put your own legally obtained Wario Land 4 (USA, Europe) `.gba` file on the headset, for example in Downloads.
3. Open **Library → Unknown Sources → Wario Land 4 VR** and select the ROM on first launch. It is checked against SHA-1 `b9fe05a8080e124b67bce6a623234ee3b518a2c1` and copied into the app once. No BIOS is needed.

The left Menu button opens options for save states, depth, passthrough or a dark room, and recentering. The release APK does not include the menu logo.$guide$,
  'Use your own Wario Land 4 (USA, Europe) GBA ROM with SHA-1 b9fe05a8080e124b67bce6a623234ee3b518a2c1. The release APK does not include the ROM or menu logo.'
)
on conflict (slug) do nothing;

commit;
