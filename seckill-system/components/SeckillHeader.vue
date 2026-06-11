<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-seckill-red to-primary-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-lg">秒</span>
            </div>
            <span class="hidden sm:inline font-bold text-xl gradient-text">{{ activityStore.config.title }}</span>
          </NuxtLink>
          <nav class="hidden md:flex items-center gap-1 ml-8">
            <NuxtLink 
              to="/" 
              class="nav-link"
              :class="{ 'nav-link-active': route.path === '/' }"
            >
              活动首页
            </NuxtLink>
            <NuxtLink 
              to="/products" 
              class="nav-link"
              :class="{ 'nav-link-active': route.path === '/products' }"
            >
              全部商品
            </NuxtLink>
            <NuxtLink 
              to="/orders" 
              class="nav-link"
              :class="{ 'nav-link-active': route.path === '/orders' }"
            >
              我的订单
            </NuxtLink>
          </nav>
        </div>
        
        <div class="flex items-center gap-3">
          <button 
            @click="showRules"
            class="hidden sm:flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-seckill-red transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            活动规则
          </button>
          
          <div class="relative">
            <button 
              v-if="userStore.isLoggedIn"
              class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img 
                :src="userStore.userInfo.avatar" 
                :alt="userStore.userInfo.nickname"
                class="w-8 h-8 rounded-full"
              />
              <span class="hidden sm:inline text-sm font-medium">{{ userStore.userInfo.nickname }}</span>
            </button>
            <button 
              v-else
              @click="userStore.openLoginModal()"
              class="seckill-btn-primary !py-2 !px-4 text-sm"
            >
              登录
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div class="flex items-center justify-around">
        <NuxtLink 
          to="/" 
          class="flex flex-col items-center gap-1 py-1 px-3"
          :class="{ 'text-seckill-red': route.path === '/' }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs">首页</span>
        </NuxtLink>
        <NuxtLink 
          to="/products" 
          class="flex flex-col items-center gap-1 py-1 px-3"
          :class="{ 'text-seckill-red': route.path === '/products' }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span class="text-xs">商品</span>
        </NuxtLink>
        <NuxtLink 
          to="/orders" 
          class="flex flex-col items-center gap-1 py-1 px-3 relative"
          :class="{ 'text-seckill-red': route.path === '/orders' }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span class="text-xs">订单</span>
          <span 
            v-if="pendingCount > 0"
            class="absolute -top-1 -right-1 w-4 h-4 bg-seckill-red text-white text-xs rounded-full flex items-center justify-center"
          >
            {{ pendingCount }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const activityStore = useActivityStore()
const userStore = useUserStore()
const orderStore = useOrderStore()
const modalStore = useModalStore()
const route = useRoute()

const pendingCount = computed(() => orderStore.pendingOrders.length)

const showRules = () => {
  modalStore.showRulesModal(activityStore.config.rules)
}
</script>
