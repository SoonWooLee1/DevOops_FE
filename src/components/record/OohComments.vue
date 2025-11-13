<!-- src/components/OohComments.vue -->
<template>
  <section class="ooh-comments">
    <!-- 신고 모달 -->
    <ReportModal
      :visible="reportVisible"
      target-type="comment"
      :target-id="reportTargetId"
      @close="reportVisible = false"
      @submitted="onReportSubmitted"
    />
    <!-- 작성 -->
    <h3 class="write-title">댓글 남기기</h3>
    <textarea
      class="write-input"
      v-model="draft"
      placeholder="따뜻한 응원의 말을 남겨주세요..."
    ></textarea>
    <button class="write-btn" @click="send">보내기</button>
    <p class="write-note">모든 메시지는 익명으로 표시됩니다. 서로를 존중하는 마음으로 응원해주세요.</p>

    <!-- 목록 -->
    <div class="list-wrap">
      <h3 class="comments-title">댓글({{ total }})</h3>

      <div v-if="loading" class="state">로딩중…</div>
      <div v-else-if="error" class="state error">{{ error }}</div>

      <!-- ✅ 여기 수정: v-if 와 v-else를 인접 형제로 분리 -->
      <ul class="comment-list" v-else-if="list.length">
        <li class="comment" v-for="c in list" :key="c.id">
          <div class="comment-left">
            <div class="comment-avatar">{{ (c.author && c.author[0]) || '익' }}</div>
          </div>

          <div class="comment-body">
            <div class="comment-meta">
              <span class="comment-author">{{ c.author || '익명' }}</span>
              <span class="comment-date">{{ formatDate(c.create_date) }}</span>
               <!-- 신고 버튼 (본인 댓글이면 안보임) -->
              <button
                class="comment-report-btn"
                v-if="Number(user) !== c.user_id"
                @click="openReportModalForComment(c.id)"
              >
                신고
              </button>

              
            </div>

            <!-- 수정 모드 -->
            <div v-if="editId === c.id" class="edit-row">
              <textarea class="edit-input" v-model="editText" :placeholder="c.content"></textarea>
              <div class="edit-actions">
                <button class="btn outline" @click="cancelEdit">취소</button>
                <button class="btn primary" @click="confirmEdit(c.id)">수정 완료</button>
              </div>
            </div>
            <p v-else class="comment-text">{{ c.content }}</p>

            <div v-if="Number(user) === c.user_id" class="comment-actions">
              <button class="btn link" @click="startEdit(c)">수정</button>
              <button class="btn link danger" @click="remove(c.id)">삭제</button>
            </div>
          </div>
        </li>
      </ul>

      <div v-else class="state">아직 응원 메시지가 없어요. 첫 메시지를 남겨보세요!</div>
      <!-- ✅ 여기까지 한 덩어리: (loading) → (error) → (있음) → (없음) -->
    </div>
  </section>
</template>

<script setup>
/**
 * OohComments.vue
 * - props
 *   - oohId:      대상 OOH 게시글 ID (필수)
 *   - initialComments: 상세 API에서 받은 초기 comments 배열(옵션) — API 실패/빈배열일 때 fallback
 * - emits
 *   - update:list  (list: Comment[])  → 부모(ooh.comments) 동기화
 *   - update:count (n: number)        → 부모(ooh.commentsTotal) 동기화
 *
 * 사용 API
 *   GET  /comments/ooh-read/{oohId}
 *   POST /comments/ooh-insert/{oohId}           { content }
 *   PUT  /comments/update-comment/{commentId}   { content }
 *   PUT  /comments/delete-comment/{commentId}
 */

import { ref, watch, onMounted } from 'vue'
import api from '../api/client'
import { useUserStore } from '@/stores/useUserInfo';
import { writeCommentAtOoh, updateComment, hardDeleteComment } from '../api/comments';
import { useToastStore } from "@/stores/useToast";
import ReportModal from '@/components/common/ReportModal.vue';

const toastStore = useToastStore();
const reportVisible = ref(false);
const reportTargetId = ref(null);


const userStore = useUserStore();
const token = userStore.token;
const user = ref(null);

function openReportModalForComment(commentId) {
  if (!userStore.id) {
    toastStore.showToast("로그인이 필요합니다.");
    return;
  }
  reportTargetId.value = commentId;
  reportVisible.value = true;
}

