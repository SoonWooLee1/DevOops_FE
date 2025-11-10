<template>
  <main class="admin-canvas">
    <!-- 배경 -->
    <div class="ink-bg" aria-hidden="true">
      <svg class="ink ink-a" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#88AA82" opacity="0.25" />
      </svg>
      <svg class="ink ink-b" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="60" fill="#55433B" opacity="0.15" />
      </svg>
    </div>
    <div class="paper-noise" aria-hidden="true"></div>

    <!-- 메인 컨테이너 -->
    <section class="admin-hero">
      <div class="title-block">
        <h1 class="admin-title">회원 기록 관리</h1>
        <p class="admin-subtitle">Oops Log 관리자 페이지</p>
      </div>

      <div class="table-wrapper">
        <table class="member-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>아이디</th>
              <th>이름</th>
              <th>이메일</th>
              <th>성별</th>
              <th>생년월일</th>
              <th>가입일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.id">
              <td>{{ member.id }}</td>
              <td>{{ member.member_id }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.email }}</td>
              <td>{{ member.gender?.toLowerCase() === 'm' ? '남성' : '여성' }}</td>
              <td>{{ formatDate(member.birth) }}</td>
              <td>{{ formatDate(member.sign_up_date) }}</td>
              <td>
                <span
                  :class="member.user_state?.toUpperCase() === 'A' ? 'status-active' : 'status-inactive'"
                >
                  {{ member.user_state?.toUpperCase() === 'A' ? '활성' : '비활성' }}
                </span>
              </td>
            </tr>

            <tr v-if="members.length === 0">
              <td colspan="8" class="no-data">조회된 회원이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="page === 1">이전</button>
        <span>페이지 {{ page }}</span>
        <button @click="nextPage" :disabled="!hasNextPage">다음</button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const members = ref([])
const page = ref(1)
const size = ref(10)
const hasNextPage = ref(true)

const fetchMembers = async () => {
  try {
    const res = await axios.get(`/api/admin/member?page=${page.value}&size=${size.value}`)
    members.value = res.data
    hasNextPage.value = res.data.length === size.value
  } catch (err) {
    console.error('회원 데이터를 불러오는 중 오류 발생:', err)
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  } catch {
    return '-'
  }
}

const nextPage = () => {
  if (hasNextPage.value) {
    page.value++
    fetchMembers()
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchMembers()
  }
}

onMounted(fetchMembers)
</script>

<style scoped>
/* ========================
   🎨 감성 관리자 페이지 스타일
   ======================== */

.admin-canvas {
  position: relative;
  min-height: 100vh;
  background: var(--paper-bg, #fefdfb);
  color: var(--ink, #3b302b);
  overflow: hidden;
  animation: fade-in-soft 0.8s ease both;
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

/* 제목 */
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

/* 테이블 */
.table-wrapper {
  overflow-x: auto;
}

.member-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.member-table thead {
  background-color: rgba(136, 170, 130, 0.15);
  color: #3b332d;
}

.member-table th,
.member-table td {
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 12px;
  text-align: center;
  font-size: 0.95rem;
}

.member-table tbody tr:hover {
  background-color: rgba(136, 170, 130, 0.06);
  transition: background-color 0.25s ease;
}

/* 상태 배지 */
.status-active {
  background-color: rgba(136, 170, 130, 0.85);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.status-inactive {
  background-color: rgba(199, 96, 77, 0.85);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 30px;
}

.pagination button {
  border: 1px solid rgba(85, 67, 59, 0.3);
  background: rgba(255, 255, 255, 0.4);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-size: 0.9rem;
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

/* no data */
.no-data {
  text-align: center;
  color: rgba(60, 60, 60, 0.5);
  padding: 20px;
}

/* 배경 잉크 효과 */
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
