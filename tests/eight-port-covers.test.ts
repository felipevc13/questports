import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { coverThumbUrl, versionedCoverUrl } from '../app/data/coverUrl'
import sharp from 'sharp'

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
    expect(sql).toContain(`where slug = '${slug}' and cover_image_url is null`)
    expect(sql).toContain(url)
    expect(sources).toContain(`https://www.steamgriddb.com/grid/${id}`)
  })
  it('uses the chosen No Gravity cover and a later null-only migration', async () => {
    const url = 'https://questports-media.questports.workers.dev/covers/no-gravity-vr.jpg'
    const cover = new URL('../public/covers/no-gravity-vr.jpg', import.meta.url)
    const thumb = new URL('../public/covers/thumbs/no-gravity-vr.jpg', import.meta.url)
    const insert = readFileSync(new URL('../supabase/migrations/20261126194000_portroyale_six_ports.sql', import.meta.url), 'utf8')
    const later = readFileSync(new URL('../supabase/migrations/20261127130000_no_gravity_cover.sql', import.meta.url), 'utf8')
    expect(INITIAL_PORTS.find(port => port.slug === 'no-gravity-vr')?.cover_image_url).toBe(url)
    expect(insert).toContain("'no-gravity-vr', 'No Gravity VR'")
    expect(insert).toContain('on conflict (slug) do nothing')
    expect(sql).not.toContain("where slug = 'no-gravity-vr'")
    expect(later).toContain(`set cover_image_url = '${url}'`)
    expect(later).toMatch(/where slug = 'no-gravity-vr'\s+and cover_image_url is null/)
    expect(versionedCoverUrl(url)).toMatch(/^\/covers\/no-gravity-vr\.jpg\?v=/)
    expect(coverThumbUrl(url)).toMatch(/^\/covers\/thumbs\/no-gravity-vr\.jpg\?v=/)
    expect(await sharp(readFileSync(cover)).metadata()).toMatchObject({ format: 'jpeg', width: 920, height: 430 })
    expect(await sharp(readFileSync(thumb)).metadata()).toMatchObject({ format: 'jpeg', width: 120, height: 56 })
    expect(sources).toContain('license and permission to redistribute are not verified')
  })
})
