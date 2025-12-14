import { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const TIMEZONE = 'Asia/Bangkok';

export interface ProviderChange {
    id: string;
    providerName: string;
    changeType: 'disabled' | 'enabled' | 'price_change' | 'rate_change' | 'new_service' | 'removed_service';
    serviceName: string;
    serviceId?: string;
    oldValue?: string;
    newValue?: string;
    details?: string;
    timestamp: string;
}

export const useProviderChangesViewModel = () => {
    const [loading, setLoading] = useState(true);
    const [changes, setChanges] = useState<ProviderChange[]>([]);
    const [filteredChanges, setFilteredChanges] = useState<ProviderChange[]>([]);

    // Filter states
    const [dateRange, setDateRange] = useState<Date[]>([
        moment().subtract(7, 'days').toDate(),
        moment().toDate()
    ]);
    const [selectedChangeTypes, setSelectedChangeTypes] = useState<string[]>([]);
    const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter options
    const changeTypeOptions = [
        { value: 'disabled', label: 'ปิดบริการ' },
        { value: 'enabled', label: 'เปิดบริการ' },
        { value: 'price_change', label: 'เปลี่ยนราคา' },
        { value: 'rate_change', label: 'เปลี่ยนอัตรา' },
        { value: 'new_service', label: 'บริการใหม่' },
        { value: 'removed_service', label: 'ยกเลิกบริการ' },
    ];

    const providerOptions = [
        { value: 'SMM Panel Pro', label: 'SMM Panel Pro' },
        { value: 'FastSMM', label: 'FastSMM' },
        { value: 'SocialBoost', label: 'SocialBoost' },
        { value: 'MediaGrow', label: 'MediaGrow' },
        { value: 'ViralMaster', label: 'ViralMaster' },
    ];

    const fetchChanges = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate mock data for last 30 days
        const changeTypes: ProviderChange['changeType'][] = ['disabled', 'enabled', 'price_change', 'rate_change', 'new_service', 'removed_service'];
        const providers = ['SMM Panel Pro', 'FastSMM', 'SocialBoost', 'MediaGrow', 'ViralMaster'];
        const services = [
            'Instagram Followers [1K]',
            'Instagram Followers [5K]',
            'Instagram Likes [500]',
            'TikTok Followers [1K]',
            'TikTok Likes [500]',
            'TikTok Views [10K]',
            'YouTube Views [1K]',
            'YouTube Subscribers [100]',
            'Facebook Page Likes [100]',
            'Twitter Followers [500]'
        ];

        const mockChanges: ProviderChange[] = [];
        for (let i = 0; i < 50; i++) {
            const changeType = changeTypes[Math.floor(Math.random() * changeTypes.length)];
            const provider = providers[Math.floor(Math.random() * providers.length)];
            const service = services[Math.floor(Math.random() * services.length)];
            const daysAgo = Math.floor(Math.random() * 30);
            const hoursAgo = Math.floor(Math.random() * 24);

            let details = '';
            let oldValue = '';
            let newValue = '';

            switch (changeType) {
                case 'disabled':
                    details = 'บริการถูกปิดชั่วคราวเนื่องจากปัญหาทางเทคนิค';
                    break;
                case 'enabled':
                    details = 'บริการกลับมาเปิดใช้งานได้แล้ว';
                    break;
                case 'price_change':
                    oldValue = `฿${(Math.random() * 100 + 20).toFixed(0)}`;
                    newValue = `฿${(Math.random() * 100 + 30).toFixed(0)}`;
                    details = `ราคาเปลี่ยนจาก ${oldValue} → ${newValue}`;
                    break;
                case 'rate_change':
                    oldValue = `${Math.floor(Math.random() * 500 + 100)}/วัน`;
                    newValue = `${Math.floor(Math.random() * 300 + 50)}/วัน`;
                    details = `อัตราเปลี่ยนจาก ${oldValue} → ${newValue}`;
                    break;
                case 'new_service':
                    newValue = `฿${(Math.random() * 200 + 50).toFixed(0)}`;
                    details = `บริการใหม่ ราคา ${newValue}`;
                    break;
                case 'removed_service':
                    details = 'บริการถูกยกเลิกถาวรจาก Provider';
                    break;
            }

            mockChanges.push({
                id: `change-${i}`,
                providerName: provider,
                changeType,
                serviceName: service,
                serviceId: `SVC-${1000 + i}`,
                oldValue,
                newValue,
                details,
                timestamp: moment().tz(TIMEZONE).subtract(daysAgo, 'days').subtract(hoursAgo, 'hours').toISOString()
            });
        }

        // Sort by timestamp (newest first)
        mockChanges.sort((a, b) => moment(b.timestamp).diff(moment(a.timestamp)));

        setChanges(mockChanges);
        setFilteredChanges(mockChanges);
        setLoading(false);
    };

    // Apply filters
    useEffect(() => {
        let filtered = [...changes];

        // Filter by date range
        if (dateRange.length === 2) {
            const startDate = moment(dateRange[0]).startOf('day');
            const endDate = moment(dateRange[1]).endOf('day');
            filtered = filtered.filter(change => {
                const changeDate = moment(change.timestamp);
                return changeDate.isBetween(startDate, endDate, undefined, '[]');
            });
        }

        // Filter by change type
        if (selectedChangeTypes.length > 0) {
            filtered = filtered.filter(change => selectedChangeTypes.includes(change.changeType));
        }

        // Filter by provider
        if (selectedProviders.length > 0) {
            filtered = filtered.filter(change => selectedProviders.includes(change.providerName));
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(change =>
                change.serviceName.toLowerCase().includes(query) ||
                change.providerName.toLowerCase().includes(query) ||
                (change.details && change.details.toLowerCase().includes(query))
            );
        }

        setFilteredChanges(filtered);
    }, [changes, dateRange, selectedChangeTypes, selectedProviders, searchQuery]);

    useEffect(() => {
        fetchChanges();
    }, []);

    return {
        loading,
        changes: filteredChanges,
        totalCount: changes.length,
        filteredCount: filteredChanges.length,
        // Filter options
        changeTypeOptions,
        providerOptions,
        // Filter states
        dateRange,
        selectedChangeTypes,
        selectedProviders,
        searchQuery,
        // Setters
        setDateRange,
        setSelectedChangeTypes,
        setSelectedProviders,
        setSearchQuery,
        // Actions
        refreshData: fetchChanges
    };
};
