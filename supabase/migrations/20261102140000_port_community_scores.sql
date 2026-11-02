-- Player report counts for the catalog's dense table.
-- Apply this manually in the Supabase SQL editor after merge. Do not run it from CI.
-- Until it is applied, the catalog request that embeds ports_community_score fails and
-- usePorts falls back to the install-count request, so the Players column shows "—".
--
-- port_community_reviews and port_community_summaries are service_role only
-- (20261028120000). The summary view is not security_invoker, so it is not granted to anon.
-- Same shape as the install counts (20261009201000): a security definer function in
-- private returns counts only (no device_id, no ip_hash), a security_invoker view
-- reads it, and public.ports_community_score(ports) lets the catalog embed it.
-- Flagged reviews are excluded, like port_community_summaries.

create schema if not exists private;

create or replace function private.port_community_score_rows()
returns table (
  port_slug text,
  total_reviews integer,
  works_great_count integer,
  needs_tweaks_count integer,
  cant_run_count integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    r.port_slug,
    count(*)::integer as total_reviews,
    count(*) filter (where r.verdict = 'works_great')::integer as works_great_count,
    count(*) filter (where r.verdict = 'needs_tweaks')::integer as needs_tweaks_count,
    count(*) filter (where r.verdict = 'cant_run')::integer as cant_run_count
  from public.port_community_reviews r
  where r.is_flagged is false
  group by r.port_slug
$$;

comment on function private.port_community_score_rows() is
  'Player report counts per port, flagged rows excluded. Does not return device_id or ip_hash.';

revoke all on function private.port_community_score_rows() from public, anon, authenticated;
grant execute on function private.port_community_score_rows() to anon, authenticated, service_role;

create or replace view public.port_community_scores
with (security_invoker = true) as
select port_slug, total_reviews, works_great_count, needs_tweaks_count, cant_run_count
from private.port_community_score_rows();

comment on view public.port_community_scores is
  'Player report counts per port. security_invoker. Counts come from private.port_community_score_rows.';

revoke all on table public.port_community_scores from public, anon, authenticated;
grant select on table public.port_community_scores to anon, authenticated, service_role;

-- One catalog request can embed this. Argument type public.ports is what
-- PostgREST uses as the relationship. The body reads the aggregate view only.
create or replace function public.ports_community_score(port public.ports)
returns setof public.port_community_scores
language sql
stable
security invoker
set search_path = ''
as $$
  select s.port_slug, s.total_reviews, s.works_great_count, s.needs_tweaks_count, s.cant_run_count
  from public.port_community_scores s
  where s.port_slug = port.slug
$$;

comment on function public.ports_community_score(public.ports) is
  'Catalog embed: player report counts for one port. Does not read device ids.';

revoke all on function public.ports_community_score(public.ports) from public, anon, authenticated;
grant execute on function public.ports_community_score(public.ports) to anon, authenticated, service_role;

notify pgrst, 'reload schema';
