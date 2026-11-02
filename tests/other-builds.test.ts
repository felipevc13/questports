import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { OTHER_BUILDS, otherBuildsFor } from '../app/data/otherBuilds'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { normalizeAnalyticsBody } from '../app/lib/analytics'

describe('other builds of the same game', () => {
  it('lists Shipwright-VR under Ocarina of Time VR only', () => {
    expect(otherBuildsFor('ocarina-of-time-vr').map(b => b.id)).toEqual(['shipwright-vr-quest'])
    expect(otherBuildsFor('rtcwquest')).toEqual([])
    expect(otherBuildsFor(null)).toEqual([])
  })

  it('keeps every build a fixed release APK with its own package', () => {
    for (const [slug, builds] of Object.entries(OTHER_BUILDS)) {
      const main = PORT_PACKAGE_CONFIGS[slug]
      for (const build of builds) {
        expect(build.id, slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        expect(build.apkUrl, build.id).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+\/releases\/download\/[^/]+\/[^/]+\.apk$/)
        expect(build.apkUrl, build.id).not.toContain('/releases/latest')
        expect(build.releasedOn, build.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(build.packageName, build.id).not.toBe(main?.packageName)
        expect(main?.altPackages ?? [], build.id).not.toContain(build.packageName)
        expect(build.steps.length, build.id).toBeGreaterThan(0)
      }
    }
  })

  it('never gives an alternative its own catalog card', () => {
    const catalogSlugs = new Set(INITIAL_PORTS.map(p => p.slug))
    for (const builds of Object.values(OTHER_BUILDS)) {
      for (const build of builds) expect(catalogSlugs.has(build.id), build.id).toBe(false)
    }
  })

  it('records which other build was downloaded', () => {
    const base = { event: 'manual_download_click', path: '/ports/ocarina-of-time-vr', portSlug: 'ocarina-of-time-vr' }
    expect(normalizeAnalyticsBody({ ...base, props: { build: 'shipwright-vr-quest' } })?.props).toEqual({ build: 'shipwright-vr-quest' })
    expect(normalizeAnalyticsBody(base)?.props).toBeNull()
    expect(normalizeAnalyticsBody({ ...base, props: { build: 'Not A Slug!' } })?.props).toBeNull()
  })

  it('renders the section on the port page and tracks the download', () => {
    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    expect(page).toContain('<OtherBuilds :builds="otherBuilds" @download="trackOtherBuildDownload" />')
    expect(page).toContain("track('manual_download_click', { ...trackContext(), props: { build: buildId } })")
    const component = readFileSync(new URL('../app/components/OtherBuilds.vue', import.meta.url), 'utf8')
    expect(component).toContain('Other builds of this game')
    expect(component).toContain("@click=\"$emit('download', build.id)\"")
  })

  it('moves oot-vr to v0.9.6-beta and keeps the guide in step', () => {
    const sql = readFileSync(new URL('../supabase/migrations/20261102160000_ocarina_oot_vr_096.sql', import.meta.url), 'utf8')
    expect(sql).toContain("latest_version = 'v0.9.6-beta'")
    expect(sql).toContain('/releases/download/v0.9.6-beta/oot-vr-v0.9.6-beta.apk')
    expect(sql).toContain("'v0.9.4-beta (October 26, 2026)', 'v0.9.6-beta (October 29, 2026)'")
    expect(sql).toContain("'oot-vr-v0.9.4-beta.apk', 'oot-vr-v0.9.6-beta.apk'")
    expect(sql).toContain("'releases/tag/v0.9.4-beta', 'releases/tag/v0.9.6-beta'")
    expect(sql).toContain("installation_guide like '%v0.9.4-beta%'")
    expect(PORT_PACKAGE_CONFIGS['ocarina-of-time-vr']?.packageName).toBe('org.oot.vr')
  })
})
