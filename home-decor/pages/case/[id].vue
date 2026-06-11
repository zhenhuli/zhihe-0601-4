<template>
  <div v-if="caseData">
    <div class="bg-white border-b border-decor-sand/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center gap-2 text-sm">
          <NuxtLink to="/" class="text-decor-slate hover:text-primary-600 transition-colors">首页</NuxtLink>
          <svg class="w-4 h-4 text-decor-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <NuxtLink to="/" class="text-decor-slate hover:text-primary-600 transition-colors">案例展厅</NuxtLink>
          <svg class="w-4 h-4 text-decor-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-decor-charcoal font-medium line-clamp-1">{{ caseData.title }}</span>
        </div>
      </div>
    </div>
    <section class="py-8 lg:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-5 gap-8">
          <div class="lg:col-span-3">
            <div class="relative rounded-3xl overflow-hidden shadow-xl mb-4 group">
              <img
                :src="caseData.panoramaImages[currentImage]"
                :alt="`${caseData.title} - ${imageLabels[currentImage]}`"
                class="w-full aspect-[16/10] object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="absolute top-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-decor-charcoal flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  全景效果图
                </span>
                <span class="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                  {{ currentImage + 1 }} / {{ caseData.panoramaImages.length }}
                </span>
              </div>
              <button
                v-if="currentImage > 0"
                @click="prevImage"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:-translate-x-0.5 opacity-0 group-hover:opacity-100"
              >
                <svg class="w-5 h-5 text-decor-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                v-if="currentImage < caseData.panoramaImages.length - 1"
                @click="nextImage"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:translate-x-0.5 opacity-0 group-hover:opacity-100"
              >
                <svg class="w-5 h-5 text-decor-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div class="grid grid-cols-4 gap-2 sm:gap-3">
              <button
                v-for="(img, idx) in caseData.panoramaImages"
                :key="idx"
                @click="currentImage = idx"
                class="relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300"
                :class="currentImage === idx ? 'ring-4 ring-primary-500 ring-offset-2' : 'opacity-70 hover:opacity-100'"
              >
                <img :src="img" :alt="imageLabels[idx]" class="w-full h-full object-cover"/>
                <div class="absolute inset-0 bg-black/30 flex items-center justify-center" v-if="currentImage === idx">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                </div>
                <span class="absolute bottom-1 left-1 px-2 py-0.5 bg-black/50 rounded text-xs text-white">{{ imageLabels[idx] }}</span>
              </button>
            </div>
          </div>
          <div class="lg:col-span-2">
            <div class="sticky top-24 space-y-6">
              <div>
                <div class="flex flex-wrap gap-2 mb-4">
                  <span v-for="tag in caseData.tags" :key="tag" class="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                    {{ tag }}
                  </span>
                </div>
                <h1 class="text-2xl lg:text-3xl font-bold text-decor-charcoal mb-3">{{ caseData.title }}</h1>
                <p class="text-decor-slate leading-relaxed">{{ caseData.description }}</p>
              </div>
              <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
                <div class="text-sm text-white/80 mb-1">参考总造价</div>
                <div class="flex items-baseline gap-1 mb-4">
                  <span class="text-4xl font-bold">¥{{ caseData.priceMin }}-{{ caseData.priceMax }}</span>
                  <span class="text-xl">万</span>
                </div>
                <div class="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  <div>
                    <div class="text-white/70 text-xs mb-1">单平米造价</div>
                    <div class="font-semibold">约 ¥{{ Math.round(caseData.priceMin * 10000 / caseData.area) }}/㎡</div>
                  </div>
                  <div>
                    <div class="text-white/70 text-xs mb-1">建筑面积</div>
                    <div class="font-semibold">{{ caseData.area }} 平方米</div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-white rounded-xl p-4 border border-decor-sand/50">
                  <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2">
                    <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                  </div>
                  <div class="text-xs text-decor-slate mb-0.5">房屋面积</div>
                  <div class="font-semibold text-decor-charcoal">{{ caseData.area }}㎡</div>
                </div>
                <div class="bg-white rounded-xl p-4 border border-decor-sand/50">
                  <div class="w-9 h-9 rounded-lg bg-decor-olive/10 flex items-center justify-center mb-2">
                    <svg class="w-5 h-5 text-decor-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  </div>
                  <div class="text-xs text-decor-slate mb-0.5">户型结构</div>
                  <div class="font-semibold text-decor-charcoal">{{ getLayoutLabel(caseData.layout) }}</div>
                </div>
                <div class="bg-white rounded-xl p-4 border border-decor-sand/50">
                  <div class="w-9 h-9 rounded-lg bg-decor-gold/20 flex items-center justify-center mb-2">
                    <svg class="w-5 h-5 text-decor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div class="text-xs text-decor-slate mb-0.5">所在小区</div>
                  <div class="font-semibold text-decor-charcoal text-sm">{{ caseData.community }}</div>
                </div>
                <div class="bg-white rounded-xl p-4 border border-decor-sand/50">
                  <div class="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center mb-2">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <div class="text-xs text-decor-slate mb-0.5">主笔设计师</div>
                  <div class="font-semibold text-decor-charcoal">{{ caseData.designer }}</div>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row gap-3">
                <button @click="getQuote" class="flex-1 btn-primary !py-4 flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  获取同款报价
                </button>
                <button @click="openAppointment" class="flex-1 btn-secondary !py-4 flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  预约同款设计
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-12 bg-white border-y border-decor-sand/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="section-title !mb-1">装修用料清单</h2>
            <p class="section-subtitle !mb-0">精选环保优质材料，品质看得见</p>
          </div>
          <div class="hidden sm:flex items-center gap-2 text-sm text-decor-slate">
            <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            正品保障 · 假一赔十
          </div>
        </div>
        <div class="overflow-hidden rounded-2xl shadow-sm border border-decor-sand/30">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-decor-cream to-primary-50/50">
                <th class="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-decor-charcoal">材料名称</th>
                <th class="hidden sm:table-cell px-6 py-4 text-left text-sm font-semibold text-decor-charcoal">品牌</th>
                <th class="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-decor-charcoal">规格型号</th>
                <th class="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-decor-charcoal">用量</th>
                <th class="px-4 sm:px-6 py-4 text-right text-sm font-semibold text-decor-charcoal">单价</th>
                <th class="px-4 sm:px-6 py-4 text-right text-sm font-semibold text-decor-charcoal">小计</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-decor-sand/30">
              <tr v-for="(mat, idx) in caseData.materials" :key="idx" class="hover:bg-decor-cream/30 transition-colors">
                <td class="px-4 sm:px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-decor-gold/20 flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </div>
                    <span class="font-medium text-decor-charcoal">{{ mat.name }}</span>
                  </div>
                </td>
                <td class="hidden sm:table-cell px-6 py-4 text-decor-slate">{{ mat.brand }}</td>
                <td class="hidden md:table-cell px-6 py-4 text-decor-slate text-sm">{{ mat.specification }}</td>
                <td class="px-4 sm:px-6 py-4 text-center">
                  <span class="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">{{ mat.quantity }}</span>
                </td>
                <td class="px-4 sm:px-6 py-4 text-right text-decor-slate">¥{{ mat.unitPrice.toLocaleString() }}</td>
                <td class="px-4 sm:px-6 py-4 text-right">
                  <span class="font-bold text-primary-600">¥{{ calculateSubtotal(mat).toLocaleString() }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 flex justify-end">
          <div class="bg-gradient-to-r from-primary-500 to-decor-gold rounded-2xl px-8 py-5 text-white shadow-lg">
            <div class="flex items-baseline gap-2">
              <span class="text-white/80">材料费用合计：</span>
              <span class="text-3xl font-bold">¥{{ totalMaterials.toLocaleString() }}</span>
              <span class="text-white/80">元</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-12 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="section-title !mb-0">相关推荐案例</h2>
          <NuxtLink to="/" class="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            查看更多
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <CaseCard v-for="item in relatedCases" :key="item.id" :case-data="item"/>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="max-w-7xl mx-auto px-4 py-20 text-center">
    <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-decor-sand/20 flex items-center justify-center">
      <svg class="w-12 h-12 text-decor-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    </div>
    <h2 class="text-xl font-semibold mb-2">案例不存在</h2>
    <NuxtLink to="/" class="btn-primary inline-flex mt-4">返回案例列表</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockCases } from '~/config/mockData'
