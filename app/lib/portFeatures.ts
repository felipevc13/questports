import type {
  ComfortRating,
  ComfortVignette,
  FeatureSupport,
  HapticSupport,
  PortFeatures
} from '~/types/port'

/** Fields the detail page is allowed to read. Extra catalog fields are ignored. */
export interface PortFeatureSource {
  has_6dof_controls?: boolean | null
  locomotion_types?: string[] | null
  supported_hardware?: string[] | null
  features?: PortFeatures | null
  /** Accepted so callers can pass a full port. Never used to invent a rating. */
  category?: string | null
  slug?: string | null
}

export interface FeatureClaim {
  id: string
  label: string
  value: string
  /** True only for a confirmed positive claim. Unknown claims are omitted. */
  affirmed: boolean
  accessibleLabel: string
}

export interface FeatureChipGroup {
  id: string
  label: string
  chips: string[]
}

export interface PortFeatureView {
  summary: FeatureClaim[]
  chips: FeatureChipGroup[]
  hasContent: boolean
}

const PLAY_MODE_LABELS: Record<string, string[]> = {
  roomscale: ['Roomscale'],
  seated: ['Seated'],
  'seated mode': ['Seated'],
  standing: ['Standing'],
  'seated / standing': ['Seated', 'Standing'],
  'cockpit vr': ['Cockpit']
}

const LEFT_HANDED: Record<FeatureSupport, { value: string; affirmed: boolean }> = {
  full: { value: 'Full support', affirmed: true },
  partial: { value: 'Partial support', affirmed: true },
  none: { value: 'Not supported', affirmed: false }
}

const HAPTICS: Record<HapticSupport, { value: string; affirmed: boolean }> = {
  active: { value: 'Active', affirmed: true },
  none: { value: 'None', affirmed: false }
}

const VIGNETTE: Record<ComfortVignette, { value: string; affirmed: boolean }> = {
  adjustable: { value: 'Adjustable', affirmed: true },
  on: { value: 'On', affirmed: true },
  none: { value: 'None', affirmed: false }
}

const COMFORT_RATINGS = new Set<ComfortRating>(['Comfortable', 'Moderate', 'Intense'])

function cleanList(values: string[] | null | undefined): string[] {
  if (!Array.isArray(values)) return []
  const cleaned: string[] = []
  for (const value of values) {
    if (typeof value !== 'string') continue
    const trimmed = value.trim()
    if (trimmed) cleaned.push(trimmed)
  }
  return cleaned
}

function readFeatures(features: PortFeatures | null | undefined): PortFeatures {
  if (!features || typeof features !== 'object' || Array.isArray(features)) return {}
  return features
}

function textValue(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

function claim(id: string, label: string, value: string, affirmed: boolean): FeatureClaim {
  return {
    id,
    label,
    value,
    affirmed,
    accessibleLabel: affirmed ? `${label}: Yes, ${value}` : `${label}: ${value}`
  }
}

function textClaim(id: string, label: string, value: string | null | undefined): FeatureClaim | null {
  const text = textValue(value)
  if (!text) return null
  return claim(id, label, text, true)
}

function playModes(features: PortFeatures, locomotion: string[]): string[] {
  const explicit = cleanList(features.play_modes)
  if (explicit.length > 0) return explicit

  const derived: string[] = []
  for (const item of locomotion) {
    const labels = PLAY_MODE_LABELS[item.toLowerCase()]
    if (!labels) continue
    for (const label of labels) {
      if (!derived.includes(label)) derived.push(label)
    }
  }
  return derived
}

function vignetteClaim(features: PortFeatures, locomotion: string[]): FeatureClaim | null {
  const recorded = features.comfort_vignette
  if (recorded && recorded in VIGNETTE) {
    const mapped = VIGNETTE[recorded]
    return claim('comfort_vignette', 'Comfort vignette', mapped.value, mapped.affirmed)
  }
  if (locomotion.some(item => item.toLowerCase() === 'comfort vignette')) {
    return claim('comfort_vignette', 'Comfort vignette', 'On', true)
  }
  return null
}

/**
 * Builds the detail-page feature list from recorded port data.
 * Unknown claims are left out. A checkmark is only for an affirmed claim.
 */
export function buildPortFeatureView(port: PortFeatureSource | null | undefined): PortFeatureView {
  if (!port) return { summary: [], chips: [], hasContent: false }

  const features = readFeatures(port.features)
  const locomotion = cleanList(port.locomotion_types)
  const hardware = cleanList(port.supported_hardware)
  const summary: FeatureClaim[] = []

  if (port.has_6dof_controls === true) {
    summary.push(claim('tracking', 'Tracking', '6DoF', true))
  } else if (port.has_6dof_controls === false) {
    summary.push(claim('tracking', 'Tracking', '3DoF', false))
  }

  const motion = textClaim('motion_controls', 'Motion controls', features.motion_controls)
  if (motion) summary.push(motion)

  const leftHanded = features.left_handed
  if (leftHanded && leftHanded in LEFT_HANDED) {
    const mapped = LEFT_HANDED[leftHanded]
    summary.push(claim('left_handed', 'Left-handed', mapped.value, mapped.affirmed))
  }

  const physical = textClaim('physical_interaction', 'Physical interaction', features.physical_interaction)
  if (physical) summary.push(physical)

  const haptics = features.haptics
  if (haptics && haptics in HAPTICS) {
    const mapped = HAPTICS[haptics]
    summary.push(claim('haptics', 'Haptics', mapped.value, mapped.affirmed))
  }

  const vignette = vignetteClaim(features, locomotion)
  if (vignette) summary.push(vignette)

  const stereo = textClaim('stereo', 'Rendering', features.stereo)
  if (stereo) summary.push(stereo)

  const refresh = textClaim('refresh', 'Refresh', features.refresh)
  if (refresh) summary.push(refresh)

  const spatial = textClaim('spatial_audio', 'Spatial audio', features.spatial_audio)
  if (spatial) summary.push(spatial)

  const rating = features.comfort_rating
  if (rating && COMFORT_RATINGS.has(rating)) {
    summary.push(claim('comfort_rating', 'Comfort rating', rating, false))
  }

  const chips: FeatureChipGroup[] = []
  if (locomotion.length > 0) {
    chips.push({ id: 'locomotion', label: 'Locomotion', chips: locomotion })
  }
  const modes = playModes(features, locomotion)
  if (modes.length > 0) {
    chips.push({ id: 'play_modes', label: 'Play modes', chips: modes })
  }
  if (hardware.length > 0) {
    chips.push({ id: 'headsets', label: 'Headsets', chips: hardware })
  }

  return {
    summary,
    chips,
    hasContent: summary.length > 0 || chips.length > 0
  }
}
