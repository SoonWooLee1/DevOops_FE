import api from './axios';

// 태그 등록(관리자)
export async function createTag({ tagName, tagType }) {
    const body = { tagName, tagType };
    const { data } = await api.post('/tag/tag-insert', body);
    return data;
}

// 태그 수정(관리자)
export async function modifyTag({ tagId, tagName, tagType }) {
    const body = { tagName, tagType };
    const { data } = await api.put(`/tag/tag-modify/${tagId}`, body);
    return data;
}

// 태그 삭제(관리자)
export async function deleteTag({ tagId }) {
    const { data } = await api.delete(`/tag/tag-delete/${tagId}`);
    return data;
}

// ooh에 사용된 태그 삭제(ooh기록 삭제 시 같이 삭제되도록 사용)
export async function deleteUsedOohTag({ tagId, oohId }) {
    const { data } = await api.delete(`/tag/oohtag-delete/${tagId}/${oohId}`);
    return data;
}

// oops에 사용된 태그 삭제(oops기록 삭제 시 같이 삭제되도록 사용)
export async function deleteUsedOopsTag({ tagId, oopsId }) {
    const { data } = await api.delete(`/tag/oopstag-delete/${tagId}/${oopsId}`);
    return data;
}

/* ──────────────────────────────────────────────────────────────
 * 공통 유틸: 서버 응답 → {id, name, type}로 정규화
 *  - DDL 컬럼명(tag_name, tag_type)과 혼재 가능성 대비
 * ────────────────────────────────────────────────────────────── */
function normalizeTags(arr = []) {
  return arr
    .map((t) => ({
      id:
        t.id ??
        t.tagId ??
        t.TAG_ID ??
        t.value ??
        null,
      name:
        t.tag_name ??
        t.tagName ??
        t.TAG_NAME ??
        t.name ??
        t.label ??
        '',
      type:
        t.tag_type ??
        t.tagType ??
        t.TAG_TYPE ??
        t.type ??
        null,
    }))
    .filter((x) => x.id != null && x.name)            // id, name 필수
    .map((x) => ({ ...x, id: typeof x.id === 'string' ? Number(x.id) : x.id }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko')); // 보기 좋게 정렬
}

/* ──────────────────────────────────────────────────────────────
 * 선택용 태그 조회 (작성 화면)
 *  - 우선 제공한 엔드포인트(/tag/oohtag-select, /tag/oopstag-select) 사용
 *  - 실패 시 폴백으로 /tag?type=ooh|oops 시도
 * ────────────────────────────────────────────────────────────── */
export async function fetchOohTagOptions() {
  try {
    const { data } = await api.get('/tag/oohtag-select');
    return normalizeTags(data);
  } catch (e1) {
    // 폴백: /tag?type=ooh
    try {
      const { data } = await api.get('/tag', { params: { type: 'ooh' } });
      return normalizeTags(data);
    } catch (e2) {
      console.error('Ooh 태그 로드 실패', e1 || e2);
      return [];
    }
  }
}

export async function fetchOopsTagOptions() {
  try {
    const { data } = await api.get('/tag/oopstag-select');
    return normalizeTags(data);
  } catch (e1) {
    // 폴백: /tag?type=oops
    try {
      const { data } = await api.get('/tag', { params: { type: 'oops' } });
      return normalizeTags(data);
    } catch (e2) {
      console.error('Oops 태그 로드 실패', e1 || e2);
      return [];
    }
  }
}