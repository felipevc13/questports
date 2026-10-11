import { shouldIgnorePortPointerEnter } from '~/lib/portPrefetch'

/**
 * Drops pointerenter on port links when the pointer has not moved.
 * Hover, focus, and touch still prefetch. A card sliding under a resting
 * mouse while the catalog scrolls does not.
 */
export default defineNuxtPlugin(() => {
  let lastMoveAt = 0
  document.addEventListener('pointermove', () => {
    lastMoveAt = performance.now()
  }, true)
  document.addEventListener('pointerenter', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const link = target.closest('a')
    if (!link || target !== link) return
    const ignore = shouldIgnorePortPointerEnter({
      pointerType: event.pointerType,
      href: link.getAttribute('href'),
      msSincePointerMove: lastMoveAt ? performance.now() - lastMoveAt : Number.POSITIVE_INFINITY
    })
    if (ignore) event.stopPropagation()
  }, true)
})
