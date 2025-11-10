<template>
  <main class="admin-canvas">
    <!-- 배경 효과 -->
    <div class="ink-bg" aria-hidden="true">
      <svg class="ink ink-a" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#88AA82" opacity="0.25" />
      </svg>
      <svg class="ink ink-b" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="60" fill="#55433B" opacity="0.15" />
      </svg>
    </div>
    <div class="paper-noise" aria-hidden="true"></div>

    <!-- 메인 -->
    <section class="admin-hero">
      <div class="title-block">
        <h1 class="admin-title">태그 관리</h1>
        <p class="admin-subtitle">Oops Log 관리자 페이지</p>
      </div>

      <!-- 1️⃣ 태그 추가 -->
      <section class="section">
        <h2 class="section-title">태그 추가</h2>
        <div class="form-row">
          <input
            v-model="newTagName"
            type="text"
            placeholder="태그 이름 입력"
            class="input-field"
          />
          <select v-model="newTagType" class="input-field">
            <option disabled value="">태그 유형 선택</option>
            <option value="ooh">OOH</option>
            <option value="oops">OOPS</option>
            <option value="emo">EMO</option>
          </select>
          <button class="btn-add" @click="addTag">추가</button>
        </div>
      </section>

      <!-- 2️⃣ 태그 조회 -->
      <section class="section">
        <h2 class="section-title">태그 목록</h2>

        <div class="tag-columns">
          <div class="tag-column">
            <h3>OOH</h3>
            <ul>
              <li
                v-for="tag in paginatedOohTags"
                :key="tag.id"
                @click="selectTag(tag)"
                :class="{ active: selectedTag && selectedTag.id === tag.id }"
              >
                {{ tag.tag_name }}
              </li>
            </ul>
            <div class="pagination">
              <button @click="prevPage('ooh')" :disabled="oohPage === 1">이전</button>
              <span>{{ oohPage }}</span>
              <button
                @click="nextPage('ooh')"
                :disabled="oohPage * pageSize >= oohTags.length"
              >다음</button>
            </div>
          </div>

          <div class="tag-column">
            <h3>OOPS</h3>
            <ul>
              <li
                v-for="tag in paginatedOopsTags"
                :key="tag.id"
                @click="selectTag(tag)"
                :class="{ active: selectedTag && selectedTag.id === tag.id }"
              >
                {{ tag.tag_name }}
              </li>
            </ul>
            <div class="pagination">
              <button @click="prevPage('oops')" :disabled="oopsPage === 1">이전</button>
              <span>{{ oopsPage }}</span>
              <button
                @click="nextPage('oops')"
                :disabled="oopsPage * pageSize >= oopsTags.length"
              >다음</button>
            </div>
          </div>

          <div class="tag-column">
            <h3>EMO</h3>
            <ul>
              <li
                v-for="tag in paginatedEmoTags"
                :key="tag.id"
                @click="selectTag(tag)"
                :class="{ active: selectedTag && selectedTag.id === tag.id }"
              >
                {{ tag.tag_name }}
              </li>
            </ul>
            <div class="pagination">
              <button @click="prevPage('emo')" :disabled="emoPage === 1">이전</button>
              <span>{{ emoPage }}</span>
              <button
                @click="nextPage('emo')"
                :disabled="emoPage * pageSize >= emoTags.length"
              >다음</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 3️⃣ 태그 삭제 -->
      <section v-if="selectedTag" class="section">
        <h2 class="section-title">태그 삭제</h2>
        <div class="detail-box">
          <p><strong>ID:</strong> {{ selectedTag.id }}</p>
          <p><strong>이름:</strong> {{ selectedTag.tag_name }}</p>
          <p><strong>유형:</strong> {{ selectedTag.tag_type }}</p>
          <button class="btn-delete" @click="deleteTag(selectedTag.id)">
            삭제
          </button>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const tags = ref([])
const newTagName = ref('')
const newTagType = ref('')
const selectedTag = ref(null)

// 페이지 관리
const oohPage = ref(1)
const oopsPage = ref(1)
const emoPage = ref(1)
const pageSize = 10

const fetchTags = async () => {
  try {
    const res = await axios.get('/api/admin/tag')
    tags.value = res.data
  } catch (err) {
    console.error('태그 목록 조회 오류:', err)
  }
}

const addTag = async () => {
  if (!newTagName.value || !newTagType.value) {
    alert('태그 이름과 유형을 입력해주세요.')
    return
  }
  try {
    await axios.post('/api/admin/tag', {
      tagName: newTagName.value,
      tagType: newTagType.value,
    })
    alert('태그가 추가되었습니다.')
    newTagName.value = ''
    newTagType.value = ''
    fetchTags()
  } catch (err) {
    console.error('태그 추가 오류:', err)
  }
}

const selectTag = (tag) => {
  selectedTag.value = tag
}

const deleteTag = async (id) => {
  if (!confirm('정말로 이 태그를 삭제하시겠습니까?')) return
  try {
    await axios.delete(`/api/admin/tag/${id}`)
    alert('태그가 삭제되었습니다.')
    selectedTag.value = null
    fetchTags()
  } catch (err) {
    console.error('태그 삭제 오류:', err)
  }
}

