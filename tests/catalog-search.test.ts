import { describe, expect, it } from 'vitest'
import { PORT_SEARCH_ALIASES } from '../app/data/searchAliases'
import {
  closestCatalogPorts,
  compactSearchText,
  normalizeSearchText,
  searchCatalog,
  searchOutcomeVia,
  type CatalogSearchFields
} from '../app/lib/catalogSearch'

function port(slug: string, title: string, extra: Partial<CatalogSearchFields> = {}): CatalogSearchFields {
  return {
    slug,
    title,
    developer: extra.developer || 'Dev',
    short_description: extra.short_description || '',
    original_game: extra.original_game || null
  }
}

const CATALOG: CatalogSearchFields[] = [
  port('red-dead-redemption-vr', 'Red Dead Redemption VR'),
  port('lambda1vr', 'Lambda1VR (Half-Life 1)', { developer: 'Team Beef' }),
  port('sourcevr', 'SourceVR (Half-Life 2 & Portal VR)'),
  port('qualyx', 'Qualyx (Half-Life: Alyx VR)'),
  port('gta-sa-vr-quest', 'Grand Theft Auto: San Andreas VR'),
  port('vice-city-vr-quest', 'Grand Theft Auto: Vice City VR'),
  port('doom3quest', 'Doom 3: Quest Edition'),
  port('questzdoom', 'QuestZDoom'),
  port('quakequest', 'QuakeQuest (Quake 1 VR)'),
  port('quake2quest', 'Quake II Quest'),
  port('quake3quest', 'Quake3Quest (Quake III Arena VR)'),
  port('goldeneye-vr', 'GoldenEye VR (007)'),
  port('metal-gear-solid-vr', 'Metal Gear Solid VR Standalone'),
  port('beefraiderxr', 'Beef Raider XR (Tomb Raider 1)'),
  port('rtcwquest', 'RTCWQuest (Return to Castle Wolfenstein)', { developer: 'Team Beef' }),
  port('csvr', 'CSVR (Counter-Strike 1.6 VR)'),
  port('halocequest', 'Halo CE Quest VR'),
  port('ppsspp-vr', 'PPSSPP VR', { developer: 'Henrik Rydgård' }),
  port('ut99-vr-quest', "Unreal Tournament '99 VR (UT99 Quest)"),
  port('openmw-vr', 'OpenMW VR (Morrowind)'),
  port('ocarina-of-time-vr', 'Quest 3: OOT (Ocarina of Time VR, Shipwright-VR)'),
  port('galaxyquest', 'GalaxyQuest (Super Mario Galaxy VR)'),
  port('iron-lung-vr', 'Iron Lung VR', { short_description: 'Navigate an alien blood ocean.' }),
  port('razexr', 'RazeXR (Duke Nukem 3D, Blood, Shadow Warrior)'),
  port('hotd-vr', 'Port0r: House of the Dead VR (The House of the Dead)'),
  port('time-crisis-vr', 'Time Crisis VR'),
  port('nfsu-vr', 'Need for Speed: Underground VR'),
  port('descent-1-2-vr', 'Descent 1 & 2 VR'),
  port('descent-3-vr', 'Descent 3 VR (Quest port of the open-source Descent 3)')
]

function slugs(query: string, items: readonly CatalogSearchFields[] = CATALOG): string[] {
  return searchCatalog(items, query).map(hit => hit.item.slug)
}

describe('catalog search normalization', () => {
  it('folds case, accents, and punctuation into the same key', () => {
    expect(normalizeSearchText('  Half-Life  ')).toBe('half life')
    expect(compactSearchText('Half-Life')).toBe('halflife')
    expect(compactSearchText('half life')).toBe('halflife')
    expect(compactSearchText('R.D.R.')).toBe('rdr')
    expect(normalizeSearchText('Rydgård')).toBe('rydgard')
    expect(normalizeSearchText('Quake II')).toBe('quake ii 2')
    expect(normalizeSearchText('Hit & Run')).toBe('hit and run')
  })
})

