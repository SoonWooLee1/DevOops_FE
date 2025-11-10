<template>
  <main class="page">
    <h1>공지</h1>
    <ul>
      <li>서비스 알파 버전 오픈</li>
      <li>업데이트 내역은 추후 공지됩니다.</li>
    </ul>
  </main>
      <!-- 푸터 -->
    <FooterView />
</template>

<script setup>
import HeaderView from '../common/HeaderView.vue'
</script>

<style scoped>
.page { width: min(800px, 90vw); margin: 40px auto; line-height: 1.8; }
</style>
