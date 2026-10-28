import { describe, expect, it } from 'vitest'
import { absoluteCoverUrl, coverThumbUrl, DEFAULT_MEDIA_BASE, resolveCoverUrl, versionedCoverUrl } from '../app/data/coverUrl'

describe('resolveCoverUrl', () => {
  it('maps Supabase Storage covers onto /covers', () => {
    expect(resolveCoverUrl(
      'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/nolf-vr.png?t=123'
    )).toBe('/covers/nolf-vr.png')
  })

  it.each([
    ['https://cdn2.steamgriddb.com/file/sgdb-cdn/grid/7adb6a50e7687b45a00b35796f18f17d.png', '/covers/ut99vr.png'],
    ['https://cdn2.steamgriddb.com/grid/efa57a13caff2c0bef9bb12e2e734d31.png', '/covers/sclerosis-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/5a3560a50c0cde4c41fc6e5bd431c1b4.png', '/covers/sega-rally-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/7dab099bfda35ad14715763b75487b47.png', '/covers/starfox-enhanced-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/67b1f8c9fe38416ca4971598d0edac57.png', '/covers/unreal-gold-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/26fed7a27154ecf97dc1a617e8813926.jpg', '/covers/homeworld-unbound.jpg'],
    ['https://cdn2.steamgriddb.com/grid/3976e8d9470abc7b3aed396293ab346a.png', '/covers/ocarina-of-time-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/c530fbfc90e6b52b488b3d5ab006e9b8.png', '/covers/xrkart-64.png'],
    ['https://cdn2.steamgriddb.com/grid/dc2b690516158a874dd8aabe1365c6a0.png', '/covers/wiicompiled-vr-plus.png'],
    ['https://cdn2.steamgriddb.com/grid/7877afc63a2644aeee47db29ff48412b.jpg', '/covers/magic-carpet-vr.jpg'],
    ['https://cdn2.steamgriddb.com/grid/a073416fbe3a75be1c9dabe1a85176ca.png', '/covers/twilight-princess-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/3258bb70c96330b7eaadc3458bc8f00d.png', '/covers/majoras-mask-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/a6c39c820081dd442cedc35851851de9.png', '/covers/generals-zero-hour-xr.png'],
    ['https://cdn2.steamgriddb.com/grid/933bae66e5dfe59043d3d2cbbe9c7fc3.png', '/covers/generals-zero-hour-xr.png'],
    ['https://cdn2.steamgriddb.com/grid/fe895c991a5152476a051ae74fcbf8ac.png', '/covers/sm64-coop-dx-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/317799a8c9027ed5e9cbb1deb38238d9.jpg', '/covers/f-zero-x-vr.jpg'],
    ['https://cdn2.steamgriddb.com/grid/bb6db65a8d0f04a0f9a0a8e708da18d2.png', '/covers/quake3quest.png'],
    ['https://cdn2.steamgriddb.com/grid/a885e2694d4d70bb6e531289081bcb7e.jpg', '/covers/descent-3-vr.jpg'],
    ['https://cdn2.steamgriddb.com/grid/06524331e2c63c0ed3479bf1be85ce3b.png', '/covers/hotd2-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/bfd6bb38a2386fbab71d56ecdb552b42.png', '/covers/time-crisis-2-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/1e33d42f52a9ebdd703844cffcf6601c.png', '/covers/dolphinxr.png'],
    ['https://cdn.sidequestvr.com/file/297897/gameplay-caratula.png', '/covers/age-of-joy.png'],
    ['https://cdn2.steamgriddb.com/grid/124a20f62d7b7205775f80b3ecc33645.jpg', '/covers/victory-heat-rally-vr.jpg'],
    ['https://cdn2.steamgriddb.com/grid/c0f7d67709012b1ed26535611c19244c.png', '/covers/wipeout-rewrite-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/158bcb6565a65410463e9685796db61c.png', '/covers/opencmr2-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/398436f82bedf94ca19fa91217a19eee.png', '/covers/virtua-cop-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/28b3db07c0f11d876d811a301a18edb6.jpg', '/covers/strikers-quest-mr.jpg'],
    ['https://cdn2.steamgriddb.com/grid/99bcfcd754a98ce89cb86f73acc04645.png', '/covers/crazy-taxi-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/c1b8641fc22cf4122bef14bd95a331db.png', '/covers/red-dead-redemption-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/e8f3e46d6d09f9b4ab31ab13ad69b841.png', '/covers/hotd-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/6ba927e95e97f5564105147a9d188931.png', '/covers/crisis-zone-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/4ea29595c25ccf7a33d3fdec75630d5a.png', '/covers/nfsu-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/39d9ed17e9496bdabfdc1d0a6d89c38d.png', '/covers/nfsu2-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/5778a79540b9f459a7f2aff2a548eb54.png', '/covers/rave-racer-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/20f40268fabfdc203f448dc64261a920.jpg', '/covers/openxwa-vr.jpg'],
    ['https://cdn2.steamgriddb.com/grid/1bde14bdd1783d7dae116f6f46919031.png', '/covers/wave-race-64-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/6b382385774e24a67d7484042813b849.png', '/covers/confidential-mission-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/5087e1134c3d46eca4f6b87a3b70b081.png', '/covers/ninja-assault-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/79f00facc8cfccd2487a5c2d33e250e3.png', '/covers/death-crimson-ox-vr.png'],
    ['https://cdn2.steamgriddb.com/grid/99ae5d502b16e1ee613a7036e556e3af.png', '/covers/survivor2-code-veronica-vr.png']
  ])('maps %s onto %s', (url, local) => {
    expect(resolveCoverUrl(url)).toBe(local)
  })

  it('maps absolute media-host covers onto /covers', () => {
    expect(resolveCoverUrl(`${DEFAULT_MEDIA_BASE}/covers/avp_vr.jpg`)).toBe('/covers/avp_vr.jpg')
    expect(resolveCoverUrl(`${DEFAULT_MEDIA_BASE}/covers/nolf-vr.png?t=1`)).toBe('/covers/nolf-vr.png')
  })

  it('leaves same-origin covers unchanged', () => {
    expect(resolveCoverUrl('/covers/rtcwquest.jpg')).toBe('/covers/rtcwquest.jpg')
  })
})

