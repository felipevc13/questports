import { destinationDirForDroppedFile } from '../app/lib/dropPaths'
import { describe, expect, it } from 'vitest'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { PORT_SEARCH_ALIASES } from '../app/data/searchAliases'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { getDefaultFolderInfo, getPortCampaigns } from '../app/data/expansions'
import { refusesOneClickInstall } from '../app/lib/patchOnlyInstall'
import { readFileSync } from 'node:fs'
import { SYNC_OVERRIDES } from '../scripts/lib/portSyncTargets.js'

describe('Port Royale preliminary integrations', () => {
  const packages: Record<string, string> = {
    'forza-horizon-vr': 'studio.deimos.pinyonshift',
    'crash-bandicoot-launcher': 'io.github.matteo842.crashlauncher.runtime',
    '0ad-vr': 'com.bilko.zeroadvr',
    'warzone-2100-vr': 'net.wz2100.warzone2100.quest',
    'no-gravity-vr': 'com.bilko.nogravityvr'
  }
  it('matches the reviewed APK manifest ids and has search aliases', () => {
    for (const [slug, pkg] of Object.entries(packages)) {
      expect(PORT_PACKAGE_CONFIGS[slug]?.packageName).toBe(pkg)
      expect(PORT_SEARCH_ALIASES[slug]?.length).toBeGreaterThan(0)
    }
  })
  it('does not claim picker locations verify game files', () => {
    for (const slug of ['forza-horizon-vr', 'crash-bandicoot-launcher', '0ad-vr']) {
      expect(PORT_PACKAGE_CONFIGS[slug]?.folders?.[0]?.acceptance).toBe('confirm')
    }
  })
  it('does not configure a mismatched GT4 variant installer', () => {
    expect(PORT_PACKAGE_CONFIGS['gran-turismo-4-vr']).toBeUndefined()
    expect(PORT_SEARCH_ALIASES['gran-turismo-4-vr']?.length).toBeGreaterThan(0)
    const port = INITIAL_PORTS.find(p => p.slug === 'gran-turismo-4-vr')!
    expect(refusesOneClickInstall(port.slug, port.port_download_url)).toBe(true)
    expect(port.port_download_url).toContain('v0.3.2-beta-online/GT4-Online')
    expect(port.installation_guide).toContain('Spec II')
    expect(port.installation_guide).toContain('Do not use the Online APK with the Spec II ISO')
    expect(SYNC_OVERRIDES[port.slug]?.skip).toBeTruthy()
  })
  it('keeps six offline rows and migration URLs aligned', () => {
    const sql = readFileSync(new URL('../supabase/migrations/20261126194000_portroyale_six_ports.sql', import.meta.url), 'utf8')
    for (const slug of [...Object.keys(packages), 'gran-turismo-4-vr']) {
      const port = INITIAL_PORTS.find(p => p.slug === slug)
      expect(port, slug).toBeDefined()
      expect(sql).toContain(`'${slug}'`)
      expect(sql).toContain(port!.port_download_url)
      expect(sql).toContain(port!.installation_guide.replace(/'/g, "''"))
      if (slug === 'no-gravity-vr') expect(port!.cover_image_url).toBe('https://questports-media.questports.workers.dev/covers/no-gravity-vr.jpg')
      else expect(port!.cover_image_url).toBe(`https://questports-media.questports.workers.dev/covers/${slug}.png`)
    }
    expect(sql).toContain('on conflict (slug) do nothing')
  })
  it('offers the correct ISO and destination for each separate GT4 APK', () => {
    const gt4 = INITIAL_PORTS.find(p => p.slug === 'gran-turismo-4-vr')!
    const variants = getPortCampaigns(gt4)
    expect(variants).toHaveLength(2)
    expect(variants[0]).toMatchObject({ name: 'GT4 Online VR', fullPath: '/sdcard/GT4HD/', isBase: true })
    expect(variants[0]!.exampleFiles).toContain('US v2.00')
    expect(variants[1]).toMatchObject({ name: 'GT4 Spec II VR', fullPath: '/sdcard/GT4SpecII/', isBase: true })
    expect(variants[1]!.exampleFiles).toContain('Spec II 1.10')
    expect(variants[1]!.instruction).toContain('Do not use the Online ISO')
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    expect(page).toContain('Select the APK version you installed:')
  })
  it('does not claim 0 A.D. requires a purchased PC game', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    expect(page).toContain("port.slug === '0ad-vr' ? 'Free data ZIP from the port release; no purchase required'")
  })
  it('shows picker and data-folder instructions instead of generic folder-copy text', () => {
    for (const slug of ['forza-horizon-vr', 'crash-bandicoot-launcher']) {
      const port = INITIAL_PORTS.find(p => p.slug === slug)!
      expect(getDefaultFolderInfo(port).fullPath).toBe('/sdcard/Download/')
      expect(getDefaultFolderInfo(port).instruction).not.toContain('Drop the')
    }
    const gt4 = INITIAL_PORTS.find(p => p.slug === 'gran-turismo-4-vr')!
    expect(getDefaultFolderInfo(gt4).fullPath).toBe('/sdcard/GT4HD/')
    expect(getDefaultFolderInfo(gt4).exampleFiles).toContain('US v2.00')
    const port = INITIAL_PORTS.find(p => p.slug === '0ad-vr')!
    expect(getDefaultFolderInfo(port).fullPath).toBe('/sdcard/0AD/data/')
    expect(getDefaultFolderInfo(port).instruction).toContain('drag and drop its data folder')
    expect(getDefaultFolderInfo(port).instruction).toContain('file picker cannot select folders')
    expect(PORT_PACKAGE_CONFIGS['0ad-vr'].folders?.[0]?.targetPath).toBe('/sdcard/0AD/data/')
    expect(destinationDirForDroppedFile(getDefaultFolderInfo(port).fullPath, 'data/mods/public/file.txt', 'file.txt')).toBe('/sdcard/0AD/data/mods/public/')
  })
})
