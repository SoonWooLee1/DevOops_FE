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
      <div v-if="!loginFlag">
      <p class="hello">
        다시 만나서 반가워요.<br />
        오늘의 이야기를 기다리고 있었어요.
      </p>
      <li class="user-info">
        <button @click="loginPage" class="login-btn">로그인 하기</button>
      <!-- <a href="/login"></a> -->
    </li>
    </div>

    <div v-else>
      <p class="hello">
        환영합니다. 오늘의 당신을 작성해보세요.<br />
      </p>
      <li class="user-info">
        <button @click="myPage" class="my-page-btn">마이 페이지</button>
        <button @click="logoutPage" class="login-btn">로그아웃</button>
      <!-- <a href="/login"></a> -->
    </li>
    </div>
    </template>
    
    <li class="menu-item">
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" class="stroke-icon">
          <path d="M20 17.0002V11.4522C20 10.9179 19.9995 10.6506 19.9346 10.4019C19.877 10.1816 19.7825 9.97307 19.6546 9.78464C19.5102 9.57201 19.3096 9.39569 18.9074 9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86406 12.5674 3.73982C12.1972 3.63035 11.8026 3.63035 11.4324 3.73982C11.0126 3.86397 10.6398 4.19014 9.89436 4.84244L5.09277 9.04383C4.69064 9.39569 4.49004 9.57201 4.3457 9.78464C4.21779 9.97307 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9179 4 11.4522V17.0002C4 17.932 4 18.3978 4.15224 18.7654C4.35523 19.2554 4.74432 19.6452 5.23438 19.8482C5.60192 20.0005 6.06786 20.0005 6.99974 20.0005C7.93163 20.0005 8.39808 20.0005 8.76562 19.8482C9.25568 19.6452 9.64467 19.2555 9.84766 18.7654C9.9999 18.3979 10 17.932 10 17.0001V16.0001C10 14.8955 10.8954 14.0001 12 14.0001C13.1046 14.0001 14 14.8955 14 16.0001V17.0001C14 17.932 14 18.3979 14.1522 18.7654C14.3552 19.2555 14.7443 19.6452 15.2344 19.8482C15.6019 20.0005 16.0679 20.0005 16.9997 20.0005C17.9316 20.0005 18.3981 20.0005 18.7656 19.8482C19.2557 19.6452 19.6447 19.2554 19.8477 18.7654C19.9999 18.3978 20 17.932 20 17.0002Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <a href="/">홈</a>
    </li>

    <li class="menu-item">
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" class="stroke-icon">
          <path d="M9 6C9 10.9706 13.0294 15 18 15C18.9093 15 19.787 14.8655 20.6144 14.6147C19.4943 18.3103 16.0613 20.9999 12 20.9999C7.02944 20.9999 3 16.9707 3 12.0001C3 7.93883 5.69007 4.50583 9.38561 3.38574C9.13484 4.21311 9 5.09074 9 6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <a href="/oops">Oops_Log</a>
    </li>

      <li class="menu-item">
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" class="stroke-icon">
          <path d="M12 4V2M12 20V22M6.41421 6.41421L5 5M17.728 17.728L19.1422 19.1422M4 12H2M20 12H22M17.7285 6.41421L19.1427 5M6.4147 17.728L5.00049 19.1422M12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <a href="/ooh">Ooh_Log</a>
    </li>

    <li class="menu-item">
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" class="stroke-icon">
          <path d="M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9M15 17H18.5905C18.973 17 19.1652 17 19.3201 16.9478C19.616 16.848 19.8475 16.6156 19.9473 16.3198C19.9997 16.1643 19.9997 15.9715 19.9997 15.5859C19.9997 15.4172 19.9995 15.3329 19.9863 15.2524C19.9614 15.1004 19.9024 14.9563 19.8126 14.8312C19.7651 14.7651 19.7048 14.7048 19.5858 14.5858L19.1963 14.1963C19.0706 14.0706 19 13.9001 19 13.7224V10C19 6.134 15.866 2.99999 12 3C8.13401 3.00001 5 6.13401 5 10V13.7224C5 13.9002 4.92924 14.0706 4.80357 14.1963L4.41406 14.5858C4.29476 14.7051 4.23504 14.765 4.1875 14.8312C4.09766 14.9564 4.03815 15.1004 4.0132 15.2524C4 15.3329 4 15.4172 4 15.586C4 15.9715 4 16.1642 4.05245 16.3197C4.15225 16.6156 4.3848 16.848 4.68066 16.9478C4.83556 17 5.02701 17 5.40956 17H9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <a href="/notice">공지사항</a>
    </li>

    <li class="menu-item" v-if="isManager">
      <span class="icon"><img src="/admin.png" alt="admin" width="18px" height="18px"></span>
      <a href="/admin">관리자 페이지</a>
    </li>

    <!-- <li class="menu-item">
      <span class="icon"><BellIcon /></span>
      <a href="/mypage">마이페이지</a>
    </li> -->

    <div v-if="loginFlag" class="member-info-section">
      <div class="member-row">
        <span class="member-id-label">ID : </span>
        <span class="member-id-value">{{ userId }}</span>
      </div>
      <div class="member-row">
        <span class="member-date-label">가입일 : </span>
        <span class="member-date-value">{{ signupDate }}</span>
      </div>
    </div>

    <template #footer>
      <blockquote class="quote">"실수는 버그가 아니라 <br> 
      </br>성장의 패치노트입니다."</blockquote>
    </template>
  </MobileNav>
