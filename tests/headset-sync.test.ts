import { describe, it, expect } from 'vitest'
import { apkInstalledOnHeadset } from '../app/lib/apkInstalledState'
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

  // The card follows the live headset. A remembered browser flag is not an input.
  const simulateCardSync = (
    slug: string,
    isConnected: boolean,
    installedPackages: string[]
  ) => {
    const isApkInstalled = apkInstalledOnHeadset({
      connected: isConnected,
      slug,
      installedPackages,
      bridgeInstalled: false
    })
    return {
      isDetectedOnConnectedQuest: isConnected ? isApkInstalled : false,
      isApkInstalled
    }
  }

  describe('Direct Headset Uninstall Reflection (User Bug Prevention)', () => {
    it('immediately reflects uninstallation when app is removed directly inside Meta Quest', () => {
      const slug = 'halocequest'

      // 1. App is installed on headset
      let headsetPackages = ['com.oculus.vrshell', 'com.halo.decomp.vr', 'com.drbeef.rtcwquest']
      let syncResult = simulateCardSync(slug, true, headsetPackages)

      expect(syncResult.isDetectedOnConnectedQuest).toBe(true)
      expect(syncResult.isApkInstalled).toBe(true)

      // 2. User uninstalls Halo CE directly inside Meta Quest visor (Unknown Sources)
      // ADB updates packages list without com.halo.decomp.vr
      headsetPackages = ['com.oculus.vrshell', 'com.drbeef.rtcwquest']
      syncResult = simulateCardSync(slug, true, headsetPackages)

      expect(syncResult.isDetectedOnConnectedQuest).toBe(false)
      expect(syncResult.isApkInstalled).toBe(false)
    })

    it('immediately reflects uninstallation of Unreal Tournament 99 VR (ut99-vr-quest)', () => {
      const slug = 'ut99-vr-quest'

      let headsetPackages = ['com.ghwstvr.ut99quest']
      let syncResult = simulateCardSync(slug, true, headsetPackages)
      expect(syncResult.isApkInstalled).toBe(true)

      headsetPackages = []
      syncResult = simulateCardSync(slug, true, headsetPackages)
      expect(syncResult.isApkInstalled).toBe(false)
    })
  })

  describe('Disconnected desktop does not remember an install', () => {
    it('does not show Half-Life installed when the headset is gone, even if the package list is leftover', () => {
      const syncResult = simulateCardSync('lambda1vr', false, ['com.drbeef.lambda1vr', 'mod.drbeef.lambda1vr'])
      expect(syncResult.isDetectedOnConnectedQuest).toBe(false)
      expect(syncResult.isApkInstalled).toBe(false)
    })

    it('does not show Doom 3 installed from a previous session when the connected headset lacks the package', () => {
      const syncResult = simulateCardSync('doom3quest', true, ['com.drbeef.rtcwquest'])
      expect(syncResult.isDetectedOnConnectedQuest).toBe(false)
      expect(syncResult.isApkInstalled).toBe(false)
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
