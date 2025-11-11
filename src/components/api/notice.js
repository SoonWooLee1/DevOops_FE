// 공지사항 API 래퍼
import api from './axios';

// 목록 조회 (무한스크롤용)
export async function fetchNotices({ page = 1, size = 10, title = '', content = '' } = {}) {
  const { data } = await api.get('/notice/all', {
    params: { page, size, title, content },
  });
  // 백엔드 응답 형태 예시:
  // { noticeList: [...], hasNextPage: true, totalCount: 19 }
  return {
    list: (data.noticeList || []).map(mapNotice),
    hasNextPage: !!data.hasNextPage,
    totalCount: data.totalCount ?? 0,
    raw: data,
  };
}
// 공지 생성
export async function createNotice({ noticeUserId, title, content }) {
  const payload = {
    noticeUserId,                 // number
    noticeTitle: title,           // string
    noticeContent: content,       // string
  };
  const { data } = await api.post('/notice/insertNotice', payload);
  return data; // 서버가 생성된 noticeId 등을 리턴하면 그대로 전달
}


// 단건 조회 (상세/수정 진입 시 사용)
export async function fetchNoticeById(id) {
  const { data } = await api.get(`/notice/read/${id}`)
  // 서버 응답 그대로 써도 되고, 기존 mapNotice 재사용해도 OK
  return data
}

// 수정 (PUT or POST: 서버 스펙에 맞춰 조정)
// 예: PUT /notice/updateNotice/{id}
export async function updateNotice(id, { title, content }) {
  const body = {
    noticeTitle: title,
    noticeContent: content,
  }
  const { data } = await api.put(`/notice/updateNotice/${id}`, body)
  return data
}

// 소프트 삭제 / 하드 삭제 (관리자 페이지 대비)
export async function softDeleteNotice(id) {
  // POSTMAN: /notice/deleteNotice/{id}  (DELETE/PUT 중 서버에 맞춰 사용)
  const { data } = await api.delete(`/notice/deleteNotice/${id}`);
  return data;
}
export async function hardDeleteNotice(id) {
  const { data } = await api.delete(`/notice/hardDeleteNotice/${id}`);
  return data;
}

// ===== utils =====
function mapNotice(n) {
  return {
    id: n.noticeId,
    title: n.noticeTitle,
    content: n.noticeContent,
    createdAt: n.noticeCreateDate,
    modifiedAt: n.noticeModifyDate,
    isDeleted: n.noticeIsDeleted === 'Y',
    authorName: n.name,
    dateLabel: formatYmd(n.noticeCreateDate),
  };
}
function formatYmd(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

