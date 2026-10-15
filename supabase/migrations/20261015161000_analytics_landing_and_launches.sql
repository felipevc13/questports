-- Landing attribution and two new events.
-- page_view may store utm_source, utm_medium, utm_campaign, and boolean
-- flags fbclid / gclid. The click-id values themselves are not stored.
-- referrer_host stays the external host only. The browser sends document.referrer
-- because the catalog HTML is cached without the query string.
-- game_launch: the headset app opened an installed game (port_slug required).
-- app_download_click: the QuestPorts app APK link. props.surface is page, banner, or modal.
-- app_open already requires props.version. This file does not change that check.
-- Do not drop analytics_events_install_step_check.
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
      'banner_shown',
      'banner_click',
      'banner_dismiss',
      'modal_shown',
      'modal_click',
      'modal_dismiss',
      'app_page_view',
      'app_open',
      'game_launch',
      'app_download_click'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_landing_check;

alter table public.analytics_events
  add constraint analytics_events_landing_check check (
    (props->>'utm_source' is null or props->>'utm_source' ~ '^[a-z0-9][a-z0-9._+-]{0,59}$')
    and (props->>'utm_medium' is null or props->>'utm_medium' ~ '^[a-z0-9][a-z0-9._+-]{0,59}$')
    and (props->>'utm_campaign' is null or props->>'utm_campaign' ~ '^[a-z0-9][a-z0-9._+-]{0,59}$')
    and (props->>'fbclid' is null or props->>'fbclid' = 'true')
    and (props->>'gclid' is null or props->>'gclid' = 'true')
  );

alter table public.analytics_events drop constraint if exists analytics_events_app_download_click_check;

alter table public.analytics_events
  add constraint analytics_events_app_download_click_check check (
    event <> 'app_download_click'
    or props->>'surface' in ('page', 'banner', 'modal')
  );
