<!-- src/views/OohView.vue -->
<template>
  <div class="ooh-view">
    <!-- 상단 -->
    <div class="top">
      <button class="back" type="button" @click="router.back()">
        <span class="arrow"></span><span class="back-text">돌아가기</span>
      </button>
            <!-- 기록 버튼 -->
      <button
        v-if="canWrite"
        type="button"
        class="write-btn"
        @click="goWrite"
      >
        + 기록 작성
      </button>

      <h1 class="title">Ooh_Log</h1>
      <p class="subtitle">작은 성취를 함께 축하하는 공간</p>

      <!-- 검색바 (RecordSearchBar 재사용) -->
      <RecordSearchBar
        v-model="keyword"
        :busy="loading"
        placeholder="제목, 내용으로 검색…"
        @search="searchNow"
      />

      <p style="margin-top:8px">검색어: {{ keyword }}</p>
    </div>

    <!-- 목록 -->
    <section class="list">
        <RecordCard
          v-for="p in items"
          :key="p.id"
          :post="p"
          record-type="ooh"
          :fetch-likes="true"
          @update:likes="val => p.likes = val"
          @click="() => goDetail(p.id)"  
        />

      <div v-if="loading" class="skeleton"></div>
      <div v-if="error" class="error">
        {{ error }}
        <button class="retry" @click="loadNext(keyword)">다시 시도</button>
      </div>
      <div v-if="!loading && items.length === 0 && !error" class="empty">게시글이 없습니다.</div>

      <!-- 무한스크롤 센티넬 -->
      <div ref="sentinel" class="sentinel"></div>
    </section>
      <router-view />
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import RecordCard from '../record/RecordCard.vue'
import RecordSearchBar from '../record/RecordSearchBar.vue'
import { fetchOohList } from '../api/ooh'
import { useToastStore } from "@/stores/useToast";
import { useUserStore } from "@/stores/useUserInfo";

const userStore = useUserStore()
const toastStore = useToastStore();

// const currentUserId = computed(() => Number(userStore.id || 0))
// const isLoggedIn   = computed(() => !!userStore.token && currentUserId.value > 0)

const canWrite = ref(true)
function goWrite() {             
  if (!userStore.token) {
    toastStore.showToast("로그인이 필요합니다.")
    router.push({ name: 'Login' })
    return
  }
  router.push({ name: 'InsertOoh' })
}

function goDetail(id) {
  try {
    router.push({ name: 'DetailOoh', params: { id: String(id) } })
  } catch (e) {
    console.warn('라우터가 이상합니다.', e)
    router.push({ path: `/ooh/${id}/detail` })
  }
}

const router = useRouter()

/* 검색어 */
const keyword = ref('')

/* 목록 상태 */
const items = ref([])
const page = ref(1)
const size = ref(10)
const hasNext = ref(true)
const loading = ref(false)
const error = ref('')

/* 무한스크롤 */
const sentinel = ref(null)
let observer = null

/* ---------- 응답 어댑터 & 필드 매핑 ---------- */
// 어떤 백엔드 포맷이 와도 { list, hasNextPage }로 통일
function adaptListResponse(data) {
  // HTML이 오면 프록시 문제로 간주
  if (typeof data === 'string') {
    const s = data.trim().toLowerCase()
    if (s.startsWith('<!doctype') || s.startsWith('<html')) {
      throw new Error('API 대신 HTML이 응답으로 왔습니다. Vite 프록시 또는 baseURL 확인 필요.')
    }
    try { data = JSON.parse(data) } catch { /* ignore */ }
  }

  // 1) 배열
  if (Array.isArray(data)) {
    return { list: data, hasNextPage: data.length >= size.value }
  }
  // 2) Spring Data style
  if (data?.content) {
    return { list: data.content, hasNextPage: data.last === false }
  }
  // 3) 커스텀(oohList/hasNextPage)
  if (data?.oohList) {
    return { list: data.oohList, hasNextPage: !!data.hasNextPage }
  }
  // 4) 범용(list/items/rows)
  const list = data?.list ?? data?.items ?? data?.rows ?? []
  const hasNextPage = data?.hasNextPage ?? false
  return { list, hasNextPage }
}

