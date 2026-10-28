-- Retention policy for analytics_events: prune raw events older than 60 days
-- to keep the database well within the Supabase 500 MB free tier limit.
-- Apply this manually in the Supabase SQL editor after review. Do not run it from CI.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to service_role;

create or replace function private.prune_old_analytics_events(retention_days integer default 60)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_count bigint;
begin
  if retention_days is null or retention_days < 7 then
    raise exception 'retention_days must be at least 7';
  end if;

  delete from public.analytics_events
  where created_at < (now() - (retention_days || ' days')::interval);
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

comment on function private.prune_old_analytics_events(integer) is
  'Prunes public.analytics_events older than retention_days (default 60). Security definer, callable by service_role.';

revoke all on function private.prune_old_analytics_events(integer) from public, anon, authenticated;
grant execute on function private.prune_old_analytics_events(integer) to service_role;
