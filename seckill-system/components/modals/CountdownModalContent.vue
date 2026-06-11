<template>
  <div class="p-6 text-center">
    <div class="w-16 h-16 mx-auto mb-4 bg-seckill-red/10 rounded-full flex items-center justify-center animate-float">
      <svg class="w-8 h-8 text-seckill-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    
    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ config.title || '距离开抢还有' }}</h3>
    <p class="text-gray-500 text-sm mb-6">准备好，手慢无！</p>
    
    <div class="flex items-center justify-center gap-2 mb-6">
      <div class="countdown-box">
        <span>{{ String(countdown.hours).padStart(2, '0') }}</span>
      </div>
      <span class="text-seckill-red font-bold text-2xl animate-pulse">:</span>
      <div class="countdown-box">
        <span>{{ String(countdown.minutes).padStart(2, '0') }}</span>
      </div>
      <span class="text-seckill-red font-bold text-2xl animate-pulse">:</span>
      <div class="countdown-box">
        <span>{{ String(countdown.seconds).padStart(2, '0') }}</span>
      </div>
    </div>
    
    <div class="bg-gradient-to-r from-seckill-red/5 to-seckill-orange/5 rounded-xl p-4 mb-6">
      <p class="text-sm text-gray-600">
        💡 小贴士：登录后可提前设置收货地址，抢购更快一步！
      </p>
    </div>
    
    <button 
      @click="handleClose"
      class="w-full px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
    >
      知道了
    </button>
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

const targetTime = computed(() => props.config.data?.targetTime || 0)
const { countdown } = useCountdown(() => targetTime.value)

const handleClose = () => {
  emit('close')
}
</script>
