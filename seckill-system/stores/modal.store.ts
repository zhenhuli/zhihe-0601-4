import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SeckillModalConfig } from '~/types'

export const useModalStore = defineStore('modal', () => {
  const modalConfig = ref<SeckillModalConfig>({
    visible: false,
    type: 'info'
  })

  const isVisible = computed<boolean>(() => modalConfig.value.visible)
  const modalType = computed<string>(() => modalConfig.value.type)

  const showModal = (config: Omit<SeckillModalConfig, 'visible'>) => {
    modalConfig.value = {
      ...config,
      visible: true
    }
  }

  const hideModal = () => {
    modalConfig.value = {
      visible: false,
      type: 'info'
    }
  }

  const showCountdownModal = (targetTime: number, title?: string) => {
    showModal({
      type: 'countdown',
      title: title || '距离开抢还有',
      data: { targetTime }
    })
  }

  const showOrderConfirmModal = (product: any, onConfirm: () => void, onCancel?: () => void) => {
    showModal({
      type: 'order_confirm',
      title: '确认订单',
      data: { product },
      onConfirm,
      onCancel
    })
  }

  const showRulesModal = (rules: any[]) => {
    showModal({
      type: 'rules',
      title: '活动规则',
      data: { rules }
    })
  }

  const showSuccessModal = (message: string, data?: any, onConfirm?: () => void) => {
    showModal({
      type: 'success',
      title: '抢购成功',
      content: message,
      data,
      onConfirm
    })
  }

  const showErrorModal = (message: string, errorCode?: string, onConfirm?: () => void) => {
    showModal({
      type: 'error',
      title: '抢购失败',
      content: message,
      data: { errorCode },
      onConfirm
    })
  }

  const showInfoModal = (title: string, content: string, onConfirm?: () => void) => {
    showModal({
      type: 'info',
      title,
      content,
      onConfirm
    })
  }

  return {
    modalConfig,
    isVisible,
    modalType,
    showModal,
    hideModal,
    showCountdownModal,
    showOrderConfirmModal,
    showRulesModal,
    showSuccessModal,
    showErrorModal,
    showInfoModal
  }
})
