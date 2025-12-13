import { type FC, Fragment } from 'react';

import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
// import Select from 'react-select';
import IconX from '@/components/Icon/IconX';
import IconXCircle from '@/components/Icon/IconXCircle';
import IconSave from '@/components/Icon/IconSave';

import useViewModel, { Props } from './ViewModel';
import { clsx } from '@mantine/core';
import IconEdit from '@/components/Icon/IconEdit';

const ProviderManagementFormView: FC<Props> = props => {
    const {
        currencyOptions,
        isHideToConfirm,
        isEditApiKey,
        setIsEditApiKey,
        isSelf,
        isOpen,
        isSubmitting,
        showPassword,
        formType,
        formState,
        formErrors,
        setShowPassword,
        onChangeFormState,
        onClose,
        onSubmit
    } = useViewModel(props);

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
                                <DialogPanel as='div' className='panel my-8 w-full max-w-5xl rounded-lg border-0 p-0 text-black dark:text-white-dark bg-[#F7FAFC] relative font-kanit'>
                                    <div className='absolute right-0 flex items-center justify-end px-5 py-3 dark:bg-[#121c2c]'>
                                        <button type='button' className='text-black hover:bg-gray-200 transition-all rounded-md p-2' onClick={onClose}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className='p-5 pt-0'>
                                        <h5 className='pt-5 text-xl font-bold'>
                                            {formType === 'create' ? 'เพิ่มผู้ให้บริการ' : formType === 'edit' ? 'แก้ไขผู้ให้บริการ' : 'ดูรายละเอียดผู้ให้บริการ'}
                                        </h5>
                                    </div>

                                    <div className='grid grid-cols-12 gap-4 lg:gap-y-8 p-5 items-center'>
                                        <div className='col-span-12'>
                                            <img src='/assets/meelike/images/person-circle.svg' alt='Profile' className='w-20 h-20 mx-auto' />
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <label htmlFor='aliasName' className='text-clink-input-label'>
                                                ชื่อเล่น
                                            </label>
                                            <input
                                                id='aliasName'
                                                type='text'
                                                placeholder={'Enter alias name'}
                                                className={clsx('form-input', {
                                                    'border-red-500': formErrors['aliasName']
                                                })}
                                                value={formState.aliasName}
                                                autoComplete='off'
                                                onChange={e => onChangeFormState('aliasName', e.target.value)}
                                            />
                                            {formErrors['aliasName'] && <p className='text-red-500 text-sm'>{formErrors['aliasName']}</p>}
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <label htmlFor='apiUrl' className='text-clink-input-label'>
                                                API URL
                                            </label>
                                            <input
                                                id='apiUrl'
                                                type='text'
                                                placeholder={'Enter API URL'}
                                                className={clsx('form-input', {
                                                    'border-red-500': formErrors['apiUrl'],
                                                    'bg-gray-100': formType === 'edit'
                                                })}
                                                disabled={formType === 'edit'}
                                                value={formState.apiUrl}
                                                autoComplete='off'
                                                onChange={e => onChangeFormState('apiUrl', e.target.value)}
                                            />
                                            {formErrors['apiUrl'] && <p className='text-red-500 text-sm'>{formErrors['apiUrl']}</p>}
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <label htmlFor='apiKey' className='text-clink-input-label flex items-center gap-2'>
                                                API Key
                                                {formType === 'edit' && (
                                                    <button
                                                        type='button'
                                                        className={clsx('btn btn-sm bg-transparent hover:bg-gray-100 hover:shadow-sm', {
                                                            'text-green-600 border-green-600': isEditApiKey
                                                        })}
                                                        onClick={() => setIsEditApiKey(!isEditApiKey)}
                                                    >
                                                        <span className='mr-1'>แก้ไข</span>
                                                        <IconEdit className='w-4 h-4' />
                                                    </button>
                                                )}
                                            </label>
                                            <input
                                                id='apiKey'
                                                type='text'
                                                placeholder={'Enter API Key'}
                                                className={clsx('form-input', {
                                                    'border-red-500': formErrors['apiKey'],
                                                    'bg-gray-100': formType === 'edit' && isEditApiKey === false
                                                })}
                                                disabled={formType === 'edit' && isEditApiKey === false}
                                                value={formState.apiKey}
                                                autoComplete='off'
                                                onChange={e => onChangeFormState('apiKey', e.target.value)}
                                            />
                                            {formErrors['apiKey'] && <p className='text-red-500 text-sm'>{formErrors['apiKey']}</p>}
                                        </div>
                                        {/* <div className='col-span-12 lg:col-span-6'>
                                            <label className='text-clink-input-label'>สกุลเงิน</label>
                                            <Select
                                                id='role'
                                                options={currencyOptions}
                                                value={currencyOptions.find(option => option.value === formState.currency) ?? ''}
                                                onChange={(option: any) => {
                                                    onChangeFormState('currency', option?.value ?? null);
                                                }}
                                                classNamePrefix='react-select'
                                                className={clsx('react-select-container', {
                                                    'border-red-500': formErrors['role']
                                                })}
                                                placeholder='เลือกสกุลเงิน'
                                                components={{
                                                    IndicatorSeparator: () => null
                                                }}
                                            />
                                            {formErrors['currency'] && <p className='text-red-500 text-sm'>{formErrors['role']}</p>}
                                        </div> */}
                                        <div className='col-span-12 lg:col-span-6'>
                                            <label className='text-clink-input-label'>แจ้งเตือนยอดเงินต่ำ</label>
                                            <div className='flex items-center mt-2'>
                                                <label className='relative inline-flex items-center cursor-pointer'>
                                                    <input
                                                        type='checkbox'
                                                        className='sr-only peer'
                                                        checked={formState.isLowBalanceAlert}
                                                        onChange={e => onChangeFormState('isLowBalanceAlert', e.target.checked)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>{formState.isLowBalanceAlert ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
                                                </label>
                                            </div>
                                        </div>
                                        {formState.isLowBalanceAlert && (
                                            <div className='col-span-12 lg:col-span-6'>
                                                <label htmlFor='lowBalanceThreshold' className='text-clink-input-label'>
                                                    เกณฑ์ยอดเงินต่ำ
                                                </label>
                                                <input
                                                    id='lowBalanceThreshold'
                                                    type='number'
                                                    min='0'
                                                    placeholder={'Enter threshold amount'}
                                                    className={clsx('form-input', {
                                                        'border-red-500': formErrors['lowBalanceThreshold']
                                                    })}
                                                    value={formState.lowBalanceThreshold}
                                                    onChange={e => onChangeFormState('lowBalanceThreshold', parseFloat(e.target.value))}
                                                />
                                                {formErrors['lowBalanceThreshold'] && <p className='text-red-500 text-sm'>{formErrors['lowBalanceThreshold']}</p>}
                                            </div>
                                        )}
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
                                            className='btn bg-meelike-dark text-white text-center shadow hover:!bg-gray-300 hover:!text-black w-full lg:w-auto'
                                            onClick={onSubmit}
                                            disabled={isSubmitting}
                                        >
                                            <IconSave className='w-4 mr-2' />
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

export default ProviderManagementFormView;
