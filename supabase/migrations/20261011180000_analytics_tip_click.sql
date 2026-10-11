-- Allow the tip_click event.
-- props.surface is install_success (the one-click success line) or footer.
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
      'tip_click'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_tip_click_check;

alter table public.analytics_events
  add constraint analytics_events_tip_click_check check (
    event <> 'tip_click'
    or props->>'surface' in ('install_success', 'footer')
  );
