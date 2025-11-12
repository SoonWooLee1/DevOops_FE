// Ooh(성취) API 래퍼
import api from './axios';

// 목록 조회
export async function fetchOohList({ page = 1, size = 10, title = '', content = '' } = {}) {
  const { data } = await api.get('/ooh/all', { params: { page, size, title, content } });
  // 서버 응답 포맷에 맞춰 그대로 반환 (화면에서 가공)
  return data;
}

// ✅ 단건 조회 (GET /ooh/{id})
  export async function fetchOohById(id) {
  const { data } = await api.get(`/ooh/${id}`);
  return data;
}

export async function fetchOohDetail(id, commentLimit = 10) {
  const { data } = await axios.get(`/ooh/${id}/detail`, { params: { commentLimit } })
  return data
}


/// ✅ Ooh 등록: 태그 + 감정태그까지 함께 전송
export async function createOoh({
  oohUserId,
  oohTitle,
  oohContent,
  oohIsPrivate = 'N',
  tagIds = [],       // number[]
  emoTagIds = []     // string[]
}) {
  const body = { oohUserId, oohTitle, oohContent, oohIsPrivate, tagIds, emoTagIds };
  const { data } = await api.post('/ooh/insertOoh', body);
  return data;
}

// 수정
export async function updateOoh(id, { oohTitle, oohContent, oohIsPrivate = 'N', tagIds = [] }) {
  const body = { oohTitle, oohContent, oohIsPrivate, tagIds };
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