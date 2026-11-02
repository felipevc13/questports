import { describe, expect, it } from 'vitest'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import {
  applyDownloadRule,
  assetNameKey,
  buildSyncTargets,
  classifyDownloadUrl,
  downloadCheckNeeded,
  expectedPackages,
  guideMentionsVersion,
  inferTagPrefix,
  parseGithubRepo,
  pickSyncAsset,
  releasesForTarget,
  tagMatchesPrefix
} from '../scripts/lib/portSyncTargets.js'
import { planPortUpdate, portSyncPatch } from '../scripts/lib/selectQuestRelease.js'

const GH = 'https://github.com'

function release(tag: string, assets: string[], extra: Record<string, unknown> = {}) {
  return {
    tag_name: tag,
    draft: false,
    prerelease: false,
    published_at: '2026-10-01T00:00:00Z',
    assets: assets.map(name => ({ name, browser_download_url: `${GH}/o/r/releases/download/${tag}/${name}` })),
    ...extra
  }
}

const port0rRows = [
  { slug: 'daytona-usa-vr', latest_version: 'daytona-v0.1.8', github_url: `${GH}/jacquesdupontd/port0r`, port_download_url: `${GH}/jacquesdupontd/port0r/releases/download/daytona-v0.1.8/Port0r-DaytonaUSAVR-v0.1.8-quest3.apk` },
  { slug: 'hotd-vr', latest_version: 'hotd-v0.1.2', github_url: `${GH}/jacquesdupontd/port0r`, port_download_url: `${GH}/jacquesdupontd/port0r/releases/download/hotd-v0.1.2/Port0r-HouseOfTheDeadVR-v0.1.2-quest3.apk` },
  { slug: 'sega-rally-vr', latest_version: 'v0.2.7', github_url: `${GH}/jacquesdupontd/port0r`, port_download_url: `${GH}/jacquesdupontd/port0r/releases/download/v0.2.7/Port0r-RallyVR-v0.2.7-quest3.apk` }
]

const port0rReleases = [
  release('timecrs2-v0.1.2', ['Port0r-TimeCrisisIIVR-v0.1.2-quest3.apk'], { published_at: '2026-10-28T23:20:18Z' }),
  release('scud-android-v0.1.0', ['Port0r-ScudRace-Android-v0.1.0.apk'], { published_at: '2026-10-30T22:17:59Z' }),
  release('daytona-v0.2.0', ['Port0r-DaytonaUSAVR-v0.2.0-quest3.apk'], { published_at: '2026-10-30T22:18:33Z' }),
  release('daytona-android-v0.1.0', ['Port0r-DaytonaUSA-Android-v0.1.0.apk'], { published_at: '2026-10-27T15:50:57Z' }),
  release('v0.2.7', ['Port0r-RallyVR-v0.2.7-quest3.apk'], { published_at: '2026-10-26T22:46:20Z' }),
  release('android-v0.1.2', ['Port0r-SegaRally-Android-v0.1.2.apk'], { published_at: '2026-10-27T18:14:20Z' }),
  release('hotd-v0.1.2', ['Port0r-HouseOfTheDeadVR-v0.1.2-quest3.apk'], { published_at: '2026-10-26T23:14:42Z' })
]

