import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/provider-service';

export interface ProviderServiceStore {
    data: any[];
    getAll: (providerId: string) => Promise<{ success: boolean; data: any[] }>;
    clearState: () => void;
}

export const useProviderServiceStore = create<ProviderServiceStore>((set, get) => ({
    data: [],
    getAll: async (providerId) => {
        return axios
            .get(`${API_SLUG}/${providerId}`)
            .then((response) => {
                set({ data: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => {
        set({ data: [] });
    },
}));
