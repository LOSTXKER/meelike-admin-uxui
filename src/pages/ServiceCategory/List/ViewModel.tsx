import { useEffect, useState, useRef, Fragment, useMemo } from 'react';
import { useThemeStore } from '@/store/theme';
import { useServiceCategoryStore } from '@/store/service-category';
import { useProfileStore } from '@/store/profile';
import { useShallow } from 'zustand/react/shallow';
import { DataTableSortStatus } from 'mantine-datatable';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import IconEdit from '@/components/Icon/IconEdit';
import IconTrashLines from '@/components/Icon/IconTrashLines';
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
    const {
        getAll,
        data: allServiceCategories = [],
        delete: deleteServiceCategory,
        clearState
    } = useServiceCategoryStore(
        useShallow(state => ({
            data: state.data,
            getAll: state.getAll,
            delete: state.delete,
            clearState: state.clearState
        }))
    );
    const { profile } = useProfileStore(
        useShallow(state => ({
            profile: state.data
        }))
    );
    const profilePermissions = profile?.permissions || [];

    const [isLoading, setIsLoading] = useState(true);
    const isFetchData = useRef<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [selectedId, setSelectedId] = useState<string>('');
    const [isOpenForm, setIsOpenForm] = useState(false);

    // Use frontend pagination with useMemo
    const filteredData = useMemo(() => {
        // Filter by search term if provided
        let filtered = [...(allServiceCategories || [])].slice((page - 1) * pageSize, page * pageSize);

        if (filterState.search) {
            const searchLower = filterState.search.toLowerCase();
            filtered = filtered.filter(item => (item.name?.toLowerCase() || '').includes(searchLower) || String(item.id || '').includes(searchLower));
        }

        // Sort the data
        const sortedData = sortBy(filtered, filterState.sortStatus.columnAccessor);
        return filterState.sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData;
    }, [allServiceCategories, filterState.search, filterState.sortStatus, page, pageSize]);

    // Get current page data
    const paginatedData = useMemo(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        return filteredData.slice(from, to);
    }, [filteredData, page, pageSize]);

    // Get total count for pagination
    const totalFilteredItems = useMemo(() => {
        return filteredData.length;
    }, [filteredData]);

    const setupPage = () => {
        setAppName('จัดการหมวดหมู่บริการ');
        setPageTitle(`จัดการหมวดหมู่บริการ | MeeLike Admin`);
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

    // Handler for page change that ensures state updates
    const handlePageChange = (p: number) => {
        console.log(`Page changed to: ${p}`);
        setPage(p);
    };

    // Handler for pageSize change
    const handlePageSizeChange = (size: number) => {
        console.log(`Page size changed to: ${size}`);
        setPageSize(size);
        setPage(1); // Reset to first page when changing page size
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

    const onChangeSortStatus = (sortStatus: DataTableSortStatus) => {
        onChangeFilterState('sortStatus', sortStatus);
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
                    deleteServiceCategory(id).then(response => {
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
                                showConfirmButton: false,
                                timer: 1500,
                                padding: '2em',
                                customClass: {
                                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                                },
                                allowOutsideClick: false
                            });
                        }
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
    };

    const columns: any[] = [
        {
            accessor: 'id',
            title: 'ID.',
            sortable: true,
            render: ({ id }: any) => (
                <Fragment>
                    <div className=''>{id}</div>
                </Fragment>
            )
        },
        {
            accessor: 'name',
            title: 'ชื่อหมวดหมู่',
            sortable: true,
            render: ({ name, iconUrl }: any) => (
                <Fragment>
                    <div className='flex items-center gap-2'>
                        <div className=''>
                            <img
                                src={iconUrl || '/assets/meelike/no-img.png'}
                                onError={e => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; // Remove the handler to prevent infinite loop
                                    target.src = '/assets/meelike/no-img.png';
                                }}
                                className='w-10 h-10 object-cover rounded'
                                alt='product'
                            />
                        </div>
                        <div className=''>{name}</div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'orderPosition',
            title: 'ลำดับ',
            sortable: true,
            render: ({ orderPosition }: any) => (
                <Fragment>
                    <div className=''>{orderPosition}</div>
                </Fragment>
            )
        },
        {
            accessor: 'createdAt',
            title: 'วันที่สร้าง',
            sortable: true,
            render: ({ createdAt }: any) => (
                <Fragment>
                    <div className=''>{new Date(createdAt).toLocaleDateString('th-TH')}</div>
                </Fragment>
            )
        },
        {
            accessor: 'actions',
            title: '',
            sortable: false,
            render: ({ id }: any) => (
                <div className='flex gap-4 items-center w-max mx-auto'>
                    <button type='button' className='flex text-clink-secondary hover:bg-gray-200 p-1 rounded' onClick={() => onEdit(id)} disabled={isSubmitting}>
                        <IconEdit className='w-4.5 h-4.5' />
                    </button>
                    <button type='button' className='flex text-clink-danger hover:bg-gray-200 p-1 rounded' onClick={() => onDelete(id)} disabled={isSubmitting}>
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
        setPage: handlePageChange,
        pageSize,
        setPageSize: handlePageSizeChange,
        filterState,
        onChangeFilterState,
        onChangeSortStatus,
        PAGE_SIZES,
        totalData: totalFilteredItems,
        data: paginatedData,
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
