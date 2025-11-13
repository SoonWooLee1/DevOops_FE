<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal">
      <!-- 헤더 -->
      <header class="modal-header">
        <h2 class="modal-title">신고하기</h2>
        <button class="close-btn" @click="close">×</button>
      </header>

      <!-- 카테고리 선택 -->
      <section class="section">
        <div class="label">신고 유형을 선택해주세요</div>

        <div class="chip-list">
          <button
            v-for="c in categoryList"
            :key="c.id"
            class="chip"
            :class="{ active: selected === c.id }"
            @click="selected = c.id"
          >
            {{ c.name }}
          </button>
        </div>
      </section>

      <!-- 제출 -->
      <footer class="modal-footer">
        <button class="submit-btn" @click="submitReport">신고 제출</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/components/api/client";
import { useUserStore } from "@/stores/useUserInfo"; 

const userStore  = useUserStore(); 

const props = defineProps({
  visible: Boolean,
  targetType: String,
  targetId: Number
});
const emit = defineEmits(["close", "submitted"]);

const categoryList = ref([]);
const selected = ref(null);

function close() {
  emit("close");
}

async function fetchCategories() {
  try {
    const res = await api.get("/report/category");
    categoryList.value = res.data;
  } catch (err) {
    console.error("카테고리 조회 실패", err);
  }
}

async function submitReport() {
   if (!selected.value) {
    alert("신고 유형을 선택해주세요.");
    return;
  }

  try {
    // 기본 값 (categoryId, userId)
    const body = {
      categoryId: selected.value,
      userId: userStore.id
    };

    // targetType 에 따라 필드 동적 설정
    if (props.targetType === "oops") {
      body.oopsId = props.targetId;
    } else if (props.targetType === "ooh") {
      body.oohId = props.targetId;
    } else if (props.targetType === "comment") {
      body.commentId = props.targetId;
    }

    await api.post("/report", body);

    emit("submitted");
    emit("close");
  } catch (err) {
    console.error("신고 실패", err);
    alert("신고 제출에 실패했습니다.");
  }
}

onMounted(fetchCategories);
</script>

<style scoped>
/* ===== 오버레이 ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.32);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
}

/* ===== 모달 컨테이너 ===== */
.modal {
  width: 100%;
  max-width: 400px;
  background: #fffdf8;
  border: 1px solid #efe6cf;
  border-radius: 18px;
  padding: 20px 22px;
  box-shadow: 0 14px 22px rgba(34,30,20,.1);
  animation: fadeIn .18s ease;
}

/* ===== 헤더 ===== */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-title {
  font-size: 20px;
  font-weight: 800;
  color: #2c2a26;
}
.close-btn {
  background: none;
  border: none;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  color: #8c8674;
}
.close-btn:hover {
  color: #5a564d;
}

/* ===== 라벨 ===== */
.section {
  margin-top: 18px;
}
.label {
  font-size: 13px;
  color: #8b8577;
  margin-bottom: 8px;
}

/* ===== 신고 유형 칩 ===== */
.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #e7dfc6;
  background: #f5f1e4;
  color: #5e574b;
  transition: .15s;
}
.chip.active {
  background: #e6f5e4;
  border-color: #cfe7cc;
  color: #2f5c2d;
  font-weight: 700;
}

/* ===== 제출 버튼 ===== */
.modal-footer {
  margin-top: 26px;
  text-align: right;
}
.submit-btn {
  background: #7db67b;
  color: #fff;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: 0.15s;
}
.submit-btn:hover {
  background: #6aa76a;
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
