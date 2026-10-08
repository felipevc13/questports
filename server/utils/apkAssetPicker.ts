export const APK_PROXY_ALLOWED_HOSTS = [
  'github.com',
  'github-production-release-asset-2e65be.s3.amazonaws.com',
  'release-assets.githubusercontent.com',
  'objects.githubusercontent.com',
  'sidequestvr.com',
  'goldeneyevr.com',
  'lambda1vr.com',
  'doom3quest.com',
  'questzdoom.com',
  'ut99vr.pages.dev'
]

export function isAllowedApkProxyHost(hostname: string): boolean {
  return APK_PROXY_ALLOWED_HOSTS.some(host => hostname === host || hostname.endsWith(`.${host}`))
}

export function isLikelyApkPath(path: string): boolean {
  return path.toLowerCase().split('?')[0].endsWith('.apk')
}

export function isLikelyZipPath(path: string): boolean {
  return path.toLowerCase().split('?')[0].endsWith('.zip')
}

function scoreQuestBuildName(name: string): number {
  const n = name.toLowerCase()
  let score = 0
  if (n.includes('quest')) score += 4
  if (n.includes('openxr')) score += 3
  if (n.includes('vr')) score += 2
  if (n.includes('launcher')) score -= 3
  if (n.includes('android') && !n.includes('quest') && !n.includes('vr')) score -= 6
  if (n.includes('pico') && !n.includes('quest')) score -= 6
  if (n.includes('windows') && !n.includes('quest')) score -= 5
  if (n.includes('pcvr') && !n.includes('quest')) score -= 2
  return score
}

/** Official homepages that are HTML, not APKs — resolve to GitHub releases instead. */
export const HOMEPAGE_TO_GITHUB_RELEASE: Record<string, string> = {
  'doom3quest.com': 'https://github.com/Team-Beef-Studios/Doom3Quest/releases/latest',
  'lambda1vr.com': 'https://github.com/Team-Beef-Studios/Lambda1VR/releases/latest',
  'questzdoom.com': 'https://github.com/Team-Beef-Studios/QuestZDoom/releases/latest'
}

export function rewriteKnownHomepageToGithubRelease(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.pathname !== '/' && parsed.pathname !== '') return url
    const host = parsed.hostname.replace(/^www\./, '')
    return HOMEPAGE_TO_GITHUB_RELEASE[host] || url
  } catch {
    return url
  }
}

export function pickPreferredApkPath(paths: string[]): string | null {
  const apks = paths.filter(p => p.toLowerCase().endsWith('.apk'))
  if (apks.length === 0) return null
  return [...apks].sort((a, b) => scoreQuestBuildName(b) - scoreQuestBuildName(a))[0] || null
}

export interface ReleaseAsset {
  name: string
  browser_download_url: string
}

export function pickPreferredReleaseDownload(assets: ReleaseAsset[]): ReleaseAsset | null {
  const apks = assets.filter(a => a.name?.toLowerCase().endsWith('.apk'))
  if (apks.length > 0) {
    return [...apks].sort((a, b) => scoreQuestBuildName(b.name) - scoreQuestBuildName(a.name))[0] || null
  }

  const zips = assets.filter(a => a.name?.toLowerCase().endsWith('.zip'))
  if (zips.length === 0) return null
  return [...zips].sort((a, b) => scoreQuestBuildName(b.name) - scoreQuestBuildName(a.name))[0] || null
}
