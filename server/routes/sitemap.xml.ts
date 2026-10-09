import { INITIAL_PORTS } from '../../app/data/mockPorts'
import { buildSitemapXml, sitemapPaths } from '../../app/lib/sitemap'

async function loadPortSlugs(): Promise<string[]> {
  const config = useRuntimeConfig()
  const url = String(config.public.supabaseUrl || '').replace(/\/$/, '')
  const key = String(config.public.supabaseKey || '')
  if (url && key && !url.includes('your-project-id')) {
    try {
      const rows = await $fetch<Array<{ slug?: string | null }>>(`${url}/rest/v1/ports`, {
        query: { select: 'slug' },
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`
        }
      })
      const slugs = rows.map(row => row.slug || '').filter(Boolean)
      if (slugs.length > 0) return slugs
    } catch (err) {
      console.warn('Sitemap could not read port slugs from Supabase, using the local catalog:', err)
    }
  }
  return INITIAL_PORTS.map(port => port.slug)
}

export default defineEventHandler(async (event) => {
  const xml = buildSitemapXml(sitemapPaths(await loadPortSlugs()))
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600')
  return xml
})
