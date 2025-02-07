import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'

export const useSummaryStorage = defineStore('summary', () => {
  const achievements = ref(null)

  const userStorage = useUserStorage()

  const getAchievement = async (params) => {
    try {
      const { data } = await apiService.get('/achievements', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params
      })

      const reportData = data.data

      achievements.value = reportData
      return data
    } catch {
      achievements.value = null
    }
  }

  return {
    achievements,
    getAchievement
  }
})
