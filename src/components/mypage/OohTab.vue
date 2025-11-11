<template>
  <div class="tab-page">
    <h2 class="tab-title">Ooh 기록</h2>

    <div class="empty" v-if="list.length === 0">
      아직 Ooh 기록이 없습니다.
    </div>

    <ul v-else class="list">
      <li v-for="(item,i) in list" :key="i">
        <p>{{ item.content }}</p>
        <span class="date">{{ item.date }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const list = ref([])
</script>

<style scoped>
.list li { border:1px solid #ddd; padding:12px; border-radius:8px; margin-bottom:8px; background:#fff; }
.date { font-size:12px; opacity:0.7; }
.empty { text-align:center; padding:20px; opacity:0.6; }
</style>
