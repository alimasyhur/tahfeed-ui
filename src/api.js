import axios from 'axios'

const apiService = axios.create({
  baseURL: 'https://api.tahfeed.com/api/',
  withCredentials: true
})

export { apiService }
