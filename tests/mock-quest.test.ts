import { describe, expect, it } from 'vitest'
import { QUEST_USB_MESSAGES } from '../app/lib/questUsbMessages'
import {
  buildPackageState,
  collectPresentSeedPaths,
  collectSeedPaths,
  createMockQuestDevice,
  parseMockScenario
} from '../app/lib/mockQuest'
import { catalogInstallFacts } from '../app/lib/catalogInstallFacts'
import { INITIAL_PORTS } from '../app/data/mockPorts'

describe('mock Quest query flag', () => {
  it('stays off unless mockQuest is explicitly enabled', () => {
    expect(parseMockScenario('')).toBeNull()
    expect(parseMockScenario('?foo=1')).toBeNull()
    expect(parseMockScenario('?mockQuest=0')).toBeNull()
    expect(parseMockScenario('?mockQuest=false')).toBeNull()
    expect(parseMockScenario('?mockQuest=off')).toBeNull()
    expect(parseMockScenario('?mockQuest=no')).toBeNull()
  })

  it('parses the headset, install, and game controls', () => {
    const scenario = parseMockScenario(
      '?mockQuest=1&mockPhase=connected&mockInstall=storage&mockGame=installed&mockFiles=present&mockUninstall=fail&mockChrome=0'
    )
    expect(scenario).toMatchObject({
      phase: 'connected',
      install: 'storage',
      game: 'installed',
      files: 'present',
      uninstall: 'fail',
      chrome: false
    })
  })

  it('accepts a phase name as the mockQuest value', () => {
    expect(parseMockScenario('?mockQuest=picker')?.phase).toBe('picker')
    expect(parseMockScenario('?mockQuest=picker&mockPhase=connected')?.phase).toBe('connected')
  })
})

