import { describe, expect, it } from 'vitest'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { noPcFolder, noPcInstall, noPcSteps } from '../app/lib/noPcInstall'

describe('noPcInstall', () => {
  it('marks ports that need a PC tool as no', () => {
    for (const slug of ['gta-sa-vr-quest', 'vice-city-vr-quest', 'magic-carpet-vr', 'starfox-enhanced-vr', 'crazy-taxi-vr']) {
      expect(noPcInstall(slug)).toBe('no')
    }
  })

  it('marks picker and /sdcard ports as yes', () => {
    for (const slug of ['xrkart-64', 'wave-race-64-vr', 'quake3quest', 'time-crisis-vr', 'openmw-vr']) {
      expect(noPcInstall(slug)).toBe('yes')
    }
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
    const withFolder = noPcSteps({ needsFiles: true, folder: '/sdcard/Morrowind/' })
    expect(withFolder).toHaveLength(4)
    expect(withFolder.join(' ')).toContain('/sdcard/Morrowind/')
    expect(withFolder.join(' ')).toContain('We do not host them')
    expect(withFolder.join(' ')).not.toMatch(/adb|SideQuest|USB|PC/i)
    expect(noPcSteps({ needsFiles: false })).toHaveLength(2)
  })

  it('names a folder only when it is not the generic Downloads folder', () => {
    expect(noPcFolder('/sdcard/Morrowind/')).toBe('/sdcard/Morrowind/')
    expect(noPcFolder('/sdcard/Download/')).toBe('')
    expect(noPcFolder('/sdcard/Android/data/x/files/')).toBe('')
    expect(noPcFolder('N/A')).toBe('')
    expect(noPcFolder(null)).toBe('')
  })
})
