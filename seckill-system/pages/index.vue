<template>
  <div class="min-h-screen">
    <div class="relative">
      <div class="relative h-48 md:h-80 overflow-hidden rounded-b-3xl">
        <SeckillImage 
          :src="activityStore.config.bannerImage" 
          :alt="activityStore.config.title"
          wrapper-class="w-full h-full"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 class="text-2xl md:text-4xl font-bold mb-2 animate-slide-down">
            {{ activityStore.config.title }}
          </h1>
          <p class="text-sm md:text-base text-white/80 animate-slide-up">
            {{ activityStore.config.subtitle }}
          </p>
          <div v-if="activeSession" class="mt-4 flex items-center gap-3">
            <span class="text-sm">距离本场结束</span>
            <CountdownDisplay :countdown="endCountdown.countdown.value" />
          </div>
        </div>
      </div>
      
      <div class="px-4 -mt-6 relative z-10">
        <SessionTabs />
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="w-1 h-6 bg-gradient-to-b from-seckill-red to-seckill-orange rounded-full"></div>
          <h2 class="text-lg md:text-xl font-bold text-gray-900">
            {{ currentSession?.name || '秒杀商品' }}
          </h2>
          <span v-if="currentSession?.title" class="text-sm text-gray-500">
            {{ currentSession.title }}
          </span>
        </div>
        <NuxtLink 
          to="/products"
          class="text-sm text-seckill-red hover:underline flex items-center gap-1"
        >
          更多
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
      
      <div v-if="currentSessionProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
        <ProductCard 
          v-for="product in currentSessionProducts" 
          :key="product.id" 
          :product="product"
        />
      </div>
      
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-gray-500">本场次暂无商品</p>
      </div>
      
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-1 h-6 bg-gradient-to-b from-seckill-orange to-seckill-gold rounded-full"></div>
            <h2 class="text-lg md:text-xl font-bold text-gray-900">即将开始</h2>
          </div>
        </div>
        
        <div v-if="upcomingProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          <div 
            v-for="product in upcomingProducts" 
            :key="product.id"
            class="product-card group"
          >
            <div class="relative aspect-square overflow-hidden bg-gray-100">
              <SeckillImage 
                :src="product.mainImage" 
                :alt="product.name"
                wrapper-class="w-full h-full"
              />
              <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                <div class="text-white text-center">
                  <p class="text-sm mb-2">即将开始</p>
                  <div class="flex items-center gap-1 justify-center scale-75">
                    <div class="w-8 h-8 bg-white/20 backdrop-blur rounded flex items-center justify-center">
                      <span class="text-white font-bold text-sm">{{ getSessionHour(getProductSession(product)?.startTime) }}</span>
                    </div>
                    <span class="text-white font-bold">:</span>
                    <div class="w-8 h-8 bg-white/20 backdrop-blur rounded flex items-center justify-center">
                      <span class="text-white font-bold text-sm">{{ getSessionMinute(getProductSession(product)?.startTime) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute top-2 left-2">
                <span class="discount-tag">{{ product.discount }}折</span>
              </div>
            </div>
            <div class="p-3">
              <h3 class="text-sm font-medium text-gray-900 line-clamp-2 h-10 mb-2">
                {{ product.name }}
              </h3>
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-bold text-seckill-red">
                  ¥{{ product.seckillPrice.toLocaleString() }}
                </span>
                <span class="text-sm text-gray-400 line-through">
                  ¥{{ product.originalPrice.toLocaleString() }}
                </span>
              </div>
              <button 
                @click="setReminder(product)"
                class="w-full mt-3 py-2 bg-seckill-orange/10 text-seckill-orange text-sm font-medium rounded-full hover:bg-seckill-orange/20 transition-colors"
              >
                🔔 提醒我
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 bg-gray-50 rounded-xl">
          <p class="text-gray-500">暂无即将开始的场次</p>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full"></div>
            <h2 class="text-lg md:text-xl font-bold text-gray-900">活动规则</h2>
          </div>
          <button 
            @click="showAllRules"
            class="text-sm text-seckill-red hover:underline"
          >
            查看全部
          </button>
        </div>
        <div class="space-y-3">
          <div 
            v-for="(rule, index) in displayRules" 
            :key="rule.id"
            class="flex items-start gap-3 p-3 rounded-xl"
            :class="rule.type === 'important' ? 'bg-seckill-red/5' : 'bg-gray-50'"
          >
            <div 
              class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
              :class="rule.type === 'important' ? 'bg-seckill-red text-white' : 'bg-gray-200 text-gray-600'"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h4 
                class="font-medium text-sm mb-1"
                :class="rule.type === 'important' ? 'text-seckill-red' : 'text-gray-900'"
              >
                {{ rule.title }}
              </h4>
              <p class="text-xs text-gray-600">{{ rule.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useSessionCountdown } from '~/composables/useCountdown'

const activityStore = useActivityStore()
const userStore = useUserStore()
const orderStore = useOrderStore()
const modalStore = useModalStore()

const { endCountdown } = useSessionCountdown()

const activeSession = computed(() => activityStore.activeSession)
const currentSession = computed(() => activityStore.currentSession)
const currentSessionProducts = computed(() => activityStore.currentSessionProducts)
const upcomingSessions = computed(() => activityStore.upcomingSessions)

const upcomingProducts = computed(() => {
  const products: any[] = []
  upcomingSessions.value.slice(0, 2).forEach(session => {
    const sessionProducts = activityStore.getProductsBySession(session.id).slice(0, 3)
    sessionProducts.forEach(p => {
      products.push({
        ...p,
        session
      })
    })
  })
  return products
})

const displayRules = computed(() => {
  return activityStore.config.rules.filter(r => r.type === 'important').slice(0, 3)
})

const getProductSession = (product: any) => {
  return product.session || activityStore.sessions.find(s => s.id === product.sessionId)
}

const getSessionHour = (timestamp: number | undefined) => {
  if (!timestamp) return '00'
  return String(new Date(timestamp).getHours()).padStart(2, '0')
}

const getSessionMinute = (timestamp: number | undefined) => {
  if (!timestamp) return '00'
  return String(new Date(timestamp).getMinutes()).padStart(2, '0')
}

const setReminder = (product: any) => {
  if (!userStore.isLoggedIn) {
    userStore.setPendingAction(() => setReminder(product))
    userStore.openLoginModal()
    return
  }
  
  modalStore.showInfoModal(
    '设置成功',
    `我们将在${getProductSession(product)?.name}开始前5分钟提醒您！`,
    () => {}
  )
}

const showAllRules = () => {
  modalStore.showRulesModal(activityStore.config.rules)
}

let statusTimer: ReturnType<typeof setInterval> | null = null
let expiredTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  activityStore.initActivity()
  userStore.initUser()
  orderStore.initOrders()
  endCountdown.start()
  
  statusTimer = setInterval(() => {
    activityStore.updateSessionStatuses()
  }, 1000)
  
  expiredTimer = setInterval(() => {
    orderStore.checkExpiredOrders()
  }, 10000)
})

onUnmounted(() => {
  endCountdown.stop()
  if (statusTimer) clearInterval(statusTimer)
  if (expiredTimer) clearInterval(expiredTimer)
})
</script>
