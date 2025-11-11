<template>
  <div class="cmt-wrap">
    <div class="cmt-head">
      <span class="ico" aria-hidden="true"></span>
      <span class="cmt-title">댓글</span>
      <span v-if="totalCount" class="cmt-count">({{ totalCount }})</span>
    </div>

    <ul v-if="canLoad" class="cmt-list">
      <li v-for="c in comments" :key="c.id" class="cmt-item">
        <div class="row-top">
          <strong class="name">{{ (c.writerName || c.name) ?? '익명' }}</strong>
          <time class="ago">{{ toAgo(c.create_date || c.createDate || c.createdAt) }}</time>
        </div>
        <p class="body">{{ c.content }}</p>
      </li>
      <li v-if="hasNext" class="more">
        <button class="btn-more" type="button" :disabled="loading" @click="loadMore">더 보기</button>
      </li>
    </ul>

    <div v-if="loading" class="hint">불러오는 중…</div>
    <div v-if="error" class="err">
      {{ error }} <button class="link" type="button" @click="retry">다시 시도</button>
    </div>

    <!-- 입력 -->
    <div v-if="canLoad" class="input-wrap">
      <div class="input-inner">
        <textarea
          v-model.trim="text"
          class="ta"
          rows="4"
          placeholder="공지에 대한 의견을 남겨주세요…"
          :disabled="submitting"
        ></textarea>

        <!-- 오른쪽 아래 고정 버튼 -->
        <button
        class="btn-send"
        type="button"
        :disabled="submitting || !text"
        @click="onSubmit"
        >
        <span class="plane">✈</span>
        댓글 작성
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { fetchNoticeComments, createNoticeComment, deleteComment } from '../api/comments'

const props = defineProps({
  noticeId: { type: [String, Number], required: true },
  myUserId: { type: [String, Number], default: null },
})

const comments = ref([])
const page = ref(1)
const size = ref(10)
const hasNext = ref(true)
const totalCount = ref(0)
const loading = ref(false)
const submitting = ref(false)
const deletingId = ref(null)
const error = ref('')
const text = ref('')

const numericId = computed(() => {
  const v = Number(props.noticeId)
  return Number.isFinite(v) ? v : NaN
})
const canLoad = computed(() => Number.isFinite(numericId.value))

function toAgo(iso){
  if(!iso) return '방금 전'
  const d = new Date(iso); if(isNaN(d)) return '방금 전'
  const diff=(Date.now()-d.getTime())/1000
  if(diff<60) return '방금 전'
  if(diff<3600) return `${Math.floor(diff/60)}분 전`
  if(diff<86400) return `${Math.floor(diff/3600)}시간 전`
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0')
  return `${y}.${m}.${day}`
}

async function loadMore(){
  if(!canLoad.value || loading.value || !hasNext.value) return
  loading.value=true; error.value=''
  try{
    const list = await fetchNoticeComments(numericId.value,{page:page.value,size:size.value})
    const arr = Array.isArray(list)? list : (list.list ?? [])
    const next = Array.isArray(list)? (arr.length===size.value) : !!list.hasNextPage
    const tc = Array.isArray(list)? (totalCount.value||arr.length) : (list.totalCount ?? totalCount.value)
    comments.value.push(...arr)
    hasNext.value=next; totalCount.value=tc; page.value+=1
  }catch(e){ error.value='댓글을 불러오지 못했어요.' }
  finally{ loading.value=false }
}

async function onSubmit(){
  if(!text.value || !canLoad.value) return
  submitting.value=true; error.value=''
  try{
    const saved = await createNoticeComment(numericId.value, text.value)
    const item = saved?.comment ?? saved?.data ?? saved ?? { id:Date.now(), content:text.value, create_date:new Date().toISOString() }
    comments.value.unshift(item)
    totalCount.value+=1; text.value=''
  }catch(e){ error.value='댓글 등록에 실패했어요.' }
  finally{ submitting.value=false }
}

async function onDelete(c){
  if(!canLoad.value || deletingId.value) return
  if(!confirm('이 댓글을 삭제하시겠어요?')) return
  deletingId.value=c.id
  try{ await deleteComment(c.id); comments.value = comments.value.filter(x=>x.id!==c.id); totalCount.value=Math.max(0,totalCount.value-1) }
  finally{ deletingId.value=null }
}

function retry(){ error.value=''; loadMore() }
if (canLoad.value) loadMore()
</script>

<style scoped>
:root{
  --bg:#f6f1e0; --ink:#55433b; --ink60:rgba(85,67,59,.6);
  --green:#88aa82; --line:rgba(136,170,130,.28);
}

.cmt-wrap{ margin-top:12px; color:var(--ink); }
.cmt-head{ display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.cmt-title{ font-weight:700; }
.cmt-count{ opacity:.6; }

.cmt-list{ display:flex; flex-direction:column; gap:8px; }
.cmt-item{ border:1px solid var(--line); border-radius:10px; background:rgba(136,170,130,.08); padding:10px 12px; }
.row-top{ display:flex; align-items:center; }
.name{ font-weight:700; color:#3b3a35; }
.ago{ margin-left:auto; font-size:12px; color:var(--ink60); }
.body{ margin-top:6px; white-space:pre-wrap; word-break:break-word; }

.input-wrap{
  margin-top:10px;
  border:1px solid var(--line);
  border-radius:10px;
  background:#fff;
  padding:10px 12px;
  /* ✅ 박스 모델 명확화 + 넘침 방지 */
  box-sizing: border-box;
  overflow: hidden;
}

.input-inner{
     position:relative; 
}

.ta{
  width:100%;
  min-height:120px;
  border:1px solid var(--line);
  border-radius:8px;
  padding:10px;
  /* ✅ 버튼 자리(오른쪽/아래) 확보 */
  padding-right:130px;
  padding-bottom:56px;
  font-size:14px; line-height:20px; color:var(--ink); background:#fff;
  box-sizing: border-box;
}

/* ✅ 오른쪽 아래 고정 버튼 */
.btn-send{
  position:absolute;
  right:18px;   /* textarea 안쪽 여백과 균형 */
  bottom:16px;
  display:inline-flex; align-items:center; gap:6px;
  background:#9bb998; color:#fff; border:none;
  padding:8px 16px; border-radius:12px; font-size:14px; font-weight:600;
  cursor:pointer; transition:background .15s ease, transform .1s ease;
  z-index:1;
}

.btn-send .plane {
  font-size: 16px;
  display: inline-block;
  transform: translateY(1px);
}
.btn-send:hover:not(:disabled){ background:#8faa85; }
.btn-send:active:not(:disabled){ transform:scale(.97); }
.btn-send:disabled{ background:#c7d5c4; cursor:not-allowed; opacity:.7; }

.more{ display:flex; justify-content:center; }
.btn-more{ background:transparent; border:1px solid var(--line); border-radius:999px; padding:6px 12px; cursor:pointer; }

.hint{ margin-top:6px; text-align:center; opacity:.7; font-size:13px; }
.err{ margin-top:6px; padding:8px; border:1px solid rgba(200,0,0,.25); background:rgba(200,0,0,.06); border-radius:8px; }
.link{ background:none; border:0; text-decoration:underline; cursor:pointer; margin-left:6px; }


</style>
