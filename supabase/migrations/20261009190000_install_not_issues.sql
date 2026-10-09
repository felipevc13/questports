-- Automatic installs are not "works with issues".
--
-- One-click install used to store result = 'works_with_issues' when the site
-- could not see game data files. Players often install the APK here and copy
-- those files with SideQuest or a USB file manager, so that result made
-- working ports look broken.
--
-- This does not rewrite stored rows. The public summary view presents an
-- automatic install as a positive install:
--   * source = 'install' and result = 'works_with_issues' is shown as works
--   * checks.data_copied_by_site is filled from game_files_detected when the
--     neutral flag was not stored yet (false = files were not sent through
--     the site; that is not a failure)
-- Manual rows are unchanged. Only a manual check can be issues or broken.
--
-- Apply this manually in the Supabase SQL editor after review. Do not run it
-- from CI.
--
-- Read-only preview of catalog card labels. Run this SELECT on its own.
-- It writes nothing. label_before is the previous card line. label_after is
-- the short line (headset moves to the title). Rows here are the ports whose
-- card label changes.
--
-- with approved as (
--   select
--     v.port_slug,
--     p.title,
--     v.source,
--     v.result,
--     v.headset_model,
--     v.checked_at,
--     lower(regexp_replace(btrim(v.tested_version), '^[vV]+', '')) as tested_key,
--     lower(regexp_replace(btrim(coalesce(p.latest_version, '')), '^[vV]+', '')) as catalog_key
--   from public.port_verifications v
--   join public.ports p on p.slug = v.port_slug
--   where v.moderation_status = 'approved'
-- ),
-- current_rows as (
--   select * from approved
--   where tested_key <> '' and catalog_key <> '' and tested_key = catalog_key
-- ),
-- latest_manual as (
--   select distinct on (port_slug) *
--   from current_rows
--   where source = 'manual'
--   order by port_slug, checked_at desc
-- ),
-- latest_install as (
--   select distinct on (port_slug) *
--   from current_rows
--   where source = 'install'
--     and result in ('works', 'works_with_issues')
--   order by port_slug, checked_at desc
-- ),
-- latest_any as (
--   select distinct on (port_slug) *
--   from approved
--   order by port_slug, checked_at desc
-- ),
-- labels as (
--   select
--     a.port_slug,
--     a.title,
--     a.headset_model as headset_before,
--     case
--       when a.tested_key = '' or a.catalog_key = '' or a.tested_key <> a.catalog_key then
--         case
--           when a.result in ('works', 'works_with_issues')
--             then '⚠ Update not tested · ' || a.headset_model
--           else '(none)'
--         end
--       when a.result = 'works_with_issues' then '⚠ Works with issues · ' || a.headset_model
--       when a.result = 'works' then '✓ Verified · ' || a.headset_model
--       else '(none)'
--     end as label_before,
--     case
--       when m.result = 'works_with_issues' then '⚠ Issues'
--       when m.result = 'works' then '✓ Verified'
--       when m.result = 'doesnt_work' then '(none)'
--       when i.port_slug is not null then '✓ Installed'
--       else '(none)'
--     end as label_after,
--     coalesce(m.headset_model, i.headset_model) as headset_after
--   from latest_any a
--   left join latest_manual m on m.port_slug = a.port_slug
--   left join latest_install i on i.port_slug = a.port_slug
-- )
-- select port_slug, title, label_before, label_after, headset_before, headset_after
-- from labels
-- where label_before is distinct from label_after
-- order by port_slug;

create or replace view public.port_verification_summaries
with (security_invoker = true) as
select distinct on (port_slug, headset_model)
  id,
  port_id,
  port_slug,
  tested_version,
  headset_model,
  checked_at,
  source,
  case
    when source = 'install'
      and not (checks ? 'data_copied_by_site')
      and jsonb_typeof(checks -> 'game_files_detected') = 'boolean'
    then checks || jsonb_build_object('data_copied_by_site', checks -> 'game_files_detected')
    else checks
  end as checks,
  case
    when source = 'install' and result = 'works_with_issues' then 'works'
    else result
  end as result,
  notes,
  moderation_status
from public.port_verifications
where moderation_status = 'approved'
order by port_slug, headset_model, checked_at desc;

comment on view public.port_verification_summaries is
  'Latest approved check per port and headset. Automatic installs are presented as a positive install (works), never as issues. Missing game files stay on checks.data_copied_by_site. Invoker RLS still applies.';

comment on column public.port_verifications.checks is
  'apk_installed, game_files_detected, storage_path_confirmed, and data_copied_by_site. On an automatic install, data_copied_by_site false means the site did not copy game files. That is not a failure.';

comment on column public.port_verifications.result is
  'manual rows may be works, works_with_issues, or doesnt_work. install rows are works when the APK installed. Older install rows may still say works_with_issues; the summary view presents those as works.';

revoke all on table public.port_verification_summaries from public, anon, authenticated;
grant select on table public.port_verification_summaries to anon, authenticated, service_role;

notify pgrst, 'reload schema';
