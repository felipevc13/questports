import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PORT_EXPANSIONS, getPortCampaigns } from '../app/data/expansions'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { apkInstalledOnHeadset } from '../app/lib/apkInstalledState'
import { countInstalledParts } from '../app/lib/campaignParts'

/** Not a catalog package. Long enough that a slug cannot be a substring of it. */
const UNRELATED = ['com.example.unrelatedsideload']

const catalogSlugs = INITIAL_PORTS.map(port => port.slug)
const slugs = [...new Set([...catalogSlugs, ...Object.keys(PORT_PACKAGE_CONFIGS)])].sort()

describe('APK installed card follows a live headset', () => {
  it('covers every catalog port, including ones that only live in the package map', () => {
    expect(catalogSlugs.length).toBeGreaterThan(30)
    expect(slugs).toEqual([...new Set(slugs)].sort())
    for (const slug of Object.keys(PORT_PACKAGE_CONFIGS)) {
      expect(catalogSlugs, slug).toContain(slug)
    }
  })

  it('does not show the installed card for any port while the desktop is disconnected', () => {
    for (const slug of slugs) {
      const cfg = PORT_PACKAGE_CONFIGS[slug]
      const remembered = [cfg?.packageName, ...(cfg?.altPackages || [])].filter((name): name is string => Boolean(name))
      expect(apkInstalledOnHeadset({
        connected: false,
        slug,
        installedPackages: remembered,
        bridgeInstalled: false
      }), slug).toBe(false)
      expect(apkInstalledOnHeadset({
        connected: false,
        slug,
        installedPackages: [],
        bridgeInstalled: false
      }), `${slug} empty`).toBe(false)
    }
  })

  it('shows installed only when the connected Quest has the package or an alt id', () => {
    const withAlts = slugs.filter(slug => (PORT_PACKAGE_CONFIGS[slug]?.altPackages?.length || 0) > 0)
    expect(withAlts.length).toBeGreaterThan(10)

    for (const slug of slugs) {
      const cfg = PORT_PACKAGE_CONFIGS[slug]
      expect(apkInstalledOnHeadset({
        connected: true,
        slug,
        installedPackages: UNRELATED,
        bridgeInstalled: false
      }), slug).toBe(false)

      if (!cfg?.packageName) continue
      expect(apkInstalledOnHeadset({
        connected: true,
        slug,
        installedPackages: [cfg.packageName],
        bridgeInstalled: false
      }), slug).toBe(true)

      for (const alt of cfg.altPackages || []) {
        expect(apkInstalledOnHeadset({
          connected: true,
          slug,
          installedPackages: [alt],
          bridgeInstalled: false
        }), `${slug} ${alt}`).toBe(true)
        expect(apkInstalledOnHeadset({
          connected: false,
          slug,
          installedPackages: [alt],
          bridgeInstalled: false
        }), `${slug} ${alt} disconnected`).toBe(false)
      }
    }
  })

  it('still trusts the Android app bridge when WebUSB is not connected', () => {
    for (const slug of slugs) {
      expect(apkInstalledOnHeadset({
        connected: false,
        slug,
        installedPackages: [],
        bridgeInstalled: true
      }), slug).toBe(true)
      expect(apkInstalledOnHeadset({
        connected: false,
        slug,
        installedPackages: UNRELATED,
        bridgeInstalled: false
      }), slug).toBe(false)
    }
  })

  it('keeps every multi-campaign counter at 0 while disconnected', () => {
    const multi = Object.keys(PORT_EXPANSIONS).filter(slug => (PORT_EXPANSIONS[slug]?.length || 0) > 1).sort()
    expect(multi).toEqual(['doom3quest', 'lambda1vr', 'nolf-vr', 'razexr', 'sourcevr'])

    for (const slug of multi) {
      const port = INITIAL_PORTS.find(item => item.slug === slug)
      const parts = getPortCampaigns(port!)
      const cfg = PORT_PACKAGE_CONFIGS[slug]
      expect(parts.length, slug).toBeGreaterThan(1)
      const packageInstalled = apkInstalledOnHeadset({
        connected: false,
        slug,
        installedPackages: [cfg?.packageName || '', ...(cfg?.altPackages || [])],
        bridgeInstalled: false
      })
      expect(countInstalledParts(parts, () => ({ packageInstalled, filesReady: false })), slug).toBe(0)

      const live = apkInstalledOnHeadset({
        connected: true,
        slug,
        installedPackages: [cfg!.packageName],
        bridgeInstalled: false
      })
      expect(countInstalledParts(parts, part => ({ packageInstalled: live, filesReady: false })), `${slug} base only`).toBe(1)
    }
  })

  it('does not restore the install card from localStorage on the shared port page', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    expect(page).toContain('apkInstalledOnHeadset')
    expect(page).toContain('const packageInstalled = isApkInstalled')
    expect(page).toContain('if (!questAdb.isConnected.value) return false')
    expect(page).not.toContain('questports_installed_')
    expect(page).not.toContain('getPersistedInstalled')
  })
})
