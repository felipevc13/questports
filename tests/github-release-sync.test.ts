import { describe, expect, it } from 'vitest'
import { formatPortVersion } from '../app/lib/portVersion'
import { planPortUpdate, selectQuestRelease, shouldAdoptCatalogVersion, versionToWrite } from '../scripts/lib/selectQuestRelease.js'

function release(tag: string, assets: string[], extra: Record<string, unknown> = {}) {
  return {
    tag_name: tag,
    draft: false,
    prerelease: false,
    published_at: '2026-10-01T00:00:00Z',
    assets: assets.map(name => ({ name })),
    ...extra
  }
}

const primedGunReleases = [
  release('v1.1.7-windows', ['PrimedGun.v1.1.7.zip'], { published_at: '2026-10-05T08:01:03Z' }),
  release('v1.1.7', ['primedgun-quest-release.apk'], { published_at: '2026-10-02T14:25:35Z' }),
  release('v1.1.6', ['PrimedGun.v1.1.6.zip'], { published_at: '2026-09-10T11:51:06Z' })
]

const carnageReleases = [
  release('b004', ['PCVRCarnage.zip'], { published_at: '2026-09-24T22:13:18Z' }),
  release('b003', ['QuestCarnage-Meta-Quest-release.apk'], { published_at: '2026-09-17T20:30:08Z' }),
  release('b001', ['PCVRCarnage-Windows-x64-release.zip', 'QuestCarnage-Meta-Quest-release.apk'], { published_at: '2026-09-15T19:22:27Z' })
]

