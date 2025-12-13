import { create } from 'zustand';
import axios from 'axios';
import { isMockMode, mockDelay, logMockUsage } from '@/Configuration/mock-api';
import mockServiceCategoriesData from '@/Data/mock-service-categories.json';
import mockProvidersData from '@/Data/mock-providers.json';

export const API_SLUG = '/md';

// Mock order statuses - matches real API statuses
const mockOrderStatuses = [
    { value: 'AWAITING', label: 'Awaiting' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PARTIAL', label: 'Partially Completed' },
    { value: 'HOLD', label: 'Hold' },
    { value: 'ON_REFILL', label: 'On Refill' },
    { value: 'REFILLED', label: 'Refilled' },
    { value: 'REFILL', label: 'Refill' },
    { value: 'CANCELLED', label: 'Canceled' },
    { value: 'FAIL', label: 'Fail' },
    { value: 'ERROR', label: 'Error' }
];

// Mock order sources
const mockOrderSources = [
    { value: 'WEB', label: 'Website' },
    { value: 'API', label: 'API' },
    { value: 'CHILD_PANEL', label: 'Child Panel' }
];

// Mock ticket types
const mockTicketTypes = [
    { value: 'ORDER_ISSUE', label: 'Order Issue' },
    { value: 'PAYMENT_ISSUE', label: 'Payment Issue' },
    { value: 'REFUND_REQUEST', label: 'Refund Request' },
    { value: 'GENERAL_INQUIRY', label: 'General Inquiry' }
];

// Mock ticket statuses
const mockTicketStatuses = [
    { value: 'OPEN', label: 'Open' },
    { value: 'CLOSED', label: 'Closed' }
];

export interface MasterDataStore {
    orderStatus: any[];
    orderSources: any[];
    timezones: any[];
    membershipInfo: any[];
    ticketTypes: any[];
    ticketStatuses: any[];
    getOrderStatus: () => Promise<{ success: boolean; data: any }>;
    getOrderSources: () => Promise<{ success: boolean; data: any[] }>;
    getTimezones: () => Promise<{ success: boolean; data: any[] }>;
    getMembershipInfo: () => Promise<{ success: boolean; data: any[] }>;
    getTicketTypes: () => Promise<{ success: boolean; data: any[] }>;
    getTicketStatuses: () => Promise<{ success: boolean; data: any[] }>;
    getReportSources: () => Promise<{ success: boolean; data: any[] }>;
    getProviders: () => Promise<{ success: boolean; data: any[] }>;
    getServiceCategories: () => Promise<{ success: boolean; data: any[] }>;
    clearState: () => void;
}

export const useMasterDataStore = create<MasterDataStore>((set) => ({
    orderStatus: [],
    orderSources: [],
    timezones: [],
    membershipInfo: [],
    ticketTypes: [],
    ticketStatuses: [],
    getOrderStatus: async () => {
        if (isMockMode()) {
            logMockUsage('GET /md/orders/statuses');
            await mockDelay(100);
            set({ orderStatus: mockOrderStatuses });
            return { success: true, data: mockOrderStatuses };
        }

        return axios
            .get(`${API_SLUG}/orders/statuses`)
            .then((response) => {
                set({ orderStatus: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getOrderSources: async () => {
        if (isMockMode()) {
            logMockUsage('GET /md/orders/sources');
            await mockDelay(100);
            set({ orderSources: mockOrderSources });
            return { success: true, data: mockOrderSources };
        }

        return axios
            .get(`${API_SLUG}/orders/sources`)
            .then((response) => {
                set({ orderSources: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getTimezones: async () => {
        if (isMockMode()) {
            logMockUsage('GET /md/timezones');
            await mockDelay(100);
            const mockTimezones = [
                { value: 'Asia/Bangkok', label: 'Asia/Bangkok (GMT+7)' },
                { value: 'UTC', label: 'UTC (GMT+0)' }
            ];
            set({ timezones: mockTimezones });
            return { success: true, data: mockTimezones };
        }

        return axios
            .get(`${API_SLUG}/timezones`)
            .then((response) => {
                set({ timezones: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getMembershipInfo: async () => {
        if (isMockMode()) {
            logMockUsage('GET /md/membership-info');
            await mockDelay(100);
            const mockMembershipInfo = [
                { level: 'Bronze', minSpent: 0, discount: 0 },
                { level: 'Silver', minSpent: 5000, discount: 5 },
                { level: 'Gold', minSpent: 20000, discount: 10 },
                { level: 'Platinum', minSpent: 50000, discount: 15 }
            ];
            set({ membershipInfo: mockMembershipInfo });
            return { success: true, data: mockMembershipInfo };
        }

        return axios
            .get(`${API_SLUG}/membership-info`)
            .then((response) => {
                set({ membershipInfo: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getTicketTypes: async () => {
        if (isMockMode()) {
            logMockUsage('GET /md/tickets/types');
            await mockDelay(100);
            set({ ticketTypes: mockTicketTypes });
            return { success: true, data: mockTicketTypes };
        }

        return axios
            .get(`${API_SLUG}/tickets/types`)
            .then((response) => {
                set({ ticketTypes: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getTicketStatuses: async () => {
        if (isMockMode()) {
            logMockUsage('GET /md/tickets/statuses');
            await mockDelay(100);
            set({ ticketStatuses: mockTicketStatuses });
            return { success: true, data: mockTicketStatuses };
        }

        return axios
            .get(`${API_SLUG}/tickets/statuses`)
            .then((response) => {
                set({ ticketStatuses: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getReportSources: async () => {
        if (isMockMode()) {
            logMockUsage('GET /md/analytics/user-report-sources');
            await mockDelay(100);
            return { success: true, data: mockOrderSources };
        }

        return axios
            .get(`${API_SLUG}/analytics/user-report-sources`)
            .then((response) => {
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getProviders: async () => {
        if (isMockMode()) {
            logMockUsage('GET /admin/providers/all');
            await mockDelay(100);
            return { success: true, data: mockProvidersData };
        }

        return axios
            .get(`/admin/providers/all`)
            .then((response) => {
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getServiceCategories: async () => {
        if (isMockMode()) {
            logMockUsage('GET /admin/service-category');
            await mockDelay(100);
            return { success: true, data: mockServiceCategoriesData };
        }

        return axios
            .get(`/admin/service-category`)
            .then((response) => {
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => set({ orderStatus: [], timezones: [], membershipInfo: [] }),
}));
