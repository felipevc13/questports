-- CSVR, JKXR, QuestCraft, and Beef Raider XR one-click was fetching a
-- SideQuest listing page. That page is HTML, so the APK proxy returns 502
-- ("Download URL returned a web page instead of an APK") and the install
-- never starts. Each GitHub repo already ships a Quest APK. releases/latest
-- lets the proxy pick that file, and the next release APK after it.
--
-- Proxy resolution of releases/latest (2026-10-15):
--   csvr          CSVR-1.0.5.apk                         com.lvonasek.csvr
--   jkxr          jkxr-1.2.0.apk (not the companion APK) com.drbeef.jkxr
--   questcraft    QCXR-6.0.0.apk                         com.qcxr.qcxr
--   beefraiderxr  beefraiderxr-1.0.0.apk (not the Pico APK, not the .7z)
--                                                    com.drbeef.beefraiderxr
--
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.

update public.ports
set
  port_download_url = 'https://github.com/Team-Beef-Studios/CSVR/releases/latest',
  port_download_source = 'GitHub Releases',
  updated_at = now()
where slug = 'csvr'
  and (
    port_download_url is distinct from 'https://github.com/Team-Beef-Studios/CSVR/releases/latest'
    or port_download_source is distinct from 'GitHub Releases'
  );

update public.ports
set
  port_download_url = 'https://github.com/Team-Beef-Studios/JKXR/releases/latest',
  port_download_source = 'GitHub Releases',
  updated_at = now()
where slug = 'jkxr'
  and (
    port_download_url is distinct from 'https://github.com/Team-Beef-Studios/JKXR/releases/latest'
    or port_download_source is distinct from 'GitHub Releases'
  );

update public.ports
set
  port_download_url = 'https://github.com/QuestCraftPlusPlus/QuestCraft/releases/latest',
  port_download_source = 'GitHub Releases',
  updated_at = now()
where slug = 'questcraft'
  and (
    port_download_url is distinct from 'https://github.com/QuestCraftPlusPlus/QuestCraft/releases/latest'
    or port_download_source is distinct from 'GitHub Releases'
  );

update public.ports
set
  port_download_url = 'https://github.com/Team-Beef-Studios/BeefRaiderXR/releases/latest',
  port_download_source = 'GitHub Releases',
  updated_at = now()
where slug = 'beefraiderxr'
  and (
    port_download_url is distinct from 'https://github.com/Team-Beef-Studios/BeefRaiderXR/releases/latest'
    or port_download_source is distinct from 'GitHub Releases'
  );
