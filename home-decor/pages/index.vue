<template>
  <div>
    <section class="relative bg-gradient-to-br from-primary-500 via-primary-600 to-decor-gold overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)"/>
        </svg>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div class="grid lg:grid-cols-2 gap-10 items-center">
          <div class="text-white">
            <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              已服务 10,000+ 家庭 · 满意度 98.6%
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              让每一个家<br/>
              都成为<span class="text-decor-gold">梦想的模样</span>
            </h1>
            <p class="text-white/80 text-lg mb-8 max-w-lg">
              精选真实装修案例，智能在线报价，专业设计师一对一服务。
              从设计到施工，一站式打造您的理想家居。
            </p>
            <div class="flex flex-wrap gap-4">
              <button @click="scrollToCases" class="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                浏览精选案例
              </button>
              <button @click="goToQuote" class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/25 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                免费智能报价
              </button>
            </div>
          </div>
          <div class="hidden lg:block relative">
            <div class="absolute -top-8 -left-8 w-72 h-72 bg-decor-gold/30 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-8 -right-8 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
            <div class="relative grid grid-cols-2 gap-4 p-2">
              <div class="space-y-4">
                <div class="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20modern%20living%20room%20interior%20design%20with%20large%20windows%20natural%20light%20high%20end%20furniture&image_size=portrait_4_3" alt="案例展示" class="w-full h-full object-cover"/>
                </div>
                <div class="aspect-square rounded-2xl overflow-hidden shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20modern%20kitchen%20design%20with%20island%20white%20cabinets%20marble%20countertops&image_size=square" alt="案例展示" class="w-full h-full object-cover"/>
                </div>
              </div>
              <div class="space-y-4 pt-8">
                <div class="aspect-square rounded-2xl overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20nordic%20style%20bedroom%20interior%20wood%20furniture%20soft%20lighting%20plants&image_size=square" alt="案例展示" class="w-full h-full object-cover"/>
                </div>
                <div class="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20bathroom%20design%20freestanding%20tub%20marble%20tile%20chandelier%20elegant&image_size=portrait_4_3" alt="案例展示" class="w-full h-full object-cover"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-decor-cream to-transparent"></div>
    </section>
    <section class="py-8 lg:py-12 border-b border-decor-sand/50 bg-white/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl lg:text-4xl font-bold text-gradient mb-1">{{ stat.value }}</div>
            <div class="text-decor-slate text-sm">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
    <section id="cases" class="py-10 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h2 class="section-title">精选装修案例</h2>
          <p class="section-subtitle">真实业主实拍案例，找到您心仪的家的样子</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-5 lg:p-6 mb-8 border border-decor-sand/30">
          <div class="space-y-5">
            <FilterGroup
              label="装修风格"
              :options="STYLE_OPTIONS"
              v-model="filters.style"
              @change="updateRoute"
            />
            <FilterGroup
              label="户型面积"
              :options="AREA_OPTIONS"
              v-model="filters.areaRange"
              @change="updateRoute"
            />
            <FilterGroup
              label="装修价位"
              :options="PRICE_OPTIONS"
              v-model="filters.priceRange"
              @change="updateRoute"
            />
            <FilterGroup
              label="户型结构"
              :options="LAYOUT_OPTIONS"
              v-model="filters.layout"
              @change="updateRoute"
            />
          </div>
          <div v-if="hasActiveFilters" class="mt-5 pt-5 border-t border-decor-sand/30 flex items-center justify-between">
            <span class="text-sm text-decor-slate">
              找到 <span class="font-bold text-primary-600">{{ filteredCases.length }}</span> 个匹配案例
            </span>
            <button @click="resetFilters" class="btn-ghost !py-1.5 text-sm flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              重置筛选
            </button>
          </div>
        </div>
        <div v-if="filteredCases.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <CaseCard
            v-for="caseItem in filteredCases"
            :key="caseItem.id"
            :case-data="caseItem"
          />
        </div>
        <div v-else class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-decor-sand/20 flex items-center justify-center">
            <svg class="w-12 h-12 text-decor-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-decor-charcoal mb-2">暂无匹配的案例</h3>
          <p class="text-decor-slate mb-6">试试调整筛选条件，发现更多精彩案例</p>
          <button @click="resetFilters" class="btn-primary">重置筛选条件</button>
        </div>
      </div>
    </section>
    <section class="py-16 bg-gradient-to-br from-primary-50 to-decor-gold/10">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden">
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
          <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-decor-gold/20 rounded-full blur-3xl opacity-50"></div>
          <div class="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 class="text-2xl lg:text-3xl font-bold text-decor-charcoal mb-4">
                不确定哪种风格适合你？
              </h2>
              <p class="text-decor-slate mb-6">
                填写您的户型信息，10秒获取专属装修方案与精准报价，还有3位设计师为您提供免费方案PK！
              </p>
              <ul class="space-y-3 mb-8">
                <li class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span class="text-decor-charcoal">智能算法，10秒生成报价清单</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span class="text-decor-charcoal">50万+真实项目数据支撑</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span class="text-decor-charcoal">全程免费，无任何隐形消费</span>
                </li>
              </ul>
              <div class="flex flex-wrap gap-4">
                <button @click="goToQuote" class="btn-primary !py-3.5 px-7 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  立即测算报价
                </button>
                <button @click="openAppointment" class="btn-secondary !py-3.5 px-7">
                  预约设计师
                </button>
              </div>
            </div>
            <div class="hidden lg:block">
              <div class="relative">
                <div class="aspect-square rounded-3xl overflow-hidden shadow-xl">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20interior%20designer%20team%20working%20on%20project%20modern%20office%20creative%20workspace&image_size=square_hd" alt="设计师团队" class="w-full h-full object-cover"/>
                </div>
                <div class="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-float">
                  <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="font-bold text-decor-charcoal">200+</div>
                    <div class="text-xs text-decor-slate">专业设计师</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { STYLE_OPTIONS, AREA_OPTIONS, PRICE_OPTIONS, LAYOUT_OPTIONS } from '~/types'
