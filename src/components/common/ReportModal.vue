<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal">
        <h3 class="modal-title">신고하기</h3>
  
        <!-- 카테고리 선택 -->
        <div class="form-group">
          <label>신고 사유</label>
          <select v-model="selectedCategory">
            <option value="" disabled>신고 사유를 선택하세요</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
  
        <!-- 버튼 영역 -->
        <div class="modal-actions">
          <button class="btn cancel" @click="close">취소</button>
          <button class="btn submit" @click="submitReport" :disabled="loading">
            {{ loading ? "신고 중..." : "신고하기" }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from "vue";
  import axios from "axios";
  import { useUserStore } from "@/stores/useUserInfo";
  
  const props = defineProps({
    visible: Boolean,      // 부모 컴포넌트에서 모달 열림 여부
    targetType: String,    // 'oops' | 'ooh' | 'comment'
    targetId: Number       // 신고 대상 ID
  });
  
  const emits = defineEmits(["close", "submitted"]);
  
  const userStore = useUserStore();
  const categories = ref([]);
  const selectedCategory = ref("");
  const loading = ref(false);
  
  // 모달이 열릴 때마다 카테고리 불러오기
  watch(() => props.visible, (val) => {
    if (val) fetchCategories();
  });
  
  // GET 요청: 신고 카테고리 조회
  async function fetchCategories() {
    try {
      const res = await axios.get("/api/report/category");
      categories.value = res.data;
    } catch (err) {
      console.error("카테고리 불러오기 실패:", err);
    }
  }
  
  // POST 요청: 신고 등록
  async function submitReport() {
    if (!selectedCategory.value) {
      alert("신고 사유를 선택해주세요.");
      return;
    }
  
    const body = {
      categoryId: selectedCategory.value,
      userId: userStore.id, // Pinia에서 로그인된 사용자 ID
    };
  
    // targetType에 따라 key 다르게 설정
    if (props.targetType === "oops") body.oopsId = props.targetId;
    else if (props.targetType === "ooh") body.oohId = props.targetId;
    else if (props.targetType === "comment") body.commentId = props.targetId;
  
    try {
      loading.value = true;
      await axios.post("api/report", body, {
        headers: { "Content-Type": "application/json" },
      });
      alert("신고가 접수되었습니다.");
      emits("submitted");
      close();
    } catch (err) {
      console.error("신고 실패:", err);
      alert("신고 처리 중 오류가 발생했습니다.");
    } finally {
      loading.value = false;
    }
  }
  
  function close() {
    emits("close");
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:1000;
  }
  .modal {
    background:#fff;
    border-radius:12px;
    padding:24px;
    width:320px;
    box-shadow:0 2px 10px rgba(0,0,0,0.2);
  }
  .modal-title {
    font-size:18px;
    margin-bottom:16px;
  }
  .form-group {
    margin-bottom:20px;
  }
  select {
    width:100%;
    padding:8px;
    border:1px solid #ccc;
    border-radius:8px;
  }
  .modal-actions {
    display:flex;
    justify-content:flex-end;
    gap:10px;
  }
  .btn {
    padding:8px 14px;
    border-radius:6px;
    cursor:pointer;
  }
  .btn.cancel {
    background:#eee;
  }
  .btn.submit {
    background:#ff4d4f;
    color:#fff;
  }
  </style>
  