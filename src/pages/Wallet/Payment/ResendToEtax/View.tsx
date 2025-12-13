import { type FC, Fragment } from 'react';

import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconXCircle from '@/components/Icon/IconXCircle';
import IconSave from '@/components/Icon/IconSave';

import useViewModel, { Props } from './ViewModel';

const ResendToEtaxView: FC<Props> = props => {
    const { isOpen, isSubmitting, data, userBillingInfo, onClose, onSubmit } = useViewModel(props);

    return (
        <Fragment>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as='div' open={isOpen} onClose={onClose} static>
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
                                <DialogPanel as='div' className='panel my-8 w-full max-w-3xl rounded-lg border-0 p-0 text-black dark:text-white-dark bg-[#F7FAFC] relative font-kanit'>
                                    <div className='absolute right-0 flex items-center justify-end px-5 py-3 dark:bg-[#121c2c]'>
                                        <button type='button' className='text-black hover:bg-gray-200 transition-all rounded-md p-2' onClick={onClose}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className='p-5 pt-0'>
                                        <h5 className='pt-5 text-xl font-bold'>ส่งข้อมูลใหม่ไป e-Tax</h5>
                                    </div>

                                    <div className='grid grid-cols-12 gap-4 lg:gap-y-8 p-5 py-0 items-center'>
                                        <div className='col-span-12'>
                                            <label className='font-semibold text-black'>ลูกค้า</label>
                                            <div className='text-gray-600'>
                                                ID: {data?.user?.id}, {data?.user?.username} ({data?.user?.email})
                                            </div>
                                        </div>
                                        <div className='col-span-12'>
                                            <label className='font-semibold text-black'>สาเหตุที่ส่งข้อมูลไม่สำเร็จ</label>
                                            <pre className='bg-gray-100 rounded p-3 text-xs overflow-x-auto whitespace-pre-wrap shadow-sm border'>
                                                {JSON.stringify(data?.sendETaxFailedReason, null, 2)}
                                            </pre>
                                        </div>
                                        <div className='col-span-12'>
                                            <label className='font-semibold text-black'>ข้อมูลการออกใบกำกับภาษีปัจจุบัน</label>
                                            <div className='text-sm text-gray-600 bg-gray-100 rounded p-3 shadow-sm border'>
                                                <div>
                                                    <span className='text-black'>อีเมล:</span> {userBillingInfo?.email}
                                                </div>
                                                <div>
                                                    <span className='text-black'>ชื่อบริษัท:</span> {userBillingInfo?.companyName}
                                                </div>
                                                <div>
                                                    <span className='text-black'>หมายเลขประจำตัวผู้เสียภาษีอากร:</span> {userBillingInfo?.taxId}
                                                </div>
                                                <div>
                                                    <span className='text-black'>ที่อยู่บรรทัดที่ 1:</span> {userBillingInfo?.addressLine1}
                                                </div>
                                                <div>
                                                    <span className='text-black'>ที่อยู่บรรทัดที่ 2:</span> {userBillingInfo?.addressLine2}
                                                </div>
                                                <div>
                                                    <span className='text-black'>อำเภอ/เขต:</span> {userBillingInfo?.district}
                                                </div>
                                                <div>
                                                    <span className='text-black'>จังหวัด:</span> {userBillingInfo?.province}
                                                </div>
                                                <div>
                                                    <span className='text-black'>รหัสไปรษณีย์:</span> {userBillingInfo?.postalCode}
                                                </div>
                                                <div>
                                                    <span className='text-black'>ประเทศ:</span> {userBillingInfo?.country}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-12'>
                                            <div className='text-red-500 font-semibold underline text-center'>**โปรดตรวจสอบข้อมูลการออกใบกำกับภาษีให้ถูกต้องก่อนทำการนำส่งข้อมูลอีกครั้ง**</div>
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
                                            className='btn bg-meelike-dark text-white text-center shadow hover:!bg-gray-300 hover:!text-black w-full lg:w-auto disabled:!text-black'
                                            onClick={onSubmit}
                                            disabled={isSubmitting}
                                        >
                                            <IconSave className='w-4 mr-2' />
                                            <span>นำส่งและบันทึกข้อมูล</span>
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

export default ResendToEtaxView;
