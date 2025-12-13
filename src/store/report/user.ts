import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/analytics';

export interface UserStore {
    tableData: any[];
    getUserData: (params: { type: string; startDate: string; endDate: string; sources?: string[] }) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    tableData: [],
    getUserData: async (params) => {
        const { type, startDate, endDate, sources = [] } = params;

        // Build query parameters
        const queryParams: any = {
            type,
            startDate,
            endDate,
        };

        // Add array parameters
        sources.forEach((source, index) => {
            queryParams[`sources[${index}]`] = source;
        });

        return axios
            .get(`${API_SLUG}/user-report-summary`, {
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
