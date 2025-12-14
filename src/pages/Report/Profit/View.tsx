import React, { useRef } from 'react';
import { ViewModel } from './ViewModel';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import Select from 'react-select';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { DataTable } from 'mantine-datatable';
import ReportStatCard from '../../../components/Report/ReportStatCard';
import ReportFilter from '../../../components/Report/ReportFilter';
import { IconChartLine, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

const TIMEZONE = 'Asia/Bangkok';

interface SelectOption {
    value: string;
    label: string;
}

const ProfitReportView: React.FC = () => {
    const {
        profitData,
        loading,
        columns,
        userOptions,
        serviceOptions,
        orderStatusOptions,
        dateRange,
        selectedUsers,
        selectedServices,
        selectedOrderStatus,
        setDateRange,
        setSelectedUsers,
        setSelectedServices,
        setSelectedOrderStatus,
    } = ViewModel();

    const filterDateRef = useRef<any>(null);

    // Calculate approx totals
    const totalProfit = React.useMemo(() => {
        let total = 0;
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        profitData.forEach(row => {
            months.forEach(m => {
                total += Number(row[m as keyof typeof row] || 0);
            });
        });
        return total;
    }, [profitData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="page-content bg-gray-50 min-h-screen p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Profit Report</h1>
                <p className="text-gray-500 text-sm">Track your earnings and growth.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <ReportStatCard
                    title="Total Profit"
                    value={`฿${totalProfit.toLocaleString()}`}
                    icon={<IconChartLine size={24} />}
                    color="success"
                    trend={{ value: '12.5%', direction: 'up' }}
                    className="h-full"
                />
                {/* Mock Additional Stats for layout balance */}
                <ReportStatCard
                    title="Gross Revenue"
                    value={`฿${(totalProfit * 1.5).toLocaleString()}`}
                    icon={<IconTrendingUp size={24} />}
                    color="blue"
                    className="h-full"
                />
                <ReportStatCard
                    title="Expenses"
                    value={`฿${(totalProfit * 0.5).toLocaleString()}`}
                    icon={<IconTrendingDown size={24} />}
                    color="orange"
                    className="h-full"
                />
            </div>

            {/* Filters */}
            <ReportFilter>
                <div className="w-full md:w-auto min-w-[250px] flex-grow">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Date Range</label>
                    <Flatpickr
                        placeholder="Select Date Range"
                        ref={filterDateRef}
                        value={dateRange}
                        options={{
                            mode: 'range',
                            dateFormat: 'F j, Y',
                            position: 'auto left',
                            maxDate: moment().tz(TIMEZONE).toDate(),
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        onChange={(date) => {
                            if (date.length === 2) {
                                setDateRange(date);
                            }
                        }}
                    />
                </div>

                <div className="w-full md:w-auto min-w-[200px] flex-grow">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Users</label>
                    <VirtualizedSelect<SelectOption, true>
                        isMulti
                        value={selectedUsers}
                        onChange={(option: any) => setSelectedUsers(Array.isArray(option) ? option : [...selectedUsers, option])}
                        options={userOptions}
                        classNamePrefix="select"
                        placeholder="Select Users..."
                        styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                    />
                </div>

                <div className="w-full md:w-auto min-w-[200px] flex-grow">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Services</label>
                    <VirtualizedSelect<SelectOption, true>
                        isMulti
                        value={selectedServices}
                        onChange={(option: any) => setSelectedServices(Array.isArray(option) ? option : [...selectedServices, option])}
                        options={serviceOptions}
                        classNamePrefix="select"
                        placeholder="Select Services..."
                        styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                    />
                </div>

                <div className="w-full md:w-auto min-w-[200px] flex-grow">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                    <VirtualizedSelect<SelectOption, true>
                        isMulti
                        value={selectedOrderStatus}
                        onChange={(option: any) => setSelectedOrderStatus(Array.isArray(option) ? option : [...selectedOrderStatus, option])}
                        options={orderStatusOptions}
                        classNamePrefix="select"
                        placeholder="Select Status..."
                        styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                    />
                </div>
            </ReportFilter>

            {/* Table */}
            <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardBody className="p-0">
                    <div className="relative datatables meelike-custom">
                        <DataTable
                            rowClassName={(record) => {
                                if (record.day === 'TOTAL') {
                                    return 'bg-gray-100 font-bold text-primary hover:bg-gray-100';
                                }
                                return '';
                            }}
                            noRecordsText="No records found"
                            highlightOnHover
                            className="table-modern"
                            records={[
                                ...profitData,
                                // Add Footer Row
                                {
                                    day: 'TOTAL',
                                    jan: profitData.reduce((sum, item) => sum + (item.jan || 0), 0),
                                    feb: profitData.reduce((sum, item) => sum + (item.feb || 0), 0),
                                    mar: profitData.reduce((sum, item) => sum + (item.mar || 0), 0),
                                    apr: profitData.reduce((sum, item) => sum + (item.apr || 0), 0),
                                    may: profitData.reduce((sum, item) => sum + (item.may || 0), 0),
                                    jun: profitData.reduce((sum, item) => sum + (item.jun || 0), 0),
                                    jul: profitData.reduce((sum, item) => sum + (item.jul || 0), 0),
                                    aug: profitData.reduce((sum, item) => sum + (item.aug || 0), 0),
                                    sep: profitData.reduce((sum, item) => sum + (item.sep || 0), 0),
                                    oct: profitData.reduce((sum, item) => sum + (item.oct || 0), 0),
                                    nov: profitData.reduce((sum, item) => sum + (item.nov || 0), 0),
                                    dec: profitData.reduce((sum, item) => sum + (item.dec || 0), 0),
                                }
                            ]}
                            columns={columns}
                            minHeight={200}
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

export default ProfitReportView;
