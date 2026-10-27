-- install_error may store a short detail next to reason, and two new reasons:
-- signature_conflict (the headset already has the package signed with another key)
-- busy (the app reported another install already in progress).
-- install_success may store recovered=true when the result was inferred after a reload.
-- props stay inside the existing 400-byte cap. Apply in the SQL editor after merge.
-- Do not run this from CI.

alter table public.analytics_events drop constraint if exists analytics_events_install_error_reason;

alter table public.analytics_events
  add constraint analytics_events_install_error_reason check (
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
      'too_large',
      'signature_conflict',
      'busy',
      'other'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_install_error_detail;

alter table public.analytics_events
  add constraint analytics_events_install_error_detail check (
    event <> 'install_error'
    or props->>'detail' is null
    or (
      char_length(props->>'detail') between 1 and 80
      and props->>'detail' ~ '^[A-Za-z0-9][A-Za-z0-9 ._:/=+-]{0,79}$'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_install_success_recovered;

alter table public.analytics_events
  add constraint analytics_events_install_success_recovered check (
    event <> 'install_success'
    or props->>'recovered' is null
    or props->>'recovered' = 'true'
  );
