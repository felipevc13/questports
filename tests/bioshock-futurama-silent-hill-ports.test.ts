import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { getDefaultFolderInfo } from '../app/data/expansions'
import { searchCatalog } from '../app/lib/catalogSearch'
import { noPcInstall } from '../app/lib/noPcInstall'
import { isOneClickApkAsset, pcPatchCardFor, refusesOneClickInstall } from '../app/lib/patchOnlyInstall'

// Package ids come from each project's README. They have not been read from the APK manifest yet.
const NEW_PORTS: Array<[slug: string, packageName: string]> = [
  ['bioshock-infinite-quest', 'com.bsiquest.game'],
  ['futurama-quest', 'com.futuramarecomp.app'],
  ['silent-hill-vr', 'com.sh1vr.quest']
]

const migration = readFileSync(
  new URL('../supabase/migrations/20261117120000_bioshock_futurama_silent_hill_ports.sql', import.meta.url),
  'utf8'
)

const port = (slug: string) => INITIAL_PORTS.find(p => p.slug === slug)

describe('BioShock Infinite, Futurama and Silent Hill ports', () => {
  describe.each(NEW_PORTS)('%s', (slug, packageName) => {
    it('is in the offline catalog with a release asset from its own repo', () => {
      const row = port(slug)
      expect(row).toBeDefined()
      expect(row?.github_url).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+$/)
      expect(row?.port_download_url?.startsWith(`${row?.github_url}/releases/download/`)).toBe(true)
    })

    it('uses the package id from the README', () => {
      expect(PORT_PACKAGE_CONFIGS[slug]?.packageName).toBe(packageName)
    })

    it('shows an on-screen folder', () => {
      const info = getDefaultFolderInfo(port(slug)!)
      expect(info.fullPath).toMatch(/^\/sdcard\//)
    })

    it('is inserted by the migration with the same download and guide', () => {
      const row = port(slug)!
      expect(migration).toContain(`'${slug}'`)
      expect(migration).toContain(`'${row.port_download_url}'`)
      expect(migration).toContain(row.installation_guide!)
    })

    it('has no cover yet, in the mock row or the migration', () => {
      expect(port(slug)?.cover_image_url).toBeNull()
      expect(migration).not.toContain(`/covers/${slug}`)
    })
  })

  it('installs Futurama and Silent Hill with one click and asks for the disc', () => {
    for (const slug of ['futurama-quest', 'silent-hill-vr']) {
      const url = port(slug)?.port_download_url
      expect(isOneClickApkAsset(url)).toBe(true)
      expect(refusesOneClickInstall(slug, url)).toBe(false)
      expect(PORT_PACKAGE_CONFIGS[slug]?.installType).toBe('apk_and_assets')
      expect(noPcInstall(slug)).toBe('yes')
    }
    expect(PORT_PACKAGE_CONFIGS['silent-hill-vr']?.folders?.[0]?.targetPath).toBe('/sdcard/SilentHillVR/gamedata/')
  })

  it('sends BioShock Infinite through the Windows installer', () => {
    const slug = 'bioshock-infinite-quest'
    expect(PORT_PACKAGE_CONFIGS[slug]?.installType).toBe('pc_builder_required')
    expect(refusesOneClickInstall(slug, port(slug)?.port_download_url)).toBe(true)
    expect(pcPatchCardFor(slug)?.href).toBe('https://github.com/egomortal/bsi-quest')
    expect(noPcInstall(slug)).toBe('no')
  })

  it('finds each game by the names people type', () => {
    const find = (query: string) => searchCatalog(INITIAL_PORTS, query).map(hit => hit.item.slug)
    expect(find('bioshock')).toContain('bioshock-infinite-quest')
    expect(find('bsi')).toContain('bioshock-infinite-quest')
    expect(find('futurama')).toContain('futurama-quest')
    expect(find('bender')).toContain('futurama-quest')
    expect(find('silent hill')).toContain('silent-hill-vr')
    expect(find('sh1')).toContain('silent-hill-vr')
  })
})
