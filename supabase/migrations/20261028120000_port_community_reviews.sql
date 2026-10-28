-- Community Reports & Reviews (MVP).
-- Collects anonymous semantic feedback on port playability per device.
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.

begin;

create table if not exists public.port_community_reviews (
  id uuid primary key default gen_random_uuid(),
  port_slug text not null references public.ports(slug) on delete cascade,
  device_id uuid not null,
  verdict text not null check (verdict in ('works_great', 'needs_tweaks', 'cant_run')),
  issue_tag text check (
    issue_tag is null or (
      verdict in ('needs_tweaks', 'cant_run') and
      issue_tag in ('wont_launch', 'missing_files', 'controls_broken', 'low_fps', 'motion_sickness')
    )
  ),
  headset text check (headset is null or headset in ('Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro')),
  port_version text,
  source text not null default 'web' check (source in ('app_launch', 'app_browse', 'web')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint port_community_reviews_unique_device_port unique (port_slug, device_id)
);

create index if not exists idx_port_community_reviews_slug on public.port_community_reviews(port_slug);

-- Auto-update updated_at on record changes
create or replace function public.set_port_community_reviews_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_port_community_reviews_updated_at on public.port_community_reviews;
create trigger set_port_community_reviews_updated_at
  before update on public.port_community_reviews
  for each row
  execute function public.set_port_community_reviews_updated_at();

-- Aggregated summary per port
create or replace view public.port_community_summaries as
select
  port_slug,
  count(*)::int as total_reviews,
  count(*) filter (where verdict = 'works_great')::int as works_great_count,
  count(*) filter (where verdict = 'needs_tweaks')::int as needs_tweaks_count,
  count(*) filter (where verdict = 'cant_run')::int as cant_run_count,
  count(*) filter (where source = 'app_launch')::int as app_verified_count,
  round(
    (count(*) filter (where verdict in ('works_great', 'needs_tweaks'))::numeric / nullif(count(*), 0)) * 100
  )::int as works_pct,
  max(updated_at) as last_review_at
from public.port_community_reviews
group by port_slug;

-- Headset-specific breakdown per port
create or replace view public.port_community_headset_summaries as
select
  port_slug,
  headset,
  verdict,
  count(*)::int as count
from public.port_community_reviews
where headset is not null
group by port_slug, headset, verdict;

-- Security & Permissions:
-- Anon cannot read or modify the raw table or views directly.
-- Server endpoints read and write via service_role.
alter table public.port_community_reviews enable row level security;

revoke all on public.port_community_reviews from public, anon, authenticated;
revoke all on public.port_community_summaries from public, anon, authenticated;
revoke all on public.port_community_headset_summaries from public, anon, authenticated;

grant select, insert, update on public.port_community_reviews to service_role;
grant select on public.port_community_summaries to service_role;
grant select on public.port_community_headset_summaries to service_role;

commit;

