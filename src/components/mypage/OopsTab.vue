<template>
  <div class="oops-view">
    <!-- 상단 -->
    <div class="top">
      <h1 class="title">내 Oops 기록</h1>
      <p class="subtitle">하루의 아쉬움을 돌아보는 공간 🌧</p>
    </div>

    <!-- 달력 -->
    <OopsGrassCalendar />

    <!-- 상태 표시 -->
    <div v-if="loading" class="skeleton"></div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="list.length === 0" class="empty">
      아직 작성한 Oops 기록이 없습니다.
    </div>

    <!-- 목록 -->
    <section v-else class="list">
      <RecordCard
        v-for="item in list"
        :key="item.id"
        :post="item"
        record-type="oops"
        :fetch-likes="false"
        @click="goDetail(item.id)"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import OopsGrassCalendar from "@/components/record/OopsGrassCalendar.vue"
import RecordCard from "@/components/record/RecordCard.vue"
import { useUserStore } from "@/stores/useUserInfo"

const router = useRouter()
const userStore = useUserStore()

const list = ref([])
const loading = ref(false)
const error = ref("")

onMounted(async () => {
  try {
    loading.value = true
    const userId = userStore.id
    if (!userId) {
      error.value = "로그인이 필요합니다."
      return
    }

    // ✅ API 호출
    const res = await axios.get(`/api/oops/${userId}/mypage`)
    if (Array.isArray(res.data)) {
      // ✅ RecordCard 표준 구조에 맞게 매핑
      list.value = res.data.map(it => ({
        id: it.oopsId ?? it.id,
        title: it.oopsTitle ?? it.title,
        content: it.oopsContent ?? it.content,
        createdAt: it.oopsCreateDate ?? it.createdAt,
        tags: it.tagNames ?? it.tags ?? [],
        likes: it.likeCount ?? 0,
        userName: it.id
      }))
    } else {
      console.warn("예상치 못한 응답 형식:", res.data)
      list.value = []
    }
  } catch (e) {
    console.error(e)
    error.value = "Oops 기록을 불러오지 못했습니다."
  } finally {
    loading.value = false
  }
})

function goDetail(id) {
  router.push({ name: "DetailOops", params: { id: String(id) } })
}
</script>

<style scoped>
:root {
  --bg:#f6f1e0; --ink:#55433b; --soft:#eae4cf; --borderSoft: rgba(136,170,130,.25);
}

.oops-view {
  width: 896px;
  margin: 0 auto;
  padding-top: 88px;
  color: var(--ink);
  background: var(--bg);
  min-height: 100vh;
}

/* 상단 */
.top {
  margin-bottom: 28px;
  text-align: center;
}
.title {
  font-size: 44px;
  line-height: 62px;
  letter-spacing: 0.6px;
  font-weight: 700;
}
.subtitle {
  margin-top: 4px;
  opacity: 0.7;
  font-size: 16px;
  letter-spacing: 0.1px;
}

/* 목록 */
.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
}

/* 상태 */
.empty {
  text-align: center;
  padding: 24px;
  opacity: 0.7;
}
.error {
  padding: 12px;
  border: 1px solid rgba(200,0,0,.25);
  border-radius: 8px;
  background: rgba(200,0,0,.05);
  color: #a00;
  text-align: center;
}
.skeleton {
  height: 120px;
  border: 1px solid var(--borderSoft);
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(136,170,130,.08), rgba(136,170,130,.12), rgba(136,170,130,.08));
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
