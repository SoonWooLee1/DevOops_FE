<template>
  <main class="wrap">
    <h1 class="title">Ooh 기록 작성</h1>

    <!-- 공개/비공개 -->
    <section class="field">
      <label class="label">공개 설정</label>
      <div class="row">
        <label class="radio">
          <input type="radio" value="N" v-model="form.oohIsPrivate" />공개
        </label>
        <label class="radio">
          <input type="radio" value="Y" v-model="form.oohIsPrivate" />비공개
        </label>
      </div>
    </section>

    <!-- 제목 -->
    <section class="field">
      <label class="label" for="title">제목</label>
      <input id="title" class="input" v-model.trim="form.oohTitle" placeholder="제목을 입력하세요" />
    </section>

    <!-- 태그 (ooh용, 최대 3개) -->
    <section class="field">
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
    </section>

    <!-- 감정 분석 -->
    <section class="field">
            <AiAnalyze :text="form.oohContent" />

      <div class="count">{{ (form.oohContent || '').length }}자</div>
    </section>

    <div class="actions">
      <!-- ✅ ‘초기화’ → ‘취소’로 변경 (뒤로가기) -->
      <button class="btn ghost" @click="onCancel">취소</button>
      <!-- ✅ 연한 연두색 버튼 -->
      <button class="btn primary" :disabled="busy" @click="submit">
        {{ busy ? '저장 중…' : '등록' }}
      </button>
    </div>


  </main>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserInfo' // 회원 정보 저장한거 가져오기
import { useToastStore } from "@/stores/useToast";
import { createOoh } from '../api/ooh'
import { fetchOohTagOptions } from '../api/tag'
import AiAnalyze from '../common/AiAnalyze.vue'   // AI 답변

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore();

// 로그인/사용자 식별
const currentUserId = computed(() => Number(userStore.id || 0))

// 태그만 로드 (로그인 가드는 OohView가 이미 처리)
onMounted(async () => {
  try {
    tagOptions.value = await fetchOohTagOptions()
  } catch {
    toastStore.showToast("태그를 불러오지 못했습니다.")
  }
})

const form = reactive({
  oohIsPrivate: 'N', // 공개: 'N', 비공개: 'Y'
  oohTitle: '',
  oohContent: '',
})

const tagOptions = ref([])       // [{id, name}]
const selectedTagIds = ref([])   // number[]
const busy = ref(false)
const errorMsg = ref('')



function toggleTag(tagId) {
  const numId = Number(tagId)
  const i = selectedTagIds.value.indexOf(numId)
  if (i >= 0) selectedTagIds.value.splice(i, 1)
  else if (selectedTagIds.value.length < 3) selectedTagIds.value.push(numId)
  else toastStore.showToast('태그는 최대 3개까지만 선택 가능합니다.')
}

function validate() {

  if (!form.oohTitle) 
    return toastStore.showToast('제목은 필수입니다.')
  if (!form.oohContent) 
    return toastStore.showToast('내용은 필수입니다.')
  if (selectedTagIds.value.length > 3) 
    return toastStore.showToast('태그는 최대 3개까지만 선택 가능합니다.')
  if (form.oohIsPrivate !== 'Y' && form.oohIsPrivate !== 'N')
    return toastStore.showToast('공개 설정 값이 올바르지 않습니다.')
  return ''
}

async function submit() {
  errorMsg.value = ''
  const v = validate()
  if (v) return

  busy.value = true
  try {
    await createOoh({
      oohUserId: currentUserId.value,
      oohTitle: form.oohTitle,
      oohContent: form.oohContent,
      oohIsPrivate: form.oohIsPrivate,
      tagIds: selectedTagIds.value.map(Number), // 숫자 보장
    })
    toastStore.showToast('등록 완료!')
    router.push({ name: 'oohList' }) // 목록으로 이동(이름/경로 맞춰주세요)
  } catch (e) {
    console.error(e)
    const msg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      '등록에 실패했습니다.'
    toastStore.showToast(msg)
  } finally {
    busy.value = false
  }
}

function onCancel() {
  router.back()
}
</script>

<style scoped>
:root { --ink:#55433B; --green:#88AA82; }

/* 연한 연두색 */
:root { --light-green: #D8F1D5; }

.wrap{ max-width:720px; margin:0 auto; padding:24px }
.title{ font-size:20px; color:var(--ink); margin-bottom:14px }
.field{ margin-bottom:16px }
.label{ display:block; margin-bottom:8px; color:var(--ink); font-weight:600 }
.row{ display:flex; gap:10px; align-items:center }
.radio{ display:flex; gap:6px; align-items:center; color:var(--ink) }
.input,.textarea{
  width:100%; border:1px solid rgba(136,170,130,.45); border-radius:10px; padding:10px 12px; color:var(--ink);
}
.input:focus,.textarea:focus{ box-shadow:0 0 0 3px rgba(136,170,130,.18) }
.textarea{ resize:vertical }
.count{ text-align:right; color:var(--ink); opacity:.55; font-size:12px; margin-top:6px }
.tags{ display:flex; flex-wrap:wrap; gap:8px }
.tag{
  border:1px solid var(--green); padding:6px 12px; border-radius:9999px;
  background:#fff; color:var(--ink); font-size:13px; cursor:pointer;
}
.tag.active{ background:rgba(136,170,130,.15) }

/* 버튼 */
.btn{
  border:1px solid var(--green);
  padding:8px 12px; border-radius:10px;
  color:#fff; background:var(--green);
}
.btn.ghost{
  background:#fff; color:var(--ink);
  border-color:rgba(136,170,130,.45)
}
/* ✅ 등록 버튼을 연한 연두색으로 */
.btn.primary{
  background: var(--light-green);
  color: #234;                 /* 대비 확보 */
  border-color: var(--light-green);
}
.btn:disabled{ opacity:.4; cursor:not-allowed }
.actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:18px }
.hint{ font-size:12px; color:var(--ink); opacity:.6; margin-top:6px }
.error{ color:#b00020; margin-top:8px }
</style>
