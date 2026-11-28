import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const RANGE_SAMPLE_BYTES = 64
const DEFAULT_TIMEOUT_MS = 15_000
const MIME_TYPES = {
  image: new Set(['image/jpeg', 'image/png', 'image/webp']),
  video: new Set(['video/mp4'])
}

function fail(asset, reason, details = {}) {
  return { ok: false, label: asset?.label || asset?.url || '(unknown asset)', url: asset?.url || '', reason, ...details }
}

function hasImageSignature(bytes, mime) {
  if (mime === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (mime === 'image/png') {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value)
  }
  if (mime === 'image/webp') {
    return String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF'
      && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP'
  }
  return false
}

function hasMp4Signature(bytes) {
  // ISO-BMFF requires a box header before the `ftyp` brand. Fast-start MP4s
  // normally put it first; scanning the small sample also tolerates a leading box.
  for (let offset = 4; offset <= bytes.length - 4; offset += 1) {
    if (bytes[offset] !== 0x66 || bytes[offset + 1] !== 0x74 || bytes[offset + 2] !== 0x79 || bytes[offset + 3] !== 0x70) continue
    const boxSize = new DataView(bytes.buffer, bytes.byteOffset + offset - 4, 4).getUint32(0)
    if (boxSize === 1 || boxSize >= 8) return true
  }
  return false
}

async function readExactly(response, byteCount) {
  if (!response.body) throw new Error('206 response has no body')
  const reader = response.body.getReader()
  const chunks = []
  let received = 0
  try {
    while (received < byteCount) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value?.byteLength || received + value.byteLength > byteCount) {
        throw new Error(`range body exceeded ${byteCount} bytes`)
      }
      chunks.push(value)
      received += value.byteLength
    }
    if (received !== byteCount) throw new Error(`range body was ${received} bytes; expected ${byteCount}`)
    const result = new Uint8Array(byteCount)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.byteLength
    }
    return result
  } finally {
    try { await reader.cancel() } catch { /* the stream may already be closed */ }
    reader.releaseLock()
  }
}

/**
 * Check a remotely hosted media URL without downloading the whole asset.
 * A pass requires a real 206 byte-range response, matching Content-Range,
 * expected MIME type, exact sample length, and a recognizable file signature.
 * This does not prove the remainder is intact, decodable, or legally reusable.
 */
export async function checkRemoteAsset(asset, { fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  if (!asset || typeof asset.url !== 'string' || !asset.url.trim()) return fail(asset, 'missing URL')
  if (!MIME_TYPES[asset.type]) return fail(asset, `unsupported asset type: ${String(asset.type)}`)

  let url
  try {
    url = new URL(asset.url)
  } catch {
    return fail(asset, 'invalid URL')
  }
  if (url.protocol !== 'https:') return fail(asset, 'URL must use HTTPS')

  let response
  try {
    response = await fetchImpl(url.href, {
      method: 'GET',
      redirect: 'manual',
      headers: { Range: `bytes=0-${RANGE_SAMPLE_BYTES - 1}` },
      signal: AbortSignal.timeout(timeoutMs)
    })
  } catch (error) {
    return fail(asset, error instanceof Error ? `request failed: ${error.message}` : 'request failed')
  }

  try {
    if (response.status !== 206) return fail(asset, `expected HTTP 206 for Range request, got ${response.status}`)

    const contentType = (response.headers.get('content-type') || '').split(';', 1)[0].trim().toLowerCase()
    if (!MIME_TYPES[asset.type].has(contentType)) {
      return fail(asset, `unexpected Content-Type: ${contentType || '(missing)'}`, { status: response.status })
    }

    const range = response.headers.get('content-range') || ''
    const match = /^bytes 0-63\/(\d+)$/i.exec(range.trim())
    if (!match) return fail(asset, `unexpected Content-Range: ${range || '(missing)'}`, { status: response.status, contentType })
    const totalBytes = Number(match[1])
    if (!Number.isSafeInteger(totalBytes) || totalBytes < RANGE_SAMPLE_BYTES) {
      return fail(asset, `invalid total size in Content-Range: ${match[1]}`, { status: response.status, contentType, contentRange: range })
    }

    let sample
    try {
      sample = await readExactly(response, RANGE_SAMPLE_BYTES)
    } catch (error) {
      return fail(asset, error instanceof Error ? error.message : 'invalid range body', { status: response.status, contentType, contentRange: range })
    }

    const signatureOk = asset.type === 'image'
      ? hasImageSignature(sample, contentType)
      : hasMp4Signature(sample)
    if (!signatureOk) return fail(asset, `sample bytes do not match ${contentType}`, { status: response.status, contentType, contentRange: range })

    return {
      ok: true,
      label: asset.label || asset.url,
      url: asset.url,
      status: response.status,
      contentType,
      contentRange: range,
      totalBytes
    }
  } finally {
    try { await response.body?.cancel() } catch { /* response may already be consumed or closed */ }
  }
}

export async function checkManifest(manifestPath, options = {}) {
  const absolutePath = path.resolve(manifestPath)
  const manifest = JSON.parse(await readFile(absolutePath, 'utf8'))
  if (!manifest || !Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    throw new Error('manifest must contain a non-empty assets array')
  }
  const concurrency = Math.max(1, Math.min(8, Number(options.concurrency) || 4))
  const results = new Array(manifest.assets.length)
  let next = 0
  await Promise.all(Array.from({ length: Math.min(concurrency, manifest.assets.length) }, async () => {
    while (next < manifest.assets.length) {
      const index = next++
      results[index] = await checkRemoteAsset(manifest.assets[index], options)
    }
  }))
  return results
}

async function runCli() {
  const manifestPath = process.argv[2] || 'docs/pr-174-media-preflight.json'
  let results
  try {
    results = await checkManifest(manifestPath)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    console.error('Usage: node scripts/media/preflight-remote.mjs [manifest.json]')
    process.exitCode = 2
    return
  }

  for (const result of results) {
    if (result.ok) {
      console.log(`OK ${result.label}: HTTP ${result.status}, ${result.contentType}, ${result.contentRange}`)
    } else {
      console.error(`FAIL ${result.label}: ${result.reason}`)
    }
  }
  const passed = results.filter(result => result.ok).length
  console.log(`Remote media preflight: ${passed}/${results.length} passed`)
  if (passed !== results.length) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await runCli()
}
