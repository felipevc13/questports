#!/usr/bin/env node
/**
 * Verifies the REAL Android package name of every port APK and compares it
 * against app/data/portPackageMap.ts.
 *
 * It avoids downloading full APKs: using HTTP Range requests it reads only the
 * ZIP central directory + the compressed AndroidManifest.xml entry (a few KB),
 * then decodes Android binary XML to extract <manifest package="...">.
 *
 * Usage:
 *   node scripts/verify-apk-packages.mjs <ports.json>
 *   (ports.json = [{ slug, port_download_url }], e.g. exported from Supabase)
 *   GITHUB_TOKEN=... improves GitHub API rate limits.
 */
import { readFileSync } from 'node:fs'
import { readApkPackage } from './lib/apkPackage.mjs'

const UA = { 'User-Agent': 'QuestPorts-Verifier/1.0' }
const GH_HEADERS = {
  ...UA,
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
}

// ---------- URL resolution ----------
async function ghJson(path) {
  const r = await fetch(`https://api.github.com${path}`, { headers: GH_HEADERS })
  if (!r.ok) throw new Error(`GitHub API ${r.status} ${path}`)
  return r.json()
}

function pickAsset(assets) {
  const files = assets.filter(a => /\.(apk|zip)$/i.test(a.name))
  const apks = files.filter(a => /\.apk$/i.test(a.name))
  const quest = (list) => list.find(a => /quest|vr|openxr|oculus/i.test(a.name))
  return quest(apks) || apks[0] || quest(files) || files[0]
}

async function resolveDownload(url) {
  const u = new URL(url)
  if (/\.(apk|zip)$/i.test(u.pathname)) return url
  if (u.hostname === 'github.com') {
    const [owner, repo, kind, sub, tag] = u.pathname.split('/').filter(Boolean)
    if (kind === 'releases' && sub === 'tag' && tag) {
      const release = await ghJson(`/repos/${owner}/${repo}/releases/tags/${tag}`)
      const asset = pickAsset(release.assets || [])
      if (!asset) throw new Error('No .apk/.zip asset in GitHub release')
      return asset.browser_download_url
    }
    // "latest" may be a PC-only build: scan recent releases for a Quest APK first
    const releases = await ghJson(`/repos/${owner}/${repo}/releases?per_page=10`)
    for (const rel of releases) {
      const apk = (rel.assets || []).find(a => /\.apk$/i.test(a.name))
      if (apk) return pickAsset(rel.assets).browser_download_url
    }
    for (const rel of releases) {
      const asset = pickAsset(rel.assets || [])
      if (asset) return asset.browser_download_url
    }
    throw new Error('No .apk/.zip asset in GitHub releases')
  }
  if (u.hostname.endsWith('sidequestvr.com')) {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const html = await r.text()
    const pkg = html.match(/"packagename":"([^"]+)"/)?.[1]
    if (pkg) return { sidequestPackage: pkg }
    throw new Error('SideQuest page without packagename')
  }
  throw new Error('Website URL (no direct APK)')
}

// ---------- main ----------
const portsFile = process.argv[2]
if (!portsFile) { console.error('usage: verify-apk-packages.mjs <ports.json>'); process.exit(1) }
const ports = JSON.parse(readFileSync(portsFile, 'utf8'))

const mapSrc = readFileSync(new URL('../app/data/portPackageMap.ts', import.meta.url), 'utf8')
function configured(slug) {
  const re = new RegExp(`['"]?${slug.replace(/[-]/g, '\\-')}['"]?\\s*:\\s*\\{[\\s\\S]*?packageName:\\s*'([^']+)'(?:,\\s*altPackages:\\s*\\[([^\\]]*)\\])?`)
  const m = mapSrc.match(re)
  if (!m) return { pkg: null, alts: [] }
  return { pkg: m[1], alts: (m[2] || '').match(/'[^']+'/g)?.map(s => s.slice(1, -1)) || [] }
}

const results = []
for (const { slug, port_download_url: url } of ports) {
  const cfg = configured(slug)
  const row = { slug, configured: cfg.pkg, real: null, source: '', status: '' }
  try {
    const target = await resolveDownload(url)
    if (typeof target === 'object') {
      row.real = target.sidequestPackage; row.source = 'sidequest-api'
    } else {
      const info = await readApkPackage(target)
      row.real = info.package; row.source = info.apk; row.version = info.versionName
    }
    row.status = row.real === cfg.pkg ? 'OK' : (cfg.alts.includes(row.real) ? 'ALT_ONLY' : 'MISMATCH')
  } catch (e) {
    row.status = 'UNVERIFIED'; row.source = e.message
  }
  results.push(row)
  console.error(`${row.status.padEnd(10)} ${slug.padEnd(24)} cfg=${cfg.pkg} real=${row.real ?? '-'} (${row.source})`)
}
console.log(JSON.stringify(results, null, 2))
