/** Row written to public.port_suggestions. Search misses may omit the link. */

export type PortSuggestionSource = 'suggest' | 'search'

export interface PortSuggestionDraft {
  title: string
  url: string
  videoUrl?: string
  notes?: string
  submittedBy?: string
  fromSearch: boolean
}

export interface PortSuggestionRow {
  title: string
  url: string | null
  video_url: string | null
  notes: string | null
  submitted_by: string | null
  status: 'pending'
  source: PortSuggestionSource
}

function blankToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? ''
  return trimmed || null
}

/**
 * Normal suggestions still need a link. A request opened from search may leave
 * it blank; that is stored as null with source `search` so the curator can
 * filter those rows. A blank link on a normal suggestion is rejected here,
 * and the database check rejects it again.
 */
export function buildPortSuggestion(draft: PortSuggestionDraft): PortSuggestionRow {
  const title = draft.title.trim()
  if (!title) throw new Error('Add the game name.')
  const url = draft.url.trim()
  if (!draft.fromSearch && !url) throw new Error('Add a link to the port.')
  return {
    title,
    url: url || null,
    video_url: blankToNull(draft.videoUrl),
    notes: blankToNull(draft.notes),
    submitted_by: blankToNull(draft.submittedBy),
    status: 'pending',
    source: draft.fromSearch ? 'search' : 'suggest'
  }
}
