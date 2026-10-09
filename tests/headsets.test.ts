import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import {
  headsetFilterOptions,
  normalizeHeadsetLabel,
  normalizeHeadsetList,
  portSupportsHeadset
} from '../app/lib/headsets'
import { buildPortFeatureView } from '../app/lib/portFeatures'

describe('catalog headset normalizer', () => {
  it('maps aliases onto the same labels the filter uses', () => {
    expect(normalizeHeadsetLabel('Quest 2')).toBe('Quest 2')
    expect(normalizeHeadsetLabel('Meta Quest 2')).toBe('Quest 2')
    expect(normalizeHeadsetLabel('Oculus Quest 2')).toBe('Quest 2')
    expect(normalizeHeadsetLabel('Quest2')).toBe('Quest 2')
    expect(normalizeHeadsetLabel('Quest 3')).toBe('Quest 3')
    expect(normalizeHeadsetLabel('Meta Quest 3')).toBe('Quest 3')
    expect(normalizeHeadsetLabel('Quest 3S')).toBe('Quest 3S')
    expect(normalizeHeadsetLabel('Meta Quest 3S')).toBe('Quest 3S')
    expect(normalizeHeadsetLabel('quest-3s')).toBe('Quest 3S')
    expect(normalizeHeadsetLabel('Quest Pro')).toBe('Quest Pro')
    expect(normalizeHeadsetLabel('Meta Quest Pro')).toBe('Quest Pro')
    expect(normalizeHeadsetLabel('Oculus Quest Pro')).toBe('Quest Pro')
    expect(normalizeHeadsetLabel('Quest 1')).toBe('Quest 1')
    expect(normalizeHeadsetLabel('Oculus Quest')).toBe('Quest 1')
    expect(normalizeHeadsetLabel('Meta Quest 1')).toBe('Quest 1')
  })

  it('keeps unknown hardware filterable instead of dropping it', () => {
    expect(normalizeHeadsetLabel('Pico 4')).toBe('Pico 4')
    expect(normalizeHeadsetLabel('  ')).toBeNull()
    expect(normalizeHeadsetLabel(null)).toBeNull()
  })

  it('uses one label list for a card and for the filter', () => {
    const raw = ['Meta Quest Pro', 'Quest 3S', 'Oculus Quest 2', 'quest 3', 'Quest 2']
    const cardLabels = normalizeHeadsetList(raw)
    const filterLabels = headsetFilterOptions([raw])

    expect(cardLabels).toEqual(['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'])
    expect(filterLabels).toEqual(cardLabels)
    expect(portSupportsHeadset(raw, 'Quest Pro')).toBe(true)
    expect(portSupportsHeadset(['Quest 2', 'Quest 3'], 'Quest Pro')).toBe(false)
  })

  it('offers Quest Pro from the catalog and Quest 1 only when the data has it', () => {
    const options = headsetFilterOptions(INITIAL_PORTS.map(port => port.supported_hardware))
    expect(options).toContain('Quest Pro')
    expect(options).toEqual(['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'])

    expect(headsetFilterOptions([['Quest 3'], ['Oculus Quest']])).toEqual(['Quest 1', 'Quest 3'])
    expect(headsetFilterOptions([['Pico 4', 'Quest 2']])).toEqual(['Quest 2', 'Pico 4'])
  })

  it('shows the same headset labels on the detail chips as on the filter', () => {
    const hardware = ['Meta Quest Pro', 'Quest 3S', 'Oculus Quest 2']
    const view = buildPortFeatureView({ supported_hardware: hardware })
    expect(view.chips.find(group => group.id === 'headsets')?.chips).toEqual(normalizeHeadsetList(hardware))
  })
})
