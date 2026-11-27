-- REVIEW ONLY. Read-only preflight for PR #174. No mutations.
-- Run only on an explicitly authorized, disposable staging database with the intended schema.
-- These queries inspect state; they do not prove target media is deployed or legally licensed.
begin transaction read only;
select current_database(), current_user;
-- In the repository base schema 'decompilation' is missing; update_categories.sql adds it,
-- but is outside the migrations directory. Confirm actual type and label in the target.
select a.attname, format_type(a.atttypid, a.atttypmod) as actual_type
from pg_attribute a where a.attrelid = 'public.ports'::regclass
and a.attname in ('slug','category') and not a.attisdropped;
select t.typname, e.enumlabel from pg_type t join pg_enum e on e.enumtypid=t.oid
where t.typname='port_category' order by e.enumsortorder;
-- Detect pre-existing rows: ON CONFLICT does not refresh old metadata.
with target(slug) as (values ('forza-horizon-vr'), ('gran-turismo-4-vr'), ('crash-bandicoot-launcher'), ('0ad-vr'), ('warzone-2100-vr'), ('no-gravity-vr'), ('rage-racer-vr'), ('wario-land-4-vr'))
select t.slug, p.slug is not null as exists_before, p.title, p.category, p.cover_image_url, p.youtube_video_id, p.port_download_url, p.latest_version
from target t left join public.ports p on p.slug=t.slug order by t.slug;
-- Confirm unique index usable as ON CONFLICT (slug) arbiter; inspect definition manually.
select indexname, indexdef from pg_indexes where schemaname='public' and tablename='ports';
rollback;
