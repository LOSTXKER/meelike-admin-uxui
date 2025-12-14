import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useServiceCategoryStore as useReportServiceCategoryStore } from '@/store/report/service-category';
import { useShallow } from 'zustand/react/shallow';
import Decimal from 'decimal.js';

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
export type ActiveButtonType = 'pnl' | 'order-amount';

export const ViewModel = () => {
    const [loading, setLoading] = useState(true);
    const [activeButton, setActiveButton] = useState<ActiveButtonType>('pnl');
    const [localData, setLocalData] = useState<any[]>([]); // Add local state for mock data

    // Filter options

    // Filter states
    const [dateRange, setDateRange] = useState<Date[]>([moment().subtract(30, 'days').toDate(), moment().toDate()]);
    const [selectedCategories, setSelectedCategories] = useState<{ value: string; label: string }[]>([]);
    const [selectedProviders, setSelectedProviders] = useState<{ value: string; label: string }[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<{ value: string; label: string }[]>([]);

    const { pnlData, orderAmountData, getPnLData, getOrderAmountData, clearState } = useReportServiceCategoryStore(
        useShallow(state => ({
            pnlData: state.pnlData,
            orderAmountData: state.orderAmountData,
            getPnLData: state.getPnLData,
            getOrderAmountData: state.getOrderAmountData,
            clearState: state.clearState
        }))
    );
    const isFetchData = useRef<boolean>(false);

    // Fetch table data from API
    // Fetch table data from API (Mocked)
    const fetchTableData = async () => {
        if (isFetchData.current) return;

        isFetchData.current = true;
        setLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            // Generate Mock Data
            const mockCategories = Array.from({ length: 8 }).map((_, index) => {
                const cost = Math.random() * 5000;
                const revenue = cost * 1.5;
                return {
                    categoryId: index + 1,
                    categoryName: `Category ${index + 1}`,
                    costTHB: cost,
                    revenueTHB: revenue,
                    pnlTHB: revenue - cost,
                    marginPct: 33.33,
                    orderCount: Math.floor(Math.random() * 1000)
                };
            });
            setLocalData(mockCategories);

        } catch (error) {
            console.error('Error fetching service data:', error);
        } finally {
            isFetchData.current = false;
            setLoading(false);
        }
    };

    // Define columns for DataTable
    const pnlColumns: any[] = [
        {
            accessor: 'categoryId',
            title: 'ID',
            width: 50,
            render: ({ categoryId }: any) => <div className='text-start'>{categoryId}</div>
        },
        {
            accessor: 'categoryName',
            title: 'ชื่อหมวดหมู่',
            width: 350,
            render: ({ categoryName }: any) => <div className='text-start whitespace-normal break-words'>{categoryName}</div>
        },
        {
            accessor: 'costTHB',
            title: 'ต้นทุน',
            titleClassName: 'text-end',
            width: 100,
            render: ({ costTHB }: any) => <div className='text-end'>{new Decimal(costTHB).toDecimalPlaces(2).toNumber().toLocaleString('th-TH')} THB</div>
        },
        {
            accessor: 'revenueTHB',
            title: 'ราคาขาย',
            titleClassName: 'text-end',
            width: 120,
            render: ({ revenueTHB }: any) => <div className='text-end'>{new Decimal(revenueTHB).toDecimalPlaces(2).toNumber().toLocaleString('th-TH')} THB</div>
        },
        {
            accessor: 'pnlTHB',
            title: 'กำไร',
            titleClassName: 'text-end',
            width: 120,
            render: ({ pnlTHB }: any) => <div className='text-end'>{new Decimal(pnlTHB).toDecimalPlaces(2).toNumber().toLocaleString('th-TH')} THB</div>
        },
        {
            accessor: 'marginPct',
            title: 'กำไร (%)',
            titleClassName: 'text-end',
            width: 120,
            render: ({ marginPct }: any) => <div className='text-end'>{new Decimal(marginPct).toDecimalPlaces(2).toNumber().toLocaleString('th-TH')} %</div>
        }
    ];

    const orderAmountColumns: any[] = [
        {
            accessor: 'categoryId',
            title: 'ID',
            width: 50,
            render: ({ categoryId }: any) => <div className='text-start'>{categoryId}</div>
        },
        {
            accessor: 'categoryName',
            title: 'ชื่อหมวดหมู่',
            width: 350,
            render: ({ categoryName }: any) => <div className='text-start whitespace-normal break-words'>{categoryName}</div>
        },
        {
            accessor: 'orderCount',
            title: 'จำนวนคำสั่งซื้อ',
            titleClassName: 'text-end',
            width: 100,
            render: ({ orderCount }: any) => <div className='text-end'>{orderCount.toLocaleString()}</div>
        }
    ];

    useEffect(() => {
        // Fetch table data when filters change
        isFetchData.current = false;
        clearState();
        fetchTableData();
    }, [dateRange, activeButton, selectedCategories, selectedProviders, selectedStatus]);

    return {
        serviceData: localData, // Use local mock data
        loading,
        columns: activeButton === 'pnl' ? pnlColumns : orderAmountColumns, // Adjust columns based on active button
        activeButton,
        setActiveButton,
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
        fetchTableData
    };
};
