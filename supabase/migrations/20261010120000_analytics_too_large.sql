-- Allow install_error reason too_large.
-- WebUSB reports this when the APK proxy refuses to stream a file over the size cap.
-- props.reason is checked, so the old allowlist would reject the insert.
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.

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
      'other'
    )
  );
