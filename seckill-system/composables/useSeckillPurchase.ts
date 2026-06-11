import { ref } from 'vue'
import type { SeckillPurchaseResult, SeckillProduct, PurchaseLimitInfo } from '~/types'

export function useSeckillPurchase() {
  const activityStore = useActivityStore()
  const userStore = useUserStore()
  const orderStore = useOrderStore()
  const modalStore = useModalStore()

  const isPurchasing = ref<boolean>(false)
  const purchaseResult = ref<SeckillPurchaseResult | null>(null)

  const checkPurchaseEligibility = (
    productId: string,
    sessionId: string
  ): PurchaseLimitInfo => {
    const product = activityStore.getProductById(productId)
    if (!product) {
      return { canPurchase: false, reason: 'sold_out', remaining: 0, limit: 0, message: '商品不存在或已下架' }
    }

    const productStatus = activityStore.getProductStatus(product)
    if (productStatus === 'sold_out') {
      return { canPurchase: false, reason: 'sold_out', remaining: 0, limit: 0, message: '商品已售罄' }
    }
    if (productStatus === 'not_started') {
      return { canPurchase: false, reason: 'not_started', remaining: 0, limit: 0, message: '秒杀尚未开始' }
    }
    if (productStatus === 'ended') {
      return { canPurchase: false, reason: 'ended', remaining: 0, limit: 0, message: '秒杀已结束' }
    }

    const limitInfo = userStore.checkPurchaseLimit(
      productId,
      sessionId,
      {
        limitPerUser: activityStore.config.limitPerUser,
        limitPerSession: activityStore.config.limitPerSession,
        dailyLimit: activityStore.config.dailyLimit,
        enableLoginRequired: activityStore.config.enableLoginRequired
      }
    )

    if (!limitInfo.canPurchase && limitInfo.reason === 'not_logged_in') {
      userStore.setPendingAction(() => purchaseProduct(productId, sessionId))
      userStore.openLoginModal()
    }

    return limitInfo
  }

  const purchaseProduct = async (
    productId: string,
    sessionId: string,
    quantity: number = 1
  ): Promise<SeckillPurchaseResult> => {
    if (isPurchasing.value) {
      return {
        success: false,
        errorCode: 'system_error',
        errorMessage: '正在处理中，请稍候...'
      }
    }

    const eligibility = checkPurchaseEligibility(productId, sessionId)
    if (!eligibility.canPurchase) {
      const errorMessages: Record<string, string> = {
        'not_logged_in': '请先登录后再参与抢购',
        'daily_limit': '今日限购次数已用完',
        'session_limit': '本场次限购次数已用完',
        'total_limit': '活动总限购次数已用完',
        'sold_out': '商品已售罄',
        'not_started': '秒杀尚未开始',
        'ended': '秒杀已结束'
      }

      const result: SeckillPurchaseResult = {
        success: false,
        errorCode: eligibility.reason === 'not_logged_in' ? 'not_logged_in' :
                   eligibility.reason === 'sold_out' ? 'stock_insufficient' :
                   eligibility.reason === 'ended' ? 'activity_ended' :
                   'limit_exceeded',
        errorMessage: errorMessages[eligibility.reason || 'system_error'] || '抢购失败'
      }

      purchaseResult.value = result
      modalStore.showErrorModal(result.errorMessage!, result.errorCode)
      return result
    }

    isPurchasing.value = true

    try {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500))

      const product = activityStore.getProductById(productId)
      if (!product || product.remainingStock < quantity) {
        const result: SeckillPurchaseResult = {
          success: false,
          errorCode: 'stock_insufficient',
          errorMessage: '手慢了，商品已被抢光！'
        }
        purchaseResult.value = result
        modalStore.showErrorModal(result.errorMessage!, result.errorCode)
        return result
      }

      const stockUpdated = activityStore.updateStock(productId, quantity)
      if (!stockUpdated) {
        const result: SeckillPurchaseResult = {
          success: false,
          errorCode: 'stock_insufficient',
          errorMessage: '库存更新失败，请重试'
        }
        purchaseResult.value = result
        modalStore.showErrorModal(result.errorMessage!, result.errorCode)
        return result
      }

      const order = orderStore.createOrder(product, sessionId, userStore.userInfo.id, quantity)

      userStore.addPurchaseRecord({
        productId,
        sessionId,
        quantity,
        purchaseTime: Date.now(),
        orderId: order.id
      })

      const result: SeckillPurchaseResult = {
        success: true,
        orderId: order.id,
        order
      }

      purchaseResult.value = result

      modalStore.showSuccessModal(
        `恭喜您成功抢购${product.name}！`,
        { order },
        () => {
          navigateTo(`/order/pay/${order.id}`)
        }
      )

      return result
    } catch (error) {
      const result: SeckillPurchaseResult = {
        success: false,
        errorCode: 'system_error',
        errorMessage: '系统异常，请稍后重试'
      }
      purchaseResult.value = result
      modalStore.showErrorModal(result.errorMessage!, result.errorCode)
      return result
    } finally {
      isPurchasing.value = false
    }
  }

  const confirmAndPurchase = (product: SeckillProduct) => {
    const eligibility = checkPurchaseEligibility(product.id, product.sessionId)
    if (!eligibility.canPurchase) return

    modalStore.showOrderConfirmModal(
      product,
      () => {
        purchaseProduct(product.id, product.sessionId)
      }
    )
  }

  const handlePurchase = async (productId: string) => {
    const product = activityStore.getProductById(productId)
    if (!product) return
    return purchaseProduct(productId, product.sessionId)
  }

  const resetPurchaseResult = () => {
    purchaseResult.value = null
  }

  return {
    isPurchasing,
    purchaseResult,
    checkPurchaseEligibility,
    purchaseProduct,
    handlePurchase,
    confirmAndPurchase,
    resetPurchaseResult
  }
}
