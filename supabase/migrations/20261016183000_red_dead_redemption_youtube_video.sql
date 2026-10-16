-- Red Dead Redemption VR (Undead Nightmare) gets its YouTube video on the
-- detail page. ports.youtube_video_id is what makes the page render the
-- click-to-play player at all; without it the page only has the local hover
-- MP4 on the cover.
--
-- The detail page plays the whole video from 0:00. The GAME_VIDEO_PREVIEWS
-- window for this port was removed in app/data/videoPreviews.ts, so the embed
-- carries no start or end parameter -- the same as the other ports that are
-- not in that registry.
--
-- This only fills in a value that is currently null. No row is created,
-- no column changes, and a re-run changes nothing.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.
--
-- Preview before applying:
--
-- select slug, youtube_video_id as before, '6Glik2KeDcA' as after
-- from public.ports
-- where slug = 'red-dead-redemption-vr'
--   and youtube_video_id is distinct from '6Glik2KeDcA';

begin;

update public.ports
   set youtube_video_id = '6Glik2KeDcA'
 where slug = 'red-dead-redemption-vr'
   and youtube_video_id is distinct from '6Glik2KeDcA';

commit;
