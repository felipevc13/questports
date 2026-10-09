-- Install counts for catalog cards.
-- Apply this manually in the Supabase SQL editor after review. Do not run it
-- from CI.
--
-- RLS on public.port_verifications already lets anon and authenticated read
-- approved rows (policy "Public reads approved port verifications"). That is
-- not enough to count distinct devices: device_fingerprint and ip_hash are
-- omitted from the column grant, on purpose. A security_invoker view that
-- referenced device_fingerprint would fail for those roles, and granting the
-- column would expose the hashes through the Data API.
--
-- private.port_install_count_rows() is security definer and returns only
-- port_slug, installs, and last_install_at. It never selects the hash columns
-- into the result. The public view is security_invoker and only calls that
-- function, so pending and rejected rows stay out (the function filters
-- moderation_status = 'approved') and hashes stay out of the API.
--
-- installs = count(distinct device_fingerprint) over approved source='install'
-- rows whose result is works or works_with_issues, all versions. Rows with a
-- null fingerprint cannot be deduped, so each of those counts (count(*)).
-- public.ports_install_count(ports) lets the catalog embed the count in the
-- same ports request. It is security invoker and reads the aggregate view only.

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create or replace function private.port_install_count_rows()
returns table (
  port_slug text,
  installs bigint,
  last_install_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    v.port_slug,
    (
      count(distinct v.device_fingerprint) filter (where v.device_fingerprint is not null)
      + count(*) filter (where v.device_fingerprint is null)
    )::bigint as installs,
    max(v.checked_at) as last_install_at
  from public.port_verifications v
  where v.moderation_status = 'approved'
    and v.source = 'install'
    and v.result in ('works', 'works_with_issues')
  group by v.port_slug
$$;

comment on function private.port_install_count_rows() is
  'Distinct devices that installed each port through QuestPorts. Approved install rows only, all versions. Does not return device_fingerprint or ip_hash.';

revoke all on function private.port_install_count_rows() from public, anon, authenticated;
grant execute on function private.port_install_count_rows() to anon, authenticated, service_role;

create or replace view public.port_install_counts
with (security_invoker = true) as
select port_slug, installs, last_install_at
from private.port_install_count_rows();

comment on view public.port_install_counts is
  'port_slug, installs, last_install_at. security_invoker. Counts come from private.port_install_count_rows so hashes are not exposed.';

revoke all on table public.port_install_counts from public, anon, authenticated;
grant select on table public.port_install_counts to anon, authenticated, service_role;

create index if not exists port_verifications_install_count_idx
  on public.port_verifications (port_slug, device_fingerprint, checked_at desc)
  where moderation_status = 'approved'
    and source = 'install'
    and result in ('works', 'works_with_issues');

-- One catalog request can embed this. Argument type public.ports is what
-- PostgREST uses as the relationship. The body reads the aggregate view only.
create or replace function public.ports_install_count(port public.ports)
returns setof public.port_install_counts
language sql
stable
security invoker
set search_path = ''
as $$
  select c.port_slug, c.installs, c.last_install_at
  from public.port_install_counts c
  where c.port_slug = port.slug
$$;

comment on function public.ports_install_count(public.ports) is
  'Catalog embed: install count for one port. Does not read device fingerprints.';

revoke all on function public.ports_install_count(public.ports) from public, anon, authenticated;
grant execute on function public.ports_install_count(public.ports) to anon, authenticated, service_role;

notify pgrst, 'reload schema';
