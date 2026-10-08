-- Optional per-port VR feature claims for QuestPorts.
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.
--
-- Tracking stays on has_6dof_controls. Locomotion stays on locomotion_types.
-- Headsets stay on supported_hardware. This column is only for claims that
-- were previously hardcoded on every detail page.
--
-- A missing key, JSON null, or a null column means unknown. The site must not
-- show those as a checkmark. Backfill of claims the catalog already states is
-- in 20261008230100_port_features_seed.sql.

alter table public.ports
  add column if not exists features jsonb;

comment on column public.ports.features is
  'Optional VR claims. Missing keys mean unknown and must not be shown as confirmed. Keys: motion_controls (text), left_handed (full|partial|none), physical_interaction (text), haptics (active|none), comfort_vignette (adjustable|on|none), play_modes (text array), stereo (text), refresh (text), spatial_audio (text), comfort_rating (Comfortable|Moderate|Intense).';

create or replace function public.port_features_valid(doc jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select
    doc is null
    or (
      jsonb_typeof(doc) = 'object'
      and not exists (
        select 1
        from jsonb_object_keys(doc) as feature_key
        where feature_key not in (
          'motion_controls',
          'left_handed',
          'physical_interaction',
          'haptics',
          'comfort_vignette',
          'play_modes',
          'stereo',
          'refresh',
          'spatial_audio',
          'comfort_rating'
        )
      )
      and (
        doc->'motion_controls' is null
        or (
          jsonb_typeof(doc->'motion_controls') = 'string'
          and length(btrim(doc->>'motion_controls')) > 0
        )
      )
      and (
        doc->'left_handed' is null
        or doc->>'left_handed' in ('full', 'partial', 'none')
      )
      and (
        doc->'physical_interaction' is null
        or (
          jsonb_typeof(doc->'physical_interaction') = 'string'
          and length(btrim(doc->>'physical_interaction')) > 0
        )
      )
      and (
        doc->'haptics' is null
        or doc->>'haptics' in ('active', 'none')
      )
      and (
        doc->'comfort_vignette' is null
        or doc->>'comfort_vignette' in ('adjustable', 'on', 'none')
      )
      and (
        doc->'play_modes' is null
        or (
          jsonb_typeof(doc->'play_modes') = 'array'
          and jsonb_array_length(doc->'play_modes') > 0
          and not exists (
            select 1
            from jsonb_array_elements(doc->'play_modes') as element
            where jsonb_typeof(element) <> 'string'
               or length(btrim(element #>> '{}')) = 0
          )
        )
      )
      and (
        doc->'stereo' is null
        or (
          jsonb_typeof(doc->'stereo') = 'string'
          and length(btrim(doc->>'stereo')) > 0
        )
      )
      and (
        doc->'refresh' is null
        or (
          jsonb_typeof(doc->'refresh') = 'string'
          and length(btrim(doc->>'refresh')) > 0
        )
      )
      and (
        doc->'spatial_audio' is null
        or (
          jsonb_typeof(doc->'spatial_audio') = 'string'
          and length(btrim(doc->>'spatial_audio')) > 0
        )
      )
      and (
        doc->'comfort_rating' is null
        or doc->>'comfort_rating' in ('Comfortable', 'Moderate', 'Intense')
      )
    );
$$;

comment on function public.port_features_valid(jsonb) is
  'Check constraint helper for public.ports.features. Not part of the public API.';

revoke all on function public.port_features_valid(jsonb) from public;
revoke all on function public.port_features_valid(jsonb) from anon, authenticated;

alter table public.ports drop constraint if exists ports_features_shape;

alter table public.ports
  add constraint ports_features_shape
  check (public.port_features_valid(features));
