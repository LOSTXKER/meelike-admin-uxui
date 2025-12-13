import { create } from 'zustand';
import axios from 'axios';
import { isMockMode, mockDelay, logMockUsage } from '@/Configuration/mock-api';
import mockUsersData from '@/Data/mock-users.json';

export const API_SLUG = '/admin/public-user';

export interface UsersStore {
    totalData: number;
    data: any[];
    selected: any;
    allData: any[];
    getAll: (filters?: any) => Promise<{ success: boolean; data: any[] }>;
    getOne: (id: string) => Promise<{ success: boolean; data: any }>;
    getAllData: () => Promise<{ success: boolean; data: any[] }>;
    activate: (id: string) => Promise<{ success: boolean; data: any }>;
    deactivate: (id: string) => Promise<{ success: boolean; data: any }>;
    updateUserInfo: (id: string, data: any) => Promise<{ success: boolean; data: any }>;
    updateTopupBonus: (userId: string, data: any) => Promise<{ success: boolean; data: any }>;
    updateDiscountRate: (userId: string, data: any) => Promise<{ success: boolean; data: any }>;
    updateDistributorStatus: (userId: string, data: any) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useUsersStore = create<UsersStore>((set, get) => ({
    totalData: 0,
    data: [],
    selected: {},
    allData: [],
    getAll: async (filters) => {
        if (isMockMode()) {
            logMockUsage('GET /admin/public-user');
            await mockDelay(150);

            let users = [...mockUsersData] as any[];

            // Apply search filter
            if (filters?.search) {
                const search = filters.search.toLowerCase();
                users = users.filter(u =>
                    u.username?.toLowerCase().includes(search) ||
                    u.email?.toLowerCase().includes(search)
                );
            }

            set({ data: users, totalData: users.length });
            return { success: true, data: users };
        }

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
    getAllData: async () => {
        if (isMockMode()) {
            logMockUsage('GET /admin/public-user/all');
            await mockDelay(100);
            set({ allData: mockUsersData });
            return { success: true, data: mockUsersData };
        }

        return axios
            .get(`${API_SLUG}/all`)
            .then((response) => {
                set({ allData: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getOne: async (id) => {
        if (isMockMode()) {
            logMockUsage(`GET /admin/public-user/${id}`);
            await mockDelay(150);
            const user = mockUsersData.find(u => u.id === id);
            set({ selected: user ?? {} });
            return { success: true, data: user ?? {} };
        }

        return axios
            .get(`${API_SLUG}/${id}`)
            .then((response) => {
                set({ selected: response.data?.data ?? {} });
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    activate: async (id) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/public-user/${id}/activate`);
            await mockDelay(300);
            return { success: true, data: { message: 'Activated (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${id}/activate`)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    deactivate: async (id) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/public-user/${id}/deactivate`);
            await mockDelay(300);
            return { success: true, data: { message: 'Deactivated (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${id}/deactivate`)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    updateUserInfo: async (id, data) => {
        if (isMockMode()) {
            logMockUsage(`PATCH /admin/public-user/${id}`);
            await mockDelay(300);
            return { success: true, data: { message: 'Updated (mock)' } };
        }

        return axios
            .patch(`${API_SLUG}/${id}`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    updateTopupBonus: async (userId, data) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/public-user/${userId}/update-topup-bonus-percentage`);
            await mockDelay(300);
            return { success: true, data: { message: 'Updated (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${userId}/update-topup-bonus-percentage`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    updateDiscountRate: async (userId, data) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/public-user/${userId}/update-discount-percentage`);
            await mockDelay(300);
            return { success: true, data: { message: 'Updated (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${userId}/update-discount-percentage`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    updateDistributorStatus: async (userId, data) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/public-user/${userId}/update-distributor`);
            await mockDelay(300);
            return { success: true, data: { message: 'Updated (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${userId}/update-distributor`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => {
        set({ totalData: 0, data: [], selected: {} });
    },
}));
