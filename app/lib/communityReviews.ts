/** Community playability feedback types and client storage helpers. */

export type CommunityVerdict = 'works_great' | 'needs_tweaks' | 'cant_run'

export type CommunityIssueTag =
  | 'wont_launch'
  | 'missing_files'
  | 'controls_broken'
  | 'low_fps'
  | 'motion_sickness'

export type CommunitySource = 'app_launch' | 'app_browse' | 'web'

export interface CommunityReviewPayload {
  deviceId: string
  verdict: CommunityVerdict
  issueTag?: CommunityIssueTag | null
  headset?: string | null
  portVersion?: string | null
  source?: CommunitySource
}

export interface CommunitySummary {
  portSlug: string
  totalReviews: number
  worksGreatCount: number
  needsTweaksCount: number
  cantRunCount: number
  appVerifiedCount: number
  worksPct: number | null
  lastReviewAt: string | null
  headsets?: Record<string, { worksGreat: number; needsTweaks: number; cantRun: number }>
}

export interface StoredUserVote {
  verdict: CommunityVerdict
  issueTag?: CommunityIssueTag | null
  headset?: string | null
  portVersion?: string | null
  timestamp: number
}

const STORAGE_KEY_PREFIX = 'questports_community_vote_'
const DEVICE_ID_KEY = 'questports_anonymous_device_id'

export const ISSUE_TAG_LABELS: Record<CommunityIssueTag, string> = {
  wont_launch: "Won't launch / crashes",
  missing_files: 'Missing game files error',
  controls_broken: 'Controls or aim broken',
  low_fps: 'Lag / low framerate',
  motion_sickness: 'Excessive motion sickness'
}

export const VERDICT_LABELS: Record<CommunityVerdict, { label: string; icon: string; short: string }> = {
  works_great: { label: 'Works Great', icon: '👍', short: 'Great' },
  needs_tweaks: { label: 'Needs Tweaks', icon: '🔧', short: 'Tweaks' },
  cant_run: { label: "Couldn't Run", icon: '❌', short: 'Broken' }
}

/** Returns or creates an anonymous UUID stored in browser localStorage. */
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return '00000000-0000-4000-8000-000000000000'
  }
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY)
    if (id && isValidUuid(id)) return id
    id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : generateFallbackUuid()
    localStorage.setItem(DEVICE_ID_KEY, id)
    return id
  } catch {
    return '00000000-0000-4000-8000-000000000000'
  }
}

export function isValidUuid(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val)
}

function generateFallbackUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getStoredUserVote(slug: string): StoredUserVote | null {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${slug}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredUserVote
    if (parsed && typeof parsed.verdict === 'string') return parsed
    return null
  } catch {
    return null
  }
}

export function setStoredUserVote(slug: string, vote: StoredUserVote): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${slug}`, JSON.stringify(vote))
  } catch {
    // quota exceeded or storage blocked
  }
}

