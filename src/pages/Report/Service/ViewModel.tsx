import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useServiceStore } from '../../../store/service';
import { useServiceStore as useReportServiceStore } from '../../../store/report/service';
import { useMasterDataStore } from '../../../store/master-data';

export interface ServiceData {
    serviceId: number;
    externalServiceId: string;
    serviceName: string;
    orderCount: number;
    charge: number;
    cost: number;
    profit: number;
    refunded: number;
}

const TIMEZONE = 'Asia/Bangkok';

export const ViewModel = () => {
    const [serviceData, setServiceData] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter options
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [providerOptions, setProviderOptions] = useState<{ value: string; label: string }[]>([]);
    const [statusOptions] = useState<{ value: string; label: string }[]>([
        { value: 'true', label: 'Enable' },
        { value: 'false', label: 'Disable' },
    ]);

    // Filter states
    const [dateRange, setDateRange] = useState<Date[]>([moment().subtract(30, 'days').toDate(), moment().toDate()]);
    const [selectedCategories, setSelectedCategories] = useState<{ value: string; label: string }[]>([]);
    const [selectedProviders, setSelectedProviders] = useState<{ value: string; label: string }[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<{ value: string; label: string }[]>([]);

    const { getServiceData } = useReportServiceStore();
    const { getProviders, getServiceCategories } = useMasterDataStore();
    const isFetchData = useRef<boolean>(false);

    // Fetch table data from API
    // Fetch table data from API (Mocked)
    const fetchTableData = async () => {
        if (isFetchData.current) return;
        if (dateRange.length !== 2) {
            setServiceData([]);
            return;
        }

        isFetchData.current = true;
        setLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            // Generate Mock Service Data
            const mockServices: ServiceData[] = Array.from({ length: 15 }).map((_, index) => ({
                serviceId: index + 100,
                externalServiceId: `EXT-${index + 100}`,
                serviceName: `Service Mock ${index + 1}`,
                orderCount: Math.floor(Math.random() * 500),
                charge: Number((Math.random() * 1000).toFixed(2)),
                cost: Number((Math.random() * 800).toFixed(2)),
                profit: Number((Math.random() * 200).toFixed(2)),
                refunded: Number((Math.random() * 50).toFixed(2))
            }));

            setServiceData(mockServices);
        } catch (error) {
            console.error('Error fetching service data:', error);
            setServiceData([]);
        } finally {
            isFetchData.current = false;
            setLoading(false);
        }
    };

    // Initialize filter options from master data (Mocked)
    const initializeFilterOptions = async () => {
        // Mock Categories
        setCategoryOptions(Array.from({ length: 5 }).map((_, i) => ({
            value: (i + 1).toString(),
            label: `Mock Category ${i + 1}`
        })));

        // Mock Providers
        setProviderOptions(Array.from({ length: 5 }).map((_, i) => ({
            value: (i + 1).toString(),
            label: `Mock Provider ${i + 1}`
        })));
    };

    useEffect(() => {
        // Initialize data on component mount
        const initializeData = async () => {
            await initializeFilterOptions();
        };
        initializeData();
    }, []);

    useEffect(() => {
        // Fetch table data when filters change
        isFetchData.current = false;
        fetchTableData();
    }, [dateRange, selectedCategories, selectedProviders, selectedStatus]);

    // Define columns for DataTable
    const columns = [
        {
            accessor: 'serviceId',
            title: 'ID',
            width: 50,
            render: ({ serviceId }: any) => <div className="text-left">{serviceId}</div>,
        },
        {
            accessor: 'serviceName',
            title: 'Service Name',
            width: 350,
            render: ({ serviceName }: any) => <div className="text-left whitespace-normal break-words">{serviceName}</div>,
        },
        {
            accessor: 'orderCount',
            title: 'Orders',
            width: 100,
            render: ({ orderCount }: any) => <div className="text-left">{orderCount}</div>,
        },
        {
            accessor: 'charge',
            title: 'Charge',
            width: 120,
            render: ({ charge }: any) => <div className="text-left">{charge.toFixed(2)}</div>,
        },
        {
            accessor: 'cost',
            title: 'Cost',
            width: 120,
            render: ({ cost }: any) => <div className="text-left">{cost.toFixed(2)}</div>,
        },
        {
            accessor: 'profit',
            title: 'Profit',
            width: 120,
            render: ({ profit }: any) => <div className="text-left">{profit.toFixed(2)}</div>,
        },
        {
            accessor: 'refunded',
            title: 'Refunded',
            width: 120,
            render: ({ refunded }: any) => <div className="text-left">{refunded.toFixed(2)}</div>,
        },
    ];

    return {
        serviceData,
        loading,
        columns,
        // Filter options
        categoryOptions,
        providerOptions,
        statusOptions,
        // Selected values
        dateRange,
        selectedCategories,
        selectedProviders,
        selectedStatus,
        // Setters
        setDateRange,
        setSelectedCategories,
        setSelectedProviders,
        setSelectedStatus,
        // Data fetching
        fetchTableData,
    };
};
