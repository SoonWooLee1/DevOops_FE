<template>
  <article class="card" @click="$emit('click')" role="button" tabindex="0">
    <div class="top">
      <div class="avatar">{{ post.userName || '익명' }}</div>
      <span class="time">{{ timeAgo(post.createdAt) }}</span>
      <span class="pill">{{ pillLabel }}</span>
    </div>

    <h3 class="title">{{ post.title }}</h3>
    <p class="content">{{ post.content }}</p>

    <div class="tags" v-if="post.tags?.length">
      <span v-for="(t,i) in post.tags" :key="i" class="tag">#{{ t }}</span>
    </div>
  </article>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { checkOohLikesCount, pushOohLikes } from  '../api/likes'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const pillLabel = computed(() => {
  return route.path.startsWith('/ooh') ? 'Ooh' : 'Oops'
});

const props = defineProps({
  post: { type: Object, required: true },
  fetchLikes: { type: Boolean, default: true },
  recordType: { type: String, default: 'ooh' },
})
const emit = defineEmits(['update:likes','click'])
const likeCount = ref(props.post.likes ?? 0)

// 타입별 함수 맵핑
const likeApis = {
  oops: {
    check: (id) => checkOopsLikesCount(id),
    count: (id) => getOopsLikesCount(id)
  },
  ooh: {
    check: (id) => checkOohLikesCount(id),
    count: (id) => getOohLikesCount(id)
  }
}


onMounted(async () => {
  if (!props.fetchLikes || !props.post?.id) return
  try {
    const r = await checkOohLikesCount(props.post.id)
    likeCount.value = typeof r === 'number' ? r : (r?.data?.count ?? r?.count ?? 0)
    emit('update:likes', likeCount.value)
  } catch (e) { console.error(e) }
})


async function onLike() {
  if (!props.post?.id) return
  try {
    await pushOohLikes(props.post.id)
    const r = await checkOohLikesCount(props.post.id)
    likeCount.value = typeof r === 'number' ? r : (r?.data?.count ?? r?.count ?? 0)
    emit('update:likes', likeCount.value)
  } catch (e) { console.error(e) }
}

// 날짜 표시하는거 바꿈
function timeAgo(iso) {
  if (!iso) return ''
  const d = new Date(iso)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  const hour = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')

  return `${year}.${month}.${day} ${hour}:${min}`
}

</script>

<style scoped>
/* 카드 컨테이너 */
.card{
  position: relative;
  background: rgba(237,240,237,.6);
  /* 보다 은은한 크림 경계 + 살짝 그림자 */
  border: 1px solid rgba(206,167,62,.35); /* #cea73e 기반 연한 테두리 */
  border-radius: 16px;
  padding: 18px 18px 14px;
  margin: 3px 0;
  box-shadow: 0 2px 10px rgba(34, 30, 20, .04);
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
  cursor: pointer;
}

/* hover/focus 시 살짝 떠오르는 느낌 */
.card:hover{
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 30, 20, .08);
  border-color: rgba(206,167,62,.55);
  background-color: rgba(136,170,130,.22);
}
.card:focus-within{
  outline: none;
  box-shadow: 0 0 0 3px rgba(206,167,62,.15), 0 6px 20px rgba(34,30,20,.08);
}

/* 헤더 라인 */
.top{
  display:flex; align-items:center; gap:10px;
  min-height: 36px;
}

/* 동그란 아바타 */
.avatar{
  width:36px; height:36px; border-radius:50%;
  background:#7a8d56; color:#fff;
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; letter-spacing:.2px;
  flex: 0 0 36px;
}

/* 시간 표기 */
.time{
  margin-left:8px; color:#7e806f; font-size:13px;
}

/* 우측 배지 */
.pill{
  margin-left:auto;
  font-size:12px; font-weight:600; letter-spacing:.2px;
  color:#5f6b48; background:#f4f7ef;
  border:1px solid #dfe7cf; border-radius:999px;
  padding:4px 10px;
}

/* 제목 */
.title{
  margin:10px 0 6px;
  font-size:17px; line-height:1.5; color:#2f312c;
  font-weight:700;
  /* 한 줄에서 넘치면 말줄임 */
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}

/* 본문 미리보기(2줄 clamp) */
.content{
  color:#595b50;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
  overflow:hidden;
  white-space:normal;
  line-height:1.7; font-size:14.5px;
  margin: 2px 0 8px;
}

/* 태그 */
.tags{
  margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;
}
.tag{
  font-size:12px; color:#4a5542;
  border:1px solid rgba(206,167,62,.35);
  background:#fffdfa;
  border-radius:999px; padding:4px 9px;
}

/* 접근성: 키보드 포커스 */
.card:focus{
  outline:none;
}
.card[tabindex="0"]:focus-visible{
  box-shadow: 0 0 0 3px rgba(206,167,62,.22);
}

/* 작은 화면 최적화 */
@media (max-width: 560px){
  .card{ padding: 16px 14px; }
  .title{ font-size:16px; }
  .content{ font-size:14px; -webkit-line-clamp:3; }
}
</style>
