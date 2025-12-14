import { useEffect, useState, useRef, Fragment } from 'react';
import { useThemeStore } from '@/store/theme';
import { useProviderStore } from '@/store/provider';
import { useProfileStore } from '@/store/profile';
import { useShallow } from 'zustand/react/shallow';
import { DataTableSortStatus } from 'mantine-datatable';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import IconEdit from '@/components/Icon/IconEdit';
import IconTrashLines from '@/components/Icon/IconTrashLines';

import { clsx } from '@mantine/core';

const PAGE_SIZES = [10, 20, 30, 50, 100];

const INITIAL_FILTER_STATE = {
    sortStatus: {
        columnAccessor: 'id',
        direction: 'desc'
    } as DataTableSortStatus,
    search: ''
};

// Mock data for demonstration
const MOCK_PROVIDERS = [
    {
        id: '1',
        aliasName: 'SMM Panel Pro',
        providerCode: 'SMMPRO',
        name: 'SMM Panel Pro API',
        balance: {
            balance: 15420.50,
            currency: 'USD'
        },
        isLowBalanceAlert: false,
        lowBalanceThreshold: 1000,
        apiUrl: 'https://api.smmpanelpro.com/v2'
    },
    {
        id: '2',
        aliasName: 'Social Boost',
        providerCode: 'SOCBOOST',
        name: 'Social Boost Services',
        balance: {
            balance: 450.25,
            currency: 'USD'
        },
        isLowBalanceAlert: true,
        lowBalanceThreshold: 1000,
        apiUrl: 'https://socialboost.io/api'
    },
    {
        id: '3',
        aliasName: 'Mega SMM',
        providerCode: 'MEGASMM',
        name: 'Mega SMM Provider',
        balance: {
            balance: 8750.00,
            currency: 'USD'
        },
        isLowBalanceAlert: false,
        lowBalanceThreshold: 500,
        apiUrl: 'https://megasmm.com/api/v1'
    },
    {
        id: '4',
        aliasName: 'Quick Panel',
        providerCode: 'QUICKPNL',
        name: 'Quick Panel Services',
        balance: {
            balance: 3200.75,
            currency: 'USD'
        },
        isLowBalanceAlert: false,
        lowBalanceThreshold: 1000,
        apiUrl: 'https://quickpanel.net/api'
    },
    {
        id: '5',
        aliasName: 'Elite SMM',
        providerCode: 'ELITESMM',
        name: 'Elite SMM Solutions',
        balance: {
            balance: 12500.00,
            currency: 'USD'
        },
        isLowBalanceAlert: false,
        lowBalanceThreshold: 2000,
        apiUrl: 'https://elitesmm.com/api/v2'
    }
];

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            rtlClass: state.rtlClass,
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );
    const {
        getAll,
        totalData,
        data,
        delete: deleteProvider,
        clearState
    } = useProviderStore(
        useShallow(state => ({
            totalData: state.totalData,
            data: state.data,
            getAll: state.getAll,
            delete: state.delete,
            clearState: state.clearState
        }))
    );

    const [isLoading, setIsLoading] = useState(true);
    const isFetchData = useRef<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [useMockData, setUseMockData] = useState(false);

    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [selectedId, setSelectedId] = useState<string>('');
    const [isOpenForm, setIsOpenForm] = useState(false);

    const setupPage = () => {
        setAppName('จัดการผู้ให้บริการ');
        setPageTitle(`จัดการผู้ให้บริการ | MeeLike Admin`);
    };

    const fetchData = () => {
        if (isFetchData.current) return;

        isFetchData.current = true;
        setIsLoading(true);
        getAll({
            page,
            limit: pageSize,
            search: filterState.search,
            sortBy: filterState.sortStatus.columnAccessor,
            order: filterState.sortStatus.direction.toUpperCase()
        }).then((response) => {
            // Use mock data if API returns empty or fails
            if (!response.success || !response.data || response.data.length === 0) {
                setUseMockData(true);
            }
        }).finally(() => {
            setIsLoading(false);
            isFetchData.current = false;
        });
    };

    const handleAfterSubmit = () => {
        setPage(1);
        setPageSize(PAGE_SIZES[0]);
        setFilterState(INITIAL_FILTER_STATE);
        setIsSubmitting(false);
        isFetchData.current = false;

        fetchData();
    };

    const onChangeFilterState = (key: string, value: any) => {
        setFilterState(prev => ({
            ...prev,
            [key]: value
        }));
        setPage(1);
        isFetchData.current = false;
    };

    const onCreate = () => {
        setFormType('create');
        setSelectedId('');
        setIsOpenForm(true);
    };

    const onEdit = (id: string) => {
        setFormType('edit');
        setSelectedId(id);
        setIsOpenForm(true);
    };

    const onDelete = (id: string) => {
        withReactContent(Swal)
            .fire({
                icon: 'warning',
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center'>คุณต้องการยืนยันการลบหรือไม่?</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonColor: '#dc2626',
                customClass: {
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-red-500 text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false
            })
            .then(({ isConfirmed }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);

                    // Show loading popup with cancel button
                    withReactContent(Swal).fire({
                        title: 'กำลังลบข้อมูล...',
                        html: 'กรุณารอสักครู่',
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: 'ยกเลิก',
                        allowOutsideClick: false,
                        customClass: {
                            cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none'
                        },
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    deleteProvider(id)
                        .then(response => {
                            Swal.close();

                            if (response.success) {
                                withReactContent(Swal).fire({
                                    icon: 'success',
                                    title: response?.data?.message ?? 'ลบสำเร็จ',
                                    showConfirmButton: false,
                                    timer: 1500,
                                    padding: '2em',
                                    customClass: {
                                        cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                        confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                                    },
                                    allowOutsideClick: false
                                });
                                isFetchData.current = false;
                                fetchData();
                            } else {
                                withReactContent(Swal).fire({
                                    icon: 'error',
                                    title: response?.data?.message ?? 'ลบไม่สำเร็จ',
                                    showConfirmButton: true,
                                    padding: '2em',
                                    customClass: {
                                        cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                        confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                                    },
                                    confirmButtonText: 'ปิด',
                                    allowOutsideClick: false
                                });
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onCloseForm = () => {
        setIsOpenForm(false);
        setTimeout(() => {
            setSelectedId('');
            setFormType('create');
        }, 500);
    };

    const onSubmitFilter = () => {
        setPage(1);
        isFetchData.current = false;
        fetchData();
    };

    const columns: any[] = [
        {
            accessor: 'id',
            title: 'No.',
            sortable: true,
            render: ({ id }: any) => (
                <Fragment>
                    <div className=''>{id}</div>
                </Fragment>
            )
        },
        {
            accessor: 'aliasName',
            title: 'ชื่อเล่น',
            sortable: true,
            render: ({ aliasName }: any) => (
                <Fragment>
                    <div className=''>{aliasName}</div>
                </Fragment>
            )
        },
        {
            accessor: 'providerCode',
            title: 'รหัสผู้ให้บริการ',
            sortable: true,
            render: ({ providerCode }: any) => (
                <Fragment>
                    <div className=''>{providerCode}</div>
                </Fragment>
            )
        },
        {
            accessor: 'name',
            title: 'ชื่อผู้ให้บริการ',
            sortable: true,
            render: ({ name }: any) => (
                <Fragment>
                    <div className=''>{name}</div>
                </Fragment>
            )
        },
        {
            accessor: 'balance',
            title: 'ยอดเงินคงเหลือ',
            sortable: false,
            render: ({ balance }: any) => (
                <Fragment>
                    <div className=''>
                        {balance?.balance} {balance?.currency}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'isLowBalanceAlert',
            title: 'แจ้งเตือนยอดเงินต่ำ',
            sortable: false,
            render: ({ isLowBalanceAlert, lowBalanceThreshold, balance }: any) => (
                <Fragment>
                    <div className=''>{isLowBalanceAlert ? `ใช่ (${lowBalanceThreshold} ${balance?.currency})` : 'ไม่'}</div>
                </Fragment>
            )
        },
        {
            accessor: 'actions',
            title: '',
            sortable: false,
            render: ({ id }: any) => (
                <div className='flex gap-4 items-center w-max mx-auto'>
                    <button
                        type='button'
                        className={clsx('flex text-clink-secondary hover:bg-gray-200 p-1 rounded', {
                            'opacity-50 cursor-not-allowed': isSubmitting
                        })}
                        onClick={() => onEdit(id)}
                        disabled={isSubmitting}
                    >
                        <IconEdit className='w-4.5 h-4.5' />
                    </button>
                    <button
                        type='button'
                        className={clsx('flex text-clink-danger hover:bg-gray-200 p-1 rounded', {
                            'opacity-50 cursor-not-allowed': isSubmitting
                        })}
                        onClick={() => onDelete(id)}
                        disabled={isSubmitting}
                    >
                        <IconTrashLines />
                    </button>
                </div>
            )
        }
    ];

    useEffect(() => {
        setupPage();
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, pageSize]);

    useEffect(() => {
        return () => {
            clearState();
        };
    }, []);

    return {
        isLoading,
        isSubmitting,
        page,
        setPage,
        pageSize,
        setPageSize,
        filterState,
        onChangeFilterState,
        PAGE_SIZES,
        totalData: useMockData ? MOCK_PROVIDERS.length : totalData,
        data: useMockData ? MOCK_PROVIDERS : data,
        columns,
        formType,
        selectedId,
        isOpenForm,
        onCreate,
        onCloseForm,
        handleAfterSubmit,
        onSubmitFilter
    };
};

export default ViewModel;
