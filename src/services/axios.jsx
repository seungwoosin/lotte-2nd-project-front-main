import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});


// 요청 인터셉터
let refreshing = false;
let subscribers = [];

// 대기 중인 요청을 저장하는 함수
const addSubscriber = (callback) => {
    subscribers.push(callback);
};

// 토큰이 갱신되면 대기 중인 모든 요청을 재개하는 함수
const notifySubscribers = (token) => {
    subscribers.forEach(callback => callback(token));
    subscribers = [];
};

axiosInstance.interceptors.request.use(
    async (config) => {
        let accessToken = useAuthStore.getState().getAccessToken();

        if (!accessToken) {
            if (!refreshing) {
                refreshing = true;

                const refreshToken = useAuthStore.getState().getRefreshToken();

                if (refreshToken) {
                    try {
                        const newAccessToken = await useAuthStore.getState().refreshAccessToken();
                        accessToken = newAccessToken;
                        useAuthStore.getState().setAccessToken(accessToken);  // 새 액세스 토큰을 상태에 저장

                        // 대기 중인 모든 요청에 새 액세스 토큰 전달
                        notifySubscribers(accessToken);

                        config.headers['Authorization'] = `Bearer ${accessToken}`;  // 갱신된 토큰을 설정
                        refreshing = false;

                        return config; // 갱신 후 최초의 요청을 진행

                    } catch (error) {
                        refreshing = false;
                        return Promise.reject(error);  // 갱신 실패 시 요청 거부
                    }
                } else {
                    return Promise.reject('No refresh token available');
                }
            }

            // 리프레시 중일 경우 요청을 대기열에 추가
            return new Promise((resolve) => {
                addSubscriber((newAccessToken) => {
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    resolve(config);  // 대기 중인 요청에 새 액세스 토큰을 추가하고 config 반환
                });
            });
        } else {
            // 액세스 토큰이 있을 경우 바로 헤더에 추가
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 오류이고, 재시도하지 않은 요청인지 확인
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 재시도 플래그 설정

            try {
                // 리프레시 토큰을 통해 새로운 액세스 토큰을 갱신
                const newAccessToken = await useAuthStore.getState().refreshAccessToken();
                if (newAccessToken) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // 새 액세스 토큰을 헤더에 추가
                    return axiosInstance(originalRequest); // 실패한 요청 재시도
                }
            } catch (refreshError) {
                // 갱신 실패 시 로그아웃 처리
                useAuthStore.getState().logout();
            }
        }

        return Promise.reject(error); // 갱신 실패 또는 다른 에러일 경우 에러 반환
    }
);

export default axiosInstance;