describe('quest release selection', () => {
  it('keeps PrimedGun on the quest apk and skips the newer windows tag', () => {
    const plan = planPortUpdate('v1.1.7', primedGunReleases)
    expect(plan.selectedTag).toBe('v1.1.7')
    expect(plan.action).toBe('keep')
    expect(plan.reason).toBe('same version')
    expect(versionToWrite(plan)).toBeUndefined()
    expect(plan.skipped.map(item => item.tag)).toContain('v1.1.7-windows')
    expect(shouldAdoptCatalogVersion('v1.1.7', 'v1.1.7-windows')).toMatchObject({
      adopt: false,
      reason: 'desktop tag is worse'
    })
  })

  it('replaces a stored windows tag with the quest build of the same number', () => {
    const plan = planPortUpdate('v1.1.7-windows', primedGunReleases)
    expect(plan.action).toBe('update')
    expect(plan.latest_version).toBe('v1.1.7')
    expect(plan.reason).toBe('replace desktop tag with quest build')
  })

  it('keeps QuestCarNage on b003 when the newer release is PC-only', () => {
    const plan = planPortUpdate('b003', carnageReleases)
    expect(plan.selectedTag).toBe('b003')
    expect(plan.action).toBe('keep')
    expect(formatPortVersion(plan.latest_version)).toBe('b003')
    expect(plan.skipped.map(item => item.tag)).toEqual(expect.arrayContaining(['b004']))
    expect(versionToWrite(plan)).toBeUndefined()
  })

  it('accepts Serious Sam b004 because that release ships an apk', () => {
    const plan = planPortUpdate('b003', [
      release('b004', ['questsam.apk'], { published_at: '2026-09-20T16:39:29Z' }),
      release('b003', ['questsam.apk'], { published_at: '2026-09-12T20:41:26Z' })
    ])
    expect(plan.action).toBe('update')
    expect(plan.latest_version).toBe('b004')
    expect(plan.latest_version?.startsWith('v')).toBe(false)
  })

  it('does not write Latest when a repo has no releases', () => {
    for (const current of ['Latest', null, 'v1.0.16']) {
      const plan = planPortUpdate(current, [])
      expect(plan.action).toBe('leave')
      expect(plan.latest_version).toBe(current)
      expect(versionToWrite(plan)).toBeUndefined()
    }
  })

  it('does not turn a Latest tag into a stored version, even if an apk is attached', () => {
    const plan = planPortUpdate('v0.5.6', [
      release('Latest', ['game.apk'], { published_at: '2026-10-08T00:00:00Z' })
    ])
    expect(plan.action).toBe('leave')
    expect(versionToWrite(plan)).toBeUndefined()
    expect(plan.latest_version).toBe('v0.5.6')
  })

  it('replaces a placeholder once a real quest release exists', () => {
    const plan = planPortUpdate('Latest', [
      release('v0.5.6', ['vicecity-quest.apk'])
    ])
    expect(plan.action).toBe('update')
    expect(versionToWrite(plan)).toBe('v0.5.6')
  })

  it('adopts a newer quest apk and refuses an older one', () => {
    const halo = [
      release('v1.0.18', ['HaloCE-Quest-1.0.18.apk', 'HaloCE-Android-1.0.18.apk'], { published_at: '2026-10-08T21:39:44Z' }),
      release('v1.0.16', ['HaloCE-Quest-1.0.16.apk'], { published_at: '2026-10-08T02:13:04Z' })
    ]
    expect(planPortUpdate('v1.0.16', halo)).toMatchObject({
      action: 'update',
      latest_version: 'v1.0.18',
      reason: 'newer quest release'
    })
    expect(planPortUpdate('v1.0.18', [halo[1]])).toMatchObject({
      action: 'keep',
      reason: 'candidate is older',
      latest_version: 'v1.0.18'
    })
  })

  it('ignores drafts and prefers a stable release over a newer prerelease', () => {
    const selected = selectQuestRelease([
      release('v2.0.0-rc1', ['game.apk'], { prerelease: true, published_at: '2026-10-08T00:00:00Z' }),
      release('v1.9.0', ['game.apk'], { draft: true, published_at: '2026-10-07T00:00:00Z' }),
      release('v1.8.0', ['game.apk'], { published_at: '2026-09-01T00:00:00Z' })
    ])
    expect(selected.release?.tag_name).toBe('v1.8.0')
    expect(selected.prereleaseOnly).toBe(false)
    expect(selected.skipped.map(item => item.tag)).toContain('v1.9.0')
  })

  it('uses a prerelease when that is the only quest channel', () => {
    const plan = planPortUpdate(null, [
      release('v0.9.0-alpha', ['quest-build.apk'], { prerelease: true, published_at: '2026-10-02T00:00:00Z' }),
      release('v1.0.0-windows', ['Game-windows-x64.zip'], { published_at: '2026-10-03T00:00:00Z' })
    ])
    expect(plan.action).toBe('update')
    expect(plan.prereleaseOnly).toBe(true)
    expect(plan.latest_version).toBe('v0.9.0-alpha')
  })

  it('does not treat a windows-only emulator release as a quest build', () => {
    const plan = planPortUpdate('v1.20.4', [
      release('v1.21.0', ['PPSSPP-v1.21.0-Windows-x64.zip', 'PPSSPPSDL-macOS-v1.21.0.zip'], { published_at: '2026-10-01T00:00:00Z' })
    ])
    expect(plan.action).toBe('leave')
    expect(plan.latest_version).toBe('v1.20.4')
    expect(versionToWrite(plan)).toBeUndefined()
  })

  it('canonicalizes a bare semver without treating it as a downgrade', () => {
    const plan = planPortUpdate('6.0.0', [
      release('6.0.0', ['QCXR-6.0.0.apk'])
    ])
    expect(plan.action).toBe('update')
    expect(plan.reason).toBe('canonicalize')
    expect(versionToWrite(plan)).toBe('v6.0.0')
  })

  it('keeps the Winlator codename and does not prefix it', () => {
    const plan = planPortUpdate('cats27', [
      release('winlatorxr_cats27', ['WinlatorXR-cats-27.apk'])
    ])
    expect(formatPortVersion('winlatorxr_cats27')).toBe('cats27')
    expect(plan.action).toBe('keep')
    expect(plan.reason).toBe('same version')
  })
})
