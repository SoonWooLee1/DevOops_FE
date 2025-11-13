<template>
  <div class="signup-container">
    <div class="signup-card" :class="{ entered }">
      <!-- 뒤로가기 -->
      <button class="back-btn" @click="navigateToLogin">
        ← 로그인으로 돌아가기
      </button>

      <!-- 로고 및 제목 -->
      <div class="header" :class="{ visible: entered }">
        <h1>시작하기</h1>
        <p>당신만의 서재를 만들어보세요</p>
      </div>

      <!-- 폼 -->
      <div class="form-box" :class="{ visible: entered }">
        <!-- 아이디 -->
        <div class="form-group">
          <label for="memberId">아이디</label>
          <input id="memberId" v-model="memberId" type="text" placeholder="아이디를 입력하세요" />
        </div>

        <!-- 비밀번호 -->
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input id="password" v-model="password" type="password" placeholder="최소 6자 이상" />
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>

        <!-- 이름 -->
        <div class="form-group">
          <label for="name">이름</label>
          <input id="name" v-model="name" type="text" placeholder="이름을 입력하세요" />
        </div>

        <!-- 이메일 -->
        <div class="form-group">
          <label for="email">이메일</label>
          <input id="email" v-model="email" type="email" placeholder="your@email.com" />
        </div>

        <!-- ✅ 생년월일 -->
        <div class="form-group">
          <label for="birth">생년월일</label>
          <input id="birth" v-model="birth" type="date"/>
        </div>

        <!-- ✅ 성별 -->
        <div class="form-group">
          <label>성별</label>
          <div class="gender-group">
            <label>
              <input type="radio" value="M" v-model="gender" />
              남성
            </label>
            <label>
              <input type="radio" value="F" v-model="gender" />
              여성
            </label>
          </div>
        </div>

        <!-- 버튼 -->
        <button class="signup-btn" @click="handleSubmit">서재 만들기</button>

        <p class="policy-text">
          회원가입을 진행하면 개인정보 보호 정책에 동의하는 것으로 간주됩니다.<br />
          모든 기록은 브라우저에 안전하게 저장됩니다.
        </p>
      </div>

      <!-- 하단 문구 -->
      <div class="footer" :class="{ visible: entered }">
        <p>"당신의 하루는 기록될 가치가 있습니다."</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToastStore } from "@/stores/useToast";
import { useRouter } from "vue-router";
import axios from "axios";


const toastStore = useToastStore();
const emit = defineEmits(["signup", "navigateToLogin"]);

const memberId = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const name = ref("");
const birth = ref('2000-01-01');     // ✅ 추가
const gender = ref("");    // ✅ 추가
const entered = ref(false);
const router = useRouter()

const navigateToLogin = ()=>{
  router.push('/login')
}
onMounted(() => {
  requestAnimationFrame(() => (entered.value = true));
});

const handleSubmit = async () => {
  console.log("",memberId.value,"\n",
    password.value,"\n",
    name.value,"\n",
    email.value,"\n",
    birth.value,"\n",
    gender.value,"\n",
  )
  if (!memberId.value || !email.value || !password.value || !confirmPassword.value || !name.value || !birth.value || !gender.value) {
    toastStore.showToast("모든 항목을 입력해주세요");
    return;
  }
  if (password.value !== confirmPassword.value) {
    toastStore.showToast("비밀번호가 일치하지 않습니다");
    return;
  }
  if (password.value.length < 6) {
    toastStore.showToast("비밀번호는 최소 6자 이상이어야 합니다");
    return;
  }

  try {
    const response = await axios.post('/api/member/sign-up',{
      memberId:memberId.value,
      memberPw:password.value,
      email:email.value,
      name:name.value,
      birth:birth.value,
      gender:gender.value
    })
    console.log("axios 통신 완료");
    router.push('/login')
    toastStore.showToast("환영합니다! 당신의 서재가 준비되었습니다");
    router.push('/')
  } catch (error) {
    toastStore.showToast("중복된 아이디 혹은 이메일이 존재합니다.");
  }

  // const users = JSON.parse(localStorage.getItem("oopslog_users") || "[]");
  // if (users.some((u) => u.email === email.value)) {
  //   toastStore.showToast("이미 사용중인 이메일입니다");
  //   return;
  // }
  
  // users.push({
  //   memberId: memberId.value,
  //   email: email.value,
  //   password: password.value,
  //   name: name.value,
  //   birth: birth.value,
  //   gender: gender.value,
  // });
  // localStorage.setItem("oopslog_users", JSON.stringify(users));
  // localStorage.setItem("oopslog_current_user", email.value);

  // toastStore.showToast("환영합니다! 당신의 서재가 준비되었습니다");
  emit("signup");
}
</script>

<style scoped>
/* 성별 라디오 버튼 */
.gender-group {
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  color: #55433b;
  margin-top: 4px;
}

/* 라벨 전체 클릭 가능 */
.gender-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  position: relative;
  user-select: none;
}

/* 기본 라디오 숨기기 */
.gender-group input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(136, 170, 130, 0.5);
  border-radius: 50%;
  background-color: rgba(246, 241, 224, 0.9);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

/* 마우스 오버 */
.gender-group input[type="radio"]:hover {
  border-color: #88aa82;
  box-shadow: 0 0 5px rgba(136, 170, 130, 0.3);
}

/* 선택 시 */
.gender-group input[type="radio"]:checked {
  background-color: #88aa82;
  border-color: #88aa82;
  box-shadow: 0 0 6px rgba(136, 170, 130, 0.4);
}

/* 선택된 원 안의 점 (checked 표시) */
.gender-group input[type="radio"]:checked::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: white;
  transform: translate(-50%, -50%);
}
.signup-container {
  min-height: 70vh;
  background-color: #f6f1e0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.signup-card {
  width: 100%;
  max-width: 420px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.7s ease;
}

.signup-card.entered {
  opacity: 1;
  transform: translateY(0);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #55433b;
  background: none;
  border: none;
  font-size: 0.9rem;
  margin-bottom: 24px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.back-btn:hover {
  opacity: 0.6;
}

.form-box {
  background-color: rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(136, 170, 130, 0.3);
  border-radius: 10px;
  padding: 24px;
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.7s ease;
}

.form-box.visible {
  opacity: 1;
  transform: translateY(0);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.form-group label {
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #55433b;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="date"] {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid rgba(136, 170, 130, 0.3);
  background-color: rgba(246, 241, 224, 0.6);
  font-size: 0.95rem;
  color: #55433b;
  outline: none;
}

.form-group input:focus {
  border-color: #88aa82;
}

/* ✅ 성별 라디오 버튼 */
.gender-group {
  display: flex;
  gap: 20px;
  color: #55433b;
}

.gender-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.signup-btn {
  width: 100%;
  padding: 12px;
  background-color: #88aa82;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.3s;
}

.signup-btn:hover {
  background-color: #769c72;
}

.policy-text {
  text-align: center;
  font-size: 0.75rem;
  color: #55433b;
  opacity: 0.7;
  margin-top: 16px;
  line-height: 1.6;
}
</style>
