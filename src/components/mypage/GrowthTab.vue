<template>
  <div class="tab-page">
    <h2 class="tab-title">성장 그래프</h2>

    <div class="stat-cards">
      <div class="card">총 기록 <strong>{{ total }}</strong></div>
      <div class="card">Oops <strong>{{ oops }}</strong></div>
      <div class="card">Ooh <strong>{{ ooh }}</strong></div>
    </div>

    <div class="chart-box">
      <p>여기에 차트가 들어갑니다 (추후 Chart.js 또는 ApexCharts 연결)</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const total = ref(0)
const oops = ref(0)
const ooh = ref(0)
</script>

<style scoped>
.stat-cards { display:flex; gap:10px; margin-bottom:20px; }
.card { flex:1; padding:16px; border:1px solid #ddd; border-radius:8px; background:#fff; text-align:center; }
.chart-box { height:300px; border:1px dashed #ccc; border-radius:8px; display:flex; justify-content:center; align-items:center; }
</style>
