import { defineStore } from 'pinia'
import type { AppointmentRecord } from '~/types'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    isModalOpen: false,
    isSuccessOpen: false,
    records: [] as AppointmentRecord[],
    successRecord: null as AppointmentRecord | null
  }),
  actions: {
    openModal() {
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
    },
    openSuccess(record: AppointmentRecord) {
      this.successRecord = record
      this.isSuccessOpen = true
    },
    closeSuccess() {
      this.isSuccessOpen = false
      this.successRecord = null
    },
    addRecord(record: Omit<AppointmentRecord, 'id' | 'createdAt' | 'status'>) {
      const newRecord: AppointmentRecord = {
        ...record,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
      this.records.unshift(newRecord)
      this.saveToLocal()
      return newRecord
    },
    loadFromLocal() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('appointment_records')
        if (saved) {
          try {
            this.records = JSON.parse(saved)
          } catch (e) {
            console.error('Failed to parse appointment records')
          }
        }
      }
    },
    saveToLocal() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('appointment_records', JSON.stringify(this.records))
      }
    }
  }
})
