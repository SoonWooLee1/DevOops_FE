<template>
  <!-- 햄버거: 우상단 고정, 드로어 열리면 X로 변신 -->
  <HamburgerButton v-model="open" fixed />

   <!-- 드로어: 내부 X 버튼은 숨김(햄버거가 닫기 역할) -->
   <MobileNav v-model="open" :internal-close="false">
    <template #header>
      <p class="hello">
        안녕하세요 관리자 페이지입니다<br />
        좋은 하루 입니다
      </p>
    </template>

    <li class="menu-item">
      <span class="icon"><img src="/public/home.png" alt="home" width="18px" height="18px"></span>
      <RouterLink to="/">홈</RouterLink>
    </li>

    <li class="menu-item">
      <span class="icon"><img src="/public/member.png" alt="home" width="18px" height="18px"></span>
      <RouterLink to="/admin/member">회원</RouterLink>
    </li>

    <li class="menu-item">
      <span class="icon"><img src="/public/report.png" alt="home" width="18px" height="18px"></span>
      <RouterLink to="/admin/report">신고</RouterLink>
    </li>

    <li class="menu-item">
      <span class="icon"><img src="/public/tag.png" alt="home" width="18px" height="18px"></span>
      <RouterLink to="/admin/tag">태그</RouterLink>
    </li>

    <template #footer>
      <blockquote class="quote">"실수는 버그가 아니라 성장의 패치노트입니다."</blockquote>
    </template>
  </MobileNav>
</template>

<script setup>
import { ref } from 'vue'
import HamburgerButton from '@/components/common/HamburgerButton.vue'
import MobileNav from '@/components/common/MobileNav.vue'

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

.hello{ color:#55433B; opacity:.9; line-height:1.7; margin:4px 0 8px; }
.quote{
  margin-top: 8px; padding: 12px 14px; border-radius: 8px;
  background: rgba(0,0,0,.04); color:#55433B; font-size:14px;
}
</style>