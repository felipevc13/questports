import { describe, it, expect } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { PORT_PACKAGE_CONFIGS, isPortInstalledOnQuest, isSelfContainedSideload, resolveWorkflowType } from '../app/data/portPackageMap'
import { getPortCampaigns } from '../app/data/expansions'

describe('Game-by-Game Automated Verification Suite (All 37 Ports)', () => {
  it('indexes all 37 ports in database', () => {
    expect(INITIAL_PORTS.length).toBe(37)
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
