import { create } from 'zustand';
import axios from 'axios';
import { isMockMode, mockDelay, logMockUsage } from '@/Configuration/mock-api';
import mockProvidersData from '@/Data/mock-providers.json';

export const API_SLUG = '/admin/providers';

export interface ProviderStore {
    totalData: number;
    data: any[];
    dataWithoutPagination: any[];
    selected: any;
    setSelected: (item: any) => void;
    getAll: (filters?: any) => Promise<{ success: boolean; data: any[] }>;
    getAllWithoutPagination: (filters?: any) => Promise<{ success: boolean; data: any[] }>;
    getOne: (id: string) => Promise<{ success: boolean; data: any }>;
    create: (data: FormData) => Promise<{ success: boolean; data: any }>;
    update: (id: string, data: FormData) => Promise<{ success: boolean; data: any }>;
    delete: (id: string, abortController?: AbortController) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useProviderStore = create<ProviderStore>((set, get) => ({
    totalData: 0,
    data: [],
    dataWithoutPagination: [],
    selected: {},
    setSelected: (item) => {
        set({ selected: item });
    },
    getAll: async (filters) => {
        if (isMockMode()) {
            logMockUsage('GET /admin/providers');
            await mockDelay(150);
            set({ data: mockProvidersData, totalData: mockProvidersData.length });
            return { success: true, data: mockProvidersData };
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
    getAllWithoutPagination: async (filters) => {
        if (isMockMode()) {
            logMockUsage('GET /admin/providers/all');
            await mockDelay(100);
            set({ dataWithoutPagination: mockProvidersData });
            return { success: true, data: mockProvidersData };
        }

        return axios
            .get(`${API_SLUG}/all`, { params: filters })
            .then((response) => {
                set({ dataWithoutPagination: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getOne: async (id) => {
        if (isMockMode()) {
            logMockUsage(`GET /admin/providers/${id}`);
            await mockDelay(150);
            const provider = mockProvidersData.find(p => p.id === id);
            set({ selected: provider ?? {} });
            return { success: true, data: provider };
        }

        return axios
            .get(`${API_SLUG}/${id}`)
            .then((response) => {
                set({ selected: response.data?.data ?? {} });
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    create: async (data) => {
        if (isMockMode()) {
            logMockUsage('POST /admin/providers');
            await mockDelay(300);
            return { success: true, data: { message: 'Created (mock)' } };
        }

        return axios
            .post(`${API_SLUG}`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    update: async (id, data) => {
        if (isMockMode()) {
            logMockUsage(`PATCH /admin/providers/${id}`);
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
    delete: async (id, abortController) => {
        if (isMockMode()) {
            logMockUsage(`DELETE /admin/providers/${id}`);
            await mockDelay(300);
            return { success: true, data: { message: 'Deleted (mock)' } };
        }

        return axios
            .delete(`${API_SLUG}/${id}`, { signal: abortController?.signal })
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
