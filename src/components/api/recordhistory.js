import api from './axios';

// ooh기록 count
export async function dailyCountOohRecord(token) {
    const { data } = await api.get('/count-ooh', {
    headers: {
        Authorization: `Bearer ${token}`,
    }
    });
    return data;
}

// ooh count 수 조회
export async function oohDailyCount(token) {
    const { data } = await api.get('/ooh-daily-count', {
    headers: {
        Authorization: `Bearer ${token}`,
    }
    });
    return data;
}

// oops기록 count
export async function dailyCountOopsRecord(token) {
    const { data } = await api.get('/count-oops', {
    headers: {
        Authorization: `Bearer ${token}`,
    }
    });
    return data;
}

// oops count 수 조회
export async function oopsDailyCount(token) {
    const { data } = await api.get('/oops-daily-count', {
    headers: {
        Authorization: `Bearer ${token}`,
    }
    });
    return data;
}