import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/profile';

export interface ProfileStore {
    data: any;
    getProfile: () => Promise<{ success: boolean; data: any }>;
    updateProfile: (data: any) => Promise<{ success: boolean; data: any }>;
    changePassword: (data: any) => Promise<{ success: boolean; data: any }>;
    createApiKey: () => Promise<{ success: boolean; data: any }>;
    deleteApiKey: () => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    data: {},
    getProfile: async () => {
        return axios
            .get(`${API_SLUG}/me`)
            .then((response) => {
                set({ data: response.data?.data ?? {} });
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    updateProfile: async (data) => {
        return axios
            .patch(`${API_SLUG}`, data)
            .then((response) => {
                set({ data: response.data?.data ?? {} });
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    changePassword: async (data) => {
        return axios
            .post(`${API_SLUG}/change-password`, data)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    createApiKey: async () => {
        return axios
            .post(`${API_SLUG}/api-key/create`)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    deleteApiKey: async () => {
        return axios
            .post(`${API_SLUG}/api-key/delete`)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => set({ data: {} }),
}));
