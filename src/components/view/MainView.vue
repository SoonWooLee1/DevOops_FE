<template>
  <!-- ✅ (변경) 이 컴포넌트는 '본문 영역'만 담당합니다.
       헤더/푸터는 App.vue에서 고정 렌더 → 여기선 제거 -->
  <main class="main-canvas" role="main">
    <!-- ✅ 배경 레이어 (스크롤 유발 안 하도록 절대+숨김) -->
    <div class="ink-bg" aria-hidden="true">
      <svg class="ink ink-a" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#88AA82" opacity="0.4" />
      </svg>
      <svg class="ink ink-b" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="60" fill="#55433B" opacity="0.2" />
      </svg>
    </div>

    <div class="paper-noise" aria-hidden="true"></div>

    <!-- ✅ 중앙 래퍼: 카피 + CTA -->
    <section class="hero">
      <!-- ⬇️ 이 래퍼가 고정 높이를 유지 -->
      <div class="copy-slot">
        <transition name="block" mode="out-in">
          <div :key="blockKey">
            <transition-group name="line" tag="div" class="copy" :key="messageKey">
              <p
                v-for="(ln, i) in currentLines"
                :key="`${messageKey}-${i}`"
                class="copy-line"
                :style="staggerStyle(i)"
              >
                {{ ln }}
              </p>
            </transition-group>
          </div>
        </transition>
      </div>

      <div class="cta">
        <button class="btn" @click="$emit('start')">
          <span class="btn__label">“오늘을 남기기”</span>
          <span class="btn__film" />
          <span class="btn__underline" />
        </button>
        <p class="hint">
          Oops 또는 Ooh,<br />
          오늘의 이야기를 기록해보세요
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
/* ✅ (변경) 전역 스크롤 제어 제거 + 이 컴포넌트는 타이머만 관리
   ※ 중요: 타입 표기(예: : number | undefined)를 쓰면 <script setup>에 lang="ts"가 필요.
           지금은 JS로 두고 타입 표기는 삭제해서 컴파일 오류를 방지 */
import { computed, onMounted, onUnmounted, ref } from 'vue'

defineEmits(['start','open-menu'])

const props = defineProps({
  pageIndex: { type: Number, default: 0 },
  /** 문구 전환 주기(ms) */
  transitionMs: { type: Number, default: 5000 },
})

// 메인 글귀들 (원본 유지)
const phrases = [
  "오늘의 당신도,\n충분히 빛나고 있습니다.\n\n조금씩\n나아가는 당신의 이야기가,\n이곳에 머뭅니다.",
  "실수해도 괜찮아요.\n그것이 당신을 더 깊게 만듭니다.\n\n천천히라도,\n당신의 길을 써 내려가세요.\n이곳이 그 출발점입니다.",
  "가끔은 멈춰서,\n숨을 고르는 시간도 필요하죠.\n\n당신의 기록은,\n언제나 앞으로 나아갑니다.\n오늘도 충분히 잘했어요.",
  "빛나지 않아도 괜찮아요.\n당신의 하루는 의미 있으니까요.\n\n작은 발걸음들이\n모여,\n당신의 이야기가 됩니다.",
  "실패조차\n당신을 완성시키는 문장입니다.\n\n오늘의 Oops가,\n내일의 Ooh가 되기를.\n이곳에서 함께 기록해요."
]

const idx = ref(0)
const messageKey = ref(0)
const blockKey = computed(() => `block-${messageKey.value}`)
const currentLines = computed(() => phrases[idx.value].split('\n'))
const pageLabel = computed(() => String(props.pageIndex + 1).padStart(3, '0'))

/** 라인 스태거 (원본 유지) */
const BASE_DELAY = 0.08
const STAGGER = 0.15
const staggerStyle = (i) => ({
  transitionDelay: `${(BASE_DELAY + i * STAGGER).toFixed(2)}s`,
  willChange: 'opacity, transform'
})

/* ✅ (중요 변경)
   - before: html/body overflow를 이 컴포넌트에서 잠궜음 → App의 고정 레이아웃과 충돌
   - after : 이 컴포넌트는 타이머만 관리 (전역 overflow 제어 X) */
let timer // ← ❗ 타입 표기 제거 (컴파일 오류 원인 제거)

