import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { AVAILABLE_VIDEO_PREVIEWS } from '../app/data/videoPreviews'
import { assertDeployEnv } from '../scripts/media/lib/cloudflare.mjs'
import { QUESTPORTS_ACCOUNT_ID } from '../scripts/media/lib/constants.mjs'
import { buildMedia } from '../scripts/media/lib/build.mjs'
import { assertMediaComplete } from '../scripts/media/lib/guard.mjs'
import {
  commandExists,
  encodeImage,
  previewFfmpegArgs,
  targetHeight
} from '../scripts/media/lib/optimize.mjs'
import {
  mediaPathsFromSource,
  missingAssets,
  referencedMediaPaths,
  thumbUrlForCoverFile,
  videoPreviewSlugsFromSource
} from '../scripts/media/lib/references.mjs'
import worker from '../scripts/media/worker.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function run(bin: string, args: string[], cwd: string) {
  return new Promise<{ code: number | null, stdout: string, stderr: string }>((resolve, reject) => {
    const child = spawn(bin, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', chunk => { stdout += chunk })
    child.stderr.on('data', chunk => { stderr += chunk })
    child.on('error', reject)
    child.on('close', code => resolve({ code, stdout, stderr }))
  })
}

describe('referenced media paths', () => {
  it('derives the JPEG thumb from the cover basename', () => {
    expect(thumbUrlForCoverFile('gran_turismo_2_vr.jpg')).toBe('/covers/thumbs/gran_turismo_2_vr.jpg')
    expect(thumbUrlForCoverFile('ut99vr.png')).toBe('/covers/thumbs/ut99vr.jpg')
    expect(thumbUrlForCoverFile('notes.txt')).toBeNull()
  })

  it('parses AVAILABLE_VIDEO_PREVIEWS the same way the site does', async () => {
    const source = await readFile(path.join(repoRoot, 'app/data/videoPreviews.ts'), 'utf8')
    expect(videoPreviewSlugsFromSource(source)).toEqual([...AVAILABLE_VIDEO_PREVIEWS])
  })

  it('reads quoted cover paths and ignores the /covers/ prefix', () => {
    const source = `
      const DEFAULT_OG = '/covers/questports-og.png'
      if (path.startsWith('/covers/')) return path
      '/covers/ut99vr.png'
    `
    expect(mediaPathsFromSource(source + '\n`/covers/thumbs/${base}.jpg`\n')).toEqual([
      '/covers/questports-og.png',
      '/covers/ut99vr.png'
    ])
  })

  it('requires repo covers, derived thumbs, videoPreviews, and coverUrl files', async () => {
    const required = await referencedMediaPaths(repoRoot)
    expect(required.has('/covers/astroquest.jpg')).toBe(true)
    expect(required.has('/covers/thumbs/astroquest.jpg')).toBe(true)
    expect(required.has('/covers/thumbs/gran_turismo_2_vr.jpg')).toBe(true)
    expect(required.has('/previews/astroquest.mp4')).toBe(true)
    expect(required.has('/previews/gran-turismo-2-vr.mp4')).toBe(true)
    expect(required.has('/covers/questports-og.png')).toBe(true)
    expect(required.has('/covers/ut99vr.png')).toBe(true)
    expect(required.has('/covers/time-crisis-2-vr.png')).toBe(true)
    for (const slug of AVAILABLE_VIDEO_PREVIEWS) {
      expect(required.has(`/previews/${slug}.mp4`)).toBe(true)
    }
  })

  it('lists files that a partial build would drop', () => {
    const required = new Set(['/covers/a.jpg', '/previews/a.mp4'])
    const built = new Set(['/covers/a.jpg'])
    expect(missingAssets(required, built)).toEqual(['/previews/a.mp4'])
  })
})

