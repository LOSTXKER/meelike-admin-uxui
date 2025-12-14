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
import { IconServer, IconActivity } from '@tabler/icons-react';

const TIMEZONE = 'Asia/Bangkok';

interface SelectOption {
    value: string;
    label: string;
}

const ServiceReportView: React.FC = () => {
    const {
        serviceData,
        loading,
        columns,
        categoryOptions,
        providerOptions,
        statusOptions,
        dateRange,
        selectedCategories,
        selectedProviders,
        selectedStatus,
        setDateRange,
        setSelectedCategories,
        setSelectedProviders,
        setSelectedStatus,
    } = ViewModel();

    const filterDateRef = useRef<any>(null);

    // Calc summary
    const totalServices = serviceData.length;

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
                <h1 className="text-2xl font-bold text-gray-800">Service Report</h1>
                <p className="text-gray-500 text-sm">Performance of services.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <ReportStatCard
                    title="Total Services"
                    value={totalServices.toLocaleString()}
                    icon={<IconServer size={24} />}
                    color="primary"
                    className="h-full"
                />
                <ReportStatCard
                    title="Active Services (Mock)"
                    value={Math.floor(totalServices * 0.8).toLocaleString()}
                    icon={<IconActivity size={24} />}
                    color="success"
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
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                    <VirtualizedSelect<SelectOption, true>
                        isMulti
                        value={selectedCategories}
                        onChange={(option: any) => setSelectedCategories(Array.isArray(option) ? option : [...selectedCategories, option])}
                        options={categoryOptions}
                        classNamePrefix="select"
                        placeholder="Select Category..."
                        styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                    />
                </div>

                <div className="w-full md:w-auto min-w-[200px] flex-grow">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Provider</label>
                    <VirtualizedSelect<SelectOption, true>
                        isMulti
                        value={selectedProviders}
                        onChange={(option: any) => setSelectedProviders(Array.isArray(option) ? option : [...selectedProviders, option])}
                        options={providerOptions}
                        classNamePrefix="select"
                        placeholder="Select Provider..."
                        styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                    />
                </div>

                <div className="w-full md:w-auto min-w-[200px] flex-grow">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                    <VirtualizedSelect<SelectOption, false>
                        value={selectedStatus[0] || null}
                        onChange={(option: any) => setSelectedStatus(option ? [option] : [])}
                        options={statusOptions}
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
                                if (record.serviceName === 'TOTAL') {
                                    return 'bg-gray-100 font-bold text-primary hover:bg-gray-100';
                                }
                                return '';
                            }}
                            noRecordsText="No records found"
                            highlightOnHover
                            className="table-modern"
                            records={[
                                ...serviceData,
                                // Add Footer Row
                                {
                                    serviceId: '', // Blank ID
                                    serviceName: 'TOTAL',
                                    orderCount: serviceData.reduce((sum, item) => sum + (item.orderCount || 0), 0),
                                    charge: serviceData.reduce((sum, item) => sum + (item.charge || 0), 0),
                                    cost: serviceData.reduce((sum, item) => sum + (item.cost || 0), 0),
                                    profit: serviceData.reduce((sum, item) => sum + (item.profit || 0), 0),
                                    refunded: serviceData.reduce((sum, item) => sum + (item.refunded || 0), 0),
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
export default ServiceReportView;
