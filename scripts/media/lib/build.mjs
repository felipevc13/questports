import { copyFile, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import {
  COVER_MAX_WIDTH,
  DIST_DIR,
  HEADERS_SOURCE,
  REPO_ROOT,
  THUMB_WIDTH
} from './constants.mjs'
import { commandExists, imageFormat, mapPool, optimizePreviewFile, writeOptimizedImage } from './optimize.mjs'
import { thumbUrlForCoverFile } from './references.mjs'

async function listTop(dir) {
  try {
    return (await readdir(dir, { withFileTypes: true }))
      .filter(entry => entry.isFile())
      .map(entry => entry.name)
      .sort()
  } catch (err) {
    if (err && err.code === 'ENOENT') return []
    throw err
  }
}

/**
 * Build scripts/media/dist from public/covers, public/covers/thumbs and public/previews.
 * Does not modify public/. Does not deploy.
 */
export async function buildMedia(options = {}) {
  const repoRoot = options.repoRoot || REPO_ROOT
  const distDir = options.distDir || DIST_DIR
  const headersSource = options.headersSource || HEADERS_SOURCE
  const coverConcurrency = options.coverConcurrency || 8
  const previewConcurrency = options.previewConcurrency || 2
  const publicCovers = path.join(repoRoot, 'public/covers')
  const publicThumbs = path.join(publicCovers, 'thumbs')
  const publicPreviews = path.join(repoRoot, 'public/previews')

  await rm(distDir, { recursive: true, force: true })
  const coversOut = path.join(distDir, 'covers')
  const thumbsOut = path.join(coversOut, 'thumbs')
  const previewsOut = path.join(distDir, 'previews')

  const coverNames = await listTop(publicCovers)
  const thumbNames = await listTop(publicThumbs)
  const previewNames = (await listTop(publicPreviews)).filter(name => name.toLowerCase().endsWith('.mp4'))
  const ffmpeg = commandExists(options.ffmpegBin || 'ffmpeg')
  if (!ffmpeg) {
    console.warn('ffmpeg is not on PATH. Preview MP4s will be copied without re-encoding.')
  }

  const coverResults = await mapPool(coverNames, coverConcurrency, async (name) => {
    const format = imageFormat(name)
    const result = await writeOptimizedImage(
      path.join(publicCovers, name),
      path.join(coversOut, name),
      { maxWidth: COVER_MAX_WIDTH, format: format || undefined }
    )
    return { name, ...result }
  })

  const thumbResults = await mapPool(thumbNames, coverConcurrency, async (name) => {
    const result = await writeOptimizedImage(
      path.join(publicThumbs, name),
      path.join(thumbsOut, name),
      { maxWidth: THUMB_WIDTH, format: 'jpeg' }
    )
    return { name, ...result }
  })

  const presentThumbs = new Set(thumbNames.map(name => name.toLowerCase()))
  const generatedThumbs = []
  for (const name of coverNames) {
    const thumbUrl = thumbUrlForCoverFile(name)
    if (!thumbUrl) continue
    const thumbName = path.posix.basename(thumbUrl)
    if (presentThumbs.has(thumbName.toLowerCase())) continue
    await writeOptimizedImage(
      path.join(coversOut, name),
      path.join(thumbsOut, thumbName),
      { maxWidth: THUMB_WIDTH, format: 'jpeg', force: true }
    )
    generatedThumbs.push(thumbName)
    presentThumbs.add(thumbName.toLowerCase())
  }

  const previewResults = await mapPool(previewNames, previewConcurrency, async (name, index) => {
    const result = await optimizePreviewFile(
      path.join(publicPreviews, name),
      path.join(previewsOut, name),
      { ffmpegBin: options.ffmpegBin }
    )
    if (previewNames.length > 3) {
      console.log(`preview ${index + 1}/${previewNames.length} ${name}: ${result.kept}`)
    }
    return { name, ...result }
  })

  await copyFile(headersSource, path.join(distDir, '_headers'))

  const summary = {
    distDir,
    covers: coverResults.length,
    thumbs: thumbResults.length + generatedThumbs.length,
    generatedThumbs,
    previews: previewResults.length,
    ffmpeg,
    encoded: [...coverResults, ...thumbResults, ...previewResults].filter(item => item.kept === 'encoded').length,
    keptOriginal: [...coverResults, ...thumbResults, ...previewResults].filter(item => item.kept === 'original').length,
    copied: [...coverResults, ...thumbResults, ...previewResults].filter(item => item.kept === 'copied').length
  }
  console.log(
    `media build: ${summary.covers} covers, ${summary.thumbs} thumbs ` +
    `(${summary.generatedThumbs.length} generated), ${summary.previews} previews ` +
    `(ffmpeg ${summary.ffmpeg ? 'on' : 'off'}; encoded ${summary.encoded}, ` +
    `kept original ${summary.keptOriginal}, copied ${summary.copied})`
  )
  console.log(`dist: ${distDir}`)
  return summary
}
