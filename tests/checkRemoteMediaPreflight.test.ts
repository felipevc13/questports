import { describe, expect, it, vi } from 'vitest'
import { checkRemoteAsset, RANGE_SAMPLE_BYTES } from '../scripts/media/preflight-remote.mjs'

const sampleBytes = (signature: number[]) => {
  const bytes = new Uint8Array(RANGE_SAMPLE_BYTES)
  bytes.set(signature)
  return bytes
}

function rangeResponse({
  status = 206,
  type = 'image/png',
  range = `bytes 0-${RANGE_SAMPLE_BYTES - 1}/4096`,
  body = sampleBytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
}: {
  status?: number
  type?: string
  range?: string
  body?: Uint8Array
} = {}) {
  return new Response(body, {
    status,
    headers: { 'content-type': type, 'content-range': range }
  })
}

const imageAsset = { label: 'cover', type: 'image', url: 'https://media.example/covers/cover.png' }

 describe('remote media preflight', () => {
  it('requires and reports a correctly typed 206 byte-range image response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(rangeResponse({ type: 'image/png; charset=binary' }))
    const result = await checkRemoteAsset(imageAsset, { fetchImpl })

    expect(result).toMatchObject({ ok: true, status: 206, contentType: 'image/png', contentRange: 'bytes 0-63/4096', totalBytes: 4096 })
    expect(fetchImpl).toHaveBeenCalledWith(imageAsset.url, expect.objectContaining({
      method: 'GET',
      headers: { Range: 'bytes=0-63' },
      redirect: 'manual'
    }))
  })

  it('accepts an MP4 signature only with the video MIME type and a real range', async () => {
    const mp4 = sampleBytes([0, 0, 0, 12, 0x66, 0x72, 0x65, 0x65, 0, 0, 0, 0, 0, 0, 0, 16, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0, 0, 0, 0])
    const result = await checkRemoteAsset(
      { label: 'preview', type: 'video', url: 'https://media.example/previews/clip.mp4' },
      { fetchImpl: vi.fn().mockResolvedValue(rangeResponse({ type: 'video/mp4', body: mp4 })) }
    )

    expect(result.ok).toBe(true)
  })

  it('rejects a 200 response even when its headers look like media', async () => {
    const result = await checkRemoteAsset(imageAsset, {
      fetchImpl: vi.fn().mockResolvedValue(rangeResponse({ status: 200 }))
    })

    expect(result).toMatchObject({ ok: false, reason: 'expected HTTP 206 for Range request, got 200' })
  })

  it('rejects a wrong or missing Content-Range', async () => {
    const result = await checkRemoteAsset(imageAsset, {
      fetchImpl: vi.fn().mockResolvedValue(rangeResponse({ range: 'bytes 0-63/*' }))
    })

    expect(result.ok).toBe(false)
    expect(result.reason).toContain('unexpected Content-Range')
  })

  it('rejects an incorrect MIME type', async () => {
    const result = await checkRemoteAsset(imageAsset, {
      fetchImpl: vi.fn().mockResolvedValue(rangeResponse({ type: 'text/html' }))
    })

    expect(result.ok).toBe(false)
    expect(result.reason).toContain('unexpected Content-Type')
  })

  it('rejects a short range body and a MIME/signature mismatch', async () => {
    const short = await checkRemoteAsset(imageAsset, {
      fetchImpl: vi.fn().mockResolvedValue(rangeResponse({ body: new Uint8Array([0x89, 0x50]) }))
    })
    const html = await checkRemoteAsset(imageAsset, {
      fetchImpl: vi.fn().mockResolvedValue(rangeResponse({ body: sampleBytes([0x3c, 0x68, 0x74, 0x6d, 0x6c]) }))
    })

    expect(short.ok).toBe(false)
    expect(short.reason).toContain('range body was 2 bytes')
    expect(html).toMatchObject({ ok: false, reason: 'sample bytes do not match image/png' })
  })

  it('refuses non-HTTPS URLs without making a request', async () => {
    const fetchImpl = vi.fn()
    const result = await checkRemoteAsset({ ...imageAsset, url: 'http://media.example/cover.png' }, { fetchImpl })

    expect(result).toMatchObject({ ok: false, reason: 'URL must use HTTPS' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('reports request failures without treating them as passes', async () => {
    const result = await checkRemoteAsset(imageAsset, {
      fetchImpl: vi.fn().mockRejectedValue(new Error('network unavailable'))
    })

    expect(result).toMatchObject({ ok: false, reason: 'request failed: network unavailable' })
  })
})
