import { defineStore } from 'pinia'
import { apiService } from '@/api'
import { ref } from 'vue'
import { useUserStorage } from '@/stores/userStorage'
import { formatDatetime } from '@/utils/formatDate'

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

  const addReport = async (inputReport) => {
    try {
      if (inputReport.date_input === null) {
        return {
          status: 'error',
          message: 'date input is required'
        }
      }

      const { data } = await apiService.post(
        `reports`,
        {
          date_input: formatDatetime(inputReport.date_input),
          teacher_uuid: inputReport.teacher_uuid,
          kelas_uuid: inputReport.kelas_uuid,
          start_juz_uuid: inputReport.start_juz_uuid,
          start_page_uuid: inputReport.start_page_uuid,
          end_juz_uuid: inputReport.end_juz_uuid,
          end_page_uuid: inputReport.end_page_uuid,
          name: inputReport.name,
          note: inputReport.note,
          type_report: inputReport.type_report,
          description: inputReport.description,
          student_uuid: inputReport.student_uuid,
          org_uuid: inputReport.org_uuid,
          period: inputReport.period,
          grade_uuid: inputReport.grade_uuid,
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

  const editReport = async (inputReport) => {
    try {
      console.log('date_input: ', inputReport.date_input)

      const dateInput =
        typeof inputReport.date_input === 'string'
          ? inputReport.date_input
          : formatDatetime(inputReport.date_input)

      const { data } = await apiService.patch(
        `reports/${inputReport.uuid}`,
        {
          date_input: dateInput,
          teacher_uuid: inputReport.teacher_uuid,
          kelas_uuid: inputReport.kelas_uuid,
          start_juz_uuid: inputReport.start_juz_uuid,
          start_page_uuid: inputReport.start_page_uuid,
          end_juz_uuid: inputReport.end_juz_uuid,
          end_page_uuid: inputReport.end_page_uuid,
          name: inputReport.name,
          note: inputReport.note,
          type_report: inputReport.type_report,
          description: inputReport.description,
          student_uuid: inputReport.student_uuid,
          org_uuid: inputReport.org_uuid,
          period: inputReport.period,
          grade_uuid: inputReport.grade_uuid,
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
      console.log('EDIT DATA:', error)

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

  const showReportByUUID = async (uuid) => {
    try {
      const { data } = await apiService.get(`/reports/${uuid}`, {
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

  const getReportSummary = async (params) => {
    try {
      const { data } = await apiService.get('/reports/summary', {
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

  const getSetoranSummary = async (params) => {
    try {
      const { data } = await apiService.get('/reports/setoran', {
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

  return {
    reports,
    getReports,
    getReportSummary,
    getSetoranSummary,
    removeReport,
    addReport,
    editReport,
    showReportByUUID,
    lockReport,
    unlockReport
  }
})
