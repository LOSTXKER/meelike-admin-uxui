import { type FC, Fragment } from 'react';

import IconPlusCircle from '@/components/Icon/IconPlusCircle';
import IconSearch from '@/components/Icon/IconSearch';
import { DataTable } from 'mantine-datatable';
import AdminManagementFormView from '../Form/View';

import useViewModel from './ViewModel';
import { clsx } from '@mantine/core';

const SeviceCategoryView: FC = () => {
    const {
        isLoading,
        isSubmitting,
        page,
        setPage,
        pageSize,
        setPageSize,
        filterState,
        onChangeFilterState,
        PAGE_SIZES,
        totalData,
        data,
        columns,
        formType,
        selectedId,
        isOpenForm,
        onCreate,
        onCloseForm,
        handleAfterSubmit,
        onSubmitFilter,
        onChangeSortStatus
    } = useViewModel();

    return (
        <Fragment>
            <AdminManagementFormView isOpen={isOpenForm} handleClose={onCloseForm} formType={formType} selectedId={selectedId} handleAfterSubmit={handleAfterSubmit} />

            {/* Header */}

            <div className='grid grid-cols-12 gap-4'>
                {/* Actions */}
                <div className='col-span-12'>
                    <div className='flex flex-col lg:flex-row justify-between items-center'>
                        <div>
                            <button className='ml-auto btn bg-meelike-dark text-white text-center shadow w-full hover:!bg-gray-300 hover:!text-black lg:w-auto cursor-pointer h-[38px]' onClick={onCreate}>
                                <IconPlusCircle className='w-4' />
                                <span className='pl-2'>เพิ่มหมวดหมู่บริการ</span>
                            </button>
                        </div>

                        <div className='flex flex-row gap-3 items-center'>
                            <div className='relative text-white-dark'>
                                <input
                                    id='search'
                                    type='text'
                                    placeholder={'ค้นหา'}
                                    className={'form-input ps-10 placeholder:text-gray-400 h-[38px]'}
                                    autoComplete='off'
                                    name='email'
                                    value={filterState.search}
                                    onChange={e => onChangeFilterState('search', e.target.value)}
                                />
                                <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                                    <IconSearch fill={true} />
                                </span>
                            </div>
                            {/* <button
                                className={clsx('ml-auto btn bg-meelike-dark text-white text-center shadow hover:opacity-60 w-auto h-[38px]', {
                                    'cursor-not-allowed opacity-50': isSubmitting
                                })}
                                disabled={isSubmitting}
                                onClick={() => {
                                    onSubmitFilter();
                                }}
                            >
                                <IconSearch className='w-4 text-white' fill />
                            </button> */}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='col-span-12'>
                    <div className='panel h-full p-0 overflow-hidden'>
                        <div className='relative datatables meelike-custom'>
                            <DataTable
                                fetching={isLoading}
                                rowClassName=''
                                noRecordsText='ไม่พบข้อมูล'
                                highlightOnHover
                                className='whitespace-nowrap table-hover'
                                records={data}
                                columns={columns}
                                totalRecords={totalData}
                                recordsPerPage={pageSize}
                                page={page}
                                onPageChange={setPage}
                                recordsPerPageOptions={PAGE_SIZES}
                                onRecordsPerPageChange={setPageSize}
                                sortStatus={filterState.sortStatus}
                                onSortStatusChange={onChangeSortStatus}
                                minHeight={200}
                                paginationText={({ from, to, totalRecords }) => `แสดงตั้งแต่ลำดับที่ ${from} ถึง ${to} จากทั้งหมด ${totalRecords}`}
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

export default SeviceCategoryView;
