<template>
  <header class="app-header">
    <a href="/" class="brand">Oops_Log</a>
    <!-- 캡처 스타일: 상단 링크는 숨김 -->
    <nav class="desktop" />
  </header>

  <!-- 햄버거: 우상단 고정, 드로어 열리면 X로 변신 -->
  <HamburgerButton v-model="open" fixed />

  <!-- 드로어: 내부 X 버튼은 숨김(햄버거가 닫기 역할) -->
  <MobileNav v-model="open" :internal-close="false">
    <template #header>
      <p class="hello">
        다시 만나서 반가워요.<br />
        오늘의 이야기를 기다리고 있었어요.
      </p>
    </template>

    <li class="menu-item">
      <span class="icon"><HomeIcon /></span>
      <a href="/login">로그인</a>
    </li>

        <li class="menu-item">
      <span class="icon"><HomeIcon /></span>
      <a href="/">홈</a>
    </li>

    <li class="menu-item">
      <span class="icon"><PenIcon /></span>
      <a href="/write">새 페이지 쓰기</a>
    </li>

    <li class="menu-item">
      <span class="icon"><BookIcon /></span>
      <a href="/logs">내 기록</a>
      <span class="badge"></span>
    </li>

    <li class="menu-item">
      <span class="icon"><UsersIcon /></span>
      <a href="/oops">Oops_Log</a>
    </li>

      <li class="menu-item">
      <span class="icon"><UsersIcon /></span>
      <a href="/ooh">Ooh_Log</a>
    </li>

    <li class="menu-item">
      <span class="icon"><BellIcon /></span>
      <a href="/notice">공지사항</a>
    </li>

    <li class="menu-item">
      <span class="icon"><BellIcon /></span>
      <a href="/mypage">마이페이지</a>
    </li>

    <template #footer>
      <blockquote class="quote">"실수는 버그가 아니라 <br> 
      </br>성장의 패치노트입니다."</blockquote>
    </template>
  </MobileNav>
</template>

<script setup>
import { ref } from 'vue'
import HamburgerButton from './HamburgerButton.vue'
import MobileNav from './MobileNav.vue'

/* 인라인 아이콘 (외부 라이브러리 X) */
const HomeIcon = { template: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/></svg>` }
const PenIcon = { template: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>` }
const BookIcon = { template: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
  <path d="M20 22V6a2 2 0 0 0-2-2H7.5A3.5 3.5 0 0 0 4 7.5v15"/>
  <path d="M20 6h-8"/></svg>` }
const UsersIcon = { template: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
  <circle cx="9" cy="7" r="4"/>
  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
  <path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` }
const BellIcon = { template: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
  <path d="M10.3 21a1.7 1.7 0 0 0 3.4 0"/></svg>` }

const open = ref(false)
</script>

<style scoped>
.app-header{
  height:64px; padding:0 16px;
  display:flex; align-items:center; justify-content:space-between;
}
.brand{ color:#55433B; font-weight:600; text-decoration:none; }
.desktop{ display:none; } /* 캡처처럼 상단 링크 숨김 */

.menu-item{
  position: relative;
  display:flex; align-items:center; gap:12px;
  padding: 10px 8px; border-radius: 10px;
}
.menu-item .icon{
  width:32px; height:32px; border-radius: 10px;
  display:flex; align-items:center; justify-content:center;
  background: rgba(136,170,130,.12);
  color: #6a8f66;
}
.menu-item a{ color:#55433B; text-decoration:none; flex:1; }
.menu-item:hover{ background: rgba(0,0,0,.04); }

.badge{
  position: absolute; right: 8px;
  min-width:18px; height:18px; padding:0 6px;
  border-radius: 9px; background:#6a8f66; color:#fff; font-size:12px;
  display:flex; align-items:center; justify-content:center;
}
.hello{ color:#55433B; opacity:.9; line-height:1.7; margin:4px 0 8px; }
.quote{
  margin-top: 8px; 
  padding: 12px 14px; 
  border-radius: 8px;
  background: rgba(0,0,0,.04);
  color:#55433B;
  font-size:14px;
  text-align: center;
}
</style>
