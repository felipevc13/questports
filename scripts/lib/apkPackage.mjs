/**
 * Read the Android package name of a remote APK (or a ZIP that bundles one)
 * without downloading the whole file: HTTP Range requests fetch the ZIP
 * central directory and the compressed AndroidManifest.xml entry, then the
 * binary XML is decoded for <manifest package="...">.
 *
 * Shared by scripts/verify-apk-packages.mjs and scripts/sync-github-stats.js.
 */
import { inflateRawSync } from 'node:zlib'

const UA = { 'User-Agent': 'QuestPorts-Verifier/1.0' }

// ---------- Remote ZIP reading via Range ----------
export class RemoteZip {
  constructor(url) { this.url = url }

  async init() {
    const head = await fetch(this.url, { method: 'HEAD', redirect: 'follow', headers: UA })
    this.finalUrl = head.url
    this.size = Number(head.headers.get('content-length') || 0)
    if (!this.size) {
      // some hosts don't return length on HEAD
      const r = await fetch(this.url, { headers: { ...UA, Range: 'bytes=0-0' }, redirect: 'follow' })
      const cr = r.headers.get('content-range') || ''
      this.size = Number(cr.split('/')[1] || 0)
      this.finalUrl = r.url
      await r.body?.cancel()
    }
    if (!this.size) {
      // Host without Range/length support: download whole file into memory
      const r = await fetch(this.url, { headers: UA, redirect: 'follow' })
      this.buf = Buffer.from(await r.arrayBuffer())
      this.size = this.buf.length
      this.finalUrl = r.url
    }
  }

  async range(start, end) {
    if (this.buf) return this.buf.subarray(start, end + 1)
    const r = await fetch(this.finalUrl, { headers: { ...UA, Range: `bytes=${start}-${end}` } })
    if (r.status !== 206 && r.status !== 200) throw new Error(`Range HTTP ${r.status}`)
    const buf = Buffer.from(await r.arrayBuffer())
    if (r.status === 200) return buf.subarray(start, end + 1) // server ignored range
    return buf
  }

  async entries() {
    const tailLen = Math.min(this.size, 66000)
    const tail = await this.range(this.size - tailLen, this.size - 1)
    const eocd = tail.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
    if (eocd < 0) throw new Error('Not a ZIP (no EOCD)')
    let cdSize = tail.readUInt32LE(eocd + 12)
    let cdOffset = tail.readUInt32LE(eocd + 16)
    if (cdOffset === 0xffffffff) {
      // ZIP64
      const loc = tail.lastIndexOf(Buffer.from([0x50, 0x4b, 0x06, 0x07]))
      const z64Off = Number(tail.readBigUInt64LE(loc + 8))
      const z64 = await this.range(z64Off, z64Off + 56)
      cdSize = Number(z64.readBigUInt64LE(40))
      cdOffset = Number(z64.readBigUInt64LE(48))
    }
    const cd = await this.range(cdOffset, cdOffset + cdSize - 1)
    const out = []
    let p = 0
    while (p + 46 <= cd.length && cd.readUInt32LE(p) === 0x02014b50) {
      const method = cd.readUInt16LE(p + 10)
      let compSize = cd.readUInt32LE(p + 20)
      let uncompSize = cd.readUInt32LE(p + 24)
      const nameLen = cd.readUInt16LE(p + 28)
      const extraLen = cd.readUInt16LE(p + 30)
      const commentLen = cd.readUInt16LE(p + 32)
      let localOffset = cd.readUInt32LE(p + 42)
      const name = cd.subarray(p + 46, p + 46 + nameLen).toString('utf8')
      // ZIP64 extra field
      let e = p + 46 + nameLen
      const eEnd = e + extraLen
      while (e + 4 <= eEnd) {
        const id = cd.readUInt16LE(e); const len = cd.readUInt16LE(e + 2)
        if (id === 0x0001) {
          let q = e + 4
          if (uncompSize === 0xffffffff) { uncompSize = Number(cd.readBigUInt64LE(q)); q += 8 }
          if (compSize === 0xffffffff) { compSize = Number(cd.readBigUInt64LE(q)); q += 8 }
          if (localOffset === 0xffffffff) { localOffset = Number(cd.readBigUInt64LE(q)) }
        }
        e += 4 + len
      }
      out.push({ name, method, compSize, uncompSize, localOffset })
      p += 46 + nameLen + extraLen + commentLen
    }
    return out
  }

  async read(entry) {
    const lh = await this.range(entry.localOffset, entry.localOffset + 29)
    const dataStart = entry.localOffset + 30 + lh.readUInt16LE(26) + lh.readUInt16LE(28)
    const raw = entry.compSize ? await this.range(dataStart, dataStart + entry.compSize - 1) : Buffer.alloc(0)
    if (entry.method === 0) return raw
    if (entry.method === 8) return inflateRawSync(raw)
    throw new Error(`Unsupported compression method ${entry.method}`)
  }
}

