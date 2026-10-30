/**
 * Catalog filters for "where does this game come from" and "how VR is it".
 * Neither is a database column: both are read from fields a port already has
 * (`base_game_store`, `title`, `locomotion_types`, `has_6dof_controls`,
 * `features.play_modes`). A port that matches nothing is simply left out of the
 * options instead of being guessed.
 */

import type { Port } from '~/types/port'

export const ORIGIN_PLATFORMS = [
  { id: 'pc', label: 'PC' },
  { id: 'arcade', label: 'Arcade' },
  { id: 'n64', label: 'Nintendo 64' },
  { id: 'gamecube_wii', label: 'GameCube / Wii' },
  { id: 'playstation', label: 'PlayStation' },
  { id: 'xbox', label: 'Xbox' },
  { id: 'dreamcast', label: 'Dreamcast' },
  { id: 'other_console', label: 'Other consoles' },
  { id: 'android', label: 'Android' }
] as const

export type OriginPlatform = (typeof ORIGIN_PLATFORMS)[number]['id']

export const VR_STYLES = [
  { id: 'motion', label: 'Full VR (motion controls)' },
  { id: 'cockpit', label: 'Cockpit & driving' },
  { id: 'mixed_reality', label: 'Mixed reality' },
  { id: 'seated', label: 'Seated, gamepad-style' }
] as const

export type VrStyle = (typeof VR_STYLES)[number]['id']

type PortLike = Pick<Port, 'title' | 'has_6dof_controls'> & {
  base_game_store?: string | null
  locomotion_types?: string[] | null
  features?: { play_modes?: string[] | null } | null
}

// Order matters: the first match wins. "N64 cartridge or GameCube disc" is N64,
// and a Dreamcast disc of an arcade game is Dreamcast. A few ports only say
// "your own ROM" or "your own copy", so their title is matched too.
const ORIGIN_RULES: ReadonlyArray<readonly [OriginPlatform, RegExp]> = [
  ['dreamcast', /dreamcast/],
  ['arcade', /arcade|naomi|lindbergh|\bmame\b|namco|port0r|time crisis/],
  ['n64', /\bn64\b|nintendo 64|\s64(?![\w-])|smash remix|bomberman hero/],
  ['gamecube_wii', /gamecube|\bwii\b|gafe\d|gmp[ep]\d|melee/],
  ['playstation', /\bps[12x]\b|playstation|\bpsp\b|scus|slus/],
  ['xbox', /xbox/],
  ['other_console', /\bsnes\b|\b3ds\b/],
  ['android', /google play|android|\bapk\b|\bmobile\b/],
  ['pc', /steam|\bgog\b|windows|\bpc\b|cd-rom|oldunreal|minecraft|retail|\bprey\b/]
]

export function portOriginPlatform(port: Pick<PortLike, 'title' | 'base_game_store'>): OriginPlatform | null {
  const text = `${port.base_game_store ?? ''} ${port.title}`.toLowerCase()
  for (const [id, pattern] of ORIGIN_RULES) {
    if (pattern.test(text)) return id
  }
  return null
}

const COCKPIT = /seated driving|cockpit|stick steering|steering|flight|vr wheel|seated submarine/
const ON_FOOT = /smooth|snap|roomscale|teleport/
const MIXED_REALITY = /mixed reality|passthrough/

/**
 * One bucket per port, checked in this order:
 * mixed reality, then cockpit/driving (only when the port has no on-foot
 * movement, so GTA with a steering wheel stays "Full VR"), then motion
 * controls, then everything that plays like a gamepad game on a headset.
 */
export function portVrStyle(port: PortLike): VrStyle {
  const text = [
    ...(port.locomotion_types ?? []),
    ...(port.features?.play_modes ?? [])
  ].join(' | ').toLowerCase()
  if (MIXED_REALITY.test(text)) return 'mixed_reality'
  if (COCKPIT.test(text) && !ON_FOOT.test(text)) return 'cockpit'
  return port.has_6dof_controls ? 'motion' : 'seated'
}

export interface FilterOption<T extends string> {
  id: T
  label: string
  count: number
}

/** The two derived fields a catalog row carries instead of the raw text they come from. */
export interface CatalogFilterFields {
  origin_platform: OriginPlatform | null
  vr_style: VrStyle
}

/**
 * Derive the filter fields once, where the row is loaded. The catalog query reads
 * `base_game_store` and `locomotion_types`, but only these two short ids travel in
 * the cached page, so the catalog payload stays as small as before.
 */
export function withCatalogFilterFields<T extends PortLike>(port: T): T & CatalogFilterFields {
  return { ...port, origin_platform: portOriginPlatform(port), vr_style: portVrStyle(port) }
}

function withCounts<T extends string>(
  options: ReadonlyArray<{ id: T; label: string }>,
  counts: Map<T, number>
): FilterOption<T>[] {
  return options
    .map(option => ({ ...option, count: counts.get(option.id) ?? 0 }))
    .filter(option => option.count > 0)
}

export function originPlatformOptions(ports: Array<Pick<CatalogFilterFields, 'origin_platform'>>): FilterOption<OriginPlatform>[] {
  const counts = new Map<OriginPlatform, number>()
  for (const port of ports) {
    const id = port.origin_platform
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  return withCounts(ORIGIN_PLATFORMS, counts).sort((a, b) => b.count - a.count)
}

export function vrStyleOptions(ports: Array<Pick<CatalogFilterFields, 'vr_style'>>): FilterOption<VrStyle>[] {
  const counts = new Map<VrStyle, number>()
  for (const port of ports) counts.set(port.vr_style, (counts.get(port.vr_style) ?? 0) + 1)
  return withCounts(VR_STYLES, counts)
}
