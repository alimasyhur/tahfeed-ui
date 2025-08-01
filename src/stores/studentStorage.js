import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'
import { formatDate } from '@/utils/formatDate'

export const useStudentStorage = defineStore('student', () => {
  const students = ref(null)

  const userStorage = useUserStorage()

  const getStudents = async (filterStudent) => {
    try {
      const { data } = await apiService.get('/students', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: filterStudent
      })

      const studentData = data.data

      students.value = studentData
      return data
    } catch {
      students.value = null
    }
  }

  const removeStudent = async (inputRole) => {
    try {
      const { data } = await apiService.delete(`/students/${inputRole.uuid}`, {
        data: {
          org_uuid: inputRole.org_uuid
        },
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        }
      })

      getStudents()
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

  const addStudent = async (inputStudent) => {
    try {
      const payload = {
        org_uuid: inputStudent.org_uuid,
        grade_uuid: inputStudent.grade_uuid,
        nik: inputStudent.nik,
        nis: inputStudent.nis,
        firstname: inputStudent.firstname,
        lastname: inputStudent.lastname,
        birthdate: formatDate(inputStudent.birthdate),
        phone: inputStudent.phone,
        bio: inputStudent.bio
      }

      if (inputStudent.user_uuid !== '') {
        payload.user_uuid = inputStudent.user_uuid
      }

      const { data } = await apiService.post(`students`, payload, {
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

  const editStudent = async (inputStudent) => {
    try {
      const payload = {
        org_uuid: inputStudent.org_uuid,
        grade_uuid: inputStudent.grade_uuid,
        nik: inputStudent.nik,
        nis: inputStudent.nis,
        firstname: inputStudent.firstname,
        lastname: inputStudent.lastname,
        birthdate: formatDate(inputStudent.birthdate),
        phone: inputStudent.phone,
        bio: inputStudent.bio
      }

      if (inputStudent.user_uuid !== '' && inputStudent.user_uuid != null) {
        payload.user_uuid = inputStudent.user_uuid
      }

      const { data } = await apiService.patch(`students/${inputStudent.uuid}`, payload, {
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

  const getStudentOptions = async (filterStudent) => {
    try {
      const { data } = await apiService.get('/students', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: filterStudent
      })

      const studentData = data.data

      students.value = studentData
      return data
    } catch {
      students.value = null
    }
  }

  const getKelasStudentOptions = async (filterStudent) => {
    try {
      const { data } = await apiService.get('/students/options', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: filterStudent
      })

      const studentData = data.data

      students.value = studentData
      return data
    } catch {
      students.value = null
    }
  }

  const showStudentByUUID = async (uuid) => {
    try {
      const { data } = await apiService.get(`/students/${uuid}`, {
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

  return {
    students,
    getStudents,
    removeStudent,
    addStudent,
    editStudent,
    getStudentOptions,
    getKelasStudentOptions,
    showStudentByUUID
  }
})
