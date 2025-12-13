import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/geo';

export interface GeoStore {
    provinces: any[];
    districts: any[];
    subdistricts: any[];
    getProvinces: () => Promise<{ success: boolean; data: any }>;
    getDistricts: (provinceId: string) => Promise<{ success: boolean; data: any }>;
    getSubdistricts: (districtId: string) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useGeoStore = create<GeoStore>((set) => ({
    provinces: [],
    districts: [],
    subdistricts: [],
    getProvinces: async () => {
        return axios
            .get(`${API_SLUG}/provinces`)
            .then(({ data: response }) => {
                set({ provinces: response?.data });
                return { success: true, data: response?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data?.message ?? 'เกิดข้อผิดพลาด' };
            });
    },
    getDistricts: async (provinceId) => {
        return axios
            .get(`${API_SLUG}/provinces/${provinceId}/districts`)
            .then(({ data: response }) => {
                set({ districts: response?.data });
                return { success: true, data: response?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data?.message ?? 'เกิดข้อผิดพลาด' };
            });
    },
    getSubdistricts: async (districtId) => {
        return axios
            .get(`${API_SLUG}/district/${districtId}/subdistricts`)
            .then(({ data: response }) => {
                set({ subdistricts: response?.data });
                return { success: true, data: response?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data?.message ?? 'เกิดข้อผิดพลาด' };
            });
    },
    clearState: () => set({ provinces: [], districts: [], subdistricts: [] }),
}));
