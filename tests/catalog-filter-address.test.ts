import { describe, expect, it } from 'vitest'
import {
  readCatalogQuery,
  sanitizeCatalogFilters,
  withCatalogFilterParams,
  type CatalogFilterOptions
} from '../app/lib/catalogQuery'

const OPTIONS: CatalogFilterOptions = {
  platforms: ['n64', 'dreamcast', 'pc'],
  headsets: ['Quest 2', 'Quest 3', 'Quest 3S'],
  styles: ['six_dof', 'cinema']
}

describe('menu filters in the address', () => {
  it('reads the five parameters as written', () => {
    expect(readCatalogQuery('?platform=n64&hw=Quest+3&style=six_dof&status=released&sort=az')).toMatchObject({
      platform: 'n64',
      hw: 'Quest 3',
      style: 'six_dof',
      status: 'released',
      sort: 'az'
    })
  })

  it('keeps values the catalog has', () => {
    const q = readCatalogQuery('?platform=dreamcast&hw=Quest+3S&style=cinema&status=playable_beta&sort=installs')
    expect(sanitizeCatalogFilters(q, OPTIONS)).toEqual({
      platform: 'dreamcast',
      hw: 'Quest 3S',
      style: 'cinema',
      status: 'playable_beta',
      sort: 'installs'
    })
  })

  it('drops values the catalog does not have instead of emptying the list', () => {
    const q = readCatalogQuery('?platform=atari&hw=Quest+1&style=nope&status=gone&sort=random')
    expect(sanitizeCatalogFilters(q, OPTIONS)).toEqual({ platform: '', hw: '', style: '', status: '', sort: 'recent' })
  })

  it('maps the old featured sort to installs', () => {
    expect(sanitizeCatalogFilters(readCatalogQuery('?sort=featured'), OPTIONS).sort).toBe('installs')
  })

  it('writes only non-default values and keeps other parameters', () => {
    const next = withCatalogFilterParams(
      { cat: 'emulator', nopc: '1', platform: 'old', sort: 'az' },
      { platform: 'n64', hw: '', style: '', status: 'released', sort: 'recent' }
    )
    expect(next).toEqual({ cat: 'emulator', nopc: '1', platform: 'n64', status: 'released' })
  })

  it('leaves the address clean when everything is default', () => {
    expect(withCatalogFilterParams({ hw: 'Quest 3', sort: 'az' }, { platform: '', hw: '', style: '', status: '', sort: 'recent' })).toEqual({})
  })
})
