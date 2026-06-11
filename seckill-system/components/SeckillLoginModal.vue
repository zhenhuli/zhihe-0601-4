<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="userStore.showLoginModal"
        class="mask-layer"
        @click.self="handleClose"
      >
        <div class="modal-container">
          <div class="p-6">
            <div class="text-center mb-6">
              <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-seckill-red to-primary-600 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">登录参与秒杀</h3>
              <p class="text-sm text-gray-500 mt-1">登录后可参与抢购，查看订单记录</p>
            </div>
            
            <form @submit.prevent="handleLogin" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                <input 
                  v-model="phone"
                  type="tel"
                  placeholder="请输入手机号"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-seckill-red focus:border-seckill-red outline-none transition-all"
                  :class="{ 'border-red-500': phoneError }"
                />
                <p v-if="phoneError" class="text-red-500 text-xs mt-1">{{ phoneError }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input 
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-seckill-red focus:border-seckill-red outline-none transition-all pr-12"
                  :class="{ 'border-red-500': passwordError }"
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%);"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
                <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
              </div>
              
              <button 
                type="submit"
                class="w-full seckill-btn-primary"
                :disabled="userStore.loading"
              >
                <span v-if="userStore.loading">登录中...</span>
                <span v-else>登 录</span>
              </button>
            </form>
            
            <div class="mt-4 text-center">
              <button 
                @click="handleQuickLogin"
                class="text-sm text-seckill-red hover:underline"
                :disabled="userStore.loading"
              >
                一键快速登录（体验用）
              </button>
            </div>
            
            <div class="mt-6 flex items-center gap-4">
              <div class="flex-1 h-px bg-gray-200"></div>
              <span class="text-xs text-gray-400">其他登录方式</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            
            <div class="mt-4 flex justify-center gap-6">
              <button class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:opacity-90 transition-opacity">
                <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.598-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.007-.264-.03-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
              </button>
              <button class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center hover:opacity-90 transition-opacity">
                <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"/>
                </svg>
              </button>
            </div>
            
            <button 
              @click="handleClose"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              style="position: absolute; top: 16px; right: 16px;"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const userStore = useUserStore()

const phone = ref('')
const password = ref('')
const showPassword = ref(false)
const phoneError = ref('')
const passwordError = ref('')

const validatePhone = () => {
  if (!phone.value) {
    phoneError.value = '请输入手机号'
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    phoneError.value = '请输入正确的手机号'
    return false
  }
  phoneError.value = ''
  return true
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = '请输入密码'
    return false
  }
  if (password.value.length < 6) {
    passwordError.value = '密码长度不能少于6位'
    return false
  }
  passwordError.value = ''
  return true
}

const handleLogin = async () => {
  const phoneValid = validatePhone()
  const passwordValid = validatePassword()
  
  if (!phoneValid || !passwordValid) return
  
  await userStore.login(phone.value, password.value)
}

const handleQuickLogin = async () => {
  await userStore.quickLogin()
}

const handleClose = () => {
  userStore.closeLoginModal()
}

watch(() => userStore.showLoginModal, (visible) => {
  if (visible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    phone.value = ''
    password.value = ''
    phoneError.value = ''
    passwordError.value = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
