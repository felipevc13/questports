import { createEvent } from 'h3'
import { afterEach, describe, expect, it, vi } from 'vitest'
import handler from '../server/api/apk-proxy.get'

const APK = 'https://github.com/Team-Beef-Studios/Doom3Quest/releases/download/v1/Doom3Quest.apk'
const ZIP = 'https://github.com/test/RoadRash/releases/download/v0.1.0/RoadRash.apk.zip'

function mockEvent(search: string) {
  const headers = new Map<string, unknown>()
  const req = { url: `/api/apk-proxy?${search}`, method: 'GET', headers: {} }
  const res = {
    statusCode: 200,
    statusMessage: '',
    writableEnded: false,
    headersSent: false,
    socket: undefined,
    body: undefined as unknown,
    setHeader(name: string, value: unknown) {
      headers.set(name.toLowerCase(), value)
    },
    getHeader(name: string) {
      return headers.get(name.toLowerCase())
    },
    removeHeader(name: string) {
      headers.delete(name.toLowerCase())
    },
    end(data?: unknown) {
      this.writableEnded = true
      this.body = data
    },
    write() {
      return true
    },
    on() {}
  }
  return { event: createEvent(req as any, res as any), res }
}

function upstream(status: number, headers: Record<string, string>, options?: { cancel?: () => void; json?: unknown }) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    body: {
      cancel: async () => {
        options?.cancel?.()
      }
    },
    json: async () => options?.json
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apk proxy handler', () => {
  it('302s a plain apk for redirect=1 without downloading it', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { event, res } = mockEvent(`redirect=1&url=${encodeURIComponent(APK)}`)
    await handler(event)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(302)
    expect(res.getHeader('location')).toBe(APK)
  })

  it('resolves a GitHub release page, then redirects the apk', async () => {
    const fetchMock = vi.fn(async (input: string) => {
      expect(String(input)).toContain('api.github.com/repos/Team-Beef-Studios/Doom3Quest/releases')
      return upstream(200, { 'content-type': 'application/json' }, {
        json: [{
          draft: false,
          assets: [{ name: 'Doom3Quest.apk', browser_download_url: APK }]
        }]
      })
    })
    vi.stubGlobal('fetch', fetchMock)
    const page = 'https://github.com/Team-Beef-Studios/Doom3Quest/releases/latest'
    const { event, res } = mockEvent(`redirect=1&url=${encodeURIComponent(page)}`)
    await handler(event)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(res.statusCode).toBe(302)
    expect(res.getHeader('location')).toBe(APK)
  })

  it('still streams a zip when redirect=1, with the unwrap header', async () => {
    const calls: string[] = []
    vi.stubGlobal('fetch', vi.fn(async (_input: string, init?: { method?: string }) => {
      calls.push(init?.method || 'GET')
      return upstream(200, {
        'content-type': 'application/zip',
        'content-length': '1024'
      })
    }))
    const { event, res } = mockEvent(`redirect=1&url=${encodeURIComponent(ZIP)}`)
    await handler(event)
    expect(calls).toEqual(['HEAD', 'GET'])
    expect(res.statusCode).toBe(200)
    expect(String(res.getHeader('x-questports-unwrap'))).toBe('apk')
    expect(String(res.getHeader('content-type'))).toContain('application/zip')
  })

  it('returns 413 from HEAD and does not GET the body', async () => {
    const calls: string[] = []
    let cancelled = false
    vi.stubGlobal('fetch', vi.fn(async (_input: string, init?: { method?: string }) => {
      const method = init?.method || 'GET'
      calls.push(method)
      return upstream(200, { 'content-length': String(200 * 1024 * 1024) }, {
        cancel: () => {
          cancelled = true
        }
      })
    }))
    const { event, res } = mockEvent(`url=${encodeURIComponent(APK)}`)
    await handler(event)
    expect(calls).toEqual(['HEAD'])
    expect(cancelled).toBe(true)
    expect(res.statusCode).toBe(413)
    expect(JSON.parse(String(res.body))).toEqual({
      reason: 'too_large',
      size: 200 * 1024 * 1024,
      directUrl: APK
    })
  })

  it('aborts a GET when HEAD has no length and the body is over the cap', async () => {
    const calls: string[] = []
    let cancelled = false
    vi.stubGlobal('fetch', vi.fn(async (_input: string, init?: { method?: string }) => {
      const method = init?.method || 'GET'
      calls.push(method)
      if (method === 'HEAD') return upstream(200, {})
      return upstream(200, {
        'content-type': 'application/vnd.android.package-archive',
        'content-length': String(180 * 1024 * 1024)
      }, {
        cancel: () => {
          cancelled = true
        }
      })
    }))
    const { event, res } = mockEvent(`url=${encodeURIComponent(APK)}`)
    await handler(event)
    expect(calls).toEqual(['HEAD', 'GET'])
    expect(cancelled).toBe(true)
    expect(res.statusCode).toBe(413)
    expect(JSON.parse(String(res.body)).reason).toBe('too_large')
  })
})
