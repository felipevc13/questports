-- Catalog search outcome and the request-this-game funnel.
-- search still stores q and length, so existing dashboards keep working.
-- Optional on search: count, via (text, alias, fuzzy, none), and results (slugs the searcher saw).
-- A client that only sends q and length still inserts.
-- search_result_click: a click on a result or a "did you mean" row. port_slug is required.
-- game_request_shown, game_request_click, game_request_submit: the empty-state request.
-- game_request_submit props.result is success or fail. The query text is not an email.
-- Do not drop analytics_events_install_step_check or analytics_events_install_error_reason.
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
      'app_download_click',
      'search_result_click',
      'game_request_shown',
      'game_request_click',
      'game_request_submit'
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_search_query;

alter table public.analytics_events
  add constraint analytics_events_search_query check (
    event <> 'search'
    or (
      char_length(coalesce(props->>'q', '')) between 1 and 60
      and props->>'q' = lower(props->>'q')
      and (props->>'length') ~ '^[0-9]+$'
      and (props->>'length')::integer between 1 and 500
      and (props->>'length')::integer >= char_length(props->>'q')
      and (
        props->>'count' is null
        or (
          (props->>'count') ~ '^[0-9]+$'
          and (props->>'count')::integer between 0 and 500
        )
      )
      and (
        props->>'via' is null
        or props->>'via' in ('text', 'alias', 'fuzzy', 'none')
      )
      and (
        props->>'count' is null
        or props->>'via' is null
        or ((props->>'count')::integer = 0 and props->>'via' = 'none')
        or ((props->>'count')::integer > 0 and props->>'via' in ('text', 'alias', 'fuzzy'))
      )
      and (
        props->>'results' is null
        or (
          char_length(props->>'results') between 1 and 240
          and props->>'results' ~ '^[a-z0-9]+(?:-[a-z0-9]+)*(?:,[a-z0-9]+(?:-[a-z0-9]+)*)*$'
        )
      )
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_search_result_click_check;

alter table public.analytics_events
  add constraint analytics_events_search_result_click_check check (
    event <> 'search_result_click'
    or (
      port_slug is not null
      and char_length(coalesce(props->>'q', '')) between 1 and 60
      and props->>'q' = lower(props->>'q')
      and (props->>'position') ~ '^[0-9]+$'
      and (props->>'position')::integer between 1 and 500
      and props->>'via' in ('text', 'alias', 'fuzzy')
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_game_request_shown_check;

alter table public.analytics_events
  add constraint analytics_events_game_request_shown_check check (
    event <> 'game_request_shown'
    or (
      char_length(coalesce(props->>'q', '')) between 1 and 60
      and props->>'q' = lower(props->>'q')
      and props->>'result' is null
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_game_request_click_check;

alter table public.analytics_events
  add constraint analytics_events_game_request_click_check check (
    event <> 'game_request_click'
    or (
      char_length(coalesce(props->>'q', '')) between 1 and 60
      and props->>'q' = lower(props->>'q')
      and props->>'result' is null
    )
  );

alter table public.analytics_events drop constraint if exists analytics_events_game_request_submit_check;

alter table public.analytics_events
  add constraint analytics_events_game_request_submit_check check (
    event <> 'game_request_submit'
    or (
      char_length(coalesce(props->>'q', '')) between 1 and 60
      and props->>'q' = lower(props->>'q')
      and props->>'result' in ('success', 'fail')
    )
  );
