<!-- src/views/OopsEditView.vue -->
<template>
  <div class="page">
    <button class="back-link" type="button" @click="goBack">
      <span class="arrow">←</span> 돌아가기
    </button>

    <div class="card">
      <header class="card-header">
        <h1 class="title">기록 수정</h1>
        <div class="spacer"></div>
        <button class="btn ghost" type="button" @click="router.back()">취소</button>
        <button class="btn primary" type="button" @click="onSubmit" :disabled="submitting">
          {{ submitting ? '저장중…' : '저장' }}
        </button>
      </header>

      <section class="card-body">
        <!-- 제목 -->
        <label class="label">제목</label>
        <input class="input" v-model.trim="form.title" placeholder="제목을 입력하세요" />

        <!-- 내용 -->
        <label class="label">내용</label>
        <textarea class="textarea" v-model="form.content" placeholder="내용을 입력하세요"></textarea>

        <!-- 공개/비공개 -->
        <div class="row" style="margin-top:8px">
          <label class="label" style="margin:0 12px 0 0">공개 설정</label>
          <label class="radio"><input type="radio" value="N" v-model="form.isPrivate" />공개</label>
          <label class="radio"><input type="radio" value="Y" v-model="form.isPrivate" />비공개</label>
        </div>

        <!-- 태그(등록 화면처럼 버튼 선택, 최대 3개) -->
        <div class="field" style="margin-top:12px">
          <label class="label">태그 (최대 3개)</label>
          <div class="tags">
            <button
              v-for="t in tagOptions"
              :key="t.id"
              type="button"
              class="tag"
              :class="{ active: selectedTagIds.includes(Number(t.id)) }"
              @click="toggleTag(t.id)"
            >
              #{{ t.name }}
            </button>
          </div>
          <p class="hint">선택: {{ selectedTagIds.length }} / 3</p>
        </div>
      </section>

      <footer class="card-footer muted" v-if="error">
        <span class="error">{{ error }}</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
// import & store/router
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '@/stores/useToast'
import { useUserStore } from '@/stores/useUserInfo'

// API
import { fetchOopsDetail, updateOops } from '../api/oops'
import { fetchOopsTagOptions } from '../api/tag'

// route/store
const route = useRoute()
const router = useRouter()
const toast = useToastStore()

// 토큰 담을 것
const userStore = useUserStore()
const token = userStore.token;  
// state
const id = computed(() => Number(route.params.id))
const loading = ref(false)
const submitting = ref(false)
const error = ref('')

// form
const form = ref({
  title: '',
  content: '',
  isPrivate: 'N'
})

// 태그 선택(등록 화면과 동일한 방식)
const tagOptions = ref([])        // [{id, name, tagType}]
const selectedTagIds = ref([])    // number[]

// 라우팅
function goBack(){ router.back() }

// 상세 → 화면 바인딩
function normalizeDetail(d){
  return {
    title: d?.title ?? d?.oopsTitle ?? '',
    content: d?.content ?? d?.oopsContent ?? '',
    isPrivate: (d?.isPrivate ?? d?.is_private ?? d?.oopsIsPrivate ?? 'N'),
     // 백엔드가 ["피드백","협업"] 으로 주는 형태 가정
    tagsByName: Array.isArray(d?.tags) ? d.tags :
                Array.isArray(d?.tagNames) ? d.tagNames : []
  }
}

// 버튼 토글
function toggleTag(tagId){
  const n = Number(tagId)
  const i = selectedTagIds.value.indexOf(n)
  if (i >= 0) selectedTagIds.value.splice(i,1)
  else if (selectedTagIds.value.length < 3) selectedTagIds.value.push(n)
  else toast.showToast('태그는 최대 3개까지만 선택 가능합니다.')
}

// 초기 로드(상세 + 옵션, 그리고 이름→id 매칭)
onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const [detail, options] = await Promise.all([
      fetchOopsDetail(id.value, 10, token),
      fetchOopsTagOptions()
    ])
    tagOptions.value = options

    const norm = normalizeDetail(detail)
    form.value.title = norm.title
    form.value.content = norm.content
    form.value.isPrivate = norm.isPrivate

    // 기존 태그명 -> id 매칭 (옵션에 없는 이름은 무시)
    const nameToId = new Map(options.map(o => [String(o.name).trim(), Number(o.id)]))
    selectedTagIds.value = norm.tagsByName
      .map(nm => nameToId.get(String(nm).trim()))
      .filter(v => typeof v === 'number' && !Number.isNaN(v))
      .slice(0,3)
  } catch (e) {
    console.error('[편집 데이터 로드 실패]', e)
    error.value = '편집 데이터를 불러오지 못했습니다.'
    toast.showToast(error.value)
  } finally {
    loading.value = false
  }
})

// 저장
async function onSubmit(){
  if (!form.value.title.trim()) return toast.showToast('제목을 입력해주세요.')
  if (!form.value.content.trim()) return toast.showToast('내용을 입력해주세요.')

  submitting.value = true
  try {
    await updateOops(
      id.value,
      {
        oopsTitle: form.value.title,
        oopsContent: form.value.content,
        oopsIsPrivate: form.value.isPrivate,
        tagIds: selectedTagIds.value.map(Number)
      },
      token // ← 헤더로 전달
    )
    toast.showToast('수정되었습니다.')
    router.push({ name: 'DetailOops', params: { id: id.value } })
  } catch (e) {
    console.error('[저장 실패]', e?.response?.status, e?.response?.data || e)
    toast.showToast('수정에 실패했습니다.')
  } finally {
    submitting.value = false
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
}
.card-header{ display:flex; align-items:center; gap:12px; }
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
}
.textarea{ min-height:160px; resize:vertical; }

.row{ display:flex; gap:12px; align-items:center; }
.radio{ display:flex; gap:6px; align-items:center; color:#3a3732 }

.tags{ display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; }
.tag{
  border:1px solid #88AA82; padding:6px 12px; border-radius:9999px;
  background:#fff; color:#55433B; font-size:13px; cursor:pointer;
}
.tag.active{ background:rgba(136,170,130,.15) }

.hint{ font-size:12px; color:#7a6f5b; opacity:.7; margin-top:6px; }

.card-footer.muted{ margin-top:10px; font-size:13px; color:#8b8577; }
.error{ color:#b03a37; }
</style>