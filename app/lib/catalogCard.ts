/**
 * The one line under a catalog card title.
 * Verified wins. Otherwise a usage count, and only at 3 or more.
 * "Quest 3 only" is appended when the port supports Quest 3 and neither Quest 2 nor Quest 3S.
 */

import { formatInstallCount } from '~/lib/verification'
import { normalizeHeadsetList } from '~/lib/headsets'

/** Counts below this stay off the card. */
export const CATALOG_CARD_INSTALL_MIN = 3

/**
 * One line of 12px text inside a 4-column card at 1280px (about 260px).
 * Longer blurbs are omitted instead of ending mid-sentence.
 */
export const CARD_DESCRIPTION_MAX = 46

export function isQuest3Only(hardware: string[] | null | undefined): boolean {
  const labels = normalizeHeadsetList(hardware)
  return labels.includes('Quest 3') && !labels.includes('Quest 2') && !labels.includes('Quest 3S')
}

export interface CatalogCardMeta {
  /** Manual works check for the current catalog version. */
  verified: boolean
  /** The whole line, including the Quest 3 note. */
  text: string
  /** Text after "✓ Verified", including the separator. Empty when that is the whole line. */
  suffix: string
}

export function buildCatalogCardMeta(input: {
  verified: boolean
  installs: number
  hardware: string[] | null | undefined
}): CatalogCardMeta | null {
  const parts: string[] = []
  if (input.verified) {
    parts.push('✓ Verified')
  } else {
    const count = Number.isFinite(input.installs) ? Math.floor(input.installs) : 0
    if (count >= CATALOG_CARD_INSTALL_MIN) {
      const label = formatInstallCount(count)
      if (label) parts.push(`↓ ${label}`)
    }
  }
  if (isQuest3Only(input.hardware)) parts.push('Quest 3 only')
  if (!parts.length) return null
  const verified = parts[0] === '✓ Verified'
  return {
    verified,
    text: parts.join(' · '),
    suffix: verified ? parts.slice(1).map(part => ` · ${part}`).join('') : ''
  }
}

/** The description when it fits on one line. Null when it would truncate. */
export function catalogCardDescription(text: string | null | undefined): string | null {
  if (typeof text !== 'string') return null
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (!trimmed || trimmed.length > CARD_DESCRIPTION_MAX) return null
  return trimmed
}
