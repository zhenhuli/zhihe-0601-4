export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  compatibilityDate: '2026-06-11',
  typescript: {
    strict: true,
    typeCheck: false
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  imports: {
    dirs: ['stores', 'composables', 'types']
  },
  app: {
    head: {
      title: '智禾装饰 - 家装案例与智能报价',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '专业家装装修案例展示，智能在线报价测算，为您打造理想家居' }
      ]
    }
  },
  experimental: {
    appManifest: false
  },
  runtimeConfig: {
    public: {
      appName: '智禾装饰'
    }
  }
})
