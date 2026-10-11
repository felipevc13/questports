import { spawn, spawnSync } from 'node:child_process'
import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { COVER_MAX_WIDTH, JPEG_QUALITY, PREVIEW_MAX_WIDTH, THUMB_WIDTH } from './constants.mjs'

export function targetHeight(width, height, maxWidth) {
  if (!width || !height || width <= maxWidth) return height
  return Math.max(1, Math.round(height * maxWidth / width))
}

/**
 * Resize and recompress one image the way optimize_covers.py does.
 * JPEG quality 82 progressive, PNG optimized, Lanczos, keep the original bytes
 * when the result is not smaller. `force: true` always writes the encoded bytes
 * (used for a thumb generated from a cover, where there is no thumb original).
 */
export async function encodeImage(input, { maxWidth, format }) {
  const meta = await sharp(input, { failOn: 'none' }).metadata()
  const width = meta.width || 0
  const height = meta.height || 0
  let pipeline = sharp(input, { failOn: 'none' })
  if (width > maxWidth && height > 0) {
    pipeline = pipeline.resize(maxWidth, targetHeight(width, height, maxWidth), {
      fit: 'fill',
      kernel: 'lanczos3'
    })
  }
  if (format === 'png') {
    pipeline = pipeline.png({ compressionLevel: 9, effort: 10 })
  } else if (format === 'webp') {
    pipeline = pipeline.webp({ quality: JPEG_QUALITY })
  } else {
    pipeline = pipeline
      .flatten({ background: { r: 0, g: 0, b: 0 } })
      .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: false, chromaSubsampling: '4:2:0' })
  }
  const encoded = await pipeline.toBuffer()
  const info = await sharp(encoded, { failOn: 'none' }).metadata()
  return { encoded, width: info.width || 0, height: info.height || 0 }
}

export function imageFormat(filename) {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.png') return 'png'
  if (ext === '.webp') return 'webp'
  if (ext === '.jpg' || ext === '.jpeg') return 'jpeg'
  return null
}

export async function writeOptimizedImage(src, dest, options) {
  const input = await readFile(src)
  const format = options.format || imageFormat(src)
  if (!format) {
    await mkdir(path.dirname(dest), { recursive: true })
    await copyFile(src, dest)
    return { kept: 'copied', bytes: input.length, sourceBytes: input.length, width: 0, height: 0 }
  }
  const { encoded, width, height } = await encodeImage(input, { maxWidth: options.maxWidth, format })
  await mkdir(path.dirname(dest), { recursive: true })
  if (options.force || encoded.length < input.length) {
    await writeFile(dest, encoded)
    return { kept: 'encoded', bytes: encoded.length, sourceBytes: input.length, width, height }
  }
  await copyFile(src, dest)
  const meta = await sharp(input, { failOn: 'none' }).metadata()
  return {
    kept: 'original',
    bytes: input.length,
    sourceBytes: input.length,
    width: meta.width || 0,
    height: meta.height || 0
  }
}

/** ffmpeg argv matching qp-media/optimize.sh. One argv element for the scale filter. */
export function previewFfmpegArgs(input, output) {
  return [
    '-nostdin',
    '-loglevel', 'error',
    '-y',
    '-i', input,
    '-an',
    '-vf', `scale='min(${PREVIEW_MAX_WIDTH},iw)':-2`,
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '30',
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'main',
    '-movflags', '+faststart',
    output
  ]
}

export function commandExists(bin) {
  const result = spawnSync(bin, ['-version'], { stdio: 'ignore' })
  return result.status === 0
}

export function runCommand(bin, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    child.stderr.on('data', chunk => {
      err += chunk.toString()
      if (err.length > 4000) err = err.slice(-4000)
    })
    child.on('error', reject)
    child.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`${bin} exited ${code}: ${err.trim()}`))
    })
  })
}

/**
 * Re-encode a preview when ffmpeg is on PATH. Keep the source file when the
 * re-encode is not smaller. When ffmpeg is absent, copy the source so the
 * asset set stays complete.
 */
export async function optimizePreviewFile(src, dest, options = {}) {
  const bin = options.ffmpegBin || 'ffmpeg'
  await mkdir(path.dirname(dest), { recursive: true })
  if (!commandExists(bin)) {
    await copyFile(src, dest)
    const sourceBytes = (await stat(src)).size
    return { kept: 'copied', bytes: sourceBytes, sourceBytes, ffmpeg: false }
  }
  const tmp = `${dest}.tmp.mp4`
  try {
    await runCommand(bin, previewFfmpegArgs(src, tmp))
    const sourceBytes = (await stat(src)).size
    const encodedBytes = (await stat(tmp)).size
    if (encodedBytes < sourceBytes) {
      await rm(dest, { force: true })
      const { rename } = await import('node:fs/promises')
      await rename(tmp, dest)
      return { kept: 'encoded', bytes: encodedBytes, sourceBytes, ffmpeg: true }
    }
    await rm(tmp, { force: true })
    await copyFile(src, dest)
    return { kept: 'original', bytes: sourceBytes, sourceBytes, ffmpeg: true }
  } catch (err) {
    await rm(tmp, { force: true })
    throw err
  }
}

export async function mapPool(items, limit, fn) {
  const results = new Array(items.length)
  let cursor = 0
  const workers = Math.max(1, Math.min(limit, items.length || 1))
  async function worker() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await fn(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: workers }, () => worker()))
  return results
}

export { COVER_MAX_WIDTH, THUMB_WIDTH }
