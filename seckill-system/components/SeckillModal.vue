<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modalStore.isVisible"
        class="mask-layer"
        @click.self="handleClose"
      >
        <div class="modal-container">
          <template v-if="modalStore.modalConfig.type === 'countdown'">
            <CountdownModalContent :config="modalStore.modalConfig" @close="handleClose" />
          </template>
          
          <template v-else-if="modalStore.modalConfig.type === 'order_confirm'">
            <OrderConfirmModalContent :config="modalStore.modalConfig" @close="handleClose" />
          </template>
          
          <template v-else-if="modalStore.modalConfig.type === 'rules'">
            <RulesModalContent :config="modalStore.modalConfig" @close="handleClose" />
          </template>
          
          <template v-else-if="modalStore.modalConfig.type === 'success'">
            <SuccessModalContent :config="modalStore.modalConfig" @close="handleClose" />
          </template>
          
          <template v-else-if="modalStore.modalConfig.type === 'error'">
            <ErrorModalContent :config="modalStore.modalConfig" @close="handleClose" />
          </template>
          
          <template v-else>
            <InfoModalContent :config="modalStore.modalConfig" @close="handleClose" />
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import SuccessModalContent from './modals/SuccessModalContent.vue'
import ErrorModalContent from './modals/ErrorModalContent.vue'
import InfoModalContent from './modals/InfoModalContent.vue'
import CountdownModalContent from './modals/CountdownModalContent.vue'
import OrderConfirmModalContent from './modals/OrderConfirmModalContent.vue'
import RulesModalContent from './modals/RulesModalContent.vue'

const modalStore = useModalStore()

const handleClose = () => {
  if (modalStore.modalConfig.onCancel) {
    modalStore.modalConfig.onCancel()
  }
  modalStore.hideModal()
}

watch(() => modalStore.isVisible, (visible) => {
  if (visible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
