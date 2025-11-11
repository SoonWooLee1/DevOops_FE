<template>
  <form class="oops-search" @submit.prevent="submit">
    <div class="bar">
      <span class="icon" aria-hidden>🔎</span>

      <input
        v-model="innerValue"
        type="search"
        :placeholder="placeholder"
        autocomplete="off"
        spellcheck="false"
      />

      <button
        v-if="innerValue"
        type="button"
        class="clear"
        @click="innerValue = ''"
        aria-label="입력 지우기"
        title="지우기"
      >×</button>

      <button type="submit" class="submit" :disabled="busy">검색</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: { type: String, default: '' },            // 검색어
    placeholder: { type: String, default: '제목 또는 내용 검색...' },
    busy: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'search'],
  data() {
    return { innerValue: this.modelValue }
  },
  watch: {
    innerValue(v) { this.$emit('update:modelValue', v) },
    modelValue(v) { this.innerValue = v }
  },
  methods: {
    submit() { this.$emit('search', this.innerValue) }
  }
}
</script>

<style scoped>
/* 브라우저 기본 검색 입력의 X 버튼 제거 */
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}
input[type="search"]::-ms-clear,
input[type="search"]::-ms-reveal { display: none; width: 0; height: 0; }

/* 레이아웃 */
.oops-search { width: 100%; }
.bar {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 12px;

  background: #ffffff;                /* 흰색 알약형 */
  border: 1px solid #e6e0d6;
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow:
    0 6px 18px rgba(0,0,0,0.08),
    inset 0 1px 0 rgba(255,255,255,.8);
}
.icon { opacity: .6; font-size: 18px; color: #7d6f63; }

input {
  border: none;
  outline: none;
  background: transparent;
  height: 28px;
  font-size: 16px;
  color: #3b2f2b;
}
input::placeholder { color: #a09286; }

.clear {
  height: 34px; min-width: 34px;
  border-radius: 10px;
  border: 1px solid #e9e1d7;
  background: #fff;
  color: #6d6056;
  cursor: pointer;
}
.submit {
  height: 36px; padding: 0 16px;
  border: none; border-radius: 12px;
  background: #f49a59;               /* 오렌지 버튼 */
  color: #2a221d; font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 0 rgba(0,0,0,.08);
}
.submit:disabled { opacity: .6; cursor: not-allowed; }

@media (max-width: 640px) {
  .bar { border-radius: 16px; padding: 12px 14px; }
  .submit { height: 34px; padding: 0 14px; }
}
</style>
