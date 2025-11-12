<!-- src/views/OohEditView.vue -->
<template>
  <div class="page">
    <button class="back-link" type="button" @click="goBack">
      <span class="arrow">←</span> 돌아가기
    </button>

    <div class="card">
      <header class="card-header">
        <h1 class="title">기록 수정</h1>
        <div class="spacer"></div>
        <button class="btn ghost" type="button" @click="goDetail">취소</button>
        <button class="btn primary" type="button" @click="onSubmit" :disabled="submitting">
          {{ submitting ? '저장중…' : '저장' }}
        </button>
      </header>

      <section class="card-body">
        <label class="label">제목</label>
        <input class="input" v-model.trim="form.title" placeholder="제목을 입력하세요" />

        <label class="label">내용</label>
        <textarea class="textarea" v-model="form.content" placeholder="내용을 입력하세요"></textarea>

        <div class="grid-2">
          <div>
            <label class="label">감정 (쉼표로 구분)</label>
            <input class="input" v-model="emotionsText" placeholder="기쁨, 감사, 뿌듯함" />
            <p class="hint">예) 기쁨, 감사 → ['기쁨','감사']</p>
          </div>
          <div>
            <label class="label">태그 (샵 없이, 쉼표로 구분)</label>
            <input class="input" v-model="tagsText" placeholder="피드백, 협업, 성장" />
            <p class="hint">예) 피드백, 협업 → ['피드백','협업']</p>
          </div>
        </div>

        <div class="row">
          <label class="label">유형(Type)</label>
          <select class="select" v-model="form.type">
            <option value="">선택 없음</option>
            <option value="Ooh">Ooh</option>
            <option value="Oops">Oops</option>
          </select>
        </div>
      </section>

      <footer class="card-footer muted" v-if="error">
        <span class="error">{{ error }}</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/client'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id)
const loading = ref(false)
const submitting = ref(false)
const error = ref('')

const form = ref({
  title: '',
  content: '',
  type: '',        // 'Ooh' | 'Oops' 등
  emotions: [],    // string[]
  tags: []         // string[]
})

const emotionsText = computed({
  get: () => (form.value.emotions || []).join(', '),
  set: (v) => {
    form.value.emotions = String(v || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }
})
const tagsText = computed({
  get: () => (form.value.tags || []).join(', '),
  set: (v) => {
    form.value.tags = String(v || '')
      .split(',')
      .map(s => s.replace(/^#/, '').trim())
      .filter(Boolean)
  }
})

function goBack(){ router.back() }
function goDetail(){ router.push({ name: 'DetailOoh', params: { id: id.value } }) }

function normalizeDetail(d){
  return {
    title: d?.title ?? '',
    content: d?.content ?? '',
    type: d?.type ?? '',
    emotions: Array.isArray(d?.emotions) ? d.emotions : [],
    tags: Array.isArray(d?.tags) ? d.tags : []
  }
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get(`/ooh/${id.value}/detail`)
    Object.assign(form.value, normalizeDetail(data))
  } catch (e) {
    console.error('[편집 상세 조회 실패]', e?.response?.status, e?.response?.data || e)
    error.value = '편집을 위한 데이터를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})

/**
 * 저장 규칙
 * - 1순위: PUT /ooh/{id}
 * - 2순위(백엔드가 위 경로 없을 때): PUT /ooh/updateOoh/{id}
 * - body: { title, content, type, emotions, tags }
 */
async function onSubmit(){
  if (!form.value.title.trim()) return alert('제목을 입력해주세요.')
  if (!form.value.content.trim()) return alert('내용을 입력해주세요.')

  submitting.value = true
  error.value = ''
  const body = {
    title: form.title,
    content: form.content,
    tags: Array.isArray(form.tags) ? form.tags : [],        // ← null 방지
    emotions: Array.isArray(form.emotions) ? form.emotions : [], 
    isPrivate: form.isPrivate ?? 'N'
}

  try {
    // 1차 시도
    await api.put(`/ooh/updateOoh/${id.value}`, body, { headers: { 'Content-Type': 'application/json' } })
  } catch (e1) {
    // 2차 폴백
    try {
      await api.put(`/ooh/updateOoh/${id.value}`, body, { headers: { 'Content-Type': 'application/json' } })
    } catch (e2) {
      console.error('[편집 저장 실패]', e1?.response?.status, e1?.response?.data || e1, ' / fallback: ', e2?.response?.status, e2?.response?.data || e2)
      error.value = '저장에 실패했습니다. 콘솔을 확인해주세요.'
      submitting.value = false
      return
    }
  }

  alert('저장되었습니다.')
  router.push({ name: 'OohDetail', params: { id: id.value } })
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
}
.card-header{
  display:flex; align-items:center; gap:12px;
}
.title{ font-size:20px; font-weight:800; color:#2c2a26; }
.spacer{ flex:1 }
.btn{
  padding:8px 12px; border-radius:10px; font-size:13px; cursor:pointer;
  border:1px solid transparent; background:#f8f6ee; color:#4a473f; font-weight:700;
}
.btn.ghost{ border-color:#e6dcc2; background:#fff; }
.btn.primary{ border-color:#bfd7bc; background:#e6f2e4; color:#355c33; }
.card-body{ margin-top:12px; display:grid; gap:12px; }

.label{ font-size:13px; font-weight:700; color:#4a473f; margin-bottom:4px; }
.input, .textarea, .select{
  width:100%; border-radius:12px; border:1px solid #e4dbc1; background:#fff;
  padding:10px 12px; font-size:14px; color:#3a3732;
  transition: box-shadow .12s ease, border-color .12s ease;
}
.input:focus, .textarea:focus, .select:focus{
  outline:none; box-shadow:0 0 0 3px rgba(125,182,123,.15); border-color:#cfe3cd;
}
.textarea{ min-height:160px; resize:vertical; }
.grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.hint{ margin-top:4px; font-size:12px; color:#8b8577; }

.card-footer.muted{ margin-top:10px; font-size:13px; color:#8b8577; }
.error{ color:#b03a37; }

@media (max-width: 640px){
  .grid-2{ grid-template-columns:1fr; }
  .btn{ padding:7px 10px; }
}
</style>
