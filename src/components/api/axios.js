import axios from 'axios';
import { useUserStore } from '@/stores/useUserInfo'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// ✅ 모든 요청에 저장된 토큰 자동 부착
api.interceptors.request.use((config) => {
  const store = useUserStore()
  if (store.token) {
    config.headers.Authorization = `Bearer ${store.token}`
  }
  return config
})

export default api;
