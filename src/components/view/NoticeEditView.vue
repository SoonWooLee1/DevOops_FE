<template>
  <div class="notice-edit">
    <button class="back" @click="router.back()">← 돌아가기</button>
    <h1 class="title">공지사항 수정</h1>

    <div v-if="loading" class="hint">불러오는 중…</div>
    <div v-else>
      <label class="label">제목</label>
      <input class="input" v-model.trim="form.title" type="text" placeholder="제목" />

      <label class="label">내용</label>
      <textarea class="textarea" rows="14" v-model="form.content" placeholder="내용을 입력하세요"></textarea>

      <div class="actions">
        <button class="btn save" :disabled="submitting || !canSubmit" @click="onSave">
          {{ submitting? '저장 중…' : '저장' }}
        </button>
        <button class="btn" @click="router.back()">취소</button>
      </div>
    </div>

    <p v-if="error" class="err">⚠ {{ error }}</p>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchNotices, updateNotice } from '@/components/api/notice'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const form = reactive({
  title: '',
  content: ''
})
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

const canSubmit = computed(() =>
  form.title.trim() && form.content.trim()
)

onMounted(async () => {
  try {
    // 1) Row.vue에서 넘어온 state 우선 사용
    const s = history.state?.item
    if (s) {
      form.title = s.noticeTitle || s.title
      form.content = s.noticeContent || s.content
      loading.value = false
      return
    }

    // 2) 단건조회 API 없으므로 /notice/all 에서 해당 id 찾기
    const { list } = await fetchNotices({ page: 1, size: 100 })
    const found = list.find(n => n.id == id || n.noticeId == id)

    if (!found) {
      error.value = '해당 공지를 찾을 수 없습니다.'
      loading.value = false
      return
    }

    form.title = found.title
    form.content = found.content
  } catch (e) {
    console.error(e)
    error.value = '공지 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})

async function onSave() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  error.value = ''

  try {
    await updateNotice(id, {
      title: form.title,
      content: form.content
    })

    alert('공지사항이 수정되었습니다.')
    router.push('/notice')
  } catch (e) {
    console.error(e)
    error.value = '저장에 실패했습니다.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.notice-edit{ max-width:720px; margin:0 auto; padding:32px 0; }
.back{ background:none; border:0; color:#555; margin-bottom:16px; cursor:pointer; }
.title{ font-size:24px; font-weight:700; margin-bottom:16px; }
.label{ display:block; font-weight:600; margin:10px 0 6px; }
.input,.textarea{ width:100%; border:1px solid #d9e7d2; border-radius:8px; padding:10px 12px; }
.textarea{ min-height:320px; }
.actions{ margin-top:18px; display:flex; gap:10px; }
.btn{ padding:10px 16px; border-radius:8px; border:1px solid #d9e7d2; background:#eef4ea; cursor:pointer; }
.btn.save{ background:#5c8f68; color:#fff; border-color:transparent; }
.hint{ color:#666; }
.err{ margin-top:10px; color:#b22; }
</style>
