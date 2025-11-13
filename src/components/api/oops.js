// Oops(성취) API 래퍼
import api from './axios';

// 목록 조회
export async function fetchOopsList({ page = 1, size = 10, title = '', content = '' } = {}) {
  const { data } = await api.get('/oops/all', { params: { page, size, title, content } });
  // 서버 응답 포맷에 맞춰 그대로 반환 (화면에서 가공)
  return data;
}

// ✅ 단건 조회 (GET /oops/{id})
  export async function fetchOopsById(id) {
  const { data } = await api.get(`/oops/${id}`);
  return data;
}

// 수정: 단건 상세 (토큰 optional)
export async function fetchOopsDetail(id, commentLimit = 10, token) {
  const { data } = await api.get(`/oops/${id}/detail`, {
    params: { commentLimit },
    headers: token ? { Authorization: `Bearer ${token}` } : {}        // 토큰 추가
  })
  return data
}



// 등록 (일반 태그, AI 답변, 감정 태그 모두 포함)
export async function createOops({
  oopsUserId,
  oopsTitle,
  oopsContent,
  oopsIsPrivate = 'N',
  tagIds = [],
  emoTagIds = [],
  oopsAIAnswer = null,           // ✅ 추가
}, token) {
  const body = { 
    oopsUserId, oopsTitle, oopsContent, oopsIsPrivate,
    tagIds, emoTagIds,
    oopsAIAnswer                     //  반드시 전송
  };

  // 토큰을 넘겨주고 싶을 때 옵션으로 헤더에 실어줌
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const { data } = await api.post('/oops/insertOops', body, config);
  return data;
}

// 수정
export async function updateOops(
  id,
  { oopsTitle,
    oopsContent, 
    oopsIsPrivate = 'N', 
    tagIds = [] 
  },
  token
) {
  const body = { oopsTitle, oopsContent, oopsIsPrivate, tagIds }
  const { data } = await api.put(`/oops/updateOops/${id}`, body, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  return data
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