describe('coverThumbUrl', () => {
  it('points local covers at a small generated thumbnail', () => {
    expect(coverThumbUrl('/covers/doom3quest.jpg')).toBe('/covers/thumbs/doom3quest.jpg?v=5')
    expect(coverThumbUrl('/covers/halocequest.jpg')).toBe('/covers/thumbs/halocequest.jpg?v=5')
  })

  it('versions covers and can load them from an external media base', () => {
    expect(versionedCoverUrl('/covers/nolf-vr.png')).toBe('/covers/nolf-vr.png?v=5')
    expect(versionedCoverUrl(
      'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/nolf-vr.png'
    )).toBe('/covers/nolf-vr.png?v=5')
    expect(versionedCoverUrl('/covers/nolf-vr.png', 'https://cdn.example.com/')).toBe(
      'https://cdn.example.com/covers/nolf-vr.png?v=5'
    )
    expect(coverThumbUrl('/covers/doom3quest.jpg', 'https://cdn.example.com')).toBe(
      'https://cdn.example.com/covers/thumbs/doom3quest.jpg?v=5'
    )
  })

  it('keeps absolute media-host covers versioned without double-prefixing', () => {
    const db = `${DEFAULT_MEDIA_BASE}/covers/doom3quest.jpg`
    expect(versionedCoverUrl(db, DEFAULT_MEDIA_BASE)).toBe(`${DEFAULT_MEDIA_BASE}/covers/doom3quest.jpg?v=5`)
    expect(versionedCoverUrl(db)).toBe('/covers/doom3quest.jpg?v=5')
    expect(coverThumbUrl(db, DEFAULT_MEDIA_BASE)).toBe(`${DEFAULT_MEDIA_BASE}/covers/thumbs/doom3quest.jpg?v=5`)
    expect(absoluteCoverUrl(db)).toBe('https://questports.vercel.app/covers/doom3quest.jpg?v=5')
    // A value that already went through versionedCoverUrl stays stable.
    const once = versionedCoverUrl(db, DEFAULT_MEDIA_BASE)
    expect(versionedCoverUrl(once, DEFAULT_MEDIA_BASE)).toBe(once)
  })

  it('requests a small Unsplash crop for hotlinked photos', () => {
    const thumb = coverThumbUrl('https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1200&q=80')
    expect(thumb).toContain('w=120')
    expect(thumb).toContain('h=72')
  })
})

describe('absoluteCoverUrl', () => {
  it('prefixes local covers for Open Graph', () => {
    expect(absoluteCoverUrl('/covers/nolf-vr.png')).toBe(
      'https://questports.vercel.app/covers/nolf-vr.png?v=5'
    )
  })

  it('keeps Open Graph covers on the site even when the file is on the media host', () => {
    expect(absoluteCoverUrl(`${DEFAULT_MEDIA_BASE}/covers/nolf-vr.png?v=9`)).toBe(
      'https://questports.vercel.app/covers/nolf-vr.png?v=5'
    )
  })

  it('falls back to the cache-busted site card', () => {
    expect(absoluteCoverUrl(null)).toBe(
      'https://questports.vercel.app/covers/questports-og.png?v=5'
    )
  })
})
