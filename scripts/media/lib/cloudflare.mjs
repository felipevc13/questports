import { QUESTPORTS_ACCOUNT_ID } from './constants.mjs'

/**
 * Real deploys must carry the API token and the questports account id.
 * Dry-run only packages the Worker locally and does not need either value.
 * The token is never printed.
 */
export function assertDeployEnv(env, { dryRun }) {
  if (dryRun) return { ok: true }
  const token = String(env.CLOUDFLARE_API_TOKEN || '').trim()
  const account = String(env.CLOUDFLARE_ACCOUNT_ID || '').trim()
  if (!token) {
    return {
      ok: false,
      error: 'CLOUDFLARE_API_TOKEN is required to deploy questports-media.'
    }
  }
  if (account !== QUESTPORTS_ACCOUNT_ID) {
    return {
      ok: false,
      error: `CLOUDFLARE_ACCOUNT_ID must be ${QUESTPORTS_ACCOUNT_ID} (the questports account). Refusing to deploy.`
    }
  }
  return { ok: true }
}
