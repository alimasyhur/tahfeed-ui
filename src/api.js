import axios from 'axios'

const apiService = axios.create({
  baseURL: 'https://api.tahfeed.com/api/',
  baseURL2: 'http://localhost:8000/api/',
  withCredentials: true
})

export { apiService }
