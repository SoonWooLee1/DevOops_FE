<template>
  <div class="page">
    <button class="back-link" type="button" @click="goList">
      <span class="arrow">←</span> 돌아가기
    </button>

    <div class="card" v-if="oops">
      <header class="card-header">
        <div class="author">
          <div class="avatar-badge">{{ avatarInitial }}</div>
          <div class="meta">
            <div class="name">{{ oops.userName }}</div>
            <div class="date">{{ formattedDate }}</div>
          </div>
        </div>

        
      
        <div class="post-actions">
          <!-- ✅ 내 글일 때만 노출 -->
          <div class="post-actions" v-if="canManage">
            <button class="btn ghost" type="button" @click="onEdit">수정</button>
            <button class="btn danger" type="button" @click="onDelete">삭제</button>
          </div>
        </div>
      </header>

      <section class="card-body">
        <h1 class="title">{{ oops.title }}</h1>
        <p class="content" v-if="oops.content">{{ oops.content }}</p>

                <!-- AI 답변 -->
        <div class="ai-answer" v-if="aiAnswer">
          <div class="ai-chip">AI 피드백</div>
          <p class="ai-text">{{ aiAnswer }}</p>
        </div>

        <div class="chips-group" v-if="normalizedEmotions.length">
          <div class="group-label">감정</div>
            <div class="chips">
              <span class="chip" v-for="(e, i) in normalizedEmotions" :key="'emo-'+i">{{ e }}</span>
            </div>
        </div>

        <div class="chips-group" v-if="normalizedTags.length">
          <div class="group-label">태그</div>
            <div class="chips">
              <span class="chip tag" v-for="(t, i) in normalizedTags" :key="'tag-'+i">#{{ t }}</span>
            </div>
          </div>
      </section>

      <footer class="card-footer">
        <button class="like-btn" :class="{ active: likedByMe }" @click="toggleLike">
        <img v-if="!likedByMe" src="/defaultHeart.png" alt="좋아요" style="width:20px; height:20px;">
        <img v-if="likedByMe" src="/fullheart.png" alt="좋아요" style="width:20px; height:20px;">
        </button>
        <div class="dot">•</div>
        <div class="count"><span class="icon">좋아요</span> {{ likesCount }}</div>
        <div class="dot">•</div>
        <div class="count"><span class="icon">댓글</span> {{ totalComments }}</div>
      </footer>
    </div>

    <!-- 댓글 컴포넌트 -->
    <section v-if="USE_NOTICE_COMMENTS" class="comments">
      <OopsComments
        v-if="oops"
        :oops-id="oops.id"
        :initial-comments="oops.comments"
        @update:list="(l) => { if(oops){ oops.comments = l } }"
        @update:count="(n) => { if(oops){ oops.commentsTotal = n } }"
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
import OopsComments from '../record/OopsComments.vue'
import { useToastStore } from "@/stores/useToast";
import { useUserStore } from "@/stores/useUserInfo"; 
import { pushOopsLikes, checkOopsLikesExist } from '../api/likes'

const toastStore = useToastStore();
const userStore  = useUserStore(); 
const token = userStore.token;  

const USE_NOTICE_COMMENTS = true

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const oops = ref(null)

const likesCount = ref(0)
const likedByMe  = ref(false)

const newComment     = ref('')
const editCommentId  = ref(null)
const editContent    = ref('')


// ✅ 현재 로그인한 유저 ID
const currentUserId = computed(() => Number(userStore.id || 0))
//AI 답변
const aiAnswer = computed(() => oops.value?.aiAnswer ?? oops.value?.ai_answer ?? '')
// ✅ 태그 배열: ["목표달성"] 또는 [{tagName:"목표달성"}] 모두 허용

const normalizedTags = computed(() => {
  const src = oops.value?.tags ?? []
  if (!Array.isArray(src)) return []
  return src
    .map(t => typeof t === 'string'
      ? t
      : (t.tagName ?? t.tag_name ?? t.name ?? t.value ?? ''))
    .filter(Boolean)
})

// ✅ 감정 배열: ["기쁨"] 또는 [{name:"기쁨"}] 모두 허용
const normalizedEmotions = computed(() => {
  const src = oops.value?.emotions ?? oops.value?.emo ?? oops.value?.emotionList ?? []
  if (!Array.isArray(src)) return []
  return src
    .map(e => typeof e === 'string' ? e : (e.name ?? e.value ?? ''))
    .filter(Boolean)
})


// ✅ 내 글인지 여부: 글의 작성자(oops.userId)와 현재 사용자 비교
const isMine = computed(() => {
  const postOwner = Number(oops.value?.userId || 0)
  return postOwner > 0 && currentUserId.value > 0 && postOwner === currentUserId.value
})

// ✅ 관리자 여부 (store 구조가 팀마다 달라서 케이스 넓게 커버)
const isAdmin = computed(() => {
  const single = userStore.role || userStore.userRole || userStore.user?.role
  const list   = userStore.roles || userStore.user?.roles || userStore.authorities || []
  const norm = (x) => {
    if (!x) return ''
    if (typeof x === 'string') return x
    return x.authority || x.name || ''
  }
  const hasAdmin = (r) => {
    const v = norm(r).toUpperCase()
    return v === 'ADMIN' || v === 'ROLE_ADMIN'
  }
  return hasAdmin(single) || (Array.isArray(list) && list.some(hasAdmin))
})

// ✅ 수정/삭제 가능 조건: 내 글이거나 관리자
const canManage = computed(() => isMine.value || isAdmin.value)

const goList = () => router.push({ name: 'Oops' })
const typeLabel = computed(() => {
  if (!oops.value?.type) return ''
  const t = String(oops.value.type)
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
})