describe('repo list from the catalog', () => {
  it('parses owner/repo from github_url and ignores other hosts', () => {
    expect(parseGithubRepo(`${GH}/alex-nax/relith`)).toBe('alex-nax/relith')
    expect(parseGithubRepo(`${GH}/owner/repo.git`)).toBe('owner/repo')
    expect(parseGithubRepo(`${GH}/owner/repo/releases/latest`)).toBe('owner/repo')
    expect(parseGithubRepo('https://jackaapacka.itch.io/iron-lung-vr')).toBeNull()
    expect(parseGithubRepo('https://ut99vr.pages.dev')).toBeNull()
    expect(parseGithubRepo(null)).toBeNull()
  })

  it('syncs every row with a GitHub repo and lists the rest as not synced', () => {
    const { targets, skipped } = buildSyncTargets([
      { slug: 'nolf-vr', latest_version: 'v0.4.0', github_url: `${GH}/alex-nax/relith`, port_download_url: `${GH}/alex-nax/relith/releases/download/v0.4.0/relith-nolf-quest-0.4.0.apk` },
      { slug: 'iron-lung-vr', latest_version: 'v1.2.0', github_url: 'https://jackaapacka.itch.io/iron-lung-vr', port_download_url: null },
      { slug: 'max-payne-vr', latest_version: 'v0.9.1', github_url: null, port_download_url: null }
    ])
    expect(targets.map(target => [target.slug, target.repo, target.sharedRepo])).toEqual([['nolf-vr', 'alex-nax/relith', false]])
    expect(skipped).toEqual([
      { slug: 'iron-lung-vr', reason: 'github_url is not a GitHub repo' },
      { slug: 'max-payne-vr', reason: 'no github_url' }
    ])
  })

  it('applies overrides for repo, tag prefix and skip', () => {
    const { targets, skipped } = buildSyncTargets(
      [
        { slug: 'a', latest_version: 'v1.0', github_url: `${GH}/upstream/a`, port_download_url: null },
        { slug: 'b', latest_version: 'v1.0', github_url: `${GH}/o/b`, port_download_url: null }
      ],
      { a: { repo: 'fork/a', tagPrefix: 'quest-' }, b: { skip: 'manual releases' } }
    )
    expect(targets).toHaveLength(1)
    expect(targets[0]).toMatchObject({ slug: 'a', repo: 'fork/a', tagPrefix: 'quest-' })
    expect(skipped).toEqual([{ slug: 'b', reason: 'manual releases' }])
  })

  it('marks a repo shared by several ports and reads each prefix from the pinned tag', () => {
    const { targets } = buildSyncTargets(port0rRows)
    expect(targets.map(target => [target.slug, target.tagPrefix, target.sharedRepo])).toEqual([
      ['daytona-usa-vr', 'daytona-', true],
      ['hotd-vr', 'hotd-', true],
      ['sega-rally-vr', '', true]
    ])
  })

  it('classifies download URLs', () => {
    const repo = 'o/r'
    expect(classifyDownloadUrl(`${GH}/o/r/releases/download/v1.0/game.apk`, repo)).toEqual({ kind: 'pinned', tag: 'v1.0', asset: 'game.apk' })
    expect(classifyDownloadUrl(`${GH}/o/r/releases/tag/v1.0`, repo)).toEqual({ kind: 'pinned', tag: 'v1.0', asset: null })
    expect(classifyDownloadUrl(`${GH}/o/r/releases/latest`, repo)).toEqual({ kind: 'dynamic' })
    expect(classifyDownloadUrl(`${GH}/o/r/releases/latest/download/game.apk`, repo)).toEqual({ kind: 'dynamic' })
    expect(classifyDownloadUrl(`${GH}/o/r/releases`, repo)).toEqual({ kind: 'dynamic' })
    expect(classifyDownloadUrl(`${GH}/o/r`, repo)).toEqual({ kind: 'dynamic' })
    expect(classifyDownloadUrl(`${GH}/o/r/blob/master/README.txt`, repo)).toEqual({ kind: 'external' })
    expect(classifyDownloadUrl(`${GH}/other/r/releases/latest`, repo)).toEqual({ kind: 'external' })
    expect(classifyDownloadUrl('https://www.ppsspp.org/files/1_20_4/ppsspp_vr.apk', repo)).toEqual({ kind: 'external' })
  })
})

