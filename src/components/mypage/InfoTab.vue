<template>
  <div class="tab-page">
    <h2 class="tab-title">개인정보</h2>

    <div class="form-wrap">
      <label>아이디</label>
      <input v-model="memberId" class="input" />

      <label>이메일</label>
      <input v-model="email" class="input" />

      <label>비밀번호</label>
      <input v-model="password" type="password" class="input" placeholder="변경할 비밀번호를 입력하세요." />
      
      <label>비밀번호 재입력</label>
      <input v-model="confirmPassword" type="password" class="input" placeholder="한번 더 비밀번호를 확인해주십시오." />
      <button class="btn" @click="save">저장하기</button>
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/useToast';
import { useUserStore } from '@/stores/useUserInfo'
import axios from 'axios';
import { onMounted, ref } from 'vue'

const userStore = useUserStore();
const memberId = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const toastStore = useToastStore();
onMounted(()=>{
  memberId.value = userStore.memberId
  email.value = userStore.email
})

const save = async () => {
   console.log("",memberId.value,"\n",
   email.value,"\n",
   password.value,"\n",
  )
  if (!memberId.value || !email.value || !password.value || !confirmPassword.value) {
    toastStore.showToast("모든 항목을 입력해주세요");
    return;
  }
  if (password.value !== confirmPassword.value) {
    toastStore.showToast("비밀번호가 일치하지 않습니다");
    return;
  }
  try {
    await axios.put('/api/member/modify',{
      id:userStore.id,
      memberId:memberId.value,
      memberPw:password.value,
      email:email.value
    },
    {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    }
  )
  userStore.memberId = memberId.value;
  userStore.email = email.value;
  password.value = '';
  confirmPassword.value = '';
  toastStore.showToast("회원 정보 수정이 완료되었습니다.");
  } catch (error) {
    toastStore.showToast("중복된 아이디 혹은 이메일이 존재합니다.");
  }
}

</script>

<style scoped>
.tab-page { padding: 16px; }
.tab-title { font-size: 20px; margin-bottom: 16px; font-weight: 700; }
.input { width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #ddd; }
.btn { background:#88aa82; color:#fff; padding:10px; border-radius:8px; width:100%; }
</style>
