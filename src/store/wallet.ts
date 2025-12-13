import { create } from 'zustand';
import axios from 'axios';
import { isMockMode, mockDelay, logMockUsage } from '@/Configuration/mock-api';
import mockFundHistories from '@/Data/mock-fund-histories.json';

export const API_SLUG = '/admin/wallet';

export interface WalletStore {
    totalFundHistories: number;
    fundHistories: any[];
    getAllFundHistories: (filters?: any) => Promise<{ success: boolean; data: any[] }>;
    getUserBillingInfo: (id: string) => Promise<{ success: boolean; data: any }>;
    topup: (data: any) => Promise<{ success: boolean; data: any }>;
    completetPayment: (id: string) => Promise<{ success: boolean; data: any }>;
    exportFundHistoriesToExcel: (filters: any) => Promise<{ success: boolean; data: any }>;
    downloadTaxInvoice: (id: string) => Promise<{ success: boolean; data: any }>;
    resendToEtax: (id: string) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
    totalFundHistories: 0,
    fundHistories: [],
    getAllFundHistories: async (filters) => {
        // Mock Mode
        if (isMockMode()) {
            logMockUsage('GET /admin/wallet/fund-histories');
            await mockDelay(300);
            set({ fundHistories: mockFundHistories, totalFundHistories: mockFundHistories.length });
            return { success: true, data: mockFundHistories };
        }

        const { signal, ...params } = filters || {};
        return axios
            .get(`${API_SLUG}/fund-histories`, { params, signal })
            .then((response) => {
                set({ fundHistories: response.data?.data?.data ?? [], totalFundHistories: response.data?.data?.totalItems ?? 0 });
                return { success: true, data: response.data?.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getUserBillingInfo: async (id) => {
        if (isMockMode()) {
            logMockUsage(`GET /admin/wallet/fund-histories/${id}/user-billing-info`);
            await mockDelay(200);
            return { success: true, data: { name: 'Mock User', email: 'mock@example.com' } };
        }

        return axios
            .get(`${API_SLUG}/fund-histories/${id}/user-billing-info`)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    topup: async (data) => {
        if (isMockMode()) {
            logMockUsage('POST /admin/wallet/fund-histories/topup');
            await mockDelay(500);
            return { success: true, data: { id: 'mock-new-id' } };
        }

        return axios
            .post(`${API_SLUG}/fund-histories/topup`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    completetPayment: async (id) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/wallet/fund-histories/${id}/complete`);
            await mockDelay(500);
            return { success: true, data: { id } };
        }

        return axios
            .post(`${API_SLUG}/fund-histories/${id}/complete`)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    exportFundHistoriesToExcel: async (filters) => {
        if (isMockMode()) {
            logMockUsage('POST /admin/wallet/fund-histories/export-to-excel');
            await mockDelay(500);
            return { success: true, data: {} };
        }

        return axios
            .post(`${API_SLUG}/fund-histories/export-to-excel`, filters, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'payments.xlsx');
                document.body.appendChild(link);
                link.click();

                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    downloadTaxInvoice: async (id) => {
        if (isMockMode()) {
            logMockUsage('POST /admin/wallet/fund-histories/download-tax-invoice');
            await mockDelay(500);
            return { success: true, data: {} };
        }

        return axios
            .post(
                `${API_SLUG}/fund-histories/download-tax-invoice`,
                {
                    fundHistoryId: id,
                },
                { responseType: 'blob' }
            )
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `tax-invoice-${id}.pdf`);
                document.body.appendChild(link);
                link.click();

                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    resendToEtax: async (id) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/wallet/fund-histories/${id}/force-etax`);
            await mockDelay(500);
            return { success: true, data: { id } };
        }

        return axios
            .post(`${API_SLUG}/fund-histories/${id}/force-etax`)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => {
        set({ totalFundHistories: 0, fundHistories: [] });
    },
}));
