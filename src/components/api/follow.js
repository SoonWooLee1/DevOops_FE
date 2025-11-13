import api from './axios'; // 프로젝트의 axios 인스턴스

/**
 * 내가 팔로우하는 사용자 목록을 가져옵니다. (팔로우 상태 확인용)
 * (BE: /follow/following/my)
 * @param {string} token - 로그인 토큰
 * @returns {Promise<Array<object>>} 팔로잉 DTO 배열
 */
export const fetchMyFollowing = (token) => {
  return api.get('/follow/following/my', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.data);
};

/**
 * 내가 팔로우하는 사용자들의 게시글 피드를 가져옵니다.
 * (BE: /follow/feed/my)
 * @param {string} token - 로그인 토큰
 * @returns {Promise<Array<object>>} 팔로우 피드 DTO 배열
 */
export const fetchMyFollowFeed = (token) => {
  return api.get('/follow/feed/my', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.data);
};

/**
 * 특정 사용자를 팔로우합니다.
 * (BE: POST /follow)
 * @param {number} followeeId - 팔로우할 대상의 ID
 * @param {string} token - 로그인 토큰
 */
export const followUser = (followeeId, token) => {
  return api.post('/follow', { followeeId }, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.data);
};

/**
 * 특정 사용자를 언팔로우합니다.
 * (BE: DELETE /follow)
 * @param {number} followeeId - 언팔로우할 대상의 ID
 * @param {string} token - 로그인 토큰
 */
export const unfollowUser = (followeeId, token) => {
  return api.delete('/follow', {
    data: { followeeId },
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.data);
};