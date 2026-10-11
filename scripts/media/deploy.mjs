import { spawn } from 'node:child_process'
import path from 'node:path'
import { assertDeployEnv } from './lib/cloudflare.mjs'
import { buildMedia } from './lib/build.mjs'
import { assertMediaComplete } from './lib/guard.mjs'
import { REPO_ROOT, WRANGLER_CONFIG } from './lib/constants.mjs'

const dryRun = process.argv.includes('--dry-run')
const skipBuild = process.argv.includes('--skip-build')

function runWrangler() {
  const wranglerBin = path.join(REPO_ROOT, 'node_modules/wrangler/bin/wrangler.js')
  const args = [wranglerBin, 'deploy', '--config', WRANGLER_CONFIG]
  if (dryRun) args.push('--dry-run')
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: REPO_ROOT,
      stdio: 'inherit',
      env: { ...process.env, WRANGLER_SEND_METRICS: 'false' }
    })
    child.on('error', reject)
    child.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`wrangler deploy exited ${code}`))
    })
  })
}

const envCheck = assertDeployEnv(process.env, { dryRun })
if (!envCheck.ok) {
  console.error(envCheck.error)
  process.exit(1)
}

try {
  if (!skipBuild) await buildMedia()
  const check = await assertMediaComplete()
  console.log(`media guard: ${check.required} referenced files present in the build (${check.built} asset files).`)
  if (dryRun) console.log('wrangler deploy --dry-run (no upload)')
  else console.log('wrangler deploy questports-media')
  await runWrangler()
} catch (err) {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
}
