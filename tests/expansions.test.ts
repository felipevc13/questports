import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { PORT_EXPANSIONS, getPortCampaigns, getDefaultFolderInfo } from '../app/data/expansions'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { catalogInstallFacts } from '../app/lib/catalogInstallFacts'

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
      expect(base?.instruction).toContain('steam_legacy')
      expect(base?.instruction).toContain('Pre-25th Anniversary Build')

      expect(opfor?.isBase).toBe(false)
      expect(opfor?.folder).toBe('gearbox')
      expect(opfor?.fullPath).toBe('/sdcard/xash/gearbox/')

      expect(bshift?.isBase).toBe(false)
      expect(bshift?.folder).toBe('bshift')
      expect(bshift?.fullPath).toBe('/sdcard/xash/bshift/')
    })

    it('defines No One Lives ForeVR campaigns (base REZ + GOTY bonus chapter)', () => {
      const nolf = PORT_EXPANSIONS['nolf-vr']
      expect(nolf).toBeDefined()
      expect(nolf.length).toBe(2)
      expect(nolf.find(c => c.id === 'nolf_base')?.isBase).toBe(true)
      expect(nolf.find(c => c.id === 'nolf_base')?.fullPath).toBe('/sdcard/nolf/')
      expect(nolf.find(c => c.id === 'nolf_goty')?.exampleFiles).toContain('NOLFGOTY.REZ')
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
      expect(base?.steamPath).toBe('Doom 3/base/')
      expect(base?.exampleFiles).toContain('game00.pk4')

      expect(d3xp?.isBase).toBe(false)
      expect(d3xp?.folder).toBe('d3xp')
      expect(d3xp?.fullPath).toBe('/sdcard/Doom3Quest/d3xp/')
    })

    it('defines Quake 2 Quest as the base game only', () => {
      const q2 = PORT_EXPANSIONS['quake2quest']
      expect(q2).toBeDefined()
      expect(q2.length).toBe(1)

      const base = q2.find(c => c.id === 'baseq2')
      expect(base?.isBase).toBe(true)
      expect(base?.folder).toBe('Quake2Quest')
      expect(base?.fullPath).toBe('/sdcard/Quake2Quest/')
      expect(base?.steamPath).toBe('Quake 2/baseq2/')
      expect(q2.map(c => c.id)).not.toEqual(expect.arrayContaining(['xatrix', 'rogue']))

      const folders = PORT_PACKAGE_CONFIGS.quake2quest.folders || []
      expect(folders.map(folder => folder.id)).toEqual(['q2_base'])
      expect(folders.some(folder => folder.campaignId === 'xatrix' || folder.campaignId === 'rogue')).toBe(false)
    })

    it('does not publish Quake II mission-pack install paths', () => {
      const catalog = [
        JSON.stringify(PORT_EXPANSIONS),
        JSON.stringify(PORT_PACKAGE_CONFIGS),
        ...INITIAL_PORTS.flatMap(port => [port.installation_guide, port.troubleshooting_notes])
      ].join('\n')
      expect(catalog).not.toMatch(/\/sdcard\/Quake2Quest\/(?:xatrix|rogue)\//)

      const quake2 = INITIAL_PORTS.find(port => port.slug === 'quake2quest')
      const campaigns = getPortCampaigns(quake2!)
      expect(campaigns).toHaveLength(1)
      expect(campaigns[0]?.id).toBe('baseq2')
    })

    it('makes the steam_legacy beta the Lambda1VR copy step', () => {
      const lambda = INITIAL_PORTS.find(port => port.slug === 'lambda1vr')
      expect(lambda).toBeTruthy()
      const guide = lambda!.installation_guide
      const betaStep = guide.indexOf('steam_legacy')
      const copyStep = guide.indexOf('/sdcard/xash/valve/')
      expect(betaStep).toBeGreaterThan(-1)
      expect(copyStep).toBeGreaterThan(betaStep)
      expect(guide).toContain('Properties')
      expect(guide).toContain('Betas')
      expect(guide).toContain('Pre-25th Anniversary Build')
      expect(guide).toContain('steamapps/common/Half-Life/valve/')
      expect(guide).toContain('hl-paker README, 2025-04-04')
      expect(guide).toContain('r/TeamBeef pinned post')
      expect(guide).not.toContain('Whether the current public build still fails')
      expect(guide).not.toContain('If the 25th anniversary update still breaks')

      const notes = lambda!.troubleshooting_notes || ''
      expect(notes).toContain('steam_legacy')
      expect(notes).toContain('Pre-25th Anniversary Build')
      expect(notes).not.toContain('If the 25th anniversary update still breaks')

      const guidance = PORT_PACKAGE_CONFIGS.lambda1vr.fileGuidance || ''
      expect(guidance).toContain('steam_legacy')
      expect(guidance).toContain('/sdcard/xash/valve/')
      expect(guidance).not.toContain('may require')

      const migration = readFileSync('supabase/migrations/20261009160000_lambda1vr_steam_legacy.sql', 'utf8')
      const seed = readFileSync('supabase/seed.sql', 'utf8')
      const setup = readFileSync('supabase/full_setup.sql', 'utf8')
      for (const source of [migration, seed, setup]) {
        expect(source).toContain(guide)
        expect(source).toContain(notes)
        expect(source).not.toContain('/sdcard/Quake2Quest/xatrix/')
        expect(source).not.toContain('/sdcard/Quake2Quest/rogue/')
      }
      expect(migration).toContain("where slug = 'lambda1vr'")
      expect(migration).toContain('Do not run this from CI')
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

    it('normalizes a DB path that omits /sdcard and keeps N/A text', () => {
      const info = getDefaultFolderInfo({
        slug: 'custom-android-game',
        internal_storage_path: 'Android/data/com.example.game/files'
      } as any)
      expect(info.fullPath).toBe('/sdcard/Android/data/com.example.game/files/')
      expect(info.folder).toBe('files')

      const bundled = getDefaultFolderInfo({
        slug: 'time-crisis-vr',
        internal_storage_path: 'N/A (ROM set bundled in the release APK)'
      } as any)
      expect(bundled.fullPath).toBe('N/A (ROM set bundled in the release APK)')
      expect(bundled.exampleFiles).toBe('No extra files needed')
    })

    it('keeps the corrected install guides on paths the file check scans', () => {
      const facts = catalogInstallFacts()
      for (const slug of ['rtcwquest', 'quakequest', 'quake2quest', 'doom3quest', 'preyvr', 'lambda1vr']) {
        const fact = facts.find(item => item.slug === slug)
        expect(fact, slug).toBeTruthy()
        expect(fact!.guidePathsIgnoredByCard, `${slug}: ${fact!.guidePathsIgnoredByCard.join(', ')}`).toEqual([])
      }
      const prey = INITIAL_PORTS.find(port => port.slug === 'preyvr')
      expect(prey?.installation_guide).toContain('/sdcard/preyvr/preybase/')
      expect(prey?.installation_guide).not.toContain('/sdcard/PreyVR/base/')
      const quake2 = INITIAL_PORTS.find(port => port.slug === 'quake2quest')
      expect(quake2?.installation_guide).toContain('/sdcard/Quake2Quest/')
      expect(quake2?.installation_guide).not.toContain('/sdcard/Quake2Quest/baseq2/')
      expect(quake2?.installation_guide).toContain('Quake 2')
      const rtcw = getDefaultFolderInfo(INITIAL_PORTS.find(port => port.slug === 'rtcwquest')!)
      expect(rtcw.fullPath).toBe('/sdcard/RTCWQuest/Main/')
    })

    it('does not call bundled ports base game assets', () => {
      for (const slug of ['time-crisis-vr', 'questcraft', 'iron-lung-vr']) {
        const port = INITIAL_PORTS.find(item => item.slug === slug)
        expect(port, slug).toBeTruthy()
        const campaign = getPortCampaigns(port!)[0]
        expect(campaign?.exampleFiles, slug).toBe('No extra files needed')
        expect(campaign?.exampleFiles, slug).not.toBe('Base game assets')
      }
    })
  })

  describe('getPortCampaigns cross-validation on all 38 ports', () => {
    it('generates at least one valid campaign for every single port in INITIAL_PORTS', () => {
      expect(INITIAL_PORTS.length).toBe(38)

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
