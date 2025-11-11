// Ooh(성취) API 래퍼
import api from './axios';

// 목록 조회
export async function fetchOohList({ page = 1, size = 10, title = '', content = '' } = {}) {
  const { data } = await api.get('/ooh/all', { params: { page, size, title, content } });
  // 서버 응답 포맷에 맞춰 그대로 반환 (화면에서 가공)
  return data;
}

// 작성
export async function createOoh({ oohUserId, oohTitle, oohContent, oohIsPrivate = 'N' }) {
  const body = { oohUserId, oohTitle, oohContent, oohIsPrivate };
  const { data } = await api.post('/ooh/insertOoh', body);
  return data;
}

// 수정
export async function updateOoh(id, { oohTitle, oohContent, oohIsPrivate = 'N' }) {
  const body = { oohTitle, oohContent, oohIsPrivate };
  const { data } = await api.put(`/ooh/updateOoh/${id}`, body);
  return data;
}

// 삭제(소프트/하드)
export async function deleteOoh(id) {
  const { data } = await api.delete(`/ooh/deleteOoh/${id}`);
  return data;
}
export async function hardDeleteOoh(id) {
  const { data } = await api.delete(`/ooh/hardDeleteOoh/${id}`);
  return data;
}


/* 태그 아이디 기록작성, 수정 할때 넣어줘야하는거 기억하기 */