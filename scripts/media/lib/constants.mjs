import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

export const MEDIA_DIR = path.resolve(here, '..')
export const REPO_ROOT = path.resolve(MEDIA_DIR, '../..')
export const DIST_DIR = path.join(MEDIA_DIR, 'dist')
export const HEADERS_SOURCE = path.join(MEDIA_DIR, '_headers')
export const WRANGLER_CONFIG = path.join(MEDIA_DIR, 'wrangler.toml')

/** Live media host. Covers and previews are served from here, not from Vercel. */
export const MEDIA_HOST = 'https://questports-media.questports.workers.dev'

/**
 * Cloudflare account that owns questports-media.
 * Not a token. Deploy reads CLOUDFLARE_ACCOUNT_ID and refuses any other account.
 */
export const QUESTPORTS_ACCOUNT_ID = '42ef7aadef9e38f2860f59f826a090e9'

/** Same limits as the ops optimize_covers.py / optimize.sh. */
export const COVER_MAX_WIDTH = 600
export const THUMB_WIDTH = 120
export const JPEG_QUALITY = 82
export const PREVIEW_MAX_WIDTH = 854

export const REQUIRED_HEADER_SNIPPETS = [
  'Cache-Control: public, max-age=31536000, immutable',
  'Access-Control-Allow-Origin: *',
  'Access-Control-Expose-Headers: Content-Length, Content-Range, Accept-Ranges'
]