const formattedDate = computed(() => oops.value?.createDate ? formatDate(oops.value.createDate) : '')
const avatarInitial = computed(() => oops.value?.userName ? oops.value.userName[0] : '유')
const totalComments = computed(() => oops.value?.commentsTotal ?? (oops.value?.comments?.length || 0))


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

async function checkLikeExist() {
  try {
    const response = await checkOopsLikesExist(oops.value.id, token);
    if (response == "exist") {
                likedByMe.value = true;
            } else {
                likedByMe.value = false;
            }
  } catch(err) {
    console.error(err);
    likedByMe.value = false;
    toastStore.showToast('좋아요 여부 처리 실패');
  }
}

onMounted(async () => {
  const id = route.params.id
  loading.value = true
  try {
    const detail = await api.get(`/oops/${id}/detail`)
    const raw = detail.data || {}

    // ✅ 작성자/닉네임 정규화
    raw.userId   = raw.userId ?? raw.oopsUserId ?? raw.writerId ?? 0
    raw.userName = raw.userName ?? raw.writerName ?? raw.nickname ?? '익명'

    // ✅ AI 답변 정규화 (DDL: ai_answer → 프론트: aiAnswer)
    raw.aiAnswer = raw.aiAnswer ?? raw.ai_answer ?? raw.aiFeedback ?? raw.ai_feedback ?? raw.aiComment ?? raw.ai_comment ?? ''

    oops.value = raw

    if (!Array.isArray(oops.value.comments)) {
      oops.value.comments = []
      oops.value.commentsTotal = 0
    }

    await tryFetchComments()
    await fetchLikesCount()
    checkLikeExist();
  } catch (e) {
    console.error(e)
    toastStore.showToast('데이터를 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
})

async function tryFetchComments() {
  const oopsId = oops.value.id
  try {
    const res = await api.get(`/comments/oops-read/${oopsId}`)
    const fromApi = Array.isArray(res.data)
      ? res.data
      : (Array.isArray(res.data?.comments) ? res.data.comments : null)

    if (Array.isArray(fromApi)) {
      oops.value.comments = fromApi
      oops.value.commentsTotal = fromApi.length
    } else {
      oops.value.comments = Array.isArray(oops.value.comments) ? oops.value.comments : []
      oops.value.commentsTotal = oops.value.comments.length
    }
  } catch (err) {
    toastStore.showToast('[댓글 조회 실패 - detail.comments 사용]')
    oops.value.comments = Array.isArray(oops.value.comments) ? oops.value.comments : []
    oops.value.commentsTotal = oops.value.comments.length
  }
}

async function fetchLikesCount() {
  const oopsId = oops.value.id
  try {
    const res = await api.get(`/likes/${oopsId}/oopslikes-count`)
    likesCount.value = typeof res.data === 'number' ? res.data : (res.data?.count ?? 0)
  } catch (err) {
    console.warn('[좋아요 수 조회 실패]', err)
    toastStore.showToast('좋아요 수 조회에 실패했습니다.') 
    likesCount.value = oops.value?.likesCount ?? 0
  }
}

async function toggleLike() {
  const userId = oops.value.userId
  console.log("좋아요를 위한 oops기록자 ID:", userId)
  console.log("토큰:", token);
  console.log("로그인사용자:", userStore.id);
  if (!userId) 
    return toastStore.showToast('로그인이 필요합니다.')
  if (userStore.id == userId) return toastStore.showToast('본인의 기록에는 좋아요를 누를 수 없습니다.')
  try {
    const response = await pushOopsLikes(oops.value.id, token);

    console.log("response:", response);
    if (response == "likes created") {
                likedByMe.value = true;
            } else {
                likedByMe.value = false;
            }
            console.log("likedByme", likedByMe.value);
    await fetchLikesCount()
  } catch (err) {
    console.error(err)
    likedByMe.value = false;
    toastStore.showToast('좋아요 처리 실패')
  }
}
/* =========================
   [POST ACTIONS] 수정/삭제
   ========================= */
function onEdit() {
  if (!oops.value?.id) return
  // 라우트 이름은 프로젝트에 맞게: 'OopsEdit' 가정
  router.push({ name: 'UpdateOops', params: { id: oops.value.id } })
}

async function onDelete() {
  if (!oops.value?.id) return
  if (!confirm('정말 이 글을 삭제하시겠어요?\n삭제 후에는 되돌릴 수 없습니다.')) return
  try {
    await api.delete(`/oops/hardDeleteOops/${oops.value.id}`) // 하드 딜리트
    toastStore.showToast('삭제되었습니다.')
    goList()
  } catch (e) {
    console.error('[Oops 삭제 실패]', e?.response?.status, e?.response?.data || e)
    toastStore.showToast('삭제에 실패했습니다. 콘솔을 확인해주세요.')
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
  background: none; border: none; transform:translateY(3px);
}
.like-btn:hover{ transform:translateY(2px); }
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


.ai-answer{
  margin:14px 0 6px;
  padding:14px 16px;
  background:#f4fbf3;
  border:1px solid #d7edd4;
  border-radius:12px;
  box-shadow:0 1px 0 rgba(0,0,0,.02) inset;
}
.ai-chip{
  display:inline-block;
  font-size:11.5px;
  font-weight:800;
  color:#2f5c2d;
  background:#e6f5e4;
  border:1px solid #cfe7cc;
  padding:4px 8px;
  border-radius:9999px;
  margin-bottom:8px;
  letter-spacing:.2px;
}
.ai-text{
  white-space:pre-wrap;
  color:#2f2d2a;
  line-height:1.8;
  font-size:14.5px;
}
</style>