describe('image optimize', () => {
  it('rounds height the same way as the PIL resize', () => {
    expect(targetHeight(920, 430, 600)).toBe(Math.round(430 * 600 / 920))
    expect(targetHeight(460, 215, 600)).toBe(215)
  })

  it('shrinks a 920px cover to 600px and a thumb to 120px', async () => {
    const wide = await sharp({
      create: { width: 920, height: 430, channels: 3, background: { r: 20, g: 80, b: 140 } }
    }).jpeg().toBuffer()
    const cover = await encodeImage(wide, { maxWidth: 600, format: 'jpeg' })
    expect(cover.width).toBe(600)
    expect(cover.height).toBe(targetHeight(920, 430, 600))
    const thumb = await encodeImage(cover.encoded, { maxWidth: 120, format: 'jpeg' })
    expect(thumb.width).toBe(120)
  })
})

describe('preview ffmpeg args', () => {
  it('matches the ops encode settings', () => {
    expect(previewFfmpegArgs('in.mp4', 'out.mp4')).toEqual([
      '-nostdin',
      '-loglevel', 'error',
      '-y',
      '-i', 'in.mp4',
      '-an',
      '-vf', "scale='min(854,iw)':-2",
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', '30',
      '-pix_fmt', 'yuv420p',
      '-profile:v', 'main',
      '-movflags', '+faststart',
      'out.mp4'
    ])
  })
})

describe('deploy env', () => {
  it('requires the token and the questports account, and lets a dry-run through', () => {
    expect(assertDeployEnv({}, { dryRun: true }).ok).toBe(true)
    expect(assertDeployEnv({}, { dryRun: false }).ok).toBe(false)
    expect(assertDeployEnv({
      CLOUDFLARE_API_TOKEN: 'secret',
      CLOUDFLARE_ACCOUNT_ID: 'not-the-account'
    }, { dryRun: false }).ok).toBe(false)
    expect(assertDeployEnv({
      CLOUDFLARE_API_TOKEN: 'secret',
      CLOUDFLARE_ACCOUNT_ID: QUESTPORTS_ACCOUNT_ID
    }, { dryRun: false }).ok).toBe(true)
  })
})

describe('wrangler config', () => {
  it('commits the media worker static-asset settings', async () => {
    const toml = await readFile(path.join(repoRoot, 'scripts/media/wrangler.toml'), 'utf8')
    expect(toml).toContain('name = "questports-media"')
    expect(toml).toContain('main = "worker.js"')
    expect(toml).toContain('compatibility_date = "2026-10-01"')
    expect(toml).toContain('workers_dev = true')
    expect(toml).toContain('directory = "./dist"')
    expect(toml).toContain('binding = "ASSETS"')
    expect(toml).toContain('html_handling = "none"')
    expect(toml).toContain('not_found_handling = "none"')
    expect(toml).toContain('run_worker_first = ["/previews/*"]')
    expect(toml).not.toContain('CLOUDFLARE_API_TOKEN')
    expect(toml).not.toContain('account_id')
  })

  it('commits the apk proxy worker without deploying it from package scripts', async () => {
    const toml = await readFile(path.join(repoRoot, 'workers/questports-apk-proxy/wrangler.toml'), 'utf8')
    expect(toml).toContain('name = "questports-apk-proxy"')
    expect(toml).toContain('compatibility_date = "2026-10-01"')
    const pkg = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'))
    const scripts = JSON.stringify(pkg.scripts)
    expect(scripts).not.toContain('questports-apk-proxy')
  })
})

