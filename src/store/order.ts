import { create } from 'zustand';
import axios from 'axios';
import { isMockMode, mockDelay, logMockUsage } from '@/Configuration/mock-api';
import mockOrdersData from '@/Data/mock-orders.json';

export const API_SLUG = '/admin/orders';

// Status count for mock data
const getMockStatusCount = () => {
    const orders = mockOrdersData as any[];
    return {
        awaiting: orders.filter(o => o.status === 'AWAITING').length || 26,
        pending: orders.filter(o => o.status === 'PENDING').length || 50,
        in_progress: orders.filter(o => o.status === 'IN_PROGRESS').length || 321,
        processing: orders.filter(o => o.status === 'PROCESSING').length || 318,
        completed: orders.filter(o => o.status === 'COMPLETED').length || 1006226,
        partial: orders.filter(o => o.status === 'PARTIAL').length || 15559,
        hold: orders.filter(o => o.status === 'HOLD').length || 0,
        on_refill: orders.filter(o => o.status === 'ON_REFILL').length || 0,
        refilled: orders.filter(o => o.status === 'REFILLED').length || 0,
        refill: orders.filter(o => o.status === 'REFILL').length || 0,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length || 46902,
        fail: orders.filter(o => o.status === 'FAIL').length || 0,
        error: orders.filter(o => o.status === 'ERROR').length || 0
    };
};

