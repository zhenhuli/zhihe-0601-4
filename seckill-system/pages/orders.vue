<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-gradient-to-r from-seckill-red to-seckill-orange py-6 px-4">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">我的秒杀订单</h1>
        <div class="flex items-center gap-4 text-white/80 text-sm">
          <span>共 {{ orders.length }} 笔订单</span>
          <span>|</span>
          <span>待支付 {{ pendingCount }} 笔</span>
        </div>
      </div>
    </div>
    
    <div class="max-w-5xl mx-auto px-4 py-6">
      <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="currentTab = tab.value"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
          :class="currentTab === tab.value 
            ? 'bg-seckill-red text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-100'"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="ml-1 text-xs">
            ({{ tab.count }})
          </span>
        </button>
      </div>
      
      <div v-if="filteredOrders.length > 0" class="space-y-4">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">
                订单号：{{ order.orderNo }}
              </span>
              <span class="text-xs text-gray-400">
                {{ formatDate(order.createTime) }}
              </span>
            </div>
            <span 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>
          
          <div class="p-6">
            <div class="flex items-start gap-4">
              <img 
                :src="order.product.mainImage" 
                :alt="order.product.name"
                class="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
              
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 line-clamp-2 mb-2">
                  {{ order.product.name }}
                </h3>
                <div class="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <span>场次：{{ getSessionName(order.sessionId) }}</span>
                  <span>数量：{{ order.quantity }}</span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-lg font-bold text-seckill-red">
                    ¥{{ order.totalPrice.toLocaleString() }}
                  </span>
                  <span class="text-sm text-gray-400 line-through">
                    ¥{{ order.originalTotalPrice.toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="order.status === OrderStatus.PENDING_PAYMENT" class="mt-4 p-4 bg-orange-50 rounded-xl">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-seckill-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-seckill-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">请在支付倒计时结束前完成支付</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-xs text-gray-500">剩余时间：</span>
                      <div class="flex items-center gap-1">
                        <div class="w-6 h-6 bg-seckill-red text-white text-xs font-bold rounded flex items-center justify-center">
                          {{ getPaymentCountdown(order).minutes }}
                        </div>
                        <span class="text-seckill-red font-bold">:</span>
                        <div class="w-6 h-6 bg-seckill-red text-white text-xs font-bold rounded flex items-center justify-center">
                          {{ getPaymentCountdown(order).seconds }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    @click="cancelOrder(order)"
                    class="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    取消订单
                  </button>
                  <button 
                    @click="payOrder(order)"
                    class="flex-1 sm:flex-none px-6 py-2 bg-seckill-red text-white text-sm font-medium rounded-full hover:bg-seckill-red/90 transition-colors"
                  >
                    立即支付
                  </button>
                </div>
              </div>
            </div>
            
            <div v-else-if="order.status === OrderStatus.PAID" class="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-green-50 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">支付成功</p>
                  <p class="text-xs text-gray-500 mt-1">
                    支付时间：{{ formatDate(order.payTime!) }}
                  </p>
                </div>
              </div>
              <button 
                @click="viewOrderDetail(order)"
                class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                查看详情
              </button>
            </div>
            
            <div v-else-if="order.status === OrderStatus.CANCELLED" class="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">订单已取消</p>
                  <p class="text-xs text-gray-500 mt-1">
                    取消原因：{{ order.cancelReason || '用户取消' }}
                  </p>
                </div>
              </div>
              <NuxtLink 
                :to="`/products/${order.productId}`"
                class="w-full sm:w-auto px-4 py-2 bg-seckill-red text-white text-sm font-medium rounded-full hover:bg-seckill-red/90 transition-colors text-center"
              >
                再次抢购
              </NuxtLink>
            </div>
            
            <div v-else-if="order.status === OrderStatus.EXPIRED" class="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">订单已过期</p>
                  <p class="text-xs text-gray-500 mt-1">
                    未在规定时间内支付，订单已自动取消
                  </p>
                </div>
              </div>
              <NuxtLink 
                :to="`/products/${order.productId}`"
                class="w-full sm:w-auto px-4 py-2 bg-seckill-red text-white text-sm font-medium rounded-full hover:bg-seckill-red/90 transition-colors text-center"
              >
                再次抢购
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-20">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-gray-500 mb-2">暂无{{ currentTabLabel }}订单</p>
        <NuxtLink 
          to="/products"
          class="inline-block px-6 py-2 bg-seckill-red text-white rounded-full hover:bg-seckill-red/90 transition-colors"
        >
          去逛逛
        </NuxtLink>
      </div>
    </div>
    
    <Teleport to="body">
      <SeckillModal 
        v-if="showCancelModal"
        :config="cancelModalConfig"
        @close="showCancelModal = false"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { OrderStatus } from '~/types'
import type { SeckillOrder, SeckillModalConfig } from '~/types'

const orderStore = useOrderStore()
const userStore = useUserStore()
const modalStore = useModalStore()
const activityStore = useActivityStore()

const currentTab = ref('all')
const showCancelModal = ref(false)
const cancellingOrder = ref<SeckillOrder | null>(null)
const now = ref(Date.now())

const tabs = computed(() => [
  { value: 'all', label: '全部', count: orderStore.orders.length },
  { value: 'pending', label: '待支付', count: orderStore.pendingOrders.length },
  { value: 'paid', label: '已支付', count: orderStore.paidOrders.length },
  { value: 'cancelled', label: '已取消', count: orderStore.cancelledOrders.length }
])

const currentTabLabel = computed(() => {
  const tab = tabs.value.find(t => t.value === currentTab.value)
  return tab ? tab.label : ''
})

const orders = computed(() => orderStore.orders)
const pendingCount = computed(() => orderStore.pendingOrders.length)

const filteredOrders = computed(() => {
  switch (currentTab.value) {
    case 'pending':
      return orderStore.pendingOrders
    case 'paid':
      return orderStore.paidOrders
    case 'cancelled':
      return orderStore.cancelledOrders
    default:
      return orderStore.orders
  }
})

const cancelModalConfig = computed<SeckillModalConfig>(() => ({
  visible: false,
  type: 'info',
  title: '确认取消订单',
  content: '您确定要取消该订单吗？取消后商品将释放回库存，您可以重新抢购。',
  data: {
    onConfirm: () => {
      if (cancellingOrder.value) {
        orderStore.cancelOrder(cancellingOrder.value.id, '用户主动取消')
      }
      showCancelModal.value = false
    },
    onCancel: () => {
      showCancelModal.value = false
    }
  }
}))

const getSessionName = (sessionId: string) => {
  const session = activityStore.sessions.find(s => s.id === sessionId)
  return session?.name || '未知场次'
}

const getStatusClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return 'bg-orange-100 text-orange-600'
    case OrderStatus.PAID:
      return 'bg-green-100 text-green-600'
    case OrderStatus.CANCELLED:
    case OrderStatus.EXPIRED:
      return 'bg-gray-100 text-gray-500'
    default:
      return 'bg-gray-100 text-gray-500'
  }
}

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return '待支付'
    case OrderStatus.PAID:
      return '已支付'
    case OrderStatus.CANCELLED:
      return '已取消'
    case OrderStatus.EXPIRED:
      return '已过期'
    default:
      return '未知状态'
  }
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}

