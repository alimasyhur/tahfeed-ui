import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'

export const useRoleStorage = defineStore('role', () => {
  const roles = ref(null)

  const userStorage = useUserStorage()

  const getRoles = async (filterRole) => {
    try {
      const { data } = await apiService.get('/roles', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: filterRole
      })

      const roleData = data.data

      roles.value = roleData
      return data
    } catch {
      roles.value = null
    }
  }

  const removeRole = async (inputRole) => {
    try {
      const { data } = await apiService.delete(`/roles/${inputRole.uuid}`, {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        }
      })

      getRoles()
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

  const addRole = async (inputRole) => {
    try {
      const { data } = await apiService.post(
        `roles`,
        {
          name: inputRole.name
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

  const editRole = async (inputRole) => {
    try {
      const { data } = await apiService.patch(
        `roles/${inputRole.uuid}`,
        {
          name: inputRole.name
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

  return { roles, getRoles, addRole, removeRole, editRole }
})
