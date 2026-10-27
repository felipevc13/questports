import { describe, it, expect } from 'vitest'
import { PORT_PACKAGE_CONFIGS, resolveWorkflowType, isPortInstalledOnQuest, isSelfContainedSideload } from '../app/data/portPackageMap'
import { firstInstalledPackage } from '../app/lib/headsetPackages'

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
    'avp-vr': 'com.bassquake.quest.avpvr',
    beefraiderxr: 'com.drbeef.beefraiderxr',
    citravr: 'org.citra.citra_emu',
    'crisis-zone-vr': 'org.crisiszone.vr',
    csvr: 'com.lvonasek.csvr',
    'ctr-turbocharged-vr': 'com.bilko.ctrvr',
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
    'nfsu-vr': 'org.nfsu1.quest',
    'nfsu2-vr': 'org.nfsu2.quest',
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
    'rave-racer-vr': 'com.virtuavrport.raveracervr',
    razexr: 'com.drbeef.razexr',
    'road-rash-jailbreak-vr': 'com.rrjb.vr',
    rtcwquest: 'com.drbeef.rtcwquest',
    simpsonshitrun: 'com.simpsonsHitAndRun.vr',
    sourcevr: 'com.sourcevrport.hl2vr',
    'time-crisis-vr': 'org.timecrisis.quest',
    'ut99-vr-quest': 'com.ghwstvr.ut99quest',
    winlatorxr: 'com.winlator.cmod',
    '18-wheeler-vr': 'com.flycast.emulator.wheeler18',
    'age-of-joy': 'com.curif.AgeOfJoy',
    'animal-crossing-vr': 'com.liquidazir.animalcrossingquest',
    'arx-libertatis-vr': 'org.arxlibertatis.vr',
    'bomberman-hero-vr': 'com.bmhero.recompiled',
    'daytona-usa-vr': 'io.port0r.daytona',
    'descent-1-2-vr': 'net.gameordie.descentvr',
    'descent-3-vr': 'com.descentdevelopers.descent3',
    'dirt-dash-vr': 'io.port0r.dirtdash',
    dolphinxr: 'org.dolphinemu.dolphinemu.quest.debug',
    'f-zero-x-vr': 'com.fzerox.vr',
    'generals-zero-hour-xr': 'com.generalsx.zerohour.xr',
    'homeworld-unbound': 'org.homeworldunbound.game',
    'hotd-vr': 'io.port0r.houseofthedead',
    'hotd2-vr': 'com.flycast.emulator.vr',
    'magic-carpet-vr': 'technology.master.mc.vr',
    'majoras-mask-vr': 'com.fulldivegames.majorasmaskvr',
    'mario-party-4-partyboard': 'com.mariopartyrd.partyboard',
    'max-payne-vr': 'com.MPQ.HaveliSkywalker',
    'mega-man-64-vr': 'com.megaman64recomp.vr',
    'metal-gear-solid-vr': 'org.baywilly.mgsvr',
    'ocarina-of-time-vr': 'org.oot.vr',
    'opencmr2-vr': 'org.opencmr2.vr',
    'openmw-vr': 'org.openmw.vr',
    'openxwa-vr': 'org.openxwa.quest',
    quake3quest: 'com.drbeef.ioq3quest',
    'red-dead-redemption-vr': 'com.rockstargames.rdr',
    'sega-rally-vr': 'io.port0r.segarally',
    'sm64-coop-dx-vr': 'com.fulldivegames.sm64coopdxvr',
    'smash-remix-vr': 'com.ssb64.recompiled',
    'starfox-enhanced-vr': 'com.starfox.enhanced.quest',
    'strikers-quest-mr': 'io.github.newcoke.strikers',
    'time-crisis-2-vr': 'org.timecrisis2.arcadevr',
    'twilight-princess-vr': 'com.joeyaw.tpvr',
    'victory-heat-rally-vr': 'com.segadreamcat.vhrquest',
    'virtua-cop-vr': 'io.port0r.virtuacop',
    'wave-race-64-vr': 'com.waverace64.questvr',
    'wiicompiled-vr-plus': 'org.wiicompiled.quest',
    'wipeout-rewrite-vr': 'online.portroyale.wipeoutrewritevr',
    xelee: 'dev.melee.game',
    'xrkart-64': 'com.n64vr.spaghettikart'
  }

  for (const [slug, pkg] of Object.entries(VERIFIED_PACKAGES)) {
    it(`${slug} uses verified real package ${pkg} and detects it`, () => {
      expect(PORT_PACKAGE_CONFIGS[slug]?.packageName).toBe(pkg)
      expect(isPortInstalledOnQuest(slug, [pkg])).toBe(true)
      expect(isPortInstalledOnQuest(slug, [pkg.toLowerCase()])).toBe(true)
    })
  }

  it('identifies only truly self-contained APK ports as direct sideload', () => {
    const selfContained = ['questcraft', 'iron-lung-vr', 'time-crisis-vr', 'time-crisis-2-vr', 'crisis-zone-vr']
    for (const slug of selfContained) {
      const port = PORT_PACKAGE_CONFIGS[slug]
      expect(port, slug).toBeDefined()
      expect(port.installType).toBe('direct_apk')
      expect(resolveWorkflowType(port)).toBe('direct')
      expect(isSelfContainedSideload(port), slug).toBe(true)
    }
  })

  it('uses package ids the owner confirmed on a Quest', () => {
    expect(PORT_PACKAGE_CONFIGS['unreal-gold-vr']?.packageName).toBe('com.ghwstvr.unrealquest')
    expect(PORT_PACKAGE_CONFIGS['sclerosis-vr']?.packageName).toBe('com.CreaTeam.Sclerosis')
    expect(isSelfContainedSideload(PORT_PACKAGE_CONFIGS['unreal-gold-vr'])).toBe(false)
    expect(isSelfContainedSideload(PORT_PACKAGE_CONFIGS['sclerosis-vr'])).toBe(false)
    expect(firstInstalledPackage('unreal-gold-vr', name => name === 'com.ghwstvr.unrealquest')).toBe('com.ghwstvr.unrealquest')
    expect(firstInstalledPackage('sclerosis-vr', name => name.toLowerCase() === 'com.createam.sclerosis')).toBe('com.CreaTeam.Sclerosis')
    expect(firstInstalledPackage('sclerosis-vr', () => false)).toBeNull()
    expect(PORT_PACKAGE_CONFIGS['crazy-taxi-vr']?.packageName).toBe('com.baywilly.crazytaxivr')
    expect(isSelfContainedSideload(PORT_PACKAGE_CONFIGS['crazy-taxi-vr'])).toBe(false)
    expect(firstInstalledPackage('crazy-taxi-vr', name => name === 'com.baywilly.crazytaxivr')).toBe('com.baywilly.crazytaxivr')
    expect(isPortInstalledOnQuest('crazy-taxi-vr', ['com.baywilly.crazytaxivr'])).toBe(true)
    expect(isPortInstalledOnQuest('crazy-taxi-vr', ['com.sega.CrazyTaxi'])).toBe(false)
  })

  it('detects House of the Dead 2 and Time Crisis 2 from the release APK package', () => {
    expect(firstInstalledPackage('hotd2-vr', name => name === 'com.flycast.emulator.vr')).toBe('com.flycast.emulator.vr')
    expect(firstInstalledPackage('hotd2-vr', () => false)).toBeNull()
    expect(isSelfContainedSideload(PORT_PACKAGE_CONFIGS['hotd2-vr'])).toBe(false)
    expect(isPortInstalledOnQuest('sega-rally-vr', ['com.flycast.emulator.vr'])).toBe(false)
    expect(isPortInstalledOnQuest('virtua-cop-vr', ['com.flycast.emulator.vr'])).toBe(false)
    expect(isPortInstalledOnQuest('hotd2-vr', ['com.flycast.emulator.wheeler18'])).toBe(false)
    expect(isPortInstalledOnQuest('18-wheeler-vr', ['com.flycast.emulator.vr'])).toBe(false)
    expect(isPortInstalledOnQuest('18-wheeler-vr', ['com.flycast.emulator.wheeler18'])).toBe(true)

    expect(firstInstalledPackage('time-crisis-2-vr', name => name === 'org.timecrisis2.arcadevr')).toBe('org.timecrisis2.arcadevr')
    expect(isSelfContainedSideload(PORT_PACKAGE_CONFIGS['time-crisis-2-vr'])).toBe(true)
    expect(isPortInstalledOnQuest('time-crisis-2-vr', ['org.timecrisis.quest'])).toBe(false)
    expect(isPortInstalledOnQuest('time-crisis-vr', ['org.timecrisis2.arcadevr'])).toBe(false)
  })

  it('gives every port its own package id', () => {
    const owner = new Map<string, string>()
    for (const [slug, cfg] of Object.entries(PORT_PACKAGE_CONFIGS)) {
      for (const name of [cfg.packageName, ...(cfg.altPackages || [])]) {
        const key = name.toLowerCase()
        expect(owner.get(key), `${name} is shared by ${owner.get(key)} and ${slug}`).toBeUndefined()
        owner.set(key, slug)
      }
    }
  })

  it('detects Ocarina of Time VR from org.oot.vr and not the old package', () => {
    expect(PORT_PACKAGE_CONFIGS['ocarina-of-time-vr']?.packageName).toBe('org.oot.vr')
    expect(PORT_PACKAGE_CONFIGS['ocarina-of-time-vr']?.installType).toBe('apk_and_assets')
    expect(isPortInstalledOnQuest('ocarina-of-time-vr', ['org.oot.vr'])).toBe(true)
    expect(isPortInstalledOnQuest('ocarina-of-time-vr', ['com.questship.sohvr'])).toBe(false)
  })

  it('does not treat newer package ids as another port', () => {
    const newcomers = ['mario-party-4-partyboard', 'ctr-turbocharged-vr', 'max-payne-vr', 'ocarina-of-time-vr']
    for (const slug of newcomers) {
      const pkg = PORT_PACKAGE_CONFIGS[slug]?.packageName
      expect(pkg, slug).toBeTruthy()
      expect(isPortInstalledOnQuest(slug, [pkg!])).toBe(true)
      for (const [other, cfg] of Object.entries(PORT_PACKAGE_CONFIGS)) {
        if (other === slug) continue
        expect(isPortInstalledOnQuest(other, [pkg!]), `${other} must not match ${pkg}`).toBe(false)
        for (const name of [cfg.packageName, ...(cfg.altPackages || [])]) {
          expect(isPortInstalledOnQuest(slug, [name]), `${slug} must not match ${name}`).toBe(false)
        }
      }
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
