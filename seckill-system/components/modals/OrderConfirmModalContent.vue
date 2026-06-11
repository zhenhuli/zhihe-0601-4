<template>
  <div class="p-6">
    <div class="flex items-start justify-between mb-4">
      <h3 class="text-xl font-bold text-gray-900">{{ config.title || '确认订单' }}</h3>
      <button 
        @click="handleClose"
        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <div v-if="product" class="bg-gray-50 rounded-xl p-4 mb-4">
      <div class="flex items-start gap-3">
        <img 
          :src="product.mainImage" 
          :alt="product.name"
          class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 line-clamp-2">{{ product.name }}</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-lg font-bold text-seckill-red">¥{{ product.seckillPrice.toLocaleString() }}</span>
            <span class="text-sm text-gray-400 line-through">¥{{ product.originalPrice.toLocaleString() }}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span v-for="spec in product.specs" :key="spec.name" class="text-xs text-gray-500">
              {{ spec.name }}：{{ spec.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="space-y-3 mb-6">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">商品单价</span>
        <span class="text-gray-900">¥{{ product?.seckillPrice.toLocaleString() }}</span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">购买数量</span>
        <div class="flex items-center gap-2">
          <button 
            @click="quantity = Math.max(1, quantity - 1)"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-seckill-red hover:text-seckill-red transition-colors"
          >
            -
          </button>
          <span class="w-8 text-center font-medium">{{ quantity }}</span>
          <button 
            @click="quantity = Math.min(maxQuantity, quantity + 1)"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-seckill-red hover:text-seckill-red transition-colors"
          >
            +
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">商品原价</span>
        <span class="text-gray-400 line-through">¥{{ originalTotal.toLocaleString() }}</span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">已优惠</span>
        <span class="text-seckill-red">-¥{{ discountTotal.toLocaleString() }}</span>
      </div>
      <div class="pt-3 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <span class="font-medium text-gray-900">应付金额</span>
          <span class="text-2xl font-bold text-seckill-red">¥{{ totalPrice.toLocaleString() }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="limitInfo && !limitInfo.canPurchase" class="bg-red-50 text-red-600 rounded-lg p-3 text-sm mb-4">
      {{ getLimitMessage() }}
    </div>
    
    <div class="flex gap-3">
      <button 
        @click="handleClose"
        class="flex-1 px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        再想想
      </button>
      <button 
        @click="handleConfirm"
        class="flex-1 seckill-btn-primary"
        :disabled="isPurchasing || !!(limitInfo && !limitInfo.canPurchase)"
      >
        <span v-if="isPurchasing">抢购中...</span>
        <span v-else>确认抢购</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SeckillModalConfig, SeckillProduct } from '~/types'

const props = defineProps<{
  config: SeckillModalConfig
}>()

const emit = defineEmits<{
  close: []
}>()

const userStore = useUserStore()
const activityStore = useActivityStore()
const { isPurchasing, purchaseProduct, checkPurchaseEligibility } = useSeckillPurchase()

const product = computed<SeckillProduct | undefined>(() => props.config.data?.product)
const quantity = ref(1)

const limitInfo = ref<ReturnType<typeof checkPurchaseEligibility> | null>(null)

const maxQuantity = computed(() => {
  if (!product.value) return 1
  const limit = activityStore.config.limitPerSession
  const stock = product.value.remainingStock
  return Math.min(limit, stock)
})

const totalPrice = computed(() => {
  if (!product.value) return 0
  return product.value.seckillPrice * quantity.value
})

const originalTotal = computed(() => {
  if (!product.value) return 0
  return product.value.originalPrice * quantity.value
})

const discountTotal = computed(() => {
  return originalTotal.value - totalPrice.value
})

const getLimitMessage = () => {
  if (!limitInfo.value) return ''
  const reason = limitInfo.value.reason
  const messages: Record<string, string> = {
    'not_logged_in': '请先登录后再参与抢购',
    'daily_limit': '今日限购次数已用完',
    'session_limit': '本场次限购次数已用完',
    'total_limit': '活动总限购次数已用完',
    'sold_out': '商品已售罄',
    'not_started': '秒杀尚未开始',
    'ended': '秒杀已结束'
  }
  return messages[reason || ''] || '无法购买'
}

const handleConfirm = () => {
  if (!product.value || isPurchasing.value) return
  
  purchaseProduct(product.value.id, product.value.sessionId, quantity.value)
  emit('close')
}

const handleClose = () => {
  if (props.config.onCancel) {
    props.config.onCancel()
  }
  emit('close')
}

onMounted(() => {
  if (product.value) {
    limitInfo.value = checkPurchaseEligibility(product.value.id, product.value.sessionId)
  }
})
</script>
