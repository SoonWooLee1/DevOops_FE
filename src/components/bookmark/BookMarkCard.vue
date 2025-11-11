<template>
  <article class="postcard">
    <header class="card-header">
      <div class="header-left">
        <span :class="['badge', typeClass]">{{ bookmark.recordType }}</span>
        <span class="date">{{ formatDate(bookmark.createDate) }}</span>
      </div>
      <span class="author">{{ bookmark.authorName }}</span>
    </header>
    <div class="card-body">
      <h2 v-if="bookmark.title" class="title">{{ bookmark.title }}</h2>
      <p class="content">{{ bookmark.contentSnippet }}...</p>
    </div>
    
    </article>
</template>

<script setup>
import { computed } from 'vue'

// `bookmark` 객체를 props로 받습니다. (BookmarkItemDto와 일치)
const props = defineProps({
  bookmark: {
    type: Object,
    required: true
  }
})

// `recordType`에 따라 CSS 클래스를 동적으로 반환합니다.
const typeClass = computed(() => {
  return props.bookmark.recordType?.toLowerCase() === 'ooh' ? 'is-ooh' : 'is-oops'
})

// 날짜 포맷팅 유틸리티 함수
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    // 'YYYY. MM. DD.' 형식으로 변환
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  } catch {
    return '-'
  }
}
</script>

<style scoped>
/* 카드 스타일 */
.postcard {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(85, 67, 59, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  padding: 20px 24px;
  transition: background-color 0.25s ease, transform 0.25s ease;
  cursor: pointer;
}
.postcard:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 0.85rem;
  color: rgba(85, 67, 59, 0.7);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
  font-family: 'EB Garamond', serif;
  font-size: 0.9rem;
  text-transform: uppercase;
}
/* Ooh/Oops 배지 색상 */
.badge.is-ooh {
  background-color: rgba(136, 170, 130, 0.2);
  color: #5a7255;
}
.badge.is-oops {
  background-color: rgba(85, 67, 59, 0.1);
  color: #55433B;
}
.author {
  font-weight: 500;
}

.card-body .title {
  font-family: 'EB Garamond', 'Noto Serif KR', serif;
  font-size: 1.25rem;
  color: var(--ink, #3b302b);
  margin: 0 0 8px;
  /* 제목이 길 경우 말줄임 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-body .content {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(85, 67, 59, 0.85);
  margin: 0;
  /* DTO의 100자 스니펫을 2줄로 말줄임 처리 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>