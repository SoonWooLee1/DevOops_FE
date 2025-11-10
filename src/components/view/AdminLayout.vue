<script>
import { RouterView, RouterLink } from 'vue-router'
import Sidebar from '../../components/admin/Sidebar.vue';

export default {
  components: { Sidebar }
}
</script>

<template>
  <div class="admin-layout">
    <Sidebar /> <!-- 관리자 메뉴 -->
    <div class="admin-content">
      <RouterView />
    </div>
  </div>
</template>

<style>
.admin-layout {
  position: fixed;  /* 화면에 고정 */
  inset: 0;         /* 전체 뷰포트 덮기 */
  display: flex;
  overflow: hidden; /* 내부 스크롤만 허용 */
}

.admin-content {
  position: absolute;
  inset: var(--header-h) 0 calc(var(--footer-h) + var(--safe-bottom)) 0;
  overflow: auto;       /* 여기서만 스크롤 */
  -webkit-overflow-scrolling: touch;
}
</style>

