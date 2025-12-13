import { create } from 'zustand';
import axios from 'axios';
import { isMockMode, mockDelay, logMockUsage } from '@/Configuration/mock-api';
import mockTopupBonusConfig from '@/Data/mock-topup-bonus-config.json';

export const API_SLUG = '/admin/wallet/topup-bonus-configs';

export interface TopupBonusConfigStore {
    data: any[];
    totalData: number;
    selected: any;
    getAll: () => Promise<{ success: boolean; data: any[] }>;
    getOne: (id: string) => Promise<{ success: boolean; data: any }>;
    update: (id: string, data: any) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useTopupBonusConfigStore = create<TopupBonusConfigStore>((set, get) => ({
    data: [],
    totalData: 0,
    selected: {},
    getAll: async () => {
        // Mock Mode
        if (isMockMode()) {
            logMockUsage('GET /admin/wallet/topup-bonus-configs');
            await mockDelay(300);
            set({ data: mockTopupBonusConfig, totalData: mockTopupBonusConfig.length });
            return { success: true, data: mockTopupBonusConfig };
        }

        return axios
            .get(`${API_SLUG}`)
            .then((response) => {
                const data = response.data?.data ?? [];
                set({ data, totalData: data.length });
                return { success: true, data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getOne: async (id) => {
        // Mock Mode
        if (isMockMode()) {
            logMockUsage(`GET /admin/wallet/topup-bonus-configs/${id}`);
            await mockDelay(200);
            const found = mockTopupBonusConfig.find(item => item.id === id) || {};
            set({ selected: found });
            return { success: true, data: found };
        }

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
    update: async (id, data) => {
        // Mock Mode
        if (isMockMode()) {
            logMockUsage(`PATCH /admin/wallet/topup-bonus-configs/${id}`);
            await mockDelay(500);
            return { success: true, data: { id, ...data } };
        }

        return axios
            .patch(`${API_SLUG}/${id}`, data)
            .then((response) => {
                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => {
        set({ data: [], totalData: 0, selected: {} });
    },
}));
