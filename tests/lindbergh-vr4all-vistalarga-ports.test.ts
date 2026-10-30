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
  ['ghost-squad-evolution-vr', 'org.lindbergh.gse.vr', 'ghost-squad-evolution-vr.png'],
  ['hotd4-vr', 'org.lindbergh.hotd4.vr', 'hotd4-vr.png'],
  ['teraburst-vr', 'com.vrlightgunhub.teraburst', 'teraburst-vr.jpg'],
  ['carnevil-vr', 'com.vrlightgunhub.carnevil', 'carnevil-vr.jpg'],
  ['mystical-ninja-vr', 'com.goemon64.recompiled', 'mystical-ninja-vr.jpg'],
  ['sin-and-punishment-vr', 'com.sinandpunishment.recompiled', 'sin-and-punishment-vr.png']
]

const migration = readFileSync(
  new URL('../supabase/migrations/20261030140000_lindbergh_vr4all_vistalarga_ports.sql', import.meta.url),
  'utf8'
)

describe('Lindbergh, vr4all and VistaLargaGames ports', () => {
  describe.each(NEW_PORTS)('%s', (slug, packageName, cover) => {
    const port = INITIAL_PORTS.find(p => p.slug === slug)

    it('is in the offline catalog with a pinned GitHub release APK', () => {
      expect(port).toBeDefined()
      expect(port?.port_download_url).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+\/releases\/download\/[^/]+\/[^/]+\.apk$/)
      expect(port?.latest_version).toMatch(/^v\d+\.\d+\.\d+$/)
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
    })
  })

  it('checks the folders each game really needs', () => {
    expect(PORT_PACKAGE_CONFIGS['ghost-squad-evolution-vr']?.criticalFiles).toEqual(['vsg_l/vsg'])
    expect(PORT_PACKAGE_CONFIGS['hotd4-vr']?.criticalFiles).toEqual(['elf/hod4M.elf'])
    expect(PORT_PACKAGE_CONFIGS['carnevil-vr']?.folders?.map(f => f.targetPath)).toEqual([
      '/sdcard/Download/',
      '/sdcard/Download/carnevil/'
    ])
    expect(PORT_PACKAGE_CONFIGS['teraburst-vr']?.folders?.[0]?.expectedFiles).toEqual(['terabrst.zip'])
  })

  it('only Sin & Punishment has Quest footage, so only it gets a hover preview', () => {
    const withPreview = NEW_PORTS.map(([slug]) => slug).filter(slug => AVAILABLE_VIDEO_PREVIEWS.includes(slug))
    expect(withPreview).toEqual(['sin-and-punishment-vr'])
    expect(existsSync(new URL('../public/previews/sin-and-punishment-vr.mp4', import.meta.url))).toBe(true)
  })

  it('finds each game by the names people type', () => {
    const find = (query: string) => searchCatalog(INITIAL_PORTS, query).map(hit => hit.item.slug)
    expect(find('ghost squad')).toContain('ghost-squad-evolution-vr')
    expect(find('hotd4')).toContain('hotd4-vr')
    expect(find('house of the dead 4')).toContain('hotd4-vr')
    expect(find('goemon')).toContain('mystical-ninja-vr')
    expect(find('snp')).toContain('sin-and-punishment-vr')
    expect(find('carnevil')).toContain('carnevil-vr')
    expect(find('teraburst')).toContain('teraburst-vr')
  })
})
