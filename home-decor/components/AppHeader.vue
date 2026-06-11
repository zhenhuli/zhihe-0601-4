<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-decor-sand/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-decor-gold flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <div class="hidden sm:block">
            <div class="font-bold text-lg text-decor-charcoal">智禾装饰</div>
            <div class="text-xs text-decor-slate -mt-0.5">匠心筑家 · 品质生活</div>
          </div>
        </NuxtLink>
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
            :class="$route.path === item.path ? 'text-primary-600 bg-primary-50' : 'text-decor-slate hover:text-primary-600 hover:bg-primary-50/50'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-2 sm:gap-4">
          <button
            @click="openAppointment"
            class="hidden sm:inline-flex btn-primary !px-5 !py-2.5 text-sm items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            免费预约
          </button>
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-decor-sand/50 transition-colors"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6 text-decor-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="w-6 h-6 text-decor-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      <div
        v-if="mobileMenuOpen"
        class="md:hidden pb-4 -mx-4 px-4 border-t border-decor-sand/50 animate-slide-down"
      >
        <nav class="flex flex-col gap-1 pt-3">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3"
            :class="$route.path === item.path ? 'text-primary-600 bg-primary-50' : 'text-decor-slate hover:bg-decor-sand/30'"
            @click="mobileMenuOpen = false"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </NuxtLink>
          <button
            @click="handleMobileAppointment"
            class="mt-2 btn-primary w-full justify-center items-center gap-2 flex"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            免费预约设计
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { markRaw, ref } from 'vue'

const mobileMenuOpen = ref(false)
const appointmentStore = useAppointmentStore()

const navItems = [
  { 
    path: '/', 
    label: '案例展厅',
    icon: markRaw({
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
    })
  },
  { 
    path: '/layouts', 
    label: '户型分类',
    icon: markRaw({
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`
    })
  },
  { 
    path: '/quote', 
    label: '在线报价',
    icon: markRaw({
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`
    })
  },
  { 
    path: '/appointment', 
    label: '预约留资',
    icon: markRaw({
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`
    })
  }
]

function openAppointment() {
  appointmentStore.openModal()
}

function handleMobileAppointment() {
  mobileMenuOpen.value = false
  appointmentStore.openModal()
}
</script>
