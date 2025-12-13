import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/analytics';

export interface OrderStore {
    tableData: any[];
    getOrderData: (params: { type: string; startDate: string; endDate: string; serviceIds?: string[]; userIds?: number[]; statuses?: string[] }) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
    tableData: [],
    getOrderData: async (params) => {
        const { type, startDate, endDate, serviceIds = [], userIds = [], statuses = [] } = params;

        // Build query parameters
        const queryParams: any = {
            type,
            startDate,
            endDate,
        };

        // Add array parameters
        serviceIds.forEach((serviceId, index) => {
            queryParams[`serviceIds[${index}]`] = serviceId;
        });

        userIds.forEach((userId, index) => {
            queryParams[`userIds[${index}]`] = userId;
        });

        statuses.forEach((status, index) => {
            queryParams[`statuses[${index}]`] = status;
        });

        return axios
            .get(`${API_SLUG}/orders-table-data`, {
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
