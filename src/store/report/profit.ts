import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/analytics';

export interface OrderStore {
    tableData: any[];
    getProfitData: (params: { startDate: string; endDate: string; serviceIds?: string[]; statuses?: string[] }) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
    tableData: [],
    getProfitData: async (params) => {
        const { startDate, endDate, serviceIds = [], statuses = [] } = params;

        // Build query parameters
        const queryParams: any = {
            startDate,
            endDate,
        };

        // Add array parameters
        serviceIds.forEach((serviceId, index) => {
            queryParams[`serviceIds[${index}]`] = serviceId;
        });

        statuses.forEach((status, index) => {
            queryParams[`statuses[${index}]`] = status;
        });

        return axios
            .get(`${API_SLUG}/profits-table-data`, {
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
