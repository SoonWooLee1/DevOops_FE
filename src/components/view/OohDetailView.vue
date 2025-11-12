<!-- src/views/OohDetailView.vue -->
<template>
  <div class="page">
    <button class="back-link" type="button" @click="goList">
      <span class="arrow">←</span> 돌아가기
    </button>

    <div class="card" v-if="ooh">
      <header class="card-header">
        <div class="author">
          <div class="avatar-badge">{{ avatarInitial }}</div>
          <div class="meta">
            <div class="name">{{ ooh.userName }}</div>
            <div class="date">{{ formattedDate }}</div>
          </div>
        </div>

        <div class="post-actions">
          <button class="btn ghost" type="button" @click="onEdit">
            수정
          </button>
          <button class="btn danger" type="button" @click="onDelete">
            삭제
          </button>
        </div>
      </header>

      <section class="card-body">
        <h1 class="title">{{ ooh.title }}</h1>
        <p class="content" v-if="ooh.content">{{ ooh.content }}</p>

        <div class="chips-group" v-if="ooh.emotions && ooh.emotions.length">
          <div class="group-label">감정</div>
          <div class="chips">
            <span class="chip" v-for="(e, i) in ooh.emotions" :key="'emo-'+i">{{ e }}</span>
          </div>
        </div>

        <div class="chips-group" v-if="ooh.tags && ooh.tags.length">
          <div class="group-label">태그</div>
          <div class="chips">
            <span class="chip tag" v-for="(t, i) in ooh.tags" :key="'tag-'+i">#{{ t }}</span>
          </div>
        </div>
      </section>

      <footer class="card-footer">
        <button class="like-btn" :class="{ active: likedByMe }" @click="toggleLike">
          <span class="icon"></span>
          <span>{{ likedByMe ? '좋아요 취소' : '좋아요' }}</span>
        </button>
        <div class="dot">•</div>
        <div class="count"><span class="icon">좋아요</span> {{ likesCount }}</div>
        <div class="dot">•</div>
        <div class="count"><span class="icon">댓글</span> {{ totalComments }}</div>
      </footer>
    </div>

    <!-- 댓글 컴포넌트 -->
    <section v-if="USE_NOTICE_COMMENTS" class="comments">
      <OohComments
        v-if="ooh"
        :ooh-id="ooh.id"
        :initial-comments="ooh.comments"
        @update:list="(l) => { if(ooh){ ooh.comments = l } }"
        @update:count="(n) => { if(ooh){ ooh.commentsTotal = n } }"
      />
    </section>

    <!-- 로딩/에러 -->
    <div class="state" v-if="loading">로딩중…</div>
    <div class="state error" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/client'
import OohComments from '../record/OohComments.vue'
import { useToastStore } from "@/stores/useToast";

const toastStore = useToastStore();

const USE_NOTICE_COMMENTS = true

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const ooh = ref(null)

const likesCount = ref(0)
const likedByMe  = ref(false)

const newComment     = ref('')
const editCommentId  = ref(null)
const editContent    = ref('')

const goList = () => router.push({ name: 'Ooh' })
const typeLabel = computed(() => {
  if (!ooh.value?.type) return ''
  const t = String(ooh.value.type)
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
})

const formattedDate = computed(() => ooh.value?.createDate ? formatDate(ooh.value.createDate) : '')
const avatarInitial = computed(() => ooh.value?.userName ? ooh.value.userName[0] : '유')
const totalComments = computed(() => ooh.value?.commentsTotal ?? (ooh.value?.comments?.length || 0))


function formatDate(iso) {
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return 'Invalid Date'
    return d.toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })
  } catch {
    return 'Invalid Date'
  }
}

