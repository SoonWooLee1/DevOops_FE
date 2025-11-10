<!-- src/components/pages/AboutView.vue -->
<template>
  <main class="about" role="main">
    <div class="container">
      <!-- 인라인 SVG 스프라이트(아이콘 정의) -->
      <svg width="0" height="0" style="position:absolute">
        <symbol id="ico-log" viewBox="0 0 24 24">
          <rect x="4" y="5" width="16" height="14" rx="3" fill="currentColor" opacity="0.08"/>
          <path d="M8 9h8M8 12h5M8 15h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </symbol>
        <symbol id="ico-heart-check" viewBox="0 0 24 24">
          <path d="M12 20s-7-4.6-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.4-7 9-7 9z" fill="currentColor" opacity="0.08"/>
          <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </symbol>
        <symbol id="ico-gauge" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.08"/>
          <path d="M12 12l5-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M7 15h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
        </symbol>
        <symbol id="ico-shield" viewBox="0 0 24 24">
          <path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" fill="currentColor" opacity=".08"/>
          <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </symbol>
      </svg>

      <!-- 상단: 돌아가기 -->
      <nav class="crumbs" aria-label="breadcrumb">
        <RouterLink to="/" class="crumbs__back" aria-label="돌아가기">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          돌아가기
        </RouterLink>
      </nav>

      <!-- 헤더 -->
      <header class="hero" role="banner" aria-label="소개 헤더">
        <h1 class="title">Oops_Log</h1>
        <p class="subtitle">
          실수와 성취를 기록하며<br />
          자기수용과 회복력을 키우는 조용한 서재
        </p>

        <blockquote class="lead">
          <p>완벽하지 않아도 괜찮습니다.<br />완성되지 않아도 괜찮습니다.</p>
        </blockquote>

        <p class="intro">
          Oops_Log는 실수(Oops)와 성취(Ooh)를 함께 기록하며 성장하는 공간입니다.
          흔들렸다면 살아있다는 증거이고, 빛났다면 성장했다는 증표입니다.
          당신의 하루는 기록될 가치가 있습니다.
        </p>
      </header>

      <!-- 사용방법 -->
      <section class="section" aria-labelledby="howto">
        <h2 id="howto" class="section__title">어떻게 사용하나요?</h2>

        <ul class="list">
          <li v-for="(item,i) in howto" :key="i" class="list__item">
            <div class="icon">
              <svg class="i" viewBox="0 0 24 24"><use :href="item.icon"></use></svg>
            </div>
            <div class="body">
              <h3 class="item__title">{{ item.title }}</h3>
              <p class="item__desc">{{ item.desc }}</p>
            </div>
          </li>
        </ul>
      </section>

      <!-- 왜 Oops_Log인가요? -->
      <section class="section" aria-labelledby="why">
        <h2 id="why" class="section__title">왜 Oops_Log인가요?</h2>
        <div class="panel">
          <p>
            우리는 완벽을 강요받는 시대에 살고 있습니다. SNS에는 성공과 행복만이 가득하고,
            실수와 좌절은 숨겨야 할 것처럼 여겨집니다.
          </p>
          <p>
            하지만 진짜 성장은 실수를 인정하고, 작은 성취를 축하하고, 흔들리는 나 자신을 받아들일 때 시작됩니다.
            Oops_Log는 당신이 완벽하지 않아도 괜찮다고 말합니다. 오늘 넘어졌다면, 다시 일어났다는 것이 더 중요합니다.
          </p>
          <p>
            이곳은 당신을 위한 조용한 서재입니다. 천천히, 솔직하게, 당신만의 이야기를 기록해보세요.
          </p>
        </div>
      </section>

      <!-- 엔딩 -->
      <section class="ending" aria-label="엔딩 메시지">
        <p class="quote">“실수는 버그가 아니라 성장의 패치노트입니다.”</p>
        <p class="quote-sub">지금 이 순간, 당신은 충분히 잘하고 있습니다.</p>
      </section>
    </div>
  </main>
</template>

<script setup>
// JS만 사용 (TS 없음)

