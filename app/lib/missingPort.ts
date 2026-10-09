export interface MissingPortError {
  statusCode: 404
  fatal: true
  statusMessage: 'Port not found'
}

/** Fatal 404 payload for a slug that is not in the catalog. Null when the port exists. */
export function missingPortError(port: unknown): MissingPortError | null {
  if (port) return null
  return {
    statusCode: 404,
    fatal: true,
    statusMessage: 'Port not found'
  }
}
