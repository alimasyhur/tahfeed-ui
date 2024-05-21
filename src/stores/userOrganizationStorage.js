import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { useUserStorage } from '@/stores/userStorage'

export const useUserOrganizationStorage = defineStore('users_orgs', () => {
  const users = ref(null)

  const userStorage = useUserStorage()

  const getUserOrganizations = async (params) => {
    try {
      const { data } = await apiService.get('/roles/users', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: {
          filter: { org_uuid: params.org_uuid }
        }
      })
      users.value = data

      return data
    } catch {
      users.value = null
    }
  }

  const addAdminUserOrganization = async (inputUserOrg) => {
    try {
      const { data } = await apiService.post(
        `/roles/users`,
        {
          email: inputUserOrg.email,
          user_name: inputUserOrg.user_name,
          password: inputUserOrg.password,
          org_uuid: inputUserOrg.org_uuid,
          role_uuid: inputUserOrg.role_uuid,
          is_active: inputUserOrg.is_active,
          is_confirmed: inputUserOrg.is_confirmed
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

  const editAdminUserOrganization = async (inputUserOrg) => {
    try {
      const { data } = await apiService.patch(
        `/roles/users/${inputUserOrg.uuid}`,
        {
          user_name: inputUserOrg.user_name,
          email: inputUserOrg.email,
          role_uuid: inputUserOrg.role_uuid,
          is_active: inputUserOrg.is_active,
          is_confirmed: inputUserOrg.is_confirmed
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

  const adminAssignUserRoleOrganization = async (inputUserOrg) => {
    try {
      const { data } = await apiService.post(
        `/roles/assign`,
        {
          user_uuid: inputUserOrg.user_uuid,
          org_uuid: inputUserOrg.org_uuid,
          role_uuid: inputUserOrg.role_uuid
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

  const getUserOrganizationOptions = async (params) => {
    try {
      const { data } = await apiService.get('/roles/users/options', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: {
          filter: { org_uuid: params.org_uuid }
        }
      })
      users.value = data

      return data
    } catch {
      users.value = null
    }
  }

  return {
    getUserOrganizations,
    getUserOrganizationOptions,
    users,
    editAdminUserOrganization,
    addAdminUserOrganization,
    adminAssignUserRoleOrganization
  }
})
