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
            rawData: state.overview,
            getAll: state.getOverview,
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
            accessor: 'affiliate',
            title: 'ผู้ใช้้งาน',
            sortable: false,
            render: ({ affiliateName, affiliateEmail, userId }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{affiliateName || '-'}</div>
                    <div className='text-gray-500'>รหัสผู้ใช้งาน: {userId}</div>
                    <div className='text-gray-500'>อีเมล: {userId}</div>
                </Fragment>
            )
        },
        {
            accessor: 'affiliateStatus',
            title: 'สถานะ',
            sortable: false,
            render: ({ affiliateStatus }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{affiliateStatus || '-'}</div>
                </Fragment>
            )
        },
        {
            accessor: 'visits',
            title: 'Visits',
            sortable: true,
            render: ({ visits }: any) => {
                return (
                    <Fragment>
                        <div className='text-meelike-dark'>
                            {(visits ?? 0).toLocaleString('th-TH', {
                                maximumFractionDigits: 0
                            })}
                        </div>
                    </Fragment>
                );
            }
        },
        {
            accessor: 'registrations',
            title: 'Registrations',
            sortable: true,
            render: ({ registrations }: any) => {
                return (
                    <Fragment>
                        <div className='text-meelike-dark'>
                            {(registrations ?? 0).toLocaleString('th-TH', {
                                maximumFractionDigits: 0
                            })}
                        </div>
                    </Fragment>
                );
            }
        },
        {
            accessor: 'referrals',
            title: 'Referrals',
            sortable: true,
            render: ({ referrals }: any) => {
                return (
                    <Fragment>
                        <div className='text-meelike-dark'>
                            {(referrals ?? 0).toLocaleString('th-TH', {
                                maximumFractionDigits: 0
                            })}
                        </div>
                    </Fragment>
                );
            }
        },
        {
            accessor: 'conversionRate',
            title: <div className='text-end'>Conversion Rate (%)</div>,
            sortable: true,
            render: ({ conversionRate }: any) => {
                return (
                    <Fragment>
                        <div className='text-end text-meelike-dark'>
                            {(conversionRate ?? 0).toLocaleString('th-TH', {
                                mimumumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </div>
                    </Fragment>
                );
            }
        },
        {
            accessor: 'totalEarnings',
            title: <div className='text-end'>ยอดที่จ่ายแล้ว (Confirmed)</div>,
            sortable: true,
            render: ({ totalEarnings }: any) => {
                return (
                    <Fragment>
                        <div className='text-end text-meelike-dark'>
                            ฿
                            {(totalEarnings ?? 0).toLocaleString('th-TH', {
                                mimumumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </div>
                    </Fragment>
                );
            }
        },
        {
            accessor: 'availableEarnings',
            title: <div className='text-end'>ยอดที่รอการจ่าย (Deferred Income)</div>,
            sortable: true,
            render: ({ availableEarnings }: any) => {
                return (
                    <Fragment>
                        <div className='text-end text-meelike-dark'>
                            ฿
                            {(availableEarnings ?? 0).toLocaleString('th-TH', {
                                mimumumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </div>
                    </Fragment>
                );
            }
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
