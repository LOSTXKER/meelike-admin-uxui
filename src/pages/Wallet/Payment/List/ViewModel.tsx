import { useEffect, useState, useRef, Fragment } from 'react';
import { useThemeStore } from '@/store/theme';
import { useWalletStore } from '@/store/wallet';
import { useUsersStore } from '@/store/users';
import { useShallow } from 'zustand/react/shallow';
import { DataTableSortStatus } from 'mantine-datatable';
import IconTrueMoney from '@/components/Icon/IconTrueMoney';
import IconVisaMastercard from '@/components/Icon/IconVisaMastercard';
import IconPromptpay from '@/components/Icon/IconPromptpay';
import moment from 'moment';
import 'moment-timezone';
import Decimal from 'decimal.js';
import IconChecks from '@/components/Icon/IconChecks';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import IconCloudDownload from '@/components/Icon/IconCloudDownload';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconSend from '@/components/Icon/IconSend';
import IconPaySolutions from '@/components/Icon/IconPaySolutions';

const PAGE_SIZES = [10, 20, 30, 50, 100];

const INITIAL_FILTER_STATE = {
    sortStatus: {
        columnAccessor: 'createdAt',
        direction: 'desc'
    } as DataTableSortStatus,
    startDate: moment().tz('Asia/Bangkok').subtract(3, 'months').toDate(),
    endDate: moment().tz('Asia/Bangkok').toDate(),
    dateRanges: [moment().tz('Asia/Bangkok').subtract(3, 'months').toDate(), moment().tz('Asia/Bangkok').toDate()],
    search: '',
    userId: '',
    status: '',
    isSendToEtax: undefined,
    isSendETaxFailed: undefined
};

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            rtlClass: state.rtlClass,
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );
    const { getAll, totalData, data, completePayment, downloadTaxInvoice, clearState } = useWalletStore(
        useShallow(state => ({
            totalData: state.totalFundHistories,
            data: state.fundHistories,
            getAll: state.getAllFundHistories,
            completePayment: state.completetPayment,
            downloadTaxInvoice: state.downloadTaxInvoice,
            clearState: state.clearState
        }))
    );
    const { users, getAllUsers } = useUsersStore(
        useShallow(state => ({
            users: state.allData,
            getAllUsers: state.getAllData
        }))
    );

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isFetchData = useRef<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const filterDateRef = useRef<any>(null);

    const [isOpenForm, setIsOpenForm] = useState(false);

    const [isOpenResendToEtax, setIsOpenResendToEtax] = useState(false);
    const [resendToEtaxData, setResendToEtaxData] = useState<any>({});

    const userOptions = users.map(user => ({
        label: `${user?.name} (${user?.email})`,
        value: user.id
    }));

    const statusOptions = [
        { label: 'Success', value: 'SUCCESS' },
        { label: 'Pending', value: 'PENDING' }
    ];

    const isSendToEtaxOptions = [
        { label: 'ใช่', value: true },
        { label: 'ไม่', value: false }
    ];

    const isSendETaxFailedOptions = [
        { label: 'ล้มเหลว', value: true },
        { label: 'สำเร็จ', value: false }
    ];

    const abortControllerRef = useRef<AbortController | null>(null);

    const setupPage = () => {
        setAppName('ประวัติการเติมเงิน');
        setPageTitle(`ประวัติการเติมเงิน | MeeLike Admin`);
    };

    const fetchMasterData = () => {
        getAllUsers();
    };

    const fetchData = () => {
        if (filterState.dateRanges?.length !== 2) return;
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        isFetchData.current = true;
        setIsLoading(true);
        getAll({
            page,
            limit: pageSize,
            search: filterState.search !== '' ? filterState.search : undefined,
            userId: filterState.userId && filterState.userId !== '' ? filterState.userId : undefined,
            sortBy: filterState.sortStatus.columnAccessor,
            order: filterState.sortStatus.direction.toUpperCase(),
            status: filterState.status && filterState.status !== '' ? filterState.status : undefined,
            isSendToEtax: filterState.isSendToEtax !== undefined ? filterState.isSendToEtax : undefined,
            isSendETaxFailed: filterState.isSendETaxFailed !== undefined ? filterState.isSendETaxFailed : undefined,
            startDate: moment(filterState.dateRanges?.[0]).tz('Asia/Bangkok').format('YYYY-MM-DD'),
            endDate: moment(filterState.dateRanges?.[1]).tz('Asia/Bangkok').format('YYYY-MM-DD'),
            signal: abortControllerRef.current?.signal
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

        setTimeout(() => {
            fetchData();
        }, 500);
    };

    const onChangeFilterState = (key: string, value: any) => {
        setPage(1);
        isFetchData.current = false;

        if (key === 'isSendETaxFailed' && value !== undefined && value !== null) {
            setFilterState(prev => ({
                ...prev,
                [key]: value,
                isSendToEtax: true as any
            }));
            return;
        } else if (key === ' isSendToEtax' && (value === false || value === undefined || value === null)) {
            setFilterState(prev => ({
                ...prev,
                [key]: value,
                isSendETaxFailed: undefined as any
            }));
            return;
        }

        setFilterState(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const onCreate = () => {
        setIsOpenForm(true);
    };

    const onCloseForm = () => {
        setIsOpenForm(false);
    };

    const onSubmitFilter = () => {
        setPage(1);
        isFetchData.current = false;
        fetchData();
    };

    const onDownloadTaxInvoiceAll = () => {
        const isHasSomePending = data.some(item => item.status === 'PENDING');
        if (isHasSomePending) {
            Swal.fire({
                title: 'ไม่สามารถดาวน์โหลดได้',
                text: 'สามารถดาวน์โหลดได้เฉพาะรายการที่มีสถานะเป็น "สำเร็จ" เท่านั้น',
                icon: 'warning'
            });
            return;
        } else {
            withReactContent(Swal).mixin({}).fire({
                icon: 'info',
                title: 'กำลังดาวน์โหลด...',
                showConfirmButton: false
            });
        }
    };

    const generatePaymentMethodLabel = (paymentMethod: string) => {
        switch (paymentMethod.toLowerCase()) {
            case 'truemoney':
                return 'TrueMoney';
            case 'credit_card':
                return 'Credit Card / Debit Card';
            case 'promptpay':
                return 'PromptPay';
            case 'paysolutions':
                return 'PaySolutions';
            case 'bonus':
                return 'Bonus';
            default:
                return '-';
        }
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

    const onCompletePayment = async (id: string) => {
        withReactContent(Swal)
            .fire({
                title: 'ยืนยันการเติมเงิน',
                text: 'คุณต้องการยืนยันการเติมเงินนี้หรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            })
            .then(async result => {
                if (result.isConfirmed) {
                    setIsSubmitting(true);
                    completePayment(id)
                        .then(response => {
                            if (response.success) {
                                Swal.fire({
                                    title: 'สำเร็จ',
                                    text: 'ยืนยันการเติมเงินเรียบร้อยแล้ว',
                                    icon: 'success',
                                    confirmButtonText: 'ปิด'
                                });
                                handleAfterSubmit();
                            } else {
                                Swal.fire({
                                    title: 'เกิดข้อผิดพลาด',
                                    text: response.data?.message || 'ไม่สามารถยืนยันการเติมเงินได้',
                                    icon: 'error',
                                    confirmButtonText: 'ปิด'
                                });
                            }
                        })
                        .catch(error => {
                            Swal.fire({
                                title: 'เกิดข้อผิดพลาด',
                                text: error?.response?.data?.message || 'ไม่สามารถยืนยันการเติมเงินได้',
                                icon: 'error',
                                confirmButtonText: 'ปิด'
                            });
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onDownloadTaxInvoice = (id: string) => {
        const toast = withReactContent(Swal).mixin({
            title: 'กำลังดาวน์โหลดใบกำกับภาษี...',
            showConfirmButton: false,
            timer: 2000
        });
        toast.fire();

        downloadTaxInvoice(id).then(response => {
            if (!response.success) {
                withReactContent(Swal).fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: response.data?.message || 'ไม่สามารถดาวน์โหลดใบกำกับภาษีได้',
                    confirmButtonText: 'ปิด',
                    allowOutsideClick: false
                });
            }
        });
    };

    const onResendToEtax = (id: string) => {
        const transaction = data.find(item => item.id === id);
        setIsOpenResendToEtax(true);
        setResendToEtaxData(transaction);
    };

    const onCloseResendToEtax = () => {
        setIsOpenResendToEtax(false);
        setResendToEtaxData({});
    };

    const onAfterResendToEtax = () => {
        onCloseResendToEtax();
        isFetchData.current = false;
        fetchData();
    };

    const columns: any[] = [
        {
            accessor: 'id',
            title: 'ID',
            sortable: true,
            render: ({ id }: any) => (
                <Fragment>
                    <div className=''>{id}</div>
                </Fragment>
            )
        },
        {
            accessor: 'fundCode',
            title: 'Code',
            sortable: false,
            render: ({ fundCode }: any) => (
                <Fragment>
                    <div className=''>{fundCode}</div>
                </Fragment>
            )
        },
        {
            accessor: 'createdAt',
            title: 'วันที่ทำรายการ',
            sortable: true,
            render: ({ createdAt }: any) => (
                <Fragment>
                    <div className=''>{moment(createdAt).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm:ss')}</div>
                </Fragment>
            )
        },
        {
            accessor: 'userId',
            title: 'ผู้ใช้',
            sortable: false,
            render: ({ user }: any) => (
                <Fragment>
                    <div className='font-semibold'>{user?.name || '-'}</div>
                    <div className='font-normal'>{user?.email || '-'}</div>
                </Fragment>
            )
        },
        {
            accessor: 'balanceBefore',
            title: 'ยอดก่อนเติม',
            sortable: true,
            render: ({ balanceBefore }: any) => (
                <Fragment>
                    <div className=''>
                        ฿
                        {new Decimal(balanceBefore ?? '0.00').toNumber().toLocaleString('th-TH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'balanceAfter',
            title: 'ยอดหลังเติม',
            sortable: true,
            render: ({ balanceAfter }: any) => (
                <Fragment>
                    <div className=''>
                        ฿
                        {new Decimal(balanceAfter ?? '0.00').toNumber().toLocaleString('th-TH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'amount',
            title: 'จำนวนเงินที่เติม',
            sortable: true,
            render: ({ amount }: any) => (
                <Fragment>
                    <div className=''>
                        ฿
                        {new Decimal(amount).toNumber().toLocaleString('th-TH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'method',
            title: 'วิธีการเติมเงิน',
            render: ({ method }: any) => (
                <Fragment>
                    <div className='flex flex-row gap-3 items-center'>
                        {generateIcon(method)}
                        <div className='text-meelike-dark whitespace-normal'>{generatePaymentMethodLabel(method)}</div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'mode',
            title: 'Mode'
        },
        {
            accessor: 'memo',
            title: 'Memo'
        },
        {
            accessor: 'status',
            title: 'สถานะการชำระเงิน',
            sortable: false,
            render: ({ status }: any) => {
                let label = '';
                let className = '';
                switch (status) {
                    case 'SUCCESS': {
                        label = 'Success';
                        className = 'text-green-500 border-green-500 bg-green-50';
                        break;
                    }
                    case 'PENDING': {
                        label = 'Pending';
                        className = 'text-yellow-500 border-yellow-500 bg-yellow-50';
                        break;
                    }
                    case 'FAIL': {
                        label = 'Fail';
                        className = 'text-red-500 border-red-500 bg-red-50';
                        break;
                    }
                }

                return (
                    <Fragment>
                        <div className={`inline-block px-3 py-1 text-xs font-medium rounded-xl border ${className}`}>{label}</div>
                    </Fragment>
                );
            }
        },
        {
            accessor: 'isSendToEtax',
            title: 'ส่งข้อมูลไปยัง e-Tax',
            sortable: false,
            render: ({ isSendToEtax }: any) => (
                <Fragment>
                    <div className='flex items-center justify-center'>
                        <input type='checkbox' className='form-checkbox cursor-not-allowed opacity-50' checked={isSendToEtax} />
                        {/* <span className='ml-2'>{isSendToEtax ? 'ใช่' : 'ไม่'}</span> */}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'isSendETaxFailed',
            title: 'สถานะการส่ง e-Tax',
            sortable: false,
            render: ({ isSendETaxFailed, isSendToEtax, status }: any) => (
                <div className='text-center'>
                    {isSendToEtax && status === 'SUCCESS' ? (
                        <div className='flex items-center justify-center'>
                            {isSendETaxFailed ? (
                                <div className={`inline-block px-3 py-1 text-xs font-medium rounded-xl border text-red-500 border-red-500 bg-red-50`}>ล้มเหลว</div>
                            ) : (
                                <div className={`inline-block px-3 py-1 text-xs font-medium rounded-xl border text-green-500 border-green-500 bg-green-50`}>สำเร็จ</div>
                            )}
                        </div>
                    ) : (
                        '-'
                    )}
                </div>
            )
        },
        {
            accessor: 'actions',
            title: '',
            sortable: false,
            render: ({ id, status, canDownloadTaxInvoice, isSendToEtax, isSendETaxFailed }: any) => (
                <div className='flex items-center gap-2'>
                    <div className='dropdown'>
                        <Dropdown
                            placement={'bottom-end'}
                            btnClassName='btn btn-primary btn-sm'
                            button={
                                <Fragment>
                                    <span>
                                        <IconCaretDown className='inline-block' />
                                    </span>
                                </Fragment>
                            }
                            buttonDisabled={isSubmitting}
                        >
                            <ul>
                                {status === 'PENDING' && (
                                    <li>
                                        <button type='button' className='font-semibold text-left' onClick={() => onCompletePayment(id)} disabled={isSubmitting}>
                                            <IconChecks className='w-4.5 h-4.5' /> ยืนยันการเติมเงิน
                                        </button>
                                    </li>
                                )}
                                {status === 'SUCCESS' && canDownloadTaxInvoice && (
                                    <li>
                                        <button type='button' className='font-semibold text-left' onClick={() => onDownloadTaxInvoice(id)}>
                                            <IconCloudDownload className='mr-2 text-[#00AB55] inline w-4 h-4 ' />
                                            <span className='hidden md:inline'>ดาวน์โหลดใบเสร็จรับเงิน/ใบกำกับภาษี</span>
                                        </button>
                                    </li>
                                )}
                                {status === 'SUCCESS' && isSendToEtax === true && isSendETaxFailed === true && (
                                    <li>
                                        <button
                                            type='button'
                                            className='font-semibold text-left'
                                            onClick={() => {
                                                onResendToEtax(id);
                                            }}
                                        >
                                            <IconSend className='mr-2 text-blue-500 inline w-4 h-4 ' />
                                            <span>ส่งใหม่ไป e-Tax</span>
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </Dropdown>
                    </div>
                </div>
            )
        }
    ];

    useEffect(() => {
        setupPage();
    }, []);

    useEffect(() => {
        fetchMasterData();
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
        userOptions,
        statusOptions,
        isSendToEtaxOptions,
        isSendETaxFailedOptions,
        isSubmitting,
        page,
        setPage,
        pageSize,
        setPageSize,
        selectedRecords,
        setSelectedRecords,
        filterDateRef,
        filterState,
        onChangeFilterState,
        PAGE_SIZES,
        totalData,
        data,
        columns,
        isOpenForm,
        isOpenResendToEtax,
        resendToEtaxData,
        onCreate,
        onCloseForm,
        handleAfterSubmit,
        onSubmitFilter,
        onDownloadTaxInvoiceAll,
        onCloseResendToEtax,
        onAfterResendToEtax
    };
};

export default ViewModel;
