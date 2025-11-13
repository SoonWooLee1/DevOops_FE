<template>
  <main class="follow-canvas">
    <div class="ink-bg" aria-hidden="true">
      <svg class="ink ink-a" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#88AA82" opacity="0.25" />
      </svg>
      <svg class="ink ink-b" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="60" fill="#55433B" opacity="0.15" />
      </svg>
    </div>
    <div class="paper-noise" aria-hidden="true"></div>

    <section class="follow-hero">
      <div class="title-block">
        <h1 class="admin-title">팔로우 피드</h1>
        <p class="admin-subtitle">팔로우한 사람들의 기록을 살펴보세요</p>
      </div>

      <div class="search-wrapper">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="피드에서 검색하기..."
          class="search-input"
        />
      </div>

      <div class="card-list">
        <BookmarkCard
          v-for="item in filteredFeed"
          :key="item.recordType + item.recordId"
          :bookmark="item" 
        />
        
        <div v-if="isLoading" class="loading-text">
          피드를 불러오는 중입니다...
        </div>
        
        <div v-if="!isLoading && filteredFeed.length === 0" class="no-data">
          팔로우한 사용자의 글이 없습니다.
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import BookmarkCard from '../bookmark/BookMarkCard.vue'
import { useUserStore } from '@/stores/useUserInfo'     // 유저 스토어 임포트

const feed = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const userStore = useUserStore() // 스토어 사용 

const fetchFeed = async () => {
  isLoading.value = true;

  // 토큰 유무도 함께 체크
  if (!userStore.id || !userStore.token) {
    isLoading.value = false
    feed.value = []
    console.error('로그인 정보가 없습니다.')
    return
  }
  
  try {
    // axios.get 호출에 headers 객체를 추가하여 토큰 주입
    const res = await axios.get(`/api/follow/feed/my`, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    }) 
    feed.value = res.data // DTO 배열을 feed ref에 저장
  } catch (err) {
    console.error('팔로우 피드를 불러오는 중 오류 발생:', err)
    feed.value = [] // 오류 발생 시 초기화
  } finally {
    isLoading.value = false
  }
}

// 검색어 기반 필터링 (클라이언트 사이드)
const filteredFeed = computed(() => {
  if (!searchQuery.value) {
    return feed.value
  }
  const query = searchQuery.value.toLowerCase()
  // DTO 필드 기준으로 검색
  return feed.value.filter(item =>
    item.title?.toLowerCase().includes(query) ||
    item.contentSnippet?.toLowerCase().includes(query) ||
    item.authorName?.toLowerCase().includes(query)
  )
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(fetchFeed)
</script>

<style scoped>

.follow-canvas {
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

.follow-hero {
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

.card-list {
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

@media (prefers-reduced-motion: reduce) {
  .ink-a, .ink-b { animation: none; }
}
</style>