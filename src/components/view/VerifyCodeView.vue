<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useToastStore } from "@/stores/useToast";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserInfo";

const verifyCode = ref("");
const username = ref("");
const email = ref("");
const birth = ref('2000-01-01');
const toastStore = useToastStore();
const userStore = useUserStore();
const verifyCodeRoute = useRoute();
const router = useRouter();
const entered = ref(false);
const tempPw = ref('');
const tempPwFlag = ref(false);

onMounted(()=>{
  requestAnimationFrame(() => (entered.value = true));
  email.value = verifyCodeRoute.params.email
})

const handleFindPw = async () => {
  console.log(email.value,verifyCode.value)
  if (!verifyCode.value) {
    toastStore.showToast("인증번호가 입력되지 않았습니다.");
    return;
  }

  try{
    const response = await axios.put('/api/member/verify-pw',{
      email:email.value,
      verifyCode:verifyCode.value
    })
    const data = response.data
    console.log(data);
    toastStore.showToast("인증 성공");
    tempPwFlag.value=true;
    tempPw.value = data.newPw;
    // router.push('/login')
  }catch(error){
    toastStore.showToast("유효한 인증번호가 아닙니다.");
  }
}

</script>

<template>
  <div class="login-container" :class="{ entered }">

    <div class="login-form">
      <div class="form-group">
        <label for="verifyCode">인증번호</label>
        <input
          id="verifyCode"
          type="text"
          v-model="verifyCode"
          placeholder="인증번호를 입력하세요"
        />
      </div>


      <div class="form-group">
        <button @click.stop="handleFindPw" class="find-btn">인증번호 입력</button>
      </div>
    </div>
    <div class="form-group" v-if="tempPwFlag">
      <label for="verifyCode">임시 비밀번호가 발급되었습니다.</label>
      <p>{{ tempPw }}</p>
    </div>
  </div>
</template>


<style scoped>
/* 전체 배경 */
.login-container {
  background-color: #f7f1df;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* ✅ 페이드 인 초기 상태 */
  opacity: 0;
  transform: translateY(25px);
  transition: all 0.7s ease;
}


/* ✅ 애니메이션 완료 상태 */
.login-container.entered {
  opacity: 1;
  transform: translateY(0);
}

/* 제목 */
.login-title {
  font-size: 2rem;
  font-weight: 600;
  color: #4b3a2f;
  margin-bottom: 2rem;
}

/* 폼 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
  padding-bottom: 10%;
}

/* 라벨 */
.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #5a4636;
  margin-bottom: 4px;
}

.find-form-group{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1px;
}

/* 입력창 */
.form-group input {
  width: 91.5%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d6c8b2;
  background-color: #fcf8ef;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.08);
  font-size: 0.95rem;
  outline: none;
}

.form-group input:focus {
  border-color: #b8a483;
}

/* 버튼 */
.find-btn {
  width: 100%;
  background-color: #f3eddd;
  color: #4b3a2f;
  border: none;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.find-btn:hover {
  background-color: #e5ddc7;
}

</style>