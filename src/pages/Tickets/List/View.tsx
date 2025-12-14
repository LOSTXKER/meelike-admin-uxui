import { type FC, Fragment } from 'react';

import IconSearch from '@/components/Icon/IconSearch';
import IconCalendar from '@/components/Icon/IconCalendar';
import IconTag from '@/components/Icon/IconTag';
import Flatpickr from 'react-flatpickr';
import { DataTable } from 'mantine-datatable';
import Select from 'react-select';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconOpenBook from '@/components/Icon/IconOpenBook';
import IconTrash from '@/components/Icon/IconTrash';
import IconLockDots from '@/components/Icon/IconLockDots';
import IconChecks from '@/components/Icon/IconChecks';
import TicketChangeStatusModalView from '../ChangeStatus/View';

import useViewModel from './ViewModel';
import moment from 'moment';
import 'moment-timezone';

const TicketListView: FC = () => {
    const {
        isLoading,
        isSubmitting,
        TIMEZONE,
        PAGE_SIZES,
        ticketTypeOptions,
        ticketStatusOptions,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalData,
        data,
        columns,
        filterState,
        issuedDateRef,
        closedDateRef,
        isOpenChangeStatusModal,
        isHideToConfirmChangeStatus,
        selectedRecords,
        setSelectedRecords,
        onChangeFilterState,
        onMultipleChangeStatus,
        onSubmitChangeStatus,
        onCloseChangeStatus,
        onMultipleMarkAsUnread,
        onMultipleCloseAndLock,
        onMultipleDelete
    } = useViewModel();

    return (
        <Fragment>
            <TicketChangeStatusModalView
                isSubmitting={isSubmitting}
                isHideToConfirm={isHideToConfirmChangeStatus}
                isOpen={isOpenChangeStatusModal}
                handleClose={onCloseChangeStatus}
                handleSubmit={onSubmitChangeStatus}
            />

            <div className='space-y-4'>
                {/* Header Section */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-semibold text-meelike-dark flex items-center gap-3'>
                            <span className='w-10 h-10 bg-meelike-dark/10 rounded-apple-sm flex items-center justify-center'>
                                <IconTag className='w-5 h-5 text-meelike-dark' />
                            </span>
                            รายการตั๋ว
                        </h1>
                        <p className='text-meelike-dark-2 mt-1 text-sm'>
                            {totalData} ตั๋ว
                        </p>
                    </div>
                    {selectedRecords.length > 0 && (
                        <div className='flex flex-wrap items-center gap-2'>
                            <Dropdown
                                placement={'bottom-end'}
                                btnClassName='px-4 py-2.5 bg-meelike-primary text-meelike-dark rounded-apple text-sm font-medium hover:bg-meelike-primary/90 transition-colors'
                                button={
                                    <Fragment>
                                        <span>
                                            Actions ({selectedRecords.length})
                                            <IconCaretDown className='inline-block ml-1' />
                                        </span>
                                    </Fragment>
                                }
                                buttonDisabled={isSubmitting || selectedRecords.length === 0}
                            >
                                <ul className='!min-w-[200px]'>
                                    <li>
                                        <button type='button' className='font-semibold text-left' onClick={() => onMultipleChangeStatus()} disabled={isSubmitting}>
                                            <IconChecks className='w-4.5 h-4.5 mr-1' />
                                            <span>Change Status</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button type='button' className='font-semibold text-left' onClick={() => onMultipleMarkAsUnread()} disabled={isSubmitting}>
                                            <IconOpenBook className='w-4.5 h-4.5 mr-1' />
                                            <span>Mark As Unread</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button type='button' className='font-semibold text-left' onClick={() => onMultipleCloseAndLock()} disabled={isSubmitting}>
                                            <IconLockDots className='w-4.5 h-4.5 mr-1' />
                                            <span>Close and Lock</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button type='button' className='font-semibold text-left' onClick={() => onMultipleDelete()} disabled={isSubmitting}>
                                            <IconTrash className='w-4.5 h-4.5 mr-1' />
                                            <span>Delete</span>
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className='bg-white rounded-apple-lg border border-black/5 shadow-apple p-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {/* Search */}
                        <div>
                            <label htmlFor='search' className='block text-sm font-medium text-gray-700 mb-1'>ค้นหาตั๋ว</label>
                            <div className='relative'>
                                <IconSearch className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10' />
                                <input
                                    id='search'
                                    type='text'
                                    placeholder='Search'
                                    className='w-full pl-10 pr-4 py-2.5 rounded-apple border border-black/10 focus:outline-none focus:ring-2 focus:ring-meelike-primary/30 focus:border-meelike-primary bg-white'
                                    value={filterState.search}
                                    onChange={e => onChangeFilterState('search', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label htmlFor='type' className='block text-sm font-medium text-gray-700 mb-1'>ประเภทตั๋ว</label>
                            <Select
                                isClearable
                                isMulti={false}
                                placeholder={'เลือกประเภทตั๋ว'}
                                options={ticketTypeOptions}
                                value={ticketTypeOptions.find(option => option.value === filterState.type) ?? null}
                                onChange={option => {
                                    onChangeFilterState('type', option?.value ?? '');
                                }}
                                styles={{
                                    control: baseStyles => ({
                                        ...baseStyles,
                                        borderColor: 'rgb(0 0 0 / 0.1)',
                                        borderRadius: '0.75rem',
                                        minHeight: '42px'
                                    }),
                                    menu: baseStyles => ({
                                        ...baseStyles,
                                        zIndex: 9999
                                    })
                                }}
                                components={{
                                    IndicatorSeparator: () => null
                                }}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-1'>สถานะตั๋ว</label>
                            <Select
                                isClearable
                                isMulti={false}
                                placeholder={'เลือกสถานะตั๋ว'}
                                options={ticketStatusOptions}
                                value={ticketStatusOptions.find(option => option.value === filterState.status) ?? null}
                                onChange={option => {
                                    onChangeFilterState('status', option?.value ?? '');
                                }}
                                styles={{
                                    control: baseStyles => ({
                                        ...baseStyles,
                                        borderColor: 'rgb(0 0 0 / 0.1)',
                                        borderRadius: '0.75rem',
                                        minHeight: '42px'
                                    }),
                                    menu: baseStyles => ({
                                        ...baseStyles,
                                        zIndex: 9999
                                    })
                                }}
                                components={{
                                    IndicatorSeparator: () => null
                                }}
                            />
                        </div>

                        {/* Issued Date */}
                        <div>
                            <label htmlFor='issuedDate' className='block text-sm font-medium text-gray-700 mb-1'>วันที่ออกตั๋ว</label>
                            <div className='relative'>
                                <Flatpickr
                                    ref={issuedDateRef}
                                    value={filterState.issuedDateRanges as any}
                                    lang='en'
                                    options={{
                                        mode: 'range',
                                        dateFormat: 'F j, Y',
                                        position: 'auto left',
                                        maxDate: moment().tz(TIMEZONE).toDate()
                                    }}
                                    className='w-full pl-4 pr-10 py-2.5 rounded-apple border border-black/10 focus:outline-none focus:ring-2 focus:ring-meelike-primary/30 focus:border-meelike-primary bg-white cursor-pointer'
                                    onChange={date => {
                                        onChangeFilterState('issuedDateRanges', date);
                                    }}
                                />
                                <span className='absolute end-2 top-1/2 -translate-y-1/2'>
                                    <button
                                        onClick={() => {
                                            issuedDateRef.current.flatpickr.open();
                                        }}
                                        type='button'
                                        className='p-1 hover:bg-gray-100 rounded transition-colors'
                                    >
                                        <IconCalendar fill={true} className='h-4 text-gray-400' />
                                    </button>
                                </span>
                            </div>
                        </div>

                        {/* Closed Date */}
                        <div>
                            <label htmlFor='closedDate' className='block text-sm font-medium text-gray-700 mb-1'>วันที่ปิดตั๋ว</label>
                            <div className='relative'>
                                <Flatpickr
                                    ref={closedDateRef}
                                    value={filterState.closedDateRanges as any}
                                    lang='en'
                                    options={{
                                        mode: 'range',
                                        dateFormat: 'F j, Y',
                                        position: 'auto left',
                                        maxDate: moment().tz(TIMEZONE).toDate()
                                    }}
                                    className='w-full pl-4 pr-10 py-2.5 rounded-apple border border-black/10 focus:outline-none focus:ring-2 focus:ring-meelike-primary/30 focus:border-meelike-primary bg-white cursor-pointer'
                                    onChange={date => {
                                        onChangeFilterState('closedDateRanges', date);
                                    }}
                                />
                                <span className='absolute end-2 top-1/2 -translate-y-1/2'>
                                    <button
                                        onClick={() => {
                                            closedDateRef.current.flatpickr.open();
                                        }}
                                        type='button'
                                        className='p-1 hover:bg-gray-100 rounded transition-colors'
                                    >
                                        <IconCalendar fill={true} className='h-4 text-gray-400' />
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='bg-white rounded-apple-lg border border-black/5 shadow-apple overflow-hidden'>
                    <DataTable
                        fetching={isLoading}
                        rowClassName='text-white'
                        noRecordsText='No records found'
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
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords}`}
                        paginationSize='xs'
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default TicketListView;