// 각 항목을 카드에서 쓰는 표준 형태로 변환
function normalizeItem(it) {
  const pick = (...keys) => keys.find(k => it?.[k] !== undefined)
    ? it[keys.find(k => it?.[k] !== undefined)]
    : undefined
  const id        = pick('id', 'oohId', 'ooh_id')
  const title     = pick('oohTitle', 'title', 'ooh_title')
  const body      = pick('oohContent', 'content', 'ooh_content', 'text', 'body')
  const isPrivate = pick('oohIsPrivate', 'isPrivate', 'ooh_is_private') === 'Y'
  const createdAt = pick('oohCreateDate', 'createdAt', 'createDate', 'create_time')
  const name      = pick('name', 'writerName', 'authorName', 'nickname') || '익명'
  const tags      = pick('tagNames', 'tags', 'tag_names') || []
  const likes     = pick('likeCount', 'likes', 'like_count') ?? 0

  return { id, userName: name, title, content: body, isPrivate, createdAt, tags, likes }
}
/* ------------------------------------------- */

/* 목록 로드 (검색어 q 적용) */
async function loadNext(q = '') {
  if (loading.value || !hasNext.value) return
  loading.value = true
  error.value = ''

  try {
    const raw = await fetchOohList({ page: page.value, size: size.value, title: q, content: q })
    // console.log('[/ooh/all]', raw) // 필요 시 살리기
    const { list, hasNextPage } = adaptListResponse(raw)
    const mapped = list.map(normalizeItem)
    items.value.push(...mapped)
    hasNext.value = hasNextPage
    page.value += 1
  } catch (e) {
    console.error(e)
    error.value = 'Ooh 목록을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

/* 검색 실행: 목록 초기화 후 첫 페이지 재조회 */
function searchNow(q) {
  keyword.value = q ?? keyword.value
  page.value = 1
  hasNext.value = true
  items.value = []
  loadNext(keyword.value)
}

/* (선택) 입력 변화에 따른 디바운스 자동검색 */
let timer
watch(keyword, (q) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    page.value = 1; hasNext.value = true; items.value = []
    loadNext(q)
  }, 300)
})

/* 무한스크롤: 검색어 유지하여 추가 페이지 요청 */
onMounted(async () => {
  await loadNext(keyword.value)

  observer = new IntersectionObserver(async ([entry]) => {
    if (entry.isIntersecting) await loadNext(keyword.value)
  }, { root: null, rootMargin: '400px 0px', threshold: 0 })

  await nextTick()
  if (sentinel.value) observer.observe(sentinel.value)
})

onBeforeUnmount(() => {
  if (observer && sentinel.value) observer.unobserve(sentinel.value)
})

/* 카드 액션 (원하면 실제 API 연결) */
function onLike(post)   { console.log('like', post.id) }
function onBookmark(p)  { console.log('bookmark', p.id) }
function onMeToo(p)     { console.log('meToo', p.id) }
</script>

<style scoped>
:root {
  --bg:#f6f1e0; --ink:#55433b; --soft:#eae4cf; --borderSoft: rgba(136,170,130,.25);
}
.ooh-view{
  width: 896px;
  margin: 0 auto;
  padding-top: 88px;
  color: var(--ink);
  background: var(--bg);
}

.top{ margin-bottom: 18px; position: relative; }
.back{
  display:flex; align-items:center; gap:8px; margin-bottom:10px;
  background:none; border:0; cursor:pointer; color:var(--ink);
}
.arrow{ width:8px; height:8px; border-left:2px solid var(--ink); border-bottom:2px solid var(--ink); transform:rotate(45deg); }
.back-text{ font-size:16px; line-height:24px; }

.title{ font-size:44px; line-height:62px; letter-spacing:.6px; font-weight:700; }
.subtitle{ margin-top:4px; opacity:.7; font-size:16px; letter-spacing:.1px; }

.list{ display:flex; flex-direction:column; gap:14px; }
.skeleton{
  height:120px; border:1px solid var(--borderSoft); border-radius:10px;
  background:linear-gradient(90deg, rgba(136,170,130,.08), rgba(136,170,130,.12), rgba(136,170,130,.08));
  background-size:200% 100%; animation:shimmer 1.2s infinite linear;
}
@keyframes shimmer{ 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
.error{ padding:12px; border:1px solid rgba(200,0,0,.25); border-radius:8px; background:rgba(200,0,0,.05); }
.retry{ margin-left:8px; background:none; border:0; text-decoration:underline; cursor:pointer; color:var(--ink); }
.empty{ text-align:center; padding:24px; opacity:.7; }
.sentinel{ height:1px; }

.write-btn{
  position: absolute; right: 0; top: 18px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--borderSoft);
  background: #f0f4ec;
  color: var(--ink);
  font-weight: 600; letter-spacing: .2px;
  cursor: pointer; box-shadow: 0 1px 0 rgba(0,0,0,.02);
}
.write-btn:hover{ filter: brightness(0.98); }
.write-btn:active{ transform: translateY(1px); }
</style>
