<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="quoteStore.isPreviewOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closePreview"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
          <div class="bg-gradient-to-r from-primary-500 to-decor-gold px-6 lg:px-8 py-5 text-white flex items-center justify-between flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <div>
                <h2 class="text-xl font-bold">装修报价清单</h2>
                <p class="text-white/80 text-sm">
                  {{ quoteStore.area }}㎡ · {{ quoteStore.currentGrade.name }}
                </p>
              </div>
            </div>
            <button
              @click="closePreview"
              class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-6 lg:p-8">
            <div class="bg-gradient-to-br from-decor-cream to-primary-50/50 rounded-2xl p-6 mb-6">
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="text-center p-3 bg-white rounded-xl">
                  <div class="text-xs text-decor-slate mb-1">建筑面积</div>
                  <div class="text-xl font-bold text-decor-charcoal">{{ quoteStore.area }}㎡</div>
                </div>
                <div class="text-center p-3 bg-white rounded-xl">
                  <div class="text-xs text-decor-slate mb-1">装修档次</div>
                  <div class="text-xl font-bold text-decor-charcoal">{{ quoteStore.currentGrade.name }}</div>
                </div>
                <div class="text-center p-3 bg-white rounded-xl">
                  <div class="text-xs text-decor-slate mb-1">项目数量</div>
                  <div class="text-xl font-bold text-decor-charcoal">{{ quoteStore.selectedItems.length }}项</div>
                </div>
                <div class="text-center p-3 bg-white rounded-xl">
                  <div class="text-xs text-decor-slate mb-1">平米造价</div>
                  <div class="text-xl font-bold text-primary-600">¥{{ formatMoney(quoteStore.pricePerSquare) }}</div>
                </div>
              </div>
            </div>
            <div class="mb-6">
              <h3 class="font-bold text-decor-charcoal mb-3 flex items-center gap-2 pb-2 border-b border-decor-sand/30">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                硬装工程明细
                <span class="ml-auto text-sm font-normal text-blue-600">小计：¥{{ formatMoney(quoteStore.hardTotal) }}</span>
              </h3>
              <div class="overflow-hidden rounded-xl border border-decor-sand/30">
                <table class="w-full text-sm">
                  <thead class="bg-decor-cream">
                    <tr>
                      <th class="px-4 py-3 text-left font-semibold text-decor-charcoal">项目名称</th>
                      <th class="px-4 py-3 text-center font-semibold text-decor-charcoal">数量</th>
                      <th class="px-4 py-3 text-right font-semibold text-decor-charcoal">单价</th>
                      <th class="px-4 py-3 text-right font-semibold text-decor-charcoal">小计</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-decor-sand/20">
                    <tr v-for="item in hardList" :key="item.itemId" class="hover:bg-decor-cream/30">
                      <td class="px-4 py-3">
                        <div class="font-medium text-decor-charcoal">{{ getQuoteItem(item.itemId)?.name }}</div>
                        <div class="text-xs text-decor-slate">{{ getQuoteItem(item.itemId)?.description }}</div>
                      </td>
                      <td class="px-4 py-3 text-center text-decor-slate">{{ item.quantity }} {{ getQuoteItem(item.itemId)?.unit }}</td>
                      <td class="px-4 py-3 text-right text-decor-slate">¥{{ formatMoney(item.unitPrice * quoteStore.gradeMultiplier) }}</td>
                      <td class="px-4 py-3 text-right font-semibold text-decor-charcoal">¥{{ formatMoney(getSubtotal(item)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="mb-6">
              <h3 class="font-bold text-decor-charcoal mb-3 flex items-center gap-2 pb-2 border-b border-decor-sand/30">
                <span class="w-2 h-2 rounded-full bg-pink-500"></span>
                软装配置明细
                <span class="ml-auto text-sm font-normal text-pink-600">小计：¥{{ formatMoney(quoteStore.softTotal) }}</span>
              </h3>
              <div v-if="softList.length > 0" class="overflow-hidden rounded-xl border border-decor-sand/30">
                <table class="w-full text-sm">
                  <thead class="bg-decor-cream">
                    <tr>
                      <th class="px-4 py-3 text-left font-semibold text-decor-charcoal">项目名称</th>
                      <th class="px-4 py-3 text-center font-semibold text-decor-charcoal">数量</th>
                      <th class="px-4 py-3 text-right font-semibold text-decor-charcoal">单价</th>
                      <th class="px-4 py-3 text-right font-semibold text-decor-charcoal">小计</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-decor-sand/20">
                    <tr v-for="item in softList" :key="item.itemId" class="hover:bg-decor-cream/30">
                      <td class="px-4 py-3">
                        <div class="font-medium text-decor-charcoal">{{ getQuoteItem(item.itemId)?.name }}</div>
                        <div class="text-xs text-decor-slate">{{ getQuoteItem(item.itemId)?.description }}</div>
                      </td>
                      <td class="px-4 py-3 text-center text-decor-slate">{{ item.quantity }} {{ getQuoteItem(item.itemId)?.unit }}</td>
                      <td class="px-4 py-3 text-right text-decor-slate">¥{{ formatMoney(item.unitPrice * quoteStore.gradeMultiplier) }}</td>
                      <td class="px-4 py-3 text-right font-semibold text-decor-charcoal">¥{{ formatMoney(getSubtotal(item)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center py-8 border border-dashed border-decor-sand/50 rounded-xl text-decor-slate">
                暂未选择软装项目
              </div>
            </div>
            <div class="bg-gradient-to-r from-primary-500 via-primary-600 to-decor-gold rounded-2xl p-6 text-white">
              <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div class="text-white/80 mb-1">报价总额</div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl lg:text-5xl font-bold">¥{{ formatMoney(quoteStore.totalPrice) }}</span>
                    <span class="text-xl">元</span>
                  </div>
                  <div class="text-white/70 text-sm mt-1">大写：{{ toChineseAmount(quoteStore.totalPrice) }}</div>
                </div>
                <div class="text-sm text-white/80 space-y-1">
                  <div>报价日期：{{ formatDate() }}</div>
                  <div>报价单号：QD{{ Date.now().toString().slice(-8) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-decor-sand/30 p-6 bg-decor-cream/30 flex flex-col sm:flex-row gap-3 justify-end flex-shrink-0">
            <button
              @click="closePreview"
              class="btn-secondary !py-3 px-6 order-2 sm:order-1"
            >
              返回修改
            </button>
            <button
              @click="goAppointment"
              class="btn-primary !py-3 px-6 flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              预约设计师详细报价
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockQuoteItems } from '~/config/mockData'
import type { SelectedQuoteItem } from '~/types'

const quoteStore = useQuoteStore()
const appointmentStore = useAppointmentStore()

const hardList = computed(() => quoteStore.hardItems)
const softList = computed(() => quoteStore.softItems)

function getQuoteItem(id: string) {
  return mockQuoteItems.find(q => q.id === id)
}

function getSubtotal(item: SelectedQuoteItem) {
  return item.quantity * item.unitPrice * quoteStore.gradeMultiplier
}

function formatMoney(v: number): string {
  return Math.round(v).toLocaleString()
}

function formatDate(): string {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function toChineseAmount(num: number): string {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿']
  const n = Math.round(num)
  if (n === 0) return '零元整'
  const str = n.toString()
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[i])
    const unit = units[str.length - 1 - i]
    if (digit !== 0) {
      result += digits[digit] + unit
    } else if (result && result[result.length - 1] !== '零') {
      result += '零'
    }
  }
  result = result.replace(/零+$/, '')
  return result + '元整'
}

function closePreview() {
  quoteStore.closePreview()
}

function goAppointment() {
  quoteStore.closePreview()
  appointmentStore.openModal()
}
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
  transform: scale(0.95) translateY(20px);
}
</style>
