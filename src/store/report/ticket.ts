import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/analytics';

export interface TicketStore {
    tableData: any[];
    getTicketData: (params: { type: string; startDate: string; endDate: string; adminIds?: string[] }) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
    tableData: [],
    getTicketData: async (params) => {
        const { type, startDate, endDate, adminIds = [] } = params;

        // Build query parameters
        const queryParams: any = {
            type,
            startDate,
            endDate,
        };

        // Add array parameters
        adminIds.forEach((adminId, index) => {
            queryParams[`adminIds[${index}]`] = adminId;
        });

        return axios
            .get(`${API_SLUG}/tickets-table-data`, {
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
