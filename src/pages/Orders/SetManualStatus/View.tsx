import { type FC, Fragment } from 'react';

import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconXCircle from '@/components/Icon/IconXCircle';
import IconSend from '@/components/Icon/IconSave';
import Select from 'react-select';

import useViewModel, { Props } from './ViewModel';
import { clsx } from '@mantine/core';
import { OrderStatus } from '@/Data/order-status';

const OrderSetManualStatusView: FC<Props> = props => {
    const { options, isSubmitting, isOpen, isHideToConfirm, isError, selectedStatus, setSelectedStatus, onClose, onSubmit } = useViewModel(props);

    return (
        <Fragment>
            <Transition appear show={isHideToConfirm ? false : isOpen} as={Fragment}>
                <Dialog as='div' open={isHideToConfirm ? false : isOpen} onClose={onClose} static>
                    <TransitionChild as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
                        <div className='fixed inset-0' />
                    </TransitionChild>
                    <div className='fixed inset-0 z-[999] overflow-y-auto bg-[black]/60'>
                        <div className='flex min-h-screen items-center justify-center px-4'>
                            <TransitionChild
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <DialogPanel as='div' className='panel my-8 w-full max-w-xl rounded-lg border-0 p-0 text-black dark:text-white-dark bg-[#F7FAFC] relative font-kanit'>
                                    <div className='absolute right-0 flex items-center justify-end px-5 py-3 dark:bg-[#121c2c]'>
                                        <button type='button' className='text-black hover:bg-gray-200 transition-all rounded-md p-2' onClick={onClose}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className='px-5 pt-0'>
                                        <h5 className='pt-4 text-xl font-bold'>ตั้งค่าสถานะคำสั่งซื้อด้วยตนเอง</h5>
                                    </div>

                                    <div className='grid grid-cols-12 gap-4 px-5 items-center mt-4'>
                                        <div className='col-span-12'>
                                            <Select
                                                options={options}
                                                value={options.find(option => option.value === selectedStatus) || null}
                                                onChange={option => setSelectedStatus(option ? (option.value as OrderStatus) : null)}
                                                isSearchable
                                                isClearable
                                                placeholder='เลือกสถานะคำสั่งซื้อ'
                                                styles={{
                                                    menu: base => ({ ...base, zIndex: 9999 }),
                                                    control: baseStyles => ({
                                                        ...baseStyles,
                                                        borderColor: isError ? '#e53e3e' : 'rgb(224 230 237)',
                                                        borderRadius: '0.375rem',
                                                        fontWeight: 600
                                                    })
                                                }}
                                                components={{
                                                    IndicatorSeparator: () => null
                                                }}
                                            />
                                            {isError && <p className='text-red-500 text-sm'>กรุณาเลือกสถานะใหม่</p>}
                                        </div>
                                    </div>

                                    <div className='flex flex-col lg:flex-row items-center justify-center gap-4 py-4'>
                                        <button
                                            type='button'
                                            className='btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-full lg:w-auto border-none'
                                            onClick={() => {
                                                onClose();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            <IconXCircle className='w-4 text-black mr-2' />
                                            <span>ยกเลิก</span>
                                        </button>
                                        <button
                                            type='button'
                                            className='btn bg-meelike-dark text-white text-center shadow hover:opacity-60 w-full lg:w-auto'
                                            onClick={onSubmit}
                                            disabled={isSubmitting}
                                        >
                                            <IconSend className='w-4 text-white mr-2' />
                                            <span>บันทึก</span>
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

export default OrderSetManualStatusView;
