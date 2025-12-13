import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/analytics';

export interface PaymentStore {
    fundHistoryData: any[];
    tableData: any[];
    getFundHistoryChartData: (startDate: string, endDate: string) => Promise<{ success: boolean; data: any }>;
    getTableData: (params: { type: string; startDate: string; endDate: string; methods?: string[]; userIds?: number[] }) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
    fundHistoryData: [],
    tableData: [],
    getFundHistoryChartData: async (startDate, endDate) => {
        return axios
            .get(`${API_SLUG}/fund-history-chart-data`, {
                params: {
                    startDate,
                    endDate,
                },
            })
            .then((response) => {
                set({ fundHistoryData: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getTableData: async (params) => {
        const { type, startDate, endDate, methods = [], userIds = [] } = params;

        // Build query parameters
        const queryParams: any = {
            type,
            startDate,
            endDate,
        };

        // Add array parameters
        methods.forEach((method, index) => {
            queryParams[`methods[${index}]`] = method;
        });

        userIds.forEach((userId, index) => {
            queryParams[`userIds[${index}]`] = userId;
        });

        return axios
            .get(`${API_SLUG}/fund-history-table-data`, {
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
    clearState: () => set({ fundHistoryData: [], tableData: [] }),
}));
