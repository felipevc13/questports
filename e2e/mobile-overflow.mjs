/**
 * Mobile overflow check. Run against a local Nuxt server:
 *   node e2e/mobile-overflow.mjs http://127.0.0.1:3000
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const base = process.argv[2] || 'http://127.0.0.1:3000'
const outDir = process.argv[3] || '/opt/cursor/artifacts/mobile-after'
const chrome = process.env.CHROME_PATH || '/usr/local/bin/google-chrome'

const viewports = [
  { name: 'android360', width: 360, height: 800 },
  { name: 'iphone390', width: 390, height: 844 },
  { name: 'large430', width: 430, height: 932 }
]

async function measure(page) {
  return page.evaluate(() => {
    const root = document.documentElement
    const offenders = []
    const all = document.body.querySelectorAll('*')
    for (const el of all) {
      const rect = el.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) continue
      if (rect.right > window.innerWidth + 1 || rect.left < -1) {
        const style = getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden') continue
        offenders.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || '',
          testid: el.getAttribute('data-testid') || '',
          className: String(el.className).slice(0, 140),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        })
        if (offenders.length >= 8) break
      }
    }
    const install = document.querySelector('[data-testid="install-on-quest"]')
    const installBox = install ? install.getBoundingClientRect() : null
    const disconnect = document.querySelector('[data-testid="disconnect-quest"]')
    const disconnectBox = disconnect ? disconnect.getBoundingClientRect() : null
    const code = document.querySelector('.guide-content code')
    const codeStyle = code ? getComputedStyle(code) : null
    const search = document.querySelector('input[type="search"], input[type="text"], input[type="url"], textarea, select')
    const searchStyle = search ? getComputedStyle(search) : null
    return {
      innerWidth: window.innerWidth,
      scrollWidth: root.scrollWidth,
      overflow: root.scrollWidth - window.innerWidth,
      offenders,
      installTop: installBox ? Math.round(installBox.top) : null,
      installVisible: installBox ? installBox.top >= 0 && installBox.bottom <= window.innerHeight && installBox.left >= 0 && installBox.right <= window.innerWidth : null,
      disconnectVisible: disconnectBox ? disconnectBox.top >= 0 && disconnectBox.bottom <= window.innerHeight && disconnectBox.left >= 0 && disconnectBox.right <= window.innerWidth : null,
      codeWordBreak: codeStyle?.wordBreak || null,
      codeOverflowWrap: codeStyle?.overflowWrap || null,
      fieldFont: searchStyle ? Math.round(parseFloat(searchStyle.fontSize)) : null
    }
  })
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(outDir, `${name}.png`) })
}

const results = []

const browser = await chromium.launch({
  executablePath: chrome,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
})

await mkdir(outDir, { recursive: true })

try {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    })
    const page = await context.newPage()

    const check = async (label, url) => {
      await page.goto(base + url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(400)
      const data = await measure(page)
      results.push({ viewport: vp.name, label, url, ...data, pass: data.overflow <= 0 && data.offenders.length === 0 })
      return data
    }

    await check('home', '/')
    if (vp.name === 'android360') await shot(page, 'android360_home_fold')
    if (vp.name === 'iphone390') await shot(page, 'iphone390_home_fold')

    await check('port-halo', '/ports/halocequest')
    if (vp.name === 'iphone390') await shot(page, 'iphone390_port_halo_fold')

    await check('port-doom3', '/ports/doom3quest')
    if (vp.name === 'android360') {
      await page.locator('#install-guide').scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
      await shot(page, 'android360_port_doom3_guide_fold')
      const guide = await measure(page)
      results.push({ viewport: vp.name, label: 'port-doom3-guide', ...guide, pass: guide.overflow <= 0 })
    }

    await check('404', '/this-page-is-not-in-the-catalog')

    await page.goto(base + '/', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Suggest a game, a feature, or report a bug' }).click()
    await page.getByRole('button', { name: 'Add a standalone Quest port to the catalog' }).click()
    await page.waitForTimeout(300)
    const modal = await measure(page)
    results.push({ viewport: vp.name, label: 'modal-suggest', ...modal, pass: modal.overflow <= 0 && modal.offenders.length === 0 })
    if (vp.name === 'iphone390') await shot(page, 'iphone390_modal_suggest_fold')
    await page.keyboard.press('Escape')

    await page.goto(base + '/?mockQuest=1&mockPhase=connected&mockChrome=0', { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    const connected = await measure(page)
    results.push({ viewport: vp.name, label: 'connected-closed', ...connected, pass: connected.overflow <= 0 && connected.offenders.length === 0 })
    await page.locator('[data-testid="quest-connection-status"]').click()
    await page.waitForTimeout(200)
    const open = await measure(page)
    results.push({
      viewport: vp.name,
      label: 'connected-dropdown',
      ...open,
      pass: open.overflow <= 0 && open.offenders.length === 0 && open.disconnectVisible === true
    })
    if (vp.name === 'iphone390') await shot(page, 'iphone390_header_connected_dropdown_fold')
    if (vp.name === 'android360') await shot(page, 'android360_connected_dropdown_fold')

    await context.close()
  }

  const keyboard = await browser.newContext({
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  })
  const page = await keyboard.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Suggest a game, a feature, or report a bug' }).click()
  await page.getByRole('button', { name: 'Add a standalone Quest port to the catalog' }).click()
  await page.waitForTimeout(300)
  const modal = await measure(page)
  const closeBox = await page.locator('button:has-text("Close"), [aria-label="Close"], .sr-only:text("Close")').first().evaluate((el) => {
    const button = el.closest('button') || el.parentElement
    const rect = button.getBoundingClientRect()
    return { top: Math.round(rect.top), bottom: Math.round(rect.bottom), height: Math.round(rect.height), width: Math.round(rect.width) }
  }).catch(() => null)
  results.push({
    viewport: '360x640',
    label: 'modal-suggest-keyboard',
    ...modal,
    closeBox,
    pass: modal.overflow <= 0 && modal.offenders.length === 0 && closeBox && closeBox.top >= 0 && closeBox.height >= 44
  })
  await shot(page, 'small360x640_modal_suggest_keyboard_fold')
  await keyboard.close()

  const homeCards = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  })
  const cards = await homeCards.newPage()
  await cards.goto(base + '/', { waitUntil: 'networkidle' })
  await cards.locator('text=Showing').scrollIntoViewIfNeeded()
  await cards.waitForTimeout(200)
  await shot(cards, 'iphone390_home_table_fold')
  const toggleCount = await cards.locator('button[title="Dense Table View"]').count()
  const toggleVisible = toggleCount
    ? await cards.locator('button[title="Dense Table View"]').isVisible()
    : false
  results.push({ viewport: 'iphone390', label: 'table-toggle-hidden', toggleVisible, pass: toggleVisible === false })
  await homeCards.close()
} finally {
  await browser.close()
}

const failed = results.filter(row => !row.pass)
await writeFile(path.join(outDir, 'overflow-results.json'), JSON.stringify({ failed: failed.length, results }, null, 2))
console.log(JSON.stringify(results.map(row => ({
  viewport: row.viewport,
  label: row.label,
  pass: row.pass,
  overflow: row.overflow,
  innerWidth: row.innerWidth,
  scrollWidth: row.scrollWidth,
  installTop: row.installTop,
  installVisible: row.installVisible,
  disconnectVisible: row.disconnectVisible,
  fieldFont: row.fieldFont,
  offenders: row.offenders?.slice(0, 3),
  closeBox: row.closeBox,
  toggleVisible: row.toggleVisible,
  codeOverflowWrap: row.codeOverflowWrap
})), null, 2))
if (failed.length) process.exit(1)
