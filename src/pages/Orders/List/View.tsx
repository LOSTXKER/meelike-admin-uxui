import { type FC, Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import IconSearch from '@/components/Icon/IconSearch';
import IconCalendar from '@/components/Icon/IconCalendar';
import IconInfoCircle from '@/components/Icon/IconInfoCircle';
import IconX from '@/components/Icon/IconX';
import IconCircleCheck from '@/components/Icon/IconCircleCheck';
import IconLoader from '@/components/Icon/IconLoader';
import IconClock from '@/components/Icon/IconClock';
import IconBarChart from '@/components/Icon/IconBarChart';
import IconXCircle from '@/components/Icon/IconXCircle';
import IconRefresh from '@/components/Icon/IconRefresh';
import IconMinusCircle from '@/components/Icon/IconMinusCircle';
import IconInfoTriangle from '@/components/Icon/IconInfoTriangle';
import IconListCheck from '@/components/Icon/IconListCheck';
import IconShoppingCart from '@/components/Icon/IconShoppingCart';
import Flatpickr from 'react-flatpickr';
import FilterButton from '@/pages/Components/MeeLike/FilterButton';
import { DataTable } from 'mantine-datatable';
import Select from 'react-select';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconDownload from '@/components/Icon/IconDownload';

import OrderDetailView from '../Detail/View';
import OrderSetManualStatusView from '../SetManualStatus/View';

import useViewModel from './ViewModel';
import moment from 'moment';
import 'moment-timezone';
import { paths } from '@/router/paths';
import { clsx } from '@mantine/core';
import IconKey from '@/components/Icon/IconKey';

const OrdersListView: FC = () => {
    const {
        isLoading,
        isSubmitting,
        isOpenDetail,
        TIMEZONE,
        PAGE_SIZES,
        serviceCategoryOptions,
        orderStatusOptions,
        orderSourceOptions,
        providerOptions,
        serviceOptions,
        modeOptions,
        userOptions,
        page,
        pageSize,
        onChangePage,
        onChangePageSize,
        selectedRecords,
        setSelectedRecords,
        totalData,
        data,
        hasNegativeProfit,
        columns,
        filterState,
        filterDateRef,
        isOpenSetManualStatus,
        isHideSetManualStatus,
        isRecordSelectable,
        doAllSelectedOnlyFAIL,
        canChangeStatusAll,
        orderSetStatusType,
        onChangeFilterState,
        onCloseDetail,
        onCancelAndRefundMultiple,
        onCopyToClipboard,
        onCloseManualStatus,
        onSubmitManualStatus,
        onSetManualStatusMultiple,
        onSubmitMultipleChangeStatus,
        onSubmitMultipleResend
    } = useViewModel();

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Check if any advanced filter is active
    const hasActiveAdvancedFilter =
        filterState.categoryId ||
        filterState.providerId ||
        filterState.serviceId ||
        filterState.mode !== 'all' ||
        filterState.source ||
        filterState.userId;

    return (
        <Fragment>
            <OrderDetailView isOpen={isOpenDetail} handleClose={onCloseDetail} />
            <OrderSetManualStatusView
                isSubmitting={isSubmitting}
                isOpen={isOpenSetManualStatus}
                isHideToConfirm={isHideSetManualStatus}
                handleClose={onCloseManualStatus}
                handleSubmit={orderSetStatusType === 'single' ? onSubmitManualStatus : onSubmitMultipleChangeStatus}
            />

            <div className='space-y-6'>
                {/* Header Section */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-semibold text-meelike-dark flex items-center gap-3'>
                            <span className='w-10 h-10 bg-meelike-dark/10 rounded-apple-sm flex items-center justify-center'>
                                <IconShoppingCart className='w-5 h-5 text-meelike-dark' />
                            </span>
                            คำสั่งซื้อ
                        </h1>
                        <p className='text-meelike-dark-2 mt-1 text-sm'>
                            {totalData.toLocaleString('th-TH')} รายการ
                            {selectedRecords.length > 0 && (
                                <span className='ml-2 text-meelike-dark font-medium'>
                                    • เลือกแล้ว {selectedRecords.length} รายการ
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-wrap items-center gap-3'>
                        <div className='dropdown'>
                            <Dropdown
                                placement={'bottom-end'}
                                btnClassName='btn btn-outline-dark text-sm !py-2'
                                button={
                                    <Fragment>
                                        <span className='flex items-center gap-1.5'>
                                            Actions
                                            <IconCaretDown className='w-3.5 h-3.5' />
                                        </span>
                                    </Fragment>
                                }
                                buttonDisabled={isSubmitting || selectedRecords.length === 0}
                            >
                                <ul className='!min-w-[220px]'>
                                    <li>
                                        <button
                                            type='button'
                                            className={clsx('font-medium text-left text-sm', {
                                                'opacity-50 cursor-not-allowed': isSubmitting || !canChangeStatusAll
                                            })}
                                            onClick={() => onSetManualStatusMultiple()}
                                            disabled={isSubmitting || !canChangeStatusAll}
                                        >
                                            <IconKey className='w-4 h-4 mr-2' />
                                            <span>Change Status</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type='button'
                                            className={clsx('font-medium text-left text-sm', {
                                                'opacity-50 cursor-not-allowed': isSubmitting || !doAllSelectedOnlyFAIL
                                            })}
                                            onClick={() => onSubmitMultipleResend()}
                                            disabled={isSubmitting || !doAllSelectedOnlyFAIL}
                                        >
                                            <IconKey className='w-4 h-4 mr-2' />
                                            <span>Resend Order</span>
                                        </button>
                                    </li>
                                    <li className='border-t border-black/5 dark:border-white/10 mt-1 pt-1'>
                                        <button
                                            type='button'
                                            className='font-medium text-left text-sm text-danger'
                                            onClick={() => onCancelAndRefundMultiple()}
                                            disabled={isSubmitting}
                                        >
                                            <IconX className='w-4 h-4 mr-2' />
                                            <span>ยกเลิกและคืนเงิน</span>
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>

                        <div className='dropdown'>
                            <Dropdown
                                placement={'bottom-end'}
                                btnClassName='btn btn-outline-dark text-sm !py-2'
                                button={
                                    <Fragment>
                                        <span className='flex items-center gap-1.5'>
                                            Copy
                                            <IconCaretDown className='w-3.5 h-3.5' />
                                        </span>
                                    </Fragment>
                                }
                                buttonDisabled={isSubmitting || selectedRecords.length === 0}
                            >
                                <ul className='!min-w-[220px]'>
                                    <li>
                                        <button type='button' className='font-medium text-left text-sm' onClick={() => onCopyToClipboard('orderId')} disabled={isSubmitting}>
                                            Order ID
                                        </button>
                                    </li>
                                    <li>
                                        <button type='button' className='font-medium text-left text-sm' onClick={() => onCopyToClipboard('orderExternalId')} disabled={isSubmitting}>
                                            External ID
                                        </button>
                                    </li>
                                    <li>
                                        <button type='button' className='font-medium text-left text-sm' onClick={() => onCopyToClipboard('link')} disabled={isSubmitting}>
                                            Target Link
                                        </button>
                                    </li>
                                    <li>
                                        <button type='button' className='font-medium text-left text-sm' onClick={() => onCopyToClipboard('allColumnData')} disabled={isSubmitting}>
                                            All Column Data
                                        </button>
                                    </li>
                                    <li>
                                        <button type='button' className='font-medium text-left text-sm' onClick={() => onCopyToClipboard('allColumnDataWithProvider')} disabled={isSubmitting}>
                                            All Data + Provider
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>

                        <Link to={paths.orders.export}>
                            <button type='button' className='btn btn-secondary text-sm !py-2' disabled={isSubmitting}>
                                <IconDownload className='h-4 w-4' />
                                <span className='hidden lg:inline'>Export</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Alert for negative profit */}
                {hasNegativeProfit && (
                    <div className='flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 rounded-apple text-danger'>
                        <IconInfoCircle className='w-5 h-5 flex-shrink-0' />
                        <span className='text-sm'>
                            มีออร์เดอร์ที่ได้กำไร<strong className='ml-1'>เป็นลบ</strong>
                        </span>
                        <button
                            type='button'
                            className='ml-auto text-sm font-medium hover:underline'
                            onClick={() => {
                                onChangeFilterState('showNegativeProfit', !filterState.showNegativeProfit);
                            }}
                        >
                            {filterState.showNegativeProfit ? 'ซ่อน' : 'แสดง'}
                        </button>
                    </div>
                )}

                {/* Filters Panel */}
                <div className='panel !p-5 space-y-5'>
                    {/* Primary Filters Row */}
                    <div className='flex flex-col lg:flex-row gap-4'>
                        {/* Search */}
                        <div className='flex-1'>
                            <div className='relative'>
                                <input
                                    id='search'
                                    type='text'
                                    placeholder='ค้นหาด้วย ID, ชื่อบริการ หรือลิงก์...'
                                    className='form-input pl-11 pr-4 h-11 text-sm'
                                    autoComplete='off'
                                    name='search'
                                    value={filterState.search}
                                    onChange={e => onChangeFilterState('search', e.target.value)}
                                />
                                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-meelike-dark-2'>
                                    <IconSearch className='w-4 h-4' fill={true} />
                                </span>
                            </div>
                        </div>

                        {/* Date Picker */}
                        <div className='lg:w-72'>
                            <div className='relative'>
                                <Flatpickr
                                    ref={filterDateRef}
                                    value={filterState.dateRanges}
                                    lang='en'
                                    options={{
                                        mode: 'range',
                                        dateFormat: 'j M Y',
                                        position: 'auto left',
                                        maxDate: moment().tz(TIMEZONE).toDate()
                                    }}
                                    className='form-input pr-11 h-11 text-sm cursor-pointer'
                                    placeholder='เลือกวันที่...'
                                    onChange={date => {
                                        onChangeFilterState('dateRanges', date);
                                    }}
                                />
                                <span className='absolute right-3 top-1/2 -translate-y-1/2'>
                                    <button
                                        onClick={() => filterDateRef.current.flatpickr.open()}
                                        type='button'
                                        className='p-1.5 hover:bg-meelike-secondary/50 rounded-lg transition-colors text-meelike-dark-2'
                                    >
                                        <IconCalendar className='h-4 w-4' fill={true} />
                                    </button>
                                </span>
                            </div>
                        </div>

                        {/* Advanced Filters Toggle */}
                        <button
                            type='button'
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={clsx(
                                'btn text-sm !py-2 lg:w-auto transition-all',
                                showAdvancedFilters || hasActiveAdvancedFilter
                                    ? 'btn-primary'
                                    : 'btn-outline-dark'
                            )}
                        >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' />
                            </svg>
                            <span>Filters</span>
                            {hasActiveAdvancedFilter && (
                                <span className='w-2 h-2 bg-white rounded-full animate-pulse'></span>
                            )}
                        </button>
                    </div>

                    {/* Status Filter Buttons */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-meelike-dark-2'>สถานะ</label>
                        <div className='flex flex-wrap gap-2.5'>
                            <FilterButton
                                active={filterState.status.length === orderStatusOptions.length || filterState.status.length === 0}
                                icon={<IconListCheck className='w-4 h-4' />}
                                title='All'
                                onClick={() => onChangeFilterState('status', [])}
                            />
                            {orderStatusOptions.map(orderStatus => {
                                // Icon mapping for status
                                const getStatusIcon = (status: string) => {
                                    const iconClasses = 'w-4 h-4';
                                    switch (status) {
                                        case 'AWAITING':
                                            return <IconClock className={iconClasses} />;
                                        case 'PENDING':
                                            return <IconClock className={iconClasses} />;
                                        case 'IN_PROGRESS':
                                            return <IconLoader className={iconClasses} />;
                                        case 'PROCESSING':
                                            return <IconLoader className={iconClasses} />;
                                        case 'COMPLETED':
                                            return <IconCircleCheck className={iconClasses} />;
                                        case 'PARTIAL':
                                            return <IconCircleCheck className={iconClasses} />;
                                        case 'HOLD':
                                            return <IconMinusCircle className={iconClasses} />;
                                        case 'ON_REFILL':
                                            return <IconRefresh className={`${iconClasses} text-red-500`} />;
                                        case 'REFILLED':
                                            return <IconCircleCheck className={iconClasses} />;
                                        case 'REFILL':
                                            return <IconRefresh className={iconClasses} />;
                                        case 'CANCELLED':
                                            return <IconCircleCheck className={`${iconClasses} text-green-500`} />;
                                        case 'FAIL':
                                            return <IconXCircle className={`${iconClasses} text-red-500`} />;
                                        case 'ERROR':
                                            return <IconXCircle className={`${iconClasses} text-red-500`} />;
                                        default:
                                            return <IconInfoCircle className={iconClasses} />;
                                    }
                                };

                                return (
                                    <FilterButton
                                        key={`order-status-filter-button-${orderStatus.value}`}
                                        count={orderStatus.count}
                                        icon={getStatusIcon(orderStatus.value)}
                                        active={filterState.status.includes(orderStatus.value)}
                                        title={orderStatus.label}
                                        onClick={() => onChangeFilterState('status', [orderStatus.value])}
                                        className={clsx({
                                            'bg-red-100 text-red-700 border-red-200':
                                                !filterState.status.includes(orderStatus.value) && (orderStatus.value === 'FAIL' || orderStatus.value === 'ERROR') && orderStatus.count > 0,
                                            '!bg-red-500 !text-white !border-red-500':
                                                filterState.status.includes(orderStatus.value) && (orderStatus.value === 'FAIL' || orderStatus.value === 'ERROR') && orderStatus.count > 0
                                        })}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Advanced Filters (Collapsible) */}
                    <div
                        className={clsx(
                            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden transition-all duration-300 ease-apple',
                            showAdvancedFilters ? 'max-h-[500px] opacity-100 pt-4 border-t border-black/5' : 'max-h-0 opacity-0'
                        )}
                    >
                        <div>
                            <label className='text-xs font-medium text-meelike-dark-2 mb-1.5 block'>หมวดหมู่</label>
                            <Select
                                isClearable
                                isMulti={false}
                                placeholder='เลือกหมวดหมู่...'
                                options={serviceCategoryOptions}
                                value={serviceCategoryOptions.find(option => option.value === filterState.categoryId) ?? null}
                                onChange={option => onChangeFilterState('categoryId', option?.value ?? '')}
                                styles={{
                                    control: baseStyles => ({
                                        ...baseStyles,
                                        borderColor: 'rgba(0,0,0,0.1)',
                                        minHeight: '42px',
                                        fontSize: '14px'
                                    }),
                                    menu: baseStyles => ({ ...baseStyles, zIndex: 9999 })
                                }}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>

                        <div>
                            <label className='text-xs font-medium text-meelike-dark-2 mb-1.5 block'>ผู้ให้บริการ</label>
                            <Select
                                isClearable
                                isMulti={false}
                                placeholder='เลือกผู้ให้บริการ...'
                                options={providerOptions}
                                value={providerOptions.find(option => option.value === filterState.providerId) ?? null}
                                onChange={option => onChangeFilterState('providerId', option?.value ?? '')}
                                styles={{
                                    control: baseStyles => ({
                                        ...baseStyles,
                                        borderColor: 'rgba(0,0,0,0.1)',
                                        minHeight: '42px',
                                        fontSize: '14px'
                                    }),
                                    menu: baseStyles => ({ ...baseStyles, zIndex: 9999 })
                                }}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>

                        <div className='relative z-50'>
                            <label className='text-xs font-medium text-meelike-dark-2 mb-1.5 block'>บริการ</label>
                            <VirtualizedSelect
                                isClearable
                                isMulti={false}
                                value={serviceOptions.find(option => option.value === filterState.serviceId) ?? null}
                                onChange={(option: any) => onChangeFilterState('serviceId', option?.value ?? '')}
                                options={serviceOptions}
                                className='react-select'
                                classNamePrefix='select'
                                placeholder='เลือกบริการ...'
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 1000 }) }}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>

                        <div>
                            <label className='text-xs font-medium text-meelike-dark-2 mb-1.5 block'>Mode</label>
                            <Select
                                isClearable={false}
                                isMulti={false}
                                placeholder='เลือก Mode...'
                                options={modeOptions}
                                value={modeOptions.find(option => option.value === filterState.mode) ?? null}
                                onChange={option => onChangeFilterState('mode', option?.value ?? '')}
                                styles={{
                                    control: baseStyles => ({
                                        ...baseStyles,
                                        borderColor: 'rgba(0,0,0,0.1)',
                                        minHeight: '42px',
                                        fontSize: '14px'
                                    }),
                                    menu: baseStyles => ({ ...baseStyles, zIndex: 9999 })
                                }}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>

                        <div>
                            <label className='text-xs font-medium text-meelike-dark-2 mb-1.5 block'>Source</label>
                            <Select
                                isClearable
                                isMulti={false}
                                placeholder='เลือก Source...'
                                options={orderSourceOptions}
                                value={orderSourceOptions.find(option => option.value === filterState.source) ?? null}
                                onChange={option => onChangeFilterState('source', option?.value ?? '')}
                                styles={{
                                    control: baseStyles => ({
                                        ...baseStyles,
                                        borderColor: 'rgba(0,0,0,0.1)',
                                        minHeight: '42px',
                                        fontSize: '14px'
                                    }),
                                    menu: baseStyles => ({ ...baseStyles, zIndex: 9999 })
                                }}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>

                        <div>
                            <label className='text-xs font-medium text-meelike-dark-2 mb-1.5 block'>ผู้ใช้งาน</label>
                            <VirtualizedSelect
                                isClearable
                                value={userOptions.find(option => filterState.userId === option.value) ?? null}
                                onChange={(option: any) => {
                                    if (option) {
                                        onChangeFilterState('userId', option.value);
                                    } else {
                                        onChangeFilterState('userId', option);
                                    }
                                }}
                                options={userOptions}
                                className='react-select'
                                classNamePrefix='select'
                                placeholder='เลือกผู้ใช้งาน...'
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 1000 }) }}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='panel !p-0 overflow-hidden'>
                    <div className='datatables meelike-custom'>
                        <DataTable
                            fetching={isLoading}
                            rowClassName={record => {
                                const baseClass = 'text-white';
                                const isSelectable = isRecordSelectable(record);
                                return isSelectable ? baseClass : `${baseClass} opacity-50 cursor-not-allowed`;
                            }}
                            noRecordsText='ไม่พบรายการ'
                            highlightOnHover
                            className='whitespace-nowrap table-hover'
                            records={data}
                            columns={columns}
                            totalRecords={totalData}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={onChangePage}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={onChangePageSize}
                            sortStatus={filterState.sortStatus}
                            onSortStatusChange={sortStatus => {
                                onChangeFilterState('sortStatus', sortStatus);
                            }}
                            selectedRecords={selectedRecords}
                            onSelectedRecordsChange={setSelectedRecords}
                            isRecordSelectable={isRecordSelectable}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `${from} - ${to} จาก ${totalRecords}`}
                            paginationSize='xs'
                        />
                    </div>
                </div>
            </div>

            <style>{`
                /* Header */
                .datatables.meelike-custom table thead tr {
                    background-color: #FDE8BD !important;
                    color: #473B30 !important;
                }

                .datatables.meelike-custom table thead tr th {
                    font-weight: 500 !important;
                    font-size: 0.8125rem !important;
                    padding: 0.875rem 1rem !important;
                }

                .datatables.meelike-custom table tbody tr td {
                    padding: 0.875rem 1rem !important;
                    font-size: 0.875rem !important;
                }

                /* Pagination Active Item */
                .datatables.meelike-custom .mantine-Pagination-item[data-active="true"] {
                    background-color: #937058 !important;
                    color: #FFFFF5 !important;
                    font-weight: 600;
                }

                /* Pagination */
                .datatables.meelike-custom > div > div:nth-child(2) {
                    padding: 0.75rem 1rem !important;
                    background: #FAFAFA;
                    border-top: 1px solid rgba(0,0,0,0.05);
                }

                /* Header Checkbox */
                .datatables.meelike-custom table thead .mantine-Checkbox-input {
                    border-color: #D1D5DB !important;
                }

                /* Row hover */
                .datatables.meelike-custom table tbody tr:hover {
                    background-color: #FEF7ED !important;
                }

                /* Disable Unselectable Rows Opacity and Cursor Not Allowed */
                .datatables.meelike-custom table tbody tr.opacity-50.cursor-not-allowed {
                    opacity: 1 !important;
                    cursor: auto !important;
                }

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

export default OrdersListView;
