import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, PurchaseRecord, PurchaseLimitInfo } from '~/types'

const STORAGE_KEY = 'seckill_user_info'
const PURCHASE_HISTORY_KEY = 'seckill_purchase_history'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    id: '',
    nickname: '',
    avatar: '',
    phone: '',
    isLoggedIn: false,
    purchaseHistory: []
  })

  const loading = ref<boolean>(false)
  const showLoginModal = ref<boolean>(false)
  const pendingAction = ref<(() => void) | null>(null)

  const isLoggedIn = computed<boolean>(() => userInfo.value.isLoggedIn)

  const todayPurchaseCount = computed<number>(() => {
    const today = new Date().setHours(0, 0, 0, 0)
    return userInfo.value.purchaseHistory.filter(
      record => new Date(record.purchaseTime).setHours(0, 0, 0, 0) === today
    ).reduce((sum, record) => sum + record.quantity, 0)
  })

  const getSessionPurchaseCount = (sessionId: string): number => {
    return userInfo.value.purchaseHistory
      .filter(record => record.sessionId === sessionId)
      .reduce((sum, record) => sum + record.quantity, 0)
  }

  const getProductPurchaseCount = (productId: string): number => {
    return userInfo.value.purchaseHistory
      .filter(record => record.productId === productId)
      .reduce((sum, record) => sum + record.quantity, 0)
  }

  const totalPurchaseCount = computed<number>(() => {
    return userInfo.value.purchaseHistory.reduce((sum, record) => sum + record.quantity, 0)
  })

  const checkPurchaseLimit = (
    productId: string,
    sessionId: string,
    activityConfig: {
      limitPerUser: number
      limitPerSession: number
      dailyLimit: number
      enableLoginRequired: boolean
    }
  ): PurchaseLimitInfo => {
    if (activityConfig.enableLoginRequired && !userInfo.value.isLoggedIn) {
      return {
        canPurchase: false,
        reason: 'not_logged_in',
        limit: 0,
        remaining: 0,
        message: '请先登录后再参与抢购'
      }
    }

    const sessionCount = getSessionPurchaseCount(sessionId)
    if (sessionCount >= activityConfig.limitPerSession) {
      return {
        canPurchase: false,
        reason: 'session_limit',
        limit: activityConfig.limitPerSession,
        remaining: 0,
        message: `本场次限购${activityConfig.limitPerSession}件，您已达上限`
      }
    }

    if (todayPurchaseCount.value >= activityConfig.dailyLimit) {
      return {
        canPurchase: false,
        reason: 'daily_limit',
        limit: activityConfig.dailyLimit,
        remaining: 0,
        message: `今日限购${activityConfig.dailyLimit}件，您已达上限`
      }
    }

    if (totalPurchaseCount.value >= activityConfig.limitPerUser) {
      return {
        canPurchase: false,
        reason: 'total_limit',
        limit: activityConfig.limitPerUser,
        remaining: 0,
        message: `活动期间限购${activityConfig.limitPerUser}件，您已达上限`
      }
    }

    const remainingDaily = activityConfig.dailyLimit - todayPurchaseCount.value
    const remainingSession = activityConfig.limitPerSession - sessionCount
    const remainingTotal = activityConfig.limitPerUser - totalPurchaseCount.value
    const remaining = Math.min(remainingDaily, remainingSession, remainingTotal)

    return {
      canPurchase: true,
      remaining,
      limit: activityConfig.limitPerSession,
      message: `还可以购买${remaining}件`
    }
  }

  const addPurchaseRecord = (record: PurchaseRecord): void => {
    userInfo.value.purchaseHistory.unshift(record)
    saveToStorage()
  }

  const login = async (phone: string, password: string): Promise<boolean> => {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userInfo.value = {
      id: 'user_' + Date.now(),
      nickname: '秒杀用户' + phone.slice(-4),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
      phone,
      isLoggedIn: true,
      purchaseHistory: loadPurchaseHistory()
    }
    
    loading.value = false
    saveToStorage()
    
    if (pendingAction.value) {
      const action = pendingAction.value
      pendingAction.value = null
      action()
    }
    
    return true
  }

  const quickLogin = async (): Promise<boolean> => {
    return login('13800138000', '123456')
  }

  const logout = (): void => {
    userInfo.value = {
      id: '',
      nickname: '',
      avatar: '',
      phone: '',
      isLoggedIn: false,
      purchaseHistory: []
    }
    pendingAction.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  const setPendingAction = (action: () => void): void => {
    pendingAction.value = action
  }

  const openLoginModal = (): void => {
    showLoginModal.value = true
  }

  const closeLoginModal = (): void => {
    showLoginModal.value = false
    pendingAction.value = null
  }

  const saveToStorage = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        id: userInfo.value.id,
        nickname: userInfo.value.nickname,
        avatar: userInfo.value.avatar,
        phone: userInfo.value.phone,
        isLoggedIn: userInfo.value.isLoggedIn
      }))
      localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify(userInfo.value.purchaseHistory))
    }
  }

  const loadFromStorage = (): void => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          userInfo.value = {
            ...parsed,
            purchaseHistory: loadPurchaseHistory()
          }
        } catch (e) {
          console.error('Failed to parse user info from storage')
        }
      }
    }
  }

  const loadPurchaseHistory = (): PurchaseRecord[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PURCHASE_HISTORY_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse purchase history from storage')
        }
      }
    }
    return []
  }

  const initUser = (): void => {
    loadFromStorage()
  }

  return {
    userInfo,
    loading,
    showLoginModal,
    pendingAction,
    isLoggedIn,
    todayPurchaseCount,
    totalPurchaseCount,
    getSessionPurchaseCount,
    getProductPurchaseCount,
    checkPurchaseLimit,
    addPurchaseRecord,
    login,
    quickLogin,
    logout,
    setPendingAction,
    openLoginModal,
    closeLoginModal,
    initUser
  }
})
