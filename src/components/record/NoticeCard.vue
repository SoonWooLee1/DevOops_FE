<template>
  <article
    class="card"
    :class="[{ pinned: badge === '고정' }, { expanded }]"
  >
    <!-- 헤더: 배지/제목/날짜/토글 -->
    <header
      class="head"
      role="button"
      tabindex="0"
      @click="emit('toggle')"
      @keydown.enter.prevent="emit('toggle')"
      @keydown.space.prevent="emit('toggle')"
      :aria-expanded="expanded.toString()"
    >
      <div class="head-left">
        <span class="dot-icon" aria-hidden="true"></span>
        <span v-if="badge" class="pill">{{ badge }}</span>
        <h2 class="title">{{ title }}</h2>
      </div>

      <div class="head-right">
        <time v-if="date" class="date">{{ date }}</time>
        <span class="caret" aria-hidden="true"></span>
      </div>
    </header>

    <!-- 디바이더 -->
    <div class="divider" v-show="expanded" aria-hidden="true"></div>

    <!-- 본문 -->
    <section class="body" v-show="expanded">
      <div class="content" v-html="content"></div>
    </section>
  </article>
</template>

<script setup>
const props = defineProps({
  badge: String,     // '고정' | '중요' | '공지'
  date: String,      // 'YYYY.MM.DD'
  title: String,
  content: String,   // HTML 허용
  expanded: Boolean, // 외부에서 제어
})
const emit = defineEmits(['toggle'])
</script>

<style scoped>
:root{
  --ink:#55433b; --bg:#f6f1e0;
  --green:#88aa82; --green10:rgba(136,170,130,.08);
  --border:#88aa82; --borderSoft:rgba(136,170,130,.30);
}

.card{
  border:1.6px solid var(--border);
  background:var(--green10);
  border-radius:10px;
  padding:12px 16px;
  transition: box-shadow .2s ease, background-color .2s ease;
}
.card:not(.expanded){ background: rgba(136,170,130,.05); }
.card.pinned{ background:var(--green10); }

.head{
  display:flex; align-items:center; justify-content:space-between;
  cursor:pointer; user-select:none; outline:none;
}
.head:focus-visible{ box-shadow:0 0 0 3px rgba(136,170,130,.35) inset; border-radius:8px; }

.head-left{ display:flex; align-items:center; gap:8px; min-width:0; }
.dot-icon{
  width:14px; height:14px; border-radius:50%;
  border:1.6px solid var(--green); position:relative; flex:0 0 auto;
}
.dot-icon::after{
  content:""; position:absolute; width:6px; height:6px; border-radius:50%;
  background:var(--green); top:50%; left:50%; transform:translate(-50%,-50%);
}

.pill{
  background:var(--green); color:#fff; font-size:12px; line-height:16px;
  padding:2px 8px; border-radius:9999px; flex:0 0 auto;
}
.title{
  color:var(--ink); font-weight:600;
  font-size:20px; line-height:28px; letter-spacing:.2px;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}

.head-right{ display:flex; align-items:center; gap:12px; }
.date{ font-size:12px; line-height:16px; color:var(--ink); opacity:.5; }
.caret{
  width:10px; height:10px; border-right:2px solid var(--ink);
  border-bottom:2px solid var(--ink); transform:rotate(-45deg);
  transition: transform .18s ease, opacity .18s ease; opacity:.6;
}
.card.expanded .caret{ transform:rotate(135deg); }

.divider{ height:1px; background:var(--borderSoft); margin:12px 0; }
.body{ opacity:.95; }
.content{ color:var(--ink); font-size:14.4px; line-height:24.48px; }
</style>
