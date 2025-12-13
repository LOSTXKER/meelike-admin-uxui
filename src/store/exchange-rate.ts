import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/exchange-rates';

export interface ExchangeRateStore {
    currencies: string[];
    getAvailableCurrencies: () => Promise<{ success: boolean; data: string[] }>;
    convert: (from: string, to: string, amount: number) => Promise<{ success: boolean; data: any }>;
}

export const useExchangeRateStore = create<ExchangeRateStore>((set, get) => ({
    currencies: [],
    getAvailableCurrencies: async () => {
        return axios
            .get(`${API_SLUG}/available`)
            .then((response) => {
                set({ currencies: response.data?.data });
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    convert: async (from, to, amount) => {
        return axios
            .get(`${API_SLUG}/convert`, { params: { from, to, amount } })
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
}));
