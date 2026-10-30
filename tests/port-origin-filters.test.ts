import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { CATALOG_FILTER_SOURCE_COLUMNS, CATALOG_PORT_SELECT } from '../app/composables/usePorts'
import {
  originPlatformOptions,
  portOriginPlatform,
  portVrStyle,
  vrStyleOptions,
  withCatalogFilterFields
} from '../app/lib/portOrigin'

const bySlugPart = (part: string) => INITIAL_PORTS.find(port => port.slug.includes(part))

describe('port origin platform', () => {
  it.each([
    ['Requires your own original N64 copy', 'GoldenEye VR (007)', 'n64'],
    ['Requires your own original Wii disc (PAL RMCP01)', 'Wiicompiled VR PLUS', 'gamecube_wii'],
    ['Requires your own copy (Sega NAOMI arcade set)', 'Ninja Assault VR', 'arcade'],
    ['Requires your own copy (MAME 0.289 set hotd.zip)', 'Port0r: House of the Dead VR', 'arcade'],
    [null, 'Port0r: Cop VR (Virtua Cop)', 'arcade'],
    ['Requires your own original Xbox copy', 'Halo CE Quest VR', 'xbox'],
    ['Requires your own original PS1 copy', 'Gran Turismo 2 VR', 'playstation'],
    ['Requires your own copy (Dreamcast disc)', '18 Wheeler', 'dreamcast'],
    ['Google Play Store', 'Grand Theft Auto: San Andreas VR', 'android'],
    ['Steam / GOG', 'Beef Raider XR', 'pc'],
    ['Requires your own original N64 cartridge or the Zelda: Collector\'s Edition GameCube disc', 'Majora', 'n64'],
    ['Requires your own copy (Super Smash Bros. USA ROM)', 'Smash Remix VR', 'n64'],
    ['Requires your own copy (Mega Man 64 US ROM)', 'Mega Man 64 VR', 'n64'],
    ['Requires your own copy (Super Smash Bros. Melee NTSC-U 1.02 disc image)', 'Xelee', 'gamecube_wii'],
    ['Requires your own copy (Wave Race 64 USA Rev A / v1.1 ROM)', 'Wave Race 64 VR', 'n64'],
    ['Requires your own copy (Max Payne Mobile 1.7, 64-bit: the Rockstar APK)', 'Max Payne VR', 'android'],
    ['Requires your own original Prey (2006) copy', 'Prey VR', 'pc'],
    ['Requires your own original SNES cartridge dump', 'Star Fox Enhanced', 'other_console']
  ])('reads %s as %s', (store, title, expected) => {
    expect(portOriginPlatform({ base_game_store: store, title })).toBe(expected)
  })

  it('leaves a port out when nothing says where it came from', () => {
    expect(portOriginPlatform({ base_game_store: null, title: 'Mystery' })).toBeNull()
  })

  it('only lists platforms that have ports, biggest first', () => {
    const options = originPlatformOptions(INITIAL_PORTS.map(withCatalogFilterFields))
    expect(options.length).toBeGreaterThan(2)
    expect(options.every(option => option.count > 0)).toBe(true)
    const counts = options.map(option => option.count)
    expect(counts).toEqual([...counts].sort((a, b) => b - a))
  })
})

describe('port VR style', () => {
  const base = { title: 't', base_game_store: null }

  it('calls passthrough ports mixed reality', () => {
    expect(portVrStyle({ ...base, locomotion_types: ['Mixed Reality (passthrough)', 'Roomscale'], has_6dof_controls: true })).toBe('mixed_reality')
    expect(portVrStyle({ ...base, locomotion_types: ['Seated'], has_6dof_controls: false, features: { play_modes: ['MR passthrough'] } })).toBe('mixed_reality')
  })

  it('keeps cockpit for seated driving and flight with no on-foot movement', () => {
    expect(portVrStyle({ ...base, locomotion_types: ['Seated Driving', 'Stick Steering'], has_6dof_controls: false })).toBe('cockpit')
  })

  it('does not call a walking game with a steering wheel a cockpit game', () => {
    expect(portVrStyle({ ...base, locomotion_types: ['Smooth Locomotion', 'Steering Wheel Driving'], has_6dof_controls: true })).toBe('motion')
  })

  it('splits the rest on motion controls', () => {
    expect(portVrStyle({ ...base, locomotion_types: ['Smooth Locomotion'], has_6dof_controls: true })).toBe('motion')
    expect(portVrStyle({ ...base, locomotion_types: ['Smooth Turn'], has_6dof_controls: false })).toBe('seated')
  })

  it('lists only styles that exist in the catalog', () => {
    const options = vrStyleOptions(INITIAL_PORTS.map(withCatalogFilterFields))
    expect(options.map(option => option.id)).toContain('motion')
    expect(options.reduce((sum, option) => sum + option.count, 0)).toBe(INITIAL_PORTS.length)
  })

  it('classifies known catalog ports', () => {
    const quake = bySlugPart('quake3')
    if (quake) expect(portVrStyle(quake)).toBe('motion')
  })
})

describe('catalog page wiring', () => {
  const index = readFileSync(new URL('../app/pages/index.vue', import.meta.url), 'utf8')

  it('filters, resets, and tracks the two new dropdowns', () => {
    expect(index).toContain('port.origin_platform !== selectedOrigin.value')
    expect(index).toContain('port.vr_style !== selectedStyle.value')
    expect(index).toContain("watch(selectedOrigin, (value) => trackFilter('platform', value))")
    expect(index).toContain("watch(selectedStyle, (value) => trackFilter('style', value))")
    expect(index.match(/selectedOrigin\.value = ''/g)!.length).toBeGreaterThanOrEqual(2)
    expect(index.match(/selectedStyle\.value = ''/g)!.length).toBeGreaterThanOrEqual(2)
  })

  it('keeps developer and status reachable behind More filters', () => {
    expect(index).toContain('data-testid="more-filters"')
    expect(index).toContain('v-model="selectedDeveloper"')
    expect(index).toContain('v-model="selectedStatus"')
    expect(index).toContain('Boolean(bootCatalogQuery.dev)')
  })

  it('reads the raw text on the server but never ships it in the catalog row', () => {
    expect(CATALOG_FILTER_SOURCE_COLUMNS).toEqual(['base_game_store', 'locomotion_types'])
    for (const column of CATALOG_FILTER_SOURCE_COLUMNS) expect(CATALOG_PORT_SELECT).not.toContain(column)
    const ports = readFileSync(new URL('../app/composables/usePorts.ts', import.meta.url), 'utf8')
    expect(ports).toContain('const { base_game_store: _store, locomotion_types: _locomotion, ...rest } = withCatalogFilterFields(row)')
    expect(ports).toContain('.select(CATALOG_ROW_SELECT)')
    expect(ports).toContain('.select(CATALOG_SELECT)')
  })

  it('uses original platform as the chip row and moves the port category to Type', () => {
    expect(index).toContain('data-testid="origin-chips"')
    expect(index).toContain('v-for="chip in originChips"')
    expect(index).not.toContain('<!-- Category Buttons -->')
    expect(index).toContain('data-testid="type-filter"')
    expect(index).toContain('v-model="selectedCategory"')
    expect(index).toContain("bootCatalogQuery.cat !== 'all'")
  })
})
