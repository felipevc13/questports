import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { getDefaultFolderInfo } from '../app/data/expansions'
import { AVAILABLE_VIDEO_PREVIEWS } from '../app/data/videoPreviews'
import { searchCatalog } from '../app/lib/catalogSearch'
import { isOneClickApkAsset, refusesOneClickInstall } from '../app/lib/patchOnlyInstall'

// Package ids are the manifest values read from each release APK with scripts/verify-apk-packages.mjs.
const NEW_PORTS: Array<[slug: string, packageName: string, cover: string]> = [
  ['gran-turismo-3-vr', 'org.gt3revisited.gt3r', 'gran-turismo-3-vr.png'],
  ['wwf-no-mercy-vr', 'com.nomercyrecomp.questvr', 'wwf-no-mercy-vr.png'],
  ['opentie-vr', 'com.bilko.opentievr', 'opentie-vr.jpg'],
  ['daggerfall-unity-vr', 'com.dfworkshop.dfuquest3', 'daggerfall-unity-vr.png']
]

const migration = readFileSync(
  new URL('../supabase/migrations/20261031010000_gt3_wwf_opentie_daggerfall.sql', import.meta.url),
  'utf8'
)

describe('Gran Turismo 3, WWF No Mercy, OpenTIE and Daggerfall Unity ports', () => {
  describe.each(NEW_PORTS)('%s', (slug, packageName, cover) => {
    const port = INITIAL_PORTS.find(p => p.slug === slug)

    it('is in the offline catalog with a pinned GitHub release APK', () => {
      expect(port).toBeDefined()
      expect(port?.port_download_url).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+\/releases\/download\/[^/]+\/[^/]+\.apk$/)
    })

    it('uses the package id read from the APK manifest', () => {
      expect(PORT_PACKAGE_CONFIGS[slug]?.packageName).toBe(packageName)
    })

    it('installs with one click and asks the player for game files', () => {
      expect(isOneClickApkAsset(port?.port_download_url)).toBe(true)
      expect(refusesOneClickInstall(slug, port?.port_download_url)).toBe(false)
      expect(PORT_PACKAGE_CONFIGS[slug]?.installType).toBe('apk_and_assets')
      expect(port?.base_game_store).toMatch(/^Requires your own copy/)
    })

    it('has a cover and a thumb on disk', () => {
      expect(port?.cover_image_url).toBe(`/covers/${cover}`)
      expect(existsSync(new URL(`../public/covers/${cover}`, import.meta.url))).toBe(true)
      const thumb = cover.replace(/\.(png|jpg)$/, '.jpg')
      expect(existsSync(new URL(`../public/covers/thumbs/${thumb}`, import.meta.url))).toBe(true)
    })

    it('shows an on-screen folder', () => {
      const info = getDefaultFolderInfo(port!)
      expect(info.fullPath).toMatch(/^\/sdcard\//)
      expect(info.instruction.length).toBeGreaterThan(10)
    })

    it('is inserted by the migration with the media-host cover', () => {
      expect(migration).toContain(`'${slug}'`)
      expect(migration).toContain(`https://questports-media.questports.workers.dev/covers/${cover}`)
      expect(migration).toContain(`'${port?.port_download_url}'`)
      expect(migration).toContain(`'${port?.latest_version}'`)
    })
  })

  it('checks the folders each game really needs', () => {
    expect(PORT_PACKAGE_CONFIGS['gran-turismo-3-vr']?.folders?.[0]?.fileExtensionPattern).toBe('\\.iso$')
    expect(PORT_PACKAGE_CONFIGS['opentie-vr']?.folders?.map(f => f.targetPath)).toEqual([
      '/sdcard/OpenTIE/TIE95/',
      '/sdcard/OpenTIE/TIE98/'
    ])
    expect(PORT_PACKAGE_CONFIGS['daggerfall-unity-vr']?.folders?.[0]?.acceptance).toBe('confirm')
  })

  it('has no Quest footage yet, so none gets a hover preview', () => {
    const withPreview = NEW_PORTS.map(([slug]) => slug).filter(slug => AVAILABLE_VIDEO_PREVIEWS.includes(slug))
    expect(withPreview).toEqual([])
  })

  it('finds each game by the names people type', () => {
    const find = (query: string) => searchCatalog(INITIAL_PORTS, query).map(hit => hit.item.slug)
    expect(find('gt3')).toContain('gran-turismo-3-vr')
    expect(find('gran turismo 3')).toContain('gran-turismo-3-vr')
    expect(find('wwf no mercy')).toContain('wwf-no-mercy-vr')
    expect(find('tie fighter')).toContain('opentie-vr')
    expect(find('daggerfall')).toContain('daggerfall-unity-vr')
  })
})
