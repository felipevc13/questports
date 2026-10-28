-- Add ip_hash, is_flagged moderation column, and index for rate limiting and audit.
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.

begin;

alter table public.port_community_reviews
  add column if not exists ip_hash text,
  add column if not exists is_flagged boolean not null default false;

create index if not exists idx_port_community_reviews_ip on public.port_community_reviews(ip_hash);

-- Refresh summaries to ignore flagged reviews
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
where is_flagged is false
group by port_slug;

create or replace view public.port_community_headset_summaries as
select
  port_slug,
  headset,
  verdict,
  count(*)::int as count
from public.port_community_reviews
where headset is not null and is_flagged is false
group by port_slug, headset, verdict;

commit;
