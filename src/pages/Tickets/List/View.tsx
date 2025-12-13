import { type FC, Fragment } from 'react';

import IconSearch from '@/components/Icon/IconSearch';
import IconCalendar from '@/components/Icon/IconCalendar';
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

            <div className='grid grid-cols-12 gap-5'>
                {/* Filters */}
                <div className='col-span-12'>
                    <div className='h-full'>
                        <div className='relative'>
                            <div className='grid grid-cols-12 gap-4'>
                                {/* Search */}
                                <div className='col-span-12 lg:col-span-4'>
                                    <label htmlFor='search'>ค้นหาตั๋ว</label>
                                    <div className='relative text-white-dark'>
                                        <input
                                            id='search'
                                            type='text'
                                            placeholder='ค้นหาตั๋ว'
                                            className={'form-input ps-10 placeholder:text-white-dark'}
                                            autoComplete='off'
                                            name='serach'
                                            value={filterState.search}
                                            onChange={e => onChangeFilterState('search', e.target.value)}
                                        />
                                        <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                                            <IconSearch fill={true} />
                                        </span>
                                    </div>
                                </div>
                                {/* Issued Date */}
                                <div className='col-span-12 lg:col-span-4'>
                                    <label htmlFor='orderDate'>วันที่ออกตั๋ว</label>
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
                                            className='form-input placeholder:text-gray-400 text-meelike-dark focus:border-meelike-primary cursor-pointer rounded-lg font-semibold'
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
                                                className='bg-none border-0 shadow-none px-1 py-1 hover:bg-meelike-secondary transition-all text-meelike-dark btn'
                                            >
                                                <IconCalendar fill={true} className='h-4' />
                                            </button>
                                        </span>
                                    </div>
                                </div>
                                {/* Closed Date */}
                                <div className='col-span-12 lg:col-span-4'>
                                    <label htmlFor='orderDate'>วันที่ปิดตั๋ว</label>
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
                                            className='form-input placeholder:text-gray-400 text-meelike-dark focus:border-meelike-primary cursor-pointer rounded-lg font-semibold'
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
                                                className='bg-none border-0 shadow-none px-1 py-1 hover:bg-meelike-secondary transition-all text-meelike-dark btn'
                                            >
                                                <IconCalendar fill={true} className='h-4' />
                                            </button>
                                        </span>
                                    </div>
                                </div>
                                {/* Type */}
                                <div className='col-span-12 lg:col-span-4'>
                                    <label htmlFor='type'>ประเภทตั๋ว</label>
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
                                                borderColor: 'rgb(224 230 237)'
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
                                <div className='col-span-12 lg:col-span-4'>
                                    <label htmlFor='status'>สถานะตั๋ว</label>
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
                                                borderColor: 'rgb(224 230 237)'
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className='col-span-12'>
                    <div className='flex flex-col lg:flex-row justify-end items-center'>
                        <div className='flex flex-row items-center gap-2 mt-4 lg:mt-0'>
                            <div className='dropdown'>
                                <Dropdown
                                    placement={'bottom-end'}
                                    btnClassName='btn btn-primary'
                                    button={
                                        <Fragment>
                                            <span>
                                                Actions
                                                <IconCaretDown className='inline-block' />
                                            </span>
                                        </Fragment>
                                    }
                                    buttonDisabled={isSubmitting || selectedRecords.length === 0}
                                >
                                    <ul className='!min-w-[300px]'>
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
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='col-span-12'>
                    <div className='panel h-full p-0 overflow-hidden'>
                        {/* <div className="mb-4">
                            <Link to="/ticket-create">
                                <button className="ml-auto btn bg-meelike-success text-white text-center shadow w-full hover:opacity-60 lg:w-48">
                                    <IconPlusCircle />
                                    <span className="pl-2">{t('rentChildPanel.create')}</span>
                                </button>
                            </Link>
                        </div> */}
                        <div className='relative datatables meelike-custom'>
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
                </div>
            </div>

            <style>{`
                /* Header */
				.datatables.meelike-custom table thead tr {
                    background-color: #FDE8BD !important;
                    color: #473B30 !important;
                }

                /* Pagination */
                .datatables.meelike-custom > div > div:nth-child(2) {
                    padding: 0.5rem 0.75rem !important;
                }

                /* Pagination Active Item */
                .datatables.meelike-custom .mantine-Pagination-item[data-active="true"] {
                    background-color: #937058 !important;
                    color: #FFFFF5 !important;
                    font-weight: 600;
                }
			`}</style>
        </Fragment>
    );
};

export default TicketListView;
