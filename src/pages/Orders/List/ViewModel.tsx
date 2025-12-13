import { useEffect, useState, useRef, Fragment, useMemo } from 'react';
import { useThemeStore } from '@/store/theme';
import { useOrderStore } from '@/store/order';
import { useProviderStore } from '@/store/provider';
import { useServiceStore } from '@/store/service';
import { useServiceCategoryStore } from '@/store/service-category';
import { useMasterDataStore } from '@/store/master-data';
import { useUsersStore } from '@/store/users';
import { useShallow } from 'zustand/react/shallow';
import { DataTableSortStatus } from 'mantine-datatable';
import moment from 'moment';
import 'moment-timezone';
import { formatAverageTimeSeconds } from '@/Utils/formatAverageTime';
import Status from '../Components/Status';
import IconEye from '@/components/Icon/IconEye';
import IconX from '@/components/Icon/IconX';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
// import { clsx } from '@mantine/core';
// import Tippy from '@tippyjs/react';
import IconCopy from '@/components/Icon/IconCopy';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconMessage from '@/components/Icon/IconMessage';
import IconLink from '@/components/Icon/IconLink';
import IconDocumentPlus from '@/components/Icon/IconDocumentPlus';
import IconKey from '@/components/Icon/IconKey';
import IconBolt from '@/components/Icon/IconBolt';
import IconUser from '@/components/Icon/IconUser';
import { OrderStatus } from '@/Data/order-status';
import { clsx } from '@mantine/core';
import Decimal from 'decimal.js';

const TIMEZONE = 'Asia/Bangkok';

const PAGE_SIZES = [10, 20, 30, 50, 100];

