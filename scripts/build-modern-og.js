import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const htmlPath = path.join(root, 'scripts/generate-og-image.html')
const rawPath = path.join(root, 'public/covers/.questports-og.raw.png')
const coverPath = path.join(root, 'public/covers/questports-og.png')
const duplicatePath = path.join(root, 'public/og-image.png')

function findBinary(candidates) {
  return candidates.find(candidate => candidate && fs.existsSync(candidate))
}

function pngSize(filePath) {
  const buf = fs.readFileSync(filePath)
  const sig = buf.subarray(0, 8).toString('hex')
  if (sig !== '89504e470d0a1a0a') {
    throw new Error(`Not a PNG: ${filePath}`)
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length }
}

const chrome = findBinary([
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
])

if (!chrome) {
  console.error('Chrome is required to render scripts/generate-og-image.html')
  process.exit(1)
}

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  '--virtual-time-budget=10000',
  `--screenshot=${rawPath}`,
  `file://${htmlPath}`
], { stdio: 'inherit' })

const rendered = pngSize(rawPath)
if (rendered.width !== 1200 || rendered.height !== 630) {
  console.error(`Expected 1200x630, got ${rendered.width}x${rendered.height}`)
  process.exit(1)
}

const pngquant = findBinary([
  process.env.PNGQUANT_PATH,
  '/usr/bin/pngquant',
  '/usr/local/bin/pngquant'
])

if (!pngquant) {
  console.error('pngquant is required to keep the share image under 300 KB')
  process.exit(1)
}

execFileSync(pngquant, [
  '--quality=80-95',
  '--speed', '1',
  '--force',
  '--output', coverPath,
  rawPath
], { stdio: 'inherit' })

fs.copyFileSync(coverPath, duplicatePath)
fs.rmSync(rawPath, { force: true })

const finalImage = pngSize(coverPath)
const limit = 300 * 1024
if (finalImage.width !== 1200 || finalImage.height !== 630 || finalImage.bytes >= limit) {
  console.error(`Share image is ${finalImage.width}x${finalImage.height} and ${finalImage.bytes} bytes (limit ${limit})`)
  process.exit(1)
}

console.log(`Wrote ${coverPath} (${finalImage.bytes} bytes)`)
