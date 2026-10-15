/**
 * Downloads that are a patch the player must apply on a PC.
 * One-click install sends the catalog URL through the APK proxy, which only
 * accepts an APK or a ZIP that contains one. An .xdelta is not either.
 */

export const CRAZY_TAXI_VR_SLUG = 'crazy-taxi-vr'

export const CRAZY_TAXI_BASE_FILE = 'com.sega.CrazyTaxiplayhaven_6.0-80_2arch_7dpi_24lang_1feat_017e8b1c582569ff9682193551b7e22c_apkmirror.com.apkm'

export const CRAZY_TAXI_README_URL = 'https://github.com/Baywilly/Crazy-Taxi-VR-Standalone/blob/main/README.md'

export const CRAZY_TAXI_PATCH_URL = 'https://github.com/Baywilly/Crazy-Taxi-VR-Standalone/releases/download/v0.1-beta/crazywilly.xdelta'

export const DELTA_PATCHER_URL = 'https://github.com/marco-calautti/DeltaPatcher'

export interface PatchOnlyLink {
  href: string
  label: string
}

export interface PatchOnlyStep {
  title: string
  paragraphs: string[]
  code?: string
  bullets?: string[]
  links?: PatchOnlyLink[]
}

export interface PatchOnlyGuide {
  lead: string
  steps: PatchOnlyStep[]
  readmeUrl: string
  readmeLabel: string
  patchUrl?: string
  patchLabel?: string
}

function downloadPath(url: string | null | undefined): string {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''
  try {
    return decodeURIComponent(new URL(trimmed).pathname)
  } catch {
    return trimmed.split(/[?#]/)[0]
  }
}

/** True when the catalog file is a patch, not an installable APK or ZIP. */
export function oneClickInstallBlocked(url: string | null | undefined): boolean {
  return /\.(?:xdelta3?|apkm)$/i.test(downloadPath(url))
}

/** Crazy Taxi is a PC patch even if the URL changes. Any other patch URL is blocked too. */
export function refusesOneClickInstall(slug: string | null | undefined, url: string | null | undefined): boolean {
  return slug === CRAZY_TAXI_VR_SLUG || oneClickInstallBlocked(url)
}

/**
 * Install steps copied from the Crazy Taxi VR Standalone README
 * (Download & Installation, steps 1–6). Wording stays with that page.
 */
export const CRAZY_TAXI_INSTALL_STEPS: PatchOnlyStep[] = [
  {
    title: 'Obtain the compatible original file',
    paragraphs: [
      'To use the patch, you need a legitimate copy of the compatible original game file.',
      'The specific file used to prepare the patch has the following name:',
      'The patch is designed for this specific file and may not work with other versions of Crazy Taxi for Android.',
      'The filename is provided as a reference to identify the compatible version. Original game files must be obtained through legal means.'
    ],
    code: CRAZY_TAXI_BASE_FILE
  },
  {
    title: 'Download the XDelta patch',
    paragraphs: [
      'In the Releases section of the repository, download crazywilly.xdelta and save it to your computer.'
    ],
    links: [{ href: CRAZY_TAXI_PATCH_URL, label: 'crazywilly.xdelta' }]
  },
  {
    title: 'Download Delta Patcher',
    paragraphs: [
      'To apply the patch, you need the free program Delta Patcher.',
      'Download the program to your computer and run it.',
      'The computer is only needed to prepare and install the game. Once installed, Crazy Taxi VR runs directly on your Meta Quest headset.'
    ],
    links: [{ href: DELTA_PATCHER_URL, label: 'https://github.com/marco-calautti/DeltaPatcher' }]
  },
  {
    title: 'Apply the XDelta patch',
    paragraphs: [
      'Open Delta Patcher on your computer.',
      'Original file: select the original Crazy Taxi file named above.',
      'XDelta patch: select crazywilly.xdelta.',
      'Once the process is complete, the original file will have been patched. Rename the file extension from .apkm to .apk.',
      'After completing these steps, you should have the Crazy Taxi VR Standalone file ready to install on your Meta Quest headset.'
    ],
    bullets: [
      'Select both files in their corresponding fields.',
      'Click Apply patch.',
      'Wait for the patching process to finish.'
    ]
  },
  {
    title: 'Install Crazy Taxi VR on Meta Quest',
    paragraphs: [
      'Once the installation is complete, you can disconnect the USB cable.'
    ],
    bullets: [
      'Connect your Meta Quest headset to your computer using a USB cable.',
      'Make sure Developer Mode and the necessary permissions for installing external applications are enabled.',
      'Open SideQuest or another compatible installation tool.',
      'Select the .apk file you just patched.',
      'Install it on your headset.',
      'Wait for the installation to finish.'
    ]
  },
  {
    title: 'Launch Crazy Taxi VR Standalone',
    paragraphs: [
      'Put on your Meta Quest headset and open your app library.',
      'Find Crazy Taxi VR Standalone among your installed applications.',
      'Launch the game, select your driver, and get ready to hit the streets.'
    ]
  }
]

const CRAZY_TAXI_GUIDE: PatchOnlyGuide = {
  lead: 'Since Crazy Taxi was removed from digital stores by SEGA, this project distributes an XDelta patch instead of the complete commercial game.',
  steps: CRAZY_TAXI_INSTALL_STEPS,
  readmeUrl: CRAZY_TAXI_README_URL,
  readmeLabel: 'Open the project README',
  patchUrl: CRAZY_TAXI_PATCH_URL,
  patchLabel: 'Download XDelta patch (crazywilly.xdelta)'
}

export function patchOnlyGuideFor(
  slug: string | null | undefined,
  downloadUrl?: string | null,
  githubUrl?: string | null
): PatchOnlyGuide | null {
  if (slug === CRAZY_TAXI_VR_SLUG) return CRAZY_TAXI_GUIDE
  if (!oneClickInstallBlocked(downloadUrl)) return null
  const readmeUrl = String(githubUrl || '').trim()
  return {
    lead: 'This catalog download is a patch file, not an APK. QuestPorts cannot install it for you. Follow the project\'s own install instructions.',
    steps: [],
    readmeUrl,
    readmeLabel: 'Open the project install instructions',
    patchUrl: String(downloadUrl || '').trim() || undefined,
    patchLabel: 'Download the patch file'
  }
}
