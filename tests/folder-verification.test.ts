import { describe, it, expect } from 'vitest'
import {
  PORT_PACKAGE_CONFIGS,
  RemoteDirDeniedError,
  assessCampaignOnQuest,
  campaignPresenceIsAnyFile,
  verifyPortFoldersOnQuest,
  matchFolderRequirement,
  type PortFolderRequirement
} from '../app/data/portPackageMap'

describe('Folder & Asset Verification Engine (Real-world Quest FS simulation)', () => {
  describe('matchFolderRequirement helper unit tests', () => {
    it('matches expected files with exact and case-insensitive matching', () => {
      const folderDef: PortFolderRequirement = {
        id: 'main',
        name: 'Main Assets',
        folderName: 'main',
        targetPath: '/sdcard/RTCWQuest/main/',
        required: true,
        expectedFiles: ['pak0.pk3']
      }

      expect(matchFolderRequirement('pak0.pk3', folderDef)).toBe(true)
      expect(matchFolderRequirement('PAK0.PK3', folderDef)).toBe(true)
      expect(matchFolderRequirement('/sdcard/RTCWQuest/main/pak0.pk3', folderDef)).toBe(true)
      expect(matchFolderRequirement('/sdcard/RTCWQuest/main/PAK0.PK3', folderDef)).toBe(true)
      expect(matchFolderRequirement('other_file.txt', folderDef)).toBe(false)
    })

    it('matches fileExtensionPattern regex correctly', () => {
      const wadFolderDef: PortFolderRequirement = {
        id: 'wads',
        name: 'Doom WADs',
        folderName: 'wads',
        targetPath: '/sdcard/QuestZDoom/wads/',
        required: true,
        fileExtensionPattern: '\\.wad$'
      }

      expect(matchFolderRequirement('doom.wad', wadFolderDef)).toBe(true)
      expect(matchFolderRequirement('DOOM2.WAD', wadFolderDef)).toBe(true)
      expect(matchFolderRequirement('freedoom.WAD', wadFolderDef)).toBe(true)
      expect(matchFolderRequirement('config.cfg', wadFolderDef)).toBe(false)
      expect(matchFolderRequirement('doom.wad.bak', wadFolderDef)).toBe(false)
    })

    it('accepts any file when no specific expectedFiles or pattern is defined', () => {
      const openFolderDef: PortFolderRequirement = {
        id: 'custom',
        name: 'Custom Folder',
        folderName: 'custom',
        targetPath: '/sdcard/Custom/',
        required: false
      }

      expect(matchFolderRequirement('anything.bin', openFolderDef)).toBe(true)
    })
  })

  describe('verifyPortFoldersOnQuest simulated filesystem tests', () => {
    it('returns ready when all required files are present (RTCWQuest)', async () => {
      const mockFs: Record<string, string[]> = {
        '/sdcard/RTCWQuest/main/': ['pak0.pk3', 'autoexec.cfg', 'mp_pak0.pk3']
      }

      const listRemoteDirFn = async (path: string) => mockFs[path] || []

      const result = await verifyPortFoldersOnQuest('rtcwquest', listRemoteDirFn)
      expect(result.folders.length).toBe(1)
      expect(result.folders[0].status).toBe('ready')
      expect(result.folders[0].missingExpectedFiles).toEqual([])
      expect(result.isOverallReady).toBe(true)
    })

    it('handles uppercase file names on Android filesystem (case insensitivity)', async () => {
      const mockFs: Record<string, string[]> = {
        '/sdcard/RTCWQuest/main/': ['PAK0.PK3']
      }

      const listRemoteDirFn = async (path: string) => mockFs[path] || []

      const result = await verifyPortFoldersOnQuest('rtcwquest', listRemoteDirFn)
      expect(result.folders[0].status).toBe('ready')
      expect(result.isOverallReady).toBe(true)
    })

    it('returns incomplete when folder exists but expected files are missing', async () => {
      const mockFs: Record<string, string[]> = {
        '/sdcard/Android/data/com.galaxy.quest/files/game/sys/': ['some_readme.txt', 'savegame.sav']
      }

      const listRemoteDirFn = async (path: string) => mockFs[path] || []

      const result = await verifyPortFoldersOnQuest('galaxyquest', listRemoteDirFn)
      const sysFolder = result.folders.find(f => f.folderDef.id === 'gq_sys')
      expect(sysFolder?.status).toBe('incomplete')
      expect(sysFolder?.missingExpectedFiles).toContain('fst.bin')
      expect(result.isOverallReady).toBe(false)
    })

    it('returns missing when remote directory does not exist or throws', async () => {
      const listRemoteDirFn = async () => {
        throw new Error('Directory not found: 404')
      }

      const result = await verifyPortFoldersOnQuest('doom3quest', listRemoteDirFn)
      expect(result.folders.length).toBeGreaterThan(0)
      expect(result.folders.every(f => f.status === 'missing')).toBe(true)
      expect(result.isOverallReady).toBe(false)
    })

    it('detects Simpsons Hit & Run in standard path (/sdcard/SimpsonsHitRun/)', async () => {
      const mockFs: Record<string, string[]> = {
        '/sdcard/SimpsonsHitRun/art/': ['frontend.p3d', 'cars.p3d'],
        '/sdcard/SimpsonsHitRun/sound/': ['dialogue.rcf', 'music.rcf']
      }

      const listRemoteDirFn = async (path: string) => mockFs[path] || []

      const result = await verifyPortFoldersOnQuest('simpsonshitrun', listRemoteDirFn)
      expect(result.folders.length).toBe(2)
      expect(result.folders.every(f => f.status === 'ready')).toBe(true)
      expect(result.isOverallReady).toBe(true)
      expect(result.folders[0].detectedPath).toBe('/sdcard/SimpsonsHitRun/art/')
      expect(result.folders[1].detectedPath).toBe('/sdcard/SimpsonsHitRun/sound/')
    })

    it('detects Simpsons Hit & Run in legacy alternative path (/sdcard/SHAR/)', async () => {
      const mockFs: Record<string, string[]> = {
        '/sdcard/SHAR/art/': ['frontend.p3d', 'chars.p3d'],
        '/sdcard/SHAR/sound/': ['sound.rcf']
      }

      const listRemoteDirFn = async (path: string) => mockFs[path] || []

      const result = await verifyPortFoldersOnQuest('simpsonshitrun', listRemoteDirFn)
      expect(result.folders.length).toBe(2)
      expect(result.folders.every(f => f.status === 'ready')).toBe(true)
      expect(result.isOverallReady).toBe(true)
      expect(result.folders[0].detectedPath).toBe('/sdcard/SHAR/art/')
      expect(result.folders[1].detectedPath).toBe('/sdcard/SHAR/sound/')
    })

    it('detects Prey VR in altPaths (/sdcard/preyvr/preybase/)', async () => {
      const mockFs: Record<string, string[]> = {
        '/sdcard/preyvr/preybase/': ['pak000.pk4', 'pak001.pk4']
      }

      const listRemoteDirFn = async (path: string) => mockFs[path] || []

      const result = await verifyPortFoldersOnQuest('preyvr', listRemoteDirFn)
      expect(result.folders[0].status).toBe('ready')
      expect(result.folders[0].detectedPath).toBe('/sdcard/preyvr/preybase/')
      expect(result.isOverallReady).toBe(true)
    })

    it('handles multiple folders where required folder is ready and optional is missing', async () => {
      // Doom 3: base is required (needs pak000.pk4 & pak001.pk4), d3xp (expansion) is optional
      const mockFs: Record<string, string[]> = {
        '/sdcard/Doom3Quest/base/': ['pak000.pk4', 'pak001.pk4']
      }

      const listRemoteDirFn = async (path: string) => mockFs[path] || []

      const result = await verifyPortFoldersOnQuest('doom3quest', listRemoteDirFn)
      const baseFolder = result.folders.find(f => f.folderDef.folderName === 'base')
      const d3xpFolder = result.folders.find(f => f.folderDef.folderName === 'd3xp')

      expect(baseFolder?.status).toBe('ready')
      expect(d3xpFolder?.status).toBe('missing')
      // Overall should be ready because only base is required!
      expect(result.isOverallReady).toBe(true)
    })

    it('handles QuestZDoom extension pattern matching with WAD files', async () => {
      const mockFs: Record<string, string[]> = {
        '/sdcard/QuestZDoom/wads/': ['DOOM2.WAD', 'plutonia.wad']
      }

      const listRemoteDirFn = async (path: string) => mockFs[path] || []

      const result = await verifyPortFoldersOnQuest('questzdoom', listRemoteDirFn)
      const wadsFolder = result.folders.find(f => f.folderDef.id === 'qzdoom_wads')
      expect(wadsFolder?.status).toBe('ready')
      expect(result.isOverallReady).toBe(true)
    })

    it('detects No One Lives ForeVR REZ archives in /sdcard/nolf/', async () => {
      const mockFs: Record<string, string[]> = {
        '/sdcard/nolf/': ['NOLF.REZ', 'NOLF2.REZ', 'nolfu003.rez', 'nolfu003cres.rez']
      }
      const listRemoteDirFn = async (path: string) => mockFs[path] || []
      const result = await verifyPortFoldersOnQuest('nolf-vr', listRemoteDirFn)
      expect(result.folders[0].status).toBe('ready')
      expect(result.isOverallReady).toBe(true)
    })

    it('detects NOLF archives in the scoped Android/data fallback path', async () => {
      const mockFs: Record<string, string[]> = {
        '/sdcard/Android/data/net.relith.nolf/files/nolf/': ['NOLF.REZ', 'NOLF2.REZ', 'nolfu003.rez', 'nolfu003cres.rez']
      }
      const listRemoteDirFn = async (path: string) => mockFs[path] || []
      const result = await verifyPortFoldersOnQuest('nolf-vr', listRemoteDirFn)
      expect(result.folders[0].status).toBe('ready')
      expect(result.folders[0].detectedPath).toBe('/sdcard/Android/data/net.relith.nolf/files/nolf/')
      expect(result.isOverallReady).toBe(true)
    })

    it('handles ports with direct sideload and no folders defined', async () => {
      const listRemoteDirFn = async () => []
      const result = await verifyPortFoldersOnQuest('questcraft', listRemoteDirFn)
      expect(result.folders).toEqual([])
      expect(result.isOverallReady).toBe(false)
    })

    it('keeps RTCW incomplete when the folder only has a stray pk3', async () => {
      const listRemoteDirFn = async (path: string) => {
        if (path === '/sdcard/RTCWQuest/main/') return ['readme.txt', 'pak1.pk3']
        return []
      }
      const result = await verifyPortFoldersOnQuest('rtcwquest', listRemoteDirFn)
      expect(result.folders[0].status).toBe('incomplete')
      expect(result.folders[0].missingExpectedFiles).toContain('pak0.pk3')
      expect(result.isOverallReady).toBe(false)
    })

    it('keeps looking at later paths when an earlier folder only has stray files', async () => {
      const listRemoteDirFn = async (path: string) => {
        if (path === '/sdcard/preyvr/preybase/') return ['notes.txt']
        if (path === '/sdcard/PreyVR/base/') return ['pak000.pk4']
        return []
      }
      const result = await verifyPortFoldersOnQuest('preyvr', listRemoteDirFn)
      expect(result.folders[0].status).toBe('ready')
      expect(result.folders[0].detectedPath).toBe('/sdcard/PreyVR/base/')
      expect(result.isOverallReady).toBe(true)
    })

    it('accepts Halo when ui.map and bloodgulch.map are in Documents, and rejects a lone map', async () => {
      const stray = await verifyPortFoldersOnQuest('halocequest', async (path) => {
        if (path === '/sdcard/Documents/HaloCE/maps/') return ['custom.map', 'readme.txt']
        return []
      })
      expect(stray.isOverallReady).toBe(false)

      const maps = await verifyPortFoldersOnQuest('halocequest', async (path) => {
        if (path === '/sdcard/Documents/HaloCE/maps/') return ['ui.map', 'bloodgulch.map']
        return []
      })
      expect(maps.isOverallReady).toBe(true)
      expect(maps.folders[0].detectedPath).toBe('/sdcard/Documents/HaloCE/maps/')

      const iso = await verifyPortFoldersOnQuest('halocequest', async (path) => {
        if (path === '/sdcard/Android/data/com.halo.decomp.vr/files/maps/') return ['halo.iso']
        return []
      })
      expect(iso.isOverallReady).toBe(true)
      expect(iso.folders[0].detectedPath).toBe('/sdcard/Android/data/com.halo.decomp.vr/files/maps/')
    })

    it('accepts QuestSam SE1_00.gro in the app folder or the legacy folder, not a stray gro', async () => {
      const stray = await assessCampaignOnQuest('questsam', {
        id: 'base',
        fullPath: '/sdcard/Android/data/com.github.maranone.questsam/files/',
        folder: 'files'
      }, async (path) => path === '/sdcard/Android/data/com.github.maranone.questsam/files/' ? ['other.gro'] : [])
      expect(stray.exists).toBe(false)

      const primary = await assessCampaignOnQuest('questsam', {
        id: 'base',
        fullPath: '/sdcard/Android/data/com.github.maranone.questsam/files/',
        folder: 'files'
      }, async (path) => path === '/sdcard/Android/data/com.github.maranone.questsam/files/' ? ['SE1_00.gro'] : [])
      expect(primary.exists).toBe(true)

      const legacy = await assessCampaignOnQuest('questsam', {
        id: 'base',
        fullPath: '/sdcard/Android/data/com.github.maranone.questsam/files/',
        folder: 'files'
      }, async (path) => path === '/sdcard/questsam/' ? ['SE1_00.gro'] : [])
      expect(legacy.exists).toBe(true)
      expect(legacy.matchedPath).toBe('/sdcard/questsam/')
    })

    it('requires Perfect Dark pd.ntsc-final.z64 and treats a denied Android/data listing as unreadable', async () => {
      const campaign = {
        id: 'base',
        fullPath: '/sdcard/Android/data/com.perfectdark.port/files/data/',
        folder: 'data'
      }
      const stray = await assessCampaignOnQuest('perfect-dark-vr', campaign, async (path) => {
        if (path === '/sdcard/Android/data/com.perfectdark.port/files/data/') return ['pd.z64', 'unrelated-note.txt']
        return []
      })
      expect(stray.exists).toBe(false)
      expect(stray.confirmReason).toBeNull()

      const ready = await assessCampaignOnQuest('perfect-dark-vr', campaign, async (path) => {
        if (path === '/storage/emulated/0/Android/data/com.perfectdark.port/files/data/') return ['pd.ntsc-final.z64']
        return []
      })
      expect(ready.exists).toBe(true)

      const denied = await assessCampaignOnQuest('perfect-dark-vr', campaign, async () => {
        throw new RemoteDirDeniedError('/sdcard/Android/data/com.perfectdark.port/files/data')
      })
      expect(denied.exists).toBe(false)
      expect(denied.confirmReason).toBe('unreadable')
    })

    it('does not treat a GoldenEye ROM that is only in Download as imported', async () => {
      const result = await assessCampaignOnQuest('goldeneye-vr', {
        id: 'base',
        fullPath: '/sdcard/Android/data/com.gevr.port/files/data/',
        folder: 'data'
      }, async (path) => path === '/sdcard/Download/' ? ['GoldenEye.z64'] : [])
      expect(result.exists).toBe(false)

      const imported = await assessCampaignOnQuest('goldeneye-vr', {
        id: 'base',
        fullPath: '/sdcard/Android/data/com.gevr.port/files/data/',
        folder: 'data'
      }, async (path) => path === '/sdcard/Android/data/com.gevr.port/files/data/' ? ['ge.z64'] : [])
      expect(imported.exists).toBe(true)
    })

    it('asks the player to confirm Gran Turismo 2 instead of treating any file as the disc data', async () => {
      const result = await assessCampaignOnQuest('gran-turismo-2-vr', {
        id: 'base',
        fullPath: '/sdcard/Android/data/io.github.gt2pc.quest/files/',
        folder: 'files'
      }, async () => ['unrelated-note.txt', 'game.bin'])
      expect(result.exists).toBe(false)
      expect(result.confirmReason).toBe('unproven')
    })

    it('accepts Raze GRP files in the subfolder or the engine root', async () => {
      const campaign = { id: 'duke3d', fullPath: '/sdcard/RazeXR/duke3d/', folder: 'duke3d' }
      const stray = await assessCampaignOnQuest('razexr', campaign, async () => ['unrelated-note.txt'])
      expect(stray.exists).toBe(false)
      const root = await assessCampaignOnQuest('razexr', campaign, async (path) => {
        if (path === '/sdcard/RazeXR/') return ['duke3d.grp']
        return []
      })
      expect(root.exists).toBe(true)
      expect(root.matchedPath).toBe('/sdcard/RazeXR/')
    })

    it('requires a real ROM for CitraVR, PPSSPP VR, and PrimedGun', async () => {
      expect(campaignPresenceIsAnyFile('citravr')).toBe(false)
      expect(campaignPresenceIsAnyFile('ppsspp-vr')).toBe(false)
      expect(campaignPresenceIsAnyFile('primedgun')).toBe(false)
      expect(PORT_PACKAGE_CONFIGS.citravr.folders?.[0].required).toBe(true)
      expect(PORT_PACKAGE_CONFIGS['ppsspp-vr'].folders?.[0].required).toBe(true)
      expect(PORT_PACKAGE_CONFIGS.primedgun.folders?.[0].required).toBe(true)

      const prime = { id: 'base', fullPath: '/sdcard/PrimedGun/', folder: 'PrimedGun' }
      const strayPrime = await assessCampaignOnQuest('primedgun', prime, async () => ['unrelated-note.txt'])
      expect(strayPrime.exists).toBe(false)
      const iso = await assessCampaignOnQuest('primedgun', prime, async () => ['Metroid Prime (USA) (Rev 0).iso'])
      expect(iso.exists).toBe(true)
      const nkit = await assessCampaignOnQuest('primedgun', prime, async () => ['Metroid Prime (USA).nkit.iso'])
      expect(nkit.exists).toBe(true)
      const ciso = await assessCampaignOnQuest('primedgun', prime, async () => ['prime.ciso'])
      expect(ciso.exists).toBe(true)
      const gcz = await assessCampaignOnQuest('primedgun', prime, async () => ['prime.gcz'])
      expect(gcz.exists).toBe(true)
      const homebrew = await assessCampaignOnQuest('primedgun', prime, async () => ['boot.dol', 'notes.json'])
      expect(homebrew.exists).toBe(false)

      const citra = { id: 'base', fullPath: '/sdcard/CitraVR/roms/', folder: 'roms' }
      const strayCitra = await assessCampaignOnQuest('citravr', citra, async () => ['unrelated-note.txt'])
      expect(strayCitra.exists).toBe(false)
      const rom = await assessCampaignOnQuest('citravr', citra, async () => ['game.3ds'])
      expect(rom.exists).toBe(true)
      const homebrew3ds = await assessCampaignOnQuest('citravr', citra, async () => ['homebrew.3dsx'])
      expect(homebrew3ds.exists).toBe(true)
      const cia = await assessCampaignOnQuest('citravr', citra, async () => ['game.cia'])
      expect(cia.exists).toBe(true)
      const wikiFolder = await assessCampaignOnQuest('citravr', citra, async (path) => {
        if (path === '/sdcard/3DS Games/') return ['game.cci']
        return []
      })
      expect(wikiFolder.exists).toBe(true)
      expect(wikiFolder.matchedPath).toBe('/sdcard/3DS Games/')

      const psp = { id: 'base', fullPath: '/sdcard/PSP/GAME/', folder: 'GAME' }
      const strayPsp = await assessCampaignOnQuest('ppsspp-vr', psp, async () => ['unrelated-note.txt', 'homebrew.elf'])
      expect(strayPsp.exists).toBe(false)
      const chd = await assessCampaignOnQuest('ppsspp-vr', psp, async () => ['game.chd'])
      expect(chd.exists).toBe(true)
      const alias = await assessCampaignOnQuest('ppsspp-vr', psp, async (path) => {
        if (path === '/storage/emulated/0/PSP/GAME/') return ['game.pbp']
        return []
      })
      expect(alias.exists).toBe(true)
    })
  })
})
