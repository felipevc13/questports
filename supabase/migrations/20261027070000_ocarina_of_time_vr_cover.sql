-- Ocarina of Time VR already has a catalog row. cover_image_url still
-- points at a SteamGridDB CDN png. Point it at the media-host cover.
-- resolveCoverUrl maps that host back onto /covers/ocarina-of-time-vr.png.
--
-- No row is created, no column changes, and a re-run changes nothing
-- once the URL is already set.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.

begin;

update public.ports
   set cover_image_url = 'https://questports-media.questports.workers.dev/covers/ocarina-of-time-vr.png'
 where slug = 'ocarina-of-time-vr'
   and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/ocarina-of-time-vr.png';

commit;
