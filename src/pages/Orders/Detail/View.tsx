import { type FC, Fragment } from 'react';

import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import Status from '../Components/Status';

import useViewModel, { Props } from './ViewModel';
import { Link } from 'react-router-dom';
import { formatAverageTimeSeconds } from '@/Utils/formatAverageTime';
import moment from 'moment';
import { clsx } from '@mantine/core';
import { OrderStatus } from '@/Data/order-status';

const OrderDetailView: FC<Props> = props => {
    const { isOpen, data, externalStatus, onClose } = useViewModel(props);

    return (
        <Fragment>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as='div' open={isOpen} onClose={onClose} static>
                    <TransitionChild as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
                        <div className='fixed inset-0' />
                    </TransitionChild>
                    <div className='fixed inset-0 z-[999] overflow-y-auto bg-black/50 backdrop-blur-sm'>
                        <div className='flex min-h-screen items-center justify-center p-4'>
                            <TransitionChild
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <DialogPanel as='div' className='w-full max-w-2xl rounded-apple-lg border border-black/5 bg-white p-0 shadow-apple-xl dark:bg-[#1d1d1f] dark:border-white/10 overflow-hidden'>
                                    {/* Header */}
                                    <div className='flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/10 bg-meelike-secondary/30'>
                                        <h2 className='text-lg font-semibold text-meelike-dark'>รายละเอียดคำสั่งซื้อ</h2>
                                        <button
                                            type='button'
                                            className='p-2 hover:bg-black/5 rounded-apple-sm transition-colors text-meelike-dark/60 hover:text-meelike-dark'
                                            onClick={onClose}
                                        >
                                            <IconX className='w-5 h-5' />
                                        </button>
                                    </div>

                                    {/* Service Info Card */}
                                    <div className='p-6 space-y-6'>
                                        <div className='flex items-center gap-4 p-4 bg-meelike-secondary/20 rounded-apple border border-meelike-secondary/50'>
                                            {data?.service?.serviceCategory?.iconUrl && (
                                                <img
                                                    src={data?.service?.serviceCategory?.iconUrl || '/assets/meelike/no-img.png'}
                                                    onError={e => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.onerror = null;
                                                        target.src = '/assets/meelike/no-img.png';
                                                    }}
                                                    alt='Service Category Icon'
                                                    className='h-14 w-14 object-contain'
                                                />
                                            )}
                                            <div className='flex-1 min-w-0'>
                                                <h3 className='font-semibold text-meelike-dark text-base truncate'>{data?.service?.name}</h3>
                                                <p className='text-sm text-meelike-dark-2 mt-0.5'>รหัสบริการ: {data?.service?.id || '-'}</p>
                                            </div>
                                            {data?.status && <Status status={data?.status} />}
                                        </div>

                                        {/* Info Grid */}
                                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
                                            <InfoItem label='ลิงก์' className='col-span-2 lg:col-span-3'>
                                                <Link to={data?.targetUrl} target='_blank' rel='noopener noreferrer' className='text-primary hover:underline break-all text-sm'>
                                                    {data?.targetUrl}
                                                </Link>
                                            </InfoItem>

                                            <InfoItem label='External ID'>
                                                <span className='font-medium'>{data?.orderExternalRecord?.providerOrderId || '-'}</span>
                                            </InfoItem>

                                            <InfoItem label='Provider'>
                                                <span className='font-medium'>{data?.service?.providerService?.provider?.name || '-'}</span>
                                            </InfoItem>

                                            <InfoItem label='จำนวนที่สั่งซื้อ'>
                                                <span className='font-semibold text-meelike-dark'>
                                                    {(data?.orderAmount ?? 0).toLocaleString('th-TH')}
                                                </span>
                                            </InfoItem>

                                            <InfoItem label='ยอดรวมสุทธิ'>
                                                <span className='font-semibold text-meelike-dark'>
                                                    ฿{(data?.totalCostTHB ?? 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                                </span>
                                            </InfoItem>

                                            <InfoItem label='ต้นทุน (Cost)'>
                                                <span className='font-medium'>
                                                    ฿{data?.originalPriceTHB !== undefined ? parseFloat(data?.originalPriceTHB).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '-'}
                                                </span>
                                            </InfoItem>

                                            <InfoItem label='PnL'>
                                                <span
                                                    className={clsx('font-semibold', {
                                                        'text-danger': parseFloat(data?.profitTHB ?? '0') < 0,
                                                        'text-success': parseFloat(data?.profitTHB ?? '0') > 0
                                                    })}
                                                >
                                                    ฿{data?.profitTHB !== undefined ? parseFloat(data?.profitTHB).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '-'}
                                                </span>
                                            </InfoItem>

                                            <InfoItem label='วันที่สำเร็จ'>
                                                <span className='font-medium'>{data?.completedAt ? moment(data?.completedAt).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm') : '-'}</span>
                                            </InfoItem>

                                            <InfoItem label='Remains'>
                                                <span className='font-medium'>{(data?.remains ?? 0).toLocaleString('th-TH')}</span>
                                            </InfoItem>

                                            <InfoItem label='Start Count'>
                                                <span className='font-medium'>{(data?.startCount ?? 0).toLocaleString('th-TH')}</span>
                                            </InfoItem>

                                            <InfoItem label='Drip Feed'>
                                                <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', {
                                                    'bg-success/10 text-success': data?.dripfeed,
                                                    'bg-gray-100 text-gray-600': !data?.dripfeed
                                                })}>
                                                    {data?.dripfeed ? 'Enable' : 'Disable'}
                                                </span>
                                            </InfoItem>

                                            {data?.dripfeed && (
                                                <>
                                                    <InfoItem label='ระยะห่างเวลาต่อรอบ'>
                                                        <span className='font-medium'>{formatAverageTimeSeconds(data?.dripfeedIntervalSeconds ?? 0)}</span>
                                                    </InfoItem>
                                                    <InfoItem label='จำนวนต่อรอบ'>
                                                        <span className='font-medium'>{(data?.dripfeedQuantityPerRound ?? 0).toLocaleString('th-TH')}</span>
                                                    </InfoItem>
                                                </>
                                            )}
                                        </div>

                                        {/* Provider Details */}
                                        <div>
                                            <label className='text-xs font-medium text-meelike-dark-2 mb-2 block'>รายละเอียดจาก Provider</label>
                                            <pre className='bg-gray-50 dark:bg-black/20 rounded-apple p-4 text-xs overflow-x-auto whitespace-pre-wrap border border-black/5 dark:border-white/10 text-meelike-dark/80'>
                                                {JSON.stringify(data?.status === OrderStatus.FAIL ? data?.failReason : externalStatus, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </Fragment>
    );
};

// Helper component for info items
const InfoItem: FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
    <div className={className}>
        <label className='text-xs font-medium text-meelike-dark-2 mb-1 block'>{label}</label>
        <div className='text-sm text-meelike-dark'>{children}</div>
    </div>
);

export default OrderDetailView;
