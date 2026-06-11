<template>
  <div class="fixed right-4 sm:right-6 bottom-24 sm:bottom-8 z-30 flex flex-col gap-3">
    <button
      @click="scrollToTop"
      v-show="showScrollTop"
      class="w-12 h-12 rounded-full bg-white shadow-lg border border-decor-sand flex items-center justify-center text-decor-slate hover:text-primary-600 hover:border-primary-300 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      title="返回顶部"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
      </svg>
    </button>
    <button
      @click="openAppointment"
      class="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-xl hover:shadow-2xl flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1 animate-float"
    >
      <div class="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-20"></div>
      <div class="relative flex flex-col items-center">
        <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="text-[10px] sm:text-xs font-medium mt-0.5">预约</span>
      </div>
    </button>
    <a
      href="tel:4008886666"
      class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-lg border border-decor-sand flex items-center justify-center text-decor-olive hover:text-white hover:bg-decor-olive hover:border-decor-olive transition-all duration-300 hover:-translate-y-1"
      title="电话咨询"
    >
      <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
      </svg>
    </a>
    <button
      @click="goToQuote"
      class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-lg border border-decor-sand flex items-center justify-center text-decor-gold hover:text-white hover:bg-decor-gold hover:border-decor-gold transition-all duration-300 hover:-translate-y-1"
      title="智能报价"
    >
      <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppointmentStore } from '~/stores/appointment'

const showScrollTop = ref(false)
const appointmentStore = useAppointmentStore()
const router = useRouter()

function handleScroll() {
  showScrollTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openAppointment() {
  appointmentStore.openModal()
}

function goToQuote() {
  router.push('/quote')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