export interface OrderStore {
    totalData: number;
    data: any[];
    count: any;
    serviceCateogoryStat: any[];
    serviceStat: any[];
    selected: any;
    externalStatus: any;
    hasNegativeProfit: boolean;
    resetGetAllData: () => void;
    getAll: (filters?: any) => Promise<{ success: boolean; data: any[] }>;
    getHasNegativeProfit: (filters?: any) => Promise<{ success: boolean; data: boolean }>;
    getCount: () => Promise<{ success: boolean; data: any }>;
    getServiceCategoryStat: () => Promise<{ success: boolean; data: any }>;
    getServiceStat: () => Promise<{ success: boolean; data: any }>;
    getOne: (id: string) => Promise<{ success: boolean; data: any }>;
    getExternalStatus: (id: string) => Promise<{ success: boolean; data: any }>;
    cancelAndRefund: (id: string) => Promise<{ success: boolean; data: any }>;
    cancelAndRefundMultiple: (data: any) => Promise<{ success: boolean; data: any }>;
    copyOrderToClipboard: (data: any) => Promise<{ success: boolean; data: any }>;
    setStartCount: (id: string, data: any) => Promise<{ success: boolean; data: any }>;
    setPartial: (id: string, data: any) => Promise<{ success: boolean; data: any }>;
    setManualStatus: (id: string, data: any) => Promise<{ success: boolean; data: any }>;
    editTargetUrl: (id: string, data: any) => Promise<{ success: boolean; data: any }>;
    resend: (id: string) => Promise<{ success: boolean; data: any }>;
    exportToExcel: (filters: any) => Promise<{ success: boolean; data: any }>;
    multipleChangeStatus: (data: any) => Promise<{ success: boolean; data: any }>;
    multipleResend: (data: any) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
    totalData: 0,
    data: [],
    count: {},
    serviceCateogoryStat: [],
    serviceStat: [],
    selected: {},
    externalStatus: {},
    hasNegativeProfit: false,
    resetGetAllData: () => {
        set({ data: [], totalData: 0 });
    },
    getAll: async (filters) => {
        // Mock mode
        if (isMockMode()) {
            logMockUsage('GET /admin/orders');
            await mockDelay();

            let orders = [...mockOrdersData] as any[];

            // Apply filters
            if (filters?.status && filters.status.length > 0) {
                orders = orders.filter(o => filters.status.includes(o.status));
            }
            if (filters?.search) {
                const search = filters.search.toLowerCase();
                orders = orders.filter(o =>
                    o.orderId?.toLowerCase().includes(search) ||
                    o.service?.name?.toLowerCase().includes(search) ||
                    o.targetUrl?.toLowerCase().includes(search)
                );
            }
            if (filters?.categoryId) {
                orders = orders.filter(o => o.service?.serviceCategory?.id === filters.categoryId);
            }
            if (filters?.providerId) {
                orders = orders.filter(o => o.service?.providerService?.provider?.id === filters.providerId);
            }
            if (filters?.serviceId) {
                orders = orders.filter(o => o.service?.id === filters.serviceId);
            }
            if (filters?.source) {
                orders = orders.filter(o => o.source === filters.source);
            }
            if (filters?.userId) {
                orders = orders.filter(o => o.user?.id === filters.userId);
            }

            // Pagination
            const page = filters?.page || 1;
            const pageSize = filters?.pageSize || 10;
            const start = (page - 1) * pageSize;
            const paginatedOrders = orders.slice(start, start + pageSize);

            set({ data: paginatedOrders, totalData: orders.length });
            return { success: true, data: paginatedOrders };
        }

        // Real API
        const { signal, ...params } = filters || {};
        return axios
            .get(`${API_SLUG}`, { params, signal })
            .then((response) => {
                set({ data: response.data?.data?.data ?? [], totalData: response.data?.data?.totalItems ?? 0 });
                return { success: true, data: response.data?.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getHasNegativeProfit: async (filters) => {
        if (isMockMode()) {
            logMockUsage('GET /admin/orders/has-negative-profit');
            await mockDelay(100);
            const hasNegative = mockOrdersData.some(o => parseFloat(o.profitTHB) < 0);
            set({ hasNegativeProfit: hasNegative });
            return { success: true, data: hasNegative };
        }

        const { signal, ...params } = filters || {};
        return axios
            .get(`${API_SLUG}/has-negative-profit`, { params, signal })
            .then((response) => {
                set({ hasNegativeProfit: response.data?.data?.hasNegativeProfit ?? false });
                return { success: true, data: response.data?.data?.hasNegativeProfit ?? false };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getCount: async () => {
        if (isMockMode()) {
            logMockUsage('GET /admin/orders/count');
            await mockDelay(100);
            const count = getMockStatusCount();
            set({ count });
            return { success: true, data: count };
        }

        return axios
            .get(`${API_SLUG}/count`)
            .then((response) => {
                set({ count: response.data?.data ?? {} });
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getServiceCategoryStat: async () => {
        if (isMockMode()) {
            logMockUsage('GET /admin/orders/service-category/stat');
            await mockDelay(100);
            const stats = [
                { categoryId: '1', categoryName: 'Instagram Likes', count: 2 },
                { categoryId: '2', categoryName: 'Facebook Likes', count: 1 },
                { categoryId: '3', categoryName: 'TikTok Views', count: 1 }
            ];
            set({ serviceCateogoryStat: stats });
            return { success: true, data: stats };
        }

        return axios
            .get(`${API_SLUG}/service-category/stat`)
            .then((response) => {
                set({ serviceCateogoryStat: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getServiceStat: async () => {
        if (isMockMode()) {
            logMockUsage('GET /admin/orders/service/stat');
            await mockDelay(100);
            const stats = [
                { serviceId: '1', serviceName: 'Instagram Likes | HQ | Fast', count: 1 },
                { serviceId: '2', serviceName: 'Facebook Page Likes | Premium', count: 1 }
            ];
            set({ serviceStat: stats });
            return { success: true, data: stats };
        }

        return axios
            .get(`${API_SLUG}/service/stat`)
            .then((response) => {
                set({ serviceStat: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getOne: async (id) => {
        if (isMockMode()) {
            logMockUsage(`GET /admin/orders/${id}`);
            await mockDelay(200);
            const order = mockOrdersData.find(o => o.id === id);
            set({ selected: order ?? {} });
            return { success: true, data: order ?? {} };
        }

        return axios
            .get(`${API_SLUG}/${id}`)
            .then((response) => {
                set({ selected: response.data?.data ?? {} });
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getExternalStatus: async (id) => {
        if (isMockMode()) {
            logMockUsage(`GET /admin/orders/${id}/external-status`);
            await mockDelay(200);
            const mockStatus = {
                status: 'Completed',
                start_count: 1234,
                remains: 0,
                charge: '0.0025'
            };
            set({ externalStatus: mockStatus });
            return { success: true, data: mockStatus };
        }

        return axios
            .get(`${API_SLUG}/${id}/external-status`)
            .then((response) => {
                set({ externalStatus: response.data?.data ?? {} });
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    cancelAndRefund: async (id) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/orders/${id}/cancel-refund`);
            await mockDelay(500);
            return { success: true, data: { message: 'Order cancelled and refunded (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${id}/cancel-refund`)
            .then((response) => {
                set({ selected: response.data?.data ?? {} });
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    cancelAndRefundMultiple: async (data) => {
        if (isMockMode()) {
            logMockUsage('POST /admin/orders/cancel-refund-multiple');
            await mockDelay(500);
            return { success: true, data: { message: 'Orders cancelled and refunded (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/cancel-refund-multiple`, data)
            .then((response) => {
                set({ data: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    copyOrderToClipboard: async (data) => {
        if (isMockMode()) {
            logMockUsage('POST /admin/orders/copy-to-clipboard');
            await mockDelay(100);
            return { success: true, data: { copyText: 'Mock copy text' } };
        }

        return axios
            .post(`${API_SLUG}/copy-to-clipboard`, data)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    setStartCount: async (id, data) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/orders/${id}/set-start-count`);
            await mockDelay(300);
            return { success: true, data: { message: 'Start count set (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${id}/set-start-count`, data)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    setPartial: async (id, data) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/orders/${id}/set-partial`);
            await mockDelay(300);
            return { success: true, data: { message: 'Partial set (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${id}/set-partial`, data)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    setManualStatus: async (id, data) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/orders/${id}/set-manual-status`);
            await mockDelay(300);
            return { success: true, data: { message: 'Manual status set (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${id}/set-manual-status`, data)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    editTargetUrl: async (id, data) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/orders/${id}/edit-target-url`);
            await mockDelay(300);
            return { success: true, data: { message: 'Target URL edited (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${id}/edit-target-url`, data)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    resend: async (id) => {
        if (isMockMode()) {
            logMockUsage(`POST /admin/orders/${id}/resend`);
            await mockDelay(500);
            return { success: true, data: { message: 'Order resent (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/${id}/resend`)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    exportToExcel: async (filters) => {
        if (isMockMode()) {
            logMockUsage('POST /admin/orders/export-to-excel');
            await mockDelay(500);
            alert('Export to Excel is not available in mock mode');
            return { success: false, data: { message: 'Not available in mock mode' } };
        }

        return axios
            .post(`${API_SLUG}/export-to-excel`, filters, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'orders.xlsx');
                document.body.appendChild(link);
                link.click();

                return { success: true, data: response.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    multipleChangeStatus: async (data) => {
        if (isMockMode()) {
            logMockUsage('POST /admin/orders/multiple-change-status');
            await mockDelay(500);
            return { success: true, data: { message: 'Status changed (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/multiple-change-status`, data)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    multipleResend: async (data) => {
        if (isMockMode()) {
            logMockUsage('POST /admin/orders/resend-multiple');
            await mockDelay(500);
            return { success: true, data: { message: 'Orders resent (mock)' } };
        }

        return axios
            .post(`${API_SLUG}/resend-multiple`, data)
            .then((response) => {
                return { success: true, data: response.data?.data ?? {} };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => {
        set({ data: [], selected: {}, count: {}, serviceCateogoryStat: [], externalStatus: {}, serviceStat: [], hasNegativeProfit: false });
    },
}));
