<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="appointmentStore.isSuccessOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
          <div class="p-8 text-center">
            <div class="relative w-24 h-24 mx-auto mb-6">
              <div class="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30"></div>
              <div class="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-decor-charcoal mb-2">预约成功！</h2>
            <p class="text-decor-slate mb-6">我们的设计顾问将在24小时内与您联系</p>
            <div v-if="appointmentStore.successRecord" class="bg-decor-cream rounded-2xl p-5 mb-6 text-left space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-decor-slate text-sm">预约编号</span>
                <span class="font-mono font-semibold text-primary-600">#{{ appointmentStore.successRecord.id.slice(-6) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-decor-slate text-sm">客户姓名</span>
                <span class="font-medium text-decor-charcoal">{{ appointmentStore.successRecord.name }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-decor-slate text-sm">联系电话</span>
                <span class="font-medium text-decor-charcoal">{{ appointmentStore.successRecord.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-decor-slate text-sm">所在小区</span>
                <span class="font-medium text-decor-charcoal">{{ appointmentStore.successRecord.community }}</span>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="closeModal"
                class="flex-1 btn-secondary !py-3"
              >
                我知道了
              </button>
              <button
                @click="goToQuote"
                class="flex-1 btn-primary !py-3 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                测测装修报价
              </button>
            </div>
          </div>
          <div class="bg-gradient-to-r from-primary-50 to-decor-gold/10 px-8 py-4 border-t border-decor-sand/50">
            <div class="flex items-center justify-center gap-6 text-sm text-decor-slate">
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                400-888-6666
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                24小时内回电
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useAppointmentStore } from '~/stores/appointment'

const appointmentStore = useAppointmentStore()
const router = useRouter()

function closeModal() {
  appointmentStore.closeSuccess()
}

function goToQuote() {
  closeModal()
  router.push('/quote')
}

watch(() => appointmentStore.isSuccessOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.9) translateY(20px);
}
</style>