const INITIAL_FILTER_STATE = {
    sortStatus: {
        columnAccessor: 'id',
        direction: 'desc'
    } as DataTableSortStatus,
    startDate: moment().tz(TIMEZONE).subtract(3, 'months').toDate(),
    endDate: moment().tz(TIMEZONE).toDate(),
    dateRanges: [moment().tz(TIMEZONE).subtract(3, 'months').toDate(), moment().tz(TIMEZONE).toDate()],
    search: '',
    platform: [] as any[],
    categoryId: undefined,
    userId: undefined,
    status: [] as any[],
    providerId: undefined,
    serviceId: undefined,
    mode: 'all' as 'all' | 'auto' | 'manual',
    source: undefined,
    showNegativeProfit: false
};

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );
    const {
        data,
        hasNegativeProfit,
        count,
        serviceCategoryStat,
        serviceStat,
        totalData,
        resetGetAllData,
        getAll,
        getHasNegativeProfit,
        getCount,
        getServiceCategoryStat,
        getServiceStat,
        getOne,
        getExternalStatus,
        cancelAndRefund,
        cancelAndRefundMultiple,
        copyOrderToClipboard,
        setStartCount,
        setPartial,
        setManualStatus,
        editTargetUrl,
        resend,
        multipleChangeStatus,
        multipleResend,
        clearState
    } = useOrderStore(
        useShallow(state => ({
            data: state.data,
            hasNegativeProfit: state.hasNegativeProfit,
            count: state.count,
            serviceCategoryStat: state.serviceCateogoryStat,
            serviceStat: state.serviceStat,
            totalData: state.totalData,
            resetGetAllData: state.resetGetAllData,
            getAll: state.getAll,
            getHasNegativeProfit: state.getHasNegativeProfit,
            getCount: state.getCount,
            getServiceCategoryStat: state.getServiceCategoryStat,
            getServiceStat: state.getServiceStat,
            getOne: state.getOne,
            getExternalStatus: state.getExternalStatus,
            cancelAndRefund: state.cancelAndRefund,
            cancelAndRefundMultiple: state.cancelAndRefundMultiple,
            copyOrderToClipboard: state.copyOrderToClipboard,
            setStartCount: state.setStartCount,
            setPartial: state.setPartial,
            setManualStatus: state.setManualStatus,
            editTargetUrl: state.editTargetUrl,
            resend: state.resend,
            multipleChangeStatus: state.multipleChangeStatus,
            multipleResend: state.multipleResend,
            clearState: state.clearState
        }))
    );
    const { serviceCategory, getAllServiceCategory, clearStateServiceCategory } = useServiceCategoryStore(
        useShallow(state => ({
            serviceCategory: state.data,
            getAllServiceCategory: state.getAll,
            clearStateServiceCategory: state.clearState
        }))
    );
    const { orderStatus, orderSources, getOrderStatus, getOrderSources } = useMasterDataStore(
        useShallow(state => ({
            orderStatus: state.orderStatus,
            orderSources: state.orderSources,
            getOrderStatus: state.getOrderStatus,
            getOrderSources: state.getOrderSources
        }))
    );
    const { providers, getProviders, clearStateProvider } = useProviderStore(
        useShallow(state => ({
            providers: state.dataWithoutPagination,
            getProviders: state.getAllWithoutPagination,
            clearStateProvider: state.clearState
        }))
    );
    const { services, getServices, clearStateService } = useServiceStore(
        useShallow(state => ({
            services: state.dataNoRateWihoutPagination,
            getServices: state.getAllNoRateWithoutPagination,
            clearStateService: state.clearState
        }))
    );
    const { users, getAllUsers, clearStateUser } = useUsersStore(
        useShallow(state => ({
            users: state.allData,
            getAllUsers: state.getAllData,
            clearStateUser: state.clearState
        }))
    );

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isFetchData = useRef<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const filterDateRef = useRef<any>(null);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isOpenSetManualStatus, setIsOpenSetManualStatus] = useState(false);
    const [isHideSetManualStatus, setIsHideSetManualStatus] = useState(false);
    const [orderSetStatusType, setOrderSetStatusType] = useState<'single' | 'multiple'>('single');

    // Debounce state for search
    const [debouncedSearch, setDebouncedSearch] = useState(filterState.search);
    const DEBOUNCE_MS = 800;

    const serviceCategoryOptions = serviceCategory.map(item => ({
        label: `(${serviceCategoryStat.find(stat => stat.id === item.id)?.count ?? 0}) ${item.name}`,
        value: item.id
    }));

    const orderStatusOptions = orderStatus.map(item => ({
        ...item,
        count: count[item.value.toLowerCase()] ?? 0
    }));

    const orderSourceOptions = orderSources.map(item => ({
        label: item.label,
        value: item.value
    }));

    const providerOptions: any[] = providers.map(item => ({
        label: item.name,
        value: item.id
    }));

    const serviceOptions: any[] = services.map(item => ({
        label: `(${serviceStat.find(stat => stat.id === item.id)?.count ?? 0}) Service ID: ${item.id} - ${item.name}`,
        value: item.id.toString()
    }));

    const modeOptions = [
        { label: 'ทั้งหมด', value: 'all' },
        { label: 'Auto', value: 'auto' },
        { label: 'Manual', value: 'manual' }
    ];

    const userOptions = users.map(user => ({
        label: `${user?.name} (${user?.email})`,
        value: user.id
    }));

    const doAllSelectedOnlyFAIL = useMemo(() => {
        return selectedRecords.every(record => record.status === OrderStatus.FAIL);
    }, [selectedRecords]);
    const canChangeStatusAll = useMemo(() => {
        return selectedRecords.every(record => {
            return ![OrderStatus.AWAITING, OrderStatus.CANCELED, OrderStatus.FAIL, OrderStatus.ERROR].includes(record.status);
        });
    }, [selectedRecords]);

    const abortControllerRef = useRef<AbortController | null>(null);

    const setupPage = () => {
        setAppName('รายการออร์เดอร์');
        setPageTitle('รายการออร์เดอร์ | MeeLike Admin');
    };

    const fetchMasterData = () => {
        getOrderStatus();
        getOrderSources();
        getAllServiceCategory();
        getProviders();
        getServices();
        getCount();
        getServiceCategoryStat();
        getServiceStat();
        getAllUsers();
    };

    const fetchData = () => {
        if (filterState.dateRanges.length !== 2) return;
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        isFetchData.current = true;
        resetGetAllData();
        setIsLoading(true);
        getHasNegativeProfit({
            search: debouncedSearch, // use debounced value
            categoryId: filterState.categoryId,
            providerId: filterState.providerId,
            serviceId: filterState.serviceId,
            mode: filterState.mode === 'all' ? undefined : filterState.mode,
            status: filterState.status,
            startDate: moment(filterState.dateRanges?.[0]).tz('Asia/Bangkok').format('YYYY-MM-DD'),
            endDate: moment(filterState.dateRanges?.[1]).tz('Asia/Bangkok').format('YYYY-MM-DD'),
            source: filterState.source,
            userId: filterState.userId ? filterState.userId : undefined,
            signal: controller.signal
        });
        getAll({
            page,
            limit: pageSize,
            search: debouncedSearch, // use debounced value
            categoryId: filterState.categoryId,
            providerId: filterState.providerId,
            serviceId: filterState.serviceId,
            mode: filterState.mode === 'all' ? undefined : filterState.mode,
            status: filterState.status,
            sortBy: filterState.sortStatus.columnAccessor,
            order: filterState.sortStatus.direction.toUpperCase(),
            startDate: moment(filterState.dateRanges?.[0]).tz('Asia/Bangkok').format('YYYY-MM-DD'),
            endDate: moment(filterState.dateRanges?.[1]).tz('Asia/Bangkok').format('YYYY-MM-DD'),
            showNegativeProfit: filterState.showNegativeProfit,
            source: filterState.source,
            userId: filterState.userId ? filterState.userId : undefined,
            signal: controller.signal
        }).finally(() => {
            setIsLoading(false);
            isFetchData.current = false;
        });
    };

    const onChangePage = (page: number) => {
        setPage(page);
        isFetchData.current = false;
    };

    const onChangePageSize = (size: number) => {
        setPageSize(size);
        setPage(1);
        isFetchData.current = false;
    };

    const onChangeFilterState = (key: string, value: any) => {
        if (key === 'startDate' || key === 'endDate') {
            if (key === 'startDate') {
                setFilterState(prevState => ({
                    ...prevState,
                    startDate: moment(value)
                        .set({
                            hours: 0,
                            minutes: 0,
                            seconds: 0
                        })
                        .toDate(),
                    endDate: moment(prevState.endDate).isBefore(moment(value)) ? moment(value).toDate() : prevState.endDate
                }));
            } else if (key === 'endDate') {
                setFilterState(prevState => ({
                    ...prevState,
                    endDate: moment(value)
                        .set({
                            hours: 23,
                            minutes: 59,
                            seconds: 59
                        })
                        .toDate()
                }));
            }
        } else if (key === 'platform') {
            const finded = filterState[key].find(item => item === value);
            if (finded) {
                setFilterState(prevState => ({
                    ...prevState,
                    [key]: filterState[key].filter(item => item !== value)
                }));
            } else {
                setFilterState(prevState => ({
                    ...prevState,
                    [key]: [...prevState[key], value]
                }));
            }

            if (value === 'clear') {
                setFilterState(prevState => ({
                    ...prevState,
                    [key]: []
                }));
            }
        } else if (key === 'search') {
            setFilterState(prevState => ({
                ...prevState,
                search: value
            }));
            setPage(1);
            isFetchData.current = false;
            return;
        } else {
            setFilterState(prevState => ({
                ...prevState,
                [key]: value
            }));
        }

        setPage(1);
        isFetchData.current = false;
    };

    const isRecordSelectable = (record: any) => {
        if (filterState.status.length === 1 && filterState.status[0] === OrderStatus.CANCELED) {
            return record.status === OrderStatus.CANCELED;
        }

        const group1 = [OrderStatus.CANCELED, OrderStatus.FAIL, OrderStatus.ERROR];
        const group2 = [OrderStatus.PARTIAL, OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.IN_PROGRESS, OrderStatus.COMPLETED];

        if (selectedRecords.length > 0) {
            if (selectedRecords.some(s => group1.includes(s.status))) {
                return !group2.includes(record.status);
            } else if (selectedRecords.some(s => group2.includes(s.status))) {
                return !group1.includes(record.status);
            } else {
                return true;
            }
        } else {
            return !group1.includes(record.status);
        }
    };

    const onViewDetail = (id: string) => {
        const order = data.find(item => item.id === id);
        if (order.isTextOnlyOrder) {
            Swal.fire({
                icon: 'info',
                title: 'คำสั่งซื้อประเภทข้อความเท่านั้น ไม่มีสถานะภายนอก',
                padding: '10px 20px',
                confirmButtonText: 'ปิด'
            });
            return;
        }

        const toast = withReactContent(
            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            })
        );

        toast.fire({
            icon: 'info',
            title: 'กำลังโหลดข้อมูล...',
            padding: '10px 20px'
        });

        getOne(id).then(response => {
            if (!response.success) {
                toast.fire({
                    icon: 'error',
                    title: response.data?.message || 'Get data failed',
                    padding: '10px 20px'
                });
            } else {
                getExternalStatus(id).finally(() => {
                    setIsOpenDetail(true);
                });
            }
        });
    };

    const onCloseDetail = () => {
        setIsOpenDetail(false);
    };

    const onCancelAndRefund = (id: string) => {
        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center'>คุณต้องการที่จะยกเลิกคำสั่งซื้อนี้ใช่หรือไม่</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                padding: '2em',
                reverseButtons: true,
                customClass: {
                    popup: 'sweet-alerts',
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false
            })
            .then(({ isConfirmed }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);
                    cancelAndRefund(id)
                        .then(response => {
                            if (!response.success) {
                                Swal.fire({
                                    icon: 'error',
                                    title: response.data?.message || 'Get data failed',
                                    padding: '10px 20px'
                                });
                            } else {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'คำสั่งซื้อถูกยกเลิกเรียบร้อยแล้ว',
                                    padding: '10px 20px'
                                });
                                isFetchData.current = false;
                                fetchData();
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const handleCopyOrderCode = (orderCode: string) => {
        navigator.clipboard.writeText(orderCode);
        withReactContent(Swal).fire({
            icon: 'success',
            title: 'รหัสคำสั่งซื้อถูกคัดลอก',
            padding: '2em',
            timer: 1000,
            timerProgressBar: false,
            showConfirmButton: false,
            allowOutsideClick: false
        });
    };

    const onCopyToClipboard = (type: string) => {
        const formData = new FormData();
        formData.append('type', type);
        selectedRecords.forEach(record => {
            formData.append('orderIds', record.id);
        });

        withReactContent(Swal)
            .mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            })
            .fire({
                icon: 'info',
                title: 'กำลังคัดลอกข้อมูล...',
                padding: '10px 20px'
            });
        copyOrderToClipboard(formData).then(response => {
            if (response.success) {
                const copyMessage = response.data?.msg || '';
                navigator.clipboard.writeText(copyMessage);

                withReactContent(Swal)
                    .mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    .fire({
                        icon: 'success',
                        title: 'คัดลอกข้อมูลสำเร็จ',
                        padding: '10px 20px'
                    });
            } else {
                withReactContent(Swal).fire({
                    icon: 'error',
                    title: response.data?.message || 'คัดลอกข้อมูลล้มเหลว',
                    padding: '10px 20px'
                });
            }
        });
    };

    const onCancelAndRefundMultiple = () => {
        if (selectedRecords.length === 0) {
            withReactContent(Swal).fire({
                icon: 'warning',
                title: 'กรุณาเลือกคำสั่งซื้ออย่างน้อย 1 รายการ',
                padding: '10px 20px',
                timer: 2000,
                timerProgressBar: false,
                showConfirmButton: false,
                allowOutsideClick: false
            });
            return;
        }

        for (const record of selectedRecords) {
            if (record.status === 'CANCELED' || record.status === 'FAIL' || record.status === 'ERROR') {
                withReactContent(Swal).fire({
                    icon: 'warning',
                    title: `คำสั่งซื้อ ${record.orderCode} ไม่สามารถยกเลิกได้เนื่องจากสถานะไม่ถูกต้อง`,
                    padding: '10px 20px',
                    timer: 2000,
                    timerProgressBar: false,
                    showConfirmButton: false,
                    allowOutsideClick: false
                });
                return;
            }
        }

        const formData = new FormData();
        selectedRecords.forEach(record => {
            formData.append('orderIds', record.id);
        });

        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center'>คุณต้องการที่จะยกเลิกคำสั่งซื้อที่เลือกทั้งหมดใช่หรือไม่</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                padding: '2em',
                reverseButtons: true,
                customClass: {
                    popup: 'sweet-alerts',
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false
            })
            .then(({ isConfirmed }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);
                    cancelAndRefundMultiple(formData)
                        .then(response => {
                            if (!response.success) {
                                Swal.fire({
                                    icon: 'error',
                                    title: response.data?.message || 'Get data failed',
                                    padding: '10px 20px'
                                });
                            } else {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'คำสั่งซื้อถูกยกเลิกเรียบร้อยแล้ว',
                                    padding: '10px 20px'
                                });
                                isFetchData.current = false;
                                fetchData();
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onResendOrder = (id: string) => {
        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center'>คุณต้องการที่จะส่งคำสั่งซื้อนี้อีกครั้งใช่หรือไม่</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                padding: '2em',
                reverseButtons: true,
                customClass: {
                    popup: 'sweet-alerts',
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false
            })
            .then(({ isConfirmed }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);
                    resend(id)
                        .then(response => {
                            if (!response.success) {
                                Swal.fire({
                                    icon: 'error',
                                    title: response.data?.message || 'Get data failed',
                                    padding: '10px 20px'
                                });
                            } else {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'คำสั่งซื้อถูกส่งเรียบร้อยแล้ว',
                                    padding: '10px 20px'
                                });
                                isFetchData.current = false;
                                fetchData();
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onSetStartCount = (id: string) => {
        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center'>คุณต้องการที่จะตั้งค่า Start Count สำหรับคำสั่งซื้อนี้ใช่หรือไม่</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                padding: '2em',
                reverseButtons: true,
                customClass: {
                    popup: 'sweet-alerts',
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false,
                input: 'text',
                inputPlaceholder: 'กรุณากรอก Start Count',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocorrect: 'off',
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                },
                inputValidator: value => {
                    if (!value || isNaN(Number(value)) || Number(value) < 0) {
                        return 'กรุณากรอก Start Count ที่ถูกต้อง';
                    }
                }
            })
            .then(({ isConfirmed, value }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);
                    const formData = new FormData();
                    formData.append('startCount', value);
                    setStartCount(id, formData)
                        .then(response => {
                            if (!response.success) {
                                Swal.fire({
                                    icon: 'error',
                                    title: response.data?.message || 'Get data failed',
                                    padding: '10px 20px'
                                });
                            } else {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Start Count ถูกตั้งค่าเรียบร้อยแล้ว',
                                    padding: '10px 20px'
                                });
                                isFetchData.current = false;
                                fetchData();
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onSetPartial = (id: string) => {
        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center'>คุณต้องการที่จะตั้งค่า Partial สำหรับคำสั่งซื้อนี้ใช่หรือไม่</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                padding: '2em',
                reverseButtons: true,
                customClass: {
                    popup: 'sweet-alerts',
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false,
                input: 'text',
                inputPlaceholder: 'กรุณากรอกจำนวน Remains',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocorrect: 'off',
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                },
                inputValidator: value => {
                    if (!value || isNaN(Number(value)) || Number(value) < 0) {
                        return 'กรุณากรอกจำนวน Remains ที่ถูกต้อง';
                    }
                }
            })
            .then(({ isConfirmed, value }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);
                    const formData = new FormData();
                    formData.append('remains', value);
                    setPartial(id, formData)
                        .then(response => {
                            if (!response.success) {
                                Swal.fire({
                                    icon: 'error',
                                    title: response.data?.message || 'Get data failed',
                                    padding: '10px 20px'
                                });
                            } else {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Partial ถูกตั้งค่าเรียบร้อยแล้ว',
                                    padding: '10px 20px'
                                });
                                isFetchData.current = false;
                                fetchData();
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onSetManualStatus = (id: string) => {
        setSelectedOrderId(id);
        setIsOpenSetManualStatus(true);
        setOrderSetStatusType('single');
    };

    const onSubmitManualStatus = (status: OrderStatus) => {
        const options = [
            { label: 'Pending', value: OrderStatus.PENDING },
            { label: 'Processing', value: OrderStatus.PROCESSING },
            { label: 'In Progress', value: OrderStatus.IN_PROGRESS },
            { label: 'Completed', value: OrderStatus.COMPLETED }
        ];
        const finded = options.find(item => item.value === status);

        setIsHideSetManualStatus(true);
        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center'>คุณต้องการที่จะตั้งค่าสถานะคำสั่งซื้อนี้เป็น {finded?.label} ใช่หรือไม่</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                padding: '2em',
                reverseButtons: true,
                customClass: {
                    popup: 'sweet-alerts',
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false
            })
            .then(({ isConfirmed }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);
                    const formData = new FormData();
                    formData.append('status', status);
                    setManualStatus(selectedOrderId!, formData)
                        .then(response => {
                            if (!response.success) {
                                Swal.fire({
                                    icon: 'error',
                                    title: response.data?.message || 'Get data failed',
                                    padding: '10px 20px'
                                });
                            } else {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'สถานะคำสั่งซื้อถูกตั้งค่าเรียบร้อยแล้ว',
                                    padding: '10px 20px',
                                    confirmButtonText: 'ปิด'
                                });
                                isFetchData.current = false;
                                fetchData();
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                            onCloseManualStatus();
                        });
                } else {
                    setIsHideSetManualStatus(false);
                }
            });
    };

    const onCloseManualStatus = () => {
        setSelectedOrderId(null);
        setIsOpenSetManualStatus(false);
        setOrderSetStatusType('single');
    };

    const onEditTargetUrl = (id: string) => {
        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center'>คุณต้องการแก้ไข Target URL ของคำสั่งซื้อนี้ใช่หรือไม่</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                padding: '2em',
                reverseButtons: true,
                customClass: {
                    popup: 'sweet-alerts',
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false,
                input: 'text',
                inputPlaceholder: 'กรุณากรอก URL',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocorrect: 'off'
                },
                inputValidator: value => {
                    if (!value) {
                        return 'กรุณากรอก URL ที่ถูกต้อง';
                    }
                }
            })
            .then(({ isConfirmed, value }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);
                    const formData = new FormData();
                    formData.append('targetUrl', value);
                    editTargetUrl(id, formData)
                        .then(response => {
                            if (!response.success) {
                                Swal.fire({
                                    icon: 'error',
                                    title: response.data?.message || 'Get data failed',
                                    padding: '10px 20px'
                                });
                            } else {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Target URL ถูกแก้ไขเรียบร้อยแล้ว',
                                    padding: '10px 20px'
                                });
                                isFetchData.current = false;
                                fetchData();
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onSetManualStatusMultiple = () => {
        if (selectedRecords.length === 0) {
            withReactContent(Swal).fire({
                icon: 'warning',
                title: 'กรุณาเลือกคำสั่งซื้ออย่างน้อย 1 รายการ',
                padding: '10px 20px',
                timer: 2000,
                timerProgressBar: false,
                showConfirmButton: false,
                allowOutsideClick: false
            });
            return;
        }
        setIsOpenSetManualStatus(true);
        setOrderSetStatusType('multiple');
        setSelectedOrderId(null);
    };

    const onSubmitMultipleChangeStatus = (status: OrderStatus) => {
        const options = [
            { label: 'Pending', value: OrderStatus.PENDING },
            { label: 'Processing', value: OrderStatus.PROCESSING },
            { label: 'In Progress', value: OrderStatus.IN_PROGRESS },
            { label: 'Completed', value: OrderStatus.COMPLETED }
        ];

        const finded = options.find(item => item.value === status);
        setIsHideSetManualStatus(true);
        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center'>คุณต้องการที่จะตั้งค่าสถานะคำสั่งซื้อที่เลือกทั้งหมดเป็น {finded?.label} ใช่หรือไม่</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                padding: '2em',
                reverseButtons: true,
                customClass: {
                    popup: 'sweet-alerts',
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false
            })
            .then(({ isConfirmed }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);
                    const formData = new FormData();
                    selectedRecords.forEach(record => {
                        formData.append('orderIds[]', record.id);
                    });
                    formData.append('status', status);
                    multipleChangeStatus(formData)
                        .then(response => {
                            if (!response.success) {
                                Swal.fire({
                                    icon: 'error',
                                    title: response.data?.message || 'Get data failed',
                                    padding: '10px 20px'
                                });
                            } else {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'สถานะคำสั่งซื้อถูกตั้งค่าเรียบร้อยแล้ว',
                                    padding: '10px 20px',
                                    confirmButtonText: 'ปิด'
                                });
                                isFetchData.current = false;
                                fetchData();
                                setSelectedRecords([]);
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                            onCloseManualStatus();
                        });
                } else {
                    setIsHideSetManualStatus(false);
                }
            });
    };

    const onSubmitMultipleResend = () => {
        if (selectedRecords.length === 0) {
            withReactContent(Swal).fire({
                icon: 'warning',
                title: 'กรุณาเลือกคำสั่งซื้ออย่างน้อย 1 รายการ',
                padding: '10px 20px',
                timer: 2000,
                timerProgressBar: false,
                showConfirmButton: false,
                allowOutsideClick: false
            });
            return;
        } else {
            const hasInvalidStatus = selectedRecords.some(record => record.status !== OrderStatus.FAIL);

            if (hasInvalidStatus) {
                withReactContent(Swal).fire({
                    icon: 'warning',
                    title: 'คำสั่งซื้อที่เลือกมีสถานะไม่ถูกต้อง ไม่สามารถส่งคำสั่งซื้อได้',
                    padding: '10px 20px',
                    timer: 2000,
                    timerProgressBar: false,
                    showConfirmButton: false,
                    allowOutsideClick: false
                });
                return;
            }

            withReactContent(Swal)
                .fire({
                    html: (
                        <div className='text-white'>
                            <p className='text-base font-bold leading-normal text-white-dark text-center'>คุณต้องการที่จะส่งคำสั่งซื้อที่เลือกทั้งหมดอีกครั้งใช่หรือไม่</p>
                        </div>
                    ),
                    confirmButtonText: 'ยืนยัน',
                    cancelButtonText: 'ยกเลิก',
                    showCancelButton: true,
                    padding: '2em',
                    reverseButtons: true,
                    customClass: {
                        popup: 'sweet-alerts',
                        cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                        confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                    },
                    allowOutsideClick: false
                })
                .then(({ isConfirmed }) => {
                    if (isConfirmed) {
                        setIsSubmitting(true);
                        const formData = new FormData();
                        selectedRecords.forEach(record => {
                            formData.append('orderIds[]', record.id);
                        });
                        multipleResend(formData)
                            .then(response => {
                                if (!response.success) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: response.data?.message || 'Get data failed',
                                        padding: '10px 20px'
                                    });
                                } else {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'คำสั่งซื้อถูกส่งเรียบร้อยแล้ว',
                                        padding: '10px 20px'
                                    });
                                    isFetchData.current = false;
                                    fetchData();
                                    setSelectedRecords([]);
                                }
                            })
                            .finally(() => {
                                setIsSubmitting(false);
                            });
                    }
                });
        }
    };

    const columns: any[] = [
        {
            accessor: 'id',
            title: 'รหัสคำสั่งซื้อ',
            sortable: true,
            width: 200,
            render: ({ id, orderExternalRecord }: any) => (
                <Fragment>
                    <div className='text-meelike-dark-2 flex items-center gap-2 whitespace-normal break-words underline cursor-pointer' onClick={() => handleCopyOrderCode(id)}>
                        {id}
                        <IconCopy className='text-meelike-dark-2 cursor-pointer h-5 w-5' />
                    </div>
                    <div className='text-meelike-dark'>({orderExternalRecord?.providerOrderId})</div>
                </Fragment>
            )
        },
        {
            accessor: 'userId',
            title: 'ผู้ใช้งาน',
            sortable: false,
            render: ({ user, userId }: any) => (
                <Fragment>
                    <div className='flex flex-row gap-4 items-center whitespace-normal break-words'>
                        {/* {generateServiceIcon(service?.platform)} */}
                        <div>
                            <div className='font-bold text-meelike-dark'>{user?.name}</div>
                            <div className='text-meelike-dark'>{user?.email}</div>
                            <div className='text-meelike-dark'>User ID: {userId}</div>
                        </div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'profit',
            title: <div className='text-end'>PnL</div>,
            sortable: true,
            render: ({ profit, profitTHB, originalPrice, originalPriceTHB, totalCostTHB }: any) => (
                <Fragment>
                    {/* <div
                        className={clsx('text-meelike-dark text-end', {
                            'text-danger': parseFloat(profit ?? '0') < 0,
                            'text-success': parseFloat(profit ?? '0') > 0
                        })}
                    >
                        <span className='text-meelike-dark font-semibold'>USD:</span>{' '}
                        {profit !== undefined ? (
                            parseFloat(profit).toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                        ) : (
                            <span className='text-red-500'>-</span>
                        )}
                    </div> */}

                    <div className='flex flex-col gap-2 text-end'>
                        <div
                            className={clsx('text-meelike-dark text-end', {
                                'text-danger': parseFloat(profitTHB ?? '0') < 0,
                                'text-success': parseFloat(profitTHB ?? '0') > 0
                            })}
                        >
                            <span className='text-meelike-dark font-semibold'>กำไร/ขาดทุน:</span>{' '}
                            {profitTHB !== undefined ? (
                                <Fragment>
                                    ฿
                                    {parseFloat(profitTHB).toLocaleString('th-TH', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </Fragment>
                            ) : (
                                <span className='text-red-500'>-</span>
                            )}
                        </div>

                        <div className='text-meelike-dark text-end font-semibold'>
                            ยอดรวมสุทธิ:{' '}
                            {parseFloat(totalCostTHB).toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </div>

                        <div className='text-meelike-dark text-end'>
                            (ต้นทุน:
                            {/* ${new Decimal(originalPrice ?? 0).toNumber().toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}{' '}
                            / */}{' '}
                            ฿
                            {new Decimal(originalPriceTHB ?? 0).toNumber().toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                            )
                        </div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'targetUrl',
            title: 'ลิงก์',
            sortable: false,
            width: 150,
            render: ({ targetUrl }: any) => (
                <div className='whitespace-normal break-words'>
                    <a href={targetUrl ?? '#'} target='_blank' rel='noreferrer noopener' className='text-meelike-dark underline cursor-pointer flex-1 gap-2'>
                        {targetUrl}
                    </a>
                </div>
            )
        },
        {
            accessor: 'startCount',
            title: <div className='text-end'>Start Count</div>,
            sortable: true,
            render: ({ startCount }: any) => (
                <Fragment>
                    <div className='text-meelike-dark text-end'>
                        {(startCount ?? 0).toLocaleString('th-TH', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'orderAmount',
            title: <div className='text-end'>จำนวน</div>,
            sortable: true,
            render: ({ orderAmount }: any) => (
                <Fragment>
                    <div className='text-meelike-dark text-end'>
                        {(orderAmount ?? 0).toLocaleString('th-TH', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                </Fragment>
            )
        },

        {
            accessor: 'service',
            title: 'บริการ',
            sortable: false,
            width: 300,
            render: ({ service, serviceId, isTextOnlyOrder, serviceTextName }: any) => (
                <Fragment>
                    <div className='flex flex-row gap-3 items-center whitespace-normal break-words'>
                        {service?.serviceCategory?.iconUrl && (
                            <img
                                src={service?.serviceCategory?.iconUrl}
                                alt={service?.serviceCategory?.name || 'Service'}
                                className='w-8 h-8 rounded-lg object-contain flex-shrink-0'
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        )}
                        <div className='flex-1 min-w-0'>
                            <div className='badge text-gray-600 bg-gray-200 text-xs mb-1'>{serviceId}</div>
                            <div className='font-semibold text-meelike-dark truncate'>{isTextOnlyOrder ? serviceTextName : service?.name}</div>
                            {!isTextOnlyOrder && <div className='text-xs text-meelike-dark-2'>Provider: {service?.providerService?.provider?.name}</div>}
                        </div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'status',
            title: 'สถานะ',
            sortable: false,
            render: ({ status }: any) => (
                <Fragment>
                    <Status status={status} />
                </Fragment>
            )
        },
        {
            accessor: 'remains',
            title: <div className='text-end'>Remains</div>,
            sortable: true,
            render: ({ remains }: any) => (
                <Fragment>
                    <div className='text-meelike-dark text-end'>
                        {(remains ?? 0).toLocaleString('th-TH', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'completion',
            title: 'ความก้าวหน้า',
            sortable: false,
            render: ({ progressionPercentage }: any) => (
                <Fragment>
                    <div className='w-24'>
                        <div className='rounded-full h-2.5 bg-gray-200 dark:bg-gray-700 overflow-hidden'>
                            <div
                                className='h-full rounded-full bg-gradient-to-r from-meelike-primary via-meelike-primary to-green-400 transition-all duration-500 ease-out'
                                style={{ width: `${progressionPercentage ?? 0}%` }}
                            ></div>
                        </div>
                        <div className='text-xs text-meelike-dark-2 mt-1 text-center'>{progressionPercentage ?? 0}%</div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'dripFeed',
            title: 'Drip Feed',
            sortable: false,
            width: 100,
            render: ({ dripfeed, dripfeedIntervalSeconds, dripfeedQuantityPerRound }: any) => (
                <Fragment>
                    {dripfeed ? (
                        <div className='flex flex-row gap-4 items-center whitespace-normal break-words'>
                            <div>
                                <div className='font-bold text-meelike-dark'>ระยะห่างของเวลาแต่ละรอบ: {formatAverageTimeSeconds(dripfeedIntervalSeconds)}</div>
                                <div className='text-meelike-dark'>
                                    จำนวนต่อรอบ:{' '}
                                    {(dripfeedQuantityPerRound ?? 0).toLocaleString('th-TH', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='text-meelike-dark'>-</div>
                    )}
                </Fragment>
            )
        },
        {
            accessor: 'mode',
            title: 'Mode',
            sortable: false,
            render: ({ mode }: any) => (
                <Fragment>
                    {mode === 'auto' ? (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'>
                            <IconBolt className='w-3.5 h-3.5' /> Auto
                        </span>
                    ) : mode === 'manual' ? (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'>
                            <IconUser className='w-3.5 h-3.5' /> Manual
                        </span>
                    ) : (
                        <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'>
                            Unknown
                        </span>
                    )}
                </Fragment>
            )
        },

        {
            accessor: 'createdAt',
            title: 'วันที่สั่งซื้อ',
            width: 120,
            sortable: true,
            render: ({ createdAt }: any) => (
                <Fragment>
                    <div className='text-meelike-dark whitespace-normal break-words'>{createdAt ? moment(createdAt).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm') : '-'}</div>
                </Fragment>
            )
        },
        {
            accessor: 'completedAt',
            title: 'วันที่สำเร็จ',
            sortable: false,
            width: 120,
            render: ({ completedAt }: any) => (
                <Fragment>
                    <div className='text-meelike-dark whitespace-normal break-words'>{completedAt ? moment(completedAt).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm') : '-'}</div>
                </Fragment>
            )
        },

        {
            accessor: 'actions',
            title: '',
            sortable: false,
            render: ({ id, status, orderExternalRecord }: any) => {
                const isCompleted = status === 'COMPLETED';
                const isCancelled = status === 'CANCELED';
                const isFail = status === 'FAIL';
                const isError = status === 'ERROR';

                return (
                    <Fragment>
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
                                    <ul className='!min-w-[300px]'>
                                        <li>
                                            <button type='button' className='font-semibold text-left' onClick={() => onViewDetail(id)} disabled={isSubmitting}>
                                                <IconEye className='w-4.5 h-4.5 mr-1' />
                                                <span>Details</span>
                                            </button>
                                        </li>
                                        {(isFail || isError || !orderExternalRecord?.providerOrderId) && (
                                            <li>
                                                <button type='button' className='font-semibold text-left' onClick={() => onResendOrder(id)} disabled={isSubmitting}>
                                                    <IconMessage className='w-4.5 h-4.5 mr-1' />
                                                    <span>Resend Order</span>
                                                </button>
                                            </li>
                                        )}
                                        {(isFail || isError) && (
                                            <li>
                                                <button type='button' className='font-semibold text-left' onClick={() => onEditTargetUrl(id)} disabled={isSubmitting}>
                                                    <IconLink className='w-4.5 h-4.5 mr-1' />
                                                    <span>Edit Link</span>
                                                </button>
                                            </li>
                                        )}

                                        <li>
                                            <button type='button' className='font-semibold text-left' onClick={() => onSetStartCount(id)} disabled={isSubmitting}>
                                                <IconDocumentPlus className='w-4.5 h-4.5 mr-1' />
                                                <span>Set Start Count</span>
                                            </button>
                                        </li>

                                        <li>
                                            <button type='button' className='font-semibold text-left' onClick={() => onSetPartial(id)} disabled={isSubmitting}>
                                                <IconDocumentPlus className='w-4.5 h-4.5 mr-1' />
                                                <span>Set Partial</span>
                                            </button>
                                        </li>

                                        <li>
                                            <button type='button' className='font-semibold text-left' onClick={() => onSetManualStatus(id)} disabled={isSubmitting}>
                                                <IconKey className='w-4.5 h-4.5 mr-1' />
                                                <span>Change Status</span>
                                            </button>
                                        </li>

                                        {!isCancelled && !isCompleted && (
                                            <li>
                                                <button type='button' className='font-semibold text-left' onClick={() => onCancelAndRefund(id)} disabled={isSubmitting}>
                                                    <IconX className='w-4.5 h-4.5 mr-1' />
                                                    <span>Cancel and Refund</span>
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </Dropdown>
                            </div>

                            {/* <Tippy content='ดูรายละเอียด' placement='top'>
                                <button
                                    type='button'
                                    className='flex text-primary hover:bg-gray-200 p-1 rounded'
                                    onClick={() => {
                                        onViewDetail(id);
                                    }}
                                >
                                    <IconEye className='w-4.5 h-4.5' />
                                </button>
                            </Tippy>

                            {!isCancelled && !isFail && !isError && !isCompleted && (
                                <Tippy content='ยกเลิกคำสั่งซื้อ' placement='top'>
                                    <button
                                        type='button'
                                        className={clsx('flex text-danger hover:bg-gray-200 p-1 rounded', {
                                            'cursor-not-allowed opacity-50': isCancelled || isFail || isError
                                        })}
                                        onClick={() => {
                                            onCancelAndRefund(id);
                                        }}
                                        disabled={isCancelled || isFail || isError}
                                    >
                                        <IconX className='w-4.5 h-4.5' />
                                    </button>
                                </Tippy>
                            )} */}
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
        fetchMasterData();
    }, []);

    // Debounce effect for search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(filterState.search);
        }, DEBOUNCE_MS);
        return () => clearTimeout(handler);
    }, [filterState.search]);

    // Trigger fetch when non-search filters or debounced search change
    useEffect(() => {
        fetchData();
    }, [
        page,
        pageSize,
        debouncedSearch,
        filterState.userId,
        filterState.categoryId,
        filterState.providerId,
        filterState.serviceId,
        filterState.mode,
        filterState.status,
        filterState.sortStatus.columnAccessor,
        filterState.sortStatus.direction,
        filterState.dateRanges,
        filterState.showNegativeProfit,
        filterState.source
    ]);

    useEffect(() => {
        return () => {
            clearState();
            clearStateUser();
            clearStateServiceCategory();
            clearStateProvider();
            clearStateService();
        };
    }, []);

    return {
        isLoading,
        isSubmitting,
        isOpenDetail,
        TIMEZONE,
        PAGE_SIZES,
        serviceCategoryOptions,
        orderStatusOptions,
        orderSourceOptions,
        providerOptions,
        serviceOptions,
        modeOptions,
        userOptions,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalData,
        data,
        hasNegativeProfit,
        columns,
        selectedRecords,
        setSelectedRecords,
        filterState,
        filterDateRef,
        isOpenSetManualStatus,
        isHideSetManualStatus,
        isRecordSelectable,
        doAllSelectedOnlyFAIL,
        canChangeStatusAll,
        orderSetStatusType,
        onChangeFilterState,
        onCloseDetail,
        onCancelAndRefundMultiple,
        onCopyToClipboard,
        onCloseManualStatus,
        onSubmitManualStatus,
        onSetManualStatusMultiple,
        onSubmitMultipleChangeStatus,
        onSubmitMultipleResend,
        onChangePage,
        onChangePageSize
    };
};

export default ViewModel;
