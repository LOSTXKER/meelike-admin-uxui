import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/user';

export interface UserStore {
    totalData: number;
    data: any[];
    selected: any;
    getAll: (filters?: any) => Promise<{ success: boolean; data: any[] }>;
    getAllUser: () => Promise<{ success: boolean; data: any[] }>;
    getOne: (id: string) => Promise<{ success: boolean; data: any }>;
    create: (data: any) => Promise<{ success: boolean; data: any }>;
    update: (id: string, data: any) => Promise<{ success: boolean; data: any }>;
    remove: (id: string) => Promise<{ success: boolean; data: any }>;
    export: (filters?: any) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    totalData: 0,
    data: [],
    selected: {},
    getAll: async (filters) => {
        return axios
            .get(`${API_SLUG}`, { params: filters })
            .then((response) => {
                set({ data: response.data?.data?.data ?? [], totalData: response.data?.data?.totalItems ?? 0 });
                return { success: true, data: response.data?.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getAllUser: async () => {
        return axios
            .get(`${API_SLUG}/all`)
            .then((response) => {
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getOne: async (id) => {
        return axios
            .get(`${API_SLUG}/${id}`)
            .then((response) => {
                set({ selected: response.data?.data ?? {} });
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    create: async (data) => {
        return axios
            .post(`${API_SLUG}`, data)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    update: async (id, data) => {
        return axios
            .patch(`${API_SLUG}/${id}`, data)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    remove: async (id) => {
        return axios
            .delete(`${API_SLUG}/${id}`)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    export: async (filters) => {
        return axios
            .get(`${API_SLUG}/export`, { params: filters, responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `users-${new Date().toISOString()}.xlsx`);
                document.body.appendChild(link);
                link.click();
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => {
        set({ totalData: 0, data: [], selected: {} });
    },
}));
