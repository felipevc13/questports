import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function vueFiles(dir: string): string[] {
  const found: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) found.push(...vueFiles(full))
    else if (entry.endsWith('.vue')) found.push(full)
  }
  return found
}

describe('catalog payload prefetch', () => {
  it('prefetches NuxtLinks on interaction instead of visibility', () => {
    const config = readFileSync(new URL('../nuxt.config.ts', import.meta.url), 'utf8')
    expect(config).toMatch(/prefetchOn:\s*\{\s*visibility:\s*false,\s*interaction:\s*true\s*\}/)
    expect(config).toContain('experimental:')
  })

  it('leaves port cards and other catalog links on that default', () => {
    const card = readFileSync(new URL('../app/components/PortCard.vue', import.meta.url), 'utf8')
    const index = readFileSync(new URL('../app/pages/index.vue', import.meta.url), 'utf8')
    expect(card).toContain('<NuxtLink')
    expect(index).toContain('<PortCard')
    expect(index).toContain('<NuxtLink')
    expect(index).toContain('`/ports/${port.slug}`')

    const overrides: string[] = []
    for (const file of vueFiles('app')) {
      const source = readFileSync(file, 'utf8')
      if (/prefetch-on\s*=\s*["']visibility["']/.test(source)) overrides.push(`${file}: visibility`)
      if (/prefetchOn:\s*\{[^}]*visibility:\s*true/.test(source)) overrides.push(`${file}: visibility true`)
      if (/prefetch\s*=\s*["']false["']|:prefetch="false"|prefetch:\s*false/.test(source)) overrides.push(`${file}: prefetch false`)
    }
    expect(overrides).toEqual([])
  })
})

describe('favicon cache', () => {
  it('links one icon and the apple touch icon', () => {
    const config = readFileSync(new URL('../nuxt.config.ts', import.meta.url), 'utf8')
    const linkStart = config.indexOf('link: [')
    const linkEnd = config.indexOf(']', linkStart)
    const links = config.slice(linkStart, linkEnd)
    expect(links).toContain("rel: 'icon', href: '/favicon.ico'")
    expect(links).toContain("rel: 'apple-touch-icon', href: '/apple-touch-icon.png'")
    expect(links).not.toContain('favicon.png')
    expect(links).not.toContain('favicon.svg')
    expect(links).not.toContain('shortcut icon')
    expect(links).not.toContain('?v=')
    expect(links.match(/rel:\s*'icon'/g)).toEqual(["rel: 'icon'"])
  })

  it('caches the static icon files for a year', () => {
    const config = readFileSync(new URL('../nuxt.config.ts', import.meta.url), 'utf8')
    const vercel = readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')
    const icons = [
      '/favicon.ico',
      '/favicon.png',
      '/favicon.svg',
      '/apple-touch-icon.png',
      '/apple-touch-icon-precomposed.png'
    ]
    for (const icon of icons) {
      expect(config, icon).toContain(`'${icon}': { headers: { 'cache-control': 'public, max-age=31536000' } }`)
      expect(vercel, icon).toContain(`"source": "${icon}"`)
      expect(statSync(`public${icon}`).size).toBeGreaterThan(0)
    }
    expect(vercel).toContain('"Cache-Control"')
    expect(vercel).toContain('public, max-age=31536000')
    const iconHeader = vercel.split('"/favicon.ico"')[1]?.slice(0, 240) || ''
    expect(iconHeader).toContain('public, max-age=31536000')
    expect(iconHeader).not.toContain('immutable')
  })

  it('does not override ISR routes in vercel.json so Nitro controls edge cache', () => {
    const vercel = readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')
    // vercel.json headers override edge CDN behavior. Setting low max-age (e.g. 120s)
    // on ISR routes breaks the 86400s edge cache, causing 60k+ revalidations and burning
    // Fast Origin Transfer quota.
    expect(vercel).not.toContain('"source": "/"')
    expect(vercel).not.toContain('"source": "/app"')
    expect(vercel).not.toContain('"source": "/library"')
    expect(vercel).not.toContain('"source": "/ports/(.*)"')
    expect(vercel).not.toContain('"source": "/_payload.json(.*)"')
  })
})