describe('mock Quest device', () => {
  it('reports an empty catalog and a normal storage meter when nothing is installed', async () => {
    const device = createMockQuestDevice({
      phase: 'connected',
      next: 'ok',
      install: 'ok',
      game: 'absent',
      files: 'missing',
      uninstall: 'ok',
      chrome: true,
      speed: 'instant',
      launch: 'ok',
      transfer: 'ok'
    })
    const packages = await device.shell('pm list packages -3')
    expect(packages.trim()).toBe('')
    const df = await device.shell('df -h /sdcard')
    expect(df).toContain('88G')
    expect(df).toContain('32%')
    expect(device.fs.list('/sdcard/RTCWQuest/Main')).toBeNull()
  })

  it('installs every catalog package and seeds external files when asked', async () => {
    const device = createMockQuestDevice({
      phase: 'connected',
      next: 'ok',
      install: 'ok',
      game: 'installed',
      files: 'present',
      uninstall: 'ok',
      chrome: true,
      speed: 'instant',
      launch: 'ok',
      transfer: 'ok'
    })
    const packages = await device.shell('pm list packages -3')
    expect(packages).toContain('package:com.drbeef.rtcwquest')
    expect(packages).toContain('package:com.qcxr.qcxr')
    const version = await device.shell('dumpsys package com.drbeef.rtcwquest')
    expect(version).toContain('versionName=v1.4.1')
    const files = device.fs.list('/sdcard/RTCWQuest/Main')
    expect(files).toContain('pak0.pk3')
    expect(files).toContain('sp_pak1.pk3')
    expect(collectPresentSeedPaths().length).toBeGreaterThan(30)
  })

  it('seeds stray, primary, and alternate files on different paths', () => {
    const base = {
      phase: 'connected' as const,
      next: 'ok' as const,
      install: 'ok' as const,
      game: 'installed' as const,
      uninstall: 'ok' as const,
      chrome: true,
      speed: 'instant' as const,
      launch: 'ok' as const,
      transfer: 'ok' as const
    }
    const stray = createMockQuestDevice({ ...base, files: 'stray' })
    expect(stray.fs.list('/sdcard/Documents/HaloCE/maps')).toEqual(['unrelated-note.txt'])
    expect(stray.fs.list('/sdcard/Android/data/com.perfectdark.port/files/data')).toEqual(['unrelated-note.txt'])
    expect(stray.fs.list('/sdcard/Android/data/com.github.maranone.questsam/files')).toEqual(['unrelated-note.txt'])
    expect(stray.fs.list('/sdcard/PrimedGun')).toEqual(['unrelated-note.txt'])

    const primary = createMockQuestDevice({ ...base, files: 'primary' })
    expect(primary.fs.list('/sdcard/Documents/HaloCE/maps')).toEqual(expect.arrayContaining(['ui.map', 'bloodgulch.map']))
    expect(primary.fs.list('/sdcard/Android/data/com.perfectdark.port/files/data')).toContain('pd.ntsc-final.z64')
    expect(primary.fs.list('/sdcard/Android/data/com.github.maranone.questsam/files')).toContain('SE1_00.gro')
    expect(primary.fs.list('/sdcard/questsam')).toBeNull()
    expect(primary.fs.list('/sdcard/PrimedGun')).toEqual(['primedgun.iso'])
    expect(primary.fs.list('/sdcard/CitraVR/roms')).toEqual(['roms.3ds'])
    expect(primary.fs.list('/sdcard/PSP/GAME')).toEqual(['game.iso'])

    const alternate = createMockQuestDevice({ ...base, files: 'alternate' })
    expect(alternate.fs.list('/sdcard/Documents/HaloCE/maps')).toBeNull()
    expect(alternate.fs.list('/sdcard/Android/data/com.halo.decomp.vr/files/maps')).toEqual(expect.arrayContaining(['ui.map', 'bloodgulch.map']))
    expect(alternate.fs.list('/sdcard/Android/data/com.perfectdark.port/files/data')).toBeNull()
    expect(alternate.fs.list('/storage/emulated/0/Android/data/com.perfectdark.port/files/data')).toContain('pd.ntsc-final.z64')
    expect(alternate.fs.list('/sdcard/questsam')).toContain('SE1_00.gro')
    expect(alternate.fs.list('/sdcard/Android/data/com.github.maranone.questsam/files')).toBeNull()

    expect(parseMockScenario('?mockQuest=1&mockFiles=stray')?.files).toBe('stray')
    expect(parseMockScenario('?mockQuest=1&mockFiles=alternate')?.files).toBe('alternate')
    expect(parseMockScenario('?mockQuest=1&mockFiles=primary')?.files).toBe('primary')
    expect(collectSeedPaths('stray').some(path => path.endsWith('unrelated-note.txt'))).toBe(true)
  })

  it('marks every catalog package outdated and reports a full disk for the storage failure', async () => {
    const device = createMockQuestDevice({
      phase: 'connected',
      next: 'ok',
      install: 'storage',
      game: 'outdated',
      files: 'missing',
      uninstall: 'ok',
      chrome: true,
      speed: 'instant',
      launch: 'ok',
      transfer: 'ok'
    })
    const version = await device.shell('dumpsys package com.drbeef.rtcwquest')
    expect(version).toContain('versionName=0.0.1')
    const df = await device.shell('df -h /sdcard')
    expect(df).toContain('184M')
    expect(df).toContain('99%')
    const result = await device.shell('pm install -r /data/local/tmp/questports_installer.apk')
    expect(result).toContain('INSTALL_FAILED_INSUFFICIENT_STORAGE')
  })

  it('uses the same connection copy as the live WebUSB flow', () => {
    expect(QUEST_USB_MESSAGES.unsupported).toBe(
      'WebUSB is not supported in this browser. Please use Chrome, Edge, or Brave.'
    )
    expect(QUEST_USB_MESSAGES.usbLocked).toContain('being used by another app')
    expect(QUEST_USB_MESSAGES.usbLocked).toContain('adb kill-server')
    expect(QUEST_USB_MESSAGES.generic).toContain('Developer Mode')
  })

  it('builds package lists only for installed and outdated headsets', () => {
    expect(buildPackageState('absent').packages.some(pkg => pkg.includes('rtcw'))).toBe(false)
    expect(buildPackageState('installed').packages).toContain('com.drbeef.rtcwquest')
    expect(buildPackageState('outdated').versions['com.JackRandolph.IronLungVR']).toBe('0.0.1')
    expect(INITIAL_PORTS.length).toBe(buildPackageState('installed').packages.filter(pkg => !pkg.startsWith('com.oculus.')).length)
  })
})

describe('catalog install card expectations', () => {
  const facts = catalogInstallFacts()

  it('classifies every catalog game', () => {
    expect(facts).toHaveLength(INITIAL_PORTS.length)
    expect(facts.every(fact => fact.installType !== 'missing')).toBe(true)
  })

  it('treats QuestCraft, Iron Lung, and Time Crisis as self-contained sideloads', () => {
    const selfContained = facts.filter(fact => fact.selfContained).map(fact => fact.slug).sort()
    expect(selfContained).toEqual(['iron-lung-vr', 'questcraft', 'time-crisis-vr'])
  })

  it('expects a send-files step for every game that is not self-contained', () => {
    for (const fact of facts) {
      if (fact.selfContained) {
        expect(fact.missingFilesUi).toBe('standalone-ready')
        expect(fact.presentFilesUi).toBe('standalone-ready')
      } else {
        expect(fact.needsExternalFiles).toBe(true)
        expect(fact.missingFilesUi).toBe('send-files')
        expect(fact.presentFilesUi).toBe('files-ready')
      }
      expect(fact.playButtonWhenReady).toBe(true)
    }
  })
})
