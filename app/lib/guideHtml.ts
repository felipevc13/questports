/** Prefer breaks after slashes in inline guide code so paths stay readable. */
export function softenGuideHtml(html: string): string {
  const blocks: string[] = []
  const withoutBlocks = html.replace(/<pre\b[\s\S]*?<\/pre>/gi, (block) => {
    blocks.push(block)
    return `%%GUIDE_PRE_${blocks.length - 1}%%`
  })

  const softened = withoutBlocks.replace(/<code\b([^>]*)>([\s\S]*?)<\/code>/gi, (_match, attrs, inner) => {
    const next = String(inner).replace(/\//g, '/<wbr>')
    return `<code${attrs}>${next}</code>`
  })

  return softened.replace(/%%GUIDE_PRE_(\d+)%%/g, (_match, index) => blocks[Number(index)] ?? '')
}
