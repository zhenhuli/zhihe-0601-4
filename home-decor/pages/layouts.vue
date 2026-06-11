<template>
  <div>
    <section class="relative bg-gradient-to-br from-decor-olive via-decor-sage to-primary-500 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="80" cy="20" r="30" fill="white"/>
          <circle cx="20" cy="80" r="25" fill="white"/>
        </svg>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center text-white">
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          科学户型解析 · 合理空间利用
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">户型分类推荐</h1>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          从一居室到别墅复式，为每种户型量身定制最优设计方案，
          找到最适合您家的装修灵感
        </p>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-decor-cream to-transparent"></div>
    </section>
    <section class="py-12 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          <div
            v-for="layout in mockLayouts"
            :key="layout.id"
            class="card cursor-pointer group animate-slide-up"
            @click="selectLayout(layout.id)"
          >
            <div class="relative overflow-hidden aspect-[4/3] bg-decor-sand/20">
              <img
                :src="layout.image"
                :alt="layout.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div class="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary-600">
                {{ layout.typicalArea }}
              </div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-bold text-xl mb-1">{{ layout.name }}</h3>
                <div class="flex items-center gap-3 text-white/80 text-sm">
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    {{ layout.bedrooms }}卧
                  </span>
                  <span>{{ layout.livingrooms }}厅</span>
                  <span>{{ layout.bathrooms }}卫</span>
                </div>
              </div>
            </div>
            <div class="p-5">
              <p class="text-decor-slate text-sm mb-4 line-clamp-2">{{ layout.description }}</p>
              <div class="flex items-center justify-between pt-4 border-t border-decor-sand/30">
                <div class="flex -space-x-2">
                  <div v-for="n in Math.min(3, layout.caseIds.length)" :key="n" class="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-decor-gold flex items-center justify-center text-white text-xs font-bold">
                    {{ getInitial(n) }}
                  </div>
                </div>
                <div class="flex items-center gap-1 text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
                  {{ layout.caseIds.length }} 套案例
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-decor-gold/10">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="bg-gradient-to-r from-primary-500 to-decor-gold px-8 py-6 text-white">
            <h2 class="text-2xl font-bold mb-1">户型设计小贴士</h2>
            <p class="text-white/80">专业设计师总结的实用装修经验</p>
          </div>
          <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-decor-sand/30">
            <div class="p-8">
              <h3 class="font-bold text-lg text-decor-charcoal mb-4 flex items-center gap-2">
                <span class="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">1</span>
                小户型怎么装修显大？
              </h3>
              <ul class="space-y-3 text-decor-slate text-sm leading-relaxed">
                <li class="flex gap-2"><span class="text-primary-500 mt-1">•</span>选用浅色调墙面地面，延伸视觉空间</li>
                <li class="flex gap-2"><span class="text-primary-500 mt-1">•</span>定制嵌入式收纳，充分利用墙面空间</li>
                <li class="flex gap-2"><span class="text-primary-500 mt-1">•</span>多用途家具，沙发床、折叠桌节省空间</li>
                <li class="flex gap-2"><span class="text-primary-500 mt-1">•</span>开放式格局，减少隔断增加通透感</li>
              </ul>
            </div>
            <div class="p-8">
              <h3 class="font-bold text-lg text-decor-charcoal mb-4 flex items-center gap-2">
                <span class="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">2</span>
                大户型如何避免空旷？
              </h3>
              <ul class="space-y-3 text-decor-slate text-sm leading-relaxed">
                <li class="flex gap-2"><span class="text-primary-500 mt-1">•</span>划分功能区，营造围合感空间</li>
                <li class="flex gap-2"><span class="text-primary-500 mt-1">•</span>层高足够可做吊顶，增加层次感</li>
                <li class="flex gap-2"><span class="text-primary-500 mt-1">•</span>大面积墙面用护墙板或艺术涂料</li>
                <li class="flex gap-2"><span class="text-primary-500 mt-1">•</span>软装搭配选择体量感大的家具</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { mockLayouts } from '~/config/mockData'

const router = useRouter()

function selectLayout(layoutId: string) {
  router.push({
    path: '/',
    query: { layout: layoutId }
  })
}

function getInitial(n: number): string {
  return ['A', 'B', 'C', 'D'][n - 1] || 'Z'
}
</script>
