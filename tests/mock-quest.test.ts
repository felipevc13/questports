import { describe, expect, it } from 'vitest'
import { QUEST_USB_MESSAGES } from '../app/lib/questUsbMessages'
import {
  buildPackageState,
  collectPresentSeedPaths,
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
    expect(device.fs.list('/sdcard/RTCWQuest/main')).toBeNull()
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
    const files = device.fs.list('/sdcard/RTCWQuest/main')
    expect(files).toContain('pak0.pk3')
    expect(collectPresentSeedPaths().length).toBeGreaterThan(30)
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
    expect(QUEST_USB_MESSAGES.usbLocked).toContain('USB interface is locked')
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

  it('treats only QuestCraft and Iron Lung as self-contained sideloads', () => {
    const selfContained = facts.filter(fact => fact.selfContained).map(fact => fact.slug).sort()
    expect(selfContained).toEqual(['iron-lung-vr', 'questcraft'])
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
