import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { CountdownInfo } from '~/types'

export function useCountdown(targetTime: number | (() => number), autoStart = true) {
  const now = ref(Date.now())
  const isRunning = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  const getTargetTime = () => {
    return typeof targetTime === 'function' ? targetTime() : targetTime
  }

  const countdown = computed<CountdownInfo>(() => {
    const target = getTargetTime()
    const diff = Math.max(0, target - now.value)
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMilliseconds: diff,
      isExpired: diff <= 0
    }
  })

  const formattedTime = computed(() => {
    const { days, hours, minutes, seconds } = countdown.value
    const pad = (n: number) => String(n).padStart(2, '0')
    
    if (days > 0) {
      return `${days}天 ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  })

  const start = () => {
    if (isRunning.value) return
    isRunning.value = true
    timer = setInterval(() => {
      now.value = Date.now()
      if (countdown.value.isExpired) {
        stop()
      }
    }, 1000)
  }

  const stop = () => {
    isRunning.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const reset = () => {
    stop()
    now.value = Date.now()
  }

  onMounted(() => {
    if (autoStart) {
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  if (typeof targetTime === 'function') {
    watch(targetTime, () => {
      reset()
      if (autoStart) {
        start()
      }
    })
  }

  return {
    countdown,
    formattedTime,
    isRunning,
    start,
    stop,
    reset
  }
}

export function useSessionCountdown() {
  const activityStore = useActivityStore()
  
  const currentSessionEndTime = computed(() => {
    return activityStore.currentSession?.endTime || 0
  })

  const nextSessionStartTime = computed(() => {
    const upcoming = activityStore.upcomingSessions
    return upcoming.length > 0 ? upcoming[0].startTime : 0
  })

  const endCountdown = useCountdown(() => currentSessionEndTime.value, false)
  const startCountdown = useCountdown(() => nextSessionStartTime.value, false)

  const startAll = () => {
    endCountdown.start()
    startCountdown.start()
  }

  const stopAll = () => {
    endCountdown.stop()
    startCountdown.stop()
  }

  watch(() => activityStore.currentSessionId, () => {
    endCountdown.reset()
    startCountdown.reset()
    if (activityStore.currentSession) {
      endCountdown.start()
    }
  })

  return {
    endCountdown,
    startCountdown,
    currentSessionEndTime,
    nextSessionStartTime,
    startAll,
    stopAll
  }
}
