<template>
  <div class="w-full" :class="sizeClass">
    <div v-if="showNumbers" class="flex items-center justify-between text-xs mb-1">
      <span class="text-gray-500">
        已抢 <span class="text-seckill-orange font-medium">{{ soldCountValue }}</span> 件
      </span>
      <span class="text-gray-500">
        剩余 <span class="text-seckill-red font-medium">{{ remainingStockValue }}</span> 件
      </span>
    </div>
    <div :class="sizeClass === 'large' ? 'h-3' : 'h-2'" class="stock-bar">
      <div 
        class="stock-bar-fill"
        :style="{ width: percentage + '%' }"
      ></div>
    </div>
    <div v-if="showLimit" class="mt-2 text-xs text-gray-500">
      每人限购 <span class="text-seckill-red font-medium">{{ limit }}</span> 件
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  remainingStock?: number
  totalStock?: number
  current?: number
  total?: number
  soldCount?: number
  showNumbers?: boolean
  showLimit?: boolean
  limit?: number
  size?: 'normal' | 'large'
}>(), {
  showNumbers: false,
  showLimit: false,
  limit: 1,
  size: 'normal'
})

const remainingStockValue = computed(() => {
  return props.remainingStock ?? props.current ?? 0
})

const totalStockValue = computed(() => {
  return props.totalStock ?? props.total ?? 0
})

const soldCountValue = computed(() => {
  if (props.soldCount !== undefined) return props.soldCount
  return totalStockValue.value - remainingStockValue.value
})

const sizeClass = computed(() => {
  return props.size === 'large' ? 'large' : ''
})

const percentage = computed(() => {
  if (totalStockValue.value === 0) return 0
  return Math.round(soldCountValue.value / totalStockValue.value * 100)
})
</script>
