import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { DIST_DIR, HEADERS_SOURCE, REQUIRED_HEADER_SNIPPETS, REPO_ROOT } from './constants.mjs'
import { builtMediaPaths, missingAssets, referencedMediaPaths } from './references.mjs'

/**
 * Fail when the built asset directory is missing any file the site can request.
 * A Workers static-asset deploy replaces the previous set entirely.
 */
export async function assertMediaComplete(options = {}) {
  const repoRoot = options.repoRoot || REPO_ROOT
  const distDir = options.distDir || DIST_DIR
  const headersPath = options.headersPath || path.join(distDir, '_headers')
  const required = options.required || await referencedMediaPaths(repoRoot, options.sources || {})
  const built = options.built || await builtMediaPaths(distDir)
  if (required.size === 0) {
    throw new Error(`No referenced media files under ${repoRoot}. Refusing to deploy an empty asset set.`)
  }
  const missing = missingAssets(required, built)
  if (missing.length > 0) {
    const preview = missing.slice(0, 40).join('\n')
    const more = missing.length > 40 ? `\n… and ${missing.length - 40} more` : ''
    const error = new Error(
      `Media build is missing ${missing.length} referenced file(s). ` +
      `A deploy would replace the live set and 404 these URLs:\n${preview}${more}`
    )
    error.missing = missing
    throw error
  }
  let headers = ''
  try {
    headers = await readFile(headersPath, 'utf8')
  } catch {
    throw new Error(`Built asset dir is missing _headers (${headersPath}). Cache and CORS headers would not deploy.`)
  }
  const absent = REQUIRED_HEADER_SNIPPETS.filter(snippet => !headers.includes(snippet))
  if (absent.length > 0) {
    throw new Error(`_headers is missing:\n${absent.join('\n')}`)
  }
  return { required: required.size, built: built.size }
}

export async function readSourceHeaders() {
  return readFile(HEADERS_SOURCE, 'utf8')
}
