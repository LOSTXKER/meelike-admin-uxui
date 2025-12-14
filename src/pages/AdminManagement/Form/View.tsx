import { type FC, Fragment } from 'react';

import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import Select from 'react-select';
import IconX from '@/components/Icon/IconX';
import IconEye from '@/components/Icon/IconEye';
import IconXCircle from '@/components/Icon/IconXCircle';
import IconSave from '@/components/Icon/IconSave';

import useViewModel, { Props } from './ViewModel';
import { clsx } from '@mantine/core';

const AdminManagementFormView: FC<Props> = props => {
    const { roleOptions, isHideToConfirm, isSelf, isOpen, isSubmitting, showPassword, formType, formState, formErrors, setShowPassword, onChangeFormState, onClose, onSubmit } = useViewModel(props);

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
                                            {formType === 'create' ? 'เพิ่มผู้ใช้งาน' : 'แก้ไขผู้ใช้งาน'}
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
                                        {/* Name */}
                                        <div>
                                            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                                                ชื่อ-นามสกุล
                                            </label>
                                            <input
                                                id='name'
                                                type='text'
                                                placeholder='Enter name'
                                                className={clsx('w-full px-4 py-2.5 rounded-apple border focus:outline-none focus:ring-2 focus:ring-meelike-primary/30', {
                                                    'border-red-500 focus:border-red-500': formErrors['name'],
                                                    'border-gray-300 focus:border-meelike-primary': !formErrors['name']
                                                })}
                                                value={formState.name}
                                                autoComplete='off'
                                                onChange={e => onChangeFormState('name', e.target.value)}
                                            />
                                            {formErrors['name'] && <p className='text-red-500 text-xs mt-1'>{formErrors['name']}</p>}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                                                อีเมล
                                            </label>
                                            <input
                                                id='email'
                                                type='email'
                                                placeholder='Email'
                                                className={clsx('w-full px-4 py-2.5 rounded-apple border focus:outline-none focus:ring-2 focus:ring-meelike-primary/30', {
                                                    'border-red-500 focus:border-red-500': formErrors['email'],
                                                    'border-gray-300 focus:border-meelike-primary': !formErrors['email']
                                                })}
                                                value={formState.email}
                                                autoComplete='off'
                                                onChange={e => onChangeFormState('email', e.target.value)}
                                            />
                                            {formErrors['email'] && <p className='text-red-500 text-xs mt-1'>{formErrors['email']}</p>}
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                                                รหัสผ่าน
                                            </label>
                                            <div className='relative'>
                                                <input
                                                    id='password'
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder='Password'
                                                    className={clsx('w-full px-4 py-2.5 pr-10 rounded-apple border focus:outline-none focus:ring-2 focus:ring-meelike-primary/30', {
                                                        'border-red-500 focus:border-red-500': formErrors['password'],
                                                        'border-gray-300 focus:border-meelike-primary': !formErrors['password']
                                                    })}
                                                    value={formState.password}
                                                    autoComplete='off'
                                                    onChange={e => onChangeFormState('password', e.target.value)}
                                                />
                                                <span className='absolute end-2 top-1/2 -translate-y-1/2'>
                                                    <button
                                                        type='button'
                                                        className='p-2 hover:bg-gray-100 rounded transition-colors'
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        <IconEye fill={true} className='w-4 h-4 text-gray-400' />
                                                    </button>
                                                </span>
                                            </div>
                                            {formErrors['password'] && <p className='text-red-500 text-xs mt-1'>{formErrors['password']}</p>}
                                        </div>

                                        {/* Role */}
                                        {(formType === 'create' ? true : formState.role === 'SUPER_ADMIN' && !isSelf) && (
                                            <div>
                                                <label htmlFor='role' className='block text-sm font-medium text-gray-700 mb-1'>
                                                    สิทธิการใช้งาน
                                                </label>
                                                <Select
                                                    id='role'
                                                    options={roleOptions}
                                                    value={roleOptions.find(option => option.value === formState.role) ?? ''}
                                                    onChange={option => onChangeFormState('role', option?.value ?? null)}
                                                    classNamePrefix='react-select'
                                                    className={clsx('react-select-container', {
                                                        'border-red-500': formErrors['role']
                                                    })}
                                                    placeholder='เลือกสิทธิการใช้งาน'
                                                    styles={{
                                                        control: baseStyles => ({
                                                            ...baseStyles,
                                                            borderColor: formErrors['role'] ? 'rgb(239 68 68)' : 'rgb(209 213 219)',
                                                            borderRadius: '0.75rem',
                                                            minHeight: '42px'
                                                        })
                                                    }}
                                                />
                                                {formErrors['role'] && <p className='text-red-500 text-xs mt-1'>{formErrors['role']}</p>}
                                            </div>
                                        )}

                                        {/* Status */}
                                        {!isSelf && (
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    สถานะการใช้งาน
                                                </label>
                                                <div className='flex flex-row items-center gap-4'>
                                                    <label className='flex justify-center items-center font-normal cursor-pointer'>
                                                        <input
                                                            type='radio'
                                                            checked={formState.status === 'A'}
                                                            value='A'
                                                            className='form-radio text-meelike-primary focus:ring-meelike-primary/30'
                                                            onChange={() => onChangeFormState('status', 'A')}
                                                        />
                                                        <span className='text-sm text-gray-700 ps-2'>ใช้งานอยู่</span>
                                                    </label>
                                                    <label className='flex justify-center items-center font-normal cursor-pointer'>
                                                        <input
                                                            type='radio'
                                                            checked={formState.status === 'IA'}
                                                            value='IA'
                                                            className='form-radio text-meelike-primary focus:ring-meelike-primary/30'
                                                            onChange={() => onChangeFormState('status', 'IA')}
                                                        />
                                                        <span className='text-sm text-gray-700 ps-2'>ไม่สามารถใช้งานได้</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}
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

export default AdminManagementFormView;
