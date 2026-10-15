-- The remaining SideQuest listing pages are HTML. One-click was fetching
-- that page, and the APK proxy returns 502 ("Download URL returned a web
-- page instead of an APK"). A live catalog scan on 2026-10-15 found these
-- eight port_download_url values and no other sidequestvr.com downloads.
--
-- Proxy resolution of releases/latest (Quest APK, not Pico/companion/.7z):
--   preyvr       preyvr-v124.apk                 com.lvonasek.preyvr
--   quake2quest  quake2quest-v1.1.1.apk          com.drbeef.quake2quest
--   quake3quest  ioq3quest-release-1.2.0.apk     com.drbeef.ioq3quest
--   quakequest   quakequest-v1.6.0.apk           com.drbeef.quakequest
--   razexr       razexr-1.0.0.apk                com.drbeef.razexr
--                (not razexrlauncher_oculus.apk)
--
-- These three have no installable GitHub APK, so the download URL leaves
-- SideQuest and one-click stays off:
--   hexen2vr     Hammer of Thyrion README. The Quest file vhexen2-010-alpha.apk
--                is only on the SideQuest CDN (package com.uhexen2.vhexen2).
--   ppsspp-vr    GitHub v1.20.4 has no APK. releases/latest resolves to the
--                macOS zip. The Quest APK is ppsspp_vr.apk on ppsspp.org,
--                which the APK proxy does not allow.
--   iron-lung-vr Itch.io page. No GitHub release.
--
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.

update public.ports
set
  port_download_url = 'https://github.com/Team-Beef-Studios/PreyVR/releases/latest',
  port_download_source = 'GitHub Releases',
  updated_at = now()
where slug = 'preyvr'
  and (
    port_download_url is distinct from 'https://github.com/Team-Beef-Studios/PreyVR/releases/latest'
    or port_download_source is distinct from 'GitHub Releases'
  );

update public.ports
set
  port_download_url = 'https://github.com/Team-Beef-Studios/Quake2Quest/releases/latest',
  port_download_source = 'GitHub Releases',
  updated_at = now()
where slug = 'quake2quest'
  and (
    port_download_url is distinct from 'https://github.com/Team-Beef-Studios/Quake2Quest/releases/latest'
    or port_download_source is distinct from 'GitHub Releases'
  );

update public.ports
set
  port_download_url = 'https://github.com/Team-Beef-Studios/ioq3quest/releases/latest',
  port_download_source = 'GitHub Releases',
  updated_at = now()
where slug = 'quake3quest'
  and (
    port_download_url is distinct from 'https://github.com/Team-Beef-Studios/ioq3quest/releases/latest'
    or port_download_source is distinct from 'GitHub Releases'
  );

update public.ports
set
  port_download_url = 'https://github.com/Team-Beef-Studios/QuakeQuest/releases/latest',
  port_download_source = 'GitHub Releases',
  updated_at = now()
where slug = 'quakequest'
  and (
    port_download_url is distinct from 'https://github.com/Team-Beef-Studios/QuakeQuest/releases/latest'
    or port_download_source is distinct from 'GitHub Releases'
  );

update public.ports
set
  port_download_url = 'https://github.com/Team-Beef-Studios/RazeXR/releases/latest',
  port_download_source = 'GitHub Releases',
  updated_at = now()
where slug = 'razexr'
  and (
    port_download_url is distinct from 'https://github.com/Team-Beef-Studios/RazeXR/releases/latest'
    or port_download_source is distinct from 'GitHub Releases'
  );

update public.ports
set
  port_download_url = 'https://github.com/sezero/uhexen2/blob/master/README.txt',
  port_download_source = 'GitHub',
  updated_at = now()
where slug = 'hexen2vr'
  and (
    port_download_url is distinct from 'https://github.com/sezero/uhexen2/blob/master/README.txt'
    or port_download_source is distinct from 'GitHub'
  );

update public.ports
set
  port_download_url = 'https://github.com/hrydgard/ppsspp/blob/master/README.md',
  port_download_source = 'GitHub',
  updated_at = now()
where slug = 'ppsspp-vr'
  and (
    port_download_url is distinct from 'https://github.com/hrydgard/ppsspp/blob/master/README.md'
    or port_download_source is distinct from 'GitHub'
  );

update public.ports
set
  port_download_url = 'https://jackaapacka.itch.io/iron-lung-vr',
  port_download_source = 'Itch.io',
  updated_at = now()
where slug = 'iron-lung-vr'
  and (
    port_download_url is distinct from 'https://jackaapacka.itch.io/iron-lung-vr'
    or port_download_source is distinct from 'Itch.io'
  );
