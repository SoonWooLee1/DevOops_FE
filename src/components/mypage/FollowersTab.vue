<template>
  <div class="tab-page">
    <h2 class="tab-title">팔로우 기록</h2>

    <div v-if="list.length === 0" class="empty">팔로우한 사람이 없습니다.</div>

    <ul v-else class="list">
      <li v-for="(user,i) in list" :key="i">
        <span>{{ user.name }}</span>
      </li>
    </ul>

  </div>
</template>

<script setup>
import { ref } from 'vue'
const list = ref([])
</script>

<style scoped>
.list li { padding:12px; border-bottom:1px solid #eee; }
.empty { padding:20px; text-align:center; opacity:.6; }
</style>
