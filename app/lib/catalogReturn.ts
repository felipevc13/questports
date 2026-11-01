/**
 * Where "Back" on a port page should go. When the player came from the
 * catalog, that is the exact address they left (filters, search and sort
 * included); from anywhere else, or on a direct visit, it is the plain catalog.
 */
export function catalogReturnTarget(previous: unknown): string {
  if (typeof previous !== 'string') return '/'
  const [path] = previous.split(/[?#]/)
  return path === '/' ? previous : '/'
}
