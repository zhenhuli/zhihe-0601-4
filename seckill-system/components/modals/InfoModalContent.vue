<template>
  <div class="p-6">
    <div class="flex items-start justify-between mb-4">
      <h3 class="text-xl font-bold text-gray-900">{{ config.title || '提示' }}</h3>
      <button 
        @click="handleClose"
        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <p class="text-gray-600 mb-6">{{ config.content }}</p>
    
    <div class="flex gap-3">
      <button 
        v-if="config.onCancel"
        @click="handleCancel"
        class="flex-1 px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        取消
      </button>
      <button 
        @click="handleConfirm"
        class="flex-1 seckill-btn-primary"
      >
        确定
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SeckillModalConfig } from '~/types'

const props = defineProps<{
  config: SeckillModalConfig
}>()

const emit = defineEmits<{
  close: []
}>()

const handleConfirm = () => {
  if (props.config.onConfirm) {
    props.config.onConfirm()
  }
  emit('close')
}

const handleCancel = () => {
  if (props.config.onCancel) {
    props.config.onCancel()
  }
  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>
