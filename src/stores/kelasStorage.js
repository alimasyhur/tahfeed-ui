import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'

export const useKelasStorage = defineStore('kelas', () => {
  const kelases = ref(null)

  const userStorage = useUserStorage()

  const getKelases = async (filterKelas) => {
    try {
      const { data } = await apiService.get('/kelases', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: filterKelas
      })

      const kelasData = data.data

      kelases.value = kelasData
      return data
    } catch {
      kelases.value = null
    }
  }

  const removeKelas = async (inputRole) => {
    try {
      const { data } = await apiService.delete(`/kelases/${inputRole.uuid}`, {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        }
      })

      getKelases()
      return data
    } catch (error) {
      let errMessage = error.response.data.message
      if (Array.isArray(errMessage)) {
        errMessage = error.response.data.message[0].name
      }
      return {
        status: error.response.data.status,
        message: errMessage
      }
    }
  }

  const addKelas = async (inputRole) => {
    try {
      const { data } = await apiService.post(
        `kelases`,
        {
          name: inputRole.name,
          description: inputRole.description,
          org_uuid: inputRole.org_uuid,
          period: inputRole.period,
          grade_uuid: inputRole.grade_uuid,
          teacher_uuid: inputRole.teacher_uuid
        },
        {
          headers: {
            Authorization: `Bearer ${userStorage.accessToken}`
          }
        }
      )

      return data
    } catch (error) {
      let errMessage = error.response.data.message
      if (Array.isArray(errMessage)) {
        errMessage = error.response.data.message[0].name
      }

      return {
        status: error.response.data.status,
        message: errMessage
      }
    }
  }

  const editKelas = async (inputKelas) => {
    try {
      const { data } = await apiService.patch(
        `kelases/${inputKelas.uuid}`,
        {
          name: inputKelas.name,
          description: inputKelas.description,
          org_uuid: inputKelas.org_uuid,
          period: inputKelas.period,
          grade_uuid: inputKelas.grade_uuid,
          teacher_uuid: inputKelas.teacher_uuid
        },
        {
          headers: {
            Authorization: `Bearer ${userStorage.accessToken}`
          }
        }
      )

      return data
    } catch (error) {
      let errMessage = error.response.data.message
      if (Array.isArray(errMessage)) {
        errMessage = error.response.data.message[0].name
      }

      return {
        status: error.response.data.status,
        message: errMessage
      }
    }
  }

  const showKelasByUUID = async (uuid) => {
    try {
      const { data } = await apiService.get(`/kelases/${uuid}`, {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        }
      })

      return data
    } catch (error) {
      let errMessage = error.response.data.message
      if (Array.isArray(errMessage)) {
        errMessage = error.response.data.message[0].name
      }

      return {
        status: error.response.data.status,
        message: errMessage
      }
    }
  }

  return {
    kelases,
    getKelases,
    removeKelas,
    addKelas,
    editKelas,
    showKelasByUUID
  }
})
