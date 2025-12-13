import { useEffect, useMemo, useState, useRef, Fragment, useContext } from 'react';
import { useThemeStore } from '@/store/theme';
import { useServiceStore } from '@/store/service';
import { useProviderStore } from '@/store/provider';
import { useServiceCategoryStore } from '@/store/service-category';
import { useShallow } from 'zustand/react/shallow';
import { ServiceDetailPopupContext } from '@/Context/ServiceDetailPopup';
import { DataTableSortStatus } from 'mantine-datatable';
import { generateServiceIcon } from '@/Utils/generateServiceIcon';
import IconEdit from '@/components/Icon/IconEdit';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Status from '@/components/Status';
import { formatDate } from '@fullcalendar/core';
import Decimal from 'decimal.js';
import { clsx } from '@mantine/core';

const PAGE_SIZES = [10, 20, 30, 50, 100];

const INITIAL_FILTER_STATE = {
    sortStatus: {
        columnAccessor: 'id',
        direction: 'desc'
    } as DataTableSortStatus,
    search: '',
    providerId: 0,
    categoryId: 0
};

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );

    const { data, totalData, getAll, getOne, remove, exportExcel, enableAll, disableAll, deleteAll, clearState } = useServiceStore(
        useShallow(state => ({
            data: state.data,
            totalData: state.totalData,
            getAll: state.getAll,
            getOne: state.getOne,
            remove: state.remove,
            exportExcel: state.export,
            enableAll: state.enableAll,
            disableAll: state.disableAll,
            deleteAll: state.deleteAll,
            clearState: state.clearState
        }))
    );
    const { providers, getProviders, clearStateProvider } = useProviderStore(
        useShallow(state => ({
            providers: state.dataWithoutPagination,
            getProviders: state.getAllWithoutPagination,
            clearStateProvider: state.clearState
        }))
    );
    const { serviceCategories, getServiceCategories, clearStateServiceCategory } = useServiceCategoryStore(
        useShallow(state => ({
            getServiceCategories: state.getAll,
            serviceCategories: state.data,
            clearStateServiceCategory: state.clearState
        }))
    );

    const { open: openServiceDetail } = useContext(ServiceDetailPopupContext);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [selectedId, setSelectedId] = useState<string>('');
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);

    const providerOptions = providers.map(provider => ({
        label: provider.name,
        value: provider.id
    }));
    const serviceCategoryOptions = serviceCategories.map(category => ({
        label: category.name,
        value: category.id,
        icon: category?.iconUrl ?? null
    }));

    const [isLoading, setIsLoading] = useState(true);
    const isFetchData = useRef<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);

    // Debounce state for search
    const [debouncedSearch, setDebouncedSearch] = useState(filterState.search);
    const DEBOUNCE_MS = 400;

    const setupPage = () => {
        setAppName('จัดการบริการ');
        setPageTitle('จัดการบริการ | MeeLike Admin');
    };

    const fetchData = () => {
        if (isFetchData.current) return;

        isFetchData.current = true;
        setIsLoading(true);
        getAll({
            page,
            limit: pageSize,
            search: debouncedSearch, // use debounced value
            sortBy: filterState.sortStatus.columnAccessor,
            providerId: filterState.providerId && filterState.providerId > 0 ? filterState.providerId : undefined,
            categoryId: filterState.categoryId && filterState.categoryId > 0 ? filterState.categoryId : undefined,
            order: filterState.sortStatus.direction.toUpperCase()
        }).finally(() => {
            setIsLoading(false);
            isFetchData.current = false;
        });
    };

    const fetchMasterData = () => {
        getProviders();
        getServiceCategories();
    };

    const onChangeFilterState = (key: string, value: any) => {
        setFilterState(prevState => ({
            ...prevState,
            [key]: value
        }));
        setPage(1);
        isFetchData.current = false;
    };

    const onViewServiceDetail = (serviceId: string) => {
        openServiceDetail(serviceId);
    };

    const onCreate = () => {
        setFormType('create');
        setSelectedId('');
        setIsOpenForm(true);
    };

    const onEdit = (id: string) => {
        const toast = withReactContent(
            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            })
        );

        getOne(id).then(response => {
            if (response.success) {
                setFormType('edit');
                setSelectedId(id);
                setIsOpenForm(true);
            } else {
                toast.fire({
                    icon: 'error',
                    title: response.data?.message || 'Get data failed',
                    padding: '10px 20px'
                });
            }
        });
    };

    const onDelete = (id: string) => {
        const swal = withReactContent(Swal);
        swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: 'คุณต้องการลบบริการนี้ใช่หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            padding: '2em'
        }).then(result => {
            if (result.isConfirmed) {
                setIsSubmitting(true);
                remove(id)
                    .then(response => {
                        if (response.success) {
                            swal.fire({
                                title: 'สำเร็จ!',
                                text: 'ลบบริการสำเร็จ',
                                icon: 'success',
                                padding: '2em'
                            });
                            fetchData();
                        } else {
                            swal.fire({
                                title: 'Error!',
                                text: response.data?.message || 'Delete failed',
                                icon: 'error',
                                padding: '2em'
                            });
                        }
                    })
                    .finally(() => {
                        setIsSubmitting(false);
                    });
            }
        });
    };

    const onExport = () => {
        setIsSubmitting(true);
        exportExcel(filterState)
            .then(response => {
                if (response.success) {
                    // Handle successful export (e.g., download the file)
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'services.xlsx');
                    document.body.appendChild(link);
                    link.click();
                } else {
                    const toast = withReactContent(
                        Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000
                        })
                    );
                    toast.fire({
                        icon: 'error',
                        title: response.data?.message || 'Export failed',
                        padding: '10px 20px'
                    });
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const onCloseForm = () => {
        setIsOpenForm(false);
        setTimeout(() => {
            setSelectedId('');
            setFormType('create');
        }, 500);
    };

    const handleAfterSubmit = () => {
        setPage(1);
        setPageSize(PAGE_SIZES[0]);
        setFilterState(INITIAL_FILTER_STATE);
        setIsSubmitting(false);
        isFetchData.current = false;

        fetchData();
    };

    const onEnableAll = () => {
        if (selectedRecords.length === 0) {
            const toast = withReactContent(
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                })
            );
            toast.fire({
                icon: 'warning',
                title: 'กรุณาเลือกบริการอย่างน้อย 1 รายการ',
                padding: '10px 20px'
            });
            return;
        } else {
            withReactContent(Swal)
                .fire({
                    title: 'คุณแน่ใจหรือไม่?',
                    text: 'คุณต้องการเปิดใช้งานบริการที่เลือกทั้งหมดใช่หรือไม่?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยัน',
                    cancelButtonText: 'ยกเลิก',
                    padding: '2em'
                })
                .then(result => {
                    if (result.isConfirmed) {
                        setIsSubmitting(true);
                        const formData = new FormData();
                        selectedRecords.forEach(record => {
                            formData.append('ids[]', record.id);
                        });
                        enableAll(formData)
                            .then(response => {
                                if (response.success) {
                                    Swal.fire({
                                        title: 'สำเร็จ!',
                                        text: 'เปิดใช้งานบริการสำเร็จ',
                                        icon: 'success',
                                        padding: '2em'
                                    });
                                    fetchData();
                                    setSelectedRecords([]);
                                } else {
                                    Swal.fire({
                                        title: 'Error!',
                                        text: response.data?.message || 'Enable failed',
                                        icon: 'error',
                                        padding: '2em'
                                    });
                                }
                            })
                            .finally(() => {
                                setIsSubmitting(false);
                            });
                    }
                });
        }
    };

    const onDisableAll = () => {
        if (selectedRecords.length === 0) {
            const toast = withReactContent(
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                })
            );
            toast.fire({
                icon: 'warning',
                title: 'กรุณาเลือกบริการอย่างน้อย 1 รายการ',
                padding: '10px 20px'
            });
            return;
        } else {
            withReactContent(Swal)
                .fire({
                    title: 'คุณแน่ใจหรือไม่?',
                    text: 'คุณต้องการปิดใช้งานบริการที่เลือกทั้งหมดใช่หรือไม่?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยัน',
                    cancelButtonText: 'ยกเลิก',
                    padding: '2em'
                })
                .then(result => {
                    if (result.isConfirmed) {
                        setIsSubmitting(true);
                        const formData = new FormData();
                        selectedRecords.forEach(record => {
                            formData.append('ids[]', record.id);
                        });
                        disableAll(formData)
                            .then(response => {
                                if (response.success) {
                                    Swal.fire({
                                        title: 'สำเร็จ!',
                                        text: 'ปิดใช้งานบริการสำเร็จ',
                                        icon: 'success',
                                        padding: '2em'
                                    });
                                    fetchData();
                                    setSelectedRecords([]);
                                } else {
                                    Swal.fire({
                                        title: 'Error!',
                                        text: response.data?.message || 'Disable failed',
                                        icon: 'error',
                                        padding: '2em'
                                    });
                                }
                            })
                            .finally(() => {
                                setIsSubmitting(false);
                            });
                    }
                });
        }
    };

    const onDeleteAll = () => {
        if (selectedRecords.length === 0) {
            const toast = withReactContent(
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                })
            );
            toast.fire({
                icon: 'warning',
                title: 'กรุณาเลือกบริการอย่างน้อย 1 รายการ',
                padding: '10px 20px'
            });
            return;
        } else {
            withReactContent(Swal)
                .fire({
                    title: 'คุณแน่ใจหรือไม่?',
                    text: 'คุณต้องการลบบริการที่เลือกทั้งหมดใช่หรือไม่?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยัน',
                    cancelButtonText: 'ยกเลิก',
                    padding: '2em'
                })
                .then(result => {
                    if (result.isConfirmed) {
                        setIsSubmitting(true);
                        const formData = new FormData();
                        selectedRecords.forEach(record => {
                            formData.append('ids', record.id);
                        });
                        deleteAll(formData)
                            .then(response => {
                                if (response.success) {
                                    Swal.fire({
                                        title: 'สำเร็จ!',
                                        text: 'ลบบริการสำเร็จ',
                                        icon: 'success',
                                        padding: '2em'
                                    });
                                    fetchData();
                                    setSelectedRecords([]);
                                } else {
                                    Swal.fire({
                                        title: 'Error!',
                                        text: response.data?.message || 'Delete failed',
                                        icon: 'error',
                                        padding: '2em'
                                    });
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
            title: 'รหัส',
            sortable: true,
            render: ({ id }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{id}</div>
                </Fragment>
            )
        },
        {
            accessor: 'name',
            title: 'บริการ',
            sortable: true,
            width: 400,
            render: ({ name, description, providerService }: any) => (
                <Fragment>
                    <div className='flex flex-row gap-4 items-center w-full whitespace-normal'>
                        {generateServiceIcon(providerService?.categoryName)}
                        <div>
                            <div className='font-bold text-meelike-dark'>{name}</div>
                            {/* <div className="text-meelike-dark">{description || ' '}</div> */}
                        </div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'provider',
            title: 'ผู้ให้บริการ',
            sortable: false,
            render: ({ providerService }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{providerService?.provider?.name || ' '}</div>
                    <div className='text-gray-500'>({providerService?.externalServiceId})</div>
                </Fragment>
            )
        },
        // {
        //     accessor: 'serviceCategoryId',
        //     title: 'หมวดหมู่',
        //     sortable: false,
        //     render: ({ serviceCategory }: any) => (
        //         <Fragment>
        //             <div className='text-meelike-dark'>{serviceCategory?.name || ' '}</div>
        //         </Fragment>
        //     )
        // },
        // {
        //     accessor: 'rate',
        //     title: 'อัตราเรท',
        //     sortable: false,
        //     render: ({ finaleRate }: any) => (
        //         <Fragment>
        //             <div className="text-meelike-dark">
        //                 {finaleRate !== undefined && finaleRate !== null
        //                     ? new Decimal(finaleRate).toNumber().toLocaleString('th-TH', {
        //                           minimumFractionDigits: 2,
        //                           maximumFractionDigits: 2,
        //                       })
        //                     : ''}
        //             </div>
        //         </Fragment>
        //     ),
        // },
        {
            accessor: 'rateTHB',
            title: <div className='text-end'>ราคาต่อ 1,000</div>,
            sortable: false,
            render: ({ rateTHB, rateAmount, cost, costTHB }: any) => (
                <Fragment>
                    <div className='flex flex-col gap-2 text-end'>
                        <div className='text-meelike-dark text-end'>
                            {/* $
                            {new Decimal(rateAmount ?? 0).toNumber().toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}{' '}
                            /  */}
                            ฿
                            {new Decimal(rateTHB ?? 0).toNumber().toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 text-end'>
                        <div className='text-gray-400 text-end text-xs'>
                            (ต้นทุน:{' '}
                            {/* ${new Decimal(cost ?? 0).toNumber().toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}{' '}
                            /  */}
                            ฿
                            {new Decimal(costTHB ?? 0).toNumber().toLocaleString('th-TH', {
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
            accessor: 'totalProfitMarginPercent',
            title: 'PnL',
            sortable: true,
            render: ({ totalProfitMarginPercent, totalProfit, totalCost, totalRevenue }: any) => (
                <Fragment>
                    <div className='flex flex-col gap-2 text-end'>
                        <div
                            className={clsx('font-semibold', {
                                'text-meelike-dark': parseInt(totalProfitMarginPercent) === 0,
                                'text-meelike-success': parseInt(totalProfitMarginPercent) > 0,
                                'text-meelike-danger': parseInt(totalProfitMarginPercent) < 0
                            })}
                        >
                            {new Decimal(totalProfitMarginPercent).toNumber().toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}{' '}
                            %
                        </div>
                        <div className='text-gray-600'>
                            กำไร : ฿
                            {new Decimal(totalProfit ?? 0).toNumber().toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </div>
                        <div className='text-gray-600'>
                            ต้นทุน : ฿
                            {new Decimal(totalCost ?? 0).toNumber().toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </div>
                        <div className='text-gray-600'>
                            ยอดขาย : ฿
                            {new Decimal(totalRevenue ?? 0).toNumber().toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'maxAmount',
            title: 'จำนวน (ต่ำสุด-สูงสุด)',
            sortable: true,
            render: ({ minAmount, maxAmount }: any) => (
                <Fragment>
                    <div className='flex flex-col gap-2 text-end'>
                        <div className='text-meelike-dark'>
                            ขั้นต่ำสุด :{' '}
                            {(minAmount ?? 0).toLocaleString('th-TH', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}
                        </div>
                        <div className='text-meelike-dark'>
                            ขั้นสูงสุด :{' '}
                            {(maxAmount ?? 0).toLocaleString('th-TH', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}
                        </div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'isActive',
            title: 'สถานะการใช้งาน',
            sortable: false,
            render: ({ isActive, providerDisabled }: any) => (
                <Fragment>
                    <div className='flex justify-center'>
                        {!providerDisabled && <Status isActive={isActive} />}
                        {providerDisabled && <div className='text-red-500 italic'>Provider Disabled</div>}
                    </div>
                </Fragment>
            )
        },

        // {
        //     accessor: 'createdAt',
        //     title: 'วันที่สร้าง',
        //     sortable: true,
        //     render: ({ createdAt }: any) => (
        //         <Fragment>
        //             <div className='text-meelike-dark'>{formatDate(createdAt, { locale: 'th' })}</div>
        //         </Fragment>
        //     )
        // },
        // {
        //     accessor: 'updatedAt',
        //     title: 'วันที่แก้ไข',
        //     sortable: true,
        //     render: ({ updatedAt }: any) => (
        //         <Fragment>
        //             <div className='text-meelike-dark'>{formatDate(updatedAt, { locale: 'th' })}</div>
        //         </Fragment>
        //     )
        // },
        {
            accessor: 'actions',
            title: '',
            sortable: false,
            render: ({ id, providerDisabled }: any) => (
                <Fragment>
                    <div className='flex flex-row gap-4 items-center'>
                        {providerDisabled === false && (
                            <button type='button' className='flex text-clink-secondary hover:bg-gray-200 p-1 rounded' onClick={() => onEdit(id)} disabled={isSubmitting}>
                                <IconEdit className='w-4.5 h-4.5' />
                            </button>
                        )}
                        <button type='button' className='flex text-clink-danger hover:bg-gray-200 p-1 rounded' onClick={() => onDelete(id)} disabled={isSubmitting}>
                            <IconTrashLines />
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
    }, [page, pageSize, debouncedSearch, filterState.providerId, filterState.categoryId, filterState.sortStatus.columnAccessor, filterState.sortStatus.direction]);

    useEffect(() => {
        return () => {
            clearState();
            clearStateProvider();
            clearStateServiceCategory();
        };
    }, []);

    return {
        isLoading,
        formType,
        isOpenForm,
        selectedId,
        isSubmitting,
        PAGE_SIZES,
        providerOptions,
        serviceCategoryOptions,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalData,
        data,
        columns,
        filterState,
        selectedRecords,
        setSelectedRecords,
        onCreate,
        onExport,
        onCloseForm,
        onChangeFilterState,
        handleAfterSubmit,
        onEnableAll,
        onDisableAll,
        onDeleteAll
    };
};

export default ViewModel;
