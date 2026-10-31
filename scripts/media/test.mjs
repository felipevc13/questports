import { spawn } from 'node:child_process'
import path from 'node:path'
import sharp from 'sharp'
import { DIST_DIR, MEDIA_HOST } from './lib/constants.mjs'
import { assertMediaComplete } from './lib/guard.mjs'
import { builtMediaPaths } from './lib/references.mjs'

const live = process.argv.includes('--live') || process.env.MEDIA_TEST_LIVE === '1'

function curl(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('curl', ['-sS', '--max-time', '30', ...args], { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    child.stdout.on('data', chunk => { out += chunk })
    child.stderr.on('data', chunk => { err += chunk })
    child.on('error', reject)
    child.on('close', code => {
      if (code === 0) resolve(out)
      else reject(new Error(`curl exited ${code}: ${err.trim()}`))
    })
  })
}

function header(raw, name) {
  const line = raw.split('\n').find(item => item.toLowerCase().startsWith(`${name.toLowerCase()}:`))
  return line ? line.slice(line.indexOf(':') + 1).trim() : ''
}

async function expectStatus(label, url, extraArgs, status) {
  const raw = await curl(['-o', '/dev/null', '-D', '-', ...extraArgs, url])
  const statusLine = raw.split('\n').find(line => line.startsWith('HTTP/')) || ''
  const code = Number(statusLine.split(' ')[1])
  if (code !== status) {
    throw new Error(`${label}: expected HTTP ${status}, got ${statusLine.trim() || 'no status'}`)
  }
  return raw
}

async function liveSmoke() {
  const base = MEDIA_HOST
  const jpg = await expectStatus('cover jpg', `${base}/covers/astroquest.jpg`, ['-H', 'Origin: https://questports.com'], 200)
  if (!header(jpg, 'cache-control').includes('immutable')) throw new Error('cover jpg is missing immutable cache')
  if (!header(jpg, 'access-control-allow-origin')) throw new Error('cover jpg is missing CORS')

  await expectStatus('cover png', `${base}/covers/generals-zero-hour-xr.png`, [], 200)
  const mp4 = await expectStatus('mp4', `${base}/previews/astroquest.mp4`, [], 200)
  if (!header(mp4, 'content-type').includes('video/mp4')) throw new Error(`mp4 content-type: ${header(mp4, 'content-type')}`)

  const ranged = await expectStatus('mp4 range', `${base}/previews/hexen2vr.mp4`, ['-H', 'Range: bytes=0-1'], 206)
  if (!header(ranged, 'content-range').startsWith('bytes 0-1/')) {
    throw new Error(`range content-range: ${header(ranged, 'content-range')}`)
  }
  if (!header(ranged, 'accept-ranges').toLowerCase().includes('bytes')) {
    throw new Error('range response is missing Accept-Ranges')
  }

  await expectStatus('unsatisfiable', `${base}/previews/hexen2vr.mp4`, ['-H', 'Range: bytes=99999999-'], 416)
  const missing = await expectStatus('missing', `${base}/previews/nope.mp4`, [], 404)
  if (header(missing, 'cache-control').includes('immutable')) {
    throw new Error('a missing preview must not be cached for a year')
  }
  console.log('live smoke: cover, thumb host, mp4, range 206, 416, and 404 ok')
}

async function spotCheckThumbs() {
  const built = await builtMediaPaths(DIST_DIR)
  const thumbs = [...built].filter(item => item.startsWith('/covers/thumbs/'))
  if (thumbs.length === 0) throw new Error('build has no thumbnails')
  for (const urlPath of thumbs) {
    const file = path.join(DIST_DIR, urlPath.slice(1))
    const meta = await sharp(file, { failOn: 'none' }).metadata()
    if (meta.width && meta.width > 120) {
      throw new Error(`${urlPath} is ${meta.width}px wide after optimize (max 120)`)
    }
  }
}

try {
  const check = await assertMediaComplete()
  await spotCheckThumbs()
  console.log(`local media test: ${check.required} referenced files, ${check.built} built files, headers ok`)
  if (live) await liveSmoke()
} catch (err) {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
}
