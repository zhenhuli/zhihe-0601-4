<template>
  <div class="min-h-screen">
    <div class="bg-gradient-to-r from-seckill-red to-seckill-orange py-6 px-4">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">全部秒杀商品</h1>
        <div class="flex items-center gap-4 text-white/80 text-sm">
          <span>共 {{ allProducts.length }} 件商品</span>
          <span>|</span>
          <span>{{ activityStore.activeSession?.name || '全部场次' }}</span>
        </div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4">
      <div class="sticky top-16 z-30 bg-white/95 backdrop-blur-md py-4 border-b">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex-1 max-w-xs">
            <div class="relative">
              <input 
                v-model="searchKeyword"
                type="text"
                placeholder="搜索商品..."
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-seckill-red/30 focus:border-seckill-red"
              />
              <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm text-gray-500">场次：</span>
            <div class="flex gap-1">
              <button 
                v-for="session in sessionOptions" 
                :key="session.id"
                @click="selectedSessionId = session.id"
                class="px-3 py-1.5 rounded-full text-sm transition-colors"
                :class="selectedSessionId === session.id 
                  ? 'bg-seckill-red text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                {{ session.name }}
              </button>
            </div>
          </div>
          
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm text-gray-500">排序：</span>
            <div class="flex gap-1">
              <button 
                v-for="sort in sortOptions" 
                :key="sort.value"
                @click="currentSort = sort.value"
                class="px-3 py-1.5 rounded-full text-sm transition-colors"
                :class="currentSort === sort.value 
                  ? 'bg-seckill-red text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                {{ sort.label }}
              </button>
            </div>
          </div>
          
          <button 
            @click="showFilters = !showFilters"
            class="md:hidden px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm"
          >
            筛选
          </button>
        </div>
        
        <div v-show="showFilters" class="mt-4 pt-4 border-t md:hidden">
          <div class="space-y-3">
            <div>
              <span class="text-sm text-gray-500 block mb-2">价格区间：</span>
              <div class="flex items-center gap-2">
                <input 
                  v-model.number="priceRange.min"
                  type="number"
                  placeholder="最低价"
                  class="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <span class="text-gray-400">-</span>
                <input 
                  v-model.number="priceRange.max"
                  type="number"
                  placeholder="最高价"
                  class="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <span class="text-sm text-gray-500 block mb-2">折扣力度：</span>
              <div class="flex gap-2 flex-wrap">
                <button 
                  v-for="discount in discountOptions" 
                  :key="discount.value"
                  @click="selectedDiscount = discount.value"
                  class="px-3 py-1.5 rounded-full text-sm transition-colors"
                  :class="selectedDiscount === discount.value 
                    ? 'bg-seckill-red text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                >
                  {{ discount.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="hidden md:block mt-6 mb-4">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">价格区间：</span>
            <input 
              v-model.number="priceRange.min"
              type="number"
              placeholder="最低价"
              class="w-24 px-3 py-2 border rounded-lg text-sm"
            />
            <span class="text-gray-400">-</span>
            <input 
              v-model.number="priceRange.max"
              type="number"
              placeholder="最高价"
              class="w-24 px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">折扣力度：</span>
            <div class="flex gap-2">
              <button 
                v-for="discount in discountOptions" 
                :key="discount.value"
                @click="selectedDiscount = discount.value"
                class="px-3 py-1.5 rounded-full text-sm transition-colors"
                :class="selectedDiscount === discount.value 
                  ? 'bg-seckill-red text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                {{ discount.label }}
              </button>
            </div>
          </div>
          
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="onlyInStock" class="w-4 h-4 accent-seckill-red" />
            <span class="text-sm text-gray-600">仅看有货</span>
          </label>
        </div>
      </div>
      
      <div v-if="filteredProducts.length > 0" ref="productListRef" class="pb-8">
        <div 
          v-observe-visibility="handleVisibility"
          v-for="(product, index) in displayedProducts" 
          :key="product.id"
          class="scroll-reveal"
          :data-index="index"
        >
          <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-4 product-card">
            <div class="flex flex-col sm:flex-row">
              <NuxtLink 
                :to="`/products/${product.id}`"
                class="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-100"
              >
                <SeckillImage 
                :src="product.mainImage" 
                :alt="product.name"
                wrapper-class="w-full h-full"
              />
                <div class="absolute top-2 left-2">
                  <span class="discount-tag">{{ product.discount }}折</span>
                </div>
                <div 
                  v-if="product.remainingStock === 0"
                  class="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <span class="text-white font-bold text-lg">已售罄</span>
                </div>
              </NuxtLink>
              
              <div class="flex-1 p-4 flex flex-col">
                <div class="flex-1">
                  <NuxtLink 
                    :to="`/products/${product.id}`"
                    class="text-base font-medium text-gray-900 line-clamp-2 hover:text-seckill-red transition-colors"
                  >
                    {{ product.name }}
                  </NuxtLink>
                  
                  <div class="mt-2 flex items-center gap-2">
                    <span 
                      class="text-xs px-2 py-0.5 rounded-full"
                      :class="getProductSession(product)?.status === SessionStatus.ACTIVE 
                        ? 'bg-seckill-red/10 text-seckill-red' 
                        : 'bg-gray-100 text-gray-500'"
                    >
                      {{ getProductSession(product)?.name }}
                    </span>
                    <span 
                      v-if="product.remainingStock === 0"
                      class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
                    >
                      已售罄
                    </span>
                    <span 
                      v-else-if="product.remainingStock < product.totalStock * 0.1"
                      class="text-xs px-2 py-0.5 rounded-full bg-seckill-orange/10 text-seckill-orange"
                    >
                      即将售罄
                    </span>
                  </div>
                  
                  <div class="mt-4">
                    <StockProgress 
                      :current="product.remainingStock" 
                      :total="product.totalStock"
                      show-numbers
                    />
                  </div>
                </div>
                
                <div class="mt-4 flex items-end justify-between">
                  <div>
                    <div class="flex items-baseline gap-2">
                      <span class="text-2xl font-bold text-seckill-red">
                        ¥{{ product.seckillPrice.toLocaleString() }}
                      </span>
                      <span class="text-sm text-gray-400 line-through">
                        ¥{{ product.originalPrice.toLocaleString() }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      已抢 {{ product.soldCount }} 件
                    </p>
                  </div>
                  
                  <button 
                    @click="handleBuyClick(product)"
                    :disabled="!canBuy(product)"
                    class="px-6 py-2.5 rounded-full text-sm font-medium transition-all"
                    :class="getBuyButtonClass(product)"
                  >
                    {{ getBuyButtonText(product) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="isLoadingMore" class="text-center py-8">
          <div class="w-8 h-8 border-2 border-seckill-red border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-gray-500 text-sm mt-2">加载中...</p>
        </div>
        
        <div v-else-if="displayedProducts.length >= filteredProducts.length && filteredProducts.length > 0" class="text-center py-8">
          <p class="text-gray-400 text-sm">— 已显示全部商品 —</p>
        </div>
      </div>
      
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-gray-500 mb-2">没有找到符合条件的商品</p>
        <button 
          @click="resetFilters"
          class="text-seckill-red hover:underline text-sm"
        >
          重置筛选条件
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useDebounce, useThrottle } from '~/composables/usePerformance'
import { useSeckillPurchase } from '~/composables/useSeckillPurchase'
import { SessionStatus } from '~/types'

const activityStore = useActivityStore()
const userStore = useUserStore()
const modalStore = useModalStore()

const { handlePurchase } = useSeckillPurchase()

const searchKeyword = ref('')
const selectedSessionId = ref('all')
const currentSort = ref('default')
const priceRange = ref({ min: undefined as number | undefined, max: undefined as number | undefined })
const selectedDiscount = ref('all')
const onlyInStock = ref(false)
const showFilters = ref(false)
const isLoadingMore = ref(false)
const displayCount = ref(10)
const productListRef = ref<HTMLElement | null>(null)

const sortOptions = [
  { value: 'default', label: '默认' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' },
  { value: 'discount', label: '折扣力度' },
  { value: 'sales', label: '销量优先' },
  { value: 'stock', label: '库存优先' }
]

const discountOptions = [
  { value: 'all', label: '全部' },
  { value: '3', label: '3折以下' },
  { value: '5', label: '5折以下' },
  { value: '7', label: '7折以下' }
]

const allProducts = computed(() => activityStore.products)

const sessionOptions = computed(() => [
  { id: 'all', name: '全部' },
  ...activityStore.sessions.map(s => ({ id: s.id, name: s.name }))
])

const filteredProducts = computed(() => {
  let products = [...allProducts.value]
  
  if (selectedSessionId.value !== 'all') {
    products = products.filter(p => p.sessionId === selectedSessionId.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(keyword) || 
      (p.description && p.description.toLowerCase().includes(keyword))
    )
  }
  
  if (priceRange.value.min !== undefined) {
    products = products.filter(p => p.seckillPrice >= (priceRange.value.min || 0))
  }
  if (priceRange.value.max !== undefined && priceRange.value.max > 0) {
    products = products.filter(p => p.seckillPrice <= priceRange.value.max!)
  }
  
  if (selectedDiscount.value !== 'all') {
    const maxDiscount = parseFloat(selectedDiscount.value)
    products = products.filter(p => p.discount <= maxDiscount)
  }
  
  if (onlyInStock.value) {
    products = products.filter(p => p.remainingStock > 0)
  }
  
  switch (currentSort.value) {
    case 'price_asc':
      products.sort((a, b) => a.seckillPrice - b.seckillPrice)
      break
    case 'price_desc':
      products.sort((a, b) => b.seckillPrice - a.seckillPrice)
      break
    case 'discount':
      products.sort((a, b) => a.discount - b.discount)
      break
    case 'sales':
      products.sort((a, b) => b.soldCount - a.soldCount)
      break
    case 'stock':
      products.sort((a, b) => b.remainingStock - a.remainingStock)
      break
  }
  
  return products
})

const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayCount.value)
})

const getProductSession = (product: any) => {
  return activityStore.sessions.find(s => s.id === product.sessionId)
}

const canBuy = (product: any) => {
  if (product.remainingStock === 0) return false
  const session = getProductSession(product)
  return session?.status === SessionStatus.ACTIVE
}

const getBuyButtonClass = (product: any) => {
  if (product.remainingStock === 0) {
    return 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }
  const session = getProductSession(product)
  if (session?.status === SessionStatus.UPCOMING) {
    return 'bg-seckill-orange/10 text-seckill-orange hover:bg-seckill-orange/20'
  }
  if (session?.status === SessionStatus.PAST) {
    return 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }
  return 'bg-seckill-red text-white hover:bg-seckill-red/90 active:scale-95'
}

const getBuyButtonText = (product: any) => {
  if (product.remainingStock === 0) return '已售罄'
  const session = getProductSession(product)
  if (session?.status === SessionStatus.UPCOMING) return '即将开始'
  if (session?.status === SessionStatus.PAST) return '已结束'
  return '立即抢购'
}

const handleBuyClick = (product: any) => {
  if (!userStore.isLoggedIn) {
    userStore.setPendingAction(() => handleBuyClick(product))
    userStore.openLoginModal()
    return
  }
  
  const session = getProductSession(product)
  if (session?.status === SessionStatus.UPCOMING) {
    modalStore.showCountdownModal(session.startTime, `距离本场开始还有`)
    return
  }
  
  handlePurchase(product.id)
}

const resetFilters = () => {
  searchKeyword.value = ''
  selectedSessionId.value = 'all'
  currentSort.value = 'default'
  priceRange.value = { min: undefined, max: undefined }
  selectedDiscount.value = 'all'
  onlyInStock.value = false
}

const loadMore = () => {
  if (isLoadingMore.value) return
  if (displayCount.value >= filteredProducts.value.length) return
  
  isLoadingMore.value = true
  setTimeout(() => {
    displayCount.value += 10
    isLoadingMore.value = false
  }, 500)
}

const { throttledFn: handleScroll } = useThrottle(() => {
  if (!productListRef.value) return
  
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight
  
  if (scrollTop + clientHeight >= scrollHeight - 500) {
    loadMore()
  }
}, 200)

const handleVisibility = (isVisible: boolean, entry: IntersectionObserverEntry) => {
  if (isVisible) {
    entry.target.classList.add('scroll-reveal--visible')
  }
}

const { debouncedFn: debouncedSearch } = useDebounce((value: string) => {
  displayCount.value = 10
}, 300)

watch(searchKeyword, debouncedSearch)

let statusTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  statusTimer = setInterval(() => {
    activityStore.updateSessionStatuses()
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (statusTimer) clearInterval(statusTimer)
})

definePageMeta({
  title: '全部秒杀商品'
})
</script>
