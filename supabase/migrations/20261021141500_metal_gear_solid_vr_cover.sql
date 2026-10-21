-- Metal Gear Solid VR already has a catalog row. cover_image_url is null, so
-- the card would keep the placeholder. Point it at the media-host cover.
-- resolveCoverUrl maps that host back onto /covers/metal-gear-solid-vr.jpg.
--
-- This only fills in a value that is currently null. No row is created,
-- no column changes, and a re-run changes nothing.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.

begin;

update public.ports
   set cover_image_url = 'https://questports-media.questports.workers.dev/covers/metal-gear-solid-vr.jpg'
 where slug = 'metal-gear-solid-vr'
   and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/metal-gear-solid-vr.jpg';

commit;
