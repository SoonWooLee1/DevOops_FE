<template>
  <nav class="tabs-wrap">
    <ul class="tabs">
      <li v-for="t in tabs" :key="t.name" class="tab-item">
        <RouterLink
          :to="{ name: t.name }"
          class="tab-link"
          :class="{ active: $route.name === t.name }"
        >
          {{ t.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const tabs = [
  { name:'mypage-info',      label:'개인정보 수정' },
  { name:'mypage-oops',      label:'Oops 기록' },
  { name:'mypage-ooh',       label:'Ooh 기록' },
  { name:'mypage-growth',    label:'성장 그래프' },
  { name:'mypage-reco',      label:'추천게시글' },
  { name:'mypage-bookmarks', label:'북마크기록' },
  { name:'mypage-followers', label:'팔로우기록' },
  { name:'mypage-settings',  label:'설정' },
]
</script>

<style scoped>
/* 캡슐 배경 (연한 베이지) */
.tabs-wrap{
  background:#ECE5CC;                 /* 캡슐 배경색 */
  border:1px solid rgba(0,0,0,.06);   /* 아주 옅은 테두리 */
  border-radius:28px;
  padding:3px 0px;                  /* 캡슐 안쪽 여백 */
  margin:0 0 24px;
  display:flex;
  justify-content:center;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25); /* 살짝 입체감 */
}

/* 리스트 */
.tabs{
  display:flex;
  gap:40px;                           /* 탭 간 간격 */
  padding:0;
  margin:0;
  list-style:none;
  align-items:center;
  font-size: 12px;
}

/* li */
.tab-item{ display:flex; align-items:center; }

/* 링크(버튼) */
.tab-link{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:10px 16px;
  border-radius:16px;
  text-decoration:none;
  font-weight:600;
  line-height:1.2;
  border:1px solid transparent;
  color:#2B2B2B !important;           /* 진한 회갈색 텍스트 */
  background:transparent;
  white-space:nowrap;
  transition:background .18s ease, box-shadow .18s ease, border-color .18s ease;
}

/* 활성 탭: 하얀 알약 + 은은한 그림자 */
.tab-link.active{
  background:#FFFFFF;
  border-color:rgba(0,0,0,.08);
  box-shadow:0 1px 0 rgba(0,0,0,.05), 0 2px 8px rgba(0,0,0,.06);
}

/* 비활성 호버: 살짝 밝아짐 */
.tab-link:not(.active):hover{
  background:rgba(255,255,255,.45);
  border-color:rgba(0,0,0,.06);
}
</style>
