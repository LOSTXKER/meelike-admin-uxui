import React, { useRef } from 'react';
import { useOrderViewModel } from './ViewModel';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { DataTable } from 'mantine-datatable';
import Select from 'react-select';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import ReportStatCard from '../../../components/Report/ReportStatCard';
import ReportFilter from '../../../components/Report/ReportFilter';
import { IconCurrencyDollar, IconShoppingCart, IconPackage } from '@tabler/icons-react';

const TIMEZONE = 'Asia/Bangkok';

interface SelectOption {
    value: string;
    label: string;
}

const OrderReportView: React.FC = () => {
    const {
        orderData,
        loading,
        columns,
        userOptions,
        serviceOptions,
        orderStatusOptions,
        dateRange,
        selectedUsers,
        selectedServices,
        selectedOrderStatus,
        activeButton,
        setActiveButton,
        setDateRange,
        setSelectedUsers,
        setSelectedServices,
        setSelectedOrderStatus,
    } = useOrderViewModel();

    const filterDateRef = useRef<any>(null);

    // Calculate totals for summary cards from current data
    const calculateTotal = (key: string) => {
        return orderData.reduce((sum, item) => sum + (Number(item[key as keyof typeof item] || 0)), 0);
    };

    // Calculate sum of all months for each row, then sum those up
    // Actually per requirement, data has months cols. We can sum them up.
    // Simplifying for mock: just summing what we have or using logic.
    // The current mock data structure is per day.
    // Let's approximate based on displayed data or just show 0 for now if complex.
    // Actually, `orderData` has `day` and months.
    // We can just sum all numeric values across all months for the active metric?
    // Let's use simpler valid logic: The ViewModel toggles data based on `activeButton`.
    // So `orderData` cells contain the value for that metric.

    const grandTotal = React.useMemo(() => {
        let total = 0;
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        orderData.forEach(row => {
            months.forEach(m => {
                total += Number(row[m as keyof typeof row] || 0);
            });
        });
        return total;
    }, [orderData]);


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
                <h1 className="text-2xl font-bold text-gray-800">Order Report</h1>
                <p className="text-gray-500 text-sm">Overview of your order metrics.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <ReportStatCard
                    title="Total Amount"
                    value={activeButton === 'amount' ? grandTotal.toLocaleString() : '---'}
                    icon={<IconCurrencyDollar size={24} />}
                    color="blue"
                    isActive={activeButton === 'amount'}
                    onClick={() => setActiveButton('amount')}
                    className="h-full"
                />
                <ReportStatCard
                    title="Total Charge"
                    value={activeButton === 'charge' ? grandTotal.toLocaleString() : '---'}
                    icon={<IconShoppingCart size={24} />}
                    color="green"
                    isActive={activeButton === 'charge'}
                    onClick={() => setActiveButton('charge')}
                    className="h-full"
                />
                <ReportStatCard
                    title="Total Quantity"
                    value={activeButton === 'quantity' ? grandTotal.toLocaleString() : '---'}
                    icon={<IconPackage size={24} />}
                    color="purple"
                    isActive={activeButton === 'quantity'}
                    onClick={() => setActiveButton('quantity')}
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
                    <Select<SelectOption, true>
                        isMulti
                        value={selectedOrderStatus}
                        onChange={(options) => setSelectedOrderStatus([...options])}
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
                    <DataTable
                        noRecordsText="No records found"
                        highlightOnHover
                        className="table-modern"
                        records={[
                            ...orderData,
                            // Add Footer Row
                            {
                                day: 'TOTAL',
                                jan: orderData.reduce((sum, item) => sum + (item.jan || 0), 0),
                                feb: orderData.reduce((sum, item) => sum + (item.feb || 0), 0),
                                mar: orderData.reduce((sum, item) => sum + (item.mar || 0), 0),
                                apr: orderData.reduce((sum, item) => sum + (item.apr || 0), 0),
                                may: orderData.reduce((sum, item) => sum + (item.may || 0), 0),
                                jun: orderData.reduce((sum, item) => sum + (item.jun || 0), 0),
                                jul: orderData.reduce((sum, item) => sum + (item.jul || 0), 0),
                                aug: orderData.reduce((sum, item) => sum + (item.aug || 0), 0),
                                sep: orderData.reduce((sum, item) => sum + (item.sep || 0), 0),
                                oct: orderData.reduce((sum, item) => sum + (item.oct || 0), 0),
                                nov: orderData.reduce((sum, item) => sum + (item.nov || 0), 0),
                                dec: orderData.reduce((sum, item) => sum + (item.dec || 0), 0),
                            }
                        ]}
                        columns={columns}
                        minHeight={300}
                        rowClassName={(record) => {
                            if (record.day === 'TOTAL') {
                                return 'bg-gray-100 font-bold text-primary hover:bg-gray-100';
                            }
                            return '';
                        }}
                    // Styling through classes mostly, but DataTable specific props here
                    />
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

export default OrderReportView;
