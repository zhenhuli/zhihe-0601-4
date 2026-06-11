<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="product" class="max-w-7xl mx-auto px-4 pb-24">
      <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 py-6">
        <div class="w-full lg:w-1/2">
          <div class="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg sticky top-20">
            <div class="relative w-full h-full">
              <SeckillImage 
                :src="currentImage" 
                :alt="product.name"
                wrapper-class="w-full h-full"
              />
              
              <div v-if="status !== 'in_progress'" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div class="text-center text-white">
                  <p class="text-2xl font-bold mb-2">{{ statusText }}</p>
                  <CountdownDisplay 
                    v-if="status === 'not_started' && productSession" 
                    :countdown="startCountdown.countdown.value"
                    class="justify-center"
                  />
                </div>
              </div>
              
              <div class="absolute top-4 left-4">
                <span class="discount-tag text-lg px-4 py-1.5">{{ product.discount }}折</span>
              </div>
            </div>
            
            <div v-if="product.images && product.images.length > 1" class="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2">
              <button 
                v-for="(img, index) in product.images" 
                :key="index"
                @click="currentImageIndex = index"
                class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors"
                :class="currentImageIndex === index ? 'border-seckill-red' : 'border-transparent'"
              >
                <img :src="img" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="w-full lg:w-1/2">
          <div class="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <div class="flex items-start gap-3 mb-4">
              <span 
                v-for="tag in product.tags.slice(0, 3)" 
                :key="tag"
                class="px-2 py-0.5 text-xs font-bold rounded"
                :class="getTagClass(tag)"
              >
                {{ tag }}
              </span>
            </div>
            
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {{ product.name }}
            </h1>
            
            <p class="text-gray-600 mb-6">{{ product.description }}</p>
            
            <div class="bg-gradient-to-r from-seckill-red/5 to-seckill-orange/5 rounded-xl p-4 mb-6">
              <div class="flex items-baseline gap-3 mb-2">
                <span class="text-4xl font-bold text-seckill-red">
                  ¥{{ product.seckillPrice.toLocaleString() }}
                </span>
                <span class="text-lg text-gray-400 line-through">
                  ¥{{ product.originalPrice.toLocaleString() }}
                </span>
                <span class="px-2 py-0.5 bg-seckill-red text-white text-xs font-bold rounded">
                  省 ¥{{ (product.originalPrice - product.seckillPrice).toLocaleString() }}
                </span>
              </div>
              <p class="text-sm text-gray-600">
                已抢 <span class="font-bold text-seckill-red">{{ product.soldCount }}</span> 件
              </p>
            </div>
            
            <div class="mb-6">
              <StockProgress 
                :current="product.remainingStock" 
                :total="product.totalStock"
                show-numbers
                size="large"
              />
            </div>
            
            <div v-if="limitInfo && !limitInfo.canPurchase" class="mb-6">
              <div class="flex items-start gap-2 p-3 bg-orange-50 rounded-xl">
                <svg class="w-5 h-5 text-seckill-orange flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-seckill-orange">购买限制</p>
                  <p class="text-xs text-gray-600 mt-1">{{ limitInfo.message }}</p>
                </div>
              </div>
            </div>
            
            <div v-if="product.specs && product.specs.length > 0" class="mb-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">规格参数</h4>
              <div class="grid grid-cols-2 gap-3">
                <div 
                  v-for="spec in product.specs" 
                  :key="spec.name"
                  class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                >
                  <span class="text-xs text-gray-500">{{ spec.name }}：</span>
                  <span class="text-xs font-medium text-gray-900">{{ spec.value }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="productSession" class="mb-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">活动场次</h4>
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-seckill-red to-seckill-orange flex items-center justify-center text-white font-bold">
                  {{ getSessionDisplayTime(productSession.startTime) }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ productSession.name }}</p>
                  <p class="text-xs text-gray-500">{{ productSession.title }}</p>
                </div>
                <div v-if="status === 'in_progress'" class="ml-auto">
                  <span class="flex items-center gap-1 text-sm text-seckill-red">
                    <span class="w-2 h-2 bg-seckill-red rounded-full animate-pulse"></span>
                    抢购中
                  </span>
                </div>
              </div>
            </div>
            
            <div class="space-y-3">
              <button 
                v-if="status === 'in_progress'"
                @click="handleBuyClick"
                :disabled="isPurchasing || !!(limitInfo && !limitInfo.canPurchase)"
                class="w-full py-4 bg-gradient-to-r from-seckill-red to-seckill-orange text-white font-bold text-lg rounded-full hover:shadow-lg hover:shadow-seckill-red/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isPurchasing">抢购中...</span>
                <span v-else>立即抢购</span>
              </button>
              
              <button 
                v-else-if="status === 'not_started'"
                @click="handleSetReminder"
                class="w-full py-4 bg-gradient-to-r from-seckill-orange to-seckill-gold text-white font-bold text-lg rounded-full hover:shadow-lg transition-all active:scale-95"
              >
                🔔 设置提醒
              </button>
              
              <button 
                v-else
                disabled
                class="w-full py-4 bg-gray-300 text-gray-500 font-bold text-lg rounded-full cursor-not-allowed"
              >
                {{ statusText }}
              </button>
              
              <div class="flex items-center justify-center gap-6 text-sm text-gray-500 pt-2">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  正品保证
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  七天无理由
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  极速发货
                </span>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-2xl p-6 shadow-lg">
            <h3 class="text-lg font-bold text-gray-900 mb-4">商品详情</h3>
            <div v-if="product.detailImages && product.detailImages.length > 0" class="space-y-4">
              <img 
                v-for="(img, index) in product.detailImages" 
                :key="index"
                :src="img"
                class="w-full rounded-lg"
                :alt="`详情图${index + 1}`"
                loading="lazy"
              />
            </div>
            <div v-else class="text-center py-12 text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>暂无商品详情</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="recommendedProducts.length > 0" class="mt-8">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-6 bg-gradient-to-b from-seckill-red to-seckill-orange rounded-full"></div>
          <h2 class="text-xl font-bold text-gray-900">为你推荐</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          <ProductCard 
            v-for="p in recommendedProducts" 
            :key="p.id" 
            :product="p"
          />
        </div>
      </div>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center py-24">
      <svg class="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <p class="text-gray-500 mb-4">商品不存在或已下架</p>
      <NuxtLink 
        to="/products"
        class="px-6 py-2 bg-seckill-red text-white rounded-full hover:bg-seckill-red/90 transition-colors"
      >
        返回商品列表
      </NuxtLink>
    </div>
    
    <Teleport to="body">
      <div 
        v-if="product && status === 'in_progress'"
        class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 lg:hidden"
      >
        <div class="flex items-center gap-4 p-4">
          <div class="flex-1 flex items-center gap-3">
            <div class="flex flex-col items-center text-gray-600">
              <NuxtLink to="/" class="flex flex-col items-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span class="text-xs mt-1">首页</span>
              </NuxtLink>
            </div>
            <div class="flex flex-col items-center text-gray-600">
              <NuxtLink to="/orders" class="flex flex-col items-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span class="text-xs mt-1">订单</span>
              </NuxtLink>
            </div>
          </div>
          <button 
            @click="handleBuyClick"
            :disabled="isPurchasing || !!(limitInfo && !limitInfo.canPurchase)"
            class="flex-1 py-3 bg-gradient-to-r from-seckill-red to-seckill-orange text-white font-bold rounded-full disabled:opacity-50"
          >
            <span v-if="isPurchasing">抢购中...</span>
            <span v-else>立即抢购</span>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCountdown } from '~/composables/useCountdown'
