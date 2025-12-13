import { type FC, Fragment } from 'react';

import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconSettings from '@/components/Icon/IconSettings';

import useViewModel, { Props } from './ViewModel';
import { clsx } from '@mantine/core';

const TopupBonusConfigFormView: FC<Props> = props => {
    const { isHideToConfirm, isOpen, isSubmitting, paymentMethod, paymentMethodTitle, formState, formErrors, generateIcon, onChangeFormState, onClose, onSubmit } = useViewModel(props);

    return (
        <Fragment>
            <Transition appear show={isHideToConfirm ? false : isOpen} as={Fragment}>
                <Dialog as='div' open={isHideToConfirm ? false : isOpen} onClose={onClose} static>
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
                                <DialogPanel as='div' className='w-full max-w-lg rounded-apple-lg border border-black/5 bg-white p-0 shadow-apple-xl dark:bg-[#1d1d1f] dark:border-white/10 overflow-hidden'>
                                    {/* Header */}
                                    <div className='flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/10 bg-meelike-secondary/30'>
                                        <h2 className='text-lg font-semibold text-meelike-dark flex items-center gap-2'>
                                            <IconSettings className='w-5 h-5' />
                                            ตั้งค่าโบนัสการเติมเงิน
                                        </h2>
                                        <button
                                            type='button'
                                            className='p-2 hover:bg-black/5 rounded-apple-sm transition-colors text-meelike-dark/60 hover:text-meelike-dark'
                                            onClick={onClose}
                                        >
                                            <IconX className='w-5 h-5' />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className='p-6 space-y-5'>
                                        {/* Payment Method Preview */}
                                        <div className='p-4 bg-meelike-secondary/30 rounded-apple flex items-center gap-4'>
                                            <div className='w-12 h-12 bg-white rounded-apple flex items-center justify-center shadow-sm'>
                                                {generateIcon(paymentMethod)}
                                            </div>
                                            <div>
                                                <p className='text-sm text-meelike-dark-2'>วิธีการชำระเงิน</p>
                                                <p className='font-semibold text-meelike-dark'>{paymentMethodTitle}</p>
                                            </div>
                                        </div>

                                        {/* Bonus Percentage */}
                                        <div>
                                            <label className='block text-sm font-medium text-meelike-dark mb-1.5'>
                                                เปอร์เซ็นต์โบนัส (%)
                                            </label>
                                            <input
                                                type='text'
                                                placeholder='กรอกเปอร์เซ็นต์โบนัส'
                                                className={clsx(
                                                    'w-full px-4 py-3 rounded-apple border bg-white transition-colors',
                                                    'focus:outline-none focus:ring-2 focus:ring-meelike-primary/50 focus:border-meelike-primary',
                                                    formErrors['bonusPercentage']
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-black/10 hover:border-black/20'
                                                )}
                                                value={formState.bonusPercentage}
                                                autoComplete='off'
                                                onChange={e => onChangeFormState('bonusPercentage', e.target.value)}
                                            />
                                            {formErrors['bonusPercentage'] && (
                                                <p className='mt-1.5 text-sm text-red-500'>{formErrors['bonusPercentage']}</p>
                                            )}
                                        </div>

                                        {/* Minimum Amount */}
                                        <div>
                                            <label className='block text-sm font-medium text-meelike-dark mb-1.5'>
                                                ให้โบนัสตั้งแต่ (บาท)
                                            </label>
                                            <input
                                                type='text'
                                                placeholder='กรอกจำนวนเงินขั้นต่ำ'
                                                className={clsx(
                                                    'w-full px-4 py-3 rounded-apple border bg-white transition-colors',
                                                    'focus:outline-none focus:ring-2 focus:ring-meelike-primary/50 focus:border-meelike-primary',
                                                    formErrors['from']
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-black/10 hover:border-black/20'
                                                )}
                                                value={formState.from}
                                                autoComplete='off'
                                                onChange={e => onChangeFormState('from', e.target.value)}
                                            />
                                            {formErrors['from'] && (
                                                <p className='mt-1.5 text-sm text-red-500'>{formErrors['from']}</p>
                                            )}
                                        </div>

                                        {/* Status Toggle */}
                                        <div>
                                            <label className='block text-sm font-medium text-meelike-dark mb-2'>
                                                สถานะการใช้งาน
                                            </label>
                                            <div className='flex gap-4'>
                                                <label className={clsx(
                                                    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-apple border cursor-pointer transition-all',
                                                    formState.enabled === true
                                                        ? 'border-green-500 bg-green-50 text-green-700'
                                                        : 'border-black/10 hover:border-black/20 text-meelike-dark-2'
                                                )}>
                                                    <input
                                                        type='radio'
                                                        className='sr-only'
                                                        checked={formState.enabled === true}
                                                        onChange={() => onChangeFormState('enabled', true)}
                                                    />
                                                    <span className={clsx(
                                                        'w-2.5 h-2.5 rounded-full',
                                                        formState.enabled === true ? 'bg-green-500' : 'bg-gray-300'
                                                    )} />
                                                    <span className='font-medium'>Active</span>
                                                </label>
                                                <label className={clsx(
                                                    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-apple border cursor-pointer transition-all',
                                                    formState.enabled === false
                                                        ? 'border-red-500 bg-red-50 text-red-700'
                                                        : 'border-black/10 hover:border-black/20 text-meelike-dark-2'
                                                )}>
                                                    <input
                                                        type='radio'
                                                        className='sr-only'
                                                        checked={formState.enabled === false}
                                                        onChange={() => onChangeFormState('enabled', false)}
                                                    />
                                                    <span className={clsx(
                                                        'w-2.5 h-2.5 rounded-full',
                                                        formState.enabled === false ? 'bg-red-500' : 'bg-gray-300'
                                                    )} />
                                                    <span className='font-medium'>Inactive</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-black/5 dark:border-white/10 bg-gray-50/50'>
                                        <button
                                            type='button'
                                            className='px-5 py-2.5 rounded-apple text-sm font-medium text-meelike-dark bg-white border border-black/10 hover:bg-gray-50 transition-colors'
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                        >
                                            ยกเลิก
                                        </button>
                                        <button
                                            type='button'
                                            className='px-5 py-2.5 rounded-apple text-sm font-medium text-white bg-meelike-primary hover:bg-meelike-primary/90 transition-colors disabled:opacity-50'
                                            onClick={onSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
                                        </button>
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

export default TopupBonusConfigFormView;
