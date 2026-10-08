import { describe, it, expect } from 'vitest'
import {
  PORT_PACKAGE_CONFIGS,
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
        '/sdcard/GalaxyQuest/sys/': ['some_readme.txt', 'savegame.sav']
      }

      const listRemoteDirFn = async (path: string) => mockFs[path] || []

      const result = await verifyPortFoldersOnQuest('galaxyquest', listRemoteDirFn)
      const sysFolder = result.folders.find(f => f.folderDef.id === 'gq_sys')
      expect(sysFolder?.status).toBe('incomplete')
      expect(sysFolder?.missingExpectedFiles).toContain('main.dol')
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
  })
})
