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
    const fetchTableData = async () => {
        if (isFetchData.current) return;

        if (dateRange.length !== 2) {
            setServiceData([]);
            return;
        }

        isFetchData.current = true;
        setLoading(true);

        try {
            // Build parameters for table data
            const startDate = moment(dateRange[0]).format('YYYY-MM-DD');
            const endDate = moment(dateRange[1]).format('YYYY-MM-DD');

            const params = {
                startDate,
                endDate,
                categoryIds: selectedCategories.map((s: { value: string; label: string }) => s.value),
                providerIds: selectedProviders.map((s: { value: string; label: string }) => s.value),
                isActive: selectedStatus.length > 0 ? selectedStatus[0]?.value === 'true' : true,
            };

            const result = await getServiceData(params);
            if (result.success) {
                setServiceData(result.data || []);
            } else {
                console.error('Error fetching service data:', result);
                setServiceData([]);
            }
        } catch (error) {
            console.error('Error fetching service data:', error);
            setServiceData([]);
        } finally {
            isFetchData.current = false;
            setLoading(false);
        }
    };

    // Initialize filter options from master data
    const initializeFilterOptions = async () => {
        try {
            // Fetch service categories
            const categoriesResult = await getServiceCategories();
            if (categoriesResult.success) {
                const categoryOpts = categoriesResult.data.map((category: any) => ({
                    value: category.id?.toString(),
                    label: category.name,
                }));
                setCategoryOptions(categoryOpts);
            }

            // Fetch providers
            const providersResult = await getProviders();
            if (providersResult.success) {
                const providerOpts = providersResult.data.map((provider: any) => ({
                    value: provider.id?.toString(),
                    label: provider.name,
                }));
                setProviderOptions(providerOpts);
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
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
