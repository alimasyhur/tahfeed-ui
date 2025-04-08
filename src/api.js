import axios from 'axios'

const apiService = axios.create({
  baseURL1: 'https://api.tahfeed.com/api/',
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true
})

export { apiService }
