<template>
  <footer class="site-footer" aria-label="하단 링크">
    <nav class="footer-nav">
      <RouterLink class="footer-link" to="/main">홈</RouterLink>
      <RouterLink class="footer-link" to="/about">소개</RouterLink>
      <RouterLink v-if="router.hasRoute('Notice')" class="footer-link" :to="{ name:'Notice' }">공지사항</RouterLink>
      <RouterLink v-if="router.hasRoute('Contact')" class="footer-link" :to="{ name:'Contact' }">문의</RouterLink>
    </nav>
    <div class="copyright">© 2025 Oops_Log. 당신의 성장을 응원합니다.</div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.site-footer{
  position: fixed;
  left: 0; right: 0; bottom: 0;
  height: calc(var(--footer-h) + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  display: grid; place-items: center;
  z-index: 100;
}

.footer-nav{
  display: inline-flex; gap: 28px;
  align-items: center; justify-content: center;
  font-size: 12px; letter-spacing: .04em; opacity: .72;
}

.footer-link{ color: inherit; text-decoration: none; }
.footer-link:hover{ text-decoration: underline; opacity: .9; }

@media (hover:none){ .footer-link{ padding:6px 4px; } }

.sep{ opacity: .3; }
.copyright{
  text-align: center; opacity: .4; font-size: 12px; line-height: 16px;
}
</style>