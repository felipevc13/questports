import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { missingPortError } from '../app/lib/missingPort'

describe('unknown port slug', () => {
  it('is a fatal 404 when the port is missing', () => {
    expect(missingPortError(null)).toEqual({
      statusCode: 404,
      fatal: true,
      statusMessage: 'Port not found'
    })
    expect(missingPortError(undefined)).toEqual({
      statusCode: 404,
      fatal: true,
      statusMessage: 'Port not found'
    })
  })

  it('does not 404 when a port record exists', () => {
    expect(missingPortError({ slug: 'rtcwquest' })).toBeNull()
  })

  it('throws that fatal 404 from the port page when the slug is not found', () => {
    const page = readFileSync('app/pages/ports/[slug].vue', 'utf8')
    expect(page).toContain('missingPortError(port.value)')
    expect(page).toContain("throw createError({ statusCode: 404, fatal: true, statusMessage: 'Port not found' })")
  })

  it('renders a branded error page without a stack trace', () => {
    const page = readFileSync('app/error.vue', 'utf8')
    expect(page).toContain('Page not found')
    expect(page).toContain('Something went wrong')
    expect(page).toContain('Browse all ports')
    expect(page).toContain('<Navbar />')
    expect(page).toContain('<Footer />')
    expect(page).not.toContain('error.stack')
  })
})

describe('internal links', () => {
  const pageRoutes = new Set(['/', '/admin/verify'])

  function vueFiles(dir: string): string[] {
    const found: string[] = []
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      if (statSync(full).isDirectory()) found.push(...vueFiles(full))
      else if (entry.endsWith('.vue')) found.push(full)
    }
    return found
  }

  it('does not link the header, footer, or pages to missing routes', () => {
    const unknown: string[] = []
    for (const file of vueFiles('app')) {
      const source = readFileSync(file, 'utf8')
      for (const dead of ['/about', '/faq']) {
        expect(source, `${file} links to ${dead}`).not.toMatch(
          new RegExp(`(?:to|href)\\s*=\\s*["'\`]${dead}(?:["'\`?#])`)
        )
      }
      for (const match of source.matchAll(/\b(?:to|href)\s*=\s*["'](\/[^"'?#]*)/g)) {
        const pathname = match[1] || ''
        if (pathname.startsWith('/ports')) continue
        if (pathname.startsWith('/api/')) continue
        if (pathname.startsWith('/covers/')) continue
        if (pathname.startsWith('/previews/')) continue
        if (pathname.startsWith('/favicon')) continue
        if (pageRoutes.has(pathname)) continue
        unknown.push(`${file}: ${pathname}`)
      }
    }
    expect(unknown).toEqual([])
  })
})
