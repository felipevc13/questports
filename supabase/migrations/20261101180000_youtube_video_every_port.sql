-- Every port gets a YouTube video on its detail page. These 28 ports had
-- ports.youtube_video_id = null. Where a Quest standalone video of the port
-- exists it is used; otherwise the video is gameplay of the original game
-- (arcade, N64, PC, GameCube...) so no port is left without one.
--
-- Only fills a value that is currently null. No row is created, no column
-- changes, and a re-run changes nothing.
--
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.
--
-- Preview before applying:
--
-- select p.slug, p.youtube_video_id as before, v.id as after
-- from public.ports p join (values
    ('arx-libertatis-vr', 'jdG2odCw4Fw'),
    ('openmw-vr', '39rUsiT9f3E'),
    ('openxwa-vr', '9T56MfARjYY'),
    ('sin-and-punishment-vr', '3sfdxeGjyqg'),
    ('smash-remix-vr', 'KUdArzkmTLI'),
    ('wave-race-64-vr', 'Oi-Kz4Y-8Lw'),
    ('bomberman-hero-vr', '58m7nHRhGhk'),
    ('18-wheeler-vr', 'HyZ3hFVmHOs'),
    ('behind-enemy-lines-vr', 'k_YhddRrvDU'),
    ('mystical-ninja-vr', 'eY7IhAR5LqU'),
    ('animal-crossing-vr', 'qXONlV97YAQ'),
    ('carnevil-vr', 'bqyUFgN5OUU'),
    ('daggerfall-unity-vr', 'artpN5o2vKc'),
    ('descent-1-2-vr', 'JQkiFOKlkl4'),
    ('descent-3-vr', '0M3W7Glswu0'),
    ('ghost-squad-evolution-vr', 'zov4RGwmpf0'),
    ('gothic2-vr', 'dbsjnLCVw-8'),
    ('gran-turismo-3-vr', 'UQzIiN9SwvE'),
    ('gunblade-ny-vr', 'jOfONbACBTA'),
    ('hotd4-vr', 'jBh8O0l8iug'),
    ('magic-carpet-vr', 'i07CSd0f8VI'),
    ('mega-man-64-vr', 'PUUKNAc8wpw'),
    ('opentie-vr', 'IYks9ZfupZ0'),
    ('questsam', 'Zw1phT4fK0Y'),
    ('rail-chase-2-vr', 'mHj4Gr_SY7Q'),
    ('teraburst-vr', '2MPzU1OBpZU'),
    ('virtua-cop-2-vr', 'Wd_cD4H6gsE'),
    ('wwf-no-mercy-vr', 'tFMdpnK-bg8')
-- ) as v(slug, id) on v.slug = p.slug
-- where p.youtube_video_id is distinct from v.id;

begin;

update public.ports p
   set youtube_video_id = v.id
  from (values
    ('arx-libertatis-vr', 'jdG2odCw4Fw'),
    ('openmw-vr', '39rUsiT9f3E'),
    ('openxwa-vr', '9T56MfARjYY'),
    ('sin-and-punishment-vr', '3sfdxeGjyqg'),
    ('smash-remix-vr', 'KUdArzkmTLI'),
    ('wave-race-64-vr', 'Oi-Kz4Y-8Lw'),
    ('bomberman-hero-vr', '58m7nHRhGhk'),
    ('18-wheeler-vr', 'HyZ3hFVmHOs'),
    ('behind-enemy-lines-vr', 'k_YhddRrvDU'),
    ('mystical-ninja-vr', 'eY7IhAR5LqU'),
    ('animal-crossing-vr', 'qXONlV97YAQ'),
    ('carnevil-vr', 'bqyUFgN5OUU'),
    ('daggerfall-unity-vr', 'artpN5o2vKc'),
    ('descent-1-2-vr', 'JQkiFOKlkl4'),
    ('descent-3-vr', '0M3W7Glswu0'),
    ('ghost-squad-evolution-vr', 'zov4RGwmpf0'),
    ('gothic2-vr', 'dbsjnLCVw-8'),
    ('gran-turismo-3-vr', 'UQzIiN9SwvE'),
    ('gunblade-ny-vr', 'jOfONbACBTA'),
    ('hotd4-vr', 'jBh8O0l8iug'),
    ('magic-carpet-vr', 'i07CSd0f8VI'),
    ('mega-man-64-vr', 'PUUKNAc8wpw'),
    ('opentie-vr', 'IYks9ZfupZ0'),
    ('questsam', 'Zw1phT4fK0Y'),
    ('rail-chase-2-vr', 'mHj4Gr_SY7Q'),
    ('teraburst-vr', '2MPzU1OBpZU'),
    ('virtua-cop-2-vr', 'Wd_cD4H6gsE'),
    ('wwf-no-mercy-vr', 'tFMdpnK-bg8')
  ) as v(slug, id)
 where p.slug = v.slug
   and p.youtube_video_id is null;

commit;
