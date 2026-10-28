import { defineEventHandler, getRouterParam, setResponseHeader } from 'h3'
import { supabaseAdmin } from '../../../utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')?.trim().toLowerCase()
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      portSlug: slug || '',
      totalReviews: 0,
      worksGreatCount: 0,
      needsTweaksCount: 0,
      cantRunCount: 0,
      appVerifiedCount: 0,
      worksPct: null,
      lastReviewAt: null,
      headsets: {}
    }
  }

  // Cache response at edge/browser for 60s, background revalidate up to 10 min
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, stale-while-revalidate=600')

  const admin = supabaseAdmin()
  if (!admin) {
    return {
      portSlug: slug,
      totalReviews: 0,
      worksGreatCount: 0,
      needsTweaksCount: 0,
      cantRunCount: 0,
      appVerifiedCount: 0,
      worksPct: null,
      lastReviewAt: null,
      headsets: {}
    }
  }

  try {
    const [summaryRes, headsetsRes] = await Promise.all([
      admin
        .from('port_community_summaries')
        .select('*')
        .eq('port_slug', slug)
        .maybeSingle(),
      admin
        .from('port_community_headset_summaries')
        .select('headset, verdict, count')
        .eq('port_slug', slug)
    ])

    const row = summaryRes.data
    const headsetsMap: Record<string, { worksGreat: number; needsTweaks: number; cantRun: number }> = {}

    if (Array.isArray(headsetsRes.data)) {
      for (const h of headsetsRes.data) {
        if (!h.headset) continue
        if (!headsetsMap[h.headset]) {
          headsetsMap[h.headset] = { worksGreat: 0, needsTweaks: 0, cantRun: 0 }
        }
        if (h.verdict === 'works_great') headsetsMap[h.headset].worksGreat += h.count || 0
        else if (h.verdict === 'needs_tweaks') headsetsMap[h.headset].needsTweaks += h.count || 0
        else if (h.verdict === 'cant_run') headsetsMap[h.headset].cantRun += h.count || 0
      }
    }

    if (!row) {
      return {
        portSlug: slug,
        totalReviews: 0,
        worksGreatCount: 0,
        needsTweaksCount: 0,
        cantRunCount: 0,
        appVerifiedCount: 0,
        worksPct: null,
        lastReviewAt: null,
        headsets: headsetsMap
      }
    }

    return {
      portSlug: slug,
      totalReviews: Number(row.total_reviews) || 0,
      worksGreatCount: Number(row.works_great_count) || 0,
      needsTweaksCount: Number(row.needs_tweaks_count) || 0,
      cantRunCount: Number(row.cant_run_count) || 0,
      appVerifiedCount: Number(row.app_verified_count) || 0,
      worksPct: row.works_pct !== null && row.works_pct !== undefined ? Number(row.works_pct) : null,
      lastReviewAt: row.last_review_at || null,
      headsets: headsetsMap
    }
  } catch (err) {
    console.error('[QuestPorts Community] Error reading summary for', slug, err)
    return {
      portSlug: slug,
      totalReviews: 0,
      worksGreatCount: 0,
      needsTweaksCount: 0,
      cantRunCount: 0,
      appVerifiedCount: 0,
      worksPct: null,
      lastReviewAt: null,
      headsets: {}
    }
  }
})
