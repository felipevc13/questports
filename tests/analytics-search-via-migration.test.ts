import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (name: string) => readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8')

describe('search props.via and the install via check', () => {
  const fix = read('20261106140000_analytics_search_via.sql')

  it('keeps the install values and adds the four search values', () => {
    expect(fix).toContain('drop constraint if exists analytics_events_app_install_via_check')
    expect(fix).toContain("event in ('install_click', 'install_success', 'install_error')")
    expect(fix).toContain("props->>'via' in ('page', 'modal')")
    expect(fix).toContain("event = 'search'")
    expect(fix).toContain("props->>'via' in ('text', 'alias', 'fuzzy', 'none')")
  })

  it('does not touch the stricter search check from the catalog search migration', () => {
    expect(fix).not.toMatch(/constraint analytics_events_search_query/i)
    expect(read('20261027020000_analytics_catalog_search.sql')).toContain("props->>'via' in ('text', 'alias', 'fuzzy', 'none')")
  })
})
