import { create } from 'zustand';
import axios from 'axios';

export const API_SLUG = '/admin/tickets';

export interface TicketFilters {
    page?: number;
    limit?: number;
    search?: string;
    createdStart?: string;
    createdEnd?: string;
    closedStart?: string;
    closedEnd?: string;
    type?: string;
    status?: string;
}

export interface TicketStore {
    totalData: number;
    data: any[];
    selected: any | null;
    getAll: (filters?: TicketFilters) => Promise<{ success: boolean; data: any }>;
    getOne: (id: string) => Promise<{ success: boolean; data: any }>;
    createTicket: (data: FormData) => Promise<{ success: boolean; data: any }>;
    replyThread: (ticketId: string, data: FormData) => Promise<{ success: boolean; data: any }>;
    closeTicket: (id: string) => Promise<{ success: boolean; data: any }>;
    changeStatus: (id: string, status: string) => Promise<{ success: boolean; data: any }>;
    markAsUnread: (id: string) => Promise<{ success: boolean; data: any }>;
    closeAndLock: (id: string) => Promise<{ success: boolean; data: any }>;
    deleteTicket: (id: string) => Promise<{ success: boolean; data: any }>;
    multipleChangeStatus: (data: any) => Promise<{ success: boolean; data: any }>;
    multipleMarkAsUnread: (data: any) => Promise<{ success: boolean; data: any }>;
    multipleCloseAndLock: (data: any) => Promise<{ success: boolean; data: any }>;
    multipleDelete: (data: any) => Promise<{ success: boolean; data: any }>;
    clearState: () => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
    totalData: 0,
    data: [],
    selected: null,
    getAll: async (filters?: TicketFilters) => {
        // Build query parameters, only including non-empty values
        const params: Record<string, any> = {};

        if (filters) {
            if (filters.page !== undefined && filters.page !== null) {
                params.page = filters.page;
            }
            if (filters.limit !== undefined && filters.limit !== null) {
                params.limit = filters.limit;
            }
            if (filters.createdStart && filters.createdStart.trim() !== '') {
                params.createdStart = filters.createdStart;
            }
            if (filters.createdEnd && filters.createdEnd.trim() !== '') {
                params.createdEnd = filters.createdEnd;
            }
            if (filters.closedStart && filters.closedStart.trim() !== '') {
                params.closedStart = filters.closedStart;
            }
            if (filters.closedEnd && filters.closedEnd.trim() !== '') {
                params.closedEnd = filters.closedEnd;
            }
            if (filters.type && filters.type.trim() !== '') {
                params.type = filters.type;
            }
            if (filters.status && filters.status.trim() !== '') {
                params.status = filters.status;
            }
        }

        return axios
            .get(`${API_SLUG}`, { params })
            .then((response) => {
                const data = response.data?.data?.data ?? [];
                const totalData = response.data?.data?.totalItems ?? 0;

                set({ data, totalData });
                return { success: true, data: response.data?.data ?? [] };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    getOne: async (id: string) => {
        return axios
            .get(`${API_SLUG}/${id}`)
            .then((response) => {
                const data = response.data?.data ?? {};
                set({ selected: data });
                return { success: true, data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    createTicket: async (data: FormData) => {
        return axios
            .post(`${API_SLUG}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    replyThread: async (ticketId: string, data: FormData) => {
        return axios
            .post(`${API_SLUG}/${ticketId}/replies`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    closeTicket: async (id: string) => {
        return axios
            .post(`${API_SLUG}/${id}/close`)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    changeStatus: async (id: string, status: string) => {
        return axios
            .post(`${API_SLUG}/${id}/change-status`, { status })
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    markAsUnread: async (id: string) => {
        return axios
            .post(`${API_SLUG}/${id}/mark-as-unread`)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    closeAndLock: async (id: string) => {
        return axios
            .post(`${API_SLUG}/${id}/close-lock`)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    deleteTicket: async (id: string) => {
        return axios
            .post(`${API_SLUG}/${id}/delete`)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    multipleChangeStatus: async (data: any) => {
        return axios
            .post(`${API_SLUG}/multiple/change-status`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    multipleMarkAsUnread: async (data: any) => {
        return axios
            .post(`${API_SLUG}/multiple/mark-as-unread`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    multipleCloseAndLock: async (data: any) => {
        return axios
            .post(`${API_SLUG}/multiple/close-lock`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    multipleDelete: async (data: any) => {
        return axios
            .post(`${API_SLUG}/multiple/delete`, data)
            .then((response) => {
                return { success: true, data: response.data?.data };
            })
            .catch((error) => {
                return { success: false, data: error?.response?.data };
            });
    },
    clearState: () =>
        set({
            totalData: 0,
            data: [],
            selected: null,
        }),
}));
