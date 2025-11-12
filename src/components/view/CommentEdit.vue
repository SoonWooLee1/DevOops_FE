<template>
  <div class="comment-edit">
    <button class="back" @click="router.back()">← 돌아가기</button>
    <h1 class="title">댓글 수정</h1>

    <div v-if="loading" class="hint">불러오는 중…</div>
    <div v-else>

      <label class="label">내용</label>
      <textarea class="textarea" rows="14" v-model="content" placeholder="내용을 입력하세요"></textarea>

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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchNoticeComments, updateComment } from '@/components/api/comments'
import { useUserStore } from '@/stores/useUserInfo';

const userStore = useUserStore();
const token = userStore.token;

const route = useRoute()
const router = useRouter()
const commentId = route.params.commentId;
const noticeId = route.params.noticeId;

const content = ref('');
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

const canSubmit = computed(() =>
  content.value.trim().length > 0
)

onMounted(async () => {
  console.log("noticeId:", noticeId);
  console.log("commentId:", commentId);
  
  try {
    const { list } = await fetchNoticeComments(noticeId, { page: 1, size: 100 })
    console.log("list:", list);
    const comment = list.find(
      (c) => String(c.id) === String(commentId)
    );
    if (!comment) {
  error.value = '해당 댓글을 찾을 수 없습니다.';
  content.value = '';
  return;
}
    content.value = comment ? comment.content : '';
    console.log("content:", content.value);

  } catch (e) {
    console.error(e)
    error.value = '댓글을 불러오지 못했습니다.'
  } finally {
    loading.value = false;
  }
})

async function onSave() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  error.value = ''

  try {
    console.log("받아온 댓글id: ", commentId);

    console.log("입력할 content:", content.value);
    await updateComment(commentId, 
      content.value
    , token)

    alert('댓글이 수정되었습니다.')
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
.comment-edit{ max-width:720px; margin:0 auto; padding:32px 0; }
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
