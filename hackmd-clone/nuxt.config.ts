export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2026-06-02',
  css: [
    '~/assets/css/github-markdown.css',
    '~/assets/css/main.css'
  ],
  nitro: {
    plugins: ['~/server/plugins/websocket.ts']
  }
})
