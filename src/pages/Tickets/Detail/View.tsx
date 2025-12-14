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
import IconArrowLeft from '@/components/Icon/IconArrowLeft';
import { useNavigate } from 'react-router-dom';

import useViewModel from './ViewModel';
import { clsx } from '@mantine/core';

const TicketDetailView: FC = () => {
    const navigate = useNavigate();
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

    // Hide footer on ticket detail page for full-screen chat experience
    useEffect(() => {
        // Find and hide the footer
        const mainContent = document.querySelector('.main-content');
        const allDivs = document.querySelectorAll('.main-content > div');
        let footerElement: Element | null = null;

        allDivs.forEach(div => {
            if (div.textContent?.includes('MeeLike All rights reserved')) {
                footerElement = div;
                (div as HTMLElement).style.display = 'none';
            }
        });

        // Prevent main-content from scrolling
        if (mainContent) {
            (mainContent as HTMLElement).style.overflow = 'hidden';
            (mainContent as HTMLElement).style.height = '100vh';
        }

        return () => {
            if (footerElement) {
                (footerElement as HTMLElement).style.display = '';
            }
            if (mainContent) {
                (mainContent as HTMLElement).style.overflow = '';
                (mainContent as HTMLElement).style.height = '';
            }
        };
    }, []);

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

            {/* Chat Container - Full Height, Extends to Bottom Edge */}
            <div className='-m-6 flex flex-col overflow-hidden' style={{ height: 'calc(100vh - 60px)' }}>
                {/* Sticky Header - User Info & Ticket Details */}
                <div className='bg-gradient-to-r from-meelike-dark to-gray-800 text-white px-6 py-4 flex-shrink-0'>
                    <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center gap-4'>
                            {/* Back Button */}
                            <button
                                type='button'
                                onClick={() => navigate('/tickets')}
                                className='p-2 -ml-2 mr-1 hover:bg-white/10 rounded-full transition-colors'
                            >
                                <IconArrowLeft className='w-6 h-6 rotate-180' />
                            </button>

                            {/* User Avatar */}
                            <div className='w-12 h-12 bg-meelike-primary rounded-full flex items-center justify-center text-meelike-dark font-bold text-lg'>
                                {(data?.user?.name || data?.user?.username || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                                <h2 className='text-xl font-bold'>{data?.user?.name || data?.user?.username || 'User'}</h2>
                                <p className='text-gray-300 text-sm'>ID: {data?.user?.id} • {data?.user?.email || ''}</p>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <button
                                type='button'
                                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-apple font-semibold transition-colors text-sm'
                                onClick={() => (window.location.href = `/orders?userId=${data?.user?.id}`)}
                            >
                                Orders
                            </button>
                            <button
                                type='button'
                                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-apple font-semibold transition-colors text-sm'
                                onClick={() => (window.location.href = `/payments?userId=${data?.user?.id}`)}
                            >
                                Payments
                            </button>
                        </div>
                    </div>

                    {/* Ticket Info Bar */}
                    <div className='flex items-center gap-3 flex-wrap'>
                        <span className='px-3 py-1 bg-white/20 backdrop-blur rounded-apple text-sm font-semibold'>{data?.ticketCode}</span>
                        <span className='px-3 py-1 bg-white/20 backdrop-blur rounded-apple text-sm'>{data?.typeLabelTh}</span>
                        {data?.subType && <span className='px-3 py-1 bg-white/20 backdrop-blur rounded-apple text-sm'>{data?.subTypeLabelTh}</span>}
                        <span
                            className={clsx(`px-3 py-1 rounded-apple text-white font-semibold text-sm`, {
                                'bg-orange-500': data?.status === 'PENDING',
                                'bg-green-500': data?.status === 'ANSWERED',
                                'bg-red-500': data?.status === 'CLOSED'
                            })}
                        >
                            {data?.status === 'PENDING' && 'รอดำเนินการ'}
                            {data?.status === 'ANSWERED' && 'ตอบแล้ว'}
                            {data?.status === 'CLOSED' && 'ปิด'}
                        </span>
                        {data?.ticketOrderLinks && data?.ticketOrderLinks.length > 0 && (
                            <div className='flex gap-2'>
                                {data?.ticketOrderLinks?.map((link: any, index: number) => (
                                    <ReferenceChip key={`reference-${index + 1}`} label={link.order.orderCode} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Scrollable Chat Area */}
                <div className='flex-1 overflow-y-auto bg-gray-50 p-6' ref={messagesContainerRef}>
                    <div className='max-w-4xl mx-auto space-y-4'>
                        {/* Original Ticket Message */}
                        <div className='bg-blue-50 border-l-4 border-blue-500 rounded-r-apple p-4'>
                            <div className='flex items-start gap-3'>
                                <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0'>
                                    {(data?.user?.name || data?.user?.username || 'U')[0].toUpperCase()}
                                </div>
                                <div className='flex-1'>
                                    <div className='font-semibold text-blue-900 mb-1'>{data?.subject}</div>
                                    <div className='text-gray-700 text-sm' dangerouslySetInnerHTML={{ __html: data?.ticketMessage || '' }}></div>
                                    {(data?.attachments ?? []).length > 0 && (
                                        <div className='mt-3 flex flex-wrap gap-2'>
                                            {data?.attachments?.map((attachment: any, index: number) => (
                                                <Attachment key={`attachment-${index + 1}`} url={attachment.filePathUrl} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
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
                                            <div key={`message-${index + 1}`} className='flex justify-start'>
                                                <SupportMessageBox author={'Admin'} messageType={getMessageType(reply.replyType)} message={messageContent || ''} time={reply.createdAt} />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={`message-${index + 1}`} className='flex justify-end'>
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
                            <div className='text-center py-8 text-gray-400'>ยังไม่มีการตอบกลับ</div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Footer - Input Area */}
                {data?.isLocked === false ? (
                    <div className='border-t border-gray-200 bg-white p-4 flex-shrink-0'>
                        <div className='max-w-4xl mx-auto'>
                            {/* File Preview */}
                            {selectedFile && (
                                <div className='mb-3 p-3 bg-blue-50 rounded-apple flex items-center justify-between'>
                                    <span className='text-sm text-blue-700 flex items-center gap-2'>
                                        <IconFile className='w-4 h-4' />
                                        {selectedFile.name}
                                    </span>
                                    <button type='button' onClick={() => setSelectedFile(null)} className='text-red-500 hover:text-red-700 font-bold text-lg' disabled={sending || isSubmitting}>
                                        ×
                                    </button>
                                </div>
                            )}

                            {/* Input Row */}
                            <div className='flex items-end gap-2'>
                                {/* Attach Button */}
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
                                    className='p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors flex-shrink-0'
                                    onClick={() => document.getElementById('fileInput')?.click()}
                                    disabled={sending || isSubmitting}
                                    title='แนบไฟล์'
                                >
                                    <IconFile className='w-5 h-5' />
                                </button>

                                {/* Message Input */}
                                <textarea
                                    id='message'
                                    rows={1}
                                    placeholder='พิมพ์ข้อความ...'
                                    className='flex-1 px-4 py-3 rounded-apple border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            if (message.trim() || selectedFile) {
                                                handleSendReply();
                                            }
                                        }
                                    }}
                                    disabled={sending || isSubmitting}
                                    style={{ minHeight: '48px', maxHeight: '120px' }}
                                />

                                {/* Send Button */}
                                <button
                                    type='button'
                                    className='p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
                                    onClick={handleSendReply}
                                    disabled={sending || (!message.trim() && !selectedFile) || isSubmitting}
                                    title='ส่งข้อความ'
                                >
                                    <IconSend className='w-5 h-5' fill />
                                </button>

                                {/* Actions Dropdown */}
                                <Dropdown
                                    placement={'top-end'}
                                    btnClassName='p-3 bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-colors flex-shrink-0'
                                    button={
                                        <Fragment>
                                            <IconCaretDown className='w-5 h-5' />
                                        </Fragment>
                                    }
                                    buttonDisabled={isSubmitting || sending}
                                >
                                    <ul className='!min-w-[200px]'>
                                        <li>
                                            <button type='button' className='font-semibold text-left w-full' onClick={() => onChangeStatus(data?.id)} disabled={isSubmitting}>
                                                <IconChecks className='w-4.5 h-4.5 mr-2' />
                                                <span>Change Status</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button type='button' className='font-semibold text-left w-full' onClick={() => onMarkAsUnread(data?.id)} disabled={isSubmitting}>
                                                <IconOpenBook className='w-4.5 h-4.5 mr-2' />
                                                <span>Mark as unread</span>
                                            </button>
                                        </li>
                                        {(data?.status === 'OPEN' || data?.status === 'ANSWERED' || data?.status === 'PENDING') && (
                                            <li>
                                                <button type='button' className='font-semibold text-left w-full' onClick={() => onCloseAndLock(data?.id)} disabled={isSubmitting}>
                                                    <IconLockDots className='w-4.5 h-4.5 mr-2' />
                                                    <span>Close and lock</span>
                                                </button>
                                            </li>
                                        )}
                                        <li>
                                            <button type='button' className='font-semibold text-left w-full text-red-600' onClick={() => onDelete(data?.id)} disabled={isSubmitting}>
                                                <IconTrash className='w-4.5 h-4.5 mr-2' />
                                                <span>Delete ticket</span>
                                            </button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='border-t border-gray-200 bg-orange-50 p-6 flex-shrink-0'>
                        <div className='max-w-4xl mx-auto text-center'>
                            <IconLockDots className='w-12 h-12 text-orange-500 mx-auto mb-2' />
                            <p className='text-orange-700 font-semibold'>ตั๋วนี้ถูกปิดและล็อคแล้ว ไม่สามารถตอบกลับได้</p>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default TicketDetailView;
