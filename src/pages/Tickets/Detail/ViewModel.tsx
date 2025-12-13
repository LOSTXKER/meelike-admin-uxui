import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/theme';
import { useTicketStore } from '@/store/ticket';
import { useMasterDataStore } from '@/store/master-data';
import { useShallow } from 'zustand/react/shallow';
import { useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const ViewModel = () => {
    const { t, i18n } = useTranslation();
    const { ticketId: id } = useParams<{ ticketId: string }>();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [sending, setSending] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );

    const { ticketTypes, getTicketTypes } = useMasterDataStore(
        useShallow(state => ({
            ticketTypes: state.ticketTypes,
            getTicketTypes: state.getTicketTypes
        }))
    );

    const {
        selected: data,
        getOne,
        replyThread,
        changeStatus,
        markAsUnread,
        closeAndLock,
        deleteTicket,
        clearState
    } = useTicketStore(
        useShallow(state => ({
            selected: state.selected,
            getOne: state.getOne,
            replyThread: state.replyThread,
            changeStatus: state.changeStatus,
            markAsUnread: state.markAsUnread,
            closeAndLock: state.closeAndLock,
            deleteTicket: state.deleteTicket,
            clearState: state.clearState
        }))
    );

    const [selecetedChangeStatusTicketId, setSelectedChangeStatusTicketId] = useState<string>('');
    const [isOpenChangeStatusModal, setIsOpenChangeStatusModal] = useState(false);
    const [isHideToConfirmChangeStatus, setIsHideToConfirmChangeStatus] = useState(false);

    const ticketSubTypesOptions = useMemo(() => {
        return ticketTypes.find(type => type.value === data?.type)?.subTypes || [];
    }, [data]);

    const ticketTypeRequiredFields = ticketTypes.find(type => type.value === data?.type)?.requiredFields || [];
    const ticketSubTypeRequiredFields = ticketSubTypesOptions.find((sub: any) => sub.value === data?.subType)?.requiredFields || [];
    const finaleRequiredFields = useMemo(() => {
        return [...ticketTypeRequiredFields, ...ticketSubTypeRequiredFields];
    }, [ticketTypeRequiredFields, ticketSubTypeRequiredFields]);

    const setupPage = () => {
        setAppName('ตั๋ว');
        setPageTitle(`ตั๋ว | MeeLike`);
    };

    const fetchTicketDetail = async () => {
        if (id) {
            setLoading(true);
            try {
                getTicketTypes();
                const result = await getOne(id);
                if (!result.success) {
                    console.error('Error fetching ticket detail:', result.data);
                }
            } catch (error) {
                console.error('Error fetching ticket detail:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const getFileType = (file: File): 'IMAGE' | 'VIDEO' => {
        if (file.type.startsWith('image/')) {
            return 'IMAGE';
        } else if (file.type.startsWith('video/')) {
            return 'VIDEO';
        }
        // Default to IMAGE for other file types
        return 'IMAGE';
    };

    const sendReply = async () => {
        if (!id) return;

        if (!message.trim() && !selectedFile) {
            return; // Don't send empty messages
        }

        setSending(true);

        try {
            const formData = new FormData();

            if (selectedFile) {
                // Sending file attachment
                const fileType = getFileType(selectedFile);
                formData.append('replyType', fileType);
                formData.append('attachment', selectedFile);
                formData.append('message', ''); // Empty message for file uploads
            } else {
                // Sending text message
                formData.append('replyType', 'TEXT');
                formData.append('message', message.trim());
            }

            const result = await replyThread(id, formData);

            if (result.success) {
                // Clear inputs after successful send
                setMessage('');
                setSelectedFile(null);
                // Refresh ticket detail to show new reply
                await fetchTicketDetail();
            } else {
                console.error('Error sending reply:', result.data);

                // Handle specific error case for closed tickets
                if (result.data?.status === 400 && result.data?.message === 'Ticket is closed, unable to reply') {
                    withReactContent(Swal).fire({
                        icon: 'warning',
                        title: 'ไม่สามารถตอบกลับได้',
                        text: result.data?.message || 'ตั๋วนี้ถูกปิดแล้ว ไม่สามารถตอบกลับได้',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#3085d6'
                    });
                } else {
                    // Handle other errors
                    withReactContent(Swal).fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: result.data?.message || 'ไม่สามารถส่งข้อความได้',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#3085d6'
                    });
                }
            }
        } catch (error) {
            console.error('Error sending reply:', error);
        } finally {
            setSending(false);
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
                fetchTicketDetail();
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
                fetchTicketDetail();
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
                fetchTicketDetail();
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
        setSelectedChangeStatusTicketId(id);
        setIsOpenChangeStatusModal(true);
    };

    const onCloseChangeStatus = () => {
        setIsOpenChangeStatusModal(false);
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
                    setIsSubmitting(true);
                    changeStatus(selecetedChangeStatusTicketId, status).then(response => {
                        if (response.success) {
                            withReactContent(Swal).fire({
                                icon: 'success',
                                title: 'เปลี่ยนสถานะสำเร็จ',
                                text: 'ตั๋วถูกเปลี่ยนสถานะเรียบร้อย',
                                confirmButtonText: 'ปิด',
                                confirmButtonColor: '#3085d6'
                            });
                            fetchTicketDetail();
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
                        setIsSubmitting(false);
                    });
                } else {
                    setIsHideToConfirmChangeStatus(false);
                }
            });
    };

    useEffect(() => {
        setupPage();
    }, [i18n.language]);

    useEffect(() => {
        // Clear previous data when ID changes
        clearState();
        fetchTicketDetail();
    }, [id]);

    useEffect(() => {
        return () => {
            setAppName('');
            clearState();
        };
    }, []);

    return {
        t,
        finaleRequiredFields,
        data,
        loading,
        message,
        setMessage,
        selectedFile,
        setSelectedFile,
        handleFileSelect,
        sendReply,
        sending,
        isSubmitting,
        isOpenChangeStatusModal,
        onMarkAsUnread,
        onCloseAndLock,
        onDelete,
        onChangeStatus,
        onCloseChangeStatus,
        onSubmitChangeStatus,
        isHideToConfirmChangeStatus
    };
};

export default ViewModel;
