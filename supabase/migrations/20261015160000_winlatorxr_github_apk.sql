-- WinlatorXR one-click was fetching the SideQuest listing page, which is HTML.
-- The GitHub release winlatorxr_dawn42 ships WinlatorXR-dawn-42.apk
-- (package com.winlator.cmod). releases/latest lets the APK proxy pick that file,
-- and the next release APK after it.
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.

update public.ports
set
  port_download_url = 'https://github.com/WinlatorXR/WinlatorXR/releases/latest',
  port_download_source = 'GitHub Releases',
  updated_at = now()
where slug = 'winlatorxr'
  and (
    port_download_url is distinct from 'https://github.com/WinlatorXR/WinlatorXR/releases/latest'
    or port_download_source is distinct from 'GitHub Releases'
  );