// ---------- Android binary XML: extract manifest package ----------
export function parseAxmlManifest(buf) {
  if (buf.readUInt16LE(0) !== 0x0003) throw new Error('Not binary XML')
  let p = buf.readUInt16LE(2)
  let strings = []
  const info = {}
  while (p < buf.length) {
    const type = buf.readUInt16LE(p)
    const headerSize = buf.readUInt16LE(p + 2)
    const size = buf.readUInt32LE(p + 4)
    if (type === 0x0001) {
      const count = buf.readUInt32LE(p + 8)
      const flags = buf.readUInt32LE(p + 16)
      const strStart = buf.readUInt32LE(p + 20)
      const utf8 = (flags & 0x100) !== 0
      strings = []
      for (let i = 0; i < count; i++) {
        let off = p + strStart + buf.readUInt32LE(p + headerSize + i * 4)
        if (utf8) {
          let n = buf[off++]; if (n & 0x80) off++
          let len = buf[off++]; if (len & 0x80) len = ((len & 0x7f) << 8) | buf[off++]
          strings.push(buf.subarray(off, off + len).toString('utf8'))
        } else {
          let len = buf.readUInt16LE(off); off += 2
          if (len & 0x8000) { len = ((len & 0x7fff) << 16) | buf.readUInt16LE(off); off += 2 }
          strings.push(buf.subarray(off, off + len * 2).toString('utf16le'))
        }
      }
    } else if (type === 0x0102) {
      const tagName = strings[buf.readUInt32LE(p + 20)]
      const attrStart = buf.readUInt16LE(p + 24)
      const attrSize = buf.readUInt16LE(p + 26)
      const attrCount = buf.readUInt16LE(p + 28)
      const base = p + 16 + attrStart
      const attrs = {}
      for (let i = 0; i < attrCount; i++) {
        const a = base + i * attrSize
        const name = strings[buf.readUInt32LE(a + 4)]
        const rawIdx = buf.readInt32LE(a + 8)
        const dataType = buf[a + 15]
        const data = buf.readUInt32LE(a + 16)
        attrs[name] = rawIdx >= 0 ? strings[rawIdx] : (dataType === 0x03 ? strings[data] : data)
      }
      if (tagName === 'manifest') {
        info.package = attrs.package
        info.versionName = attrs.versionName
      }
      if (tagName === 'application' || tagName === 'activity') return info
    }
    if (!size) break
    p += size
  }
  return info
}

export async function readApkPackage(url) {
  const zip = new RemoteZip(url)
  await zip.init()
  const entries = await zip.entries()
  const manifest = entries.find(e => e.name === 'AndroidManifest.xml')
  if (manifest) {
    return { ...parseAxmlManifest(await zip.read(manifest)), apk: decodeURIComponent(zip.finalUrl.split('/').pop().split('?')[0]) }
  }
  // ZIP bundle containing APK(s): pick the Quest one, read it in memory
  const apks = entries.filter(e => e.name.toLowerCase().endsWith('.apk'))
  if (!apks.length) throw new Error('ZIP has no AndroidManifest and no inner .apk')
  const inner = apks.find(e => /quest|vr|oculus|openxr/i.test(e.name)) || apks[0]
  if (inner.compSize > 600 * 1024 * 1024) throw new Error(`Inner APK too large (${inner.name})`)
  const innerBuf = await zip.read(inner)
  // parse inner zip from memory
  const eocd = innerBuf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  const cdOffset = innerBuf.readUInt32LE(eocd + 16)
  let p = cdOffset
  while (innerBuf.readUInt32LE(p) === 0x02014b50) {
    const method = innerBuf.readUInt16LE(p + 10)
    const compSize = innerBuf.readUInt32LE(p + 20)
    const nameLen = innerBuf.readUInt16LE(p + 28)
    const extraLen = innerBuf.readUInt16LE(p + 30)
    const commentLen = innerBuf.readUInt16LE(p + 32)
    const lo = innerBuf.readUInt32LE(p + 42)
    const name = innerBuf.subarray(p + 46, p + 46 + nameLen).toString()
    if (name === 'AndroidManifest.xml') {
      const ds = lo + 30 + innerBuf.readUInt16LE(lo + 26) + innerBuf.readUInt16LE(lo + 28)
      const raw = innerBuf.subarray(ds, ds + compSize)
      const xml = method === 8 ? inflateRawSync(raw) : raw
      return { ...parseAxmlManifest(xml), apk: inner.name }
    }
    p += 46 + nameLen + extraLen + commentLen
  }
  throw new Error('Inner APK has no manifest')
}

