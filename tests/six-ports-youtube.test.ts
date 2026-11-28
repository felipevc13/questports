import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { INITIAL_PORTS } from "../app/data/mockPorts"
import { youtubeClipForPort } from "../app/data/videoPreviews"
const videos = [["forza-horizon-vr", "6qrHTbc1VEg"], ["gran-turismo-4-vr", "SxuMwVc_YZw"], ["crash-bandicoot-launcher", "9HtPF0ers1w"], ["warzone-2100-vr", "xVMO3dwug8Y"], ["no-gravity-vr", "XeNZw0lQ8eY"], ["rage-racer-vr", "uwif0w4M3GY"]] as const
describe("six port videos", () => {
  it.each(videos)("uses the selected video for %s", (slug, id) => {
    expect(INITIAL_PORTS.find(port => port.slug === slug)?.youtube_video_id).toBe(id)
    const clip = youtubeClipForPort({ slug, youtubeId: id })!
    expect(clip.poster).toBe("https://i.ytimg.com/vi/" + id + "/hqdefault.jpg")
    expect(clip.embed.startsWith("https://www.youtube-nocookie.com/embed/" + id + "?")).toBe(true)
    expect(clip.start).toBeNull()
    expect(clip.end).toBeNull()
  })
  it("preserves existing IDs in the migration", () => {
    const sql = readFileSync(new URL("../supabase/migrations/20261127120000_six_ports_youtube_videos.sql", import.meta.url), "utf8")
    expect(sql.match(/and youtube_video_id is null;/g)).toHaveLength(6)
    for (const [slug, id] of videos) expect(sql.split("\n").some(line => line.includes(slug) && line.includes(id))).toBe(true)
  })
})