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
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || ''
    }
  },
  app: {
    head: {
      title: 'QuestPorts — The Standalone VR Database (Zero PC Required)',
      htmlAttrs: {
        lang: 'en',
        class: 'dark'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover classic PC & console games running natively in 6DoF VR on Meta Quest. No PC, no cables, zero streaming. Step-by-step install guides & file paths.' },
        { name: 'theme-color', content: '#06b6d4' },
        
        // Open Graph / Facebook / Discord
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://questports.vercel.app' },
        { property: 'og:site_name', content: 'QuestPorts' },
        { property: 'og:title', content: 'QuestPorts — The Standalone VR Database' },
        { property: 'og:description', content: 'Discover classic PC & console games running natively in 6DoF VR on Meta Quest. Zero PC required. Guides, APK downloads, and internal storage paths.' },
        { property: 'og:image', content: 'https://questports.vercel.app/covers/questports-og.png' },
        { property: 'og:image:secure_url', content: 'https://questports.vercel.app/covers/questports-og.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:alt', content: 'QuestPorts - The Standalone VR Database' },

        // Twitter / X / Discord Large Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'QuestPorts — The Standalone VR Database' },
        { name: 'twitter:description', content: 'Discover classic PC & console games running natively in 6DoF VR on Meta Quest. Zero PC required.' },
        { name: 'twitter:image', content: 'https://questports.vercel.app/covers/questports-og.png' }
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