const oohTags = computed(() => tags.value.filter(t => t.tag_type === 'ooh'))
const oopsTags = computed(() => tags.value.filter(t => t.tag_type === 'oops'))
const emoTags = computed(() => tags.value.filter(t => t.tag_type === 'emo'))

// 페이지당 데이터 계산
const paginatedOohTags = computed(() => {
  const start = (oohPage.value - 1) * pageSize
  return oohTags.value.slice(start, start + pageSize)
})
const paginatedOopsTags = computed(() => {
  const start = (oopsPage.value - 1) * pageSize
  return oopsTags.value.slice(start, start + pageSize)
})
const paginatedEmoTags = computed(() => {
  const start = (emoPage.value - 1) * pageSize
  return emoTags.value.slice(start, start + pageSize)
})

// 페이지 이동
const nextPage = (type) => {
  if (type === 'ooh' && oohPage.value * pageSize < oohTags.value.length) oohPage.value++
  if (type === 'oops' && oopsPage.value * pageSize < oopsTags.value.length) oopsPage.value++
  if (type === 'emo' && emoPage.value * pageSize < emoTags.value.length) emoPage.value++
}
const prevPage = (type) => {
  if (type === 'ooh' && oohPage.value > 1) oohPage.value--
  if (type === 'oops' && oopsPage.value > 1) oopsPage.value--
  if (type === 'emo' && emoPage.value > 1) emoPage.value--
}

onMounted(fetchTags)
</script>

<style scoped>
/* 페이지네이션 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}
.pagination button {
  border: 1px solid rgba(85, 67, 59, 0.3);
  background: rgba(255, 255, 255, 0.4);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 0.85rem;
  color: #3b302b;
}
.pagination button:hover {
  background: rgba(136, 170, 130, 0.15);
  transform: translateY(-1px);
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination span {
  color: rgba(85, 67, 59, 0.7);
  font-size: 0.9rem;
}
/* 공통 배경 스타일 */
.admin-canvas {
  position: relative;
  min-height: 100vh;
  background: var(--paper-bg, #fefdfb);
  color: var(--ink, #3b302b);
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: 40px 16px;
}

.admin-hero {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  width: 100%;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(6px);
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  padding: 40px 32px 60px;
}

.title-block {
  text-align: center;
  margin-bottom: 30px;
}
.admin-title {
  font-family: 'EB Garamond', 'Noto Serif KR', serif;
  font-size: 1.9rem;
  color: rgba(85, 67, 59, 0.9);
  margin-bottom: 6px;
}
.admin-subtitle {
  color: rgba(85, 67, 59, 0.6);
  font-size: 0.9rem;
  letter-spacing: 0.04em;
}

/* 섹션 */
.section {
  margin-bottom: 40px;
}
.section-title {
  font-size: 1.1rem;
  color: rgba(85, 67, 59, 0.85);
  margin-bottom: 12px;
  border-left: 3px solid rgba(136, 170, 130, 0.7);
  padding-left: 10px;
  font-family: 'Noto Serif KR', serif;
}

/* 폼 영역 */
.form-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.input-field {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid rgba(85, 67, 59, 0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.8);
}
.btn-add {
  background-color: rgba(136, 170, 130, 0.85);
  border: none;
  color: white;
  border-radius: 8px;
  padding: 10px 18px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}
.btn-add:hover {
  background-color: rgba(136, 170, 130, 1);
  transform: translateY(-2px);
}

/* 태그 리스트 */
.tag-columns {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.tag-column {
  flex: 1;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.tag-column h3 {
  text-align: center;
  font-family: 'Noto Serif KR', serif;
  font-size: 1rem;
  color: rgba(85, 67, 59, 0.85);
  margin-bottom: 10px;
}
.tag-column ul {
  list-style: none;
  padding: 0;
}
.tag-column li {
  padding: 8px;
  margin: 4px 0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(85, 67, 59, 0.1);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.25s ease;
}
.tag-column li:hover {
  background-color: rgba(136, 170, 130, 0.1);
}
.tag-column li.active {
  background-color: rgba(136, 170, 130, 0.25);
  border-color: rgba(136, 170, 130, 0.7);
}

/* 상세 */
.detail-box {
  border-top: 1px solid rgba(85, 67, 59, 0.2);
  padding-top: 15px;
}
.detail-box p {
  margin: 6px 0;
}
.btn-delete {
  background-color: rgba(199, 96, 77, 0.85);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-delete:hover {
  background-color: rgba(199, 96, 77, 1);
  transform: translateY(-2px);
}

/* 배경 효과 */
.ink-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.04;
}
.ink {
  position: absolute;
  width: 22rem;
  height: 22rem;
}
.ink-a {
  top: 25%;
  left: 18%;
  animation: breatheA 9s ease-in-out infinite;
}
.ink-b {
  right: 22%;
  bottom: 28%;
  width: 16rem;
  height: 16rem;
  animation: breatheB 11s ease-in-out infinite;
}
.paper-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-size: 400px 400px;
  opacity: 0.03;
}

/* 애니메이션 */
@keyframes breatheA {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes breatheB {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
</style>
