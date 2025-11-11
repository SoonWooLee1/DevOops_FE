<template>
  <div class="tab-page">
    <h2 class="tab-title">개인정보</h2>

    <div class="form-wrap">
      <label>닉네임</label>
      <input v-model="nickname" class="input" placeholder="닉네임을 입력하세요" />

      <label>이메일</label>
      <input v-model="email" class="input" placeholder="이메일을 입력하세요" />

      <label>비밀번호</label>
      <input v-model="password" type="password" class="input" placeholder="변경할 비밀번호를 입력하세요" />

      <button class="btn" @click="save">저장하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nickname = ref('')
const email = ref('')
const password = ref('')

function save() {
  alert('저장 완료 (API 나중에 연결)')
}
</script>

<style scoped>
.tab-page { padding: 16px; }
.tab-title { font-size: 20px; margin-bottom: 16px; font-weight: 700; }
.input { width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #ddd; }
.btn { background:#88aa82; color:#fff; padding:10px; border-radius:8px; width:100%; }
</style>
