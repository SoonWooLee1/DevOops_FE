// 공용 axios 인스턴스 (프록시: /api -> http://localhost:8080)
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: false,
  timeout: 10000,
});

// 공통 응답/에러 로깅 (필요 시 토스트 연결만 해주면 됨)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', err?.response?.status, err?.response?.data || err.message);
    // throw 유지: 호출 측에서 try/catch 가능
    throw err;
  }
);

export default api;
