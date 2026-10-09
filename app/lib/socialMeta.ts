import { absoluteCoverUrl, DEFAULT_OG_URL } from '../data/coverUrl'

export const SOCIAL_TITLE = 'QuestPorts — One-click VR ports for Meta Quest'

/** Stay under ~160 characters so link previews do not truncate the install steps. */
export const SOCIAL_DESCRIPTION =
  'Free catalog of standalone VR ports for Meta Quest. Plug in your headset, open in Chrome or Edge, and install in one click. Guides for original game files.'

export const OG_IMAGE_URL = DEFAULT_OG_URL
export const OG_IMAGE_WIDTH = '1200'
export const OG_IMAGE_HEIGHT = '630'
export const OG_IMAGE_ALT = 'Install VR ports on Quest in one click'

const ONE_CLICK_LINE = 'Install in one click from your browser.'

/** Open Graph / Twitter description for a port page. Keeps the per-port image, changes only the text. */
export function portSocialDescription(title: string | null | undefined): string {
  const name = title?.replace(/\s+/g, ' ').trim()
  if (!name) return `VR on Meta Quest. ${ONE_CLICK_LINE}`
  const label = /vr/i.test(name) ? name : `${name} VR`
  return `${label} on Meta Quest. ${ONE_CLICK_LINE}`
}

export function socialImageType(url: string): string {
  const path = url.split('?')[0]?.toLowerCase() || ''
  if (path.endsWith('.png')) return 'image/png'
  if (path.endsWith('.webp')) return 'image/webp'
  if (path.endsWith('.gif')) return 'image/gif'
  return 'image/jpeg'
}

/**
 * Share tags for a port page. A real cover stays the image; the site card is
 * only used when the port has no cover of its own.
 */
export function portShareMeta(coverUrl: string | null | undefined, title: string | null | undefined) {
  const description = portSocialDescription(title)
  const image = absoluteCoverUrl(coverUrl)
  const isDefault = image === OG_IMAGE_URL
  return {
    description,
    image,
    type: isDefault ? 'image/png' : socialImageType(image),
    width: isDefault ? OG_IMAGE_WIDTH : null,
    height: isDefault ? OG_IMAGE_HEIGHT : null,
    alt: isDefault ? OG_IMAGE_ALT : (title?.replace(/\s+/g, ' ').trim() || 'QuestPorts')
  }
}

export function defaultSocialMeta() {
  return [
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'QuestPorts' },
    { property: 'og:title', content: SOCIAL_TITLE },
    { property: 'og:description', content: SOCIAL_DESCRIPTION },
    { property: 'og:image', content: OG_IMAGE_URL },
    { property: 'og:image:secure_url', content: OG_IMAGE_URL },
    { property: 'og:image:width', content: OG_IMAGE_WIDTH },
    { property: 'og:image:height', content: OG_IMAGE_HEIGHT },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:alt', content: OG_IMAGE_ALT },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: SOCIAL_TITLE },
    { name: 'twitter:description', content: SOCIAL_DESCRIPTION },
    { name: 'twitter:image', content: OG_IMAGE_URL },
    { name: 'twitter:image:alt', content: OG_IMAGE_ALT }
  ]
}
