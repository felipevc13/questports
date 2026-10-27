/** True for `true`, `1`, `on`, or `yes`. Used from nuxt.config, so this file stays import-free. */
export function remoteInstallFlagEnabled(value: unknown): boolean {
  const flag = String(value ?? '').trim().toLowerCase()
  return flag === 'true' || flag === '1' || flag === 'on' || flag === 'yes'
}
