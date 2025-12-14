import { useState, useEffect } from 'react';
import moment from 'moment';
import { DataTableColumn } from 'mantine-datatable';
import Decimal from 'decimal.js';
import { useUsersStore } from '../../../store/users';
import { useServiceStore } from '../../../store/service';
import { useMasterDataStore } from '../../../store/master-data';
import { useOrderStore } from '../../../store/report/order';

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
    totalOrders?: number;
    totalCharges?: number;
    totalQuantity?: number;
}

const TIMEZONE = 'Asia/Bangkok';

export type ActiveButtonType = 'amount' | 'charge' | 'quantity';

export const useOrderViewModel = () => {
    const [orderData, setOrderData] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeButton, setActiveButton] = useState<ActiveButtonType>('amount');
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
    const [serviceOptions, setServiceOptions] = useState<{ value: string; label: string }[]>([]);
    const [orderStatusOptions, setOrderStatusOptions] = useState<{ value: string; label: string }[]>([]);

    const renderData = (data: any) => {
        switch (activeButton) {
            case 'amount':
                return new Decimal(data ?? '0').toFixed(0);
            case 'charge':
                return new Decimal(data ?? '0').toFixed(2);
            case 'quantity':
                return new Decimal(data ?? '0').toFixed(0);
            default:
                return new Decimal(data ?? '0').toFixed(0);
        }
    };

    // DataTable columns
    const columns: DataTableColumn<OrderData>[] = [
        {
            accessor: 'day',
            title: 'Day',
            render: record => record.day
        },
        {
            accessor: 'jan',
            title: 'January',
            render: record => renderData(record.jan)
        },
        {
            accessor: 'feb',
            title: 'February',
            render: record => renderData(record.feb)
        },
        {
            accessor: 'mar',
            title: 'March',
            render: record => renderData(record.mar)
        },
        {
            accessor: 'apr',
            title: 'April',
            render: record => renderData(record.apr)
        },
        {
            accessor: 'may',
            title: 'May',
            render: record => renderData(record.may)
        },
        {
            accessor: 'jun',
            title: 'June',
            render: record => renderData(record.jun)
        },
        {
            accessor: 'jul',
            title: 'July',
            render: record => renderData(record.jul)
        },
        {
            accessor: 'aug',
            title: 'August',
            render: record => renderData(record.aug)
        },
        {
            accessor: 'sep',
            title: 'September',
            render: record => renderData(record.sep)
        },
        {
            accessor: 'oct',
            title: 'October',
            render: record => renderData(record.oct)
        },
        {
            accessor: 'nov',
            title: 'November',
            render: record => renderData(record.nov)
        },
        {
            accessor: 'dec',
            title: 'December',
            render: record => renderData(record.dec)
        }
    ];

    // Filter states
    const [dateRange, setDateRange] = useState<Date[]>([moment().subtract(30, 'days').toDate(), moment().toDate()]);
    const [selectedUsers, setSelectedUsers] = useState<{ value: string; label: string }[]>([]);
    const [selectedServices, setSelectedServices] = useState<{ value: string; label: string }[]>([]);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<{ value: string; label: string }[]>([]);

    const { getAllData } = useUsersStore();
    const { getAllService } = useServiceStore();
    const { getOrderStatus } = useMasterDataStore();
    const { getOrderData } = useOrderStore();

    // Fetch table data from API (Mocked)
    const fetchTableData = async () => {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (dateRange.length !== 2) {
            setOrderData([]);
            setLoading(false);
            return;
        }

        // Generate Mock Data
        const mockData: TableDataItem[] = [];
        for (let m = 1; m <= 12; m++) {
            for (let d = 1; d <= 31; d++) {
                // Randomize data
                mockData.push({
                    day: d,
                    month: m,
                    totalOrders: Math.floor(Math.random() * 50),
                    totalCharges: Number((Math.random() * 1000).toFixed(2)),
                    totalQuantity: Math.floor(Math.random() * 100)
                });
            }
        }

        const processedData = processTableData(mockData);
        setOrderData(processedData);
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
            months.forEach(month => {
                rowData[month as keyof OrderData] = 0;
            });

            // Fill in data from API
            apiData.forEach(item => {
                if (item.day === day) {
                    const monthIndex = item.month - 1; // API month is 1-based, array is 0-based
                    if (monthIndex >= 0 && monthIndex < 12) {
                        const monthKey = months[monthIndex] as keyof OrderData;

                        // Use the appropriate field based on active button
                        let value = 0;
                        if (activeButton === 'amount' && 'totalOrders' in item) {
                            value = Number(item.totalOrders);
                        } else if (activeButton === 'charge' && 'totalCharges' in item) {
                            value = Number(item.totalCharges);
                        } else if (activeButton === 'quantity' && 'totalQuantity' in item) {
                            value = Number(item.totalQuantity);
                        }

                        rowData[monthKey] = value;
                    }
                }
            });

            processedData.push(rowData);
        }

        return processedData;
    };

    // Fetch users data for filter options (Mocked)
    const fetchUsersData = async () => {
        // Mock data
        const options = Array.from({ length: 10 }).map((_, i) => ({
            value: (i + 1).toString(),
            label: `Mock User ${i + 1}`
        }));
        setUserOptions(options);
    };

    // Fetch services data for filter options (Mocked)
    const fetchServicesData = async () => {
        // Mock data
        const options = Array.from({ length: 10 }).map((_, i) => ({
            value: (i + 1).toString(),
            label: `Mock Service ${i + 1}`
        }));
        setServiceOptions(options);
    };

    // Fetch order status data for filter options (Mocked)
    const fetchOrderStatusData = async () => {
        // Mock data
        const options = [
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' }
        ];
        setOrderStatusOptions(options);
        // Set default to empty array (no status selected)
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
    }, [dateRange, selectedUsers, selectedServices, selectedOrderStatus, activeButton]);

    return {
        orderData,
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
        // Active button state
        activeButton,
        setActiveButton,
        // Setters
        setDateRange,
        setSelectedUsers,
        setSelectedServices,
        setSelectedOrderStatus,
        // Data fetching
        fetchTableData
    };
};
