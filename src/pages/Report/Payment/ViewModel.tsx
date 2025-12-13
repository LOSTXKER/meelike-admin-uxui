import { useState, useEffect } from 'react';
import { usePaymentStore } from '../../../store/report/payment';
import { useUsersStore } from '../../../store/users';
import moment from 'moment';

export interface PaymentData {
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

export interface ChartDataItem {
    date: string;
    method: string;
    totalAmount: number;
    count: number;
}

export interface TableDataItem {
    day: number;
    month: number;
    totalCount: number;
}

// Mock data for filters
const paymentOptions = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'promptpay', label: 'PromptPay' },
    { value: 'truemoney', label: 'TrueMoney' },
];

const orderStatusOptions = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'pending', label: 'รอดำเนินการ' },
    { value: 'completed', label: 'เสร็จสมบูรณ์' },
    { value: 'cancelled', label: 'ยกเลิก' },
];

export type ActiveButtonType = 'amount' | 'count';
export type ViewType = 'chart' | 'table';

export const useOrderViewModel = () => {
    const [PaymentData, setPaymentData] = useState<PaymentData[]>([]);
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeButton, setActiveButton] = useState<ActiveButtonType>('amount');
    const [viewType, setViewType] = useState<ViewType>('chart');
    const [dateRange, setDateRange] = useState<Date[]>([moment().subtract(30, 'days').toDate(), moment().toDate()]);
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);

    // Filter states
    const [selectedUsers, setSelectedUsers] = useState<{ value: string; label: string }[]>([]);
    const [selectedServices, setSelectedServices] = useState<typeof paymentOptions>([]);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(orderStatusOptions[0]);

    const { getFundHistoryChartData, getTableData } = usePaymentStore();
    const { getAllData } = useUsersStore();

    const fetchChartData = async () => {
        if (dateRange.length === 2) {
            const startDate = moment(dateRange[0]).format('YYYY-MM-DD');
            const endDate = moment(dateRange[1]).format('YYYY-MM-DD');

            const result = await getFundHistoryChartData(startDate, endDate);
            if (result.success) {
                setChartData(result.data);
            }
        }
    };

    const fetchTableData = async () => {
        if (dateRange.length !== 2) {
            setPaymentData([]);
            return;
        }
        // Build parameters for table data
        const startDate = moment(dateRange[0]).format('YYYY-MM-DD');
        const endDate = moment(dateRange[1]).format('YYYY-MM-DD');
        const params = {
            type: activeButton === 'amount' ? 'total_amount' : 'total_count',
            startDate,
            endDate,
            methods: selectedServices.filter((s) => s.value !== 'all').map((s) => s.value),
            userIds: selectedUsers.map((u: { value: string; label: string }) => parseInt(u.value)),
        };

        const result = await getTableData(params);
        if (result.success) {
            const processedData = processTableData(result.data);
            setPaymentData(processedData);
        } else {
            console.log(result);
        }
    };

    // Process table data from API to match the table format
    const processTableData = (apiData: TableDataItem[]): PaymentData[] => {
        // Create array for days 1-31
        const processedData: PaymentData[] = [];

        for (let day = 1; day <= 31; day++) {
            const rowData: PaymentData = { day };

            // Initialize all months to 0
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            months.forEach((month) => {
                rowData[month as keyof PaymentData] = 0;
            });

            // Fill in data from API
            apiData.forEach((item) => {
                if (item.day === day) {
                    const monthIndex = item.month - 1; // API month is 1-based, array is 0-based
                    if (monthIndex >= 0 && monthIndex < 12) {
                        const monthKey = months[monthIndex] as keyof PaymentData;
                        // Use totalAmount or totalCount depending on activeButton
                        if (activeButton === 'amount' && 'totalAmount' in item) {
                            rowData[monthKey] = Number(item.totalAmount);
                        } else if (activeButton === 'count' && 'totalCount' in item) {
                            rowData[monthKey] = Number(item.totalCount);
                        }
                    }
                }
            });

            processedData.push(rowData);
        }

        return processedData;
    };

    // Fetch users data for filter options
    const fetchUsersData = async () => {
        const result = await getAllData();
        if (result.success) {
            const options = result.data.map((user: any) => ({
                value: user.id.toString(),
                label: user.name,
            }));
            setUserOptions(options);
        }
    };

    useEffect(() => {
        // Fetch users data on component mount
        const initializeData = async () => {
            setLoading(true);
            await fetchUsersData();
            setLoading(false);
        };
        initializeData();
    }, []);

    useEffect(() => {
        // Fetch chart data when date range changes and in chart view
        if (viewType === 'chart') {
            fetchChartData();
        }
    }, [dateRange, viewType]);

    useEffect(() => {
        // Fetch table data when filters change and in table view
        if (viewType === 'table') {
            fetchTableData();
        }
    }, [viewType, dateRange, selectedUsers, selectedServices, activeButton]);

    // Process chart data for ApexCharts
    const processChartData = () => {
        if (!chartData.length) return { series: [], categories: [] };

        // Get unique methods and dates
        const methods = [...new Set(chartData.map((item) => item.method))];
        const dates = [...new Set(chartData.map((item) => item.date))].sort();

        // Create series data for each method
        const series = methods.map((method, index) => {
            const methodData = dates.map((date) => {
                const item = chartData.find((d) => d.date === date && d.method === method);
                return item ? (activeButton === 'amount' ? item.totalAmount : item.count) : 0;
            });

            return {
                name: method,
                data: methodData,
            };
        });

        return { series, categories: dates };
    };

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
        PaymentData,
        chartData,
        loading,
        columns,
        // Filter options
        userOptions,
        paymentOptions,
        orderStatusOptions,
        // Selected values
        selectedUsers,
        selectedServices,
        selectedOrderStatus,
        viewType,
        setViewType,
        // Active button state
        activeButton,
        setActiveButton,
        // Date range
        dateRange,
        setDateRange,
        // Setters
        setSelectedUsers,
        setSelectedServices,
        setSelectedOrderStatus,
        // Chart data processing
        processChartData,
        fetchChartData,
        fetchTableData,
    };
};
