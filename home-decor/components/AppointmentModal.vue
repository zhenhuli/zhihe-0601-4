<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="appointmentStore.isModalOpen"
        class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
        @click.self="closeModal"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-scale-in my-auto max-h-[90vh] flex flex-col overflow-hidden">
          <div class="bg-gradient-to-r from-primary-500 to-decor-gold px-6 py-6 sm:px-8 text-white flex-shrink-0">
            <button
              @click="closeModal"
              class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div class="flex items-center gap-4 mb-2">
              <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold">免费预约设计</h2>
                <p class="text-white/80 text-sm mt-1">专业设计师1对1服务，量身定制方案</p>
              </div>
            </div>
          </div>
          <form @submit.prevent="handleSubmit" class="p-6 sm:p-8 space-y-5 flex-1 overflow-y-auto">
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="text-center p-3 bg-primary-50 rounded-xl">
                <div class="w-10 h-10 mx-auto rounded-full bg-primary-500 text-white flex items-center justify-center mb-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="text-xs text-decor-slate">24小时</div>
                <div class="text-sm font-semibold text-decor-charcoal">快速响应</div>
              </div>
              <div class="text-center p-3 bg-primary-50 rounded-xl">
                <div class="w-10 h-10 mx-auto rounded-full bg-primary-500 text-white flex items-center justify-center mb-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div class="text-xs text-decor-slate">3位设计师</div>
                <div class="text-sm font-semibold text-decor-charcoal">方案PK</div>
              </div>
              <div class="text-center p-3 bg-primary-50 rounded-xl">
                <div class="w-10 h-10 mx-auto rounded-full bg-primary-500 text-white flex items-center justify-center mb-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="text-xs text-decor-slate">到店即送</div>
                <div class="text-sm font-semibold text-decor-charcoal">设计费减免</div>
              </div>
            </div>
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
            <div>
              <label class="block text-sm font-medium text-decor-charcoal mb-2">
                所在小区 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.community"
                type="text"
                class="input-base"
                placeholder="如：万科城·翡翠郡"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-decor-charcoal mb-2">
                房屋面积 <span class="text-decor-slate text-xs font-normal">（选填，㎡）</span>
              </label>
              <input
                v-model.number="form.area"
                type="number"
                min="1"
                class="input-base"
                placeholder="请输入房屋建筑面积"
              />
            </div>
            <button
              type="submit"
              :disabled="submitting"
              class="w-full btn-primary !py-4 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg v-if="submitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? '提交中...' : '立即预约免费设计' }}
            </button>
            <p class="text-center text-xs text-decor-slate">
              提交即表示同意
              <a href="#" class="text-primary-600 hover:underline">《隐私政策》</a>
              ，我们承诺保护您的个人信息
            </p>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useAppointmentStore } from '~/stores/appointment'

const appointmentStore = useAppointmentStore()

const form = reactive({
  name: '',
  phone: '',
  community: '',
  area: undefined as number | undefined
})

const submitting = ref(false)

function closeModal() {
  appointmentStore.closeModal()
}

async function handleSubmit() {
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    alert('请输入正确的手机号码')
    return
  }
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
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
  closeModal()
  appointmentStore.openSuccess(record)
}

watch(() => appointmentStore.isModalOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
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
  transform: scale(0.9) translateY(20px);
}
</style>
