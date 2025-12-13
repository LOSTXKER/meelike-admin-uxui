import { useEffect, useMemo, useState, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/theme';
import { useMasterDataStore } from '@/store/master-data';
import { useTicketStore } from '@/store/ticket';
import { useShallow } from 'zustand/react/shallow';
import { DataTableSortStatus } from 'mantine-datatable';
import moment from 'moment';
import 'moment-timezone';
import ReferenceChip from '../Components/ReferenceChip';
import Status from './Components/Status';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconEye from '@/components/Icon/IconEye';
import IconX from '@/components/Icon/IconX';
import clsx from 'clsx';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconChecks from '@/components/Icon/IconChecks';
import IconOpenBook from '@/components/Icon/IconOpenBook';
import IconTrash from '@/components/Icon/IconTrash';
import IconLockDots from '@/components/Icon/IconLockDots';
import Dropdown from '@/components/Dropdown';

const TIMEZONE = 'Asia/Bangkok';

const PAGE_SIZES = [10, 20, 30, 50, 100];

const INITIAL_FILTER_STATE = {
    sortStatus: {
        columnAccessor: 'ticketId',
        direction: 'desc'
    } as DataTableSortStatus,
    issuedDateStart: null as Date | null,
    issuedDateEnd: null as Date | null,
    issuedDateRanges: [null, null] as (Date | null)[],
    closedDateStart: null as Date | null,
    closedDateEnd: null as Date | null,
    closedDateRanges: [null, null] as (Date | null)[],
    search: '',
    type: '' as string,
    status: '' as string
};

const ViewModel = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );

    const { ticketTypes, ticketStatuses, getTicketTypes, getTicketStatuses } = useMasterDataStore(
        useShallow(state => ({
            ticketTypes: state.ticketTypes,
            ticketStatuses: state.ticketStatuses,
            getTicketTypes: state.getTicketTypes,
            getTicketStatuses: state.getTicketStatuses
        }))
    );

    const {
        data: ticketData,
        totalData: ticketTotalData,
        getAll: getAllTickets,
        changeStatus,
        markAsUnread,
        closeAndLock,
        deleteTicket,
        multipleChangeStatus,
        multipleMarkAsUnread,
        multipleCloseAndLock,
        multipleDelete,
        clearState
    } = useTicketStore(
        useShallow(state => ({
            data: state.data,
            totalData: state.totalData,
            getAll: state.getAll,
            changeStatus: state.changeStatus,
            markAsUnread: state.markAsUnread,
            closeAndLock: state.closeAndLock,
            deleteTicket: state.deleteTicket,
            multipleChangeStatus: state.multipleChangeStatus,
            multipleMarkAsUnread: state.multipleMarkAsUnread,
            multipleCloseAndLock: state.multipleCloseAndLock,
            multipleDelete: state.multipleDelete,
            clearState: state.clearState
        }))
    );

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);
    const issuedDateRef = useRef<any>(null);
    const closedDateRef = useRef<any>(null);

    const [changeStatusMode, setChangeStatusMode] = useState<'single' | 'multiple'>('single');
    const [selecetedChangeStatusTicketId, setSelectedChangeStatusTicketId] = useState<string>('');
    const [isOpenChangeStatusModal, setIsOpenChangeStatusModal] = useState(false);
    const [isHideToConfirmChangeStatus, setIsHideToConfirmChangeStatus] = useState(false);

    const totalData = ticketTotalData;

    const data = useMemo(() => {
        // Since pagination is handled by the API, we return the data as is
        return ticketData;
    }, [ticketData]);

    const ticketTypeOptions = useMemo(() => {
        return ticketTypes.map((type: any) => ({
            label: type.label,
            value: type.value
        }));
    }, [ticketTypes]);

    const ticketStatusOptions = useMemo(() => {
        return ticketStatuses.map((status: any) => ({
            icon: <img src={status.iconUrl} alt={status.label} className='w-[22px] h-[22px] ' />,
            label: status.label,
            value: status.value
        }));
    }, [ticketStatuses]);

    const setupPage = () => {
        setAppName(`รายการตั๋ว`);
        setPageTitle(`รายการตั๋ว | MeeLike`);
    };

    const fetchTickets = () => {
        const filters: any = {
            page,
            limit: pageSize
        };

        // Add search filter if it exists
        if (filterState.search && filterState.search.trim() !== '') {
            filters.search = filterState.search.trim();
        }

        // Add date filters if they exist
        if (filterState.issuedDateRanges?.[0]) {
            filters.createdStart = moment(filterState.issuedDateRanges?.[0]).tz('Asia/Bangkok').format('YYYY-MM-DD');
        }
        if (filterState.issuedDateRanges?.[1]) {
            filters.createdEnd = moment(filterState.issuedDateRanges?.[1]).tz('Asia/Bangkok').format('YYYY-MM-DD');
        }
        if (filterState.closedDateRanges?.[0]) {
            filters.closedStart = moment(filterState.closedDateRanges?.[0]).tz('Asia/Bangkok').format('YYYY-MM-DD');
        }
        if (filterState.closedDateRanges?.[1]) {
            filters.closedEnd = moment(filterState.closedDateRanges?.[1]).tz('Asia/Bangkok').format('YYYY-MM-DD');
        }

        // Add type and status filters if they exist
        if (filterState.type && filterState.type !== '') {
            filters.type = filterState.type;
        }
        if (filterState.status && filterState.status !== '') {
            filters.status = filterState.status;
        }

        setIsLoading(true);
        getAllTickets({
            ...filters
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const onChangeFilterState = (key: string, value: any) => {
        if (key === 'issuedDateStart' || key === 'issuedDateEnd' || key === 'closedDateStart' || key === 'closedDateEnd') {
            if (key === 'issuedDateStart') {
                setFilterState(prevState => ({
                    ...prevState,
                    issuedDateStart: moment(value)
                        .set({
                            hours: 0,
                            minutes: 0,
                            seconds: 0
                        })
                        .toDate()
                }));
            } else if (key === 'issuedDateEnd') {
                setFilterState(prevState => ({
                    ...prevState,
                    issuedDateEnd: moment(value)
                        .set({
                            hours: 23,
                            minutes: 59,
                            seconds: 59
                        })
                        .toDate()
                }));
            } else if (key === 'closedDateStart') {
                setFilterState(prevState => ({
                    ...prevState,
                    closedDateStart: moment(value)
                        .set({
                            hours: 0,
                            minutes: 0,
                            seconds: 0
                        })
                        .toDate()
                }));
            } else if (key === 'closedDateEnd') {
                setFilterState(prevState => ({
                    ...prevState,
                    closedDateEnd: moment(value)
                        .set({
                            hours: 23,
                            minutes: 59,
                            seconds: 59
                        })
                        .toDate()
                }));
            }
        } else {
            setFilterState(prevState => ({
                ...prevState,
                [key]: value
            }));
        }
    };

    const onMarkAsUnread = async (id: string) => {
        const result = await withReactContent(Swal).fire({
            icon: 'warning',
            title: 'ยืนยันการทำเครื่องหมายว่ายังไม่ได้อ่าน',
            text: 'คุณแน่ใจหรือไม่ว่าต้องการทำเครื่องหมายตั๋วนี้ว่ายังไม่ได้อ่าน?',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        });

        if (result.isConfirmed) {
            setIsSubmitting(true);
            const markResult = await markAsUnread(id);
            if (markResult.success) {
                withReactContent(Swal).fire({
                    icon: 'success',
                    title: 'ทำเครื่องหมายว่ายังไม่ได้อ่านสำเร็จ',
                    text: 'ตั๋วถูกทำเครื่องหมายว่ายังไม่ได้อ่านเรียบร้อยแล้ว',
                    confirmButtonText: 'ปิด',
                    confirmButtonColor: '#3085d6'
                });
                fetchTickets();
            } else {
                withReactContent(Swal).fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: markResult.data?.message || 'ไม่สามารถทำเครื่องหมายว่าอ่านได้',
                    confirmButtonText: 'ปิด',
                    confirmButtonColor: '#3085d6'
                });
            }
            setIsSubmitting(false);
        }
    };

    const onCloseAndLock = async (id: string) => {
        const result = await withReactContent(Swal).fire({
            icon: 'warning',
            title: 'ยืนยันการปิดและล็อค',
            text: 'คุณแน่ใจหรือไม่ว่าต้องการปิดและล็อคตั๋วนี้?',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        });
        if (result.isConfirmed) {
            setIsSubmitting(true);
            const closeLockResult = await closeAndLock(id);
            if (closeLockResult.success) {
                withReactContent(Swal).fire({
                    icon: 'success',
                    title: 'ปิดและล็อคสำเร็จ',
                    text: 'ตั๋วถูกปิดและล็อคเรียบร้อยแล้ว',
                    confirmButtonText: 'ปิด',
                    confirmButtonColor: '#3085d6'
                });
                fetchTickets();
            } else {
                withReactContent(Swal).fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: closeLockResult.data?.message || 'ไม่สามารถปิดและล็อคตั๋วได้',
                    confirmButtonText: 'ปิด',
                    confirmButtonColor: '#3085d6'
                });
            }
            setIsSubmitting(false);
        }
    };

    const onDelete = async (id: string) => {
        const result = await withReactContent(Swal).fire({
            icon: 'warning',
            title: 'ยืนยันการลบ',
            text: 'คุณแน่ใจหรือไม่ว่าต้องการลบตั๋วนี้?',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        });

        if (result.isConfirmed) {
            setIsSubmitting(true);
            const deleteResult = await deleteTicket(id);
            if (deleteResult.success) {
                withReactContent(Swal).fire({
                    icon: 'success',
                    title: 'ลบสำเร็จ',
                    text: 'ตั๋วถูกลบเรียบร้อยแล้ว',
                    confirmButtonText: 'ปิด',
                    confirmButtonColor: '#3085d6'
                });
                fetchTickets();
            } else {
                withReactContent(Swal).fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: deleteResult.data?.message || 'ไม่สามารถลบตั๋วได้',
                    confirmButtonText: 'ปิด',
                    confirmButtonColor: '#3085d6'
                });
            }

            setIsSubmitting(false);
        }
    };

    const onChangeStatus = (id: string) => {
        setChangeStatusMode('single');
        setSelectedChangeStatusTicketId(id);
        setIsOpenChangeStatusModal(true);
    };

    const onMultipleChangeStatus = () => {
        if (selectedRecords.length === 0) {
            withReactContent(Swal).fire({
                icon: 'warning',
                title: 'ไม่มีรายการที่เลือก',
                text: 'กรุณาเลือกตั๋วอย่างน้อยหนึ่งรายการเพื่อเปลี่ยนสถานะ',
                confirmButtonText: 'ปิด',
                confirmButtonColor: '#3085d6'
            });
            return;
        } else {
            setChangeStatusMode('multiple');
            setIsOpenChangeStatusModal(true);
        }
    };

    const onSubmitChangeStatus = (status: string) => {
        setIsHideToConfirmChangeStatus(true);
        withReactContent(Swal)
            .fire({
                icon: 'warning',
                title: 'ยืนยันการเปลี่ยนสถานะ',
                text: 'คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนสถานะของตั๋วที่เลือก?',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#3085d6'
            })
            .then(result => {
                if (result.isConfirmed) {
                    if (changeStatusMode === 'single') {
                        changeStatus(selecetedChangeStatusTicketId, status).then(response => {
                            if (response.success) {
                                withReactContent(Swal).fire({
                                    icon: 'success',
                                    title: 'เปลี่ยนสถานะสำเร็จ',
                                    text: 'ตั๋วถูกเปลี่ยนสถานะเรียบร้อย',
                                    confirmButtonText: 'ปิด',
                                    confirmButtonColor: '#3085d6'
                                });
                                fetchTickets();
                                setIsOpenChangeStatusModal(false);
                            } else {
                                withReactContent(Swal).fire({
                                    icon: 'error',
                                    title: 'เกิดข้อผิดพลาด',
                                    text: response.data?.message || 'ไม่สามารถเปลี่ยนสถานะได้',
                                    confirmButtonText: 'ปิด',
                                    confirmButtonColor: '#3085d6'
                                });
                            }
                        });
                    } else if (changeStatusMode === 'multiple') {
                        const formData = new FormData();
                        selectedRecords.forEach(record => {
                            formData.append('ticketIds[]', record.id);
                        });
                        formData.append('status', status);
                        multipleChangeStatus(formData)
                            .then(response => {
                                if (response.success) {
                                    withReactContent(Swal).fire({
                                        icon: 'success',
                                        title: 'เปลี่ยนสถานะสำเร็จ',
                                        text: 'ตั๋วที่เลือกถูกเปลี่ยนสถานะเรียบร้อย',
                                        confirmButtonText: 'ปิด',
                                        confirmButtonColor: '#3085d6'
                                    });
                                    fetchTickets();
                                    setIsOpenChangeStatusModal(false);
                                    setSelectedRecords([]);
                                } else {
                                    withReactContent(Swal).fire({
                                        icon: 'error',
                                        title: 'เกิดข้อผิดพลาด',
                                        text: response.data?.message || 'ไม่สามารถเปลี่ยนสถานะได้',
                                        confirmButtonText: 'ปิด',
                                        confirmButtonColor: '#3085d6'
                                    });
                                }
                            })
                            .catch(error => {
                                console.error('Error changing ticket status:', error);
                                withReactContent(Swal).fire({
                                    icon: 'error',
                                    title: 'เกิดข้อผิดพลาด',
                                    text: 'ไม่สามารถเปลี่ยนสถานะได้',
                                    confirmButtonText: 'ปิด',
                                    confirmButtonColor: '#3085d6'
                                });
                            });
                    }
                } else {
                    setIsHideToConfirmChangeStatus(false);
                }
            });
    };

    const onCloseChangeStatus = () => {
        setIsOpenChangeStatusModal(false);
    };

    const onMultipleMarkAsUnread = () => {
        if (selectedRecords.length === 0) {
            withReactContent(Swal).fire({
                icon: 'warning',
                title: 'ไม่มีรายการที่เลือก',
                text: 'กรุณาเลือกตั๋วอย่างน้อยหนึ่งรายการเพื่อทำเครื่องหมายว่ายังไม่ได้อ่าน',
                confirmButtonText: 'ปิด',
                confirmButtonColor: '#3085d6'
            });
            return;
        } else {
            withReactContent(Swal)
                .fire({
                    icon: 'warning',
                    title: 'ยืนยันการทำเครื่องหมายว่ายังไม่ได้อ่าน',
                    text: 'คุณแน่ใจหรือไม่ว่าต้องการทำเครื่องหมายตั๋วที่เลือกว่ายังไม่ได้อ่าน?',
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยัน',
                    cancelButtonText: 'ยกเลิก',
                    confirmButtonColor: '#3085d6'
                })
                .then(result => {
                    if (result.isConfirmed) {
                        const formData = new FormData();
                        selectedRecords.forEach(record => {
                            formData.append('ticketIds[]', record.id);
                        });
                        multipleMarkAsUnread(formData)
                            .then(response => {
                                if (response.success) {
                                    withReactContent(Swal).fire({
                                        icon: 'success',
                                        title: 'ทำเครื่องหมายว่ายังไม่ได้อ่านสำเร็จ',
                                        text: 'ตั๋วที่เลือกถูกทำเครื่องหมายว่ายังไม่ได้อ่านเรียบร้อย',
                                        confirmButtonText: 'ปิด',
                                        confirmButtonColor: '#3085d6'
                                    });
                                    fetchTickets();
                                    setSelectedRecords([]);
                                } else {
                                    withReactContent(Swal).fire({
                                        icon: 'error',
                                        title: 'เกิดข้อผิดพลาด',
                                        text: response.data?.message || 'ไม่สามารถทำเครื่องหมายว่าอ่านได้',
                                        confirmButtonText: 'ปิด',
                                        confirmButtonColor: '#3085d6'
                                    });
                                }
                            })
                            .catch(error => {
                                console.error('Error marking tickets as unread:', error);
                                withReactContent(Swal).fire({
                                    icon: 'error',
                                    title: 'เกิดข้อผิดพลาด',
                                    text: 'ไม่สามารถทำเครื่องหมายว่าอ่านได้',
                                    confirmButtonText: 'ปิด',
                                    confirmButtonColor: '#3085d6'
                                });
                            });
                    }
                });
        }
    };

    const onMultipleCloseAndLock = () => {
        if (selectedRecords.length === 0) {
            withReactContent(Swal).fire({
                icon: 'warning',
                title: 'ไม่มีรายการที่เลือก',
                text: 'กรุณาเลือกตั๋วอย่างน้อยหนึ่งรายการเพื่อปิดและล็อค',
                confirmButtonText: 'ปิด',
                confirmButtonColor: '#3085d6'
            });
            return;
        } else {
            withReactContent(Swal)
                .fire({
                    icon: 'warning',
                    title: 'ยืนยันการปิดและล็อค',
                    text: 'คุณแน่ใจหรือไม่ว่าต้องการปิดและล็อคตั๋วที่เลือก?',
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยัน',
                    cancelButtonText: 'ยกเลิก',
                    confirmButtonColor: '#3085d6'
                })
                .then(result => {
                    if (result.isConfirmed) {
                        const formData = new FormData();
                        selectedRecords.forEach(record => {
                            formData.append('ticketIds[]', record.id);
                        });
                        multipleCloseAndLock(formData)
                            .then(response => {
                                if (response.success) {
                                    withReactContent(Swal).fire({
                                        icon: 'success',
                                        title: 'ปิดและล็อคสำเร็จ',
                                        text: 'ตั๋วที่เลือกถูกปิดและล็อคเรียบร้อยแล้ว',
                                        confirmButtonText: 'ปิด',
                                        confirmButtonColor: '#3085d6'
                                    });
                                    fetchTickets();
                                    setSelectedRecords([]);
                                } else {
                                    withReactContent(Swal).fire({
                                        icon: 'error',
                                        title: 'เกิดข้อผิดพลาด',
                                        text: response.data?.message || 'ไม่สามารถปิดและล็อคตั๋วได้',
                                        confirmButtonText: 'ปิด',
                                        confirmButtonColor: '#3085d6'
                                    });
                                }
                            })
                            .catch(error => {
                                console.error('Error closing and locking tickets:', error);
                                withReactContent(Swal).fire({
                                    icon: 'error',
                                    title: 'เกิดข้อผิดพลาด',
                                    text: 'ไม่สามารถปิดและล็อคตั๋วได้',
                                    confirmButtonText: 'ปิด',
                                    confirmButtonColor: '#3085d6'
                                });
                            });
                    }
                });
        }
    };

    const onMultipleDelete = () => {
        if (selectedRecords.length === 0) {
            withReactContent(Swal).fire({
                icon: 'warning',
                title: 'ไม่มีรายการที่เลือก',
                text: 'กรุณาเลือกตั๋วอย่างน้อยหนึ่งรายการเพื่อลบ',
                confirmButtonText: 'ปิด',
                confirmButtonColor: '#3085d6'
            });
            return;
        } else {
            withReactContent(Swal)
                .fire({
                    icon: 'warning',
                    title: 'ยืนยันการลบ',
                    text: 'คุณแน่ใจหรือไม่ว่าต้องการลบตั๋วที่เลือก?',
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยัน',
                    cancelButtonText: 'ยกเลิก',
                    confirmButtonColor: '#3085d6'
                })
                .then(result => {
                    if (result.isConfirmed) {
                        const formData = new FormData();
                        selectedRecords.forEach(record => {
                            formData.append('ticketIds[]', record.id);
                        });
                        multipleDelete(formData)
                            .then(response => {
                                if (response.success) {
                                    withReactContent(Swal).fire({
                                        icon: 'success',
                                        title: 'ลบสำเร็จ',
                                        text: 'ตั๋วที่เลือกถูกลบเรียบร้อยแล้ว',
                                        confirmButtonText: 'ปิด',
                                        confirmButtonColor: '#3085d6'
                                    });
                                    fetchTickets();
                                    setSelectedRecords([]);
                                } else {
                                    withReactContent(Swal).fire({
                                        icon: 'error',
                                        title: 'เกิดข้อผิดพลาด',
                                        text: response.data?.message || 'ไม่สามารถลบตั๋วได้',
                                        confirmButtonText: 'ปิด',
                                        confirmButtonColor: '#3085d6'
                                    });
                                }
                            })
                            .catch(error => {
                                console.error('Error deleting tickets:', error);
                                withReactContent(Swal).fire({
                                    icon: 'error',
                                    title: 'เกิดข้อผิดพลาด',
                                    text: 'ไม่สามารถลบตั๋วได้',
                                    confirmButtonText: 'ปิด',
                                    confirmButtonColor: '#3085d6'
                                });
                            });
                    }
                });
        }
    };

    const columns: any[] = [
        {
            accessor: 'ticketCode',
            title: 'รหัสตั๋ว',
            sortable: false,
            render: ({ ticketCode }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{ticketCode}</div>
                </Fragment>
            )
        },
        {
            accessor: 'user',
            title: 'ผู้ใช้งาน',
            sortable: false,
            render: ({ user }: any) => (
                <Fragment>
                    <div className='text-meelike-dark font-semibold'>{user?.name}</div>
                    <div className='text-gray-400'>User ID: {user?.id}</div>
                    <span className='badge font-bold text-meelike-pink bg-white border-meelike-pink cursor-pointer hover:opacity-70 transition-all'>
                        {user?.membership?.membershipLevelLabel || 'N/A'}
                    </span>
                </Fragment>
            )
        },
        {
            accessor: 'subject',
            width: 500,
            title: 'รายละเอียดตั๋ว',
            sortable: true,
            render: ({ subject, id, isLocked, isRead }: any) => (
                <Fragment>
                    <div className='flex flex-row items-center gap-2'>
                        <div
                            className='font-semibold text-sm whitespace-normal underline text-primary cursor-pointer'
                            onClick={() => {
                                navigate(`/tickets/${id}`);
                            }}
                        >
                            {subject}
                        </div>
                        <div>
                            {isLocked && (
                                <div className='text-orange-500 flex flex-row items-center gap-1'>
                                    <IconLockDots className='w-4.5 h-4.5 text-danger' />
                                    <span>Locked</span>
                                </div>
                            )}
                            {!isRead && (
                                <div className='text-primary flex flex-row items-center gap-1'>
                                    <IconOpenBook className='w-4.5 h-4.5' />
                                    <span>Unread</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'ticketOrderLinks',
            title: 'รหัสอ้างอิง',
            sortable: true,
            render: ({ ticketOrderLinks = [] }: any) => (
                <Fragment>
                    <div className='flex flex-wrap gap-3'>
                        {ticketOrderLinks.slice(0, 5).map((item: any, index: number) => (
                            <ReferenceChip key={`reference-chip-${index + 1}`} label={item.order?.orderCode || `Order ${item.orderId}`} />
                        ))}
                        {ticketOrderLinks.length > 5 && <div className='text-meelike-dark'>และอีก {ticketOrderLinks.length - 5} รายการ</div>}
                        {ticketOrderLinks.length === 0 && <div className='text-meelike-dark'>-</div>}
                    </div>
                </Fragment>
            )
        },
        {
            accessor: 'type',
            title: 'ประเภทตั๋ว',
            sortable: true,
            render: ({ typeLabelTh, subType, subTypeLabelTh }: any) => (
                <div className='text-center max-w-[200px] text-wrap'>
                    <div className='text-meelike-dark font-semibold'>{typeLabelTh}</div>
                    {subType && <div className='text-gray-400 text-sm'>{subTypeLabelTh}</div>}
                </div>
            )
        },
        {
            accessor: 'createdAt',
            title: 'วันที่ออกตั๋ว',
            sortable: true,
            render: ({ createdAt }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{createdAt ? moment(createdAt).tz(TIMEZONE).format('DD/MM/YYYY HH:mm') : '-'}</div>
                </Fragment>
            )
        },
        {
            accessor: 'closedAt',
            title: 'วันที่ปิดตั๋ว',
            sortable: true,
            render: ({ closedAt }: any) => (
                <Fragment>
                    <div className='text-meelike-dark'>{closedAt ? moment(closedAt).tz(TIMEZONE).format('DD/MM/YYYY HH:mm') : '-'}</div>
                </Fragment>
            )
        },
        {
            accessor: 'status',
            title: 'สถานะตั๋ว',
            sortable: false,
            render: ({ status }: any) => (
                <Fragment>
                    <Status status={status} />
                </Fragment>
            )
        },
        {
            accessor: 'actions',
            title: '',
            sortable: false,
            render: ({ id, status }: any) => {
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
                                            <Link to={`/tickets/${id}`}>
                                                <button type='button' className='font-semibold text-left flex flex-row' disabled={isSubmitting}>
                                                    <IconEye className='w-4.5 h-4.5 mr-1' />
                                                    <span>Detail</span>
                                                </button>
                                            </Link>
                                        </li>
                                        <li>
                                            <button type='button' className='font-semibold text-left' onClick={() => onChangeStatus(id)} disabled={isSubmitting}>
                                                <IconChecks className='w-4.5 h-4.5 mr-1' />
                                                <span>Change Status</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button type='button' className='font-semibold text-left' onClick={() => onMarkAsUnread(id)} disabled={isSubmitting}>
                                                <IconOpenBook className='w-4.5 h-4.5 mr-1' />
                                                <span>Mark As Unread</span>
                                            </button>
                                        </li>
                                        {(status === 'OPEN' || status === 'ANSWERED') && (
                                            <li>
                                                <button type='button' className='font-semibold text-left' onClick={() => onCloseAndLock(id)} disabled={isSubmitting}>
                                                    <IconLockDots className='w-4.5 h-4.5 mr-1' />
                                                    <span>Close and Lock</span>
                                                </button>
                                            </li>
                                        )}
                                        <li>
                                            <button type='button' className='font-semibold text-left' onClick={() => onDelete(id)} disabled={isSubmitting}>
                                                <IconTrash className='w-4.5 h-4.5 mr-1' />
                                                <span>Delete</span>
                                            </button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                    </Fragment>
                );
            }
        }
    ];

    useEffect(() => {
        setupPage();
    }, [i18n.language]);

    useEffect(() => {
        // Fetch master data when component mounts
        const fetchMasterData = async () => {
            if (ticketTypes.length === 0) {
                await getTicketTypes();
            }
            if (ticketStatuses.length === 0) {
                await getTicketStatuses();
            }
        };

        fetchMasterData();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [pageSize, filterState]);

    useEffect(() => {
        // Fetch tickets when page, pageSize, or filters change
        if (ticketTypeOptions.length > 0 && ticketStatusOptions.length > 0) {
            fetchTickets();
        }
    }, [page, pageSize, filterState, ticketTypeOptions, ticketStatusOptions]);

    useEffect(() => {
        return () => {
            setAppName('');
            clearState();
        };
    }, []);

    return {
        isLoading,
        isSubmitting,
        t,
        TIMEZONE,
        PAGE_SIZES,
        ticketTypeOptions,
        ticketStatusOptions,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalData,
        data,
        columns,
        filterState,
        issuedDateRef,
        closedDateRef,
        isOpenChangeStatusModal,
        isHideToConfirmChangeStatus,
        selectedRecords,
        setSelectedRecords,
        onChangeFilterState,
        onMultipleChangeStatus,
        onSubmitChangeStatus,
        onCloseChangeStatus,
        onMultipleMarkAsUnread,
        onMultipleCloseAndLock,
        onMultipleDelete
    };
};

export default ViewModel;
