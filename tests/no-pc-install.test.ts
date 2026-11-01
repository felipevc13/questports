import { describe, expect, it } from 'vitest'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { noPcInstall } from '../app/lib/noPcInstall'

describe('noPcInstall', () => {
  it('marks ports that need a PC tool as no', () => {
    for (const slug of ['gta-sa-vr-quest', 'vice-city-vr-quest', 'magic-carpet-vr', 'starfox-enhanced-vr', 'crazy-taxi-vr']) {
      expect(noPcInstall(slug)).toBe('no')
    }
  })

  it('marks picker and /sdcard ports as yes', () => {
    for (const slug of ['xrkart-64', 'wave-race-64-vr', 'time-crisis-vr', 'hotd-vr', 'twilight-princess-vr']) {
      expect(noPcInstall(slug)).toBe('yes')
    }
  })

  it('does not call a game that needs a PC install yes', () => {
    for (const slug of ['qualyx', 'quake2quest', 'openmw-vr', 'rtcwquest', 'simpsonshitrun', 'nolf-vr', 'doom3quest']) {
      expect(noPcInstall(slug)).toBe('unknown')
    }
  })

  it('treats in-app ROM pickers as yes even when the app copies to Android/data', () => {
    expect(noPcInstall('goldeneye-vr')).toBe('yes')
    expect(noPcInstall('perfect-dark-vr')).toBe('yes')
    expect(noPcInstall('galaxyquest')).toBe('no')
  })

  it('leaves Android/data ports unknown until someone tests them on a Quest', () => {
    expect(noPcInstall('descent-3-vr')).toBe('unknown')
    expect(noPcInstall('ut99-vr-quest')).toBe('unknown')
  })

  it('never claims yes for a port that needs a PC tool', () => {
    expect(noPcInstall(undefined)).toBe('unknown')
    expect(noPcInstall('not-a-port')).toBe('unknown')
  })

  it('only names mapped ports', () => {
    for (const slug of ['xrkart-64', 'gta-sa-vr-quest']) expect(PORT_PACKAGE_CONFIGS[slug]).toBeTruthy()
  })

  it('keeps the two lists apart and only lists known ports', () => {
    const mapped = Object.keys(PORT_PACKAGE_CONFIGS)
    const yes = mapped.filter(slug => noPcInstall(slug) === 'yes')
    const no = mapped.filter(slug => noPcInstall(slug) === 'no')
    expect(yes.length).toBe(49)
    expect(no.length).toBe(11)
    expect(yes.filter(slug => no.includes(slug))).toEqual([])
    for (const slug of mapped) {
      if (PORT_PACKAGE_CONFIGS[slug].installType === 'pc_builder_required') expect(noPcInstall(slug)).toBe('no')
    }
  })

  it('does not call a mock catalog port yes when it needs a PC tool', () => {
    for (const port of INITIAL_PORTS) {
      if (PORT_PACKAGE_CONFIGS[port.slug]?.installType === 'pc_builder_required') expect(noPcInstall(port.slug)).not.toBe('yes')
    }
  })
})
