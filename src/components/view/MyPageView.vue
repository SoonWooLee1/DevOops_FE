<!-- src/views/mypage/MyPageView.vue -->
<template>
  <div class="page-wrap">
    <!-- 헤더 -->
    <button class="back" @click="$router.back()">← 돌아가기</button>
    <h1 class="title">마이페이지</h1>
    <p class="subtitle">당신의 성장 여정을 돌아봅니다</p>

    <!-- 탭 바: 라우터 기반 -->
    <MyPageTabs />

      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
          <component :is="Component" v-if="!$route.meta.keepAlive" />
      </router-view>

  </div>
</template>



<script setup>
import MyPageTabs from '../mypage/MyPageTabs.vue';
</script>

<style scoped>
.page-wrap { max-width: 1040px; margin: 0 auto; padding: 32px 24px; }
.back { border: none; background: transparent; color: #55433B; cursor: pointer; margin-bottom: 16px; }
.title { font-family: 'EB Garamond', serif; font-size: 40px; color: #55433B; margin: 0 0 8px; }
.subtitle { color: #55433B; opacity: .8; margin-bottom: 28px; }
</style>