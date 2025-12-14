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
import { IconUsers, IconUserPlus } from '@tabler/icons-react';

const TIMEZONE = 'Asia/Bangkok';

interface SelectOption {
    value: string;
    label: string;
}

const UserReportView: React.FC = () => {
    const { userData, loading, columns, sourceOptions, dateRange, selectedSources, setDateRange, setSelectedSources } = ViewModel();

    const filterDateRef = useRef<any>(null);

    // Calc stats
    const totalUsers = userData.length;

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
                <h1 className="text-2xl font-bold text-gray-800">User Report</h1>
                <p className="text-gray-500 text-sm">User registration and activity.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <ReportStatCard
                    title="Total Users (View)"
                    value={totalUsers.toLocaleString()}
                    icon={<IconUsers size={24} />}
                    color="primary"
                    className="h-full"
                />
                <ReportStatCard
                    title="New Users This Month"
                    value={Math.floor(totalUsers * 0.1).toLocaleString()} // Mock derived stat
                    icon={<IconUserPlus size={24} />}
                    color="green"
                    trend={{ value: '5%', direction: 'up' }}
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
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Source</label>
                    <VirtualizedSelect<SelectOption, true>
                        isMulti
                        value={selectedSources}
                        onChange={(option: any) => setSelectedSources(Array.isArray(option) ? option : [...selectedSources, option])}
                        options={sourceOptions}
                        classNamePrefix="select"
                        placeholder="Select Source..."
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
                                if (record.name === 'TOTAL') {
                                    return 'bg-gray-100 font-bold text-primary hover:bg-gray-100';
                                }
                                return '';
                            }}
                            noRecordsText="No records found"
                            highlightOnHover
                            className="table-modern"
                            records={[
                                ...userData,
                                // Add Footer Row
                                {
                                    userId: -1, // Special ID for total row
                                    name: 'TOTAL',
                                    totalOrders: userData.reduce((sum, item) => sum + (item.totalOrders || 0), 0),
                                    totalSpent: userData.reduce((sum, item) => sum + (item.totalSpent || 0), 0),
                                    profit: userData.reduce((sum, item) => sum + (item.profit || 0), 0),
                                    lastOrderDate: '' // Empty for total
                                }
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
export default UserReportView;
