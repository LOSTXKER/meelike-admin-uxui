import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/analytics';

export interface ServiceCategoryStore {
    pnlData: any[];
    orderAmountData: any[];
    getPnLData: (params?: any) => Promise<{ success: boolean; data: any }>;
    getOrderAmountData: (params?: any) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useServiceCategoryStore = create<ServiceCategoryStore>((set) => ({
    pnlData: [],
    orderAmountData: [],
    getPnLData: async (params) => {
        return axios
            .get(`${API_SLUG}/service-category-pnl`, {
                params: params || {},
            })
            .then((response) => {
                set({ pnlData: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getOrderAmountData: async (params) => {
        return axios
            .get(`${API_SLUG}/service-category-order-amount`, {
                params: params || {},
            })
            .then((response) => {
                set({ orderAmountData: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => set({ pnlData: [] }),
}));
