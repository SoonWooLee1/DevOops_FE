import api from './axios';

// oops에 좋아요 insert or delete
export async function pushOopsLikes(oopsId, token) {
    const { data } = await api.get(`/likes/${oopsId}/oops-like`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}

// ooh에 좋아요 insert or delete
export async function pushOohLikes(oohId, token) {
  const { data } = await api.get(`/likes/${oohId}/ooh-like`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  return data;
}


// 자신이 좋아요 누른 oops기록인지 확인
export async function checkOopsLikesExist(oopsId, token) {
    const { data } = await api.get(`/likes/${oopsId}/oopslikes-exist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}

// 자신이 좋아요 누른 ooh기록인지 확인(게시글 상세조회 시 onmount()에 사용)
// 결과: 'exist' or 'does not exist'
export async function checkOohLikesExist(oohId, token) {
    const { data } = await api.get(`/likes/${oohId}/oohlikes-exist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}

// oops 좋아요 수 조회
export async function checkOopsLikesCount(oopsId) {
   const { data } = await api.get(`/likes/${oopsId}/oopslikes-count`);
   return data;
}

// ooh 좋아요 수 조회
export async function checkOohLikesCount(oohId) {
    const { data } = await api.get(`/likes/${oohId}/oohlikes-count`);
    return data;
}