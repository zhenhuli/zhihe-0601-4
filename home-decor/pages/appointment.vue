<template>
  <div>
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-500 to-decor-gold overflow-hidden">
      <div class="absolute inset-0">
        <svg class="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="85" cy="15" r="20" fill="white"/>
          <circle cx="15" cy="85" r="25" fill="white"/>
        </svg>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center text-white">
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          预约即送2000元装修基金
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">预约专业设计师</h1>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          200+资深设计师一对一服务，免费量房、免费设计方案、免费报价，
          专业团队为您打造梦想之家
        </p>
      </div>
    </section>
    <section class="py-12 lg:py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-5 gap-8">
          <div class="lg:col-span-3">
            <div class="card p-6 lg:p-8">
              <div class="flex items-center gap-3 mb-8">
                <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-decor-charcoal">填写预约信息</h2>
                  <p class="text-decor-slate text-sm">我们将在24小时内与您联系</p>
                </div>
              </div>
              <form @submit.prevent="handleSubmit" class="space-y-5">
                <div class="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-medium text-decor-charcoal mb-2">
                      您的姓名 <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      class="input-base"
                      placeholder="请输入您的称呼"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-decor-charcoal mb-2">
                      手机号码 <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      class="input-base"
                      placeholder="请输入11位手机号"
                      pattern="[0-9]{11}"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-decor-charcoal mb-2">
                    所在小区 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.community"
                    type="text"
                    class="input-base"
                    placeholder="请输入楼盘/小区名称"
                    required
                  />
                </div>
                <div class="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-medium text-decor-charcoal mb-2">
                      房屋面积
                    </label>
                    <div class="relative">
                      <input
                        v-model.number="form.area"
                        type="number"
                        min="10"
                        class="input-base pr-12"
                        placeholder="请输入建筑面积"
                      />
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-decor-slate">㎡</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-decor-charcoal mb-2">
                      户型结构
                    </label>
                    <select v-model="form.layout" class="input-base">
                      <option value="">请选择户型</option>
                      <option v-for="opt in LAYOUT_OPTIONS.filter(o => o.value)" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-decor-charcoal mb-2">
                    装修风格偏好
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="opt in STYLE_OPTIONS.filter(o => o.value)"
                      :key="opt.value"
                      type="button"
                      @click="toggleStyle(opt.value)"
                      class="chip"
                      :class="form.styles.includes(opt.value) ? 'chip-active' : 'chip-inactive'"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-decor-charcoal mb-2">
                    备注说明
                  </label>
                  <textarea
                    v-model="form.remark"
                    class="input-base min-h-[100px] resize-none"
                    placeholder="您有什么特殊需求或想咨询的问题，可以在这里告诉我们..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="w-full btn-primary !py-4 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <svg v-if="submitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ submitting ? '提交中...' : '立即提交预约' }}
                </button>
                <p class="text-center text-xs text-decor-slate">
                  提交即表示您同意
                  <a href="#" class="text-primary-600 hover:underline">《服务协议》</a>
                  与
                  <a href="#" class="text-primary-600 hover:underline">《隐私政策》</a>
                </p>
              </form>
            </div>
          </div>
          <div class="lg:col-span-2 space-y-6">
            <div class="card p-6 bg-gradient-to-br from-primary-50 to-decor-gold/10">
              <h3 class="font-bold text-decor-charcoal mb-5 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
                预约专享福利
              </h3>
              <div class="space-y-4">
                <div v-for="(b, i) in benefits" :key="i" class="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-decor-gold flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                    {{ i + 1 }}
                  </div>
                  <div>
                    <h4 class="font-semibold text-decor-charcoal text-sm">{{ b.title }}</h4>
                    <p class="text-xs text-decor-slate mt-0.5">{{ b.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="card p-6">
              <h3 class="font-bold text-decor-charcoal mb-5 flex items-center gap-2">
                <svg class="w-5 h-5 text-decor-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                我的预约记录
                <span class="ml-auto text-sm font-normal text-decor-slate">共 {{ appointmentStore.records.length }} 条</span>
              </h3>
              <div v-if="appointmentStore.records.length > 0" class="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide -mr-2 pr-2">
                <div
                  v-for="r in appointmentStore.records.slice(0, 10)"
                  :key="r.id"
                  class="p-4 bg-decor-cream/50 rounded-xl border border-decor-sand/30"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold text-decor-charcoal">{{ r.name }}</span>
                    <span
                      class="px-2 py-0.5 text-xs rounded-full font-medium"
                      :class="{
                        'bg-yellow-100 text-yellow-700': r.status === 'pending',
                        'bg-green-100 text-green-700': r.status === 'confirmed',
                        'bg-blue-100 text-blue-700': r.status === 'completed'
                      }"
                    >
                      {{ statusLabel(r.status) }}
                    </span>
                  </div>
                  <div class="text-sm text-decor-slate space-y-1">
                    <div class="flex items-center gap-2">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      {{ r.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {{ r.community }}
                      <span v-if="r.area" class="text-primary-600">· {{ r.area }}㎡</span>
                    </div>
                    <div class="text-xs text-decor-slate/70 pt-1">
                      提交时间：{{ formatDate(r.createdAt) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10">
                <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-decor-sand/20 flex items-center justify-center">
                  <svg class="w-8 h-8 text-decor-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <p class="text-decor-slate text-sm">暂无预约记录</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-12 bg-gradient-to-br from-decor-olive/10 via-primary-50/50 to-decor-gold/10">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h2 class="section-title !mb-2">服务流程</h2>
          <p class="section-subtitle !mb-0">专业团队 · 标准化服务 · 全程无忧</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          <div v-for="(s, i) in steps" :key="i" class="text-center relative">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center text-2xl relative z-10">
              {{ s.icon }}
            </div>
            <div v-if="i < steps.length - 1" class="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-decor-sand -z-0"></div>
            <div class="bg-white rounded-xl p-4 shadow-sm">
              <div class="text-xs text-primary-600 font-semibold mb-1">Step {{ i + 1 }}</div>
              <h4 class="font-semibold text-decor-charcoal mb-1">{{ s.title }}</h4>
              <p class="text-xs text-decor-slate">{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { STYLE_OPTIONS, LAYOUT_OPTIONS } from '~/types'

const appointmentStore = useAppointmentStore()

const submitting = ref(false)

const form = reactive({
  name: '',
  phone: '',
  community: '',
  area: undefined as number | undefined,
  layout: '',
  styles: [] as string[],
  remark: ''
})

const benefits = [
  { title: '免费量房验房', desc: '专业设计师上门免费量房' },
  { title: '3套设计方案PK', desc: '3位设计师同时出方案供您选择' },
  { title: '精准报价清单', desc: '详细材料明细+人工费用报价' },
  { title: '2000元装修基金', desc: '签约可抵扣合同款2000元' }
]

const steps = [
  { icon: '📞', title: '电话预约', desc: '客服确认需求安排设计师' },
  { icon: '🏠', title: '上门量房', desc: '免费量房+户型分析' },
  { icon: '📐', title: '设计方案', desc: '3套方案+报价供您选择' },
  { icon: '✍️', title: '签订合同', desc: '闭口合同杜绝增项' },
  { icon: '🎉', title: '开工大吉', desc: '专属管家全程服务' }
]

function toggleStyle(val: string) {
  const idx = form.styles.indexOf(val)
  if (idx > -1) {
    form.styles.splice(idx, 1)
  } else {
    form.styles.push(val)
  }
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成'
  }
  return map[s] || s
}

function formatDate(d: string): string {
  const date = new Date(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

async function handleSubmit() {
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    alert('请输入正确的手机号码')
    return
  }
  submitting.value = true
  await new Promise(r => setTimeout(r, 800))
  const record = appointmentStore.addRecord({
    name: form.name,
    phone: form.phone,
    community: form.community,
    area: form.area
  })
  submitting.value = false
  form.name = ''
  form.phone = ''
  form.community = ''
  form.area = undefined
  form.layout = ''
  form.styles = []
  form.remark = ''
  appointmentStore.openSuccess(record)
}

onMounted(() => {
  appointmentStore.loadFromLocal()
})
</script>
