import { INITIAL_PORTS } from '~/data/mockPorts'
import { getPortCampaigns } from '~/data/expansions'
import {
  PORT_PACKAGE_CONFIGS,
  isSelfContainedSideload,
  type PortPackageConfig
} from '~/data/portPackageMap'
import type { Port } from '~/types/port'

export interface CatalogInstallFact {
  slug: string
  title: string
  installType: PortPackageConfig['installType'] | 'missing'
  workflow: string
  selfContained: boolean
  pcBuilder: boolean
  needsExternalFiles: boolean
  campaignPaths: string[]
  exampleFiles: string[]
  criticalFiles: string[]
  fileGuidance: string
  guidePaths: string[]
  configPaths: string[]
  /** Paths named in the install guide that the action card does not scan. */
  guidePathsIgnoredByCard: string[]
  absentUi: 'install-button' | 'pc-builder'
  missingFilesUi: 'send-files' | 'standalone-ready'
  presentFilesUi: 'files-ready' | 'standalone-ready'
  playButtonWhenReady: boolean
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)))
}

function normalizePath(path: string): string {
  const withSlash = path.endsWith('/') ? path : `${path}/`
  return withSlash.toLowerCase()
}

function pathsInText(text: string | null | undefined): string[] {
  if (!text) return []
  const found = text.match(/\/sdcard\/[A-Za-z0-9._/-]+/g) || []
  return unique(found.map(p => p.replace(/[),.;]+$/, '')))
}

function cardWouldSee(guidePath: string, campaignPaths: string[]): boolean {
  const guide = normalizePath(guidePath)
  return campaignPaths.some(campaign => {
    const card = normalizePath(campaign)
    return guide.startsWith(card) || card.startsWith(guide)
  })
}

export function catalogInstallFact(port: Port): CatalogInstallFact {
  const cfg = PORT_PACKAGE_CONFIGS[port.slug]
  const selfContained = isSelfContainedSideload(cfg)
  const pcBuilder = cfg?.installType === 'pc_builder_required'
  const needsExternalFiles = !selfContained
  const campaigns = getPortCampaigns(port)
  const campaignPaths = campaigns.map(c => c.fullPath)
  const configPaths = unique([
    cfg?.targetPath || '',
    ...(cfg?.altPaths || []),
    ...(cfg?.romDirectories || []),
    ...(cfg?.folders || []).flatMap(folder => [folder.targetPath, ...(folder.altPaths || [])])
  ])
  const guidePaths = unique([
    ...pathsInText(port.installation_guide),
    ...pathsInText(cfg?.fileGuidance)
  ])
  const guidePathsIgnoredByCard = guidePaths.filter(path => !cardWouldSee(path, campaignPaths))

  return {
    slug: port.slug,
    title: port.title,
    installType: cfg?.installType || 'missing',
    workflow: cfg?.workflowType || 'missing',
    selfContained,
    pcBuilder,
    needsExternalFiles,
    campaignPaths,
    exampleFiles: campaigns.map(c => c.exampleFiles),
    criticalFiles: cfg?.criticalFiles || [],
    fileGuidance: cfg?.fileGuidance || '',
    guidePaths,
    configPaths,
    guidePathsIgnoredByCard,
    absentUi: pcBuilder ? 'pc-builder' : 'install-button',
    missingFilesUi: selfContained ? 'standalone-ready' : 'send-files',
    presentFilesUi: selfContained ? 'standalone-ready' : 'files-ready',
    playButtonWhenReady: true
  }
}

export function catalogInstallFacts(): CatalogInstallFact[] {
  return INITIAL_PORTS.map(catalogInstallFact)
}
