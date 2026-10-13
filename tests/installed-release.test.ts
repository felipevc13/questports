import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  apkUpdateDecision,
  assetLabelFromDownloadUrl,
  filenameFromContentDisposition,
  forgetInstalledRelease,
  learnInstalledRelease,
  readInstalledRelease,
  rememberInstalledRelease,
  type ReleaseStorage
} from '../app/lib/installedRelease'
import { parsePackageDump } from '../app/lib/portVersion'

function memory(): ReleaseStorage & { raw: string } {
  const box = { raw: '' }
  return {
    get raw() { return box.raw },
    set raw(value: string) { box.raw = value },
    getItem() { return box.raw || null },
    setItem(_key: string, value: string) { box.raw = value }
  }
}

describe('installed release record', () => {
  it('reads versionName and versionCode from dumpsys', () => {
    const dump = [
      'Package [com.perfectdark.port]',
      '    versionCode=1 minSdk=29 targetSdk=32',
      '    versionName=1.0'
    ].join('\n')
    expect(parsePackageDump(dump)).toEqual({ versionName: '1.0', versionCode: '1' })
    expect(parsePackageDump('')).toEqual({ versionName: null, versionCode: null })
  })

  it('keeps the release filename from the apk proxy', () => {
    expect(filenameFromContentDisposition(
      'attachment; filename=Perfect_Dark_VR_Standalone_NTSC_v2.1.apk'
    )).toBe('Perfect_Dark_VR_Standalone_NTSC_v2.1.apk')
    expect(filenameFromContentDisposition(
      "attachment; filename*=UTF-8''Quest%20Build.apk"
    )).toBe('Quest Build.apk')
    expect(assetLabelFromDownloadUrl(
      'https://github.com/Alex-LeTux/perfect_dark_VR/releases/latest'
    )).toBe('')
    expect(assetLabelFromDownloadUrl(
      'https://github.com/example/game/releases/download/v1.2.0/Game.apk'
    )).toBe('Game.apk')
  })

  it('stores the catalog release per headset serial and package', () => {
    const storage = memory()
    const saved = rememberInstalledRelease(storage, {
      serial: '1WMHH',
      packageName: 'com.perfectdark.port',
      releaseTag: '2.1',
      asset: 'Perfect_Dark_VR_Standalone_NTSC_v2.1.apk',
      versionName: '1.0',
      versionCode: '1',
      installedAt: '2026-10-13T12:00:00.000Z'
    })
    expect(saved?.releaseTag).toBe('v2.1')
    expect(readInstalledRelease(storage, '1WMHH', 'com.perfectdark.port')?.asset)
      .toBe('Perfect_Dark_VR_Standalone_NTSC_v2.1.apk')
    expect(readInstalledRelease(storage, 'OTHER', 'com.perfectdark.port')).toBeNull()
    expect(rememberInstalledRelease(storage, {
      serial: '1WMHH',
      packageName: 'com.perfectdark.port',
      releaseTag: 'Latest'
    })).toBeNull()

    forgetInstalledRelease(storage, '1WMHH', 'com.perfectdark.port')
    expect(readInstalledRelease(storage, '1WMHH', 'com.perfectdark.port')).toBeNull()
  })

  it('does not call a just-installed Perfect Dark build outdated', () => {
    const storage = memory()
    const record = rememberInstalledRelease(storage, {
      serial: '1WMHH',
      packageName: 'com.perfectdark.port',
      releaseTag: 'v2.1',
      asset: 'Perfect_Dark_VR_Standalone_NTSC_v2.1.apk',
      versionName: '1.0',
      versionCode: '1'
    })
    expect(apkUpdateDecision({
      installedVersionName: '1.0',
      installedVersionCode: '1',
      catalogVersion: 'v2.1',
      record
    })).toEqual({ outdated: false, reason: null })
    expect(apkUpdateDecision({
      installedVersionName: '1.0',
      installedVersionCode: '1',
      catalogVersion: 'v2.1',
      record: null
    })).toEqual({ outdated: false, reason: null })
  })

  it('shows an update when the catalog release moves and versionName stays 1.0', () => {
    const record = rememberInstalledRelease(memory(), {
      serial: '1WMHH',
      packageName: 'com.perfectdark.port',
      releaseTag: 'v2.1',
      asset: 'Perfect_Dark_VR_Standalone_NTSC_v2.1.apk',
      versionName: '1.0',
      versionCode: '1'
    })
    expect(apkUpdateDecision({
      installedVersionName: '1.0',
      installedVersionCode: '1',
      catalogVersion: 'v2.2',
      record
    })).toEqual({ outdated: true, reason: 'release' })
  })

  it('ignores the record when versionCode changed and still skips an incomparable versionName', () => {
    const record = rememberInstalledRelease(memory(), {
      serial: '1WMHH',
      packageName: 'com.perfectdark.port',
      releaseTag: 'v2.1',
      versionName: '1.0',
      versionCode: '1'
    })
    expect(apkUpdateDecision({
      installedVersionName: '1.0',
      installedVersionCode: '2',
      catalogVersion: 'v2.2',
      record
    })).toEqual({ outdated: false, reason: null })
  })

  it('still flags a lower patch on the same release line', () => {
    expect(apkUpdateDecision({
      installedVersionName: '1.0.6',
      installedVersionCode: '6',
      catalogVersion: 'v1.0.16',
      record: null
    })).toEqual({ outdated: true, reason: 'version' })
  })

  it('learns versionName when the install read failed', () => {
    const saved = rememberInstalledRelease(memory(), {
      serial: '1WMHH',
      packageName: 'com.perfectdark.port',
      releaseTag: 'v2.1',
      versionName: null,
      versionCode: null
    })
    const learned = learnInstalledRelease(saved, '1.0', '1')
    expect(learned?.versionName).toBe('1.0')
    expect(learned?.versionCode).toBe('1')
    expect(apkUpdateDecision({
      installedVersionName: '1.0',
      installedVersionCode: '1',
      catalogVersion: 'v2.1',
      record: learned
    }).outdated).toBe(false)
  })

  it('records the install on the port page and in the QuestPorts app', () => {
    const detail = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const app = readFileSync(new URL('../app/components/AppBridgeInstall.vue', import.meta.url), 'utf8')
    expect(detail).toContain('rememberCatalogInstall()')
    expect(detail).toContain('apkUpdateDecision')
    expect(detail).toContain('testedVersion: port.value.latest_version || headsetApkVersion.value')
    expect(detail).toContain('apkUpdate.value.reason === \'release\'')
    expect(detail).toContain('installedStatusDetail')
    expect(app).toContain('rememberAppInstall()')
    expect(app).toContain('APP_RELEASE_SERIAL')
  })
})
