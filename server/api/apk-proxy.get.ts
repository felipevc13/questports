import { defineEventHandler, getQuery, createError, sendProxy } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url || !url.startsWith('https://')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing target URL'
    })
  }

  // Validate allowed domains for safety
  const parsed = new URL(url)
  const allowedHosts = [
    'github.com',
    'github-production-release-asset-2e65be.s3.amazonaws.com',
    'release-assets.githubusercontent.com',
    'objects.githubusercontent.com',
    'sidequestvr.com',
    'goldeneyevr.com',
    'lambda1vr.com',
    'doom3quest.com'
  ]

  const isAllowed = allowedHosts.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))
  if (!isAllowed) {
    throw createError({
      statusCode: 403,
      statusMessage: `Host ${parsed.hostname} is not allowed for APK proxying`
    })
  }

  // Stream proxy with proper headers
  return sendProxy(event, url, {
    headers: {
      'User-Agent': 'QuestPorts/1.0'
    }
  })
})
