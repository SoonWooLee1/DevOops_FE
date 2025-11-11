<template>
  <teleport to="body">
    <div v-if="modelValue" class="layer" aria-hidden="false">
      <div class="overlay" @click="close"></div>

      <aside ref="panel" class="drawer" role="dialog" aria-modal="true">
        <button v-if="internalClose" class="close" aria-label="닫기" @click="close">×</button>

        <div class="header-slot"><slot name="header" /></div>
        <ul class="menu"><slot /></ul>
        <div class="footer-slot"><slot name="footer" /></div>
      </aside>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: { default: false },
  internalClose: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const panel = ref(null)
let prevOverflow = ''

function close(){ emit('update:modelValue', false) }
function onKey(e){ if(e.key === 'Escape') close() }

/* ★ pointerdown 하나만 사용해서 중복 제거 */
function onOutside(e){
  const el = panel.value
  if (el && !el.contains(e.target)) close()
}

onMounted(() => {
  watch(() => props.modelValue, (open) => {
    if (open) {
      document.addEventListener('keydown', onKey)
      document.addEventListener('pointerdown', onOutside, { passive: true })  // ★ 변경
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onOutside)                   // ★ 변경
      document.body.style.overflow = prevOverflow || ''
    }
  }, { immediate: true })
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('pointerdown', onOutside)
  document.body.style.overflow = prevOverflow || ''
})
</script>

<style scoped>
.layer{ position: fixed; inset: 0; z-index: 10000; }
.overlay{ position:absolute; inset:0; background: rgba(0,0,0,.45);
  backdrop-filter: blur(1px) saturate(80%); z-index:10000; }
.drawer{
  position:absolute; top:0; right:0; height:100%; width:360px; max-width:86vw;
  background:#f6f1e0; box-shadow:-12px 0 32px rgba(0,0,0,.24);
  padding:22px 18px 24px; transform: translateX(0); animation: slide-in 200ms ease;
  display:flex; flex-direction: column; z-index:10001;
}
@keyframes slide-in{ from{ transform: translateX(100%);} to{ transform: translateX(0);} }
.close{ position:absolute; top:10px; right:12px; width:32px; height:32px; border-radius:8px;
  border:none; background:transparent; color:#55433B; font-size:20px; line-height:1; cursor:pointer; }
.close:hover{ background: rgba(0,0,0,.06); }
.header-slot{
   margin:8px 6px 12px; 
   color:#55433B; 
   opacity:.9; }
.footer-slot{
  position: sticky;          /* ✅ 영역 안에서만 세로로 “달라붙음” */
  bottom: 20px;
  margin: 8px 6px 0;
  padding-top: 8px;
  background: #f6f1e0;       /* 스크롤 겹침 방지용 배경 */
   }
.menu{ display:flex; flex-direction:column; gap:6px; padding:8px 4px; margin:6px 0 8px; flex:1 1 auto; overflow:auto; }
</style>
