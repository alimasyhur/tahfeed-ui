import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { useUserStorage } from '@/stores/userStorage'

export const useQuranStorage = defineStore('quran', () => {
  const quranJuzes = ref(null)

  const userStorage = useUserStorage()

  const getJuzes = async () => {
    try {
      const { data } = await apiService.get('/template-quran-juzes', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: {
          sortOrder: 1,
          sortField: 'constant'
        }
      })
      quranJuzes.value = data

      return data
    } catch {
      quranJuzes.value = null
    }
  }

  const getPages = async () => {
    try {
      const { data } = await apiService.get('/template-quran-pages', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: {
          sortOrder: 1,
          sortField: 'constant'
        }
      })
      quranJuzes.value = data

      return data
    } catch {
      quranJuzes.value = null
    }
  }

  return {
    getJuzes,
    getPages
  }
})
