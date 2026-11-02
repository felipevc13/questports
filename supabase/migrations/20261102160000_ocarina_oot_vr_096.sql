-- Ocarina of Time VR (oot-vr): v0.9.4-beta -> v0.9.6-beta (29 Oct 2026).
-- The port is not in the daily release sync (scripts/sync-github-stats.js), so the row
-- stayed on v0.9.4-beta. The 0.9.6 APK's package is still org.oot.vr
-- (scripts/verify-apk-packages.mjs: OK).
-- 0.9.5 added the spin attack gesture, 0.9.6 the bow and slingshot string pull.
-- The guide edits are targeted replace() calls. A re-run changes nothing.
-- Apply manually in the Supabase SQL editor after merge. Do not run it from CI.

update public.ports
   set latest_version = 'v0.9.6-beta',
       port_download_url = 'https://github.com/gibranfelix/oot-vr/releases/download/v0.9.6-beta/oot-vr-v0.9.6-beta.apk',
       last_github_update = '2026-10-29 16:42:45+00'
 where slug = 'ocarina-of-time-vr'
   and port_download_url is distinct from 'https://github.com/gibranfelix/oot-vr/releases/download/v0.9.6-beta/oot-vr-v0.9.6-beta.apk';

update public.ports
   set installation_guide =
     replace(
     replace(
     replace(
     replace(
     replace(installation_guide,
       'v0.9.4-beta (October 26, 2026)', 'v0.9.6-beta (October 29, 2026)'),
       'oot-vr-v0.9.4-beta.apk', 'oot-vr-v0.9.6-beta.apk'),
       'releases/tag/v0.9.4-beta', 'releases/tag/v0.9.6-beta'),
       '| Left trigger | Use the item (bow: hold to pull, release to shoot) |',
       '| Left trigger | Use the item (bow and slingshot: hold to pull, release to shoot) |' || E'\n' ||
       '| Right grip near the string | Bow and slingshot: pull back, release the grip to shoot |'),
       E'\n* Item selector you grab with your hand',
       E'\n* **Spin attack:** hold the sword at your hip with the blade pointing back until the controller vibrates, then swing fast. With magic, you do the magic spin.' ||
       E'\n* Item selector you grab with your hand')
 where slug = 'ocarina-of-time-vr'
   and installation_guide like '%v0.9.4-beta%';
