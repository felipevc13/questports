/**
 * Nuxt interaction prefetch listens for pointerenter. Scrolling the catalog
 * with the pointer left on the grid fires that event for every card that
 * slides underneath, with no recent pointermove. A real hover moves the
 * pointer in the same frame.
 */
export const PORT_PREFETCH_MOVE_MS = 80

export function shouldIgnorePortPointerEnter(input: {
  pointerType?: string | null
  href?: string | null
  msSincePointerMove: number
  moveWindowMs?: number
}): boolean {
  const href = input.href || ''
  if (!href.startsWith('/ports/')) return false
  if (input.pointerType && input.pointerType !== 'mouse') return false
  const moveWindowMs = input.moveWindowMs ?? PORT_PREFETCH_MOVE_MS
  return input.msSincePointerMove > moveWindowMs
}
