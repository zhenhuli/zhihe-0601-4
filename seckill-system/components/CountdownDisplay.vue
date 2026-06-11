<template>
  <div class="flex items-center gap-2">
    <template v-if="countdown.days > 0">
      <div class="countdown-box">
        <span>{{ String(countdown.days).padStart(2, '0') }}</span>
      </div>
      <span class="text-seckill-red font-bold text-lg">天</span>
    </template>
    <div class="countdown-box">
      <span>{{ String(countdown.hours).padStart(2, '0') }}</span>
    </div>
    <span class="text-seckill-red font-bold text-lg animate-pulse">:</span>
    <div class="countdown-box">
      <span>{{ String(countdown.minutes).padStart(2, '0') }}</span>
    </div>
    <span class="text-seckill-red font-bold text-lg animate-pulse">:</span>
    <div class="countdown-box">
      <span>{{ String(countdown.seconds).padStart(2, '0') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CountdownInfo } from '~/types'

defineProps<{
  countdown: CountdownInfo
}>()
</script>
