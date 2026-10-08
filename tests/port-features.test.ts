import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { PORT_FEATURE_SOURCES, RECORDED_PORT_FEATURES, applyRecordedFeatures } from '../app/data/recordedPortFeatures'
import { buildPortFeatureView } from '../app/lib/portFeatures'

const OLD_CLAIMS = [
  '6DoF Roomscale',
  '3DoF Seated',
  'Touch Motion 1:1',
  'Holsters & Gestures',
  'Full Support',
  'Binaural',
  '3 Modes',
  'Native Stereo 3D 90/120Hz',
  '90Hz / 120Hz native'
]

function shownText(port: Parameters<typeof buildPortFeatureView>[0]): string {
  const view = buildPortFeatureView(port)
  return [
    ...view.summary.map(claim => `${claim.affirmed ? '✓ ' : ''}${claim.label}: ${claim.value}`),
    ...view.chips.flatMap(group => [group.label, ...group.chips])
  ].join(' | ')
}

describe('port feature rendering', () => {
  it('omits every claim when nothing has been recorded', () => {
    const view = buildPortFeatureView({
      has_6dof_controls: null,
      locomotion_types: [],
      supported_hardware: [' ', ''],
      features: null,
      slug: 'preyvr',
      category: 'emulator'
    })

    expect(view.hasContent).toBe(false)
    expect(view.summary).toEqual([])
    expect(view.chips).toEqual([])
    expect(view.summary.some(claim => claim.affirmed)).toBe(false)
  })

  it('does not turn a slug, teleport, or emulator category into a comfort rating', () => {
    for (const port of [
      { slug: 'preyvr', category: 'source_port', locomotion_types: ['Teleport'], has_6dof_controls: true },
      { slug: 'halocequest', category: 'decompilation', has_6dof_controls: true },
      { slug: 'citravr', category: 'emulator', has_6dof_controls: true }
    ]) {
      const view = buildPortFeatureView(port)
      expect(view.summary.map(claim => claim.id)).not.toContain('comfort_rating')
    }
  })

  it('shows 6DoF from the column without calling it roomscale, and 3DoF without a check', () => {
    const six = buildPortFeatureView({ has_6dof_controls: true })
    expect(six.summary).toEqual([
      expect.objectContaining({ id: 'tracking', value: '6DoF', affirmed: true })
    ])
    expect(six.summary[0].value).not.toContain('Roomscale')

    const three = buildPortFeatureView({ has_6dof_controls: false })
    expect(three.summary).toEqual([
      expect.objectContaining({ id: 'tracking', value: '3DoF', affirmed: false })
    ])
    expect(three.summary[0].accessibleLabel).toBe('Tracking: 3DoF')
  })

  it('shows only the claims that were recorded on a partial port', () => {
    const view = buildPortFeatureView({
      has_6dof_controls: true,
      locomotion_types: ['Smooth Locomotion', 'Snap Turn'],
      supported_hardware: ['Quest 3'],
      features: { refresh: '90Hz' }
    })

    expect(view.summary.map(claim => claim.id)).toEqual(['tracking', 'refresh'])
    expect(view.summary.map(claim => claim.value)).toEqual(['6DoF', '90Hz'])
    expect(view.chips.map(group => group.id)).toEqual(['locomotion', 'headsets'])
    const text = view.summary.map(claim => `${claim.label}: ${claim.value}`).join(' | ')
    expect(text).not.toMatch(/Left-handed|Haptics|Holsters|Vignette/)
  })

  it('renders a full feature object without empty slots or a hardcoded mode count', () => {
    const view = buildPortFeatureView({
      has_6dof_controls: true,
      locomotion_types: ['Smooth Locomotion', 'Roomscale'],
      supported_hardware: ['Quest 3', 'Quest 3S'],
      features: {
        motion_controls: 'Touch 1:1',
        left_handed: 'full',
        physical_interaction: 'Holsters',
        haptics: 'active',
        comfort_vignette: 'adjustable',
        play_modes: ['Seated', 'Standing', 'Roomscale'],
        stereo: 'Native stereo 3D',
        refresh: '90/120Hz',
        spatial_audio: 'Positional audio',
        comfort_rating: 'Moderate'
      }
    })

    expect(view.summary.map(claim => claim.id)).toEqual([
      'tracking',
      'motion_controls',
      'left_handed',
      'physical_interaction',
      'haptics',
      'comfort_vignette',
      'stereo',
      'refresh',
      'spatial_audio',
      'comfort_rating'
    ])
    expect(view.summary.find(claim => claim.id === 'comfort_rating')).toMatchObject({
      value: 'Moderate',
      affirmed: false,
      accessibleLabel: 'Comfort rating: Moderate'
    })
    expect(view.summary.find(claim => claim.id === 'left_handed')?.accessibleLabel).toBe('Left-handed: Yes, Full support')
    expect(view.chips.find(group => group.id === 'play_modes')?.chips).toEqual(['Seated', 'Standing', 'Roomscale'])
    expect(shownText({
      has_6dof_controls: true,
      locomotion_types: ['Smooth Locomotion', 'Roomscale'],
      features: { play_modes: ['Seated', 'Standing', 'Roomscale'] }
    })).not.toContain('3 Modes')
  })

  it('shows known negatives as words and never as a check', () => {
    const view = buildPortFeatureView({
      features: { left_handed: 'none', haptics: 'none', comfort_vignette: 'none' }
    })

    expect(view.summary.every(claim => claim.affirmed === false)).toBe(true)
    expect(view.summary.map(claim => claim.value)).toEqual(['Not supported', 'None', 'None'])
  })

  it('drops blank strings, unknown enums, and non-object feature payloads', () => {
    const view = buildPortFeatureView({
      features: {
        motion_controls: '   ',
        left_handed: 'yes' as 'full',
        play_modes: ['', '  '],
        comfort_rating: 'Fine' as 'Moderate'
      }
    })
    expect(view.hasContent).toBe(false)

    expect(buildPortFeatureView({ features: [] as never }).hasContent).toBe(false)
  })

  it('uses locomotion for play modes and vignette, and lets recorded features override them', () => {
    const derived = buildPortFeatureView({
      locomotion_types: ['Smooth Locomotion', 'Seated / Standing', 'Comfort Vignette', 'Cockpit VR']
    })
    expect(derived.chips.find(group => group.id === 'play_modes')?.chips).toEqual(['Seated', 'Standing', 'Cockpit'])
    expect(derived.summary.find(claim => claim.id === 'comfort_vignette')).toMatchObject({
      value: 'On',
      affirmed: true
    })

    const overridden = buildPortFeatureView({
      locomotion_types: ['Roomscale', 'Comfort Vignette'],
      features: { play_modes: ['Theatre'], comfort_vignette: 'none' }
    })
    expect(overridden.chips.find(group => group.id === 'play_modes')?.chips).toEqual(['Theatre'])
    expect(overridden.summary.find(claim => claim.id === 'comfort_vignette')).toMatchObject({
      value: 'None',
      affirmed: false
    })
  })

  it('does not invent the old shared claims for a port with no feature payload', () => {
    const rtcw = applyRecordedFeatures(INITIAL_PORTS.find(port => port.slug === 'rtcwquest')!)
    const view = buildPortFeatureView(rtcw)

    expect(rtcw.features).toBeUndefined()
    expect(view.summary.map(claim => claim.id)).toEqual(['tracking'])
    expect(view.chips.map(group => group.id)).toEqual(['locomotion', 'headsets'])
    expect(view.summary.filter(claim => claim.affirmed).map(claim => claim.id)).toEqual(['tracking'])
    for (const phrase of OLD_CLAIMS) {
      expect(shownText(rtcw)).not.toContain(phrase)
    }
  })

  it('keeps an explicit features value, including null, instead of the offline map', () => {
    const cleared = applyRecordedFeatures({ slug: 'ut99-vr-quest', features: null })
    expect(cleared.features).toBeNull()

    const custom = applyRecordedFeatures({
      slug: 'ut99-vr-quest',
      features: { refresh: '90Hz' }
    })
    expect(custom.features).toEqual({ refresh: '90Hz' })
  })
})

