import { useState, useEffect } from 'react';
import moment from 'moment';
import { useUsersStore } from '../../../store/users';
import { useServiceStore } from '../../../store/service';
import { useMasterDataStore } from '../../../store/master-data';
import { useOrderStore } from '../../../store/report/profit';

export interface OrderData {
    day: number | string;
    jan?: number;
    feb?: number;
    mar?: number;
    apr?: number;
    may?: number;
    jun?: number;
    jul?: number;
    aug?: number;
    sep?: number;
    oct?: number;
    nov?: number;
    dec?: number;
}

export interface TableDataItem {
    day: number;
    month: number;
    profit: number;
}

const TIMEZONE = 'Asia/Bangkok';

export const ViewModel = () => {
    const [profitData, setProfitData] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
    const [serviceOptions, setServiceOptions] = useState<{ value: string; label: string }[]>([]);
    const [orderStatusOptions, setOrderStatusOptions] = useState<{ value: string; label: string }[]>([]);

    // Filter states
    const [dateRange, setDateRange] = useState<Date[]>([moment().subtract(30, 'days').toDate(), moment().toDate()]);
    const [selectedUsers, setSelectedUsers] = useState<{ value: string; label: string }[]>([]);
    const [selectedServices, setSelectedServices] = useState<{ value: string; label: string }[]>([]);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<{ value: string; label: string }[]>([]);

    const { getAllData } = useUsersStore();
    const { getAllService } = useServiceStore();
    const { getOrderStatus } = useMasterDataStore();
    const { getProfitData } = useOrderStore();

    // Fetch table data from API (Mocked)
    const fetchTableData = async () => {
        setLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 400));

        if (dateRange.length !== 2) {
            setProfitData([]);
            setLoading(false);
            return;
        }

        // Generate Mock Data
        const mockData: TableDataItem[] = [];
        for (let m = 1; m <= 12; m++) {
            for (let d = 1; d <= 31; d++) {
                // Random profit
                mockData.push({
                    day: d,
                    month: m,
                    profit: Number((Math.random() * 2000 - 500).toFixed(2)) // Allow some negative profit
                });
            }
        }

        const processedData = processTableData(mockData);
        setProfitData(processedData);
        setLoading(false);
    };

    // Process table data from API to match the table format
    const processTableData = (apiData: TableDataItem[]): OrderData[] => {
        // Create array for days 1-31
        const processedData: OrderData[] = [];

        for (let day = 1; day <= 31; day++) {
            const rowData: OrderData = { day };

            // Initialize all months to 0
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            months.forEach((month) => {
                rowData[month as keyof OrderData] = 0;
            });

            // Fill in data from API
            apiData.forEach((item) => {
                if (item.day === day) {
                    const monthIndex = item.month - 1; // API month is 1-based, array is 0-based
                    if (monthIndex >= 0 && monthIndex < 12) {
                        const monthKey = months[monthIndex] as keyof OrderData;
                        rowData[monthKey] = Number(item.profit);
                    }
                }
            });

            processedData.push(rowData);
        }

        return processedData;
    };

    // Fetch users data for filter options (Mocked)
    const fetchUsersData = async () => {
        const options = Array.from({ length: 10 }).map((_, i) => ({
            value: (i + 1).toString(),
            label: `Mock User ${i + 1}`,
        }));
        setUserOptions(options);
    };

    // Fetch services data for filter options (Mocked)
    const fetchServicesData = async () => {
        const options = Array.from({ length: 10 }).map((_, i) => ({
            value: (i + 1).toString(),
            label: `Mock Service ${i + 1}`,
        }));
        setServiceOptions(options);
    };

    // Fetch order status data for filter options (Mocked)
    const fetchOrderStatusData = async () => {
        const options = [
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' }
        ];
        setOrderStatusOptions(options);
        setSelectedOrderStatus([]);
    };

    useEffect(() => {
        // Fetch all filter data on component mount
        const initializeData = async () => {
            setLoading(true);
            await Promise.all([fetchUsersData(), fetchServicesData(), fetchOrderStatusData()]);
            setLoading(false);
        };
        initializeData();
    }, []);

    useEffect(() => {
        // Fetch table data when filters change
        fetchTableData();
    }, [dateRange, selectedUsers, selectedServices, selectedOrderStatus]);

    // Define columns for DataTable
    const columns = [
        {
            accessor: 'day',
            title: 'Day',

            width: 80,
            render: ({ day }: any) => <div className="text-center">{day}</div>,
        },
        {
            accessor: 'jan',
            title: 'January',

            width: 100,
            render: ({ jan }: any) => <div className="text-center">{jan !== undefined && jan !== null ? jan.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'feb',
            title: 'February',

            width: 100,
            render: ({ feb }: any) => <div className="text-center">{feb !== undefined && feb !== null ? feb.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'mar',
            title: 'March',

            width: 100,
            render: ({ mar }: any) => <div className="text-center">{mar !== undefined && mar !== null ? mar.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'apr',
            title: 'April',

            width: 100,
            render: ({ apr }: any) => <div className="text-center">{apr !== undefined && apr !== null ? apr.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'may',
            title: 'May',

            width: 100,
            render: ({ may }: any) => <div className="text-center">{may !== undefined && may !== null ? may.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'jun',
            title: 'June',

            width: 100,
            render: ({ jun }: any) => <div className="text-center">{jun !== undefined && jun !== null ? jun.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'jul',
            title: 'July',

            width: 100,
            render: ({ jul }: any) => <div className="text-center">{jul !== undefined && jul !== null ? jul.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'aug',
            title: 'August',

            width: 100,
            render: ({ aug }: any) => <div className="text-center">{aug !== undefined && aug !== null ? aug.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'sep',
            title: 'September',

            width: 100,
            render: ({ sep }: any) => <div className="text-center">{sep !== undefined && sep !== null ? sep.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'oct',
            title: 'October',

            width: 100,
            render: ({ oct }: any) => <div className="text-center">{oct !== undefined && oct !== null ? oct.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'nov',
            title: 'November',

            width: 100,
            render: ({ nov }: any) => <div className="text-center">{nov !== undefined && nov !== null ? nov.toFixed(2) : '0.00'}</div>,
        },
        {
            accessor: 'dec',
            title: 'December',

            width: 100,
            render: ({ dec }: any) => <div className="text-center">{dec !== undefined && dec !== null ? dec.toFixed(2) : '0.00'}</div>,
        },
    ];

    return {
        profitData,
        loading,
        columns,
        // Filter options
        userOptions,
        serviceOptions,
        orderStatusOptions,
        // Selected values
        dateRange,
        selectedUsers,
        selectedServices,
        selectedOrderStatus,
        // Setters
        setDateRange,
        setSelectedUsers,
        setSelectedServices,
        setSelectedOrderStatus,
        // Data fetching
        fetchTableData,
    };
};
