import { type FC, Fragment } from 'react';

import IconSearch from '@/components/Icon/IconSearch';
import IconUsers from '@/components/Icon/IconUsers';
import { DataTable } from 'mantine-datatable';
import UserFormView from '../Form/View';

import useViewModel from './ViewModel';

const UsersListView: FC = () => {
    const {
        isLoading,
        PAGE_SIZES,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalData,
        data,
        columns,
        filterState,
        formType,
        selectedId,
        isOpenForm,
        onChangeFilterState,
        onCloseForm,
        onAfterSubmitForm
    } = useViewModel();

    return (
        <Fragment>
            <UserFormView isOpen={isOpenForm} handleClose={onCloseForm} formType={formType} selectedId={selectedId} handleAfterSubmit={onAfterSubmitForm} />

            <div className='space-y-6'>
                {/* Header Section */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-semibold text-meelike-dark flex items-center gap-3'>
                            <span className='w-10 h-10 bg-meelike-dark/10 rounded-apple-sm flex items-center justify-center'>
                                <IconUsers className='w-5 h-5 text-meelike-dark' />
                            </span>
                            ผู้ใช้งานทั้งหมด
                        </h1>
                        <p className='text-meelike-dark-2 mt-1 text-sm'>
                            {totalData.toLocaleString('th-TH')} รายการ
                        </p>
                    </div>
                </div>

                {/* Filters Panel */}
                <div className='panel !p-5 space-y-5'>
                    {/* Search */}
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <div className='flex-1 lg:max-w-md'>
                            <div className='relative'>
                                <input
                                    id='search'
                                    type='text'
                                    placeholder='ค้นหาด้วย ID, ชื่อ หรืออีเมล...'
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
                    </div>
                </div>

                {/* Table */}
                <div className='panel !p-0 overflow-hidden'>
                    <DataTable
                        fetching={isLoading}
                        noRecordsText='ไม่พบข้อมูล'
                        highlightOnHover
                        className='whitespace-nowrap'
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
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `แสดง ${from} ถึง ${to} จาก ${totalRecords} รายการ`}
                        paginationSize='sm'
                        styles={{
                            header: {
                                backgroundColor: 'rgba(253, 232, 189, 0.5)',
                                '&:hover': { backgroundColor: 'rgba(253, 232, 189, 0.7)' }
                            }
                        }}
                    />
                </div>
            </div>

            <style>{`
                /* DataTable Header */
                .mantine-datatable-header-cell {
                    background-color: rgba(253, 232, 189, 0.5) !important;
                    color: #473B30 !important;
                    font-weight: 600 !important;
                    font-size: 13px !important;
                }
                
                /* DataTable Rows */
                .mantine-datatable-row {
                    transition: background-color 0.15s ease;
                }
                .mantine-datatable-row:hover {
                    background-color: rgba(253, 232, 189, 0.2) !important;
                }
                
                /* Pagination */
                .mantine-Pagination-control[data-active="true"] {
                    background-color: #937058 !important;
                    color: #FFFFF5 !important;
                    border-color: #937058 !important;
                }
            `}</style>
        </Fragment>
    );
};

export default UsersListView;
