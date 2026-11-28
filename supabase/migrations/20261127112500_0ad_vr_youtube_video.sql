-- 0 A.D. VR Mod + Download: https://www.youtube.com/watch?v=VthjeJ8kOoI
-- The video's description links to https://github.com/SgtBilko76/0AD-VR/releases.
-- YouTube's Share > Embed provides an iframe for this video.
-- Preserve any video already set by a curator; safe to run more than once.
update public.ports
set youtube_video_id = 'VthjeJ8kOoI'
where slug = '0ad-vr'
  and youtube_video_id is null;
