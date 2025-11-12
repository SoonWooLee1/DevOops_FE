// src/api/client.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',      // Vite proxy 때문에 프론트는 /api로 호출
  withCredentials: true // 쿠키 자동 포함
})

// 요청 인터셉터 (헤더 자동 추가)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api