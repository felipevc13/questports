import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { isLegitimateStoreUrl } from '../app/lib/baseGameLink'

const BLOCKED_BUY_HOSTS = [
  'myabandonware.com',
  'vimmslair.com',
  'cdromance.com',
  'emulatorgames.net',
  'wowroms.com',
  'coolrom.com'
]

describe('base game links', () => {
  it('treats storefronts as buy links and references as about links', () => {
    expect(isLegitimateStoreUrl('https://store.steampowered.com/app/70/HalfLife/')).toBe(true)
    expect(isLegitimateStoreUrl('https://www.gog.com/en/game/gothic_2_gold_edition')).toBe(true)
    expect(isLegitimateStoreUrl('https://play.google.com/store/apps/details?id=com.rockstargames.gtasa')).toBe(true)
    expect(isLegitimateStoreUrl('https://store.playstation.com/en-gb/product/EP9000-CUSA12392_00-PLATFORMERVR00EU/')).toBe(true)
    expect(isLegitimateStoreUrl('https://en.wikipedia.org/wiki/Halo:_Combat_Evolved')).toBe(false)
    expect(isLegitimateStoreUrl('https://www.mobygames.com/game/1597/gran-turismo-2/')).toBe(false)
    expect(isLegitimateStoreUrl('https://www.myabandonware.com/game/the-simpsons-hit-run-bg6')).toBe(false)
    expect(isLegitimateStoreUrl(null)).toBe(false)
  })

  it('does not point any port at a ROM or abandonware download site', () => {
    for (const port of INITIAL_PORTS) {
      const url = port.base_game_url || ''
      for (const host of BLOCKED_BUY_HOSTS) {
        expect(url.includes(host), `${port.slug} buy url`).toBe(false)
      }
    }
  })
})
