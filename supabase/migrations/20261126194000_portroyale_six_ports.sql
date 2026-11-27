-- Six Port Royale ports. Official installation sources linked in each guide.
-- Cover and video are initially NULL; later migrations set missing covers and video IDs.
-- GT4 download is Online only; Spec II has a different APK and ISO. Sync is disabled.
-- Apply manually after merge; never run by an agent.
begin;

insert into public.ports (
  slug, title, short_description, developer, developer_url, category, status, cover_image_url, youtube_video_id, supported_hardware, locomotion_types, has_6dof_controls, internal_storage_path, base_game_url, base_game_store, port_download_url, port_download_source, github_url, latest_version, last_github_update, featured, installation_guide, troubleshooting_notes
) values
  ('forza-horizon-vr', 'Forza Horizon VR', 'Forza Horizon on Quest with a stereoscopic screen and head-tracked driving views.', 'SgtBilko76', 'https://github.com/SgtBilko76', 'decompilation', 'playable_beta', null, null, array['Quest 3'], array[]::text[], true, '/sdcard/Download/', null, null, 'https://github.com/SgtBilko76/ForzaHorizon-VR/releases/download/quest-v0.4.5-beta/ForzaHorizon-VR-0.4.5-beta.apk', 'GitHub Releases', 'https://github.com/SgtBilko76/ForzaHorizon-VR', 'v0.4.5-beta', null, false, '### Requirements
Quest 3 tested; Quest 2, 3S and Pro untested. Bring your own US Xbox 360 Forza Horizon disc and its extracted game folder containing default.xex. This version does not open ISO images.

### Installation
1. Sideload the release APK.
2. Extract your disc and copy the game folder to the headset, for example Download.
3. Launch from Unknown Sources, choose the game folder and press Play. Keep about 12 GB free; the first on-headset build takes 25–35 minutes. Updates rebuild once; saves are kept.

Source: https://portroyale.online/forzahorizon.html', 'Quest 3 tested. This beta requires the extracted US disc folder, not an ISO. The cockpit runs at about 25–35 fps.'),
  ('gran-turismo-4-vr', 'Gran Turismo 4 VR', 'Gran Turismo 4 races in head-tracked stereo 3D on Quest.', 'SgtBilko76', 'https://github.com/SgtBilko76', 'decompilation', 'playable_beta', null, null, array['Quest 3'], array[]::text[], false, '/sdcard/GT4HD/', null, null, 'https://github.com/SgtBilko76/gt4-vr/releases/download/v0.3.2-beta-online/GT4-Online-VR-0.3.2-beta.apk', 'GitHub Releases', 'https://github.com/SgtBilko76/gt4-vr', 'v0.3.2-beta', null, false, '### Requirements
Quest 3 tested; Quest 2, 3S and Pro untested. The main download is GT4 Online VR, which requires your own US Gran Turismo 4 v2.00 ISO. The APK does not include game data.

### GT4 Online installation
1. Sideload GT4-Online-VR-0.3.2-beta.apk.
2. Copy your US v2.00 ISO to /sdcard/GT4HD/.
3. Launch from Unknown Sources and grant All files access. Once a race starts, press both sticks to switch to head-tracked VR. Wi-Fi is needed for online races.

### Alternative: GT4 Spec II
This is a different APK and requires a different ISO: apply the Spec II 1.10 xDelta patch to your own US NTSC Gran Turismo 4 Online Public Beta disc image, then copy the patched ISO to /sdcard/GT4SpecII/. Do not use the Online APK with the Spec II ISO. Download the separate Spec II APK at https://github.com/SgtBilko76/gt4-vr/releases/tag/v0.3.2-beta-specii. Both apps can be installed side by side.

Source: https://portroyale.online/gt4.html', 'Only the listed disc versions are supported. The Online and Spec II APKs use different ISO versions and folders.'),
  ('crash-bandicoot-launcher', 'Crash Bandicoot Launcher', 'The original Crash Bandicoot recompiled for Quest and shown in stereoscopic 3D.', 'SgtBilko76', 'https://github.com/SgtBilko76', 'decompilation', 'playable_beta', null, null, array['Quest 3'], array[]::text[], false, '/sdcard/Download/', null, null, 'https://github.com/SgtBilko76/CrashBandicoot-Launcher/releases/download/v2.0.0-beta.1/CrashBandicoot-2.0.0-beta.1.apk', 'GitHub Releases', 'https://github.com/SgtBilko76/CrashBandicoot-Launcher', 'v2.0.0-beta.1', null, false, '### Requirements
Quest 3 tested. Bring your own Crash Bandicoot NTSC-U disc dump (SCUS-94900), as CHD or matching CUE and BIN files. The APK includes no game data.

### Installation
1. Sideload the release APK. If you have an earlier 1.9.x or test build, back up your memory card saves and uninstall it first: the signing key changed.
2. Copy the disc dump to the headset, for example Download.
3. Launch from Unknown Sources, grant All files access, select the disc and press Start Game. The first on-headset compilation takes about half a minute.

Source: https://portroyale.online/crash-bandicoot.html', 'Only NTSC-U SCUS-94900 is supported. Earlier 1.9.x and test builds must be uninstalled after backing up saves because the signing key changed.'),
  ('0ad-vr', '0 A.D. VR', 'Free ancient-world strategy on a tabletop in VR or mixed reality.', 'SgtBilko76', 'https://github.com/SgtBilko76', 'source_port', 'playable_beta', null, null, array['Quest 3'], array[]::text[], true, '/sdcard/0AD/data/', null, null, 'https://github.com/SgtBilko76/0AD-VR/releases/download/v0.1.0-beta/0AD-VR-Quest-v0.1.0-beta.apk', 'GitHub Releases', 'https://github.com/SgtBilko76/0AD-VR', 'v0.1.0-beta', null, false, '### Requirements
Quest 3 tested. The free game data is a separate download; allow about 2 GB for the data. The developer describes using a PC to copy it.

### Installation
1. Download and sideload the release APK.
2. Download https://github.com/SgtBilko76/0AD-VR/releases/download/v0.1.0-beta/0AD-VR-Quest-data-v0.1.0-beta.zip. Unzip it and copy the 0AD folder to the root of headset internal storage, so /sdcard/0AD/data/ exists.
3. Launch from Unknown Sources, allow All files access and start the game again.

Source: https://portroyale.online/0ad.html', 'Known issue: occasional short freezes while computer players think. The game data ZIP is separate from the APK.'),
  ('warzone-2100-vr', 'Warzone 2100 VR', 'Free strategy on a tabletop in VR or mixed reality.', 'SgtBilko76', 'https://github.com/SgtBilko76', 'source_port', 'playable_beta', null, null, array['Quest 3'], array[]::text[], true, null, null, null, 'https://github.com/SgtBilko76/Warzone2100-VR/releases/download/v0.1.1-beta/Warzone2100-VR-Quest-v0.1.1-beta.apk', 'GitHub Releases', 'https://github.com/SgtBilko76/Warzone2100-VR', 'v0.1.1-beta', null, false, '### Installation
The APK contains the full free game, including campaign videos; no separate game files are needed. Quest 3 is tested; Quest 2, 3S and Pro are listed by the developer.

1. Sideload Warzone2100-VR-Quest-v0.1.1-beta.apk.
2. Launch from Unknown Sources. The first start unpacks about 700 MB of game data and takes about a minute.
3. If the table or panel is not in front of you, hold both stick clicks for a second.

Source: https://portroyale.online/warzone2100.html', 'The APK is approximately 958.7 MB. The first launch unpacks its included game data.'),
  ('no-gravity-vr', 'No Gravity VR', 'A free space combat game in head-tracked stereo 3D.', 'SgtBilko76', 'https://github.com/SgtBilko76', 'source_port', 'playable_beta', null, null, array['Quest 3'], array[]::text[], false, null, null, null, 'https://github.com/SgtBilko76/NoGravity-VR/releases/download/v0.1.1-beta/NoGravity-VR-v0.1.1-beta.apk', 'GitHub Releases', 'https://github.com/SgtBilko76/NoGravity-VR', 'v0.1.1-beta', null, false, '### Installation
The free game data is included in the APK. Quest 3 is tested; Quest 2, 3S and Pro are untested.

1. Sideload NoGravity-VR-v0.1.1-beta.apk.
2. Launch from Unknown Sources. The first launch takes a few seconds longer while game data is unpacked.

Source: https://portroyale.online/nogravity.html', 'First public beta, tested on Quest 3. The APK is signed with a debug key.')
on conflict (slug) do nothing;

commit;
