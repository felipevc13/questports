import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import {
  CRAZY_TAXI_BASE_FILE,
  CRAZY_TAXI_INSTALL_STEPS,
  CRAZY_TAXI_PC_PATCH,
  CRAZY_TAXI_README_URL,
  DELTA_PATCHER_URL,
  CRAZY_TAXI_PATCH_URL,
  catalogPackageName,
  isOneClickApkAsset,
  oneClickInstallBlocked,
  patchOnlyGuideFor,
  pcPatchCardFor,
  refusesOneClickInstall
} from '../app/lib/patchOnlyInstall'

const stepText = () => {
  return [CRAZY_TAXI_PC_PATCH.body, ...CRAZY_TAXI_INSTALL_STEPS.flatMap(step => [
    step.title,
    ...step.paragraphs,
    step.code || '',
    ...(step.bullets || []),
    ...(step.links || []).flatMap(link => [link.href, link.label])
  ])].join('\n')
}

describe('patch-only install', () => {
  it('blocks patch files and still allows a real APK URL', () => {
    expect(oneClickInstallBlocked('https://github.com/Baywilly/Crazy-Taxi-VR-Standalone/releases/download/v0.1-beta/crazywilly.xdelta')).toBe(true)
    expect(oneClickInstallBlocked('https://example.com/game.XDELTA3?raw=1')).toBe(true)
    expect(oneClickInstallBlocked('https://example.com/game.apkm')).toBe(true)
    expect(oneClickInstallBlocked('https://github.com/org/repo/releases/download/v1/game.apk')).toBe(false)
    expect(oneClickInstallBlocked('https://github.com/org/repo/releases/download/v1/game.zip')).toBe(false)
    expect(oneClickInstallBlocked('')).toBe(false)
  })

  it('requires a package id and a real APK asset before one-click', () => {
    expect(isOneClickApkAsset(CRAZY_TAXI_PATCH_URL)).toBe(false)
    expect(isOneClickApkAsset('https://github.com/org/repo/releases/download/v1/game.apk')).toBe(true)
    expect(isOneClickApkAsset('https://github.com/org/repo/releases/download/v1/game.zip')).toBe(true)
    expect(isOneClickApkAsset('https://github.com/org/repo/releases/latest')).toBe(true)
    expect(isOneClickApkAsset('https://sidequestvr.com/app/10349/iron-lung-vr')).toBe(true)
    expect(isOneClickApkAsset('')).toBe(false)

    expect(catalogPackageName('crazy-taxi-vr')).toBe('com.baywilly.crazytaxivr')
    expect(refusesOneClickInstall('crazy-taxi-vr', CRAZY_TAXI_PATCH_URL)).toBe(true)
    expect(refusesOneClickInstall('crazy-taxi-vr', 'https://example.com/CrazyTaxiVR.apk')).toBe(false)
    expect(refusesOneClickInstall('iron-lung-vr', 'https://example.com/game.xdelta')).toBe(true)
    expect(refusesOneClickInstall('iron-lung-vr', 'https://example.com/game.apk')).toBe(false)
    expect(refusesOneClickInstall('gta-sa-vr-quest', 'https://github.com/example/gta-sa-vr-quest')).toBe(true)
  })

  it('copies the Crazy Taxi README install steps and does not invent tools', () => {
    const text = stepText()
    const card = pcPatchCardFor('crazy-taxi-vr')
    expect(patchOnlyGuideFor('crazy-taxi-vr')).toBeNull()
    expect(card).toEqual(CRAZY_TAXI_PC_PATCH)
    expect(card?.href).toBe(CRAZY_TAXI_README_URL)
    expect(card?.title).toBe('Step 1: PC patch required')
    expect(card?.tag).toBe('PC Patch')
    expect(card?.buttonLabel).toBe('Open Patch Instructions (GitHub)')
    expect(card?.body).toMatch(/SEGA/)
    expect(card?.body).toMatch(/XDelta/)
    expect(card?.body).toMatch(/SideQuest/)
    expect(CRAZY_TAXI_INSTALL_STEPS).toHaveLength(6)
    expect(text).toContain(CRAZY_TAXI_BASE_FILE)
    expect(text).toContain('crazywilly.xdelta')
    expect(text).toContain(DELTA_PATCHER_URL)
    expect(text).toContain('Rename the file extension from .apkm to .apk')
    expect(text).toContain('Open SideQuest or another compatible installation tool.')
    expect(text).toContain('Launch the game, select your driver, and get ready to hit the streets.')
    expect(text).not.toMatch(/adb install/i)
    expect(text).not.toMatch(/Rockstar/)
    expect(text).not.toMatch(/BUILD_AND_INSTALL/)
    expect(text).not.toMatch(/left stick/i)
    expect(CRAZY_TAXI_INSTALL_STEPS[5].paragraphs.join(' ')).not.toMatch(/\bA button\b/)
  })

  it('refuses one-click unless portPackageMap has a packageName', () => {
    expect(catalogPackageName('not-in-the-map')).toBe('')
    expect(refusesOneClickInstall('not-in-the-map', 'https://example.com/game.apk')).toBe(true)
    const guide = patchOnlyGuideFor('not-in-the-map', 'https://example.com/game.apk', 'https://github.com/example/port')
    expect(guide?.readmeUrl).toBe('https://github.com/example/port')
    expect(guide?.steps.map(step => step.title)).toEqual([
      'Download the file',
      'Follow the install instructions'
    ])
    expect(guide?.steps[1].links?.some(link => link.href === '#install-guide')).toBe(true)
    expect(guide?.lead).not.toContain(CRAZY_TAXI_BASE_FILE)
    expect(guide?.pageIntro).toMatch(/package id/)

    for (const port of INITIAL_PORTS) {
      if (refusesOneClickInstall(port.slug, port.port_download_url)) continue
      expect(PORT_PACKAGE_CONFIGS[port.slug]?.packageName?.trim(), port.slug).toBeTruthy()
    }

    for (const [slug, cfg] of Object.entries(PORT_PACKAGE_CONFIGS)) {
      if (cfg.packageName?.trim()) {
        expect(catalogPackageName(slug)).toBe(cfg.packageName.trim())
        continue
      }
      expect(refusesOneClickInstall(slug, 'https://example.com/game.apk'), slug).toBe(true)
    }
  })

  it('gives other patch URLs a short notice instead of Crazy Taxi steps', () => {
    const guide = patchOnlyGuideFor('some-port', 'https://example.com/mod.xdelta', 'https://github.com/example/mod')
    expect(guide?.steps).toEqual([])
    expect(guide?.readmeUrl).toBe('https://github.com/example/mod')
    expect(guide?.lead).not.toContain(CRAZY_TAXI_BASE_FILE)
  })

  it('keeps the install buttons from calling one-click on a patch', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    const install = readFileSync(new URL('../app/components/AppBridgeInstall.vue', import.meta.url), 'utf8')
    const home = readFileSync(new URL('../app/components/AppHome.vue', import.meta.url), 'utf8')
    const library = readFileSync(new URL('../app/pages/library.vue', import.meta.url), 'utf8')
    const migration = readFileSync(new URL('../supabase/migrations/20261015104500_crazy_taxi_readme_steps.sql', import.meta.url), 'utf8')

    expect(page).toContain('<PatchOnlyInstall v-else-if="patchOnlyGuide" :guide="patchOnlyGuide" />')
    expect(page).toContain('v-else-if="!patchOnlyGuide && !pcPatchCard"')
    expect(page).toContain(':needs-game-files="!isPcBuilderRequired && !isDirectApkOnly && !patchOnlyGuide && !pcPatchCard"')
    const patchCard = page.slice(page.indexOf('<template v-if="pcPatchCard">'), page.indexOf('v-else-if="patchOnlyGuide"'))
    const builderCard = page.slice(page.indexOf('<template v-else-if="isPcBuilderRequired">'), page.indexOf('<!-- Case B:'))
    expect(page).not.toContain('Select built .apk from PC')
    expect(page).not.toContain('pc-patch-check-headset')
    expect(page).not.toContain('pc-patch-local-apk')
    expect(patchCard).toContain('root-test-id="pc-patch-card"')
    expect(patchCard).not.toContain('Check Headset')
    expect(patchCard).not.toContain('type="file"')
    expect(patchCard).not.toContain('install-on-quest')
    expect(builderCard).toContain('test-id="pc-builder-link"')
    expect(builderCard).not.toContain('Check Headset')
    expect(builderCard).not.toContain('type="file"')
    expect(builderCard).not.toContain('install-on-quest')
    const standardCard = page.slice(page.indexOf('<!-- Case B:'))
    expect(standardCard).toContain('Check Headset')
    expect(standardCard).toContain('Select local .apk')
    const handle = page.slice(page.indexOf('const handleApkInstall'))
    expect(handle.indexOf('refusesOneClickInstall')).toBeGreaterThan(0)
    expect(handle.indexOf('refusesOneClickInstall')).toBeLessThan(handle.indexOf("trackInstall('install_click')"))

    expect(install).toContain('<PatchOnlyInstall v-else-if="patchGuide" :guide="patchGuide" />')
    expect(install).toContain('test-id="app-pc-builder"')
    expect(install).toContain('test-id="pc-patch-instructions"')
    const appPatch = install.slice(install.lastIndexOf('<PcPrepCard', install.indexOf('v-if="pcPatch"')), install.indexOf('v-else-if="patchGuide"'))
    expect(appPatch).toContain('v-if="pcPatch"')
    expect(appPatch).not.toContain('type="file"')
    expect(appPatch).not.toContain('Check Headset')
    const appBuilder = install.slice(install.indexOf('v-else-if="pcBuilder"'), install.indexOf('<template v-else>'))
    expect(appBuilder).toContain('test-id="app-pc-builder"')
    expect(appBuilder).not.toContain('type="file"')
    expect(appBuilder).not.toContain('Check Headset')
    expect(install).not.toContain('Select built .apk from PC')
    expect(install).toContain('data-testid="install-on-quest"')
    const start = install.slice(install.indexOf('const startInstall'))
    expect(start.indexOf('if (patchGuide.value) return')).toBeLessThan(start.indexOf("trackInstall('install_click')"))

    expect(home).toContain('refusesOneClickInstall(port.slug, port.port_download_url)')
    expect(library).toContain('refusesOneClickInstall(entry.port.slug, url)')

    expect(migration).toContain(CRAZY_TAXI_BASE_FILE)
    expect(migration).toContain('crazywilly.xdelta')
    expect(migration).toContain(DELTA_PATCHER_URL)
    expect(migration).toContain(CRAZY_TAXI_README_URL)
    expect(migration).toContain('Rename the file extension from `.apkm` to `.apk`')
    expect(migration).toContain('Open **SideQuest** or another compatible installation tool.')
    expect(migration).not.toMatch(/adb install/i)
    expect(migration).not.toMatch(/Rockstar/)
  })
})