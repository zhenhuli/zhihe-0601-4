export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  compatibilityDate: '2026-06-03',
  typescript: {
    strict: true,
    typeCheck: true
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
      title: '秒杀活动 - 限时特惠',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '限时秒杀活动，超值优惠等你来抢' }
      ]
    }
  },
  experimental: {
    appManifest: false
  },
  runtimeConfig: {
    public: {
      apiBase: '/api',
      paymentTimeout: 900
    }
  }
})
