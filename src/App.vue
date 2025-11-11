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
  /* 여기서 마지막 토큰 쪾 [ROLE_USER] 혹은 [ROLE_USER,ROLE_ADMIN]*/
  /*userStore.setUserInfo(10,0,0,0,0,0,0,'토큰',['ROLE_USER'])*/

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
  --header-h: 56px;   /* 헤더 높이 */
  --footer-h: 50px;   /* 푸터 높이 */
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

main, .main-canvas, #app > *:not(footer){
  padding-bottom: calc(var(--footer-h) + env(safe-area-inset-bottom));
}

/* ✅ 브라우저 기본 여백 제거 + 배경 전체 적용 */
html, body, #app {
  height:100%;
  margin: 0;
  padding: 0;
  min-height: 100%;
  background: var(--paper-bg);
  color: var(--ink);
}
body{ overflow:hidden; }  /* 본문 영역만 스크롤되게 */

/* ✅ 페이지 컨테이너: 필요 시 스크롤 허용 */
#app-canvas {
  min-height: 100dvh;
  width: 100%;
  position: relative;
}

/* 전역 종이 질감 오버레이 */
.paper-noise {
  opacity: .06;                 /* ↑ 일단 강하게 보기 */
  background-size: 400px 400px; /* SVG 노이즈가 너무 커져 흐릿해지는 것 방지 */
  mix-blend-mode: multiply;     /* 종이 질감 느낌 유지 */
}

/* 콘텐츠가 질감 위로 오게 */
#app-canvas > *:not(.paper-noise) {
  position: relative;
  z-index: 1;
}

.app-fixed{
  height: 100svh;       /* 모바일 뷰포트 대응 */
  position: relative;
  overflow: hidden;     /* 배경 이펙트가 삐져나가도 스크롤 안생김 */
}

/* 헤더/푸터를 제외한 ‘본문 영역’만 스크롤 */
.app-fixed-main{
  position: absolute;
  inset: var(--header-h) 0 calc(var(--footer-h) + var(--safe-bottom)) 0;
  overflow: auto;       /* 여기서만 스크롤 */
  -webkit-overflow-scrolling: touch;
}
</style>