import { LAYOUT_OPTIONS } from '~/types'
import type { MaterialItem } from '~/types'

const route = useRoute()
const router = useRouter()
const appointmentStore = useAppointmentStore()

const currentImage = ref(0)
const imageLabels = ['客餐厅', '厨房', '主卧', '卫生间']

const caseId = computed(() => parseInt(route.params.id as string))
const caseData = computed(() => mockCases.find(c => c.id === caseId.value))

const relatedCases = computed(() => {
  if (!caseData.value) return []
  return mockCases
    .filter(c => c.id !== caseData.value!.id && (c.style === caseData.value!.style || c.layout === caseData.value!.layout))
    .slice(0, 4)
})

const totalMaterials = computed(() => {
  if (!caseData.value) return 0
  return caseData.value.materials.reduce((sum, m) => sum + calculateSubtotal(m), 0)
})

function calculateSubtotal(mat: MaterialItem): number {
  const qtyMatch = mat.quantity.match(/[\d.]+/)
  const qty = qtyMatch ? parseFloat(qtyMatch[0]) : 1
  return Math.round(qty * mat.unitPrice)
}

function getLayoutLabel(value: string): string {
  const opt = LAYOUT_OPTIONS.find(o => o.value === value)
  return opt?.label || value
}

function prevImage() {
  if (currentImage.value > 0) currentImage.value--
}

function nextImage() {
  if (caseData.value && currentImage.value < caseData.value.panoramaImages.length - 1) {
    currentImage.value++
  }
}

function getQuote() {
  if (caseData.value) {
    router.push({
      path: '/quote',
      query: { area: caseData.value.area.toString(), layout: caseData.value.layout }
    })
  }
}

function openAppointment() {
  appointmentStore.openModal()
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
})
</script>
