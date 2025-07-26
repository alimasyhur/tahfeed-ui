import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'

export const useGradeStorage = defineStore('grade', () => {
  const grades = ref(null)

  const userStorage = useUserStorage()

  const getGrades = async (filterGrade) => {
    try {
      const { data } = await apiService.get('/grades', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: filterGrade
      })

      const gradeData = data.data

      grades.value = gradeData
      return data
    } catch {
      grades.value = null
    }
  }

  const removeGrade = async (inputRole) => {
    try {
      const { data } = await apiService.delete(`/grades/${inputRole.uuid}`, {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        }
      })

      getGrades()
      return data
    } catch (error) {
      let errMessage = error?.response?.data?.message ?? 'Internal Server Error'
      if (Array.isArray(errMessage)) {
        errMessage = error.response.data.message[0].name
      }
      return {
        status: error?.response?.data?.status ?? 500,
        message: errMessage
      }
    }
  }

  const addGrade = async (inputRole) => {
    try {
      const orgUUID = userStorage.activeRole.org_uuid
      const { data } = await apiService.post(
        `grades`,
        {
          name: inputRole.name,
          description: inputRole.description,
          org_uuid: orgUUID,
          period: inputRole.period
        },
        {
          headers: {
            Authorization: `Bearer ${userStorage.accessToken}`
          }
        }
      )

      return data
    } catch (error) {
      let errMessage = error?.response?.data?.message ?? 'Internal Server Error'
      if (Array.isArray(errMessage)) {
        errMessage = error.response.data.message[0].name
      }

      return {
        status: error?.response?.data?.status ?? 500,
        message: errMessage
      }
    }
  }

  const editGrade = async (inputGrade) => {
    try {
      const { data } = await apiService.patch(
        `grades/${inputGrade.uuid}`,
        {
          name: inputGrade.name,
          description: inputGrade.description,
          org_uuid: inputGrade.org_uuid,
          period: inputGrade.period
        },
        {
          headers: {
            Authorization: `Bearer ${userStorage.accessToken}`
          }
        }
      )

      return data
    } catch (error) {
      let errMessage = error?.response?.data?.message ?? 'Internal Server Error'
      if (Array.isArray(errMessage)) {
        errMessage = error.response.data.message[0].name
      }

      return {
        status: error?.response?.data?.status ?? 500,
        message: errMessage
      }
    }
  }

  return {
    grades,
    getGrades,
    removeGrade,
    addGrade,
    editGrade
  }
})
