import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'

export const useKelasStorage = defineStore('kelas', () => {
  const kelases = ref(null)

  const userStorage = useUserStorage()

  const getKelases = async (params) => {
    try {
      const { data } = await apiService.get('/kelases', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params
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

  const addKelas = async (inputKelas) => {
    try {
      const { data } = await apiService.post(
        `kelases`,
        {
          name: inputKelas.name,
          description: inputKelas.description,
          org_uuid: inputKelas.org_uuid,
          period: inputKelas.period,
          grade_uuid: inputKelas.grade_uuid,
          teacher_uuid: inputKelas.teacher_uuid,
          total_juz_target: inputKelas.total_juz_target
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
          teacher_uuid: inputKelas.teacher_uuid,
          total_juz_target: inputKelas.total_juz_target
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

  const startKelas = async (inputKelas) => {
    try {
      const { data } = await apiService.patch(
        `kelases/${inputKelas.uuid}/activate`,
        {},
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

  const endKelas = async (inputKelas) => {
    try {
      const { data } = await apiService.patch(
        `kelases/${inputKelas.uuid}/stop`,
        {},
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

  const reactivateKelas = async (inputKelas) => {
    try {
      const { data } = await apiService.patch(
        `kelases/${inputKelas.uuid}/reactivate`,
        {},
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

  const showKelasByUUID = async (uuid) => {
    try {
      const { data } = await apiService.get(`/kelases/${uuid}`, {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        }
      })

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

  const getKelasStudents = async (filterKelasStudents) => {
    try {
      const kelasUUID = filterKelasStudents.filter.kelas_uuid
      const { data } = await apiService.get(`/kelases/${kelasUUID}/students`, {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: filterKelasStudents
      })

      const kelasData = data.data

      kelases.value = kelasData
      return data
    } catch {
      kelases.value = null
    }
  }

  const assignStudent = async (inputAssign) => {
    try {
      const { data } = await apiService.post(
        `kelases/assign`,
        {
          student_uuid: inputAssign.student_uuid,
          kelas_uuid: inputAssign.kelas_uuid,
          org_uuid: inputAssign.org_uuid
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

  const removeKelasStudent = async (inputKelasStudent) => {
    try {
      const { data } = await apiService.delete(`/kelases-students/${inputKelasStudent.uuid}`, {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        }
      })

      getKelasStudents()
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
    kelases,
    getKelases,
    removeKelas,
    addKelas,
    editKelas,
    startKelas,
    endKelas,
    reactivateKelas,
    showKelasByUUID,
    getKelasStudents,
    assignStudent,
    removeKelasStudent
  }
})
