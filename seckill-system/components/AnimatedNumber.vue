<template>
  <span class="inline-block" :class="{ 'animate-pulse': isAnimating }">
    {{ displayValue }}
  </span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  duration?: number
  showSymbol?: boolean
  decimals?: number
}>(), {
  duration: 1000,
  showSymbol: false,
  decimals: 0
})

const displayValue = ref<string>('0')
const isAnimating = ref(false)
let animationFrame: number | null = null

const formatNumber = (num: number): string => {
  let formatted = num.toFixed(props.decimals)
  if (props.showSymbol) {
    formatted = num.toLocaleString('zh-CN', {
      minimumFractionDigits: props.decimals,
      maximumFractionDigits: props.decimals
    })
  }
  return formatted
}

const animateValue = (start: number, end: number, duration: number) => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  isAnimating.value = true
  const startTime = performance.now()
  const diff = end - start

  const update = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    const current = start + diff * easeProgress
    
    displayValue.value = formatNumber(current)
    
    if (progress < 1) {
      animationFrame = requestAnimationFrame(update)
    } else {
      displayValue.value = formatNumber(end)
      isAnimating.value = false
      animationFrame = null
    }
  }

  animationFrame = requestAnimationFrame(update)
}

watch(() => props.value, (newVal, oldVal) => {
  const start = oldVal !== undefined ? oldVal : 0
  animateValue(start, newVal, props.duration)
}, { immediate: false })

onMounted(() => {
  displayValue.value = formatNumber(props.value)
})
</script>
