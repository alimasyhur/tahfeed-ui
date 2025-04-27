import axios from 'axios'

const apiService = axios.create({
  baseURL: 'https://api.tahfeed.com/api/',
  baseURL1: 'http://localhost:8000/api/',
  withCredentials: true
})

export { apiService }
