import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/auth';

export interface AuthStore {
    verify: () => Promise<{ success: boolean; data: any }>;
    signin: (data: any) => Promise<{ success: boolean; data: any }>;
    register: (data: any) => Promise<{ success: boolean; data: any }>;
    verifyRegister: (data: any) => Promise<{ success: boolean; data: any }>;
    refresh: () => Promise<{ success: boolean; data: any }>;
    signout: () => Promise<{ success: boolean; data: any }>;
    resetPassword: (data: any) => Promise<{ success: boolean; data: any }>;
    verifyResetPassword: (data: any) => Promise<{ success: boolean; data: any }>;
    changePassword: (data: any) => Promise<{ success: boolean; data: any }>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    verify: async () => {
        return axios
            .get(`${API_SLUG}/verify`)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    signin: async (data) => {
        return axios
            .post(`${API_SLUG}/signin`, data)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    register: async (data) => {
        return axios
            .post(`${API_SLUG}/register`, data)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return {
                    success: false,
                    data: error?.response?.data,
                    status: error?.response?.status,
                };
            });
    },
    verifyRegister: async (data) => {
        return axios
            .post(`${API_SLUG}/register/verify`, data)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    refresh: async () => {
        return axios
            .post(`${API_SLUG}/refresh`)
            .then((response) => {
                // set({ profile: response.data })
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    signout: async () => {
        return axios
            .post(`${API_SLUG}/signout`)
            .then((response) => {
                // set({ profile: {} })
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    resetPassword: async (data) => {
        return axios
            .post(`${API_SLUG}/reset-password/request`, data)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    verifyResetPassword: async (data) => {
        return axios
            .post(`${API_SLUG}/reset-password/verify`, data)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    changePassword: async (data) => {
        return axios
            .post(`${API_SLUG}/reset-password/change-password`, data)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
}));
