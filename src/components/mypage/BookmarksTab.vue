<template>
  <div class="tab-page">
    <h2 class="tab-title">북마크한 기록</h2>

    <div v-if="list.length === 0" class="empty">북마크한 기록이 없습니다.</div>

    <ul v-else class="list">
      <li v-for="(item,i) in list" :key="i">
        {{ item.title }}
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
.empty { text-align:center; padding:20px; opacity:.6; }
</style>
