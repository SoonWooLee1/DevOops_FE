<template>
  <button
    :class="['hamburger', { fixed }]"
    :aria-expanded="modelValue ? 'true' : 'false'"
    aria-label="메뉴 토글"
    aria-controls="mobile-nav"
    @pointerdown.stop 
    @click.stop.prevent="$emit('update:modelValue', !modelValue)" 
  >
    <span class="sr-only">모바일 메뉴 토글</span>
    <span :class="['bar', modelValue ? 'bar-top-open' : 'bar-top']"></span>
    <span :class="['bar', modelValue ? 'bar-mid-open' : 'bar-mid']"></span>
    <span :class="['bar', modelValue ? 'bar-bot-open' : 'bar-bot']"></span>
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: { default: false },
  fixed: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.hamburger{
  position: relative;
  width: 36px; height: 36px;
  display:inline-flex; align-items:center; justify-content:center;
  border:none; background: transparent; cursor:pointer;
  color:#55433B; border-radius: 999px;
}
.hamburger:hover{ background: rgba(0,0,0,.06); }
.hamburger:focus-visible{ outline: 2px solid #88AA82; outline-offset: 2px; }
.hamburger.fixed{ position: fixed; top: 18px; right: 18px; z-index: 10002; }

.sr-only{ position:absolute; width:1px; height:1px; padding:0; margin:-1px;
  overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
.bar{ position:absolute; width:16px; height:1.6px; background: currentColor;
  border-radius:2px; transition: transform 200ms ease, opacity 200ms ease; }
.bar-top{ transform: translateY(-5px); } .bar-mid{ transform: translateY(0); }
.bar-bot{ transform: translateY(5px); }
.bar-top-open{ transform: rotate(45deg); }
.bar-mid-open{ opacity:0; transform: translateX(-4px); }
.bar-bot-open{ transform: rotate(-45deg); }
@media (prefers-reduced-motion: reduce){ .bar{ transition:none; } }
</style>
