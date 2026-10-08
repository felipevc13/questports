import type { Port, PortFeatures } from '~/types/port'

/**
 * Feature claims that the catalog text already states for a specific port.
 * Anything not listed here stays unknown. Do not add a key to make a page look complete.
 * The SQL backfill in supabase/migrations/20261008230100_port_features_seed.sql
 * must stay in sync with this map (tests compare the JSON).
 */
export const RECORDED_PORT_FEATURES: Record<string, PortFeatures> = {
  // short_description: "two-handed weapon handling"
  lambda1vr: {
    motion_controls: 'Two-handed weapon handling'
  },
  // short_description: "1:1 motion tracking" and "real-world hand gestures"
  jkxr: {
    motion_controls: '1:1 motion tracking',
    physical_interaction: 'Hand gestures'
  },
  // short_description: "stereoscopic 3D rendering"
  citravr: {
    stereo: 'Stereoscopic 3D'
  },
  // troubleshooting_notes: "Toggle stereoscopic 3D rendering"
  'ppsspp-vr': {
    stereo: 'Optional stereoscopic 3D'
  },
  // short_description "1:1 tracked pistol" / "120 Hz"; guide "Physical Ducking"; notes "Target framerate is 120 Hz"
  'time-crisis-vr': {
    motion_controls: '1:1 tracked pistol',
    physical_interaction: 'Physical ducking',
    refresh: '120Hz'
  },
  // short_description and guide: "1:1 tracked Arm Cannon"
  primedgun: {
    motion_controls: '1:1 tracked Arm Cannon'
  },
  // short_description: "hand-tracked DualSense" and "3D audio"; guide confirms DualSense tracking
  astroquest: {
    motion_controls: 'Hand-tracked DualSense',
    spatial_audio: '3D audio'
  },
  // guide bullet: "Half-Life 2: Full 6DoF motion controls"
  sourcevr: {
    motion_controls: '6DoF motion controls (Half-Life 2)'
  },
  // guide: steering wheel, "stereoscopic 3D", "Native Vulkan single-pass stereo", "adjustable refresh rate"
  simpsonshitrun: {
    motion_controls: 'Motion-controlled steering wheel',
    stereo: 'Native stereo 3D',
    refresh: 'Adjustable'
  },
  // guide: "Two-Handed Weapons" and "Physical Gestures"
  halocequest: {
    motion_controls: 'Two-handed weapons',
    physical_interaction: 'Physical gestures'
  },
  // guide: diorama, "120Hz virtual theater screen", "optional Stereoscopic 3D", "tracked laser"
  galaxyquest: {
    motion_controls: 'Tracked Star Bit laser',
    play_modes: ['3D diorama', 'Giant virtual screen'],
    stereo: 'Optional stereo 3D (virtual screen)',
    refresh: '120Hz (virtual screen)'
  },
  // guide: "Gravity Gloves" and "72Hz display"
  qualyx: {
    physical_interaction: 'Gravity gloves',
    refresh: '72Hz'
  },
  // guide: "Two-Handed Grip"; "Choose between Stereo VR ... or Big Virtual Screen"
  'goldeneye-vr': {
    motion_controls: 'Two-handed grip',
    play_modes: ['Stereo VR', 'Virtual screen'],
    stereo: 'Stereo VR'
  },
  // guide: "native Touch controller mapping", "stereo per-eye"; notes list 72/90/120Hz
  questcarnage: {
    motion_controls: 'Touch controller mapping',
    stereo: 'Stereo cockpit',
    refresh: '72/90/120Hz'
  },
  // short_description: "motion controller gunplay"
  'gta-sa-vr-quest': {
    motion_controls: 'Motion controller gunplay'
  },
  // short_description: motion-tracked aiming, physical steering wheel, Vulkan stereo
  'vice-city-vr-quest': {
    motion_controls: 'Motion-tracked weapon aiming',
    physical_interaction: 'Physical steering wheel',
    stereo: 'Vulkan stereo'
  },
  // overview "stereoscopic 6DoF"; steering modes; menu "72/90/120Hz display modes"
  'gran-turismo-2-vr': {
    motion_controls: 'Virtual wheel, motion steering, or stick',
    stereo: 'Stereoscopic cockpit',
    refresh: '72/90/120Hz'
  },
  // guide: physical melee, archery, and "Physical Holsters"
  'gothic2-vr': {
    motion_controls: 'Motion-tracked melee and archery',
    physical_interaction: 'Virtual holsters'
  },
  // short_description: "motion-tracked wand spellcasting"
  'harry-potter-vr': {
    motion_controls: 'Motion-tracked wand'
  },
  // guide: "Full Stereoscopic 6DoF" and "native 3D spatialized audio"
  'road-rash-jailbreak-vr': {
    stereo: 'Stereoscopic 6DoF',
    spatial_audio: '3D spatialized audio'
  },
  // guide: "Dual Wielding" and roomscale tracking
  'perfect-dark-vr': {
    motion_controls: 'Dual wielding'
  },
  // guide: "Native 120Hz refresh rate mode" and "field-of-view comfort blinders"
  'avp-vr': {
    comfort_vignette: 'on',
    refresh: '120Hz'
  },
  // guide: "Dual Wielding" and first-person / third-person / diorama modes
  questsam: {
    motion_controls: 'Dual wielding',
    play_modes: ['First-person', 'Third-person', 'Roomscale diorama']
  },
  // guide: "designed to be played seated"; "flip navigation switches" and valves
  'iron-lung-vr': {
    physical_interaction: 'Physical switches and valves',
    play_modes: ['Seated']
  },
  // guide overview: motion controls, two-handed weapons, "haptic feedback", "true stereoscopic 3D"
  'ut99-vr-quest': {
    motion_controls: '6DoF motion controls',
    physical_interaction: 'Two-handed weapons',
    haptics: 'active',
    stereo: 'True stereo OpenXR'
  },
  // short_description: "motion-controlled weapons". Seated/Standing comes from locomotion_types.
  'nolf-vr': {
    motion_controls: 'Motion-controlled weapons'
  }
}

