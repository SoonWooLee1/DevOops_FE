import api from './axios'; // 프로젝트의 axios 인스턴스

/**
 * 내 북마크 목록 전체를 가져옵니다.
 * (BE: /bookmarks/my)
 * @param {string} token - 로그인 토큰
 * @returns {Promise<Array<object>>} 북마크 DTO 배열
 */
export const fetchMyBookmarks = (token) => {
  return api.get('/bookmarks/my', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.data);
};

/**
 * 게시글을 북마크에 추가합니다.
 * (BE: POST /bookmarks)
 * @param {string} recordType - "ooh" 또는 "oops"
 * @param {number} recordId - 게시글 ID
 * @param {string} token - 로그인 토큰
 */
export const addBookmark = (recordType, recordId, token) => {
  return api.post('/bookmarks', { recordType, recordId }, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.data);
};

/**
 * 게시글을 북마크에서 제거합니다.
 * (BE: DELETE /bookmarks)
 * @param {string} recordType - "ooh" 또는 "oops"
 * @param {number} recordId - 게시글 ID
 * @param {string} token - 로그인 토큰
 */
export const removeBookmark = (recordType, recordId, token) => {
  return api.delete('/bookmarks', {
    data: { recordType, recordId }, // DELETE 요청 시 body는 data 속성에 넣습니다.
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.data);
};