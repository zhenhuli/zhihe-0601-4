<template>
  <div 
    class="product-card group"
    :class="{ 'product-card-disabled': isDisabled }"
    @click="handleClick"
  >
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <SeckillImage 
        :src="product.mainImage" 
        :alt="product.name"
        wrapper-class="w-full h-full"
      />
      
      <div class="absolute top-2 left-2 flex flex-wrap gap-1">
        <span 
          v-for="tag in displayTags" 
          :key="tag"
          class="px-2 py-0.5 text-xs font-bold rounded"
          :class="getTagClass(tag)"
        >
          {{ tag }}
        </span>
      </div>
      
      <div 
        v-if="isDisabled"
        class="absolute inset-0 bg-black/40 flex items-center justify-center"
      >
        <span class="text-white font-bold text-lg">{{ disabledText }}</span>
      </div>
      
      <div 
        v-if="!isDisabled && status === 'in_progress'"
        class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4"
      >
        <button 
          @click.stop="handlePurchase"
          class="seckill-btn-primary !py-2 !px-6 text-sm"
          :disabled="isPurchasing"
        >
          <span v-if="isPurchasing">抢购中...</span>
          <span v-else>立即抢购</span>
        </button>
      </div>
    </div>
    
    <div class="p-3 md:p-4">
      <h3 class="text-sm md:text-base font-medium text-gray-900 line-clamp-2 h-10 md:h-12 mb-2">
        {{ product.name }}
      </h3>
      
      <div class="flex items-baseline gap-2 mb-2">
        <span class="text-lg md:text-xl font-bold text-seckill-red">
          ¥{{ product.seckillPrice.toLocaleString() }}
        </span>
        <span class="text-sm text-gray-400 line-through">
          ¥{{ product.originalPrice.toLocaleString() }}
        </span>
        <span class="discount-tag">{{ product.discount }}折</span>
      </div>
      
      <StockProgress 
        :remaining-stock="product.remainingStock"
        :total-stock="product.totalStock"
        :sold-count="product.soldCount"
      />
      
      <div class="mt-3">
        <button
          @click.stop="handlePurchase"
          class="w-full seckill-btn-primary !py-2 text-sm"
          :class="buttonClass"
          :disabled="isDisabled || isPurchasing"
        >
          <span v-if="isPurchasing">抢购中...</span>
          <span v-else-if="status === 'not_started'">即将开始</span>
          <span v-else-if="status === 'ended'">活动结束</span>
          <span v-else-if="status === 'sold_out'">已售罄</span>
          <span v-else>立即抢购</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SeckillProduct } from '~/types'

const props = defineProps<{
  product: SeckillProduct
}>()

const emit = defineEmits<{
  click: [product: SeckillProduct]
  purchase: [product: SeckillProduct]
}>()

const activityStore = useActivityStore()
const { isPurchasing, confirmAndPurchase, checkPurchaseEligibility } = useSeckillPurchase()

const status = computed(() => activityStore.getProductStatus(props.product))

const isDisabled = computed(() => {
  return status.value === 'ended' || status.value === 'sold_out'
})

const disabledText = computed(() => {
  if (status.value === 'sold_out') return '已售罄'
  if (status.value === 'ended') return '已结束'
  return ''
})

const buttonClass = computed(() => {
  if (status.value === 'not_started') {
    return 'bg-gradient-to-r from-seckill-orange to-seckill-gold'
  }
  if (isDisabled.value) {
    return 'seckill-btn-disabled'
  }
  return ''
})

const displayTags = computed(() => {
  return props.product.tags.slice(0, 2)
})

const getTagClass = (tag: string) => {
  if (tag === '爆款' || tag === '热销') {
    return 'bg-seckill-red text-white'
  }
  if (tag === '新品') {
    return 'bg-blue-500 text-white'
  }
  if (tag === '限量') {
    return 'bg-seckill-gold text-white'
  }
  return 'bg-gray-500 text-white'
}

const handleClick = () => {
  if (!isDisabled.value) {
    emit('click', props.product)
    navigateTo(`/products/${props.product.id}`)
  }
}

const handlePurchase = () => {
  if (isDisabled.value || isPurchasing.value) return
  
  const eligibility = checkPurchaseEligibility(props.product.id, props.product.sessionId)
  if (!eligibility.canPurchase) return
  
  confirmAndPurchase(props.product)
}
</script>
