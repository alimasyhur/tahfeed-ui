import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { useRouter } from 'vue-router'

export const useUserStorage = defineStore('user', () => {
  const router = useRouter()

  const accessToken = ref(
    localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null
  )

  const currentUser = ref(
    localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null
  )

  const activeRole = ref(
    localStorage.getItem('activeRole') ? JSON.parse(localStorage.getItem('activeRole')) : null
  )

  const isSuperAdmin = ref(() => {
    const activeRole = localStorage.getItem('activeRole')
      ? JSON.parse(localStorage.getItem('activeRole'))
      : null

    return activeRole?.constant_value === 1
  })

  const isSuperAdminOrAdmin = ref(() => {
    const activeRole = localStorage.getItem('activeRole')
      ? JSON.parse(localStorage.getItem('activeRole'))
      : null

    return [1, 2].includes(activeRole?.constant_value)
  })

  const dialog = ref(false)
  const dialogProfile = ref(false)
  const loading = ref(false)
  const me = ref(
    localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null
  )
  const selectedRole = ref(localStorage.getItem('selectedRole') ?? 0)
  const users = ref(null)
  const alertMessage = ref('Terjadi Kesalahan')
  const hasAlert = ref(false)
  const alertType = ref(null)

  const closeDialog = () => {
    dialog.value = false
    hasAlert.value = false
    alertMessage.value = null
    alertType.value = 'error'
  }

  const closeDialogProfile = () => {
    dialogProfile.value = false
    hasAlert.value = false
    alertMessage.value = null
    alertType.value = 'error'
  }

  const loginUser = async (inputUser) => {
    hasAlert.value = false
    loading.value = true
    try {
      const { data } = await apiService.post('/auth/login', {
        email: inputUser.email,
        password: inputUser.password
      })

      accessToken.value = data.access_token
      localStorage.setItem('access_token', accessToken.value)

      console.log('login response: ', accessToken.value)

      hasAlert.value = true
      alertType.value = 'success'
      alertMessage.value = data.message

      console.log('calling dataUser: ')
      await dataUser()

      setTimeout(() => {
        closeDialog()
      }, 500)

      router.push({ name: 'dashboard' })
    } catch (error) {
      const errMessage = error?.response?.data?.message ?? 'Terjadi Kesalahan'
      hasAlert.value = true
      alertMessage.value = errMessage
      alertType.value = 'warning'
    }

    loading.value = false
  }

  const logoutUser = async () => {
    try {
      if (accessToken.value !== null) {
        await apiService.post(
          '/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        )
      }

      accessToken.value = null
      currentUser.value = null
      me.value = null
      activeRole.value = null
      localStorage.setItem('access_token', null)
      localStorage.setItem('profile', null)
      localStorage.setItem('activeRole', null)
    } catch (error) {
      accessToken.value = null
      currentUser.value = null
      me.value = null
      localStorage.setItem('access_token', null)
      localStorage.setItem('profile', null)
      localStorage.setItem('activeRole', null)
    }

    router.push({ name: 'home' })
  }

  const registerUser = async (inputUser) => {
    hasAlert.value = false
    loading.value = true
    try {
      const { data } = await apiService.post('/auth/register', {
        name: inputUser.name,
        email: inputUser.email,
        password: inputUser.password
      })

      hasAlert.value = true
      alertType.value = 'success'
      alertMessage.value = `${data.message}. Silakan Login ke Akun Anda`

      setTimeout(() => {
        closeDialog()
      }, 2000)
      router.push({ name: 'home' })
    } catch (error) {
      hasAlert.value = true
      alertMessage.value = error.response.data.message
      alertType.value = 'warning'
    }

    loading.value = false
  }

  const addProfile = async (inputProfile) => {
    dialogProfile.value = true
    loading.value = true
    try {
      const { data } = await apiService.post(
        '/users/profile',
        {
          firstname: inputProfile.firstname,
          lastname: inputProfile.lastname,
          birthdate: inputProfile.birthdate,
          phone: inputProfile.phone,
          bio: inputProfile.bio
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      )

      hasAlert.value = true
      alertType.value = 'success'
      alertMessage.value = data.message

      dataUser()
      setTimeout(() => {
        closeDialogProfile()
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

  const editProfile = async (inputProfile) => {
    dialogProfile.value = true
    loading.value = true
    try {
      const { data } = await apiService.patch(
        '/users/profile',
        {
          firstname: inputProfile.firstname,
          lastname: inputProfile.lastname,
          birthdate: inputProfile.birthdate,
          phone: inputProfile.phone,
          bio: inputProfile.bio
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      )

      hasAlert.value = true
      alertType.value = 'success'
      alertMessage.value = data.message

      dataUser()
      setTimeout(() => {
        closeDialogProfile()
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

  const dataUser = async () => {
    try {
      const token = localStorage.getItem('access_token')
      console.log('dataUser token: ', token)
      if (token !== null) {
        const profile = await apiService.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const profileData = profile.data
        currentUser.value = profileData.data
        localStorage.setItem('profile', JSON.stringify(currentUser.value))
        me.value = profileData.data

        if (profileData.data.roles.length > 0) {
          console.log('wkwk selectedRole: ', selectedRole.value)

          const roleData = profileData.data.roles[selectedRole.value]
          localStorage.setItem('activeRole', JSON.stringify(roleData))
          activeRole.value = roleData
        }
      } else {
        accessToken.value = null
        currentUser.value = null
        localStorage.setItem('access_token', null)
        localStorage.setItem('profile', null)
        localStorage.setItem('activeRole', null)
      }
    } catch (error) {
      accessToken.value = null
      currentUser.value = null
      localStorage.setItem('access_token', null)
      localStorage.setItem('profile', null)
      localStorage.setItem('activeRole', null)
    }
  }

  const getUsers = async () => {
    try {
      const { data } = await apiService.get('/users', {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      })
      users.value = data

      return data
    } catch {
      users.value = null
    }
  }

  const adminResetPassword = async (inputUser) => {
    try {
      const { data } = await apiService.post(
        '/auth/reset-password',
        {
          user_uuid: inputUser.user_uuid,
          new_password: inputUser.new_password
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
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

  return {
    loginUser,
    accessToken,
    currentUser,
    dialog,
    loading,
    closeDialog,
    logoutUser,
    me,
    dataUser,
    alertMessage,
    hasAlert,
    alertType,
    registerUser,
    addProfile,
    editProfile,
    dialogProfile,
    closeDialogProfile,
    activeRole,
    isSuperAdmin,
    isSuperAdminOrAdmin,
    getUsers,
    adminResetPassword,
    selectedRole
  }
})
