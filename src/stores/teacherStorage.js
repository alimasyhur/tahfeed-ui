import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'

export const useTeacherStorage = defineStore('teacher', () => {
  const teachers = ref(null)

  const userStorage = useUserStorage()

  const getTeachers = async (filterTeacher) => {
    try {
      const { data } = await apiService.get('/teachers', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params: filterTeacher
      })

      const teacherData = data.data

      teachers.value = teacherData
      return data
    } catch {
      teachers.value = null
    }
  }

  const removeTeacher = async (inputRole) => {
    try {
      const { data } = await apiService.delete(`/teachers/${inputRole.uuid}`, {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        }
      })

      getTeachers()
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

  const addTeacher = async (inputTeacher) => {
    try {
      // const orgUUID = userStorage.activeRole.org_uuid
      const { data } = await apiService.post(
        `teachers`,
        {
          user_uuid: inputTeacher.user_uuid,
          // org_uuid: orgUUID,
          org_uuid: inputTeacher.org_uuid,
          nik: inputTeacher.nik,
          firstname: inputTeacher.firstname,
          lastname: inputTeacher.lastname,
          birthdate: inputTeacher.birthdate,
          phone: inputTeacher.phone,
          bio: inputTeacher.bio
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

  const editTeacher = async (inputTeacher) => {
    try {
      const { data } = await apiService.patch(
        `teachers/${inputTeacher.uuid}`,
        {
          user_uuid: inputTeacher.user_uuid,
          org_uuid: inputTeacher.org_uuid,
          nik: inputTeacher.nik,
          firstname: inputTeacher.firstname,
          lastname: inputTeacher.lastname,
          birthdate: inputTeacher.birthdate,
          phone: inputTeacher.phone,
          bio: inputTeacher.bio
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

  return {
    teachers,
    getTeachers,
    removeTeacher,
    addTeacher,
    editTeacher
  }
})
