import { describe, it, expect } from 'vitest'
import { PORT_EXPANSIONS, getPortCampaigns, getDefaultFolderInfo } from '../app/data/expansions'
import { INITIAL_PORTS } from '../app/data/mockPorts'

describe('Port Campaigns & Expansions Engine', () => {
  describe('PORT_EXPANSIONS Multi-campaign integrity', () => {
    it('defines Lambda1VR campaigns (Half-Life 1, Opposing Force, Blue Shift)', () => {
      const hl = PORT_EXPANSIONS['lambda1vr']
      expect(hl).toBeDefined()
      expect(hl.length).toBe(3)

      const base = hl.find(c => c.id === 'hl1')
      const opfor = hl.find(c => c.id === 'opfor')
      const bshift = hl.find(c => c.id === 'bshift')

      expect(base?.isBase).toBe(true)
      expect(base?.folder).toBe('valve')
      expect(base?.fullPath).toBe('/sdcard/xash/valve/')
      expect(base?.storeUrl).toContain('steampowered.com')

      expect(opfor?.isBase).toBe(false)
      expect(opfor?.folder).toBe('gearbox')
      expect(opfor?.fullPath).toBe('/sdcard/xash/gearbox/')

      expect(bshift?.isBase).toBe(false)
      expect(bshift?.folder).toBe('bshift')
      expect(bshift?.fullPath).toBe('/sdcard/xash/bshift/')
    })

    it('defines SourceVR campaigns (Half-Life 2, Episode One, Episode Two, Portal)', () => {
      const source = PORT_EXPANSIONS['sourcevr']
      expect(source).toBeDefined()
      expect(source.length).toBe(4)

      const hl2 = source.find(c => c.id === 'hl2')
      const ep1 = source.find(c => c.id === 'ep1')
      const ep2 = source.find(c => c.id === 'ep2')
      const portal = source.find(c => c.id === 'portal')

      expect(hl2?.isBase).toBe(true)
      expect(hl2?.folder).toBe('hl2')
      expect(hl2?.fullPath).toBe('/sdcard/SourceVRPort/common/hl2/')

      expect(ep1?.isBase).toBe(false)
      expect(ep1?.folder).toBe('episodic')
      expect(ep1?.fullPath).toBe('/sdcard/SourceVRPort/common/episodic/')

      expect(ep2?.isBase).toBe(false)
      expect(ep2?.folder).toBe('ep2')
      expect(ep2?.fullPath).toBe('/sdcard/SourceVRPort/common/ep2/')

      expect(portal?.isBase).toBe(false)
      expect(portal?.folder).toBe('portal')
      expect(portal?.fullPath).toBe('/sdcard/SourceVRPort/common/portal/')
    })

    it('defines Doom 3 Quest campaigns (Base and Resurrection of Evil)', () => {
      const doom = PORT_EXPANSIONS['doom3quest']
      expect(doom).toBeDefined()
      expect(doom.length).toBe(2)

      const base = doom.find(c => c.id === 'base')
      const d3xp = doom.find(c => c.id === 'd3xp')

      expect(base?.isBase).toBe(true)
      expect(base?.folder).toBe('base')
      expect(base?.fullPath).toBe('/sdcard/Doom3Quest/base/')

      expect(d3xp?.isBase).toBe(false)
      expect(d3xp?.folder).toBe('d3xp')
      expect(d3xp?.fullPath).toBe('/sdcard/Doom3Quest/d3xp/')
    })

    it('defines Quake 2 Quest campaigns (Base and Mission Packs)', () => {
      const q2 = PORT_EXPANSIONS['quake2quest']
      expect(q2).toBeDefined()
      expect(q2.length).toBe(3)

      const base = q2.find(c => c.id === 'baseq2')
      const reckoning = q2.find(c => c.id === 'xatrix')
      const groundZero = q2.find(c => c.id === 'rogue')

      expect(base?.isBase).toBe(true)
      expect(base?.folder).toBe('baseq2')
      expect(base?.fullPath).toBe('/sdcard/Quake2Quest/baseq2/')

      expect(reckoning?.folder).toBe('xatrix')
      expect(groundZero?.folder).toBe('rogue')
    })

    it('defines RazeXR Build Engine campaigns (Duke 3D, Blood, Shadow Warrior)', () => {
      const raze = PORT_EXPANSIONS['razexr']
      expect(raze).toBeDefined()
      expect(raze.length).toBeGreaterThanOrEqual(3)

      const duke = raze.find(c => c.id === 'duke3d')
      const blood = raze.find(c => c.id === 'blood')
      const sw = raze.find(c => c.id === 'sw')

      expect(duke?.folder).toBe('duke3d')
      expect(blood?.folder).toBe('blood')
      expect(sw?.folder).toBe('sw')
    })

    it('ensures each multi-campaign port has exactly one base campaign', () => {
      for (const [slug, campaigns] of Object.entries(PORT_EXPANSIONS)) {
        const baseCampaigns = campaigns.filter(c => c.isBase)
        expect(baseCampaigns.length, `${slug} must have exactly one base campaign`).toBe(1)
      }
    })
  })

  describe('getDefaultFolderInfo custom mapping and fallback', () => {
    it('returns custom definitions for known standalone ports', () => {
      const citra = getDefaultFolderInfo({ slug: 'citravr', internal_storage_path: '/sdcard/CitraVR/' } as any)
      expect(citra.folder).toBe('roms')
      expect(citra.fullPath).toBe('/sdcard/CitraVR/roms/')
      expect(citra.exampleFiles).toContain('ROMs')

      const shar = getDefaultFolderInfo({ slug: 'simpsonshitrun', internal_storage_path: '/sdcard/SimpsonsHitRun/' } as any)
      expect(shar.folder).toBe('SimpsonsHitRun')
      expect(shar.fullPath).toBe('/sdcard/SimpsonsHitRun/')
    })

    it('derives folder correctly from arbitrary internal_storage_path', () => {
      const customPort = {
        slug: 'custom-game',
        internal_storage_path: '/sdcard/MyGameFolder/'
      } as any

      const info = getDefaultFolderInfo(customPort)
      expect(info.folder).toBe('MyGameFolder')
      expect(info.fullPath).toBe('/sdcard/MyGameFolder/')
    })
  })

  describe('getPortCampaigns cross-validation on all 37 ports', () => {
    it('generates at least one valid campaign for every single port in INITIAL_PORTS', () => {
      expect(INITIAL_PORTS.length).toBe(37)

      for (const port of INITIAL_PORTS) {
        const campaigns = getPortCampaigns(port)
        expect(campaigns.length, `${port.slug} must have at least 1 campaign`).toBeGreaterThanOrEqual(1)

        for (const c of campaigns) {
          expect(c.id).toBeTruthy()
          expect(c.name).toBeTruthy()
          expect(c.badge).toBeTruthy()
          expect(c.folder).toBeTruthy()
          expect(c.exampleFiles).toBeTruthy()
          expect(c.instruction).toBeTruthy()

          // Path formatting check
          if (!port.internal_storage_path?.startsWith('N/A')) {
            expect(c.fullPath.startsWith('/sdcard/'), `${port.slug} campaign path must start with /sdcard/`).toBe(true)
            expect(c.fullPath.endsWith('/'), `${port.slug} campaign path must end with /`).toBe(true)
            expect(c.fullPath.includes('//sdcard'), `${port.slug} cannot contain double slashes`).toBe(false)
          }
        }
      }
    })
  })
})