</template>

<script setup>
import { onMounted, onUpdated, ref, watch } from 'vue'
import HamburgerButton from './HamburgerButton.vue'
import MobileNav from './MobileNav.vue'
import { useUserStore } from '@/stores/useUserInfo'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/useToast'

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
const loginFlag = ref(false)
const userStore = useUserStore();
const router = useRouter();
const toastStore = useToastStore();
const isManager = ref(false)
const userId = userStore.memberId;
const signupDate = userStore.signUpDate;
const loginPage = ()=>{
  router.push('/login')
  open.value = false;
}
const logoutPage = async ()=>{
  sessionStorage.removeItem('userInfo');
  open.value = false;
  await router.replace('/');
  location.reload();
}
const myPage = ()=>{
  open.value = false;
  router.push('/mypage')
}
onUpdated(()=>{
  if(userStore.token)loginFlag.value=true;
  if(userStore.auth.includes('ROLE_ADMIN'))isManager.value=true;
})

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

.user-info{
  list-style-type: none;
  
}
.login-btn {
  width: 100%;
  background-color: #f3eddd;
  color: #4b3a2f;
  border: none;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  margin-top: 10px;
}

.login-btn:hover {
  background-color: #e5ddc7;
}

.my-page-btn {
  width: 100%;
  background-color: #1a1402;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.my-page-btn:hover {
  background-color: #4b3a2f;
}

.stroke-icon * {
  fill: none;                         /* 내부 채우기 제거 */
  stroke: currentColor;               /* 부모 color를 따름 */
  stroke-width: 2;                    /* 선 굵기 */
  stroke-linecap: round;              /* 선 끝 둥글게 */
  stroke-linejoin: round;             /* 모서리 둥글게 */
  vector-effect: non-scaling-stroke;  /* 확대/축소에도 선굵기 유지 */
}

/* 기본 색 */
.icon { color: #3b2906; }

.member-info-section {
  margin-top: auto;
  margin-bottom: 18px;
  background: none;
  padding: 0 18px 0 0;
}

.member-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 13px;
  margin-bottom: 2px;
  color: #928d89;
}

.member-id-label,
.member-date-label {
  font-weight: 500;
  margin-right: 3px;
  color: #97928e;
}

.member-id-value,
.member-date-value {
  font-weight: 500;
}

</style>
