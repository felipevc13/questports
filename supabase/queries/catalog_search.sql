-- Catalog search and request-this-game.
-- Read-only. Run in the Supabase SQL editor after applying
-- supabase/migrations/20261027020000_analytics_catalog_search.sql.
-- Set deployed_at below to the production deploy that shipped alias search.
-- visitor_hash is a daily salt. These queries do not select it.

-- Searches per UTC day. `search` is still one event per settled query.
select (created_at at time zone 'utc')::date as day,
       count(*) as searches
from public.analytics_events
where event = 'search'
group by 1
order by 1 desc
limit 60;

-- Zero-result rate before and after the deploy.
-- search_no_results is the miss event both before and after this change,
-- so the rate stays comparable. `props.count = 0` is the same miss after the deploy.
with bounds as (
  select timestamptz '2026-10-27 00:00:00+00' as deployed_at
)
select
  case when e.created_at < b.deployed_at then 'before' else 'after' end as period,
  count(*) filter (where e.event = 'search') as searches,
  count(*) filter (where e.event = 'search_no_results') as zero_result_events,
  round(
    100.0 * count(*) filter (where e.event = 'search_no_results')
    / nullif(count(*) filter (where e.event = 'search'), 0),
    1
  ) as zero_result_pct
from public.analytics_events e
cross join bounds b
where e.event in ('search', 'search_no_results')
  and e.created_at >= b.deployed_at - interval '30 days'
group by 1
order by 1;

-- Top zero-result queries in the last 30 days.
select props->>'q' as query,
       count(*) as misses
from public.analytics_events
where event = 'search_no_results'
  and created_at >= now() - interval '30 days'
group by 1
order by misses desc, query
limit 40;

-- Alias-driven searches that were followed by a click.
-- The search says via = alias. The click within 30 minutes stores the same
-- normalized query, the port slug, and whether that row matched by alias.
select
  s.props->>'q' as query,
  c.port_slug,
  c.props->>'position' as position,
  c.props->>'via' as click_via,
  count(*) as clicks
from public.analytics_events s
join public.analytics_events c
  on c.event = 'search_result_click'
 and c.props->>'q' = s.props->>'q'
 and c.visitor_hash is not distinct from s.visitor_hash
 and c.created_at >= s.created_at
 and c.created_at < s.created_at + interval '30 minutes'
where s.event = 'search'
  and s.props->>'via' = 'alias'
  and s.created_at >= now() - interval '30 days'
group by 1, 2, 3, 4
order by clicks desc, query
limit 40;

-- Request-this-game funnel for the last 30 days.
select
  count(*) filter (where event = 'game_request_shown') as shown,
  count(*) filter (where event = 'game_request_click') as clicked,
  count(*) filter (where event = 'game_request_submit' and props->>'result' = 'success') as submitted,
  count(*) filter (where event = 'game_request_submit' and props->>'result' = 'fail') as failed
from public.analytics_events
where event in ('game_request_shown', 'game_request_click', 'game_request_submit')
  and created_at >= now() - interval '30 days';
