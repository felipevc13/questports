import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { getDefaultFolderInfo } from '../app/data/expansions'
import { searchCatalog } from '../app/lib/catalogSearch'
import { noPcInstall } from '../app/lib/noPcInstall'
import { isOneClickApkAsset, refusesOneClickInstall } from '../app/lib/patchOnlyInstall'

const migration = readFileSync(new URL('../supabase/migrations/20261126170000_rage_racer_wario_land_4_vr.sql', import.meta.url), 'utf8')
const entries = [
  ['rage-racer-vr', 'org.rageracer.quest', 'v0.6.5-rc1'],
  ['wario-land-4-vr', 'com.wl4recomp.quest', 'v0.1.0']
] as const
const port = (slug: string) => INITIAL_PORTS.find(row => row.slug === slug)!

describe('Rage Racer VR and Wario Land 4 VR', () => {
  it.each(entries)('%s has matching catalog, package and release migration', (slug, packageName, version) => {
    const row = port(slug)
    expect(row).toBeDefined()
    expect(row.latest_version).toBe(version)
    expect(row.port_download_url?.startsWith(`${row.github_url}/releases/download/${version}/`)).toBe(true)
    expect(migration).toContain(`'${slug}'`)
    expect(migration).toContain(`'${row.port_download_url}'`)
    expect(migration).toContain(row.installation_guide!)
    expect(migration).toContain('on conflict (slug) do nothing')
    expect(PORT_PACKAGE_CONFIGS[slug].packageName).toBe(packageName)
    expect(PORT_PACKAGE_CONFIGS[slug].installType).toBe('apk_and_assets')
    expect(PORT_PACKAGE_CONFIGS[slug].criticalFiles).toEqual([])
    expect(PORT_PACKAGE_CONFIGS[slug].folders?.[0]?.acceptance).toBe('confirm')
    expect(isOneClickApkAsset(row.port_download_url)).toBe(true)
    expect(refusesOneClickInstall(slug, row.port_download_url)).toBe(false)
    expect(getDefaultFolderInfo(row).fullPath).toBe('/sdcard/Download/')
    expect(noPcInstall(slug)).toBe('yes')
    expect(row.cover_image_url).toBe(`https://questports-media.questports.workers.dev/covers/${slug}.${slug === 'wario-land-4-vr' ? 'jpg' : 'png'}`)
  })

  it('preserves the disc and ROM requirements rather than claiming any file is sufficient', () => {
    const rage = port('rage-racer-vr')
    const wario = port('wario-land-4-vr')
    expect(rage.installation_guide).toContain('.cue')
    expect(rage.installation_guide).toContain('.chd')
    expect(rage.installation_guide).toContain('Only Quest 3 has been tested')
    expect(wario.installation_guide).toContain('b9fe05a8080e124b67bce6a623234ee3b518a2c1')
    expect(wario.installation_guide).toContain('No BIOS is needed')
    expect(wario.youtube_video_id).toBe('fdBW9pHtGyo')
  })

  it('finds both by title and Wario by abbreviation', () => {
    const find = (query: string) => searchCatalog(INITIAL_PORTS, query).map(hit => hit.item.slug)
    expect(find('rage racer')).toContain('rage-racer-vr')
    expect(find('wario land 4')).toContain('wario-land-4-vr')
    expect(find('wl4')).toContain('wario-land-4-vr')
  })
})
