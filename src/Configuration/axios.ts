import { AxiosResponse, AxiosError, Axios } from 'axios';
import { useAuthStore } from '@/store/auth';
import i18next from 'i18next';
import themeConfig from '@/theme.config';

let isRefreshing = false;
let failedQueue: (() => void)[] = [];

export const setupAxios = (axios: Axios) => {
    axios.interceptors.request.use(
        (config) => {
            config.baseURL = import.meta.env.VITE_API_ENDPOINT;
            config.headers.Accept = 'application/json';
            config.headers['Accept-Language'] = 'th';
            config.withCredentials = true;

            i18next.on('languageChanged', (lng) => {
                config.headers['Accept-Language'] = lng;
            });

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            const originalRequest: any = error.config;

            if (error?.response?.status !== 401 || originalRequest?._retry) {
                return Promise.reject(error);
            }

            try {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push(() => {
                            axios.request(originalRequest).then(resolve).catch(reject);
                        });
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const refreshResp = await useAuthStore.getState().refresh();

                if (refreshResp?.success === false) {
                    failedQueue.forEach((request) => request());
                    failedQueue = [];
                    return Promise.reject(error);
                }

                failedQueue.forEach((request) => request());
                failedQueue = [];

                return axios.request(originalRequest);
            } catch (err) {
                failedQueue.forEach((request) => request());
                failedQueue = [];
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
    );
};
