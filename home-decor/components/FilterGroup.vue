<template>
  <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
    <div class="sm:w-24 flex-shrink-0 text-sm font-medium text-decor-charcoal flex items-center gap-2">
      <span>{{ label }}</span>
    </div>
    <div class="flex flex-wrap gap-2 sm:gap-2.5">
      <button
        v-for="opt in options"
        :key="opt.value"
        @click="handleSelect(opt.value)"
        class="chip"
        :class="modelValue === opt.value ? 'chip-active' : 'chip-inactive'"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FilterOption {
  value: string
  label: string
}

defineProps<{
  label: string
  options: FilterOption[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

function handleSelect(value: string) {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
