-- First-party usage stats for QuestPorts.
-- Apply this manually in the Supabase SQL editor after merge. Do not run it from CI.
-- The browser anon key cannot read or insert. The Nuxt server inserts with the service role.
-- No cookies. visitor_hash rotates daily and is not a raw IP or user-agent.

create table if not exists public.analytics_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  event text not null,
  path text,
  port_slug text,
  headset text,
  referrer_host text,
  country text,
  device text,
  browser text,
  webusb boolean,
  visitor_hash text,
  props jsonb,
  constraint analytics_events_event_check check (
    event in (
      'page_view',
      'port_view',
      'install_click',
      'install_success',
      'install_error',
      'manual_download_click',
      'github_click',
      'suggest_submit',
      'feedback_submit',
      'filter_used',
      'search',
      'unsupported_browser_view'
    )
  ),
  constraint analytics_events_device_check check (
    device is null or device in ('mobile', 'desktop', 'tablet')
  ),
  constraint analytics_events_path_len check (path is null or char_length(path) between 1 and 200),
  constraint analytics_events_slug check (
    port_slug is null or port_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint analytics_events_headset_len check (headset is null or char_length(headset) between 1 and 40),
  constraint analytics_events_referrer_len check (
    referrer_host is null or char_length(referrer_host) between 1 and 253
  ),
  constraint analytics_events_country check (country is null or country ~ '^[A-Z]{2}$'),
  constraint analytics_events_browser_len check (browser is null or char_length(browser) between 1 and 32),
  constraint analytics_events_visitor_hash check (
    visitor_hash is null or visitor_hash ~ '^[a-f0-9]{64}$'
  ),
  constraint analytics_events_props_object check (props is null or jsonb_typeof(props) = 'object'),
  constraint analytics_events_props_size check (
    props is null or octet_length(props::text) <= 400
  ),
  constraint analytics_events_install_error_reason check (
    event <> 'install_error'
    or props->>'reason' in (
      'user_cancelled',
      'no_webusb',
      'adb_fail',
      'download_fail',
      'storage',
      'unauthorized',
      'usb_locked',
      'pm_fail',
      'timeout',
      'other'
    )
  ),
  constraint analytics_events_filter_used check (
    event <> 'filter_used'
    or (
      props->>'filter' in ('category', 'status', 'hardware', 'developer', 'quest', 'sort')
      and char_length(coalesce(props->>'value', '')) between 1 and 60
    )
  ),
  constraint analytics_events_search_query check (
    event <> 'search'
    or (
      char_length(coalesce(props->>'q', '')) between 1 and 60
      and props->>'q' = lower(props->>'q')
      and (props->>'length') ~ '^[0-9]+$'
      and (props->>'length')::integer between 1 and 500
      and (props->>'length')::integer >= char_length(props->>'q')
    )
  )
);

comment on table public.analytics_events is
  'Anonymous product events. Inserts are server-only. No public read. visitor_hash changes every UTC day.';

comment on column public.analytics_events.visitor_hash is
  'SHA-256 of a daily salt, the IP, and the user-agent. The salt rotates at UTC midnight. Raw IP and user-agent are not stored.';

comment on column public.analytics_events.country is
  'ISO country from the Vercel x-vercel-ip-country header. Not a precise location.';

comment on column public.analytics_events.props is
  'Small event details. Search stores a lowercased query cut to 60 characters plus its length, never the raw IP.';

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at);

create index if not exists analytics_events_event_created_at_idx
  on public.analytics_events (event, created_at);

create index if not exists analytics_events_port_slug_idx
  on public.analytics_events (port_slug);

alter table public.analytics_events enable row level security;

-- No policies: anon and authenticated cannot select or insert. Service role bypasses RLS.

revoke all on table public.analytics_events from public;
revoke all on table public.analytics_events from anon, authenticated;
grant all on table public.analytics_events to service_role;

revoke all on sequence public.analytics_events_id_seq from public, anon, authenticated;
grant usage, select on sequence public.analytics_events_id_seq to service_role;

-- Daily counts. security_invoker keeps RLS in force for any role that can select.
create or replace view public.analytics_daily
with (security_invoker = true) as
select
  (created_at at time zone 'utc')::date as day,
  event,
  count(*)::bigint as count,
  count(distinct visitor_hash)::bigint as unique_visitors
from public.analytics_events
group by 1, 2;

comment on view public.analytics_daily is
  'Events per UTC day, with distinct visitor hashes. Not granted to anon or authenticated.';

-- Last 30 days of port traffic and install funnel counts.
create or replace view public.analytics_top_ports
with (security_invoker = true) as
select
  port_slug,
  count(*) filter (where event = 'port_view')::bigint as views,
  count(*) filter (where event = 'install_click')::bigint as install_clicks,
  count(*) filter (where event = 'install_success')::bigint as install_successes
from public.analytics_events
where created_at >= now() - interval '30 days'
  and port_slug is not null
  and event in ('port_view', 'install_click', 'install_success')
group by port_slug;

comment on view public.analytics_top_ports is
  'Per-port views, install clicks, and install successes for the last 30 days.';

revoke all on table public.analytics_daily from public, anon, authenticated;
revoke all on table public.analytics_top_ports from public, anon, authenticated;
grant select on table public.analytics_daily to service_role;
grant select on table public.analytics_top_ports to service_role;

notify pgrst, 'reload schema';
