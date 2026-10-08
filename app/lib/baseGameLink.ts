/** Hosts that sell a game. Reference sites stay "About", not "Buy". */
const STORE_HOSTS = [
  'steampowered.com',
  'gog.com',
  'play.google.com',
  'minecraft.net',
  'store.playstation.com',
  'nintendo.com',
  'microsoft.com',
  'xbox.com',
  'rockstargames.com'
]

export function isLegitimateStoreUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '')
    return STORE_HOSTS.some(store => host === store || host.endsWith(`.${store}`))
  } catch {
    return false
  }
}
