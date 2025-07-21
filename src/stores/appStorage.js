import { defineStore } from 'pinia'

export const useAppStorage = defineStore('app', {
  state: () => ({
    rail: JSON.parse(localStorage.getItem('rail')) ?? false
  }),
  actions: {
    toggleRail() {
      this.rail = !this.rail
      localStorage.setItem('rail', JSON.stringify(this.rail))
    },
    setRail(value) {
      this.rail = value
      localStorage.setItem('rail', JSON.stringify(value))
    }
  }
})
