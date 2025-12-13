import { useEffect, useState, useRef, Fragment, useMemo } from 'react';
import { useThemeStore } from '@/store/theme';
import { useTopupBonusConfigStore } from '@/store/topup-bonus-config';
import { useShallow } from 'zustand/react/shallow';
import { DataTableSortStatus } from 'mantine-datatable';
import IconTrueMoney from '@/components/Icon/IconTrueMoney';
import IconVisaMastercard from '@/components/Icon/IconVisaMastercard';
import IconPromptpay from '@/components/Icon/IconPromptpay';
import IconPaySolutions from '@/components/Icon/IconPaySolutions';
import IconEdit from '@/components/Icon/IconEdit';
import moment from 'moment';
import 'moment-timezone';
import Decimal from 'decimal.js';
import Tippy from '@tippyjs/react';
import IconChecks from '@/components/Icon/IconChecks';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { sortBy } from 'lodash';

const PAGE_SIZES = [10, 20, 30, 50, 100];

const INITIAL_FILTER_STATE = {
    sortStatus: {
        columnAccessor: 'updatedAt',
        direction: 'desc'
    } as DataTableSortStatus
};

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            rtlClass: state.rtlClass,
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );
    const { getAll, getOne, rawData, clearState } = useTopupBonusConfigStore(
        useShallow(state => ({
            rawData: state.data,
            getAll: state.getAll,
            getOne: state.getOne,
            clearState: state.clearState
        }))
    );

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isFetchData = useRef<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isOpenForm, setIsOpenForm] = useState(false);

    const totalData = rawData.length;
    const data = useMemo(() => {
        let sortedData = sortBy(rawData, filterState.sortStatus.columnAccessor);
        if (filterState.sortStatus.direction === 'desc') {
            sortedData = sortedData.reverse();
        }
        return sortedData.slice((page - 1) * pageSize, page * pageSize);
    }, [rawData, filterState.sortStatus, page, pageSize]);

    const setupPage = () => {
        setAppName('ตั้งค่าโบนัสเติมเงิน');
        setPageTitle(`ตั้งค่าโบนัสเติมเงิน | MeeLike Admin`);
    };

    const fetchData = () => {
        if (isFetchData.current) return;

        isFetchData.current = true;
        setIsLoading(true);
        getAll().finally(() => {
            setIsLoading(false);
            isFetchData.current = false;
        });
    };

    const handleAfterSubmit = () => {
        setPage(1);
        setPageSize(PAGE_SIZES[0]);
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

    const onCloseForm = () => {
        setIsOpenForm(false);
    };

    const generateIcon = (paymentMethod: string) => {
        switch (paymentMethod.toLowerCase()) {
            case 'truemoney':
                return <IconTrueMoney className='w-10 h-6' />;
            case 'credit_card':
                return <IconVisaMastercard className='w-10 h-6' />;
            case 'promptpay':
                return <IconPromptpay className='w-10 h-8' />;
            case 'paysolutions':
                return <IconPaySolutions className='w-10 h-6' />;
            default:
                return null;
        }
    };

    const onEdit = (id: string) => {
        withReactContent(Swal).mixin({
            title: 'กำลังโหลดข้อมูล...',
            icon: 'info'
        });

        getOne(id).then(response => {
            if (response.success) {
                setIsOpenForm(true);
            } else {
                withReactContent(Swal).fire({
                    title: 'ไม่สามารถโหลดข้อมูลได้',
                    text: response.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
                    icon: 'error'
                });
            }
        });
    };

    const columns: any[] = [
        {
            accessor: 'paymentMethod',
            title: 'วิธีการชำระเงิน',
            render: ({ paymentMethod, paymentMethodTitle }: any) => (
                <Fragment>
                    <div className='flex flex-row gap-3 items-center'>
                        {generateIcon(paymentMethod)}
                        <div className='text-meelike-dark whitespace-normal'>{paymentMethodTitle}</div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'bonusPercentage',
            title: <div className='text-end'>เปอร์เซ็นต์โบนัส (%)</div>,
            sortable: true,
            render: ({ bonusPercentage }: any) => (
                <Fragment>
                    <div className='text-end'>
                        {new Decimal(bonusPercentage).toNumber().toLocaleString('th-TH', {
                            minimumFractionDigits: 2
                        })}{' '}
                        %
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'from',
            title: <div className='text-end'>ให้โบนัสตั้งแต่</div>,
            sortable: true,
            render: ({ from }: any) => (
                <Fragment>
                    <div className='text-end'>
                        ฿
                        {new Decimal(from).toNumber().toLocaleString('th-TH', {
                            minimumFractionDigits: 2
                        })}{' '}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'createdAt',
            title: 'วันที่สร้าง',
            sortable: true,
            render: ({ createdAt }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{moment(createdAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</div>
                </Fragment>
            )
        },
        {
            accessor: 'updatedAt',
            title: 'วันที่แก้ไขล่าสุด',
            sortable: true,
            render: ({ updatedAt }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{moment(updatedAt).tz('Asia/Bangkok').format('DD/MM/YYYY')}</div>
                </Fragment>
            )
        },
        {
            accessor: 'status',
            title: 'สถานะ',
            sortable: false,
            render: ({ enabled }: any) => (
                <Fragment>
                    <div
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-xl border ${enabled ? 'text-green-500 border-green-500 bg-green-50' : 'text-red-500 border-red-500 bg-red-50'}`}
                    >
                        {enabled ? 'Active' : 'Inactive'}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'actions',
            title: '',
            sortable: false,
            render: ({ id }: any) => (
                <Fragment>
                    <div className='flex gap-4 items-center w-max mx-auto'>
                        <button type='button' className='flex text-clink-secondary hover:bg-gray-200 p-1 rounded' onClick={() => onEdit(id)} disabled={isSubmitting}>
                            <IconEdit className='w-4.5 h-4.5' />
                        </button>
                    </div>
                </Fragment>
            )
        }
    ];

    useEffect(() => {
        setupPage();
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

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
        PAGE_SIZES,
        data,
        totalData,
        columns,
        isOpenForm,
        filterState,
        onCloseForm,
        onChangeFilterState,
        handleAfterSubmit
    };
};

export default ViewModel;
