import { readFileSync } from 'node:fs'
import { compile } from '@vue/compiler-dom'
import { parse } from '@vue/compiler-sfc'
import * as Vue from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { PORT_PACKAGE_CONFIGS } from '../app/data/portPackageMap'
import { patchOnlyGuideFor, refusesOneClickInstall } from '../app/lib/patchOnlyInstall'

const source = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const template = (path: string) => {
  const result = parse(source(path))
  expect(result.errors).toEqual([])
  return result.descriptor.template!.content
}
const renderer = (html: string) => new Function('Vue', compile(html, { mode: 'function', prefixIdentifiers: true }).code)(Vue)
const gt4Render = renderer(template('../app/components/Gt4ManualInstall.vue'))
const patchRender = renderer(template('../app/components/PatchOnlyInstall.vue'))

async function renderCard(slug: string) {
  const guide = patchOnlyGuideFor(slug, 'https://example.com/app.apk', 'https://github.com/example/repo')!
  const app = Vue.createSSRApp({
    setup: () => ({ route: { params: { slug } }, guide, undefined }),
    render: patchRender
  })
  app.component('Gt4ManualInstall', { setup: () => ({ onDownload: () => {} }), render: gt4Render })
  return renderToString(app)
}

describe('GT4 manual variants', () => {
  it('keeps one-click disabled and renders both separate downloads in the existing install card', async () => {
    expect(PORT_PACKAGE_CONFIGS['gran-turismo-4-vr']).toBeUndefined()
    expect(refusesOneClickInstall('gran-turismo-4-vr', 'https://github.com/SgtBilko76/gt4-vr/releases')).toBe(true)
    expect(patchOnlyGuideFor('gran-turismo-4-vr', 'https://example.com/app.apk', 'https://github.com/SgtBilko76/gt4-vr')).not.toBeNull()
    const html = await renderCard('gran-turismo-4-vr')
    expect(html).toContain('data-testid="gt4-manual-install"')
    expect(html).toContain('v0.3.2-beta-online/GT4-Online-VR-0.3.2-beta.apk')
    expect(html).toContain('v0.3.2-beta-specii/GT4-SpecII-VR-0.3.2-beta.apk')
    expect(html).toContain('/sdcard/GT4HD/')
    expect(html).toContain('/sdcard/GT4SpecII/')
    expect(html).toContain('US v2.00 ISO')
    expect(html).toContain('Spec II 1.10 ISO')
    expect(html).toContain('https://www.theadmiester.co.uk/specii/install.html')
    expect(html).toContain('unmodified US Online Public Beta ISO')
    expect(html).toContain('separate apps')
    expect(html).not.toContain('install-on-quest')
    expect(html).not.toContain('patch-only-readme')
  })

  it('leaves other manual ports on the generic card', async () => {
    const html = await renderCard('not-in-the-map')
    expect(html).toContain('data-testid="patch-only-install"')
    expect(html).toContain('https://example.com/app.apk')
    expect(html).not.toContain('gt4-manual-install')
  })

  it('uses the existing manual card in both the website and app, and tracks variant downloads', () => {
    const page = source('../app/pages/ports/[slug].vue')
    const app = source('../app/components/AppBridgeInstall.vue')
    const card = source('../app/components/Gt4ManualInstall.vue')
    expect(page).toContain('<PatchOnlyInstall v-else-if="patchOnlyGuide" :guide="patchOnlyGuide" />')
    expect(app).toContain('<PatchOnlyInstall v-else-if="patchGuide" :guide="patchGuide" />')
    expect(card).toContain("track('manual_download_click'")
    expect(card).toContain("onDownload('online')")
    expect(card).toContain("onDownload('specii')")
    expect(card).toContain('props: { build }')
  })
})
