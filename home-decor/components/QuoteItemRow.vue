<template>
  <div
    class="border rounded-xl transition-all duration-300 overflow-hidden"
    :class="selected ? 'border-primary-300 bg-primary-50/30' : 'border-decor-sand/50 bg-white hover:border-decor-sand'"
  >
    <div class="p-4 flex items-start gap-4">
      <div class="pt-1">
        <label
          class="relative flex items-center cursor-pointer"
          :class="{ 'opacity-50 cursor-not-allowed': item.required }"
        >
          <input
            type="checkbox"
            :checked="selected"
            :disabled="item.required"
            @change="$emit('toggle')"
            class="sr-only peer"
          />
          <div
            class="w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center"
            :class="selected ? 'bg-primary-500 border-primary-500' : 'border-decor-sand peer-hover:border-primary-400'"
          >
            <svg v-if="selected" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </label>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-1">
          <div class="flex items-center gap-2">
            <h4 class="font-semibold text-decor-charcoal">{{ item.name }}</h4>
            <span
              v-if="item.required"
              class="px-2 py-0.5 bg-red-50 text-red-500 text-xs rounded-full font-medium"
            >必选</span>
          </div>
          <div v-if="detail" class="text-right">
            <div class="font-bold text-primary-600">¥{{ formatMoney(detail.subtotal) }}</div>
          </div>
        </div>
        <p class="text-xs text-decor-slate mb-3">{{ item.description }}</p>
        <div v-if="selected && detail" class="grid grid-cols-2 gap-3 pt-3 border-t border-decor-sand/30">
          <div>
            <label class="text-xs text-decor-slate mb-1 block">数量 ({{ item.unit }})</label>
            <div class="flex items-center gap-2">
              <button
                @click="decreaseQty"
                class="w-7 h-7 rounded-lg border border-decor-sand flex items-center justify-center text-decor-slate hover:border-primary-400 hover:text-primary-600 transition-colors"
                :disabled="item.unit === '㎡' && detail.quantity <= 0.5 || detail.quantity <= 1"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
              </button>
              <input
                type="number"
                :value="detail.quantity"
                @change="handleQtyChange"
                class="flex-1 input-base !py-1.5 !px-2 text-center text-sm font-medium"
                :step="item.unit === '㎡' ? 0.5 : 1"
                :min="item.unit === '㎡' ? 0.5 : 1"
              />
              <button
                @click="increaseQty"
                class="w-7 h-7 rounded-lg border border-decor-sand flex items-center justify-center text-decor-slate hover:border-primary-400 hover:text-primary-600 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              </button>
            </div>
          </div>
          <div>
            <label class="text-xs text-decor-slate mb-1 block">单价 (元/{{ item.unit }})</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-decor-slate text-sm">¥</span>
              <input
                type="number"
                :value="detail.unitPrice"
                @change="handlePriceChange"
                class="input-base !py-1.5 !pl-7 !pr-2 text-sm font-medium"
                min="0"
                step="10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuoteItem } from '~/types'

const props = defineProps<{
  item: QuoteItem
  selected: boolean
  detail: any
  gradeMultiplier: number
}>()

const emit = defineEmits<{
  'toggle': []
  'update-quantity': [value: number]
  'update-price': [value: number]
}>()

function formatMoney(v: number): string {
  return Math.round(v).toLocaleString()
}

function increaseQty() {
  const step = props.item.unit === '㎡' ? 0.5 : 1
  emit('update-quantity', +(props.detail.quantity + step).toFixed(2))
}

function decreaseQty() {
  const step = props.item.unit === '㎡' ? 0.5 : 1
  const minVal = props.item.unit === '㎡' ? 0.5 : 1
  const newVal = +(props.detail.quantity - step).toFixed(2)
  if (newVal >= minVal) emit('update-quantity', newVal)
}

function handleQtyChange(e: Event) {
  const target = e.target as HTMLInputElement
  let val = parseFloat(target.value)
  if (isNaN(val)) return
  const minVal = props.item.unit === '㎡' ? 0.5 : 1
  val = Math.max(minVal, val)
  emit('update-quantity', val)
}

function handlePriceChange(e: Event) {
  const target = e.target as HTMLInputElement
  let val = parseFloat(target.value)
  if (isNaN(val) || val < 0) val = 0
  emit('update-price', val)
}
</script>
