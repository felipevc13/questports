-- PPSSPP VR one-click was pointed at the GitHub README because the GitHub
-- release has no Android APK (releases/latest resolves to the macOS zip).
-- The Quest build is a direct APK on PPSSPP.org:
--   https://www.ppsspp.org/files/1_20_4/ppsspp_vr.apk
--   25,580,716 bytes, package org.ppsspp.ppssppvr, version v1.20.4.
-- The APK proxy must allow ppsspp.org and www.ppsspp.org before one-click
-- can download it. Apply this manually in the Supabase SQL editor.
-- Do not run it from CI.

update public.ports
set
  port_download_url = 'https://www.ppsspp.org/files/1_20_4/ppsspp_vr.apk',
  port_download_source = 'PPSSPP.org',
  updated_at = now()
where slug = 'ppsspp-vr'
  and (
    port_download_url is distinct from 'https://www.ppsspp.org/files/1_20_4/ppsspp_vr.apk'
    or port_download_source is distinct from 'PPSSPP.org'
  );
