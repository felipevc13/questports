-- Max Payne VR does not have a catalog row yet. This update matches
-- nothing until that row is inserted, then points cover_image_url at the
-- media-host cover. resolveCoverUrl maps that host back onto
-- /covers/max-payne-vr.jpg.
--
-- No row is created, no column changes, and a re-run changes nothing
-- once the URL is already set.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.

begin;

update public.ports
   set cover_image_url = 'https://questports-media.questports.workers.dev/covers/max-payne-vr.jpg'
 where slug = 'max-payne-vr'
   and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/max-payne-vr.jpg';

commit;
