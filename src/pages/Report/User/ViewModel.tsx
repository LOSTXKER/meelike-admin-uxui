import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useUserStore } from '../../../store/admin-user';
import { useServiceStore } from '../../../store/service';
import { useMasterDataStore } from '../../../store/master-data';
import { useUserStore as useUserReportStore } from '../../../store/report/user';

export interface UserData {
    userId: number;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
    profit: number;
    lastOrderDate: string;
}

const TIMEZONE = 'Asia/Bangkok';

export const ViewModel = () => {
    const [userData, setUserData] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [sourceOptions, setSourceOptions] = useState<{ value: string; label: string }[]>([]);

    // Filter states
    const [dateRange, setDateRange] = useState<Date[]>([moment().subtract(30, 'days').toDate(), moment().toDate()]);
    const [selectedSources, setSelectedSources] = useState<{ value: string; label: string }[]>([]);

    const { getUserData } = useUserReportStore();
    const { getReportSources } = useMasterDataStore();
    const isFetchData = useRef<boolean>(false);

    // Fetch table data from API
    // Fetch table data from API (Mocked)
    const fetchTableData = async () => {
        if (isFetchData.current) return;
        if (dateRange.length !== 2) {
            setUserData([]);
            return;
        }

        isFetchData.current = true;
        setLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            // Generate Mock User Data
            const mockUsers: UserData[] = Array.from({ length: 20 }).map((_, index) => ({
                userId: index + 1,
                name: `User ${index + 1}`,
                email: `user${index + 1}@example.com`,
                totalOrders: Math.floor(Math.random() * 100),
                totalSpent: Number((Math.random() * 5000).toFixed(2)),
                profit: Number((Math.random() * 1000).toFixed(2)),
                lastOrderDate: moment().subtract(Math.floor(Math.random() * 30), 'days').toISOString()
            }));

            setUserData(mockUsers);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserData([]);
        } finally {
            isFetchData.current = false;
            setLoading(false);
        }
    };

    // Initialize source options from master data (Mocked)
    const initializeSourceOptions = async () => {
        // Mock data
        const options = [
            { value: 'website', label: 'Website' },
            { value: 'mobile', label: 'Mobile App' },
            { value: 'api', label: 'API' }
        ];
        setSourceOptions(options);
    };

    useEffect(() => {
        // Initialize data on component mount
        const initializeData = async () => {
            await initializeSourceOptions();
        };
        initializeData();
    }, []);

    useEffect(() => {
        // Fetch table data when filters change
        isFetchData.current = false;
        fetchTableData();
    }, [dateRange, selectedSources]);

    // Define columns for DataTable
    const columns = [
        {
            accessor: 'name',
            title: 'UserName',

            width: 250,
            render: ({ name }: any) => <div className="text-left">{name}</div>,
        },
        {
            accessor: 'totalOrders',
            title: 'Orders',

            width: 120,
            render: ({ totalOrders }: any) => <div className="text-left">{totalOrders}</div>,
        },
        {
            accessor: 'totalSpent',
            title: 'Spent',

            width: 150,
            render: ({ totalSpent }: any) => <div className="text-left">{totalSpent.toFixed(2)}</div>,
        },
        {
            accessor: 'profit',
            title: 'Profit',

            width: 150,
            render: ({ profit }: any) => <div className="text-left">{profit.toFixed(2)}</div>,
        },
        {
            accessor: 'lastOrderDate',
            title: 'Last order date',

            width: 200,
            render: ({ lastOrderDate }: any) => <div className="text-left">{lastOrderDate ? moment(lastOrderDate).format('DD/MM/YYYY HH:mm') : ''}</div>,
        },
    ];

    return {
        userData,
        loading,
        columns,
        // Filter options
        sourceOptions,
        // Selected values
        dateRange,
        selectedSources,
        // Setters
        setDateRange,
        setSelectedSources,
        // Data fetching
        fetchTableData,
    };
};
