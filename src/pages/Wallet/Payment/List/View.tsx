import { type FC, Fragment } from 'react';
import { Link } from 'react-router-dom';

import IconPlusCircle from '@/components/Icon/IconPlusCircle';
import IconSearch from '@/components/Icon/IconSearch';
import IconWallet from '@/components/Icon/IconWallet';
import { DataTable } from 'mantine-datatable';
import Select from 'react-select';
import CreatePaymentFormView from '../CreateForm/View';
import Flatpickr from 'react-flatpickr';
import IconCalendar from '@/components/Icon/IconCalendar';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconDownload from '@/components/Icon/IconDownload';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';

import ResendToEtax from '../ResendToEtax/View';

import useViewModel from './ViewModel';
import { paths } from '@/router/paths';
import moment from 'moment';
import { clsx } from '@mantine/core';

const WalletPaymentListView: FC = () => {
    const {
        isSubmitting,
        isLoading,
        userOptions,
        statusOptions,
        isSendToEtaxOptions,
        isSendETaxFailedOptions,
        page,
        setPage,
        pageSize,
        setPageSize,
        selectedRecords,
        setSelectedRecords,
        filterDateRef,
        filterState,
        onChangeFilterState,
        PAGE_SIZES,
        totalData,
        data,
        columns,
        isOpenForm,
        isOpenResendToEtax,
        resendToEtaxData,
        onCreate,
        onCloseForm,
        handleAfterSubmit,
        onDownloadTaxInvoiceAll,
        onCloseResendToEtax,
        onAfterResendToEtax
    } = useViewModel();

    return (
        <Fragment>
            <CreatePaymentFormView isOpen={isOpenForm} handleClose={onCloseForm} handleAfterSubmit={handleAfterSubmit} />
            <ResendToEtax isOpen={isOpenResendToEtax} data={resendToEtaxData} handleClose={onCloseResendToEtax} handleAfterSubmit={onAfterResendToEtax} />

            <div className='space-y-4'>
                {/* Header Section */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-semibold text-meelike-dark flex items-center gap-3'>
                            <span className='w-10 h-10 bg-meelike-dark/10 rounded-apple-sm flex items-center justify-center'>
                                <IconWallet className='w-5 h-5 text-meelike-dark' />
                            </span>
                            ประวัติการเติมเงิน
                        </h1>
                        <p className='text-meelike-dark-2 mt-1 text-sm'>
                            {totalData.toLocaleString('th-TH')} รายการ
                            {selectedRecords.length > 0 && (
                                <span className='ml-2 px-2 py-0.5 bg-meelike-dark text-white rounded-full text-xs font-semibold'>
                                    เลือก {selectedRecords.length} รายการ
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-wrap gap-2'>
                        <button
                            className='btn bg-meelike-dark text-white hover:bg-meelike-dark/90'
                            onClick={onCreate}
                        >
                            <IconPlusCircle className='w-4 h-4' />
                            <span>เติมเงิน</span>
                        </button>
                        <div className='dropdown'>
                            <Dropdown
                                placement={'bottom-end'}
                                btnClassName='btn bg-white border border-black/10 text-meelike-dark hover:bg-gray-50'
                                button={
                                    <Fragment>
                                        <span className='flex items-center gap-1'>
                                            Actions
                                            <IconCaretDown className='w-4 h-4' />
                                        </span>
                                    </Fragment>
                                }
                                buttonDisabled={isSubmitting || selectedRecords.length === 0}
                            >
                                <ul className='!min-w-[250px]'>
                                    <li>
                                        <button
                                            type='button'
                                            className={clsx('flex items-center gap-2 w-full', {
                                                'opacity-50 cursor-not-allowed': isSubmitting
                                            })}
                                            onClick={onDownloadTaxInvoiceAll}
                                            disabled={isSubmitting}
                                        >
                                            <IconDownload className='w-4 h-4' />
                                            <span>Download Tax Invoice All</span>
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                        <Link to={paths.wallet.paymentExport}>
                            <button type='button' className='btn bg-meelike-primary text-meelike-dark hover:bg-meelike-primary/90'>
                                <IconDownload className='w-4 h-4' />
                                <span>Export</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Filters Panel */}
                <div className='panel'>
                    <div className='grid grid-cols-12 gap-4'>
                        {/* Date Range */}
                        <div className='col-span-12 lg:col-span-3'>
                            <label className='text-sm font-medium text-meelike-dark mb-1.5 block'>วันที่</label>
                            <div className='relative'>
                                <Flatpickr
                                    ref={filterDateRef}
                                    value={filterState.dateRanges}
                                    lang='en'
                                    options={{
                                        mode: 'range',
                                        dateFormat: 'd M Y',
                                        position: 'auto left',
                                        maxDate: moment().tz('Asia/Bangkok').toDate()
                                    }}
                                    className='form-input pr-10'
                                    onChange={date => {
                                        onChangeFilterState('dateRanges', date);
                                    }}
                                />
                                <button
                                    onClick={() => filterDateRef.current.flatpickr.open()}
                                    type='button'
                                    className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors'
                                >
                                    <IconCalendar fill={true} className='w-4 h-4 text-meelike-dark-2' />
                                </button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className='col-span-12 lg:col-span-3'>
                            <label className='text-sm font-medium text-meelike-dark mb-1.5 block'>คำค้นหา</label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    placeholder='ค้นหา ID, ชื่อผู้ใช้...'
                                    className='form-input pl-10'
                                    value={filterState.search}
                                    onChange={e => onChangeFilterState('search', e.target.value)}
                                />
                                <IconSearch className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-meelike-dark-2' />
                            </div>
                        </div>

                        {/* User Filter */}
                        <div className='col-span-12 lg:col-span-3'>
                            <label className='text-sm font-medium text-meelike-dark mb-1.5 block'>ผู้ใช้</label>
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
                                styles={{
                                    menuPortal: (base: any) => ({ ...base, zIndex: 1000 }),
                                    control: (base: any) => ({ ...base, minHeight: '42px', borderRadius: '8px', borderColor: 'rgba(0,0,0,0.1)' })
                                }}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>

                        {/* Payment Status */}
                        <div className='col-span-12 lg:col-span-3'>
                            <label className='text-sm font-medium text-meelike-dark mb-1.5 block'>สถานะการชำระเงิน</label>
                            <Select
                                isClearable
                                options={statusOptions}
                                value={statusOptions.find(option => option.value === filterState.status) || null}
                                onChange={value => onChangeFilterState('status', value?.value ?? undefined)}
                                placeholder='เลือกสถานะ'
                                styles={{
                                    control: (base: any) => ({ ...base, minHeight: '42px', borderRadius: '8px', borderColor: 'rgba(0,0,0,0.1)' }),
                                    menu: (base: any) => ({ ...base, zIndex: 9999 })
                                }}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>

                        {/* e-Tax Send */}
                        <div className='col-span-12 lg:col-span-3'>
                            <label className='text-sm font-medium text-meelike-dark mb-1.5 block'>ส่งไป e-Tax</label>
                            <Select
                                isClearable
                                options={isSendToEtaxOptions}
                                value={isSendToEtaxOptions.find(option => option.value === filterState.isSendToEtax) || null}
                                onChange={value => onChangeFilterState('isSendToEtax', value?.value ?? undefined)}
                                placeholder='เลือก...'
                                styles={{
                                    control: (base: any) => ({ ...base, minHeight: '42px', borderRadius: '8px', borderColor: 'rgba(0,0,0,0.1)' }),
                                    menu: (base: any) => ({ ...base, zIndex: 9999 })
                                }}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>

                        {/* e-Tax Status */}
                        <div className='col-span-12 lg:col-span-3'>
                            <label className='text-sm font-medium text-meelike-dark mb-1.5 block'>สถานะการส่ง e-Tax</label>
                            <Select
                                isClearable
                                options={isSendETaxFailedOptions}
                                value={isSendETaxFailedOptions.find(option => option.value === filterState.isSendETaxFailed) || null}
                                onChange={value => onChangeFilterState('isSendETaxFailed', value?.value ?? undefined)}
                                placeholder='เลือก...'
                                styles={{
                                    control: (base: any) => ({ ...base, minHeight: '42px', borderRadius: '8px', borderColor: 'rgba(0,0,0,0.1)' }),
                                    menu: (base: any) => ({ ...base, zIndex: 9999 })
                                }}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className='panel p-0 overflow-hidden'>
                    <div className='datatables meelike-custom'>
                        <DataTable
                            fetching={isLoading}
                            noRecordsText='ไม่พบข้อมูล'
                            highlightOnHover
                            className='whitespace-nowrap table-hover'
                            records={data}
                            columns={columns}
                            totalRecords={totalData}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={p => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={filterState.sortStatus}
                            onSortStatusChange={sortStatus => {
                                onChangeFilterState('sortStatus', sortStatus);
                            }}
                            selectedRecords={selectedRecords}
                            onSelectedRecordsChange={setSelectedRecords}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `แสดง ${from} - ${to} จาก ${totalRecords}`}
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
                    font-size: 0.875rem !important;
                }

                /* Rows */
                .datatables.meelike-custom table tbody tr {
                    transition: background-color 0.15s ease;
                }
                .datatables.meelike-custom table tbody tr:hover {
                    background-color: rgba(147, 112, 88, 0.05) !important;
                }

                /* Pagination */
                .datatables.meelike-custom > div > div:nth-child(2) {
                    padding: 0.75rem 1rem !important;
                    border-top: 1px solid rgba(0,0,0,0.05);
                }
                .datatables.meelike-custom .mantine-Pagination-item[data-active="true"] {
                    background-color: #937058 !important;
                    color: #FFFFF5 !important;
                    font-weight: 600;
                }
            `}</style>
        </Fragment>
    );
};

export default WalletPaymentListView;
