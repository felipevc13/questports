import { readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { absoluteCoverUrl } from '../app/data/coverUrl'
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
  SOCIAL_DESCRIPTION,
  SOCIAL_TITLE,
  defaultSocialMeta,
  portShareMeta,
  portSocialDescription
} from '../app/lib/socialMeta'

function pngSize(filePath: string) {
  const buf = readFileSync(filePath)
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    bytes: buf.length,
    signature: buf.subarray(0, 8).toString('hex')
  }
}

describe('site-wide social preview', () => {
  it('leads with one-click install and stays within the preview length', () => {
    expect(SOCIAL_TITLE).toBe('QuestPorts — One-click VR ports for Meta Quest')
    expect(SOCIAL_DESCRIPTION.length).toBeLessThanOrEqual(160)
    expect(SOCIAL_DESCRIPTION).toContain('Plug in your headset')
    expect(SOCIAL_DESCRIPTION).toContain('Chrome or Edge')
    expect(SOCIAL_DESCRIPTION).toContain('one click')
    expect(SOCIAL_DESCRIPTION).toContain('original game files')
  })

  it('points the large card at an absolute 1200x630 image', () => {
    const tags = Object.fromEntries(
      defaultSocialMeta().map(tag => [tag.property || tag.name, tag.content])
    )

    expect(tags['og:title']).toBe(SOCIAL_TITLE)
    expect(tags['og:description']).toBe(SOCIAL_DESCRIPTION)
    expect(tags['twitter:title']).toBe(SOCIAL_TITLE)
    expect(tags['twitter:description']).toBe(SOCIAL_DESCRIPTION)
    expect(tags['twitter:card']).toBe('summary_large_image')
    expect(tags['og:image']).toBe(OG_IMAGE_URL)
    expect(tags['og:image:secure_url']).toBe(OG_IMAGE_URL)
    expect(tags['twitter:image']).toBe(OG_IMAGE_URL)
    expect(OG_IMAGE_URL).toBe('https://questports.vercel.app/covers/questports-og.png?v=2')
    expect(tags['og:image:width']).toBe(OG_IMAGE_WIDTH)
    expect(tags['og:image:height']).toBe(OG_IMAGE_HEIGHT)
    expect(tags['og:image:width']).toBe('1200')
    expect(tags['og:image:height']).toBe('630')
    expect(tags['og:image:type']).toBe('image/png')
    expect(tags['og:image:alt']).toBe(OG_IMAGE_ALT)
    expect(tags['twitter:image:alt']).toBe(OG_IMAGE_ALT)
  })

  it('ships that card as a small static PNG', () => {
    const image = pngSize('public/covers/questports-og.png')
    expect(image.signature).toBe('89504e470d0a1a0a')
    expect(image.width).toBe(1200)
    expect(image.height).toBe(630)
    expect(image.bytes).toBeLessThan(300 * 1024)
    expect(statSync('public/og-image.png').size).toBe(image.bytes)
  })
})

describe('per-port social description', () => {
  it('says the game installs in one click from the browser', () => {
    expect(portSocialDescription('Doom 3')).toBe(
      'Doom 3 VR on Meta Quest. Install in one click from your browser.'
    )
    expect(portSocialDescription('Halo CE Quest VR')).toBe(
      'Halo CE Quest VR on Meta Quest. Install in one click from your browser.'
    )
    expect(portSocialDescription('  ')).toBe(
      'VR on Meta Quest. Install in one click from your browser.'
    )
  })

  it('keeps each port on its own cover', () => {
    const halo = portShareMeta('/covers/halocequest.jpg', 'Halo CE Quest VR')
    expect(halo.image).toBe('https://questports.vercel.app/covers/halocequest.jpg?v=2')
    expect(halo.type).toBe('image/jpeg')
    expect(halo.width).toBeNull()
    expect(halo.height).toBeNull()
    expect(halo.alt).toBe('Halo CE Quest VR')
    expect(halo.description).toContain('Install in one click from your browser.')

    const png = portShareMeta('/covers/nolf-vr.png', 'No One Lives ForeVR')
    expect(png.image).toBe('https://questports.vercel.app/covers/nolf-vr.png?v=2')
    expect(png.type).toBe('image/png')
    expect(png.width).toBeNull()

    const fallback = portShareMeta(null, null)
    expect(fallback.image).toBe(OG_IMAGE_URL)
    expect(fallback.type).toBe('image/png')
    expect(fallback.width).toBe('1200')
    expect(fallback.height).toBe('630')
    expect(absoluteCoverUrl('/covers/halocequest.jpg')).toBe(halo.image)
  })
})
