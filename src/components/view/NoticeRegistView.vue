<template>
  <div class="notice-wrap">
    <button class="go-back" @click="goBack">← 돌아가기</button>

    <h1 class="title">공지사항 작성</h1>
    <p class="subtitle">새로운 공지사항을 작성하여 사용자들에게 전달하세요</p>

    <!-- 제목 -->
    <label class="label">제목</label>
    <input
      v-model.trim="form.title"
      type="text"
      placeholder="공지사항 제목을 입력하세요"
      class="input"
    />

    <!-- 내용 -->
    <label class="label">내용</label>
    <textarea
      v-model="form.content"
      rows="14"
      placeholder="공지사항 내용을 입력하세요

[ 섹션 제목 ] 을 사용하여 내용을 구조화할 수 있습니다"
      class="textarea"
    ></textarea>

    <div class="toolbar">
      <div class="toolbar-left">
        <button class="tool-btn" @click="insertSectionTitle">[ 섹션 제목 ] 삽입</button>
        <button class="tool-btn" @click="insertDivider">구분선(—) 삽입</button>
      </div>
      <span class="char-count">현재 글자 수: {{ contentCount }}자</span>
    </div>

    <!-- 공지 옵션 -->
    <div class="option-box">
      <p class="option-title">공지 옵션</p>

      <label class="option-item">
        <input v-model="form.pinTop" type="checkbox" />
        <span>상단 고정 (가장 위에 표시됩니다)</span>
      </label>

      <label class="option-item">
        <input v-model="form.important" type="checkbox" />
        <span>중요 공지 (강조 표시됩니다)</span>
      </label>
    </div>

    <!-- 버튼 -->
    <div class="action-box">
      <button
        class="btn-save"
        :disabled="submitting || !canSubmit"
        @click="handleSubmit"
      >
        {{ submitting ? '저장 중…' : '공지사항 저장' }}
      </button>

      <button class="btn-cancel" @click="cancel">취소</button>
    </div>

    <p v-if="error" class="error-msg">⚠️ {{ error }}</p>
    <p v-if="saved" class="success-msg">✓ 저장되었습니다.</p>
  </div>
</template>


<script setup>
import { reactive, ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { createNotice } from '../api/notice' // 아래 createNotice 추가 코드 참고

const router = useRouter()

// 로그인 사용자 ID 가져오기 (프로젝트 방식에 맞게 교체)
// ex) pinia authStore, vuex, cookie 등
const getCurrentUserId = () => {
  const v = localStorage.getItem('userId') || localStorage.getItem('memberId')
  return v ? Number(v) : 1 // 기본값 1
}

const form = reactive({
  title: '',
  content: '',
  pinTop: false,
  important: false,
})

const contentCount = computed(() => form.content.length)
const canSubmit = computed(() => form.title.trim().length > 0 && form.content.trim().length > 0)

const submitting = ref(false)
const error = ref('')
const saved = ref(false)
let dirty = false

const stop = watch(form, () => { dirty = true }, { deep: true })
onBeforeUnmount(() => stop && stop())

// 새로고침/닫기 방지
window.addEventListener('beforeunload', (e) => {
  if (dirty && !saved.value) {
    e.preventDefault()
    e.returnValue = ''
  }
})

function goBack() {
  router.back()
}

function cancel() {
  if (!dirty || confirm('작성 중인 내용이 사라집니다. 취소할까요?')) {
    router.back()
  }
}

function insertSectionTitle() {
  form.content += (form.content.endsWith('\n') || form.content === '' ? '' : '\n') + '[ 섹션 제목 ]\n'
}
function insertDivider() {
  form.content += (form.content.endsWith('\n') || form.content === '' ? '' : '\n') + '— — — — —\n'
}

async function handleSubmit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  error.value = ''

  try {
    const payload = {
      noticeUserId: getCurrentUserId(),
      title: form.title,
      content: form.content,
    }
    await createNotice(payload)
    saved.value = true
    dirty = false
    router.back() // or router.push({ name: 'notice-list' })
  } catch (e) {
    console.error('[NOTICE CREATE ERROR]', e)
    error.value = '저장에 실패했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    submitting.value = false
  }
}
</script>
<style scoped>
.notice-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 0;
}

.go-back {
  margin-bottom: 24px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  background: none;
  border: none;
}

.go-back:hover {
  text-decoration: underline;
}

.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: #777;
  margin-bottom: 32px;
}

.label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
}

.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #d4d4d4;
  margin-bottom: 24px;
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: #7ec8a5;
  box-shadow: 0 0 0 2px rgba(126, 200, 165, 0.3);
}

.textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #d4d4d4;
  font-size: 14px;
  resize: vertical;
}

.textarea:focus {
  outline: none;
  border-color: #7ec8a5;
  box-shadow: 0 0 0 2px rgba(126, 200, 165, 0.3);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  color: #777;
  font-size: 12px;
}

.toolbar-left {
  display: flex;
  gap: 10px;
}

.tool-btn {
  font-size: 12px;
  text-decoration: underline;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
}

.tool-btn:hover {
  color: #333;
}

.option-box {
  margin-top: 32px;
  padding: 18px;
  border-radius: 8px;
  background: #f3f7f1;
  border: 1px solid #d9e7d2;
}

.option-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.action-box {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn-save {
  width: 180px;
  padding: 10px 0;
  background: #5c8f68;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  width: 180px;
  padding: 10px 0;
  background: #eaeaea;
  color: #444;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.error-msg {
  margin-top: 12px;
  color: #c33;
  font-size: 14px;
}

.success-msg {
  margin-top: 12px;
  color: #3a7a52;
  font-size: 14px;
}
</style>
