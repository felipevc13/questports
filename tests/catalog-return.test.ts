import { describe, expect, it } from 'vitest'
import { catalogReturnTarget } from '../app/lib/catalogReturn'

describe('catalogReturnTarget', () => {
  it('returns the catalog address the player left, filters included', () => {
    expect(catalogReturnTarget('/?nopc=1&cat=Emulator')).toBe('/?nopc=1&cat=Emulator')
    expect(catalogReturnTarget('/')).toBe('/')
  })
  it('falls back to the plain catalog from anywhere else', () => {
    expect(catalogReturnTarget('/library')).toBe('/')
    expect(catalogReturnTarget('/ports/xrkart-64?x=1')).toBe('/')
    expect(catalogReturnTarget(null)).toBe('/')
    expect(catalogReturnTarget(undefined)).toBe('/')
  })
})
