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
    const fetchTableData = async () => {
        if (isFetchData.current) return;

        if (dateRange.length !== 2) {
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
                endDate
                // categoryIds: selectedCategories.map((s: { value: string; label: string }) => s.value),
                // providerIds: selectedProviders.map((s: { value: string; label: string }) => s.value),
                // isActive: selectedStatus.length > 0 ? selectedStatus[0]?.value === 'true' : true
            };

            let result: any = null;
            if (activeButton === 'pnl') {
                result = await getPnLData(params);
            } else {
                result = await getOrderAmountData(params);
            }
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
        serviceData: activeButton === 'pnl' ? pnlData : orderAmountData,
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
