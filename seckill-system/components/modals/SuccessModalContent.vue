<template>
  <div class="p-6 text-center" ref="particleContainer">
    <div class="relative">
      <div class="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
        <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    
    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ config.title || '操作成功' }}</h3>
    <p class="text-gray-600 mb-6">{{ config.content }}</p>
    
    <div v-if="config.data?.order" class="bg-gray-50 rounded-xl p-4 mb-6 text-left">
      <div class="flex items-center gap-3 mb-3">
        <img 
          :src="config.data.order.product.mainImage" 
          :alt="config.data.order.product.name"
          class="w-16 h-16 rounded-lg object-cover"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 line-clamp-2">{{ config.data.order.product.name }}</p>
          <p class="text-seckill-red font-bold mt-1">¥{{ config.data.order.totalPrice.toLocaleString() }}</p>
        </div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">订单号：{{ config.data.order.orderNo }}</span>
      </div>
    </div>
    
    <div class="flex gap-3">
      <button 
        @click="handleClose"
        class="flex-1 px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        稍后再说
      </button>
      <button 
        @click="handleConfirm"
        class="flex-1 seckill-btn-primary"
      >
        去支付
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { SeckillModalConfig } from '~/types'

const props = defineProps<{
  config: SeckillModalConfig
}>()

const emit = defineEmits<{
  close: []
}>()

const particleContainer = ref<HTMLElement | null>(null)

const handleConfirm = () => {
  if (props.config.onConfirm) {
    props.config.onConfirm()
  }
  emit('close')
}

const handleClose = () => {
  emit('close')
}

const createParticles = () => {
  if (!particleContainer.value) return
  
  const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff']
  const particleCount = 30
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    
    const size = 6 + Math.random() * 8
    const angle = (Math.PI * 2 * i) / particleCount
    const distance = 80 + Math.random() * 60
    const tx = Math.cos(angle) * distance
    const ty = Math.sin(angle) * distance
    
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    particle.style.left = '50%'
    particle.style.top = '25%'
    particle.style.setProperty('--tx', `${tx}px`)
    particle.style.setProperty('--ty', `${ty}px`)
    particle.style.animationDelay = `${Math.random() * 0.2}s`
    
    particleContainer.value.appendChild(particle)
    
    setTimeout(() => {
      particle.remove()
    }, 1200)
  }
}

onMounted(() => {
  createParticles()
})
</script>
