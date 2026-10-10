import { describe, expect, it } from 'vitest'
import { absoluteCoverUrl, coverThumbUrl, resolveCoverUrl } from '../app/data/coverUrl'

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
    ['https://cdn2.steamgriddb.com/grid/06524331e2c63c0ed3479bf1be85ce3b.png', '/covers/hotd2-vr.png']
  ])('maps %s onto %s', (url, local) => {
    expect(resolveCoverUrl(url)).toBe(local)
  })

  it('leaves same-origin covers unchanged', () => {
    expect(resolveCoverUrl('/covers/rtcwquest.jpg')).toBe('/covers/rtcwquest.jpg')
  })
})

describe('coverThumbUrl', () => {
  it('points local covers at a small generated thumbnail', () => {
    expect(coverThumbUrl('/covers/doom3quest.jpg')).toBe('/covers/thumbs/doom3quest.jpg')
    expect(coverThumbUrl('/covers/halocequest.jpg')).toBe('/covers/thumbs/halocequest.jpg')
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
      'https://questports.vercel.app/covers/nolf-vr.png'
    )
  })

  it('falls back to the cache-busted site card', () => {
    expect(absoluteCoverUrl(null)).toBe(
      'https://questports.vercel.app/covers/questports-og.png?v=2'
    )
  })
})
