<template>
  <div class="tab-page">
    <h2 class="tab-title">설정</h2>

    <div class="setting">
      <label>알림 설정</label>
      <select class="input">
        <option>전체 알림</option>
        <option>중요 알림만</option>
        <option>알림 끄기</option>
      </select>
    </div>

    <div class="setting">
      <label>계정 삭제</label>
      <button class="danger-btn">계정 삭제하기</button>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.setting { margin-bottom:20px; }
.input { width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; }
.danger-btn { background:#e36b6b; padding:10px; color:white; border-radius:8px; }
</style>
