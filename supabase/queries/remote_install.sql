-- Read-only checks for Send to Quest. Run in the Supabase SQL editor after the
-- remote install migrations. These statements do not change data.
-- needs_files = 'true' means the APK install still needs the player's game files.

-- Send clicks, split by phone/desktop and by whether game files are required.
select
  date_trunc('day', created_at) as day,
  device,
  props->>'needs_files' as needs_files,
  count(*) as send_clicks
from public.analytics_events
where event = 'remote_send_click'
group by 1, 2, 3
order by 1 desc, 2, 3;

-- Pair funnel: modal shown, success, failure, and "app has no Remote install".
select
  date_trunc('day', created_at) as day,
  event,
  coalesce(props->>'reason', props->>'surface', '') as detail,
  count(*) as n
from public.analytics_events
where event in (
  'remote_pair_shown',
  'remote_pair_success',
  'remote_pair_fail',
  'remote_app_outdated'
)
group by 1, 2, 3
order by 1 desc, 2, 3;

-- Requests by status. The table is the source of truth; remote_status events can miss a closed tab.
select status, needs_files, count(*) as n
from public.remote_install_requests
group by 1, 2
order by 1, 2;

-- Installs per day: remote (method) vs USB (install_success with no remote method, not the /app installer).
select
  date_trunc('day', created_at) as day,
  count(*) filter (
    where event = 'install_success' and props->>'method' = 'remote'
  ) as remote_installs,
  count(*) filter (
    where event = 'install_success'
      and coalesce(props->>'method', 'usb') <> 'remote'
      and path is distinct from '/app'
  ) as usb_installs,
  count(*) filter (
    where event = 'install_success'
      and props->>'method' = 'remote'
      and props->>'needs_files' = 'true'
  ) as remote_needs_files
from public.analytics_events
where event = 'install_success'
group by 1
order by 1 desc;

-- Time to install, seconds from queue to installed. p50 and p90, overall and by needs_files.
select
  needs_files,
  count(*) as installed,
  percentile_cont(0.5) within group (
    order by extract(epoch from (installed_at - created_at))
  ) as p50_seconds,
  percentile_cont(0.9) within group (
    order by extract(epoch from (installed_at - created_at))
  ) as p90_seconds,
  percentile_cont(0.5) within group (
    order by extract(epoch from (received_at - created_at))
  ) as p50_queue_seconds
from public.remote_install_requests
where status = 'installed'
  and installed_at is not null
group by needs_files
order by needs_files;

-- By headset model.
select
  d.model,
  r.status,
  r.needs_files,
  count(*) as n
from public.remote_install_requests r
join public.remote_devices d on d.id = r.device_id
group by 1, 2, 3
order by 1, 2, 3;
