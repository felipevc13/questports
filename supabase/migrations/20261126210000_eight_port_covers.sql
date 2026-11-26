-- Verified SteamGridDB capsule sources are listed in docs/new-port-cover-sources.md.
-- Apply manually after both port insert migrations, after merge; do not deploy media from an agent.
begin;

update public.ports
set cover_image_url = 'https://questports-media.questports.workers.dev/covers/forza-horizon-vr.png'
where slug = 'forza-horizon-vr' and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/forza-horizon-vr.png';

update public.ports
set cover_image_url = 'https://questports-media.questports.workers.dev/covers/gran-turismo-4-vr.png'
where slug = 'gran-turismo-4-vr' and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/gran-turismo-4-vr.png';

update public.ports
set cover_image_url = 'https://questports-media.questports.workers.dev/covers/crash-bandicoot-launcher.png'
where slug = 'crash-bandicoot-launcher' and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/crash-bandicoot-launcher.png';

update public.ports
set cover_image_url = 'https://questports-media.questports.workers.dev/covers/0ad-vr.png'
where slug = '0ad-vr' and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/0ad-vr.png';

update public.ports
set cover_image_url = 'https://questports-media.questports.workers.dev/covers/warzone-2100-vr.png'
where slug = 'warzone-2100-vr' and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/warzone-2100-vr.png';

update public.ports
set cover_image_url = 'https://questports-media.questports.workers.dev/covers/rage-racer-vr.png'
where slug = 'rage-racer-vr' and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/rage-racer-vr.png';

update public.ports
set cover_image_url = 'https://questports-media.questports.workers.dev/covers/wario-land-4-vr.jpg'
where slug = 'wario-land-4-vr' and cover_image_url is distinct from 'https://questports-media.questports.workers.dev/covers/wario-land-4-vr.jpg';

commit;
