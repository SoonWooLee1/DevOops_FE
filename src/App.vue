<template>
  <div class="app-fixed">
    <HeaderView v-if="!route.matched.some(r => r.meta.isAdmin)"/>
    <main class="app-fixed-main">
      <RouterView />
      <ToastContainer />
    </main>
    <FooterView v-if="!route.matched.some(r => r.meta.isAdmin)"/>
  </div>
</template>

<script setup>
  import {ref} from 'vue';
  import {RouterView, useRoute} from 'vue-router';
  import { useUserStore } from './stores/useUserInfo';

  const userStore = useUserStore();
  /* 여기서 마지막 토큰 쪽 [ROLE_USER] 혹은 [ROLE_USER,ROLE_ADMIN]*/
  // userStore.setUserInfo(23,0,0,0,0,0,0,'$2a$10$7kpLFEqxa6CYUABUoqf5zOgOGj5FJvOTzBpAaOZR8EfK5XUAadFli',['ROLE_USER'])
  // console.log("userStore id값: ",userStore)
  // userStore.setUserInfo(10,0,0,0,0,0,0,'토큰',['ROLE_USER'])

const route = useRoute();
import FooterView from './components/common/FooterView.vue';
import HeaderView from './components/common/HeaderView.vue';
import ToastContainer from './components/common/ToastContainer.vue';
  console.log("현재회원: ",userStore.memberId);
  console.log("토큰:",userStore.token)
</script>


<style>
/* ✅ 전역 변수/배경 */
:root {
  --font-serif: 'EB Garamond', 'Noto Serif KR', serif;
  --font-sans: 'Inter', system-ui, -apple-system, 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  --paper-bg: #F6F1E0;
  --ink: #55433B;
  --header-h: 5px;   /* 헤더 높이 */
  --footer-h: 50px;   /* 푸터 높이 */
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

/* [제거] 이 룰은 더 이상 필요 없습니다.
/* main, .main-canvas, #app > *:not(footer){
  padding-bottom: calc(var(--footer-h) + env(safe-area-inset-bottom));
} */

/* ✅ 브라우저 기본 여백 제거 + 배경 전체 적용 */
html, body, #app {
  height:100%;
  margin: 0;
  padding: 0;
  min-height: 100%;
  background: var(--paper-bg);
  color: var(--ink);
}

/* [수정] body의 스크롤을 허용합니다. */
body{ 
  overflow-y: auto; /* 'hidden' -> 'auto' */
} 

/* ✅ 페이지 컨테이너: 필요 시 스크롤 허용 */
/* [제거] #app-canvas (기존 코드 유지) */
/*
#app-canvas {
  min-height: 100dvh;
  width: 100%;
  position: relative;
}
*/

/* 전역 종이 질감 오버레이 */
.paper-noise {
  opacity: .06;                 
  background-size: 400px 400px; 
  mix-blend-mode: multiply;     
}

/* [제거] #app-canvas > *:not(.paper-noise) (기존 코드 유지) */
/*
#app-canvas > *:not(.paper-noise) {
  position: relative;
  z-index: 1;
}
*/

/* [수정] .app-fixed를 flex 컨테이너로 변경 */
.app-fixed{
  /* height: 100svh; */
  /* position: relative; */
  /* overflow: hidden; */

  display: flex;
  flex-direction: column;
  min-height: 100svh; /* 뷰포트 최소 높이 */
}

/* [수정] .app-fixed-main을 flex-grow 및 padding-top으로 변경 */
.app-fixed-main{
  /* position: absolute; */
  /* inset: var(--header-h) 0 calc(var(--footer-h) + var(--safe-bottom)) 0; */
  /* overflow: auto; */
  /* -webkit-overflow-scrolling: touch; */

  flex-grow: 1; /* 헤더와 푸터 사이의 모든 공간을 차지 */
  padding-top: var(--header-h); /* 고정된 헤더가 콘텐츠를 가리지 않도록 */
}
</style>