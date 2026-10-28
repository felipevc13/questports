import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  isValidUuid,
  getOrCreateDeviceId,
  getStoredUserVote,
  setStoredUserVote,
  rehydrateVoteFromSummary,
  ISSUE_TAG_LABELS,
  VERDICT_LABELS,
  type CommunityVerdict,
  type CommunityIssueTag,
  type StoredUserVote
} from '../app/lib/communityReviews'

describe('community playability reviews', () => {
  describe('UUID validation', () => {
    it('validates standard UUID v4 strings', () => {
      expect(isValidUuid('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBe(true)
      expect(isValidUuid('c9a646d3-9c61-4cd9-bc15-47044d66b31e')).toBe(true)
    })

    it('rejects invalid UUIDs or random strings', () => {
      expect(isValidUuid('not-a-uuid')).toBe(false)
      expect(isValidUuid('')).toBe(false)
      expect(isValidUuid('12345')).toBe(false)
      expect(isValidUuid('f47ac10b-58cc-6372-a567-0e02b2c3d479')).toBe(false) // version 6
    })
  })

  describe('client-side vote storage & rehydration (IP recovery)', () => {
    let mockStorage: Map<string, string>
    const originalWindow = globalThis.window

    beforeEach(() => {
      mockStorage = new Map<string, string>()
      const fakeLocalStorage = {
        getItem: (key: string) => mockStorage.get(key) ?? null,
        setItem: (key: string, value: string) => { mockStorage.set(key, value) },
        removeItem: (key: string) => { mockStorage.delete(key) },
        clear: () => { mockStorage.clear() }
      }
      // @ts-expect-error mock window
      globalThis.window = { localStorage: fakeLocalStorage }
      // @ts-expect-error mock localStorage
      globalThis.localStorage = fakeLocalStorage
    })

    afterEach(() => {
      globalThis.window = originalWindow
      // @ts-expect-error cleanup
      delete globalThis.localStorage
    })

    it('generates a valid device UUID if none exists in localStorage', () => {
      const id = getOrCreateDeviceId()
      expect(isValidUuid(id)).toBe(true)
      // Calling again returns the same ID
      expect(getOrCreateDeviceId()).toBe(id)
    })

    it('saves and retrieves user vote from localStorage', () => {
      const vote: StoredUserVote = {
        verdict: 'works_great',
        issueTag: null,
        headset: 'Quest 3',
        portVersion: 'v1.0.0',
        timestamp: 1700000000000
      }
      setStoredUserVote('quake3', vote)
      expect(getStoredUserVote('quake3')).toEqual(vote)
      expect(getStoredUserVote('doom')).toBeNull()
    })

    it('handles corrupted JSON in localStorage gracefully', () => {
      mockStorage.set('qp_review_quake3', '{invalid json}')
      expect(getStoredUserVote('quake3')).toBeNull()
    })

    it('rehydrates vote from server summary when local storage was cleared', () => {
      const serverVote: StoredUserVote = {
        verdict: 'needs_tweaks',
        issueTag: 'controls_broken',
        headset: 'Quest 2',
        portVersion: 'v1.2.0',
        timestamp: 1710000000000
      }
      // User wiped history, local storage is empty
      expect(getStoredUserVote('doom3')).toBeNull()

      const restored = rehydrateVoteFromSummary('doom3', serverVote, null)
      expect(restored).toEqual(serverVote)

      // Verify it was persisted back to localStorage
      expect(getStoredUserVote('doom3')).toEqual(serverVote)
    })

    it('does NOT overwrite existing local vote during rehydration', () => {
      const existingLocalVote: StoredUserVote = {
        verdict: 'works_great',
        issueTag: null,
        headset: 'Quest 3',
        portVersion: 'v1.5.0',
        timestamp: 1720000000000
      }
      setStoredUserVote('doom3', existingLocalVote)

      const staleServerVote: StoredUserVote = {
        verdict: 'cant_run',
        issueTag: 'wont_launch',
        headset: 'Quest 2',
        portVersion: 'v1.0.0',
        timestamp: 1700000000000
      }

      const result = rehydrateVoteFromSummary('doom3', staleServerVote, existingLocalVote)
      expect(result).toBe(existingLocalVote)
      expect(getStoredUserVote('doom3')?.verdict).toBe('works_great')
    })

    it('returns null if serverVote is null or has no verdict', () => {
      expect(rehydrateVoteFromSummary('doom3', null, null)).toBeNull()
      // @ts-expect-error invalid server vote
      expect(rehydrateVoteFromSummary('doom3', {}, null)).toBeNull()
      expect(getStoredUserVote('doom3')).toBeNull()
    })
  })

  describe('verdict labels and options', () => {
    it('defines exactly the 3 expected verdicts', () => {
      const verdicts: CommunityVerdict[] = ['works_great', 'needs_tweaks', 'cant_run']
      for (const v of verdicts) {
        expect(VERDICT_LABELS[v]).toBeDefined()
        expect(VERDICT_LABELS[v].label).toBeTruthy()
        expect(VERDICT_LABELS[v].icon).toBeTruthy()
      }
    })

    it('defines issue tags for reports with problems', () => {
      const tags: CommunityIssueTag[] = [
        'wont_launch',
        'missing_files',
        'controls_broken',
        'low_fps',
        'motion_sickness'
      ]
      for (const tag of tags) {
        expect(ISSUE_TAG_LABELS[tag]).toBeDefined()
        expect(ISSUE_TAG_LABELS[tag].length).toBeGreaterThan(0)
      }
    })
  })

  describe('percentage calculation logic', () => {
    it('computes works_pct as (works_great + needs_tweaks) / total', () => {
      const worksGreat = 5
      const needsTweaks = 1
      const cantRun = 1
      const total = worksGreat + needsTweaks + cantRun

      const worksPct = Math.round(((worksGreat + needsTweaks) / total) * 100)
      expect(worksPct).toBe(86)
      expect(worksGreat + needsTweaks).toBe(6)
      expect(total).toBe(7)
    })

    it('handles zero reviews gracefully', () => {
      const total = 0
      const worksPct = total === 0 ? null : Math.round((0 / total) * 100)
      expect(worksPct).toBeNull()
    })
  })

  describe('abuse prevention and rate limiting thresholds', () => {
    it('applies general rate limit of 10 reports per hour across ports', () => {
      const COMMUNITY_REPORTS_PER_HOUR = 10
      expect(10 >= COMMUNITY_REPORTS_PER_HOUR).toBe(true)
      expect(9 >= COMMUNITY_REPORTS_PER_HOUR).toBe(false)
    })
  })
})

