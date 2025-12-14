import { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const TIMEZONE = 'Asia/Bangkok';

export interface DashboardStats {
    ordersToday: number;
    newUsersToday: number;
    revenueToday: number;
    activeTickets: number;
    ordersTrend: number; // percentage change
    usersTrend: number;
    revenueTrend: number;
    ticketsTrend: number;
}

export interface Alert {
    id: string;
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    count?: number;
    link?: string;
}

export interface ProviderChange {
    id: string;
    providerName: string;
    changeType: 'disabled' | 'enabled' | 'price_change' | 'rate_change' | 'new_service' | 'removed_service';
    serviceName: string;
    details?: string;
    timestamp: string;
}

export const useDashboardViewModel = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [providerChanges, setProviderChanges] = useState<ProviderChange[]>([]);

    const fetchDashboardData = async () => {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock Stats
        setStats({
            ordersToday: Math.floor(Math.random() * 200) + 50,
            newUsersToday: Math.floor(Math.random() * 30) + 5,
            revenueToday: Math.floor(Math.random() * 50000) + 10000,
            activeTickets: Math.floor(Math.random() * 15) + 2,
            ordersTrend: Math.floor(Math.random() * 30) - 10,
            usersTrend: Math.floor(Math.random() * 20) - 5,
            revenueTrend: Math.floor(Math.random() * 25) - 8,
            ticketsTrend: Math.floor(Math.random() * 10) - 15,
        });

        // Mock Alerts
        setAlerts([
            {
                id: '1',
                type: 'error',
                title: 'ออร์เดอร์ล้มเหลว',
                description: 'มีออร์เดอร์ที่ดำเนินการไม่สำเร็จ',
                count: Math.floor(Math.random() * 5) + 1,
                link: '/orders?status=failed'
            },
            {
                id: '2',
                type: 'warning',
                title: 'Ticket ค้างนาน',
                description: 'Ticket ที่รอการตอบกลับเกิน 24 ชั่วโมง',
                count: Math.floor(Math.random() * 8) + 1,
                link: '/tickets?filter=pending'
            },
            {
                id: '3',
                type: 'info',
                title: 'Provider Balance ต่ำ',
                description: 'ยอดคงเหลือของผู้ให้บริการบางรายต่ำกว่าเกณฑ์',
                count: 2,
                link: '/provider'
            },
        ]);

        // Mock Provider Changes
        const changeTypes: ProviderChange['changeType'][] = ['disabled', 'enabled', 'price_change', 'rate_change', 'new_service', 'removed_service'];
        const providerNames = ['SMM Panel Pro', 'FastSMM', 'SocialBoost', 'MediaGrow', 'ViralMaster'];
        const serviceNames = ['Instagram Followers', 'TikTok Likes', 'YouTube Views', 'Facebook Page Likes', 'Twitter Followers'];

        const mockProviderChanges: ProviderChange[] = [
            {
                id: 'pc-1',
                providerName: 'SMM Panel Pro',
                changeType: 'disabled',
                serviceName: 'Instagram Followers [1K]',
                details: 'บริการถูกปิดชั่วคราวเนื่องจากปัญหาทางเทคนิค',
                timestamp: moment().tz(TIMEZONE).subtract(2, 'hours').toISOString()
            },
            {
                id: 'pc-2',
                providerName: 'FastSMM',
                changeType: 'price_change',
                serviceName: 'TikTok Likes [500]',
                details: 'ราคาเปลี่ยนจาก ฿50 → ฿65 (+30%)',
                timestamp: moment().tz(TIMEZONE).subtract(5, 'hours').toISOString()
            },
            {
                id: 'pc-3',
                providerName: 'SocialBoost',
                changeType: 'rate_change',
                serviceName: 'YouTube Views [1K]',
                details: 'อัตรา Drip Feed เปลี่ยนจาก 100/วัน → 50/วัน',
                timestamp: moment().tz(TIMEZONE).subtract(1, 'days').toISOString()
            },
            {
                id: 'pc-4',
                providerName: 'MediaGrow',
                changeType: 'enabled',
                serviceName: 'Facebook Page Likes [100]',
                details: 'บริการกลับมาเปิดใช้งานได้แล้ว',
                timestamp: moment().tz(TIMEZONE).subtract(1, 'days').subtract(3, 'hours').toISOString()
            },
            {
                id: 'pc-5',
                providerName: 'ViralMaster',
                changeType: 'removed_service',
                serviceName: 'Twitter Followers [Premium]',
                details: 'บริการถูกยกเลิกถาวรจาก Provider',
                timestamp: moment().tz(TIMEZONE).subtract(2, 'days').toISOString()
            },
            {
                id: 'pc-6',
                providerName: 'SMM Panel Pro',
                changeType: 'new_service',
                serviceName: 'Instagram Reels Views [10K]',
                details: 'บริการใหม่ ราคา ฿120',
                timestamp: moment().tz(TIMEZONE).subtract(3, 'days').toISOString()
            },
        ];
        setProviderChanges(mockProviderChanges);

        setLoading(false);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return {
        loading,
        stats,
        alerts,
        providerChanges,
        refreshData: fetchDashboardData
    };
};
