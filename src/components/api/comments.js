// src/api/comments.js
import api from './axios';

// 공통: 백엔드 필드명을 프론트 표준으로 맵핑
const mapComment = (c) => ({
  id: c.id ?? c.commentId,
  content: c.content,
  createDate: c.create_date ?? c.createDate,
  userId: c.user_id ?? c.userId,
  noticeId: c.notice_id ?? c.noticeId,
  isDeleted: c.is_deleted ?? c.isDeleted,
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
export async function createNoticeComment(noticeId, text) {
  const res = await api.post(
    `/comments/ooh-insert/${noticeId}`,
    { content: text },
    { headers: { 'Content-Type': 'application/json' } }
  )
  // NoticeComments는 단일 댓글 객체를 기대함
  return res.data?.comment ?? res.data ?? {
    id: Date.now(),
    content: text,
    createdAt: new Date().toISOString()
  }
}

// 공지사항에 댓글 작성
export async function writeCommentAtNotice( noticeId, content, token ) {
  const body = { content };
  const { data } = await api.post(`/comments/notice-insert/${noticeId}`, body,{
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
    });
  return data;
}

// 댓글 수정
export async function updateComment( commentId, content, token ) {
  const formData = new FormData();
  formData.append('content', content);

  const { data } = await api.put(`/comments/update-comment/${commentId}`, formData,{
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    }
    });
  return data;
}


// 댓글 hard delete
export async function hardDeleteComment(commentId) {
  const { data } = await api.delete(`/comments/hard-delete-comment/${commentId}`);
  return data;
}

// oops기록에 댓글 작성
export async function writeCommentAtOops( oopsId, content, token ) {
  const body = { content };
  const { data } = await api.post(`/comments/oops-insert/${oopsId}`, body, {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
    });
  return data;
}

// ooh기록에 댓글 작성
export async function writeCommentAtOoh( oohId, content, token ) {
  const body = { content };
  const { data } = await api.post(`/comments/ooh-insert/${oohId}`, body, {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
    });
  return data;
}

export const deleteComment = (commentId) =>
  api.put(`/comments/delete-comment/${commentId}`).then(r => r.data);
