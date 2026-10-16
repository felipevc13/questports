import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (relative: string) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8')

const css = read('app/assets/css/main.css')

/** Every search input in the app, and whether it renders its own clear button. */
const SEARCH_FIELDS = {
  'app/pages/index.vue': { clearButton: true },
  'app/components/AppHome.vue': { clearButton: true },
  // A plain submit form on the error page. It has an explicit Search button, so it
  // does not carry a clear control.
  'app/error.vue': { clearButton: false }
} as const

function vueFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(new URL(`../${dir}`, import.meta.url), { withFileTypes: true })) {
    const child = `${dir}/${entry.name}`
    if (entry.isDirectory()) out.push(...vueFiles(child))
    else if (entry.name.endsWith('.vue')) out.push(child)
  }
  return out
}

describe('search inputs show exactly one clear affordance', () => {
  it('hides the native type=search clear button that Tailwind preflight leaves alone', () => {
    const rule = css.match(
      /input\[type='search'\]::-webkit-search-cancel-button[^{]*\{([^}]*)\}/
    )
    expect(rule, 'main.css must reset ::-webkit-search-cancel-button').not.toBeNull()

    const body = rule![1]
    expect(body).toMatch(/-webkit-appearance:\s*none/)
    expect(body).toMatch(/(?:^|\s)appearance:\s*none/)
  })

  it('keeps the styled Clear search button on the fields that need one', () => {
    for (const [file, expected] of Object.entries(SEARCH_FIELDS)) {
      const src = read(file)
      expect(src, `${file} must use type="search"`).toContain('type="search"')

      if (!expected.clearButton) continue

      expect(src, `${file} must render its own clear button`).toMatch(/aria-label="Clear search"/)
      expect(
        src,
        `${file} must hide the clear button while the query is empty`
      ).toMatch(/v-if="searchQuery"[\s\S]{0,400}aria-label="Clear search"/)
      expect(
        src,
        `${file} must clear the same model the input binds to`
      ).toMatch(/@click="searchQuery = ''"/)
    }
  })

  it('fails when a new search input is added without deciding about its clear button', () => {
    const found = vueFiles('app')
      .filter((file) => read(file).includes('type="search"'))
      .sort()

    expect(
      found,
      'Add the file to SEARCH_FIELDS in tests/search-field.test.ts and decide whether it needs a clear button'
    ).toEqual(Object.keys(SEARCH_FIELDS).sort())
  })
})