describe('tag prefix filtering', () => {
  it('infers the prefix before the version', () => {
    expect(inferTagPrefix('daytona-v0.1.8')).toBe('daytona-')
    expect(inferTagPrefix('dirtdash-v0.1.4')).toBe('dirtdash-')
    expect(inferTagPrefix('timecrs2-v0.1.1')).toBe('timecrs2-')
    expect(inferTagPrefix('vr-v0.2.1')).toBe('vr-')
    expect(inferTagPrefix('unbound-0.14')).toBe('unbound-')
    expect(inferTagPrefix('v0.2.7')).toBe('')
    expect(inferTagPrefix('b003')).toBe('')
    expect(inferTagPrefix('n64')).toBe('')
  })

  it('matches only the port prefix followed by a version', () => {
    expect(tagMatchesPrefix('daytona-v0.2.0', 'daytona-', true)).toBe(true)
    expect(tagMatchesPrefix('daytona-android-v0.1.0', 'daytona-', true)).toBe(false)
    expect(tagMatchesPrefix('hotd-v0.1.2', 'daytona-', true)).toBe(false)
    expect(tagMatchesPrefix('v0.2.7', '', true)).toBe(true)
    expect(tagMatchesPrefix('android-v0.1.2', '', true)).toBe(false)
    expect(tagMatchesPrefix('pico-test', '', false)).toBe(true)
  })

  it('does not cross-update games in one repo', () => {
    const { targets } = buildSyncTargets(port0rRows)
    const plans = Object.fromEntries(targets.map(target => {
      const { releases } = releasesForTarget(target, port0rReleases)
      return [target.slug, planPortUpdate(port0rRows.find(row => row.slug === target.slug)!.latest_version, releases)]
    }))
    expect(plans['daytona-usa-vr']).toMatchObject({ action: 'update', latest_version: 'daytona-v0.2.0' })
    expect(plans['hotd-vr']).toMatchObject({ action: 'keep', selectedTag: 'hotd-v0.1.2' })
    expect(plans['sega-rally-vr']).toMatchObject({ action: 'keep', selectedTag: 'v0.2.7' })
  })

  it('separates games that share one tag by asset name', () => {
    const rows = [
      { slug: 'ghost-squad-evolution-vr', latest_version: 'v0.2.0', github_url: `${GH}/lialan/lindbergh-recomp-ports`, port_download_url: `${GH}/lialan/lindbergh-recomp-ports/releases/download/v0.2.0/GhostSquadEvolutionVR-v0.2.0-quest3.apk` },
      { slug: 'hotd4-vr', latest_version: 'v0.2.0', github_url: `${GH}/lialan/lindbergh-recomp-ports`, port_download_url: `${GH}/lialan/lindbergh-recomp-ports/releases/download/v0.2.0/HouseOfTheDead4VR-v0.2.0-quest3.apk` }
    ]
    const releases = [
      release('v0.2.7', ['GhostSquadEvolutionVR-v0.2.7-quest3.apk', 'HouseOfTheDead4SpecialVR-v0.2.7-quest3.apk', 'HouseOfTheDead4VR-v0.2.7-quest3.apk']),
      release('v0.2.0', ['GhostSquadEvolutionVR-v0.2.0-quest3.apk', 'HouseOfTheDead4VR-v0.2.0-quest3.apk']),
      release('v0.1.1', ['GhostSquadEvolutionVR-v0.1.1-quest3.apk'])
    ]
    const { targets } = buildSyncTargets(rows)
    const hotd4 = targets.find(target => target.slug === 'hotd4-vr')!
    const filtered = releasesForTarget(hotd4, releases)
    expect(filtered.releases.map(item => item.tag_name)).toEqual(['v0.2.7', 'v0.2.0'])
    expect(filtered.otherGame).toEqual([{ tag: 'v0.1.1', reason: 'no asset for this game' }])
    expect(pickSyncAsset(releases[0], 'HouseOfTheDead4VR-v0.2.0-quest3.apk', { sharedRepo: true })?.name).toBe('HouseOfTheDead4VR-v0.2.7-quest3.apk')
    expect(pickSyncAsset(releases[2], 'HouseOfTheDead4VR-v0.2.0-quest3.apk', { sharedRepo: true })).toBeNull()
  })
})