describe('recorded catalog features', () => {
  it('names a source for every seeded port and no source for anyone else', () => {
    expect(Object.keys(PORT_FEATURE_SOURCES).sort()).toEqual(Object.keys(RECORDED_PORT_FEATURES).sort())
    const slugs = new Set(INITIAL_PORTS.map(port => port.slug))
    for (const slug of Object.keys(RECORDED_PORT_FEATURES)) {
      expect(slugs.has(slug)).toBe(true)
      expect(RECORDED_PORT_FEATURES[slug].left_handed).toBeUndefined()
      expect(RECORDED_PORT_FEATURES[slug].comfort_rating).toBeUndefined()
    }
  })

  it('matches the SQL backfill and never shows the old shared checkmarks', () => {
    const sql = readFileSync('supabase/migrations/20261008230100_port_features_seed.sql', 'utf8')

    for (const [slug, features] of Object.entries(RECORDED_PORT_FEATURES)) {
      expect(sql).toContain(`where slug = '${slug}'`)
      expect(sql).toContain(JSON.stringify(features))
    }

    for (const port of INITIAL_PORTS) {
      const withFeatures = applyRecordedFeatures(port)
      const view = buildPortFeatureView(withFeatures)
      const text = shownText(withFeatures)
      for (const phrase of OLD_CLAIMS) {
        expect(text, port.slug).not.toContain(phrase)
      }
      expect(view.summary.some(claim => claim.id === 'comfort_rating'), port.slug).toBe(false)
      expect(view.summary.some(claim => claim.id === 'left_handed'), port.slug).toBe(false)
      if (!RECORDED_PORT_FEATURES[port.slug] && !port.locomotion_types.some(item => item.toLowerCase() === 'comfort vignette')) {
        expect(view.summary.filter(claim => claim.affirmed).map(claim => claim.id), port.slug).toEqual(
          port.has_6dof_controls ? ['tracking'] : []
        )
      }
    }
  })

  it('shows the dense, partial, and column-only examples used on the detail page', () => {
    const dense = buildPortFeatureView(applyRecordedFeatures(INITIAL_PORTS.find(port => port.slug === 'ut99-vr-quest')!))
    expect(dense.summary.map(claim => claim.id)).toEqual([
      'tracking',
      'motion_controls',
      'physical_interaction',
      'haptics',
      'stereo'
    ])
    expect(dense.chips.find(group => group.id === 'play_modes')?.chips).toEqual(['Roomscale'])

    const partial = buildPortFeatureView(applyRecordedFeatures(INITIAL_PORTS.find(port => port.slug === 'primedgun')!))
    expect(partial.summary.map(claim => claim.id)).toEqual(['tracking', 'motion_controls'])
    expect(partial.summary.find(claim => claim.id === 'motion_controls')?.value).toBe('1:1 tracked Arm Cannon')
    expect(partial.chips.find(group => group.id === 'play_modes')?.chips).toEqual(['Roomscale'])

    const vignette = buildPortFeatureView(applyRecordedFeatures(INITIAL_PORTS.find(port => port.slug === 'doom3quest')!))
    expect(vignette.summary.find(claim => claim.id === 'comfort_vignette')?.value).toBe('On')
    expect(shownText(applyRecordedFeatures(INITIAL_PORTS.find(port => port.slug === 'doom3quest')!))).not.toContain('Adjustable')
  })
})

describe('detail page template', () => {
  it('no longer hardcodes the shared VR claims or the slug comfort rating', () => {
    const page = readFileSync('app/pages/ports/[slug].vue', 'utf8')
    const panel = readFileSync('app/components/PortFeaturePanel.vue', 'utf8')
    const combined = page + panel

    expect(page).toContain('<PortFeaturePanel :port="port" />')
    expect(page).not.toContain("slug === 'preyvr'")
    expect(page).not.toContain('isFeaturesExpanded')
    for (const phrase of [...OLD_CLAIMS, 'Haptic rumble', 'Waist holsters']) {
      expect(combined).not.toContain(phrase)
    }
    expect(panel).toContain('claim.affirmed')
    expect(panel).toContain('sr-only')
  })
})
