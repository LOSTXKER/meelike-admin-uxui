import { type FC, Fragment } from 'react';

import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconWallet from '@/components/Icon/IconWallet';
import Select from 'react-select';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';

import useViewModel, { Props } from './ViewModel';
import { clsx } from '@mantine/core';

const CreatePaymentFormView: FC<Props> = props => {
    const { topupMethodOptions, userOptions, isHideToConfirm, isOpen, isSubmitting, formState, formErrors, onChangeFormState, onClose, onSubmit } = useViewModel(props);

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            minHeight: '46px',
            borderRadius: '12px',
            borderColor: state.isFocused ? '#937058' : 'rgba(0,0,0,0.1)',
            boxShadow: state.isFocused ? '0 0 0 3px rgba(147,112,88,0.2)' : 'none',
            '&:hover': {
                borderColor: 'rgba(0,0,0,0.2)'
            }
        }),
        menu: (base: any) => ({
            ...base,
            zIndex: 2000,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
        }),
        menuPortal: (base: any) => ({
            ...base,
            zIndex: 2000
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? '#937058' : state.isFocused ? 'rgba(147,112,88,0.1)' : 'white',
            color: state.isSelected ? 'white' : '#473B30',
            padding: '12px 16px'
        })
    };

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
                                <DialogPanel as='div' className='w-full max-w-xl rounded-apple-lg border border-black/5 bg-white p-0 shadow-apple-xl dark:bg-[#1d1d1f] dark:border-white/10 overflow-hidden'>
                                    {/* Header */}
                                    <div className='flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/10 bg-meelike-secondary/30'>
                                        <h2 className='text-lg font-semibold text-meelike-dark flex items-center gap-2'>
                                            <IconWallet className='w-5 h-5' />
                                            เติมเงินให้ผู้ใช้
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
                                        {/* User Select */}
                                        <div>
                                            <label className='block text-sm font-medium text-meelike-dark mb-1.5'>
                                                ผู้ใช้
                                            </label>
                                            <VirtualizedSelect
                                                isClearable
                                                value={userOptions.find(option => formState.userId === option.value) ?? null}
                                                onChange={(option: any) => {
                                                    if (option) {
                                                        onChangeFormState('userId', option.value);
                                                    } else {
                                                        onChangeFormState('userId', option);
                                                    }
                                                }}
                                                options={userOptions}
                                                className='react-select'
                                                classNamePrefix='select'
                                                placeholder='เลือกผู้ใช้งาน...'
                                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                menuShouldBlockScroll
                                                styles={{
                                                    ...selectStyles,
                                                    control: (base: any, state: any) => ({
                                                        ...selectStyles.control(base, state),
                                                        borderColor: formErrors['userId'] ? '#e53e3e' : state.isFocused ? '#937058' : 'rgba(0,0,0,0.1)'
                                                    })
                                                }}
                                                components={{
                                                    IndicatorSeparator: () => null
                                                }}
                                            />
                                            {formErrors['userId'] && <p className='mt-1.5 text-sm text-red-500'>{formErrors['userId']}</p>}
                                        </div>

                                        {/* Payment Method */}
                                        <div>
                                            <label className='block text-sm font-medium text-meelike-dark mb-1.5'>
                                                วิธีการเติมเงิน
                                            </label>
                                            <Select
                                                isClearable
                                                options={topupMethodOptions}
                                                value={topupMethodOptions.find(option => option.value === formState.method) || null}
                                                onChange={value => onChangeFormState('method', value?.value ?? '')}
                                                placeholder='เลือกวิธีการเติมเงิน'
                                                styles={{
                                                    ...selectStyles,
                                                    control: (base: any, state: any) => ({
                                                        ...selectStyles.control(base, state),
                                                        borderColor: formErrors['method'] ? '#e53e3e' : state.isFocused ? '#937058' : 'rgba(0,0,0,0.1)'
                                                    })
                                                }}
                                                components={{
                                                    IndicatorSeparator: () => null
                                                }}
                                            />
                                            {formErrors['method'] && <p className='mt-1.5 text-sm text-red-500'>{formErrors['method']}</p>}
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            <label className='block text-sm font-medium text-meelike-dark mb-1.5'>
                                                จำนวนเงินที่ต้องการเติม
                                            </label>
                                            <div className='relative'>
                                                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-meelike-dark-2 font-semibold'>฿</span>
                                                <input
                                                    type='text'
                                                    placeholder='0.00'
                                                    className={clsx(
                                                        'w-full pl-8 pr-4 py-3 rounded-apple border bg-white transition-colors text-lg font-semibold',
                                                        'focus:outline-none focus:ring-2 focus:ring-meelike-primary/50 focus:border-meelike-primary',
                                                        formErrors['amount']
                                                            ? 'border-red-500 bg-red-50'
                                                            : 'border-black/10 hover:border-black/20'
                                                    )}
                                                    value={formState.amount}
                                                    autoComplete='off'
                                                    onChange={e => onChangeFormState('amount', e.target.value)}
                                                />
                                            </div>
                                            {formErrors['amount'] && <p className='mt-1.5 text-sm text-red-500'>{formErrors['amount']}</p>}
                                        </div>

                                        {/* Note */}
                                        <div>
                                            <label className='block text-sm font-medium text-meelike-dark mb-1.5'>
                                                หมายเหตุ (ถ้ามี)
                                            </label>
                                            <textarea
                                                placeholder='กรอกหมายเหตุ...'
                                                className={clsx(
                                                    'w-full px-4 py-3 rounded-apple border bg-white transition-colors resize-none',
                                                    'focus:outline-none focus:ring-2 focus:ring-meelike-primary/50 focus:border-meelike-primary',
                                                    formErrors['note']
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-black/10 hover:border-black/20'
                                                )}
                                                value={formState.note}
                                                autoComplete='off'
                                                onChange={e => onChangeFormState('note', e.target.value)}
                                                rows={3}
                                            />
                                            {formErrors['note'] && <p className='mt-1.5 text-sm text-red-500'>{formErrors['note']}</p>}
                                        </div>

                                        {/* e-Tax Checkbox */}
                                        <label className='flex items-center gap-3 p-4 bg-meelike-secondary/30 rounded-apple cursor-pointer hover:bg-meelike-secondary/50 transition-colors'>
                                            <input
                                                type='checkbox'
                                                className='w-5 h-5 rounded border-2 border-meelike-dark/30 text-meelike-primary focus:ring-meelike-primary/50'
                                                checked={formState.isSendToEtax}
                                                onChange={() => onChangeFormState('isSendToEtax', !formState.isSendToEtax)}
                                            />
                                            <div>
                                                <p className='font-medium text-meelike-dark'>ส่งข้อมูลไปยัง e-Tax</p>
                                                <p className='text-sm text-meelike-dark-2'>ระบบจะออกใบกำกับภาษีอิเล็กทรอนิกส์</p>
                                            </div>
                                        </label>
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
                                            {isSubmitting ? 'กำลังบันทึก...' : 'เติมเงิน'}
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

export default CreatePaymentFormView;
