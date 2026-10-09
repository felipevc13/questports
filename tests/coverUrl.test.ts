import { describe, expect, it } from 'vitest'
import { absoluteCoverUrl, resolveCoverUrl } from '../app/data/coverUrl'

describe('resolveCoverUrl', () => {
  it('maps Supabase Storage covers onto /covers', () => {
    expect(resolveCoverUrl(
      'https://ccjteoxolasldhfgnoyx.supabase.co/storage/v1/object/public/port-covers/nolf-vr.png?t=123'
    )).toBe('/covers/nolf-vr.png')
  })

  it('maps the UT99 SteamGridDB hotlink onto the local file', () => {
    expect(resolveCoverUrl(
      'https://cdn2.steamgriddb.com/file/sgdb-cdn/grid/7adb6a50e7687b45a00b35796f18f17d.png'
    )).toBe('/covers/ut99vr.png')
  })

  it('maps the Sclerosis SteamGridDB hotlink onto the local file', () => {
    expect(resolveCoverUrl(
      'https://cdn2.steamgriddb.com/grid/efa57a13caff2c0bef9bb12e2e734d31.png'
    )).toBe('/covers/sclerosis-vr.png')
  })

  it('leaves same-origin covers unchanged', () => {
    expect(resolveCoverUrl('/covers/rtcwquest.jpg')).toBe('/covers/rtcwquest.jpg')
  })
})

describe('absoluteCoverUrl', () => {
  it('prefixes local covers for Open Graph', () => {
    expect(absoluteCoverUrl('/covers/nolf-vr.png')).toBe(
      'https://questports.vercel.app/covers/nolf-vr.png'
    )
  })
})
