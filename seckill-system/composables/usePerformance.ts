import { ref, onUnmounted } from 'vue'
import type { LazyLoadOptions } from '~/types'

export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debouncedFn = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  const cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  onUnmounted(() => {
    cancel()
  })

  return { debouncedFn, cancel }
}

export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 300
) {
  let inThrottle = false
  let lastResult: ReturnType<T> | null = null

  const throttledFn = (...args: Parameters<T>) => {
    if (!inThrottle) {
      inThrottle = true
      lastResult = fn(...args)
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
    return lastResult
  }

  return { throttledFn }
}

export function useLazyLoad(options: LazyLoadOptions = {}) {
  const {
    root = null,
    rootMargin = '100px',
    threshold = 0.1
  } = options

  const isVisible = ref(false)
  const isLoaded = ref(false)
  const elementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const load = () => {
    if (isLoaded.value) return
    isLoaded.value = true
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const setupObserver = (el: HTMLElement) => {
    if (observer) observer.disconnect()
    elementRef.value = el

    if (!('IntersectionObserver' in window)) {
      load()
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            load()
          }
        })
      },
      { root, rootMargin, threshold }
    )

    observer.observe(el)
  }

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    isVisible,
    isLoaded,
    elementRef,
    setupObserver,
    load
  }
}

export function useImageLazyLoad() {
  const { isLoaded, setupObserver, isVisible } = useLazyLoad({ rootMargin: '200px' })
  const imageRef = ref<HTMLImageElement | null>(null)
  const hasError = ref(false)

  const handleLoad = () => {
    if (imageRef.value) {
      imageRef.value.classList.add('loaded')
    }
  }

  const handleError = () => {
    hasError.value = true
  }

  const setupImage = (el: HTMLImageElement, src: string) => {
    imageRef.value = el
    setupObserver(el)
    
    const checkAndLoad = () => {
      if (isVisible.value && el.dataset.src) {
        el.src = el.dataset.src
        el.removeAttribute('data-src')
      }
    }
    
    if (isVisible.value) {
      checkAndLoad()
    } else {
      const unwatch = watch(isVisible, (visible) => {
        if (visible) {
          checkAndLoad()
          unwatch()
        }
      })
    }

    el.addEventListener('load', handleLoad)
    el.addEventListener('error', handleError)
  }

  onUnmounted(() => {
    if (imageRef.value) {
      imageRef.value.removeEventListener('load', handleLoad)
      imageRef.value.removeEventListener('error', handleError)
    }
  })

  return {
    isLoaded,
    isVisible,
    hasError,
    imageRef,
    setupImage
  }
}

export function useResourcePreload() {
  const preloadedUrls = ref<Set<string>>(new Set())
  const isPreloading = ref(false)

  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      if (preloadedUrls.value.has(url)) {
        resolve()
        return
      }

      const img = new Image()
      img.onload = () => {
        preloadedUrls.value.add(url)
        resolve()
      }
      img.onerror = () => {
        resolve()
      }
      img.src = url
    })
  }

  const preloadImages = async (urls: string[]) => {
    isPreloading.value = true
    try {
      await Promise.all(urls.map(url => preloadImage(url)))
    } finally {
      isPreloading.value = false
    }
  }

  const preloadLink = (url: string, as: string = 'image') => {
    if (preloadedUrls.value.has(url)) return
    
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = as
    link.href = url
    document.head.appendChild(link)
    preloadedUrls.value.add(url)
  }

  const preloadVideo = (url: string) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.src = url
    preloadedUrls.value.add(url)
  }

  return {
    preloadedUrls,
    isPreloading,
    preloadImage,
    preloadImages,
    preloadLink,
    preloadVideo
  }
}

export function useScrollReveal() {
  const revealedElements = ref<Map<string, boolean>>(new Map())

  const registerElement = (id: string, el: HTMLElement) => {
    if (!('IntersectionObserver' in window)) {
      revealedElements.value.set(id, true)
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealedElements.value.set(id, true)
            entry.target.classList.add('animate-slide-up')
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
  }

  const isRevealed = (id: string) => {
    return revealedElements.value.get(id) || false
  }

  return {
    revealedElements,
    registerElement,
    isRevealed
  }
}

export function useVirtualList<T>(items: T[], itemHeight: number, containerHeight: number) {
  const scrollTop = ref(0)
  const containerRef = ref<HTMLElement | null>(null)

  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2

  const startIndex = computed(() => {
    return Math.max(0, Math.floor(scrollTop.value / itemHeight) - 1)
  })

  const endIndex = computed(() => {
    return Math.min(items.length, startIndex.value + visibleCount)
  })

  const visibleItems = computed(() => {
    return items.slice(startIndex.value, endIndex.value)
  })

  const totalHeight = computed(() => {
    return items.length * itemHeight
  })

  const offsetY = computed(() => {
    return startIndex.value * itemHeight
  })

  const handleScroll = (e: Event) => {
    if (containerRef.value) {
      scrollTop.value = containerRef.value.scrollTop
    }
  }

  const scrollToIndex = (index: number) => {
    if (containerRef.value) {
      containerRef.value.scrollTop = index * itemHeight
    }
  }

  return {
    scrollTop,
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    scrollToIndex
  }
}
