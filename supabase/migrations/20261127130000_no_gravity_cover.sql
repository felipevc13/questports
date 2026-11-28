-- After the port insert and after the cover and thumbnail are published to the media host.
-- Source and rights caveat: docs/new-port-cover-sources.md. No media deployment is done here.
-- Preserve any existing non-null cover, including one manually chosen in production.
begin;

update public.ports
set cover_image_url = 'https://questports-media.questports.workers.dev/covers/no-gravity-vr.jpg'
where slug = 'no-gravity-vr'
  and cover_image_url is null;

commit;
