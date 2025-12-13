import { useEffect, useMemo, useState, useRef, Fragment, useContext } from 'react';
import { useThemeStore } from '@/store/theme';
import { useUsersStore } from '@/store/users';
import { useShallow } from 'zustand/react/shallow';
import { DataTableSortStatus } from 'mantine-datatable';
import Dropdown from '@/components/Dropdown';
import IconChecks from '@/components/Icon/IconChecks';
import IconXRedCircle from '@/components/Icon/IconXRedCircle';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconDollarSignCircle from '@/components/Icon/IconDollarSignCircle';
import IconShoppingBag from '@/components/Icon/IconShoppingBag';
import Tippy from '@tippyjs/react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'moment-timezone';
import { sortBy } from 'lodash';
import { clsx } from '@mantine/core';
import IconEdit from '@/components/Icon/IconEdit';

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
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );

    const { rawData, totalData, getAll, getOne, activate, deactivate, updateTopupBonus, updateDiscountRate, updateDistributorStatus, clearState } = useUsersStore(
        useShallow(state => ({
            rawData: state.data,
            totalData: state.totalData,
            getAll: state.getAll,
            getOne: state.getOne,
            activate: state.activate,
            deactivate: state.deactivate,
            updateTopupBonus: state.updateTopupBonus,
            updateDiscountRate: state.updateDiscountRate,
            updateDistributorStatus: state.updateDistributorStatus,
            clearState: state.clearState
        }))
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isFetchData = useRef<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);

    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [selectedId, setSelectedId] = useState<string>('');
    const [isOpenForm, setIsOpenForm] = useState(false);

    const data = useMemo(() => {
        if (filterState.sortStatus.columnAccessor === 'balance') {
            const sorted = sortBy(rawData, item => parseFloat(item.wallet?.balance || 0));
            if (filterState.sortStatus.direction === 'desc') {
                return sorted.reverse();
            } else {
                return sorted;
            }
        }

        return rawData;
    }, [rawData, filterState.sortStatus]);

    const setupPage = () => {
        setAppName('จัดการผู้ใช้งานในระบบ');
        setPageTitle('จัดการผู้ใช้งานในระบบ | MeeLike Admin');
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

    const onChangeFilterState = (key: string, value: any) => {
        setFilterState(prevState => ({
            ...prevState,
            [key]: value
        }));
        setPage(1);
        isFetchData.current = false;
    };

    const onActivateUser = (id: string) => {
        withReactContent(Swal)
            .fire({
                title: 'ยืนยันการเปิดใช้งานผู้ใช้งาน',
                text: 'หากคุณเปิดใช้งานผู้ใช้งานนี้ ผู้ใช้งานจะสามารถเข้าสู่ระบบและใช้งานได้อีกครั้ง',
                icon: 'warning',
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: 'ยืนยันเปิดใช้งาน',
                cancelButtonText: 'ยกเลิก'
            })
            .then(result => {
                if (result.isConfirmed) {
                    setIsSubmitting(true);
                    activate(id)
                        .then(response => {
                            if (response.success) {
                                Swal.fire({
                                    title: 'สำเร็จ',
                                    text: 'เปิดใช้งานผู้ใช้งานเรียบร้อยแล้ว',
                                    icon: 'success'
                                });
                                fetchData();
                            } else {
                                Swal.fire({
                                    title: 'ผิดพลาด',
                                    text: response.data?.message || 'ไม่สามารถเปิดใช้งานผู้ใช้งานได้',
                                    icon: 'error'
                                });
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onDeactivateUser = (id: string) => {
        withReactContent(Swal)
            .fire({
                title: 'ยืนยันการปิดใช้งานผู้ใช้งาน',
                text: 'หากคุณปิดใช้งานผู้ใช้งานนี้ ผู้ใช้งานจะไม่สามารถเข้าสู่ระบบและใช้งานได้อีกต่อไป',
                icon: 'warning',
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: 'ยืนยันปิดใช้งาน',
                cancelButtonText: 'ยกเลิก'
            })
            .then(result => {
                if (result.isConfirmed) {
                    setIsSubmitting(true);
                    deactivate(id)
                        .then(response => {
                            if (response.success) {
                                Swal.fire({
                                    title: 'สำเร็จ',
                                    text: 'ปิดใช้งานผู้ใช้งานเรียบร้อยแล้ว',
                                    icon: 'success'
                                });
                                fetchData();
                            } else {
                                Swal.fire({
                                    title: 'ผิดพลาด',
                                    text: response.data?.message || 'ไม่สามารถปิดใช้งานผู้ใช้งานได้',
                                    icon: 'error'
                                });
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onUpdateTopupBonus = (userId: string) => {
        const findedUser = rawData.find(user => user.id === userId);
        const currentTopupBonus = findedUser?.topupBonusPercentage || 0;

        withReactContent(Swal)
            .fire({
                title: 'แก้ไขโบนัสเติมเงิน',
                html: `
                    <input id="topupBonus" class="swal2-input" type="number" value="${currentTopupBonus}" placeholder="โบนัสเติมเงิน (%)" min="0" max="100">
                `,
                focusConfirm: false,
                preConfirm: () => {
                    const topupBonus = parseFloat((document.getElementById('topupBonus') as HTMLInputElement).value);
                    if (isNaN(topupBonus) || topupBonus < 0 || topupBonus > 100) {
                        Swal.showValidationMessage('กรุณากรอกโบนัสเติมเงินที่ถูกต้อง (0-100)');
                        return false;
                    }
                    return { topupBonus };
                },
                confirmButtonText: 'บันทึก',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true
            })
            .then(result => {
                if (result.isConfirmed) {
                    setIsSubmitting(true);
                    const formData = new FormData();
                    formData.append('percentage', result.value.topupBonus.toString());
                    updateTopupBonus(userId, formData)
                        .then(response => {
                            if (response.success) {
                                Swal.fire({
                                    title: 'สำเร็จ',
                                    text: 'แก้ไขโบนัสเติมเงินเรียบร้อยแล้ว',
                                    icon: 'success',
                                    confirmButtonText: 'ปิด'
                                });
                                isFetchData.current = false;
                                fetchData();
                            } else {
                                Swal.fire({
                                    title: 'ผิดพลาด',
                                    text: response.data?.message || 'ไม่สามารถแก้ไขโบนัสเติมเงินได้',
                                    icon: 'error',
                                    confirmButtonText: 'ปิด'
                                });
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onUpdateDiscountRate = (userId: string) => {
        const findedUser = rawData.find(user => user.id === userId);
        const currentDiscountRate = findedUser?.discountPercentage || 0;

        withReactContent(Swal)
            .fire({
                title: 'แก้ไขส่วนลด (%)',
                html: `
                    <input id="discountRate" class="swal2-input" type="number" value="${currentDiscountRate}" placeholder="ส่วนลด (%)" min="0" max="100">
                `,
                focusConfirm: false,
                preConfirm: () => {
                    const discountRate = parseFloat((document.getElementById('discountRate') as HTMLInputElement).value);
                    if (isNaN(discountRate) || discountRate < 0 || discountRate > 100) {
                        Swal.showValidationMessage('กรุณากรอกโบนัสเติมเงินที่ถูกต้อง (0-100)');
                        return false;
                    }
                    return { discountRate };
                },
                confirmButtonText: 'บันทึก',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true
            })
            .then(result => {
                if (result.isConfirmed) {
                    setIsSubmitting(true);
                    const formData = new FormData();
                    formData.append('percentage', result.value.discountRate.toString());
                    updateDiscountRate(userId, formData)
                        .then(response => {
                            if (response.success) {
                                Swal.fire({
                                    title: 'สำเร็จ',
                                    text: 'แก้ไขส่วนลดเรียบร้อยแล้ว',
                                    icon: 'success',
                                    confirmButtonText: 'ปิด'
                                });
                                isFetchData.current = false;
                                fetchData();
                            } else {
                                Swal.fire({
                                    title: 'ผิดพลาด',
                                    text: response.data?.message || 'ไม่สามารถแก้ไขส่วนลดได้',
                                    icon: 'error',
                                    confirmButtonText: 'ปิด'
                                });
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onUpdateDistributorStatus = (userId: string, makeDistributor: boolean) => {
        const actionText = makeDistributor ? 'ตั้งเป็นตัวแทนจำหน่าย' : 'ยกเลิกการเป็นตัวแทนจำหน่าย';

        withReactContent(Swal)
            .fire({
                title: `ยืนยันการ${actionText}`,
                text: `คุณต้องการให้ผู้ใช้งานนี้ "${actionText}" หรือไม่?`,
                icon: 'warning',
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: `ยืนยัน`,
                cancelButtonText: 'ยกเลิก'
            })
            .then(result => {
                if (result.isConfirmed) {
                    setIsSubmitting(true);
                    updateDistributorStatus(userId, { isDistributor: makeDistributor })
                        .then(response => {
                            if (response.success) {
                                Swal.fire({
                                    title: 'สำเร็จ',
                                    text: `${actionText}เรียบร้อยแล้ว`,
                                    icon: 'success'
                                });
                                fetchData();
                            } else {
                                Swal.fire({
                                    title: 'ผิดพลาด',
                                    text: response.data?.message || `ไม่สามารถ${actionText}ได้`,
                                    icon: 'error'
                                });
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
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

    const onAfterSubmitForm = () => {
        isFetchData.current = false;
        fetchData();
    };

    const columns: any[] = [
        {
            accessor: 'id',
            title: 'รหัสผู้ใช้งาน',
            sortable: true,
            render: ({ id }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{id}</div>
                </Fragment>
            )
        },
        {
            accessor: 'name',
            title: 'ชื่อผู้ใช้งาน',
            sortable: true,
            render: ({ name, email, username }: any) => (
                <Fragment>
                    <div className='flex flex-col gap-1'>
                        <div className='text-meelike-dark font-semibold'>{name}</div>
                        <div className='text-gray-600'>Username: {username}</div>
                        <div className='text-gray-600'>Email: {email}</div>
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
                    {status === 'active' ? (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'>
                            <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
                            ใช้งานอยู่
                        </span>
                    ) : (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'>
                            <span className='w-1.5 h-1.5 bg-red-500 rounded-full'></span>
                            ไม่ใช้งาน
                        </span>
                    )}
                </Fragment>
            )
        },
        {
            accessor: 'createdAt',
            title: 'วันที่สมัคร',
            sortable: true,
            render: ({ createdAt }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{moment(createdAt).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm:ss')}</div>
                </Fragment>
            )
        },
        {
            accessor: 'userType',
            title: 'ประเภทผู้ใช้งาน',
            sortable: false,
            render: ({ userType }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{userType === 'google' ? 'Google Account' : userType === 'facebook' ? 'Facebook Account' : 'บัญชีผู้ใช้งานทั่วไป'}</div>
                </Fragment>
            )
        },
        {
            accessor: 'membershipLevel',
            title: 'ระดับสมาชิก',
            sortable: false,
            render: ({ membership }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{membership?.membershipLevelLabel || 'ไม่มีระดับสมาชิก'}</div>
                </Fragment>
            )
        },
        {
            accessor: 'balance',
            title: <div className='text-end'>ยอดคงเหลือ</div>,
            sortable: true,
            render: ({ wallet }: any) => (
                <Fragment>
                    <div className='text-meelike-dark text-end'>
                        {parseFloat(wallet?.balance ?? 0).toLocaleString('th-TH', {
                            style: 'currency',
                            currency: 'THB',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'spentAmount',
            title: <div className='text-end'>ยอดใช้จ่ายรวม</div>,
            sortable: true,
            render: ({ totalSpendTHB }: any) => (
                <Fragment>
                    <div className='text-meelike-dark text-end'>
                        {parseFloat(totalSpendTHB).toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'isDistributor',
            title: 'ตัวแทนจำหน่าย',
            sortable: false,
            render: ({ isDistributor }: any) => (
                <Fragment>
                    {isDistributor ? (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'>
                            <IconChecks className='w-3.5 h-3.5' /> ใช่
                        </span>
                    ) : (
                        <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'>
                            ไม่ใช่
                        </span>
                    )}
                </Fragment>
            )
        },
        {
            accessor: 'topupBonusPercentage',
            title: <div className='text-end'>โบนัสเติมเงิน (%)</div>,
            sortable: true,
            render: ({ topupBonusPercentage }: any) => (
                <Fragment>
                    <div className='text-meelike-dark text-end'>
                        {topupBonusPercentage
                            ? `${topupBonusPercentage.toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}%`
                            : 'ไม่มีโบนัส'}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'discountPercentage',
            title: <div className='text-end'>ส่วนลด (%)</div>,
            sortable: true,
            render: ({ discountPercentage }: any) => (
                <Fragment>
                    <div className='text-meelike-dark text-end'>
                        {discountPercentage
                            ? `${discountPercentage.toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}%`
                            : 'ไม่มีส่วนลด'}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'actions',
            title: '',
            sortable: false,
            render: ({ id, status, isDistributor }: any) => (
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
                                    <button type='button' className='font-semibold text-left' onClick={() => onEdit(id)} disabled={isSubmitting}>
                                        <IconEdit className='w-4.5 h-4.5 mr-1' />
                                        <span>แก้ไขโปรไฟล์</span>
                                    </button>
                                </li>
                                <li>
                                    <button type='button' className='font-semibold text-left' onClick={() => onUpdateDiscountRate(id)} disabled={isSubmitting}>
                                        <IconShoppingBag className='w-4.5 h-4.5 mr-1' />
                                        <span>แก้ไขส่วนลด (%)</span>
                                    </button>
                                </li>
                                <li>
                                    <button type='button' className='font-semibold text-left' onClick={() => onUpdateTopupBonus(id)} disabled={isSubmitting}>
                                        <IconDollarSignCircle className='w-4.5 h-4.5 mr-1' />
                                        <span>แก้ไขโบนัสเติมเงิน</span>
                                    </button>
                                </li>
                                {status === 'active' && (
                                    <li>
                                        <button type='button' className='font-semibold text-left' onClick={() => onDeactivateUser(id)} disabled={isSubmitting}>
                                            <IconXRedCircle className='w-4.5 h-4.5 mr-1' />
                                            <span>ปิดการใช้งาน / Ban ผู้ใช้งานนี้</span>
                                        </button>
                                    </li>
                                )}
                                {status === 'inactive' && (
                                    <li>
                                        <button type='button' className='font-semibold text-left' onClick={() => onActivateUser(id)} disabled={isSubmitting}>
                                            <IconChecks className='w-4.5 h-4.5 mr-1' />
                                            <span>เปิดการใช้งาน / UnBan ผู้ใช้งานนี้</span>
                                        </button>
                                    </li>
                                )}
                                {isDistributor && (
                                    <li>
                                        <button type='button' className='font-semibold text-left' onClick={() => onUpdateDistributorStatus(id, false)} disabled={isSubmitting}>
                                            <IconDollarSignCircle className='text-red-500 w-4.5 h-4.5 mr-1' />
                                            <span>ยกเลิกการเป็นตัวแทนจำหน่่าย</span>
                                        </button>
                                    </li>
                                )}
                                {!isDistributor && (
                                    <li>
                                        <button type='button' className='font-semibold text-left' onClick={() => onUpdateDistributorStatus(id, true)} disabled={isSubmitting}>
                                            <IconDollarSignCircle className='text-green-500 w-4.5 h-4.5 mr-1' />
                                            <span>ตั้งเป็นตัวแทนจำหน่่าย</span>
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
        fetchData();
    }, [page, pageSize, filterState]);

    useEffect(() => {
        return () => {
            clearState();
        };
    }, [clearState]);

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
        formType,
        selectedId,
        isOpenForm,
        onChangeFilterState,
        onCloseForm,
        onAfterSubmitForm
    };
};

export default ViewModel;
