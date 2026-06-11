import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SeckillActivityConfig, SeckillSession, SeckillProduct, SessionStatus, StockChangeEvent } from '~/types'
import { activityConfig } from '~/config/activity.config'
import { sessionsConfig, updateSessionsStatus, getActiveSession } from '~/config/sessions.config'
import { productsConfig, getProductsBySessionId, decreaseProductStock } from '~/config/products.config'

export const useActivityStore = defineStore('activity', () => {
  const config = ref<SeckillActivityConfig>(activityConfig)
  const sessions = ref<SeckillSession[]>([...sessionsConfig])
  const products = ref<SeckillProduct[]>([...productsConfig])
  const currentSessionId = ref<string>('')
  const loading = ref<boolean>(false)
  const stockChangeEvents = ref<StockChangeEvent[]>([])

  const currentSession = computed<SeckillSession | undefined>(() => {
    return sessions.value.find(s => s.id === currentSessionId.value)
  })

  const activeSession = computed<SeckillSession | undefined>(() => {
    return sessions.value.find(s => s.status === 'active')
  })

  const upcomingSessions = computed<SeckillSession[]>(() => {
    return sessions.value.filter(s => s.status === 'upcoming').sort((a, b) => a.sort - b.sort)
  })

  const pastSessions = computed<SeckillSession[]>(() => {
    return sessions.value.filter(s => s.status === 'past').sort((a, b) => b.sort - a.sort)
  })

  const currentSessionProducts = computed<SeckillProduct[]>(() => {
    if (!currentSessionId.value) return []
    return products.value
      .filter(p => p.sessionId === currentSessionId.value)
      .sort((a, b) => {
        const sortType = config.value.sortType
        switch (sortType) {
          case 'discount': return a.discount - b.discount
          case 'price': return a.seckillPrice - b.seckillPrice
          case 'stock': return b.remainingStock - a.remainingStock
          case 'sold': return b.soldCount - a.soldCount
          case 'custom':
          default: return a.sort - b.sort
        }
      })
  })

  const allProducts = computed<SeckillProduct[]>(() => {
    return products.value.sort((a, b) => {
      const sortType = config.value.sortType
      switch (sortType) {
        case 'discount': return a.discount - b.discount
        case 'price': return a.seckillPrice - b.seckillPrice
        case 'stock': return b.remainingStock - a.remainingStock
        case 'sold': return b.soldCount - a.soldCount
        case 'custom':
        default: return a.sort - b.sort
      }
    })
  })

  const setCurrentSession = (sessionId: string) => {
    currentSessionId.value = sessionId
  }

  const updateSessionStatuses = () => {
    updateSessionsStatus()
    sessions.value = [...sessionsConfig]
    
    if (!currentSessionId.value || currentSession.value?.status === 'past') {
      const active = getActiveSession()
      if (active) {
        currentSessionId.value = active.id
      }
    }
  }

  const getProductById = (productId: string): SeckillProduct | undefined => {
    return products.value.find(p => p.id === productId)
  }

  const getProductsBySession = (sessionId: string): SeckillProduct[] => {
    return getProductsBySessionId(sessionId)
  }

  const updateStock = (productId: string, amount: number = 1): boolean => {
    const product = products.value.find(p => p.id === productId)
    if (!product) return false

    const oldStock = product.remainingStock
    const success = decreaseProductStock(productId, amount)
    
    if (success) {
      const updatedProduct = products.value.find(p => p.id === productId)
      if (updatedProduct) {
        stockChangeEvents.value.push({
          productId,
          oldStock,
          newStock: updatedProduct.remainingStock,
          changeAmount: -amount,
          timestamp: Date.now()
        })
      }
    }
    
    return success
  }

  const getStockPercentage = (productId: string): number => {
    const product = getProductById(productId)
    if (!product) return 0
    return Math.round((product.remainingStock / product.totalStock) * 100)
  }

  const getProductStatus = (product: SeckillProduct): 'not_started' | 'in_progress' | 'ended' | 'sold_out' => {
    const session = sessions.value.find(s => s.id === product.sessionId)
    if (!session) return 'ended'
    
    if (product.remainingStock <= 0) return 'sold_out'
    if (session.status === 'upcoming') return 'not_started'
    if (session.status === 'past') return 'ended'
    return 'in_progress'
  }

  const categories = computed<string[]>(() => {
    return [...new Set(products.value.map(p => p.category))]
  })

  const getProductsByCategory = (category: string): SeckillProduct[] => {
    return products.value
      .filter(p => p.category === category)
      .sort((a, b) => a.sort - b.sort)
  }

  const filterProducts = (options: {
    category?: string
    sessionId?: string
    minPrice?: number
    maxPrice?: number
    onlyAvailable?: boolean
    sortBy?: 'discount' | 'price' | 'stock' | 'sold' | 'custom'
  }): SeckillProduct[] => {
    let filtered = [...products.value]

    if (options.category) {
      filtered = filtered.filter(p => p.category === options.category)
    }

    if (options.sessionId) {
      filtered = filtered.filter(p => p.sessionId === options.sessionId)
    }

    if (options.minPrice !== undefined) {
      filtered = filtered.filter(p => p.seckillPrice >= options.minPrice!)
    }

    if (options.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.seckillPrice <= options.maxPrice!)
    }

    if (options.onlyAvailable) {
      filtered = filtered.filter(p => p.remainingStock > 0)
    }

    const sortBy = options.sortBy || config.value.sortType
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'discount': return a.discount - b.discount
        case 'price': return a.seckillPrice - b.seckillPrice
        case 'stock': return b.remainingStock - a.remainingStock
        case 'sold': return b.soldCount - a.soldCount
        case 'custom':
        default: return a.sort - b.sort
      }
    })

    return filtered
  }

  const initActivity = () => {
    updateSessionStatuses()
    const active = activeSession.value
    if (active) {
      currentSessionId.value = active.id
    } else if (upcomingSessions.value.length > 0) {
      currentSessionId.value = upcomingSessions.value[0].id
    } else if (pastSessions.value.length > 0) {
      currentSessionId.value = pastSessions.value[0].id
    }
  }

  const updateConfig = (newConfig: Partial<SeckillActivityConfig>) => {
    config.value = { ...config.value, ...newConfig }
  }

  return {
    config,
    sessions,
    products,
    currentSessionId,
    loading,
    stockChangeEvents,
    currentSession,
    activeSession,
    upcomingSessions,
    pastSessions,
    currentSessionProducts,
    allProducts,
    categories,
    setCurrentSession,
    updateSessionStatuses,
    getProductById,
    getProductsBySession,
    updateStock,
    getStockPercentage,
    getProductStatus,
    getProductsByCategory,
    filterProducts,
    initActivity,
    updateConfig
  }
})
