import { defineEventHandler, getRouterParam, setResponseHeader } from 'h3'
import { clientIp } from '../../../utils/clientIp'
import { fingerprintValue } from '../../../utils/verificationIngest'
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
      headsets: {},
      myVote: null
    }
  }

  // Private cache so personal vote state is not shared across users on edge CDN
  setResponseHeader(event, 'Cache-Control', 'private, max-age=10, stale-while-revalidate=60')

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
      headsets: {},
      myVote: null
    }
  }

  const ip = clientIp(event)
  const config = useRuntimeConfig()
  const salt = String(config.supabaseServiceRoleKey || 'questports_community_salt')
  const ipHash = fingerprintValue(ip, salt)

  try {
    const [summaryRes, headsetsRes, myVoteRes] = await Promise.all([
      admin
        .from('port_community_summaries')
        .select('*')
        .eq('port_slug', slug)
        .maybeSingle(),
      admin
        .from('port_community_headset_summaries')
        .select('headset, verdict, count')
        .eq('port_slug', slug),
      admin
        .from('port_community_reviews')
        .select('verdict, issue_tag, headset, port_version, updated_at, created_at')
        .eq('port_slug', slug)
        .eq('ip_hash', ipHash)
        .eq('is_flagged', false)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
    ])

    const row = summaryRes.data
    const headsetsMap: Record<string, { worksGreat: number; needsTweaks: number; cantRun: number }> = {}

    if (Array.isArray(headsetsRes.data)) {
      for (const h of headsetsRes.data) {
        if (!h.headset) continue
        const entry = headsetsMap[h.headset] ?? { worksGreat: 0, needsTweaks: 0, cantRun: 0 }
        headsetsMap[h.headset] = entry
        if (h.verdict === 'works_great') entry.worksGreat += h.count || 0
        else if (h.verdict === 'needs_tweaks') entry.needsTweaks += h.count || 0
        else if (h.verdict === 'cant_run') entry.cantRun += h.count || 0
      }
    }

    const myVoteRow = myVoteRes.data
    const myVote = myVoteRow ? {
      verdict: myVoteRow.verdict,
      issueTag: myVoteRow.issue_tag || null,
      headset: myVoteRow.headset || null,
      portVersion: myVoteRow.port_version || null,
      timestamp: new Date(myVoteRow.updated_at || myVoteRow.created_at).getTime()
    } : null

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
        headsets: headsetsMap,
        myVote
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
      headsets: headsetsMap,
      myVote
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
      headsets: {},
      myVote: null
    }
  }
})
