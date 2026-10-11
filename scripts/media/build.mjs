import { buildMedia } from './lib/build.mjs'

buildMedia().catch(err => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
