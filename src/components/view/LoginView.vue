<script setup>
import axios from "axios";
import { ref } from "vue";
import { useToastStore } from "@/stores/useToast";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserInfo";


const username = ref("");
const password = ref("");
const toastStore = useToastStore();
const userStore = useUserStore();
const router = useRouter();

const handleLogin = async () => {
  if (!username.value || !password.value) {
    toastStore.showToast("아이디와 비밀번호를 입력해주세요.");
    return;
  }
  console.log("로그인 시도:", username.value, password.value);
  // 로그인 요청
  try {
  const response = await axios.post('/api/login', {
    member_id: username.value,
    member_pw: password.value
  });

  const data = response.data;
  const token = response.headers.token
  userStore.setUserInfo(
    data.id,
    data.memberId,
    data.email,
    data.name,
    data.birth,
    data.gender,
    data.signUpDate,
    data.roles,
    token
  );

  toastStore.showToast("로그인 되었습니다.");

  router.push("/");
  } catch (error) {
    console.log(error);
    toastStore.showToast(error.response.data.error)
  }
};

const signUp = () => {
  toastStore.showToast("회원가입 페이지로 이동합니다.");
  router.push("/signup");
};

const findId = () => {
  toastStore.showToast("아이디 찾기 페이지로 이동합니다.");
  // router.push("/find-id");
};

const findPw = () => {
  toastStore.showToast("비밀번호 찾기 페이지로 이동합니다.");
  // router.push("/find-password");
};
</script>

<template>
  <div class="login-container">
    <h1 class="login-title">로그인</h1>

    <div class="login-form">
      <div class="form-group">
        <label for="username">아이디</label>
        <input
          id="username"
          type="text"
          v-model="username"
          placeholder="아이디를 입력하세요"
        />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <div class="form-group">
        <button @click.stop="handleLogin" class="login-btn">로그인</button>
      </div>
      <div class="form-group">
        <button @click.stop="signUp" class="sign-up-btn">회원가입</button>
      </div>
      <div class="form-group">
        <div class="find-form-group">
          <button @click.stop="findId" class="find-btn">아이디 찾기</button>
          <button @click.stop="findPw" class="find-btn">비밀번호 찾기</button>
        </div>
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
.login-btn {
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

.login-btn:hover {
  background-color: #e5ddc7;
}

.sign-up-btn {
  width: 100%;
  background-color: #1a1402;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.sign-up-btn:hover {
  background-color: #4b3a2f;
}

.find-btn {
  width: 40%;
  background-color: #f3eddd;
  color: #4b3a2f;
  border: none;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  margin: 0 6px;
}

.find-btn:hover {
  background-color: #e5ddc7;
}

</style>