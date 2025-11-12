<template>
  <div class="search">
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      @input="onInput"
      @keyup.enter="$emit('search')"
    />
    <button @click="$emit('search')">검색</button>
    <button class="clear" v-if="modelValue" @click="clear">✕</button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '내용, 태그, 감정으로 검색…' },
  debounce: { type: Number, default: 0 },
});

const emit = defineEmits(['update:modelValue', 'search']);

let timer = null;
const onInput = (e) => {
  const val = e.target.value;

  if (!props.debounce) {
    emit('update:modelValue', val);
    return;
  }

  clearTimeout(timer);
  timer = setTimeout(() => emit('update:modelValue', val), props.debounce);
};

const clear = () => {
  emit('update:modelValue', '');
  // emit('search'); // 필요하면 활성화
};
</script>

<style scoped>
.search{
  position:relative;
  display:flex;
  gap:8px;
  margin-bottom:12px;
}
.search input{
  flex:1;
  border:1px solid #e3dcc8;
  border-radius:12px;
  padding:12px 14px;
  outline:none;
  background:#f8f3e6;
}
.search button{
  border:none;
  border-radius:12px;
  padding:0 16px;
  background:#7a8d56;
  color:white;
  cursor:pointer;
}
.search .clear{
  position:absolute;
  right:92px;
  top:50%;
  transform:translateY(-50%);
  border:1px solid #e3dcc8;
  background:#fff;
  color:#6c6f60;
  padding:2px 8px;
}
</style>
