// src/api/comments.js
import api from './axios';

// 공통: 백엔드 필드명을 프론트 표준으로 맵핑
const mapComment = (c) => ({
  id: c.id ?? c.commentId,
  content: c.content,
  createDate: c.create_date ?? c.createDate,
  userId: c.user_id ?? c.userId,
  noticeId: c.notice_id ?? c.noticeId,
  oohId: c.ooh_id ?? c.oohId,
  oopsId: c.oops_id ?? c.oopsId,
  name: c.name ?? c.writerName, // 있으면 표시용
});

// --- Notice ---
export const fetchNoticeComments = async (noticeId, { page = 1, size = 10 } = {}) => {
  const { data } = await api.get(`/comments/notice-read/${noticeId}`);

  // ① 배열로 내려오는 경우(현재 Postman 캡처)
  if (Array.isArray(data)) {
    // 최신순 정렬이 필요하면 아래 줄 유지(원치 않으면 제거)
    const sorted = data.slice().sort((a, b) =>
      new Date(b.create_date ?? b.createDate) - new Date(a.create_date ?? a.createDate)
    );
    const start = (page - 1) * size;
    const end = start + size;
    const slice = sorted.slice(start, end);
    return {
      list: slice.map(mapComment),
      hasNextPage: end < sorted.length,
      totalCount: sorted.length,
    };
  }

  // ② 객체로 내려오는 경우(향후 서버가 페이징을 붙이면)
  const rawList = data.noticeCommentList ?? data.list ?? [];
  return {
    list: rawList.map(mapComment),
    hasNextPage: !!data.hasNextPage,
    totalCount: data.totalCount ?? rawList.length,
  };
};

// --- Ooh / Oops (참고: 기존 코드 유지) ---
export const fetchOohComments  = (oohId)  =>
  api.get(`/comments/ooh-read/${oohId}`).then(r => Array.isArray(r.data) ? r.data.map(mapComment) : r.data);

export const fetchOopsComments = (oopsId) =>
  api.get(`/comments/oops-read/${oopsId}`).then(r => Array.isArray(r.data) ? r.data.map(mapComment) : r.data);

// 생성
export const createNoticeComment = (noticeId, content) =>
  api.post(`/comments/notice-insert/${noticeId}`, { content }).then(r => r.data);

// 수정 / 삭제
export const updateComment = (commentId, content) =>
  api.put(`/comments/update-comment/${commentId}`, { content }).then(r => r.data);

export const deleteComment = (commentId) =>
  api.put(`/comments/delete-comment/${commentId}`).then(r => r.data);
