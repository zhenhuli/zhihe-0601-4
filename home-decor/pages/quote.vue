<template>
  <div>
    <section class="relative bg-gradient-to-br from-decor-gold via-primary-500 to-primary-600 overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-decor-gold/20 rounded-full blur-3xl"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-white">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            10秒获取精准报价 · 全程免费
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">智能装修报价计算器</h1>
          <p class="text-white/80 text-lg">
            基于50万+真实项目数据，智能匹配您的户型与需求，实时生成详细报价清单，
            让装修预算一目了然，杜绝隐形消费
          </p>
        </div>
      </div>
    </section>
    <section class="py-10 lg:py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="card p-6 lg:p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-decor-charcoal">房屋信息</h2>
                  <p class="text-decor-slate text-sm">输入您的房屋基本信息</p>
                </div>
              </div>
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-decor-charcoal mb-2">
                    建筑面积 <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="localArea"
                      type="number"
                      min="10"
                      max="1000"
                      class="input-base pr-14 text-lg font-semibold"
                      @change="handleAreaChange"
                    />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-decor-slate font-medium">㎡</span>
                  </div>
                  <div class="mt-3">
                    <div class="flex gap-2 flex-wrap">
                      <button
                        v-for="preset in areaPresets"
                        :key="preset"
                        @click="setArea(preset)"
                        class="px-3 py-1.5 text-xs rounded-lg border transition-all"
                        :class="localArea === preset ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-decor-sand text-decor-slate hover:border-primary-300'"
                      >
                        {{ preset }}㎡
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-decor-charcoal mb-2">
                    装修档次 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="localGradeId"
                    class="input-base"
                    @change="handleGradeChange"
                  >
                    <option v-for="grade in mockDecorGrades" :key="grade.id" :value="grade.id">
                      {{ grade.name }}
                    </option>
                  </select>
                  <p class="mt-3 text-xs text-decor-slate flex items-start gap-1.5">
                    <svg class="w-4 h-4 flex-shrink-0 mt-0.5 text-decor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {{ currentGradeDesc }}
                  </p>
                </div>
              </div>
            </div>
            <div class="card p-6 lg:p-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-decor-charcoal">硬装项目</h2>
                    <p class="text-decor-slate text-sm">基础施工与主材部分</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-decor-slate">硬装小计</div>
                  <div class="text-lg font-bold text-blue-600">¥{{ formatMoney(quoteStore.hardTotal) }}</div>
                </div>
              </div>
              <div class="space-y-3">
                <QuoteItemRow
                  v-for="item in hardItems"
                  :key="item.id"
                  :item="item"
                  :selected="quoteStore.isSelected(item.id)"
                  :detail="quoteStore.getItemDetail(item.id)"
                  :grade-multiplier="quoteStore.gradeMultiplier"
                  @toggle="quoteStore.toggleItem(item.id)"
                  @update-quantity="(q: number) => quoteStore.updateQuantity(item.id, q)"
                  @update-price="(p: number) => quoteStore.updateUnitPrice(item.id, p)"
                />
              </div>
            </div>
            <div class="card p-6 lg:p-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-decor-charcoal">软装项目</h2>
                    <p class="text-decor-slate text-sm">家具灯饰与装饰搭配</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-decor-slate">软装小计</div>
                  <div class="text-lg font-bold text-pink-600">¥{{ formatMoney(quoteStore.softTotal) }}</div>
                </div>
              </div>
              <div class="space-y-3">
                <QuoteItemRow
                  v-for="item in softItems"
                  :key="item.id"
                  :item="item"
                  :selected="quoteStore.isSelected(item.id)"
                  :detail="quoteStore.getItemDetail(item.id)"
                  :grade-multiplier="quoteStore.gradeMultiplier"
                  @toggle="quoteStore.toggleItem(item.id)"
                  @update-quantity="(q: number) => quoteStore.updateQuantity(item.id, q)"
                  @update-price="(p: number) => quoteStore.updateUnitPrice(item.id, p)"
                />
              </div>
            </div>
          </div>
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-6">
              <div class="card overflow-hidden">
                <div class="bg-gradient-to-br from-primary-500 to-primary-600 px-6 py-5 text-white">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-white/80 text-sm">实时报价结果</span>
                    <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  </div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-3xl lg:text-4xl font-bold">¥{{ formatMoney(quoteStore.totalPrice) }}</span>
                    <span class="text-white/80">元</span>
                  </div>
                </div>
                <div class="p-6 space-y-4">
                  <div class="flex items-center justify-between py-2 border-b border-decor-sand/30">
                    <span class="text-decor-slate text-sm flex items-center gap-2">
                      <span class="w-3 h-3 rounded bg-blue-500"></span>
                      硬装费用
                    </span>
                    <span class="font-semibold">¥{{ formatMoney(quoteStore.hardTotal) }}</span>
                  </div>
                  <div class="flex items-center justify-between py-2 border-b border-decor-sand/30">
                    <span class="text-decor-slate text-sm flex items-center gap-2">
                      <span class="w-3 h-3 rounded bg-pink-500"></span>
                      软装费用
                    </span>
                    <span class="font-semibold">¥{{ formatMoney(quoteStore.softTotal) }}</span>
                  </div>
                  <div class="flex items-center justify-between py-2 border-b border-decor-sand/30">
                    <span class="text-decor-slate text-sm">平米造价</span>
                    <span class="font-semibold text-primary-600">¥{{ formatMoney(quoteStore.pricePerSquare) }}/㎡</span>
                  </div>
                  <div class="flex items-center justify-between py-2">
                    <span class="text-decor-slate text-sm">装修档次</span>
                    <span class="font-semibold">{{ quoteStore.currentGrade.name }}</span>
                  </div>
                </div>
                <div class="px-6 pb-6 space-y-3">
                  <button
                    @click="openPreview"
                    class="w-full btn-primary !py-4 flex items-center justify-center gap-2 text-base"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    生成报价清单
                  </button>
                  <button
                    @click="openAppointment"
                    class="w-full btn-secondary !py-4 flex items-center justify-center gap-2 text-base"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    预约设计师讲解
                  </button>
                  <button
                    @click="resetQuote"
                    class="w-full text-sm text-decor-slate hover:text-primary-600 py-2 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    重置所有选项
                  </button>
                </div>
              </div>
              <div class="card p-5 bg-gradient-to-br from-green-50 to-emerald-50/50 border-green-200/50">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-green-800 mb-1">报价说明</h4>
                    <ul class="text-xs text-green-700/80 space-y-1">
                      <li>• 本报价为系统参考价，最终以设计师实际量房报价为准</li>
                      <li>• 所有材料均为一线品牌，假一赔十</li>
                      <li>• 签订闭口合同，施工0增项</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <QuotePreview />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { mockDecorGrades, mockQuoteItems } from '~/config/mockData'
