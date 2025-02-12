import axios from 'axios'

const apiService = axios.create({
  baseURL: 'http://dev-api.tahfeed.com/api/',
  withCredentials: true
})

export { apiService }
