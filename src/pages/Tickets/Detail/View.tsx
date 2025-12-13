import { type FC, Fragment, useEffect, useRef } from 'react';

import IconFile from '@/components/Icon/IconFile';
import IconSend from '@/components/Icon/IconSend';
import ReferenceChip from '../Components/ReferenceChip';
import Attachment from './Components/Attachment';
import SupportMessageBox from './Components/SupportMessageBox';
import UserMessageBox from './Components/UserMessageBox';
import TicketChangeStatusModalView from '../ChangeStatus/View';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconChecks from '@/components/Icon/IconChecks';
import IconOpenBook from '@/components/Icon/IconOpenBook';
import IconTrash from '@/components/Icon/IconTrash';
import IconLockDots from '@/components/Icon/IconLockDots';

import useViewModel from './ViewModel';
import { clsx } from '@mantine/core';

const TicketDetailView: FC = () => {
    const {
        t,
        data,
        finaleRequiredFields,
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
    } = useViewModel();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom function
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (messagesContainerRef.current) {
            // Fallback: scroll the container to bottom
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    // Auto-scroll to bottom when data loads or new messages are added
    useEffect(() => {
        if (data?.threadReplies) {
            // Use setTimeout to ensure DOM has been updated
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [data?.threadReplies]);

    // Enhanced sendReply function that includes auto-scroll
    const handleSendReply = async () => {
        await sendReply();
        // Small delay to ensure the message is added to the DOM before scrolling
        setTimeout(() => {
            scrollToBottom();
        }, 200);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>No ticket data found</div>;
    }

    return (
        <Fragment>
            <TicketChangeStatusModalView
                isSubmitting={sending}
                isHideToConfirm={isHideToConfirmChangeStatus}
                isOpen={isOpenChangeStatusModal}
                handleClose={onCloseChangeStatus}
                handleSubmit={onSubmitChangeStatus}
            />

            <div className='grid grid-cols-12 gap-y-5 lg:gap-5'>
                {/* Detail */}
                <div className='col-span-12'>
                    <div className='panel p-[1.25rem] '>
                        <div className='grid grid-cols-12 gap-[1.25rem]'>
                            {/* Header */}
                            <div className='col-span-12'>
                                <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
                                    <div className='flex flex-col lg:flex-row lg:items-center gap-3'>
                                        <span className='text-lg font-bold text-meelike-dark lg:max-w-[1000px] whitespace-normal truncate '>{data?.subject}</span>
                                        <div className='btn bg-meelike-secondary font-bold text-meelike-dark text-center px-4 py-2 shadow border-none pointer-events-none w-auto'>
                                            {data?.typeLabelTh}
                                        </div>
                                        {data?.subType && (
                                            <div className='btn bg-meelike-white font-bold text-meelike-dark border-meelike-dark border text-center px-4 py-2 shadow-lg pointer-events-none w-auto'>
                                                {data?.subTypeLabelTh}
                                            </div>
                                        )}
                                        <div className='lg:max-w-[300px] flex flex-wrap gap-3'>
                                            {data?.ticketOrderLinks?.map((link: any, index: number) => (
                                                <ReferenceChip key={`reference-${index + 1}`} label={link.order.orderCode} />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <span
                                            className={clsx(`badge font-bold text-white`, {
                                                'bg-meelike-ticket-status-open': data?.status === 'PENDING',
                                                'bg-meelike-ticket-status-closed': data?.status === 'ANSWERED',
                                                'bg-meelike-danger': data?.status === 'CLOSED'
                                            })}
                                        >
                                            {data?.status === 'PENDING' && 'รอดำเนินการ'}
                                            {data?.status === 'ANSWERED' && 'ตอบแล้ว'}
                                            {data?.status === 'CLOSED' && 'ปิด'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='col-span-12'>
                                <div className='text-meelike-dark-2'>
                                    ผู้ใช้งาน: {data?.user?.username || ''} (ID: {data?.user?.id}) (Email: {data?.user?.email || ''})
                                </div>
                            </div>

                            {finaleRequiredFields.includes('longOrderIds') && (
                                <div className='col-span-12'>
                                    <div className='text-meelike-dark-2 text-lg'>หมายเลขคำสั่งซื้อ: {data?.longOrderIds || ''}</div>
                                </div>
                            )}

                            {finaleRequiredFields.includes('transactionCode') && (
                                <div className='col-span-12'>
                                    <div className='text-meelike-dark-2 text-lg'>รหัสการทำรายการธุรกรรม: {data?.transactionCode || ''}</div>
                                </div>
                            )}

                            {finaleRequiredFields.includes('paymentAmount') && (
                                <div className='col-span-12'>
                                    <div className='text-meelike-dark-2 text-lg'>จำนวนเงินที่ชำระ: {data?.paymentAmount || ''}</div>
                                </div>
                            )}

                            {finaleRequiredFields.includes('agentUsername') && (
                                <div className='col-span-12'>
                                    <div className='text-meelike-dark-2 text-lg'>ชื่อผู้ใช้งานของตัวแทน: {data?.agentUsername || ''}</div>
                                </div>
                            )}

                            <div className='col-span-12'>
                                <div className='text-[#888EA8] text-lg' dangerouslySetInnerHTML={{ __html: data?.ticketMessage || '' }}></div>
                            </div>

                            {(data?.attachments ?? []).length > 0 && (
                                <div className='col-span-12'>
                                    <div className='flex flex-wrap gap-3'>
                                        {data?.attachments?.map((attachment: any, index: number) => (
                                            <Attachment key={`attachment-${index + 1}`} url={attachment.filePathUrl} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* <div className='col-span-12'>
                                <button
                                    onClick={() => navigate(-1)}
                                    type='button'
                                    className=' btn bg-gray-300 shadow rounded-lg text-meelike-dark font-bold text-xs lg:text-sm px-4 py-2 hover:opacity-80 border-none mb-4'
                                >
                                    ย้อนกลับ
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Reply Messages */}
                <div className='col-span-12'>
                    <div className='panel p-[1.25rem] h-[50vh] overflow-y-auto' ref={messagesContainerRef}>
                        <div className='grid grid-cols-12 lg:gap-5'>
                            {data?.threadReplies && data?.threadReplies.length > 0 ? (
                                data?.threadReplies
                                    ?.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                    ?.map((reply: any, index: number) => {
                                        const messageContent = reply.replyType === 'IMAGE' || reply.replyType === 'VIDEO' ? reply.attachment?.filePathUrl : reply.message;

                                        const getMessageType = (replyType: string) => {
                                            switch (replyType) {
                                                case 'IMAGE':
                                                    return 'file';
                                                case 'VIDEO':
                                                    return 'video';
                                                case 'TEXT':
                                                default:
                                                    return 'text';
                                            }
                                        };

                                        if (reply.senderRole === 'ADMIN') {
                                            return (
                                                <div key={`message-${index + 1}`} className='col-span-12 flex justify-start'>
                                                    <SupportMessageBox author={'Admin'} messageType={getMessageType(reply.replyType)} message={messageContent || ''} time={reply.createdAt} />
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={`message-${index + 1}`} className='col-span-12 flex justify-end'>
                                                <UserMessageBox
                                                    author={data?.user?.name || 'User'}
                                                    messageType={getMessageType(reply.replyType)}
                                                    message={messageContent || ''}
                                                    time={reply.createdAt}
                                                />
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className='col-span-12 flex justify-center'>
                                    <div className='text-gray-500 text-center py-8'>ไม่มีการตอบกลับ</div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                {data?.isLocked === false && (
                    <div className='col-span-12'>
                        <div className='panel p-[1.25rem]'>
                            <div className='grid grid-cols-12 gap-[1.25rem]'>
                                <div className='col-span-12 lg:col-span-10'>
                                    <textarea
                                        id='message'
                                        rows={5}
                                        placeholder='พิมพ์ข้อมูลของคุณ...'
                                        className='form-input'
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        disabled={sending || isSubmitting}
                                    />
                                    {selectedFile && (
                                        <div className='mt-2 p-2 bg-gray-100 rounded'>
                                            <span className='text-sm text-gray-600'>ไฟล์แนบ: {selectedFile.name}</span>
                                            <button type='button' onClick={() => setSelectedFile(null)} className='ml-2 text-red-500 hover:text-red-700' disabled={sending || isSubmitting}>
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className='col-span-12 lg:col-span-2 flex flex-col justify-center'>
                                    <input
                                        type='file'
                                        id='fileInput'
                                        className='hidden'
                                        accept='image/*,video/*'
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleFileSelect(file);
                                            }
                                        }}
                                    />

                                    <button
                                        type='button'
                                        className='btn bg-meelike-secondary shadow rounded-lg text-meelike-dark font-bold text-xs lg:text-sm px-4 py-2 hover:opacity-80 border-none w-full mb-4'
                                        onClick={() => document.getElementById('fileInput')?.click()}
                                        disabled={sending || isSubmitting}
                                    >
                                        <IconFile className='mr-2 text-meelike-dark-2' fill />
                                        แนบไฟล์
                                    </button>
                                    <button
                                        type='button'
                                        className='btn bg-meelike-primary shadow rounded-lg text-meelike-dark font-bold text-xs lg:text-sm px-4 py-2 hover:opacity-80 border-none w-full mb-4'
                                        onClick={handleSendReply}
                                        disabled={sending || (!message.trim() && !selectedFile) || isSubmitting}
                                    >
                                        {!isSubmitting && <IconSend className='mr-2 text-meelike-dark-2' fill />}
                                        {!isSubmitting && sending ? 'กำลังส่ง' : 'ส่งข้อความ'}
                                        {isSubmitting && 'กำลังดำเนินการ...'}
                                    </button>
                                    <div className='dropdown'>
                                        <Dropdown
                                            placement={'bottom-end'}
                                            btnClassName='btn btn-primary px-4 py-2 w-full'
                                            button={
                                                <Fragment>
                                                    <div className='flex flex-row items-center gap-2'>
                                                        <IconCaretDown className='inline-block' />
                                                        Actions
                                                    </div>
                                                </Fragment>
                                            }
                                            buttonDisabled={isSubmitting || sending}
                                        >
                                            <ul className='!min-w-[300px]'>
                                                <li>
                                                    <button type='button' className='font-semibold text-left' onClick={() => onChangeStatus(data?.id)} disabled={isSubmitting}>
                                                        <IconChecks className='w-4.5 h-4.5 mr-1' />
                                                        <span>Change Status</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button type='button' className='font-semibold text-left' onClick={() => onMarkAsUnread(data?.id)} disabled={isSubmitting}>
                                                        <IconOpenBook className='w-4.5 h-4.5 mr-1' />
                                                        <span>Mark As Unread</span>
                                                    </button>
                                                </li>
                                                {(data?.status === 'OPEN' || data?.status === 'ANSWERED') && (
                                                    <li>
                                                        <button type='button' className='font-semibold text-left' onClick={() => onCloseAndLock(data?.id)} disabled={isSubmitting}>
                                                            <IconLockDots className='w-4.5 h-4.5 mr-1' />
                                                            <span>Close and Lock</span>
                                                        </button>
                                                    </li>
                                                )}
                                                <li>
                                                    <button type='button' className='font-semibold text-left' onClick={() => onDelete(data?.id)} disabled={isSubmitting}>
                                                        <IconTrash className='w-4.5 h-4.5 mr-1' />
                                                        <span>Delete</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default TicketDetailView;
