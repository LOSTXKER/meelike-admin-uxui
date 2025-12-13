import { type FC, Fragment } from 'react';
import { Link } from 'react-router-dom';

import IconPlusCircle from '@/components/Icon/IconPlusCircle';
import IconSearch from '@/components/Icon/IconSearch';
import IconTrash from '@/components/Icon/IconTrash';
import IconXCircle from '@/components/Icon/IconXCircle';
import IconChecks from '@/components/Icon/IconChecks';
import IconListCheck from '@/components/Icon/IconListCheck';
import { DataTable } from 'mantine-datatable';
import Select from 'react-select';
import ServiceFormView from '../Form/View';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';

import useViewModel from './ViewModel';
import { clsx } from '@mantine/core';
import { paths } from '@/router/paths';

const ServicesListView: FC = () => {
    const {
        isLoading,
        formType,
        isOpenForm,
        selectedId,
        isSubmitting,
        PAGE_SIZES,
        providerOptions,
        serviceCategoryOptions,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalData,
        data,
        columns,
        filterState,
        selectedRecords,
        setSelectedRecords,
        onCreate,
        onCloseForm,
        onChangeFilterState,
        handleAfterSubmit,
        onEnableAll,
        onDisableAll,
        onDeleteAll
    } = useViewModel();

    return (
        <Fragment>
            {/* Form */}
            <ServiceFormView isOpen={isOpenForm} formType={formType} selectedId={selectedId} handleClose={onCloseForm} handleAfterSubmit={handleAfterSubmit} />

            <div className='grid grid-cols-12 lg:gap-10'>
                {/* Filters */}
                <div className='col-span-12'>
                    <div className='w-full lg:w-2/4 flex flex-col lg:flex-row items-center gap-4'>
                        <div className='w-full'>
                            <label htmlFor='search' className='text-clink-input-label'>
                                คำค้นหา
                            </label>
                            <div className='relative text-white-dark'>
                                <input
                                    id='search'
                                    type='text'
                                    placeholder={'ค้นหา'}
                                    className={'form-input ps-10 placeholder:text-gray-400 h-[38px]'}
                                    autoComplete='off'
                                    name='search'
                                    value={filterState.search}
                                    onChange={e => onChangeFilterState('search', e.target.value)}
                                />
                                <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                                    <IconSearch fill={true} />
                                </span>
                            </div>
                        </div>

                        <div className='w-full'>
                            <label htmlFor='providerId' className='text-clink-input-label'>
                                ผู้ให้บริการ
                            </label>

                            <Select
                                isClearable
                                id='providerId'
                                className='w-full'
                                placeholder='เลือกผู้ให้บริการ'
                                options={providerOptions}
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                value={providerOptions.find(option => option.value === filterState.providerId) ?? null}
                                onChange={option => onChangeFilterState('providerId', option?.value)}
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

                        <div className='w-full'>
                            <label htmlFor='categoryId' className='text-clink-input-label'>
                                หมวดหมู่บริการ
                            </label>

                            <Select
                                isClearable
                                id='categoryId'
                                className='w-full'
                                placeholder='เลือกหมวดหมู่บริการ'
                                options={serviceCategoryOptions}
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                value={serviceCategoryOptions.find(option => option.value === filterState.categoryId) ?? null}
                                onChange={option => onChangeFilterState('categoryId', option?.value)}
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
                    </div>
                </div>

                {/* Actions */}
                <div className='col-span-12'>
                    <div className='flex flex-col lg:flex-row justify-between items-center'>
                        <div>
                            <button
                                className='ml-auto btn bg-meelike-dark text-white text-center shadow w-full hover:!bg-gray-300 hover:!text-black lg:w-auto cursor-pointer h-[38px]'
                                onClick={onCreate}
                            >
                                <IconPlusCircle className='w-4' />
                                <span className='pl-2'>เพิ่มบริการ</span>
                            </button>
                        </div>

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
                                            <button type='button' className='font-semibold text-left' onClick={() => onEnableAll()} disabled={isSubmitting}>
                                                <IconChecks className='w-4.5 h-4.5 mr-1' />
                                                <span>Enable All</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button type='button' className='font-semibold text-left' onClick={() => onDisableAll()} disabled={isSubmitting}>
                                                <IconXCircle className='w-4.5 h-4.5 mr-1' />
                                                <span>Disable All</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button type='button' className='font-semibold text-left' onClick={() => onDeleteAll()} disabled={isSubmitting}>
                                                <IconTrash className='w-4.5 h-4.5 mr-1' />
                                                <span>Delete</span>
                                            </button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>

                            <Link to={paths.services.orderingPosition}>
                                <button
                                    type='button'
                                    className={clsx('ml-auto btn bg-meelike-dark text-white text-center shadow w-full hover:!bg-gray-300 hover:!text-black lg:w-auto h-[38px]', {
                                        'cursor-not-allowed opacity-50': isSubmitting
                                    })}
                                    disabled={isSubmitting}
                                >
                                    <IconListCheck className='w-4' fill />
                                    <span className='pl-2'>จัดเรียงลำดับ</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='col-span-12'>
                    <div className='panel h-full p-0 overflow-hidden'>
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

export default ServicesListView;
