import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/services';

export interface ServiceStore {
    totalData: number;
    data: any[];
    dataWithoutPagination: any[];
    dataNoRateWihoutPagination: any[];
    selected: any;
    getAll: (filters?: any) => Promise<{ success: boolean; data: any }>;
    getAllWithoutPagination: (filters?: any) => Promise<{ success: boolean; data: any }>;
    getAllNoRateWithoutPagination: (filters?: any) => Promise<{ success: boolean; data: any }>;
    getAllService: () => Promise<{ success: boolean; data: any[] }>;
    getOne: (id: string) => Promise<{ success: boolean; data: any }>;
    create: (data: FormData) => Promise<{ success: boolean; data: any }>;
    update: (id: string, data: FormData) => Promise<{ success: boolean; data: any }>;
    remove: (id: string) => Promise<{ success: boolean; data: any }>;
    export: (filters?: any) => Promise<{ success: boolean; data: any }>;
    enableAll: (data: any) => Promise<{ success: boolean; data: any }>;
    disableAll: (data: any) => Promise<{ success: boolean; data: any }>;
    deleteAll: (data: any) => Promise<{ success: boolean; data: any }>;
    saveSorting: (data: any) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
    totalData: 0,
    data: [],
    dataWithoutPagination: [],
    dataNoRateWihoutPagination: [],
    selected: {},
    getAll: async (filters) => {
        return axios
            .get(`${API_SLUG}`, { params: filters })
            .then((response) => {
                set({ data: response.data?.data?.data ?? [], totalData: response.data?.data?.totalItems ?? 0 });
                return { success: true, data: response.data?.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getAllWithoutPagination: async (filters) => {
        return axios
            .get(`${API_SLUG}/all`, { params: filters })
            .then((response) => {
                set({ dataWithoutPagination: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getAllNoRateWithoutPagination: async (filters) => {
        return axios
            .get(`${API_SLUG}/all-no-rate`, { params: filters })
            .then((response) => {
                set({ dataNoRateWihoutPagination: response.data?.data ?? [] });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getAllService: async () => {
        return axios.get(`${API_SLUG}/all`).then((response) => {
            return { success: true, data: response.data?.data };
        });
    },
    getOne: async (id) => {
        return axios
            .get(`${API_SLUG}/${id}`)
            .then((response) => {
                set({ selected: response.data?.data ?? {} });
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    create: async (data) => {
        return axios
            .post(`${API_SLUG}`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    update: async (id, data) => {
        return axios
            .patch(`${API_SLUG}/${id}`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    remove: async (id) => {
        return axios
            .delete(`${API_SLUG}/${id}`)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    export: async (filters) => {
        return axios
            .get(`${API_SLUG}/export`, { params: filters })
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    enableAll: async (data) => {
        return axios
            .post(`${API_SLUG}/enable-all`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    disableAll: async (data) => {
        return axios
            .post(`${API_SLUG}/disable-all`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    deleteAll: async (data) => {
        return axios
            .post(`${API_SLUG}/delete-all`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    saveSorting: async (data) => {
        return axios
            .post(`${API_SLUG}/save-sorting`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () => {
        set({ totalData: 0, data: [], selected: {}, dataWithoutPagination: [], dataNoRateWihoutPagination: [] });
    },
}));