describe('catalog search matches', () => {
  it('finds abbreviations and nicknames that are not in the title', () => {
    expect(slugs('rdr')).toEqual(['red-dead-redemption-vr'])
    expect(slugs('rdr1')).toEqual(['red-dead-redemption-vr'])
    expect(slugs('R.D.R.')).toEqual(['red-dead-redemption-vr'])
    expect(slugs('rdr2')).toEqual([])
    expect(slugs('gta').sort()).toEqual(['gta-sa-vr-quest', 'vice-city-vr-quest'])
    expect(slugs('gta 5')).toEqual([])
    expect(slugs('gta sa')).toEqual(['gta-sa-vr-quest'])
    expect(slugs('hl').sort()).toEqual(['lambda1vr', 'qualyx', 'sourcevr'])
    expect(slugs('hl2')).toEqual(['sourcevr'])
    expect(slugs('mgs')).toEqual(['metal-gear-solid-vr'])
    expect(slugs('tomb raider')).toEqual(['beefraiderxr'])
  })

  it('treats spacing and punctuation as the same title', () => {
    expect(slugs('half life').sort()).toEqual(['lambda1vr', 'qualyx', 'sourcevr'])
    expect(slugs('half-life')).toEqual(slugs('half life'))
    expect(slugs('halflife')).toEqual(slugs('half life'))
    expect(slugs('HALF LIFE')).toEqual(slugs('half life'))
    expect(slugs('half life 2')).toEqual(['sourcevr'])
    expect(slugs('goldeneye')).toEqual(['goldeneye-vr'])
    expect(slugs('golden eye')).toEqual(['goldeneye-vr'])
    expect(slugs('doom 3')).toEqual(['doom3quest'])
    expect(slugs('quake 2')).toEqual(['quake2quest'])
    expect(slugs('quake ii')).toEqual(['quake2quest'])
    expect(slugs('red dead')).toEqual(['red-dead-redemption-vr'])
  })

  it('labels a title match as text and an abbreviation as alias', () => {
    const half = searchCatalog(CATALOG, 'half life')
    expect(half.every(hit => hit.via === 'text')).toBe(true)
    expect(searchOutcomeVia(half)).toBe('text')
    const rdr = searchCatalog(CATALOG, 'rdr')
    expect(rdr[0]?.via).toBe('alias')
    expect(searchOutcomeVia(rdr)).toBe('alias')
    expect(searchCatalog(CATALOG, 'doon 3')[0]).toMatchObject({
      item: { slug: 'doom3quest' },
      via: 'fuzzy'
    })
    expect(searchOutcomeVia(searchCatalog(CATALOG, 'doon 3'))).toBe('fuzzy')
  })

  it('matches a developer after stripping accents and keeps a typo off unrelated ports', () => {
    expect(slugs('rydgard')).toEqual(['ppsspp-vr'])
    expect(slugs('team beef').sort()).toEqual(['lambda1vr', 'rtcwquest'])
    expect(slugs('call of duty')).toEqual([])
    expect(closestCatalogPorts(CATALOG, 'call of duty')).toEqual([])
  })

  it('uses original_game when the title does not say it', () => {
    const items = [port('example-vr', 'Example VR', { original_game: 'Half-Life Alyx' })]
    expect(slugs('half life alyx', items)).toEqual(['example-vr'])
    expect(searchCatalog(items, 'half life alyx')[0]?.via).toBe('text')
  })

  it('offers a close title only when the query nearly matches', () => {
    expect(slugs('wolfenstien')).toEqual(['rtcwquest'])
    const suggestions = closestCatalogPorts(CATALOG, 'marioo kart')
    expect(suggestions.map(hit => hit.item.slug)).toEqual([])
    expect(closestCatalogPorts(CATALOG, 'doooom').map(hit => hit.item.slug)).toContain('doom3quest')
  })
})

describe('search alias map', () => {
  it('keys are port slugs and the phrases are real words', () => {
    const banned = new Set(['vr', 'quest', 'port', 'game', 'the', 'and'])
    for (const [slug, aliases] of Object.entries(PORT_SEARCH_ALIASES)) {
      expect(slug, slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(aliases.length, slug).toBeGreaterThan(0)
      for (const alias of aliases) {
        expect(alias.trim(), slug).toBe(alias)
        expect(alias.length, `${slug} ${alias}`).toBeGreaterThan(1)
        expect(banned.has(alias.toLowerCase()), alias).toBe(false)
      }
    }
    expect(PORT_SEARCH_ALIASES['red-dead-redemption-vr']).toContain('rdr')
    expect(PORT_SEARCH_ALIASES['lambda1vr']).toContain('hl1')
    expect(PORT_SEARCH_ALIASES['sourcevr']).toContain('hl2')
  })
})
