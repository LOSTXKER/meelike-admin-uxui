import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/analytics';

export interface OrderStore {
    tableData: any[];
    getServiceData: (params: {
        startDate: string;
        endDate: string;
        serviceIds?: string[];
        categoryIds?: string[];
        providerIds?: string[];
        isActive?: boolean;
    }) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useServiceStore = create<OrderStore>((set) => ({
    tableData: [],
    getServiceData: async (params) => {
        const { startDate, endDate, serviceIds = [], categoryIds = [], providerIds = [], isActive = true } = params;

        // Build query parameters
        const queryParams: any = {
            startDate,
            endDate,
            isActive,
        };

        // Add array parameters
        serviceIds.forEach((serviceId, index) => {
            queryParams[`serviceIds[${index}]`] = serviceId;
        });

        categoryIds.forEach((categoryId, index) => {
            queryParams[`categoryIds[${index}]`] = categoryId;
        });

        providerIds.forEach((providerId, index) => {
            queryParams[`providerIds[${index}]`] = providerId;
        });

        return axios
            .get(`${API_SLUG}/service-table-data`, {
                params: queryParams,
            })
            .then((response) => {
                set({ tableData: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => set({ tableData: [] }),
}));
