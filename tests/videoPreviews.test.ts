import { describe, expect, it } from 'vitest'
import { AVAILABLE_VIDEO_PREVIEWS, GAME_VIDEO_PREVIEWS, hasVideoPreview } from '../app/data/videoPreviews'

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
  ['quake3quest', 'Q-MR6AVNu3E', '0:05', '1:05']
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

  it('leaves Descent 3 VR without a hover preview', () => {
    expect(hasVideoPreview('descent-3-vr')).toBe(false)
    expect(AVAILABLE_VIDEO_PREVIEWS).not.toContain('descent-3-vr')
    expect(GAME_VIDEO_PREVIEWS['descent-3-vr']).toBeUndefined()
  })
})