import { useSeckillPurchase } from '~/composables/useSeckillPurchase'

const route = useRoute()
const activityStore = useActivityStore()
const userStore = useUserStore()
const modalStore = useModalStore()
const { isPurchasing, handlePurchase, checkPurchaseEligibility } = useSeckillPurchase()

const productId = computed(() => route.params.id as string)
const product = computed(() => activityStore.getProductById(productId.value))
const productSession = computed(() => {
  if (!product.value) return null
  return activityStore.sessions.find(s => s.id === product.value!.sessionId)
})

const currentImageIndex = ref(0)
const currentImage = computed(() => {
  if (!product.value) return ''
  const images = product.value.images || [product.value.mainImage]
  return images[currentImageIndex.value] || product.value.mainImage
})

const status = computed(() => activityStore.getProductStatus(product.value!))
const statusText = computed(() => {
  switch (status.value) {
    case 'not_started': return '即将开始'
    case 'in_progress': return '抢购中'
    case 'ended': return '已结束'
    case 'sold_out': return '已售罄'
    default: return ''
  }
})

const limitInfo = ref<ReturnType<typeof checkPurchaseEligibility> | null>(null)

const recommendedProducts = computed(() => {
  if (!product.value) return []
  return activityStore.products
    .filter(p => p.id !== product.value!.id && p.remainingStock > 0)
    .slice(0, 5)
})

const startTime = computed(() => productSession.value?.startTime || 0)
const startCountdown = useCountdown(() => startTime.value, false)

const getTagClass = (tag: string) => {
  if (tag === '爆款' || tag === '热销') return 'bg-seckill-red text-white'
  if (tag === '新品') return 'bg-blue-500 text-white'
  if (tag === '限量') return 'bg-seckill-gold text-white'
  return 'bg-gray-500 text-white'
}

const getSessionDisplayTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const handleBuyClick = () => {
  if (!product.value) return
  
  if (!userStore.isLoggedIn) {
    userStore.setPendingAction(() => handleBuyClick())
    userStore.openLoginModal()
    return
  }
  
  handlePurchase(product.value.id)
}

const handleSetReminder = () => {
  if (!product.value) return
  
  if (!userStore.isLoggedIn) {
    userStore.setPendingAction(() => handleSetReminder())
    userStore.openLoginModal()
    return
  }
  
  modalStore.showInfoModal(
    '设置成功',
    `我们将在${productSession.value?.name}开始前5分钟提醒您！`,
    () => {}
  )
}

let statusTimer: ReturnType<typeof setInterval> | null = null

watch(() => product.value, (newProduct) => {
  if (newProduct) {
    limitInfo.value = checkPurchaseEligibility(newProduct.id, newProduct.sessionId)
  }
}, { immediate: true })

onMounted(() => {
  if (product.value) {
    limitInfo.value = checkPurchaseEligibility(product.value.id, product.value.sessionId)
  }
  
  if (status.value === 'not_started') {
    startCountdown.start()
  }
  
  statusTimer = setInterval(() => {
    activityStore.updateSessionStatuses()
    if (product.value) {
      limitInfo.value = checkPurchaseEligibility(product.value.id, product.value.sessionId)
    }
  }, 1000)
})

onUnmounted(() => {
  if (statusTimer) clearInterval(statusTimer)
})

definePageMeta({
  title: () => product.value ? `${product.value.name} - 限时秒杀` : '商品详情'
})
</script>
