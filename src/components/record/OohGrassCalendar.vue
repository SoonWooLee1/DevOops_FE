<template>
    <div class="cal">
        <calendar-heatmap
      :values="values"
      :end-date="endDate"
      :range-color="['#F6FCFD', '#E3F5FA', '#CAE8F4', '#A6DCEC', '#7CCFDF']"
      :round="3"
    />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CalendarHeatmap } from 'vue3-calendar-heatmap';
import { dailyCountOohRecord, oohDailyCount } from '@/components/api/recordhistory';
import { useUserStore } from '@/stores/useUserInfo';

const userStore = useUserStore();
const token = userStore.token;


const values = ref([]);
const endDate = ref(new Date()); // 캘린더의 마지막 날짜(오늘)

onMounted(async () => {
    const isCounted = await dailyCountOohRecord(token);
    console.log("기록집계 성공여부: ", isCounted);

    if (isCounted == 'success') {

        const data = await oohDailyCount(token);
        // DTO 리스트를 캘린더 용 구조로 변환
        values.value = data.map(item => ({
            date: item.count_date,    // count_date가 캘린더 날짜
            count: item.record_count  // record_count가 해당 날짜 기록 수
        }))
    } else {
        alert('기록 집계 실패');
    }

})
</script>

<style scoped>
.cal {
  font-size: 8px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
}
</style>