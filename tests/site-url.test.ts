import { describe, expect, it } from 'vitest'
import { canonicalPageUrl } from '../app/lib/siteUrl'
import { buildSitemapXml, sitemapPaths } from '../app/lib/sitemap'

describe('canonical page URL', () => {
  it('uses the real page on questports.com', () => {
    expect(canonicalPageUrl('/')).toBe('https://questports.com/')
    expect(canonicalPageUrl('/ports/halocequest')).toBe('https://questports.com/ports/halocequest')
    expect(canonicalPageUrl('/ports/halocequest?mockQuest=1')).toBe('https://questports.com/ports/halocequest')
    expect(canonicalPageUrl('/about')).toBe('https://questports.com/about')
  })
})

describe('sitemap', () => {
  it('lists the catalog home and each port slug once', () => {
    const paths = sitemapPaths(['halocequest', 'halocequest', 'not a slug', '../secret'])
    expect(paths).toEqual(['/', '/app', '/ports/halocequest'])
    expect(buildSitemapXml(paths)).toContain('<loc>https://questports.com/app</loc>')
    const xml = buildSitemapXml(paths)
    expect(xml).toContain('<loc>https://questports.com/</loc>')
    expect(xml).toContain('<loc>https://questports.com/ports/halocequest</loc>')
    expect(xml).not.toContain('secret')
  })
})
