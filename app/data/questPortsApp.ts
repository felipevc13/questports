/**
 * Copy for /app. Edit this file when the headset app gains a feature.
 * The page renders these strings and does not hard-code them again.
 */
import { appBridgeApkUrl } from '~/lib/appBridge'
import { normalizeApkProxyBase } from '~/lib/apkProxyPolicy'

export const QUESTPORTS_APP_RELEASE_URL = 'https://github.com/felipevc13/questports-app/releases/latest'

export const QUESTPORTS_APP_REPO_URL = 'https://github.com/felipevc13/questports-app'

export const QUESTPORTS_APP_SIDEQUEST_URL = 'https://sidequestvr.com'

export const QUESTPORTS_APP_PAGE = {
  title: 'QuestPorts app',
  lede: 'An Android app for the headset. After this first install, catalog ports install on the Quest without a PC.',
  todayHeading: 'What it does today',
  today: [
    {
      title: 'Install ports from the headset',
      body: 'Open a game in the app and install it on the Quest. That install does not need a PC.'
    },
    {
      title: 'Library',
      body: 'Lists the games installed on the headset, with a count on the tab. Update a game when a newer catalog version is available, or uninstall it when this copy of the app can remove packages. If a game is already installed, the app opens on Library.'
    },
    {
      title: 'Updates itself',
      body: 'The app downloads newer versions of itself from its public GitHub release.'
    }
  ],
  laterHeading: 'Coming later',
  laterNote: 'Not in the app today. This list changes only when a feature actually ships.',
  later: [
    'Game notifications',
    'Steam and GOG game files'
  ],
  installHeading: 'First install',
  installLede: 'Meta blocks APKs that do not come from the Store, so this first copy has to be installed from a PC with Developer Mode on.',
  steps: [
    {
      title: 'Enable Developer Mode on the Quest',
      body: 'Turn on Developer Mode for the headset in the Meta Horizon mobile app.'
    },
    {
      title: 'On a PC, open QuestPorts in Chrome or Edge',
      body: 'Open this page. The USB installer needs one of those browsers.'
    },
    {
      title: 'Connect the Quest and click Install QuestPorts App',
      body: 'Plug the headset in with a USB data cable and accept the USB debugging prompt inside the headset.'
    }
  ],
  pcInstallMessage: 'Open this page on a PC with Chrome or Edge to install with one click.',
  pcInstallUrl: 'questports.com/app',
  copyUrl: 'Copy',
  copiedUrl: 'Copied',
  inAppNote: 'You are already in the QuestPorts app. It installs ports from the headset and updates itself.',
  installButton: 'Install QuestPorts App',
  connectingButton: 'Connecting…',
  downloadApk: 'Download APK',
  sidequest: 'SideQuest on a PC is another way to install the same APK.',
  success: 'QuestPorts is installed. Open it from your headset app library.',
  installFailed: 'Could not install the QuestPorts app.'
} as const

/**
 * Plain APK download. The proxy resolves the latest GitHub release and 302s to the .apk,
 * the same host the one-click installer streams through.
 */
export function questPortsAppApkDownloadUrl(apkProxyBase: string | null | undefined): string {
  const base = normalizeApkProxyBase(apkProxyBase)
  if (!base) {
    return `/api/apk-proxy?url=${encodeURIComponent(QUESTPORTS_APP_RELEASE_URL)}&redirect=1`
  }
  return appBridgeApkUrl(base, QUESTPORTS_APP_RELEASE_URL) ?? QUESTPORTS_APP_RELEASE_URL
}
