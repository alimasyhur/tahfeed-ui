import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'

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
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        }
      })

      getStudents()
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

  const addStudent = async (inputStudent) => {
    try {
      const payload = {
        org_uuid: inputStudent.org_uuid,
        grade_uuid: inputStudent.grade_uuid,
        nik: inputStudent.nik,
        nis: inputStudent.nis,
        firstname: inputStudent.firstname,
        lastname: inputStudent.lastname,
        birthdate: inputStudent.birthdate,
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

  const editStudent = async (inputStudent) => {
    try {
      const payload = {
        org_uuid: inputStudent.org_uuid,
        grade_uuid: inputStudent.grade_uuid,
        nik: inputStudent.nik,
        nis: inputStudent.nis,
        firstname: inputStudent.firstname,
        lastname: inputStudent.lastname,
        birthdate: inputStudent.birthdate,
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

  return {
    students,
    getStudents,
    removeStudent,
    addStudent,
    editStudent,
    getStudentOptions,
    getKelasStudentOptions
  }
})