export const PORT_FEATURE_SOURCES: Record<string, string> = {
  lambda1vr: 'short_description: two-handed weapon handling',
  jkxr: 'short_description: 1:1 motion tracking and real-world hand gestures',
  citravr: 'short_description: stereoscopic 3D rendering',
  'ppsspp-vr': 'troubleshooting_notes: toggle stereoscopic 3D rendering',
  'time-crisis-vr': 'short_description, install guide (physical ducking), and troubleshooting note (120 Hz)',
  primedgun: 'short_description and install guide: 1:1 tracked Arm Cannon',
  astroquest: 'short_description and install guide: hand-tracked DualSense and 3D audio',
  sourcevr: 'install guide bullet for Half-Life 2 motion controls only',
  simpsonshitrun: 'install guide: steering wheel, native stereo multiview, adjustable refresh (no Hz list)',
  halocequest: 'install guide: two-handed weapons and physical gestures',
  galaxyquest: 'install guide: diorama, 120Hz virtual screen, optional stereo, tracked laser',
  qualyx: 'install guide: Gravity Gloves and 72Hz display',
  'goldeneye-vr': 'install guide: two-handed grip, Stereo VR or virtual screen',
  questcarnage: 'install guide and troubleshooting: Touch mapping, stereo cockpit, 72/90/120Hz',
  'gta-sa-vr-quest': 'short_description: motion controller gunplay',
  'vice-city-vr-quest': 'short_description: motion aiming, physical steering wheel, Vulkan stereo',
  'gran-turismo-2-vr': 'install guide: stereoscopic cockpit, three steering modes, 72/90/120Hz',
  'gothic2-vr': 'install guide: physical melee, archery, and virtual holsters',
  'harry-potter-vr': 'short_description: motion-tracked wand spellcasting',
  'road-rash-jailbreak-vr': 'install guide: stereoscopic 6DoF and 3D spatialized audio',
  'perfect-dark-vr': 'install guide: dual wielding',
  'avp-vr': 'install guide: native 120Hz mode and field-of-view comfort blinders',
  questsam: 'install guide: dual wielding and first-person, third-person, or diorama',
  'iron-lung-vr': 'install guide: seated play and physical switches and valves',
  'ut99-vr-quest': 'install guide overview: motion controls, two-handed weapons, haptics, true stereo',
  'nolf-vr': 'short_description: motion-controlled weapons'
}

/**
 * Offline fallback only. Fills features when the field is missing.
 * Null means the row explicitly has no recorded claims and is left alone.
 */
export function applyRecordedFeatures<T extends Pick<Port, 'slug' | 'features'>>(port: T): T {
  if (port.features !== undefined) return port
  const recorded = RECORDED_PORT_FEATURES[port.slug]
  if (!recorded) return port
  return { ...port, features: recorded }
}
