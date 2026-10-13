import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { installedPackageOnQuest, isPortInstalledOnQuest } from '../app/data/portPackageMap'
import { countIndexedInstalled, libraryUpdateAvailable, orderLibraryEntries } from '../app/lib/questLibrary'

describe('quest library', () => {
  it('resolves the installed package id, including an alt id', () => {
    expect(installedPackageOnQuest('lambda1vr', ['mod.drbeef.lambda1vr'])).toBe('mod.drbeef.lambda1vr')
    expect(installedPackageOnQuest('lambda1vr', ['com.drbeef.lambda1vr'])).toBe('com.drbeef.lambda1vr')
    expect(installedPackageOnQuest('rtcwquest', [])).toBeNull()
    expect(isPortInstalledOnQuest('halocequest', ['com.halo.decomp.vr'])).toBe(true)
  })

  it('puts updates first and keeps the rest alphabetical', () => {
    const rows = orderLibraryEntries([
      { port: { title: 'Zelda' }, packageName: 'a', installedVersion: '1', update: false },
      { port: { title: 'Alpha' }, packageName: 'b', installedVersion: '0.0.1', update: true },
      { port: { title: 'Mario' }, packageName: 'c', installedVersion: '1', update: false },
      { port: { title: 'Beta' }, packageName: 'd', installedVersion: '0.0.1', update: true }
    ], port => port.title)
    expect(rows.map(row => row.port.title)).toEqual(['Alpha', 'Beta', 'Mario', 'Zelda'])
  })

  it('counts indexed installs and hides a zero', () => {
    expect(countIndexedInstalled(['lambda1vr', 'rtcwquest'], ['mod.drbeef.lambda1vr'])).toBe(1)
    expect(countIndexedInstalled(['lambda1vr'], [])).toBe(0)
  })

  it('uses the catalog update rule, including the simulator 0.0.1 marker', () => {
    expect(libraryUpdateAvailable({ installedVersion: '0.0.1', catalogVersion: 'v1.4.1' })).toBe(true)
    expect(libraryUpdateAvailable({ installedVersion: 'v1.4.1', catalogVersion: 'v1.4.1' })).toBe(false)
    expect(libraryUpdateAvailable({ installedVersion: '1.0', catalogVersion: 'v2.1' })).toBe(false)
  })

  it('replaces the headset filter bar with a library tab and a small installed marker', () => {
    const index = readFileSync(new URL('../app/pages/index.vue', import.meta.url), 'utf8')
    const card = readFileSync(new URL('../app/components/PortCard.vue', import.meta.url), 'utf8')
    const library = readFileSync(new URL('../app/pages/library.vue', import.meta.url), 'utf8')
    expect(index).toContain('<CatalogLibraryTabs current="catalog" :count="installedCount" />')
    expect(index).toContain('countIndexedInstalled')
    const tabs = readFileSync(new URL('../app/components/CatalogLibraryTabs.vue', import.meta.url), 'utf8')
    expect(tabs).toContain('data-testid="library-count"')
    expect(tabs).toContain('v-if="count > 0"')
    expect(library).toContain(':count="installed.length"')
    expect(library).toContain('data-testid="library-uninstall"')
    expect(library).toContain('questAdb.uninstallPackage')
    expect(library).toContain('forgetInstalledRelease')
    expect(index).not.toContain('indexed ports installed')
    expect(index).not.toContain('questFilter')
    expect(index).not.toContain('Installed on Quest')
    expect(card).toContain('Installed')
    expect(card).not.toContain('Manage Files')
    expect(card).not.toContain('border-emerald-500')
    expect(library).toContain("'Update'")
    expect(library).toContain('Connect Quest in the header')
  })
})
