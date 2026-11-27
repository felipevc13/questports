import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { INITIAL_PORTS } from '../app/data/mockPorts'
import { AVAILABLE_VIDEO_PREVIEWS, GAME_VIDEO_PREVIEWS, youtubeClipForPort } from '../app/data/videoPreviews'

const migration = readFileSync(new URL('../supabase/migrations/20261127112500_0ad_vr_youtube_video.sql', import.meta.url), 'utf8')

describe('0 A.D. VR YouTube video', () => {
  it('uses the port-linked video in the catalog and the click-to-play embed', () => {
    const port = INITIAL_PORTS.find(row => row.slug === '0ad-vr')!
    expect(port.youtube_video_id).toBe('VthjeJ8kOoI')
    const clip = youtubeClipForPort({ slug: port.slug, youtubeId: port.youtube_video_id })!
    expect(clip.poster).toBe('https://i.ytimg.com/vi/VthjeJ8kOoI/hqdefault.jpg')
    expect(clip.embed).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/VthjeJ8kOoI\?/)
    expect(clip.embed).toContain('autoplay=1')
    expect(clip.start).toBeNull()
    expect(clip.end).toBeNull()
    expect(GAME_VIDEO_PREVIEWS[port.slug]).toBeUndefined()
    expect(AVAILABLE_VIDEO_PREVIEWS).not.toContain(port.slug)
  })

  it('only fills a missing video ID for the intended port', () => {
    const sql = migration.replace(/^--.*$/gm, '').trim().replace(/\s+/g, ' ')
    expect(sql).toBe("update public.ports set youtube_video_id = 'VthjeJ8kOoI' where slug = '0ad-vr' and youtube_video_id is null;")
  })
})
