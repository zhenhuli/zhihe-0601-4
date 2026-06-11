import { defineStore } from 'pinia'
import type { SelectedQuoteItem } from '~/types'
import { mockQuoteItems, mockDecorGrades } from '~/config/mockData'

export const useQuoteStore = defineStore('quote', {
  state: () => ({
    area: 100,
    gradeId: 'standard',
    selectedItems: [] as SelectedQuoteItem[],
    isPreviewOpen: false
  }),
  getters: {
    currentGrade(state) {
      return mockDecorGrades.find(g => g.id === state.gradeId) || mockDecorGrades[1]
    },
    gradeMultiplier(): number {
      return this.currentGrade.multiplier
    },
    totalPrice(state): number {
      const multiplier = this.gradeMultiplier
      return state.selectedItems.reduce((sum, item) => {
        return sum + item.quantity * item.unitPrice * multiplier
      }, 0)
    },
    hardItems(state) {
      return state.selectedItems.filter(si => {
        const item = mockQuoteItems.find(qi => qi.id === si.itemId)
        return item?.category === 'hard'
      })
    },
    softItems(state) {
      return state.selectedItems.filter(si => {
        const item = mockQuoteItems.find(qi => qi.id === si.itemId)
        return item?.category === 'soft'
      })
    },
    hardTotal(): number {
      const multiplier = this.gradeMultiplier
      return this.hardItems.reduce((sum, item) => sum + item.quantity * item.unitPrice * multiplier, 0)
    },
    softTotal(): number {
      const multiplier = this.gradeMultiplier
      return this.softItems.reduce((sum, item) => sum + item.quantity * item.unitPrice * multiplier, 0)
    },
    pricePerSquare(): number {
      return this.totalPrice > 0 && this.area > 0 ? this.totalPrice / this.area : 0
    }
  },
  actions: {
    initDefaults() {
      if (this.selectedItems.length === 0) {
        this.selectedItems = mockQuoteItems
          .filter(item => item.defaultSelected)
          .map(item => ({
            itemId: item.id,
            quantity: this.getDefaultQuantity(item.id),
            unitPrice: item.basePrice
          }))
      }
    },
    getDefaultQuantity(itemId: string): number {
      const area = this.area || 100
      const defaults: Record<string, number> = {
        floor: area,
        wall: area * 3,
        ceiling: area * 0.6,
        door: Math.ceil(area / 30),
        window: Math.ceil(area / 40),
        kitchen_cabinet: Math.max(3, Math.round(area / 25)),
        kitchen_appliance: 1,
        bathroom_set: Math.max(1, Math.ceil(area / 80)),
        waterproof: Math.max(12, Math.round(area * 0.3)),
        plumbing: area,
        heating: area,
        wardrobe: Math.max(10, Math.round(area * 0.25)),
        sofa: 1,
        dining: 1,
        bed: Math.max(1, Math.ceil(area / 50)),
        tv_stand: 1,
        curtain: 1,
        lighting: 1,
        decoration: 1,
        carpet: 1,
        smart_home: 1
      }
      return defaults[itemId] || 1
    },
    setArea(area: number) {
      const oldArea = this.area
      this.area = area
      const ratio = area / oldArea
      this.selectedItems = this.selectedItems.map(item => {
        const quoteItem = mockQuoteItems.find(qi => qi.id === item.itemId)
        if (quoteItem && quoteItem.unit === '㎡') {
          return {
            ...item,
            quantity: Math.max(1, Math.round(item.quantity * ratio))
          }
        }
        return item
      })
    },
    setGrade(gradeId: string) {
      this.gradeId = gradeId
    },
    toggleItem(itemId: string) {
      const quoteItem = mockQuoteItems.find(qi => qi.id === itemId)
      if (!quoteItem) return
      const existing = this.selectedItems.find(si => si.itemId === itemId)
      if (existing) {
        if (!quoteItem.required) {
          this.selectedItems = this.selectedItems.filter(si => si.itemId !== itemId)
        }
      } else {
        this.selectedItems.push({
          itemId,
          quantity: this.getDefaultQuantity(itemId),
          unitPrice: quoteItem.basePrice
        })
      }
    },
    isSelected(itemId: string): boolean {
      return this.selectedItems.some(si => si.itemId === itemId)
    },
    updateQuantity(itemId: string, quantity: number) {
      this.selectedItems = this.selectedItems.map(item => {
        if (item.itemId === itemId) {
          return { ...item, quantity: Math.max(0.5, quantity) }
        }
        return item
      })
    },
    updateUnitPrice(itemId: string, unitPrice: number) {
      this.selectedItems = this.selectedItems.map(item => {
        if (item.itemId === itemId) {
          return { ...item, unitPrice: Math.max(0, unitPrice) }
        }
        return item
      })
    },
    getItemDetail(itemId: string) {
      const quoteItem = mockQuoteItems.find(qi => qi.id === itemId)
      const selected = this.selectedItems.find(si => si.itemId === itemId)
      if (!quoteItem || !selected) return null
      return {
        ...quoteItem,
        quantity: selected.quantity,
        unitPrice: selected.unitPrice,
        subtotal: selected.quantity * selected.unitPrice * this.gradeMultiplier
      }
    },
    openPreview() {
      this.isPreviewOpen = true
    },
    closePreview() {
      this.isPreviewOpen = false
    },
    reset() {
      this.area = 100
      this.gradeId = 'standard'
      this.selectedItems = []
      this.initDefaults()
    }
  }
})
