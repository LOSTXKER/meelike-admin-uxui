import { create } from 'zustand';
import axios from 'axios';
import { isMockMode, mockDelay, logMockUsage } from '@/Configuration/mock-api';
import mockServiceCategoriesData from '@/Data/mock-service-categories.json';

export const API_SLUG = '/admin/service-category';

export interface ServiceCategoryStore {
    totalData: number;
    data: any[];
    selected: any;
    getAll: (filters?: any) => Promise<{ success: boolean; data: any }>;
    getOne: (id: string) => Promise<{ success: boolean; data: any }>;
    create: (data: FormData) => Promise<{ success: boolean; data: any }>;
    update: (id: string, data: FormData) => Promise<{ success: boolean; data: any }>;
    delete: (id: string) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useServiceCategoryStore = create<ServiceCategoryStore>((set, get) => ({
    totalData: 0,
    data: [],
    selected: {},
    getAll: async (filters) => {
        if (isMockMode()) {
            logMockUsage('GET /admin/service-category');
            await mockDelay(150);
            set({ data: mockServiceCategoriesData, totalData: mockServiceCategoriesData.length });
            return { success: true, data: mockServiceCategoriesData };
        }

        return axios
            .get(`${API_SLUG}`, { params: filters })
            .then((response) => {
                set({ data: response.data?.data ?? [], totalData: (response.data?.data ?? []).length });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getOne: async (id) => {
        if (isMockMode()) {
            logMockUsage(`GET /admin/service-category/${id}`);
            await mockDelay(150);
            const category = mockServiceCategoriesData.find(c => c.id === id);
            set({ selected: category ?? {} });
            return { success: true, data: category };
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
            logMockUsage('POST /admin/service-category');
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
            logMockUsage(`PATCH /admin/service-category/${id}`);
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
    delete: async (id) => {
        if (isMockMode()) {
            logMockUsage(`DELETE /admin/service-category/${id}`);
            await mockDelay(300);
            return { success: true, data: { message: 'Deleted (mock)' } };
        }

        return axios.delete(`${API_SLUG}/${id}`).then((response) => {
            return { success: true, data: response.data?.data };
        });
    },
    clearState: () => {
        set({ totalData: 0, data: [], selected: {} });
    },
}));
