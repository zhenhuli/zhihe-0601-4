import { defineStore } from 'pinia'
import type { FilterState } from '~/types'

export const useFilterStore = defineStore('filter', {
  state: () => ({
    filters: {
      style: '',
      areaRange: '',
      priceRange: '',
      layout: ''
    } as FilterState
  }),
  actions: {
    setFilters(filters: Partial<FilterState>) {
      this.filters = { ...this.filters, ...filters }
    },
    setFilter(key: keyof FilterState, value: string) {
      this.filters[key] = value
    },
    reset() {
      this.filters = {
        style: '',
        areaRange: '',
        priceRange: '',
        layout: ''
      }
    },
    isActive(): boolean {
      return Object.values(this.filters).some(v => v !== '')
    }
  }
})
