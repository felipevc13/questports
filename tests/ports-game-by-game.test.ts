import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { PORT_PACKAGE_CONFIGS, isPortInstalledOnQuest, isSelfContainedSideload, resolveWorkflowType } from '../app/data/portPackageMap'
import { getPortCampaigns } from '../app/data/expansions'
import { isOneClickApkAsset, patchOnlyGuideFor, refusesOneClickInstall } from '../app/lib/patchOnlyInstall'

describe('Game-by-Game Automated Verification Suite (All 44 Ports)', () => {
  it('indexes all 44 ports in database', () => {
    expect(INITIAL_PORTS.length).toBe(44)
  })

  it('credits WinlatorXR to the WinlatorXR team and the project repo', () => {
    const port = INITIAL_PORTS.find(p => p.slug === 'winlatorxr')
    expect(port?.developer).toBe('WinlatorXR team')
    expect(port?.developer_url).toBe('https://github.com/WinlatorXR/WinlatorXR')
    expect(port?.port_download_url).toBe('https://github.com/WinlatorXR/WinlatorXR/releases/latest')
    expect(port?.port_download_source).toBe('GitHub Releases')
    const sql = readFileSync(new URL('../supabase/migrations/20261015160000_winlatorxr_github_apk.sql', import.meta.url), 'utf8')
    expect(sql).toContain(port?.port_download_url)
    expect(sql).toContain("slug = 'winlatorxr'")
  })

  it('points SideQuest-listing ports at the GitHub release the APK proxy installs', () => {
    const releases = [
      {
        slug: 'csvr',
        url: 'https://github.com/Team-Beef-Studios/CSVR/releases/latest',
        packageName: 'com.lvonasek.csvr',
      },
      {
        slug: 'jkxr',
        url: 'https://github.com/Team-Beef-Studios/JKXR/releases/latest',
        packageName: 'com.drbeef.jkxr',
      },
      {
        slug: 'questcraft',
        url: 'https://github.com/QuestCraftPlusPlus/QuestCraft/releases/latest',
        packageName: 'com.qcxr.qcxr',
      },
      {
        slug: 'beefraiderxr',
        url: 'https://github.com/Team-Beef-Studios/BeefRaiderXR/releases/latest',
        packageName: 'com.drbeef.beefraiderxr',
      },
    ] as const
    const sql = readFileSync(new URL('../supabase/migrations/20261015170000_sidequest_listing_apk_urls.sql', import.meta.url), 'utf8')

    for (const release of releases) {
      const port = INITIAL_PORTS.find(p => p.slug === release.slug)
      expect(port?.port_download_url).toBe(release.url)
      expect(port?.port_download_source).toBe('GitHub Releases')
      expect(PORT_PACKAGE_CONFIGS[release.slug]?.packageName).toBe(release.packageName)
      expect(isOneClickApkAsset(release.url)).toBe(true)
      expect(refusesOneClickInstall(release.slug, release.url)).toBe(false)
      expect(sql).toContain(release.url)
      expect(sql).toContain(`slug = '${release.slug}'`)
    }
  })

  it('replaces the remaining SideQuest listing downloads', () => {
    const sql = readFileSync(new URL('../supabase/migrations/20261015193000_remaining_sidequest_listing_urls.sql', import.meta.url), 'utf8')
    const releases = [
      {
        slug: 'preyvr',
        url: 'https://github.com/Team-Beef-Studios/PreyVR/releases/latest',
        packageName: 'com.lvonasek.preyvr',
      },
      {
        slug: 'quake2quest',
        url: 'https://github.com/Team-Beef-Studios/Quake2Quest/releases/latest',
        packageName: 'com.drbeef.quake2quest',
      },
      {
        slug: 'quake3quest',
        url: 'https://github.com/Team-Beef-Studios/ioq3quest/releases/latest',
        packageName: 'com.drbeef.ioq3quest',
      },
      {
        slug: 'quakequest',
        url: 'https://github.com/Team-Beef-Studios/QuakeQuest/releases/latest',
        packageName: 'com.drbeef.quakequest',
      },
      {
        slug: 'razexr',
        url: 'https://github.com/Team-Beef-Studios/RazeXR/releases/latest',
        packageName: 'com.drbeef.razexr',
      },
    ] as const
    const manuals = [
      {
        slug: 'hexen2vr',
        url: 'https://github.com/sezero/uhexen2/blob/master/README.txt',
        source: 'GitHub',
        project: 'https://github.com/sezero/uhexen2',
      },
      {
        slug: 'iron-lung-vr',
        url: 'https://jackaapacka.itch.io/iron-lung-vr',
        source: 'Itch.io',
        project: 'https://jackaapacka.itch.io/iron-lung-vr',
      },
    ] as const

    for (const release of releases) {
      const port = INITIAL_PORTS.find(p => p.slug === release.slug)
      if (port) {
        expect(port.port_download_url).toBe(release.url)
        expect(port.port_download_source).toBe('GitHub Releases')
      }
      expect(PORT_PACKAGE_CONFIGS[release.slug]?.packageName).toBe(release.packageName)
      expect(isOneClickApkAsset(release.url)).toBe(true)
      expect(refusesOneClickInstall(release.slug, release.url)).toBe(false)
      expect(sql).toContain(release.url)
      expect(sql).toContain(`slug = '${release.slug}'`)
    }

    for (const manual of manuals) {
      const port = INITIAL_PORTS.find(p => p.slug === manual.slug)
      expect(port?.port_download_url).toBe(manual.url)
      expect(port?.port_download_source).toBe(manual.source)
      expect(refusesOneClickInstall(manual.slug, manual.url)).toBe(true)
      expect(patchOnlyGuideFor(manual.slug, manual.url, manual.project)?.readmeUrl).toBe(manual.project)
      expect(sql).toContain(manual.url)
      expect(sql).toContain(`slug = '${manual.slug}'`)
    }

    expect(INITIAL_PORTS.some(port => String(port.port_download_url || '').includes('sidequestvr.com'))).toBe(false)
    expect(PORT_PACKAGE_CONFIGS.quake3quest?.altPackages).toContain('com.drbeef.ioquake3quest')
  })

  it('installs PPSSPP VR from the direct PPSSPP.org APK', () => {
    const url = 'https://www.ppsspp.org/files/1_20_4/ppsspp_vr.apk'
    const port = INITIAL_PORTS.find(p => p.slug === 'ppsspp-vr')
    expect(port?.port_download_url).toBe(url)
    expect(port?.port_download_source).toBe('PPSSPP.org')
    expect(PORT_PACKAGE_CONFIGS['ppsspp-vr']?.packageName).toBe('org.ppsspp.ppssppvr')
    expect(isOneClickApkAsset(url)).toBe(true)
    expect(refusesOneClickInstall('ppsspp-vr', url)).toBe(false)
    expect(patchOnlyGuideFor('ppsspp-vr', url, port?.github_url)).toBeNull()
    const sql = readFileSync(new URL('../supabase/migrations/20261015200000_ppsspp_vr_direct_apk.sql', import.meta.url), 'utf8')
    expect(sql).toContain(url)
    expect(sql).toContain("slug = 'ppsspp-vr'")
    expect(sql).toContain('PPSSPP.org')
  })

  // Test every individual port game-by-game
  INITIAL_PORTS.forEach((port, idx) => {
    describe(`[#${idx + 1}] ${port.title} (${port.slug})`, () => {
      it('has valid metadata and installation guide', () => {
        expect(port.slug).toBeTruthy()
        expect(port.slug).toMatch(/^[a-z0-9-]+$/)
        expect(port.title).toBeTruthy()
        expect(port.developer).toBeTruthy()
        expect(port.category).toBeTruthy()
        expect(port.status).toBeTruthy()
        expect(port.cover_image_url).toBeTruthy()
        expect(port.supported_hardware).toBeInstanceOf(Array)
        expect(port.supported_hardware.length).toBeGreaterThanOrEqual(1)

        // Must have non-empty installation guide
        expect(port.installation_guide).toBeTruthy()
        expect(port.installation_guide.length).toBeGreaterThan(50)
      })

      it('has matching package configuration in PORT_PACKAGE_CONFIGS', () => {
        const pkg = PORT_PACKAGE_CONFIGS[port.slug]
        expect(pkg, `Missing package config for ${port.slug}`).toBeDefined()
        expect(pkg.packageName).toBeTruthy()
        expect(pkg.packageName).toMatch(/^[a-zA-Z0-9_.]+$/)
        expect(pkg.installType).toMatch(/^(direct_apk|apk_and_assets|pc_builder_required)$/)
        expect(resolveWorkflowType(port)).toBe(pkg.workflowType)
        if (port.install_workflow) {
          expect(port.install_workflow).toBe(pkg.workflowType)
        }
        if (isSelfContainedSideload(pkg)) {
          expect(pkg.installType).toBe('direct_apk')
          expect(pkg.workflowType).toBe('direct')
        } else if (pkg.installType === 'direct_apk' && pkg.workflowType === 'direct') {
          throw new Error(`${port.slug} is marked direct_apk/direct but isSelfContainedSideload is false`)
        }
      })

      it('properly detects headset installation via isPortInstalledOnQuest', () => {
        const pkg = PORT_PACKAGE_CONFIGS[port.slug]
        expect(pkg).toBeDefined()

        // Test primary package name detection
        const detectedPrimary = isPortInstalledOnQuest(port.slug, [pkg.packageName])
        expect(detectedPrimary, `Should detect ${port.slug} using primary package ${pkg.packageName}`).toBe(true)

        // Test with unrelated package names (should not false-positive)
        const falsePositive = isPortInstalledOnQuest(port.slug, ['com.unrelated.randomapp'])
        expect(falsePositive, `Should not false positive on unrelated package`).toBe(false)

        // Test altPackages if present
        if (pkg.altPackages && pkg.altPackages.length > 0) {
          for (const alt of pkg.altPackages) {
            const detectedAlt = isPortInstalledOnQuest(port.slug, [alt])
            expect(detectedAlt, `Should detect ${port.slug} using alt package ${alt}`).toBe(true)
          }
        }
      })

      it('has valid internal storage paths and campaign definitions', () => {
        const campaigns = getPortCampaigns(port)
        expect(campaigns.length).toBeGreaterThanOrEqual(1)

        for (const c of campaigns) {
          expect(c.id).toBeTruthy()
          expect(c.name).toBeTruthy()
          expect(c.folder).toBeTruthy()
          if (!port.internal_storage_path?.startsWith('N/A')) {
            expect(c.fullPath.startsWith('/sdcard/'), `${c.fullPath} must start with /sdcard/`).toBe(true)
            expect(c.fullPath.endsWith('/'), `${c.fullPath} must end with /`).toBe(true)
          }
          expect(c.exampleFiles).toBeTruthy()
        }

        // Verify root storage path on port itself
        if (port.internal_storage_path && !port.internal_storage_path.startsWith('N/A')) {
          expect(port.internal_storage_path.startsWith('/sdcard/')).toBe(true)
          expect(port.internal_storage_path.endsWith('/')).toBe(true)
        }
      })

      it('has valid repository and source links', () => {
        // GitHub URL
        if (port.github_url) {
          expect(port.github_url).toMatch(/^https?:\/\//)
        }

        // Port Download URL
        if (port.port_download_url) {
          expect(port.port_download_url).toMatch(/^https?:\/\//)
        }

        // Base game URL if commercial game required
        if (port.base_game_url) {
          expect(port.base_game_url).toMatch(/^https?:\/\//)
        }
      })
    })
  })
})
