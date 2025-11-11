// Oops(실수) API 래퍼
import api from './axios';

// 목록 조회
export async function fetchOopsList({ page = 1, size = 10, title = '', content = '' } = {}) {
  const { data } = await api.get('/oops/all', { params: { page, size, title, content } });
  return data;
}

// 작성
export async function createOops({ oopsUserId, oopsTitle, oopsContent, oopsIsPrivate = 'N' }) {
  const body = { oopsUserId, oopsTitle, oopsContent, oopsIsPrivate };
  const { data } = await api.post('/oops/insertOops', body);
  return data;
}

// 수정
export async function updateOops(id, { oopsTitle, oopsContent, oopsIsPrivate = 'N' }) {
  const body = { oopsTitle, oopsContent, oopsIsPrivate };
  const { data } = await api.put(`/oops/updateOops/${id}`, body);
  return data;
}

// 삭제(소프트/하드)
export async function deleteOops(id) {
  const { data } = await api.delete(`/oops/deleteOops/${id}`);
  return data;
}
export async function hardDeleteOops(id) {
  const { data } = await api.delete(`/oops/hardDeleteOops/${id}`);
  return data;
}
