import { type FC, Fragment } from 'react';
import Flatpickr from 'react-flatpickr';
import IconCalendar from '@/components/Icon/IconCalendar';
import Select from 'react-select';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';

import useViewModel from './ViewModel';
import moment from 'moment';
import 'moment-timezone';
import IconXCircle from '@/components/Icon/IconXCircle';
import IconSend from '@/components/Icon/IconSend';
import { Link } from 'react-router-dom';
import { paths } from '@/router/paths';

const WalletPaymentExportView: FC = () => {
    const { dateRef, modeOptions, statusOptions, methodOptions, userOptions, isSubmitting, formState, onChangeFormState, onClearFormState, onSubmit } = useViewModel();

    return (
        <Fragment>
            <div className='panel'>
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-12 lg:col-span-4'>
                        <label htmlFor='createdAt'>
                            วันที่ทำรายการ
                            <span className='text-danger ml-1'>*</span>
                        </label>
                        <div className='relative'>
                            <Flatpickr
                                ref={dateRef}
                                value={[formState.startDate, formState.endDate]}
                                lang='en'
                                options={{
                                    mode: 'range',
                                    dateFormat: 'F j, Y',
                                    position: 'auto left',
                                    maxDate: moment().tz('Asia/Bangkok').toDate()
                                }}
                                className='form-input placeholder:text-gray-400 text-meelike-dark focus:border-meelike-primary cursor-pointer rounded-lg font-semibold'
                                onChange={date => {
                                    if (date.length === 2) {
                                        onChangeFormState('startDate', date[0]);
                                        onChangeFormState('endDate', date[1]);
                                    }
                                }}
                            />
                            <span className='absolute end-2 top-1/2 -translate-y-1/2'>
                                <button
                                    onClick={() => {
                                        dateRef.current.flatpickr.open();
                                    }}
                                    type='button'
                                    className='bg-none border-0 shadow-none px-1 py-1 hover:bg-meelike-secondary transition-all text-meelike-dark btn'
                                >
                                    <IconCalendar fill={true} className='h-4' />
                                </button>
                            </span>
                        </div>
                    </div>

                    <div className='col-span-12 lg:col-span-4'>
                        <label htmlFor='method'>วิธีการเติมเงิน</label>
                        <Select
                            isMulti
                            value={methodOptions.filter(option => formState.method.includes(option.value))}
                            onChange={(option: any) => {
                                onChangeFormState(
                                    'method',
                                    option.map((item: any) => item.value)
                                );
                            }}
                            options={methodOptions}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='เลือกวิธีการเติมเงิน...'
                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base: any) => ({ ...base, zIndex: 1000 })
                            }}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                        />
                    </div>

                    <div className='col-span-12 lg:col-span-4'>
                        <label htmlFor='userId'>ผู้ใช้งาน</label>
                        <VirtualizedSelect
                            isMulti
                            value={userOptions.filter(option => formState.userId.includes(option.value))}
                            onChange={(option: any) => {
                                if (!Array.isArray(option)) {
                                    onChangeFormState('userId', [...formState.userId, option.value]);
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
                            styles={{
                                menuPortal: (base: any) => ({ ...base, zIndex: 1000 })
                            }}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                        />
                    </div>

                    <div className='col-span-12 lg:col-span-4'>
                        <label htmlFor='status'>สถานะของการเติมเงิน</label>
                        <Select
                            isMulti
                            value={statusOptions.filter(option => formState.status.includes(option.value))}
                            onChange={(option: any) => {
                                onChangeFormState(
                                    'status',
                                    option.map((item: any) => item.value)
                                );
                            }}
                            options={statusOptions}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='เลือกสถานะ...'
                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base: any) => ({ ...base, zIndex: 1000 })
                            }}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                        />
                    </div>

                    <div className='col-span-12 lg:col-span-4'>
                        <label htmlFor='mode'>Mode</label>
                        <Select
                            value={modeOptions.find(option => formState.mode === option.value) ?? null}
                            onChange={(option: any) => {
                                onChangeFormState('mode', option ? option.value : 'all');
                            }}
                            options={modeOptions}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='เลือก Mode...'
                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base: any) => ({ ...base, zIndex: 1000 })
                            }}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                        />
                    </div>

                    <div className='col-span-12'>
                        <div className='flex flex-row items-center gap-4 justify-end'>
                            <Link to={paths.wallet.payment}>
                                <button type='button' className='btn btn-secondary lg:w-auto' disabled={isSubmitting}>
                                    <div className='hidden lg:block'>ย้อนกลับ</div>
                                </button>
                            </Link>

                            <button type='button' className='btn btn-danger lg:w-auto' disabled={isSubmitting} onClick={onClearFormState}>
                                <IconXCircle className='w-8 text-white' />
                                <div className='hidden lg:block'>ล้างค่า</div>
                            </button>

                            <button type='button' className='btn btn-success lg:w-auto' disabled={isSubmitting} onClick={onSubmit}>
                                <IconSend className='w-8 text-white' />
                                <div className='hidden lg:block'>สร้างไฟล์</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                 .fast-option {
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

export default WalletPaymentExportView;
