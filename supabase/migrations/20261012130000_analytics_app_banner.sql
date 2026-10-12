-- Allow the Quest Browser app banner events.
-- banner_view, banner_click, and banner_dismiss have no extra props:
-- the event name is the signal. App installs reuse install_click and
-- install_success with path /app and a null port_slug, so this file
-- does not add an install event.
-- Apply this manually in the Supabase SQL editor. Do not run it from CI.

alter table public.analytics_events drop constraint if exists analytics_events_event_check;

alter table public.analytics_events
  add constraint analytics_events_event_check check (
    event in (
      'page_view',
      'port_view',
      'install_click',
      'install_success',
      'install_error',
      'install_step',
      'manual_download_click',
      'github_click',
      'suggest_submit',
      'feedback_submit',
      'filter_used',
      'search',
      'search_no_results',
      'unsupported_browser_view',
      'video_preview_play',
      'tip_click',
      'banner_view',
      'banner_click',
      'banner_dismiss'
    )
  );