const getPaymentCountdown = (order: SeckillOrder) => {
  const remaining = Math.max(0, order.expireTime - now.value)
  
  const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0')
  const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0')
  
  return { minutes, seconds }
}

const cancelOrder = (order: SeckillOrder) => {
  cancellingOrder.value = order
  showCancelModal.value = true
}

const payOrder = (order: SeckillOrder) => {
  orderStore.payOrder(order.id)
  modalStore.showSuccessModal(
    '支付成功',
    `您已成功购买 ${order.product.name}`,
    () => {}
  )
}

const viewOrderDetail = (order: SeckillOrder) => {
  modalStore.showInfoModal(
    '订单详情',
    `订单号：${order.orderNo}\n商品名称：${order.product.name}\n购买数量：${order.quantity}\n订单金额：¥${order.totalPrice.toLocaleString()}\n支付金额：¥${order.totalPrice.toLocaleString()}\n支付时间：${formatDate(order.payTime!)}`,
    () => {}
  )
}

let countdownTimer: ReturnType<typeof setInterval> | null = null
let expiredTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (!userStore.isLoggedIn) {
    userStore.setPendingAction(() => navigateTo('/orders'))
    userStore.openLoginModal()
    return
  }
  
  orderStore.initOrders()
  
  countdownTimer = setInterval(() => {
    now.value = Date.now()
    orderStore.orders.forEach(order => {
      if (order.status === OrderStatus.PENDING_PAYMENT) {
        if (now.value >= order.expireTime) {
          orderStore.expireOrder(order.id)
        }
      }
    })
  }, 1000)
  
  expiredTimer = setInterval(() => {
    orderStore.checkExpiredOrders()
  }, 10000)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  if (expiredTimer) clearInterval(expiredTimer)
})

definePageMeta({
  title: '我的秒杀订单'
})
</script>
