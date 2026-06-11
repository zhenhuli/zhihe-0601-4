<template>
  <div class="p-6 text-center">
    <div class="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center animate-scale-in">
      <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    
    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ config.title || '操作失败' }}</h3>
    <p class="text-gray-600 mb-2">{{ config.content }}</p>
    
    <div v-if="errorTip" class="text-sm text-gray-500 mb-6 bg-gray-50 rounded-lg p-3">
      {{ errorTip }}
    </div>
    
    <div class="flex gap-3">
      <button 
        @click="handleClose"
        class="flex-1 px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        我知道了
      </button>
      <button 
        v-if="showRetry"
        @click="handleRetry"
        class="flex-1 seckill-btn-primary"
      >
        再试一次
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SeckillModalConfig } from '~/types'

const props = defineProps<{
  config: SeckillModalConfig
}>()

const emit = defineEmits<{
  close: []
}>()

const errorTip = computed(() => {
  const errorCode = props.config.data?.errorCode
  const tips: Record<string, string> = {
    'stock_insufficient': '商品太抢手了，已经被抢光了。可以看看其他场次的商品哦~',
    'limit_exceeded': '您已达到限购数量，请明天再来或选择其他商品。',
    'activity_ended': '本场秒杀已结束，请关注下一场活动。',
    'not_logged_in': '登录后即可参与秒杀，还能查看您的订单记录。',
    'system_error': '服务器有点忙，请稍后重试。'
  }
  return tips[errorCode] || ''
})

const showRetry = computed(() => {
  return props.config.data?.errorCode === 'system_error'
})

const handleClose = () => {
  emit('close')
}

const handleRetry = () => {
  if (props.config.onConfirm) {
    props.config.onConfirm()
  }
  emit('close')
}
</script>
