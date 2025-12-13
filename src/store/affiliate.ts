import { create } from 'zustand';
import axios from 'axios';
import { isMockMode, mockDelay, logMockUsage } from '@/Configuration/mock-api';
import mockAffiliateOverview from '@/Data/mock-affiliate-overview.json';
import mockAffiliateRelationships from '@/Data/mock-affiliate-relationships.json';
import mockAffiliatePayouts from '@/Data/mock-affiliate-payouts.json';

export const API_SLUG = '/admin/affiliate';

export interface AffiliateStore {
    overview: any[];
    totalOverview: number;
    relationships: any[];
    totalRelationships: number;
    payouts: any[];
    totalPayouts: number;
    getOverview: (filters?: any) => Promise<{ success: boolean; data: any[] }>;
    getRelationships: (filters?: any) => Promise<{ success: boolean; data: any[] }>;
    getPayouts: (filters?: any) => Promise<{ success: boolean; data: any[] }>;
    clearState: () => void;
}

export const useAffiliateStore = create<AffiliateStore>((set, get) => ({
    overview: [],
    totalOverview: 0,
    relationships: [],
    totalRelationships: 0,
    payouts: [],
    totalPayouts: 0,
    getOverview: async (filters) => {
        // Mock Mode
        if (isMockMode()) {
            logMockUsage('GET /admin/affiliate/overview');
            await mockDelay(300);
            set({ overview: mockAffiliateOverview, totalOverview: mockAffiliateOverview.length });
            return { success: true, data: mockAffiliateOverview };
        }

        return axios
            .get(`${API_SLUG}/overview`, { params: filters })
            .then((response) => {
                const data = response.data?.data ?? [];
                set({ overview: data, totalOverview: data.length });
                return { success: true, data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getRelationships: async (filters) => {
        // Mock Mode
        if (isMockMode()) {
            logMockUsage('GET /admin/affiliate/referral/relationships');
            await mockDelay(300);
            set({ relationships: mockAffiliateRelationships, totalRelationships: mockAffiliateRelationships.length });
            return { success: true, data: mockAffiliateRelationships };
        }

        return axios
            .get(`${API_SLUG}/referral/relationships`, { params: filters })
            .then((response) => {
                const data = response.data?.data ?? [];
                set({ relationships: data, totalRelationships: data.length });
                return { success: true, data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getPayouts: async (filters) => {
        // Mock Mode
        if (isMockMode()) {
            logMockUsage('GET /admin/affiliate/payouts');
            await mockDelay(300);
            set({ payouts: mockAffiliatePayouts, totalPayouts: mockAffiliatePayouts.length });
            return { success: true, data: mockAffiliatePayouts };
        }

        return axios
            .get(`${API_SLUG}/payouts`, { params: filters })
            .then((response) => {
                const data = response.data?.data ?? [];
                set({ payouts: data, totalPayouts: data.length });
                return { success: true, data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => {
        set({ relationships: [], totalRelationships: 0, overview: [], totalOverview: 0, payouts: [], totalPayouts: 0 });
    },
}));
