import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { softenGuideHtml } from '../app/lib/guideHtml'

describe('softenGuideHtml', () => {
  it('inserts wrap opportunities after slashes in inline code only', () => {
    const html = '<p>Copy <code>/sdcard/Doom3Quest/base/</code> then <pre><code>adb push game.pk4 /sdcard/Documents/HaloCE/</code></pre></p>'
    const softened = softenGuideHtml(html)
    expect(softened).toContain('<code>/<wbr>sdcard/<wbr>Doom3Quest/<wbr>base/<wbr></code>')
    expect(softened).toContain('<pre><code>adb push game.pk4 /sdcard/Documents/HaloCE/</code></pre>')
    expect(softened).not.toContain('pre><code>adb push game.pk4 /<wbr>')
  })
})

describe('mobile overflow guards', () => {
  it('clips page overflow and wraps guide code without break-all', () => {
    const css = readFileSync(new URL('../app/assets/css/main.css', import.meta.url), 'utf8')
    expect(css).toContain('overflow-x: clip')
    expect(css).toMatch(/\.guide-content code \{[\s\S]*overflow-wrap: anywhere/)
    expect(css).not.toMatch(/\.guide-content code \{[\s\S]*word-break: break-all/)
    expect(css).toContain('font-size: 16px !important')
  })
})
