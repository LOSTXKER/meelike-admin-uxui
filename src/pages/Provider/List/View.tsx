import { type FC, Fragment } from 'react';

import IconSearch from '@/components/Icon/IconSearch';
import IconCoffee from '@/components/Icon/IconCoffee';
import { DataTable } from 'mantine-datatable';
import AdminManagementFormView from '../Form/View';

import useViewModel from './ViewModel';

const ProviderManagementView: FC = () => {
    const {
        isLoading,
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
        handleAfterSubmit
    } = useViewModel();

    return (
        <Fragment>
            <AdminManagementFormView isOpen={isOpenForm} handleClose={onCloseForm} formType={formType} selectedId={selectedId} handleAfterSubmit={handleAfterSubmit} />

            <div className='space-y-4'>
                {/* Header Section */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-semibold text-meelike-dark flex items-center gap-3'>
                            <span className='w-10 h-10 bg-meelike-dark/10 rounded-apple-sm flex items-center justify-center'>
                                <IconCoffee className='w-5 h-5 text-meelike-dark' />
                            </span>
                            จัดการผู้ให้บริการ
                        </h1>
                        <p className='text-meelike-dark-2 mt-1 text-sm'>
                            {totalData} ผู้ให้บริการ
                        </p>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <button
                            onClick={onCreate}
                            className='px-4 py-2.5 bg-meelike-primary text-meelike-dark rounded-apple text-sm font-medium hover:bg-meelike-primary/90 transition-colors'
                        >
                            + เพิ่มผู้ให้บริการ
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className='relative flex-1'>
                    <IconSearch className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10' />
                    <input
                        type='text'
                        placeholder='Search'
                        className='w-full pl-10 pr-4 py-2.5 rounded-apple border border-black/10 focus:outline-none focus:ring-2 focus:ring-meelike-primary/30 focus:border-meelike-primary bg-white'
                        value={filterState.search}
                        onChange={e => onChangeFilterState('search', e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                onChangeFilterState('search', filterState.search);
                            }
                        }}
                    />
                </div>

                {/* Table */}
                <div className='bg-white rounded-apple-lg border border-black/5 shadow-apple overflow-hidden'>
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
                        onPageChange={p => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={filterState.sortStatus}
                        onSortStatusChange={sortStatus => {
                            onChangeFilterState('sortStatus', sortStatus);
                        }}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `แสดงตั้งแต่ลำดับที่  ${from} ถึง ${to} จากทั้งหมด ${totalRecords}`}
                        paginationSize='xs'
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default ProviderManagementView;
