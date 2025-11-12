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
// ✅ NoticeComments에서 호출하는 시그니처에 맞춘 어댑터
export async function fetchNoticeComments(noticeId, { page = 1, size = 10 } = {}) {
  // OOH: 전체 조회 (페이징 미지원이면 그냥 한 번에 받기)
  const res = await api.get(`/comments/ooh-read/${noticeId}`)
  const arr = Array.isArray(res.data) ? res.data : (res.data?.comments || [])
  // NoticeComments가 기대하는 반환 포맷
  return {
    list: arr,
    hasNextPage: false,                // 백엔드 페이징 없으니 false
    totalCount: res.data?.totalCount ?? arr.length,
  }
}

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
export async function writeCommentAtOops({ content, oopsId, token }) {
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
export async function writeCommentAtOoh({ content, oohId, token }) {
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
