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

// 수정: 단건 상세 (토큰 optional)
export async function fetchOohDetail(id, commentLimit = 10, token) {
  const { data } = await api.get(`/ooh/${id}/detail`, {
    params: { commentLimit },
    headers: token ? { Authorization: `Bearer ${token}` } : {}        // 토큰 추가
  })
  return data
}



// 등록 (일반 태그, AI 답변, 감정 태그 모두 포함)
export async function createOoh({
  oohUserId,
  oohTitle,
  oohContent,
  oohIsPrivate = 'N',
  tagIds = [],
  emoTagIds = [],
  oohAIAnswer = null,           // ✅ 추가
}, token) {
  const body = { 
    oohUserId, oohTitle, oohContent, oohIsPrivate,
    tagIds, emoTagIds,
    oohAIAnswer                     //  반드시 전송
  };

  // 토큰을 넘겨주고 싶을 때 옵션으로 헤더에 실어줌
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const { data } = await api.post('/ooh/insertOoh', body, config);
  return data;
}

// 수정
export async function updateOoh(
  id,
  { oohTitle,
    oohContent, 
    oohIsPrivate = 'N', 
    tagIds = [] 
  },
  token
) {
  const body = { oohTitle, oohContent, oohIsPrivate, tagIds }
  const { data } = await api.put(`/ooh/updateOoh/${id}`, body, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  return data
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
