import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { REPO_ROOT } from './constants.mjs'

const MEDIA_FILE = /^\/(?:covers|previews)\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|webp|mp4)$/

/**
 * Thumbnail URL coverUrl.coverThumbUrl builds for a top-level cover file.
 * The thumb follows the cover basename, not the port slug, and is always JPEG.
 */
export function thumbUrlForCoverFile(filename) {
  const base = filename.replace(/\.(png|jpe?g|webp)$/i, '')
  if (!base || base === filename || base.includes('/') || base.includes('\\')) return null
  return `/covers/thumbs/${base}.jpg`
}

export function videoPreviewSlugsFromSource(source) {
  const match = source.match(/export const AVAILABLE_VIDEO_PREVIEWS\s*(?::[^=]+)?=\s*\[([\s\S]*?)\]/)
  if (!match) {
    throw new Error('Could not find AVAILABLE_VIDEO_PREVIEWS in app/data/videoPreviews.ts')
  }
  const slugs = [...match[1].matchAll(/'([a-z0-9-]+)'/g)].map(item => item[1])
  if (slugs.length === 0) throw new Error('AVAILABLE_VIDEO_PREVIEWS is empty')
  return slugs
}

/** Quoted /covers and /previews file paths. Prefixes such as '/covers/' are ignored. */
export function mediaPathsFromSource(source) {
  const found = []
  const re = /['"`](\/(?:covers|previews)\/[^'"`?#\s]+)['"`]/g
  let match
  while ((match = re.exec(source))) {
    if (MEDIA_FILE.test(match[1])) found.push(match[1])
  }
  return found
}

async function walkFiles(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch (err) {
    if (err && err.code === 'ENOENT') return out
    throw err
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...await walkFiles(full))
    else if (entry.isFile()) out.push(full)
  }
  return out
}

/**
 * Every asset a static deploy must still contain.
 * Workers static assets replace the whole set, so a missing file here would 404 in production.
 *
 * Sources, matching the live site:
 * - public/covers, public/covers/thumbs, public/previews (the deployed asset set)
 * - AVAILABLE_VIDEO_PREVIEWS slugs → /previews/<slug>.mp4
 * - quoted paths in app/data/coverUrl.ts
 * - the thumb coverThumbUrl would request for each top-level cover
 */
export async function referencedMediaPaths(repoRoot = REPO_ROOT, sources = {}) {
  const required = new Set()
  const coversDir = path.join(repoRoot, 'public/covers')
  const thumbsDir = path.join(coversDir, 'thumbs')
  const previewsDir = path.join(repoRoot, 'public/previews')

  for (const file of await walkFiles(coversDir)) {
    const rel = path.relative(coversDir, file)
    if (rel === '_headers' || rel.startsWith(`thumbs${path.sep}`)) continue
    if (rel.includes(path.sep)) continue
    const urlPath = `/covers/${rel}`
    required.add(urlPath)
    const thumb = thumbUrlForCoverFile(path.basename(file))
    if (thumb) required.add(thumb)
  }

  for (const file of await walkFiles(thumbsDir)) {
    required.add(`/covers/thumbs/${path.relative(thumbsDir, file).split(path.sep).join('/')}`)
  }

  for (const file of await walkFiles(previewsDir)) {
    const rel = path.relative(previewsDir, file).split(path.sep).join('/')
    required.add(`/previews/${rel}`)
  }

  const videoSource = sources.videoPreviewSource
    ?? await readFile(path.join(repoRoot, 'app/data/videoPreviews.ts'), 'utf8')
  for (const slug of videoPreviewSlugsFromSource(videoSource)) {
    required.add(`/previews/${slug}.mp4`)
  }

  const coverSource = sources.coverUrlSource
    ?? await readFile(path.join(repoRoot, 'app/data/coverUrl.ts'), 'utf8')
  for (const urlPath of mediaPathsFromSource(coverSource)) required.add(urlPath)

  return required
}

export async function builtMediaPaths(distDir) {
  const built = new Set()
  for (const file of await walkFiles(distDir)) {
    const rel = path.relative(distDir, file).split(path.sep).join('/')
    if (rel === '_headers' || rel.startsWith('_')) continue
    built.add(`/${rel}`)
  }
  return built
}

export function missingAssets(required, built) {
  return [...required].filter(urlPath => !built.has(urlPath)).sort()
}
