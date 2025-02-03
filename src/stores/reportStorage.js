import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'

export const useReportStorage = defineStore('report', () => {
  const reports = ref(null)

  const userStorage = useUserStorage()

  const getReports = async (params) => {
    try {
      const { data } = await apiService.get('/reports', {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        },
        params
      })

      const reportData = data.data

      reports.value = reportData
      return data
    } catch {
      reports.value = null
    }
  }

  const removeReport = async (inputReport) => {
    try {
      const { data } = await apiService.delete(`/reports/${inputReport.uuid}`, {
        headers: {
          Authorization: `Bearer ${userStorage.accessToken}`
        }
      })

      getReports()
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

  const addReport = async (inputReport) => {
    try {
      const { data } = await apiService.post(
        `reports`,
        {
          name: inputReport.name,
          description: inputReport.description,
          org_uuid: inputReport.org_uuid,
          period: inputReport.period,
          grade_uuid: inputReport.grade_uuid,
          teacher_uuid: inputReport.teacher_uuid,
          total_juz_target: inputReport.total_juz_target
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

  const editReport = async (inputReport) => {
    try {
      const { data } = await apiService.patch(
        `reports/${inputReport.uuid}`,
        {
          name: inputReport.name,
          description: inputReport.description,
          org_uuid: inputReport.org_uuid,
          period: inputReport.period,
          grade_uuid: inputReport.grade_uuid,
          teacher_uuid: inputReport.teacher_uuid,
          total_juz_target: inputReport.total_juz_target
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

  const showReportByUUID = async (uuid) => {
    try {
      const { data } = await apiService.get(`/reports/${uuid}`, {
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

  const lockReport = async (inputReport) => {
    try {
      const { data } = await apiService.patch(
        `reports/${inputReport.uuid}/lock`,
        {},
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

  const unlockReport = async (inputReport) => {
    try {
      const { data } = await apiService.patch(
        `reports/${inputReport.uuid}/unlock`,
        {},
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
    reports,
    getReports,
    removeReport,
    addReport,
    editReport,
    showReportByUUID,
    lockReport,
    unlockReport
  }
})
