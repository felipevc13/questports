-- Steam/GOG funnel: do players who need PC game files get them onto the headset?
-- Read-only. Run in the Supabase SQL editor after applying
-- supabase/migrations/20261102120000_analytics_base_game_and_files_ready.sql
-- and after the deploy that ships base_game_click and game_files_ready.
-- visitor_hash is a daily salt, so a distinct count over 30 days is visitor-days, not people.
-- A port is "steam_gog" when ports.base_game_store mentions Steam or GOG.
-- The channel of an install: props.app = true is the QuestPorts app, props.method = 'remote'
-- is Send to Quest, anything else is the site over USB.
-- game_files_ready only fires on the site over USB. The app cannot see or copy game files.

-- 1. Funnel per group, last 30 days (visitor-days).
with p as (
  select slug,
         case when base_game_store ilike '%steam%' or base_game_store ilike '%gog%'
              then 'steam_gog' else 'other' end as grp
  from public.ports
),
e as (
  select e.*, p.grp
  from public.analytics_events e
  join p on p.slug = e.port_slug
  where e.created_at > now() - interval '30 days'
)
select grp,
       count(distinct (visitor_hash, port_slug)) filter (where event = 'port_view') as viewed,
       count(distinct (visitor_hash, port_slug)) filter (
         where event = 'base_game_click' and props->>'store' in ('steam', 'gog', 'store')
       ) as clicked_buy,
       count(distinct (visitor_hash, port_slug)) filter (where event = 'install_success') as installed_apk,
       count(distinct (visitor_hash, port_slug)) filter (
         where event = 'install_step' and props->>'step' = 'copy_game_files' and props->>'status' = 'start'
       ) as started_copy,
       count(distinct (visitor_hash, port_slug)) filter (where event = 'game_files_ready') as files_ready
from e
group by grp
order by grp;

-- 2. How the files got there, per group.
select case when p.base_game_store ilike '%steam%' or p.base_game_store ilike '%gog%'
            then 'steam_gog' else 'other' end as grp,
       e.props->>'source' as source,
       count(*) as events
from public.analytics_events e
join public.ports p on p.slug = e.port_slug
where e.event = 'game_files_ready'
  and e.created_at > now() - interval '30 days'
group by 1, 2
order by 1, 3 desc;

-- 3. APK installs by channel for Steam/GOG ports. App installs end without the files.
select case
         when e.props->>'app' = 'true' then 'app'
         when e.props->>'method' = 'remote' then 'remote'
         else 'usb'
       end as channel,
       count(*) as installs
from public.analytics_events e
join public.ports p on p.slug = e.port_slug
where e.event = 'install_success'
  and (p.base_game_store ilike '%steam%' or p.base_game_store ilike '%gog%')
  and e.created_at > now() - interval '30 days'
group by 1
order by 2 desc;

-- 4. Per Steam/GOG port: views, buy clicks by store, installs, files ready.
select e.port_slug,
       count(*) filter (where e.event = 'port_view') as views,
       count(*) filter (where e.event = 'base_game_click' and e.props->>'store' = 'steam') as steam_clicks,
       count(*) filter (where e.event = 'base_game_click' and e.props->>'store' = 'gog') as gog_clicks,
       count(*) filter (where e.event = 'install_success') as installs,
       count(*) filter (where e.event = 'game_files_ready') as files_ready
from public.analytics_events e
join public.ports p on p.slug = e.port_slug
where (p.base_game_store ilike '%steam%' or p.base_game_store ilike '%gog%')
  and e.created_at > now() - interval '30 days'
group by e.port_slug
order by views desc;
