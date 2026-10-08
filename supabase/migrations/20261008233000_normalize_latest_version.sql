-- Normalize public.ports.latest_version to the same shape as formatPortVersion
-- in app/lib/versionFormat.js.
--
-- Apply this manually in the Supabase SQL editor. Do not run it from CI,
-- and do not apply it from an agent against production.
--
-- Semver-like values gain exactly one leading "v" (1.0.84 -> v1.0.84,
-- vv1.0.16 -> v1.0.16, 0.1.0-alpha -> v0.1.0-alpha). The rest of the string
-- is kept, including prerelease suffixes.
-- Build names stay build names (b004, b003, cats27).
-- Placeholders (Latest, and an empty string) become null. Nothing else is deleted.
--
-- Preview before applying:
--
-- select slug, latest_version as before, normalized.formatted as after
-- from public.ports
-- cross join lateral (
--   select case
--     when cleaned is null or cleaned = '' then null
--     when lower(cleaned) in ('latest', 'vlatest', 'none', 'n/a', 'na', 'unknown', 'null', 'undefined', 'tbd') then null
--     when cleaned ~* '^v+[0-9]' then 'v' || regexp_replace(cleaned, '^v+', '', 'i')
--     when cleaned ~ '^[0-9]' then 'v' || cleaned
--     else cleaned
--   end as formatted
--   from (
--     select btrim(regexp_replace(btrim(latest_version), '^winlatorxr[_-]', '', 'i')) as cleaned
--   ) stripped
-- ) normalized
-- where latest_version is distinct from normalized.formatted
-- order by slug;

begin;

update public.ports as p
set latest_version = normalized.formatted
from (
  select
    id,
    case
      when cleaned is null or cleaned = '' then null
      when lower(cleaned) in ('latest', 'vlatest', 'none', 'n/a', 'na', 'unknown', 'null', 'undefined', 'tbd') then null
      when cleaned ~* '^v+[0-9]' then 'v' || regexp_replace(cleaned, '^v+', '', 'i')
      when cleaned ~ '^[0-9]' then 'v' || cleaned
      else cleaned
    end as formatted
  from (
    select
      id,
      btrim(regexp_replace(btrim(latest_version), '^winlatorxr[_-]', '', 'i')) as cleaned
    from public.ports
  ) stripped
) as normalized
where p.id = normalized.id
  and p.latest_version is distinct from normalized.formatted;

commit;
