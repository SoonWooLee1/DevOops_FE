<template>
  <main class="bookmark-canvas">
    <div class="ink-bg" aria-hidden="true">
      <svg class="ink ink-a" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#88AA82" opacity="0.25" />
      </svg>
      <svg class="ink ink-b" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="60" fill="#55433B" opacity="0.15" />
      </svg>
    </div>
    <div class="paper-noise" aria-hidden="true"></div>

    <section class="bookmark-hero">
      <div class="title-block">
        <h1 class="admin-title">북마크한 페이지들</h1>
        <p class="admin-subtitle">마음에 드는 기록들을 다시 살펴보세요</p>
      </div>

      <div class="search-wrapper">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="북마크한 글 검색하기..."
          class="search-input"
        />
      </div>

      <div class="bookmark-list">
        <BookmarkCard
          v-for="bookmark in filteredBookmarks"
          :key="bookmark.bookmarkId"
          :bookmark="bookmark"
        />
        
        <div v-if="isLoading" class="loading-text">
          북마크를 불러오는 중입니다...
        </div>
        
        <div v-if="!isLoading && filteredBookmarks.length === 0" class="no-data">
          북마크한 기록이 없습니다.
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
// 1. 요청하신 경로로 수정합니다.
import BookmarkCard from './BookMarkCard.vue'

const bookmarks = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const userId = 19 // 2. 임시 사용자 ID (로그인 구현 후 변경 필요)

/**
 * 3. 백엔드 API와 연동합니다.
 * vite.config.js의 프록시 설정(/api -> localhost:8080)을 사용합니다.
 * BookmarkQueryController의 getMyBookmarks를 호출합니다.
 */
const fetchBookmarks = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`/api/bookmarks/user/${userId}`) 
    bookmarks.value = res.data // DTO 배열을 bookmarks ref에 저장
  } catch (err) {
    console.error('북마크 데이터를 불러오는 중 오류 발생:', err)
    bookmarks.value = [] // 오류 발생 시 초기화
  } finally {
    isLoading.value = false
  }
}

// 4. 검색어 기반 필터링 (클라이언트 사이드)
const filteredBookmarks = computed(() => {
  if (!searchQuery.value) {
    return bookmarks.value
  }
  const query = searchQuery.value.toLowerCase()
  // DTO 필드 기준으로 검색
  return bookmarks.value.filter(bookmark =>
    bookmark.title?.toLowerCase().includes(query) ||
    bookmark.contentSnippet?.toLowerCase().includes(query) ||
    bookmark.authorName?.toLowerCase().includes(query)
  )
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(fetchBookmarks)
</script>

<style scoped>
/* ========================
   🎨 감성 북마크 페이지 스타일
   (AdminMember.vue 스타일 기반)
   ======================== */

/* */
.bookmark-canvas {
  position: relative;
  min-height: 100%; /* App.vue의 메인 영역을 채웁니다. */
  background: var(--paper-bg, #fefdfb);
  color: var(--ink, #3b302b);
  overflow-x: hidden;
  animation: fade-in-soft 0.8s ease both;
  display: block; /* 스크롤이 가능하도록 block으로 변경 */
  padding: 40px 16px;
  padding-bottom: 60px; /* 하단 푸터 영역 확보 */
}

/* */
.bookmark-hero {
  position: relative;
  z-index: 2;
  max-width: 768px; /* 이미지와 유사한 너비로 조정 */
  width: 90vw;
  margin: 0 auto 40px auto; /* 중앙 정렬 및 하단 여백 */
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(6px);
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  padding: 40px 32px 60px;
}

/* 제목 (AdminMember.vue와 동일) */
.title-block {
  text-align: center;
  margin-bottom: 28px;
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

/* 검색창 스타일 */
.search-wrapper {
  margin-bottom: 24px;
}
.search-input {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid rgba(85, 67, 59, 0.2);
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.25s ease;
}
.search-input::placeholder {
  color: rgba(85, 67, 59, 0.5);
}
.search-input:focus {
  outline: none;
  border-color: rgba(136, 170, 130, 0.7);
  box-shadow: 0 0 0 3px rgba(136, 170, 130, 0.15);
}


/* 북마크 리스트 (그리드 레이아웃) */
.bookmark-list {
  display: grid;
  /* 카드의 최소 너비를 320px로 설정하고,
    여유 공간이 생기면 자동으로 여러 컬럼으로 나눕니다.
  */
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* 데이터 없음 / 로딩 (AdminMember.vue와 동일) */
.no-data, .loading-text {
  text-align: center;
  color: rgba(60, 60, 60, 0.5);
  padding: 40px 20px;
  font-size: 1rem;
  /* 컬럼 전체를 차지하도록 설정 */
  grid-column: 1 / -1;
}

/* 배경 잉크 효과 (AdminMember.vue와 동일) */
.ink-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.04;
  z-index: 0;
}
.ink {
  position: absolute;
  width: 22rem;
  height: 22rem;
}
.ink-a {
  top: 15%;
  left: 10%;
  animation: breatheA 9s ease-in-out infinite;
}
.ink-b {
  right: 12%;
  bottom: 20%;
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
  z-index: 0;
}

/* 애니메이션 (AdminMember.vue와 동일) */
@keyframes fade-in-soft {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes breatheA {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes breatheB {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

@media (prefers-reduced-motion: reduce) {
  .ink-a, .ink-b { animation: none; }
}
</style>