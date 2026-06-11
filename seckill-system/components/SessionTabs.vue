<template>
  <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900">秒杀场次</h3>
      <div v-if="activeSession" class="flex items-center gap-2 text-sm">
        <span class="text-gray-500">本场结束</span>
        <CountdownDisplay :countdown="endCountdown.countdown.value" />
      </div>
    </div>
    
    <div class="relative">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <button
          v-for="session in allSessions"
          :key="session.id"
          @click="selectSession(session.id)"
          class="flex-shrink-0 px-4 py-3 rounded-xl transition-all duration-300 min-w-[100px] text-center"
          :class="getSessionClass(session)"
        >
          <div class="flex items-center justify-center gap-1 mb-1">
            <span 
              v-if="session.status === 'active'"
              class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            ></span>
            <span class="font-bold">{{ session.name }}</span>
          </div>
          <div class="text-xs" :class="currentSessionId === session.id ? 'text-white/80' : 'text-gray-500'">
            {{ getSessionSubtitle(session) }}
          </div>
          <div 
            v-if="session.status === 'upcoming'"
            class="text-xs mt-1 text-seckill-orange font-medium"
          >
            {{ formatStartTime(session.startTime) }}后开始
          </div>
        </button>
      </div>
    </div>
    
    <div v-if="upcomingSessions.length > 0 && currentSession?.status === 'upcoming'" class="mt-4 p-4 bg-seckill-orange/5 rounded-xl">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-900">距离 {{ currentSession.name }} 开始还有</p>
          <p class="text-xs text-gray-500 mt-1">{{ currentSession.title }}</p>
        </div>
        <CountdownDisplay :countdown="startCountdown.countdown.value" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { SeckillSession } from '~/types'

const activityStore = useActivityStore()
const { endCountdown, startCountdown, currentSessionEndTime, nextSessionStartTime } = useSessionCountdown()

const currentSessionId = computed(() => activityStore.currentSessionId)
const activeSession = computed(() => activityStore.activeSession)
const currentSession = computed(() => activityStore.currentSession)
const upcomingSessions = computed(() => activityStore.upcomingSessions)
const pastSessions = computed(() => activityStore.pastSessions)

const allSessions = computed(() => {
  return [
    ...(activeSession.value ? [activeSession.value] : []),
    ...upcomingSessions.value,
    ...pastSessions.value
  ]
})

let statusTimer: ReturnType<typeof setInterval> | null = null

const selectSession = (sessionId: string) => {
  activityStore.setCurrentSession(sessionId)
}

const getSessionClass = (session: SeckillSession) => {
  if (currentSessionId.value === session.id) {
    if (session.status === 'active') {
      return 'bg-gradient-to-r from-seckill-red to-primary-600 text-white shadow-lg shadow-primary-500/30'
    }
    if (session.status === 'upcoming') {
      return 'bg-gradient-to-r from-seckill-orange to-seckill-gold text-white shadow-lg'
    }
    return 'bg-gray-800 text-white'
  }
  
  if (session.status === 'active') {
    return 'bg-primary-50 text-seckill-red hover:bg-primary-100'
  }
  if (session.status === 'upcoming') {
    return 'bg-seckill-orange/5 text-seckill-orange hover:bg-seckill-orange/10'
  }
  return 'bg-gray-50 text-gray-400 hover:bg-gray-100'
}

const getSessionSubtitle = (session: SeckillSession) => {
  if (session.status === 'active') return '抢购中'
  if (session.status === 'upcoming') return '即将开始'
  return '已结束'
}

const formatStartTime = (timestamp: number) => {
  const diff = timestamp - Date.now()
  if (diff < 0) return '0秒'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}小时${minutes}分`
  }
  return `${minutes}分`
}

onMounted(() => {
  endCountdown.start()
  startCountdown.start()
  
  statusTimer = setInterval(() => {
    activityStore.updateSessionStatuses()
  }, 1000)
})

onUnmounted(() => {
  endCountdown.stop()
  startCountdown.stop()
  if (statusTimer) {
    clearInterval(statusTimer)
  }
})
</script>