import { mockCases } from '~/config/mockData'
import type { FilterState } from '~/types'

const router = useRouter()
const route = useRoute()
const appointmentStore = useAppointmentStore()

const filters = ref<FilterState>({
  style: '',
  areaRange: '',
  priceRange: '',
  layout: ''
})

const stats = [
  { value: '10,000+', label: '成功服务家庭' },
  { value: '200+', label: '专业设计师' },
  { value: '15年', label: '行业深耕经验' },
  { value: '98.6%', label: '客户满意度' }
]

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(v => v !== '')
})

const filteredCases = computed(() => {
  return mockCases.filter(item => {
    if (filters.value.style && item.style !== filters.value.style) return false
    if (filters.value.layout && item.layout !== filters.value.layout) return false
    if (filters.value.areaRange) {
      const rangeStr = filters.value.areaRange
      let minArea = 0
      let maxArea = Infinity
      if (rangeStr.endsWith('+')) {
        minArea = parseFloat(rangeStr)
      } else {
        const parts = rangeStr.split('-')
        minArea = parseFloat(parts[0]) || 0
        maxArea = parseFloat(parts[1]) || Infinity
      }
      if (item.area < minArea || item.area > maxArea) return false
    }
    if (filters.value.priceRange) {
      const range = filters.value.priceRange
      if (range.endsWith('+')) {
        if (item.priceMin < parseFloat(range)) return false
      } else {
        const [minP, maxP] = range.split('-').map(v => parseFloat(v))
        if (item.priceMin >= maxP || item.priceMax <= minP) return false
      }
    }
    return true
  })
})

function updateRoute() {
  const query: Record<string, string> = {}
  if (filters.value.style) query.style = filters.value.style
  if (filters.value.areaRange) query.area = filters.value.areaRange
  if (filters.value.priceRange) query.price = filters.value.priceRange
  if (filters.value.layout) query.layout = filters.value.layout
  router.replace({ query })
}

function resetFilters() {
  filters.value = {
    style: '',
    areaRange: '',
    priceRange: '',
    layout: ''
  }
  router.replace({ query: {} })
}

function scrollToCases() {
  const el = document.getElementById('cases')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function goToQuote() {
  router.push('/quote')
}

function openAppointment() {
  appointmentStore.openModal()
}

onMounted(() => {
  if (route.query.style) filters.value.style = route.query.style as string
  if (route.query.area) filters.value.areaRange = route.query.area as string
  if (route.query.price) filters.value.priceRange = route.query.price as string
  if (route.query.layout) filters.value.layout = route.query.layout as string
})

watch(() => route.query, (q) => {
  filters.value.style = (q.style as string) || ''
  filters.value.areaRange = (q.area as string) || ''
  filters.value.priceRange = (q.price as string) || ''
  filters.value.layout = (q.layout as string) || ''
})
</script>
