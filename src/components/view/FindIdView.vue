<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useToastStore } from "@/stores/useToast";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserInfo";


const username = ref("");
const email = ref("");
const birth = ref('2000-01-01');
const toastStore = useToastStore();
const userStore = useUserStore();
const router = useRouter();
const entered = ref(false);

onMounted(()=>{
  requestAnimationFrame(() => (entered.value = true));
})

const handleFindId = async () => {
  console.log("",username.value,"\n",
    email.value,"\n",
    birth.value,"\n",
  )
  if (!username.value || !email.value || !birth.value) {
    toastStore.showToast("모든 항목을 입력해주세요");
    return;
  }

  try{
    await axios.post('/api/member/find-id',{
      name:username.value,
      email:email.value,
      birth:birth.value
    })
    toastStore.showToast("이메일로 아이디를 전송했습니다.");
    router.push('/login')
  }catch(error){
    toastStore.showToast("회원을 찾지 못했습니다.");
  }
}

</script>

<template>
  <div class="login-container" :class="{ entered }">
    <h1 class="login-title">아이디 찾기</h1>

    <div class="login-form">
      <div class="form-group">
        <label for="username">이름</label>
        <input
          id="username"
          type="text"
          v-model="username"
          placeholder="이름을 입력하세요"
        />
      </div>

      <div class="form-group">
        <label for="username">이메일</label>
        <input
          id="username"
          type="text"
          v-model="email"
          placeholder="email@example.com"
        />
      </div>

      <div class="form-group">
        <label for="username">생년월일</label>
        <input
          id="username"
          type="date"
          v-model="birth"

        />
      </div>

      <div class="form-group">
        <button @click.stop="handleFindId" class="find-btn">아이디 찾기</button>
      </div>
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