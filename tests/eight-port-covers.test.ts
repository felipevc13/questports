import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'

const covers = [
  ['forza-horizon-vr', 'png', '858910'],
  ['gran-turismo-4-vr', 'png', '28181'],
  ['crash-bandicoot-launcher', 'png', '659839'],
  ['0ad-vr', 'png', '638777'],
  ['warzone-2100-vr', 'png', '100571'],
  ['rage-racer-vr', 'png', '862482'],
  ['wario-land-4-vr', 'jpg', '301242']
] as const

describe('new port cover sources and delivery', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261126210000_eight_port_covers.sql', import.meta.url), 'utf8')
  const sources = readFileSync(new URL('../docs/new-port-cover-sources.md', import.meta.url), 'utf8')
  it('describes cover source links without claiming verification', () => {
    expect(sql.split('\n')[0]).toBe('-- SteamGridDB capsule source links are listed in docs/new-port-cover-sources.md.')
  })
  it.each(covers)('%s references a local cover, thumbnail, source and SQL update', (slug, ext, id) => {
    const url = `https://questports-media.questports.workers.dev/covers/${slug}.${ext}`
    expect(INITIAL_PORTS.find(port => port.slug === slug)?.cover_image_url).toBe(url)
    expect(existsSync(new URL(`../public/covers/${slug}.${ext}`, import.meta.url))).toBe(true)
    expect(existsSync(new URL(`../public/covers/thumbs/${slug}.jpg`, import.meta.url))).toBe(true)
    expect(sql).toContain(`where slug = '${slug}'`)
    expect(sql).toContain(url)
    expect(sources).toContain(`https://www.steamgriddb.com/grid/${id}`)
  })
  it('does not invent a No Gravity cover', () => {
    expect(INITIAL_PORTS.find(port => port.slug === 'no-gravity-vr')?.cover_image_url).toBeNull()
    expect(sql).not.toContain("where slug = 'no-gravity-vr'")
  })
})