onMounted(() => {
  timer = window.setInterval(() => {
    idx.value = (idx.value + 1) % phrases.length
    messageKey.value++
  }, props.transitionMs)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style>
:root{
  --copy-gap: 14px;
  --copy-lines: 3;
  --copy-lineheight: 2.15;
  --copy-h: calc((var(--copy-lineheight) * 1em * var(--copy-lines)) + ((var(--copy-lines) - 1) * var(--copy-gap)));
}

@keyframes fade-in-soft {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* =========================
   레이아웃 핵심 변경 포인트
   ========================= */

/* ✅ (중요 변경)
   - before: height:100dvh + 내부에서 Header/Footer까지 배치 → 뷰포트 초과·겹침 위험
   - after : App.vue가 헤더/푸터를 'fixed'로 고정 → 이 컴포넌트는 본문 100%만 사용
   - 또한 overflow-x는 방어적으로 숨김(가로 스크롤 방지) */
.main-canvas{
  position: relative;
  height: 100%;            /* ✅ 변경: 100dvh → 100% (App의 본문 영역에서만) */
  min-height: 100%;
  display: grid;
  place-items: center;     /* ✅ 중앙 배치 */
  background: var(--paper-bg);
  color: var(--ink);
  animation: fade-in-soft .8s ease both;
  padding: 0 16px;
  overflow-x: hidden;      /* ✅ 추가: 가로 스크롤 방지 */
}

/* ✅ (유지/정리) 중앙 래퍼 */
.hero{
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 30px;
  padding: 40px 0 32px;    /* ✅ 약간의 상하 여백만 (큰 margin/translate 제거) */
}

/* ✅ (유지) 고정 높이 래퍼: 줄 전환 시 점프 방지 */
.copy-slot{
  position: relative;
  height: var(--copy-h);
  display: grid;
  place-items: center;
  width: min(640px, 90vw);
}

/* ✅ (유지) 카피 타이포 */
.copy{
  display: grid;
  gap: var(--copy-gap);
  text-align: center;
  color: rgba(85,67,59,.9);
  padding: 0 8px;
  font-family: 'EB Garamond','Noto Serif KR',serif,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;
  text-shadow: 0 1px 2px rgba(78, 78, 77, 0.05);
  letter-spacing: .02em;
  line-height: 2.15;

  /* ✅ 레이아웃 안정화 */
  justify-items: stretch;
  contain: layout paint;
  height: 100%;
  overflow: hidden;
}

.copy-line{
  font-size: clamp(15px, 1.05vw, 18px);
  line-height: 0;
  display: block;
  width: 100%;
  text-align: center;
  transform: translateY(0);
}

/* ✅ (중요 변경) CTA 큰 마진 제거: 뷰포트 초과 스크롤 유발 요소 컷 */
.cta{
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 12px;
  justify-self: center;
  margin-top: 200px;        /* ✅ before: 200px → after: 16px */
}

/* 버튼·힌트 (기존 유지) */
.btn{
  appearance: none;
  border: 1px solid var(--ink);
  background: rgba(255,255,255,.35);
  color: var(--ink);
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-family: 'Inter', system-ui, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  letter-spacing: .02em;
  transition: background-color .25s, box-shadow .25s, transform .15s;
  position: relative;
  overflow: hidden;
}
.btn:hover{ background: rgba(255,255,255,.6); box-shadow: 0 6px 18px rgba(0,0,0,.06); transform: translateY(-1px); }
.btn__film{ position:absolute; inset:0; background: rgba(136,170,130,.06); transform: scaleX(0); transform-origin:left; transition: transform .6s; z-index:1; }
.btn:hover .btn__film{ transform: scaleX(1); }
.btn__underline{ position:absolute; left:0; right:0; bottom:0; height:1px; background: var(--accent); transform: scaleX(0); transform-origin:left; transition: transform .5s; z-index:2; }
.btn:hover .btn__underline{ transform: scaleX(1); }

.hint{
  font-family: 'Inter', system-ui, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: var(--ink-50);
  font-size: 12px;
  text-align: center;
  letter-spacing: 0.5px;
  line-height: 2.7;
}

/* ✅ (유지) 트랜지션 */
.block-enter-from { opacity: 0; transform: translateY(10px); }
.block-enter-active { transition: opacity .45s ease, transform .45s ease; }
.block-leave-to { opacity: 0; transform: translateY(-6px); }
.block-leave-active {
  transition: opacity .35s ease, transform .35s ease;
  position: absolute;
  inset: 0;
}

.line-enter-from { opacity: 0; transform: translateY(8px); }
.line-enter-active { transition: opacity .45s ease, transform .45s ease; }
.line-leave-to { opacity: 0; transform: translateY(-6px); }
.line-leave-active { transition: opacity .30s ease, transform .30s ease; }
.line-move { transition: none !important; }

.copy { position: relative; width: min(640px, 90vw); justify-items: center; }
.copy-line { will-change: opacity, transform; transform: translateY(0); justify-self: center; }

/* ✅ (중요) 배경 레이어는 절대+숨김: 오버플로우로 스크롤 유발하지 않게 */
.ink-bg{ position: absolute; inset: 0; pointer-events: none; overflow: hidden; opacity: .03; }
.ink{ position: absolute; width: 24rem; height: 24rem; }
.ink-a{ top: 25%; left: 22%; }
.ink-b{ right: 22%; bottom: 30%; width: 16rem; height: 16rem; }
@keyframes breatheA{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
@keyframes breatheB{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
.ink-a{ animation: breatheA 8s ease-in-out infinite; transform-origin:center; }
.ink-b{ animation: breatheB 10s ease-in-out infinite; transform-origin:center; }

.paper-noise{ position:absolute; inset:0; pointer-events:none; opacity:.03; background-size:400px 400px; }

/* 접근성: 모션 최소화 */
@media (prefers-reduced-motion: reduce) {
  .block-enter-active,
  .block-leave-active,
  .line-enter-active,
  .line-leave-active { transition: none !important; }
  .ink-a, .ink-b { animation: none; }
}
</style>
