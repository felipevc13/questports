import { DEFAULT_MEDIA_BASE } from './app/data/coverUrl'
import { isAnalyticsEnabled } from './app/lib/analytics'
import { APK_PROXY_WORKER_BASE, apkProxyMaxBytes } from './app/lib/apkProxyPolicy'
import { SOCIAL_DESCRIPTION, SOCIAL_TITLE, defaultSocialMeta } from './app/lib/socialMeta'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    verificationAdminSecret: process.env.VERIFICATION_ADMIN_SECRET || '',
    analyticsSalt: process.env.ANALYTICS_SALT || '',
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
      analyticsEnabled: isAnalyticsEnabled(process.env),
      apkProxyMaxBytes: apkProxyMaxBytes(process.env),
      // Empty string keeps /api/apk-proxy on this origin. Unset uses the Worker.
      apkProxyBase: process.env.NUXT_PUBLIC_APK_PROXY_BASE ?? APK_PROXY_WORKER_BASE,
      // Unset uses the Cloudflare media host. Empty string keeps covers here and disables MP4s.
      mediaBase: process.env.NUXT_PUBLIC_MEDIA_BASE ?? DEFAULT_MEDIA_BASE
    }
  },
  /**
   * Vercel CDN cache. Nitro's `swr` only stores the HTML inside the function,
   * so every view still counts as Fast Origin Transfer. `isr` writes a
   * prerender config (expiration 3600, stale while revalidating) and is what
   * returns x-vercel-cache HIT. API, admin, and verification routes stay
   * dynamic. Quest Browser / in-app detection is applied after hydration so
   * this HTML does not vary on User-Agent.
   * Cover and preview files are immutable for a year; URLs carry `?v=` so a
   * new file still shows up.
   */
  routeRules: {
    '/': { isr: { expiration: 3600, passQuery: true } },
    '/ports/**': { isr: { expiration: 3600, passQuery: true } },
    '/covers/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/previews/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/api/**': { isr: false },
    '/admin/**': { isr: false }
  },
  app: {
    head: {
      title: SOCIAL_TITLE,
      htmlAttrs: {
        lang: 'en',
        class: 'dark'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, interactive-widget=resizes-content' },
        { name: 'description', content: SOCIAL_DESCRIPTION },
        { name: 'theme-color', content: '#06b6d4' },
        ...defaultSocialMeta()
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=2' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png?v=2' },
        { rel: 'shortcut icon', href: '/favicon.ico?v=2' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap' }
      ]
    }
  }
})