describe('media guard and tiny build', () => {
  it('fails when the built set drops a referenced preview', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'qp-media-guard-'))
    try {
      await mkdir(path.join(dir, 'public/covers/thumbs'), { recursive: true })
      await mkdir(path.join(dir, 'public/previews'), { recursive: true })
      await mkdir(path.join(dir, 'dist/covers'), { recursive: true })
      const png = await sharp({
        create: { width: 20, height: 10, channels: 3, background: { r: 1, g: 2, b: 3 } }
      }).png().toBuffer()
      await writeFile(path.join(dir, 'public/covers/demo.png'), png)
      await writeFile(path.join(dir, 'dist/covers/demo.png'), png)
      await writeFile(path.join(dir, 'dist/_headers'), await readFile(path.join(repoRoot, 'scripts/media/_headers')))
      const videoSource = "export const AVAILABLE_VIDEO_PREVIEWS: string[] = [\n  'demo'\n]\n"
      const coverSource = "export const DEFAULT_OG = '/covers/demo.png'\n"
      await expect(assertMediaComplete({
        repoRoot: dir,
        distDir: path.join(dir, 'dist'),
        sources: { videoPreviewSource: videoSource, coverUrlSource: coverSource }
      })).rejects.toThrow(/demo\.mp4/)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('builds a cover, a 120px thumb, and a preview into dist', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'qp-media-build-'))
    const dist = path.join(dir, 'dist')
    try {
      await mkdir(path.join(dir, 'public/covers/thumbs'), { recursive: true })
      await mkdir(path.join(dir, 'public/previews'), { recursive: true })
      const png = await sharp({
        create: { width: 920, height: 430, channels: 3, background: { r: 40, g: 90, b: 160 } }
      }).png().toBuffer()
      await writeFile(path.join(dir, 'public/covers/demo.png'), png)
      if (commandExists('ffmpeg')) {
        const made = await run('ffmpeg', [
          '-nostdin', '-loglevel', 'error', '-y',
          '-f', 'lavfi', '-i', 'color=c=black:s=1280x720:d=0.2',
          '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
          path.join(dir, 'public/previews/demo.mp4')
        ], dir)
        expect(made.code).toBe(0)
      }
      const summary = await buildMedia({
        repoRoot: dir,
        distDir: dist,
        headersSource: path.join(repoRoot, 'scripts/media/_headers'),
        previewConcurrency: 1
      })
      expect(summary.covers).toBe(1)
      expect(summary.generatedThumbs).toEqual(['demo.jpg'])
      const coverMeta = await sharp(path.join(dist, 'covers/demo.png')).metadata()
      expect(coverMeta.width).toBeLessThanOrEqual(600)
      const thumbMeta = await sharp(path.join(dist, 'covers/thumbs/demo.jpg')).metadata()
      expect(thumbMeta.width).toBe(120)
      const videoSource = commandExists('ffmpeg')
        ? "export const AVAILABLE_VIDEO_PREVIEWS: string[] = [\n  'demo'\n]\n"
        : "export const AVAILABLE_VIDEO_PREVIEWS: string[] = [\n  'unused-not-in-public'\n]\n"
      if (!commandExists('ffmpeg')) {
        await writeFile(path.join(dir, 'public/previews/unused-not-in-public.mp4'), Buffer.from('not-a-real-mp4-but-present'))
        await writeFile(path.join(dist, 'previews/unused-not-in-public.mp4'), Buffer.from('not-a-real-mp4-but-present'))
      }
      const coverSource = "export const DEFAULT_OG = '/covers/demo.png'\n"
      if (commandExists('ffmpeg')) {
        await expect(assertMediaComplete({
          repoRoot: dir,
          distDir: dist,
          sources: { videoPreviewSource: videoSource, coverUrlSource: coverSource }
        })).resolves.toMatchObject({ required: expect.any(Number) })
      }
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})