onMounted(async () => {
  const id = route.params.id
  loading.value = true
  try {
    const detail = await api.get(`/ooh/${id}/detail`)
    ooh.value = detail.data

    if (!Array.isArray(ooh.value.comments)) {
      ooh.value.comments = []
      ooh.value.commentsTotal = 0
    }

    await tryFetchComments()
    await fetchLikesCount()
    likedByMe.value = !!ooh.value?.likedByMe
  } catch (e) {
    console.error(e)
    error.value = '데이터를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})

async function tryFetchComments() {
  const oohId = ooh.value.id
  try {
    const res = await api.get(`/comments/ooh-read/${oohId}`)
    const fromApi = Array.isArray(res.data)
      ? res.data
      : (Array.isArray(res.data?.comments) ? res.data.comments : null)

    if (Array.isArray(fromApi)) {
      ooh.value.comments = fromApi
      ooh.value.commentsTotal = fromApi.length
    } else {
      ooh.value.comments = Array.isArray(ooh.value.comments) ? ooh.value.comments : []
      ooh.value.commentsTotal = ooh.value.comments.length
    }
  } catch (err) {
    toastStore.showToast('[댓글 조회 실패 - detail.comments 사용]')
    ooh.value.comments = Array.isArray(ooh.value.comments) ? ooh.value.comments : []
    ooh.value.commentsTotal = ooh.value.comments.length
  }
}

async function fetchLikesCount() {
  const oohId = ooh.value.id
  try {
    const res = await api.get(`/likes/${oohId}/oohlikes-count`)
    likesCount.value = typeof res.data === 'number' ? res.data : (res.data?.count ?? 0)
  } catch (err) {
    console.warn('[좋아요 수 조회 실패]', err)
    likesCount.value = ooh.value?.likesCount ?? 0
  }
}

async function toggleLike() {
  const userId = ooh.value.userId
  if (!userId) 
    return toastStore.showToast('로그인이 필요합니다.')
  try {
    likedByMe.value = !likedByMe.value
    await api.get(`/likes/${userId}/ooh-like`, { params: { oohId: ooh.value.id } })
    await fetchLikesCount()
  } catch (err) {
    console.error(err)
    likedByMe.value = !likedByMe.value
    alert('좋아요 처리 실패')
  }
}

/* =========================
   [POST ACTIONS] 수정/삭제
   ========================= */
function onEdit() {
  if (!ooh.value?.id) return
  // 라우트 이름은 프로젝트에 맞게: 'OohEdit' 가정
  router.push({ name: 'UpdateOoh', params: { id: ooh.value.id } })
}

async function onDelete() {
  if (!ooh.value?.id) return
  if (!confirm('정말 이 글을 삭제하시겠어요?\n삭제 후에는 되돌릴 수 없습니다.')) return
  try {
    await api.delete(`/ooh/hardDeleteOoh/${ooh.value.id}`)          // 하드 딜리트
    alert('삭제되었습니다.')
    goList()
  } catch (e) {
    console.error('[Ooh 삭제 실패]', e?.response?.status, e?.response?.data || e)
    alert('삭제에 실패했습니다. 콘솔을 확인해주세요.')
  }
}
</script>

<style scoped>
.page{
  min-height:100vh;
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(255,255,255,.35), transparent 60%),
    radial-gradient(1200px 600px at 110% -10%, rgba(255,255,255,.35), transparent 60%),
    #f3ecd9;
  padding:28px 16px 88px;
  display:flex; flex-direction:column; align-items:center;
}
.back-link{
  align-self:flex-start; width:100%; max-width:960px;
  display:inline-flex; gap:8px; align-items:center;
  background:transparent; border:0; cursor:pointer;
  font-size:14px; color:#7a6f5b; opacity:.8;
  transition:opacity .15s ease, transform .15s ease;
}
.back-link:hover{ opacity:1; transform:translateX(-2px); }
.arrow{ font-weight:700; }

.card{
  width:100%; max-width:960px;
  background:#fffdf8;
  border:1px solid #efe6cf;
  border-radius:18px;
  padding:22px 24px;
  box-shadow: 0 12px 18px rgba(34,30,20,.05), 0 1px 0 rgba(34,30,20,.06) inset;
  transition:box-shadow .15s ease, border-color .15s ease, transform .15s ease;
}
.card:hover{
  border-color:#e8debf;
  box-shadow:0 16px 28px rgba(34,30,20,.08), 0 1px 0 rgba(34,30,20,.06) inset;
}
.card-header{
  display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:12px;
}
.author{ display:flex; align-items:center; gap:12px; }
.avatar-badge{
  width:38px; height:38px; border-radius:9999px;
  background:#7db67b; color:#fff; display:grid; place-items:center;
  font-weight:800; letter-spacing:.3px;
  box-shadow:0 1px 0 rgba(0,0,0,.04) inset;
}
.meta .name{ font-size:14.5px; font-weight:700; color:#32302c; }
.meta .date{ margin-top:2px; font-size:12px; color:#8b8577; }

/* [POST ACTIONS] 버튼 스타일 */
.post-actions{ display:flex; gap:8px; }
.post-actions .btn{
  padding:6px 10px; border-radius:10px; font-size:13px; cursor:pointer;
  border:1px solid transparent; background:#f8f6ee; color:#4a473f; font-weight:700;
  transition:transform .12s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;
}
.post-actions .btn:hover{ transform:translateY(-1px); box-shadow:0 6px 16px rgba(34,30,20,.08); }
.post-actions .btn.ghost{ border-color:#e6dcc2; background:#fff; }
.post-actions .btn.danger{ border-color:#f1c7c7; background:#fff6f6; color:#b03a37; }

.pill{
  padding:6px 12px; border-radius:9999px;
  background:#eaf5e9; color:#3e6a39; font-size:12px; font-weight:700;
  border:1px solid #d6ead4; letter-spacing:.2px; white-space:nowrap;
}

.card-body{ padding-top:8px; }
.title{ margin:6px 0 10px; font-size:22px; line-height:1.35; font-weight:800; color:#2c2a26; }
.content{
  white-space:pre-wrap; line-height:1.9; color:#3a3732;
  margin:12px 0 10px; font-size:15.5px;
}

.chips-group{
  display:grid; grid-template-columns:68px 1fr; gap:8px 12px; align-items:start; margin-top:14px;
}
.group-label{ font-size:12px; color:#8b8577; margin-top:6px; }
.chips{ display:flex; flex-wrap:wrap; gap:8px; }
.chip{ font-size:12px; padding:6px 10px; border-radius:9999px; background:#f5f1e4; border:1px solid #e7dfc6; color:#5e574b; }
.chip.tag{ background:#fff; border:1px dashed #d8cfae; }

.card-footer{
  margin-top:14px; padding-top:12px; border-top:1px solid #efe6cf;
  display:flex; align-items:center; gap:12px; color:#6f6758; font-size:14px;
}
.like-btn{
  display:inline-flex; align-items:center; justify-content:center;
  gap:0; padding:0 10px; border-radius:10px; border:1px solid #bfd7bc;
  background:#e6f2e4; color:#355c33; cursor:pointer; font-weight:700; line-height:1;
  text-align:center; transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
}
.like-btn:hover{ transform:translateY(-1px); box-shadow:0 6px 16px rgba(34,30,20,.08); }
.like-btn.active{ background:#d7eee3; border-color:#a7cfbb; }
.count{ display:inline-flex; align-items:center; gap:6px; }
.icon{ font-size:14px; line-height:1; }
.dot{ opacity:.45; }

.comments{
  width:100%; max-width:960px; margin-top:16px; padding:16px 20px;
  background:#fffdf8; border:1px solid #efe6cf; border-radius:16px;
  box-shadow:0 10px 18px rgba(34,30,20,.06);
}
.state{ margin-top:16px; color:#7a6f5b; }
.state.error{ color:#c0392b; }

@media (max-width: 640px){
  .card{ padding:18px; border-radius:14px; }
  .title{ font-size:20px; }
  .content{ font-size:15px; }
  .chips-group{ grid-template-columns:56px 1fr; }
  .post-actions .btn{ padding:6px 8px; font-size:12.5px; }
}
</style>
