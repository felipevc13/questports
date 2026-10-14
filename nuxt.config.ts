import { DEFAULT_MEDIA_BASE } from './app/data/coverUrl'
import { DEFAULT_KOFI_URL } from './app/lib/kofi'
import { isAnalyticsEnabled } from './app/lib/analytics'
import { APK_PROXY_WORKER_BASE, apkProxyMaxBytes } from './app/lib/apkProxyPolicy'
import { catalogIsrRule } from './app/lib/isrCache'
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
      mediaBase: process.env.NUXT_PUBLIC_MEDIA_BASE ?? DEFAULT_MEDIA_BASE,
      // Empty string hides the Ko-fi line and footer link. Unset uses the public page.
      kofiUrl: process.env.NUXT_PUBLIC_KOFI_URL ?? DEFAULT_KOFI_URL
    }
  },
  /**
   * Catalog cards are NuxtLinks. Nuxt 4.5 prefetches on visibility by default,
   * which downloads `/ports/<slug>/_payload.json` for every card that scrolls
   * into view. Interaction prefetch (pointerenter and focus) still warms the
   * next page on hover, keyboard focus, or the start of a tap.
   */
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: { visibility: false, interaction: true }
      }
    }
  },
  /**
   * Vercel CDN cache. Nitro's `swr` only stores the HTML inside the function,
   * so every view still counts as Fast Origin Transfer. `isr` writes a
   * prerender config and is what returns x-vercel-cache HIT.
   * `allowQuery: []` shares one entry across query strings. `passQuery: false`
   * strips the query before render, so ?fbclid and ?inApp=1 cannot each
   * generate a fresh document. Client code reads window.location after
   * hydration. Expiration is one day: the 04:00 UTC release sync still
   * shows up, and a deploy starts a new cache. API and admin stay dynamic.
   * Quest Browser / in-app detection is applied after hydration so this HTML
   * does not vary on User-Agent.
   * Cover and preview files are immutable for a year; URLs carry `?v=` so a
   * new file still shows up. Favicons are one stable URL cached for a year.
   * Hashed `/_nuxt/**` files already get `public, max-age=31536000, immutable`
   * from Nitro, including the Vercel preset.
   */
  routeRules: {
    '/': { isr: catalogIsrRule() },
    '/app': { isr: catalogIsrRule() },
    '/library': { isr: catalogIsrRule() },
    '/ports/**': { isr: catalogIsrRule() },
    '/covers/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/previews/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/favicon.ico': { headers: { 'cache-control': 'public, max-age=31536000' } },
    '/favicon.png': { headers: { 'cache-control': 'public, max-age=31536000' } },
    '/favicon.svg': { headers: { 'cache-control': 'public, max-age=31536000' } },
    '/apple-touch-icon.png': { headers: { 'cache-control': 'public, max-age=31536000' } },
    '/apple-touch-icon-precomposed.png': { headers: { 'cache-control': 'public, max-age=31536000' } },
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
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap' }
      ]
    }
  }
})

