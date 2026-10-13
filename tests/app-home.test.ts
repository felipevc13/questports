import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { whenAppBridgeReady } from '../app/lib/appBridge'
import { appSelfUpdateAvailable, parseLatestAppRelease } from '../app/lib/appReleaseCheck'
import { appStartTab, firstInstalledPackage, packageCandidates } from '../app/lib/headsetPackages'

describe('headset package probe', () => {
  it('treats an alternate id as installed when the catalog primary is not', () => {
    expect(packageCandidates('lambda1vr')).toEqual([
      'com.drbeef.lambda1vr',
      'mod.drbeef.lambda1vr',
      'su.xash.oldroot',
      'su.xash.engine'
    ])
    expect(firstInstalledPackage('lambda1vr', name => name === 'mod.drbeef.lambda1vr')).toBe('mod.drbeef.lambda1vr')
    expect(firstInstalledPackage('halocequest', name => name === 'com.halo.decomp')).toBe('com.halo.decomp')
  })

  it('keeps going when one package query throws', () => {
    const seen: string[] = []
    const found = firstInstalledPackage('lambda1vr', (name) => {
      seen.push(name)
      if (name === 'com.drbeef.lambda1vr') throw new Error('NameNotFoundException')
      return name === 'su.xash.engine'
    })
    expect(found).toBe('su.xash.engine')
    expect(seen).toEqual([
      'com.drbeef.lambda1vr',
      'mod.drbeef.lambda1vr',
      'su.xash.oldroot',
      'su.xash.engine'
    ])
  })

  it('opens Library only when at least one indexed port is installed', () => {
    expect(appStartTab(0)).toBe('catalog')
    expect(appStartTab(1)).toBe('library')
    expect(appStartTab(11)).toBe('library')
  })
})

describe('on-demand app release check', () => {
  it('ignores the mock version and a release that is not newer', () => {
    expect(appSelfUpdateAvailable('mock', 'v1.0.109')).toBe(false)
    expect(appSelfUpdateAvailable('1.0.108', 'v1.0.108')).toBe(false)
    expect(appSelfUpdateAvailable('1.0.108', 'v1.0.109')).toBe(true)
    expect(appSelfUpdateAvailable(null, 'v1.0.109')).toBe(false)
  })

  it('reads the QuestPorts.apk asset from the latest GitHub release', () => {
    const view = parseLatestAppRelease({
      tag_name: 'v1.0.109',
      assets: [
        { name: 'notes.txt', browser_download_url: 'https://example.com/notes.txt' },
        { name: 'QuestPorts.apk', browser_download_url: 'https://github.com/felipevc13/questports-app/releases/download/v1.0.109/QuestPorts.apk' }
      ]
    }, '1.0.108')
    expect(view).toEqual({
      latest: 'v1.0.109',
      apkUrl: 'https://github.com/felipevc13/questports-app/releases/download/v1.0.109/QuestPorts.apk',
      update: true
    })
    expect(parseLatestAppRelease({ tag_name: 'v1.0.108', assets: [] }, '1.0.108').update).toBe(false)
  })
})

describe('app shell', () => {
  it('replaces the marketing home inside the app and probes every package id', () => {
    const index = readFileSync(new URL('../app/pages/index.vue', import.meta.url), 'utf8')
    const home = readFileSync(new URL('../app/components/AppHome.vue', import.meta.url), 'utf8')
    const install = readFileSync(new URL('../app/components/AppBridgeInstall.vue', import.meta.url), 'utf8')
    const shell = readFileSync(new URL('../app/app.vue', import.meta.url), 'utf8')

    expect(index).toContain('<AppHome v-if="inApp"')
    expect(index).toContain('<div v-else class="space-y-8">')
    expect(index).toContain('Standalone VR Ports')
    expect(home).toContain('data-testid="`app-tab-${item.id}`"')
    expect(home).toContain("{ id: 'library', label: 'Library' }")
    expect(home).toContain("{ id: 'catalog', label: 'Catalog' }")
    expect(home).toContain("{ id: 'settings', label: 'Settings' }")
    expect(home).toContain('data-testid="check-for-updates"')
    expect(home).toContain('data-testid="library-update"')
    expect(home).toContain('firstInstalledPackage')
    expect(home).toContain('appUpdateAvailable')
    expect(home).toContain('appStartTab')
    expect(home).toContain('installedPackages.value')
    expect(install).toContain('firstInstalledPackage(props.slug, name => bridge.isInstalled(name), props.packageName)')
    expect(install).toContain('bridge.isInstalled')
    expect(shell).toContain('<Navbar v-if="!inApp" />')
    expect(shell).toContain('<Footer v-if="!inApp" />')
  })

  it('waits for the native bridge when page finish is later than mount', () => {
    vi.useFakeTimers()
    const previous = globalThis.window
    let calls = 0
    const win = {
      QuestPortsApp: undefined as object | undefined,
      setInterval: globalThis.setInterval.bind(globalThis),
      clearInterval: globalThis.clearInterval.bind(globalThis)
    }
    globalThis.window = win as unknown as Window & typeof globalThis
    const stop = whenAppBridgeReady(() => {
      calls += 1
    }, 1000)
    expect(calls).toBe(0)
    win.QuestPortsApp = { isInstalled: () => true }
    vi.advanceTimersByTime(200)
    expect(calls).toBe(1)
    vi.advanceTimersByTime(1000)
    expect(calls).toBe(1)
    stop()
    globalThis.window = previous
    vi.useRealTimers()
  })
})

afterEach(() => {
  vi.useRealTimers()
})
