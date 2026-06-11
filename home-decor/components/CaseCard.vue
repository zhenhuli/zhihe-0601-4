<template>
  <NuxtLink
    :to="`/case/${caseData.id}`"
    class="card group block animate-slide-up"
  >
    <div class="relative overflow-hidden aspect-[4/3]">
      <img
        :src="caseData.coverImage"
        :alt="caseData.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
      <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
        <span
          v-for="tag in caseData.tags.slice(0, 2)"
          :key="tag"
          class="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-decor-charcoal"
        >
          {{ tag }}
        </span>
      </div>
      <div class="absolute bottom-3 left-3 right-3">
        <h3 class="text-white font-bold text-base lg:text-lg mb-1 line-clamp-1 group-hover:text-decor-gold transition-colors">
          {{ caseData.title }}
        </h3>
        <div class="flex items-center gap-2 text-white/80 text-xs">
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {{ caseData.community }}
          </span>
        </div>
      </div>
    </div>
    <div class="p-4 lg:p-5">
      <div class="flex items-center justify-between gap-2 mb-3">
        <div class="flex items-center gap-3 text-xs lg:text-sm">
          <span class="flex items-center gap-1 text-decor-slate">
            <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
            {{ caseData.area }}㎡
          </span>
          <span class="w-px h-3 bg-decor-sand"></span>
          <span class="text-decor-slate">{{ getLayoutLabel(caseData.layout) }}</span>
        </div>
        <span class="text-primary-600 font-bold text-sm lg:text-base whitespace-nowrap">
          ¥{{ caseData.priceMin }}-{{ caseData.priceMax }}万
        </span>
      </div>
      <div class="flex items-center justify-between pt-3 border-t border-decor-sand/50">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-decor-gold flex items-center justify-center text-white text-xs font-bold">
            {{ caseData.designer.charAt(0) }}
          </div>
          <span class="text-xs text-decor-slate">设计师 {{ caseData.designer }}</span>
        </div>
        <span class="text-primary-600 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          查看详情
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { CaseItem } from '~/types'
import { LAYOUT_OPTIONS } from '~/types'

defineProps<{
  caseData: CaseItem
}>()

function getLayoutLabel(value: string): string {
  const opt = LAYOUT_OPTIONS.find(o => o.value === value)
  return opt?.label || value
}
</script>
