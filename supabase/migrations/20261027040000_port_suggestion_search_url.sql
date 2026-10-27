-- A catalog search miss can request a game with no download link.
-- source = 'search' may store a null url.
-- source = 'suggest' is the default, including every existing row, and still
-- requires a non-blank url.
-- Anonymous insert stays allowed (policy with check true). This table has no
-- app rate limit; do not add one here.
-- Apply manually in the Supabase SQL editor after merge. Do not run from CI.
-- Apply this before the deploy that sends source and a null url. Until then
-- those inserts fail.

alter table public.port_suggestions
  add column if not exists source text not null default 'suggest';

alter table public.port_suggestions
  drop constraint if exists port_suggestions_source_check;

alter table public.port_suggestions
  add constraint port_suggestions_source_check
  check (source in ('suggest', 'search'));

alter table public.port_suggestions
  alter column url drop not null;

alter table public.port_suggestions
  drop constraint if exists port_suggestions_url_required;

alter table public.port_suggestions
  add constraint port_suggestions_url_required
  check (
    source = 'search'
    or (url is not null and btrim(url) <> '')
  );

comment on column public.port_suggestions.source is
  'suggest: the suggest-a-port form, url required. search: a catalog miss request, url optional.';