import { useQuoteStore } from '~/stores/quote'
import { useAppointmentStore } from '~/stores/appointment'

const quoteStore = useQuoteStore()
const appointmentStore = useAppointmentStore()
const route = useRoute()

const areaPresets = [60, 80, 100, 120, 150, 200]
const localArea = ref(100)
const localGradeId = ref('standard')

const hardItems = computed(() => mockQuoteItems.filter(i => i.category === 'hard'))
const softItems = computed(() => mockQuoteItems.filter(i => i.category === 'soft'))

const currentGradeDesc = computed(() => {
  const g = mockDecorGrades.find(g => g.id === localGradeId.value)
  return g?.description || ''
})

function formatMoney(v: number): string {
  return Math.round(v).toLocaleString()
}

function handleAreaChange() {
  if (localArea.value < 10) localArea.value = 10
  if (localArea.value > 1000) localArea.value = 1000
  quoteStore.setArea(localArea.value)
}

function setArea(val: number) {
  localArea.value = val
  quoteStore.setArea(val)
}

function handleGradeChange() {
  quoteStore.setGrade(localGradeId.value)
}

function openPreview() {
  quoteStore.openPreview()
}

function openAppointment() {
  appointmentStore.openModal()
}

function resetQuote() {
  quoteStore.reset()
  localArea.value = quoteStore.area
  localGradeId.value = quoteStore.gradeId
}

onMounted(() => {
  if (route.query.area) {
    const area = parseInt(route.query.area as string)
    if (!isNaN(area)) {
      localArea.value = area
      quoteStore.setArea(area)
    }
  } else {
    localArea.value = quoteStore.area
  }
  localGradeId.value = quoteStore.gradeId
  quoteStore.initDefaults()
})
</script>
