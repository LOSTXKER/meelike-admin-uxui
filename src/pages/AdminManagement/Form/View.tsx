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
                                <DialogPanel as='div' className='panel my-8 w-full max-w-5xl rounded-lg border-0 p-0 text-black dark:text-white-dark bg-[#F7FAFC] relative font-kanit'>
                                    <div className='absolute right-0 flex items-center justify-end px-5 py-3 dark:bg-[#121c2c]'>
                                        <button type='button' className='text-black hover:bg-gray-200 transition-all rounded-md p-2' onClick={onClose}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className='p-5 pt-0'>
                                        <h5 className='pt-5 text-xl font-bold'>{formType === 'create' ? 'เพิ่มผู้ใช้งาน' : formType === 'edit' ? 'แก้ไขผู้ใช้งาน' : 'ดูรายละเอียดผู้ใช้งาน'}</h5>
                                    </div>

                                    <div className='grid grid-cols-12 gap-4 lg:gap-y-8 p-5 items-center'>
                                        <div className='col-span-12'>
                                            <img src='/assets/meelike/images/person-circle.svg' alt='Profile' className='w-20 h-20 mx-auto' />
                                        </div>
                                        <div className='col-span-12'>
                                            <label htmlFor='name' className='text-clink-input-label'>
                                                ชื่อ-นามสกุล
                                            </label>
                                            <input
                                                id='name'
                                                type='text'
                                                placeholder={''}
                                                className={clsx('form-input', {
                                                    'border-red-500': formErrors['name']
                                                })}
                                                value={formState.name}
                                                autoComplete='off'
                                                onChange={e => onChangeFormState('name', e.target.value)}
                                            />
                                            {formErrors['name'] && <p className='text-red-500 text-sm'>{formErrors['name']}</p>}
                                        </div>
                                        <div className='col-span-12'>
                                            <label htmlFor='password' className='text-clink-input-label'>
                                                รหัสผ่าน
                                            </label>
                                            <div className='relative'>
                                                <input
                                                    id='password'
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder={''}
                                                    className={clsx('form-input pr-10', {
                                                        'border-red-500': formErrors['password']
                                                    })}
                                                    value={formState.password}
                                                    autoComplete='off'
                                                    onChange={e => onChangeFormState('password', e.target.value)}
                                                />
                                                <span className='absolute end-2 top-1/2 -translate-y-1/2'>
                                                    <button
                                                        type='button'
                                                        className='btn bg-none border-0 shadow-none px-2 py-1 hover:bg-white-light transition-all'
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        <IconEye fill={true} />
                                                    </button>
                                                </span>
                                            </div>
                                            {formErrors['password'] && <p className='text-red-500 text-sm'>{formErrors['password']}</p>}
                                        </div>

                                        <div className='col-span-12'>
                                            <label htmlFor='email' className='text-clink-input-label'>
                                                อีเมล
                                            </label>
                                            <input
                                                id='email'
                                                type='email'
                                                placeholder={'Email'}
                                                className={clsx('form-input', {
                                                    'border-red-500': formErrors['email']
                                                })}
                                                value={formState.email}
                                                autoComplete='off'
                                                onChange={e => onChangeFormState('email', e.target.value)}
                                            />
                                            {formErrors['email'] && <p className='text-red-500 text-sm'>{formErrors['email']}</p>}
                                        </div>

                                        {(formType === 'create' ? true : formState.role === 'SUPER_ADMIN' && !isSelf) && (
                                            <div className='col-span-12'>
                                                <label htmlFor='role' className='text-clink-input-label'>
                                                    สิทธิการใช้งาน
                                                </label>
                                                <Select
                                                    id='role'
                                                    options={roleOptions}
                                                    value={roleOptions.find(option => option.value === formState.role) ?? ''}
                                                    // @ts-ignore
                                                    onChange={option => onChangeFormState('role', option?.value ?? null)}
                                                    classNamePrefix='react-select'
                                                    className={clsx('react-select-container', {
                                                        'border-red-500': formErrors['role']
                                                    })}
                                                    placeholder='เลือกสิทธิการใช้งาน'
                                                />
                                                {formErrors['role'] && <p className='text-red-500 text-sm'>{formErrors['role']}</p>}
                                            </div>
                                        )}

                                        {!isSelf && (
                                            <div className='col-span-12'>
                                                <label htmlFor='position' className='text-clink-input-label'>
                                                    สถานะการใช้งาน
                                                </label>
                                                <div className='flex flex-row items-center gap-4'>
                                                    <label className='flex justify-center items-center font-normal cursor-pointer h-full'>
                                                        <input
                                                            type='radio'
                                                            checked={formState.status === 'A'}
                                                            value='A'
                                                            className='form-radio'
                                                            onChange={() => {
                                                                onChangeFormState('status', 'A');
                                                            }}
                                                        />
                                                        <span className='text-sm text-black ps-2'>ใช้งานอยู่</span>
                                                    </label>
                                                    <label className='flex justify-center items-center font-normal cursor-pointer h-full'>
                                                        <input
                                                            type='radio'
                                                            checked={formState.status === 'IA'}
                                                            value='IA'
                                                            className='form-radio'
                                                            onChange={() => {
                                                                onChangeFormState('status', 'IA');
                                                            }}
                                                        />
                                                        <span className='text-sm text-black ps-2'>ไม่สามารถใช้งานได้</span>
                                                    </label>
                                                </div>
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

export default AdminManagementFormView;
