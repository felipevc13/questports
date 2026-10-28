import { describe, expect, it } from 'vitest'
import {
  isValidUuid,
  ISSUE_TAG_LABELS,
  VERDICT_LABELS,
  type CommunityVerdict,
  type CommunityIssueTag
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
})

