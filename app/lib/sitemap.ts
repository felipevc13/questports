import { SITE_ORIGIN, canonicalPageUrl } from './siteUrl'

export const SITEMAP_STATIC_PATHS = ['/'] as const

export function sitemapPaths(slugs: string[]): string[] {
  const paths = new Set<string>(SITEMAP_STATIC_PATHS)
  for (const slug of slugs) {
    const clean = slug.trim()
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(clean)) continue
    paths.add(`/ports/${clean}`)
  }
  return [...paths]
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildSitemapXml(paths: string[]): string {
  const urls = paths.map(path => `  <url><loc>${escapeXml(canonicalPageUrl(path))}</loc></url>`)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    ''
  ].join('\n')
}

export { SITE_ORIGIN }
