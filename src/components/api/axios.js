import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// ✅ 모든 요청에 저장된 토큰 자동 부착

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('Authorization') ||
    sessionStorage.getItem('Authorization');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = /^Bearer\s/i.test(token)
      ? token
      : `Bearer ${token}`;
  }
  return config;
});


export default api;
