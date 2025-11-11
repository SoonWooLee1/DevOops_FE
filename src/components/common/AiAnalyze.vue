<template>
  <article class="ai-card">
    <header class="head">
      <div class="head-left">
        <span class="dot-icon" aria-hidden="true"></span>
        <h2 class="title">AI 감정 분석</h2>
      </div>
    </header>

    <div class="divider" aria-hidden="true"></div>

    <section class="body">
      <!-- 입력 -->
      <textarea
        v-model="content"
        placeholder="오늘 하루의 감정을 자유롭게 표현해주세요..."
        class="input-box"
        rows="4"
      ></textarea>

      <button
        @click="analyzeContent"
        :disabled="loading || !content"
        class="analyze-btn"
      >
        {{ loading ? "분석 중..." : "AI 분석하기" }}
      </button>

      <!-- 결과 -->
      <div v-if="feedback" class="result">
        <p class="feedback-title">AI 피드백</p>
        <p class="feedback-text" v-html="feedback"></p>

        <div v-if="relatedTags.length" class="tags">
          <p class="feedback-title">감정 태그</p>
          <div class="tag-list">
            <span
              v-for="tag in relatedTags"
              :key="tag"
              class="tag-pill"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['aiResult'])
const content = ref('')
const feedback = ref('')
const relatedTags = ref([])
const loading = ref(false)

const analyzeContent = async () => {
  if (!content.value.trim()) return
  loading.value = true

  try {
    const response = await axios.post('/api/ai/analyze', {
      content: content.value
    })

    feedback.value = response.data.feedback
    relatedTags.value = response.data.relatedTags || []

    emit('aiResult', {
      content: content.value,
      feedback: feedback.value,
      relatedTags: relatedTags.value
    })
  } catch (error) {
    console.error('AI 분석 오류:', error)
    feedback.value = 'AI 분석 중 오류가 발생했습니다.'
    relatedTags.value = []
    emit('aiResult', {
      content: content.value,
      feedback: feedback.value,
      relatedTags: []
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:root {
  --ink:#55433b; --bg:#f6f1e0;
  --green:#88aa82; --green10:rgba(136,170,130,.08);
  --border:#88aa82; --borderSoft:rgba(136,170,130,.30);
}

.ai-card {
  border: 1.6px solid var(--border);
  background: var(--green10);
  border-radius: 10px;
  padding: 16px 20px;
  transition: box-shadow .2s ease, background-color .2s ease;
}
.ai-card:hover {
  box-shadow: 0 3px 8px rgba(85,67,59,0.1);
}

/* header 스타일 */
.head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.head-left { display: flex; align-items: center; gap: 8px; }
.dot-icon {
  width: 14px; height: 14px; border-radius: 50%;
  border: 1.6px solid var(--green); position: relative;
}
.dot-icon::after {
  content:""; position:absolute; width:6px; height:6px;
  border-radius:50%; background:var(--green);
  top:50%; left:50%; transform:translate(-50%,-50%);
}
.title {
  color: var(--ink); font-weight: 600;
  font-size: 20px; line-height: 28px; letter-spacing: .2px;
}

.divider { height:1px; background:var(--borderSoft); margin:10px 0 16px; }

.input-box {
  width: 98%; padding: 10px 12px;
  border: 1.4px solid var(--borderSoft);
  border-radius: 8px;
  font-size: 14px; color: var(--ink);
  background: rgba(255,255,255,0.8);
  resize: none;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.input-box:focus {
  outline: none;
  border-color: var(--border);
  box-shadow: 0 0 0 3px rgba(136,170,130,.25);
}

.analyze-btn {
  margin-top: 12px;
  background: var(--green);
  color: #fff;
  font-weight: 600;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background .2s ease;
}
.analyze-btn:hover { background: #77a373; }
.analyze-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result {
  margin-top: 18px;
  background: #fff;
  border: 1px solid var(--borderSoft);
  border-radius: 10px;
  padding: 12px 14px;
  color: var(--ink);
}
.feedback-title {
  font-weight: 600; font-size: 14px;
  margin-bottom: 6px; color: var(--ink);
}
.feedback-text {
  font-size: 14px; line-height: 22px;
  opacity: 0.9; white-space: pre-line;
}

.tags { margin-top: 12px; }
.tag-list { display: flex; flex-wrap: wrap; gap: 6px; }
.tag-pill {
  background: var(--green10);
  color: var(--green);
  border: 1px solid var(--borderSoft);
  border-radius: 9999px;
  font-size: 13px;
  padding: 2px 10px;
}
</style>