function onReportSubmitted() {
  toastStore.showToast("신고가 접수되었습니다.");
}

onMounted(() => {
  user.value = userStore.id;
  console.log("현재로그인한 사용자ID:", user.value);
})

const props = defineProps({
  oohId: { type: [String, Number], required: true },
  initialComments: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:list', 'update:count'])

const loading = ref(false)
const error = ref('')
const list = ref([])
const total = ref(0)

const draft = ref('')
const editId = ref(null)
const editText = ref('')

function formatDate(iso) {
  console.log("시간", iso)
  if(!iso) return '방금 전'
  const d = new Date(iso); if(isNaN(d)) return '방금 전'
  const diff=(Date.now()-d.getTime())/1000
  if(diff<60) return '방금 전'
  if(diff<3600) return `${Math.floor(diff/60)}분 전`
  if(diff<86400) return `${Math.floor(diff/3600)}시간 전`
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0')
  return `${y}.${m}.${day}`
}

function syncUp() {
  emit('update:list', list.value)
  emit('update:count', total.value)
}

async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get(`/comments/ooh-read/${props.oohId}`)
    const arr = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.comments) ? res.data.comments : null)

    if (Array.isArray(arr)) {
      list.value = arr        // 서버가 빈 배열을 주면 그대로 표시(=댓글 없음)
      console.log("댓글 List:", list);
      total.value = arr.length
    } else {
      // 구조 파싱 실패 → 초기 comments fallback
      list.value = Array.isArray(props.initialComments) ? props.initialComments : []
      total.value = list.value.length
    }
  } catch (e) {
    // API 실패 → 초기 comments fallback
    console.warn('[댓글 조회 실패] fallback to initialComments', e)
    list.value = Array.isArray(props.initialComments) ? props.initialComments : []
    total.value = list.value.length
  } finally {
    loading.value = false
    syncUp()
  }
}

async function send() {
  if (!draft.value.trim()) return toastStore.showToast("메시지를 입력해주세요.");
  try {
console.log("ooh기록 ID:", props.oohId);
console.log("입력할 내용:", draft.value);
    const saved = await writeCommentAtOoh(props.oohId, draft.value, token);
    const item = saved?.comment ?? saved?.data ?? saved ?? { id:Date.now(), content:draft.value, create_date:new Date().toISOString() };
    list.value.unshift(item);
    draft.value = '';
    await fetchList()
  } catch (e) {
    console.error('[댓글 작성 실패]', e?.response?.status, e?.response?.data || e)
    toastStore.showToast("댓글 등록 실패(콘솔 확인)");
  }
}

function startEdit(cmt) {
  editId.value = cmt.id
  editText.value = cmt.content
}
function cancelEdit() {
  editId.value = null
  editText.value = ''
}
async function confirmEdit(commentId) {
  if (!String(editText.value).trim()) return toastStore.showToast('내용을 입력해주세요.')
  try {
    await updateComment(commentId, editText.value, token);
    editId.value = null;
    editText.value = '';
    await fetchList();
  } catch (e) {
    console.error('[댓글 수정 실패]', e?.response?.status, e?.response?.data || e)
    toastStore.showToast('댓글 수정 실패')
  }
}
async function remove(commentId) {
  console.log("댓글 ID: ",commentId);
  if (!confirm('정말 삭제하시겠어요?')) return
  try {
    await hardDeleteComment(commentId);
    await fetchList();
  } catch (e) {
    console.error('[댓글 삭제 실패]', e?.response?.status, e?.response?.data || e)
    toastStore.showToast('댓글 삭제 실패')
  }
}

onMounted(fetchList)
watch(() => props.oohId, fetchList)
</script>

<style scoped>
/* ===== 루트: 바깥 카드와 겹치지 않도록 완전 평탄화 ===== */
.ooh-comments{
  background: transparent;
  border: 0;
  box-shadow: none;
  margin: 0;
  padding: 0;          /* 바깥 .comments가 패딩/테두리 담당 */
}
/* 기존 종이그림자 제거 */
.ooh-comments::after{ display:none; }

