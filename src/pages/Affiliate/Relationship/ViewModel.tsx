import { useEffect, useState, useRef, Fragment, useMemo } from 'react';
import { useThemeStore } from '@/store/theme';
import { useAffiliateStore } from '@/store/affiliate';
import { useShallow } from 'zustand/react/shallow';
import { DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';

const PAGE_SIZES = [10, 20, 30, 50, 100];

const INITIAL_FILTER_STATE = {
    sortStatus: {
        columnAccessor: 'id',
        direction: 'desc'
    } as DataTableSortStatus,
    search: ''
};

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            rtlClass: state.rtlClass,
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );
    const { rawData, getAll, clearState } = useAffiliateStore(
        useShallow(state => ({
            rawData: state.relationships,
            getAll: state.getRelationships,
            clearState: state.clearState
        }))
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isFetchData = useRef<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);

    // Use frontend pagination with useMemo
    const filteredData = useMemo(() => {
        // Filter by search term if provided
        let filtered = [...(rawData || [])];
        filtered = filtered.map((item, index) => ({
            ...item,
            order: index + 1 + (page - 1) * pageSize // Add order field for display
        }));

        if (filterState.search) {
            const searchLower = filterState.search.toLowerCase();
            filtered = filtered.filter(item => (item.name?.toLowerCase() || '').includes(searchLower) || String(item.id || '').includes(searchLower));
        }

        // Sort the data
        const sortedData = sortBy(filtered, filterState.sortStatus.columnAccessor);
        return filterState.sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData;
    }, [rawData, filterState.search, filterState.sortStatus]);

    // Get current page data
    const data = useMemo(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        return filteredData.slice(from, to);
    }, [filteredData, page, pageSize]);

    const totalData = useMemo(() => {
        return rawData.length;
    }, [rawData]);

    const setupPage = () => {
        setAppName('Referrals');
        setPageTitle(`Referrals | MeeLike Admin`);
    };

    const fetchData = () => {
        if (isFetchData.current) return;

        isFetchData.current = true;
        setIsLoading(true);
        getAll({
            search: filterState.search
        }).finally(() => {
            setIsLoading(false);
            isFetchData.current = false;
        });
    };

    const onChangeFilterState = (key: string, value: any) => {
        setFilterState(prevState => ({
            ...prevState,
            [key]: value
        }));
        setPage(1);
        isFetchData.current = false;
    };

    const columns: any[] = [
        {
            accessor: 'order',
            title: 'ลำดับที่',
            sortable: true,
            render: ({ order }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{order}</div>
                </Fragment>
            )
        },
        {
            accessor: 'referredName',
            title: 'ผู้ถูกแนะนำ',
            sortable: false,
            render: ({ referredName, referredUserId }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{referredName || '-'}</div>
                    <div className='text-gray-500'>รหัสผู้ใช้งาน: {referredUserId}</div>
                </Fragment>
            )
        },
        {
            accessor: 'referrerName',
            title: 'แนะนำโดย',
            sortable: false,
            render: ({ referrerName, referrerUserId }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{referrerName || '-'}</div>
                    <div className='text-gray-500'>รหัส: {referrerUserId}</div>
                </Fragment>
            )
        },
        {
            accessor: 'registeredAt',
            title: 'วันที่แนะนำ',
            sortable: true,
            render: ({ registeredAt }: any) => {
                const date = new Date(registeredAt);
                return (
                    <Fragment>
                        <div className='text-meelike-dark'>{date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div className='text-gray-500'>{date.toLocaleTimeString('th-TH')}</div>
                    </Fragment>
                );
            }
        },
        {
            accessor: 'totalConfirmed',
            title: <div className='text-end'>ยอดที่จ่ายแล้ว (Confirmed)</div>,
            sortable: true,
            render: ({ totalConfirmed }: any) => <div className='text-end text-meelike-dark'>{totalConfirmed.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</div>
        },
        {
            accessor: 'totalPending',
            title: <div className='text-end'>ยอดที่รอการจ่าย (Deferred Income)</div>,
            sortable: true,
            render: ({ totalPending }: any) => <div className='text-end text-meelike-dark'>{totalPending.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</div>
        }
    ];

    useEffect(() => {
        setupPage();
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, pageSize, filterState]);

    useEffect(() => {
        return () => {
            clearState();
        };
    }, []);

    return {
        isLoading,
        PAGE_SIZES,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalData,
        data,
        columns,
        filterState,
        onChangeFilterState
    };
};

export default ViewModel;