describe('asset choice', () => {
  it('keys asset names without their version numbers', () => {
    expect(assetNameKey('WakerQuest-1.0.7.apk')).toBe(assetNameKey('WakerQuest-1.1.1.apk'))
    expect(assetNameKey('QuestStrikers-alpha1.13.apk')).toBe(assetNameKey('QuestStrikers-alpha1.16.apk'))
    expect(assetNameKey('HouseOfTheDead4VR-v0.2.7-quest3.apk')).not.toBe(assetNameKey('HouseOfTheDead4SpecialVR-v0.2.7-quest3.apk'))
  })

  it('keeps the Quest asset when a release also ships Android and desktop builds', () => {
    const gt3 = release('v0.6.0', ['gt3r-android.apk', 'gt3r-linux-x86_64.tar.gz', 'gt3r-quest.apk', 'gt3r-windows-x64.zip'])
    expect(pickSyncAsset(gt3, 'gt3r-quest.apk', { sharedRepo: false })).toMatchObject({ name: 'gt3r-quest.apk', match: 'same name' })
  })

  it('falls back to the best scored Quest build of the same file type in a single-game repo', () => {
    const renamed = release('v2.0', ['Game-Android.apk', 'Game-Quest-2.0.apk', 'Game-Windows.zip'])
    expect(pickSyncAsset(renamed, 'game_v1.apk', { sharedRepo: false })).toMatchObject({ name: 'Game-Quest-2.0.apk', match: 'scored' })
    expect(pickSyncAsset(renamed, 'game_v1.apk', { sharedRepo: true })).toBeNull()
    expect(pickSyncAsset(release('v2.0', ['Game-Windows.zip']), 'Game-Quest.zip', { sharedRepo: false })).toBeNull()
  })

  it('reads the expected packages from PORT_PACKAGE_CONFIGS', () => {
    const config = PORT_PACKAGE_CONFIGS['gran-turismo-3-vr']
    expect(expectedPackages(config)).toContain(config.packageName)
    expect(expectedPackages({ packageName: 'a.b', altPackages: ['c.d'] })).toEqual(['a.b', 'c.d'])
    expect(expectedPackages(undefined)).toEqual([])
  })
})

