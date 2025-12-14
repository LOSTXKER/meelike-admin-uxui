import { create } from 'zustand';
import axios from 'axios';
import { isMockMode, mockDelay, logMockUsage } from '@/Configuration/mock-api';
import mockProviderServicesData from '@/Data/mock-provider-services.json';

export const API_SLUG = '/admin/provider-service';

export interface ProviderServiceStore {
    data: any[];
    getAll: (providerId: string) => Promise<{ success: boolean; data: any[] }>;
    clearState: () => void;
}

export const useProviderServiceStore = create<ProviderServiceStore>((set, get) => ({
    data: [],
    getAll: async (providerId) => {
        if (isMockMode()) {
            logMockUsage(`GET /admin/provider-service/${providerId}`);
            await mockDelay(200);
            // Filter services by providerId
            const services = mockProviderServicesData.filter((s: any) => s.providerId === parseInt(providerId));
            set({ data: services });
            return { success: true, data: services };
        }

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
