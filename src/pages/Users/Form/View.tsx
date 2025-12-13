import { type FC, Fragment } from 'react';

import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconUser from '@/components/Icon/IconUser';

import useViewModel, { Props } from './ViewModel';
import { clsx } from '@mantine/core';

const UserFormView: FC<Props> = props => {
    const { isHideToConfirm, isOpen, isSubmitting, showPassword, formType, formState, formErrors, setShowPassword, onChangeFormState, onClose, onSubmit } = useViewModel(props);

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
                                        <h2 className='text-lg font-semibold text-meelike-dark'>
                                            {formType === 'create' ? 'เพิ่มผู้ใช้งาน' : formType === 'edit' ? 'แก้ไขผู้ใช้งาน' : 'ดูรายละเอียดผู้ใช้งาน'}
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
                                    <div className='p-6 space-y-6'>
                                        {/* Avatar */}
                                        <div className='flex justify-center'>
                                            <div className='w-20 h-20 bg-meelike-secondary/50 rounded-full flex items-center justify-center'>
                                                <IconUser className='w-10 h-10 text-meelike-primary' />
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className='space-y-4'>
                                            <div>
                                                <label htmlFor='email' className='block text-sm font-medium text-meelike-dark mb-1.5'>
                                                    อีเมล
                                                </label>
                                                <input
                                                    id='email'
                                                    type='email'
                                                    placeholder='กรอกอีเมล...'
                                                    className={clsx(
                                                        'w-full px-4 py-3 rounded-apple border bg-white transition-colors',
                                                        'focus:outline-none focus:ring-2 focus:ring-meelike-primary/50 focus:border-meelike-primary',
                                                        formErrors['email']
                                                            ? 'border-red-500 bg-red-50'
                                                            : 'border-black/10 hover:border-black/20'
                                                    )}
                                                    value={formState.email}
                                                    autoComplete='off'
                                                    onChange={e => onChangeFormState('email', e.target.value)}
                                                />
                                                {formErrors['email'] && (
                                                    <p className='mt-1.5 text-sm text-red-500'>{formErrors['email']}</p>
                                                )}
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

export default UserFormView;
