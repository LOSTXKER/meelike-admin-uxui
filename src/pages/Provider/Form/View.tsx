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
                                <DialogPanel className='panel my-8 w-full max-w-2xl rounded-apple-lg border-0 p-0 text-black bg-white shadow-2xl relative'>
                                    {/* Modern Header */}
                                    <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
                                        <h3 className='text-xl font-semibold text-meelike-dark'>
                                            {formType === 'create' ? 'เพิ่มผู้ให้บริการ' : 'แก้ไขผู้ให้บริการ'}
                                        </h3>
                                        <button
                                            type='button'
                                            onClick={onClose}
                                            className='p-2 hover:bg-gray-100 rounded-apple transition-colors'
                                        >
                                            <IconX className='w-5 h-5 text-gray-500' />
                                        </button>
                                    </div>

                                    {/* Form Content */}
                                    <div className='p-6 space-y-4'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            {/* Alias Name */}
                                            <div>
                                                <label htmlFor='aliasName' className='block text-sm font-medium text-gray-700 mb-1'>
                                                    ชื่อเล่น
                                                </label>
                                                <input
                                                    id='aliasName'
                                                    type='text'
                                                    placeholder='Enter alias name'
                                                    className={clsx('w-full px-4 py-2.5 rounded-apple border focus:outline-none focus:ring-2 focus:ring-meelike-primary/30', {
                                                        'border-red-500 focus:border-red-500': formErrors['aliasName'],
                                                        'border-gray-300 focus:border-meelike-primary': !formErrors['aliasName']
                                                    })}
                                                    value={formState.aliasName}
                                                    autoComplete='off'
                                                    onChange={e => onChangeFormState('aliasName', e.target.value)}
                                                />
                                                {formErrors['aliasName'] && <p className='text-red-500 text-xs mt-1'>{formErrors['aliasName']}</p>}
                                            </div>

                                            {/* API URL */}
                                            <div>
                                                <label htmlFor='apiUrl' className='block text-sm font-medium text-gray-700 mb-1'>
                                                    API URL
                                                </label>
                                                <input
                                                    id='apiUrl'
                                                    type='text'
                                                    placeholder='Enter API URL'
                                                    className={clsx('w-full px-4 py-2.5 rounded-apple border focus:outline-none focus:ring-2 focus:ring-meelike-primary/30', {
                                                        'border-red-500 focus:border-red-500': formErrors['apiUrl'],
                                                        'border-gray-300 focus:border-meelike-primary': !formErrors['apiUrl'],
                                                        'bg-gray-100': formType === 'edit'
                                                    })}
                                                    disabled={formType === 'edit'}
                                                    value={formState.apiUrl}
                                                    autoComplete='off'
                                                    onChange={e => onChangeFormState('apiUrl', e.target.value)}
                                                />
                                                {formErrors['apiUrl'] && <p className='text-red-500 text-xs mt-1'>{formErrors['apiUrl']}</p>}
                                            </div>

                                            {/* API Key */}
                                            <div className='md:col-span-2'>
                                                <label htmlFor='apiKey' className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'>
                                                    API Key
                                                    {formType === 'edit' && (
                                                        <button
                                                            type='button'
                                                            className={clsx('text-xs px-2 py-1 rounded-apple border transition-colors', {
                                                                'text-green-600 border-green-600 bg-green-50': isEditApiKey,
                                                                'text-gray-600 border-gray-300 hover:bg-gray-50': !isEditApiKey
                                                            })}
                                                            onClick={() => setIsEditApiKey(!isEditApiKey)}
                                                        >
                                                            <IconEdit className='w-3 h-3 inline mr-1' />
                                                            แก้ไข
                                                        </button>
                                                    )}
                                                </label>
                                                <input
                                                    id='apiKey'
                                                    type='text'
                                                    placeholder='Enter API Key'
                                                    className={clsx('w-full px-4 py-2.5 rounded-apple border focus:outline-none focus:ring-2 focus:ring-meelike-primary/30', {
                                                        'border-red-500 focus:border-red-500': formErrors['apiKey'],
                                                        'border-gray-300 focus:border-meelike-primary': !formErrors['apiKey'],
                                                        'bg-gray-100': formType === 'edit' && isEditApiKey === false
                                                    })}
                                                    disabled={formType === 'edit' && isEditApiKey === false}
                                                    value={formState.apiKey}
                                                    autoComplete='off'
                                                    onChange={e => onChangeFormState('apiKey', e.target.value)}
                                                />
                                                {formErrors['apiKey'] && <p className='text-red-500 text-xs mt-1'>{formErrors['apiKey']}</p>}
                                            </div>

                                            {/* Low Balance Alert */}
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>แจ้งเตือนยอดเงินต่ำ</label>
                                                <label className='relative inline-flex items-center cursor-pointer'>
                                                    <input
                                                        type='checkbox'
                                                        className='sr-only peer'
                                                        checked={formState.isLowBalanceAlert}
                                                        onChange={e => onChangeFormState('isLowBalanceAlert', e.target.checked)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-meelike-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-meelike-primary"></div>
                                                    <span className='ml-3 text-sm font-medium text-gray-700'>{formState.isLowBalanceAlert ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
                                                </label>
                                            </div>

                                            {/* Low Balance Threshold */}
                                            {formState.isLowBalanceAlert && (
                                                <div>
                                                    <label htmlFor='lowBalanceThreshold' className='block text-sm font-medium text-gray-700 mb-1'>
                                                        เกณฑ์ยอดเงินต่ำ
                                                    </label>
                                                    <input
                                                        id='lowBalanceThreshold'
                                                        type='number'
                                                        min='0'
                                                        placeholder='Enter threshold amount'
                                                        className={clsx('w-full px-4 py-2.5 rounded-apple border focus:outline-none focus:ring-2 focus:ring-meelike-primary/30', {
                                                            'border-red-500 focus:border-red-500': formErrors['lowBalanceThreshold'],
                                                            'border-gray-300 focus:border-meelike-primary': !formErrors['lowBalanceThreshold']
                                                        })}
                                                        value={formState.lowBalanceThreshold}
                                                        onChange={e => onChangeFormState('lowBalanceThreshold', parseFloat(e.target.value))}
                                                    />
                                                    {formErrors['lowBalanceThreshold'] && <p className='text-red-500 text-xs mt-1'>{formErrors['lowBalanceThreshold']}</p>}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Modern Footer */}
                                    <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50'>
                                        <button
                                            type='button'
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                            className='px-4 py-2.5 rounded-apple border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50'
                                        >
                                            ยกเลิก
                                        </button>
                                        <button
                                            type='button'
                                            onClick={onSubmit}
                                            disabled={isSubmitting}
                                            className='px-4 py-2.5 bg-meelike-primary text-meelike-dark rounded-apple hover:bg-meelike-primary/90 transition-colors disabled:opacity-50'
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

export default ProviderManagementFormView;
