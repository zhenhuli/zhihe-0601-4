<template>
  <div class="p-6 max-h-[80vh] overflow-y-auto">
    <div class="flex items-start justify-between mb-4 sticky top-0 bg-white pb-4">
      <h3 class="text-xl font-bold text-gray-900">{{ config.title || '活动规则' }}</h3>
      <button 
        @click="handleClose"
        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <div class="space-y-4">
      <div 
        v-for="(rule, index) in rules" 
        :key="rule.id"
        class="p-4 rounded-xl"
        :class="rule.type === 'important' ? 'bg-seckill-red/5 border border-seckill-red/20' : 'bg-gray-50'"
      >
        <div class="flex items-start gap-3">
          <div 
            class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            :class="rule.type === 'important' ? 'bg-seckill-red text-white' : 'bg-gray-200 text-gray-600'"
          >
            {{ index + 1 }}
          </div>
          <div class="flex-1">
            <h4 
              class="font-medium mb-1"
              :class="rule.type === 'important' ? 'text-seckill-red' : 'text-gray-900'"
            >
              {{ rule.title }}
              <span v-if="rule.type === 'important'" class="ml-2 text-xs bg-seckill-red text-white px-2 py-0.5 rounded">重要</span>
            </h4>
            <p class="text-sm text-gray-600 leading-relaxed">{{ rule.content }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-6 pt-4 border-t border-gray-200">
      <p class="text-xs text-gray-400 text-center">
        活动最终解释权归本平台所有
      </p>
    </div>
    
    <button 
      @click="handleClose"
      class="w-full mt-4 seckill-btn-primary"
    >
      我知道了
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SeckillModalConfig, ActivityRule } from '~/types'

const props = defineProps<{
  config: SeckillModalConfig
}>()

const emit = defineEmits<{
  close: []
}>()

const rules = computed<ActivityRule[]>(() => {
  return props.config.data?.rules || []
})

const handleClose = () => {
  emit('close')
}
</script>
