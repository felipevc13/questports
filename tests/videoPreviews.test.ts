import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { DEFAULT_MEDIA_BASE } from '../app/data/coverUrl'
import { AVAILABLE_VIDEO_PREVIEWS, GAME_VIDEO_PREVIEWS, hasVideoPreview, localVideoPreviewsEnabled, previewMp4Url, youtubeClipForPort, PREVIEW_HOVER_MS } from '../app/data/videoPreviews'

const PREVIEW_CLIPS: Array<[string, string, string, string]> = [
  ['sclerosis-vr', 'UpTDQZr0TWw', '36:20', '37:20'],
  ['sega-rally-vr', 'FqwEK0hJ_Yc', '0:11', '1:11'],
  ['starfox-enhanced-vr', 'UAPKVEGoMvo', '2:00', '3:00'],
  ['unreal-gold-vr', 'ClQXAt0FhUo', '6:40', '7:40'],
  ['homeworld-unbound', 'rhCOSpSf-NQ', '4:40', '5:40'],
  ['ocarina-of-time-vr', 'fzhbhrotI1Q', '1:30', '2:30'],
  ['xrkart-64', '30bVFznHI3M', '1:00', '2:00'],
  ['wiicompiled-vr-plus', 'DnO2lIeBW2g', '0:10', '1:00'],
  ['twilight-princess-vr', '1OZPe0AD2Zs', '2:22', '3:22'],
  ['majoras-mask-vr', 'ZRu6Zk5BnFY', '5:47', '6:47'],
  ['generals-zero-hour-xr', 'BYddTICZH9g', '3:58', '4:58'],
  ['sm64-coop-dx-vr', 'nmeVViFqVG8', '0:12', '1:12'],
  ['f-zero-x-vr', '0dr4OSkLeM4', '1:00', '2:00'],
  ['quake3quest', 'Q-MR6AVNu3E', '0:05', '1:05'],
  ['hotd2-vr', 'KeQKP9u1PiA', '3:20', '4:20']
]

describe('local hover previews', () => {
  it.each(PREVIEW_CLIPS)('registers %s and %s for %s-%s', (slug, youtubeId, start, end) => {
    expect(hasVideoPreview(slug)).toBe(true)
    expect(AVAILABLE_VIDEO_PREVIEWS).toContain(slug)
    expect(GAME_VIDEO_PREVIEWS[slug]).toEqual({ start, end })
    expect(GAME_VIDEO_PREVIEWS[youtubeId]).toEqual({ start, end })
  })

  it('leaves Magic Carpet without a hover preview', () => {
    expect(hasVideoPreview('magic-carpet-vr')).toBe(false)
    expect(AVAILABLE_VIDEO_PREVIEWS).not.toContain('magic-carpet-vr')
    expect(GAME_VIDEO_PREVIEWS['magic-carpet-vr']).toBeUndefined()
  })

  it('serves MP4s only from an external media base', () => {
    expect(localVideoPreviewsEnabled('')).toBe(false)
    expect(localVideoPreviewsEnabled('   ')).toBe(false)
    expect(previewMp4Url({ slug: 'hotd2-vr', mediaBase: '' })).toBeNull()
    expect(previewMp4Url({
      slug: 'hotd2-vr',
      videoPreviewUrl: '/previews/hotd2-vr.mp4',
      mediaBase: ''
    })).toBeNull()
    expect(previewMp4Url({ slug: 'hotd2-vr', mediaBase: 'https://cdn.example.com/' })).toBe(
      'https://cdn.example.com/previews/hotd2-vr.mp4'
    )
    expect(previewMp4Url({ slug: 'hotd2-vr', mediaBase: DEFAULT_MEDIA_BASE })).toBe(
      `${DEFAULT_MEDIA_BASE}/previews/hotd2-vr.mp4`
    )
    expect(PREVIEW_HOVER_MS).toBe(400)
    expect(previewMp4Url({ slug: 'magic-carpet-vr', mediaBase: 'https://cdn.example.com' })).toBeNull()
  })

  it('builds a click-to-play youtube-nocookie clip from the saved timestamps', () => {
    const clip = youtubeClipForPort({ slug: 'hotd2-vr', youtubeId: 'KeQKP9u1PiA' })
    expect(clip?.poster).toBe('https://i.ytimg.com/vi/KeQKP9u1PiA/hqdefault.jpg')
    expect(clip?.embed.startsWith('https://www.youtube-nocookie.com/embed/KeQKP9u1PiA?')).toBe(true)
    expect(clip?.embed).toContain('autoplay=1')
    expect(clip?.embed).toContain('start=200')
    expect(clip?.embed).toContain('end=260')
    expect(youtubeClipForPort({ slug: 'hotd2-vr', youtubeId: null })).toBeNull()
  })

  it('starts MP4s only after a desktop hover and keeps YouTube ahead of them on detail pages', () => {
    const card = readFileSync('app/components/PortCard.vue', 'utf8')
    expect(card).toContain('preload="none"')
    expect(card).not.toContain('autoplay')
    expect(card).not.toContain('onPreviewTap')
    expect(card).toContain('canHoverPreview')
    const detail = readFileSync('app/pages/ports/[slug].vue', 'utf8')
    expect(detail).toContain('preload="none"')
    expect(detail).toContain('if (youtubeClip.value) return null')
    expect(detail).toContain('data-testid="youtube-lite"')
    expect(detail).toContain('canHoverPreview')
  })

  it('leaves Descent 3 VR without a hover preview', () => {
    expect(hasVideoPreview('descent-3-vr')).toBe(false)
    expect(AVAILABLE_VIDEO_PREVIEWS).not.toContain('descent-3-vr')
    expect(GAME_VIDEO_PREVIEWS['descent-3-vr']).toBeUndefined()
  })
})
