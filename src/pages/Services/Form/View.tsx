import { type FC, Fragment } from 'react';

import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconXCircle from '@/components/Icon/IconXCircle';
import IconSave from '@/components/Icon/IconSave';
import Select from 'react-select';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';
import AnimateHeight from 'react-animate-height';
import Tippy from '@tippyjs/react';
import IconInfoCircle from '@/components/Icon/IconInfoCircle';

import useViewModel, { Props } from './ViewModel';
import { clsx } from '@mantine/core';

const ServiceFormView: FC<Props> = props => {
    const {
        providerOptions,
        refillTypeOptions,
        serviceCategoryOptions,
        serviceProviderServiceOptions,
        refillProviderServiceOptions,
        dripFeedOptions,
        serviceTypeOptions,
        cancelOptions,
        isHideToConfirm,
        isOpen,
        isSubmitting,
        isLoadingProviderServices,
        isLoadingRefillProviderServices,
        formType,
        formState,
        formErrors,
        selectedServiceProviderService,
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
                                        <h5 className='pt-5 text-xl font-bold'>{formType === 'create' ? 'เพิ่มบริการ' : formType === 'edit' ? 'แก้ไขบริการ' : 'ดูรายละเอียดบริการ'}</h5>
                                    </div>

                                    <div className='grid grid-cols-12 gap-4 p-5 items-center text-sm'>
                                        <div className='col-span-12'>
                                            <div className='panel shadow-lg'>
                                                <div className='grid grid-cols-12 gap-4 p-5 items-center'>
                                                    <div className='col-span-12'>
                                                        <label htmlFor='providerId' className='text-clink-input-label'>
                                                            ผู้ให้บริการ <span className='text-red-500'>*</span>
                                                        </label>
                                                        <Select
                                                            id='providerId'
                                                            className='w-full'
                                                            placeholder='เลือกผู้ให้บริการ'
                                                            options={providerOptions}
                                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                            value={providerOptions.find((option: any) => option.value === formState.providerId) ?? null}
                                                            onChange={option => onChangeFormState('providerId', option?.value)}
                                                            styles={{
                                                                control: baseStyles => ({
                                                                    ...baseStyles,
                                                                    borderColor: formErrors['providerId'] ? '#e53e3e' : 'rgb(224 230 237)',
                                                                    borderRadius: '0.375rem',
                                                                    fontWeight: 600
                                                                }),
                                                                menu: baseStyles => ({
                                                                    ...baseStyles,
                                                                    zIndex: 9999
                                                                }),
                                                                placeholder: baseStyles => ({
                                                                    ...baseStyles,
                                                                    color: '#A1A1AA'
                                                                })
                                                            }}
                                                            components={{
                                                                IndicatorSeparator: () => null
                                                            }}
                                                        />
                                                        {formErrors['providerId'] && <span className='text-red-500 text-sm'>{formErrors['providerId']}</span>}
                                                    </div>

                                                    <div className='col-span-12'>
                                                        <label htmlFor='providerServiceId' className='text-clink-input-label'>
                                                            บริการที่เลือก <span className='text-red-500'>*</span>
                                                        </label>
                                                        <VirtualizedSelect
                                                            isClearable={false}
                                                            id='providerId'
                                                            className='w-full'
                                                            placeholder={isLoadingProviderServices ? 'กำลังโหลดข้อมูล...' : 'กรุณาเลือกผู้ให้บริการ'}
                                                            isLoading={isLoadingProviderServices}
                                                            isDisabled={isLoadingProviderServices || formState.providerId === 0}
                                                            options={serviceProviderServiceOptions}
                                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                            value={serviceProviderServiceOptions.find((option: any) => option.value === formState.providerServiceId) ?? null}
                                                            onChange={(option: any) => onChangeFormState('providerServiceId', option?.value)}
                                                            styles={{
                                                                control: (baseStyles: any) => ({
                                                                    ...baseStyles,
                                                                    borderColor: formErrors['providerServiceId'] ? '#e53e3e' : 'rgb(224 230 237)',
                                                                    borderRadius: '0.375rem',
                                                                    fontWeight: 600
                                                                }),
                                                                menu: (baseStyles: any) => ({
                                                                    ...baseStyles,
                                                                    zIndex: 9999
                                                                }),
                                                                placeholder: (baseStyles: any) => ({
                                                                    ...baseStyles,
                                                                    color: '#A1A1AA'
                                                                }),
                                                                option: (baseStyles: any, state: any) => ({
                                                                    ...baseStyles,
                                                                    fontSize: '0.875rem'
                                                                })
                                                            }}
                                                            components={{
                                                                IndicatorSeparator: () => null
                                                            }}
                                                        />
                                                        {formErrors['providerServiceId'] && <span className='text-red-500 text-sm'>{formErrors['providerServiceId']}</span>}
                                                    </div>

                                                    {formState.providerServiceId !== 0 && (
                                                        <Fragment>
                                                            <div className='col-span-12'>
                                                                <label htmlFor='dripfeed' className='text-clink-input-label flex items-center'>
                                                                    Drip-Feed
                                                                    {selectedServiceProviderService?.dripfeed === false && <span className='text-red-500 ml-1'>(ไม่สามารถใช้งานได้)</span>}{' '}
                                                                    <Tippy className='cursor-pointer' content='หากบริการที่เลือกไม่สามารถ Drip-Feed ได้ระบบจะล็อคการเปิดใช้งานไว้'>
                                                                        <div>
                                                                            <IconInfoCircle className='h-4' />
                                                                        </div>
                                                                    </Tippy>
                                                                </label>
                                                                <Select
                                                                    id='dripfeed'
                                                                    className='w-full'
                                                                    placeholder='เลือกคุณสมบัติ Drip-Feed'
                                                                    isDisabled={selectedServiceProviderService?.dripfeed === false}
                                                                    options={dripFeedOptions}
                                                                    noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                                    value={dripFeedOptions.find((option: any) => option.value === formState.dripfeed) ?? null}
                                                                    onChange={option => onChangeFormState('dripfeed', option?.value)}
                                                                    styles={{
                                                                        control: baseStyles => ({
                                                                            ...baseStyles,
                                                                            borderColor: 'rgb(224 230 237)',
                                                                            borderRadius: '0.375rem',
                                                                            fontWeight: 600
                                                                        }),
                                                                        menu: baseStyles => ({
                                                                            ...baseStyles,
                                                                            zIndex: 9999
                                                                        }),
                                                                        placeholder: baseStyles => ({
                                                                            ...baseStyles,
                                                                            color: '#A1A1AA'
                                                                        })
                                                                    }}
                                                                    components={{
                                                                        IndicatorSeparator: () => null
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className='col-span-12'>
                                                                <label htmlFor='cancel' className='text-clink-input-label flex items-center'>
                                                                    การยกเลิก {selectedServiceProviderService?.cancel === false && <span className='text-red-500 ml-1'>(ไม่สามารถใช้งานได้)</span>}{' '}
                                                                    <Tippy className='cursor-pointer' content='หากบริการที่เลือกไม่สามารถ Cancel ได้ระบบจะล็อคการเปิดใช้งานไว้'>
                                                                        <div>
                                                                            <IconInfoCircle className='h-4' />
                                                                        </div>
                                                                    </Tippy>
                                                                </label>
                                                                <Select
                                                                    id='cancel'
                                                                    className='w-full'
                                                                    placeholder='เลือกคุณสมบัติการยกเลิก'
                                                                    isDisabled={selectedServiceProviderService?.cancel === false}
                                                                    options={cancelOptions}
                                                                    noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                                    value={cancelOptions.find((option: any) => option.value === formState.cancel) ?? null}
                                                                    onChange={option => onChangeFormState('cancel', option?.value)}
                                                                    styles={{
                                                                        control: baseStyles => ({
                                                                            ...baseStyles,
                                                                            borderColor: 'rgb(224 230 237)',
                                                                            borderRadius: '0.375rem',
                                                                            fontWeight: 600
                                                                        }),
                                                                        menu: baseStyles => ({
                                                                            ...baseStyles,
                                                                            zIndex: 9999
                                                                        }),
                                                                        placeholder: baseStyles => ({
                                                                            ...baseStyles,
                                                                            color: '#A1A1AA'
                                                                        })
                                                                    }}
                                                                    components={{
                                                                        IndicatorSeparator: () => null
                                                                    }}
                                                                />
                                                            </div>
                                                        </Fragment>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-span-12'>
                                            <div
                                                className={clsx('panel relative shadow-lg', {
                                                    'pointer-events-none': !formState.providerServiceId || formState.externalServiceId === ''
                                                })}
                                            >
                                                {formState.providerServiceId === 0 && formState.externalServiceId === '' && (
                                                    <div className='absolute top-0 left-0 w-full h-full bg-black/75 rounded-lg flex items-center justify-center z-10'>
                                                        <p className='text-white font-semibold text-lg'>กรุณาเลือกผู้ให้บริการและบริการ</p>
                                                    </div>
                                                )}

                                                <div className='grid grid-cols-12 gap-4 p-5 items-center'>
                                                    <div className='col-span-12'>
                                                        <label htmlFor='name' className='text-clink-input-label'>
                                                            ชื่อบริการ <span className='text-red-500'>*</span>
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
                                                        {formErrors['name'] && <span className='text-red-500 text-sm'>{formErrors['name']}</span>}
                                                    </div>

                                                    <div className='col-span-12'>
                                                        <label htmlFor='serviceCategoryId' className='text-clink-input-label'>
                                                            หมวดหมู่บริการ
                                                        </label>
                                                        <Select
                                                            isClearable
                                                            id='serviceCategoryId'
                                                            className='w-full'
                                                            placeholder='เลือกหมวดหมู่บริการ'
                                                            options={serviceCategoryOptions}
                                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                            value={serviceCategoryOptions.find((option: any) => option.value === formState.serviceCategoryId) ?? null}
                                                            onChange={option => onChangeFormState('serviceCategoryId', option?.value)}
                                                            styles={{
                                                                control: baseStyles => ({
                                                                    ...baseStyles,
                                                                    borderColor: formErrors['serviceCategoryId'] ? '#e53e3e' : 'rgb(224 230 237)',
                                                                    borderRadius: '0.375rem',
                                                                    fontWeight: 600
                                                                }),
                                                                menu: baseStyles => ({
                                                                    ...baseStyles,
                                                                    zIndex: 9999
                                                                }),
                                                                placeholder: baseStyles => ({
                                                                    ...baseStyles,
                                                                    color: '#A1A1AA'
                                                                })
                                                            }}
                                                            components={{
                                                                IndicatorSeparator: () => null
                                                            }}
                                                        />
                                                        {formErrors['serviceCategoryId'] && <span className='text-red-500 text-sm'>{formErrors['serviceCategoryId']}</span>}
                                                    </div>

                                                    <div className='col-span-12'>
                                                        <label htmlFor='type' className='text-clink-input-label'>
                                                            ประเภทบริการ
                                                        </label>
                                                        <Select
                                                            isClearable={false}
                                                            id='type'
                                                            className='w-full'
                                                            placeholder='เลือกประเภทบริการ'
                                                            options={serviceTypeOptions}
                                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                            value={serviceTypeOptions.find((option: any) => option.value === formState.type) ?? null}
                                                            onChange={option => onChangeFormState('type', option?.value)}
                                                            styles={{
                                                                control: baseStyles => ({
                                                                    ...baseStyles,
                                                                    borderColor: formErrors['type'] ? '#e53e3e' : 'rgb(224 230 237)',
                                                                    borderRadius: '0.375rem',
                                                                    fontWeight: 600
                                                                }),
                                                                menu: baseStyles => ({
                                                                    ...baseStyles,
                                                                    zIndex: 9999
                                                                }),
                                                                placeholder: baseStyles => ({
                                                                    ...baseStyles,
                                                                    color: '#A1A1AA'
                                                                })
                                                            }}
                                                            components={{
                                                                IndicatorSeparator: () => null
                                                            }}
                                                        />
                                                        {formErrors['type'] && <span className='text-red-500 text-sm'>{formErrors['type']}</span>}
                                                    </div>

                                                    <div className='col-span-12'>
                                                        <label htmlFor='description' className='text-clink-input-label'>
                                                            คำอธิบาย
                                                        </label>
                                                        <textarea
                                                            id='description'
                                                            rows={4}
                                                            placeholder={''}
                                                            className='form-input'
                                                            value={formState.description}
                                                            autoComplete='off'
                                                            onChange={e => onChangeFormState('description', e.target.value)}
                                                        />
                                                        {formErrors['description'] && <span className='text-red-500 text-sm'>{formErrors['description']}</span>}
                                                    </div>

                                                    <div className='col-span-12'>
                                                        <label htmlFor='ratePercent' className='text-clink-input-label'>
                                                            อัตราเรท / 1,000 <span className='text-red-500'>*</span>
                                                        </label>

                                                        {selectedServiceProviderService && (
                                                            <Fragment>
                                                                <button
                                                                    type='button'
                                                                    className={`my-3 w-full flex items-center font-semibold ${formState.syncRateEnabled ? '!text-primary' : '!text-gray-600'}`}
                                                                    onClick={() => {}}
                                                                >
                                                                    <div className='flex flex-row items-center gap-x-3 text-sm'>
                                                                        <label className='w-7 h-4 relative cursor-pointer'>
                                                                            <input
                                                                                type='checkbox'
                                                                                className='peer absolute w-full h-full opacity-0 z-10 focus:ring-0 focus:outline-none cursor-pointer'
                                                                                checked={formState.syncRateEnabled}
                                                                                onChange={e => onChangeFormState('syncRateEnabled', e.target.checked)}
                                                                            />
                                                                            <span className='rounded-full border border-[#adb5bd] bg-white peer-checked:bg-primary peer-checked:border-primary block h-full before:absolute ltr:before:left-0.5 rtl:before:right-0.5 ltr:peer-checked:before:left-3.5 rtl:peer-checked:before:right-3.5 peer-checked:before:bg-primary before:bg-[#adb5bd] dark:before:bg-white-dark before:bottom-[2px] before:w-3 before:h-3 before:rounded-full before:transition-all before:duration-300'></span>
                                                                        </label>
                                                                        <label className='font-normal'>Sync Rate</label>
                                                                    </div>
                                                                </button>

                                                                <div className='flex flex-row items-center mb-3'>
                                                                    <div className='w-full'>
                                                                        <label htmlFor='' className='font-normal'>
                                                                            อัตราเรทดั้งเดิม
                                                                        </label>
                                                                        <input
                                                                            id='originalRate'
                                                                            type='number'
                                                                            placeholder={''}
                                                                            className={clsx('form-input bg-gray-50 text-gray-500 w-full rounded-r-none', {})}
                                                                            value={selectedServiceProviderService?.rate ?? 0}
                                                                            autoComplete='off'
                                                                            disabled
                                                                            onChange={e => {}}
                                                                        />
                                                                    </div>
                                                                    <div className='w-full'>
                                                                        <label>&nbsp;</label>
                                                                        <input
                                                                            id='approximatelySymbol'
                                                                            type='text'
                                                                            placeholder={''}
                                                                            className={clsx('form-input bg-gray-50 text-gray-500 w-full rounded-none text-center', {})}
                                                                            value={'≈'}
                                                                            autoComplete='off'
                                                                            disabled
                                                                            onChange={e => {}}
                                                                        />
                                                                    </div>
                                                                    <div className='w-full'>
                                                                        <label htmlFor='' className='font-normal'>
                                                                            ราคาโดยประมาณ (THB)
                                                                        </label>
                                                                        <input
                                                                            id='approximatelyPrice'
                                                                            type='number'
                                                                            placeholder={''}
                                                                            className={clsx('form-input bg-gray-50 text-gray-500 w-full rounded-l-none', {})}
                                                                            value={selectedServiceProviderService?.convertedAmount ?? 0}
                                                                            autoComplete='off'
                                                                            disabled
                                                                            onChange={e => {}}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    type='button'
                                                                    className={`my-3 w-full flex items-center font-semibold ${formState.finalizePriceWithCost ? '!text-primary' : '!text-gray-600'}`}
                                                                    onClick={() => {}}
                                                                >
                                                                    <div className='flex flex-row items-center gap-x-3 text-sm'>
                                                                        <label className='w-7 h-4 relative cursor-pointer'>
                                                                            <input
                                                                                type='checkbox'
                                                                                className='peer absolute w-full h-full opacity-0 z-10 focus:ring-0 focus:outline-none cursor-pointer'
                                                                                checked={formState.finalizePriceWithCost}
                                                                                onChange={e => onChangeFormState('finalizePriceWithCost', e.target.checked)}
                                                                            />
                                                                            <span className='rounded-full border border-[#adb5bd] bg-white peer-checked:bg-primary peer-checked:border-primary block h-full before:absolute ltr:before:left-0.5 rtl:before:right-0.5 ltr:peer-checked:before:left-3.5 rtl:peer-checked:before:right-3.5 peer-checked:before:bg-primary before:bg-[#adb5bd] dark:before:bg-white-dark before:bottom-[2px] before:w-3 before:h-3 before:rounded-full before:transition-all before:duration-300'></span>
                                                                        </label>
                                                                        <label className='font-normal'>คำนวณราคาโดยใช้ต้นทุน</label>
                                                                        <Tippy
                                                                            className='cursor-pointer'
                                                                            content='การคำนวณราคาโดยใช้ต้นทุนจะคำนวณจากอัตราเรทที่กำหนดและต้นทุนของบริการ หากไม่เลือกตัวเลือกนี้ ระบบจะคำนวณราคาโดยใช้ราคา Fixed Price เพียงอย่างเดียว'
                                                                        >
                                                                            <div className='mb-[0.375rem]'>
                                                                                <IconInfoCircle className='h-4 text-gray-500' />
                                                                            </div>
                                                                        </Tippy>
                                                                    </div>
                                                                </button>

                                                                <div className='flex flex-row items-start'>
                                                                    <div className='w-full'>
                                                                        <label htmlFor='' className='font-normal'>
                                                                            Fixed Price
                                                                        </label>
                                                                        <input
                                                                            id='fixedPrice'
                                                                            type='string'
                                                                            placeholder={''}
                                                                            className={clsx('form-input w-full rounded-r-none', {
                                                                                'border-red-500': formErrors['fixedPrice']
                                                                            })}
                                                                            value={formState?.fixedPrice ?? 0}
                                                                            autoComplete='off'
                                                                            onChange={e => {
                                                                                onChangeFormState('fixedPrice', e.target.value);
                                                                            }}
                                                                        />
                                                                        {formErrors['fixedPrice'] && <span className='text-red-500 text-sm'>{formErrors['fixedPrice']}</span>}
                                                                    </div>
                                                                    <div className='w-full'>
                                                                        <label htmlFor='' className='font-normal'>
                                                                            เปอร์เซ็นต์
                                                                        </label>
                                                                        <input
                                                                            id='ratePercent'
                                                                            type='string'
                                                                            placeholder={''}
                                                                            className={clsx('form-input w-full rounded-none', {
                                                                                'border-red-500': formErrors['ratePercent'],
                                                                                'bg-gray-50 text-gray-500': !formState.finalizePriceWithCost
                                                                            })}
                                                                            value={!formState.finalizePriceWithCost ? '' : formState?.ratePercent ?? 0}
                                                                            autoComplete='off'
                                                                            onChange={e => {
                                                                                onChangeFormState('ratePercent', e.target.value);
                                                                            }}
                                                                            disabled={!formState.finalizePriceWithCost}
                                                                        />
                                                                        {formErrors['ratePercent'] && <span className='text-red-500 text-sm'>{formErrors['ratePercent']}</span>}
                                                                    </div>
                                                                    <div className='w-full'>
                                                                        <label>&nbsp;</label>
                                                                        <input
                                                                            id='approximatelySymbol2'
                                                                            type='text'
                                                                            placeholder={''}
                                                                            className={clsx('form-input bg-gray-50 text-gray-500 w-full rounded-none text-center', {})}
                                                                            value={'≈'}
                                                                            autoComplete='off'
                                                                            disabled
                                                                            onChange={e => {}}
                                                                        />
                                                                    </div>
                                                                    <div className='w-full'>
                                                                        <label htmlFor='' className='font-normal'>
                                                                            ราคาโดยประมาณ (THB)
                                                                        </label>
                                                                        <input
                                                                            id='approximatelyPrice2'
                                                                            type='number'
                                                                            placeholder={''}
                                                                            className={clsx('form-input bg-gray-50 text-gray-500 w-full rounded-l-none', {})}
                                                                            value={formState?.convertedAmount ?? 0}
                                                                            autoComplete='off'
                                                                            disabled
                                                                            onChange={e => {}}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </Fragment>
                                                        )}
                                                    </div>

                                                    <div className='col-span-12'>
                                                        <label htmlFor='minAmount_maxAmount' className='text-clink-input-label'>
                                                            จำนวนออร์เดอร์ <span className='text-red-500'>*</span>
                                                        </label>
                                                        <div className='flex flex-row items-start gap-3'>
                                                            <div className='w-full'>
                                                                <label htmlFor='minAmount' className='font-normal'>
                                                                    ขั้นต่ำ{' '}
                                                                    <span className='text-gray-500'>
                                                                        (
                                                                        {(selectedServiceProviderService?.minAmount ?? 0).toLocaleString('th-TH', {
                                                                            minimumFractionDigits: 0,
                                                                            maximumFractionDigits: 0
                                                                        })}
                                                                        )
                                                                    </span>
                                                                </label>
                                                                <input
                                                                    id='minAmount'
                                                                    type='string'
                                                                    placeholder={''}
                                                                    className={clsx('form-input w-full', {
                                                                        'border-red-500': formErrors['minAmount']
                                                                    })}
                                                                    value={formState?.minAmount ?? 0}
                                                                    autoComplete='off'
                                                                    onChange={e => {
                                                                        onChangeFormState('minAmount', e.target.value);
                                                                    }}
                                                                />
                                                                {formErrors['minAmount'] && <span className='text-red-500 text-sm'>{formErrors['minAmount']}</span>}
                                                            </div>
                                                            <div className='w-full'>
                                                                <label htmlFor='maxAmount' className='font-normal'>
                                                                    สูงสุด{' '}
                                                                    <span className='text-gray-500'>
                                                                        (
                                                                        {(selectedServiceProviderService?.maxAmount ?? 0).toLocaleString('th-TH', {
                                                                            minimumFractionDigits: 0,
                                                                            maximumFractionDigits: 0
                                                                        })}
                                                                        )
                                                                    </span>
                                                                </label>
                                                                <input
                                                                    id='maxAmount'
                                                                    type='string'
                                                                    placeholder={''}
                                                                    className={clsx('form-input w-full', {
                                                                        'border-red-500': formErrors['maxAmount']
                                                                    })}
                                                                    value={formState?.maxAmount ?? 0}
                                                                    autoComplete='off'
                                                                    onChange={e => {
                                                                        onChangeFormState('maxAmount', e.target.value);
                                                                    }}
                                                                />
                                                                {formErrors['maxAmount'] && <span className='text-red-500 text-sm'>{formErrors['maxAmount']}</span>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* <div className="col-span-12">
                                                        <label htmlFor="warranty" className="text-clink-input-label">
                                                            การรับประกัน <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="flex flex-row items-center gap-4">
                                                            <label className="flex justify-center items-center font-normal cursor-pointer h-full">
                                                                <input
                                                                    type="radio"
                                                                    checked={formState.warranty === true}
                                                                    value="A"
                                                                    className="form-radio"
                                                                    onChange={() => {
                                                                        onChangeFormState('warranty', true);
                                                                    }}
                                                                />
                                                                <span className="text-sm text-black ps-2">มี</span>
                                                            </label>
                                                            <label className="flex justify-center items-center font-normal cursor-pointer h-full">
                                                                <input
                                                                    type="radio"
                                                                    checked={formState.warranty === false}
                                                                    value="IA"
                                                                    className="form-radio"
                                                                    onChange={() => {
                                                                        onChangeFormState('warranty', false);
                                                                    }}
                                                                />
                                                                <span className="text-sm text-black ps-2">ไม่มี</span>
                                                            </label>
                                                        </div>
                                                        {formState.warranty && (
                                                            <Fragment>
                                                                <label htmlFor="warrantyDateDuration" className="text-clink-input-label mt-2">
                                                                    จำนวนวันรับประกัน
                                                                </label>
                                                                <input
                                                                    id="warrantyDateDuration"
                                                                    type="string"
                                                                    placeholder={''}
                                                                    className={clsx('form-input w-full', {
                                                                        'border-red-500': formErrors['warrantyDateDuration'],
                                                                    })}
                                                                    value={formState?.warrantyDateDuration ?? 0}
                                                                    autoComplete="off"
                                                                    onChange={(e) => {
                                                                        onChangeFormState('warrantyDateDuration', e.target.value);
                                                                    }}
                                                                />
                                                                {formErrors['warrantyDateDuration'] && <span className="text-red-500 text-sm">{formErrors['warrantyDateDuration']}</span>}

                                                                <label htmlFor="warrantyDescription" className="text-clink-input-label mt-2">
                                                                    คุณภาพของการรับประกัน
                                                                </label>
                                                                <Select
                                                                    id="warrantyDescription"
                                                                    className="w-full"
                                                                    placeholder="เลือกคุณภาพของการรับประกัน"
                                                                    options={warrantyQualityOptions}
                                                                    noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                                    value={warrantyQualityOptions.find((option: any) => option.value === formState.warrantyQuality) ?? null}
                                                                    onChange={(option) => onChangeFormState('warrantyQuality', option?.value)}
                                                                    styles={{
                                                                        control: (baseStyles: any) => ({
                                                                            ...baseStyles,
                                                                            borderColor: formErrors['warrantyQuality'] ? '#e53e3e' : 'rgb(224 230 237)',
                                                                            borderRadius: '0.375rem',
                                                                            fontWeight: 600,
                                                                        }),
                                                                        menu: (baseStyles: any) => ({
                                                                            ...baseStyles,
                                                                            zIndex: 9999,
                                                                        }),
                                                                        placeholder: (baseStyles: any) => ({
                                                                            ...baseStyles,
                                                                            color: '#A1A1AA',
                                                                        }),
                                                                    }}
                                                                    components={{
                                                                        IndicatorSeparator: () => null,
                                                                    }}
                                                                />
                                                                {formErrors['warrantyQuality'] && <span className="text-red-500 text-sm">{formErrors['warrantyQuality']}</span>}
                                                            </Fragment>
                                                        )}
                                                    </div> */}

                                                    <div className='col-span-12'>
                                                        <label htmlFor='denyLinkDuplicates' className='text-clink-input-label'>
                                                            ไม่อนุญาตลิงค์ซ้ำ
                                                        </label>
                                                        <div className='flex flex-row items-center gap-4'>
                                                            <label className='flex justify-center items-center font-normal cursor-pointer h-full'>
                                                                <input
                                                                    type='radio'
                                                                    checked={formState.denyLinkDuplicates === true}
                                                                    value='A'
                                                                    className='form-radio'
                                                                    onChange={() => {
                                                                        onChangeFormState('denyLinkDuplicates', true);
                                                                    }}
                                                                />
                                                                <span className='text-sm text-black ps-2'>อนุญาต</span>
                                                            </label>
                                                            <label className='flex justify-center items-center font-normal cursor-pointer h-full'>
                                                                <input
                                                                    type='radio'
                                                                    checked={formState.denyLinkDuplicates === false}
                                                                    value='IA'
                                                                    className='form-radio'
                                                                    onChange={() => {
                                                                        onChangeFormState('denyLinkDuplicates', false);
                                                                    }}
                                                                />
                                                                <span className='text-sm text-black ps-2'>ไม่อนุญาต</span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className='col-span-12'>
                                                        <label htmlFor='isActive' className='text-clink-input-label'>
                                                            สถานะการใช้งาน <span className='text-red-500'>*</span>
                                                        </label>
                                                        <div className='flex flex-row items-center gap-4'>
                                                            <label className='flex justify-center items-center font-normal cursor-pointer h-full'>
                                                                <input
                                                                    type='radio'
                                                                    checked={formState.isActive === true}
                                                                    value='A'
                                                                    className='form-radio'
                                                                    onChange={() => {
                                                                        onChangeFormState('isActive', true);
                                                                    }}
                                                                />
                                                                <span className='text-sm text-black ps-2'>ใช้งานอยู่</span>
                                                            </label>
                                                            <label className='flex justify-center items-center font-normal cursor-pointer h-full'>
                                                                <input
                                                                    type='radio'
                                                                    checked={formState.isActive === false}
                                                                    value='IA'
                                                                    className='form-radio'
                                                                    onChange={() => {
                                                                        onChangeFormState('isActive', false);
                                                                    }}
                                                                />
                                                                <span className='text-sm text-black ps-2'>เลิกใช้งาน</span>
                                                            </label>
                                                        </div>
                                                        {formErrors['isActive'] && <span className='text-red-500 text-sm'>{formErrors['isActive']}</span>}
                                                    </div>

                                                    <div className='col-span-12'>
                                                        <div
                                                            className={clsx('panel border p-0', {
                                                                'border-primary': formState.refill,
                                                                'border-primary-light': !formState.refill
                                                            })}
                                                        >
                                                            <button
                                                                type='button'
                                                                className={`p-4 w-full flex items-center font-semibold ${formState.refill ? '!text-primary' : '!text-gray-600'}`}
                                                                onClick={() => {}}
                                                            >
                                                                <div className='flex flex-row items-center gap-x-3 text-sm'>
                                                                    <label className='w-7 h-4 relative cursor-pointer'>
                                                                        <input
                                                                            disabled={selectedServiceProviderService?.refill === false}
                                                                            type='checkbox'
                                                                            className='peer absolute w-full h-full opacity-0 z-10 focus:ring-0 focus:outline-none cursor-pointer'
                                                                            checked={formState.refill}
                                                                            onChange={e => onChangeFormState('refill', e.target.checked)}
                                                                        />
                                                                        <span className='rounded-full border border-[#adb5bd] bg-white peer-checked:bg-primary peer-checked:border-primary block h-full before:absolute ltr:before:left-0.5 rtl:before:right-0.5 ltr:peer-checked:before:left-3.5 rtl:peer-checked:before:right-3.5 peer-checked:before:bg-primary before:bg-[#adb5bd] dark:before:bg-white-dark before:bottom-[2px] before:w-3 before:h-3 before:rounded-full before:transition-all before:duration-300'></span>
                                                                    </label>
                                                                    <label className='font-normal'>
                                                                        Refill
                                                                        {selectedServiceProviderService?.refill === false && <span className='text-red-500 ml-1'>(ไม่สามารถใช้งานได้)</span>}
                                                                    </label>
                                                                    <Tippy className='cursor-pointer' content='หากบริการที่เลือกไม่สามารถ Refill ได้ระบบจะล็อคการเปิดใช้งานไว้'>
                                                                        <div className='mb-[0.375rem]'>
                                                                            <IconInfoCircle className='h-4' />
                                                                        </div>
                                                                    </Tippy>
                                                                </div>
                                                                {/* <div className={`ltr:ml-auto rtl:mr-auto ${formState.refill ? 'rotate-180' : ''}`}>
                                                                    <IconCaretDown />
                                                                </div> */}
                                                            </button>

                                                            <AnimateHeight duration={300} height={formState.refill ? 'auto' : 0}>
                                                                <div className='grid grid-cols-12 gap-4 p-4'>
                                                                    <div className='col-span-12'>
                                                                        <label htmlFor='refillType' className='text-clink-input-label'>
                                                                            ประเภทการ Refill
                                                                        </label>
                                                                        <Select
                                                                            id='refillType'
                                                                            className='w-full'
                                                                            placeholder='เลือกประเภทการ Refill'
                                                                            options={refillTypeOptions}
                                                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                                            value={refillTypeOptions.find((option: any) => option.value === formState.refillType) ?? null}
                                                                            onChange={option => onChangeFormState('refillType', option?.value)}
                                                                            styles={{
                                                                                control: (baseStyles: any) => ({
                                                                                    ...baseStyles,
                                                                                    borderColor: formErrors['refillType'] ? '#e53e3e' : 'rgb(224 230 237)',
                                                                                    borderRadius: '0.375rem',
                                                                                    fontWeight: 600
                                                                                }),
                                                                                menu: (baseStyles: any) => ({
                                                                                    ...baseStyles,
                                                                                    zIndex: 9999
                                                                                }),
                                                                                placeholder: (baseStyles: any) => ({
                                                                                    ...baseStyles,
                                                                                    color: '#A1A1AA'
                                                                                })
                                                                            }}
                                                                            components={{
                                                                                IndicatorSeparator: () => null
                                                                            }}
                                                                        />
                                                                        {formErrors['refillType'] && <span className='text-red-500 text-sm'>{formErrors['refillType']}</span>}
                                                                    </div>

                                                                    {(formState.refillType === 'provider' || formState.refillType === 'place_order') && (
                                                                        <Fragment>
                                                                            {formState.refillType === 'place_order' && (
                                                                                <Fragment>
                                                                                    <div className='col-span-12'>
                                                                                        <label htmlFor='refillProviderId' className='text-clink-input-label'>
                                                                                            ผู้ให้บริการ
                                                                                        </label>
                                                                                        <Select
                                                                                            id='refillProviderId'
                                                                                            className='w-full'
                                                                                            placeholder='เลือกผู้ให้บริการ'
                                                                                            options={providerOptions}
                                                                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                                                            value={providerOptions.find((option: any) => option.value === formState.refillProviderId) ?? null}
                                                                                            onChange={option => onChangeFormState('refillProviderId', option?.value)}
                                                                                            styles={{
                                                                                                control: (baseStyles: any) => ({
                                                                                                    ...baseStyles,
                                                                                                    borderColor: formErrors['refillProviderId'] ? '#e53e3e' : 'rgb(224 230 237)',
                                                                                                    borderRadius: '0.375rem',
                                                                                                    fontWeight: 600
                                                                                                }),
                                                                                                menu: (baseStyles: any) => ({
                                                                                                    ...baseStyles,
                                                                                                    zIndex: 9999
                                                                                                }),
                                                                                                placeholder: (baseStyles: any) => ({
                                                                                                    ...baseStyles,
                                                                                                    color: '#A1A1AA'
                                                                                                })
                                                                                            }}
                                                                                            components={{
                                                                                                IndicatorSeparator: () => null
                                                                                            }}
                                                                                        />
                                                                                        {formErrors['refillProviderId'] && (
                                                                                            <span className='text-red-500 text-sm'>{formErrors['refillProviderId']}</span>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className='col-span-12'>
                                                                                        <label htmlFor='refillProviderServiceId' className='text-clink-input-label'>
                                                                                            บริการ
                                                                                        </label>
                                                                                        <VirtualizedSelect
                                                                                            isClearable={false}
                                                                                            id='refillProviderServiceId'
                                                                                            className='w-full'
                                                                                            options={refillProviderServiceOptions}
                                                                                            placeholder={isLoadingRefillProviderServices ? 'กำลังโหลดข้อมูล...' : 'กรุณาเลือกบริการ'}
                                                                                            isLoading={isLoadingRefillProviderServices}
                                                                                            isDisabled={isLoadingRefillProviderServices || formState.refillProviderId === 0}
                                                                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                                                                            value={
                                                                                                refillProviderServiceOptions.find(
                                                                                                    (option: any) => option.value === formState.refillProviderServiceId
                                                                                                ) ?? null
                                                                                            }
                                                                                            onChange={(option: any) => onChangeFormState('refillProviderServiceId', option?.value)}
                                                                                            styles={{
                                                                                                control: (baseStyles: any) => ({
                                                                                                    ...baseStyles,
                                                                                                    borderColor: formErrors['refillProviderServiceId'] ? '#e53e3e' : 'rgb(224 230 237)',
                                                                                                    borderRadius: '0.375rem',
                                                                                                    fontWeight: 600
                                                                                                }),
                                                                                                menu: (baseStyles: any) => ({
                                                                                                    ...baseStyles,
                                                                                                    zIndex: 9999
                                                                                                }),
                                                                                                placeholder: (baseStyles: any) => ({
                                                                                                    ...baseStyles,
                                                                                                    color: '#A1A1AA'
                                                                                                })
                                                                                            }}
                                                                                            components={{
                                                                                                IndicatorSeparator: () => null
                                                                                            }}
                                                                                        />
                                                                                        {formErrors['refillProviderServiceId'] && (
                                                                                            <span className='text-red-500 text-sm'>{formErrors['refillProviderServiceId']}</span>
                                                                                        )}
                                                                                    </div>
                                                                                </Fragment>
                                                                            )}
                                                                            {/* <div className='col-span-12'>
                                                                                <label htmlFor='refillMinQuantity' className='text-clink-input-label'>
                                                                                    จำนวนขั้นต่ำในการ Refill
                                                                                </label>
                                                                                <input
                                                                                    id='refillMinQuantity'
                                                                                    type='string'
                                                                                    placeholder={''}
                                                                                    className={clsx('form-input w-full', {
                                                                                        'border-red-500': formErrors['refillMinQuantity']
                                                                                    })}
                                                                                    value={formState?.refillMinQuantity}
                                                                                    autoComplete='off'
                                                                                    onChange={e => {
                                                                                        onChangeFormState('refillMinQuantity', e.target.value);
                                                                                    }}
                                                                                />
                                                                                {formErrors['refillMinQuantity'] && <span className='text-red-500 text-sm'>{formErrors['refillMinQuantity']}</span>}
                                                                            </div>
                                                                            <div className='col-span-12'>
                                                                                <label htmlFor='refillMaxQuantityPercent' className='text-clink-input-label'>
                                                                                    จำนวนสูงสุดในการ Refill เป็นเปอร์เซ็นต์
                                                                                </label>
                                                                                <input
                                                                                    id='refillMaxQuantity'
                                                                                    type='string'
                                                                                    placeholder={''}
                                                                                    className={clsx('form-input w-full', {
                                                                                        'border-red-500': formErrors['refillMaxQuantityPercent']
                                                                                    })}
                                                                                    value={formState?.refillMaxQuantityPercent}
                                                                                    autoComplete='off'
                                                                                    onChange={e => {
                                                                                        onChangeFormState('refillMaxQuantityPercent', e.target.value);
                                                                                    }}
                                                                                />
                                                                                {formErrors['refillMaxQuantityPercent'] && (
                                                                                    <span className='text-red-500 text-sm'>{formErrors['refillMaxQuantity']}</span>
                                                                                )}
                                                                            </div> */}
                                                                            <div className='col-span-12'>
                                                                                <label htmlFor='refillDays' className='text-clink-input-label'>
                                                                                    จำนวนวันที่สามารถเริ่มต้น Refill นับจากวันที่เสร็จสิ้น
                                                                                </label>
                                                                                <input
                                                                                    id='refillDays'
                                                                                    type='string'
                                                                                    placeholder={''}
                                                                                    className={clsx('form-input w-full', {
                                                                                        'border-red-500': formErrors['refillDays']
                                                                                    })}
                                                                                    value={formState?.refillDays}
                                                                                    autoComplete='off'
                                                                                    onChange={e => {
                                                                                        onChangeFormState('refillDays', e.target.value);
                                                                                    }}
                                                                                />
                                                                                {formErrors['refillDays'] && <span className='text-red-500 text-sm'>{formErrors['refillDays']}</span>}
                                                                            </div>
                                                                        </Fragment>
                                                                    )}
                                                                </div>
                                                            </AnimateHeight>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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

            <style>{`
                .fast-option {
                    font-size: 12px !important;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                } 
            `}</style>
        </Fragment>
    );
};

export default ServiceFormView;
