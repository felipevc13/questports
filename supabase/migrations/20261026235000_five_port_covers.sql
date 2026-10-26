-- Five catalog rows already exist. cover_image_url is null, so each card
-- would keep the placeholder. Point them at the media-host covers.
-- resolveCoverUrl maps that host back onto /covers/<slug>.png.
--
-- This only fills in a value that is currently null. No row is created,
-- no column changes, and a re-run changes nothing.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.

begin;

update public.ports
   set cover_image_url = 'https://questports-media.questports.workers.dev/covers/daytona-usa-vr.png'
 where slug = 'daytona-usa-vr'
   and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/daytona-usa-vr.png';

update public.ports
   set cover_image_url = 'https://questports-media.questports.workers.dev/covers/dirt-dash-vr.png'
 where slug = 'dirt-dash-vr'
   and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/dirt-dash-vr.png';

update public.ports
   set cover_image_url = 'https://questports-media.questports.workers.dev/covers/arx-libertatis-vr.png'
 where slug = 'arx-libertatis-vr'
   and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/arx-libertatis-vr.png';

update public.ports
   set cover_image_url = 'https://questports-media.questports.workers.dev/covers/bomberman-hero-vr.png'
 where slug = 'bomberman-hero-vr'
   and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/bomberman-hero-vr.png';

update public.ports
   set cover_image_url = 'https://questports-media.questports.workers.dev/covers/mega-man-64-vr.png'
 where slug = 'mega-man-64-vr'
   and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/mega-man-64-vr.png';

commit;
