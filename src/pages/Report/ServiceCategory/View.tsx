import React, { useRef } from 'react';
import { ViewModel } from './ViewModel';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { DataTable } from 'mantine-datatable';
import ReportStatCard from '../../../components/Report/ReportStatCard';
import ReportFilter from '../../../components/Report/ReportFilter';
import { IconChartBar, IconShoppingBag } from '@tabler/icons-react';

const TIMEZONE = 'Asia/Bangkok';

interface SelectOption {
    value: string;
    label: string;
}

const ServiceCategoryReportView: React.FC = () => {
    const { activeButton, setActiveButton, serviceData, loading, columns, dateRange, setDateRange } = ViewModel();

    const filterDateRef = useRef<any>(null);

    // Sum for metrics
    const totalValue = React.useMemo(() => {
        // Mock sum loop since we don't know exact column names for pnl vs orders without checking viewmodel/data types deep
        // But for UI card value we can sum a 'value' if available or just count
        return serviceData.length;
    }, [serviceData]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className='page-content bg-gray-50 min-h-screen p-6'>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Service Category Report</h1>
                <p className="text-gray-500 text-sm">Category performance analysis.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <ReportStatCard
                    title="PnL Report"
                    value={activeButton === 'pnl' ? 'View' : '---'}
                    icon={<IconChartBar size={24} />}
                    color="primary"
                    isActive={activeButton === 'pnl'}
                    onClick={() => setActiveButton('pnl')}
                    className="h-full"
                />
                <ReportStatCard
                    title="Total Orders"
                    value={activeButton === 'order-amount' ? 'View' : '---'}
                    icon={<IconShoppingBag size={24} />}
                    color="warning"
                    isActive={activeButton === 'order-amount'}
                    onClick={() => setActiveButton('order-amount')}
                    className="h-full"
                />
            </div>

            {/* Filters */}
            <ReportFilter>
                <div className='w-full max-w-[300px]'>
                    <label className='text-sm font-medium text-gray-700 mb-1 block'>Date Range</label>
                    <Flatpickr
                        placeholder='Select Date Range'
                        ref={filterDateRef}
                        value={dateRange}
                        options={{
                            mode: 'range',
                            dateFormat: 'F j, Y',
                            position: 'auto left',
                            maxDate: moment().tz(TIMEZONE).toDate()
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        onChange={date => {
                            if (date.length === 2) {
                                setDateRange(date);
                            }
                        }}
                    />
                </div>
            </ReportFilter>

            {/* Table */}
            <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardBody className="p-0">
                    <div className='relative datatables meelike-custom'>
                        <DataTable
                            rowClassName={(record) => {
                                if (record.categoryName === 'TOTAL') {
                                    return 'bg-gray-100 font-bold text-primary hover:bg-gray-100';
                                }
                                return '';
                            }}
                            noRecordsText='No records found'
                            highlightOnHover
                            className='table-modern'
                            records={[
                                ...serviceData,
                                // Add Footer Row
                                (() => {
                                    const totalCost = serviceData.reduce((sum, item) => sum + (item.costTHB || 0), 0);
                                    const totalRevenue = serviceData.reduce((sum, item) => sum + (item.revenueTHB || 0), 0);
                                    const totalPnL = serviceData.reduce((sum, item) => sum + (item.pnlTHB || 0), 0);
                                    const totalOrders = serviceData.reduce((sum, item) => sum + (item.orderCount || 0), 0);

                                    // Calculate margin % for total: (Total PnL / Total Revenue) * 100
                                    const totalMarginPct = totalRevenue !== 0 ? (totalPnL / totalRevenue) * 100 : 0;

                                    return {
                                        categoryId: '', // Blank ID
                                        categoryName: 'TOTAL',
                                        costTHB: totalCost,
                                        revenueTHB: totalRevenue,
                                        pnlTHB: totalPnL,
                                        marginPct: totalMarginPct,
                                        orderCount: totalOrders
                                    };
                                })()
                            ] as any[]}
                            columns={columns}
                        />
                    </div>
                </CardBody>
            </Card>

            <style>{`
                 .table-modern thead tr th {
                    background-color: #f9fafb !important;
                    color: #6b7280 !important;
                    font-weight: 600 !important;
                    font-size: 0.875rem !important;
                    padding-top: 1rem !important;
                    padding-bottom: 1rem !important;
                    border-bottom: 1px solid #e5e7eb !important;
                }
                .table-modern tbody tr td {
                    padding-top: 1rem !important;
                    padding-bottom: 1rem !important;
                    color: #374151 !important;
                    font-size: 0.875rem !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                }
                .table-modern tbody tr:last-child td {
                    border-bottom: none !important;
                }
            `}</style>
        </div>
    );
};
export default ServiceCategoryReportView;