// 리스트 데이터 (아이콘은 스프라이트의 symbol id를 href로 사용)
const howto = [
  {
    icon: '#ico-log',
    title: 'Oops - 실수의 기록',
    desc: '불안, 후회, 피로에 휩쓸리지 않게 합니다. 실수는 버그가 아니라 성장의 패치노트입니다. 스스로를 용서하고 다시 일어서는 연습을 합니다.'
  },
  {
    icon: '#ico-heart-check',
    title: 'Ooh - 성취의 기록',
    desc: '감사, 만족, 희망의 순간을 기록합니다. 작은 성취도 큰 의미가 있습니다. 오늘의 빛나는 순간을 놓치지 않습니다.'
  },
  {
    icon: '#ico-gauge',
    title: '감정 강도와 태그',
    desc: '오늘의 감정 강도와 유형을 표시하고 태그를 남깁니다. 시간이 지나면 나의 패턴이 보입니다.'
  },
  {
    icon: '#ico-shield',
    title: '안전한 기록 공간',
    desc: '비공개/익명 공개를 선택할 수 있습니다. 나만 보는 기록은 개인 공간에, 공유 시에는 익명으로 표시됩니다.'
  }
]
</script>

<style>
/* ===== Theme tokens ===== */
.about{
  --bg:#F6F0E3;         /* 따뜻한 베이지 */
  --surface:#F9F4E9;    /* 더 밝은 베이지 */
  --ink:#3A3A2A;        /* 본문 잉크색 */
  --muted:#6B6B5E;      /* 서브텍스트 */
  --sage:#7F8D6C;       /* 세이지 포인트 */
  --sage-weak:#E4EADB;  /* 연한 세이지 */
  --line:rgba(58,58,42,.18);
  --r:14px;

  background: var(--bg);
  color: var(--ink);
  display:flex; justify-content:center;
}
.container{width:100%; max-width:1440px; padding:48px 40px 96px;}

/* breadcrumb */
.crumbs{margin-bottom:10px;}
.crumbs__back{display:inline-flex; align-items:center; gap:6px; color:var(--muted); text-decoration:none;}
.crumbs__back:hover{color:var(--ink);}

/* 헤더 */
.hero{margin-top:4px; margin-bottom:36px;}
.title{
  font-family: ui-serif, "Times New Roman", Georgia, "Noto Serif KR", serif;
  font-size:56px; line-height:1.1; letter-spacing:-.02em; margin:0;
}
.subtitle{margin:10px 0 18px; color:var(--muted); font-size:20px; line-height:1.7;}

/* 인용 보더 */
.lead{
  margin:22px 0; padding:14px 16px; background:var(--surface);
  border-left:4px solid var(--sage); border-radius:8px; color:var(--ink);
}
.lead p{margin:0; line-height:1.7;}

.intro{color:var(--muted); line-height:1.85;}

/* 섹션 */
.section{margin-top:44px;}
.section__title{
  font-family: ui-serif, "Times New Roman", Georgia, "Noto Serif KR", serif;
  font-size:28px; margin:0 0 18px; letter-spacing:-.01em;
}

/* 리스트 카드 */
.list{display:flex; flex-direction:column; gap:14px; margin:0; padding:0; list-style:none;}
.list__item{
  display:grid; grid-template-columns:44px 1fr; gap:14px;
  background:var(--surface); border:1px solid var(--line); border-radius:var(--r);
  padding:14px 16px;
}
.icon{width:44px; height:44px; border-radius:50%; background:var(--sage-weak);
  display:flex; align-items:center; justify-content:center; color:var(--sage);}
.i{width:22px; height:22px;}
.item__title{margin:2px 0 6px; font-weight:700; font-size:16px;}
.item__desc{margin:0; color:var(--muted); line-height:1.8;}

/* 패널 */
.panel{
  background:var(--sage-weak); border:1px solid var(--line); border-radius:var(--r);
  padding:20px 22px; color:var(--ink);
}
.panel p{margin:0 0 12px; line-height:1.9;}
.panel p:last-child{margin-bottom:0;}

/* 엔딩 */
.ending{padding:48px 0 8px; text-align:center;}
.quote{
  font-family: 'EB Garamond','Noto Serif KR',serif,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;
  font-size:22px; color:#8F8A7E; margin:0 0 6px;
}
.quote-sub{color:#A49E92; margin:0;}

/* 반응형 */
@media (max-width: 840px){
  .title{font-size:44px;}
  .subtitle{font-size:18px;}
}
</style>
