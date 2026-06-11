import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SeckillOrder, OrderStatus, SeckillProduct, SeckillSession } from '~/types'
import { OrderStatus as OS } from '~/types'

const STORAGE_KEY = 'seckill_orders'
const PAYMENT_TIMEOUT = 15 * 60 * 1000

export const useOrderStore = defineStore('order', () => {
  const orders = ref<SeckillOrder[]>([])
  const loading = ref<boolean>(false)
  const currentOrderId = ref<string | null>(null)

  const pendingOrders = computed<SeckillOrder[]>(() => {
    return orders.value.filter(o => o.status === OS.PENDING_PAYMENT)
  })

  const paidOrders = computed<SeckillOrder[]>(() => {
    return orders.value.filter(o => o.status === OS.PAID || o.status === OS.COMPLETED)
  })

  const cancelledOrders = computed<SeckillOrder[]>(() => {
    return orders.value.filter(o => o.status === OS.CANCELLED || o.status === OS.EXPIRED)
  })

  const currentOrder = computed<SeckillOrder | undefined>(() => {
    return orders.value.find(o => o.id === currentOrderId.value)
  })

  const generateOrderNo = (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = Math.random().toString(36).substring(2, 10).toUpperCase()
    return `SK${year}${month}${day}${random}`
  }

  const createOrder = (
    product: SeckillProduct,
    sessionId: string,
    userId: string,
    quantity: number = 1
  ): SeckillOrder => {
    const now = Date.now()
    const order: SeckillOrder = {
      id: 'order_' + now,
      orderNo: generateOrderNo(),
      productId: product.id,
      product: { ...product },
      sessionId,
      userId,
      quantity,
      unitPrice: product.seckillPrice,
      totalPrice: product.seckillPrice * quantity,
      originalTotalPrice: product.originalPrice * quantity,
      status: OS.PENDING_PAYMENT,
      createTime: now,
      expireTime: now + PAYMENT_TIMEOUT
    }

    orders.value.unshift(order)
    currentOrderId.value = order.id
    saveToStorage()

    return order
  }

  const getOrderById = (orderId: string): SeckillOrder | undefined => {
    return orders.value.find(o => o.id === orderId)
  }

  const getOrderByNo = (orderNo: string): SeckillOrder | undefined => {
    return orders.value.find(o => o.orderNo === orderNo)
  }

  const getProductFromOrder = (order: SeckillOrder): SeckillProduct => {
    return order.product
  }

  const getSessionFromOrder = (order: SeckillOrder, sessions: SeckillSession[]): SeckillSession | undefined => {
    return sessions.find(s => s.id === order.sessionId)
  }

  const payOrder = (orderId: string): boolean => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order || order.status !== OS.PENDING_PAYMENT) return false

    order.status = OS.PAID
    order.payTime = Date.now()
    saveToStorage()
    return true
  }

  const cancelOrder = (orderId: string, reason?: string): boolean => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order || order.status !== OS.PENDING_PAYMENT) return false

    order.status = OS.CANCELLED
    order.cancelTime = Date.now()
    order.cancelReason = reason
    saveToStorage()
    return true
  }

  const expireOrder = (orderId: string): boolean => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order || order.status !== OS.PENDING_PAYMENT) return false

    order.status = OS.EXPIRED
    order.cancelTime = Date.now()
    order.cancelReason = '支付超时自动取消'
    saveToStorage()
    return true
  }

  const checkExpiredOrders = (): string[] => {
    const now = Date.now()
    const expiredOrderIds: string[] = []

    orders.value.forEach(order => {
      if (order.status === OS.PENDING_PAYMENT && now >= order.expireTime) {
        expireOrder(order.id)
        expiredOrderIds.push(order.id)
      }
    })

    return expiredOrderIds
  }

  const getRemainingPaymentTime = (orderId: string): number => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order || order.status !== OS.PENDING_PAYMENT) return 0
    const remaining = order.expireTime - Date.now()
    return Math.max(0, remaining)
  }

  const updateOrderReceiver = (
    orderId: string,
    receiverInfo: {
      receiverName: string
      receiverPhone: string
      receiverAddress: string
    }
  ): boolean => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order) return false

    order.receiverName = receiverInfo.receiverName
    order.receiverPhone = receiverInfo.receiverPhone
    order.receiverAddress = receiverInfo.receiverAddress
    saveToStorage()
    return true
  }

  const getOrdersByProductId = (productId: string): SeckillOrder[] => {
    return orders.value.filter(o => o.productId === productId)
  }

  const getOrdersBySessionId = (sessionId: string): SeckillOrder[] => {
    return orders.value.filter(o => o.sessionId === sessionId)
  }

  const getOrdersByStatus = (status: OrderStatus): SeckillOrder[] => {
    return orders.value.filter(o => o.status === status)
  }

  const saveToStorage = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.value))
    }
  }

  const loadFromStorage = (): void => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          orders.value = JSON.parse(stored)
          checkExpiredOrders()
        } catch (e) {
          console.error('Failed to parse orders from storage')
          orders.value = []
        }
      }
    }
  }

  const initOrders = (): void => {
    loadFromStorage()
  }

  const clearExpiredOrders = (): void => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    orders.value = orders.value.filter(o => {
      if (o.status === 'expired' || o.status === 'cancelled') {
        return (o.cancelTime || o.createTime) > thirtyDaysAgo
      }
      return true
    })
    saveToStorage()
  }

  return {
    orders,
    loading,
    currentOrderId,
    pendingOrders,
    paidOrders,
    cancelledOrders,
    currentOrder,
    createOrder,
    getOrderById,
    getOrderByNo,
    getProductFromOrder,
    getSessionFromOrder,
    payOrder,
    cancelOrder,
    expireOrder,
    checkExpiredOrders,
    getRemainingPaymentTime,
    updateOrderReceiver,
    getOrdersByProductId,
    getOrdersBySessionId,
    getOrdersByStatus,
    initOrders,
    clearExpiredOrders
  }
})