describe('preview range worker', () => {
  const bytes = Uint8Array.from({ length: 10 }, (_, index) => index)

  function envWith(body: Uint8Array, headers: Record<string, string>) {
    return {
      ASSETS: {
        fetch: async () => new Response(body, { status: 200, headers })
      }
    }
  }

  it('answers CORS preflight without touching the asset', async () => {
    const res = await worker.fetch(new Request('https://media.example/previews/a.mp4', { method: 'OPTIONS' }), { ASSETS: { fetch: () => { throw new Error('no asset') } } })
    expect(res.status).toBe(204)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  it('returns 206 for a byte range and 416 past the end', async () => {
    const env = envWith(bytes, { 'Content-Length': '10', 'Content-Type': 'video/mp4' })
    const partial = await worker.fetch(new Request('https://media.example/previews/a.mp4', {
      headers: { Range: 'bytes=2-4' }
    }), env)
    expect(partial.status).toBe(206)
    expect(partial.headers.get('Content-Range')).toBe('bytes 2-4/10')
    expect(partial.headers.get('Accept-Ranges')).toBe('bytes')
    expect(partial.headers.get('Cache-Control')).toContain('immutable')
    expect(new Uint8Array(await partial.arrayBuffer())).toEqual(Uint8Array.of(2, 3, 4))

    const suffix = await worker.fetch(new Request('https://media.example/previews/a.mp4', {
      headers: { Range: 'bytes=-3' }
    }), env)
    expect(suffix.status).toBe(206)
    expect(new Uint8Array(await suffix.arrayBuffer())).toEqual(Uint8Array.of(7, 8, 9))

    const head = await worker.fetch(new Request('https://media.example/previews/a.mp4', {
      method: 'HEAD',
      headers: { Range: 'bytes=0-1' }
    }), env)
    expect(head.status).toBe(206)
    expect(await head.text()).toBe('')

    const tooFar = await worker.fetch(new Request('https://media.example/previews/a.mp4', {
      headers: { Range: 'bytes=20-30' }
    }), env)
    expect(tooFar.status).toBe(416)
    expect(tooFar.headers.get('Content-Range')).toBe('bytes */10')
    expect(tooFar.headers.get('Cache-Control')).toBe('no-store')
  })

  it('never stamps a one-year cache on a file that is not there yet', async () => {
    const env = {
      ASSETS: { fetch: async () => new Response('not found', { status: 404 }) }
    }
    const miss = await worker.fetch(new Request('https://media.example/previews/late.mp4'), env)
    expect(miss.status).toBe(404)
    expect(miss.headers.get('Cache-Control')).toBe('no-store')
    expect(miss.headers.get('Cache-Control')).not.toContain('immutable')
    expect(miss.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  it('buffers a stream that has no content length', async () => {
    const env = envWith(bytes, { 'Content-Type': 'video/mp4' })
    const res = await worker.fetch(new Request('https://media.example/previews/a.mp4', {
      headers: { Range: 'bytes=0-1' }
    }), env)
    expect(res.status).toBe(206)
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(Uint8Array.of(0, 1))
  })
})

describe('wrangler deploy --dry-run', () => {
  it('packages a worker and the ASSETS binding without uploading', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'qp-wrangler-'))
    try {
      await mkdir(path.join(dir, 'dist'), { recursive: true })
      await writeFile(path.join(dir, 'worker.js'), 'export default { fetch() { return new Response("ok") } }\n')
      await writeFile(path.join(dir, 'dist/hi.txt'), 'hello')
      await writeFile(path.join(dir, 'dist/_headers'), await readFile(path.join(repoRoot, 'scripts/media/_headers')))
      await writeFile(path.join(dir, 'wrangler.toml'), [
        'name = "questports-media"',
        'main = "worker.js"',
        'compatibility_date = "2026-10-01"',
        'workers_dev = true',
        'preview_urls = false',
        '',
        '[assets]',
        'directory = "./dist"',
        'binding = "ASSETS"',
        'html_handling = "none"',
        'not_found_handling = "none"',
        'run_worker_first = ["/previews/*"]',
        ''
      ].join('\n'))
      const wrangler = path.join(repoRoot, 'node_modules/wrangler/bin/wrangler.js')
      const result = await run(process.execPath, [
        wrangler, 'deploy', '--dry-run', '--config', path.join(dir, 'wrangler.toml')
      ], dir)
      expect(result.code, result.stderr).toBe(0)
      expect(result.stdout).toContain('env.ASSETS')
      expect(result.stdout).toContain('--dry-run: exiting now')
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  }, 30000)
})
