-- Preserve a pre-existing curated video ID. Playback and rights require review.
begin;
update public.ports
set youtube_video_id = 'fdBW9pHtGyo'
where slug = 'wario-land-4-vr' and youtube_video_id is null;
commit;
