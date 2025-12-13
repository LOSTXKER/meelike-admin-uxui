import { useEffect, useState, useRef, Fragment } from 'react';
import { useThemeStore } from '@/store/theme';
import { useUserStore } from '@/store/admin-user';
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

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            rtlClass: state.rtlClass,
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );
    const { totalData, data, getAll, getOne, remove, exportExcel, clearState } = useUserStore(
        useShallow(state => ({
            totalData: state.totalData,
            data: state.data,
            getAll: state.getAll,
            getOne: state.getOne,
            remove: state.remove,
            exportExcel: state.export,
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

    const setupPage = () => {
        setAppName('จัดการผู้ใช้งาน');
        setPageTitle(`จัดการผู้ใช้งาน | MeeLike Admin`);
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

    const onCloseForm = () => {
        setIsOpenForm(false);
        setTimeout(() => {
            setSelectedId('');
            setFormType('create');
        }, 500);
    };

    const onDelete = (id: string) => {
        withReactContent(Swal)
            .fire({
                icon: 'warning',
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>กรุณายืนยันการลบผู้ใช้งาน</p>
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
                    remove(id).then(response => {
                        if (response.success) {
                            withReactContent(Swal).fire({
                                icon: 'success',

                                title: response?.data?.message ?? 'ลบผู้ใช้งานสำเร็จ',
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
                                title: response?.data?.message ?? 'ลบผู้ใช้งานไม่สำเร็จ',
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

    const onExport = () => {
        setIsSubmitting(true);
        exportExcel({
            search: filterState.search,
            sortBy: filterState.sortStatus.columnAccessor,
            order: filterState.sortStatus.direction.toUpperCase()
        })
            .then(response => {
                if (!response.success) {
                    withReactContent(Swal).fire({
                        icon: 'error',
                        title: response?.data?.message ?? 'Export failed',
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
            })
            .finally(() => {
                setIsSubmitting(false);
            });
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
        // {
        //     accessor: 'username',
        //     title: 'User name',
        //     sortable: false,
        //     render: ({ username }: any) => (
        //         <Fragment>
        //             <div className="">{username}</div>
        //         </Fragment>
        //     ),
        // },
        {
            accessor: 'name',
            title: 'ชื่อ-นามสกุล',
            sortable: false,
            render: ({ name }: any) => (
                <Fragment>
                    <div className=''>{name}</div>
                </Fragment>
            )
        },
        {
            accessor: 'email',
            title: 'อีเมล',
            sortable: false,
            render: ({ email }: any) => (
                <Fragment>
                    <div className=''>{email}</div>
                </Fragment>
            )
        },
        {
            accessor: 'role',
            title: 'บทบาท',
            sortable: false,
            render: ({ role }: any) => (
                <Fragment>
                    <div className=''>
                        {role === 'SUPER_ADMIN' ? (
                            <span className='text-meelike-danger'>Super Admin</span>
                        ) : role === 'ADMIN' ? (
                            <span className='text-meelike-warning'>Admin</span>
                        ) : (
                            <span className='text-gray-500'>ไม่ระบุ</span>
                        )}
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
                    <div
                        className={clsx({
                            'text-meelike-success': status.toLowerCase() === 'a',
                            'text-meelike-danger': status.toLowerCase() === 'ia'
                        })}
                    >
                        {status.toLowerCase() === 'a' ? 'ใช้งานอยู่' : 'ไม่สามารถใช้งานได้'}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'actions',
            title: '',
            sortable: false,
            render: ({ id }: any) => (
                <div className='flex gap-4 items-center w-max mx-auto'>
                    {/* {id === profile?.id && ( */}
                    <button type='button' className='flex text-clink-secondary hover:bg-gray-200 p-1 rounded' onClick={() => onEdit(id)} disabled={isSubmitting}>
                        <IconEdit className='w-4.5 h-4.5' />
                    </button>
                    {/* )} */}
                    {profile?.id !== id && (
                        <button type='button' className='flex text-clink-danger hover:bg-gray-200 p-1 rounded' onClick={() => onDelete(id)} disabled={isSubmitting}>
                            <IconTrashLines />
                        </button>
                    )}
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
        totalData,
        data,
        columns,
        formType,
        selectedId,
        isOpenForm,
        onCreate,
        onCloseForm,
        handleAfterSubmit,
        onSubmitFilter,
        onExport
    };
};

export default ViewModel;
