import { describe, expect, it } from 'vitest'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { isReleasePageUrl, noPcFolders, noPcInstall, noPcSteps } from '../app/lib/noPcInstall'

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

  it('writes steps a Quest-only player can follow', () => {
    const one = noPcSteps({ needsFiles: true, folders: ['/sdcard/Morrowind/'] })
    expect(one).toHaveLength(4)
    expect(one.join(' ')).toContain('/sdcard/Morrowind/')
    expect(one.join(' ')).toContain('We do not host them')
    expect(one.join(' ')).not.toMatch(/adb|SideQuest|USB|PC/i)
    expect(noPcSteps({ needsFiles: false })).toHaveLength(2)
    expect(noPcSteps({ needsFiles: true })[2]).toContain('pick the files when it asks')
  })

  it('points to the guide when a port uses several folders', () => {
    const steps = noPcSteps({ needsFiles: true, folders: ['/sdcard/a/', '/sdcard/b/'] })
    expect(steps[2]).toContain('install guide below')
    expect(steps[2]).not.toContain('/sdcard/a/')
  })

  it('tells the player to pick the .apk when the link is a release page', () => {
    expect(isReleasePageUrl('https://github.com/Team-Beef-Studios/Quake2Quest/releases/latest')).toBe(true)
    expect(isReleasePageUrl('https://github.com/a/b/releases/download/v1/x.apk')).toBe(false)
    expect(isReleasePageUrl('https://sidequestvr.com/app/1')).toBe(false)
    expect(noPcSteps({ needsFiles: false, releasePage: true })[0]).toContain('under Assets')
  })

  it('names only folders the Files app can write to', () => {
    expect(noPcFolders(['/sdcard/Morrowind/'])).toEqual(['/sdcard/Morrowind/'])
    expect(noPcFolders(['/sdcard/Download/', 'N/A', null, '/sdcard/Android/data/x/files/'])).toEqual([])
    expect(noPcFolders(['/sdcard/a/', '/sdcard/a/', '/sdcard/b/'])).toEqual(['/sdcard/a/', '/sdcard/b/'])
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
