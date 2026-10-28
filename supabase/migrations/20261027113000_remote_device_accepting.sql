-- Whether the headset app is accepting Send to Quest requests.
-- Apply this manually in the Supabase SQL editor after merge. Do not run it from CI.
-- Null means this app build has not reported the toggle. Do not default it to true or false.

alter table public.remote_devices
  add column if not exists accepting_requests boolean;

comment on column public.remote_devices.accepting_requests is
  'Null until the headset app reports it. False means Accept install requests is off.';
