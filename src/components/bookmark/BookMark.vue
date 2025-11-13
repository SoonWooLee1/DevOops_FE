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
          @click="navigateToDetail(bookmark)"
          style="cursor: pointer;"
        />
        
        <div v-if="isLoading" class="loading-text">
          북마크를 불러오는 중입니다...
        </div>
        
        <div v-if="!isLoading && bookmarks.length === 0" class="no-data">
          북마크한 기록이 없습니다.
        </div>
        
        <div v-if="!isLoading && bookmarks.length > 0 && filteredBookmarks.length === 0" class="no-data">
          검색 결과가 없습니다.
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import BookmarkCard from './BookMarkCard.vue'
import { useUserStore } from '@/stores/useUserInfo';
import { fetchMyBookmarks } from '../api/bookmarks'; // ✅ API 임포트
import { useRouter } from 'vue-router'; // ✅ 라우터 임포트
import { useToastStore } from '@/stores/useToast'; // ✅ 토스트 임포트

const bookmarks = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const userStore = useUserStore();
const router = useRouter(); // ✅ 라우터 초기화
const toastStore = useToastStore(); // ✅ 토스트 초기화

const fetchBookmarks = async () => {
  isLoading.value = true;

  if (!userStore.id || !userStore.token) {
    console.log('로그인되지 않은 사용자입니다.');
    toastStore.showToast('북마크를 보려면 로그인이 필요합니다.');
    bookmarks.value = [];
    isLoading.value = false;
    return;
  }

  try {
    // ✅ API 함수 사용
    const data = await fetchMyBookmarks(userStore.token);
    bookmarks.value = data; // DTO 배열을 bookmarks ref에 저장
  } catch (err) {
    console.error('북마크 데이터를 불러오는 중 오류 발생:', err);
    toastStore.showToast('북마크를 불러오는데 실패했습니다.');
    bookmarks.value = []; // 오류 발생 시 초기화
  } finally {
    isLoading.value = false;
  }
}

// 검색어 기반 필터링 (클라이언트 사이드)
const filteredBookmarks = computed(() => {
  if (!searchQuery.value) {
    return bookmarks.value;
  }
  const query = searchQuery.value.toLowerCase();
  return bookmarks.value.filter(bookmark =>
    bookmark.title?.toLowerCase().includes(query) ||
    bookmark.contentSnippet?.toLowerCase().includes(query) ||
    bookmark.authorName?.toLowerCase().includes(query)
  );
});

// ✅ 카드 클릭 시 네비게이션 함수
function navigateToDetail(bookmark) {
  const { recordType, recordId } = bookmark;
  if (recordType === 'ooh') {
    router.push({ name: 'DetailOoh', params: { id: recordId } });
  } else if (recordType === 'oops') {
    // 참고: router/index.js 에는 Oops 상세 페이지가 주석 처리 되어있습니다.
    // router.push({ name: 'DetailOops', params: { id: recordId } });
    toastStore.showToast('Oops 상세 페이지는 현재 준비 중입니다.');
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(fetchBookmarks);
</script>

<style scoped>
/* 기존 스타일 유지 */
.bookmark-canvas {
  position: relative;
  min-height: 100%;
  background: var(--paper-bg, #fefdfb);
  color: var(--ink, #3b302b);
  overflow-x: hidden;
  animation: fade-in-soft 0.8s ease both;
  display: block;
  padding: 40px 16px;
  padding-bottom: 60px;
}
.bookmark-hero {
  position: relative;
  z-index: 2;
  max-width: 768px;
  width: 90vw;
  margin: 0 auto 40px auto;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(6px);
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  padding: 40px 32px 60px;
}
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
.bookmark-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.no-data, .loading-text {
  text-align: center;
  color: rgba(60, 60, 60, 0.5);
  padding: 40px 20px;
  font-size: 1rem;
  grid-column: 1 / -1;
}
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
@keyframes fade-in-soft {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes breatheA {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes breatheB {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
</style>