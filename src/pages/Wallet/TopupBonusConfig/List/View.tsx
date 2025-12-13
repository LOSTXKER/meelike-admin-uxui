import { type FC, Fragment } from 'react';

import IconSettings from '@/components/Icon/IconSettings';
import { DataTable } from 'mantine-datatable';
import TopupBonusConfigFormView from '../Form/View';

import useViewModel from './ViewModel';

const WalletTopupBonusConfigListView: FC = () => {
    const { isLoading, page, setPage, pageSize, setPageSize, PAGE_SIZES, totalData, data, columns, filterState, onChangeFilterState, isOpenForm, onCloseForm, handleAfterSubmit } = useViewModel();

    return (
        <Fragment>
            <TopupBonusConfigFormView isOpen={isOpenForm} handleClose={onCloseForm} handleAfterSubmit={handleAfterSubmit} />

            <div className='space-y-4'>
                {/* Header Section */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-semibold text-meelike-dark flex items-center gap-3'>
                            <span className='w-10 h-10 bg-meelike-dark/10 rounded-apple-sm flex items-center justify-center'>
                                <IconSettings className='w-5 h-5 text-meelike-dark' />
                            </span>
                            ตั้งค่าโบนัสเติมเงิน
                        </h1>
                        <p className='text-meelike-dark-2 mt-1 text-sm'>
                            {totalData.toLocaleString('th-TH')} รายการ
                        </p>
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

export default WalletTopupBonusConfigListView;
