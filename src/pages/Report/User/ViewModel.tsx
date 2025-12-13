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
    const fetchTableData = async () => {
        if (isFetchData.current) return;

        if (dateRange.length !== 2) {
            setUserData([]);
            return;
        }

        isFetchData.current = true;
        setLoading(true);

        try {
            // Build parameters for table data
            const startDate = moment(dateRange[0]).format('YYYY-MM-DD');
            const endDate = moment(dateRange[1]).format('YYYY-MM-DD');

            const params = {
                type: 'user_summary', // Default type for user report
                startDate,
                endDate,
                sources: selectedSources.map((s) => s.value),
            };

            const result = await getUserData(params);
            if (result.success) {
                setUserData(result.data || []);
            } else {
                console.error('Error fetching user data:', result);
                setUserData([]);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserData([]);
        } finally {
            isFetchData.current = false;
            setLoading(false);
        }
    };

    // Initialize source options from master data
    const initializeSourceOptions = async () => {
        try {
            const result = await getReportSources();
            if (result.success) {
                const options = result.data.map((source: any) => ({
                    value: source.value || source.id?.toString() || source.code,
                    label: source.label || source.name || source.title,
                }));
                setSourceOptions(options);
            } else {
                console.error('Error fetching report sources:', result);
                setSourceOptions([]);
            }
        } catch (error) {
            console.error('Error fetching report sources:', error);
            setSourceOptions([]);
        }
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
            render: ({ lastOrderDate }: any) => <div className="text-left">{moment(lastOrderDate).format('DD/MM/YYYY HH:mm')}</div>,
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
