import { describe, it, expect, beforeEach } from 'vitest'
import { isPortInstalledOnQuest, PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'

describe('Headset Real-time Sync & Package Lifecycle Test Suite', () => {
  // Helper mirroring getInstalledPackageName from [slug].vue
  const resolveInstalledPackageName = (slug: string, installedPackages: string[]): string | null => {
    if (!slug) return null
    const cfg = PORT_PACKAGE_CONFIGS[slug]
    if (cfg?.packageName && installedPackages.includes(cfg.packageName)) {
      return cfg.packageName
    }
    if (cfg?.altPackages) {
      const found = cfg.altPackages.find(p => installedPackages.includes(p))
      if (found) return found
    }
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (cleanSlug.length >= 3) {
      const matched = installedPackages.find(pkg => {
        const cleanPkg = pkg.toLowerCase().replace(/[^a-z0-9]/g, '')
        return cleanPkg.includes(cleanSlug) || cleanSlug.includes(cleanPkg)
      })
      if (matched) return matched
    }
    return cfg?.packageName || null
  }

  // Helper simulating the card's bidirectional sync watcher
  const simulateCardSync = (
    slug: string,
    isConnected: boolean,
    installedPackages: string[],
    mockLocalStorage: Record<string, string>,
    currentCardState: { isApkInstalled: boolean }
  ) => {
    const isDetectedOnConnectedQuest = isConnected ? isPortInstalledOnQuest(slug, installedPackages) : false

    if (isConnected) {
      // Headset is the single source of truth when connected:
      currentCardState.isApkInstalled = isDetectedOnConnectedQuest
      if (!isDetectedOnConnectedQuest) {
        delete mockLocalStorage[`questports_installed_${slug}`]
      } else {
        mockLocalStorage[`questports_installed_${slug}`] = 'true'
      }
    } else {
      // Disconnected: fallback to persisted state
      if (mockLocalStorage[`questports_installed_${slug}`] === 'true') {
        currentCardState.isApkInstalled = true
      }
    }

    return {
      isDetectedOnConnectedQuest,
      isApkInstalled: currentCardState.isApkInstalled
    }
  }

  describe('Direct Headset Uninstall Reflection (User Bug Prevention)', () => {
    it('immediately reflects uninstallation when app is removed directly inside Meta Quest', () => {
      const slug = 'halocequest'
      const mockStorage: Record<string, string> = {
        [`questports_installed_${slug}`]: 'true'
      }
      const cardState = { isApkInstalled: true }

      // 1. App is installed on headset
      let headsetPackages = ['com.oculus.vrshell', 'com.halo.decomp.vr', 'com.drbeef.rtcwquest']
      let syncResult = simulateCardSync(slug, true, headsetPackages, mockStorage, cardState)

      expect(syncResult.isDetectedOnConnectedQuest).toBe(true)
      expect(syncResult.isApkInstalled).toBe(true)
      expect(mockStorage[`questports_installed_${slug}`]).toBe('true')

      // 2. User uninstalls Halo CE directly inside Meta Quest visor (Unknown Sources)
      // ADB updates packages list without com.halo.decomp.vr
      headsetPackages = ['com.oculus.vrshell', 'com.drbeef.rtcwquest']
      syncResult = simulateCardSync(slug, true, headsetPackages, mockStorage, cardState)

      // State MUST revert to false on page and remove localStorage
      expect(syncResult.isDetectedOnConnectedQuest).toBe(false)
      expect(syncResult.isApkInstalled).toBe(false)
      expect(mockStorage[`questports_installed_${slug}`]).toBeUndefined()
    })

    it('immediately reflects uninstallation of Unreal Tournament 99 VR (ut99-vr-quest)', () => {
      const slug = 'ut99-vr-quest'
      const mockStorage: Record<string, string> = {
        [`questports_installed_${slug}`]: 'true'
      }
      const cardState = { isApkInstalled: true }

      // 1. Installed
      let headsetPackages = ['com.ghwstvr.ut99quest']
      let syncResult = simulateCardSync(slug, true, headsetPackages, mockStorage, cardState)
      expect(syncResult.isApkInstalled).toBe(true)

      // 2. Uninstalled inside headset
      headsetPackages = []
      syncResult = simulateCardSync(slug, true, headsetPackages, mockStorage, cardState)
      expect(syncResult.isApkInstalled).toBe(false)
      expect(mockStorage[`questports_installed_${slug}`]).toBeUndefined()
    })
  })

  describe('Offline Persistence vs Connected Ground Truth', () => {
    it('restores installed state from localStorage when headset is not connected', () => {
      const slug = 'lambda1vr'
      const mockStorage: Record<string, string> = {
        [`questports_installed_${slug}`]: 'true'
      }
      const cardState = { isApkInstalled: false }

      const syncResult = simulateCardSync(slug, false, [], mockStorage, cardState)
      expect(syncResult.isApkInstalled).toBe(true)
    })

    it('clears stale localStorage when headset connects and app is NOT present', () => {
      const slug = 'doom3quest'
      // User had stale localStorage from previous session or simulated install
      const mockStorage: Record<string, string> = {
        [`questports_installed_${slug}`]: 'true'
      }
      const cardState = { isApkInstalled: true }

      // Headset connects, but Doom 3 is not on headset
      const headsetPackages = ['com.drbeef.rtcwquest']
      const syncResult = simulateCardSync(slug, true, headsetPackages, mockStorage, cardState)

      expect(syncResult.isDetectedOnConnectedQuest).toBe(false)
      expect(syncResult.isApkInstalled).toBe(false)
      expect(mockStorage[`questports_installed_${slug}`]).toBeUndefined()
    })
  })

  describe('Package Name Resolution for In-Card pm uninstall', () => {
    it('resolves primary package name when primary is installed', () => {
      const pkg = resolveInstalledPackageName('halocequest', ['com.halo.decomp.vr'])
      expect(pkg).toBe('com.halo.decomp.vr')
    })

    it('resolves alternate package name when user installed flat/alt build', () => {
      const pkg = resolveInstalledPackageName('halocequest', ['com.halo.decomp'])
      expect(pkg).toBe('com.halo.decomp')
    })

    it('resolves alternate package name for Prey VR (com.lvonasek.preyvr)', () => {
      const pkg = resolveInstalledPackageName('preyvr', ['com.lvonasek.preyvr'])
      expect(pkg).toBe('com.lvonasek.preyvr')
    })

    it('resolves primary package name for UT99 VR (com.ghwstvr.ut99quest)', () => {
      const pkg = resolveInstalledPackageName('ut99-vr-quest', ['com.ghwstvr.ut99quest'])
      expect(pkg).toBe('com.ghwstvr.ut99quest')
    })

    it('returns default configured package when headset has no matching package (for reset)', () => {
      const pkg = resolveInstalledPackageName('rtcwquest', [])
      expect(pkg).toBe('com.drbeef.rtcwquest')
    })
  })

  describe('Enhanced Package Name Root Matching', () => {
    it('matches Halo CE via root halo.decomp', () => {
      expect(isPortInstalledOnQuest('halocequest', ['com.halo.decomp.vr'])).toBe(true)
      expect(isPortInstalledOnQuest('halocequest', ['org.halo.decomp.custom'])).toBe(true)
    })

    it('matches UT99 via root ghwstvr.ut99quest', () => {
      expect(isPortInstalledOnQuest('ut99-vr-quest', ['com.ghwstvr.ut99quest'])).toBe(true)
      expect(isPortInstalledOnQuest('ut99-vr-quest', ['net.ghwstvr.ut99quest'])).toBe(true)
    })

    it('does not false positive on unrelated package names', () => {
      expect(isPortInstalledOnQuest('halocequest', ['com.drbeef.rtcwquest'])).toBe(false)
      expect(isPortInstalledOnQuest('ut99-vr-quest', ['com.halo.decomp.vr'])).toBe(false)
    })

    it('detects regardless of casing, CRLF or whitespace in ADB output', () => {
      expect(isPortInstalledOnQuest('halocequest', ['  COM.HALO.DECOMP.VR\r'])).toBe(true)
      expect(isPortInstalledOnQuest('halocequest', ['Com.HaloCE.QuestVR '])).toBe(true)
      expect(isPortInstalledOnQuest('halocequest', ['', '  '])).toBe(false)
    })
  })
})
