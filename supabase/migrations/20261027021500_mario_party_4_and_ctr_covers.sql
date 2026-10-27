-- Mario Party 4 Partyboard and CTR Turbocharged VR already have catalog
-- rows. cover_image_url is null, so each card would keep the placeholder.
-- Point them at the media-host covers. resolveCoverUrl maps that host
-- back onto /covers/<slug>.png.
--
-- This only fills in a value that is currently null. No row is created,
-- no column changes, and a re-run changes nothing.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.

begin;

update public.ports
   set cover_image_url = 'https://questports-media.questports.workers.dev/covers/mario-party-4-partyboard.png'
 where slug = 'mario-party-4-partyboard'
   and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/mario-party-4-partyboard.png';

update public.ports
   set cover_image_url = 'https://questports-media.questports.workers.dev/covers/ctr-turbocharged-vr.png'
 where slug = 'ctr-turbocharged-vr'
   and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/ctr-turbocharged-vr.png';

commit;
