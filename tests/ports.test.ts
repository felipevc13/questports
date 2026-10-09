import { describe, it, expect } from 'vitest'
import { PORT_PACKAGE_CONFIGS, resolveWorkflowType, isPortInstalledOnQuest, isSelfContainedSideload } from '../app/data/portPackageMap'

describe('Port Package Map & Workflow Verification', () => {
  it('contains mapping configurations for key ports', () => {
    expect(Object.keys(PORT_PACKAGE_CONFIGS).length).toBeGreaterThan(30)
  })

  it('correctly maps Mario Galaxy (galaxyquest) to require game assets', () => {
    const mario = PORT_PACKAGE_CONFIGS['galaxyquest']
    expect(mario).toBeDefined()
    expect(mario.packageName).toBe('com.galaxy.quest')
    expect(mario.installType).toBe('apk_and_assets')
    expect(mario.targetPath).toBe('/sdcard/Android/data/com.galaxy.quest/files/game/')
    expect(mario.folders).toBeDefined()
    expect(mario.folders?.[0].expectedFiles).toContain('fst.bin')
    expect(mario.folders?.[0].altPaths).toContain('/sdcard/GalaxyQuest/sys/')

    const workflow = resolveWorkflowType(mario)
    expect(workflow).toBe('smart_converter')
  })

  it('correctly maps Half-Life 1 (lambda1vr) to parent xash root with valve folder', () => {
    const hl = PORT_PACKAGE_CONFIGS['lambda1vr']
    expect(hl).toBeDefined()
    expect(hl.packageName).toBe('com.drbeef.lambda1vr')
    expect(hl.targetPath).toBe('/sdcard/xash/')
    expect(hl.folders?.[0].folderName).toBe('valve')
    expect(hl.folders?.[0].targetPath).toBe('/sdcard/xash/valve/')
  })

  it('correctly maps Return to Castle Wolfenstein (rtcwquest) to parent RTCWQuest root with main folder', () => {
    const rtcw = PORT_PACKAGE_CONFIGS['rtcwquest']
    expect(rtcw).toBeDefined()
    expect(rtcw.packageName).toBe('com.drbeef.rtcwquest')
    expect(rtcw.targetPath).toBe('/sdcard/RTCWQuest/')
    expect(rtcw.folders?.[0].folderName).toBe('Main')
    expect(rtcw.folders?.[0].targetPath).toBe('/sdcard/RTCWQuest/Main/')
    expect(rtcw.folders?.[0].altPaths).toContain('/sdcard/RTCWQuest/main/')
  })

  it('correctly maps Prey VR (preyvr) with Luboš Vonásek package and folder path', () => {
    const prey = PORT_PACKAGE_CONFIGS['preyvr']
    expect(prey).toBeDefined()
    expect(prey.packageName).toBe('com.lvonasek.preyvr')
    expect(prey.altPackages).toContain('com.drbeef.preyvr')
    expect(prey.targetPath).toBe('/sdcard/preyvr/')
    expect(prey.folders?.[0].targetPath).toBe('/sdcard/preyvr/preybase/')
    expect(prey.folders?.[0].altPaths).toContain('/sdcard/preyvr/preybase/')

    const workflow = resolveWorkflowType(prey)
    expect(workflow).toBe('pc_assets')
  })

  it('correctly maps Halo CE Quest VR (halocequest) to com.halo.decomp.vr and detects it', () => {
    const halo = PORT_PACKAGE_CONFIGS['halocequest']
    expect(halo).toBeDefined()
    expect(halo.packageName).toBe('com.halo.decomp.vr')
    expect(halo.altPackages).toContain('com.halo.decomp')
    expect(halo.targetPath).toBe('/sdcard/Documents/HaloCE/')
    expect(halo.folders?.[0].targetPath).toBe('/sdcard/Documents/HaloCE/maps/')

    // Should detect headset packages
    expect(isPortInstalledOnQuest('halocequest', ['com.halo.decomp.vr'])).toBe(true)
    expect(isPortInstalledOnQuest('halocequest', ['com.halo.decomp'])).toBe(true)
    expect(isPortInstalledOnQuest('halocequest', ['com.haloce.questvr'])).toBe(true)
    expect(isPortInstalledOnQuest('halocequest', ['com.other.game'])).toBe(false)
  })

  it('maps GoldenEye VR to real APK package com.gevr.port (from v0.4.10 manifest)', () => {
    const ge = PORT_PACKAGE_CONFIGS['goldeneye-vr']
    expect(ge.packageName).toBe('com.gevr.port')
    expect(isPortInstalledOnQuest('goldeneye-vr', ['com.gevr.port'])).toBe(true)
    expect(isPortInstalledOnQuest('goldeneye-vr', ['com.oculus.vrshell'])).toBe(false)
  })

  it('maps Qualyx (Half-Life: Alyx VR) as requiring PC assets (hlvr + core VPKs)', () => {
    const qualyx = PORT_PACKAGE_CONFIGS['qualyx']
    expect(qualyx).toBeDefined()
    expect(qualyx.packageName).toBe('org.hlvr.quest')
    expect(qualyx.installType).toBe('apk_and_assets')
    expect(qualyx.workflowType).toBe('pc_assets')
    expect(qualyx.targetPath).toBe('/sdcard/Qualyx/game/')
    expect(qualyx.folders).toBeDefined()
    expect(qualyx.folders?.some(f => f.folderName === 'hlvr')).toBe(true)
    expect(qualyx.folders?.some(f => f.folderName === 'core')).toBe(true)
    expect(qualyx.criticalFiles).toContain('hlvr/pak01_dir.vpk')
  })

  // Package names verified from real APK manifests / SideQuest listings
  // via scripts/verify-apk-packages.mjs (2026-10-07)
  const VERIFIED_PACKAGES: Record<string, string> = {
    astroquest: 'com.astrobotquest.vrhost',
    'avp-vr': 'com.bassquake.avpvr',
    beefraiderxr: 'com.drbeef.beefraiderxr',
    citravr: 'org.citra.citra_emu',
    csvr: 'com.lvonasek.csvr',
    doom3quest: 'com.drbeef.doom3quest',
    galaxyquest: 'com.galaxy.quest',
    'goldeneye-vr': 'com.gevr.port',
    'gothic2-vr': 'com.gothic2vr.quest',
    'gran-turismo-2-vr': 'io.github.gt2pc.quest',
    halocequest: 'com.halo.decomp.vr',
    'harry-potter-vr': 'io.github.hpvr.quest',
    hexen2vr: 'com.uhexen2.vhexen2',
    'iron-lung-vr': 'com.JackRandolph.IronLungVR',
    jkxr: 'com.drbeef.jkxr',
    lambda1vr: 'com.drbeef.lambda1vr',
    'nolf-vr': 'net.relith.nolf',
    'perfect-dark-vr': 'com.perfectdark.port',
    'ppsspp-vr': 'org.ppsspp.ppssppvr',
    preyvr: 'com.lvonasek.preyvr',
    primedgun: 'org.primedgun.primedgun.quest',
    quake2quest: 'com.drbeef.quake2quest',
    quakequest: 'com.drbeef.quakequest',
    qualyx: 'org.hlvr.quest',
    questcarnage: 'com.github.maranone.questcarnage',
    questcraft: 'com.qcxr.qcxr',
    questsam: 'com.github.maranone.questsam',
    questzdoom: 'com.drbeef.questzdoom',
    razexr: 'com.drbeef.razexr',
    'road-rash-jailbreak-vr': 'com.rrjb.vr',
    rtcwquest: 'com.drbeef.rtcwquest',
    simpsonshitrun: 'com.simpsonsHitAndRun.vr',
    sourcevr: 'com.sourcevrport.hl2vr',
    'time-crisis-vr': 'org.timecrisis.quest',
    'ut99-vr-quest': 'com.ghwstvr.ut99quest',
    winlatorxr: 'com.winlator'
  }

  for (const [slug, pkg] of Object.entries(VERIFIED_PACKAGES)) {
    it(`${slug} uses verified real package ${pkg} and detects it`, () => {
      expect(PORT_PACKAGE_CONFIGS[slug]?.packageName).toBe(pkg)
      expect(isPortInstalledOnQuest(slug, [pkg])).toBe(true)
      expect(isPortInstalledOnQuest(slug, [pkg.toLowerCase()])).toBe(true)
    })
  }

  it('identifies only truly self-contained APK ports as direct sideload', () => {
    const selfContained = ['questcraft', 'iron-lung-vr', 'time-crisis-vr']
    for (const slug of selfContained) {
      const port = PORT_PACKAGE_CONFIGS[slug]
      expect(port, slug).toBeDefined()
      expect(port.installType).toBe('direct_apk')
      expect(resolveWorkflowType(port)).toBe('direct')
      expect(isSelfContainedSideload(port), slug).toBe(true)
    }
  })

  it('never treats asset/ROM ports as self-contained after APK install', () => {
    const needsFiles = [
      'astroquest',
      'winlatorxr',
      'qualyx',
      'gran-turismo-2-vr',
      'road-rash-jailbreak-vr',
      'goldeneye-vr',
      'perfect-dark-vr',
      'galaxyquest',
      'lambda1vr',
      'citravr',
      'ppsspp-vr',
      'primedgun',
      'nolf-vr'
    ]
    for (const slug of needsFiles) {
      expect(isSelfContainedSideload(PORT_PACKAGE_CONFIGS[slug]), slug).toBe(false)
    }

    for (const [slug, cfg] of Object.entries(PORT_PACKAGE_CONFIGS)) {
      if (cfg.workflowType && cfg.workflowType !== 'direct') {
        expect(isSelfContainedSideload(cfg), slug).toBe(false)
      }
    }
  })

  it('identifies OBB extraction ports properly', () => {
    const obbPorts = ['alien-isolation-vr', 'grid-legends', 'hitman-blood-money-vr']
    for (const slug of obbPorts) {
      const port = PORT_PACKAGE_CONFIGS[slug]
      if (port) {
        expect(port.installType).toBe('apk_and_assets')
        expect(resolveWorkflowType(port)).toBe('obb_extract')
      }
    }
  })

  it('guarantees all port targetPaths point to parent root directories, never inner subfolders', async () => {
    const { INITIAL_PORTS } = await import('../app/data/mockPorts')
    const forbiddenSubfolders = [
      '/valve/',
      '/baseq2/',
      '/id1/',
      '/data1/',
      '/preybase/',
      '/cstrike/',
      '/GAME/',
      '/common/'
    ]

    for (const [slug, cfg] of Object.entries(PORT_PACKAGE_CONFIGS)) {
      if (cfg.targetPath) {
        expect(cfg.targetPath.startsWith('/sdcard/')).toBe(true)
        expect(cfg.targetPath.endsWith('/')).toBe(true)
        for (const sub of forbiddenSubfolders) {
          expect(cfg.targetPath.endsWith(sub), `${slug} targetPath must be parent root, not ${sub}`).toBe(false)
        }
      }
    }

    for (const port of INITIAL_PORTS) {
      if (port.internal_storage_path && !port.internal_storage_path.startsWith('N/A')) {
        for (const sub of forbiddenSubfolders) {
          expect(
            port.internal_storage_path.endsWith(sub),
            `${port.slug} internal_storage_path must be parent root, not ${sub}`
          ).toBe(false)
        }
      }
    }
  })
})
