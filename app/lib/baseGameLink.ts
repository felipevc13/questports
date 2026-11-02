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

function linkHost(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
}

function hostMatches(host: string, store: string): boolean {
  return host === store || host.endsWith(`.${store}`)
}

export function isLegitimateStoreUrl(url: string | null | undefined): boolean {
  const host = linkHost(url)
  return Boolean(host && STORE_HOSTS.some(store => hostMatches(host, store)))
}

/** Store kind for the base_game_click event. A reference page is `info`. */
export function baseGameStoreKind(url: string | null | undefined): 'steam' | 'gog' | 'store' | 'info' {
  const host = linkHost(url)
  if (!host || !isLegitimateStoreUrl(url)) return 'info'
  if (hostMatches(host, 'steampowered.com')) return 'steam'
  if (hostMatches(host, 'gog.com')) return 'gog'
  return 'store'
}
