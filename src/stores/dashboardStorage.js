import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'

export const useDashboardStorage = defineStore('dashboard', () => {
  const dashboards = ref(null)

  const userStorage = useUserStorage()

  const getDashboard = async (filterDashboard) => {
    try {
      const { data } = await apiService.get('/dashboards', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: filterDashboard
      })

      const dashboardData = data.data

      dashboards.value = dashboardData
      return data
    } catch (error) {
      dashboards.value = null
    }
  }

  return { dashboards, getDashboard }
})
