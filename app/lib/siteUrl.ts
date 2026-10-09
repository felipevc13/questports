export const SITE_ORIGIN = 'https://questports.vercel.app'

/** Absolute URL for the page the visitor is actually on. */
export function canonicalPageUrl(path: string): string {
  const pathname = (path || '/').split('?')[0]?.split('#')[0] || '/'
  const withSlash = pathname.startsWith('/') ? pathname : `/${pathname}`
  const trimmed = withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : '/'
  return trimmed === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${trimmed}`
}
