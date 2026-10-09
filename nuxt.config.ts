import { isAnalyticsEnabled } from './app/lib/analytics'
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
      analyticsEnabled: isAnalyticsEnabled(process.env)
    }
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