/* ===== 작성 영역 ===== */
.write-title{
  font-size:15px; font-weight:700; color:#3a3732;
  margin:0 2px 10px;
}
.write-input{
  box-sizing: border-box;   /* ← 추가!! */
  width:100%;
  min-height:120px;
  resize:vertical;
  border-radius:12px;
  border:1px solid #e6dcc2;
  background:#fff;
  padding:14px 15px;
  font-size:14px;
  color:#3a3732;
  line-height:1.7;
  transition: box-shadow .12s ease, border-color .12s ease, background .12s ease;
}
.write-input::placeholder{ color:#b2a996; }
.write-input:focus{
  outline:none; border-color:#cfe3cd;
  box-shadow:0 0 0 3px rgba(125,182,123,.14);
  background:#fffefb;
}

.write-btn{
  margin-top:10px;
  height:36px; padding:0 16px;
  border-radius:10px; border:1px solid #bfd7bc;
  background:#e6f2e4; color:#365f36;
  font-weight:700; font-size:14px;
  cursor:pointer;
  display:inline-flex; align-items:center; gap:6px;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
}
.write-btn:hover{ transform:translateY(-1px); box-shadow:0 6px 16px rgba(34,30,20,.08); }

.write-note{
  font-size:12px; color:#8b8577; margin-top:10px;
}

/* ===== 리스트 헤더 ===== */
.list-wrap{ margin-top:18px; }
.comments-title{
  display:flex; align-items:center; gap:8px;
  font-size:15px; font-weight:800; color:#33302a; margin:0 2px 12px;
}
.comments-title::after{
  content:""; flex:1 1 auto; height:1px; background:#efe6cf; border-radius:1px;
}

/* ===== 댓글 리스트 ===== */
.comment-list{ display:grid; gap:12px; }

.comment{
  display:grid; grid-template-columns:42px 1fr; gap:12px;
  background:#fff;
  border:1px solid #f0e7cb;
  border-radius:12px;
  padding:12px;
  transition: box-shadow .12s ease, transform .12s ease, border-color .12s ease;
}
.comment:hover{
  transform:translateY(-1px);
  border-color:#eadfbf;
  box-shadow:0 8px 16px rgba(34,30,20,.06);
}

.comment-avatar{
  width:34px; height:34px; border-radius:9999px;
  background:#b8d9b6; color:#fff; display:grid; place-items:center;
  font-weight:800; letter-spacing:.2px;
}

.comment-meta{
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin-bottom: 4px;
  position: relative;
}
.comment-author{ font-weight:800; color:#33302a; }
.comment-date{ font-size:12px; color:#8b8577; }

.comment-text{
  color:#3a3732; line-height:1.75; word-break:break-word;
  white-space:pre-wrap;
}

.comment-report-btn {
  margin-left: auto;
  background: none;
  border: 0;
  font-size: 12px;
  color: #a12c0f;
  cursor: pointer;
  opacity: 0.85;
  padding: 2px 4px;
  border-radius: 6px;
  transition: opacity .15s ease, color .15s ease, transform .15s ease;
}

.comment-report-btn:hover {
  opacity: 1;
  color: #5e574b;
  transform: translateY(-1px);
}

/* 액션 */
.comment-actions{ margin-top:8px; display:flex; gap:10px; }
.btn{ font-size:13px; }
.btn.link{
  background:transparent; border:0; color:#6b6a66; cursor:pointer; padding:2px 0;
}
.btn.link:hover{ text-decoration:underline; }
.btn.link.danger{ color:#a94442; }

/* 수정 모드 */
.edit-row{ display:grid; gap:8px; }
.edit-input{
  width:100%; min-height:80px; resize:vertical;
  border-radius:10px; border:1px solid #e4dbc1; padding:10px;
  font-size:14px; color:#3a3732; background:#fff;
}
.edit-actions{ display:flex; gap:8px; }
.btn.outline{
  padding:6px 10px; border:1px solid #d8cfb4; border-radius:8px; background:#fff; color:#6b6a66; cursor:pointer;
}
.btn.primary{
  padding:6px 10px; border:1px solid #bfd7bc; border-radius:8px; background:#e6f2e4; color:#355c33; cursor:pointer; font-weight:700;
}

/* ===== 상태 메시지 ===== */
.state{ margin-top:8px; color:#7a6f5b; }
.state.error{ color:#c0392b; }
</style>
