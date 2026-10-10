import { isAllowedApkProxyHost, isLikelyApkPath, isLikelyZipPath } from './apkAssetPicker'

/**
 * 302 target for redirect=1. Only a plain https .apk on an allowlisted host.
 * Zip assets stay on the streaming path so the unwrap header still arrives.
 */
export function plainApkRedirectTarget(resolvedUrl: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(resolvedUrl)
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:') return null
  if (!isAllowedApkProxyHost(parsed.hostname)) return null
  if (!isLikelyApkPath(parsed.pathname) || isLikelyZipPath(parsed.pathname)) return null
  return parsed.toString()
}
