import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { useRouter } from 'vue-router'
import { useUserStorage } from '@/stores/userStorage'

export const useOrganizationStorage = defineStore('organization', () => {
  const router = useRouter()

  const dialogOrganization = ref(false)
  const loading = ref(false)
  const me = ref()
  const alertMessage = ref('Terjadi Kesalahan')
  const hasAlert = ref(false)
  const alertType = ref(null)

  const userStorage = useUserStorage()

  const closeDialogOrganization = () => {
    dialogOrganization.value = false
    hasAlert.value = false
    alertMessage.value = null
    alertType.value = 'error'
  }

  const addOrganization = async (inputOrganization) => {
    dialogOrganization.value = true
    loading.value = true
    try {
      const { data } = await apiService.post(
        '/orgs',
        {
          name: inputOrganization.name,
          domain: inputOrganization.domain,
          bio: inputOrganization.bio,
          address: inputOrganization.address,
          email: inputOrganization.email,
          phone: inputOrganization.phone
        },
        {
          headers: {
            Authorization: `Bearer ${userStorage.accessToken}`
          }
        }
      )

      hasAlert.value = true
      alertType.value = 'success'
      alertMessage.value = data.message

      userStorage.dataUser()

      setTimeout(() => {
        closeDialogOrganization()
      }, 500)
      router.push({ name: 'profile' })
    } catch (error) {
      let errMessage = error.response.data.message
      if (Array.isArray(errMessage)) {
        errMessage = error.response.data.message[0].name
      }
      hasAlert.value = true
      alertMessage.value = errMessage
      alertType.value = 'warning'
    }

    loading.value = false
  }

  const editOrganization = async (inputOrganization) => {
    dialogOrganization.value = true
    loading.value = true
    try {
      const { data } = await apiService.patch(
        '/orgs',
        {
          name: inputOrganization.name,
          domain: inputOrganization.domain,
          bio: inputOrganization.bio,
          address: inputOrganization.address,
          email: inputOrganization.email,
          phone: inputOrganization.phone
        },
        {
          headers: {
            Authorization: `Bearer ${userStorage.accessToken}`
          }
        }
      )

      hasAlert.value = true
      alertType.value = 'success'
      alertMessage.value = data.message

      userStorage.dataUser()

      setTimeout(() => {
        closeDialogOrganization()
      }, 500)
      router.push({ name: 'profile' })
    } catch (error) {
      let errMessage = error.response.data.message
      if (Array.isArray(errMessage)) {
        errMessage = error.response.data.message[0].name
      }
      hasAlert.value = true
      alertMessage.value = errMessage
      alertType.value = 'warning'
    }

    loading.value = false
  }

  return {
    loading,
    me,
    alertMessage,
    hasAlert,
    alertType,
    dialogOrganization,
    addOrganization,
    editOrganization,
    closeDialogOrganization
  }
})
