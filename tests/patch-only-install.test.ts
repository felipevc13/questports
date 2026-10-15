import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  CRAZY_TAXI_BASE_FILE,
  CRAZY_TAXI_INSTALL_STEPS,
  CRAZY_TAXI_README_URL,
  DELTA_PATCHER_URL,
  oneClickInstallBlocked,
  patchOnlyGuideFor,
  refusesOneClickInstall
} from '../app/lib/patchOnlyInstall'

const stepText = (slug: string) => {
  const guide = patchOnlyGuideFor(slug, 'https://github.com/Baywilly/Crazy-Taxi-VR-Standalone/releases/download/v0.1-beta/crazywilly.xdelta')
  return [guide?.lead, ...CRAZY_TAXI_INSTALL_STEPS.flatMap(step => [
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

  it('refuses one-click for Crazy Taxi even before looking at the file name', () => {
    expect(refusesOneClickInstall('crazy-taxi-vr', 'https://example.com/later.apk')).toBe(true)
    expect(refusesOneClickInstall('iron-lung-vr', 'https://example.com/game.xdelta')).toBe(true)
    expect(refusesOneClickInstall('iron-lung-vr', 'https://example.com/game.apk')).toBe(false)
  })

  it('copies the Crazy Taxi README install steps and does not invent tools', () => {
    const text = stepText('crazy-taxi-vr')
    const guide = patchOnlyGuideFor('crazy-taxi-vr')
    expect(guide?.readmeUrl).toBe(CRAZY_TAXI_README_URL)
    expect(guide?.steps).toHaveLength(6)
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
    expect(guide?.steps[5].paragraphs.join(' ')).not.toMatch(/\bA button\b/)
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

    expect(page).toContain('<PatchOnlyInstall v-if="patchOnlyGuide" :guide="patchOnlyGuide" />')
    expect(page).toContain('v-else-if="!patchOnlyGuide"')
    expect(page).toContain(':needs-game-files="!isPcBuilderRequired && !isDirectApkOnly && !patchOnlyGuide"')
    const handle = page.slice(page.indexOf('const handleApkInstall'))
    expect(handle.indexOf('refusesOneClickInstall')).toBeGreaterThan(0)
    expect(handle.indexOf('refusesOneClickInstall')).toBeLessThan(handle.indexOf("trackInstall('install_click')"))

    expect(install).toContain('<PatchOnlyInstall v-if="patchGuide" :guide="patchGuide" />')
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