import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildPortSuggestion } from '../app/lib/portSuggestion'

describe('port suggestion rows', () => {
  it('stores a search request with no link as a null url', () => {
    expect(buildPortSuggestion({
      title: '  Call of Duty  ',
      url: '   ',
      notes: '  Quest 3  ',
      fromSearch: true
    })).toEqual({
      title: 'Call of Duty',
      url: null,
      video_url: null,
      notes: 'Quest 3',
      submitted_by: null,
      status: 'pending',
      source: 'search'
    })
  })

  it('keeps a link when the searcher has one', () => {
    expect(buildPortSuggestion({
      title: 'Call of Duty',
      url: ' https://example.com/cod ',
      fromSearch: true
    }).url).toBe('https://example.com/cod')
  })

  it('still requires a link on the normal suggest form', () => {
    expect(() => buildPortSuggestion({
      title: 'Half-Life',
      url: '',
      fromSearch: false
    })).toThrow(/link/i)
    expect(buildPortSuggestion({
      title: 'Half-Life',
      url: 'https://github.com/example/hl',
      videoUrl: '',
      submittedBy: '  @felipe  ',
      fromSearch: false
    })).toMatchObject({
      url: 'https://github.com/example/hl',
      submitted_by: '@felipe',
      source: 'suggest'
    })
  })

  it('rejects a blank title', () => {
    expect(() => buildPortSuggestion({
      title: '  ',
      url: '',
      fromSearch: true
    })).toThrow(/name/i)
  })

  it('makes the search-request url optional in the dialog and keeps the request events', () => {
    const modal = readFileSync(new URL('../app/components/SuggestModal.vue', import.meta.url), 'utf8')
    const migration = readFileSync(new URL('../supabase/migrations/20261027040000_port_suggestion_search_url.sql', import.meta.url), 'utf8')
    expect(modal).toContain(':required="!fromSearch"')
    expect(modal).toContain("track('game_request_submit'")
    expect(modal).toContain("result: 'success'")
    expect(modal).toContain("result: 'fail'")
    expect(modal).toContain('buildPortSuggestion')
    expect(migration).toContain('source = \'search\'')
    expect(migration).toContain('alter column url drop not null')
    expect(migration).toContain('Apply manually')
  })
})
