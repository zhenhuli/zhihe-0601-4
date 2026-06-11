<template>
  <div class="relative w-full h-full overflow-hidden" :class="wrapperClass">
    <div 
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 shimmer-effect"
    ></div>
    <img
      ref="imgRef"
      :src="placeholder"
      :data-src="src"
      :alt="alt"
      class="w-full h-full object-cover lazy-image transition-transform duration-500 group-hover:scale-105"
      :class="{ 'opacity-0': !isLoaded }"
      @load="onLoad"
      @error="onError"
    />
    <div 
      v-if="hasError"
      class="absolute inset-0 bg-gray-100 flex items-center justify-center"
    >
      <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  alt?: string
  placeholder?: string
  wrapperClass?: string
}>(), {
  alt: '',
  placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
  wrapperClass: ''
})

const imgRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const hasError = ref(false)

const onLoad = () => {
  isLoaded.value = true
  if (imgRef.value) {
    imgRef.value.classList.add('loaded')
  }
}

const onError = () => {
  hasError.value = true
}

const setupLazyLoad = () => {
  if (!imgRef.value || !('IntersectionObserver' in window)) {
    if (imgRef.value && props.src) {
      imgRef.value.src = props.src
    }
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && imgRef.value?.dataset.src) {
          imgRef.value.src = imgRef.value.dataset.src
          imgRef.value.removeAttribute('data-src')
          observer.disconnect()
        }
      })
    },
    { rootMargin: '200px' }
  )

  observer.observe(imgRef.value)
}

watch(() => props.src, () => {
  isLoaded.value = false
  hasError.value = false
  if (imgRef.value) {
    imgRef.value.classList.remove('loaded')
  }
  setupLazyLoad()
})

onMounted(() => {
  setupLazyLoad()
})
</script>
