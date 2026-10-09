import { describe, expect, it } from 'vitest'
import { canonicalPageUrl } from '../app/lib/siteUrl'
import { buildSitemapXml, sitemapPaths } from '../app/lib/sitemap'

describe('canonical page URL', () => {
  it('uses the real page on questports.vercel.app', () => {
    expect(canonicalPageUrl('/')).toBe('https://questports.vercel.app/')
    expect(canonicalPageUrl('/ports/halocequest')).toBe('https://questports.vercel.app/ports/halocequest')
    expect(canonicalPageUrl('/ports/halocequest?mockQuest=1')).toBe('https://questports.vercel.app/ports/halocequest')
    expect(canonicalPageUrl('/about')).toBe('https://questports.vercel.app/about')
  })
})

describe('sitemap', () => {
  it('lists the catalog home and each port slug once', () => {
    const paths = sitemapPaths(['halocequest', 'halocequest', 'not a slug', '../secret'])
    expect(paths).toEqual(['/', '/ports/halocequest'])
    const xml = buildSitemapXml(paths)
    expect(xml).toContain('<loc>https://questports.vercel.app/</loc>')
    expect(xml).toContain('<loc>https://questports.vercel.app/ports/halocequest</loc>')
    expect(xml).not.toContain('secret')
  })
})
