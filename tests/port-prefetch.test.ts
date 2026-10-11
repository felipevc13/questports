import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PORT_PREFETCH_MOVE_MS, shouldIgnorePortPointerEnter } from '../app/lib/portPrefetch'

describe('port link prefetch', () => {
  it('ignores a port card sliding under a stationary mouse', () => {
    expect(PORT_PREFETCH_MOVE_MS).toBe(80)
    expect(shouldIgnorePortPointerEnter({
      pointerType: 'mouse',
      href: '/ports/rtcwquest',
      msSincePointerMove: 300
    })).toBe(true)
    expect(shouldIgnorePortPointerEnter({
      pointerType: 'mouse',
      href: '/ports/rtcwquest',
      msSincePointerMove: Number.POSITIVE_INFINITY
    })).toBe(true)
  })

  it('keeps a real hover, touch, and links that are not port pages', () => {
    expect(shouldIgnorePortPointerEnter({
      pointerType: 'mouse',
      href: '/ports/rtcwquest',
      msSincePointerMove: 16
    })).toBe(false)
    expect(shouldIgnorePortPointerEnter({
      pointerType: 'mouse',
      href: '/ports/rtcwquest',
      msSincePointerMove: PORT_PREFETCH_MOVE_MS
    })).toBe(false)
    expect(shouldIgnorePortPointerEnter({
      pointerType: 'touch',
      href: '/ports/rtcwquest',
      msSincePointerMove: 5000
    })).toBe(false)
    expect(shouldIgnorePortPointerEnter({
      pointerType: 'pen',
      href: '/ports/doom3quest',
      msSincePointerMove: 5000
    })).toBe(false)
    expect(shouldIgnorePortPointerEnter({
      pointerType: 'mouse',
      href: '/?dev=Team%20Beef',
      msSincePointerMove: 5000
    })).toBe(false)
    expect(shouldIgnorePortPointerEnter({
      pointerType: 'mouse',
      href: null,
      msSincePointerMove: 5000
    })).toBe(false)
  })

  it('installs the guard before NuxtLink handles pointerenter', () => {
    const plugin = readFileSync(new URL('../app/plugins/portPrefetch.client.ts', import.meta.url), 'utf8')
    expect(plugin).toContain("document.addEventListener('pointermove'")
    expect(plugin).toContain("document.addEventListener('pointerenter'")
    expect(plugin).toContain('shouldIgnorePortPointerEnter')
    expect(plugin).toContain('event.stopPropagation()')
    const moveAt = plugin.indexOf("document.addEventListener('pointermove'")
    const enterAt = plugin.indexOf("document.addEventListener('pointerenter'")
    expect(moveAt).toBeGreaterThan(0)
    expect(enterAt).toBeGreaterThan(moveAt)
    const enter = plugin.slice(enterAt, enterAt + 500)
    expect(enter).toContain('true)')
    expect(enter).toContain('event.stopPropagation()')
  })
})
