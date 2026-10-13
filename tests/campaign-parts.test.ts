import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PORT_EXPANSIONS, getPortCampaigns } from '../app/data/expansions'
import { isPortInstalledOnQuest } from '../app/data/portPackageMap'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { campaignPartState, countInstalledParts } from '../app/lib/campaignParts'

/** Ports whose catalog data is a base game plus at least one expansion. */
const MULTI_PART_SLUGS = ['lambda1vr', 'sourcevr', 'doom3quest', 'razexr', 'nolf-vr'] as const

describe('installed parts', () => {
  it('counts the base game from an alt package id, and a DLC only when its files are present', () => {
    const port = INITIAL_PORTS.find(item => item.slug === 'lambda1vr')
    const parts = getPortCampaigns(port!)
    const packageInstalled = isPortInstalledOnQuest('lambda1vr', ['mod.drbeef.lambda1vr'])
    expect(packageInstalled).toBe(true)

    const files = new Set<string>()
    const count = () => countInstalledParts(parts, part => ({
      packageInstalled,
      filesReady: files.has(part.id)
    }))

    expect(count()).toBe(1)
    expect(campaignPartState(parts[0]!, { packageInstalled, filesReady: false })).toBe('installed')
    expect(parts.filter(part => !part.isBase).map(part => campaignPartState(part, { packageInstalled, filesReady: false })))
      .toEqual(['missing', 'missing'])

    files.add('opfor')
    expect(count()).toBe(2)
    expect(campaignPartState(parts.find(part => part.id === 'opfor')!, { packageInstalled, filesReady: true })).toBe('ready')
  })

  it('does not count a base game the headset does not have', () => {
    const parts = [{ id: 'hl1', isBase: true }, { id: 'opfor', isBase: false }]
    expect(countInstalledParts(parts, () => ({ packageInstalled: false, filesReady: false }))).toBe(0)
    expect(isPortInstalledOnQuest('lambda1vr', ['com.example.other'])).toBe(false)
  })

  it('uses the same rule for every multi-part port, including alt package ids', () => {
    expect(Object.keys(PORT_EXPANSIONS).filter(slug => (PORT_EXPANSIONS[slug]?.length || 0) > 1).sort())
      .toEqual([...MULTI_PART_SLUGS].sort())

    for (const slug of MULTI_PART_SLUGS) {
      const port = INITIAL_PORTS.find(item => item.slug === slug)
      const parts = getPortCampaigns(port!)
      expect(parts.length, slug).toBeGreaterThan(1)
      expect(parts.filter(part => part.isBase), slug).toHaveLength(1)
      for (const part of parts) {
        expect(part.folder, `${slug}/${part.id}`).toBeTruthy()
        expect(part.fullPath, `${slug}/${part.id}`).toMatch(/^\/sdcard\/.+\/$/)
        expect(part.exampleFiles, `${slug}/${part.id}`).toBeTruthy()
      }

      const alt = parts[0] && isPortInstalledOnQuest(slug, [
        // Prefer an alt id when the port has one, otherwise the primary still counts.
        'mod.drbeef.lambda1vr',
        'com.teambeef.razexr',
        'com.nillerusr.sourcevr'
      ])
      const packageInstalled = alt || isPortInstalledOnQuest(slug, ['com.drbeef.doom3quest', 'net.relith.nolf'])
      expect(packageInstalled, slug).toBe(true)
      expect(countInstalledParts(parts, part => ({ packageInstalled: true, filesReady: false })), slug).toBe(1)
      expect(countInstalledParts(parts, () => ({ packageInstalled: true, filesReady: true })), slug).toBe(parts.length)
    }
  })

  it('shows each expansion folder on the game page and probes the bridge the way the library does', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const tabs = readFileSync(new URL('../app/components/CatalogLibraryTabs.vue', import.meta.url), 'utf8')
    const home = readFileSync(new URL('../app/components/AppHome.vue', import.meta.url), 'utf8')
    const css = readFileSync(new URL('../app/assets/css/main.css', import.meta.url), 'utf8')

    expect(page).toContain('data-testid="campaign-part"')
    expect(page).toContain('data-testid="campaign-part-path"')
    expect(page).toContain('data-testid="campaign-part-files"')
    expect(page).toContain('{{ c.exampleFiles }}')
    expect(page).toContain('{{ c.folder }}/ → {{ c.fullPath }}')
    expect(page).toContain('firstInstalledPackage')
    expect(page).toContain('bridge.getInstalledVersion(found)')
    expect(page).toContain('isPortInstalledOnQuest(slug, questAdb.installedPackages.value)')
    expect(page).not.toContain('{{ installedCampaignsCount }} / {{ campaignList.length }} Ready')

    expect(tabs).toContain('class="library-count bg-muted text-foreground"')
    expect(tabs).not.toContain('text-[10px]')
    expect(home).toContain('class="library-count ml-1.5 bg-background text-foreground"')
    expect(home).not.toContain('h-4 min-w-4')
    expect(css).toContain('.library-count')
    expect(css).toContain('place-items: center')
    expect(css).toContain('line-height: 1')
  })
})