describe('version and download URL stay consistent', () => {
  const pinnedTarget = (tag: string, asset: string) => ({
    slug: 'wakerquest',
    repo: 'Trastorillo/wakerquest',
    tagPrefix: '',
    sharedRepo: false,
    download: { kind: 'pinned' as const, tag, asset }
  })
  const waker = [
    release('v1.1.1', ['WakerQuest-1.1.1.apk'], { published_at: '2026-11-01T20:49:35Z' }),
    release('v1.0.7', ['WakerQuest-1.0.7.apk'], { published_at: '2026-10-26T01:19:49Z' })
  ]

  it('moves version and URL together when the package checks out', () => {
    const target = pinnedTarget('v1.0.7', 'WakerQuest-1.0.7.apk')
    const plan = planPortUpdate('v1.0.7', waker)
    expect(downloadCheckNeeded(plan, target)).toBe('asset')
    const asset = pickSyncAsset(waker[0], 'WakerQuest-1.0.7.apk', { sharedRepo: false })
    const final = applyDownloadRule(plan, target, { asset, packageCheck: { ok: true, detail: 'io.github.wakerquest' } })
    expect(portSyncPatch(final, '2026-10-26T01:19:49Z')).toEqual({
      latest_version: 'v1.1.1',
      port_download_url: `${GH}/o/r/releases/download/v1.1.1/WakerQuest-1.1.1.apk`,
      last_github_update: '2026-11-01T20:49:35Z'
    })
  })

  it('does not bump the version when the package differs', () => {
    const plan = planPortUpdate('v1.0.7', waker)
    const asset = pickSyncAsset(waker[0], 'WakerQuest-1.0.7.apk', { sharedRepo: false })
    const final = applyDownloadRule(plan, pinnedTarget('v1.0.7', 'WakerQuest-1.0.7.apk'), {
      asset,
      packageCheck: { ok: false, detail: 'com.other, expected io.github.wakerquest (portPackageMap)' }
    })
    expect(final).toMatchObject({ action: 'blocked', latest_version: 'v1.0.7', wanted_version: 'v1.1.1' })
    expect(portSyncPatch(final, '2026-10-26T01:19:49Z')).toEqual({})
  })

  it('does not bump the version when the new release has no matching asset', () => {
    const plan = planPortUpdate('v1.0.7', waker)
    const final = applyDownloadRule(plan, pinnedTarget('v1.0.7', 'WakerQuest-1.0.7.apk'), { asset: null })
    expect(final.action).toBe('blocked')
    expect(final.reason).toBe('no matching Quest asset in v1.1.1')
    expect(portSyncPatch(final, null)).toEqual({})
  })

  it('bumps only the version for a URL that follows the latest release', () => {
    const plan = planPortUpdate('v1.0.7', waker)
    const target = { ...pinnedTarget('', ''), download: { kind: 'dynamic' as const } }
    expect(downloadCheckNeeded(plan, target)).toBe('none')
    expect(portSyncPatch(applyDownloadRule(plan, target), null)).toEqual({
      latest_version: 'v1.1.1',
      last_github_update: '2026-11-01T20:49:35Z'
    })
  })

  it('does not bump the version when the download lives somewhere else', () => {
    const plan = planPortUpdate('v1.20.4', [release('v1.21.0', ['ppsspp_vr.apk'])])
    const target = { ...pinnedTarget('', ''), download: { kind: 'external' as const } }
    expect(downloadCheckNeeded(plan, target)).toBe('blocked')
    const final = applyDownloadRule(plan, target)
    expect(final).toMatchObject({ action: 'blocked', latest_version: 'v1.20.4' })
    expect(portSyncPatch(final, null)).toEqual({})
  })

  it('aligns a pinned URL that is behind an already listed version', () => {
    const goldeneye = [release('v0.5.14', ['GoldenEye-VR-v0.5.14.apk'])]
    const target = pinnedTarget('v0.5.13', 'GoldenEye-VR-v0.5.13.apk')
    const plan = planPortUpdate('v0.5.14', goldeneye)
    expect(plan).toMatchObject({ action: 'keep', reason: 'same version' })
    expect(downloadCheckNeeded(plan, target)).toBe('asset')
    const asset = pickSyncAsset(goldeneye[0], 'GoldenEye-VR-v0.5.13.apk', { sharedRepo: false })
    const final = applyDownloadRule(plan, target, { asset, packageCheck: { ok: true, detail: 'com.gevr.port' } })
    expect(final).toMatchObject({ action: 'update', alignOnly: true, reason: 'align download with listed version' })
    expect(portSyncPatch(final, '2026-10-01T00:00:00Z')).toEqual({
      port_download_url: `${GH}/o/r/releases/download/v0.5.14/GoldenEye-VR-v0.5.14.apk`
    })
  })

  it('needs no asset check when the pinned tag already is the selected one', () => {
    const plan = planPortUpdate('6.0.0', [release('6.0.0', ['QCXR-6.0.0.apk'])])
    expect(plan.reason).toBe('canonicalize')
    expect(downloadCheckNeeded(plan, pinnedTarget('6.0.0', 'QCXR-6.0.0.apk'))).toBe('none')
  })
})

describe('guide version warning', () => {
  it('finds the old version in the guide, with or without a v', () => {
    expect(guideMentionsVersion('Download WakerQuest-1.0.7.apk from GitHub.', 'v1.0.7')).toBe(true)
    expect(guideMentionsVersion('Install v1.0.7 first.', 'v1.0.7')).toBe(true)
    expect(guideMentionsVersion('Install v1.0.70 first.', 'v1.0.7')).toBe(false)
    expect(guideMentionsVersion('Install 11.0.7 first.', 'v1.0.7')).toBe(false)
    expect(guideMentionsVersion('Install 1.0.7.1 first.', 'v1.0.7')).toBe(false)
    expect(guideMentionsVersion('Grab the latest release.', 'v1.0.7')).toBe(false)
    expect(guideMentionsVersion(null, 'v1.0.7')).toBe(false)
  })
})
